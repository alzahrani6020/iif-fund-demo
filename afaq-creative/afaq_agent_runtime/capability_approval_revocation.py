"""Approval revocation registry (in-memory).

Immutable revocation registry for the approval lifecycle. Revocation
is explicit (actor, time, reason, identity); one approval may have at
most one effective revocation; identical revocation is idempotent and
conflicting revocation fails closed. A revoked approval cannot become
active again here, and revocation never deletes the original approval
or grants trust, maturity, authority, authorization, or production
readiness. Persistence is deliberately outside this registry.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from enum import Enum
from threading import RLock
from typing import Any, Mapping


class ApprovalRevocationError(ValueError):
    """Base error for approval revocation."""


class ApprovalRevocationConflictError(ApprovalRevocationError):
    """A conflicting revocation operation was attempted."""


class ApprovalLifecycleState(str, Enum):
    ACTIVE = "ACTIVE"
    REVOKED = "REVOKED"


@dataclass(frozen=True, slots=True)
class ApprovalRevocationRecord:
    revocation_id: str
    approval_id: str
    candidate_id: str
    revoked_by: str
    revoked_at: str
    reason: str
    evidence_refs: tuple[str, ...] = ()
    metadata: Mapping[str, Any] | None = None

    def __post_init__(self) -> None:
        required = (
            ("revocation_id", self.revocation_id),
            ("approval_id", self.approval_id),
            ("candidate_id", self.candidate_id),
            ("revoked_by", self.revoked_by),
            ("revoked_at", self.revoked_at),
            ("reason", self.reason),
        )

        for name, value in required:
            if not isinstance(value, str) or not value.strip():
                raise ApprovalRevocationError(f"{name} is required")

        if not isinstance(self.evidence_refs, tuple):
            raise ApprovalRevocationError("evidence_refs must be tuple")


@dataclass(frozen=True, slots=True)
class ApprovalLifecycleView:
    approval_id: str
    candidate_id: str
    state: ApprovalLifecycleState
    revocation: ApprovalRevocationRecord | None

    @property
    def active(self) -> bool:
        return self.state is ApprovalLifecycleState.ACTIVE

    @property
    def revoked(self) -> bool:
        return self.state is ApprovalLifecycleState.REVOKED


class ApprovalRevocationRegistry:
    def __init__(self) -> None:
        self._lock = RLock()
        self._records_by_approval: dict[str, ApprovalRevocationRecord] = {}
        self._approval_candidates: dict[str, str] = {}

    @staticmethod
    def _normalize_refs(refs: tuple[str, ...]) -> tuple[str, ...]:
        return tuple(
            dict.fromkeys(
                value.strip()
                for value in refs
                if isinstance(value, str) and value.strip()
            )
        )

    @classmethod
    def _normalize_record(
        cls, record: ApprovalRevocationRecord
    ) -> ApprovalRevocationRecord:
        return ApprovalRevocationRecord(
            revocation_id=record.revocation_id.strip(),
            approval_id=record.approval_id.strip(),
            candidate_id=record.candidate_id.strip(),
            revoked_by=record.revoked_by.strip(),
            revoked_at=record.revoked_at.strip(),
            reason=record.reason.strip(),
            evidence_refs=cls._normalize_refs(record.evidence_refs),
            metadata=dict(record.metadata or {}),
        )

    def register_active_approval(
        self, *, approval_id: str, candidate_id: str
    ) -> ApprovalLifecycleView:
        if not isinstance(approval_id, str) or not approval_id.strip():
            raise ApprovalRevocationError("approval_id is required")

        if not isinstance(candidate_id, str) or not candidate_id.strip():
            raise ApprovalRevocationError("candidate_id is required")

        approval_id = approval_id.strip()
        candidate_id = candidate_id.strip()

        with self._lock:
            existing_candidate = self._approval_candidates.get(approval_id)

            if existing_candidate is not None and existing_candidate != candidate_id:
                raise ApprovalRevocationConflictError(
                    "approval_id is already bound to another candidate"
                )

            self._approval_candidates[approval_id] = candidate_id

            revocation = self._records_by_approval.get(approval_id)

            if revocation is not None:
                return ApprovalLifecycleView(
                    approval_id=approval_id,
                    candidate_id=candidate_id,
                    state=ApprovalLifecycleState.REVOKED,
                    revocation=revocation,
                )

            return ApprovalLifecycleView(
                approval_id=approval_id,
                candidate_id=candidate_id,
                state=ApprovalLifecycleState.ACTIVE,
                revocation=None,
            )

    def revoke(self, record: ApprovalRevocationRecord) -> ApprovalRevocationRecord:
        if not isinstance(record, ApprovalRevocationRecord):
            raise ApprovalRevocationError("record must be ApprovalRevocationRecord")

        normalized = self._normalize_record(record)

        with self._lock:
            bound_candidate = self._approval_candidates.get(normalized.approval_id)

            if bound_candidate is None:
                raise ApprovalRevocationError("approval is not registered")

            if bound_candidate != normalized.candidate_id:
                raise ApprovalRevocationConflictError(
                    "candidate_id does not match registered approval"
                )

            existing = self._records_by_approval.get(normalized.approval_id)

            if existing is not None:
                if existing == normalized:
                    return existing

                raise ApprovalRevocationConflictError(
                    "approval is already revoked with different revocation data"
                )

            for item in self._records_by_approval.values():
                if item.revocation_id == normalized.revocation_id:
                    raise ApprovalRevocationConflictError(
                        "revocation_id is already used"
                    )

            self._records_by_approval[normalized.approval_id] = normalized

            return normalized

    def revoke_now(
        self,
        *,
        revocation_id: str,
        approval_id: str,
        candidate_id: str,
        revoked_by: str,
        reason: str,
        evidence_refs: tuple[str, ...] = (),
        metadata: Mapping[str, Any] | None = None,
    ) -> ApprovalRevocationRecord:
        now = (
            datetime.now(timezone.utc)
            .replace(microsecond=0)
            .isoformat()
            .replace("+00:00", "Z")
        )

        return self.revoke(
            ApprovalRevocationRecord(
                revocation_id=revocation_id,
                approval_id=approval_id,
                candidate_id=candidate_id,
                revoked_by=revoked_by,
                revoked_at=now,
                reason=reason,
                evidence_refs=evidence_refs,
                metadata=metadata,
            )
        )

    def status(self, approval_id: str) -> ApprovalLifecycleView:
        if not isinstance(approval_id, str) or not approval_id.strip():
            raise ApprovalRevocationError("approval_id is required")

        approval_id = approval_id.strip()

        with self._lock:
            candidate_id = self._approval_candidates.get(approval_id)

            if candidate_id is None:
                raise ApprovalRevocationError("approval is not registered")

            revocation = self._records_by_approval.get(approval_id)

            if revocation is None:
                return ApprovalLifecycleView(
                    approval_id=approval_id,
                    candidate_id=candidate_id,
                    state=ApprovalLifecycleState.ACTIVE,
                    revocation=None,
                )

            return ApprovalLifecycleView(
                approval_id=approval_id,
                candidate_id=candidate_id,
                state=ApprovalLifecycleState.REVOKED,
                revocation=revocation,
            )

    def is_active(self, approval_id: str) -> bool:
        return self.status(approval_id).active

    def is_revoked(self, approval_id: str) -> bool:
        return self.status(approval_id).revoked

    def get_revocation(self, approval_id: str) -> ApprovalRevocationRecord | None:
        return self.status(approval_id).revocation

    def all_revocations(self) -> tuple[ApprovalRevocationRecord, ...]:
        with self._lock:
            return tuple(
                sorted(
                    self._records_by_approval.values(),
                    key=lambda item: (item.revoked_at, item.revocation_id),
                )
            )

    def count_approvals(self) -> int:
        with self._lock:
            return len(self._approval_candidates)

    def count_revocations(self) -> int:
        with self._lock:
            return len(self._records_by_approval)
