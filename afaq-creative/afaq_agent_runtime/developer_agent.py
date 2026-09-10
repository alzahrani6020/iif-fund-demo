"""Developer Agent v2 — governed local development loop on top of Runtime v1.

Pipeline:

    Inspect -> Search -> Understand -> Propose -> Approval -> Edit
          -> Test -> Diagnose -> Fix -> Retest -> Diff -> Evaluate -> Learn

Hard guarantees:
  * every path operation is confined to ``project_root`` (ProjectBoundary);
  * no write happens before a human approves the change proposal
    (write tools raise ``ApprovalTokenMissing`` without a token, and the
    token is issued only by ``approve()``);
  * every test command is validated against the command allowlist before
    execution — no arbitrary shell;
  * a checkpoint of all affected files is taken before the first write and
    a rollback restores it when tests keep failing past the fix budget;
  * outcomes are written to Memory Core (EXPERIENCE / FAILURE / validated
    LESSON) with ``failure_class`` distinguishing development test failures
    from runtime failures.

No git commit, no push, no deploy, no production DB access in v2.
"""

from __future__ import annotations

import difflib
import json
import os
import re
import shutil
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Mapping

from afaq_intelligence_core.aic_config import AICConfig
from afaq_intelligence_core.aic_memory_contracts import (
    MemoryEvidence,
    MemoryScope,
    MemoryType,
    new_memory_record,
)
from afaq_intelligence_core.aic_memory_service import MemoryService
from afaq_intelligence_core.aic_persistence import SqliteMemoryStore
from afaq_intelligence_core.ai.ollama import OllamaProvider
from afaq_intelligence_core.ai.provider import AIRequest
from afaq_intelligence_core.tools.registry import ToolRegistry

from .agent_runtime import RuntimeRouter
from .approval_store import ApprovalStore
from .audit_ledger import AuditLedger
from .command_allowlist import check_allowed, run_allowed
from .dev_task_store import DEV_TERMINAL_STATES, DevTaskStore
from .developer_tools import ProjectBoundary, register_developer_tools
from .event_log import EventLog
from .hardware import profile_key
from .intent_gate import (ANALYSIS, CONVERSATION, DEVELOPMENT_TASK,
                          SELF_STATUS, classify_intent, extract_file_paths)
from .model_info import validate_model_override
from .task_settings import validate_task_settings
from .model_router import ModelRouter
from .permissions import evaluate_proposal, is_sensitive_path, normalize_environment
from .repository_mapper import map_repository
from .risk import classify_risk

DEVELOPER_AGENT_ID = "afaq-developer-agent"
MAX_FIX_ATTEMPTS = 2
MAX_PROPOSAL_ATTEMPTS = 3
_PROPOSAL_CONTEXT_BUDGET = 15_000

# Dynamic context tiers (budget_bytes, per_file_cap). Tier 1 carries only the
# most relevant slice; a fast-first attempt escalates one tier when the only
# gate failure is a missing anchor (evidence of insufficient context). The
# strong path starts at the full legacy budget (tier index 2) so its behavior
# stays byte-for-byte what v1 shipped.
_CONTEXT_TIERS = ((4_500, 1_500), (9_500, 3_000), (15_000, 4_000))

# Deterministic complexity signals — never an LLM guess.
_COMPLEXITY_COMPLEX_KEYWORDS = (
    "refactor", "redesign", "architecture", "migrate", "multi-file",
    "rewrite", "restructure",
    "إعادة هيكلة", "بنية", "عدة ملفات", "أعد بناء",
)
_COMPLEXITY_TRIVIAL_KEYWORDS = (
    "typo", "off-by-one", "fix bug", "fix the bug", "fix a bug",
    "إصلاح", "خطأ مطبعي", "خطأ بسيط",
)
_FILE_REF_RE = re.compile(r"[\w\-]+(?:[/\\][\w\-]+)*\.[\w]{1,10}")

# Markers of backend/model unavailability in provider error messages. A dead
# or timing-out model is a model_failure, not a code/runtime failure — the
# distinction decides whether self-healing may even attempt a repair.
_MODEL_FAILURE_MARKERS = (
    "Ollama unreachable",
    "Ollama request timed out",
    "Ollama HTTP 404",
    "ModelUnavailable",
    "empty response from model",
    "model did not return a parseable proposal",
)


def _is_model_failure(message: str) -> bool:
    return any(marker in message for marker in _MODEL_FAILURE_MARKERS)


def _classify_complexity(instruction: str, repo_map: Mapping[str, Any]) -> str:
    """Deterministic task complexity from repo facts + instruction signals.

    Never an LLM call: keyword class, structural size (folders/subfolders),
    number of files referenced, and sensitive-path mentions.
    """
    text = instruction.lower()
    size = len(repo_map.get("main_folders") or []) + len(repo_map.get("subfolders") or {})
    mentioned = _FILE_REF_RE.findall(instruction)
    # The whole instruction also counts: dotfile mentions (".env.production")
    # are not shaped like plain file refs, and env/config secrets in the
    # wording are a complexity signal on their own.
    sensitive = is_sensitive_path(instruction) or any(
        is_sensitive_path(m) for m in mentioned
    )
    if (
        any(k in text for k in _COMPLEXITY_COMPLEX_KEYWORDS)
        or size > 25
        or sensitive
        or len(mentioned) > 3
    ):
        return "complex"
    if size <= 8 and (
        any(k in text for k in _COMPLEXITY_TRIVIAL_KEYWORDS) or len(mentioned) <= 1
    ):
        return "trivial"
    if size <= 25:
        return "simple" if len(mentioned) <= 2 else "medium"
    return "medium"


def _scope_metadata(scope: MemoryScope) -> dict:
    return {
        "tenant_id": scope.tenant_id,
        "project_id": scope.project_id,
        "agent_id": scope.agent_id,
        "environment": scope.environment,
    }


def _utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


def _format_self_status(snapshot: Mapping[str, Any]) -> str:
    """Render the live monitoring snapshot (same data as /monitoring) as a
    concise Arabic health report for self-inspection requests."""
    runtime = snapshot.get("runtime") or {}
    ollama = snapshot.get("models", {}).get("ollama") or {}
    storage = snapshot.get("storage") or {}
    issues = snapshot.get("health_issues") or []

    uptime = runtime.get("uptime_seconds") or 0
    mins = int(uptime // 60)
    secs = int(uptime % 60)
    uptime_txt = f"{mins} د {secs} ث" if mins else f"{secs} ث"

    lines = ["فحص الحالة الحية:"]
    status = "يعمل" if runtime.get("status") == "ok" else "تعذّر التحقق"
    lines.append(
        f"• AIC Runtime: {status} (بيئة {runtime.get('environment', '؟')}) — تشغيل منذ {uptime_txt}"
    )
    lines.append(
        "• المهام: {total} إجمالًا — نشطة {active}، بانتظار موافقة {appr}، فاشلة {failed}".format(
            total=runtime.get("tasks_total", 0),
            active=runtime.get("active_tasks", 0),
            appr=(runtime.get("awaiting_approvals", 0) or 0) + (runtime.get("queued_approvals", 0) or 0),
            failed=runtime.get("failed_tasks", 0),
        )
    )
    if ollama.get("ok"):
        lines.append(f"• Ollama: متصل — {ollama.get('model_count', 0)} نموذجًا متاحًا")
    else:
        err = (ollama.get("error") or "غير معروف")[:80]
        lines.append(f"• Ollama: غير متصل ({err})")
    bad_stores = [name for name, probe in storage.items()
                  if isinstance(probe, dict) and probe.get("ok") is False]
    if bad_stores:
        lines.append(f"• قواعد البيانات: مشكلة في: {', '.join(bad_stores)}")
    else:
        lines.append("• قواعد البيانات والتدقيق: سليمة")
    if issues:
        lines.append("• تنبيهات: " + "؛ ".join(str(i) for i in issues))
    lines.append("لا توجد أي استدعاءات نماذج أو تعديلات في هذا الفحص.")
    return "\n".join(lines)


def _norm_replacements(spec: Mapping[str, Any]) -> list[dict]:
    """Accept either inline {"old","new"} or a "replacements" list."""
    if spec.get("replacements"):
        reps = list(spec["replacements"])
    elif "old" in spec and "new" in spec:
        reps = [{"old": spec["old"], "new": spec["new"]}]
    else:
        raise ValueError(f"edit spec for {spec.get('path')} needs 'replacements' or old/new")
    for rep in reps:
        if not isinstance(rep.get("old"), str) or not isinstance(rep.get("new"), str):
            raise ValueError(f"invalid replacement entry for {spec.get('path')}")
        if rep["old"] == "" and rep["new"] != "":
            # Defined append semantics: the local coder models consistently
            # use an empty needle to mean "append new to the end of the
            # file". Accept it as an explicit, unambiguous operation —
            # fighting the idiom burned the whole proposal budget in live
            # tasks. Whitespace-only needles stay rejected, and every append
            # still passes through human approval and the diff/test gates.
            continue
        if not rep["old"].strip():
            raise ValueError(
                f"empty replacement 'old' text in {spec.get('path')}"
            )
    return reps


def _affected_paths(proposal: Mapping[str, Any]) -> list[str]:
    paths: list[str] = []
    for spec in proposal.get("files", []):
        paths.append(spec["path"])
        if spec.get("action") == "rename":
            paths.append(spec.get("new_path") or spec.get("to") or "")
    return [p for p in paths if p]


# Generated/build artifacts a proposal must never target. Proven in the
# readiness audit: the local model proposed creating a file under
# tests/__pycache__ because the artifact appeared in the repository context.
# Checked as path components, not substrings, so "distribute.py" is fine.
GENERATED_PATH_COMPONENTS = frozenset({
    "__pycache__", ".next", "_next", "dist", "out", "out-prod",
    "node_modules", ".git", ".venv", "venv", "build", ".cache",
})


def _check_not_generated(path: str) -> None:
    parts = Path(path).parts
    if any(part in GENERATED_PATH_COMPONENTS for part in parts):
        raise ValueError(f"proposal targets generated/cache path: {path}")
    if path.endswith(".pyc"):
        raise ValueError(f"proposal targets generated artifact: {path}")


def _is_generated_path(rel: Path) -> bool:
    return (any(part in GENERATED_PATH_COMPONENTS for part in rel.parts)
            or str(rel).endswith(".pyc"))


def validate_proposal(proposal: Mapping[str, Any], boundary: ProjectBoundary) -> dict:
    """Structural + policy validation of a change proposal. Raises ValueError."""
    files = proposal.get("files")
    if not isinstance(files, list) or not files:
        raise ValueError("proposal must contain a non-empty 'files' list")
    normalized_files = []
    for spec in files:
        if not isinstance(spec, Mapping) or not isinstance(spec.get("path"), str):
            raise ValueError("each file spec needs a 'path'")
        action = spec.get("action", "edit")
        if action not in ("edit", "create", "rename"):
            raise ValueError(f"unsupported action '{action}' for {spec['path']}")
        boundary.inside(boundary.root / spec["path"])  # containment check
        _check_not_generated(spec["path"])
        existing = boundary.root / spec["path"]
        if action == "create" and existing.exists():
            # Fail before an approval is requested: discovering the conflict
            # post-approval wasted a human decision and failed the task.
            raise ValueError(f"create target already exists: {spec['path']}")
        if action == "edit" and not existing.is_file():
            raise ValueError(f"edit target does not exist: {spec['path']}")
        entry: dict[str, Any] = {
            "path": spec["path"],
            "action": action,
            "description": str(spec.get("description", "")),
        }
        if action == "edit":
            entry["replacements"] = _norm_replacements(spec)
            for rep in entry["replacements"]:
                if rep["old"] == rep["new"]:
                    # Proven behavior of the small local model: it "fixes" a
                    # failing test by proposing old == new. A zero-diff edit
                    # can never satisfy the goal — reject before approval.
                    raise ValueError(
                        f"no-op replacement in {spec['path']}: old == new"
                    )
        elif action == "create":
            if not isinstance(spec.get("content"), str):
                raise ValueError(f"create spec for {spec['path']} needs 'content'")
            entry["content"] = spec["content"]
        else:  # rename
            target = spec.get("new_path") or spec.get("to")
            if not isinstance(target, str) or not target:
                raise ValueError(f"rename spec for {spec['path']} needs 'new_path'")
            boundary.inside(boundary.root / target)
            _check_not_generated(target)
            if target == spec["path"]:
                raise ValueError(f"rename source == destination: {target}")
            if not (boundary.root / spec["path"]).is_file():
                raise ValueError(f"rename source does not exist: {spec['path']}")
            if (boundary.root / target).exists():
                raise ValueError(f"rename destination already exists: {target}")
            entry["new_path"] = target
        normalized_files.append(entry)

    tests = proposal.get("tests") or []
    normalized_tests = []
    for test in tests:
        if not isinstance(test, Mapping) or not isinstance(test.get("command"), list):
            raise ValueError("each test needs a 'command' list")
        check_allowed(test["command"])  # raises CommandNotAllowed with reason
        normalized_tests.append({"name": str(test.get("name", " ".join(map(str, test["command"])))), "command": list(test["command"])})

    return {
        "files": normalized_files,
        "rationale": str(proposal.get("rationale", "")),
        "risks": str(proposal.get("risks", "")),
        "tests": normalized_tests,
    }


class DeveloperEvaluator:
    """Evaluates a finished development task against its proposal."""

    def __init__(self, router=None) -> None:
        self._router = router  # optional LLM judge; None -> deterministic only

    def evaluate(
        self,
        *,
        instruction: str,
        proposal: Mapping[str, Any],
        modified_paths: list[str],
        diffs: Mapping[str, str],
        test_results: list[dict],
    ) -> dict:
        proposed_paths = set()
        for spec in proposal.get("files", []):
            proposed_paths.add(spec["path"])
            # a rename touches both the source and the destination path
            if spec.get("new_path"):
                proposed_paths.add(spec["new_path"])
        changed = set(modified_paths)
        tests_passed = bool(test_results) and all(t["passed"] for t in test_results)
        scope_match = bool(changed) and changed.issubset(proposed_paths)
        goal_achieved, goal_reason, eval_mode = self._judge_goal(
            instruction, proposal, diffs, tests_passed, scope_match
        )

        checks = {
            "tests_passed": tests_passed,
            "typecheck_lint_passed": tests_passed,  # lint/typecheck run as allowlisted tests
            "scope_match": scope_match,
            "goal_achieved": goal_achieved,
            "files_changed": sorted(changed),
            "regression_risk": "low" if (tests_passed and scope_match) else "medium",
        }
        score = round(
            0.4 * float(tests_passed)
            + 0.2 * float(scope_match)
            + 0.4 * float(goal_achieved),
            2,
        )
        success = tests_passed and scope_match and goal_achieved
        reason = (
            f"tests_passed={tests_passed}, scope_match={scope_match}, "
            f"goal_achieved={goal_achieved} ({goal_reason})"
        )
        return {"success": success, "score": score, "reason": reason,
                "checks": checks, "evaluation_mode": eval_mode}

    def _judge_goal(self, instruction, proposal, diffs, tests_passed,
                    scope_match) -> tuple[bool, str, str]:
        """Returns (goal_achieved, reason, evaluation_mode).

        The blocking LLM judge was the measured bottleneck (29–80 s per task).
        Deterministic evidence — required tests passing, a real diff, changes
        inside the approved scope — is sufficient to confirm the goal, so the
        LLM is consulted only when the evidence is genuinely ambiguous
        (tests pass but nothing changed).
        """
        has_diff = bool(diffs) and any((d or "").strip() for d in diffs.values())
        if not tests_passed:
            return False, "deterministic: required tests did not pass", "deterministic"
        if not has_diff:
            return self._llm_judge(instruction, proposal, diffs)
        if not scope_match:
            return False, "deterministic: changes outside approved scope", "deterministic"
        return True, "deterministic: proposal applied in scope with passing tests", "deterministic"

    def _llm_judge(self, instruction, proposal, diffs) -> tuple[bool, str, str]:
        if self._router is None:
            # Ambiguous outcome and no judge to resolve it: refuse to claim
            # success rather than fabricate a verdict.
            return False, "no LLM judge configured and diff is empty; goal unverifiable", "deterministic"
        try:
            diff_text = json.dumps(diffs, ensure_ascii=False)[:4000]
            response = self._router.generate(
                AIRequest(
                    system=(
                        "You are a strict development-task judge. Respond with a single "
                        'raw JSON object only: {"goal_achieved": true|false, "reason": "..."}'
                    ),
                    prompt=(
                        f"Task instruction:\n{instruction}\n\n"
                        f"Rationale:\n{proposal.get('rationale', '')}\n\n"
                        f"Applied changes (unified diffs):\n{diff_text}\n\n"
                        "Did the changes achieve the stated goal? Answer only with the JSON object."
                    ),
                    max_tokens=300,
                    timeout=180,  # measured p95 ~80 s on CPU + margin
                )
            )
            verdict = json.loads(RuntimeRouter._extract_json(response.text, key='"goal_achieved"'))
            return bool(verdict.get("goal_achieved")), str(verdict.get("reason", ""))[:300], "llm_judge"
        except Exception as exc:  # noqa: BLE001 - judge failure must not kill the task
            return False, f"judge unavailable ({type(exc).__name__}); goal unverifiable", "deterministic"


class DeveloperAgent:
    """Governed development agent over a single confined project root."""

    def __init__(
        self,
        *,
        var_dir: str | Path,
        project_root: str | Path,
        config: AICConfig | None = None,
        router=None,
        model_router: ModelRouter | None = None,
        memory: MemoryService | None = None,
        evaluator: DeveloperEvaluator | None = None,
    ) -> None:
        self.var_dir = Path(var_dir)
        self.var_dir.mkdir(parents=True, exist_ok=True)
        self.boundary = ProjectBoundary(project_root)
        self.project_root = self.boundary.root
        self.config = config or AICConfig.load()

        self.store = DevTaskStore(self.var_dir / "aic_runtime.db")
        self.events = EventLog(self.var_dir / "aic_runtime.db")
        # Governance hardening: persistent approval queue + append-only audit
        self.approvals = ApprovalStore(self.var_dir / "aic_runtime.db")
        self.audit = AuditLedger(self.var_dir / "aic_audit.db")
        if memory is not None:
            self.memory = memory
            self._own_memory = False
        else:
            self._memory_store = SqliteMemoryStore(self.var_dir / "aic_memory.db")
            self.memory = MemoryService(store=self._memory_store)
            self._own_memory = True

        self.model_router = model_router or ModelRouter(self.config, var_dir=self.var_dir)
        if router is not None:
            self.router = router
        else:
            self.router = RuntimeRouter()
            for purpose in ("general", "coding"):
                self.router.register(
                    purpose,
                    OllamaProvider(
                        model=self.model_router.desired_model(purpose),
                        base_url=self.config.ollama_url,
                    ),
                )
        if isinstance(self.router, RuntimeRouter):
            self.router.model_router = self.model_router
        self.evaluator = evaluator or DeveloperEvaluator(router=self.router)

        self.tools = ToolRegistry()
        register_developer_tools(self.tools, self.boundary)
        self.checkpoints_dir = self.var_dir / "dev_checkpoints"
        # Per-agent proposal-context cache; invalidated on new task + writes.
        self._ctx_cache: dict[str, str] = {}

        self._threads: dict[str, threading.Thread] = {}
        self._locks: dict[str, threading.Lock] = {}
        self._locks_guard = threading.Lock()
        # Per-task model/settings overrides (manual per-task choice only —
        # never a persistent config change). In-memory by design: an override
        # lives exactly as long as its task.
        self._task_overrides: dict[str, dict] = {}

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def submit(
        self,
        instruction: str,
        *,
        proposal: Mapping[str, Any] | None = None,
        actor: str = "system",
        wait: bool = False,
        model: str | None = None,
        settings: Mapping[str, Any] | None = None,
    ) -> str:
        environment = normalize_environment(self.config.environment)
        validated = validate_proposal(proposal, self.boundary) if proposal is not None else None
        # Per-task overrides are validated BEFORE the task exists: an invalid
        # model choice or setting must fail the request, never fall back
        # silently to Auto (governance + quality floors are not bypassable).
        override_model = model.strip() if isinstance(model, str) and model.strip() else None
        if override_model is not None:
            purpose = self.model_router.classify(instruction)
            validate_model_override(self.model_router, override_model, purpose)
        override_settings = validate_task_settings(settings)
        self._ctx_cache.clear()  # a new task must never see a previous task's snapshot
        task_id = self.store.create(
            instruction=instruction,
            project_root=str(self.project_root),
            environment=environment,
            actor=actor,
        )
        if override_model is not None or override_settings:
            self._task_overrides[task_id] = {
                "model": override_model,
                "settings": override_settings,
            }
            self.events.append(task_id, "task_override", {
                "model": override_model, "settings": override_settings,
            })
        self.events.append(task_id, "task_received", {"instruction": instruction, "actor": actor})
        self.audit.record(
            "task_created",
            task_id=task_id, actor=actor, agent_id=DEVELOPER_AGENT_ID,
            environment=environment,
            detail={"instruction": instruction[:500], "project": str(self.project_root)},
        )
        if validated is not None:
            self.store.update(task_id, ("received",), proposal=validated)
            return self._dispatch_run(task_id, wait)
        # Deterministic intent gate: greetings/general chat must never reach
        # the coding model or the proposal/approval pipeline, and ambiguous
        # input must ask for clarification instead of assuming a code change.
        # A manual model selection NEVER overrides the gate (no model call
        # happens for these tasks at all).
        intent = classify_intent(instruction)
        if intent.kind != DEVELOPMENT_TASK:
            self.events.append(task_id, "intent_classified", {
                "classification": intent.kind,
                "reason": intent.reason,
            })
            self.audit.record(
                "intent_classified",
                task_id=task_id, actor=actor, agent_id=DEVELOPER_AGENT_ID,
                environment=environment,
                detail={"classification": intent.kind, "reason": intent.reason},
            )
            if intent.kind == ANALYSIS:
                # Read-only understanding task: keep the (already validated)
                # per-task overrides — exactly one model call will run — and
                # answer in the background. Never proposes, approves, writes.
                return self._dispatch_analyze(task_id, wait)
            self._task_overrides.pop(task_id, None)
            if intent.kind == SELF_STATUS:
                # Answer from the live health snapshot (the same collector
                # the /monitoring endpoint serves) — no model, no tools.
                from .monitoring import collect_monitoring
                snapshot = collect_monitoring(
                    dev_store=self.store,
                    approvals_store=self.approvals,
                    audit=self.audit,
                    memory_db_path=self.var_dir / "aic_memory.db",
                    event_db_path=self.var_dir / "aic_runtime.db",
                    ollama_url=self.config.ollama_url,
                    config_environment=environment,
                )
                summary = _format_self_status(snapshot)
                terminal_state = "no_action"
            else:
                snapshot = None
                summary = intent.response
                terminal_state = ("no_action" if intent.kind == CONVERSATION
                                  else "clarification_required")
            self.store.update(
                task_id,
                ("received",),
                state=terminal_state,
                result={
                    "summary": summary,
                    "files_changed": [],
                    "evaluation": {
                        "success": True,
                        "score": 1.0,
                        "reason": f"intent classified as {intent.kind}: {intent.reason}",
                        "checks": {},
                    },
                    "tests": [],
                    "classification": intent.kind,
                },
                finished_at=_utcnow(),
            )
            return task_id
        return self._dispatch_run(task_id, wait)

    def get_task(self, task_id: str) -> dict | None:
        return self.store.get(task_id)

    def list_tasks(self, limit: int = 100) -> list[dict]:
        return self.store.list(limit)

    def task_events(self, task_id: str) -> list[dict]:
        return self.events.list(task_id)

    # ------------------------------------------------------------------
    # Dispatch helpers (sync when wait=True, background thread otherwise)
    # ------------------------------------------------------------------
    def _dispatch_run(self, task_id: str, wait: bool) -> str:
        if wait:
            self._run(task_id)
        else:
            thread = threading.Thread(
                target=self._run_safe, args=(task_id,), daemon=True, name=f"aic-dev-{task_id}"
            )
            self._threads[task_id] = thread
            thread.start()
        return task_id

    def _dispatch_execute(self, task_id: str, wait: bool) -> dict:
        if wait:
            # Always go through _execute_safe: the synchronous path used to
            # call _execute directly and skip the finally-block that revokes
            # the approval token, leaving a valid write token after the task
            # ended. _execute_safe never propagates (it fails the task), so
            # callers see the same terminal state either way.
            self._execute_safe(task_id)
        else:
            thread = threading.Thread(
                target=self._execute_safe, args=(task_id,), daemon=True, name=f"aic-dev-exec-{task_id}"
            )
            self._threads[task_id] = thread
            thread.start()
        return self.store.get(task_id)

    def approve(self, task_id: str, *, actor: str = "unknown", reason: str = "",
                 wait: bool = False) -> dict:
        task = self._require_task(task_id)
        if task["state"] != "awaiting_approval":
            raise RuntimeError(f"task {task_id} in state {task['state']} cannot be approved")
        pending = self.approvals.pending_for_task(task_id)
        if not pending:
            expired = [a for a in self.approvals.for_task(task_id)
                       if a["status"] == "expired"]
            if not expired:
                raise RuntimeError(f"no pending approval found for {task_id}")
            # The previous request expired undecided: re-queue a fresh approval
            # for the same proposal instead of dead-ending the task forever.
            proposal = task.get("proposal") or {}
            environment = task.get("environment") or normalize_environment(self.config.environment)
            permission = evaluate_proposal(proposal, environment)
            risk = classify_risk(proposal, environment)
            record = self.approvals.create(
                task_id=task_id,
                agent_id=DEVELOPER_AGENT_ID,
                project=str(self.project_root),
                environment=environment,
                action_type="developer_change",
                risk_level=risk["level"],
                requested_changes=expired[-1].get("requested_changes") or {},
                affected_files=expired[-1].get("affected_files")
                    or [f["path"] for f in proposal.get("files", [])],
                proposed_tests=expired[-1].get("proposed_tests")
                    or [t["name"] for t in proposal.get("tests", [])],
                reason=task["instruction"][:500],
                permission_decision=permission,
                proposal=proposal,
            )
            self.events.append(task_id, "approval_required", {
                "reason": "expired approval renewed; fresh human decision required",
                "approval_id": record["approval_id"],
            })
            pending = [record]
        return self.decide_approval(
            pending[0]["approval_id"], decision="approve", actor=actor,
            reason=reason, wait=wait,
        )

    def reject(self, task_id: str, *, actor: str = "unknown", reason: str = "") -> dict:
        task = self._require_task(task_id)
        if task["state"] != "awaiting_approval":
            raise RuntimeError(f"task {task_id} in state {task['state']} cannot be rejected")
        pending = self.approvals.pending_for_task(task_id)
        if not pending:
            expired = any(a["status"] == "expired" for a in self.approvals.for_task(task_id))
            if expired:
                raise RuntimeError(
                    f"no pending approval found for {task_id}; the previous "
                    "approval expired — approve to renew it, or resubmit the task"
                )
            raise RuntimeError(f"no pending approval found for {task_id}")
        return self.decide_approval(pending[0]["approval_id"], decision="reject", actor=actor, reason=reason)

    def decide_approval(self, approval_id: str, *, decision: str, actor: str,
                        reason: str = "", wait: bool = False) -> dict:
        """Decide a persisted approval by id and drive the task forward."""
        record = self.approvals.get(approval_id)
        if record is None:
            raise KeyError(f"approval not found: {approval_id}")
        task_id = record["task_id"]
        record = self.approvals.decide(
            approval_id, decision=decision, actor=actor, reason=reason,
        )
        if record["status"] == "expired":
            raise RuntimeError(f"approval {approval_id} expired; request a fresh approval")
        self.audit.record(
            "approval_decided",
            task_id=task_id, approval_id=record["approval_id"], actor=actor,
            agent_id=DEVELOPER_AGENT_ID, environment=record["environment"],
            detail={
                "decision": record["status"],
                "reason": reason,
                "risk_level": record["risk_level"],
                "proposal_hash": record["proposal_hash"],
            },
        )
        if record["status"] == "approved":
            self.tools.issue_token(task_id)
            self.store.update(task_id, ("awaiting_approval",), state="approved")
            self.events.append(task_id, "approval_granted", {"actor": actor, "reason": reason})
            return self._dispatch_execute(task_id, wait)
        self.store.update(task_id, ("awaiting_approval",), state="rejected", finished_at=_utcnow())
        self.events.append(task_id, "approval_rejected", {"actor": actor, "reason": reason})
        return self.store.get(task_id)

    def _decide(self, task_id: str, *, decision: str, actor: str, reason: str) -> dict:
        """Persist the human decision on this task's pending approval."""
        pending = self.approvals.pending_for_task(task_id)
        if not pending:
            raise RuntimeError(f"no pending approval found for task {task_id}")
        record = self.approvals.decide(
            pending[0]["approval_id"], decision=decision, actor=actor, reason=reason,
        )
        self.audit.record(
            "approval_decided",
            task_id=task_id, approval_id=record["approval_id"], actor=actor,
            agent_id=DEVELOPER_AGENT_ID, environment=record["environment"],
            detail={
                "decision": record["status"],
                "reason": reason,
                "risk_level": record["risk_level"],
                "proposal_hash": record["proposal_hash"],
            },
        )
        return record

    def resume(self, task_id: str, *, actor: str = "system", wait: bool = True) -> dict:
        task = self._require_task(task_id)
        if task["state"] in DEV_TERMINAL_STATES:
            raise RuntimeError(f"task {task_id} is terminal ({task['state']}) and cannot be resumed")
        self.events.append(task_id, "task_resumed", {"from_state": task["state"], "actor": actor})
        self.audit.record(
            "task_resumed",
            task_id=task_id, actor=actor,
            agent_id=DEVELOPER_AGENT_ID,
            environment=task.get("environment") or normalize_environment(self.config.environment),
            detail={"from_state": task["state"]},
        )
        state = task["state"]
        if state == "awaiting_approval":
            return task  # still waiting for a human decision
        if state in ("received", "mapping", "proposing", "approved"):
            # An in-flight task must never be re-dispatched: resume would
            # re-run the pipeline, duplicate the approval request, and race
            # the worker thread that owns this task.
            raise RuntimeError(
                f"task {task_id} is active ({state}); resume is only valid for interrupted tasks"
            )
        if state == "executing" and task.get("proposal"):
            # Interrupted mid-execution: restore the checkpoint, then re-apply
            # and re-test from a clean slate instead of half-written files.
            # The explicit human resume() call is the approval act: decide the
            # persisted pending approval as approved so the governance gate in
            # _execute() passes, exactly as approve() would have.
            pending = self.approvals.pending_for_task(task_id)
            if not pending:
                raise RuntimeError(
                    f"no pending approval found for {task_id}; cannot resume execution"
                )
            record = self.approvals.decide(
                pending[0]["approval_id"], decision="approve", actor=actor,
                reason="resume after interrupt (explicit human act)",
            )
            self.audit.record(
                "approval_decided",
                task_id=task_id, approval_id=record["approval_id"], actor=actor,
                agent_id=DEVELOPER_AGENT_ID, environment=record["environment"],
                detail={
                    "decision": record["status"],
                    "reason": "resume after interrupt",
                    "risk_level": record["risk_level"],
                    "proposal_hash": record["proposal_hash"],
                },
            )
            self.events.append(task_id, "approval_granted", {
                "actor": actor, "reason": "resume after interrupt",
            })
            self._rollback(task_id, task["proposal"])
            self.tools.issue_token(task_id)
            self.store.update(task_id, ("executing",), state="approved", error=None, finished_at=None)
            return self._dispatch_execute(task_id, wait)
        self.store.update(task_id, (state,), state="received", error=None, finished_at=None)
        return self._dispatch_run(task_id, wait)

    def recover(self) -> list[str]:
        recovered = []
        for task in self.store.interrupted_tasks():
            self.store.update(task["task_id"], (), state="interrupted", error="interrupted by restart")
            self.events.append(task["task_id"], "task_interrupted", {"previous_state": task["state"]})
            recovered.append(task["task_id"])
        return recovered

    def close(self) -> None:
        self.store.close()
        self.events.close()
        self.approvals.close()
        self.audit.close()
        if self._own_memory:
            self._memory_store.close()

    # ------------------------------------------------------------------
    # Pipeline: mapping + proposal -> awaiting approval
    # ------------------------------------------------------------------
    def _run_safe(self, task_id: str) -> None:
        try:
            self._run(task_id)
        except PermissionError as exc:
            self._fail(task_id, str(exc), failure_class="policy_denial", stage="policy_gate")
        except Exception as exc:  # noqa: BLE001
            self._fail(task_id, f"unhandled: {type(exc).__name__}: {exc}", failure_class="runtime_failure", stage="unhandled")

    def _run(self, task_id: str) -> None:
        lock = self._lock(task_id)
        with lock:
            task = self.store.get(task_id)
            if task is None or task["state"] in DEV_TERMINAL_STATES:
                return
            try:
                # 1) repository mapping
                if not task.get("repo_map"):
                    self.store.update(task_id, (), state="mapping")
                    repo_map = map_repository(self.project_root)
                    self.store.update(task_id, (), repo_map=repo_map)
                    self.events.append(task_id, "repository_mapped", {
                        "project_types": repo_map.get("project_types"),
                        "main_folders": repo_map.get("main_folders"),
                    })
                task = self.store.get(task_id)

                # 2) change proposal
                if not task.get("proposal"):
                    self.store.update(task_id, (), state="proposing")
                    proposal = self._propose(task)
                    validated = validate_proposal(proposal, self.boundary)
                    self.store.update(task_id, (), proposal=validated)
                    task = self.store.get(task_id)

                proposal = task["proposal"]
                environment = task.get("environment") or normalize_environment(self.config.environment)

                # 3) governance: permission evaluation + deterministic risk
                permission = evaluate_proposal(proposal, environment)
                risk = classify_risk(proposal, environment)
                self.store.update(task_id, (), risk_level=risk["level"])
                self.audit.record(
                    "proposal_created",
                    task_id=task_id, actor=task.get("actor") or "system",
                    agent_id=DEVELOPER_AGENT_ID, environment=environment,
                    detail={
                        "files": [{"path": f["path"], "action": f["action"]} for f in proposal["files"]],
                        "tests": [t["name"] for t in proposal.get("tests", [])],
                        "risk_level": risk["level"], "risk_reasons": risk["reasons"],
                    },
                )
                self.audit.record(
                    "risk_classified",
                    task_id=task_id, agent_id=DEVELOPER_AGENT_ID, environment=environment,
                    detail={"level": risk["level"], "reasons": risk["reasons"]},
                )

                if permission["action"] == "deny":
                    raise PermissionError(
                        "proposal denied by environment policy: " + "; ".join(permission["deny_reasons"])
                    )

                # 4) persistent approval queue entry (never a transient status)
                approval = self.approvals.create(
                    task_id=task_id,
                    agent_id=DEVELOPER_AGENT_ID,
                    project=str(self.project_root),
                    environment=environment,
                    action_type="developer_change",
                    risk_level=risk["level"],
                    requested_changes={
                        "files": [{"path": f["path"], "action": f["action"], "description": f.get("description", "")} for f in proposal["files"]],
                        "rationale": proposal.get("rationale", ""),
                        "risks": proposal.get("risks", ""),
                    },
                    affected_files=[f["path"] for f in proposal["files"]],
                    proposed_tests=[t["name"] for t in proposal.get("tests", [])],
                    reason=task["instruction"][:500],
                    permission_decision=permission,
                    proposal=proposal,
                )
                self.audit.record(
                    "approval_requested",
                    task_id=task_id, approval_id=approval["approval_id"],
                    actor=task.get("actor") or "system",
                    agent_id=DEVELOPER_AGENT_ID, environment=environment,
                    detail={
                        "risk_level": risk["level"],
                        "affected_files": approval["affected_files"],
                        "expires_at": approval["expires_at"],
                        "permission_action": permission["action"],
                    },
                )

                self.events.append(task_id, "change_proposed", {
                    "files": [{"path": f["path"], "action": f["action"]} for f in proposal["files"]],
                    "tests": [t["name"] for t in proposal.get("tests", [])],
                    "rationale": proposal.get("rationale", ""),
                    "risks": proposal.get("risks", ""),
                    "risk_level": risk["level"],
                    "approval_id": approval["approval_id"],
                })
                self.store.update(task_id, (), state="awaiting_approval", started_at=_utcnow())
                self.events.append(task_id, "approval_required", {
                    "files": [{"path": f["path"], "action": f["action"]} for f in proposal["files"]],
                    "approval_id": approval["approval_id"],
                    "risk_level": risk["level"],
                })
            except Exception as exc:  # noqa: BLE001
                state_now = self.store.get(task_id)["state"]
                stage = "proposing" if state_now == "proposing" else "mapping" if state_now == "mapping" else "governance"
                if _is_model_failure(str(exc)):
                    failure_class = "model_failure"
                else:
                    failure_class = "runtime_failure" if not isinstance(exc, PermissionError) else "policy_denial"
                self._fail(task_id, f"[{failure_class}] {type(exc).__name__}: {exc}", failure_class=failure_class, stage=stage)

    # ------------------------------------------------------------------
    # Read-only analysis (intent gate ANALYSIS): read the referenced file(s)
    # through the project boundary, answer with exactly one model call, and
    # finish in the terminal state "answered". Never maps the repository,
    # never proposes, never requests approval, never writes.
    # ------------------------------------------------------------------
    def _dispatch_analyze(self, task_id: str, wait: bool) -> str:
        if wait:
            self._analyze_safe(task_id)
        else:
            thread = threading.Thread(
                target=self._analyze_safe, args=(task_id,), daemon=True,
                name=f"aic-dev-ana-{task_id}",
            )
            self._threads[task_id] = thread
            thread.start()
        return task_id

    def _analyze_safe(self, task_id: str) -> None:
        try:
            self._analyze(task_id)
        except PermissionError as exc:
            self._fail(task_id, str(exc), failure_class="policy_denial", stage="analysis")
        except Exception as exc:  # noqa: BLE001
            failure_class = ("model_failure" if _is_model_failure(str(exc))
                             else "runtime_failure")
            self._fail(task_id, f"[{failure_class}] {type(exc).__name__}: {exc}",
                       failure_class=failure_class, stage="analysis")

    def _analyze(self, task_id: str) -> None:
        lock = self._lock(task_id)
        with lock:
            task = self.store.get(task_id)
            if task is None or task["state"] in DEV_TERMINAL_STATES:
                return
            environment = normalize_environment(
                task.get("environment") or self.config.environment
            )
            self.store.update(task_id, (), state="analyzing", started_at=_utcnow())

            # 1) read the referenced file(s) through the project boundary
            paths = extract_file_paths(task["instruction"])
            self.events.append(task_id, "analysis_started", {"files": paths})
            files_read: list[tuple[str, str]] = []
            read_errors: list[str] = []
            for path in paths:
                try:
                    outcome = self.tools.execute("read_project_file", path=path)
                    files_read.append((outcome["path"], outcome["content"]))
                except Exception as exc:  # noqa: BLE001 - report, continue
                    read_errors.append(f"{path}: {exc}")
            if not files_read:
                raise FileNotFoundError(
                    "no readable project file found for analysis "
                    f"(tried: {', '.join(paths) or '—'}); "
                    f"errors: {'; '.join(read_errors) or 'none'}"
                )
            self.events.append(task_id, "files_read", {
                "files": [name for name, _ in files_read],
            })

            # 2) model selection — same path as _propose (manual per-task
            # override already validated at submit; quality floors intact)
            override = self._task_overrides.get(task_id) or {}
            selection = self.model_router.select(task["instruction"])
            if override.get("model"):
                selection = {
                    "purpose": selection["purpose"],
                    "provider": selection["provider"],
                    "model": override["model"],
                    "selection": "manual_override",
                }
            task_settings = override.get("settings") or {}
            self.router.preferred = selection["provider"]
            if isinstance(self.router, RuntimeRouter):
                self.router.model_override = selection["model"]
            self.events.append(task_id, "model_selected", dict(selection))
            self.audit.record(
                "model_selected",
                task_id=task_id, agent_id=DEVELOPER_AGENT_ID,
                environment=environment, detail=selection,
            )

            # 3) exactly one model call: the file contents ARE the facts
            context = "\n\n".join(
                f"### {name}\n{content}" for name, content in files_read
            )
            response = self.router.generate(
                AIRequest(
                    system=(
                        "You are AFAQ Developer Agent in read-only analysis "
                        "mode. Answer the user's question in Arabic (keep "
                        "code identifiers in their original form), based "
                        "strictly on the provided file contents. Do not "
                        "propose changes, do not output patches, and do not "
                        "claim that any file was modified."
                    ),
                    prompt=(
                        f"Question:\n{task['instruction']}\n\n"
                        f"File contents:\n{context}\n\n"
                        "Answer the question directly and precisely."
                    ),
                    max_tokens=int(task_settings.get("max_tokens", 1500)),
                    timeout=(
                        float(task_settings["timeout"])
                        if "timeout" in task_settings else 300.0
                    ),
                    model=selection["model"],
                    keep_alive=task_settings.get(
                        "keep_alive", self._keep_alive_for(selection["model"])),
                )
            )
            summary = (getattr(response, "text", "") or "").strip()
            if not summary:
                raise RuntimeError("model returned an empty analysis answer")
            self.events.append(task_id, "model_used", {
                "model": selection["model"],
                "selection": selection["selection"],
            })

            # 4) terminal answer — no proposal, no approval, no writes
            read_names = [name for name, _ in files_read]
            self.store.update(
                task_id,
                (),
                state="answered",
                result={
                    "summary": summary,
                    "files_changed": [],
                    "files_read": read_names,
                    "evaluation": {
                        "success": True,
                        "score": 1.0,
                        "reason": "read-only analysis; no changes proposed",
                        "checks": {},
                    },
                    "tests": [],
                    "classification": ANALYSIS,
                },
                finished_at=_utcnow(),
            )
            self.audit.record(
                "analysis_answered",
                task_id=task_id, agent_id=DEVELOPER_AGENT_ID,
                environment=environment,
                detail={"model": selection["model"], "files_read": read_names},
            )

    def _propose(self, task: Mapping[str, Any]) -> Mapping[str, Any]:
        repo_map = task.get("repo_map") or {}
        override = self._task_overrides.get(task["task_id"]) or {}
        selection = self.model_router.select(task["instruction"])
        if override.get("model"):
            # Manual per-task choice replaces the router's pick (validated
            # at submit) but never its governance: the override model was
            # already cleared for hardware fit, role, and quality floors.
            selection = {
                "purpose": selection["purpose"],
                "provider": selection["provider"],
                "model": override["model"],
                "selection": "manual_override",
            }
        task_settings = override.get("settings") or {}
        self.router.preferred = selection["provider"]
        if isinstance(self.router, RuntimeRouter):
            self.router.model_override = selection["model"]
        environment = normalize_environment(
            task.get("environment") or self.config.environment
        )
        self.events.append(task["task_id"], "model_selected", dict(selection))
        self.audit.record(
            "model_selected",
            task_id=task["task_id"], agent_id=DEVELOPER_AGENT_ID,
            environment=environment,
            detail=selection,
        )
        complexity = _classify_complexity(task["instruction"], repo_map)
        task_id = task["task_id"]
        self.audit.record(
            "complexity_classified",
            task_id=task_id, agent_id=DEVELOPER_AGENT_ID, environment=environment,
            detail={"complexity": complexity},
        )
        attempts = self._attempt_plan(selection, complexity, environment)
        last_text = ""
        model_errors: list[str] = []
        seen_outputs: set[str] = set()  # no-progress: identical output = no new evidence
        parse_feedback = (
            "\nYour previous output was not parseable raw JSON. Return exactly one "
            "JSON object: no markdown fences and no Python-style triple-quoted "
            "strings (use \\n escapes inside strings)."
        )
        for idx, (model, kind, tier) in enumerate(attempts):
            budget, per_file = _CONTEXT_TIERS[tier]
            context = self._proposal_context(repo_map, budget=budget, per_file=per_file)
            prompt = self._proposal_prompt(task, repo_map, context)
            keep_alive = self._keep_alive_for(model) if kind == "fast" else None
            timeout = self._proposal_timeout(model)
            proposal: Mapping[str, Any] | None = None
            gate_reason = "unparseable"
            feedback = ""
            for _ in range(MAX_PROPOSAL_ATTEMPTS):
                try:
                    response = self.router.generate(
                        AIRequest(
                            system="You are AFAQ Developer Agent. Propose minimal, exact changes.",
                            prompt=prompt + feedback,
                            max_tokens=int(task_settings.get("max_tokens", 2500)),
                            timeout=(
                                float(task_settings["timeout"])
                                if "timeout" in task_settings else timeout
                            ),
                            model=model,
                            keep_alive=task_settings.get("keep_alive", keep_alive),
                        )
                    )
                except Exception as exc:  # noqa: BLE001 - model/backend failure
                    # A single transient failure must not kill the task: burn the
                    # remaining proposal attempts first. An unavailable backend
                    # (timeout / unreachable / missing model) cannot heal by
                    # retrying, so fail fast instead of multiplying the wait.
                    msg = f"{type(exc).__name__}: {exc}"
                    model_errors.append(msg)
                    if _is_model_failure(msg):
                        break
                    continue
                if response.text in seen_outputs:
                    break  # no-progress guard: the model repeated itself
                seen_outputs.add(response.text)
                last_text = response.text
                try:
                    proposal = json.loads(
                        RuntimeRouter._extract_json(response.text, key='"files"')
                    )
                except ValueError:
                    feedback = parse_feedback
                    continue
                # One contract for every model kind: a proposal that would
                # fail at apply/test time must never reach the approval
                # queue — no matter which model produced it. The gate
                # (structure + anchors + patched-file syntax) feeds its
                # rejection reason back into the bounded retry above.
                gate_ok, gate_reason = self._proposal_gate(proposal)
                self.audit.record(
                    "model_attempt",
                    task_id=task_id, agent_id=DEVELOPER_AGENT_ID, environment=environment,
                    detail={
                        "model": model, "kind": kind, "complexity": complexity,
                        "context_tier": tier, "context_bytes": len(context.encode("utf-8")),
                        "gate": gate_reason,
                    },
                )
                if gate_ok:
                    # The model that actually produced the accepted proposal
                    # — the UI reads this instead of inferring from names.
                    self.events.append(task_id, "model_used", {
                        "model": model, "kind": kind,
                        "selection": selection["selection"],
                    })
                    if kind == "fast":
                        self.events.append(task_id, "fast_first_accepted", {
                            "model": model, "complexity": complexity,
                            "context_tier": tier,
                        })
                    return proposal
                proposal = None
                if kind == "fast" and gate_reason.startswith("anchor not found"):
                    break  # insufficient-context evidence: bigger tier, not feedback
                # Feed the exact rejection back so the next try (bounded by
                # MAX_PROPOSAL_ATTEMPTS) can correct it. The previous behavior
                # retried with the identical prompt, which at temperature 0
                # reproduces the identical invalid proposal.
                feedback = (
                    f"\nYour previous proposal was rejected: {gate_reason}. "
                    "Return the full corrected JSON object."
                )
            # Quality gate failed. The ONLY evidence that justifies a bigger
            # context is a missing anchor; anything else escalates the model
            # (at most once, by construction of the attempts list).
            if kind == "fast" and gate_reason.startswith("anchor not found"):
                continue  # next attempt: same fast model, bigger context tier
            if kind == "fast" and (
                idx + 1 >= len(attempts) or attempts[idx + 1][0] != model
            ):
                # Escalation event only when the NEXT attempt actually moves
                # to a different (stronger) model — a same-model context-tier
                # bump is not an escalation and must not be displayed as one.
                self.events.append(task_id, "model_escalated", {
                    "from_model": model, "gate": gate_reason,
                })
        detail = f"{len(model_errors)} model error(s): {' | '.join(model_errors[:2])}" if model_errors else f"last text: {last_text[:300]}"
        raise ValueError(f"model did not return a parseable proposal after {MAX_PROPOSAL_ATTEMPTS} attempts ({detail})")

    # -- fast-first + adaptive helpers ------------------------------------

    def _attempt_plan(
        self,
        selection: Mapping[str, Any],
        complexity: str,
        environment: str,
    ) -> list[tuple[str, str, int]]:
        """Ordered (model, kind, context_tier) attempts.

        Fast-first applies only to local, low-risk, simple coding tasks:
        trivial/simple complexity outside production. Anything else goes
        straight to the strong model at the full legacy context tier. At most
        one escalation to the strong model ever happens.
        """
        base = selection["model"]
        if selection.get("selection") == "manual_override":
            # The operator picked this model for THIS task. Fast-first
            # escalation would discard their choice after one gate failure,
            # so a manual override always runs exactly this model.
            return [(base, "strong", 2)]
        if (
            selection["purpose"] != "coding"
            or complexity in ("medium", "complex")
            or environment == "production"
        ):
            return [(base, "strong", 2)]
        fast = (
            self.model_router.fastest_model("coding")
            if hasattr(self.model_router, "fastest_model")
            else None
        )
        if fast is None or fast == base:
            return [(base, "strong", 2)]
        return [(fast, "fast", 0), (fast, "fast", 1), (base, "strong", 2)]

    def _proposal_gate(self, proposal: Mapping[str, Any]) -> tuple[bool, str]:
        """Deterministic acceptance gate for a proposal (fast AND strong).

        Structural/policy validation plus evidence that the patch would
        actually apply: every replacement anchor exists in the target file,
        and the fully-patched result must stay syntactically valid Python.
        A proposal that cannot apply is rejected before an approval is
        requested — proven live: a strong-model test insertion with broken
        indentation passed every structural check, failed at run time, and
        burned the fix budget + a rollback.
        """
        try:
            normalized = validate_proposal(proposal, self.boundary)
        except ValueError as exc:
            return False, f"invalid: {exc}"
        for entry in normalized["files"]:
            if entry["action"] == "create":
                if entry["path"].endswith(".py"):
                    try:
                        compile(entry["content"], entry["path"], "exec")
                    except SyntaxError as exc:
                        return False, f"invalid python syntax in {entry['path']}: {exc}"
                continue
            if entry["action"] != "edit":
                continue
            try:
                content = (self.boundary.root / entry["path"]).read_text(
                    encoding="utf-8", errors="replace"
                )
            except OSError as exc:
                return False, f"unreadable {entry['path']}: {exc}"
            for rep in entry["replacements"]:
                if not rep["old"]:
                    continue  # append: no anchor to verify against
                if rep["old"] not in content:
                    return False, f"anchor not found in {entry['path']}"
            patched = content
            for rep in entry["replacements"]:
                if rep["old"] == "":
                    sep = "" if not patched or patched.endswith("\n") else "\n"
                    patched = patched + sep + rep["new"]
                else:
                    patched = patched.replace(rep["old"], rep["new"], 1)
            if entry["path"].endswith(".py"):
                try:
                    compile(patched, entry["path"], "exec")
                except SyntaxError as exc:
                    return False, f"invalid python syntax in {entry['path']}: {exc}"
        return True, "ok"

    def _proposal_timeout(self, model: str) -> float:
        """Adaptive per-model proposal timeout from registry measurements.

        Falls back to the legacy flat ceiling when no measurement for THIS
        hardware profile exists — after a re-benchmark the values retune
        themselves, no code change needed.
        """
        router = self.model_router
        reg = router.registry if router else None
        hw = router.hardware_profile if router else None
        if reg is not None and hw is not None:
            entry = reg.entries.get(model)
            measurement = entry.measurement(profile_key(hw)) if entry else None
            measured = ((measurement or {}).get("timeouts") or {}).get("proposal_s")
            if measured:
                return max(float(measured) * 1.5, 60.0)
        return 480.0

    def _keep_alive_for(self, model: str) -> str | None:
        """Keep the fast model warm only when RAM headroom allows it.

        Policy is hardware-bound, not a fixed constant: warm-keeping requires
        total RAM >= 2x the model's requirement + 4 GB. The strong model is
        never warm-kept on tight machines. ``AIC_KEEP_ALIVE_FAST`` overrides.
        """
        env = os.getenv("AIC_KEEP_ALIVE_FAST")
        if env:
            return env
        router = self.model_router
        reg = router.registry if router else None
        hw = router.hardware_profile if router else None
        if reg is None or hw is None:
            return None
        entry = reg.entries.get(model)
        if not entry or not entry.ram_gb:
            return None
        if (hw.get("ram_total_gb") or 0) >= entry.ram_gb * 2 + 4:
            return "30m"
        return None

    def _proposal_prompt(
        self,
        task: Mapping[str, Any],
        repo_map: Mapping[str, Any],
        context: str,
    ) -> str:
        return (
            f"Development task:\n{task['instruction']}\n\n"
            f"Repository map:\n{json.dumps(repo_map, ensure_ascii=False)[:2000]}\n\n"
            f"Relevant file contents:\n{context}\n\n"
            "Return one raw JSON object (no prose, no markdown):\n"
            '{"files":[{"path":"relative/path","action":"edit|create",'
            '"description":"why","replacements":[{"old":"exact text","new":"replacement"}]},'
            '{"path":"new/file.py","action":"create","description":"...","content":"..."}],'
            '"rationale":"...","risks":"...","tests":[{"name":"unit tests",'
            '"command":["python","-m","unittest","discover","-s","tests"]}]}\n'
            "Rules: exact-string replacements only; 'old' must be exact existing "
            "file text (or empty to append to the end of the file); the patched "
            "file must stay syntactically valid — to add a class method, anchor "
            "on the last line inside the class and keep the sibling indentation; "
            "new code may only reference symbols the patched file imports or "
            "defines — extend the import line when needed; "
            "paths relative to project root; "
            "tests must use allowlisted commands; keep rationale and risks under 15 words."
        )

    def _proposal_context(
        self,
        repo_map: Mapping[str, Any],
        budget: int | None = None,
        per_file: int | None = None,
    ) -> str:
        """Bounded file snapshot so the local model can ground its proposal.

        Cached per (repository map, budget, per-file cap): the retry loop
        calls this with identical inputs, and the files cannot change
        mid-proposal — re-reading them per attempt is pure redundancy. The
        cache is cleared on every new task and after every write, so it can
        never serve stale post-edit content.
        """
        budget = budget or _PROPOSAL_CONTEXT_BUDGET
        per_file = per_file or 4_000
        key = json.dumps(
            {"map": repo_map, "budget": budget, "per_file": per_file},
            ensure_ascii=False, sort_keys=True, default=str,
        )
        cached = self._ctx_cache.get(key)
        if cached is not None:
            return cached
        chunks: list[str] = []
        used = 0
        candidates: list[Path] = []
        for name in ("README.md", "README", "pyproject.toml", "package.json"):
            path = self.project_root / name
            if path.is_file():
                candidates.append(path)
        for folder in (repo_map.get("main_folders") or [])[:3]:
            sub = self.project_root / folder
            if sub.is_dir():
                candidates.extend([
                    p for p in sorted(sub.rglob("*")) if p.is_file()
                    and not _is_generated_path(p.relative_to(self.project_root))
                ][:8])
        if not candidates:
            candidates = [
                p for p in sorted(self.project_root.rglob("*.py")) if p.is_file()
                and not _is_generated_path(p.relative_to(self.project_root))
            ][:6]
        for path in candidates:
            try:
                if path.stat().st_size > 20_000:
                    continue
                text = path.read_text(encoding="utf-8", errors="replace")
            except OSError:
                continue
            block = f"--- {path.relative_to(self.project_root)} ---\n{text[:per_file]}\n"
            if used + len(block) > budget:
                break
            chunks.append(block)
            used += len(block)
        result = "\n".join(chunks) or "(no readable files found)"
        self._ctx_cache[key] = result
        return result

    # ------------------------------------------------------------------
    # Pipeline: approval -> checkpoint -> edit -> test -> fix -> diff/eval
    # ------------------------------------------------------------------
    def _execute_safe(self, task_id: str) -> None:
        try:
            self._execute(task_id)
        except PermissionError as exc:
            self._fail(task_id, str(exc), failure_class="policy_denial", stage="governance_gate")
        except Exception as exc:  # noqa: BLE001
            message = f"{type(exc).__name__}: {exc}"
            failure_class = "model_failure" if _is_model_failure(message) else "runtime_failure"
            self._fail(task_id, f"unhandled: {message}", failure_class=failure_class, stage="unhandled")
        finally:
            # The approval token must not outlive the task that was approved:
            # revoke it on every terminal path (completion, failure, denial).
            revoke = getattr(self.tools, "revoke_token", None)
            if revoke is not None:
                revoke(task_id)

    def _execute(self, task_id: str) -> None:
        lock = self._lock(task_id)
        with lock:
            task = self.store.get(task_id)
            if task is None or task["state"] in DEV_TERMINAL_STATES:
                return
            proposal = task["proposal"]
            environment = task.get("environment") or normalize_environment(self.config.environment)

            # Governance gate: execution requires a persisted, unexpired human
            # approval whose proposal hash matches the proposal about to run.
            # Proposal drift cancels the approval and demands a fresh one.
            approved = [
                a for a in self._approvals_for_task(task_id)
                if a["status"] == "approved"
            ]
            if not approved:
                self._fail(
                    task_id,
                    "no approved approval on record; execution refused",
                    failure_class="policy_denial", stage="governance_gate",
                )
                return
            approval = approved[0]
            try:
                self.approvals.authorize_execution(approval["approval_id"], proposal)
            except Exception as exc:  # noqa: BLE001 - expired or drifted approval
                if "proposal changed" in str(exc):
                    # Drift cancels the approval; the task fails closed. A fresh
                    # approval is only possible by resubmitting the task — do not
                    # pretend the task is back in the queue.
                    self.events.append(task_id, "approval_cancelled", {
                        "reason": "proposal changed after approval; approval cancelled, resubmission required",
                    })
                self._fail(task_id, str(exc), failure_class="policy_denial", stage="governance_gate")
                return

            # Defense in depth: re-evaluate environment policy at execution time
            permission = evaluate_proposal(proposal, environment)
            if permission["action"] == "deny":
                self._fail(
                    task_id,
                    "proposal denied by environment policy at execution gate: " + "; ".join(permission["deny_reasons"]),
                    failure_class="policy_denial", stage="governance_gate",
                )
                return

            self.store.update(task_id, ("approved",), state="executing")
            token = f"APPROVED-{task_id}"
            scope = self._scope()

            # Checkpoint before any write
            checkpoint = self._checkpoint(task_id, proposal)
            self.events.append(task_id, "checkpoint_created", {
                "checkpoint_dir": str(checkpoint),
                "files": len(list(checkpoint.rglob("*"))) if checkpoint.exists() else 0,
            })
            self.audit.record(
                "checkpoint_created",
                task_id=task_id, approval_id=approval["approval_id"],
                actor=task.get("actor") or "system",
                agent_id=DEVELOPER_AGENT_ID, environment=environment,
                detail={"checkpoint_dir": str(checkpoint)},
            )

            try:
                modified = self._apply(proposal, token, task_id)
            except Exception as exc:  # noqa: BLE001
                self._rollback(task_id, proposal)
                self.events.append(task_id, "rollback_completed", {"reason": f"apply failed: {exc}"})
                self.audit.record(
                    "rollback_completed",
                    task_id=task_id, approval_id=approval["approval_id"],
                    agent_id=DEVELOPER_AGENT_ID, environment=environment,
                    detail={"reason": f"apply failed: {type(exc).__name__}: {exc}"},
                )
                self._fail(task_id, f"apply failed: {type(exc).__name__}: {exc}", failure_class="runtime_failure", stage="apply")
                return

            diffs = self._diff(task_id, proposal, modified)
            self.audit.record(
                "files_modified",
                task_id=task_id, approval_id=approval["approval_id"],
                agent_id=DEVELOPER_AGENT_ID, environment=environment,
                detail={"files": modified, "diff_files": list(diffs.keys())},
            )
            test_results = self._run_tests(task_id, proposal)
            if not all(t["passed"] for t in test_results):
                fix_outcome = self._fix_loop(task_id, proposal, test_results, token)
                if fix_outcome != "passed":
                    self._rollback(task_id, proposal)
                    if fix_outcome == "no_actionable_fix":
                        reason = "tests kept failing; diagnosis produced no actionable fix"
                        failed_names = [t["name"] for t in test_results if not t["passed"]]
                        error = f"tests still failing; no actionable fix proposed: {failed_names}"
                    else:
                        reason = "tests kept failing; fix budget exhausted"
                        failed_names = [t["name"] for t in test_results if not t["passed"]]
                        error = f"tests still failing after {MAX_FIX_ATTEMPTS} fix attempts: {failed_names}"
                    self.events.append(task_id, "rollback_completed", {"reason": reason})
                    self.audit.record(
                        "rollback_completed",
                        task_id=task_id, approval_id=approval["approval_id"],
                        agent_id=DEVELOPER_AGENT_ID, environment=environment,
                        detail={"reason": reason},
                    )
                    self._fail(
                        task_id,
                        error,
                        failure_class="development_test_failure",
                        stage="tests",
                    )
                    return
                diffs = self._diff(task_id, proposal, modified)
                test_results = self._run_tests(task_id, proposal)

            self.events.append(task_id, "tests_passed", {"tests": [t["name"] for t in test_results]})
            self.audit.record(
                "tests_run",
                task_id=task_id, approval_id=approval["approval_id"],
                agent_id=DEVELOPER_AGENT_ID, environment=environment,
                detail={
                    "results": [{"name": r["name"], "passed": r["passed"], "returncode": r["returncode"]} for r in test_results],
                },
            )

            evaluation = self.evaluator.evaluate(
                instruction=task["instruction"],
                proposal=proposal,
                modified_paths=modified,
                diffs=diffs,
                test_results=test_results,
            )
            self.events.append(task_id, "evaluation_completed", {
                "success": evaluation["success"],
                "score": evaluation["score"],
                "reason": evaluation["reason"],
                "checks": evaluation["checks"],
            })

            summary = (
                f"Changed {len(modified)} file(s): {', '.join(modified)}. "
                f"{evaluation['reason']}"
            )
            memory_ids = self._learn(task_id, task["instruction"], scope, summary, evaluation)
            self.store.update(
                task_id,
                ("executing",),
                state="completed",
                diff={p: d for p, d in diffs.items()},
                result={
                    "summary": summary,
                    "files_changed": modified,
                    "evaluation": evaluation,
                    "tests": test_results,
                },
                memory_ids=memory_ids,
                finished_at=_utcnow(),
            )
            self._task_overrides.pop(task_id, None)  # per-task override dies with the task
            self.events.append(task_id, "development_task_completed", {
                "evaluation": {"success": evaluation["success"], "score": evaluation["score"]},
                "memory_ids": memory_ids,
            })
            self.audit.record(
                "task_completed",
                task_id=task_id, approval_id=approval["approval_id"],
                actor=task.get("actor") or "system",
                agent_id=DEVELOPER_AGENT_ID, environment=environment,
                detail={
                    "files_changed": modified,
                    "evaluation": {"success": evaluation["success"], "score": evaluation["score"]},
                    "memory_ids": memory_ids,
                },
            )
            self.audit.record(
                "memory_written",
                task_id=task_id, agent_id=DEVELOPER_AGENT_ID, environment=environment,
                detail={"memory_ids": memory_ids},
            )

    # -- tools --------------------------------------------------------------
    def _apply(self, proposal: Mapping[str, Any], token: str, task_id: str) -> list[str]:
        modified: list[str] = []
        self._ctx_cache.clear()  # post-write reads must see the new content
        for spec in proposal["files"]:
            action = spec["action"]
            if action == "edit":
                result = self.tools.execute(
                    "apply_patch", path=spec["path"], replacements=spec["replacements"],
                    approval_token=token,
                )
            elif action == "create":
                result = self.tools.execute(
                    "create_file", path=spec["path"], content=spec["content"],
                    approval_token=token,
                )
            else:  # rename
                result = self.tools.execute(
                    "rename_file", path=spec["path"], new_name=spec["new_path"],
                    approval_token=token,
                )
                modified.append(spec["new_path"])
            modified.append(spec["path"])
            self.events.append(task_id, "file_modified", {
                "path": result.get("path", spec["path"]),
                "action": result.get("action", action),
            })
        # de-dup while preserving order
        seen: set[str] = set()
        ordered = [p for p in modified if not (p in seen or seen.add(p))]
        return ordered

    def _run_tests(self, task_id: str, proposal: Mapping[str, Any]) -> list[dict]:
        results: list[dict] = []
        for test in proposal.get("tests", []):
            argv = check_allowed(test["command"])  # defense in depth; validated at proposal time
            self.events.append(task_id, "tests_started", {"test": test["name"], "command": argv})
            outcome = run_allowed(argv, cwd=str(self.project_root))
            record = {
                "name": test["name"],
                "command": argv,
                "passed": outcome["passed"],
                "returncode": outcome["returncode"],
                "stdout": outcome["stdout"][-1000:],
                "stderr": outcome["stderr"][-1000:],
            }
            results.append(record)
            if outcome["passed"]:
                self.events.append(task_id, "tool_called", {"test": test["name"], "status": "ok"})
            else:
                self.events.append(task_id, "tests_failed", {
                    "test": test["name"],
                    "returncode": outcome["returncode"],
                    "stderr": outcome["stderr"][-500:],
                })
        return results

    def _fix_loop(self, task_id: str, proposal: Mapping[str, Any], test_results: list[dict], token: str) -> str:
        """Returns "passed" | "no_actionable_fix" | "budget_exhausted".

        The caller must distinguish the two failure modes instead of
        claiming the whole fix budget was spent when the diagnosis never
        offered a real change.
        """
        attempts = 0
        while attempts < MAX_FIX_ATTEMPTS:
            failing = [t for t in test_results if not t["passed"]]
            if not failing:
                return "passed"
            attempts += 1
            diagnosis = self._diagnose(task_id, proposal, failing)
            self.events.append(task_id, "diagnosis_completed", diagnosis)
            if not diagnosis.get("replacements"):
                return "no_actionable_fix"  # nothing actionable; stop burning attempts
            # No-op fixes (old == new) change nothing on disk; applying them
            # would log a successful attempt while the failure persists and
            # burn the whole fix budget on phantom repairs (proven in the
            # DEV-71b7ead5 e2e: two attempts spent on identical old/new text).
            actionable = [r for r in diagnosis["replacements"]
                          if r.get("old") != r.get("new")]
            dropped = len(diagnosis["replacements"]) - len(actionable)
            if dropped:
                self.events.append(task_id, "fix_noop_dropped", {"count": dropped})
            if not actionable:
                return "no_actionable_fix"  # diagnosis offered no real change; stop burning attempts
            diagnosis["replacements"] = actionable
            self._ctx_cache.clear()  # fix-loop writes invalidate the snapshot too
            try:
                for spec in proposal["files"]:
                    if spec["action"] == "edit" and spec["path"] == diagnosis.get("file", spec["path"]):
                        self.tools.execute(
                            "apply_patch", path=spec["path"], replacements=diagnosis["replacements"],
                            approval_token=token,
                        )
                        break
                else:
                    # The diagnosis targets a file outside the proposal: it is
                    # still inside the project boundary, but it was never
                    # checkpointed — capture it now so a later rollback
                    # restores it too.
                    diag_rel = diagnosis["file"]
                    if not any(spec["path"] == diag_rel for spec in proposal["files"]):
                        src = self.boundary.inside(self.boundary.root / diag_rel)
                        saved = self.checkpoints_dir / task_id / diag_rel
                        # Capture the pristine version exactly once: a later
                        # fix attempt would copy the already-patched file and
                        # clobber the only good checkpoint (rollback then
                        # "restored" the broken content).
                        if src.is_file() and not saved.is_file():
                            saved.parent.mkdir(parents=True, exist_ok=True)
                            shutil.copy2(src, saved)
                    self.tools.execute(
                        "apply_patch", path=diagnosis["file"], replacements=diagnosis["replacements"],
                        approval_token=token,
                    )
            except Exception as exc:  # noqa: BLE001
                self.events.append(task_id, "fix_attempted", {
                    "attempt": attempts, "ok": False, "error": f"{type(exc).__name__}: {exc}",
                })
                continue
            self.events.append(task_id, "fix_attempted", {"attempt": attempts, "ok": True})
            test_results = self._run_tests(task_id, proposal)
        return "passed" if all(t["passed"] for t in test_results) else "budget_exhausted"

    def _diagnose(self, task_id: str, proposal: Mapping[str, Any], failing: list[dict]) -> dict:
        context_parts = []
        for spec in proposal["files"]:
            if spec["action"] != "edit":
                continue
            try:
                current = (self.project_root / spec["path"]).read_text(encoding="utf-8", errors="replace")
            except OSError:
                continue
            context_parts.append(f"--- {spec['path']} (current) ---\n{current[:3000]}")
        failures = json.dumps(failing, ensure_ascii=False)[:3000]
        try:
            response = self.router.generate(
                AIRequest(
                    system=(
                        "You are AFAQ Developer Agent diagnosing test failures. Respond with a "
                        'single raw JSON object only: {"diagnosis":"...","file":"relative/path",'
                        '"replacements":[{"old":"exact current text","new":"fixed text"}]}'
                    ),
                    prompt=(
                        f"Original task:\n{self.store.get(task_id)['instruction']}\n\n"
                        f"Files changed:\n{json.dumps([f['path'] for f in proposal['files']])}\n\n"
                        f"Current file contents:\n{''.join(context_parts)}\n\n"
                        f"Failing tests:\n{failures}\n\n"
                        "Diagnose the root cause and provide exact-string replacements to fix it."
                    ),
                    max_tokens=1500,
                    timeout=240,  # diagnosis generations are shorter than proposals
                )
            )
            raw = json.loads(RuntimeRouter._extract_json(response.text, key='"diagnosis"'))
            self.boundary.inside(self.boundary.root / raw["file"])  # containment
            # Grounding guard: a diagnosis that references a file the project
            # does not contain is model fabrication — relaying it would send
            # the fix loop patching (or the human reviewing) a phantom.
            if not (self.project_root / raw["file"]).is_file():
                return {
                    "diagnosis": f"diagnosis rejected: referenced file not found in project: {raw['file']}",
                    "file": None, "replacements": [],
                }
            for rep in raw.get("replacements", []):
                if not isinstance(rep.get("old"), str) or not isinstance(rep.get("new"), str):
                    raise ValueError("invalid replacement entry")
            return {"diagnosis": str(raw.get("diagnosis", ""))[:500], "file": raw["file"], "replacements": raw.get("replacements", [])}
        except Exception as exc:  # noqa: BLE001
            return {"diagnosis": f"diagnosis unavailable: {type(exc).__name__}: {exc}", "file": None, "replacements": []}

    # -- checkpoint / rollback / diff ----------------------------------------
    def _checkpoint(self, task_id: str, proposal: Mapping[str, Any]) -> Path:
        checkpoint_dir = self.checkpoints_dir / task_id
        checkpoint_dir.mkdir(parents=True, exist_ok=True)
        for spec in proposal["files"]:
            source = self.boundary.inside(self.boundary.root / spec["path"])
            if source.is_file():
                target = checkpoint_dir / spec["path"]
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, target)
        return checkpoint_dir

    def _rollback(self, task_id: str, proposal: Mapping[str, Any]) -> None:
        checkpoint_dir = self.checkpoints_dir / task_id
        # Restore every file captured in the checkpoint — the fix loop may
        # have touched files beyond the original proposal, and all of them
        # must be rolled back, not only the proposed ones.
        if checkpoint_dir.is_dir():
            for saved in checkpoint_dir.rglob("*"):
                if not saved.is_file():
                    continue
                rel = saved.relative_to(checkpoint_dir)
                target = self.boundary.inside(self.boundary.root / rel)
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(saved, target)
        for spec in proposal["files"]:
            target = self.boundary.inside(self.boundary.root / spec["path"])
            saved = checkpoint_dir / spec["path"]
            if not saved.is_file() and target.exists() and spec["action"] in ("create", "rename"):
                target.unlink()
            if spec["action"] == "rename":
                destination = self.boundary.inside(self.boundary.root / spec["new_path"])
                if destination.exists():
                    destination.unlink()

    def _diff(self, task_id: str, proposal: Mapping[str, Any], modified: list[str]) -> dict[str, str]:
        checkpoint_dir = self.checkpoints_dir / task_id
        diffs: dict[str, str] = {}
        for rel_path in modified:
            current_path = self.boundary.inside(self.boundary.root / rel_path)
            saved = checkpoint_dir / rel_path
            before = saved.read_text(encoding="utf-8", errors="replace") if saved.is_file() else ""
            after = (
                current_path.read_text(encoding="utf-8", errors="replace")
                if current_path.is_file()
                else ""
            )
            if before == after:
                continue
            diffs[rel_path] = "".join(difflib.unified_diff(
                before.splitlines(keepends=True),
                after.splitlines(keepends=True),
                fromfile=f"a/{rel_path}",
                tofile=f"b/{rel_path}",
            ))
        return diffs

    # -- memory / learning ----------------------------------------------------
    def _scope(self) -> MemoryScope:
        return MemoryScope(
            tenant_id="afaq",
            project_id="afaq-creative",
            agent_id=DEVELOPER_AGENT_ID,
            environment=self.config.environment,
        )

    def _learn(self, task_id: str, instruction: str, scope: MemoryScope, summary: str, evaluation: Mapping[str, Any]) -> list[str]:
        memory_ids: list[str] = []
        experience = self.memory.create(
            memory_type=MemoryType.EXPERIENCE,
            content={
                "instruction": instruction,
                "summary": summary,
                "evaluation_score": evaluation["score"],
                "tags": ["developer-agent"],
            },
            evidence=(
                MemoryEvidence(
                    evidence_id=f"EV-{task_id}-experience",
                    source_ref=f"dev-task:{task_id}",
                    confidence=max(0.0, min(1.0, float(evaluation["score"]))),
                ),
            ),
            scope=scope,
            metadata={**_scope_metadata(scope), "task_id": task_id},
            actor="developer-agent",
        )
        memory_ids.append(experience.memory_id)

        reflection_text = (
            f"development task {'succeeded' if evaluation['success'] else 'completed with warnings'} "
            f"(score {evaluation['score']}): {evaluation['reason']}."
        )
        candidate = new_memory_record(
            memory_type=MemoryType.LESSON,
            content={
                "reflection": reflection_text,
                "derived_from": experience.memory_id,
                "tags": ["developer-agent"],
                "task_id": task_id,
                "summary_excerpt": summary[:300],
            },
            evidence=(
                MemoryEvidence(
                    evidence_id=f"EV-{task_id}-lesson",
                    source_ref=f"dev-task:{task_id}",
                    confidence=max(0.0, min(1.0, float(evaluation["score"]))),
                ),
            ),
            scope=scope,
            metadata={**_scope_metadata(scope), "task_id": task_id},
        )
        verdict = self.memory.validate_lesson_candidate(candidate)
        if verdict.accepted:
            lesson = self.memory.create(
                memory_type=MemoryType.LESSON,
                content=candidate.content,
                evidence=candidate.evidence,
                scope=candidate.scope,
                metadata=candidate.metadata,
                actor="developer-agent",
            )
            memory_ids.append(lesson.memory_id)
            self.events.append(task_id, "lesson_created", {
                "lesson_id": lesson.memory_id, "derived_from": experience.memory_id,
            })
        else:
            self.events.append(task_id, "lesson_rejected", {
                "derived_from": experience.memory_id,
                "reasons": list(verdict.reasons),
            })
        self.events.append(task_id, "reflection_completed", {
            "experience_id": experience.memory_id,
            "lesson_id": memory_ids[1] if len(memory_ids) > 1 else None,
            "evaluation_score": evaluation["score"],
        })
        return memory_ids

    def _fail(self, task_id: str, error: str, *, failure_class: str, stage: str) -> None:
        task = self.store.get(task_id)
        if task is None or task["state"] in DEV_TERMINAL_STATES:
            return
        self._task_overrides.pop(task_id, None)  # per-task override dies with the task
        scope = self._scope()
        memory_ids: list[str] = []
        try:
            record = self.memory.create(
                memory_type=MemoryType.FAILURE,
                content={
                    "instruction": task.get("instruction", ""),
                    "stage": stage,
                    "error": error,
                    "failure_class": failure_class,  # development_test_failure | runtime_failure
                    "tags": ["developer-agent"],
                },
                evidence=(
                    MemoryEvidence(
                        evidence_id=f"EV-{task_id}-failure",
                        source_ref=f"dev-task:{task_id}",
                        confidence=0.2,
                    ),
                ),
                scope=scope,
                metadata={**_scope_metadata(scope), "task_id": task_id},
                actor="developer-agent",
            )
            memory_ids.append(record.memory_id)
        except Exception as exc:  # noqa: BLE001 - memory write must not mask the failure
            self.events.append(task_id, "task_failed", {
                "error": error, "stage": stage,
                "memory_write_error": f"{type(exc).__name__}: {exc}",
            })
        self.store.update(
            task_id,
            (),
            state="failed",
            error=error,
            memory_ids=memory_ids or None,
            finished_at=_utcnow(),
        )
        self.events.append(task_id, "task_failed", {"error": error, "stage": stage, "failure_class": failure_class})
        self.audit.record(
            "task_failed",
            task_id=task_id, actor=task.get("actor") or "system",
            agent_id=DEVELOPER_AGENT_ID,
            environment=task.get("environment") or normalize_environment(self.config.environment),
            detail={"error": error, "stage": stage, "failure_class": failure_class},
        )

    # ------------------------------------------------------------------
    def _approvals_for_task(self, task_id: str) -> list[dict]:
        return self.approvals.for_task(task_id)

    def _require_task(self, task_id: str) -> dict:
        task = self.store.get(task_id)
        if task is None:
            raise KeyError(f"dev task not found: {task_id}")
        return task

    def _lock(self, task_id: str) -> threading.Lock:
        with self._locks_guard:
            if task_id not in self._locks:
                self._locks[task_id] = threading.Lock()
            return self._locks[task_id]
