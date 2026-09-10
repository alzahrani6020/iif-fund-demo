"""Runtime + model monitoring (governance hardening).

Reports only real, measured state:
  * runtime health/uptime, task counts by state, approval queue depth,
    failure count, average task duration (from persisted timestamps);
  * model health: Ollama availability, loaded models, per-provider call
    counts, failures, timeouts and latency stats recorded on real generate
    calls (RuntimeRouter feeds record_model_call);
  * storage health: SQLite quick_check + row counts for the task DB,
    memory DB, event log, and the audit ledger.

No fabricated metrics: anything not measured is reported as null.
"""

from __future__ import annotations

import json
import threading
import time
from urllib import error, request

_server_started: float | None = None


def mark_server_started() -> None:
    """Reset the uptime anchor when the runtime server actually starts.

    Module import time is not server start time (tests and early imports would
    otherwise inflate the reported uptime)."""
    global _server_started
    _server_started = time.time()


def server_started_at() -> float | None:
    return _server_started


# ---------------------------------------------------------------------------
# Model call statistics (fed by RuntimeRouter.generate on every real call)
# ---------------------------------------------------------------------------

class _ModelStats:
    def __init__(self) -> None:
        self._lock = threading.Lock()
        self.calls = 0
        self.failures = 0
        self.timeouts = 0
        self.total_latency_ms = 0.0
        self.last_latency_ms: float | None = None
        self.last_model: str | None = None

    def record(self, model: str, latency_ms: float, error: Exception | None) -> None:
        with self._lock:
            self.calls += 1
            self.last_model = model
            self.last_latency_ms = latency_ms
            self.total_latency_ms += latency_ms
            if error is not None:
                self.failures += 1
                if isinstance(error, (TimeoutError,)) or "timed out" in str(error).lower():
                    self.timeouts += 1

    def snapshot(self) -> dict:
        with self._lock:
            avg = (self.total_latency_ms / self.calls) if self.calls else None
            return {
                "calls": self.calls,
                "failures": self.failures,
                "timeouts": self.timeouts,
                "avg_latency_ms": round(avg, 1) if avg is not None else None,
                "last_latency_ms": round(self.last_latency_ms, 1) if self.last_latency_ms is not None else None,
                "last_model": self.last_model,
            }


_model_stats = _ModelStats()


def record_model_call(model: str, latency_ms: float, error: Exception | None) -> None:
    _model_stats.record(model, latency_ms, error)


def _ollama_probe(base_url: str, timeout: float = 3.0) -> dict:
    try:
        with request.urlopen(base_url.rstrip("/") + "/api/tags", timeout=timeout) as r:
            data = json.loads(r.read().decode("utf-8"))
        models = sorted(m.get("name", "") for m in data.get("models", []))
        return {"ok": True, "models": models, "model_count": len(models), "error": None}
    except (error.URLError, TimeoutError, OSError, ValueError) as exc:
        # ValueError covers JSONDecodeError: a proxy/front page may answer 200
        # with non-JSON, and the probe must report failure, not crash the
        # whole monitoring snapshot.
        return {"ok": False, "models": [], "model_count": 0, "error": str(exc)}


def _db_health(conn, count_sql: str) -> dict:
    try:
        check = conn.execute("PRAGMA quick_check").fetchone()
        count = conn.execute(count_sql).fetchone()
        return {
            "ok": bool(check and check[0] == "ok"),
            "check": check[0] if check else None,
            "rows": int(count[0]) if count else 0,
        }
    except Exception as exc:  # noqa: BLE001 - probe must report, not crash
        return {"ok": False, "error": f"{type(exc).__name__}: {exc}"}


def collect_monitoring(
    *,
    dev_store,
    approvals_store,
    audit: object | None,
    memory_db_path,
    event_db_path,
    ollama_url: str,
    config_environment: str,
) -> dict:
    """Assemble the full monitoring snapshot from live components."""
    # -- runtime ----------------------------------------------------------
    tasks = dev_store.list(limit=10_000)
    by_state: dict[str, int] = {}
    durations: list[float] = []
    for t in tasks:
        by_state[t["state"]] = by_state.get(t["state"], 0) + 1
        if t.get("created_at") and t.get("finished_at"):
            try:
                from datetime import datetime
                start = datetime.fromisoformat(t["created_at"])
                end = datetime.fromisoformat(t["finished_at"])
                durations.append((end - start).total_seconds())
            except ValueError:
                pass
    pending_approvals = len(approvals_store.list(status="pending")) if approvals_store else 0

    runtime = {
        "status": "ok",
        "uptime_seconds": (
            round(time.time() - _server_started, 1) if _server_started else 0.0
        ),
        "environment": config_environment,
        "tasks_total": len(tasks),
        "tasks_by_state": by_state,
        "active_tasks": sum(by_state.get(s, 0) for s in ("received", "mapping", "proposing", "executing", "approved")),
        "awaiting_approvals": by_state.get("awaiting_approval", 0),
        "failed_tasks": by_state.get("failed", 0),
        "queued_approvals": pending_approvals,
        "avg_task_duration_seconds": round(sum(durations) / len(durations), 1) if durations else None,
    }

    # -- models -----------------------------------------------------------
    ollama = _ollama_probe(ollama_url)
    models = {
        "ollama": ollama,
        "stats": _model_stats.snapshot(),
    }

    # -- storage ----------------------------------------------------------
    storage: dict = {}
    try:
        import sqlite3
        task_conn = sqlite3.connect(str(event_db_path), timeout=2)
        try:
            storage["task_db"] = _db_health(task_conn, "SELECT COUNT(*) FROM dev_tasks")
            storage["event_log"] = _db_health(task_conn, "SELECT COUNT(*) FROM events")
        finally:
            task_conn.close()
        mem_conn = sqlite3.connect(str(memory_db_path), timeout=2)
        try:
            storage["memory_db"] = _db_health(mem_conn, "SELECT COUNT(*) FROM memories")
        finally:
            mem_conn.close()
    except Exception as exc:  # noqa: BLE001
        storage["error"] = f"{type(exc).__name__}: {exc}"
    if audit is not None:
        storage["audit_ledger"] = {
            **_db_health(audit._conn, "SELECT COUNT(*) FROM audit_ledger"),  # noqa: SLF001
            "total_records": audit.count(),
        }

    health_issues = []
    if not ollama["ok"]:
        health_issues.append("ollama unreachable")
    for name, probe in storage.items():
        if isinstance(probe, dict) and probe.get("ok") is False:
            health_issues.append(f"{name}: {probe.get('error') or probe.get('check')}")
    if runtime["failed_tasks"]:
        health_issues.append(f"{runtime['failed_tasks']} failed task(s) on record")

    return {
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "health": "degraded" if health_issues else "ok",
        "issues": health_issues,
        "runtime": runtime,
        "models": models,
        "storage": storage,
    }
