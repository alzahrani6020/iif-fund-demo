"""Persistent store for Developer Agent tasks (separate table, same runtime db)."""

from __future__ import annotations

import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from threading import RLock
from uuid import uuid4

DEV_TERMINAL_STATES = ("completed", "failed", "rejected",
                       "no_action", "clarification_required", "answered")

# Canonical logical column order (NOT the physical order — migrations append
# columns at the end of existing tables, so every SELECT must name columns
# explicitly and _row_to_dict must match this list).
_COLUMNS = (
    "task_id", "instruction", "project_root", "state", "repo_map",
    "proposal", "fix_attempts", "diff", "result", "error",
    "memory_ids", "environment", "actor", "risk_level",
    "created_at", "started_at", "finished_at",
)
_SELECT_COLS = ", ".join(_COLUMNS)

_SCHEMA = """
CREATE TABLE IF NOT EXISTS dev_tasks (
    task_id TEXT PRIMARY KEY,
    instruction TEXT NOT NULL,
    project_root TEXT NOT NULL,
    state TEXT NOT NULL,
    repo_map TEXT,
    proposal TEXT,
    fix_attempts INTEGER NOT NULL DEFAULT 0,
    diff TEXT,
    result TEXT,
    error TEXT,
    memory_ids TEXT,
    environment TEXT NOT NULL DEFAULT 'dev',
    actor TEXT,
    risk_level TEXT,
    created_at TEXT NOT NULL,
    started_at TEXT,
    finished_at TEXT
);
"""

# Columns added after the initial release; applied idempotently to existing DBs.
_MIGRATIONS = (
    "ALTER TABLE dev_tasks ADD COLUMN environment TEXT NOT NULL DEFAULT 'dev'",
    "ALTER TABLE dev_tasks ADD COLUMN actor TEXT",
    "ALTER TABLE dev_tasks ADD COLUMN risk_level TEXT",
)


def _utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


class DevTaskStore:
    def __init__(self, path: str | Path) -> None:
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(
            str(path), check_same_thread=False, isolation_level=None
        )
        self._conn.execute("PRAGMA journal_mode=WAL")
        self._conn.executescript(_SCHEMA)
        existing = {row[1] for row in self._conn.execute("PRAGMA table_info(dev_tasks)")}
        for statement in _MIGRATIONS:
            column = statement.split("ADD COLUMN ")[1].split(" ")[0]
            if column not in existing:
                self._conn.execute(statement)
        self._lock = RLock()

    def close(self) -> None:
        self._conn.close()

    def create(self, *, instruction: str, project_root: str,
               environment: str = "dev", actor: str = "system") -> str:
        task_id = f"DEV-{uuid4()}"
        with self._lock:
            self._conn.execute(
                "INSERT INTO dev_tasks (task_id, instruction, project_root, state, environment,"
                " actor, created_at) VALUES (?,?,?,?,?,?,?)",
                (task_id, instruction, project_root, "received", environment, actor, _utcnow()),
            )
        return task_id

    def get(self, task_id: str) -> dict | None:
        with self._lock:
            row = self._conn.execute(
                f"SELECT {_SELECT_COLS} FROM dev_tasks WHERE task_id = ?", (task_id,)
            ).fetchone()
        return self._row_to_dict(row) if row else None

    def list(self, limit: int = 100) -> list[dict]:
        with self._lock:
            rows = self._conn.execute(
                f"SELECT {_SELECT_COLS} FROM dev_tasks ORDER BY created_at DESC LIMIT ?", (limit,)
            ).fetchall()
        return [self._row_to_dict(r) for r in rows]

    def update(self, task_id: str, expected_states: tuple[str, ...], **fields) -> dict:
        allowed = {
            "state", "repo_map", "proposal", "fix_attempts", "diff",
            "result", "error", "memory_ids", "started_at", "finished_at",
            "risk_level",
        }
        unknown = set(fields) - allowed
        if unknown:
            raise ValueError(f"unknown dev task fields: {sorted(unknown)}")
        json_fields = {"repo_map", "proposal", "diff", "result", "memory_ids"}
        for key in json_fields & set(fields):
            if fields[key] is not None and not isinstance(fields[key], str):
                fields[key] = json.dumps(fields[key], ensure_ascii=False)
        with self._lock:
            self._conn.execute("BEGIN IMMEDIATE")
            try:
                row = self._conn.execute(
                    "SELECT state FROM dev_tasks WHERE task_id = ?", (task_id,)
                ).fetchone()
                if row is None:
                    raise KeyError(f"dev task not found: {task_id}")
                if expected_states and row[0] not in expected_states:
                    raise RuntimeError(
                        f"dev task {task_id} in state {row[0]}, expected one of {expected_states}"
                    )
                if fields:
                    assignments = ", ".join(f"{k} = ?" for k in fields)
                    self._conn.execute(
                        f"UPDATE dev_tasks SET {assignments} WHERE task_id = ?",
                        (*fields.values(), task_id),
                    )
                self._conn.execute("COMMIT")
            except Exception:
                self._conn.execute("ROLLBACK")
                raise
        return self.get(task_id)

    def interrupted_tasks(self) -> list[dict]:
        with self._lock:
            rows = self._conn.execute(
                f"SELECT {_SELECT_COLS} FROM dev_tasks"
                " WHERE state IN ('received','mapping','proposing','executing','approved')"
                " AND finished_at IS NULL ORDER BY created_at"
            ).fetchall()
        return [self._row_to_dict(r) for r in rows]

    @staticmethod
    def _row_to_dict(row: tuple) -> dict:
        record = dict(zip(_COLUMNS, row))
        for json_field in ("repo_map", "proposal", "diff", "result", "memory_ids"):
            if record.get(json_field):
                record[json_field] = json.loads(record[json_field])
        return record
