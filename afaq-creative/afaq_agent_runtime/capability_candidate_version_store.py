"""Persistent storage for candidate version history.

Version history and supersession lineage survive restart; one ACTIVE
version per candidate is revalidated on load; writes are atomic at
file level with SHA-256 integrity, and tampered state fails closed.
This layer grants no maturity, trust, approval, authority, or
production readiness.
"""

from __future__ import annotations

import hashlib
import json
import os
import tempfile
from pathlib import Path
from threading import RLock
from typing import Any

from .capability_candidate_versioning import (
    CandidateVersionConflictError,
    CandidateVersionRecord,
    CandidateVersionRegistry,
    CandidateVersionState,
    CandidateVersioningError,
)


SCHEMA_VERSION = "1.0"


class CandidateVersionPersistenceError(RuntimeError):
    """Base persistence error for candidate version history."""


class CandidateVersionIntegrityError(CandidateVersionPersistenceError):
    """Persisted candidate version state failed integrity checks."""


class CandidateVersionPersistence:
    def __init__(self, path: str | Path) -> None:
        self.path = Path(path)

        self.manifest_path = Path(str(self.path) + ".sha256")

        self._lock = RLock()

    @staticmethod
    def _sha256_bytes(payload: bytes) -> str:
        return hashlib.sha256(payload).hexdigest()

    @staticmethod
    def _canonical_json_bytes(payload: dict[str, Any]) -> bytes:
        return (
            json.dumps(
                payload,
                ensure_ascii=False,
                sort_keys=True,
                separators=(",", ":"),
            )
            + "\n"
        ).encode("utf-8")

    def _atomic_write(self, path: Path, payload: bytes) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)

        fd, temporary_name = tempfile.mkstemp(
            prefix=path.name + ".",
            suffix=".tmp",
            dir=str(path.parent),
        )

        temporary_path = Path(temporary_name)

        try:
            with os.fdopen(fd, "wb") as handle:
                handle.write(payload)
                handle.flush()
                os.fsync(handle.fileno())

            os.replace(temporary_path, path)

        except Exception:
            try:
                temporary_path.unlink(missing_ok=True)
            except Exception:
                pass

            raise

    def _serialize_record(self, record: CandidateVersionRecord) -> dict[str, Any]:
        return {
            "candidate_id": record.candidate_id,
            "version": record.version,
            "state": record.state.value,
            "created_at": record.created_at,
            "supersedes_version": record.supersedes_version,
            "superseded_by_version": record.superseded_by_version,
            "reason": record.reason,
            "evidence_refs": list(record.evidence_refs),
            "metadata": dict(record.metadata),
        }

    def _payload(self, registry: CandidateVersionRegistry) -> dict[str, Any]:
        candidates = []

        for candidate_id in sorted(registry._records):
            history = registry.history(candidate_id)

            candidates.append(
                {
                    "candidate_id": candidate_id,
                    "versions": [
                        self._serialize_record(record) for record in history
                    ],
                }
            )

        return {
            "schema_version": SCHEMA_VERSION,
            "candidate_count": len(candidates),
            "candidates": candidates,
        }

    def save(self, registry: CandidateVersionRegistry) -> None:
        if not isinstance(registry, CandidateVersionRegistry):
            raise CandidateVersionPersistenceError(
                "registry must be CandidateVersionRegistry"
            )

        with self._lock:
            payload = self._payload(registry)

            raw = self._canonical_json_bytes(payload)

            digest = self._sha256_bytes(raw)

            self._atomic_write(self.path, raw)

            self._atomic_write(self.manifest_path, (digest + "\n").encode("ascii"))

    def load(self) -> CandidateVersionRegistry:
        with self._lock:
            if not self.path.is_file():
                raise CandidateVersionIntegrityError(
                    "candidate version data file is missing"
                )

            if not self.manifest_path.is_file():
                raise CandidateVersionIntegrityError(
                    "candidate version integrity manifest is missing"
                )

            raw = self.path.read_bytes()

            expected_digest = (
                self.manifest_path.read_text(encoding="ascii").strip().lower()
            )

            actual_digest = self._sha256_bytes(raw)

            if not expected_digest or expected_digest != actual_digest:
                raise CandidateVersionIntegrityError(
                    "candidate version integrity check failed"
                )

            try:
                payload = json.loads(raw.decode("utf-8"))
            except Exception as exc:
                raise CandidateVersionIntegrityError(
                    "candidate version state contains invalid JSON"
                ) from exc

            if not isinstance(payload, dict):
                raise CandidateVersionIntegrityError(
                    "candidate version payload must be an object"
                )

            if payload.get("schema_version") != SCHEMA_VERSION:
                raise CandidateVersionIntegrityError(
                    "unsupported candidate version schema"
                )

            candidates = payload.get("candidates")

            if not isinstance(candidates, list):
                raise CandidateVersionIntegrityError("candidates must be a list")

            candidate_count = payload.get("candidate_count")

            if (
                isinstance(candidate_count, bool)
                or not isinstance(candidate_count, int)
                or candidate_count != len(candidates)
            ):
                raise CandidateVersionIntegrityError("candidate_count mismatch")

            registry = CandidateVersionRegistry()

            seen_candidates: set[str] = set()

            for candidate_item in candidates:
                if not isinstance(candidate_item, dict):
                    raise CandidateVersionIntegrityError(
                        "candidate entry must be an object"
                    )

                candidate_id = candidate_item.get("candidate_id")

                if (
                    not isinstance(candidate_id, str)
                    or not candidate_id.strip()
                ):
                    raise CandidateVersionIntegrityError("invalid candidate_id")

                candidate_id = candidate_id.strip()

                if candidate_id in seen_candidates:
                    raise CandidateVersionIntegrityError("duplicate candidate_id")

                seen_candidates.add(candidate_id)

                versions = candidate_item.get("versions")

                if not isinstance(versions, list):
                    raise CandidateVersionIntegrityError(
                        "versions must be a list"
                    )

                if not versions:
                    raise CandidateVersionIntegrityError(
                        "candidate version history must not be empty"
                    )

                loaded_versions: dict[int, CandidateVersionRecord] = {}

                for item in versions:
                    if not isinstance(item, dict):
                        raise CandidateVersionIntegrityError(
                            "version entry must be an object"
                        )

                    try:
                        version = item["version"]

                        if (
                            isinstance(version, bool)
                            or not isinstance(version, int)
                            or version < 1
                        ):
                            raise ValueError("invalid version")

                        state = CandidateVersionState(item["state"])

                        created_at = item["created_at"]

                        if (
                            not isinstance(created_at, str)
                            or not created_at.strip()
                        ):
                            raise ValueError("invalid created_at")

                        reason = item.get("reason", "")

                        if not isinstance(reason, str):
                            raise ValueError("invalid reason")

                        evidence_refs_raw = item.get("evidence_refs", [])

                        if not isinstance(evidence_refs_raw, list):
                            raise ValueError("evidence_refs must be a list")

                        evidence_refs = tuple(
                            dict.fromkeys(
                                str(value).strip()
                                for value in evidence_refs_raw
                                if str(value).strip()
                            )
                        )

                        metadata = item.get("metadata", {})

                        if not isinstance(metadata, dict):
                            raise ValueError("metadata must be an object")

                        record = CandidateVersionRecord(
                            candidate_id=candidate_id,
                            version=version,
                            state=state,
                            created_at=created_at,
                            supersedes_version=item.get("supersedes_version"),
                            superseded_by_version=item.get(
                                "superseded_by_version"
                            ),
                            reason=reason,
                            evidence_refs=evidence_refs,
                            metadata=metadata,
                        )

                    except (
                        KeyError,
                        TypeError,
                        ValueError,
                        CandidateVersioningError,
                    ) as exc:
                        raise CandidateVersionIntegrityError(
                            "invalid candidate version record"
                        ) from exc

                    if record.version in loaded_versions:
                        raise CandidateVersionIntegrityError(
                            "duplicate candidate version number"
                        )

                    loaded_versions[record.version] = record

                ordered_versions = sorted(loaded_versions)

                expected_versions = list(range(1, len(ordered_versions) + 1))

                if ordered_versions != expected_versions:
                    raise CandidateVersionIntegrityError(
                        "candidate versions must be contiguous from 1"
                    )

                active_records = [
                    record
                    for record in loaded_versions.values()
                    if record.state is CandidateVersionState.ACTIVE
                ]

                if len(active_records) != 1:
                    raise CandidateVersionIntegrityError(
                        "candidate must have exactly one ACTIVE version"
                    )

                for version in ordered_versions:
                    record = loaded_versions[version]

                    if version == 1:
                        if record.supersedes_version is not None:
                            raise CandidateVersionIntegrityError(
                                "version 1 cannot supersede another version"
                            )
                    else:
                        if record.supersedes_version != version - 1:
                            raise CandidateVersionIntegrityError(
                                "supersession lineage is inconsistent"
                            )

                    if version < ordered_versions[-1]:
                        if record.state is not CandidateVersionState.SUPERSEDED:
                            raise CandidateVersionIntegrityError(
                                "non-latest version must be SUPERSEDED"
                            )

                        if record.superseded_by_version != version + 1:
                            raise CandidateVersionIntegrityError(
                                "superseded_by_version is inconsistent"
                            )
                    else:
                        if record.state is not CandidateVersionState.ACTIVE:
                            raise CandidateVersionIntegrityError(
                                "latest version must be ACTIVE"
                            )

                        if record.superseded_by_version is not None:
                            raise CandidateVersionIntegrityError(
                                "ACTIVE latest version cannot be superseded"
                            )

                registry._records[candidate_id] = loaded_versions

            return registry
