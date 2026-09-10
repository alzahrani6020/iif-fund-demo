"""Agent runtime orchestrator v1.

Wires the existing AIC nucleus into the pipeline:

    Task -> Plan -> Local AI -> Tool (policy-gated) -> Execute
         -> Evaluate -> Reflect -> Memory -> Result

Nothing here rebuilds the nucleus: ``AfaqLearningAgent``, ``Planner``,
``AIRouter``, ``ToolRegistry``, ``PolicyEngine``, ``RuleEvaluator`` and the
memory service/store are the core classes, composed as-is.
"""

from __future__ import annotations

import json
import os
import re
import threading
from dataclasses import replace
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Mapping

from afaq_intelligence_core.aic_agent import (
    AfaqLearningAgent,
    AgentContext,
    AgentTask,
    Evaluation,
)
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
from afaq_intelligence_core.ai.router import AIRouter
from afaq_intelligence_core.evaluation.evaluator import RuleEvaluator
from afaq_intelligence_core.governance.policy import PolicyEngine
from afaq_intelligence_core.planning.planner import Planner
from afaq_intelligence_core.tools.registry import ToolRegistry

from .event_log import EventLog
from .model_router import ModelRouter, ModelUnavailableError
from .safe_tools import register_safe_tools
from .task_store import TaskStore

RUNTIME_VERSION = "1.0.0"
DEFAULT_TENANT = "afaq"
DEFAULT_PROJECT = "afaq-creative"
DEFAULT_AGENT = "afaq-learning-agent"

PACKAGE_DIR = Path(__file__).resolve().parent
AIC_HOME = Path(os.getenv("AIC_HOME", str(PACKAGE_DIR.parent))).resolve()
DEFAULT_VAR_DIR = AIC_HOME / "var"

CODE_FENCE_REPLACEMENTS = ("```json", "```", "\n```")


class ApprovalRequired(RuntimeError):
    def __init__(self, step: dict, decision) -> None:
        super().__init__(f"step requires human approval: {step.get('tool')}")
        self.step = step
        self.decision = decision


class PolicyDenied(RuntimeError):
    def __init__(self, step: dict, decision) -> None:
        super().__init__(f"step denied by policy: {step.get('tool')} ({decision.reason})")
        self.step = step
        self.decision = decision


class StepFailed(RuntimeError):
    def __init__(self, step: dict, cause: Exception) -> None:
        super().__init__(f"step failed: {step.get('tool')}: {cause}")
        self.step = step
        self.cause = cause


class RuntimeRouter(AIRouter):
    """AIRouter wrapper that pins generation to the selected local provider
    and sanitizes model output (strip markdown fences) so the Planner's JSON
    parsing survives real local-model responses. No core changes needed."""

    def __init__(self):
        super().__init__()
        # The selected provider is per-task state. Concurrent tasks each run
        # on their own thread, so a plain shared attribute could make one
        # task's planning run on another task's provider.
        self._preferred_local = threading.local()
        self._model_local = threading.local()
        # Hardware-adaptive layer (set by the owner after construction). Used
        # to retry a failed heavy model on the fastest eligible fallback —
        # once, and only for model-level failures.
        self.model_router = None

    @property
    def preferred(self) -> str | None:
        return getattr(self._preferred_local, "value", None)

    @preferred.setter
    def preferred(self, value: str | None) -> None:
        self._preferred_local.value = value

    @property
    def model_override(self) -> str | None:
        return getattr(self._model_local, "value", None)

    @model_override.setter
    def model_override(self, value: str | None) -> None:
        self._model_local.value = value

    # -- heavy-model failure -> fast local fallback ------------------------

    _MODEL_FAILURE_MARKERS = (
        "timed out", "unreachable", "HTTP 404", "HTTP 500",
        "empty response", "model not pulled",
    )

    def _fallback_for(self, request: "AIRequest", exc: Exception) -> str | None:
        """Best fallback model for a failed per-request model, or None.

        Only fires when the caller pinned an explicit model (adaptive
        routing); the legacy slot path is left untouched. Only for
        model-level failures (timeout / unreachable / missing model) — a
        provider bug or parse error must surface as-is.
        """
        if self.model_router is None or not request.model:
            return None
        msg = f"{type(exc).__name__}: {exc}"
        if not any(marker in msg for marker in self._MODEL_FAILURE_MARKERS):
            return None
        purpose = self.model_router.classify(getattr(request, "prompt", "") or "")
        return self.model_router.fallback_model(purpose, request.model)

    def generate(self, request: AIRequest, complexity: int = 5, preferred: str | None = None):
        target = preferred or self.preferred
        # Per-task model pin: the adaptive router's choice rides on the
        # request when the caller did not set one explicitly.
        model = request.model or self.model_override
        if model and request.model is None:
            request = replace(request, model=model)
        # Local planning must be as deterministic as the hardware allows:
        # temperature 0 keeps repeated attempts comparable.
        if request.temperature != 0.0:
            request = replace(request, temperature=0.0)
        started = __import__("time").monotonic()
        call_error: Exception | None = None
        fallback_from: str | None = None
        try:
            try:
                response = super().generate(request, complexity=complexity, preferred=target)
            except Exception as first_exc:  # noqa: BLE001 - recorded, maybe fallback
                fallback = self._fallback_for(request, first_exc)
                if fallback is None:
                    raise
                fallback_from = request.model
                try:
                    response = super().generate(
                        replace(request, model=fallback),
                        complexity=complexity, preferred=target,
                    )
                except Exception:  # noqa: BLE001 - the real failure is the 2nd
                    raise
        except Exception as exc:  # noqa: BLE001 - recorded, then re-raised
            call_error = exc
            raise
        finally:
            from . import monitoring
            latency_ms = (__import__("time").monotonic() - started) * 1000
            monitoring.record_model_call(
                getattr(request, "model", None) or target or "unknown",
                latency_ms, call_error,
            )
        if fallback_from:
            metadata = dict(response.metadata)
            metadata["fallback_from"] = fallback_from
            response = type(response)(
                text=response.text, model=response.model,
                provider=response.provider, metadata=metadata,
            )
        text = response.text.strip()
        # Thinking models may leak reasoning even with think disabled: drop
        # <think>…</think> blocks before looking for the JSON payload.
        text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL | re.IGNORECASE).strip()
        for fence in CODE_FENCE_REPLACEMENTS:
            text = text.replace(fence, "")
        text = text.strip()
        text = self._extract_json(text)
        return type(response)(
            text=text,
            model=response.model,
            provider=response.provider,
            metadata=response.metadata,
        )

    @staticmethod
    def _extract_json(text: str, key: str = '"steps"') -> str:
        """Local models often echo the schema example or reason around the
        answer. Return the text unchanged when it already parses; otherwise
        narrow to the last balanced object containing ``key`` that parses."""
        try:
            json.loads(text)
            return text
        except ValueError:
            pass
        pattern = r"\{\s*" + re.escape(key) + r"\s*:"
        candidates = [m.start() for m in re.finditer(pattern, text)]
        for start in reversed(candidates):
            end = text.rfind("}")
            if end > start:
                snippet = text[start : end + 1]
                try:
                    json.loads(snippet)
                    return snippet
                except ValueError:
                    continue
        if not text.startswith("{"):
            start = text.find("{")
            end = text.rfind("}")
            if start != -1 and end != -1 and end > start:
                return text[start : end + 1]
        return text


# Compact signatures the Planner prompt does not include (core Planner only
# receives tool names). Keeping this in the runtime avoids core changes.
_TOOL_SIGNATURES = {
    "read_project_file": "path",
    "system_status": "",
    "aic_memory_summary": "",
}


class RuntimePlanner(Planner):
    """Planner hardened for real local models, runtime-side only:

    * the goal is annotated with the allowed tool signatures (the core
      Planner prompt only lists tool names, so models guess argument names);
    * on invalid JSON there is one retry with an explicit machine-readable
      reminder;
    * the core Planner class is used as-is for every attempt.
    """

    _REMINDER = (
        "\n\nIMPORTANT: respond with a single raw JSON object only, no prose, "
        'no markdown: {"steps":[{"tool": <one of the allowed tools>, '
        '"objective": "...", "args": {}}]}'
    )

    def __init__(self, router, registry: ToolRegistry | None = None) -> None:
        super().__init__(router)
        self._registry = registry

    def _signature_hint(self, tools: list[str]) -> str:
        known = [
            f"{name}({_TOOL_SIGNATURES[name]})" if name in _TOOL_SIGNATURES else name
            for name in tools
        ]
        return "\nTool signatures: " + ", ".join(known)

    def plan(self, goal: str, tools: list, context: dict | None = None):
        annotated = goal + self._signature_hint(list(tools))
        last_exc: ValueError | None = None
        for attempt in range(3):
            try:
                return super().plan(annotated, tools, context)
            except ValueError as exc:
                last_exc = exc
                if attempt == 0:
                    annotated = annotated + self._REMINDER
        raise last_exc


def _utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


def get_runtime_memory_summary() -> dict:
    """Internal AIC function exposed to the safe tool (lazy, read-only)."""
    path = DEFAULT_VAR_DIR / "aic_memory.db"
    try:
        store = SqliteMemoryStore(path)
    except Exception as exc:  # noqa: BLE001 - tool must report, not crash
        return {"available": False, "error": f"{type(exc).__name__}: {exc}"}
    try:
        records = store.list_all()
        by_type: dict[str, int] = {}
        for r in records:
            by_type[r.memory_type.value] = by_type.get(r.memory_type.value, 0) + 1
        return {"available": True, "total": len(records), "by_type": by_type}
    finally:
        store.close()


class AgentRuntime:
    """Persistent-capable runtime; every task is persisted and resumable."""

    def __init__(
        self,
        *,
        var_dir: str | Path | None = None,
        config: AICConfig | None = None,
        available_models: set[str] | None = None,
    ) -> None:
        self.var_dir = Path(var_dir) if var_dir else DEFAULT_VAR_DIR
        self.var_dir.mkdir(parents=True, exist_ok=True)
        self.config = config or AICConfig.load()

        # Persistence
        self.tasks = TaskStore(self.var_dir / "aic_runtime.db")
        self.events = EventLog(self.var_dir / "aic_runtime.db")
        self.memory_store = SqliteMemoryStore(self.var_dir / "aic_memory.db")
        self.memory = MemoryService(store=self.memory_store)

        # AI layer (local Ollama only)
        self.model_router = ModelRouter(
            self.config, available_models=available_models, var_dir=self.var_dir
        )
        self.router = RuntimeRouter()
        self.router.model_router = self.model_router
        for purpose in ("general", "coding"):
            self.router.register(
                purpose,
                OllamaProvider(
                    model=self.model_router.desired_model(purpose),
                    base_url=self.config.ollama_url,
                ),
            )
        # Tools + governance
        self.tools = ToolRegistry()
        register_safe_tools(self.tools, allowed_roots=[AIC_HOME, AIC_HOME / "afaq_intelligence_core"])
        self.policy = PolicyEngine()
        self.tool_evaluator = RuleEvaluator()
        self.planner = RuntimePlanner(self.router, registry=self.tools)

        # Learning agent (existing core class) — executor/evaluator injected
        self.agent = AfaqLearningAgent(
            memory=self.memory,
            executor=lambda task, recalled: self._last_executor(task, recalled),
            evaluator=self._evaluate_outcome,
            reflector=None,
        )
        self._last_executor = None  # set per run

        self._task_threads: dict[str, threading.Thread] = {}
        self._task_locks: dict[str, threading.Lock] = {}
        self._locks_guard = threading.Lock()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def submit(
        self,
        instruction: str,
        *,
        tenant_id: str = DEFAULT_TENANT,
        project_id: str = DEFAULT_PROJECT,
        wait: bool = False,
    ) -> str:
        task_id = self.tasks.create(
            instruction=instruction,
            tenant_id=tenant_id,
            project_id=project_id,
            agent_id=DEFAULT_AGENT,
            environment=self.config.environment,
        )
        self.events.append(task_id, "task_received", {"instruction": instruction})
        if wait:
            self._run(task_id)
        else:
            try:
                thread = threading.Thread(
                    target=self._run_safe, args=(task_id,), daemon=True, name=f"aic-task-{task_id}"
                )
                self._task_threads[task_id] = thread
                thread.start()
            except Exception as exc:  # noqa: BLE001 - never orphan a task record
                try:
                    self.tasks.update(
                        task_id, ("received",), state="failed",
                        error=f"dispatch failed: {type(exc).__name__}: {exc}",
                        finished_at=_utcnow(),
                    )
                except Exception:  # noqa: BLE001 - best effort
                    pass
                raise
        return task_id

    def get_task(self, task_id: str) -> dict | None:
        return self.tasks.get(task_id)

    def list_tasks(self, limit: int = 100) -> list[dict]:
        return self.tasks.list(limit)

    def task_events(self, task_id: str) -> list[dict]:
        return self.events.list(task_id)

    def recover(self) -> list[str]:
        """Mark tasks interrupted by a previous process; returns their ids."""
        recovered = []
        for task in self.tasks.interrupted_tasks():
            self.tasks.update(task["task_id"], ("received", "planning", "running"), state="interrupted")
            self.events.append(task["task_id"], "task_interrupted", {"previous_state": task["state"]})
            recovered.append(task["task_id"])
        return recovered

    def resume(self, task_id: str) -> dict:
        task = self.tasks.get(task_id)
        if task is None:
            raise KeyError(f"task not found: {task_id}")
        if task["state"] not in ("interrupted", "awaiting_approval"):
            raise RuntimeError(f"task {task_id} in state {task['state']} cannot be resumed")
        self.tasks.update(task_id, ("interrupted", "awaiting_approval"), state="received", error=None)
        self.events.append(task_id, "task_resumed", {"from_state": task["state"]})
        self._run(task_id)
        return self.tasks.get(task_id)

    def close(self) -> None:
        for component in (self.tasks, self.events, self.memory_store):
            try:
                component.close()
            except Exception:  # noqa: BLE001 - best-effort shutdown
                pass

    # ------------------------------------------------------------------
    # Execution
    # ------------------------------------------------------------------
    def _run_safe(self, task_id: str) -> None:
        """Thread entry: never let a stray exception leave a task stuck."""
        try:
            self._run(task_id)
        except Exception as exc:  # noqa: BLE001
            try:
                task = self.tasks.get(task_id)
                if task and task["state"] not in ("completed", "failed", "awaiting_approval", "interrupted"):
                    self.tasks.update(
                        task_id,
                        ("received", "planning", "running"),
                        state="failed",
                        error=f"unhandled: {type(exc).__name__}: {exc}",
                        finished_at=_utcnow(),
                    )
                    self.events.append(task_id, "task_failed", {
                        "error": str(exc), "stage": "unhandled",
                    })
            except Exception:  # noqa: BLE001
                pass

    def _run(self, task_id: str) -> None:
        lock = self._task_lock(task_id)
        with lock:
            task = self.tasks.get(task_id)
            if task is None:
                return
            self.tasks.update(task_id, ("received",), state="running", started_at=_utcnow())
            self.events.append(task_id, "task_started", {})

            scope = MemoryScope(
                tenant_id=task["tenant_id"],
                project_id=task["project_id"],
                agent_id=task["agent_id"],
                environment=task["environment"],
            )
            context = AgentContext(
                tenant_id=scope.tenant_id,
                project_id=scope.project_id,
                agent_id=scope.agent_id,
                environment=scope.environment,
            )
            agent_task = AgentTask(instruction=task["instruction"], context=context)

            executor = lambda t, recalled: self._execute_plan(task_id, t, scope)  # noqa: E731
            self._last_executor = executor
            try:
                run = self.agent.run(agent_task)
                self._after_run(task_id, run, scope)
            except (ApprovalRequired, PolicyDenied) as gate:
                self._gate_outcome(task_id, gate, scope)
            except Exception as exc:  # noqa: BLE001 - task failure must persist
                self._structural_failure(task_id, task["instruction"], scope, exc)

    # -- plan + tool execution (injected as the agent's executor) ---------
    def _execute_plan(self, task_id: str, task: AgentTask, scope: MemoryScope) -> Mapping[str, Any]:
        task_row = self.tasks.get(task_id)
        instruction = task.instruction

        # Model selection (fails clearly when the local model is missing)
        selection = self.model_router.select(instruction)
        self.router.preferred = selection["provider"]
        self.router.model_override = selection["model"]
        self.tasks.update(
            task_id, ("running",),
            selected_model=f'{selection["provider"]}:{selection["model"]}',
        )
        self.events.append(task_id, "model_selected", selection)

        # Plan: reuse checkpointed plan on resume, otherwise ask the Planner
        plan = task_row.get("plan")
        progress = task_row.get("progress") or {}
        if plan:
            steps = plan["steps"]
        else:
            self.tasks.update(task_id, ("running",), state="planning")
            steps_objs = self.planner.plan(instruction, [t.name for t in self.tools.list()])
            steps = [
                {"tool": s.tool, "objective": s.objective, "args": s.args}
                for s in steps_objs
            ]
            self.tasks.update(task_id, ("planning",), state="running", plan={"steps": steps})
            self.events.append(task_id, "plan_created", {"steps": steps})

        step_records = progress.get("step_records", [])
        start_index = int(progress.get("next_step", 0))
        tool_outputs: list[dict] = progress.get("tool_outputs", [])

        for index in range(start_index, len(steps)):
            step = steps[index]
            tool = self.tools.get(step["tool"])
            decision = self.policy.decide(tool.risk, scope.environment)
            if decision.action == "deny":
                self._save_progress(task_id, steps, index, step_records, tool_outputs)
                self.events.append(task_id, "policy_denied", {"step": step, "reason": decision.reason})
                raise PolicyDenied(step, decision)
            if decision.action == "approve":
                self._save_progress(task_id, steps, index, step_records, tool_outputs)
                self.events.append(
                    task_id, "approval_required",
                    {"step": step, "reason": decision.reason, "next_step": index},
                )
                raise ApprovalRequired(step, decision)

            args = dict(step.get("args") or {})
            # Local models sometimes guess argument names; normalize the one
            # alias that matters for the read tool instead of failing the step.
            if step["tool"] == "read_project_file" and "path" not in args:
                for alias in ("file", "file_path", "filename"):
                    if alias in args:
                        args["path"] = args.pop(alias)
                        break

            try:
                result = self.tools.execute(step["tool"], **args)
                ev = self.tool_evaluator.evaluate(result)
                record = {
                    "tool": step["tool"],
                    "objective": step["objective"],
                    "status": "ok" if ev.success else "failed",
                    "score": ev.score,
                }
            except Exception as exc:  # noqa: BLE001
                record = {
                    "tool": step["tool"],
                    "objective": step["objective"],
                    "status": "failed",
                    "error": f"{type(exc).__name__}: {exc}",
                }
                step_records.append(record)
                self._save_progress(task_id, steps, index + 1, step_records, tool_outputs)
                self.events.append(task_id, "tool_called", {"step": step, **record})
                raise StepFailed(step, exc) from exc

            step_records.append(record)
            if isinstance(result, dict):
                # Keep payloads bounded in the task record and memory
                result_summary = {k: (v if not isinstance(v, str) or len(v) < 2000 else v[:2000] + "…[truncated]") for k, v in result.items()}
            else:
                result_summary = str(result)[:2000]
            tool_outputs.append({"step": step["tool"], "result": result_summary})
            self._save_progress(task_id, steps, index + 1, step_records, tool_outputs)
            self.events.append(task_id, "tool_called", {"step": step, **record})

        # Final result: local model summarizes the gathered outputs
        summary = self._summarize(instruction, tool_outputs)

        failed_steps = [r for r in step_records if r["status"] != "ok"]
        return {
            "plan": steps,
            "steps": step_records,
            "tool_outputs": tool_outputs,
            "summary": summary,
            "_all_steps_ok": not failed_steps,
        }

    def _summarize(self, instruction: str, tool_outputs: list[dict]) -> str:
        context_text = json.dumps(tool_outputs, ensure_ascii=False)[:6000]
        response = self.router.generate(
            AIRequest(
                system="You are AFAQ Runtime. Answer in Arabic, concisely, based only on the provided tool outputs.",
                prompt=f"Task: {instruction}\n\nTool outputs:\n{context_text}\n\nProvide the final result.",
                max_tokens=800,
            )
        )
        return response.text.strip()

    # -- evaluation / reflection / memory ---------------------------------
    def _evaluate_outcome(self, task: AgentTask, output: Mapping[str, Any]) -> Evaluation:
        steps = output.get("steps", [])
        ok = sum(1 for s in steps if s.get("status") == "ok")
        total = len(steps)
        all_ok = bool(output.get("_all_steps_ok")) and total > 0 and bool(output.get("summary"))
        score = 0.5 + 0.5 * (ok / total) if total else 0.0
        if not output.get("summary"):
            score = min(score, 0.4)
            all_ok = False
        reason = (
            f"steps ok {ok}/{total}; summary {'present' if output.get('summary') else 'missing'}"
        )
        return Evaluation(success=all_ok, score=round(score, 2), reason=reason)

    def _after_run(self, task_id: str, run, scope: MemoryScope) -> None:
        self.events.append(task_id, "evaluation_completed", {
            "success": run.evaluation.success,
            "score": run.evaluation.score,
            "reason": run.evaluation.reason,
        })

        memory_ids = list(run.created_memory_ids)
        lesson_id = None
        experience_id = memory_ids[0] if memory_ids else None

        if experience_id:
            try:
                record = self.memory.get(experience_id)
                summary = str(run.output.get("summary", "") or "")
                reflection_text = (
                    f"task {'succeeded' if run.evaluation.success else 'failed'} "
                    f"(score {run.evaluation.score}): {run.evaluation.reason}."
                )
                candidate = new_memory_record(
                    memory_type=MemoryType.LESSON,
                    content={
                        "reflection": reflection_text,
                        "derived_from": experience_id,
                        "tags": ["agent-runtime"],
                        "task_id": task_id,
                        "summary_excerpt": summary[:300],
                    },
                    evidence=(
                        MemoryEvidence(
                            evidence_id=f"EV-{task_id}-lesson",
                            source_ref=f"agent-run:{task_id}",
                            confidence=max(0.0, min(1.0, run.evaluation.score)),
                        ),
                    ),
                    scope=record.scope,
                    metadata={**dict(record.metadata), "task_id": task_id},
                )
                verdict = self.memory.validate_lesson_candidate(candidate)
                if verdict.accepted:
                    lesson = self.memory.create(
                        memory_type=MemoryType.LESSON,
                        content=candidate.content,
                        evidence=candidate.evidence,
                        scope=candidate.scope,
                        metadata=candidate.metadata,
                        actor="agent-runtime",
                    )
                    lesson_id = lesson.memory_id
                    memory_ids.append(lesson_id)
                    self.events.append(task_id, "lesson_created", {
                        "lesson_id": lesson_id, "derived_from": experience_id,
                    })
                else:
                    self.events.append(task_id, "lesson_rejected", {
                        "derived_from": experience_id,
                        "reasons": list(verdict.reasons),
                    })
            except Exception as exc:  # noqa: BLE001 - reflection must not kill the task
                self.events.append(task_id, "lesson_rejected", {
                    "derived_from": experience_id,
                    "reasons": [f"{type(exc).__name__}: {exc}"],
                })

        self.events.append(task_id, "reflection_completed", {
            "experience_id": experience_id,
            "lesson_id": lesson_id,
            "evaluation_score": run.evaluation.score,
        })

        stored = self.tasks.get(task_id)
        result = {
            "output": dict(run.output),
            "summary": run.output.get("summary", ""),
            "evaluation": {
                "success": run.evaluation.success,
                "score": run.evaluation.score,
                "reason": run.evaluation.reason,
            },
            "recalled_memory_ids": list(run.recalled_memory_ids),
        }
        self.tasks.update(
            task_id, ("running",),
            state="completed" if run.evaluation.success else "failed",
            result=result,
            memory_ids=json.dumps(memory_ids, ensure_ascii=False),
            finished_at=_utcnow(),
        )
        self.events.append(task_id, "task_completed" if run.evaluation.success else "task_failed", {
            "evaluation": result["evaluation"],
            "memory_ids": memory_ids,
        })

    def _gate_outcome(self, task_id: str, gate, scope: MemoryScope) -> None:
        if isinstance(gate, ApprovalRequired):
            self.tasks.update(task_id, ("running",), state="awaiting_approval", finished_at=None)
            return  # resumable via resume()
        # PolicyDenied -> hard failure, still recorded as FAILURE memory
        self._write_failure_memory(task_id, scope, str(gate), stage="policy_gate")
        self.tasks.update(
            task_id, ("running",),
            state="failed",
            error=str(gate),
            finished_at=_utcnow(),
        )
        self.events.append(task_id, "task_failed", {"error": str(gate), "stage": "policy_gate"})

    def _structural_failure(self, task_id: str, instruction: str, scope: MemoryScope, exc: Exception) -> None:
        error = f"{type(exc).__name__}: {exc}"
        stage = (
            "model_selection" if isinstance(exc, ModelUnavailableError)
            else "planning" if isinstance(exc, (ValueError,)) and "Planner" in str(exc)
            else "execution"
        )
        self._write_failure_memory(task_id, scope, error, stage=stage)
        self.tasks.update(
            task_id,
            ("running", "planning"),
            state="failed",
            error=error,
            finished_at=_utcnow(),
        )
        self.events.append(task_id, "task_failed", {"error": error, "stage": stage})

    def _write_failure_memory(self, task_id: str, scope: MemoryScope, error: str, *, stage: str) -> None:
        task = self.tasks.get(task_id) or {}
        try:
            record = self.memory.create(
                memory_type=MemoryType.FAILURE,
                content={
                    "instruction": task.get("instruction", ""),
                    "stage": stage,
                    "error": error,
                    "tags": ["agent-runtime"],
                },
                evidence=(
                    MemoryEvidence(
                        evidence_id=f"EV-{task_id}-failure",
                        source_ref=f"agent-run:{task_id}",
                        confidence=0.2,
                    ),
                ),
                scope=scope,
                metadata={
                    "tenant_id": scope.tenant_id,
                    "project_id": scope.project_id,
                    "agent_id": scope.agent_id,
                    "environment": scope.environment,
                    "task_id": task_id,
                },
                actor="agent-runtime",
            )
            self.events.append(task_id, "evaluation_completed", {
                "success": False, "score": 0.2, "reason": f"structural failure at {stage}",
            })
            stored = self.tasks.get(task_id)
            existing = json.loads(stored["memory_ids"]) if stored and stored.get("memory_ids") else []
            self.tasks.update(
                task_id,
                ("running", "awaiting_approval", "interrupted", "received"),
                memory_ids=json.dumps(existing + [record.memory_id], ensure_ascii=False),
            )
        except Exception as exc:  # noqa: BLE001 - memory write must not mask the failure
            self.events.append(task_id, "task_failed", {
                "error": error, "stage": stage,
                "memory_write_error": f"{type(exc).__name__}: {exc}",
            })

    # ------------------------------------------------------------------
    def _save_progress(self, task_id: str, steps: list, next_step: int,
                       step_records: list, tool_outputs: list) -> None:
        self.tasks.update(task_id, ("running", "planning"), progress=json.dumps({
            "next_step": next_step,
            "step_records": step_records,
            "tool_outputs": tool_outputs,
        }, ensure_ascii=False))

    def _task_lock(self, task_id: str) -> threading.Lock:
        with self._locks_guard:
            if task_id not in self._task_locks:
                self._task_locks[task_id] = threading.Lock()
            return self._task_locks[task_id]
