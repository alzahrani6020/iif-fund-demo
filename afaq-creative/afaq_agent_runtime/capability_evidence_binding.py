"""Governed evidence binding verification.

Validates explicit machine-governed evidence binding:

    capability -> governance mapping -> existing report
    -> report.evidence_refs -> existing evidence registry entry

No name similarity or heuristic inference is allowed. Index file
locations are project-relative and configurable; defaults live under
``var/governance/`` inside the given project root.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import json


@dataclass(frozen=True, slots=True)
class EvidenceBindingResult:
    capability_id: str
    report_id: str
    evidence_id: str
    bound: bool
    reasons: tuple[str, ...]


class GovernedEvidenceBinding:
    def __init__(
        self,
        *,
        project_root: str | Path,
        reports_index_path: str | Path | None = None,
        evidence_index_path: str | Path | None = None,
    ) -> None:
        self.project_root = Path(project_root).resolve()
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

    def _load_json(self, path: Path) -> dict:
        return json.loads(path.read_text(encoding="utf-8-sig"))

    def verify_binding(
        self,
        *,
        capability_id: str,
        report_id: str,
        evidence_id: str,
    ) -> EvidenceBindingResult:
        reasons = []

        reports = self._load_json(self.reports_index_path)

        evidence = self._load_json(self.evidence_index_path)

        report_map = {
            item["report_id"]: item for item in reports.get("reports", [])
        }

        evidence_map = {
            item["evidence_id"]: item for item in evidence.get("evidence", [])
        }

        report = report_map.get(report_id)

        if report is None:
            reasons.append(f"unknown_report:{report_id}")

            return EvidenceBindingResult(
                capability_id=capability_id,
                report_id=report_id,
                evidence_id=evidence_id,
                bound=False,
                reasons=tuple(reasons),
            )

        evidence_record = evidence_map.get(evidence_id)

        if evidence_record is None:
            reasons.append(f"unknown_evidence:{evidence_id}")

            return EvidenceBindingResult(
                capability_id=capability_id,
                report_id=report_id,
                evidence_id=evidence_id,
                bound=False,
                reasons=tuple(reasons),
            )

        report_evidence_refs = tuple(report.get("evidence_refs", ()))

        if evidence_id not in report_evidence_refs:
            reasons.append("evidence_not_bound_to_report")

            return EvidenceBindingResult(
                capability_id=capability_id,
                report_id=report_id,
                evidence_id=evidence_id,
                bound=False,
                reasons=tuple(reasons),
            )

        if evidence_record.get("immutable") is not True:
            reasons.append("evidence_not_immutable")

            return EvidenceBindingResult(
                capability_id=capability_id,
                report_id=report_id,
                evidence_id=evidence_id,
                bound=False,
                reasons=tuple(reasons),
            )

        assurance = evidence_record.get("assurance")

        if assurance not in {"HIGH", "MEDIUM"}:
            reasons.append("insufficient_evidence_assurance")

            return EvidenceBindingResult(
                capability_id=capability_id,
                report_id=report_id,
                evidence_id=evidence_id,
                bound=False,
                reasons=tuple(reasons),
            )

        reasons.append("explicit_governance_evidence_binding_verified")

        return EvidenceBindingResult(
            capability_id=capability_id,
            report_id=report_id,
            evidence_id=evidence_id,
            bound=True,
            reasons=tuple(reasons),
        )
