"""Separation-of-duties policy for capability promotion.

Enforces role separation by candidate risk class:

- LOW: approver must differ from generator.
- MEDIUM: generator != approver and evaluator != approver.
- HIGH: generator, evaluator, and approver all differ.
- CRITICAL: as HIGH plus an independent verifier who differs from
  generator, evaluator, and approver.
"""

from __future__ import annotations

from dataclasses import dataclass

from .capability_approver_authority import CandidateRiskClass


@dataclass(frozen=True, slots=True)
class SeparationOfDutiesDecision:
    risk_class: CandidateRiskClass
    generator_identity: str
    evaluator_identity: str
    approver_identity: str
    verifier_identity: str | None
    allowed: bool
    reasons: tuple[str, ...]


class SeparationOfDutiesPolicy:
    @staticmethod
    def _validate_identity(value: str, name: str) -> None:
        if not value.strip():
            raise ValueError(f"{name} is required")

    def evaluate(
        self,
        *,
        risk_class: CandidateRiskClass,
        generator_identity: str,
        evaluator_identity: str,
        approver_identity: str,
        verifier_identity: str | None = None,
    ) -> SeparationOfDutiesDecision:
        self._validate_identity(generator_identity, "generator_identity")
        self._validate_identity(evaluator_identity, "evaluator_identity")
        self._validate_identity(approver_identity, "approver_identity")

        if verifier_identity is not None and not verifier_identity.strip():
            raise ValueError("verifier_identity must be non-empty")

        reasons = []

        if risk_class is CandidateRiskClass.LOW:
            if generator_identity == approver_identity:
                reasons.append("generator_and_approver_must_differ")

        elif risk_class is CandidateRiskClass.MEDIUM:
            if generator_identity == approver_identity:
                reasons.append("generator_and_approver_must_differ")

            if evaluator_identity == approver_identity:
                reasons.append("evaluator_and_approver_must_differ")

        elif risk_class is CandidateRiskClass.HIGH:
            if generator_identity == evaluator_identity:
                reasons.append("generator_and_evaluator_must_differ")

            if generator_identity == approver_identity:
                reasons.append("generator_and_approver_must_differ")

            if evaluator_identity == approver_identity:
                reasons.append("evaluator_and_approver_must_differ")

        elif risk_class is CandidateRiskClass.CRITICAL:
            if generator_identity == evaluator_identity:
                reasons.append("generator_and_evaluator_must_differ")

            if generator_identity == approver_identity:
                reasons.append("generator_and_approver_must_differ")

            if evaluator_identity == approver_identity:
                reasons.append("evaluator_and_approver_must_differ")

            if verifier_identity is None:
                reasons.append("independent_verifier_required")
            else:
                if verifier_identity == generator_identity:
                    reasons.append("verifier_and_generator_must_differ")

                if verifier_identity == evaluator_identity:
                    reasons.append("verifier_and_evaluator_must_differ")

                if verifier_identity == approver_identity:
                    reasons.append("verifier_and_approver_must_differ")

        return SeparationOfDutiesDecision(
            risk_class=risk_class,
            generator_identity=generator_identity,
            evaluator_identity=evaluator_identity,
            approver_identity=approver_identity,
            verifier_identity=verifier_identity,
            allowed=not reasons,
            reasons=tuple(dict.fromkeys(reasons)),
        )
