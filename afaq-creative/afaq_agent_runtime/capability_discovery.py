"""Capability discovery engine.

Discovers capability gaps and creates candidates only. Hard
invariants: discovery never creates a CapabilityRecord, never grants
maturity or production readiness, and duplicate signals do not
duplicate candidates.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Mapping

from .capability_candidates import (
    CapabilityCandidate,
    CapabilityCandidateOrigin,
    CapabilityCandidateRegistry,
)


class DiscoverySourceKind(str, Enum):
    MANUAL = "MANUAL"
    TEST_FAILURE = "TEST_FAILURE"
    GOVERNANCE_GAP = "GOVERNANCE_GAP"
    ARCHITECTURE_GAP = "ARCHITECTURE_GAP"
    RUNTIME_SIGNAL = "RUNTIME_SIGNAL"
    EXTERNAL_REQUIREMENT = "EXTERNAL_REQUIREMENT"
    AUTONOMOUS_ANALYSIS = "AUTONOMOUS_ANALYSIS"


@dataclass(frozen=True, slots=True)
class CapabilityDiscoverySignal:
    signal_id: str
    source_kind: DiscoverySourceKind
    title: str
    description: str
    suggested_name: str
    suggested_capability_id: str | None = None
    risk_class: str = "UNKNOWN"
    evidence_refs: tuple[str, ...] = ()
    metadata: Mapping[str, object] | None = None

    def __post_init__(self) -> None:
        if not self.signal_id.strip():
            raise ValueError("signal_id is required")

        if not self.title.strip():
            raise ValueError("title is required")

        if not self.description.strip():
            raise ValueError("description is required")

        if not self.suggested_name.strip():
            raise ValueError("suggested_name is required")


@dataclass(frozen=True, slots=True)
class CapabilityDiscoveryResult:
    signal_id: str
    candidate_id: str
    created: bool
    reasons: tuple[str, ...]


class CapabilityDiscoveryEngine:
    def __init__(self, *, candidates: CapabilityCandidateRegistry) -> None:
        self.candidates = candidates
        self._signal_to_candidate: dict[str, str] = {}

    def _candidate_id(self, signal: CapabilityDiscoverySignal) -> str:
        normalized = signal.signal_id.strip().upper().replace(" ", "-")

        return f"CAND-{normalized}"

    def discover(
        self, signal: CapabilityDiscoverySignal
    ) -> CapabilityDiscoveryResult:
        if signal.signal_id in self._signal_to_candidate:
            candidate_id = self._signal_to_candidate[signal.signal_id]

            return CapabilityDiscoveryResult(
                signal_id=signal.signal_id,
                candidate_id=candidate_id,
                created=False,
                reasons=("signal_already_discovered",),
            )

        candidate_id = self._candidate_id(signal)

        if self.candidates.exists(candidate_id):
            raise ValueError(f"candidate id collision: {candidate_id}")

        if signal.source_kind is DiscoverySourceKind.MANUAL:
            origin = CapabilityCandidateOrigin.MANUAL

        elif signal.source_kind is DiscoverySourceKind.AUTONOMOUS_ANALYSIS:
            origin = CapabilityCandidateOrigin.AUTONOMOUS_PROPOSAL

        else:
            origin = CapabilityCandidateOrigin.AUTOMATED

        candidate = CapabilityCandidate(
            candidate_id=candidate_id,
            name=signal.suggested_name,
            origin=origin,
            description=signal.description,
            proposed_capability_id=signal.suggested_capability_id,
            evidence_refs=signal.evidence_refs,
            risk_class=signal.risk_class,
            trust_score=0.0,
            metadata={
                "discovery_signal_id": signal.signal_id,
                "discovery_source_kind": signal.source_kind.value,
                "discovery_title": signal.title,
                **dict(signal.metadata or {}),
            },
        )

        self.candidates.register(candidate)

        self._signal_to_candidate[signal.signal_id] = candidate_id

        return CapabilityDiscoveryResult(
            signal_id=signal.signal_id,
            candidate_id=candidate_id,
            created=True,
            reasons=("candidate_created_from_discovery_signal",),
        )

    def lookup_signal(self, signal_id: str) -> str:
        try:
            return self._signal_to_candidate[signal_id]
        except KeyError:
            raise KeyError(f"unknown discovery signal: {signal_id}") from None
