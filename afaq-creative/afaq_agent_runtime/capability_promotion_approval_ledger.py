"""Persistent append-only ledger for promotion approvals.

Existing approval ids cannot be overwritten. Integrity is SHA-256
tamper detection, not cryptographic authenticity.
"""

from __future__ import annotations

import hashlib
import json
from datetime import datetime
from pathlib import Path

from .capability_promotion_approval import (
    PromotionApprovalRecord,
    PromotionDecision,
)


class PromotionApprovalLedger:
    SCHEMA_VERSION = "1.0"

    def __init__(self, path: str | Path) -> None:
        self.path = Path(path).resolve()
        self.path.parent.mkdir(parents=True, exist_ok=True)

    @property
    def integrity_path(self) -> Path:
        return self.path.with_suffix(self.path.suffix + ".integrity.json")

    @staticmethod
    def _serialize(record: PromotionApprovalRecord) -> dict[str, object]:
        return {
            "approval_id": record.approval_id,
            "candidate_id": record.candidate_id,
            "decision": record.decision.value,
            "approver_identity": record.approver_identity,
            "approved_at": record.approved_at.isoformat(),
            "reason": record.reason,
            "scope": record.scope,
            "evidence_refs": list(record.evidence_refs),
            "constraints": list(record.constraints),
            "expires_at": (
                record.expires_at.isoformat()
                if record.expires_at is not None
                else None
            ),
            "metadata": dict(record.metadata or {}),
        }

    @staticmethod
    def _deserialize(item: dict[str, object]) -> PromotionApprovalRecord:
        return PromotionApprovalRecord(
            approval_id=str(item["approval_id"]),
            candidate_id=str(item["candidate_id"]),
            decision=PromotionDecision(str(item["decision"])),
            approver_identity=str(item["approver_identity"]),
            approved_at=datetime.fromisoformat(str(item["approved_at"])),
            reason=str(item["reason"]),
            scope=str(item["scope"]),
            evidence_refs=tuple(
                str(x) for x in item.get("evidence_refs", [])
            ),
            constraints=tuple(
                str(x) for x in item.get("constraints", [])
            ),
            expires_at=(
                datetime.fromisoformat(str(item["expires_at"]))
                if item.get("expires_at")
                else None
            ),
            metadata=dict(item.get("metadata", {})),
        )

    def _sha256(self) -> str:
        digest = hashlib.sha256()

        with self.path.open("rb") as handle:
            for chunk in iter(lambda: handle.read(1024 * 1024), b""):
                digest.update(chunk)

        return digest.hexdigest()

    def _write_integrity(self) -> None:
        manifest = {
            "schema_version": self.SCHEMA_VERSION,
            "algorithm": "SHA-256",
            "sha256": self._sha256(),
            "size_bytes": self.path.stat().st_size,
        }

        temp = self.integrity_path.with_suffix(self.integrity_path.suffix + ".tmp")

        temp.write_text(
            json.dumps(manifest, indent=2, sort_keys=True) + "\n",
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

        expected_hash = manifest.get("sha256")
        expected_size = manifest.get("size_bytes")

        if not isinstance(expected_hash, str) or len(expected_hash) != 64:
            return False

        try:
            int(expected_hash, 16)
        except ValueError:
            return False

        if (
            not isinstance(expected_size, int)
            or isinstance(expected_size, bool)
            or expected_size < 0
        ):
            return False

        if self.path.stat().st_size != expected_size:
            return False

        return self._sha256() == expected_hash

    def _read_payload(self) -> dict[str, object]:
        if not self.path.exists():
            return {
                "schema_version": self.SCHEMA_VERSION,
                "records": [],
            }

        if not self.verify_integrity():
            raise ValueError("approval ledger integrity verification failed")

        payload = json.loads(self.path.read_text(encoding="utf-8-sig"))

        if payload.get("schema_version") != self.SCHEMA_VERSION:
            raise ValueError("unsupported approval ledger schema")

        records = payload.get("records")

        if not isinstance(records, list):
            raise ValueError("invalid approval ledger records")

        return payload

    def append(self, record: PromotionApprovalRecord) -> None:
        payload = self._read_payload()

        records = payload["records"]

        if any(
            item.get("approval_id") == record.approval_id for item in records
        ):
            raise ValueError(f"approval_id already exists: {record.approval_id}")

        records.append(self._serialize(record))

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

    def all(self) -> tuple[PromotionApprovalRecord, ...]:
        payload = self._read_payload()

        return tuple(self._deserialize(item) for item in payload["records"])

    def get(self, approval_id: str) -> PromotionApprovalRecord:
        for record in self.all():
            if record.approval_id == approval_id:
                return record

        raise KeyError(f"unknown approval: {approval_id}")
