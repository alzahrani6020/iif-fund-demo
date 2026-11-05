"""Append-only persistent ledger for capability invalidations.

Transition history is preserved with monotonic sequence numbers;
duplicate consecutive state is rejected; the persisted ledger carries
SHA-256 integrity protection and corrupted/tampered ledgers fail
closed.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import datetime
import hashlib
import json
from pathlib import Path

from .capability_contracts import CapabilityMaturity
from .capability_invalidation import (
    CapabilityInvalidationRecord,
    InvalidationState,
)


@dataclass(frozen=True, slots=True)
class InvalidationLedgerEvent:
    sequence: int
    invalidation_id: str
    capability_id: str
    state: InvalidationState
    reason: str
    timestamp: datetime
    evidence_refs: tuple[str, ...]
    previous_maturity: CapabilityMaturity


class InvalidationLedger:
    SCHEMA_VERSION = "1.0"

    def __init__(self, path: str | Path) -> None:
        self.path = Path(path).resolve()
        self.path.parent.mkdir(parents=True, exist_ok=True)

    @property
    def integrity_path(self) -> Path:
        return self.path.with_suffix(self.path.suffix + ".integrity.json")

    def _hash(self) -> str:
        digest = hashlib.sha256()

        with self.path.open("rb") as handle:
            for chunk in iter(lambda: handle.read(1024 * 1024), b""):
                digest.update(chunk)

        return digest.hexdigest()

    def _write_integrity(self) -> None:
        payload = {
            "schema_version": self.SCHEMA_VERSION,
            "algorithm": "SHA-256",
            "sha256": self._hash(),
            "size_bytes": self.path.stat().st_size,
        }

        temp = self.integrity_path.with_suffix(self.integrity_path.suffix + ".tmp")

        temp.write_text(
            json.dumps(payload, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )

        temp.replace(self.integrity_path)

    def verify_integrity(self) -> bool:
        if not self.path.is_file():
            return False

        if not self.integrity_path.is_file():
            return False

        try:
            manifest = json.loads(
                self.integrity_path.read_text(encoding="utf-8-sig")
            )
        except (OSError, json.JSONDecodeError):
            return False

        if manifest.get("schema_version") != self.SCHEMA_VERSION:
            return False

        if manifest.get("algorithm") != "SHA-256":
            return False

        expected = manifest.get("sha256")

        if not isinstance(expected, str) or len(expected) != 64:
            return False

        try:
            int(expected, 16)
        except ValueError:
            return False

        size = manifest.get("size_bytes")

        if not isinstance(size, int) or isinstance(size, bool) or size < 0:
            return False

        if self.path.stat().st_size != size:
            return False

        return self._hash() == expected

    def _serialize(self, event: InvalidationLedgerEvent) -> dict:
        item = asdict(event)

        item["state"] = event.state.value
        item["timestamp"] = event.timestamp.isoformat()
        item["evidence_refs"] = list(event.evidence_refs)
        item["previous_maturity"] = event.previous_maturity.value

        return item

    def _deserialize(self, item: dict) -> InvalidationLedgerEvent:
        return InvalidationLedgerEvent(
            sequence=int(item["sequence"]),
            invalidation_id=item["invalidation_id"],
            capability_id=item["capability_id"],
            state=InvalidationState(item["state"]),
            reason=item["reason"],
            timestamp=datetime.fromisoformat(item["timestamp"]),
            evidence_refs=tuple(item.get("evidence_refs", ())),
            previous_maturity=CapabilityMaturity(item["previous_maturity"]),
        )

    def load_events(self) -> tuple[InvalidationLedgerEvent, ...]:
        if not self.path.exists():
            return ()

        if not self.verify_integrity():
            raise ValueError(
                "invalidation ledger integrity verification failed"
            )

        payload = json.loads(self.path.read_text(encoding="utf-8-sig"))

        if payload.get("schema_version") != self.SCHEMA_VERSION:
            raise ValueError("unsupported invalidation ledger schema")

        items = payload.get("events")

        if not isinstance(items, list):
            raise ValueError("invalid invalidation ledger events")

        events = tuple(self._deserialize(item) for item in items)

        for expected_sequence, event in enumerate(events, start=1):
            if event.sequence != expected_sequence:
                raise ValueError("invalid invalidation ledger sequence")

        return events

    def append(self, record: CapabilityInvalidationRecord) -> InvalidationLedgerEvent:
        events = list(self.load_events())

        matching = [
            event
            for event in events
            if event.invalidation_id == record.invalidation_id
        ]

        if matching and matching[-1].state is record.state:
            raise ValueError("duplicate consecutive invalidation state")

        event = InvalidationLedgerEvent(
            sequence=len(events) + 1,
            invalidation_id=record.invalidation_id,
            capability_id=record.capability_id,
            state=record.state,
            reason=record.reason,
            timestamp=record.updated_at,
            evidence_refs=record.evidence_refs,
            previous_maturity=record.previous_maturity,
        )

        events.append(event)

        payload = {
            "schema_version": self.SCHEMA_VERSION,
            "event_count": len(events),
            "events": [self._serialize(item) for item in events],
        }

        temp = self.path.with_suffix(self.path.suffix + ".tmp")

        temp.write_text(
            json.dumps(
                payload,
                indent=2,
                ensure_ascii=False,
                sort_keys=True,
            )
            + "\n",
            encoding="utf-8",
        )

        temp.replace(self.path)

        self._write_integrity()

        return event
