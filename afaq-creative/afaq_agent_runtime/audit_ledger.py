"""Append-only audit ledger (governance hardening).

A dedicated SQLite database, separate from task events, recording every
governance-relevant fact: who created a task, which agent ran it, what was
planned, which model and tools were used, approval requests and decisions,
files changed, tests run, rollbacks, final outcomes, and memory ids.

The ledger only grows. There is intentionally no update or delete API —
invalidation is expressed by appending a newer record, never by rewriting
history.
"""

from __future__ import annotations

import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from threading import RLock

_SCHEMA = """
CREATE TABLE IF NOT EXISTS audit_ledger (
    seq INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id TEXT,
    approval_id TEXT,
    actor TEXT,
    agent_id TEXT,
    environment TEXT,
    action TEXT NOT NULL,
    detail TEXT NOT NULL,
    created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS audit_task_idx ON audit_ledger (task_id, seq);
CREATE INDEX IF NOT EXISTS audit_action_idx ON audit_ledger (action, seq);
"""


class AuditLedger:
    def __init__(self, path: str | Path) -> None:
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(
            str(path), check_same_thread=False, isolation_level=None
        )
        self._conn.execute("PRAGMA journal_mode=WAL")
        self._conn.executescript(_SCHEMA)
        self._lock = RLock()

    def close(self) -> None:
        self._conn.close()

    def record(
        self,
        action: str,
        *,
        detail: dict | None = None,
        task_id: str | None = None,
        approval_id: str | None = None,
        actor: str = "system",
        agent_id: str | None = None,
        environment: str | None = None,
    ) -> int:
        """Append one immutable record. This is the only mutation."""
        if not action or not action.strip():
            raise ValueError("audit action is required")
        with self._lock:
            cursor = self._conn.execute(
                "INSERT INTO audit_ledger (task_id, approval_id, actor, agent_id, environment,"
                " action, detail, created_at) VALUES (?,?,?,?,?,?,?,?)",
                (
                    task_id, approval_id, actor, agent_id, environment, action,
                    json.dumps(detail or {}, ensure_ascii=False),
                    datetime.now(timezone.utc).isoformat(),
                ),
            )
        return cursor.lastrowid

    def list(self, task_id: str | None = None, limit: int = 200) -> list[dict]:
        with self._lock:
            if task_id:
                rows = self._conn.execute(
                    "SELECT seq, task_id, approval_id, actor, agent_id, environment, action,"
                    " detail, created_at FROM audit_ledger WHERE task_id = ?"
                    " ORDER BY seq DESC LIMIT ?",
                    (task_id, limit),
                ).fetchall()
            else:
                rows = self._conn.execute(
                    "SELECT seq, task_id, approval_id, actor, agent_id, environment, action,"
                    " detail, created_at FROM audit_ledger ORDER BY seq DESC LIMIT ?",
                    (limit,),
                ).fetchall()
        return [
            {
                "seq": r[0], "task_id": r[1], "approval_id": r[2], "actor": r[3],
                "agent_id": r[4], "environment": r[5], "action": r[6],
                "detail": json.loads(r[7]), "created_at": r[8],
            }
            for r in reversed(rows)
        ]

    def count(self) -> int:
        with self._lock:
            row = self._conn.execute("SELECT COUNT(*) FROM audit_ledger").fetchone()
        return int(row[0])

    def health(self) -> dict:
        try:
            with self._lock:
                row = self._conn.execute("PRAGMA quick_check").fetchone()
            return {"ok": bool(row and row[0] == "ok"), "check": row[0] if row else None}
        except Exception as exc:  # noqa: BLE001 - health probe must report, not crash
            return {"ok": False, "error": f"{type(exc).__name__}: {exc}"}
