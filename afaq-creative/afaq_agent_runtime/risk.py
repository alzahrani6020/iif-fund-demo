"""Deterministic risk classification for developer-agent change proposals.

Risk depends only on: permission classes involved, environment, sensitive
path hits, and breadth (number of files). Never on an LLM judgement.
"""

from __future__ import annotations

from typing import Any, Mapping

from .permissions import evaluate_proposal, is_sensitive_path, normalize_environment

RISK_LEVELS = ("low", "medium", "high", "critical")


def classify_risk(proposal: Mapping[str, Any], environment: str) -> dict:
    """Return {"level": low|medium|high|critical, "reasons": [...]}.

    Rules (applied in order, highest wins):
      * any denied file                       -> critical (task cannot run)
      * production + any write                -> critical (denied anyway)
      * sensitive path hit                    -> high (dev/test), critical (staging)
      * >= 5 files touched                    -> high
      * any write/rename (approval-gated)     -> medium baseline
      * tests-only / no file changes          -> low
    """
    env = normalize_environment(environment)
    reasons: list[str] = []
    level = "low"

    def bump(new: str, reason: str) -> None:
        nonlocal level
        if RISK_LEVELS.index(new) > RISK_LEVELS.index(level):
            level = new
        reasons.append(reason)

    files = list(proposal.get("files", []))
    actions = [f.get("action", "edit") for f in files]
    sensitive_hits = [f["path"] for f in files if is_sensitive_path(str(f.get("path", "")))]

    evaluation = evaluate_proposal(proposal, env)
    if evaluation["deny_reasons"]:
        bump("critical", "proposal contains denied operations: " + "; ".join(evaluation["deny_reasons"]))

    if any(a in ("edit", "create", "rename") for a in actions):
        bump("medium", f"contains write operations ({sorted(set(actions))}) in {env}")

    if sensitive_hits:
        if env == "staging":
            bump("critical", f"sensitive paths in staging: {sensitive_hits}")
        else:
            bump("high", f"sensitive paths touched: {sensitive_hits}")

    if len(files) >= 5:
        bump("high", f"broad change: {len(files)} files")

    if not files:
        reasons.append("no file changes — analysis/test only")

    if level == "low":
        reasons.append("read/test-only scope")
    return {"level": level, "reasons": reasons, "environment": env}
