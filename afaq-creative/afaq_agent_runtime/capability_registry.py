"""Dynamic capability registry (governance hardening).

No fixed capability-count assumption exists. Supports manual additions,
machine-generated candidates, hierarchical capabilities, dependencies,
explicit maturity progression, and evidence attachment.

Maturity escalation must be performed explicitly and is governed by
reconciliation evidence (see capability_reconciliation.py).
"""

from __future__ import annotations

from dataclasses import replace

from .capability_contracts import CapabilityMaturity, CapabilityRecord


_MATURITY_ORDER = {
    CapabilityMaturity.NOT_DESIGNED: 0,
    CapabilityMaturity.DESIGNED: 1,
    CapabilityMaturity.IMPLEMENTED: 2,
    CapabilityMaturity.TESTED: 3,
    CapabilityMaturity.VALIDATED: 4,
    CapabilityMaturity.PRODUCTION_READY: 5,
}


class CapabilityRegistry:
    """In-memory registry of governed capability records."""

    def __init__(self) -> None:
        self._records: dict[str, CapabilityRecord] = {}

    def __len__(self) -> int:
        return len(self._records)

    def register(self, record: CapabilityRecord) -> CapabilityRecord:
        if record.capability_id in self._records:
            raise ValueError(
                f"capability already registered: {record.capability_id}"
            )

        for parent_id in record.parent_ids:
            if parent_id not in self._records:
                raise ValueError(f"unknown parent capability: {parent_id}")

        for dependency_id in record.dependency_ids:
            if dependency_id not in self._records:
                raise ValueError(
                    f"unknown dependency capability: {dependency_id}"
                )

        self._records[record.capability_id] = record

        for parent_id in record.parent_ids:
            parent = self._records[parent_id]

            if record.capability_id not in parent.child_ids:
                self._records[parent_id] = replace(
                    parent,
                    child_ids=(*parent.child_ids, record.capability_id),
                )

        return record

    def get(self, capability_id: str) -> CapabilityRecord:
        try:
            return self._records[capability_id]
        except KeyError:
            raise KeyError(capability_id) from None

    def exists(self, capability_id: str) -> bool:
        return capability_id in self._records

    def all(self) -> tuple[CapabilityRecord, ...]:
        return tuple(self._records.values())

    def children_of(self, capability_id: str) -> tuple[CapabilityRecord, ...]:
        record = self.get(capability_id)

        return tuple(self.get(child_id) for child_id in record.child_ids)

    def dependencies_of(
        self, capability_id: str
    ) -> tuple[CapabilityRecord, ...]:
        record = self.get(capability_id)

        return tuple(self.get(dep_id) for dep_id in record.dependency_ids)

    def attach_evidence(
        self, capability_id: str, evidence_ref: str
    ) -> CapabilityRecord:
        if not evidence_ref.strip():
            raise ValueError("evidence_ref is required")

        current = self.get(capability_id)

        refs = current.evidence_refs

        if evidence_ref not in refs:
            refs = (*refs, evidence_ref)

        updated = replace(current, evidence_refs=refs)

        self._records[capability_id] = updated

        return updated

    def attach_report(
        self, capability_id: str, report_ref: str
    ) -> CapabilityRecord:
        if not report_ref.strip():
            raise ValueError("report_ref is required")

        current = self.get(capability_id)

        refs = current.report_refs

        if report_ref not in refs:
            refs = (*refs, report_ref)

        updated = replace(current, report_refs=refs)

        self._records[capability_id] = updated

        return updated

    def set_trust_score(
        self, capability_id: str, trust_score: float
    ) -> CapabilityRecord:
        if not 0.0 <= trust_score <= 1.0:
            raise ValueError("trust_score must be between 0 and 1")

        current = self.get(capability_id)

        updated = replace(current, trust_score=trust_score)

        self._records[capability_id] = updated

        return updated

    def advance_maturity(
        self,
        capability_id: str,
        new_maturity: CapabilityMaturity,
        *,
        production_ready: bool = False,
    ) -> CapabilityRecord:
        current = self.get(capability_id)

        current_rank = _MATURITY_ORDER[current.maturity]
        target_rank = _MATURITY_ORDER[new_maturity]

        if target_rank < current_rank:
            raise ValueError(
                "maturity regression requires explicit invalidation workflow"
            )

        if target_rank > current_rank + 1:
            raise ValueError("maturity levels cannot be skipped")

        if (
            new_maturity is CapabilityMaturity.PRODUCTION_READY
            and not production_ready
        ):
            raise ValueError("production readiness must be explicit")

        if (
            production_ready
            and new_maturity is not CapabilityMaturity.PRODUCTION_READY
        ):
            raise ValueError(
                "production_ready=True requires PRODUCTION_READY maturity"
            )

        updated = replace(
            current,
            maturity=new_maturity,
            production_ready=production_ready,
        )

        self._records[capability_id] = updated

        return updated
