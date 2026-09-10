from __future__ import annotations

import os


def _flag(name: str, default: bool = False) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


def orchestrator_enabled() -> bool:
    return _flag("AFAQ_ORCHESTRATOR_ENABLED", False)


def shadow_mode() -> bool:
    return _flag("AFAQ_ORCHESTRATOR_SHADOW", False)
