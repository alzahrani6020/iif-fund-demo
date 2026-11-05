"""Discovery confidence adapter.

Converts a CapabilityDiscoverySignal into DiscoveryConfidenceInput
using explicit data only. It grants nothing: no maturity, trust,
approval, authority, or production readiness.
"""

from __future__ import annotations

from typing import Any, Mapping

from .capability_discovery import (
    CapabilityDiscoverySignal,
    DiscoverySourceKind,
)
from .capability_confidence_scoring import DiscoveryConfidenceInput


class DiscoveryConfidenceAdapterError(ValueError):
    """Invalid discovery signal confidence adaptation."""


class DiscoveryConfidenceAdapter:
    _TRUE_VALUES = frozenset({"1", "true", "yes", "on"})

    _FALSE_VALUES = frozenset({"0", "false", "no", "off", ""})

    @staticmethod
    def _metadata(signal: CapabilityDiscoverySignal) -> Mapping[str, Any]:
        metadata = signal.metadata

        if metadata is None:
            return {}

        if not isinstance(metadata, Mapping):
            raise DiscoveryConfidenceAdapterError(
                "signal.metadata must be a mapping"
            )

        return metadata

    @classmethod
    def _bool_value(
        cls, metadata: Mapping[str, Any], key: str, *, default: bool = False
    ) -> bool:
        if key not in metadata:
            return default

        value = metadata[key]

        if isinstance(value, bool):
            return value

        if isinstance(value, int) and not isinstance(value, bool):
            if value == 1:
                return True

            if value == 0:
                return False

        if isinstance(value, str):
            normalized = value.strip().lower()

            if normalized in cls._TRUE_VALUES:
                return True

            if normalized in cls._FALSE_VALUES:
                return False

        raise DiscoveryConfidenceAdapterError(
            f"metadata[{key!r}] must be boolean"
        )

    @staticmethod
    def _count_value(
        metadata: Mapping[str, Any], key: str, *, default: int = 0
    ) -> int:
        if key not in metadata:
            return default

        value = metadata[key]

        if (
            isinstance(value, bool)
            or not isinstance(value, int)
            or value < 0
        ):
            raise DiscoveryConfidenceAdapterError(
                f"metadata[{key!r}] must be a non-negative integer"
            )

        return value

    @staticmethod
    def _source_name(source_kind: Any) -> str:
        value = getattr(source_kind, "value", source_kind)

        return str(value).strip().upper()

    def adapt(self, signal: CapabilityDiscoverySignal) -> DiscoveryConfidenceInput:
        if not isinstance(signal, CapabilityDiscoverySignal):
            raise DiscoveryConfidenceAdapterError(
                "signal must be CapabilityDiscoverySignal"
            )

        metadata = self._metadata(signal)

        evidence_count = len(tuple(signal.evidence_refs))

        independent_source_count = self._count_value(
            metadata, "independent_source_count"
        )

        repeated_observation_count = self._count_value(
            metadata, "repeated_observation_count"
        )

        source_name = self._source_name(signal.source_kind)

        has_reproducible_failure = source_name == self._source_name(
            DiscoverySourceKind.TEST_FAILURE
        )

        has_architecture_gap = source_name == self._source_name(
            DiscoverySourceKind.ARCHITECTURE_GAP
        )

        has_runtime_signal = source_name == self._source_name(
            DiscoverySourceKind.RUNTIME_SIGNAL
        )

        has_external_requirement = source_name == self._source_name(
            DiscoverySourceKind.EXTERNAL_REQUIREMENT
        )

        contradictory_evidence = self._bool_value(metadata, "contradictory_evidence")

        unresolved_identity_conflict = self._bool_value(
            metadata, "unresolved_identity_conflict"
        )

        return DiscoveryConfidenceInput(
            evidence_count=evidence_count,
            independent_source_count=independent_source_count,
            repeated_observation_count=repeated_observation_count,
            has_reproducible_failure=has_reproducible_failure,
            has_architecture_gap=has_architecture_gap,
            has_runtime_signal=has_runtime_signal,
            has_external_requirement=has_external_requirement,
            contradictory_evidence=contradictory_evidence,
            unresolved_identity_conflict=unresolved_identity_conflict,
        )
