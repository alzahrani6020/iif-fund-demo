"""Candidate version lineage (in-memory).

One ACTIVE version per candidate; versions increase monotonically;
superseded versions remain queryable; supersession is explicit and
traceable; no version deletion. Versioning grants no maturity, trust,
approval, or production readiness. Persistence lives outside this
module (see capability_candidate_version_store.py).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from threading import RLock
from typing import Any, Mapping


class CandidateVersioningError(ValueError):
    """Invalid candidate versioning operation."""


class CandidateVersionConflictError(CandidateVersioningError):
    """Conflicting candidate version state."""


class CandidateVersionState(str, Enum):
    ACTIVE = "ACTIVE"
    SUPERSEDED = "SUPERSEDED"


@dataclass(frozen=True, slots=True)
class CandidateVersionRecord:
    candidate_id: str
    version: int
    state: CandidateVersionState
    created_at: str
    supersedes_version: int | None = None
    superseded_by_version: int | None = None
    reason: str = ""
    evidence_refs: tuple[str, ...] = ()
    metadata: Mapping[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        if not self.candidate_id.strip():
            raise CandidateVersioningError("candidate_id is required")

        if (
            isinstance(self.version, bool)
            or not isinstance(self.version, int)
            or self.version < 1
        ):
            raise CandidateVersioningError("version must be a positive integer")

        if not self.created_at.strip():
            raise CandidateVersioningError("created_at is required")

        if (
            self.supersedes_version is not None
            and self.supersedes_version >= self.version
        ):
            raise CandidateVersioningError(
                "supersedes_version must be lower than version"
            )

        if (
            self.superseded_by_version is not None
            and self.superseded_by_version <= self.version
        ):
            raise CandidateVersioningError(
                "superseded_by_version must be higher than version"
            )


class CandidateVersionRegistry:
    def __init__(self) -> None:
        self._records: dict[str, dict[int, CandidateVersionRecord]] = {}
        self._lock = RLock()

    @staticmethod
    def _now() -> str:
        return (
            datetime.now(timezone.utc)
            .replace(microsecond=0)
            .isoformat()
            .replace("+00:00", "Z")
        )

    @staticmethod
    def _require_candidate_id(candidate_id: str) -> str:
        if not isinstance(candidate_id, str) or not candidate_id.strip():
            raise CandidateVersioningError("candidate_id is required")

        return candidate_id.strip()

    def create_initial(
        self,
        *,
        candidate_id: str,
        reason: str = "initial_version",
        evidence_refs: tuple[str, ...] = (),
        metadata: Mapping[str, Any] | None = None,
        created_at: str | None = None,
    ) -> CandidateVersionRecord:
        candidate_id = self._require_candidate_id(candidate_id)

        with self._lock:
            if candidate_id in self._records:
                raise CandidateVersionConflictError(
                    "candidate already has version history"
                )

            record = CandidateVersionRecord(
                candidate_id=candidate_id,
                version=1,
                state=CandidateVersionState.ACTIVE,
                created_at=created_at or self._now(),
                supersedes_version=None,
                superseded_by_version=None,
                reason=reason.strip(),
                evidence_refs=tuple(dict.fromkeys(evidence_refs)),
                metadata=dict(metadata or {}),
            )

            self._records[candidate_id] = {1: record}

            return record

    def active(self, candidate_id: str) -> CandidateVersionRecord:
        candidate_id = self._require_candidate_id(candidate_id)

        with self._lock:
            versions = self._records.get(candidate_id)

            if not versions:
                raise CandidateVersioningError(
                    "candidate version history not found"
                )

            active_records = [
                record
                for record in versions.values()
                if record.state is CandidateVersionState.ACTIVE
            ]

            if len(active_records) != 1:
                raise CandidateVersionConflictError(
                    "candidate must have exactly one ACTIVE version"
                )

            return active_records[0]

    def supersede(
        self,
        *,
        candidate_id: str,
        reason: str,
        evidence_refs: tuple[str, ...] = (),
        metadata: Mapping[str, Any] | None = None,
        created_at: str | None = None,
    ) -> CandidateVersionRecord:
        candidate_id = self._require_candidate_id(candidate_id)

        if not isinstance(reason, str) or not reason.strip():
            raise CandidateVersioningError("supersession reason is required")

        with self._lock:
            current = self.active(candidate_id)

            versions = self._records[candidate_id]

            next_version = max(versions.keys()) + 1

            superseded = CandidateVersionRecord(
                candidate_id=current.candidate_id,
                version=current.version,
                state=CandidateVersionState.SUPERSEDED,
                created_at=current.created_at,
                supersedes_version=current.supersedes_version,
                superseded_by_version=next_version,
                reason=current.reason,
                evidence_refs=current.evidence_refs,
                metadata=dict(current.metadata),
            )

            replacement = CandidateVersionRecord(
                candidate_id=candidate_id,
                version=next_version,
                state=CandidateVersionState.ACTIVE,
                created_at=created_at or self._now(),
                supersedes_version=current.version,
                superseded_by_version=None,
                reason=reason.strip(),
                evidence_refs=tuple(dict.fromkeys(evidence_refs)),
                metadata=dict(metadata or {}),
            )

            versions[current.version] = superseded

            versions[next_version] = replacement

            return replacement

    def get(self, candidate_id: str, version: int) -> CandidateVersionRecord:
        candidate_id = self._require_candidate_id(candidate_id)

        if (
            isinstance(version, bool)
            or not isinstance(version, int)
            or version < 1
        ):
            raise CandidateVersioningError("version must be a positive integer")

        with self._lock:
            try:
                return self._records[candidate_id][version]
            except KeyError as exc:
                raise CandidateVersioningError(
                    "candidate version not found"
                ) from exc

    def history(self, candidate_id: str) -> tuple[CandidateVersionRecord, ...]:
        candidate_id = self._require_candidate_id(candidate_id)

        with self._lock:
            versions = self._records.get(candidate_id)

            if not versions:
                return ()

            return tuple(versions[version] for version in sorted(versions))

    def exists(self, candidate_id: str) -> bool:
        candidate_id = self._require_candidate_id(candidate_id)

        with self._lock:
            return candidate_id in self._records

    def count_candidates(self) -> int:
        with self._lock:
            return len(self._records)

    def count_versions(self, candidate_id: str) -> int:
        return len(self.history(candidate_id))
