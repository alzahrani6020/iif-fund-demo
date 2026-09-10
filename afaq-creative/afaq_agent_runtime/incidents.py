"""Persistent incident store + deterministic incident classification (Self-Healing v1).

An Incident is a *significant* failure record — not every exception becomes one.
Detection (see self_healing.DetectionEngine) applies thresholds and deduplication
before creating incidents. Incidents survive restarts, link to tasks/audit/memory,
and carry the full repair lifecycle state.

Classification is deterministic (no LLM): the pair (source, error text) decides
the class. `policy_denial` is explicitly NOT healable — self-healing never
attempts to bypass an environment/policy denial.
"""

from __future__ import annotations

import hashlib
import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from threading import RLock
from uuid import uuid4

INCIDENT_STATUSES = (
    "open",                  # detected, not yet diagnosed
    "diagnosing",            # root-cause analysis persisted
    "repair_pending_approval",  # repair task awaiting a human decision
    "repairing",             # approved, executing
    "repair_failed",         # a repair attempt failed; retries may remain
    "needs_human",           # retry limit reached or unhealable class
    "resolved",              # repaired + validated + health rechecked
    "no_action",             # classified as not requiring repair (e.g. policy_denial)
)

CLASSIFICATIONS = (
    "development_failure",
    "runtime_failure",
    "model_failure",
    "tool_failure",
    "configuration_failure",
    "dependency_failure",
    "data_integrity_failure",
    "policy_denial",
    "unknown",
)

SEVERITY_LEVELS = ("low", "medium", "high", "critical")

# Base severity per classification (recurrence escalates).
_CLASS_SEVERITY = {
    "development_failure": "low",
    "runtime_failure": "medium",
    "model_failure": "medium",
    "tool_failure": "medium",
    "configuration_failure": "high",
    "dependency_failure": "high",
    "data_integrity_failure": "critical",
    "policy_denial": "low",
    "unknown": "medium",
}

# Classes self-healing v1 is allowed to attempt repairs for.
HEALABLE_CLASSES = frozenset({
    "development_failure",
    "runtime_failure",
    "configuration_failure",
    "dependency_failure",
})

_COLUMNS = (
    "incident_id", "source", "environment", "severity", "classification",
    "signature", "status", "recurrence_count", "evidence", "related_task_ids",
    "related_events", "root_cause", "repair_proposal", "proposal_hash",
    "repair_task_id", "repair_attempts", "max_repair_attempts", "resolution",
    "detected_at", "updated_at", "counted_failure_task",
)
_SELECT_COLS = ", ".join(_COLUMNS)

_SCHEMA = """
CREATE TABLE IF NOT EXISTS incidents (
    incident_id TEXT PRIMARY KEY,
    source TEXT NOT NULL,
    environment TEXT NOT NULL DEFAULT 'dev',
    severity TEXT NOT NULL,
    classification TEXT NOT NULL,
    signature TEXT NOT NULL,
    status TEXT NOT NULL,
    recurrence_count INTEGER NOT NULL DEFAULT 1,
    evidence TEXT,
    related_task_ids TEXT,
    related_events TEXT,
    root_cause TEXT,
    repair_proposal TEXT,
    proposal_hash TEXT,
    repair_task_id TEXT,
    repair_attempts INTEGER NOT NULL DEFAULT 0,
    max_repair_attempts INTEGER NOT NULL DEFAULT 2,
    resolution TEXT,
    detected_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    counted_failure_task TEXT
);
"""

# Columns added after the initial release; applied idempotently.
_MIGRATIONS = (
    "ALTER TABLE incidents ADD COLUMN counted_failure_task TEXT",
)


def _utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


def classify_failure(source: str, error_text: str = "") -> str:
    """Map (source, error) to a deterministic incident classification."""
    text = (error_text or "").lower()
    if "policy_denial" in text or "denied by environment policy" in text:
        return "policy_denial"
    if source in ("model_timeout", "model_failure") or "timed out" in text or "timeout" in text:
        return "model_failure"
    if source.startswith("tool"):
        return "tool_failure"
    if source == "db_health":
        return "data_integrity_failure"
    if source == "service_health":
        return "dependency_failure"
    if source == "developer_task":
        if "development_test_failure" in text:
            return "development_failure"
        if "runtime_failure" in text:
            return "runtime_failure"
        if "policy_denial" in text:
            return "policy_denial"
        return "development_failure"
    if any(k in text for k in ("importerror", "modulenotfounderror", "connectionrefused", "cannot find module")):
        return "dependency_failure"
    if any(k in text for k in ("config", "missing key", "invalid setting", "environment variable")):
        return "configuration_failure"
    return "unknown"


def base_severity(classification: str) -> str:
    return _CLASS_SEVERITY.get(classification, "medium")


def escalate_severity(severity: str, recurrence_count: int) -> str:
    """Recurrence escalates severity one step per threshold of 3."""
    idx = SEVERITY_LEVELS.index(severity) if severity in SEVERITY_LEVELS else 1
    bumps = max(0, recurrence_count - 1) // 3
    return SEVERITY_LEVELS[min(idx + bumps, len(SEVERITY_LEVELS) - 1)]


def incident_signature(source: str, classification: str, key: str) -> str:
    """Stable dedup key: same source+class+normalized key = same incident."""
    normalized = " ".join((key or "").lower().split())[:300]
    digest = hashlib.sha256(f"{source}|{classification}|{normalized}".encode()).hexdigest()
    return f"SIG-{digest[:24]}"


class IncidentStore:
    """Durable incident records (same runtime db, separate table)."""

    def __init__(self, path: str | Path) -> None:
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(
            str(path), check_same_thread=False, isolation_level=None
        )
        self._conn.execute("PRAGMA journal_mode=WAL")
        self._conn.executescript(_SCHEMA)
        existing = {row[1] for row in self._conn.execute("PRAGMA table_info(incidents)")}
        for statement in _MIGRATIONS:
            column = statement.split("ADD COLUMN ")[1].split(" ")[0]
            if column not in existing:
                self._conn.execute(statement)
        self._lock = RLock()

    def close(self) -> None:
        self._conn.close()

    def create(
        self,
        *,
        source: str,
        environment: str = "dev",
        classification: str,
        signature: str,
        evidence=None,
        related_task_ids=None,
        related_events=None,
        severity: str | None = None,
        status: str = "open",
        max_repair_attempts: int = 2,
    ) -> dict:
        now = _utcnow()
        record = {
            "incident_id": f"INC-{uuid4()}",
            "source": source,
            "environment": environment,
            "severity": severity or base_severity(classification),
            "classification": classification,
            "signature": signature,
            "status": status,
            "recurrence_count": 1,
            "evidence": list(evidence or []),
            "related_task_ids": list(related_task_ids or []),
            "related_events": list(related_events or []),
            "root_cause": None,
            "repair_proposal": None,
            "proposal_hash": None,
            "repair_task_id": None,
            "repair_attempts": 0,
            "max_repair_attempts": max_repair_attempts,
            "resolution": None,
            "counted_failure_task": None,
            "detected_at": now,
            "updated_at": now,
        }
        with self._lock:
            self._conn.execute(
                f"INSERT INTO incidents ({_SELECT_COLS}) VALUES ({','.join('?' * len(_COLUMNS))})",
                tuple(self._to_row(record)),
            )
        return record

    def get(self, incident_id: str) -> dict | None:
        with self._lock:
            row = self._conn.execute(
                f"SELECT {_SELECT_COLS} FROM incidents WHERE incident_id = ?",
                (incident_id,),
            ).fetchone()
        return self._row_to_dict(row) if row else None

    def list(self, status: str | None = None, classification: str | None = None,
             limit: int = 100) -> list[dict]:
        sql = f"SELECT {_SELECT_COLS} FROM incidents"
        clauses, params = [], []
        if status:
            clauses.append("status = ?")
            params.append(status)
        if classification:
            clauses.append("classification = ?")
            params.append(classification)
        if clauses:
            sql += " WHERE " + " AND ".join(clauses)
        sql += " ORDER BY detected_at DESC LIMIT ?"
        params.append(limit)
        with self._lock:
            rows = self._conn.execute(sql, tuple(params)).fetchall()
        return [self._row_to_dict(r) for r in rows]

    def open_by_signature(self, signature: str, exclude_id: str | None = None) -> list[dict]:
        sql = f"SELECT {_SELECT_COLS} FROM incidents WHERE signature = ?" \
              " AND status NOT IN ('resolved','no_action','needs_human')"
        params: list = [signature]
        if exclude_id:
            sql += " AND incident_id != ?"
            params.append(exclude_id)
        with self._lock:
            rows = self._conn.execute(sql, tuple(params)).fetchall()
        return [self._row_to_dict(r) for r in rows]

    def by_signature(self, signature: str, exclude_id: str | None = None) -> list[dict]:
        """All incidents with this signature, any status (dedup history)."""
        sql = f"SELECT {_SELECT_COLS} FROM incidents WHERE signature = ?"
        params: list = [signature]
        if exclude_id:
            sql += " AND incident_id != ?"
            params.append(exclude_id)
        sql += " ORDER BY detected_at DESC"
        with self._lock:
            rows = self._conn.execute(sql, tuple(params)).fetchall()
        return [self._row_to_dict(r) for r in rows]

    def similar(self, classification: str, exclude_id: str | None = None,
                limit: int = 5) -> list[dict]:
        sql = f"SELECT {_SELECT_COLS} FROM incidents WHERE classification = ?"
        params: list = [classification]
        if exclude_id:
            sql += " AND incident_id != ?"
            params.append(exclude_id)
        sql += " ORDER BY detected_at DESC LIMIT ?"
        params.append(limit)
        with self._lock:
            rows = self._conn.execute(sql, tuple(params)).fetchall()
        return [self._row_to_dict(r) for r in rows]

    def update(self, incident_id: str, expected_statuses: tuple[str, ...] = (), **fields) -> dict:
        allowed = {
            "status", "severity", "recurrence_count", "evidence", "related_task_ids",
            "related_events", "root_cause", "repair_proposal", "proposal_hash",
            "repair_task_id", "repair_attempts", "resolution", "counted_failure_task",
        }
        unknown = set(fields) - allowed
        if unknown:
            raise ValueError(f"unknown incident fields: {sorted(unknown)}")
        json_fields = {"evidence", "related_task_ids", "related_events",
                       "root_cause", "repair_proposal", "resolution"}
        for key in json_fields & set(fields):
            if fields[key] is not None and not isinstance(fields[key], str):
                fields[key] = json.dumps(fields[key], ensure_ascii=False)
        with self._lock:
            self._conn.execute("BEGIN IMMEDIATE")
            try:
                row = self._conn.execute(
                    "SELECT status FROM incidents WHERE incident_id = ?", (incident_id,)
                ).fetchone()
                if row is None:
                    raise KeyError(f"incident not found: {incident_id}")
                if expected_statuses and row[0] not in expected_statuses:
                    raise RuntimeError(
                        f"incident {incident_id} in status {row[0]}, expected one of {expected_statuses}"
                    )
                fields["updated_at"] = _utcnow()
                assignments = ", ".join(f"{k} = ?" for k in fields)
                self._conn.execute(
                    f"UPDATE incidents SET {assignments} WHERE incident_id = ?",
                    (*fields.values(), incident_id),
                )
                self._conn.execute("COMMIT")
            except Exception:
                self._conn.execute("ROLLBACK")
                raise
        return self.get(incident_id)

    # -- helpers ----------------------------------------------------------
    @staticmethod
    def _to_row(record: dict) -> list:
        row = []
        for col in _COLUMNS:
            value = record.get(col)
            if col in ("evidence", "related_task_ids", "related_events",
                       "root_cause", "repair_proposal", "resolution") and value is not None:
                if not isinstance(value, str):
                    value = json.dumps(value, ensure_ascii=False)
            row.append(value)
        return row

    @staticmethod
    def _row_to_dict(row: tuple) -> dict:
        record = dict(zip(_COLUMNS, row))
        for field in ("evidence", "related_task_ids", "related_events",
                      "root_cause", "repair_proposal", "resolution"):
            if record.get(field):
                record[field] = json.loads(record[field])
        return record
