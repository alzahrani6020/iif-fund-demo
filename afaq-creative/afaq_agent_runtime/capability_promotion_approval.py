"""Promotion approval records.

A promotion approval binds an approver identity, decision, scope,
reason, and evidence to a candidate. Approval requires evidence and an
explicit scope; expiry is enforced by is_active.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from enum import Enum
from typing import Mapping


class PromotionDecision(str, Enum):
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    REVOKED = "REVOKED"


@dataclass(frozen=True, slots=True)
class PromotionApprovalRecord:
    approval_id: str
    candidate_id: str
    decision: PromotionDecision
    approver_identity: str
    approved_at: datetime
    reason: str
    scope: str
    evidence_refs: tuple[str, ...]
    constraints: tuple[str, ...] = ()
    expires_at: datetime | None = None
    metadata: Mapping[str, object] | None = None

    def __post_init__(self) -> None:
        if not self.approval_id.strip():
            raise ValueError("approval_id is required")

        if not self.candidate_id.strip():
            raise ValueError("candidate_id is required")

        if not self.approver_identity.strip():
            raise ValueError("approver_identity is required")

        if not self.reason.strip():
            raise ValueError("approval reason is required")

        if not self.scope.strip():
            raise ValueError("approval scope is required")

        if self.approved_at.tzinfo is None:
            raise ValueError("approved_at must be timezone-aware")

        if self.expires_at is not None and self.expires_at.tzinfo is None:
            raise ValueError("expires_at must be timezone-aware")

        if self.expires_at is not None and self.expires_at <= self.approved_at:
            raise ValueError("expires_at must be after approved_at")

        if self.decision is PromotionDecision.APPROVED and not self.evidence_refs:
            raise ValueError("approved promotion requires evidence")

    def is_active(self, *, now: datetime | None = None) -> bool:
        if self.decision is not PromotionDecision.APPROVED:
            return False

        current = now or datetime.now(timezone.utc)

        if current.tzinfo is None:
            raise ValueError("now must be timezone-aware")

        if self.expires_at is not None and current >= self.expires_at:
            return False

        return True
