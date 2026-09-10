"""Persistent task store for the agent runtime (stdlib sqlite3, WAL).

One row per task; state transitions are applied with compare-and-swap so a
stale writer cannot silently overwrite a newer state (used by checkpoint/
resume across process restarts).
"""

from __future__ import annotations

import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from threading import RLock
from uuid import uuid4

TERMINAL_STATES = ("completed", "failed", "awaiting_approval")

_SCHEMA = """
CREATE TABLE IF NOT EXISTS tasks (
    task_id TEXT PRIMARY KEY,
    instruction TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    project_id TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    environment TEXT NOT NULL,
    state TEXT NOT NULL,
    plan TEXT,
    progress TEXT,
    selected_model TEXT,
    result TEXT,
    error TEXT,
    memory_ids TEXT,
    created_at TEXT NOT NULL,
    started_at TEXT,
    finished_at TEXT
);
"""


def _utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


class TaskStore:
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

    # ------------------------------------------------------------------
    # CRUD
    # ------------------------------------------------------------------
    def create(
        self,
        *,
        instruction: str,
        tenant_id: str,
        project_id: str,
        agent_id: str,
        environment: str,
    ) -> str:
        task_id = f"TASK-{uuid4()}"
        with self._lock:
            self._conn.execute(
                "INSERT INTO tasks (task_id, instruction, tenant_id, project_id,"
                " agent_id, environment, state, created_at)"
                " VALUES (?,?,?,?,?,?,?,?)",
                (
                    task_id,
                    instruction,
                    tenant_id,
                    project_id,
                    agent_id,
                    environment,
                    "received",
                    _utcnow(),
                ),
            )
        return task_id

    def get(self, task_id: str) -> dict | None:
        with self._lock:
            row = self._conn.execute(
                "SELECT * FROM tasks WHERE task_id = ?", (task_id,)
            ).fetchone()
        if row is None:
            return None
        return self._row_to_dict(row)

    def list(self, limit: int = 100) -> list[dict]:
        with self._lock:
            rows = self._conn.execute(
                "SELECT * FROM tasks ORDER BY created_at DESC LIMIT ?", (limit,)
            ).fetchall()
        return [self._row_to_dict(r) for r in rows]

    def update(self, task_id: str, expected_states: tuple[str, ...], **fields) -> dict:
        """CAS update: applies only when the current state is expected."""
        allowed = {
            "state", "plan", "progress", "selected_model", "result",
            "error", "memory_ids", "started_at", "finished_at",
        }
        unknown = set(fields) - allowed
        if unknown:
            raise ValueError(f"unknown task fields: {sorted(unknown)}")
        json_fields = {"plan", "progress", "result", "memory_ids"}
        for key in json_fields & set(fields):
            if fields[key] is not None and not isinstance(fields[key], str):
                fields[key] = json.dumps(fields[key], ensure_ascii=False)
        with self._lock:
            self._conn.execute("BEGIN IMMEDIATE")
            try:
                row = self._conn.execute(
                    "SELECT state FROM tasks WHERE task_id = ?", (task_id,)
                ).fetchone()
                if row is None:
                    raise KeyError(f"task not found: {task_id}")
                if expected_states and row[0] not in expected_states:
                    raise RuntimeError(
                        f"task {task_id} in state {row[0]}, expected one of {expected_states}"
                    )
                if fields:
                    assignments = ", ".join(f"{k} = ?" for k in fields)
                    self._conn.execute(
                        f"UPDATE tasks SET {assignments} WHERE task_id = ?",
                        (*fields.values(), task_id),
                    )
                self._conn.execute("COMMIT")
            except Exception:
                self._conn.execute("ROLLBACK")
                raise
        return self.get(task_id)

    def interrupted_tasks(self) -> list[dict]:
        """Tasks left in a non-terminal running state by a previous process."""
        with self._lock:
            rows = self._conn.execute(
                "SELECT * FROM tasks WHERE state IN ('received','planning','running')"
                " AND finished_at IS NULL ORDER BY created_at"
            ).fetchall()
        return [self._row_to_dict(r) for r in rows]

    def awaiting_approval(self) -> list[dict]:
        with self._lock:
            rows = self._conn.execute(
                "SELECT * FROM tasks WHERE state = 'awaiting_approval'"
                " ORDER BY created_at"
            ).fetchall()
        return [self._row_to_dict(r) for r in rows]

    # ------------------------------------------------------------------
    # Serialization
    # ------------------------------------------------------------------
    @staticmethod
    def _row_to_dict(row: tuple) -> dict:
        keys = (
            "task_id", "instruction", "tenant_id", "project_id", "agent_id",
            "environment", "state", "plan", "progress", "selected_model",
            "result", "error", "memory_ids", "created_at", "started_at",
            "finished_at",
        )
        record = dict(zip(keys, row))
        for json_field in ("plan", "progress", "result", "memory_ids"):
            if record.get(json_field):
                record[json_field] = json.loads(record[json_field])
        return record
