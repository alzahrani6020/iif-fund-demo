"""Governed candidate version lifecycle.

Couples the in-memory version registry to persistent storage: every
successful mutation is persisted, and persistence failure rolls the
in-memory state back. Versioning grants no trust, maturity, approval,
authorization, or production readiness, and historical versions are
never deleted.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Mapping

from .capability_candidate_version_store import CandidateVersionPersistence
from .capability_candidate_versioning import (
    CandidateVersionRecord,
    CandidateVersionRegistry,
    CandidateVersioningError,
)


class GovernedCandidateVersioningError(CandidateVersioningError):
    """Invalid governed candidate version operation."""


@dataclass(frozen=True, slots=True)
class GovernedCandidateVersionResult:
    candidate_id: str
    version: int
    record: CandidateVersionRecord
    persisted: bool
    trust_granted: bool = False
    maturity_granted: bool = False
    approval_granted: bool = False
    authorization_granted: bool = False
    production_ready: bool = False

    def __post_init__(self) -> None:
        if self.candidate_id != self.record.candidate_id:
            raise GovernedCandidateVersioningError(
                "candidate_id does not match record"
            )

        if self.version != self.record.version:
            raise GovernedCandidateVersioningError(
                "version does not match record"
            )

        if any(
            (
                self.trust_granted,
                self.maturity_granted,
                self.approval_granted,
                self.authorization_granted,
                self.production_ready,
            )
        ):
            raise GovernedCandidateVersioningError(
                "candidate versioning cannot grant governance or production state"
            )


class GovernedCandidateVersioning:
    def __init__(
        self,
        registry: CandidateVersionRegistry,
        persistence: CandidateVersionPersistence,
    ) -> None:
        if not isinstance(registry, CandidateVersionRegistry):
            raise GovernedCandidateVersioningError(
                "registry must be CandidateVersionRegistry"
            )

        if not isinstance(persistence, CandidateVersionPersistence):
            raise GovernedCandidateVersioningError(
                "persistence must be CandidateVersionPersistence"
            )

        self.registry = registry
        self.persistence = persistence

    def _snapshot(
        self, candidate_id: str
    ) -> dict[int, CandidateVersionRecord] | None:
        versions = self.registry._records.get(candidate_id)

        if versions is None:
            return None

        return dict(versions)

    def _restore(
        self,
        candidate_id: str,
        snapshot: dict[int, CandidateVersionRecord] | None,
    ) -> None:
        if snapshot is None:
            self.registry._records.pop(candidate_id, None)
            return

        self.registry._records[candidate_id] = dict(snapshot)

    @staticmethod
    def _result(record: CandidateVersionRecord) -> GovernedCandidateVersionResult:
        return GovernedCandidateVersionResult(
            candidate_id=record.candidate_id,
            version=record.version,
            record=record,
            persisted=True,
        )

    def create_initial(
        self,
        *,
        candidate_id: str,
        reason: str = "initial_version",
        evidence_refs: tuple[str, ...] = (),
        metadata: Mapping[str, Any] | None = None,
        created_at: str | None = None,
    ) -> GovernedCandidateVersionResult:
        snapshot = self._snapshot(candidate_id)

        try:
            record = self.registry.create_initial(
                candidate_id=candidate_id,
                reason=reason,
                evidence_refs=evidence_refs,
                metadata=metadata,
                created_at=created_at,
            )

            self.persistence.save(self.registry)

        except Exception:
            self._restore(candidate_id, snapshot)
            raise

        return self._result(record)

    def supersede(
        self,
        *,
        candidate_id: str,
        reason: str,
        evidence_refs: tuple[str, ...] = (),
        metadata: Mapping[str, Any] | None = None,
        created_at: str | None = None,
    ) -> GovernedCandidateVersionResult:
        snapshot = self._snapshot(candidate_id)

        try:
            record = self.registry.supersede(
                candidate_id=candidate_id,
                reason=reason,
                evidence_refs=evidence_refs,
                metadata=metadata,
                created_at=created_at,
            )

            self.persistence.save(self.registry)

        except Exception:
            self._restore(candidate_id, snapshot)
            raise

        return self._result(record)

    def active(self, candidate_id: str) -> CandidateVersionRecord:
        return self.registry.active(candidate_id)

    def get(self, candidate_id: str, version: int) -> CandidateVersionRecord:
        return self.registry.get(candidate_id, version)

    def history(self, candidate_id: str) -> tuple[CandidateVersionRecord, ...]:
        return self.registry.history(candidate_id)

    @classmethod
    def restore(
        cls, persistence: CandidateVersionPersistence
    ) -> "GovernedCandidateVersioning":
        if not isinstance(persistence, CandidateVersionPersistence):
            raise GovernedCandidateVersioningError(
                "persistence must be CandidateVersionPersistence"
            )

        registry = persistence.load()

        return cls(registry=registry, persistence=persistence)
