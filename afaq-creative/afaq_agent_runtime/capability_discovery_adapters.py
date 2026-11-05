"""Discovery source adapters.

Each adapter converts one kind of observation (test failure,
governance gap, architecture gap, runtime signal, external
requirement) into a CapabilityDiscoverySignal. Adapters are
observation-only: they never create capabilities, promote candidates,
assign trust, grant maturity, or grant production readiness.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Mapping

from .capability_discovery import (
    CapabilityDiscoverySignal,
    DiscoverySourceKind,
)


@dataclass(frozen=True, slots=True)
class TestFailureObservation:
    failure_id: str
    test_name: str
    failure_message: str
    suggested_capability_name: str
    suggested_capability_id: str = ""
    risk_class: str = "UNKNOWN"
    evidence_refs: tuple[str, ...] = ()
    metadata: Mapping[str, object] | None = None

    def __post_init__(self) -> None:
        if not self.failure_id.strip():
            raise ValueError("failure_id is required")

        if not self.test_name.strip():
            raise ValueError("test_name is required")

        if not self.failure_message.strip():
            raise ValueError("failure_message is required")

        if not self.suggested_capability_name.strip():
            raise ValueError("suggested_capability_name is required")


class TestFailureDiscoveryAdapter:
    """Converts an observed test failure into a discovery signal."""

    def to_signal(
        self, observation: TestFailureObservation
    ) -> CapabilityDiscoverySignal:
        signal_id = "TEST-FAILURE-" + observation.failure_id.strip().upper()

        metadata = {
            "failure_id": observation.failure_id,
            "test_name": observation.test_name,
            "adapter": "TestFailureDiscoveryAdapter",
            **dict(observation.metadata or {}),
        }

        return CapabilityDiscoverySignal(
            signal_id=signal_id,
            source_kind=DiscoverySourceKind.TEST_FAILURE,
            title="Capability gap from test failure: " + observation.test_name,
            description=observation.failure_message,
            suggested_name=observation.suggested_capability_name,
            suggested_capability_id=observation.suggested_capability_id or None,
            risk_class=observation.risk_class,
            evidence_refs=observation.evidence_refs,
            metadata=metadata,
        )


@dataclass(frozen=True, slots=True)
class GovernanceGapObservation:
    gap_id: str
    governance_area: str
    gap_description: str
    suggested_capability_name: str
    suggested_capability_id: str = ""
    risk_class: str = "UNKNOWN"
    evidence_refs: tuple[str, ...] = ()
    metadata: Mapping[str, object] | None = None

    def __post_init__(self) -> None:
        if not self.gap_id.strip():
            raise ValueError("gap_id is required")

        if not self.governance_area.strip():
            raise ValueError("governance_area is required")

        if not self.gap_description.strip():
            raise ValueError("gap_description is required")

        if not self.suggested_capability_name.strip():
            raise ValueError("suggested_capability_name is required")


class GovernanceGapDiscoveryAdapter:
    """Converts a governance gap into a discovery signal."""

    def to_signal(
        self, observation: GovernanceGapObservation
    ) -> CapabilityDiscoverySignal:
        signal_id = "GOV-GAP-" + observation.gap_id.strip().upper()

        metadata = {
            "gap_id": observation.gap_id,
            "governance_area": observation.governance_area,
            "adapter": "GovernanceGapDiscoveryAdapter",
            **dict(observation.metadata or {}),
        }

        return CapabilityDiscoverySignal(
            signal_id=signal_id,
            source_kind=DiscoverySourceKind.GOVERNANCE_GAP,
            title="Governance capability gap: " + observation.governance_area,
            description=observation.gap_description,
            suggested_name=observation.suggested_capability_name,
            suggested_capability_id=observation.suggested_capability_id or None,
            risk_class=observation.risk_class,
            evidence_refs=observation.evidence_refs,
            metadata=metadata,
        )


@dataclass(frozen=True, slots=True)
class ArchitectureGapObservation:
    gap_id: str
    architecture_area: str
    gap_description: str
    suggested_capability_name: str
    suggested_capability_id: str = ""
    risk_class: str = "UNKNOWN"
    evidence_refs: tuple[str, ...] = ()
    metadata: Mapping[str, object] | None = None

    def __post_init__(self) -> None:
        if not self.gap_id.strip():
            raise ValueError("gap_id is required")

        if not self.architecture_area.strip():
            raise ValueError("architecture_area is required")

        if not self.gap_description.strip():
            raise ValueError("gap_description is required")

        if not self.suggested_capability_name.strip():
            raise ValueError("suggested_capability_name is required")


class ArchitectureGapDiscoveryAdapter:
    """Converts an observed architecture gap into a discovery signal."""

    def to_signal(
        self, observation: ArchitectureGapObservation
    ) -> CapabilityDiscoverySignal:
        signal_id = "ARCH-GAP-" + observation.gap_id.strip().upper()

        metadata = {
            "gap_id": observation.gap_id,
            "architecture_area": observation.architecture_area,
            "adapter": "ArchitectureGapDiscoveryAdapter",
            **dict(observation.metadata or {}),
        }

        return CapabilityDiscoverySignal(
            signal_id=signal_id,
            source_kind=DiscoverySourceKind.ARCHITECTURE_GAP,
            title="Architecture capability gap: " + observation.architecture_area,
            description=observation.gap_description,
            suggested_name=observation.suggested_capability_name,
            suggested_capability_id=observation.suggested_capability_id or None,
            risk_class=observation.risk_class,
            evidence_refs=observation.evidence_refs,
            metadata=metadata,
        )


@dataclass(frozen=True, slots=True)
class RuntimeSignalObservation:
    signal_id: str
    runtime_component: str
    signal_description: str
    suggested_capability_name: str
    suggested_capability_id: str = ""
    risk_class: str = "UNKNOWN"
    evidence_refs: tuple[str, ...] = ()
    metadata: Mapping[str, object] | None = None

    def __post_init__(self) -> None:
        if not self.signal_id.strip():
            raise ValueError("signal_id is required")

        if not self.runtime_component.strip():
            raise ValueError("runtime_component is required")

        if not self.signal_description.strip():
            raise ValueError("signal_description is required")

        if not self.suggested_capability_name.strip():
            raise ValueError("suggested_capability_name is required")


class RuntimeSignalDiscoveryAdapter:
    """Converts an observed runtime signal into a discovery signal."""

    def to_signal(
        self, observation: RuntimeSignalObservation
    ) -> CapabilityDiscoverySignal:
        discovery_signal_id = "RUNTIME-" + observation.signal_id.strip().upper()

        metadata = {
            "runtime_signal_id": observation.signal_id,
            "runtime_component": observation.runtime_component,
            "adapter": "RuntimeSignalDiscoveryAdapter",
            **dict(observation.metadata or {}),
        }

        return CapabilityDiscoverySignal(
            signal_id=discovery_signal_id,
            source_kind=DiscoverySourceKind.RUNTIME_SIGNAL,
            title="Runtime capability signal: " + observation.runtime_component,
            description=observation.signal_description,
            suggested_name=observation.suggested_capability_name,
            suggested_capability_id=observation.suggested_capability_id or None,
            risk_class=observation.risk_class,
            evidence_refs=observation.evidence_refs,
            metadata=metadata,
        )


@dataclass(frozen=True, slots=True)
class ExternalRequirementObservation:
    requirement_id: str
    source_name: str
    requirement_description: str
    suggested_capability_name: str
    suggested_capability_id: str = ""
    risk_class: str = "UNKNOWN"
    evidence_refs: tuple[str, ...] = ()
    metadata: Mapping[str, object] | None = None

    def __post_init__(self) -> None:
        if not self.requirement_id.strip():
            raise ValueError("requirement_id is required")

        if not self.source_name.strip():
            raise ValueError("source_name is required")

        if not self.requirement_description.strip():
            raise ValueError("requirement_description is required")

        if not self.suggested_capability_name.strip():
            raise ValueError("suggested_capability_name is required")


class ExternalRequirementDiscoveryAdapter:
    """Converts an observed external requirement into a discovery signal."""

    def to_signal(
        self, observation: ExternalRequirementObservation
    ) -> CapabilityDiscoverySignal:
        discovery_signal_id = "EXT-REQ-" + observation.requirement_id.strip().upper()

        metadata = {
            "external_requirement_id": observation.requirement_id,
            "external_source_name": observation.source_name,
            "adapter": "ExternalRequirementDiscoveryAdapter",
            **dict(observation.metadata or {}),
        }

        return CapabilityDiscoverySignal(
            signal_id=discovery_signal_id,
            source_kind=DiscoverySourceKind.EXTERNAL_REQUIREMENT,
            title="External capability requirement: " + observation.source_name,
            description=observation.requirement_description,
            suggested_name=observation.suggested_capability_name,
            suggested_capability_id=observation.suggested_capability_id or None,
            risk_class=observation.risk_class,
            evidence_refs=observation.evidence_refs,
            metadata=metadata,
        )
