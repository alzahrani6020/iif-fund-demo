"""Persistent deterministic semantic identity registry.

Binds a content fingerprint to a candidate so the binding survives
restart. Conflicting bindings fail closed; evidence references are
retained; mutation persistence is atomic at file level and verified
with SHA-256. This registry grants no maturity, trust, approval, or
production authorization, and performs no fuzzy matching.
"""

from __future__ import annotations

import hashlib
import json
import os
import tempfile
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from threading import RLock
from typing import Any, Mapping


SCHEMA_VERSION = "1.0"


class SemanticIdentityRegistryError(RuntimeError):
    """Base error for the persistent semantic identity registry."""


class SemanticIdentityConflictError(SemanticIdentityRegistryError):
    """One semantic identity is bound to different candidates."""


class SemanticIdentityIntegrityError(SemanticIdentityRegistryError):
    """Persisted registry integrity validation failed."""


@dataclass(frozen=True, slots=True)
class SemanticIdentityRecord:
    fingerprint: str
    candidate_id: str
    created_at: str
    semantic_basis: str
    evidence_refs: tuple[str, ...] = ()


def _require_text(value: str, field_name: str) -> str:
    if not isinstance(value, str):
        raise ValueError(f"{field_name} must be a string")

    normalized = value.strip()

    if not normalized:
        raise ValueError(f"{field_name} must not be empty")

    return normalized


def _utc_now() -> str:
    return (
        datetime.now(timezone.utc)
        .replace(microsecond=0)
        .isoformat()
        .replace("+00:00", "Z")
    )


def _sha256_bytes(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def _canonical_json_bytes(payload: Mapping[str, Any]) -> bytes:
    return (
        json.dumps(
            payload,
            ensure_ascii=False,
            sort_keys=True,
            separators=(",", ":"),
        )
        + "\n"
    ).encode("utf-8")


class SemanticIdentityRegistry:
    def __init__(self, path: str | Path) -> None:
        self.path = Path(path)

        self.manifest_path = Path(str(self.path) + ".sha256")

        self._lock = RLock()

        self._records: dict[str, SemanticIdentityRecord] = {}

        if self.path.exists() or self.manifest_path.exists():
            self._load()

    def _payload(self) -> dict[str, Any]:
        records = []

        for fingerprint in sorted(self._records):
            record = self._records[fingerprint]

            records.append(
                {
                    "fingerprint": record.fingerprint,
                    "candidate_id": record.candidate_id,
                    "created_at": record.created_at,
                    "semantic_basis": record.semantic_basis,
                    "evidence_refs": list(record.evidence_refs),
                }
            )

        return {
            "schema_version": SCHEMA_VERSION,
            "record_count": len(records),
            "records": records,
        }

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

    def _persist(self) -> None:
        payload = self._payload()

        raw = _canonical_json_bytes(payload)

        digest = _sha256_bytes(raw)

        self._atomic_write(self.path, raw)

        self._atomic_write(self.manifest_path, (digest + "\n").encode("ascii"))

    def _load(self) -> None:
        if not self.path.is_file():
            raise SemanticIdentityIntegrityError(
                "semantic identity registry data file is missing"
            )

        if not self.manifest_path.is_file():
            raise SemanticIdentityIntegrityError(
                "semantic identity registry integrity manifest is missing"
            )

        raw = self.path.read_bytes()

        expected_digest = (
            self.manifest_path.read_text(encoding="ascii").strip().lower()
        )

        actual_digest = _sha256_bytes(raw)

        if not expected_digest or expected_digest != actual_digest:
            raise SemanticIdentityIntegrityError(
                "semantic identity registry integrity check failed"
            )

        try:
            payload = json.loads(raw.decode("utf-8"))
        except Exception as exc:
            raise SemanticIdentityIntegrityError(
                "semantic identity registry contains invalid JSON"
            ) from exc

        if not isinstance(payload, dict):
            raise SemanticIdentityIntegrityError(
                "semantic identity registry payload must be an object"
            )

        if payload.get("schema_version") != SCHEMA_VERSION:
            raise SemanticIdentityIntegrityError(
                "unsupported semantic identity registry schema version"
            )

        records_raw = payload.get("records")

        if not isinstance(records_raw, list):
            raise SemanticIdentityIntegrityError(
                "semantic identity registry records must be a list"
            )

        record_count = payload.get("record_count")

        if (
            not isinstance(record_count, int)
            or isinstance(record_count, bool)
            or record_count != len(records_raw)
        ):
            raise SemanticIdentityIntegrityError(
                "semantic identity registry record count mismatch"
            )

        loaded: dict[str, SemanticIdentityRecord] = {}

        for item in records_raw:
            if not isinstance(item, dict):
                raise SemanticIdentityIntegrityError(
                    "semantic identity record must be an object"
                )

            try:
                fingerprint = _require_text(item["fingerprint"], "fingerprint")

                candidate_id = _require_text(item["candidate_id"], "candidate_id")

                created_at = _require_text(item["created_at"], "created_at")

                semantic_basis = _require_text(
                    item["semantic_basis"], "semantic_basis"
                )

                evidence_raw = item.get("evidence_refs", [])

                if not isinstance(evidence_raw, list):
                    raise ValueError("evidence_refs must be a list")

                evidence_refs = tuple(
                    dict.fromkeys(
                        _require_text(value, "evidence_ref")
                        for value in evidence_raw
                    )
                )

            except (KeyError, TypeError, ValueError) as exc:
                raise SemanticIdentityIntegrityError(
                    "invalid semantic identity record"
                ) from exc

            if fingerprint in loaded:
                raise SemanticIdentityIntegrityError(
                    "duplicate semantic fingerprint in persisted registry"
                )

            loaded[fingerprint] = SemanticIdentityRecord(
                fingerprint=fingerprint,
                candidate_id=candidate_id,
                created_at=created_at,
                semantic_basis=semantic_basis,
                evidence_refs=evidence_refs,
            )

        self._records = loaded

    def bind(
        self,
        *,
        fingerprint: str,
        candidate_id: str,
        semantic_basis: str,
        evidence_refs: tuple[str, ...] = (),
        created_at: str | None = None,
    ) -> SemanticIdentityRecord:
        fingerprint = _require_text(fingerprint, "fingerprint")

        candidate_id = _require_text(candidate_id, "candidate_id")

        semantic_basis = _require_text(semantic_basis, "semantic_basis")

        normalized_evidence = tuple(
            dict.fromkeys(
                _require_text(evidence_ref, "evidence_ref")
                for evidence_ref in evidence_refs
            )
        )

        with self._lock:
            existing = self._records.get(fingerprint)

            if existing is not None:
                if existing.candidate_id != candidate_id:
                    raise SemanticIdentityConflictError(
                        "semantic fingerprint is already bound to another candidate"
                    )

                if existing.semantic_basis != semantic_basis:
                    raise SemanticIdentityConflictError(
                        "semantic fingerprint basis mismatch"
                    )

                merged_evidence = tuple(
                    dict.fromkeys(existing.evidence_refs + normalized_evidence)
                )

                if merged_evidence == existing.evidence_refs:
                    return existing

                updated = SemanticIdentityRecord(
                    fingerprint=existing.fingerprint,
                    candidate_id=existing.candidate_id,
                    created_at=existing.created_at,
                    semantic_basis=existing.semantic_basis,
                    evidence_refs=merged_evidence,
                )

                before = self._records

                self._records = dict(self._records)

                self._records[fingerprint] = updated

                try:
                    self._persist()
                except Exception:
                    self._records = before
                    raise

                return updated

            timestamp = (
                _require_text(created_at, "created_at")
                if created_at is not None
                else _utc_now()
            )

            record = SemanticIdentityRecord(
                fingerprint=fingerprint,
                candidate_id=candidate_id,
                created_at=timestamp,
                semantic_basis=semantic_basis,
                evidence_refs=normalized_evidence,
            )

            before = self._records

            self._records = dict(self._records)

            self._records[fingerprint] = record

            try:
                self._persist()
            except Exception:
                self._records = before
                raise

            return record

    def unbind(self, *, fingerprint: str, expected_candidate_id: str) -> SemanticIdentityRecord:
        """Remove one persistent semantic binding (with safety checks)."""

        fingerprint = _require_text(fingerprint, "fingerprint")

        expected_candidate_id = _require_text(
            expected_candidate_id, "expected_candidate_id"
        )

        with self._lock:
            try:
                existing = self._records[fingerprint]
            except KeyError as exc:
                raise KeyError(fingerprint) from exc

            if existing.candidate_id != expected_candidate_id:
                raise SemanticIdentityConflictError(
                    "semantic fingerprint is bound to a different candidate"
                )

            before = self._records

            self._records = dict(self._records)

            del self._records[fingerprint]

            try:
                self._persist()
            except Exception:
                self._records = before
                raise

            return existing

    def resolve(self, fingerprint: str) -> str | None:
        fingerprint = _require_text(fingerprint, "fingerprint")

        with self._lock:
            record = self._records.get(fingerprint)

            if record is None:
                return None

            return record.candidate_id

    def get(self, fingerprint: str) -> SemanticIdentityRecord:
        fingerprint = _require_text(fingerprint, "fingerprint")

        with self._lock:
            try:
                return self._records[fingerprint]
            except KeyError as exc:
                raise KeyError(fingerprint) from exc

    def exists(self, fingerprint: str) -> bool:
        fingerprint = _require_text(fingerprint, "fingerprint")

        with self._lock:
            return fingerprint in self._records

    def all(self) -> tuple[SemanticIdentityRecord, ...]:
        with self._lock:
            return tuple(
                self._records[fingerprint]
                for fingerprint in sorted(self._records)
            )

    def count(self) -> int:
        with self._lock:
            return len(self._records)
