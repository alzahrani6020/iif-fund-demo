from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any
import uuid


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass
class ExecutionEnvelope:
    execution_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    request_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    parent_execution_id: str | None = None
    action: str = ""
    side_effect: str = "UNKNOWN"
    status: str = "PENDING"
    started_at: str = field(default_factory=_utc_now)
    finished_at: str | None = None
    evidence: list[dict[str, Any]] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)

    def child(self, action: str, *, side_effect: str = "UNKNOWN") -> "ExecutionEnvelope":
        return ExecutionEnvelope(
            request_id=self.request_id,
            parent_execution_id=self.execution_id,
            action=action,
            side_effect=side_effect,
        )

    def finish(self, status: str) -> None:
        self.status = status
        self.finished_at = _utc_now()
