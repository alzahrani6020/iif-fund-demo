"""Deterministic semantic deduplication for discovery signals.

Intentionally avoids fuzzy/probabilistic matching. Identity priority:
1. suggested_capability_id
2. normalized (suggested_name + description + risk_class)

signal_id and source_kind are intentionally excluded from identity.
"""

from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass

from .capability_discovery import CapabilityDiscoverySignal


@dataclass(frozen=True, slots=True)
class DiscoverySemanticIdentity:
    fingerprint: str
    canonical_key: str
    strategy: str


@dataclass(frozen=True, slots=True)
class DiscoveryDeduplicationDecision:
    signal_id: str
    fingerprint: str
    duplicate: bool
    existing_candidate_id: str | None
    reasons: tuple[str, ...]


class DiscoverySemanticDeduplicator:
    def __init__(self) -> None:
        self._fingerprint_to_candidate: dict[str, str] = {}

    @staticmethod
    def _normalize(value: str) -> str:
        value = value.strip().lower()

        value = re.sub(r"\s+", " ", value)

        value = re.sub(r"[^a-z0-9\u0600-\u06ff _\-]", "", value)

        return value.strip()

    def identity(
        self, signal: CapabilityDiscoverySignal
    ) -> DiscoverySemanticIdentity:
        if signal.suggested_capability_id:
            canonical = "capability-id:" + self._normalize(
                signal.suggested_capability_id
            )

            strategy = "suggested_capability_id"

        else:
            canonical = "|".join(
                [
                    "semantic",
                    self._normalize(signal.suggested_name),
                    self._normalize(signal.description),
                    self._normalize(signal.risk_class),
                ]
            )

            strategy = "normalized_semantic_tuple"

        fingerprint = hashlib.sha256(canonical.encode("utf-8")).hexdigest()

        return DiscoverySemanticIdentity(
            fingerprint=fingerprint,
            canonical_key=canonical,
            strategy=strategy,
        )

    def evaluate(
        self, signal: CapabilityDiscoverySignal
    ) -> DiscoveryDeduplicationDecision:
        identity = self.identity(signal)

        existing = self._fingerprint_to_candidate.get(identity.fingerprint)

        if existing is None:
            return DiscoveryDeduplicationDecision(
                signal_id=signal.signal_id,
                fingerprint=identity.fingerprint,
                duplicate=False,
                existing_candidate_id=None,
                reasons=("semantic_identity_not_seen",),
            )

        return DiscoveryDeduplicationDecision(
            signal_id=signal.signal_id,
            fingerprint=identity.fingerprint,
            duplicate=True,
            existing_candidate_id=existing,
            reasons=("semantic_duplicate_detected",),
        )

    def bind(
        self, signal: CapabilityDiscoverySignal, *, candidate_id: str
    ) -> DiscoverySemanticIdentity:
        if not candidate_id.strip():
            raise ValueError("candidate_id is required")

        identity = self.identity(signal)

        existing = self._fingerprint_to_candidate.get(identity.fingerprint)

        if existing is not None and existing != candidate_id:
            raise ValueError(
                f"semantic identity already bound to candidate: {existing}"
            )

        self._fingerprint_to_candidate[identity.fingerprint] = candidate_id

        return identity

    def resolve(self, signal: CapabilityDiscoverySignal) -> str | None:
        identity = self.identity(signal)

        return self._fingerprint_to_candidate.get(identity.fingerprint)

    def count(self) -> int:
        return len(self._fingerprint_to_candidate)
