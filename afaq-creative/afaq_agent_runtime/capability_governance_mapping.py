"""Capability-to-governance mapping registry.

Maps a capability id to the governance report and evidence ids that
support it. Reconciliation and the truth bridge consume these mappings;
no capability receives governance credit without one.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class CapabilityGovernanceMapping:
    capability_id: str
    report_ids: tuple[str, ...] = ()
    evidence_ids: tuple[str, ...] = ()

    def __post_init__(self) -> None:
        if not self.capability_id.strip():
            raise ValueError("capability_id is required")


class CapabilityGovernanceMappingRegistry:
    def __init__(self) -> None:
        self._mappings: dict[str, CapabilityGovernanceMapping] = {}

    def register(self, mapping: CapabilityGovernanceMapping) -> None:
        if mapping.capability_id in self._mappings:
            raise ValueError(
                f"mapping already exists: {mapping.capability_id}"
            )

        self._mappings[mapping.capability_id] = mapping

    def get(self, capability_id: str) -> CapabilityGovernanceMapping:
        try:
            return self._mappings[capability_id]
        except KeyError:
            raise KeyError(capability_id) from None

    def exists(self, capability_id: str) -> bool:
        return capability_id in self._mappings

    def all(self) -> tuple[CapabilityGovernanceMapping, ...]:
        return tuple(self._mappings.values())
