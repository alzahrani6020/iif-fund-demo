"""Persistent store for candidate role assignments.

Role assignments survive restart; duplicate candidate assignments
remain blocked by the registry. Tampered or missing-manifest stores
fail closed (SHA-256 integrity verification).
"""

from __future__ import annotations

import hashlib
import json
from datetime import datetime
from pathlib import Path

from .capability_role_assignment import (
    CandidateRoleAssignment,
    CandidateRoleAssignmentRegistry,
)


class CandidateRoleAssignmentStore:
    SCHEMA_VERSION = "1.0"

    def __init__(self, path: str | Path) -> None:
        self.path = Path(path).resolve()
        self.path.parent.mkdir(parents=True, exist_ok=True)

    @property
    def integrity_path(self) -> Path:
        return self.path.with_suffix(self.path.suffix + ".integrity.json")

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

    @staticmethod
    def _serialize(assignment: CandidateRoleAssignment) -> dict:
        return {
            "candidate_id": assignment.candidate_id,
            "generator_identity": assignment.generator_identity,
            "evaluator_identity": assignment.evaluator_identity,
            "verifier_identity": assignment.verifier_identity,
            "assigned_at": assignment.assigned_at.isoformat(),
            "evidence_refs": list(assignment.evidence_refs),
        }

    @staticmethod
    def _deserialize(raw: dict) -> CandidateRoleAssignment:
        return CandidateRoleAssignment(
            candidate_id=str(raw["candidate_id"]),
            generator_identity=str(raw["generator_identity"]),
            evaluator_identity=str(raw["evaluator_identity"]),
            verifier_identity=(
                str(raw["verifier_identity"])
                if raw.get("verifier_identity") is not None
                else None
            ),
            assigned_at=datetime.fromisoformat(str(raw["assigned_at"])),
            evidence_refs=tuple(str(x) for x in raw.get("evidence_refs", ())),
        )

    def save(self, registry: CandidateRoleAssignmentRegistry) -> None:
        records = [self._serialize(item) for item in registry.all()]

        payload = {
            "schema_version": self.SCHEMA_VERSION,
            "record_count": len(records),
            "assignments": records,
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

    def load(self) -> CandidateRoleAssignmentRegistry:
        registry = CandidateRoleAssignmentRegistry()

        if not self.path.exists():
            return registry

        if not self.verify_integrity():
            raise ValueError(
                "candidate role assignment store integrity verification failed"
            )

        payload = json.loads(self.path.read_text(encoding="utf-8-sig"))

        if payload.get("schema_version") != self.SCHEMA_VERSION:
            raise ValueError(
                "unsupported candidate role assignment store schema"
            )

        items = payload.get("assignments")

        if not isinstance(items, list):
            raise ValueError("invalid candidate role assignment payload")

        if payload.get("record_count") != len(items):
            raise ValueError("candidate role assignment record_count mismatch")

        for item in items:
            registry.register(self._deserialize(item))

        return registry
