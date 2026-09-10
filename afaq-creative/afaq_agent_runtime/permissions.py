"""Permission model for the AIC runtime (governance hardening).

Deterministic classification of developer-agent operations into permission
classes, combined with per-environment policy. No LLM involvement — the same
inputs always produce the same decision.

Permission classes:
    read, analyze, test            -> allow (scoped to the project root)
    local_write, rename            -> approval required (denied in production)
    privileged_local               -> approval required (denied in production)
    git_commit                     -> approval required (not exposed in UI yet)
    git_push, deploy, database_write, credential_change, destructive
                                   -> deny by default, every environment

Sensitive paths (auth, middleware, credentials, env/secrets, migrations,
deployment configs, security policies) escalate risk and are denied in
production outright.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any, Mapping

# -- environments (explicit field on every task/approval/audit record) --------
ENVIRONMENTS = ("dev", "test", "staging", "production")

# -- permission classes --------------------------------------------------------
READ_CLASSES = ("read", "analyze", "test")
WRITE_CLASSES = ("local_write", "rename")
APPROVAL_CLASSES = WRITE_CLASSES + ("privileged_local", "git_commit")
DENY_CLASSES = ("git_push", "deploy", "database_write", "credential_change", "destructive")

ACTION_TO_CLASS = {
    "edit": "local_write",
    "create": "local_write",
    "rename": "rename",
    "delete": "destructive",
}

# Environment policy matrix: decision for each permission class.
#   allow    -> execute without approval
#   approval -> requires a persisted human approval
#   deny     -> never executes
_ENV_POLICY: dict[str, dict[str, str]] = {
    "dev": {
        "read": "allow", "analyze": "allow", "test": "allow",
        "local_write": "approval", "rename": "approval",
        "privileged_local": "approval", "git_commit": "approval",
        "git_push": "deny", "deploy": "deny", "database_write": "deny",
        "credential_change": "deny", "destructive": "deny",
    },
    "test": {
        "read": "allow", "analyze": "allow", "test": "allow",
        "local_write": "approval", "rename": "approval",
        "privileged_local": "approval", "git_commit": "approval",
        "git_push": "deny", "deploy": "deny", "database_write": "deny",
        "credential_change": "deny", "destructive": "deny",
    },
    "staging": {
        "read": "allow", "analyze": "allow", "test": "allow",
        "local_write": "approval", "rename": "approval",
        "privileged_local": "approval", "git_commit": "approval",
        "git_push": "deny", "deploy": "deny", "database_write": "deny",
        "credential_change": "deny", "destructive": "deny",
    },
    # production is read-only in this phase: any write is denied outright
    "production": {
        "read": "allow", "analyze": "allow", "test": "allow",
        "local_write": "deny", "rename": "deny", "privileged_local": "deny",
        "git_commit": "deny", "git_push": "deny", "deploy": "deny",
        "database_write": "deny", "credential_change": "deny", "destructive": "deny",
    },
}

# -- sensitive path segments (matched as path parts, case-insensitive) --------
SENSITIVE_SEGMENTS = (
    "auth", "middleware", "credential", "secret",
    ".env", "id_rsa", "pem", "keyfile",
    "migrations", "prisma/migrations",
    "deploy", "deployment", "vercel.json", "wrangler.toml", "docker-compose",
    "policy", "policies", "security",
    "admin", "admin-auth", "session",
)

PRODUCTION_DENY_MESSAGE = (
    "production environment is read-only in this phase; writes are not permitted"
)


def normalize_environment(environment: str | None) -> str:
    env = (environment or "dev").strip().lower()
    return env if env in ENVIRONMENTS else "dev"


def path_permission_class(action: str) -> str:
    # Explicit deny-class action names map to themselves; they must never
    # fall through to the privileged_local default (which would turn them
    # into "approval required" outside production).
    if action in DENY_CLASSES:
        return action
    return ACTION_TO_CLASS.get(action, "privileged_local")


def is_sensitive_path(relative_path: str) -> bool:
    parts = [p.lower() for p in Path(relative_path.replace("\\", "/")).parts]
    joined = "/".join(parts)
    for segment in SENSITIVE_SEGMENTS:
        seg = segment.lower()
        if seg in parts or seg in joined:
            return True
    # dotenv-style files anywhere
    for part in parts:
        if part.startswith(".env") or part.endswith(".pem") or part.endswith(".key"):
            return True
    return False


def decide_file_action(action: str, relative_path: str, environment: str) -> dict:
    """Deterministic decision for one proposed file action."""
    env = normalize_environment(environment)
    permission_class = path_permission_class(action)
    sensitive = is_sensitive_path(relative_path)

    if permission_class in DENY_CLASSES:
        return {
            "action": "deny",
            "permission_class": permission_class,
            "sensitive": sensitive,
            "reason": f"permission class '{permission_class}' is denied by default in every environment",
        }

    decision = _ENV_POLICY[env].get(permission_class, "deny")
    reason = f"{permission_class} in {env}: policy={decision}"
    if sensitive:
        if env == "production":
            return {
                "action": "deny",
                "permission_class": permission_class,
                "sensitive": True,
                "reason": f"sensitive path '{relative_path}' is denied in production",
            }
        reason += f"; sensitive path '{relative_path}' escalates risk"
    return {"action": decision, "permission_class": permission_class, "sensitive": sensitive, "reason": reason}


def evaluate_proposal(proposal: Mapping[str, Any], environment: str) -> dict:
    """Aggregate permission decision for a whole change proposal.

    Returns {"action": allow|approval_required|deny, "per_file": [...],
    "deny_reasons": [...]}. A single deny anywhere denies the proposal; any
    approval requirement escalates the whole task to the approval queue.
    """
    env = normalize_environment(environment)
    per_file: list[dict] = []
    deny_reasons: list[str] = []
    needs_approval = False

    for spec in proposal.get("files", []):
        action = spec.get("action", "edit")
        path = str(spec.get("path", ""))
        decision = decide_file_action(action, path, env)
        per_file.append({"path": path, "action": action, **decision})
        if decision["action"] == "deny":
            deny_reasons.append(decision["reason"])
        elif decision["action"] == "approval":
            needs_approval = True

    for test in proposal.get("tests", []):
        # Mirror the file-entry contract: "action" carries the decision.
        per_file.append({
            "path": "(test)",
            "action": "allow",
            "action_decision": "allow",
            "permission_class": "test",
            "sensitive": False,
            "reason": f"test in {env}: policy=allow",
        })

    if deny_reasons:
        overall = "deny"
    elif needs_approval:
        overall = "approval_required"
    else:
        overall = "allow"
    return {"action": overall, "environment": env, "per_file": per_file, "deny_reasons": deny_reasons}
