"""Deterministic discovery-confidence scorer.

Estimates how strongly available observations support treating a
discovery signal as a credible capability gap. It is not a probability
of truth, trust score, approval, authorization, or maturity. An
unresolved semantic identity conflict forces confidence to zero and
evidence_sufficient=False.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Iterable


class DiscoveryConfidenceError(ValueError):
    """Invalid discovery confidence input."""


class DiscoveryConfidenceLevel(str, Enum):
    VERY_LOW = "VERY_LOW"
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    VERY_HIGH = "VERY_HIGH"


@dataclass(frozen=True, slots=True)
class DiscoveryConfidenceInput:
    """Deterministic inputs for discovery-confidence assessment.

    Confidence is evidence about discovery quality only; it must not
    grant capability maturity, trust, approval, authority, or
    production readiness.
    """

    evidence_count: int = 0
    independent_source_count: int = 0
    repeated_observation_count: int = 0

    has_reproducible_failure: bool = False
    has_architecture_gap: bool = False
    has_runtime_signal: bool = False
    has_external_requirement: bool = False

    contradictory_evidence: bool = False
    unresolved_identity_conflict: bool = False

    def __post_init__(self) -> None:
        for field_name in (
            "evidence_count",
            "independent_source_count",
            "repeated_observation_count",
        ):
            value = getattr(self, field_name)

            if (
                isinstance(value, bool)
                or not isinstance(value, int)
                or value < 0
            ):
                raise DiscoveryConfidenceError(
                    f"{field_name} must be a non-negative integer"
                )


@dataclass(frozen=True, slots=True)
class DiscoveryConfidenceResult:
    score: float
    level: DiscoveryConfidenceLevel
    reasons: tuple[str, ...]
    blockers: tuple[str, ...]
    evidence_sufficient: bool

    def __post_init__(self) -> None:
        if not 0.0 <= self.score <= 1.0:
            raise DiscoveryConfidenceError("score must be between 0.0 and 1.0")


class DiscoveryConfidenceScorer:
    EVIDENCE_WEIGHT = 0.20
    INDEPENDENCE_WEIGHT = 0.20
    REPETITION_WEIGHT = 0.15
    REPRODUCIBLE_FAILURE_WEIGHT = 0.15
    ARCHITECTURE_GAP_WEIGHT = 0.10
    RUNTIME_SIGNAL_WEIGHT = 0.10
    EXTERNAL_REQUIREMENT_WEIGHT = 0.10

    CONTRADICTION_PENALTY = 0.25

    SUFFICIENT_THRESHOLD = 0.60

    @staticmethod
    def _bounded_fraction(value: int, target: int) -> float:
        if target <= 0:
            raise DiscoveryConfidenceError("target must be positive")

        return min(float(value) / float(target), 1.0)

    @staticmethod
    def _level(score: float) -> DiscoveryConfidenceLevel:
        if score < 0.20:
            return DiscoveryConfidenceLevel.VERY_LOW

        if score < 0.40:
            return DiscoveryConfidenceLevel.LOW

        if score < 0.60:
            return DiscoveryConfidenceLevel.MEDIUM

        if score < 0.80:
            return DiscoveryConfidenceLevel.HIGH

        return DiscoveryConfidenceLevel.VERY_HIGH

    @staticmethod
    def _deduplicate(values: Iterable[str]) -> tuple[str, ...]:
        return tuple(dict.fromkeys(values))

    def score(self, inputs: DiscoveryConfidenceInput) -> DiscoveryConfidenceResult:
        if not isinstance(inputs, DiscoveryConfidenceInput):
            raise DiscoveryConfidenceError("inputs must be DiscoveryConfidenceInput")

        reasons: list[str] = []
        blockers: list[str] = []

        if inputs.unresolved_identity_conflict:
            blockers.append("unresolved_identity_conflict")

            return DiscoveryConfidenceResult(
                score=0.0,
                level=DiscoveryConfidenceLevel.VERY_LOW,
                reasons=(),
                blockers=tuple(blockers),
                evidence_sufficient=False,
            )

        score = 0.0

        evidence_fraction = self._bounded_fraction(inputs.evidence_count, 3)

        if inputs.evidence_count > 0:
            score += evidence_fraction * self.EVIDENCE_WEIGHT

            reasons.append("evidence_present")

        independence_fraction = self._bounded_fraction(
            inputs.independent_source_count, 3
        )

        if inputs.independent_source_count > 0:
            score += independence_fraction * self.INDEPENDENCE_WEIGHT

            reasons.append("independent_sources_present")

        repetition_fraction = self._bounded_fraction(
            inputs.repeated_observation_count, 3
        )

        if inputs.repeated_observation_count > 0:
            score += repetition_fraction * self.REPETITION_WEIGHT

            reasons.append("repeated_observations_present")

        if inputs.has_reproducible_failure:
            score += self.REPRODUCIBLE_FAILURE_WEIGHT

            reasons.append("reproducible_failure_present")

        if inputs.has_architecture_gap:
            score += self.ARCHITECTURE_GAP_WEIGHT

            reasons.append("architecture_gap_present")

        if inputs.has_runtime_signal:
            score += self.RUNTIME_SIGNAL_WEIGHT

            reasons.append("runtime_signal_present")

        if inputs.has_external_requirement:
            score += self.EXTERNAL_REQUIREMENT_WEIGHT

            reasons.append("external_requirement_present")

        if inputs.contradictory_evidence:
            score -= self.CONTRADICTION_PENALTY

            blockers.append("contradictory_evidence")

        score = max(0.0, min(round(score, 6), 1.0))

        level = self._level(score)

        evidence_sufficient = score >= self.SUFFICIENT_THRESHOLD and not blockers

        if inputs.evidence_count == 0:
            blockers.append("no_evidence")

            evidence_sufficient = False

        if inputs.independent_source_count == 0:
            blockers.append("no_independent_source")

            evidence_sufficient = False

        return DiscoveryConfidenceResult(
            score=score,
            level=level,
            reasons=self._deduplicate(reasons),
            blockers=self._deduplicate(blockers),
            evidence_sufficient=evidence_sufficient,
        )
