"""Candidate role assignment registry.

Explicit role assignments (generator / evaluator / optional verifier)
for capability candidates. Provides governed role identity input for
separation-of-duties enforcement; it does not grant approval authority
and does not promote candidates.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True, slots=True)
class CandidateRoleAssignment:
    candidate_id: str
    generator_identity: str
    evaluator_identity: str
    verifier_identity: str | None
    assigned_at: datetime
    evidence_refs: tuple[str, ...] = ()

    def __post_init__(self) -> None:
        if not self.candidate_id.strip():
            raise ValueError("candidate_id is required")

        if not self.generator_identity.strip():
            raise ValueError("generator_identity is required")

        if not self.evaluator_identity.strip():
            raise ValueError("evaluator_identity is required")

        if self.verifier_identity is not None and not self.verifier_identity.strip():
            raise ValueError("verifier_identity must be non-empty")

        if self.assigned_at.tzinfo is None:
            raise ValueError("assigned_at must be timezone-aware")


class CandidateRoleAssignmentRegistry:
    def __init__(self) -> None:
        self._assignments: dict[str, CandidateRoleAssignment] = {}

    def register(self, assignment: CandidateRoleAssignment) -> None:
        if assignment.candidate_id in self._assignments:
            raise ValueError(
                "candidate role assignment already exists: "
                f"{assignment.candidate_id}"
            )

        self._assignments[assignment.candidate_id] = assignment

    def get(self, candidate_id: str) -> CandidateRoleAssignment:
        try:
            return self._assignments[candidate_id]
        except KeyError:
            raise KeyError(
                f"candidate role assignment not found: {candidate_id}"
            ) from None

    def exists(self, candidate_id: str) -> bool:
        return candidate_id in self._assignments

    def all(self) -> tuple[CandidateRoleAssignment, ...]:
        return tuple(self._assignments.values())
