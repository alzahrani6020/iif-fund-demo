"""Governed pre-capability candidate registry.

A candidate is not a trusted CapabilityRecord. Registration or
lifecycle progression never grants VALIDATED/PRODUCTION_READY maturity,
production authorization, or automatic insertion into the capability
registry — promotion goes through the governed promotion gate.
"""

from __future__ import annotations

from dataclasses import dataclass, replace
from enum import Enum
from types import MappingProxyType
from typing import Mapping


class CapabilityCandidateState(str, Enum):
    DISCOVERED = "DISCOVERED"
    PROPOSED = "PROPOSED"
    EXPERIMENTAL = "EXPERIMENTAL"
    SANDBOX_VALIDATED = "SANDBOX_VALIDATED"
    GOVERNANCE_REVIEW = "GOVERNANCE_REVIEW"


class CapabilityCandidateOrigin(str, Enum):
    MANUAL = "MANUAL"
    ASSISTED = "ASSISTED"
    AUTOMATED = "AUTOMATED"
    AUTONOMOUS_PROPOSAL = "AUTONOMOUS_PROPOSAL"
    AUTONOMOUS_SANDBOX = "AUTONOMOUS_SANDBOX"


_ALLOWED_TRANSITIONS = {
    CapabilityCandidateState.DISCOVERED: {
        CapabilityCandidateState.PROPOSED,
    },
    CapabilityCandidateState.PROPOSED: {
        CapabilityCandidateState.EXPERIMENTAL,
    },
    CapabilityCandidateState.EXPERIMENTAL: {
        CapabilityCandidateState.SANDBOX_VALIDATED,
    },
    CapabilityCandidateState.SANDBOX_VALIDATED: {
        CapabilityCandidateState.GOVERNANCE_REVIEW,
    },
    CapabilityCandidateState.GOVERNANCE_REVIEW: set(),
}


@dataclass(frozen=True, slots=True)
class CapabilityCandidate:
    candidate_id: str
    name: str
    origin: CapabilityCandidateOrigin
    state: CapabilityCandidateState = CapabilityCandidateState.DISCOVERED
    description: str = ""
    proposed_capability_id: str | None = None
    evidence_refs: tuple[str, ...] = ()
    report_refs: tuple[str, ...] = ()
    parent_candidate_ids: tuple[str, ...] = ()
    dependency_candidate_ids: tuple[str, ...] = ()
    risk_class: str = "UNKNOWN"
    trust_score: float = 0.0
    metadata: Mapping[str, object] = MappingProxyType({})

    def __post_init__(self) -> None:
        if not self.candidate_id.strip():
            raise ValueError("candidate_id must be non-empty")

        if not self.name.strip():
            raise ValueError("name must be non-empty")

        if not 0.0 <= self.trust_score <= 1.0:
            raise ValueError("trust_score must be between 0 and 1")

        object.__setattr__(
            self,
            "metadata",
            MappingProxyType(dict(self.metadata)),
        )


class CapabilityCandidateRegistry:
    def __init__(self) -> None:
        self._records: dict[str, CapabilityCandidate] = {}

    def register(self, candidate: CapabilityCandidate) -> CapabilityCandidate:
        if candidate.candidate_id in self._records:
            raise ValueError(
                f"candidate already registered: {candidate.candidate_id}"
            )

        for parent_id in candidate.parent_candidate_ids:
            if parent_id not in self._records:
                raise ValueError(f"unknown parent candidate: {parent_id}")

        for dependency_id in candidate.dependency_candidate_ids:
            if dependency_id not in self._records:
                raise ValueError(f"unknown dependency candidate: {dependency_id}")

        self._records[candidate.candidate_id] = candidate

        return candidate

    def exists(self, candidate_id: str) -> bool:
        return candidate_id in self._records

    def get(self, candidate_id: str) -> CapabilityCandidate:
        try:
            return self._records[candidate_id]
        except KeyError as exc:
            raise KeyError(f"unknown candidate: {candidate_id}") from exc

    def all(self) -> tuple[CapabilityCandidate, ...]:
        return tuple(self._records.values())

    def transition(
        self, candidate_id: str, target: CapabilityCandidateState
    ) -> CapabilityCandidate:
        current = self.get(candidate_id)

        allowed = _ALLOWED_TRANSITIONS[current.state]

        if target not in allowed:
            raise ValueError(
                "illegal candidate transition: "
                f"{current.state.value} -> {target.value}"
            )

        if (
            target is CapabilityCandidateState.SANDBOX_VALIDATED
            and not current.evidence_refs
        ):
            raise ValueError("sandbox validation requires evidence")

        if (
            target is CapabilityCandidateState.GOVERNANCE_REVIEW
            and not current.evidence_refs
        ):
            raise ValueError("governance review requires evidence")

        updated = replace(current, state=target)

        self._records[candidate_id] = updated

        return updated

    def attach_evidence(
        self, candidate_id: str, evidence_id: str
    ) -> CapabilityCandidate:
        if not evidence_id.strip():
            raise ValueError("evidence_id must be non-empty")

        current = self.get(candidate_id)

        if evidence_id in current.evidence_refs:
            return current

        updated = replace(
            current,
            evidence_refs=(*current.evidence_refs, evidence_id),
        )

        self._records[candidate_id] = updated

        return updated

    def attach_report(
        self, candidate_id: str, report_id: str
    ) -> CapabilityCandidate:
        if not report_id.strip():
            raise ValueError("report_id must be non-empty")

        current = self.get(candidate_id)

        if report_id in current.report_refs:
            return current

        updated = replace(
            current,
            report_refs=(*current.report_refs, report_id),
        )

        self._records[candidate_id] = updated

        return updated

    def set_trust_score(
        self, candidate_id: str, trust_score: float
    ) -> CapabilityCandidate:
        if not 0.0 <= trust_score <= 1.0:
            raise ValueError("trust_score must be between 0 and 1")

        current = self.get(candidate_id)

        updated = replace(current, trust_score=trust_score)

        self._records[candidate_id] = updated

        return updated
