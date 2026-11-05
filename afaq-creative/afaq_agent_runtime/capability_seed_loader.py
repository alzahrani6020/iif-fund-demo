"""Capability seed catalog loader.

Loads an initial capability catalog into the capability registry. The
seed catalog is a bootstrap input, not a capability-count limit: new
capabilities may be registered after seed loading without modifying
the seed file. The catalog path is project-relative and configurable.
"""

from __future__ import annotations

import json
from pathlib import Path

from .capability_contracts import (
    CapabilityClass,
    CapabilityMaturity,
    CapabilityOrigin,
    CapabilityRecord,
)
from .capability_registry import CapabilityRegistry


class CapabilitySeedLoader:
    def __init__(
        self,
        *,
        project_root: str | Path,
        seed_catalog_path: str | Path | None = None,
    ) -> None:
        self.project_root = Path(project_root).resolve()
        self.seed_catalog_path = Path(
            seed_catalog_path
        ) if seed_catalog_path is not None else (
            self.project_root / "var" / "capability" / "capability-seed.json"
        )

    def load_seed_catalog(self, registry: CapabilityRegistry) -> int:
        data = json.loads(
            self.seed_catalog_path.read_text(encoding="utf-8-sig")
        )

        count = 0

        for item in data.get("capabilities", []):
            capability_id = str(item["capability_id"]).strip()

            if registry.exists(capability_id):
                raise ValueError(f"duplicate seed capability: {capability_id}")

            registry.register(
                CapabilityRecord(
                    capability_id=capability_id,
                    name=str(item["name"]),
                    classification=CapabilityClass(item["classification"]),
                    maturity=CapabilityMaturity(item["maturity"]),
                    origin=CapabilityOrigin.MANUAL,
                    description="Imported from capability seed catalog",
                    production_ready=bool(item.get("production_ready", False)),
                    version="V1",
                    metadata={
                        "seed_catalog": "CAPABILITY_SEED_CATALOG_V1",
                        "seed": True,
                    },
                )
            )

            count += 1

        return count
