"""Self-Healing v1 — Detect → Diagnose → Propose → Govern → Repair → Validate → Learn.

Built strictly on top of the existing governance stack:
  * DetectionEngine    — scans safe local sources, creates *significant* incidents
  * RootCauseEngine    — deterministic evidence assembly (+ optional model input)
  * SelfHealingEngine  — orchestrates the repair lifecycle through DeveloperAgent v2,
                         the Permission/Risk engines and the persistent Approval Queue

Hard rules (v1):
  * No automatic approval — every repair attempt needs its own persisted approval.
  * policy_denial is never healed (no_action).
  * Production writes are denied (environment policy) — never bypassed.
  * Max 2 repair attempts per incident, then needs_human.
  * Rollback on failure is performed by DeveloperAgent v2 (checkpoint restore);
    self-healing never edits files directly.
"""

from __future__ import annotations

import json
from threading import RLock
from typing import Any, Mapping

from afaq_intelligence_core.aic_memory_contracts import MemoryEvidence, MemoryType

from .developer_agent import DEVELOPER_AGENT_ID, DeveloperAgent
from .incidents import (
    HEALABLE_CLASSES,
    IncidentStore,
    base_severity,
    classify_failure,
    escalate_severity,
    incident_signature,
)
from .permissions import evaluate_proposal, normalize_environment
from .risk import classify_risk

SUCCESS_SCORE_THRESHOLD = 0.6
MAX_REPAIR_ATTEMPTS = 2
RECURRENCE_ESCALATION_THRESHOLD = 3

SELF_HEALING_SUCCESS = "self_healing_success"
SELF_HEALING_FAILURE = "self_healing_failure"


# ---------------------------------------------------------------------------
# Detection
# ---------------------------------------------------------------------------

class DetectionEngine:
    """Scans local, safe failure sources and raises significant incidents.

    Sources: failed developer tasks, model failure/timeout stats, unhealthy
    local services (Ollama), memory/audit DB health failures. Every creation
    is deduplicated by signature; repeated detection of an already-open
    incident bumps its recurrence count (which escalates severity) instead of
    flooding the store. Not every exception becomes an incident — each source
    applies its own significance threshold.
    """

    def __init__(self, agent: DeveloperAgent, store: IncidentStore, audit,
                 health_checker=None) -> None:
        self.agent = agent
        self.store = store
        self.audit = audit
        # Optional deterministic health source for tests: when injected, the
        # service-health scan derives ollama status from it instead of
        # probing the real local service. Production/e2e pass None and keep
        # the real probes.
        self._health_checker = health_checker

    def scan(self, *, actor: str = "self-healing-detector") -> list[dict]:
        created: list[dict] = []
        created.extend(self._scan_failed_tasks(actor))
        created.extend(self._scan_model_health(actor))
        created.extend(self._scan_service_health(actor))
        created.extend(self._scan_storage_health(actor))
        return created

    # -- individual sources -------------------------------------------------
    def _raise(self, *, source: str, classification: str, key: str,
               evidence: list[dict], actor: str, environment: str | None = None,
               related_task_ids: list[str] | None = None) -> dict | None:
        env = normalize_environment(environment or self.agent.config.environment)
        signature = incident_signature(source, classification, key)
        known = self.store.by_signature(signature)
        open_incidents = [i for i in known
                          if i["status"] not in ("resolved", "no_action", "needs_human")]
        if open_incidents:
            inc = open_incidents[0]
            recurrence = int(inc["recurrence_count"]) + 1
            # Escalate from the classification's base severity — applying the
            # bumps on top of the already-escalated stored value would
            # compound and overshoot the intended step-per-3-recurrences rule.
            severity = escalate_severity(base_severity(classification), recurrence)
            self.store.update(
                inc["incident_id"], (),
                recurrence_count=recurrence, severity=severity,
            )
            return None  # recurrence recorded, no new incident
        if known:
            return None  # historically handled (resolved/needs_human) — never recreate
        record = self.store.create(
            source=source, environment=env, classification=classification,
            signature=signature, evidence=evidence,
            related_task_ids=related_task_ids or [],
            max_repair_attempts=MAX_REPAIR_ATTEMPTS,
        )
        self.audit.record(
            "incident_detected",
            task_id=(related_task_ids or [None])[0], actor=actor,
            agent_id="afaq-self-healing", environment=env,
            detail={
                "incident_id": record["incident_id"], "source": source,
                "classification": classification, "severity": record["severity"],
                "key": key[:200],
            },
        )
        return record

    def _scan_failed_tasks(self, actor: str) -> list[dict]:
        created = []
        # A failed *repair* task is already reconciled into its own incident;
        # raising a new incident for it would cascade incidents endlessly.
        repair_task_ids = {
            i["repair_task_id"] for i in self.store.list()
            if i.get("repair_task_id")
        }
        # significant: terminal failed tasks without an open incident yet
        for task in self.agent.store.list(limit=500):
            if task["state"] != "failed":
                continue
            if task["task_id"] in repair_task_ids:
                continue
            error = task.get("error") or ""
            classification = classify_failure("developer_task", error)
            signature = incident_signature(
                "developer_task", classification, f"{task['task_id']}"
            )
            evidence = [{
                "kind": "task_error", "task_id": task["task_id"],
                "error": error[:1000], "failure_class": _failure_class(error),
            }]
            events = self.agent.task_events(task["task_id"])
            failed_stages = [e["event_type"] for e in events
                             if "fail" in e["event_type"] or e["event_type"] == "rollback_completed"]
            if failed_stages:
                evidence.append({"kind": "task_events", "events": failed_stages[:20]})
            record = self._raise(
                source="developer_task", classification=classification,
                key=task["task_id"], evidence=evidence, actor=actor,
                environment=task.get("environment"),
                related_task_ids=[task["task_id"]],
            )
            if record:
                created.append(record)
        return created

    def _scan_model_health(self, actor: str) -> list[dict]:
        from . import monitoring
        stats = monitoring._model_stats.snapshot()  # noqa: SLF001 - same package
        if not stats["failures"] and not stats["timeouts"]:
            return []
        key = f"model-stats:{stats['last_model']}"
        evidence = [{"kind": "model_stats", **stats}]
        record = self._raise(
            source="model_failure", classification="model_failure",
            key=key, evidence=evidence, actor=actor,
        )
        return [record] if record else []

    def _scan_service_health(self, actor: str) -> list[dict]:
        if self._health_checker is not None:
            probe = {"ok": bool(self._health_checker().get("ollama_ok")), "source": "injected"}
        else:
            from .monitoring import _ollama_probe
            probe = _ollama_probe(self.agent.config.ollama_url)
        if probe["ok"]:
            return []
        evidence = [{"kind": "service_probe", "service": "ollama", **probe}]
        record = self._raise(
            source="service_health", classification="dependency_failure",
            key="ollama-unreachable", evidence=evidence, actor=actor,
        )
        return [record] if record else []

    def _scan_storage_health(self, actor: str) -> list[dict]:
        import sqlite3
        created = []
        for name, db_path in (
            ("memory_db", self.agent.var_dir / "aic_memory.db"),
            ("audit_db", self.agent.var_dir / "aic_audit.db"),
        ):
            if not db_path.exists():
                continue
            try:
                conn = sqlite3.connect(str(db_path), timeout=2)
                try:
                    check = conn.execute("PRAGMA quick_check").fetchone()
                finally:
                    conn.close()
                if check and check[0] == "ok":
                    continue
            except Exception as exc:  # noqa: BLE001 - probe must report, not crash
                check = (f"{type(exc).__name__}: {exc}",)
            evidence = [{"kind": "db_health", "db": name, "check": check[0]}]
            record = self._raise(
                source="db_health", classification="data_integrity_failure",
                key=name, evidence=evidence, actor=actor,
            )
            if record:
                created.append(record)
        return created


def _failure_class(error_text: str) -> str:
    if "policy_denial" in (error_text or ""):
        return "policy_denial"
    if "development_test_failure" in (error_text or ""):
        return "development_test_failure"
    if "runtime_failure" in (error_text or ""):
        return "runtime_failure"
    return "unknown"


# ---------------------------------------------------------------------------
# Root-cause analysis
# ---------------------------------------------------------------------------

class RootCauseEngine:
    """Deterministic evidence assembly with optional model reasoning on top.

    Never LLM-alone: the analysis is built from task events, the audit
    ledger, test output, memory recall and repository context first; a model
    call may only *rephrase/reorder* the assembled evidence into a hypothesis
    and is fully wrapped — its failure lowers confidence, never kills the
    analysis.
    """

    def __init__(self, agent: DeveloperAgent) -> None:
        self.agent = agent

    def analyze(self, incident: Mapping[str, Any]) -> dict:
        evidence: list[dict] = list(incident.get("evidence") or [])
        alternative_causes: list[str] = []
        recommended_action = "repair"
        probable = ""
        confidence = 0.4

        task_id = (incident.get("related_task_ids") or [None])[0]
        task = self.agent.get_task(task_id) if task_id else None
        if task:
            error = task.get("error") or ""
            evidence.append({"kind": "task_error", "task_id": task_id, "error": error[:1000]})
            result = task.get("result") or {}
            if result.get("tests"):
                evidence.append({
                    "kind": "test_output",
                    "tests": [{ "name": t.get("name"), "passed": t.get("passed"),
                                "returncode": t.get("returncode") } for t in result["tests"]],
                })
            for event in self.agent.task_events(task_id):
                if event["event_type"] in (
                    "tests_failed", "fix_attempted", "rollback_completed", "diagnosis_completed",
                ):
                    evidence.append({"kind": "event", "event_type": event["event_type"],
                                     "detail": event.get("payload")})

        for record in self.agent.audit.list(task_id=task_id, limit=50) if task_id else []:
            if record["action"] in ("risk_classified", "approval_decided", "files_modified"):
                evidence.append({"kind": "audit", "action": record["action"],
                                 "detail": record.get("detail")})

        # repository context (bounded)
        try:
            from .repository_mapper import map_repository
            repo_map = map_repository(self.agent.project_root)
            evidence.append({
                "kind": "repository",
                "project_types": repo_map.get("project_types"),
                "main_folders": repo_map.get("main_folders"),
            })
        except Exception:  # noqa: BLE001 - context is optional evidence
            pass

        # recurrence: previous similar incidents and their repairs
        similar = self.agent_incident_similar(incident)
        previous_repairs = []
        for other in similar:
            if other.get("repair_proposal"):
                previous_repairs.append({
                    "incident_id": other["incident_id"],
                    "status": other["status"],
                    "proposal_hash": other.get("proposal_hash"),
                    "repair_attempts": other.get("repair_attempts", 0),
                })
        if previous_repairs:
            evidence.append({"kind": "recurrence", "previous_repairs": previous_repairs})

        classification = incident.get("classification") or "unknown"
        if classification == "policy_denial":
            probable = "operation denied by environment/policy — not a defect to repair"
            recommended_action = "no_action"
            confidence = 0.95
        elif classification == "data_integrity_failure":
            probable = "local database integrity check failed — manual inspection required"
            recommended_action = "needs_human"
            confidence = 0.8
        elif task and task.get("error"):
            probable = task["error"][:500]
            if "patch text not found" in task["error"]:
                alternative_causes.append(
                    "the approved proposal no longer matches the file content (drift)"
                )
                alternative_causes.append("an earlier partial edit changed the file")
            elif "tests_failed" in json.dumps(evidence):
                alternative_causes.append("the fix is incorrect for the stated goal")
            confidence = min(0.9, 0.5 + 0.1 * min(len(evidence), 4))
        elif classification == "model_failure":
            probable = "local model calls failing or timing out"
            alternative_causes.append("model not loaded / Ollama unavailable")
            alternative_causes.append("prompt too large for the context window")
            confidence = 0.7
        elif classification == "dependency_failure":
            probable = "required local service unreachable (Ollama)"
            confidence = 0.75
        else:
            probable = f"unclassified failure from source {incident.get('source')}"
            recommended_action = "needs_human"
            confidence = 0.3

        # optional model pass — may only reorder/rephrase, wrapped in try/except
        model_note = None
        if classification in HEALABLE_CLASSES:
            model_note = self._model_hypothesis(incident, probable, evidence)

        return {
            "probable_root_cause": probable,
            "evidence": evidence,
            "confidence": round(confidence, 2),
            "alternative_causes": alternative_causes,
            "recommended_action": recommended_action,
            "model_hypothesis": model_note,
            "previous_repairs": previous_repairs,
            "analyzed_at": _utcnow(),
        }

    def agent_incident_similar(self, incident: Mapping[str, Any]) -> list[dict]:
        store = getattr(self.agent, "_incident_store", None)
        if store is None:
            return []
        return store.similar(incident.get("classification") or "unknown",
                             exclude_id=incident.get("incident_id"))

    def _model_hypothesis(self, incident, probable: str, evidence: list[dict]) -> str | None:
        try:
            from afaq_intelligence_core.ai.provider import AIRequest
            prompt = (
                "You are a root-cause analyst. Based ONLY on the evidence JSON, "
                "state the single most likely root cause in one sentence.\n"
                f"Current hypothesis: {probable}\n"
                f"Evidence: {json.dumps(evidence, ensure_ascii=False)[:3000]}\n"
                "Answer with plain text, one sentence."
            )
            response = self.agent.router.generate(
                AIRequest(
                    system="root-cause analyst",
                    prompt=prompt,
                    max_tokens=200,
                    timeout=120,  # short one-sentence hypothesis, tight leash
                )
            )
            return (response.text or "").strip()[:500] or None
        except Exception:  # noqa: BLE001 - model input is optional
            return None


# ---------------------------------------------------------------------------
# Self-Healing orchestrator
# ---------------------------------------------------------------------------

class SelfHealingEngine:
    """Orchestrates the full repair lifecycle on top of DeveloperAgent v2."""

    def __init__(self, agent: DeveloperAgent, audit=None, health_checker=None) -> None:
        self.agent = agent
        self.store = IncidentStore(agent.var_dir / "aic_runtime.db")
        agent._incident_store = self.store  # noqa: SLF001 - same package collaboration
        self.audit = audit if audit is not None else agent.audit
        # Deterministic health source for tests (None = real probes in
        # production and live e2e). One injection point feeds both the
        # reconcile-time health gate and the service-health scan.
        self._health_checker = health_checker
        self.detector = DetectionEngine(agent, self.store, self.audit,
                                        health_checker=health_checker)
        self.root_cause = RootCauseEngine(agent)
        # The HTTP server is multi-threaded and GET /incidents/{id} reconciles;
        # serialize state-machine transitions so concurrent reconciles cannot
        # double-count failures or double-write memory.
        self._lock = RLock()

    def close(self) -> None:
        self.store.close()

    # -- detection ---------------------------------------------------------
    def scan(self, *, actor: str = "self-healing-detector") -> list[dict]:
        return self.detector.scan(actor=actor)

    # -- diagnosis ---------------------------------------------------------
    def diagnose(self, incident_id: str, *, actor: str = "system") -> dict:
        incident = self._require(incident_id)
        analysis = self.root_cause.analyze(incident)
        status = "diagnosing"
        if analysis["recommended_action"] == "no_action":
            status = "no_action"
        elif analysis["recommended_action"] == "needs_human":
            status = "needs_human"
        updated = self.store.update(
            incident_id, ("open", "diagnosing"),
            status=status, root_cause=analysis,
        )
        self.audit.record(
            "incident_diagnosed",
            task_id=(incident.get("related_task_ids") or [None])[0],
            actor=actor, agent_id="afaq-self-healing",
            environment=updated["environment"],
            detail={
                "incident_id": incident_id,
                "classification": updated["classification"],
                "confidence": analysis["confidence"],
                "recommended_action": analysis["recommended_action"],
            },
        )
        return updated

    # -- repair proposal (governance-gated) --------------------------------
    def propose_repair(self, incident_id: str, *, actor: str,
                       proposal: Mapping[str, Any] | None = None) -> dict:
        with self._lock:
            return self._propose_repair_locked(incident_id, actor=actor, proposal=proposal)

    def _propose_repair_locked(self, incident_id: str, *, actor: str,
                               proposal: Mapping[str, Any] | None = None) -> dict:
        incident = self._require(incident_id)
        # Terminal incident states must never spawn repair tasks or orphan
        # approvals.
        if incident["status"] in ("resolved", "needs_human", "no_action"):
            self.audit.record(
                "repair_refused", actor=actor, agent_id="afaq-self-healing",
                environment=normalize_environment(self.agent.config.environment),
                detail={"incident_id": incident_id,
                        "reason": f"incident already {incident['status']}"},
            )
            return dict(incident)
        # Repair gating uses the runtime's *current* operating environment;
        # the incident's recorded environment stays as detected (informational).
        env = normalize_environment(self.agent.config.environment)

        # rule: policy_denial is never healed
        if incident["classification"] == "policy_denial" or incident["status"] == "no_action":
            updated = self.store.update(
                incident_id, (), status="no_action",
                resolution={"reason": "policy_denial is not healable by self-healing"},
            )
            self.audit.record(
                "repair_refused", incident_id=None, actor=actor,
                agent_id="afaq-self-healing", environment=env,
                detail={"incident_id": incident_id, "reason": "policy_denial"},
            )
            return updated

        # rule: only healable classifications proceed; others go straight to human
        if incident["classification"] not in HEALABLE_CLASSES:
            updated = self.store.update(
                incident_id, (), status="needs_human",
                resolution={"reason": f"classification '{incident['classification']}' is not auto-healable in self-healing v1"},
            )
            self.audit.record(
                "repair_refused", actor=actor, agent_id="afaq-self-healing",
                environment=env,
                detail={"incident_id": incident_id,
                        "reason": f"unhealable classification: {incident['classification']}"},
            )
            return updated

        # rule: production writes are denied in v1 (environment policy)
        if env == "production":
            updated = self.store.update(
                incident_id, (), status="needs_human",
                resolution={"reason": "production environment: repairs are denied in v1"},
            )
            self.audit.record(
                "repair_refused", actor=actor, agent_id="afaq-self-healing",
                environment=env, detail={"incident_id": incident_id, "reason": "production deny"},
            )
            return updated

        current = self.reconcile(incident_id)
        if current["status"] in ("repair_pending_approval", "repairing"):
            return current  # a repair is already in flight
        if int(current["repair_attempts"]) >= int(current["max_repair_attempts"]):
            return self.store.update(incident_id, (), status="needs_human")

        # recurrence guard: never repeat a repair proposal that already failed
        # (for a similar incident OR for this very incident — the similar-set
        # excludes self, so the incident's own failed hash must be added
        # explicitly, otherwise attempt 2 could blindly repeat attempt 1).
        root = current.get("root_cause") or {}
        previous_hashes = {
            r.get("proposal_hash") for r in root.get("previous_repairs", [])
            if r.get("status") in ("repair_failed", "needs_human") and r.get("proposal_hash")
        }
        own_hash = current.get("proposal_hash")
        if own_hash and current.get("status") in ("repair_failed", "needs_human"):
            previous_hashes.add(own_hash)

        instruction = self._repair_instruction(current)
        validated = None
        if proposal is not None:
            from .developer_agent import validate_proposal
            validated = validate_proposal(proposal, self.agent.boundary)
            from .approval_store import proposal_hash
            if proposal_hash(validated) in previous_hashes:
                return self.store.update(
                    incident_id, (), status="needs_human",
                    resolution={"reason": "this repair already failed for a similar incident; new evidence required"},
                )

        # policy pre-check (explicit proposals): deny before any task is created
        if validated is not None:
            permission = evaluate_proposal(validated, env)
            if permission["action"] == "deny":
                updated = self.store.update(
                    incident_id, (), status="needs_human",
                    resolution={"reason": "repair proposal denied by environment policy",
                                "deny_reasons": permission["deny_reasons"]},
                )
                self.audit.record(
                    "repair_refused", actor=actor, agent_id="afaq-self-healing",
                    environment=env,
                    detail={"incident_id": incident_id, "deny_reasons": permission["deny_reasons"]},
                )
                return updated

        task_id = self.agent.submit(instruction, proposal=validated, actor=actor, wait=True)
        task = self.agent.get_task(task_id)
        from .approval_store import proposal_hash
        proposal_record = validated if validated is not None else (task.get("proposal") or {})
        if task["state"] in ("failed", "rejected"):
            # policy denial or an early failure inside the governed pipeline:
            # link the task, then reconcile maps the incident to
            # repair_failed / needs_human with the pipeline's own reason.
            self.store.update(
                incident_id, ("open", "diagnosing", "repair_failed"),
                repair_task_id=task_id, repair_proposal=proposal_record,
                proposal_hash=proposal_hash(proposal_record),
            )
            return self.reconcile(incident_id)
        updated = self.store.update(
            incident_id,
            ("open", "diagnosing", "repair_failed"),
            status="repair_pending_approval",
            repair_task_id=task_id,
            repair_proposal=proposal_record,
            proposal_hash=proposal_hash(proposal_record),
        )
        self.audit.record(
            "repair_proposed",
            task_id=task_id, actor=actor, agent_id="afaq-self-healing", environment=env,
            detail={
                "incident_id": incident_id,
                "risk_level": (task or {}).get("risk_level"),
                "auto_generated": validated is None,
            },
        )
        return updated

    # -- reconciliation (incident state follows the repair task) ------------
    def reconcile(self, incident_id: str) -> dict:
        with self._lock:
            return self._reconcile_locked(incident_id)

    def _reconcile_locked(self, incident_id: str) -> dict:
        incident = self._require(incident_id)
        task_id = incident.get("repair_task_id")
        if not task_id:
            return incident
        task = self.agent.get_task(task_id)
        if task is None:
            return incident
        state = task["state"]
        if state == "awaiting_approval":
            # A repair whose approval expired (or was cancelled) undecided can
            # never proceed; fail it instead of leaving the incident parked in
            # repair_pending_approval forever.
            pending = self.agent.approvals.pending_for_task(task_id)
            if not pending:
                return self._mark_repair_failed(
                    incident, task,
                    reason="repair approval expired or was cancelled undecided",
                )
            return self.store.update(incident_id, (), status="repair_pending_approval")
        if state == "interrupted":
            # Runtime restarted mid-repair; the checkpoint was restored by
            # recover(). The incident needs a human, not another silent retry.
            updated = self.store.update(
                incident_id, (), status="needs_human",
                resolution={"reason": "repair task interrupted by runtime restart; resume it manually"},
            )
            self.audit.record(
                "repair_interrupted",
                task_id=task_id, actor="afaq-self-healing",
                agent_id="afaq-self-healing", environment=updated["environment"],
                detail={"incident_id": incident_id},
            )
            return updated
        if state in ("received", "mapping", "proposing", "approved", "executing"):
            return self.store.update(incident_id, (), status="repairing")
        if state == "completed":
            return self._on_repair_completed(incident, task)
        if state in ("failed", "rejected"):
            return self._on_repair_failed(incident, task)
        return incident

    # -- outcomes ----------------------------------------------------------
    def _on_repair_completed(self, incident: Mapping[str, Any], task: Mapping[str, Any]) -> dict:
        incident_id = incident["incident_id"]
        if incident["status"] == "resolved":
            return dict(incident)
        result = task.get("result") or {}
        evaluation = result.get("evaluation") or {}
        score = float(evaluation.get("score") or 0)
        tests = result.get("tests") or []
        tests_ok = all(t.get("passed") for t in tests) if tests else True

        if score < SUCCESS_SCORE_THRESHOLD or not tests_ok:
            return self._mark_repair_failed(
                incident, task,
                reason=f"validation failed: score={score}, tests_ok={tests_ok}",
            )

        # health recheck before closing — an incident is only resolved when
        # the system is actually healthy again
        recheck = self._health_recheck()
        if not recheck.get("healthy"):
            updated = self.store.update(
                incident_id, (), status="needs_human",
                resolution={"reason": "repaired and validated, but health recheck failed",
                            "health_recheck": recheck},
            )
            self.audit.record(
                "repair_refused", task_id=task["task_id"], actor="afaq-self-healing",
                agent_id="afaq-self-healing", environment=updated["environment"],
                detail={"incident_id": incident_id, "reason": "health recheck failed",
                        "health_recheck": recheck},
            )
            return updated
        resolution = {
            "outcome": SELF_HEALING_SUCCESS,
            "repair_task_id": task["task_id"],
            "evaluation_score": score,
            "tests_passed": len(tests),
            "health_recheck": recheck,
            "resolved_at": _utcnow(),
        }
        updated = self.store.update(
            incident_id, (), status="resolved", resolution=resolution,
        )
        memory_ids = self._learn_outcome(updated, success=True)
        self.audit.record(
            "incident_resolved",
            task_id=task["task_id"], actor="afaq-self-healing",
            agent_id="afaq-self-healing", environment=updated["environment"],
            detail={"incident_id": incident_id, "score": score,
                    "memory_ids": memory_ids, "health_recheck": recheck},
        )
        return updated

    def _on_repair_failed(self, incident: Mapping[str, Any], task: Mapping[str, Any]) -> dict:
        return self._mark_repair_failed(
            incident, task,
            reason=f"repair task {task['task_id']} ended {task['state']}: {(task.get('error') or '')[:300]}",
        )

    def _mark_repair_failed(self, incident: Mapping[str, Any], task: Mapping[str, Any],
                            *, reason: str) -> dict:
        incident_id = incident["incident_id"]
        # Count each failed repair task exactly once: repeated reconcile() calls
        # over the same failed task must not burn retry budget.
        if incident.get("counted_failure_task") == task["task_id"]:
            return dict(incident)
        attempts = int(incident.get("repair_attempts") or 0) + 1
        status = "repair_failed" if attempts < int(incident.get("max_repair_attempts") or MAX_REPAIR_ATTEMPTS) else "needs_human"
        resolution = None
        if status == "needs_human":
            resolution = {"reason": f"repair retry limit reached ({attempts} attempts): {reason[:300]}"}
        updated = self.store.update(incident_id, (), status=status,
                                    repair_attempts=attempts,
                                    counted_failure_task=task["task_id"],
                                    resolution=resolution)
        self.audit.record(
            "repair_failed",
            task_id=task["task_id"], actor="afaq-self-healing",
            agent_id="afaq-self-healing", environment=updated["environment"],
            detail={"incident_id": incident_id, "attempts": attempts,
                    "reason": reason, "next_status": status},
        )
        if status == "needs_human":
            memory_ids = self._learn_outcome(updated, success=False, reason=reason)
            self.audit.record(
                "incident_needs_human",
                task_id=task["task_id"], actor="afaq-self-healing",
                agent_id="afaq-self-healing", environment=updated["environment"],
                detail={"incident_id": incident_id, "attempts": attempts,
                        "reason": reason, "memory_ids": memory_ids},
            )
        return updated

    # -- learning ----------------------------------------------------------
    def _learn_outcome(self, incident: Mapping[str, Any], *, success: bool,
                       reason: str = "") -> list[str]:
        root = incident.get("root_cause") or {}
        scope = self.agent._scope()  # noqa: SLF001 - same package
        memory_ids: list[str] = []
        outcome_class = SELF_HEALING_SUCCESS if success else SELF_HEALING_FAILURE
        record = self.agent.memory.create(
            memory_type=MemoryType.EXPERIENCE if success else MemoryType.FAILURE,
            content={
                "outcome_class": outcome_class,
                "incident_id": incident["incident_id"],
                "classification": incident.get("classification"),
                "probable_root_cause": root.get("probable_root_cause", ""),
                "repair": incident.get("repair_proposal") or {},
                "evidence": (incident.get("evidence") or [])[:5],
                "resolution": incident.get("resolution") or {},
                "reason": reason,
                "tags": ["self-healing"],
            },
            evidence=(
                MemoryEvidence(
                    evidence_id=f"EV-{incident['incident_id']}-{outcome_class}",
                    source_ref=f"incident:{incident['incident_id']}",
                    confidence=float(root.get("confidence") or 0.5),
                ),
            ),
            scope=scope,
            metadata={"incident_id": incident["incident_id"], "outcome_class": outcome_class},
            actor="afaq-self-healing",
        )
        memory_ids.append(record.memory_id)

        if success:
            from afaq_intelligence_core.aic_memory_contracts import new_memory_record
            candidate = new_memory_record(
                memory_type=MemoryType.LESSON,
                content={
                    "reflection": (
                        f"self-healing repaired a {incident.get('classification')} incident: "
                        f"{root.get('probable_root_cause', '')[:200]}"
                    ),
                    "derived_from": record.memory_id,
                    "incident_id": incident["incident_id"],
                    "tags": ["self-healing"],
                },
                evidence=(
                    MemoryEvidence(
                        evidence_id=f"EV-{incident['incident_id']}-lesson",
                        source_ref=f"incident:{incident['incident_id']}",
                        confidence=float(root.get("confidence") or 0.5),
                    ),
                ),
                scope=scope,
                metadata={"incident_id": incident["incident_id"]},
            )
            verdict = self.agent.memory.validate_lesson_candidate(candidate)
            if verdict.accepted:
                lesson = self.agent.memory.create(
                    memory_type=MemoryType.LESSON,
                    content=candidate.content,
                    evidence=candidate.evidence,
                    scope=candidate.scope,
                    metadata=candidate.metadata,
                    actor="afaq-self-healing",
                )
                memory_ids.append(lesson.memory_id)
        return memory_ids

    # -- helpers -----------------------------------------------------------
    def _default_health_recheck(self) -> dict:
        from .monitoring import _db_health, _ollama_probe
        import sqlite3
        checks: dict[str, Any] = {}
        ollama = _ollama_probe(self.agent.config.ollama_url)
        checks["ollama_ok"] = ollama["ok"]
        try:
            conn = sqlite3.connect(str(self.agent.var_dir / "aic_memory.db"), timeout=2)
            try:
                checks["memory_db"] = _db_health(conn, "SELECT COUNT(*) FROM memories")["ok"]
            finally:
                conn.close()
        except Exception as exc:  # noqa: BLE001
            checks["memory_db"] = f"error: {exc}"
        checks["healthy"] = bool(checks["ollama_ok"]) and checks.get("memory_db") is True
        return checks

    def _health_recheck(self) -> dict:
        # Tests may inject a deterministic checker; production and the live
        # e2e path always use the real probes above.
        if self._health_checker is not None:
            return self._health_checker()
        return self._default_health_recheck()

    def _repair_instruction(self, incident: Mapping[str, Any]) -> str:
        root = incident.get("root_cause") or {}
        cause = root.get("probable_root_cause") or incident.get("classification")
        return (
            f"Self-healing repair for incident {incident['incident_id']} "
            f"({incident['classification']}): {cause}. "
            "Propose the minimal safe fix, then wait for human approval."
        )[:1000]

    def _require(self, incident_id: str) -> dict:
        incident = self.store.get(incident_id)
        if incident is None:
            raise KeyError(f"incident not found: {incident_id}")
        return incident


def _utcnow() -> str:
    from datetime import datetime, timezone
    return datetime.now(timezone.utc).isoformat()
