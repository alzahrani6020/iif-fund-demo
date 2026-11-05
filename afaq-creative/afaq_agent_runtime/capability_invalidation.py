"""Capability invalidation workflow (in-memory).

Tracks invalidation requests through their lifecycle states and, on
DEGRADED/INVALIDATED, downgrades the capability maturity by one
conservative step. Maturity regression through normal paths remains
blocked; degradation is intentionally isolated here.
"""

from __future__ import annotations

from dataclasses import dataclass, replace
from datetime import datetime, timezone
from enum import Enum
from typing import Mapping

from .capability_contracts import CapabilityMaturity
from .capability_registry import CapabilityRegistry


class InvalidationState(str, Enum):
    REQUESTED = "REQUESTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    DEGRADED = "DEGRADED"
    INVALIDATED = "INVALIDATED"
    REMEDIATING = "REMEDIATING"
    REVALIDATION_REQUIRED = "REVALIDATION_REQUIRED"
    CLOSED = "CLOSED"


@dataclass(frozen=True, slots=True)
class CapabilityInvalidationRecord:
    invalidation_id: str
    capability_id: str
    state: InvalidationState
    reason: str
    created_at: datetime
    updated_at: datetime
    evidence_refs: tuple[str, ...]
    previous_maturity: CapabilityMaturity
    metadata: Mapping[str, object]

    def __post_init__(self) -> None:
        if not self.invalidation_id.strip():
            raise ValueError("invalidation_id is required")

        if not self.capability_id.strip():
            raise ValueError("capability_id is required")

        if not self.reason.strip():
            raise ValueError("invalidation reason is required")

        if not self.evidence_refs:
            raise ValueError("invalidation evidence is required")

        if self.created_at.tzinfo is None:
            raise ValueError("created_at must be timezone-aware")

        if self.updated_at.tzinfo is None:
            raise ValueError("updated_at must be timezone-aware")


_ALLOWED_TRANSITIONS = {
    InvalidationState.REQUESTED: {
        InvalidationState.UNDER_REVIEW,
    },
    InvalidationState.UNDER_REVIEW: {
        InvalidationState.DEGRADED,
        InvalidationState.INVALIDATED,
        InvalidationState.CLOSED,
    },
    InvalidationState.DEGRADED: {
        InvalidationState.REMEDIATING,
        InvalidationState.INVALIDATED,
    },
    InvalidationState.INVALIDATED: {
        InvalidationState.REMEDIATING,
    },
    InvalidationState.REMEDIATING: {
        InvalidationState.REVALIDATION_REQUIRED,
    },
    InvalidationState.REVALIDATION_REQUIRED: {
        InvalidationState.CLOSED,
    },
    InvalidationState.CLOSED: set(),
}


class CapabilityInvalidationWorkflow:
    def __init__(self, registry: CapabilityRegistry) -> None:
        self.registry = registry
        self._records: dict[str, CapabilityInvalidationRecord] = {}

    def request(
        self,
        *,
        invalidation_id: str,
        capability_id: str,
        reason: str,
        evidence_refs: tuple[str, ...],
        metadata: Mapping[str, object] | None = None,
    ) -> CapabilityInvalidationRecord:
        if invalidation_id in self._records:
            raise ValueError("invalidation already exists")

        capability = self.registry.get(capability_id)

        now = datetime.now(timezone.utc)

        record = CapabilityInvalidationRecord(
            invalidation_id=invalidation_id,
            capability_id=capability_id,
            state=InvalidationState.REQUESTED,
            reason=reason,
            created_at=now,
            updated_at=now,
            evidence_refs=evidence_refs,
            previous_maturity=capability.maturity,
            metadata=metadata or {},
        )

        self._records[invalidation_id] = record

        return record

    def get(self, invalidation_id: str) -> CapabilityInvalidationRecord:
        try:
            return self._records[invalidation_id]
        except KeyError:
            raise KeyError(invalidation_id) from None

    def transition(
        self, invalidation_id: str, new_state: InvalidationState
    ) -> CapabilityInvalidationRecord:
        current = self.get(invalidation_id)

        if new_state not in _ALLOWED_TRANSITIONS[current.state]:
            raise ValueError(
                "invalid invalidation transition: "
                f"{current.state.value} -> {new_state.value}"
            )

        updated = CapabilityInvalidationRecord(
            invalidation_id=current.invalidation_id,
            capability_id=current.capability_id,
            state=new_state,
            reason=current.reason,
            created_at=current.created_at,
            updated_at=datetime.now(timezone.utc),
            evidence_refs=current.evidence_refs,
            previous_maturity=current.previous_maturity,
            metadata=current.metadata,
        )

        self._records[invalidation_id] = updated

        return updated

    def apply_degradation(self, invalidation_id: str) -> None:
        record = self.get(invalidation_id)

        if record.state not in {
            InvalidationState.DEGRADED,
            InvalidationState.INVALIDATED,
        }:
            raise ValueError(
                "degradation requires DEGRADED or INVALIDATED state"
            )

        capability = self.registry.get(record.capability_id)

        # Conservative rule: any invalidated capability falls one step.
        target = capability.maturity

        if capability.maturity is CapabilityMaturity.PRODUCTION_READY:
            target = CapabilityMaturity.VALIDATED

        if capability.maturity is CapabilityMaturity.VALIDATED:
            target = CapabilityMaturity.TESTED

        if capability.maturity is CapabilityMaturity.TESTED:
            target = CapabilityMaturity.IMPLEMENTED

        if capability.maturity is CapabilityMaturity.IMPLEMENTED:
            target = CapabilityMaturity.DESIGNED

        if target is capability.maturity:
            return

        # Direct downgrade is intentionally isolated here.
        current = self.registry.get(record.capability_id)

        self.registry._records[record.capability_id] = replace(
            current,
            maturity=target,
            production_ready=False,
        )

    def requires_revalidation(self, invalidation_id: str) -> bool:
        record = self.get(invalidation_id)

        return record.state in {
            InvalidationState.INVALIDATED,
            InvalidationState.REMEDIATING,
            InvalidationState.REVALIDATION_REQUIRED,
        }
