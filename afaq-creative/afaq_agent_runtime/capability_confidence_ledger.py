"""Append-only ledger for discovery-confidence assessments.

Assessment ids are immutable and unique; identical re-append is
idempotent while conflicting reuse fails closed. Historical
assessments are retained and persisted atomically with SHA-256
tamper detection. Confidence history grants no trust, maturity,
approval, authority, or production readiness.
"""

from __future__ import annotations

import hashlib
import json
import os
import tempfile
from dataclasses import dataclass
from pathlib import Path
from threading import RLock
from typing import Any, Mapping


SCHEMA_VERSION = "1.0"


class ConfidenceAssessmentLedgerError(RuntimeError):
    """Base error for the confidence assessment ledger."""


class ConfidenceAssessmentIntegrityError(ConfidenceAssessmentLedgerError):
    """Persisted confidence evidence failed validation."""


class ConfidenceAssessmentConflictError(ConfidenceAssessmentLedgerError):
    """Conflicting immutable assessment was detected."""


@dataclass(frozen=True, slots=True)
class ConfidenceAssessmentRecord:
    assessment_id: str
    candidate_id: str
    signal_id: str
    score: float
    level: str
    evidence_sufficient: bool
    reasons: tuple[str, ...]
    blockers: tuple[str, ...]
    evidence_refs: tuple[str, ...]
    assessed_at: str
    scorer_version: str = "V0"
    metadata: Mapping[str, Any] | None = None

    def __post_init__(self) -> None:
        for name, value in (
            ("assessment_id", self.assessment_id),
            ("candidate_id", self.candidate_id),
            ("signal_id", self.signal_id),
            ("level", self.level),
            ("assessed_at", self.assessed_at),
            ("scorer_version", self.scorer_version),
        ):
            if not isinstance(value, str) or not value.strip():
                raise ConfidenceAssessmentLedgerError(f"{name} is required")

        if (
            isinstance(self.score, bool)
            or not isinstance(self.score, (int, float))
            or not 0.0 <= float(self.score) <= 1.0
        ):
            raise ConfidenceAssessmentLedgerError("score must be between 0 and 1")

        if not isinstance(self.evidence_sufficient, bool):
            raise ConfidenceAssessmentLedgerError(
                "evidence_sufficient must be bool"
            )


class ConfidenceAssessmentLedger:
    def __init__(self, path: str | Path) -> None:
        self.path = Path(path)
        self.manifest_path = Path(str(self.path) + ".sha256")
        self._lock = RLock()
        self._records: dict[str, ConfidenceAssessmentRecord] = {}

        self._load_if_present()

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

    @staticmethod
    def _sha256(payload: bytes) -> str:
        return hashlib.sha256(payload).hexdigest()

    @staticmethod
    def _atomic_write(path: Path, payload: bytes) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)

        fd, temp_name = tempfile.mkstemp(
            prefix=path.name + ".",
            suffix=".tmp",
            dir=str(path.parent),
        )

        temp_path = Path(temp_name)

        try:
            with os.fdopen(fd, "wb") as handle:
                handle.write(payload)
                handle.flush()
                os.fsync(handle.fileno())

            os.replace(temp_path, path)

        except Exception:
            try:
                temp_path.unlink(missing_ok=True)
            except Exception:
                pass
            raise

    @staticmethod
    def _normalize_strings(values: tuple[str, ...]) -> tuple[str, ...]:
        return tuple(
            dict.fromkeys(
                value.strip()
                for value in values
                if isinstance(value, str) and value.strip()
            )
        )

    def _normalize_record(
        self, record: ConfidenceAssessmentRecord
    ) -> ConfidenceAssessmentRecord:
        return ConfidenceAssessmentRecord(
            assessment_id=record.assessment_id.strip(),
            candidate_id=record.candidate_id.strip(),
            signal_id=record.signal_id.strip(),
            score=float(record.score),
            level=record.level.strip(),
            evidence_sufficient=record.evidence_sufficient,
            reasons=self._normalize_strings(tuple(record.reasons)),
            blockers=self._normalize_strings(tuple(record.blockers)),
            evidence_refs=self._normalize_strings(tuple(record.evidence_refs)),
            assessed_at=record.assessed_at.strip(),
            scorer_version=record.scorer_version.strip(),
            metadata=dict(record.metadata or {}),
        )

    @staticmethod
    def _serialize_record(record: ConfidenceAssessmentRecord) -> dict[str, Any]:
        return {
            "assessment_id": record.assessment_id,
            "candidate_id": record.candidate_id,
            "signal_id": record.signal_id,
            "score": record.score,
            "level": record.level,
            "evidence_sufficient": record.evidence_sufficient,
            "reasons": list(record.reasons),
            "blockers": list(record.blockers),
            "evidence_refs": list(record.evidence_refs),
            "assessed_at": record.assessed_at,
            "scorer_version": record.scorer_version,
            "metadata": dict(record.metadata or {}),
        }

    def _payload(self) -> dict[str, Any]:
        records = [
            self._serialize_record(self._records[key])
            for key in sorted(self._records)
        ]

        return {
            "schema_version": SCHEMA_VERSION,
            "record_count": len(records),
            "records": records,
        }

    def _persist(self) -> None:
        raw = self._canonical_json_bytes(self._payload())
        digest = self._sha256(raw)

        self._atomic_write(self.path, raw)

        self._atomic_write(self.manifest_path, (digest + "\n").encode("ascii"))

    def append(
        self, record: ConfidenceAssessmentRecord
    ) -> ConfidenceAssessmentRecord:
        if not isinstance(record, ConfidenceAssessmentRecord):
            raise ConfidenceAssessmentLedgerError(
                "record must be ConfidenceAssessmentRecord"
            )

        normalized = self._normalize_record(record)

        with self._lock:
            existing = self._records.get(normalized.assessment_id)

            if existing is not None:
                if existing == normalized:
                    return existing

                raise ConfidenceAssessmentConflictError(
                    "assessment_id already exists with different content"
                )

            self._records[normalized.assessment_id] = normalized

            try:
                self._persist()
            except Exception:
                self._records.pop(normalized.assessment_id, None)
                raise

            return normalized

    def get(self, assessment_id: str) -> ConfidenceAssessmentRecord:
        if not isinstance(assessment_id, str) or not assessment_id.strip():
            raise ConfidenceAssessmentLedgerError("assessment_id is required")

        with self._lock:
            try:
                return self._records[assessment_id.strip()]
            except KeyError as exc:
                raise ConfidenceAssessmentLedgerError(
                    "confidence assessment not found"
                ) from exc

    def for_candidate(self, candidate_id: str) -> tuple[ConfidenceAssessmentRecord, ...]:
        if not isinstance(candidate_id, str) or not candidate_id.strip():
            raise ConfidenceAssessmentLedgerError("candidate_id is required")

        candidate_id = candidate_id.strip()

        with self._lock:
            return tuple(
                record
                for record in self._records.values()
                if record.candidate_id == candidate_id
            )

    def for_signal(self, signal_id: str) -> tuple[ConfidenceAssessmentRecord, ...]:
        if not isinstance(signal_id, str) or not signal_id.strip():
            raise ConfidenceAssessmentLedgerError("signal_id is required")

        signal_id = signal_id.strip()

        with self._lock:
            return tuple(
                record
                for record in self._records.values()
                if record.signal_id == signal_id
            )

    def all(self) -> tuple[ConfidenceAssessmentRecord, ...]:
        with self._lock:
            return tuple(self._records[key] for key in sorted(self._records))

    def count(self) -> int:
        with self._lock:
            return len(self._records)

    def _load_if_present(self) -> None:
        data_exists = self.path.exists()
        manifest_exists = self.manifest_path.exists()

        if not data_exists and not manifest_exists:
            return

        if data_exists != manifest_exists:
            raise ConfidenceAssessmentIntegrityError(
                "incomplete confidence ledger persistence pair"
            )

        raw = self.path.read_bytes()

        expected = (
            self.manifest_path.read_text(encoding="ascii").strip().lower()
        )

        actual = self._sha256(raw)

        if not expected or expected != actual:
            raise ConfidenceAssessmentIntegrityError(
                "confidence ledger integrity check failed"
            )

        try:
            payload = json.loads(raw.decode("utf-8"))
        except Exception as exc:
            raise ConfidenceAssessmentIntegrityError(
                "confidence ledger contains invalid JSON"
            ) from exc

        if not isinstance(payload, dict):
            raise ConfidenceAssessmentIntegrityError(
                "confidence ledger payload must be an object"
            )

        if payload.get("schema_version") != SCHEMA_VERSION:
            raise ConfidenceAssessmentIntegrityError(
                "unsupported confidence ledger schema"
            )

        records = payload.get("records")

        if not isinstance(records, list):
            raise ConfidenceAssessmentIntegrityError("records must be a list")

        record_count = payload.get("record_count")

        if (
            isinstance(record_count, bool)
            or not isinstance(record_count, int)
            or record_count != len(records)
        ):
            raise ConfidenceAssessmentIntegrityError("record_count mismatch")

        loaded: dict[str, ConfidenceAssessmentRecord] = {}

        for item in records:
            if not isinstance(item, dict):
                raise ConfidenceAssessmentIntegrityError(
                    "record must be an object"
                )

            try:
                record = ConfidenceAssessmentRecord(
                    assessment_id=item["assessment_id"],
                    candidate_id=item["candidate_id"],
                    signal_id=item["signal_id"],
                    score=item["score"],
                    level=item["level"],
                    evidence_sufficient=item["evidence_sufficient"],
                    reasons=tuple(item.get("reasons", [])),
                    blockers=tuple(item.get("blockers", [])),
                    evidence_refs=tuple(item.get("evidence_refs", [])),
                    assessed_at=item["assessed_at"],
                    scorer_version=item.get("scorer_version", "V0"),
                    metadata=item.get("metadata", {}),
                )

                record = self._normalize_record(record)

            except (
                KeyError,
                TypeError,
                ValueError,
                ConfidenceAssessmentLedgerError,
            ) as exc:
                raise ConfidenceAssessmentIntegrityError(
                    "invalid confidence assessment record"
                ) from exc

            if record.assessment_id in loaded:
                raise ConfidenceAssessmentIntegrityError(
                    "duplicate assessment_id"
                )

            loaded[record.assessment_id] = record

        self._records = loaded
