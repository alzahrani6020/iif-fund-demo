"""Approver authority registry and policy.

Explicit authority registry: identity alone does not grant approval
authority. Each approver has an authority level, a set of scopes, and
an active flag. Evaluation fails closed for unknown, inactive, out of
scope, or under-ranked approvers.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class AuthorityLevel(str, Enum):
    OBSERVER = "OBSERVER"
    REVIEWER = "REVIEWER"
    APPROVER = "APPROVER"
    SENIOR_APPROVER = "SENIOR_APPROVER"
    ROOT_AUTHORITY = "ROOT_AUTHORITY"


class CandidateRiskClass(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


_REQUIRED_AUTHORITY = {
    CandidateRiskClass.LOW: AuthorityLevel.APPROVER,
    CandidateRiskClass.MEDIUM: AuthorityLevel.APPROVER,
    CandidateRiskClass.HIGH: AuthorityLevel.SENIOR_APPROVER,
    CandidateRiskClass.CRITICAL: AuthorityLevel.ROOT_AUTHORITY,
}


_AUTHORITY_RANK = {
    AuthorityLevel.OBSERVER: 0,
    AuthorityLevel.REVIEWER: 1,
    AuthorityLevel.APPROVER: 2,
    AuthorityLevel.SENIOR_APPROVER: 3,
    AuthorityLevel.ROOT_AUTHORITY: 4,
}


@dataclass(frozen=True, slots=True)
class ApproverAuthority:
    approver_identity: str
    authority_level: AuthorityLevel
    scopes: tuple[str, ...]
    active: bool = True

    def __post_init__(self) -> None:
        if not self.approver_identity.strip():
            raise ValueError("approver_identity is required")

        if not self.scopes:
            raise ValueError("at least one authority scope is required")


@dataclass(frozen=True, slots=True)
class AuthorityDecision:
    approver_identity: str
    risk_class: CandidateRiskClass
    scope: str
    authorized: bool
    reasons: tuple[str, ...]


class ApproverAuthorityPolicy:
    def __init__(self) -> None:
        self._authorities: dict[str, ApproverAuthority] = {}

    def register(self, authority: ApproverAuthority) -> None:
        if authority.approver_identity in self._authorities:
            raise ValueError(
                f"authority already registered: {authority.approver_identity}"
            )

        self._authorities[authority.approver_identity] = authority

    def get(self, approver_identity: str) -> ApproverAuthority:
        try:
            return self._authorities[approver_identity]
        except KeyError:
            raise KeyError(
                f"unknown approver authority: {approver_identity}"
            ) from None

    def evaluate(
        self,
        *,
        approver_identity: str,
        risk_class: CandidateRiskClass,
        scope: str,
    ) -> AuthorityDecision:
        reasons = []

        try:
            authority = self.get(approver_identity)
        except KeyError:
            return AuthorityDecision(
                approver_identity=approver_identity,
                risk_class=risk_class,
                scope=scope,
                authorized=False,
                reasons=("approver_not_registered",),
            )

        if not authority.active:
            reasons.append("approver_authority_inactive")

        if scope not in authority.scopes:
            reasons.append("approver_scope_not_authorized")

        required = _REQUIRED_AUTHORITY[risk_class]

        if (
            _AUTHORITY_RANK[authority.authority_level]
            < _AUTHORITY_RANK[required]
        ):
            reasons.append("insufficient_authority_level")

        return AuthorityDecision(
            approver_identity=approver_identity,
            risk_class=risk_class,
            scope=scope,
            authorized=not reasons,
            reasons=tuple(dict.fromkeys(reasons)),
        )
