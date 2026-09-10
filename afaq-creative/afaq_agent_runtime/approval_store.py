"""Persistent approval queue (governance hardening).

Approvals are first-class, durable records — not a transient task status.
Every approval carries the full request context, a deterministic risk level,
the permission decision, a hash of the proposal it authorizes, an optional
expiry, and the human decision (actor + reason + timestamp).

An approval authorizes exactly one proposal: at execution time the agent
re-hashes the current proposal and refuses to reuse a token whose proposal
changed (the stale approval is cancelled and a fresh one is required).
"""

from __future__ import annotations

import hashlib
import json
import sqlite3
from datetime import datetime, timedelta, timezone
from pathlib import Path
from threading import RLock
from uuid import uuid4

DEFAULT_TTL_SECONDS = 24 * 3600
TERMINAL_STATUSES = ("approved", "rejected", "expired", "cancelled")

_SCHEMA = """
CREATE TABLE IF NOT EXISTS approvals (
    approval_id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    project TEXT NOT NULL,
    environment TEXT NOT NULL,
    action_type TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    requested_changes TEXT NOT NULL,
    affected_files TEXT NOT NULL,
    proposed_tests TEXT NOT NULL,
    reason TEXT,
    permission_decision TEXT,
    proposal_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    approved_by TEXT,
    rejected_by TEXT,
    decision_at TEXT,
    decision_reason TEXT
);
CREATE INDEX IF NOT EXISTS approvals_task_idx ON approvals (task_id, created_at);
CREATE INDEX IF NOT EXISTS approvals_status_idx ON approvals (status, created_at);
"""


def _utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


def proposal_hash(proposal) -> str:
    canonical = json.dumps(proposal, ensure_ascii=False, sort_keys=True)
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


class ApprovalStore:
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
    def create(
        self,
        *,
        task_id: str,
        agent_id: str,
        project: str,
        environment: str,
        action_type: str,
        risk_level: str,
        requested_changes,
        affected_files,
        proposed_tests,
        reason: str = "",
        permission_decision=None,
        proposal=None,
        ttl_seconds: int = DEFAULT_TTL_SECONDS,
    ) -> dict:
        approval_id = f"APR-{uuid4()}"
        created = datetime.now(timezone.utc)
        expires = created + timedelta(seconds=ttl_seconds)
        record = {
            "approval_id": approval_id,
            "task_id": task_id,
            "agent_id": agent_id,
            "project": project,
            "environment": environment,
            "action_type": action_type,
            "risk_level": risk_level,
            "requested_changes": requested_changes,
            "affected_files": affected_files,
            "proposed_tests": proposed_tests,
            "reason": reason,
            "permission_decision": permission_decision,
            "proposal_hash": proposal_hash(proposal),
            "created_at": created.isoformat(),
            "expires_at": expires.isoformat(),
            "status": "pending",
            "approved_by": None,
            "rejected_by": None,
            "decision_at": None,
            "decision_reason": None,
        }
        with self._lock:
            self._conn.execute(
                "INSERT INTO approvals (approval_id, task_id, agent_id, project, environment,"
                " action_type, risk_level, requested_changes, affected_files, proposed_tests,"
                " reason, permission_decision, proposal_hash, created_at, expires_at, status)"
                " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                (
                    record["approval_id"], record["task_id"], record["agent_id"],
                    record["project"], record["environment"], record["action_type"],
                    record["risk_level"],
                    json.dumps(requested_changes, ensure_ascii=False),
                    json.dumps(affected_files, ensure_ascii=False),
                    json.dumps(proposed_tests, ensure_ascii=False),
                    record["reason"],
                    json.dumps(permission_decision, ensure_ascii=False) if permission_decision else None,
                    record["proposal_hash"], record["created_at"], record["expires_at"],
                    record["status"],
                ),
            )
        return record

    def get(self, approval_id: str) -> dict | None:
        with self._lock:
            row = self._conn.execute(
                "SELECT * FROM approvals WHERE approval_id = ?", (approval_id,)
            ).fetchone()
        return self._row_to_dict(row) if row else None

    def list(self, status: str | None = None, limit: int = 100) -> list[dict]:
        with self._lock:
            if status:
                rows = self._conn.execute(
                    "SELECT * FROM approvals WHERE status = ? ORDER BY created_at DESC LIMIT ?",
                    (status, limit),
                ).fetchall()
            else:
                rows = self._conn.execute(
                    "SELECT * FROM approvals ORDER BY created_at DESC LIMIT ?", (limit,)
                ).fetchall()
        return [self._row_to_dict(r) for r in rows]

    def pending_for_task(self, task_id: str) -> list[dict]:
        with self._lock:
            rows = self._conn.execute(
                "SELECT * FROM approvals WHERE task_id = ? AND status = 'pending'"
                " ORDER BY created_at DESC", (task_id,)
            ).fetchall()
        return [self._row_to_dict(r) for r in rows]

    def for_task(self, task_id: str) -> list[dict]:
        """All approvals for a task, newest first (any status)."""
        with self._lock:
            rows = self._conn.execute(
                "SELECT * FROM approvals WHERE task_id = ? ORDER BY created_at DESC", (task_id,)
            ).fetchall()
        return [self._row_to_dict(r) for r in rows]

    # ------------------------------------------------------------------
    def _is_expired(self, record: dict) -> bool:
        if not record.get("expires_at"):
            return False
        try:
            expiry = datetime.fromisoformat(record["expires_at"])
        except ValueError:
            return False
        return datetime.now(timezone.utc) >= expiry

    def _mark(self, approval_id: str, expected: tuple[str, ...], **fields) -> dict:
        allowed = {
            "status", "approved_by", "rejected_by", "decision_at", "decision_reason",
        }
        unknown = set(fields) - allowed
        if unknown:
            raise ValueError(f"unknown approval fields: {sorted(unknown)}")
        with self._lock:
            self._conn.execute("BEGIN IMMEDIATE")
            try:
                row = self._conn.execute(
                    "SELECT status FROM approvals WHERE approval_id = ?", (approval_id,)
                ).fetchone()
                if row is None:
                    raise KeyError(f"approval not found: {approval_id}")
                if expected and row[0] not in expected:
                    raise RuntimeError(
                        f"approval {approval_id} in status {row[0]}, expected one of {expected}"
                    )
                if fields:
                    assignments = ", ".join(f"{k} = ?" for k in fields)
                    self._conn.execute(
                        f"UPDATE approvals SET {assignments} WHERE approval_id = ?",
                        (*fields.values(), approval_id),
                    )
                self._conn.execute("COMMIT")
            except Exception:
                self._conn.execute("ROLLBACK")
                raise
        return self.get(approval_id)

    def decide(self, approval_id: str, *, decision: str, actor: str,
               reason: str = "") -> dict:
        """Human decision. Enforces pending status and expiry."""
        record = self.get(approval_id)
        if record is None:
            raise KeyError(f"approval not found: {approval_id}")
        if record["status"] != "pending":
            raise RuntimeError(f"approval {approval_id} already {record['status']}")
        if self._is_expired(record):
            return self._mark(
                approval_id, ("pending",), status="expired",
                decision_at=_utcnow(),
                decision_reason=f"expired before decision; original request: {reason}",
            )
        if decision == "approve":
            return self._mark(
                approval_id, ("pending",), status="approved",
                approved_by=actor, decision_at=_utcnow(), decision_reason=reason or None,
            )
        if decision == "reject":
            return self._mark(
                approval_id, ("pending",), status="rejected",
                rejected_by=actor, decision_at=_utcnow(), decision_reason=reason or None,
            )
        raise ValueError(f"unknown decision: {decision}")

    def cancel_for_task(self, task_id: str, reason: str) -> int:
        with self._lock:
            cursor = self._conn.execute(
                "UPDATE approvals SET status = 'cancelled', decision_reason = ?, decision_at = ?"
                " WHERE task_id = ? AND status = 'pending'",
                (reason, _utcnow(), task_id),
            )
        return cursor.rowcount

    def authorize_execution(self, approval_id: str, current_proposal) -> dict:
        """Validate an approved request right before execution.

        Refuses expired approvals and proposal drift: if the proposal hash
        differs from what was approved, the approval is cancelled and a fresh
        approval is required. Returns the approval record on success.
        """
        record = self.get(approval_id)
        if record is None:
            raise KeyError(f"approval not found: {approval_id}")
        if record["status"] == "pending":
            raise RuntimeError(f"approval {approval_id} is still pending")
        if record["status"] == "expired":
            raise RuntimeError(f"approval {approval_id} has expired; request a new approval")
        if record["status"] == "approved" and self._is_expired(record):
            self._mark(approval_id, ("approved",), status="expired",
                       decision_reason="expired before execution")
            raise RuntimeError(f"approval {approval_id} has expired; request a new approval")
        if record["status"] != "approved":
            raise RuntimeError(f"approval {approval_id} is {record['status']}")
        current_hash = proposal_hash(current_proposal)
        if current_hash != record["proposal_hash"]:
            self._mark(
                approval_id, ("approved",),
                status="cancelled",
                decision_reason="proposal changed after approval; approval invalidated",
            )
            raise RuntimeError(
                "proposal changed after approval; the previous approval was cancelled "
                "and a fresh approval is required"
            )
        return record

    # ------------------------------------------------------------------
    @staticmethod
    def _row_to_dict(row: tuple) -> dict:
        keys = (
            "approval_id", "task_id", "agent_id", "project", "environment",
            "action_type", "risk_level", "requested_changes", "affected_files",
            "proposed_tests", "reason", "permission_decision", "proposal_hash",
            "created_at", "expires_at", "status", "approved_by", "rejected_by",
            "decision_at", "decision_reason",
        )
        record = dict(zip(keys, row))
        for field in ("requested_changes", "affected_files", "proposed_tests", "permission_decision"):
            if record.get(field):
                record[field] = json.loads(record[field])
        return record
