"""Persistent append-only discovery signal ledger.

Records the signal -> candidate lineage so it survives restart.
SHA-256 integrity verification; corrupted or tampered ledgers fail
closed. Integrity detection, not authenticity.
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path


@dataclass(frozen=True, slots=True)
class DiscoverySignalRecord:
    signal_id: str
    candidate_id: str
    source_kind: str
    recorded_at: datetime
    evidence_refs: tuple[str, ...] = ()

    def __post_init__(self) -> None:
        if not self.signal_id.strip():
            raise ValueError("signal_id is required")

        if not self.candidate_id.strip():
            raise ValueError("candidate_id is required")

        if not self.source_kind.strip():
            raise ValueError("source_kind is required")

        if self.recorded_at.tzinfo is None:
            raise ValueError("recorded_at must be timezone-aware")


class DiscoverySignalLedger:
    SCHEMA_VERSION = "1.0"

    def __init__(self, path: Path) -> None:
        self.path = Path(path)
        self.integrity_path = self.path.with_suffix(
            self.path.suffix + ".integrity.json"
        )

    @staticmethod
    def _serialize(record: DiscoverySignalRecord) -> dict:
        return {
            "signal_id": record.signal_id,
            "candidate_id": record.candidate_id,
            "source_kind": record.source_kind,
            "recorded_at": record.recorded_at.isoformat(),
            "evidence_refs": list(record.evidence_refs),
        }

    @staticmethod
    def _deserialize(raw: dict) -> DiscoverySignalRecord:
        return DiscoverySignalRecord(
            signal_id=str(raw["signal_id"]),
            candidate_id=str(raw["candidate_id"]),
            source_kind=str(raw["source_kind"]),
            recorded_at=datetime.fromisoformat(raw["recorded_at"]),
            evidence_refs=tuple(raw.get("evidence_refs", ())),
        )

    def _empty_payload(self) -> dict:
        return {
            "schema_version": self.SCHEMA_VERSION,
            "records": [],
        }

    def _write_integrity(self) -> None:
        data = self.path.read_bytes()

        manifest = {
            "schema_version": self.SCHEMA_VERSION,
            "algorithm": "sha256",
            "sha256": hashlib.sha256(data).hexdigest(),
            "size": len(data),
        }

        temp = self.integrity_path.with_suffix(
            self.integrity_path.suffix + ".tmp"
        )

        temp.write_text(
            json.dumps(manifest, indent=2, sort_keys=True),
            encoding="utf-8",
        )

        temp.replace(self.integrity_path)

    def verify_integrity(self) -> bool:
        if not self.path.exists():
            return False

        if not self.integrity_path.exists():
            return False

        try:
            manifest = json.loads(
                self.integrity_path.read_text(encoding="utf-8")
            )
        except Exception:
            return False

        if manifest.get("schema_version") != self.SCHEMA_VERSION:
            return False

        if manifest.get("algorithm") != "sha256":
            return False

        data = self.path.read_bytes()

        if manifest.get("size") != len(data):
            return False

        actual = hashlib.sha256(data).hexdigest()

        return actual == manifest.get("sha256")

    def _read_payload(self) -> dict:
        if not self.path.exists():
            return self._empty_payload()

        if not self.verify_integrity():
            raise ValueError(
                "discovery signal ledger integrity verification failed"
            )

        payload = json.loads(self.path.read_text(encoding="utf-8"))

        if payload.get("schema_version") != self.SCHEMA_VERSION:
            raise ValueError("unsupported discovery signal ledger schema")

        records = payload.get("records")

        if not isinstance(records, list):
            raise ValueError("invalid discovery signal ledger records")

        return payload

    def append(self, record: DiscoverySignalRecord) -> None:
        payload = self._read_payload()

        for existing in payload["records"]:
            if existing.get("signal_id") == record.signal_id:
                raise ValueError(
                    f"discovery signal already recorded: {record.signal_id}"
                )

        payload["records"].append(self._serialize(record))

        self.path.parent.mkdir(parents=True, exist_ok=True)

        temp = self.path.with_suffix(self.path.suffix + ".tmp")

        temp.write_text(
            json.dumps(payload, indent=2, sort_keys=True),
            encoding="utf-8",
        )

        temp.replace(self.path)
        self._write_integrity()

    def all(self) -> tuple[DiscoverySignalRecord, ...]:
        payload = self._read_payload()

        return tuple(self._deserialize(raw) for raw in payload["records"])

    def get(self, signal_id: str) -> DiscoverySignalRecord:
        for record in self.all():
            if record.signal_id == signal_id:
                return record

        raise KeyError(f"unknown discovery signal: {signal_id}")
