"""SQLite persistence for the memory nucleus (stdlib only).

Ships with the component but is NOT wired into Afaq production. The
integration plan (schema ownership, migrations, backups) must be approved
before production use; see README.md.
"""

from __future__ import annotations

import json
import sqlite3
from datetime import datetime
from pathlib import Path

from .aic_memory_contracts import (
    MemoryAction,
    MemoryAuditEvent,
    MemoryEvidence,
    MemoryRecord,
    MemoryScope,
    MemoryState,
    MemoryType,
)
from .aic_memory_store import MemoryStore

_SCHEMA = """
CREATE TABLE IF NOT EXISTS memories (
    memory_id TEXT PRIMARY KEY,
    memory_type TEXT NOT NULL,
    state TEXT NOT NULL,
    content TEXT NOT NULL,
    evidence TEXT NOT NULL,
    metadata TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    project_id TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    environment TEXT NOT NULL,
    supersedes TEXT,
    invalidation_reason TEXT,
    created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS memories_scope_state_idx
    ON memories (tenant_id, project_id, environment, state);
CREATE INDEX IF NOT EXISTS memories_created_idx ON memories (created_at);

CREATE TABLE IF NOT EXISTS memory_audit (
    seq INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id TEXT NOT NULL UNIQUE,
    occurred_at TEXT NOT NULL,
    action TEXT NOT NULL,
    memory_id TEXT NOT NULL,
    actor TEXT NOT NULL,
    detail TEXT
);
CREATE INDEX IF NOT EXISTS memory_audit_memory_idx ON memory_audit (memory_id);
"""


class SqliteMemoryStore(MemoryStore):
    """MemoryStore backed by a SQLite file. Same semantics, durable history."""

    def __init__(self, path: str | Path) -> None:
        super().__init__()
        self._conn = sqlite3.connect(
            str(path), check_same_thread=False, isolation_level=None
        )
        self._conn.execute("PRAGMA journal_mode=WAL")
        self._conn.execute("PRAGMA foreign_keys=ON")
        self._conn.executescript(_SCHEMA)
        self._path = Path(path)

    def close(self) -> None:
        self._conn.close()

    # ------------------------------------------------------------------
    # Serialization helpers
    # ------------------------------------------------------------------
    @staticmethod
    def _record_to_row(record: MemoryRecord) -> tuple:
        return (
            record.memory_id,
            record.memory_type.value,
            record.state.value,
            json.dumps(dict(record.content), ensure_ascii=False),
            json.dumps(
                [
                    {
                        "evidence_id": e.evidence_id,
                        "source_ref": e.source_ref,
                        "confidence": e.confidence,
                    }
                    for e in record.evidence
                ],
                ensure_ascii=False,
            ),
            json.dumps(dict(record.metadata), ensure_ascii=False),
            record.scope.tenant_id,
            record.scope.project_id,
            record.scope.agent_id,
            record.scope.environment,
            record.supersedes,
            record.invalidation_reason,
            record.created_at.isoformat(),
        )

    @staticmethod
    def _row_to_record(row: tuple) -> MemoryRecord:
        (
            memory_id,
            memory_type,
            state,
            content,
            evidence,
            metadata,
            tenant_id,
            project_id,
            agent_id,
            environment,
            supersedes,
            invalidation_reason,
            created_at,
        ) = row
        return MemoryRecord(
            memory_id=memory_id,
            memory_type=MemoryType(memory_type),
            state=MemoryState(state),
            content=json.loads(content),
            evidence=tuple(
                MemoryEvidence(
                    evidence_id=e["evidence_id"],
                    source_ref=e["source_ref"],
                    confidence=float(e["confidence"]),
                )
                for e in json.loads(evidence)
            ),
            metadata=json.loads(metadata),
            scope=MemoryScope(
                tenant_id=tenant_id,
                project_id=project_id,
                agent_id=agent_id,
                environment=environment,
            ),
            supersedes=supersedes,
            invalidation_reason=invalidation_reason,
            created_at=datetime.fromisoformat(created_at),
        )

    # ------------------------------------------------------------------
    # Storage primitives (override)
    # ------------------------------------------------------------------
    def _put_record(self, record: MemoryRecord) -> None:
        self._conn.execute(
            "INSERT OR REPLACE INTO memories "
            "(memory_id, memory_type, state, content, evidence, metadata,"
            " tenant_id, project_id, agent_id, environment,"
            " supersedes, invalidation_reason, created_at)"
            " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
            self._record_to_row(record),
        )

    def _fetch_record(self, memory_id: str) -> MemoryRecord | None:
        row = self._conn.execute(
            "SELECT * FROM memories WHERE memory_id = ?", (memory_id,)
        ).fetchone()
        return self._row_to_record(row) if row else None

    def _fetch_all_records(self) -> list[MemoryRecord]:
        rows = self._conn.execute("SELECT * FROM memories").fetchall()
        return [self._row_to_record(r) for r in rows]

    def _append_audit_event(self, event: MemoryAuditEvent) -> None:
        cursor = self._conn.execute(
            "INSERT INTO memory_audit"
            " (event_id, occurred_at, action, memory_id, actor, detail)"
            " VALUES (?,?,?,?,?,?)",
            (
                event.event_id,
                event.occurred_at.isoformat(),
                event.action.value,
                event.memory_id,
                event.actor,
                event.detail,
            ),
        )
        # seq is assigned by AUTOINCREMENT; the in-memory copy is not retained.

    def _fetch_audit_events(
        self, memory_id: str | None = None
    ) -> list[MemoryAuditEvent]:
        if memory_id is None:
            rows = self._conn.execute(
                "SELECT seq, event_id, occurred_at, action, memory_id, actor, detail"
                " FROM memory_audit ORDER BY seq"
            ).fetchall()
        else:
            rows = self._conn.execute(
                "SELECT seq, event_id, occurred_at, action, memory_id, actor, detail"
                " FROM memory_audit WHERE memory_id = ? ORDER BY seq",
                (memory_id,),
            ).fetchall()
        return [
            MemoryAuditEvent(
                seq=r[0],
                event_id=r[1],
                occurred_at=datetime.fromisoformat(r[2]),
                action=MemoryAction(r[3]),
                memory_id=r[4],
                actor=r[5],
                detail=r[6],
            )
            for r in rows
        ]

    # ------------------------------------------------------------------
    # Filter override — push predicates into SQL.
    # ------------------------------------------------------------------
    def filter_records(
        self,
        *,
        scope: object | None = None,
        memory_type: object | None = None,
        state: MemoryState | None = None,
        created_after: datetime | None = None,
        created_before: datetime | None = None,
    ) -> tuple[MemoryRecord, ...]:
        sql = "SELECT * FROM memories WHERE 1=1"
        params: list = []
        if scope is not None:
            sql += (
                " AND tenant_id = ? AND project_id = ?"
                " AND agent_id = ? AND environment = ?"
            )
            params += [
                getattr(scope, "tenant_id", None),
                getattr(scope, "project_id", None),
                getattr(scope, "agent_id", None),
                getattr(scope, "environment", None),
            ]
        if memory_type is not None:
            sql += " AND memory_type = ?"
            params.append(getattr(memory_type, "value", memory_type))
        if state is not None:
            sql += " AND state = ?"
            params.append(state.value)
        if created_after is not None:
            sql += " AND created_at >= ?"
            params.append(created_after.isoformat())
        if created_before is not None:
            sql += " AND created_at <= ?"
            params.append(created_before.isoformat())

        with self._lock:
            rows = self._conn.execute(sql, params).fetchall()
        return tuple(self._row_to_record(r) for r in rows)

    # ------------------------------------------------------------------
    # Compound atomicity: BEGIN IMMEDIATE around check-and-write.
    # ------------------------------------------------------------------
    def add(self, record: MemoryRecord, *, actor: str = "system") -> MemoryRecord:
        with self._lock:
            self._conn.execute("BEGIN IMMEDIATE")
            try:
                result = super().add(record, actor=actor)
            except Exception:
                self._conn.execute("ROLLBACK")
                raise
            else:
                self._conn.execute("COMMIT")
                return result

    def transition(self, *args, **kwargs) -> MemoryRecord:
        with self._lock:
            self._conn.execute("BEGIN IMMEDIATE")
            try:
                result = super().transition(*args, **kwargs)
            except Exception:
                self._conn.execute("ROLLBACK")
                raise
            else:
                self._conn.execute("COMMIT")
                return result
