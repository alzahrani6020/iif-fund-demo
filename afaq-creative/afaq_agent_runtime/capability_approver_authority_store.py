"""Persistent store for the approver authority policy.

Authority assignments, inactive status, and scopes survive restart.
Duplicate identities remain blocked by the policy, and tampered or
missing-manifest stores fail closed (SHA-256).
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from .capability_approver_authority import (
    ApproverAuthority,
    ApproverAuthorityPolicy,
    AuthorityLevel,
)


class ApproverAuthorityStore:
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
    def _serialize(authority: ApproverAuthority) -> dict:
        return {
            "approver_identity": authority.approver_identity,
            "authority_level": authority.authority_level.value,
            "scopes": list(authority.scopes),
            "active": authority.active,
        }

    @staticmethod
    def _deserialize(raw: dict) -> ApproverAuthority:
        return ApproverAuthority(
            approver_identity=str(raw["approver_identity"]),
            authority_level=AuthorityLevel(str(raw["authority_level"])),
            scopes=tuple(str(x) for x in raw.get("scopes", ())),
            active=bool(raw.get("active", True)),
        )

    def save(self, policy: ApproverAuthorityPolicy) -> None:
        authorities = [
            self._serialize(item) for item in policy._authorities.values()
        ]

        payload = {
            "schema_version": self.SCHEMA_VERSION,
            "record_count": len(authorities),
            "authorities": authorities,
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

    def load(self) -> ApproverAuthorityPolicy:
        policy = ApproverAuthorityPolicy()

        if not self.path.exists():
            return policy

        if not self.verify_integrity():
            raise ValueError(
                "approver authority store integrity verification failed"
            )

        payload = json.loads(self.path.read_text(encoding="utf-8-sig"))

        if payload.get("schema_version") != self.SCHEMA_VERSION:
            raise ValueError("unsupported approver authority store schema")

        items = payload.get("authorities")

        if not isinstance(items, list):
            raise ValueError("invalid approver authority payload")

        if payload.get("record_count") != len(items):
            raise ValueError("approver authority record_count mismatch")

        for item in items:
            policy.register(self._deserialize(item))

        return policy
