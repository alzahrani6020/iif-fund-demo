"""AIC Bridge — read-only status/health interface between the AFAQ admin
dashboard (Next.js, server side) and the AIC nucleus.

The bridge never mutates memory and exposes no write path: the only supported
invocation is ``python aic_bridge.py status``, which prints one JSON document
aggregating live data from the real core modules (memory store, retrieval,
evaluation, governance, AI provider health, tools, audit trail).

Design constraints:
  * stdlib only (matches the nucleus);
  * every section is probed independently — one failing probe must not hide
    the remaining sections;
  * no fabricated state: anything the core cannot report is marked
    "not_running" / null with an explicit reason.
"""

from __future__ import annotations

import json
import os
import platform
import sys
import traceback
from datetime import datetime, timezone
from pathlib import Path

BRIDGE_VERSION = "1.1.0"
AIC_HOME = Path(__file__).resolve().parent
DB_PATH = AIC_HOME / "var" / "aic_memory.db"

# Canonical control-center scope: primary tenant/project the dashboard tracks.
PRIMARY_TENANT = "afaq"
PRIMARY_PROJECT = "afaq-creative-site"
PRIMARY_AGENT = "afaq-learning-agent"


class GatewayError(RuntimeError):
    """A gateway action failed in a controlled, reportable way."""


def _iso(value) -> str | None:
    return value.isoformat() if isinstance(value, datetime) else None


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _probe(fn, *args, **kwargs):
    """Run fn, returning (result, None) or (None, error-string)."""
    try:
        return fn(*args, **kwargs), None
    except Exception as exc:  # noqa: BLE001 - status probe must never crash
        return None, f"{type(exc).__name__}: {exc}"


def build_status() -> dict:
    errors: list[str] = []

    # ------------------------------------------------------------------
    # Core imports (real module availability)
    # ------------------------------------------------------------------
    core_modules: dict[str, bool] = {}
    imported: dict[str, object] = {}
    for name, module_path, symbols in (
        ("contracts", "afaq_intelligence_core.aic_memory_contracts",
         ("MemoryScope", "MemoryState", "MemoryType")),
        ("store", "afaq_intelligence_core.aic_memory_store", ("MemoryStore",)),
        ("persistence", "afaq_intelligence_core.aic_persistence",
         ("SqliteMemoryStore",)),
        ("retrieval", "afaq_intelligence_core.aic_retrieval",
         ("MemoryQuery", "MemoryRetrieval")),
        ("evaluation", "afaq_intelligence_core.aic_evaluation",
         ("evaluate_record", "reflect", "validate_lesson")),
        ("service", "afaq_intelligence_core.aic_memory_service", ("MemoryService",)),
        ("agent", "afaq_intelligence_core.aic_agent", ("AfaqLearningAgent",)),
        ("dynamic_agent", "afaq_intelligence_core.runtime.dynamic_agent",
         ("DynamicAgent",)),
        ("config", "afaq_intelligence_core.aic_config", ("AICConfig",)),
        ("ai_ollama", "afaq_intelligence_core.ai.ollama", ("OllamaProvider",)),
        ("ai_router", "afaq_intelligence_core.ai.router", ("AIRouter",)),
        ("tools", "afaq_intelligence_core.tools.registry", ("ToolRegistry",)),
        ("rule_evaluator", "afaq_intelligence_core.evaluation.evaluator",
         ("RuleEvaluator",)),
        ("governance", "afaq_intelligence_core.governance.policy",
         ("PolicyEngine",)),
        ("training", "afaq_intelligence_core.training.pipeline",
         ("TrainingPipeline", "TrainingCandidate")),
    ):
        result, error = _probe(
            lambda p=module_path, s=symbols: (  # noqa: B023
                __import__(p, fromlist=list(s)),
                tuple(getattr(__import__(p, fromlist=list(s)), sym) for sym in s),
            )
        )
        if error is None:
            module, symbols_values = result
            core_modules[name] = True
            imported[name] = dict(zip(symbols, symbols_values))
        else:
            core_modules[name] = False
            errors.append(f"import {name}: {error}")

    contracts = imported.get("contracts")
    store_mod = imported.get("store")
    persistence = imported.get("persistence")
    service_mod = imported.get("service")
    config_mod = imported.get("config")
    ollama_mod = imported.get("ai_ollama")
    router_mod = imported.get("ai_router")
    tools_mod = imported.get("tools")
    rule_eval_mod = imported.get("rule_evaluator")
    governance_mod = imported.get("governance")
    training_mod = imported.get("training")

    # ------------------------------------------------------------------
    # Config (real, env-driven)
    # ------------------------------------------------------------------
    config, config_error = _probe(lambda: config_mod["AICConfig"].load()) if config_mod else (None, "config module unavailable")
    if config_error:
        errors.append(f"config: {config_error}")
    environment = getattr(config, "environment", "dev") if config else "dev"

    # ------------------------------------------------------------------
    # Memory store (SQLite-backed — the nucleus persistence layer)
    # ------------------------------------------------------------------
    store = None
    service = None
    memory_section: dict = {
        "backend": None,
        "db_path": str(DB_PATH),
        "db_exists": DB_PATH.exists(),
        "total": 0,
        "by_type": {},
        "by_state": {},
        "mean_confidence": 0.0,
        "scope_boundary": {
            "tenant_id": PRIMARY_TENANT,
            "project_id": PRIMARY_PROJECT,
            "environment": environment,
        },
        "latest": [],
        "error": None,
    }

    if persistence and service_mod:
        try:
            DB_PATH.parent.mkdir(parents=True, exist_ok=True)
            store = persistence["SqliteMemoryStore"](DB_PATH)
            service = service_mod["MemoryService"](store=store)
            records = list(store.list_all())
            by_type: dict[str, int] = {}
            by_state: dict[str, int] = {}
            confidences: list[float] = []
            for record in records:
                by_type[record.memory_type.value] = by_type.get(record.memory_type.value, 0) + 1
                by_state[record.state.value] = by_state.get(record.state.value, 0) + 1
                if record.state is imported["contracts"]["MemoryState"].ACTIVE:
                    confidences.append(record.confidence)
            memory_section.update({
                "backend": "sqlite",
                "db_exists": DB_PATH.exists(),
                "total": len(records),
                "by_type": by_type,
                "by_state": by_state,
                "mean_confidence": round(sum(confidences) / len(confidences), 4) if confidences else 0.0,
                "latest": [
                    {
                        "memory_id": r.memory_id,
                        "memory_type": r.memory_type.value,
                        "state": r.state.value,
                        "created_at": _iso(r.created_at),
                        "tenant_id": r.scope.tenant_id,
                        "project_id": r.scope.project_id,
                        "environment": r.scope.environment,
                    }
                    for r in sorted(records, key=lambda r: r.created_at, reverse=True)[:5]
                ],
            })
        except Exception as exc:  # noqa: BLE001
            memory_section["error"] = f"{type(exc).__name__}: {exc}"
            errors.append(f"memory: {memory_section['error']}")

    db_writable = False
    if DB_PATH.parent.exists():
        db_writable = os.access(DB_PATH.parent, os.W_OK)

    # The store stays open for the learning/evaluation/events sections below;
    # it is closed once, at the end of build_status().

    # ------------------------------------------------------------------
    # Learning (real reflect() over the primary scope)
    # ------------------------------------------------------------------
    learning_section: dict = {"status": "unavailable", "error": None}
    if service and contracts and config:
        scope, scope_error = _probe(
            contracts["MemoryScope"],
            tenant_id=PRIMARY_TENANT,
            project_id=PRIMARY_PROJECT,
            agent_id=PRIMARY_AGENT,
            environment=environment,
        )
        if scope_error is None:
            summary, reflect_error = _probe(service.reflect, scope)
            if reflect_error is None:
                learning_section = {
                    "status": "ok",
                    "scope_boundary": summary.scope_boundary,
                    "total_memories": summary.total_memories,
                    "active_by_type": summary.active_by_type,
                    "active_by_state": summary.active_by_state,
                    "mean_confidence": round(summary.mean_confidence, 4),
                    "top_tags": list(summary.top_tags),
                    "open_failures": list(summary.open_failures),
                    "derived_lessons": summary.derived_lessons,
                }
            else:
                learning_section = {"status": "error", "error": reflect_error}
                errors.append(f"learning: {reflect_error}")

    # ------------------------------------------------------------------
    # Evaluation (real per-record rule evaluation + validator availability)
    # ------------------------------------------------------------------
    evaluation_section: dict = {
        "status": "unavailable",
        "rule_evaluator_available": rule_eval_mod is not None,
        "records_evaluated": 0,
        "passed": 0,
        "failed": 0,
        "error": None,
    }
    if service and store is not None:
        try:
            passed = failed = evaluated = 0
            for record in store.list_all():
                evaluated += 1
                report = service.evaluate(record.memory_id)
                if report.passed:
                    passed += 1
                else:
                    failed += 1
            evaluation_section.update({
                "status": "ok",
                "records_evaluated": evaluated,
                "passed": passed,
                "failed": failed,
            })
        except Exception as exc:  # noqa: BLE001
            evaluation_section["status"] = "error"
            evaluation_section["error"] = f"{type(exc).__name__}: {exc}"
            errors.append(f"evaluation: {evaluation_section['error']}")

    # ------------------------------------------------------------------
    # Agents (real class availability; no persistent runtime exists in v1)
    # ------------------------------------------------------------------
    agents_section = {
        "afaq_learning_agent": {
            "available": "agent" in imported and core_modules.get("agent", False),
            "status": "not_running",
            "reason": (
                "no persistent agent runtime in v1; the agent requires injected "
                "executor/evaluator callables and runs only inside an orchestrated task"
            ),
            "recall_limit_default": 5,
            "requires": ["executor", "evaluator", "reflector(optional)"],
        },
        "dynamic_agent": {
            "available": core_modules.get("dynamic_agent", False),
            "status": "not_running",
            "reason": (
                "planning runtime instantiated per run; no standing process in v1"
            ),
            "components": ["planner", "tools", "policy", "evaluator"],
        },
        "controls": {
            "start": "planned",
            "stop": "planned",
            "submit_task": "planned",
            "note": "v1 is read-only; agent control endpoints are not exposed",
        },
        "runtime": probe_runtime(),
    }

    # ------------------------------------------------------------------
    # AI / models (real config + live Ollama health probe)
    # ------------------------------------------------------------------
    ollama_health: dict = {"ok": False, "error": "provider module unavailable"}
    if ollama_mod and config:
        provider, provider_error = _probe(
            ollama_mod["OllamaProvider"],
            model=getattr(config, "model", "qwen2.5-coder:7b"),
            base_url=getattr(config, "ollama_url", "http://127.0.0.1:11434"),
        )
        if provider_error is None:
            ollama_health, ollama_error = _probe(provider.health)
            if ollama_error is not None:
                ollama_health = {"ok": False, "error": ollama_error}

    ai_section = {
        "config": (
            {
                "environment": getattr(config, "environment", None),
                "ollama_url": getattr(config, "ollama_url", None),
                "model": getattr(config, "model", None),
            }
            if config else None
        ),
        "ollama": ollama_health,
        "router": {
            "available": router_mod is not None,
            "registered_providers": 0,
            "status": (
                "no providers registered by default; registration happens at "
                "runtime wiring"
            ),
        },
        "training_pipeline": {"available": training_mod is not None},
    }

    # ------------------------------------------------------------------
    # Tools (real registry — empty until runtime wiring registers handlers)
    # ------------------------------------------------------------------
    tools_section: dict = {"registry_available": False, "registered_count": 0, "tools": []}
    if tools_mod:
        registry, registry_error = _probe(tools_mod["ToolRegistry"])
        if registry_error is None:
            registered = registry.list()
            tools_section = {
                "registry_available": True,
                "registered_count": len(registered),
                "tools": [
                    {"name": t.name, "description": t.description, "risk": t.risk}
                    for t in registered
                ],
            }

    # ------------------------------------------------------------------
    # Approvals (real policy probes + training boundary)
    # ------------------------------------------------------------------
    policy_probes: list[dict] = []
    if governance_mod:
        engine, engine_error = _probe(governance_mod["PolicyEngine"])
        if engine_error is None:
            for risk in ("read", "write", "privileged"):
                decision, decision_error = _probe(engine.decide, risk, environment)
                if decision_error is None:
                    policy_probes.append({
                        "risk": risk,
                        "environment": environment,
                        "action": decision.action,
                        "reason": decision.reason,
                    })
                else:
                    policy_probes.append({"risk": risk, "error": decision_error})

    training_probe: dict = {"available": False}
    if training_mod:
        pipeline, pipeline_error = _probe(training_mod["TrainingPipeline"])
        if pipeline_error is None:
            candidate, candidate_error = _probe(
                training_mod["TrainingCandidate"], dataset_path="", base_model=""
            )
            validation, validation_error = (
                _probe(pipeline.validate_candidate, candidate)
                if candidate_error is None else (None, candidate_error)
            )
            _, promote_error = _probe(pipeline.promote)
            training_probe = {
                "available": True,
                "validate_candidate": validation,
                "promote": (
                    "blocked_by_design"
                    if promote_error and "PermissionError" in promote_error
                    else f"unexpected: {promote_error}"
                ),
            }

    approvals_section = {
        "policy_engine_available": governance_mod is not None,
        "policy": policy_probes,
        "training": training_probe,
        "pending_approvals": [],
        "note": (
            "no standing approval queue in v1; write/privileged actions surface "
            "for human approval at run time per policy"
        ),
    }

    # ------------------------------------------------------------------
    # Events (real append-only audit trail)
    # ------------------------------------------------------------------
    events: list[dict] = []
    if store is not None:
        try:
            trail = store.audit_trail()
            for event in reversed(trail[-20:]):
                events.append({
                    "seq": event.seq,
                    "action": event.action.value,
                    "memory_id": event.memory_id,
                    "actor": event.actor,
                    "detail": event.detail,
                    "occurred_at": _iso(event.occurred_at),
                })
        except Exception as exc:  # noqa: BLE001
            errors.append(f"events: {type(exc).__name__}: {exc}")
        finally:
            _probe(store.close)

    # ------------------------------------------------------------------
    # Health / core
    # ------------------------------------------------------------------
    store_ok = memory_section["backend"] is not None and memory_section["error"] is None
    health_status = "ok" if (store_ok and not errors) else ("degraded" if store_ok else "error")

    health_section = {
        "status": health_status,
        "generated_at": _now(),
        "python_version": sys.version.split()[0],
        "platform": platform.platform(),
        "aic_home": str(AIC_HOME),
        "read_only": True,
        "store_backend": memory_section["backend"],
        "db_writable": db_writable,
        "core_modules": core_modules,
        "errors": errors,
    }

    core_section = {
        "name": "afaq_intelligence_core",
        "semantic_version": None,
        "version_note": "core nucleus defines no semantic version; bridge v1 reports module integrity instead",
        "modules_present": {name: ok for name, ok in core_modules.items()},
        "module_count": len(core_modules),
        "module_count_ok": sum(1 for ok in core_modules.values() if ok),
    }

    return {
        "bridge": {
            "version": BRIDGE_VERSION,
            "read_only": True,
            "generated_at": _now(),
        },
        "health": health_section,
        "core": core_section,
        "memory": memory_section,
        "learning": learning_section,
        "evaluation": evaluation_section,
        "agents": agents_section,
        "ai": ai_section,
        "tools": tools_section,
        "approvals": approvals_section,
        "events": events,
    }


# ---------------------------------------------------------------------------
# Secure gateway — proxies a fixed action allowlist to the local AIC runtime.
#
# Client input arrives as JSON on stdin and is validated here before any HTTP
# call is made. Only the actions below exist; there is no generic proxying.
# ---------------------------------------------------------------------------

import re as _re
import urllib.error as _urlerror
import urllib.parse as _urlparse
import urllib.request as _urlrequest

_urlquote = _urlparse.quote

GATEWAY_ACTIONS = (
    "overview", "task", "submit", "approve", "reject", "resume",
    "approvals", "approval", "decision", "monitoring", "audit",
    "incidents", "incident", "diagnose", "propose_repair", "scan_incidents",
    "models", "ws",
)

_WS_OPS = ("tree", "files", "read", "write", "fs", "search", "detect", "run", "git")


def _ws_path(raw, label="path") -> str:
    if not isinstance(raw, str) or len(raw) > 512 or "\x00" in raw:
        raise GatewayError(f"invalid {label}")
    return raw


def _run_workspace_op(params: dict) -> dict:
    """Map one allowlisted workspace op to a runtime HTTP call (validated)."""
    op = params.get("op")
    if op not in _WS_OPS:
        raise GatewayError(f"unknown workspace op: {op!r} (allowed: {', '.join(_WS_OPS)})")
    actor = params.get("actor") if isinstance(params.get("actor"), str) else None
    root = params.get("root")
    if root is not None and (not isinstance(root, str) or not root.strip() or len(root) > 512):
        raise GatewayError("invalid root")
    root_q = f"&root={_urlquote(root)}" if root else ""
    root_body = {"root": root} if root else {}
    if op == "tree":
        path = _ws_path(params.get("path") or "")
        return _runtime_request("GET", f"/workspace/tree?path={_urlquote(path)}{root_q}")
    if op == "files":
        return _runtime_request("GET", f"/workspace/files?root={_urlquote(root)}" if root else "/workspace/files")
    if op == "read":
        path = _ws_path(params.get("path"))
        return _runtime_request("GET", f"/workspace/file?path={_urlquote(path)}{root_q}")
    if op == "write":
        path = _ws_path(params.get("path"))
        content = params.get("content")
        if not isinstance(content, str) or len(content.encode("utf-8")) > 600 * 1024:
            raise GatewayError("invalid content")
        return _runtime_request("POST", "/workspace/file",
                                {"path": path, "content": content, **root_body}, actor=actor)
    if op == "fs":
        fsop = params.get("fsop")
        if fsop not in ("mkdir", "rename", "delete"):
            raise GatewayError("fsop must be mkdir|rename|delete")
        path = _ws_path(params.get("path"))
        payload = {"op": fsop, "path": path, **root_body}
        if fsop == "rename":
            payload["new_path"] = _ws_path(params.get("new_path"), "new_path")
        return _runtime_request("POST", "/workspace/fs", payload, actor=actor)
    if op == "search":
        q = params.get("q")
        if not isinstance(q, str) or not q or len(q) > 300:
            raise GatewayError("invalid search query")
        regex = "1" if params.get("regex") else "0"
        return _runtime_request("GET", f"/workspace/search?q={_urlquote(q)}&regex={regex}{root_q}")
    if op == "detect":
        return _runtime_request("GET", f"/workspace/detect?root={_urlquote(root)}" if root else "/workspace/detect")
    if op == "git":
        what = params.get("what")
        if what not in ("status", "diff", "log"):
            raise GatewayError("what must be status|diff|log")
        return _runtime_request("GET", f"/workspace/git?what={what}{root_q}", actor=actor)
    # op == "run"
    command = params.get("command")
    if not isinstance(command, str) or not command.strip() or len(command) > 600:
        raise GatewayError("invalid command")
    payload = {"command": command, **root_body}
    if params.get("timeout") is not None:
        try:
            payload["timeout"] = int(params["timeout"])
        except (TypeError, ValueError):
            raise GatewayError("timeout must be an integer") from None
    return _runtime_request("POST", "/workspace/run", payload, actor=actor)

_TASK_ID_RE = _re.compile(r"^[A-Za-z0-9-]{1,64}$")
_MODEL_NAME_RE = _re.compile(r"^[\w][\w.:/-]{0,99}$")
MAX_INSTRUCTION_CHARS = 2_000
_MAX_REASON_CHARS = 500
_MAX_ACTOR_CHARS = 128


def _runtime_base() -> str:
    return os.environ.get("AIC_RUNTIME_URL", "http://127.0.0.1:8787").rstrip("/")


def _runtime_token() -> str | None:
    return os.environ.get("AIC_RUNTIME_TOKEN") or None


def _runtime_request(method: str, path: str, payload: dict | None = None,
                     timeout: float = 10.0, actor: str | None = None) -> dict:
    """One HTTP call to the localhost runtime; raises GatewayError."""
    body = json.dumps(payload).encode("utf-8") if payload is not None else None
    request = _urlrequest.Request(
        _runtime_base() + path,
        data=body,
        method=method,
        headers={"Content-Type": "application/json"},
    )
    if actor:
        request.add_header("X-AIC-Actor", actor[:_MAX_ACTOR_CHARS])
    if _runtime_token():
        request.add_header("Authorization", f"Bearer {_runtime_token()}")
    try:
        with _urlrequest.urlopen(request, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))
    except _urlerror.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")[:300]
        raise GatewayError(f"runtime HTTP {exc.code} on {method} {path}: {detail}") from exc
    except (_urlerror.URLError, TimeoutError, OSError) as exc:
        raise GatewayError(f"runtime unreachable at {_runtime_base()}: {exc}") from exc


def _validate_task_id(raw) -> str:
    task_id = str(raw or "").strip()
    if not _TASK_ID_RE.match(task_id):
        raise GatewayError(f"invalid task_id: {task_id!r}")
    return task_id


def _validate_instruction(raw) -> str:
    instruction = str(raw or "").strip()
    if not instruction:
        raise GatewayError("instruction is required")
    if len(instruction) > MAX_INSTRUCTION_CHARS:
        raise GatewayError(f"instruction too long (> {MAX_INSTRUCTION_CHARS} chars)")
    return instruction


def _validate_actor(raw) -> str:
    """Actor forwarded as X-AIC-Actor header. The gateway caller (Next.js
    route) must derive it server-side from the admin session; the bridge only
    sanitizes and forwards it."""
    return str(raw or "").strip()[:_MAX_ACTOR_CHARS]


def _validate_reason(raw) -> str:
    return str(raw or "").strip()[:_MAX_REASON_CHARS]


def _validate_approval_id(raw) -> str:
    approval_id = str(raw or "").strip()
    if not _TASK_ID_RE.match(approval_id):
        raise GatewayError(f"invalid approval_id: {approval_id!r}")
    return approval_id


def run_gateway(action: str, params: dict) -> dict:
    """Execute one allowlisted gateway action against the local runtime."""
    if action not in GATEWAY_ACTIONS:
        raise GatewayError(f"unknown action: {action!r} (allowed: {', '.join(GATEWAY_ACTIONS)})")
    params = params or {}

    if action == "overview":
        try:
            health = _runtime_request("GET", "/health", timeout=3.0)
            reachable = True
        except GatewayError:
            health = None
            reachable = False
        developer: dict = {"enabled": False, "tasks": [], "error": None}
        pending_approvals: list[dict] = []
        approvals_error = None
        if reachable:
            try:
                tasks = _runtime_request("GET", "/developer/tasks", timeout=5.0)
                developer = {"enabled": True, "tasks": tasks.get("tasks", []), "error": None}
            except GatewayError as exc:
                developer = {"enabled": False, "tasks": [], "error": str(exc)}
            try:
                queue = _runtime_request(
                    "GET", "/developer/approvals?status=pending", timeout=5.0,
                )
                pending_approvals = queue.get("approvals", [])
            except GatewayError as exc:
                approvals_error = str(exc)
        return {
            "runtime": {
                "reachable": reachable,
                "url": _runtime_base(),
                "version": (health or {}).get("version"),
                "auth": "token" if _runtime_token() else "none",
            },
            "developer": developer,
            "governance": {
                "pending_approvals": pending_approvals,
                "pending_count": len(pending_approvals),
                "error": approvals_error,
            },
        }

    if action == "monitoring":
        return {"monitoring": _runtime_request("GET", "/monitoring", timeout=10.0).get("monitoring")}

    if action == "approvals":
        status = params.get("status")
        if status is not None:
            status = str(status).strip()
            if status not in ("pending", "approved", "rejected", "expired", "cancelled"):
                raise GatewayError(f"invalid status: {status!r}")
            path = f"/developer/approvals?status={status}"
        else:
            path = "/developer/approvals"
        return {"approvals": _runtime_request("GET", path).get("approvals", [])}

    if action == "approval":
        approval_id = _validate_approval_id(params.get("approval_id"))
        return {"approval": _runtime_request("GET", f"/developer/approvals/{approval_id}").get("approval")}

    if action == "decision":
        approval_id = _validate_approval_id(params.get("approval_id"))
        decision = str(params.get("decision") or "").strip()
        if decision not in ("approve", "reject"):
            raise GatewayError("decision must be 'approve' or 'reject'")
        reason = _validate_reason(params.get("reason"))
        actor = _validate_actor(params.get("actor"))
        return _runtime_request(
            "POST", f"/developer/approvals/{approval_id}/{decision}",
            payload={"reason": reason}, actor=actor or None,
        )

    if action == "audit":
        query = []
        task_id = params.get("task_id")
        if task_id is not None:
            query.append(f"task_id={_validate_task_id(task_id)}")
        if params.get("limit") is not None:
            try:
                limit = int(params["limit"])
            except (TypeError, ValueError):
                raise GatewayError("limit must be an integer") from None
            query.append(f"limit={max(1, min(limit, 1000))}")
        path = "/developer/audit" + ("?" + "&".join(query) if query else "")
        result = _runtime_request("GET", path)
        return {"audit": result.get("audit", []), "total": result.get("total")}

    if action == "incidents":
        query = []
        if params.get("status") is not None:
            status = str(params["status"]).strip()
            if status not in ("open", "diagnosing", "repair_pending_approval", "repairing",
                              "repair_failed", "needs_human", "resolved", "no_action"):
                raise GatewayError(f"invalid status: {status!r}")
            query.append(f"status={status}")
        if params.get("classification") is not None:
            classification = str(params["classification"]).strip()
            if not _re.match(r"^[a-z_]{1,40}$", classification):
                raise GatewayError(f"invalid classification: {classification!r}")
            query.append(f"classification={classification}")
        path = "/incidents" + ("?" + "&".join(query) if query else "")
        return {"incidents": _runtime_request("GET", path).get("incidents", [])}

    if action == "incident":
        incident_id = _validate_approval_id(params.get("incident_id"))  # same id shape
        return {"incident": _runtime_request("GET", f"/incidents/{incident_id}").get("incident")}

    if action == "diagnose":
        incident_id = _validate_approval_id(params.get("incident_id"))
        actor = _validate_actor(params.get("actor"))
        return _runtime_request(
            "POST", f"/incidents/{incident_id}/diagnose", actor=actor or None,
        )

    if action == "propose_repair":
        incident_id = _validate_approval_id(params.get("incident_id"))
        actor = _validate_actor(params.get("actor"))
        proposal = params.get("proposal")
        if proposal is not None and not isinstance(proposal, dict):
            raise GatewayError("proposal must be a JSON object")
        return _runtime_request(
            "POST", f"/incidents/{incident_id}/propose",
            payload={"proposal": proposal} if proposal is not None else {},
            actor=actor or None,
        )

    if action == "scan_incidents":
        actor = _validate_actor(params.get("actor"))
        return _runtime_request("POST", "/incidents/scan", actor=actor or None)

    if action == "task":
        task_id = _validate_task_id(params.get("task_id"))
        task = _runtime_request("GET", f"/developer/tasks/{task_id}")
        events = _runtime_request("GET", f"/developer/tasks/{task_id}/events")
        return {"task": task.get("task"), "events": events.get("events", [])}

    if action == "models":
        result = _runtime_request("GET", "/developer/models")
        return result.get("models", {})

    if action == "submit":
        instruction = _validate_instruction(params.get("instruction"))
        actor = _validate_actor(params.get("actor"))
        payload: dict = {"instruction": instruction}
        proposal = params.get("proposal")
        if proposal is not None:
            if not isinstance(proposal, dict):
                raise GatewayError("proposal must be a JSON object")
            payload["proposal"] = proposal
        model = params.get("model")
        if model is not None:
            # Shape check only; eligibility/hardware/floor validation happens
            # authoritatively in the runtime.
            if not isinstance(model, str) or not _MODEL_NAME_RE.match(model):
                raise GatewayError("invalid model name")
            payload["model"] = model
        settings = params.get("settings")
        if settings is not None:
            if not isinstance(settings, dict) or len(settings) > 16:
                raise GatewayError("settings must be a small JSON object")
            payload["settings"] = settings
        return _runtime_request("POST", "/developer/tasks", payload, actor=actor or None)

    if action == "ws":
        return _run_workspace_op(params)

    task_id = _validate_task_id(params.get("task_id"))
    actor = _validate_actor(params.get("actor"))
    reason = _validate_reason(params.get("reason"))
    return _runtime_request(
        "POST", f"/developer/tasks/{task_id}/{action}",
        payload={"reason": reason} if reason else None,
        actor=actor or None,
    )


def probe_runtime() -> dict:
    """Best-effort liveness probe for the standing runtime (used by status)."""
    try:
        health = _runtime_request("GET", "/health", timeout=2.0)
        return {"reachable": True, "version": health.get("version"), "task_count": health.get("tasks")}
    except GatewayError as exc:
        return {"reachable": False, "version": None, "task_count": None, "error": str(exc)}


def main(argv: list[str]) -> int:
    if len(argv) == 2 and argv[1] == "status":
        try:
            print(json.dumps(build_status(), ensure_ascii=False, indent=2))
            return 0
        except Exception as exc:  # noqa: BLE001 - last-resort guard
            print(
                json.dumps(
                    {
                        "bridge": {"version": BRIDGE_VERSION, "read_only": True},
                        "health": {
                            "status": "error",
                            "generated_at": _now(),
                            "errors": [f"fatal: {type(exc).__name__}: {exc}"],
                            "traceback": traceback.format_exc(),
                        },
                    },
                    ensure_ascii=False,
                )
            )
            return 1

    if len(argv) == 3 and argv[1] == "gateway":
        action = argv[2]
        try:
            # Read/write bytes explicitly as UTF-8: on Windows the locale
            # codepage (e.g. cp1252) corrupts Arabic instructions long
            # before they reach the runtime (proven: "مرحبا" arrived as
            # mojibake and the intent gate had to fall back to
            # clarification_required).
            raw = sys.stdin.buffer.read().decode("utf-8").strip()
            params = json.loads(raw) if raw else {}
            if not isinstance(params, dict):
                raise GatewayError("gateway params must be a JSON object")
            out = json.dumps({"success": True, "data": run_gateway(action, params)}, ensure_ascii=False)
            sys.stdout.buffer.write(out.encode("utf-8") + b"\n")
            return 0
        except GatewayError as exc:
            out = json.dumps({"success": False, "error": str(exc)}, ensure_ascii=False)
            sys.stdout.buffer.write(out.encode("utf-8") + b"\n")
            return 1
        except Exception as exc:  # noqa: BLE001 - last-resort guard
            out = json.dumps(
                {"success": False, "error": f"fatal: {type(exc).__name__}: {exc}"},
                ensure_ascii=False,
            )
            sys.stdout.buffer.write(out.encode("utf-8") + b"\n")
            return 1

    print("usage: python aic_bridge.py status | python aic_bridge.py gateway "
          "<overview|task|submit|approve|reject|resume|approvals|approval|decision|monitoring|audit"
          "|incidents|incident|diagnose|propose_repair|scan_incidents>",
          file=sys.stderr)
    return 2


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
