"""Governed capability invalidation.

Couples invalidation state transitions to the persistent append-only
invalidation ledger. Every governed request and transition is
persisted; a ledger persistence failure blocks governed completion and
rolls back the in-memory state; invalidation history is never silently
skipped.
"""

from __future__ import annotations

from .capability_invalidation import (
    CapabilityInvalidationRecord,
    CapabilityInvalidationWorkflow,
    InvalidationState,
)
from .capability_invalidation_ledger import InvalidationLedger


class GovernedCapabilityInvalidation:
    def __init__(
        self,
        *,
        workflow: CapabilityInvalidationWorkflow,
        ledger: InvalidationLedger,
    ) -> None:
        self.workflow = workflow
        self.ledger = ledger

    def request(
        self,
        *,
        invalidation_id: str,
        capability_id: str,
        reason: str,
        evidence_refs: tuple[str, ...],
        metadata=None,
    ) -> CapabilityInvalidationRecord:
        record = self.workflow.request(
            invalidation_id=invalidation_id,
            capability_id=capability_id,
            reason=reason,
            evidence_refs=evidence_refs,
            metadata=metadata,
        )

        try:
            self.ledger.append(record)
        except Exception:
            # Roll back the in-memory request if persistence fails.
            self.workflow._records.pop(invalidation_id, None)
            raise

        return record

    def transition(
        self, invalidation_id: str, new_state: InvalidationState
    ) -> CapabilityInvalidationRecord:
        before = self.workflow.get(invalidation_id)

        updated = self.workflow.transition(invalidation_id, new_state)

        try:
            self.ledger.append(updated)
        except Exception:
            # Restore previous in-memory state if ledger append fails.
            self.workflow._records[invalidation_id] = before
            raise

        return updated

    def apply_degradation(self, invalidation_id: str) -> None:
        self.workflow.apply_degradation(invalidation_id)

    def get(self, invalidation_id: str) -> CapabilityInvalidationRecord:
        return self.workflow.get(invalidation_id)
