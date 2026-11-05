"""Governed candidate-to-capability promotion gate.

Enforces: governance-review state, candidate evidence, persistent
approval, approval/candidate binding, active APPROVED decision,
approval scope, approval evidence bound to candidate evidence,
approver authority for the candidate risk class, governed role
assignment, separation of duties, and a unique target capability id.

Promotion never grants maturity, trust, or production readiness.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone

from .capability_approver_authority import (
    ApproverAuthorityPolicy,
    CandidateRiskClass,
)
from .capability_candidates import (
    CapabilityCandidateRegistry,
    CapabilityCandidateState,
)
from .capability_contracts import (
    CapabilityClass,
    CapabilityMaturity,
    CapabilityOrigin,
    CapabilityRecord,
)
from .capability_promotion_approval import PromotionDecision
from .capability_promotion_approval_ledger import PromotionApprovalLedger
from .capability_registry import CapabilityRegistry
from .capability_role_assignment import CandidateRoleAssignmentRegistry
from .capability_separation_of_duties import SeparationOfDutiesPolicy


@dataclass(frozen=True, slots=True)
class CandidatePromotionDecision:
    candidate_id: str
    approval_id: str
    approved: bool
    target_capability_id: str | None
    risk_class: CandidateRiskClass | None
    reasons: tuple[str, ...]


class CapabilityPromotionGate:
    REQUIRED_SCOPE = "capability-promotion"

    def __init__(
        self,
        *,
        candidates: CapabilityCandidateRegistry,
        capabilities: CapabilityRegistry,
        approvals: PromotionApprovalLedger,
        authority_policy: ApproverAuthorityPolicy,
        role_assignments: CandidateRoleAssignmentRegistry,
        separation_policy: SeparationOfDutiesPolicy,
    ) -> None:
        self.candidates = candidates
        self.capabilities = capabilities
        self.approvals = approvals
        self.authority_policy = authority_policy
        self.role_assignments = role_assignments
        self.separation_policy = separation_policy

    @staticmethod
    def _risk_class(raw: str) -> CandidateRiskClass | None:
        try:
            return CandidateRiskClass(raw)
        except (ValueError, TypeError):
            return None

    def evaluate(
        self,
        candidate_id: str,
        *,
        approval_id: str,
        now: datetime | None = None,
    ) -> CandidatePromotionDecision:
        candidate = self.candidates.get(candidate_id)
        reasons: list[str] = []

        if candidate.state is not CapabilityCandidateState.GOVERNANCE_REVIEW:
            reasons.append("candidate_not_in_governance_review")

        if not candidate.evidence_refs:
            reasons.append("candidate_missing_evidence")

        risk_class = self._risk_class(candidate.risk_class)

        if risk_class is None:
            reasons.append("candidate_risk_class_invalid")

        current = now or datetime.now(timezone.utc)

        if current.tzinfo is None:
            raise ValueError("now must be timezone-aware")

        try:
            approval = self.approvals.get(approval_id)
        except KeyError:
            approval = None
            reasons.append("approval_not_found")

        if approval is not None:
            if approval.candidate_id != candidate_id:
                reasons.append("approval_candidate_mismatch")

            if approval.decision is not PromotionDecision.APPROVED:
                reasons.append("approval_not_approved")

            if not approval.is_active(now=current):
                reasons.append("approval_not_active")

            if approval.scope != self.REQUIRED_SCOPE:
                reasons.append("approval_scope_invalid")

            if not approval.evidence_refs:
                reasons.append("approval_missing_evidence")
            else:
                candidate_evidence = set(candidate.evidence_refs)

                approval_evidence = set(approval.evidence_refs)

                if not approval_evidence.issubset(candidate_evidence):
                    reasons.append("approval_evidence_not_bound_to_candidate")

            if risk_class is not None:
                authority = self.authority_policy.evaluate(
                    approver_identity=approval.approver_identity,
                    risk_class=risk_class,
                    scope=self.REQUIRED_SCOPE,
                )

                if not authority.authorized:
                    reasons.extend(authority.reasons)

        try:
            role_assignment = self.role_assignments.get(candidate_id)
        except KeyError:
            role_assignment = None
            reasons.append("candidate_role_assignment_missing")

        if (
            role_assignment is not None
            and approval is not None
            and risk_class is not None
        ):
            separation = self.separation_policy.evaluate(
                risk_class=risk_class,
                generator_identity=role_assignment.generator_identity,
                evaluator_identity=role_assignment.evaluator_identity,
                approver_identity=approval.approver_identity,
                verifier_identity=role_assignment.verifier_identity,
            )

            if not separation.allowed:
                reasons.extend(separation.reasons)

        target_id = candidate.proposed_capability_id or f"CAP-{candidate.candidate_id}"

        if self.capabilities.exists(target_id):
            reasons.append("target_capability_id_already_exists")

        return CandidatePromotionDecision(
            candidate_id=candidate_id,
            approval_id=approval_id,
            approved=not reasons,
            target_capability_id=target_id,
            risk_class=risk_class,
            reasons=tuple(dict.fromkeys(reasons)),
        )

    def promote(
        self,
        candidate_id: str,
        *,
        approval_id: str,
        classification: CapabilityClass,
        now: datetime | None = None,
    ) -> CapabilityRecord:
        decision = self.evaluate(
            candidate_id,
            approval_id=approval_id,
            now=now,
        )

        if not decision.approved:
            raise ValueError(
                "candidate promotion blocked: " + ", ".join(decision.reasons)
            )

        candidate = self.candidates.get(candidate_id)

        approval = self.approvals.get(approval_id)

        roles = self.role_assignments.get(candidate_id)

        origin_map = {
            "MANUAL": CapabilityOrigin.MANUAL,
            "ASSISTED": CapabilityOrigin.ASSISTED,
            "AUTOMATED": CapabilityOrigin.AUTOMATED,
            "AUTONOMOUS_PROPOSAL": CapabilityOrigin.AUTONOMOUS_PROPOSAL,
            "AUTONOMOUS_SANDBOX": CapabilityOrigin.AUTONOMOUS_SANDBOX,
        }

        capability = CapabilityRecord(
            capability_id=decision.target_capability_id,
            name=candidate.name,
            classification=classification,
            maturity=CapabilityMaturity.NOT_DESIGNED,
            origin=origin_map[candidate.origin.value],
            description=candidate.description,
            evidence_refs=candidate.evidence_refs,
            report_refs=candidate.report_refs,
            trust_score=0.0,
            production_ready=False,
            version="V0",
            metadata={
                "promoted_from_candidate": candidate.candidate_id,
                "candidate_state": candidate.state.value,
                "candidate_risk_class": decision.risk_class.value,
                "promotion_approval_id": approval.approval_id,
                "promotion_approver_identity": approval.approver_identity,
                "generator_identity": roles.generator_identity,
                "evaluator_identity": roles.evaluator_identity,
                "verifier_identity": roles.verifier_identity,
                "promotion_scope": approval.scope,
                "promotion_authority_checked": True,
                "separation_of_duties_checked": True,
                "promotion_explicitly_approved": True,
            },
        )

        self.capabilities.register(capability)

        return capability
