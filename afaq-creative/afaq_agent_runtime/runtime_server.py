"""HTTP surface for the persistent AIC Agent Runtime (stdlib only).

Binds to 127.0.0.1 only. When ``AIC_RUNTIME_TOKEN`` is set, every request
must send ``Authorization: Bearer <token>``. v1 exposes task submission and
read endpoints plus resume — nothing that writes memory or tools directly.

Endpoints:
    GET  /health                 -> liveness + version
    POST /tasks                  -> {"instruction": ...} -> 202 {"task_id": ...}
    GET  /tasks                  -> list
    GET  /tasks/{id}             -> one task
    GET  /tasks/{id}/events      -> append-only event log
    POST /tasks/{id}/resume      -> resume interrupted/awaiting task
    GET  /monitoring             -> runtime/model/storage monitoring snapshot
    GET  /developer/approvals[?status=]      -> persistent approval queue
    GET  /developer/approvals/{id}           -> one approval record
    POST /developer/approvals/{id}/approve   -> {"reason": ...} decide (actor from header)
    POST /developer/approvals/{id}/reject    -> {"reason": ...} decide (actor from header)
    GET  /developer/audit[?task_id=&limit=]  -> append-only audit ledger reads
    GET  /incidents[?status=&classification=] -> self-healing incident list
    GET  /incidents/{id}                      -> incident detail (state reconciled)
    POST /incidents/scan                      -> run detection, returns new incidents
    POST /incidents/{id}/diagnose             -> root-cause analysis (persisted)
    POST /incidents/{id}/propose              -> governance-gated repair proposal
    GET  /workspace/tree?path=                -> lazy folder listing (Code Workspace)
    GET  /workspace/files                     -> flat file list (Quick Open, bounded)
    GET  /workspace/file?path=                -> file content (boundary-checked)
    POST /workspace/file                      -> disabled (403; use governed developer approval flow)
    POST /workspace/fs                        -> disabled (403; direct mutations fail-closed)
    GET  /workspace/search?q=&regex=          -> project text search
    GET  /workspace/detect                    -> runtime/tool discovery (fixed probes)
    GET  /workspace/git?what=status|diff|log  -> read-only git (allowlisted)
    POST /workspace/run {command}             -> allowlist-validated command only
"""

from __future__ import annotations

import json
import os
import sqlite3
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

from .agent_runtime import RUNTIME_VERSION, AgentRuntime
from .command_allowlist import CommandNotAllowed
from .developer_agent import DeveloperAgent
from .model_info import build_models_overview
from .monitoring import collect_monitoring
from .permissions import normalize_environment
from .self_healing import SelfHealingEngine
from .workspace import WorkspaceBlocked, WorkspaceService

_MAX_ACTOR_LEN = 128
_MAX_BODY_BYTES = 1024 * 1024  # 1 MiB cap on request bodies


class _BodyError(ValueError):
    """Malformed or unacceptable request body (content-type/length/size)."""


def _load_runtime_env_file() -> None:
    """Load AIC_HOME/.env.runtime (simple KEY=VALUE lines) if present.

    Only variables that are not already set in the process environment are
    applied, so an explicit export always wins. The file is the durable home
    of AIC_RUNTIME_TOKEN for the runtime process; it is gitignored and must
    never be logged or sent to the browser.
    """
    from .agent_runtime import AIC_HOME
    env_file = AIC_HOME / ".env.runtime"
    try:
        lines = env_file.read_text(encoding="utf-8").splitlines()
    except OSError:
        return
    for line in lines:
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def _build_developer_agent(runtime: AgentRuntime) -> DeveloperAgent | None:
    """Enabled only when AIC_DEV_PROJECT_ROOT is set. AIC_DEV_ALLOWED_ROOTS
    (semicolon-separated) permits POSTed project_root overrides inside those
    directories; anything else is refused."""
    root = os.getenv("AIC_DEV_PROJECT_ROOT")
    if not root:
        return None
    return DeveloperAgent(var_dir=runtime.var_dir, project_root=root)


def _allowed_roots() -> list[str]:
    raw = os.getenv("AIC_DEV_ALLOWED_ROOTS", "")
    return [p for p in raw.split(";") if p.strip()]


def _make_workspace(dev: DeveloperAgent, root: str) -> WorkspaceService:
    """Workspace file/command surface bound to one project root.

    Writes and commands are recorded in the same append-only audit ledger the
    Developer Agent uses, attributed to the gateway actor (the admin session).
    """

    def audit(action: str, actor: str, detail: dict) -> None:
        dev.audit.record(
            action,
            task_id=None,
            actor=actor,
            agent_id="aic-workspace",
            environment=normalize_environment(dev.config.environment),
            detail={**detail, "root": root},
        )

    return WorkspaceService(root, audit=audit)


def _build_workspace(dev: DeveloperAgent) -> WorkspaceService:
    return _make_workspace(dev, str(dev.project_root))


class _Handler(BaseHTTPRequestHandler):
    runtime: AgentRuntime = None  # injected by serve()
    dev: DeveloperAgent | None = None  # injected by serve() when enabled
    healing: SelfHealingEngine | None = None  # injected by serve() when dev enabled
    workspace: WorkspaceService | None = None  # injected by serve() when dev enabled
    token: str | None = None

    server_version = f"AICRuntime/{RUNTIME_VERSION}"

    # -- plumbing ---------------------------------------------------------
    def log_message(self, format: str, *args) -> None:  # noqa: A002 - keep quiet
        pass

    def handle_one_request(self) -> None:
        # SQLite write contention (busy/locked) must produce a clean 503, not
        # kill the connection silently mid-request.
        try:
            super().handle_one_request()
        except sqlite3.OperationalError as exc:
            try:
                self._send_json(503, {"success": False, "message": f"storage busy: {exc}"})
            except (BrokenPipeError, ConnectionResetError, OSError):
                pass
        except (BrokenPipeError, ConnectionResetError):
            pass

    def _send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _authorized(self) -> bool:
        if not self.token:
            return True
        header = self.headers.get("Authorization", "")
        return header == f"Bearer {self.token}"

    def _read_body(self) -> dict:
        # JSON only: accepting arbitrary content types would let a browser
        # page POST simple-text bodies cross-origin (no-cors) to localhost.
        content_type = (self.headers.get("Content-Type") or "").split(";")[0].strip().lower()
        if content_type != "application/json":
            raise _BodyError("content-type must be application/json")
        raw_length = self.headers.get("Content-Length") or "0"
        if not raw_length.isdigit():
            raise _BodyError("invalid Content-Length")
        length = int(raw_length)
        if length == 0:
            return {}
        if length > _MAX_BODY_BYTES:
            raise _BodyError(f"request body too large (> {_MAX_BODY_BYTES} bytes)")
        raw = self.rfile.read(length).decode("utf-8")
        return json.loads(raw)

    def _actor(self) -> str:
        """Actor identity forwarded by the secure gateway (X-AIC-Actor).

        The runtime binds to localhost and trusts this header only from the
        gateway; the gateway itself derives the value server-side from the
        admin session and never accepts an actor from the browser body.
        """
        raw = (self.headers.get("X-AIC-Actor") or "").strip()
        return raw[:_MAX_ACTOR_LEN] if raw else "unknown"

    # -- routes -----------------------------------------------------------
    def do_GET(self) -> None:  # noqa: N802 - stdlib naming
        if not self._authorized():
            self._send_json(401, {"success": False, "message": "unauthorized"})
            return
        path = urlparse(self.path).path.rstrip("/")
        if path == "/health":
            self._send_json(200, {
                "success": True,
                "version": RUNTIME_VERSION,
                "tasks": len(self.runtime.list_tasks()),
            })
            return
        if path == "/monitoring":
            self._send_json(200, {"success": True, "monitoring": self._monitoring()})
            return
        if path == "/tasks":
            self._send_json(200, {"success": True, "tasks": self.runtime.list_tasks()})
            return
        if path == "/incidents":
            if self.healing is None:
                self._send_json(404, {"success": False, "message": "self-healing not enabled"})
                return
            query = parse_qs(urlparse(self.path).query)
            status = (query.get("status") or [None])[0]
            classification = (query.get("classification") or [None])[0]
            if status is not None and status not in (
                "open", "diagnosing", "repair_pending_approval", "repairing",
                "repair_failed", "needs_human", "resolved", "no_action",
            ):
                self._send_json(400, {"success": False, "message": "invalid status"})
                return
            incidents = self.healing.store.list(status=status, classification=classification)
            self._send_json(200, {"success": True, "incidents": incidents})
            return
        if path.startswith("/incidents/"):
            if self.healing is None:
                self._send_json(404, {"success": False, "message": "self-healing not enabled"})
                return
            incident_id = path.split("/")[2]
            try:
                incident = self.healing.reconcile(incident_id)
            except KeyError:
                self._send_json(404, {"success": False, "message": "not found"})
                return
            self._send_json(200, {"success": True, "incident": incident})
            return
        if path == "/developer/approvals":
            if self.dev is None:
                self._send_json(404, {"success": False, "message": "developer agent not enabled"})
                return
            query = parse_qs(urlparse(self.path).query)
            status = (query.get("status") or [None])[0]
            if status is not None and status not in (
                "pending", "approved", "rejected", "expired", "cancelled",
            ):
                self._send_json(400, {"success": False, "message": "invalid status"})
                return
            self._send_json(200, {"success": True, "approvals": self.dev.approvals.list(status=status)})
            return
        if path.startswith("/developer/approvals/"):
            if self.dev is None:
                self._send_json(404, {"success": False, "message": "developer agent not enabled"})
                return
            approval_id = path.split("/")[3]
            record = self.dev.approvals.get(approval_id)
            if record is None:
                self._send_json(404, {"success": False, "message": "not found"})
                return
            self._send_json(200, {"success": True, "approval": record})
            return
        if path == "/developer/audit":
            if self.dev is None:
                self._send_json(404, {"success": False, "message": "developer agent not enabled"})
                return
            query = parse_qs(urlparse(self.path).query)
            task_id = (query.get("task_id") or [None])[0]
            try:
                limit = int((query.get("limit") or ["200"])[0])
            except ValueError:
                limit = 200
            limit = max(1, min(limit, 1000))
            self._send_json(200, {
                "success": True,
                "audit": self.dev.audit.list(task_id=task_id, limit=limit),
                "total": self.dev.audit.count(),
            })
            return
        if path == "/developer/tasks":
            if self.dev is None:
                self._send_json(404, {"success": False, "message": "developer agent not enabled"})
                return
            self._send_json(200, {"success": True, "tasks": self.dev.list_tasks()})
            return
        if path == "/developer/models":
            if self.dev is None:
                self._send_json(404, {"success": False, "message": "developer agent not enabled"})
                return
            self._send_json(200, {
                "success": True,
                "models": build_models_overview(self.dev.model_router),
            })
            return
        # ---- Workspace (Code Workspace UI): reads ----
        if path == "/workspace/tree":
            query = parse_qs(urlparse(self.path).query)
            ws = self._workspace_for({"root": (query.get("root") or [""])[0]})
            if ws is None:
                return
            rel = (query.get("path") or [""])[0]
            try:
                self._send_json(200, {"success": True, "tree": ws.tree(rel)})
            except (WorkspaceBlocked, NotADirectoryError) as exc:
                self._send_json(400, {"success": False, "message": str(exc)})
            return
        if path == "/workspace/files":
            query = parse_qs(urlparse(self.path).query)
            ws = self._workspace_for({"root": (query.get("root") or [""])[0]})
            if ws is None:
                return
            self._send_json(200, {"success": True, **ws.files()})
            return
        if path == "/workspace/file":
            query = parse_qs(urlparse(self.path).query)
            ws = self._workspace_for({"root": (query.get("root") or [""])[0]})
            if ws is None:
                return
            rel = (query.get("path") or [""])[0]
            try:
                self._send_json(200, {"success": True, "file": ws.read(rel)})
            except (WorkspaceBlocked, FileNotFoundError, ValueError) as exc:
                code = 404 if isinstance(exc, FileNotFoundError) else 400
                self._send_json(code, {"success": False, "message": str(exc)})
            return
        if path == "/workspace/search":
            query = parse_qs(urlparse(self.path).query)
            ws = self._workspace_for({"root": (query.get("root") or [""])[0]})
            if ws is None:
                return
            q = (query.get("q") or [""])[0]
            regex = (query.get("regex") or [""])[0] in ("1", "true")
            try:
                self._send_json(200, {"success": True, **ws.search(q, regex=regex)})
            except WorkspaceBlocked as exc:
                self._send_json(400, {"success": False, "message": str(exc)})
            return
        if path == "/workspace/detect":
            query = parse_qs(urlparse(self.path).query)
            ws = self._workspace_for({"root": (query.get("root") or [""])[0]})
            if ws is None:
                return
            self._send_json(200, {"success": True, **ws.detect()})
            return
        if path == "/workspace/git":
            query = parse_qs(urlparse(self.path).query)
            ws = self._workspace_for({"root": (query.get("root") or [""])[0]})
            if ws is None:
                return
            what = (query.get("what") or ["status"])[0]
            try:
                self._send_json(200, {"success": True, "git": ws.git(what, actor=self._actor())})
            except WorkspaceBlocked as exc:
                self._send_json(400, {"success": False, "message": str(exc)})
            return
        if path.startswith("/developer/tasks/"):
            if self.dev is None:
                self._send_json(404, {"success": False, "message": "developer agent not enabled"})
                return
            parts = path.split("/")
            task_id = parts[3]
            if len(parts) == 5 and parts[4] == "events":
                events = self.dev.task_events(task_id)
                if not events and self.dev.get_task(task_id) is None:
                    self._send_json(404, {"success": False, "message": "not found"})
                    return
                self._send_json(200, {"success": True, "events": events})
                return
            task = self.dev.get_task(task_id)
            if task is None:
                self._send_json(404, {"success": False, "message": "not found"})
                return
            self._send_json(200, {"success": True, "task": task})
            return
        if path.startswith("/tasks/"):
            parts = path.split("/")
            task_id = parts[2]
            if len(parts) == 4 and parts[3] == "events":
                events = self.runtime.task_events(task_id)
                if not events and self.runtime.get_task(task_id) is None:
                    self._send_json(404, {"success": False, "message": "not found"})
                    return
                self._send_json(200, {"success": True, "events": events})
                return
            task = self.runtime.get_task(task_id)
            if task is None:
                self._send_json(404, {"success": False, "message": "not found"})
                return
            self._send_json(200, {"success": True, "task": task})
            return
        self._send_json(404, {"success": False, "message": "not found"})

    # -- workspace helpers ------------------------------------------------
    def _workspace(self) -> WorkspaceService | None:
        if self.workspace is None:
            self._send_json(404, {
                "success": False,
                "message": "workspace not enabled (developer agent project_root required)",
            })
            return None
        return self.workspace

    def _workspace_for(self, params: dict) -> WorkspaceService | None:
        """Resolve the workspace for a request.

        The configured AIC_DEV_PROJECT_ROOT is the default. An explicit
        ``root`` is accepted only when it sits inside AIC_DEV_ALLOWED_ROOTS
        (same rule as the developer agent's per-request project_root), so E2E
        fixtures and secondary projects never pollute the real user workspace.
        """
        ws = self._workspace()
        if ws is None:
            return None
        requested = str(params.get("root") or "").strip()
        if not requested:
            return ws
        import os.path as _osp
        default_root = str(self.dev.project_root)
        if _osp.normcase(_osp.abspath(requested)) == _osp.normcase(_osp.abspath(default_root)):
            return ws
        requested_abs = _osp.normcase(_osp.abspath(requested))
        for allowed in _allowed_roots():
            allowed_abs = _osp.normcase(_osp.abspath(allowed))
            if requested_abs.startswith(allowed_abs + _osp.sep) or requested_abs == allowed_abs:
                try:
                    return _make_workspace(self.dev, requested)
                except ValueError:
                    break
        self._send_json(403, {
            "success": False,
            "message": "root not permitted (outside AIC_DEV_ALLOWED_ROOTS)",
        })
        return None

    def do_POST(self) -> None:  # noqa: N802 - stdlib naming
        if not self._authorized():
            self._send_json(401, {"success": False, "message": "unauthorized"})
            return
        path = urlparse(self.path).path.rstrip("/")
        try:
            body = self._read_body()
        except json.JSONDecodeError:
            self._send_json(400, {"success": False, "message": "invalid JSON body"})
            return
        except _BodyError as exc:
            self._send_json(400, {"success": False, "message": str(exc)})
            return

        if path == "/tasks":
            instruction = (body.get("instruction") or "").strip()
            if not instruction:
                self._send_json(400, {"success": False, "message": "instruction is required"})
                return
            task_id = self.runtime.submit(
                instruction,
                tenant_id=body.get("tenant_id") or "afaq",
                project_id=body.get("project_id") or "afaq-creative",
            )
            self._send_json(202, {"success": True, "task_id": task_id})
            return

        if path.startswith("/tasks/") and path.endswith("/resume"):
            task_id = path.split("/")[2]
            try:
                task = self.runtime.resume(task_id)
            except KeyError:
                self._send_json(404, {"success": False, "message": "not found"})
                return
            except RuntimeError as exc:
                self._send_json(409, {"success": False, "message": str(exc)})
                return
            self._send_json(200, {"success": True, "task": task})
            return

        if path == "/developer/tasks":
            agent = self._developer_agent_for(body)
            if agent is None:
                self._send_json(403, {"success": False, "message": "project_root not permitted (set AIC_DEV_PROJECT_ROOT / AIC_DEV_ALLOWED_ROOTS)"})
                return
            instruction = (body.get("instruction") or "").strip()
            if not instruction:
                self._send_json(400, {"success": False, "message": "instruction is required"})
                return
            model = body.get("model")
            if model is not None and not isinstance(model, str):
                self._send_json(400, {"success": False, "message": "model must be a string"})
                return
            settings = body.get("settings")
            if settings is not None and not isinstance(settings, dict):
                self._send_json(400, {"success": False, "message": "settings must be a JSON object"})
                return
            try:
                task_id = agent.submit(
                    instruction, proposal=body.get("proposal"), actor=self._actor(),
                    model=model, settings=settings,
                )
            except ValueError as exc:
                self._send_json(400, {"success": False, "message": str(exc)})
                return
            self._send_json(202, {"success": True, "task_id": task_id})
            return

        if path == "/incidents/scan":
            if self.healing is None:
                self._send_json(404, {"success": False, "message": "self-healing not enabled"})
                return
            created = self.healing.scan(actor=self._actor())
            self._send_json(200, {"success": True, "created": created})
            return
        if path.startswith("/incidents/") and path.endswith("/diagnose"):
            if self.healing is None:
                self._send_json(404, {"success": False, "message": "self-healing not enabled"})
                return
            incident_id = path.split("/")[2]
            try:
                incident = self.healing.diagnose(incident_id, actor=self._actor())
            except KeyError:
                self._send_json(404, {"success": False, "message": "not found"})
                return
            self._send_json(200, {"success": True, "incident": incident})
            return
        if path.startswith("/incidents/") and path.endswith("/propose"):
            if self.healing is None:
                self._send_json(404, {"success": False, "message": "self-healing not enabled"})
                return
            incident_id = path.split("/")[2]
            proposal = body.get("proposal")
            if proposal is not None and not isinstance(proposal, dict):
                self._send_json(400, {"success": False, "message": "proposal must be a JSON object"})
                return
            try:
                incident = self.healing.propose_repair(
                    incident_id, actor=self._actor(), proposal=proposal,
                )
            except KeyError:
                self._send_json(404, {"success": False, "message": "not found"})
                return
            except (RuntimeError, ValueError) as exc:
                self._send_json(409, {"success": False, "message": str(exc)})
                return
            self._send_json(200, {"success": True, "incident": incident})
            return

        if path.startswith("/developer/approvals/") and path.endswith(("/approve", "/reject")):
            if self.dev is None:
                self._send_json(404, {"success": False, "message": "developer agent not enabled"})
                return
            parts = path.split("/")
            if len(parts) != 5 or not parts[3]:
                self._send_json(404, {"success": False, "message": "not found"})
                return
            approval_id = parts[3]
            decision = parts[4]
            reason = str(body.get("reason") or "")[:500]
            try:
                task = self.dev.decide_approval(
                    approval_id, decision=decision, actor=self._actor(), reason=reason,
                )
            except KeyError:
                self._send_json(404, {"success": False, "message": "not found"})
                return
            except (RuntimeError, ValueError) as exc:
                self._send_json(409, {"success": False, "message": str(exc)})
                return
            self._send_json(200, {"success": True, "task": task})
            return

        if path.startswith("/developer/tasks/"):
            if self.dev is None:
                self._send_json(404, {"success": False, "message": "developer agent not enabled"})
                return
            parts = path.split("/")
            task_id = parts[3]
            action = parts[4] if len(parts) == 5 else ""
            actor = self._actor()
            reason = str(body.get("reason") or "")[:500]
            try:
                if action == "approve":
                    task = self.dev.approve(task_id, actor=actor, reason=reason)
                elif action == "reject":
                    task = self.dev.reject(task_id, actor=actor, reason=reason)
                elif action == "resume":
                    task = self.dev.resume(task_id, actor=actor)
                else:
                    self._send_json(404, {"success": False, "message": "not found"})
                    return
            except KeyError:
                self._send_json(404, {"success": False, "message": "not found"})
                return
            except RuntimeError as exc:
                self._send_json(409, {"success": False, "message": str(exc)})
                return
            self._send_json(200, {"success": True, "task": task})
            return

        # ---- Workspace (Code Workspace UI): writes / commands ----
        # Direct filesystem mutations are intentionally fail-closed.
        # Writes must go through the governed DeveloperAgent approval flow.
        if path == "/workspace/file":
            self._send_json(403, {
                "success": False,
                "message": (
                    "direct workspace mutations are disabled; "
                    "use the governed developer approval flow"
                ),
            })
            return
        if path == "/workspace/fs":
            self._send_json(403, {
                "success": False,
                "message": (
                    "direct workspace mutations are disabled; "
                    "use the governed developer approval flow"
                ),
            })
            return
        if path == "/workspace/run":
            ws = self._workspace_for(body)
            if ws is None:
                return
            command = body.get("command")
            if not isinstance(command, str):
                self._send_json(400, {"success": False, "message": "command is required"})
                return
            try:
                timeout = int(body.get("timeout") or 180)
            except (TypeError, ValueError):
                timeout = 180
            try:
                result = ws.run(command, actor=self._actor(), timeout=timeout)
            except WorkspaceBlocked as exc:
                self._send_json(403, {"success": False, "message": str(exc)})
                return
            except CommandNotAllowed as exc:
                self._send_json(403, {"success": False, "message": f"أمر محظور بالسياسة: {exc}"})
                return
            self._send_json(200, {"success": True, "run": result})
            return

        self._send_json(404, {"success": False, "message": "not found"})

    def _monitoring(self) -> dict:
        dev = self.dev
        if dev is None:
            return {"health": "unavailable", "reason": "developer agent not enabled"}
        return collect_monitoring(
            dev_store=dev.store,
            approvals_store=dev.approvals,
            audit=dev.audit,
            memory_db_path=dev.var_dir / "aic_memory.db",
            event_db_path=dev.var_dir / "aic_runtime.db",
            ollama_url=dev.config.ollama_url,
            config_environment=normalize_environment(dev.config.environment),
        )

    def _developer_agent_for(self, body: dict) -> DeveloperAgent | None:
        """Resolve the developer agent for a submit request.

        The configured AIC_DEV_PROJECT_ROOT is the default. A body project_root
        is accepted only when it sits inside AIC_DEV_ALLOWED_ROOTS.
        """
        if self.dev is None:
            return None
        requested = (body.get("project_root") or "").strip()
        if not requested:
            return self.dev
        configured = str(self.dev.project_root)
        import os.path as _osp
        if _osp.normcase(_osp.abspath(requested)) == _osp.normcase(_osp.abspath(configured)):
            return self.dev
        for allowed in _allowed_roots():
            allowed_abs = _osp.normcase(_osp.abspath(allowed))
            requested_abs = _osp.normcase(_osp.abspath(requested))
            if requested_abs.startswith(allowed_abs + _osp.sep) or requested_abs == allowed_abs:
                try:
                    return DeveloperAgent(
                        var_dir=self.dev.var_dir, project_root=requested,
                        model_router=self.dev.model_router, router=self.dev.router,
                    )
                except ValueError:
                    return None
        return None


def _port_in_use(host: str, port: int) -> bool:
    import socket
    probe = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    probe.settimeout(0.5)
    try:
        return probe.connect_ex((host, port)) == 0
    finally:
        probe.close()


def ensure_single_runtime(host: str, port: int) -> None:
    """Refuse to start a duplicate runtime on an already-listening port.

    Proven incident (readiness audit): an orphaned pre-fix process kept
    listening next to the new one and requests were silently load-balanced
    between two different code versions. Failing clearly at startup is the
    cheap fix; a service manager is explicitly out of scope.
    """
    if port and _port_in_use(host, port):
        raise SystemExit(
            f"[aic-runtime] {host}:{port} is already accepting connections — "
            "another AIC runtime is listening there. Refusing to start a "
            "duplicate. Stop the existing process first (or set "
            "AIC_RUNTIME_PORT to a different port)."
        )


def serve(
    host: str = "127.0.0.1",
    port: int | None = None,
    runtime: AgentRuntime | None = None,
) -> ThreadingHTTPServer:
    if port is None:
        port = int(os.getenv("AIC_RUNTIME_PORT", "8787"))
    runtime = runtime or AgentRuntime()
    token = os.getenv("AIC_RUNTIME_TOKEN") or None
    dev = _build_developer_agent(runtime)
    healing = SelfHealingEngine(dev) if dev is not None else None
    workspace = _build_workspace(dev) if dev is not None else None

    handler = type("BoundHandler", (_Handler,), {
        "runtime": runtime, "dev": dev, "healing": healing, "token": token,
        "workspace": workspace,
    })
    server = ThreadingHTTPServer((host, port), handler)
    from . import monitoring as _monitoring
    _monitoring.mark_server_started()
    if healing is not None:
        # ensure the incident store connection is released on shutdown so the
        # var dir can be removed (tests, temp runs); idempotent close.
        _orig_shutdown = server.shutdown

        def _shutdown_and_close() -> None:
            try:
                healing.close()
            finally:
                _orig_shutdown()

        server.shutdown = _shutdown_and_close  # type: ignore[method-assign]

    recovered = runtime.recover()
    if recovered:
        print(f"[aic-runtime] recovered interrupted tasks: {recovered}")
    if dev is not None:
        recovered_dev = dev.recover()
        if recovered_dev:
            print(f"[aic-dev] recovered interrupted dev tasks: {recovered_dev}")
        print(f"[aic-dev] developer agent enabled on {dev.project_root}")
    if healing is not None:
        try:
            detected = healing.scan()
            if detected:
                print(f"[aic-self-heal] startup scan raised {len(detected)} incident(s): "
                      f"{[i['incident_id'] for i in detected]}")
            else:
                print("[aic-self-heal] startup scan: no new incidents")
        except Exception as exc:  # noqa: BLE001 - scan must never block startup
            print(f"[aic-self-heal] startup scan failed: {type(exc).__name__}: {exc}")

    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    print(f"[aic-runtime] v{RUNTIME_VERSION} listening on http://{host}:{port}"
          f"{' (token required)' if token else ' (no token set — localhost only)'}")
    return server


def main() -> int:
    _load_runtime_env_file()
    ensure_single_runtime(
        "127.0.0.1", int(os.getenv("AIC_RUNTIME_PORT", "8787"))
    )
    runtime = AgentRuntime()
    server = serve(runtime=runtime)
    try:
        threading.Event().wait()
    except KeyboardInterrupt:
        pass
    finally:
        server.shutdown()
        runtime.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
