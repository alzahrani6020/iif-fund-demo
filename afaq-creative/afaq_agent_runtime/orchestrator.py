from __future__ import annotations

from typing import Any

from .evidence_gate import EvidenceGate, EvidenceRecord
from .execution_envelope import ExecutionEnvelope
from .feature_flags import orchestrator_enabled, shadow_mode
from .governed_core import GovernedProjectAgent
from .side_effects import SideEffectClassification, classify_action
from .verification_gate import VerificationGate


class OrchestrationError(RuntimeError):
    pass


class AfaqOrchestrator:
    """Evidence-first, fail-closed orchestrator over the governed core.

    This module is additive: legacy runtime code is not replaced. It can be
    enabled explicitly through AFAQ_ORCHESTRATOR_ENABLED or instantiated and
    invoked directly by a higher-level runtime.
    """

    def __init__(self, root: str, *, core: GovernedProjectAgent | None = None):
        self.core = core or GovernedProjectAgent(root)

    @staticmethod
    def enabled() -> bool:
        return orchestrator_enabled()

    @staticmethod
    def shadow() -> bool:
        return shadow_mode()

    def _execute_tool(self, action: str, args: dict[str, Any]) -> Any:
        if action == "files":
            return self.core.files(limit=int(args.get("limit", 500)))
        if action == "read":
            return self.core.read(str(args["path"]))
        if action == "search":
            return self.core.search(str(args["query"]), limit=int(args.get("limit", 50)))
        if action == "edit":
            return self.core.edit(str(args["path"]), str(args["old"]), str(args["new"]), approved=bool(args.get("approved", False)))
        if action == "run":
            return self.core.run(str(args["command"]))
        if action == "status":
            return self.core.git_status()
        if action == "diff":
            return self.core.git_diff()
        if action == "map":
            return self.core.map_repository()
        raise OrchestrationError(f"unknown action: {action}")

    def execute(self, action: str, args: dict[str, Any] | None = None, *, request_id: str | None = None) -> dict[str, Any]:
        if not self.enabled():
            return {
                "status": "DENIED",
                "reason": "orchestrator feature flag is off",
            }

        args = args or {}
        effect = classify_action(action, args)
        env = ExecutionEnvelope(action=action, side_effect=effect.value)
        if request_id:
            env.request_id = request_id

        if effect is SideEffectClassification.UNKNOWN:
            env.finish("DENIED")
            return {"execution": env.__dict__, "status": "DENIED", "reason": "UNKNOWN side effect is fail-closed"}

        if self.shadow() and effect is not SideEffectClassification.READ_ONLY:
            env.finish("SHADOW_BLOCKED")
            return {"execution": env.__dict__, "status": "SHADOW_BLOCKED", "reason": "shadow mode forbids writes/side effects"}

        try:
            expected_state = None
            if action == "edit":
                path = str(args["path"])
                old = str(args["old"])
                new = str(args["new"])
                before = self.core.read(path)
                if before.count(old) == 1:
                    expected_state = before.replace(old, new, 1)

            result = self._execute_tool(action, args)

            observed_state = None
            if action == "edit":
                observed_state = self.core.read(str(args["path"]))

            evidence: list[EvidenceRecord] = [EvidenceGate.from_tool_result(env.execution_id, action, result)]
            EvidenceGate.require(env.execution_id, evidence)
            verification = VerificationGate.verify(
                action,
                result,
                expected_state=expected_state,
                observed_state=observed_state,
                side_effect=effect,
            )
            env.evidence = [{"execution_id": e.execution_id, "source": e.source, "payload": e.payload} for e in evidence]
            env.finish("COMPLETE" if verification.verified else "NOT_VERIFIED")
            return {
                "execution": env.__dict__,
                "result": result,
                "verification": verification.__dict__,
                "status": env.status,
            }
        except Exception as exc:
            env.finish("FAILED")
            return {"execution": env.__dict__, "status": "FAILED", "error": f"{type(exc).__name__}: {exc}"}


