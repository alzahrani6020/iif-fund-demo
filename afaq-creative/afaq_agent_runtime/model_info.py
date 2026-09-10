"""Model information + manual-override validation for the Developer Agent.

Single source of truth for what the Control Center may show and what a
per-task manual model override must satisfy. Everything is derived from
the live ModelRouter (availability probe + ModelRegistry + hardware
profile) — the UI never invents model facts.

Status vocabulary (Arabic, UI-facing):
  متاح/غير متاح/غير مقاس/غير مناسب للعتاد/أقل من Quality Floor
"""

from __future__ import annotations

from .hardware import profile_key
from .model_registry import (
    BENCHMARK_VERSION,
    PURPOSE_ROLES,
    ModelRegistry,
    fits_hardware,
    passes_floors,
)
from .model_router import ModelRouter

STATUS_AVAILABLE = "متاح"
STATUS_UNAVAILABLE = "غير متاح"
STATUS_UNMEASURED = "غير مقاس"
STATUS_BAD_HARDWARE = "غير مناسب للعتاد"
STATUS_BELOW_FLOOR = "أقل من Quality Floor"


def _description(roles: list[str], params_b: float) -> str:
    """Short role-derived label. Deterministic, registry-based only."""
    if "coding" in roles:
        return "Coding قوي" if params_b >= 7 else "Coding خفيف"
    if "reasoning" in roles:
        return "استدلال"
    return "سريع" if params_b and params_b <= 4 else "عام"


def _entry_payload(entry, measurement, purpose_floors: dict[str, bool]) -> dict:
    q = (measurement or {}).get("quality")
    return {
        "roles": list(entry.roles),
        "params_b": entry.params_b,
        "quant": entry.quant,
        "ram_gb": entry.ram_gb,
        "vram_gb": entry.vram_gb,
        "measured": measurement is not None,
        "tok_s": (measurement or {}).get("tok_s"),
        "latency_s": (measurement or {}).get("latency_s"),
        "ttfb_s": (measurement or {}).get("ttfb_s"),
        "quality": q,
        "json_reliability": (q or {}).get("json"),
        "tool_selection": (q or {}).get("tool"),
        "coding_score": (q or {}).get("coding"),
        "arabic_score": (q or {}).get("arabic"),
        "hallucination": (q or {}).get("hallucination"),
        "first_attempt": (q or {}).get("first_attempt"),
        "timeout_count": (measurement or {}).get("timeout_count"),
        "measured_at": (measurement or {}).get("measured_at"),
        "benchmark_version": (measurement or {}).get("benchmark_version"),
        "floors": purpose_floors,
        "description": _description(entry.roles, entry.params_b),
    }


def build_models_overview(router: ModelRouter) -> dict:
    """Everything the Control Center needs to render the model section.

    Availability comes from the live Ollama probe; measurements are only
    ever read for the CURRENT hardware profile_key — another device's
    numbers never leak into the eligibility of this one.
    """
    available = router.available_models
    registry = router.registry
    hw = router.hardware_profile
    pkey = profile_key(hw) if hw else None
    eligible: dict[str, set[str]] = {"general": set(), "coding": set(),
                                     "reasoning": set()}
    models: list[dict] = []
    if registry is not None and hw is not None:
        for purpose in eligible:
            for entry, _m in registry.eligible(purpose, available, hw, pkey):
                eligible[purpose].add(entry.name)
    names = set(registry.entries.keys()) if registry is not None else set()
    names |= available
    for name in sorted(names):
        entry = registry.entries.get(name) if registry is not None else None
        is_available = name in available
        measurement = entry.measurement(pkey) if (entry and pkey) else None
        floors = {}
        if measurement:
            for purpose in ("general", "coding", "reasoning"):
                floors[purpose] = passes_floors(measurement, purpose)
        if not is_available:
            status = STATUS_UNAVAILABLE
        elif entry is None:
            status = STATUS_UNMEASURED
        elif not fits_hardware(entry, hw or {}):
            status = STATUS_BAD_HARDWARE
        elif measurement and not any(
            floors.get(p, True) for p in ("general", "coding")
        ):
            status = STATUS_BELOW_FLOOR
        elif measurement is None:
            status = STATUS_UNMEASURED
        else:
            status = STATUS_AVAILABLE
        if entry is not None:
            payload = _entry_payload(entry, measurement, floors)
        else:
            payload = {
                "roles": ["coding"] if "coder" in name.lower() else ["general"],
                "params_b": 0.0, "quant": None, "ram_gb": None, "vram_gb": None,
                "measured": False, "tok_s": None, "latency_s": None,
                "ttfb_s": None, "quality": None, "json_reliability": None,
                "tool_selection": None, "coding_score": None,
                "arabic_score": None, "hallucination": None,
                "first_attempt": None, "timeout_count": None,
                "measured_at": None, "benchmark_version": None,
                "floors": {}, "description": "غير مقاس",
            }
        models.append({
            "name": name,
            "available": is_available,
            "status": status,
            "eligibility": {p: name in s for p, s in eligible.items()},
            **payload,
        })
    return {
        "hardware": {
            "profile": (hw or {}).get("profile"),
            "profile_key": pkey,
            "ram_total_gb": (hw or {}).get("ram_total_gb"),
            "cpu_cores": (hw or {}).get("cpu_cores"),
            "gpus": (hw or {}).get("gpus"),
            "fingerprint": (hw or {}).get("fingerprint"),
        },
        "benchmark_version": BENCHMARK_VERSION if registry else None,
        "available": sorted(available),
        "eligible_general": sorted(eligible["general"]),
        "eligible_coding": sorted(eligible["coding"]),
        "eligible_reasoning": sorted(eligible["reasoning"]),
        "models": models,
    }


def validate_model_override(router: ModelRouter, model: str, purpose: str) -> None:
    """Raise ValueError (Arabic, UI-facing) unless *model* may serve *purpose*.

    Gate order mirrors the spec: pulled locally -> static hardware fit ->
    role qualification -> quality floors when a current-hardware
    measurement exists. An unknown (unbenchmarked) model is allowed but
    the UI marks it "غير مقاس".
    """
    if not isinstance(model, str) or not model.strip():
        raise ValueError("اسم النموذج غير صالح")
    model = model.strip()
    if model not in router.available_models:
        raise ValueError(f"النموذج غير متاح حاليًا: {model}")
    registry = router.registry
    hw = router.hardware_profile
    if registry is None or hw is None:
        return  # adaptive layer offline: availability check is all we can do
    entry = registry.entries.get(model)
    if entry is None:
        return  # unknown model: usable, surfaced as غير مقاس
    if not fits_hardware(entry, hw):
        raise ValueError(
            f"غير مناسب للعتاد الحالي: يتطلب {entry.ram_gb}GB RAM "
            f"والجهاز يملك {hw.get('ram_total_gb')}GB"
        )
    roles = PURPOSE_ROLES.get(purpose, PURPOSE_ROLES["general"])
    if not roles.intersection(entry.roles):
        raise ValueError(
            f"النموذج غير مؤهل لدور هذه المهمة ({purpose})؛ أدواره: {', '.join(entry.roles)}"
        )
    measurement = entry.measurement(profile_key(hw))
    if measurement is not None and not passes_floors(measurement, purpose):
        raise ValueError(
            f"النموذج أقل من Quality Floor المطلوب لمهام {purpose} على هذا الجهاز"
        )
