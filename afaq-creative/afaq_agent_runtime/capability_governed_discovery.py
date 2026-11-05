"""Governed capability discovery with durable lineage and confidence.

GovernedCapabilityDiscovery couples candidate creation to a persistent
signal ledger and a persistent semantic identity registry: discovery
creates candidates only, never grants maturity/trust/production
readiness, exact signal lineage survives restart, semantic duplicates
reuse one candidate, and semantic conflicts fail closed with
compensating rollback.

ConfidenceAwareCapabilityDiscovery composes the governed discovery with
the deterministic confidence adapter/scorer. Confidence remains
advisory discovery evidence only — it must not grant trust, maturity,
approval, authority, or production readiness, and must not bypass the
promotion gate.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone

from .capability_candidates import (
    CapabilityCandidate,
    CapabilityCandidateOrigin,
    CapabilityCandidateRegistry,
)
from .capability_confidence_adapter import DiscoveryConfidenceAdapter
from .capability_confidence_scoring import (
    DiscoveryConfidenceResult,
    DiscoveryConfidenceScorer,
)
from .capability_discovery import (
    CapabilityDiscoveryResult,
    CapabilityDiscoverySignal,
    DiscoverySourceKind,
)
from .capability_semantic_dedup import DiscoverySemanticDeduplicator
from .capability_semantic_registry import SemanticIdentityRegistry
from .capability_signal_ledger import (
    DiscoverySignalLedger,
    DiscoverySignalRecord,
)


class GovernedCapabilityDiscovery:
    """Governed discovery with persistent deterministic semantic identity."""

    def __init__(
        self,
        *,
        candidates: CapabilityCandidateRegistry,
        ledger: DiscoverySignalLedger,
        semantic_registry: SemanticIdentityRegistry,
        deduplicator: DiscoverySemanticDeduplicator | None = None,
    ) -> None:
        self.candidates = candidates
        self.ledger = ledger
        self.semantic_registry = semantic_registry
        self.deduplicator = deduplicator or DiscoverySemanticDeduplicator()

        self._validate_persistent_bindings()

    @staticmethod
    def _candidate_id(signal: CapabilityDiscoverySignal) -> str:
        normalized = signal.signal_id.strip().upper().replace(" ", "-")

        return f"CAND-{normalized}"

    @staticmethod
    def _origin(source_kind: DiscoverySourceKind) -> CapabilityCandidateOrigin:
        if source_kind is DiscoverySourceKind.MANUAL:
            return CapabilityCandidateOrigin.MANUAL

        if source_kind is DiscoverySourceKind.AUTONOMOUS_ANALYSIS:
            return CapabilityCandidateOrigin.AUTONOMOUS_PROPOSAL

        return CapabilityCandidateOrigin.AUTOMATED

    @staticmethod
    def _recorded_at(now: datetime | None) -> datetime:
        current = now or datetime.now(timezone.utc)

        if current.tzinfo is None:
            raise ValueError("now must be timezone-aware")

        return current

    def _semantic_identity(self, signal: CapabilityDiscoverySignal) -> tuple[str, str]:
        """Use the deduplicator as the single identity authority."""

        identity = self.deduplicator.identity(signal)

        return (identity.fingerprint, identity.canonical_key)

    def _validate_persistent_bindings(self) -> None:
        """Persistent semantic identity is authoritative — a binding to a
        missing candidate fails closed."""

        for record in self.semantic_registry.all():
            if not self.candidates.exists(record.candidate_id):
                raise ValueError(
                    "persistent semantic identity references missing candidate: "
                    f"{record.candidate_id}"
                )

    def _persist_lineage(
        self,
        *,
        signal: CapabilityDiscoverySignal,
        candidate_id: str,
        recorded_at: datetime,
    ) -> None:
        self.ledger.append(
            DiscoverySignalRecord(
                signal_id=signal.signal_id,
                candidate_id=candidate_id,
                source_kind=signal.source_kind.value,
                recorded_at=recorded_at,
                evidence_refs=signal.evidence_refs,
            )
        )

    def _rollback_new_candidate(
        self,
        *,
        fingerprint: str,
        candidate_id: str,
        semantic_bound: bool,
    ) -> None:
        """Compensating rollback for a failed new discovery.

        Order matters: remove the persistent semantic binding first, then
        the candidate. If the unbind fails, the candidate is preserved to
        avoid a dangling persistent identity.
        """

        if semantic_bound:
            self.semantic_registry.unbind(
                fingerprint=fingerprint,
                expected_candidate_id=candidate_id,
            )

        self.candidates._records.pop(candidate_id, None)

    def discover(
        self,
        signal: CapabilityDiscoverySignal,
        *,
        now: datetime | None = None,
    ) -> CapabilityDiscoveryResult:
        recorded_at = self._recorded_at(now)

        # 1. Exact signal lineage is authoritative.
        try:
            existing_record = self.ledger.get(signal.signal_id)
        except KeyError:
            existing_record = None

        if existing_record is not None:
            if not self.candidates.exists(existing_record.candidate_id):
                raise ValueError(
                    "discovery lineage exists but candidate is missing"
                )

            return CapabilityDiscoveryResult(
                signal_id=signal.signal_id,
                candidate_id=existing_record.candidate_id,
                created=False,
                reasons=(
                    "signal_already_discovered",
                    "persistent_lineage_verified",
                ),
            )

        # 2. Deterministic semantic identity.
        (fingerprint, semantic_basis) = self._semantic_identity(signal)

        persistent_candidate_id = self.semantic_registry.resolve(fingerprint)

        # 3. Persistent semantic duplicate.
        if persistent_candidate_id is not None:
            if not self.candidates.exists(persistent_candidate_id):
                raise ValueError(
                    "persistent semantic identity exists but candidate is missing"
                )

            before = self.candidates.get(persistent_candidate_id)

            try:
                for evidence_id in signal.evidence_refs:
                    self.candidates.attach_evidence(persistent_candidate_id, evidence_id)

                self._persist_lineage(
                    signal=signal,
                    candidate_id=persistent_candidate_id,
                    recorded_at=recorded_at,
                )

                self.semantic_registry.bind(
                    fingerprint=fingerprint,
                    candidate_id=persistent_candidate_id,
                    semantic_basis=semantic_basis,
                    evidence_refs=signal.evidence_refs,
                )

            except Exception:
                self.candidates._records[persistent_candidate_id] = before
                raise

            return CapabilityDiscoveryResult(
                signal_id=signal.signal_id,
                candidate_id=persistent_candidate_id,
                created=False,
                reasons=(
                    "persistent_semantic_duplicate_detected",
                    "existing_candidate_reused",
                    "persistent_lineage_recorded",
                    "persistent_semantic_identity_verified",
                ),
            )

        # 4. New semantic identity -> new candidate.
        candidate_id = self._candidate_id(signal)

        if self.candidates.exists(candidate_id):
            raise ValueError(f"candidate id collision: {candidate_id}")

        candidate = CapabilityCandidate(
            candidate_id=candidate_id,
            name=signal.suggested_name,
            origin=self._origin(signal.source_kind),
            description=signal.description,
            proposed_capability_id=signal.suggested_capability_id,
            evidence_refs=signal.evidence_refs,
            risk_class=signal.risk_class,
            trust_score=0.0,
            metadata={
                "discovery_signal_id": signal.signal_id,
                "discovery_source_kind": signal.source_kind.value,
                "discovery_title": signal.title,
                "semantic_fingerprint": fingerprint,
                "semantic_basis": semantic_basis,
                **dict(signal.metadata or {}),
            },
        )

        self.candidates.register(candidate)

        semantic_bound = False

        try:
            self.semantic_registry.bind(
                fingerprint=fingerprint,
                candidate_id=candidate_id,
                semantic_basis=semantic_basis,
                evidence_refs=signal.evidence_refs,
            )

            semantic_bound = True

            self._persist_lineage(
                signal=signal,
                candidate_id=candidate_id,
                recorded_at=recorded_at,
            )

        except Exception as original_error:
            try:
                self._rollback_new_candidate(
                    fingerprint=fingerprint,
                    candidate_id=candidate_id,
                    semantic_bound=semantic_bound,
                )

            except Exception as rollback_error:
                raise RuntimeError(
                    "discovery failed and compensating rollback also failed; "
                    "state was preserved where necessary to avoid dangling "
                    f"semantic identity. original_error={original_error!r}; "
                    f"rollback_error={rollback_error!r}"
                ) from rollback_error

            raise

        return CapabilityDiscoveryResult(
            signal_id=signal.signal_id,
            candidate_id=candidate_id,
            created=True,
            reasons=(
                "semantic_identity_not_seen",
                "candidate_created_from_discovery_signal",
                "persistent_semantic_identity_bound",
                "persistent_lineage_recorded",
            ),
        )

    def lookup_signal(self, signal_id: str) -> str:
        return self.ledger.get(signal_id).candidate_id


@dataclass(frozen=True, slots=True)
class ConfidenceAwareDiscoveryResult:
    discovery: CapabilityDiscoveryResult
    confidence: DiscoveryConfidenceResult


class ConfidenceAwareCapabilityDiscovery:
    """Confidence-aware governed capability discovery."""

    def __init__(
        self,
        *,
        candidates: CapabilityCandidateRegistry,
        ledger: DiscoverySignalLedger,
        semantic_registry: SemanticIdentityRegistry,
        deduplicator: DiscoverySemanticDeduplicator | None = None,
        confidence_adapter: DiscoveryConfidenceAdapter | None = None,
        confidence_scorer: DiscoveryConfidenceScorer | None = None,
    ) -> None:
        self.confidence_adapter = confidence_adapter or DiscoveryConfidenceAdapter()

        self.confidence_scorer = confidence_scorer or DiscoveryConfidenceScorer()

        self.discovery = GovernedCapabilityDiscovery(
            candidates=candidates,
            ledger=ledger,
            semantic_registry=semantic_registry,
            deduplicator=deduplicator,
        )

    @property
    def candidates(self) -> CapabilityCandidateRegistry:
        return self.discovery.candidates

    @property
    def ledger(self) -> DiscoverySignalLedger:
        return self.discovery.ledger

    @property
    def semantic_registry(self) -> SemanticIdentityRegistry:
        return self.discovery.semantic_registry

    def assess_confidence(
        self, signal: CapabilityDiscoverySignal
    ) -> DiscoveryConfidenceResult:
        inputs = self.confidence_adapter.adapt(signal)

        return self.confidence_scorer.score(inputs)

    def discover(
        self,
        signal: CapabilityDiscoverySignal,
        *,
        now: datetime | None = None,
    ) -> ConfidenceAwareDiscoveryResult:
        confidence = self.assess_confidence(signal)

        discovery = self.discovery.discover(signal, now=now)

        return ConfidenceAwareDiscoveryResult(
            discovery=discovery,
            confidence=confidence,
        )

    def lookup_signal(self, signal_id: str) -> str:
        return self.discovery.lookup_signal(signal_id)
