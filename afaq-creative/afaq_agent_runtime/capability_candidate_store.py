"""Persistent candidate storage with SHA-256 integrity.

Candidates remain pre-capability records: loading a candidate store
never promotes any candidate into the capability registry.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from .capability_candidates import (
    CapabilityCandidate,
    CapabilityCandidateOrigin,
    CapabilityCandidateRegistry,
    CapabilityCandidateState,
)


class CapabilityCandidateStore:
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
        payload = {
            "schema_version": self.SCHEMA_VERSION,
            "algorithm": "SHA-256",
            "sha256": self._sha256(),
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

    def save(self, registry: CapabilityCandidateRegistry) -> None:
        records = []

        for candidate in registry.all():
            item = {
                "candidate_id": candidate.candidate_id,
                "name": candidate.name,
                "origin": candidate.origin.value,
                "state": candidate.state.value,
                "description": candidate.description,
                "proposed_capability_id": candidate.proposed_capability_id,
                "risk_class": candidate.risk_class,
                "trust_score": candidate.trust_score,
            }
            item["evidence_refs"] = list(candidate.evidence_refs)
            item["report_refs"] = list(candidate.report_refs)
            item["parent_candidate_ids"] = list(candidate.parent_candidate_ids)
            item["dependency_candidate_ids"] = list(
                candidate.dependency_candidate_ids
            )
            item["metadata"] = dict(candidate.metadata)

            records.append(item)

        payload = {
            "schema_version": self.SCHEMA_VERSION,
            "record_count": len(records),
            "candidates": records,
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

    def load(self) -> CapabilityCandidateRegistry:
        registry = CapabilityCandidateRegistry()

        if not self.path.exists():
            return registry

        if not self.verify_integrity():
            raise ValueError("candidate store integrity verification failed")

        payload = json.loads(self.path.read_text(encoding="utf-8-sig"))

        if payload.get("schema_version") != self.SCHEMA_VERSION:
            raise ValueError("unsupported candidate store schema")

        items = payload.get("candidates")

        if not isinstance(items, list):
            raise ValueError("invalid candidate store payload")

        pending = {item["candidate_id"]: item for item in items}

        while pending:
            progressed = False

            for candidate_id in list(pending.keys()):
                item = pending[candidate_id]

                parents = tuple(item.get("parent_candidate_ids", ()))
                dependencies = tuple(item.get("dependency_candidate_ids", ()))

                if not all(registry.exists(x) for x in parents):
                    continue

                if not all(registry.exists(x) for x in dependencies):
                    continue

                candidate = CapabilityCandidate(
                    candidate_id=item["candidate_id"],
                    name=item["name"],
                    origin=CapabilityCandidateOrigin(item["origin"]),
                    state=CapabilityCandidateState(item["state"]),
                    description=item.get("description", ""),
                    proposed_capability_id=item.get("proposed_capability_id"),
                    evidence_refs=tuple(item.get("evidence_refs", ())),
                    report_refs=tuple(item.get("report_refs", ())),
                    parent_candidate_ids=parents,
                    dependency_candidate_ids=dependencies,
                    risk_class=item.get("risk_class", "UNKNOWN"),
                    trust_score=float(item.get("trust_score", 0.0)),
                    metadata=item.get("metadata", {}),
                )

                registry.register(candidate)

                del pending[candidate_id]

                progressed = True

            if not progressed:
                raise ValueError(
                    "cannot resolve candidate graph: "
                    + ", ".join(sorted(pending.keys()))
                )

        return registry
