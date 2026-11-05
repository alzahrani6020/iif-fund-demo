"""Capability maturity reconciliation against governance truth.

Rules:
- architecture presence alone does not upgrade maturity;
- VALIDATED requires a VALIDATED mapped report plus mapped evidence;
- production readiness is never inferred automatically;
- unknown or ambiguous mappings fail closed;
- capability count is unbounded.

Governance indexes and the capability matrix are project-relative and
configurable; defaults live under ``var/`` inside the given root.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import json

from .capability_contracts import CapabilityMaturity
from .capability_evidence_binding import GovernedEvidenceBinding
from .capability_governance_mapping import CapabilityGovernanceMappingRegistry


@dataclass(frozen=True, slots=True)
class CapabilityReconciliationResult:
    capability_id: str
    declared_maturity: CapabilityMaturity
    reconciled_maturity: CapabilityMaturity
    supporting_reports: tuple[str, ...]
    supporting_evidence: tuple[str, ...]
    reasons: tuple[str, ...]


class CapabilityReconciler:
    def __init__(
        self,
        *,
        project_root: str | Path,
        mapping_registry: CapabilityGovernanceMappingRegistry | None = None,
        evidence_binding: GovernedEvidenceBinding | None = None,
        reports_index_path: str | Path | None = None,
        evidence_index_path: str | Path | None = None,
        capability_matrix_path: str | Path | None = None,
    ) -> None:
        self.project_root = Path(project_root).resolve()
        self.mapping_registry = mapping_registry
        self.evidence_binding = (
            evidence_binding
            if evidence_binding is not None
            else GovernedEvidenceBinding(
                project_root=self.project_root,
                reports_index_path=reports_index_path,
                evidence_index_path=evidence_index_path,
            )
        )
        self.reports_index_path = Path(
            reports_index_path
        ) if reports_index_path is not None else (
            self.project_root / "var" / "governance" / "reports" / "index.json"
        )
        self.evidence_index_path = Path(
            evidence_index_path
        ) if evidence_index_path is not None else (
            self.project_root / "var" / "governance" / "evidence" / "index.json"
        )
        self.capability_matrix_path = Path(
            capability_matrix_path
        ) if capability_matrix_path is not None else (
            self.project_root / "var" / "capability" / "capability-matrix.json"
        )

    def _load_json(self, path: Path) -> dict:
        return json.loads(path.read_text(encoding="utf-8-sig"))

    def _report_index(self) -> dict:
        return self._load_json(self.reports_index_path)

    def _evidence_index(self) -> dict:
        return self._load_json(self.evidence_index_path)

    def _capability_matrix(self) -> dict:
        return self._load_json(self.capability_matrix_path)

    def reconcile_capability(
        self,
        *,
        capability_id: str,
        report_ids: tuple[str, ...] = (),
        evidence_ids: tuple[str, ...] = (),
    ) -> CapabilityReconciliationResult:
        matrix = self._capability_matrix()

        capability = next(
            (
                item
                for item in matrix["capabilities"]
                if item["capability_id"] == capability_id
            ),
            None,
        )

        if capability is None:
            raise KeyError(capability_id)

        declared = CapabilityMaturity(capability["maturity"])

        reports = self._report_index()
        evidence = self._evidence_index()

        report_map = {
            item["report_id"]: item for item in reports.get("reports", [])
        }

        evidence_map = {
            item["evidence_id"]: item for item in evidence.get("evidence", [])
        }

        supporting_reports = []
        supporting_evidence = []
        reasons = []

        for report_id in report_ids:
            report = report_map.get(report_id)

            if report is None:
                reasons.append(f"unknown_report:{report_id}")
                continue

            supporting_reports.append(report_id)

        for evidence_id in evidence_ids:
            item = evidence_map.get(evidence_id)

            if item is None:
                reasons.append(f"unknown_evidence:{evidence_id}")
                continue

            supporting_evidence.append(evidence_id)

        validated_reports = [
            report_map[x]
            for x in supporting_reports
            if report_map[x].get("status") == "VALIDATED"
        ]

        if validated_reports:
            bound_evidence = []

            for report in validated_reports:
                report_id = report["report_id"]

                for evidence_id in supporting_evidence:
                    binding = self.evidence_binding.verify_binding(
                        capability_id=capability_id,
                        report_id=report_id,
                        evidence_id=evidence_id,
                    )

                    if binding.bound:
                        bound_evidence.append((report_id, evidence_id))

            if bound_evidence:
                reconciled = CapabilityMaturity.VALIDATED
                reasons.append("validated_governance_report_present")
                reasons.append("governed_evidence_binding_verified")
            else:
                reconciled = CapabilityMaturity.TESTED
                reasons.append("validated_report_without_bound_evidence")

        elif supporting_reports:
            statuses = {report_map[x].get("status") for x in supporting_reports}

            if "BUILD_COMPLETE" in statuses:
                reconciled = CapabilityMaturity.IMPLEMENTED
                reasons.append("build_complete_report_present")

            elif "DRAFT" in statuses:
                reconciled = CapabilityMaturity.DESIGNED
                reasons.append("architecture_or_draft_report_present")

            else:
                reconciled = CapabilityMaturity.NOT_DESIGNED
                reasons.append("no_supported_maturity_mapping")

        else:
            reconciled = CapabilityMaturity.NOT_DESIGNED
            reasons.append("no_supporting_report")

        if reconciled is CapabilityMaturity.VALIDATED and not supporting_evidence:
            reconciled = CapabilityMaturity.TESTED
            reasons.append("validated_report_without_mapped_evidence")

        # Production readiness is never auto-inferred.
        if reconciled is CapabilityMaturity.PRODUCTION_READY:
            reconciled = CapabilityMaturity.VALIDATED

        return CapabilityReconciliationResult(
            capability_id=capability_id,
            declared_maturity=declared,
            reconciled_maturity=reconciled,
            supporting_reports=tuple(supporting_reports),
            supporting_evidence=tuple(supporting_evidence),
            reasons=tuple(dict.fromkeys(reasons)),
        )

    def reconcile_from_registry(
        self, capability_id: str
    ) -> CapabilityReconciliationResult:
        if self.mapping_registry is None:
            raise ValueError("mapping_registry is required")

        mapping = self.mapping_registry.get(capability_id)

        return self.reconcile_capability(
            capability_id=mapping.capability_id,
            report_ids=mapping.report_ids,
            evidence_ids=mapping.evidence_ids,
        )

    def reconcile_all(self) -> tuple[CapabilityReconciliationResult, ...]:
        if self.mapping_registry is None:
            raise ValueError("mapping_registry is required")

        return tuple(
            self.reconcile_from_registry(mapping.capability_id)
            for mapping in self.mapping_registry.all()
        )
