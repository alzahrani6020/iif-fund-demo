from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from .side_effects import SideEffectClassification


@dataclass(frozen=True)
class VerificationResult:
    verified: bool
    status: str
    reason: str


class VerificationGate:
    @staticmethod
    def verify(
        action: str,
        result: Any,
        *,
        expected_state: Any = None,
        observed_state: Any = None,
        side_effect: SideEffectClassification | None = None,
    ) -> VerificationResult:
        action = (action or "").lower()
        if result is None:
            return VerificationResult(False, "NOT VERIFIED", "tool returned no result")

        if action == "run":
            if not isinstance(result, dict) or "passed" not in result:
                return VerificationResult(
                    False,
                    "NOT VERIFIED",
                    "run result missing passed flag",
                )

            if not result["passed"]:
                return VerificationResult(
                    False,
                    "FAIL",
                    "command returned non-zero exit code",
                )

            if side_effect is SideEffectClassification.READ_ONLY:
                return VerificationResult(
                    True,
                    "PASS",
                    "read-only command return code checked",
                )

            if side_effect is SideEffectClassification.WRITE:
                return VerificationResult(
                    False,
                    "NOT VERIFIED",
                    "write-classified command requires post-condition verification",
                )

            return VerificationResult(
                False,
                "NOT VERIFIED",
                "run side-effect classification is not verifiable",
            )

        if action == "edit":
            diff_ok = (
                isinstance(result, str)
                and result.strip().startswith("---")
                and "+++" in result
            )
            if not diff_ok:
                return VerificationResult(False, "NOT VERIFIED", "edit result does not prove a diff")
            if expected_state is None or observed_state is None:
                return VerificationResult(False, "NOT VERIFIED", "edit requires independent post-write read-back")
            if observed_state != expected_state:
                return VerificationResult(False, "NOT VERIFIED", "post-write state does not match expected content")
            return VerificationResult(True, "PASS", "edit diff observed and exact post-write state verified")

        if action in {"files", "read", "search", "status", "diff", "map"}:
            return VerificationResult(True, "PASS", "read-only tool result observed")

        return VerificationResult(False, "NOT VERIFIED", "no verification rule for action")
