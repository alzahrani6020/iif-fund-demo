"""Capability truth bridge.

Applies governance-backed reconciliation results to the capability
registry: no automatic maturity downgrade, no maturity skipping, no
automatic PRODUCTION_READY promotion, no unmapped governance evidence.
Reports/evidence are attached before persistence, persistence occurs
only after successful reconciliation, and any failure rolls the
in-memory capability back to its exact pre-application state.
"""

from __future__ import annotations

from dataclasses import dataclass

from .capability_contracts import CapabilityMaturity
from .capability_governance_mapping import CapabilityGovernanceMappingRegistry
from .capability_persistence import CapabilityStore
from .capability_reconciliation import CapabilityReconciler
from .capability_registry import CapabilityRegistry


_MATURITY_ORDER = (
    CapabilityMaturity.NOT_DESIGNED,
    CapabilityMaturity.DESIGNED,
    CapabilityMaturity.IMPLEMENTED,
    CapabilityMaturity.TESTED,
    CapabilityMaturity.VALIDATED,
    CapabilityMaturity.PRODUCTION_READY,
)


@dataclass(frozen=True, slots=True)
class CapabilityBridgeResult:
    capability_id: str
    previous_maturity: CapabilityMaturity
    reconciled_maturity: CapabilityMaturity
    applied_maturity: CapabilityMaturity
    changed: bool
    attached_reports: tuple[str, ...]
    attached_evidence: tuple[str, ...]
    reasons: tuple[str, ...]


class CapabilityTruthBridge:
    def __init__(
        self,
        *,
        registry: CapabilityRegistry,
        reconciler: CapabilityReconciler,
        mappings: CapabilityGovernanceMappingRegistry,
        store: CapabilityStore,
    ) -> None:
        self.registry = registry
        self.reconciler = reconciler
        self.mappings = mappings
        self.store = store

    def _rank(self, maturity: CapabilityMaturity) -> int:
        return _MATURITY_ORDER.index(maturity)

    def _advance_one_step(
        self, capability_id: str, target: CapabilityMaturity
    ) -> CapabilityMaturity:
        current = self.registry.get(capability_id).maturity

        current_rank = self._rank(current)
        target_rank = self._rank(target)

        if target_rank <= current_rank:
            return current

        next_maturity = _MATURITY_ORDER[current_rank + 1]

        if next_maturity is CapabilityMaturity.PRODUCTION_READY:
            return current

        self.registry.advance_maturity(capability_id, next_maturity)

        return next_maturity

    def reconcile_and_apply(self, capability_id: str) -> CapabilityBridgeResult:
        if not self.mappings.exists(capability_id):
            raise KeyError(f"no governance mapping for {capability_id}")

        mapping = self.mappings.get(capability_id)

        if not self.registry.exists(capability_id):
            raise KeyError(f"capability not registered: {capability_id}")

        result = self.reconciler.reconcile_from_registry(capability_id)

        current = self.registry.get(capability_id)

        # Immutable pre-application snapshot.
        before = current

        previous = current.maturity
        reconciled = result.reconciled_maturity

        previous_rank = self._rank(previous)
        reconciled_rank = self._rank(reconciled)

        reasons = list(result.reasons)

        try:
            # No silent maturity regression.
            if reconciled_rank < previous_rank:
                applied = previous
                reasons.append("automatic_maturity_downgrade_blocked")

            # No automatic production promotion.
            elif reconciled is CapabilityMaturity.PRODUCTION_READY:
                applied = previous
                reasons.append("automatic_production_promotion_blocked")

            else:
                applied = previous

                while self._rank(applied) < reconciled_rank:
                    next_applied = self._advance_one_step(capability_id, reconciled)

                    if next_applied is applied:
                        break

                    applied = next_applied

            for report_ref in mapping.report_ids:
                if report_ref in result.supporting_reports:
                    self.registry.attach_report(capability_id, report_ref)

            for evidence_ref in mapping.evidence_ids:
                if evidence_ref in result.supporting_evidence:
                    self.registry.attach_evidence(capability_id, evidence_ref)

            final = self.registry.get(capability_id)

            changed = final != before

            self.store.save(self.registry)

        except Exception:
            # Roll back the in-memory capability to the exact
            # pre-application state. Persistence remains fail-closed: a
            # partially written/tampered store cannot pass integrity.
            self.registry._records[capability_id] = before
            raise

        return CapabilityBridgeResult(
            capability_id=capability_id,
            previous_maturity=previous,
            reconciled_maturity=reconciled,
            applied_maturity=final.maturity,
            changed=changed,
            attached_reports=final.report_refs,
            attached_evidence=final.evidence_refs,
            reasons=tuple(dict.fromkeys(reasons)),
        )

    def reconcile_all(self) -> tuple[CapabilityBridgeResult, ...]:
        results = []

        for mapping in self.mappings.all():
            results.append(self.reconcile_and_apply(mapping.capability_id))

        return tuple(results)
