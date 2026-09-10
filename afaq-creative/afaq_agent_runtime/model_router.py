"""Model routing for the runtime (local Ollama only, no cloud providers).

Two layers, both deterministic:

  1. Adaptive (preferred): the hardware profile + the model registry pick
     the best *measured* model for the task's purpose — fastest model above
     its quality floor for general work, highest-quality coder within a
     latency ceiling for coding. Requires a benchmarked registry for the
     current hardware profile; otherwise the layer abstains.
  2. Legacy fallback: purpose-based default (``AIC_MODEL_CODER`` /
     ``AIC_MODEL_GENERAL`` env pins, else built-in defaults). Used when no
     registry data exists for this hardware — behavior identical to v1.

Operator pins always win: setting ``AIC_MODEL_CODER``/``AIC_MODEL_GENERAL``
forces that model regardless of the registry.

Availability is probed from Ollama's ``/api/tags``. If the selected model is
not pulled locally the router fails clearly — it never fabricates a result
and never falls back to a cloud provider.
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from urllib import error, request

from afaq_intelligence_core.aic_config import AICConfig

from .hardware import load_or_detect, profile_key
from .model_registry import ModelRegistry

CODING_KEYWORDS = (
    "code", "coding", "program", "debug", "refactor", "script", "function",
    "bug", "implement", "python", "typescript", "javascript",
    "unit test", "failing test", "test failure",
    "بايثون",
    "برمجة", "كود", "تصحيح", "برنامج",
)


class ModelUnavailableError(RuntimeError):
    """Raised when no suitable local model is available for the task."""


def _default_available_models(base_url: str) -> set[str]:
    try:
        with request.urlopen(base_url.rstrip("/") + "/api/tags", timeout=5) as r:
            data = json.loads(r.read().decode("utf-8"))
        return {m.get("name", "") for m in data.get("models", [])}
    except (error.URLError, TimeoutError, OSError):
        return set()


class ModelRouter:
    def __init__(
        self,
        config: AICConfig | None = None,
        available_models: set[str] | None = None,
        var_dir: str | Path | None = None,
        registry: ModelRegistry | None = None,
        hardware: dict | None = None,
    ) -> None:
        self._config = config or AICConfig.load()
        self._models = (
            available_models
            if available_models is not None
            else _default_available_models(self._config.ollama_url)
        )
        # Adaptive layer state. Both load lazily on first use so constructing
        # a router stays side-effect free (tests, probes, offline starts).
        self._var_dir = Path(var_dir) if var_dir else None
        self._registry_override = registry
        self._hardware_override = hardware
        self._registry: ModelRegistry | None = None
        self._hardware: dict | None = None
        self._hardware_changed = False
        self._adaptive_failed = False

    @property
    def available_models(self) -> set[str]:
        return set(self._models)

    def refresh(self) -> set[str]:
        self._models = _default_available_models(self._config.ollama_url)
        self._registry = None  # reload from disk on next selection
        self._hardware = None
        return set(self._models)

    def classify(self, instruction: str) -> str:
        lowered = instruction.lower()
        return "coding" if any(k in lowered for k in CODING_KEYWORDS) else "general"

    def desired_model(self, purpose: str) -> str:
        if purpose == "coding":
            return os.getenv("AIC_MODEL_CODER", "qwen2.5-coder:7b")
        return os.getenv("AIC_MODEL_GENERAL", "qwen3:1.7b")

    # -- adaptive layer ---------------------------------------------------

    def _adaptive(self) -> tuple[ModelRegistry | None, dict | None]:
        """(registry, hardware) for this machine, or (None, None).

        Loads once, caches in-memory. Any failure (missing var_dir,
        unreadable files, detection error) disables the adaptive layer for
        this process and the legacy path keeps working.
        """
        if self._adaptive_failed:
            return None, None
        if self._registry_override is not None or self._hardware_override is not None:
            return self._registry_override, self._hardware_override
        if self._registry is not None and self._hardware is not None:
            return self._registry, self._hardware
        try:
            if self._var_dir is None:
                self._adaptive_failed = True
                return None, None
            registry = ModelRegistry(self._var_dir / "model_registry.json")
            hardware, changed = load_or_detect(self._var_dir)
            self._registry, self._hardware = registry, hardware
            self._hardware_changed = changed
        except Exception:  # noqa: BLE001 - adaptive layer must never break routing
            self._adaptive_failed = True
            return None, None
        return self._registry, self._hardware

    @property
    def hardware_profile(self) -> dict | None:
        _, hw = self._adaptive()
        return hw

    @property
    def registry(self) -> ModelRegistry | None:
        reg, _ = self._adaptive()
        return reg

    def _adaptive_select(self, purpose: str) -> tuple[str | None, str]:
        """Returns (model_name, reason). reason: adaptive | legacy."""
        # Operator pin always wins.
        if purpose == "coding" and os.getenv("AIC_MODEL_CODER"):
            return os.getenv("AIC_MODEL_CODER"), "legacy_env_pin"
        if purpose != "coding" and os.getenv("AIC_MODEL_GENERAL"):
            return os.getenv("AIC_MODEL_GENERAL"), "legacy_env_pin"
        registry, hw = self._adaptive()
        if registry is None or hw is None:
            return None, "legacy"
        pkey = profile_key(hw)
        picked = registry.choose(purpose, self._models, hw, pkey)
        if picked is None:
            return None, "legacy"
        return picked[0].name, "adaptive"

    def fallback_model(self, purpose: str, failed_model: str) -> str | None:
        """Fastest eligible local model other than the failed one, or None.

        Keeps a task alive when its selected (heavy) model times out or
        vanishes: heavy -> fast local fallback instead of a full stop.
        """
        registry, hw = self._adaptive()
        if registry is None or hw is None:
            return None
        picked = registry.fastest_fallback(
            purpose, self._models, hw, profile_key(hw), exclude=failed_model
        )
        return picked[0].name if picked else None

    def fastest_model(self, purpose: str) -> str | None:
        """Fastest quality-floor-passing local model for *purpose*.

        Drives fast-first escalation: the cheap model tries the proposal
        first, the strong model is invoked only when the gates demand it.
        """
        registry, hw = self._adaptive()
        if registry is None or hw is None:
            return None
        picked = registry.fastest(purpose, self._models, hw, profile_key(hw))
        return picked[0].name if picked else None

    def select(self, instruction: str) -> dict:
        """Pick the provider/model for a task; fail clearly if unavailable."""
        purpose = self.classify(instruction)
        model, reason = self._adaptive_select(purpose)
        if model is None:
            model = self.desired_model(purpose)
        if model not in self._models:
            raise ModelUnavailableError(
                f"no suitable local model for '{purpose}' tasks: "
                f"desired '{model}' not in available models {sorted(self._models)} "
                f"on {self._config.ollama_url}"
            )
        return {
            "purpose": purpose,
            "provider": purpose,  # provider slot name registered on AIRouter
            "model": model,
            "selection": reason,
        }
