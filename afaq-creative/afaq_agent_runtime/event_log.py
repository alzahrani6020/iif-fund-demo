"""Append-only event log for agent runtime tasks (stdlib sqlite3, WAL).

Events are never updated or deleted; the table only grows. This is the
execution trail the Control Center surfaces and the basis for resume/
checkpoint decisions.
"""

from __future__ import annotations

import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from threading import RLock

EVENT_TYPES = (
    "task_received",
    "task_started",
    "intent_classified",
    "task_override",
    "plan_created",
    "model_selected",
    "model_used",
    "tool_called",
    "evaluation_completed",
    "reflection_completed",
    "lesson_created",
    "lesson_rejected",
    "task_completed",
    "task_failed",
    "task_interrupted",
    "task_resumed",
    "approval_required",
    "approval_granted",
    "approval_rejected",
    "approval_cancelled",
    "policy_denied",
    # developer agent (v2)
    "repository_mapped",
    "change_proposed",
    "checkpoint_created",
    "file_modified",
    "tests_started",
    "tests_failed",
    "diagnosis_completed",
    "fix_attempted",
    "fix_noop_dropped",
    "tests_passed",
    "rollback_completed",
    "development_task_completed",
    # fast-first escalation (final closure round)
    "fast_first_accepted",
    "model_escalated",
    # read-only analysis path (intent gate ANALYSIS)
    "analysis_started",
    "files_read",
)

_SCHEMA = """
CREATE TABLE IF NOT EXISTS events (
    seq INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS events_task_idx ON events (task_id, seq);
"""


class EventLog:
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

    def append(self, task_id: str, event_type: str, payload: dict | None = None) -> int:
        if event_type not in EVENT_TYPES:
            raise ValueError(f"unknown event type: {event_type}")
        with self._lock:
            cursor = self._conn.execute(
                "INSERT INTO events (task_id, event_type, payload, created_at)"
                " VALUES (?,?,?,?)",
                (
                    task_id,
                    event_type,
                    json.dumps(payload or {}, ensure_ascii=False),
                    datetime.now(timezone.utc).isoformat(),
                ),
            )
        return cursor.lastrowid

    def list(self, task_id: str | None = None, limit: int = 500) -> list[dict]:
        with self._lock:
            if task_id is None:
                rows = self._conn.execute(
                    "SELECT seq, task_id, event_type, payload, created_at"
                    " FROM events ORDER BY seq DESC LIMIT ?",
                    (limit,),
                ).fetchall()
            else:
                rows = self._conn.execute(
                    "SELECT seq, task_id, event_type, payload, created_at"
                    " FROM events WHERE task_id = ? ORDER BY seq DESC LIMIT ?",
                    (task_id, limit),
                ).fetchall()
        return [
            {
                "seq": r[0],
                "task_id": r[1],
                "event_type": r[2],
                "payload": json.loads(r[3]),
                "created_at": r[4],
            }
            for r in reversed(rows)
        ]
