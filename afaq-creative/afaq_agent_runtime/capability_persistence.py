"""Persistent JSON store for the capability registry.

Deterministic (sorted-keys) JSON persistence with SHA-256 integrity
manifests. Loading rebuilds the registry honouring parent/dependency
ordering and the duplicate protection enforced at registration time.
The store never grants maturity or trust on its own.
"""

from __future__ import annotations

import json
from dataclasses import asdict
from pathlib import Path

from .capability_contracts import (
    CapabilityClass,
    CapabilityMaturity,
    CapabilityOrigin,
    CapabilityRecord,
)
from .capability_registry import CapabilityRegistry
from .capability_store_integrity import CapabilityStoreIntegrity


class CapabilityStore:
    def __init__(self, path: str | Path) -> None:
        self.path = Path(path).resolve()
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.integrity = CapabilityStoreIntegrity()

    def save(self, registry: CapabilityRegistry) -> None:
        records = []

        for record in registry.all():
            item = asdict(record)

            item["classification"] = record.classification.value
            item["maturity"] = record.maturity.value
            item["origin"] = record.origin.value

            item["parent_ids"] = list(record.parent_ids)
            item["dependency_ids"] = list(record.dependency_ids)
            item["child_ids"] = list(record.child_ids)
            item["evidence_refs"] = list(record.evidence_refs)
            item["report_refs"] = list(record.report_refs)

            records.append(item)

        payload = {
            "schema_version": "1.0",
            "record_count": len(records),
            "capabilities": records,
        }

        temp = self.path.with_suffix(self.path.suffix + ".tmp")

        temp.write_text(
            json.dumps(
                payload,
                indent=2,
                ensure_ascii=False,
                sort_keys=True,
                default=str,
            )
            + "\n",
            encoding="utf-8",
        )

        temp.replace(self.path)

        self.integrity.write_manifest(self.path)

    def load(self) -> CapabilityRegistry:
        registry = CapabilityRegistry()

        if not self.path.exists():
            return registry

        if not self.integrity.verify(self.path):
            raise ValueError(
                "capability store integrity verification failed"
            )

        payload = json.loads(
            self.path.read_text(encoding="utf-8-sig")
        )

        items = payload.get("capabilities", [])

        pending = {item["capability_id"]: item for item in items}

        # Load only when parents/dependencies are already available.
        while pending:
            progressed = False

            for capability_id in list(pending.keys()):
                item = pending[capability_id]

                parents = tuple(item.get("parent_ids", ()))
                dependencies = tuple(item.get("dependency_ids", ()))

                if not all(registry.exists(x) for x in parents):
                    continue

                if not all(registry.exists(x) for x in dependencies):
                    continue

                record = CapabilityRecord(
                    capability_id=item["capability_id"],
                    name=item["name"],
                    classification=CapabilityClass(item["classification"]),
                    maturity=CapabilityMaturity(item["maturity"]),
                    origin=CapabilityOrigin(item["origin"]),
                    description=item.get("description", ""),
                    parent_ids=parents,
                    dependency_ids=dependencies,
                    # child_ids are reconstructed by register().
                    evidence_refs=tuple(item.get("evidence_refs", ())),
                    report_refs=tuple(item.get("report_refs", ())),
                    trust_score=float(item.get("trust_score", 0.0)),
                    production_ready=bool(item.get("production_ready", False)),
                    version=item.get("version", "V0"),
                    metadata=item.get("metadata", {}),
                )

                registry.register(record)

                del pending[capability_id]

                progressed = True

            if not progressed:
                unresolved = ", ".join(sorted(pending.keys()))

                raise ValueError(
                    "cannot resolve capability graph: " + unresolved
                )

        return registry
