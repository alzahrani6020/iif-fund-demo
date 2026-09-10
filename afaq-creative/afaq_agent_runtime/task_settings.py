"""Per-task model/settings validation for the Developer Agent.

Single source of truth for what a task may override. Both the runtime and
the gateway validate against these rules (defense in depth): anything not
explicitly supported is rejected with a clear message instead of a silent
fallback.

Supported settings are exactly what the provider layer implements today
(see afaq_intelligence_core.ai.provider.ARequest and the Ollama payload):
  - max_tokens: int, 256..8192  (maps to num_predict)
  - timeout:    seconds, 30..900 (per-operation ceiling)
  - keep_alive: "0" or "<n>s|m|h" (Ollama keep-alive)

NOT supported (rejected clearly): temperature — the runtime pins planning
to temperature 0 for determinism (RuntimeRouter.generate), so a manual
temperature would be silently discarded; num_ctx/context size and
reasoning/think mode have no provider field at all.
"""

from __future__ import annotations

from typing import Any, Mapping

SUPPORTED_SETTINGS: dict[str, dict[str, Any]] = {
    "max_tokens": {"type": int, "min": 256, "max": 8192},
    "timeout": {"type": (int, float), "min": 30, "max": 900},
    "keep_alive": {"type": str},
}
_KEEP_ALIVE_RE = r"^(0|[1-9][0-9]{0,3}[smh])$"

# Models the runtime can actually honor right now — exposed to the UI so it
# never offers an input the backend would throw away.
SUPPORTED_MODEL_SETTINGS = tuple(SUPPORTED_SETTINGS.keys())


def validate_task_settings(settings: Mapping[str, Any] | None) -> dict:
    """Normalize+validate a per-task settings override. {} when falsy."""
    if not settings:
        return {}
    if not isinstance(settings, Mapping):
        raise ValueError("settings must be a JSON object")
    normalized: dict[str, Any] = {}
    for key, value in settings.items():
        spec = SUPPORTED_SETTINGS.get(key)
        if spec is None:
            raise ValueError(
                f"unsupported setting: {key} — supported: "
                f"{', '.join(SUPPORTED_MODEL_SETTINGS)}"
            )
        if key == "keep_alive":
            import re
            if not isinstance(value, str) or not re.match(_KEEP_ALIVE_RE, value):
                raise ValueError(
                    "keep_alive must be '0' or a duration like '30s', '15m', '1h'"
                )
            normalized[key] = value
            continue
        if isinstance(value, bool) or not isinstance(value, spec["type"]):
            raise ValueError(f"{key} must be a number")
        value = float(value) if key == "timeout" else int(value)
        if not (spec["min"] <= value <= spec["max"]):
            raise ValueError(
                f"{key} out of range: {spec['min']}..{spec['max']} "
                f"(got {settings[key]!r})"
            )
        normalized[key] = value
    return normalized
