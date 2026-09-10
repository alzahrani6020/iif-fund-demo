from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Mapping
from uuid import uuid4


class MemoryType(str, Enum):
    EXPERIENCE = "EXPERIENCE"
    LESSON = "LESSON"
    KNOWLEDGE = "KNOWLEDGE"
    DECISION = "DECISION"
    FAILURE = "FAILURE"


class MemoryState(str, Enum):
    ACTIVE = "ACTIVE"
    SUPERSEDED = "SUPERSEDED"
    INVALIDATED = "INVALIDATED"


class MemoryAction(str, Enum):
    """Governed lifecycle actions recorded in the append-only audit trail."""

    CREATED = "CREATED"
    SUPERSEDED = "SUPERSEDED"
    INVALIDATED = "INVALIDATED"


class LessonValidationOutcome(str, Enum):
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"


@dataclass(frozen=True, slots=True)
class MemoryScope:
    """Isolation boundary for every memory.

    tenant/project/environment form the hard boundary; agent_id partitions
    agents inside the same project. Cross-boundary visibility is rejected by
    the retrieval and lesson-validation layers.
    """

    tenant_id: str
    project_id: str
    agent_id: str
    environment: str  # e.g. development | staging | production

    def __post_init__(self) -> None:
        for name, value in (
            ("tenant_id", self.tenant_id),
            ("project_id", self.project_id),
            ("agent_id", self.agent_id),
            ("environment", self.environment),
        ):
            if not value or not value.strip():
                raise ValueError(f"scope {name} is required")

    def same_boundary(self, other: MemoryScope) -> bool:
        """True when both scopes share tenant/project/environment.

        Agents inside one project may learn from each other, never across
        tenant, project, or environment boundaries.
        """
        return (
            self.tenant_id == other.tenant_id
            and self.project_id == other.project_id
            and self.environment == other.environment
        )


@dataclass(frozen=True, slots=True)
class MemoryEvidence:
    evidence_id: str
    source_ref: str
    confidence: float

    def __post_init__(self) -> None:
        if not self.evidence_id.strip():
            raise ValueError("evidence_id is required")
        if not self.source_ref.strip():
            raise ValueError("source_ref is required")
        if not 0.0 <= self.confidence <= 1.0:
            raise ValueError("confidence must be between 0.0 and 1.0")


@dataclass(frozen=True, slots=True)
class MemoryRecord:
    memory_id: str
    memory_type: MemoryType
    content: Mapping[str, Any]
    evidence: tuple[MemoryEvidence, ...]
    state: MemoryState
    created_at: datetime
    scope: MemoryScope
    supersedes: str | None = None
    invalidation_reason: str | None = None
    metadata: Mapping[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        if not self.memory_id.strip():
            raise ValueError("memory_id is required")

        if not self.content:
            raise ValueError("memory content is required")

        if not self.evidence:
            raise ValueError("memory evidence is required")

        if self.state is MemoryState.INVALIDATED and not self.invalidation_reason:
            raise ValueError(
                "invalidation_reason is required for invalidated memory"
            )

    @property
    def confidence(self) -> float:
        """Mean evidence confidence."""
        return sum(e.confidence for e in self.evidence) / len(self.evidence)


@dataclass(frozen=True, slots=True)
class MemoryAuditEvent:
    """Immutable audit trail entry.

    There is intentionally no update or delete path for audit events:
    supersede/invalidate never erase what happened before. ``seq`` is a
    store-assigned monotonic sequence (stronger than timestamps, which can
    collide within one microsecond); callers must not set it.
    """

    event_id: str
    occurred_at: datetime
    action: MemoryAction
    memory_id: str
    actor: str
    detail: str | None = None
    seq: int = 0

    def __post_init__(self) -> None:
        if not self.event_id.strip():
            raise ValueError("event_id is required")
        if not self.actor.strip():
            raise ValueError("actor is required")


@dataclass(frozen=True, slots=True)
class LessonValidationResult:
    outcome: LessonValidationOutcome
    reasons: tuple[str, ...] = ()

    @property
    def accepted(self) -> bool:
        return self.outcome is LessonValidationOutcome.ACCEPTED


def new_memory_record(
    *,
    memory_type: MemoryType,
    content: Mapping[str, Any],
    evidence: tuple[MemoryEvidence, ...],
    scope: MemoryScope,
    supersedes: str | None = None,
    metadata: Mapping[str, Any] | None = None,
) -> MemoryRecord:
    return MemoryRecord(
        memory_id=f"MEM-{uuid4()}",
        memory_type=memory_type,
        content=dict(content),
        evidence=tuple(evidence),
        state=MemoryState.ACTIVE,
        created_at=datetime.now(timezone.utc),
        scope=scope,
        supersedes=supersedes,
        metadata=dict(metadata or {}),
    )


def new_audit_event(
    *,
    action: MemoryAction,
    memory_id: str,
    actor: str,
    detail: str | None = None,
) -> MemoryAuditEvent:
    return MemoryAuditEvent(
        event_id=f"AUD-{uuid4()}",
        occurred_at=datetime.now(timezone.utc),
        action=action,
        memory_id=memory_id,
        actor=actor,
        detail=detail,
    )
