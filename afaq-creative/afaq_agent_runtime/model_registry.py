"""Model registry for the hardware-adaptive runtime.

Every locally usable model gets one entry holding static facts (roles,
parameter size, quantization, RAM/VRAM requirements) plus *measured*
performance keyed by ``profile_key`` (see ``hardware.py``). Measurements
from another device are never consulted for eligibility — benchmark
portability is enforced by the key, not by convention.

The router picks models from here instead of hardcoded names:

  * simple/general routing -> fastest model that passes its role's quality
    floor;
  * coding                  -> highest coding quality within a latency
    ceiling;
  * complex reasoning       -> strongest model whose requirements fit the
    hardware.

Quality floors are deterministic gates: a fast model that cannot produce
reliable JSON or hallucinates past its ceiling is excluded no matter how
quick it is.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path

BENCHMARK_VERSION = "1"

REGISTRY_FILE = "model_registry.json"

# Deterministic quality floors per purpose. A measurement that fails any
# floor makes the model ineligible for that purpose on this hardware,
# regardless of speed. Hallucination is a ceiling (lower is better).
ROLE_FLOORS: dict[str, dict[str, float]] = {
    "general": {"json": 0.50, "tool": 0.0, "hallucination": 0.25, "first_attempt": 0.0},
    "coding": {"json": 0.40, "tool": 0.0, "hallucination": 0.25, "first_attempt": 0.0},
    "reasoning": {"json": 0.50, "tool": 0.0, "hallucination": 0.20, "first_attempt": 0.0},
}

# Latency ceilings (seconds per benchmark task) for quality-first policies.
LATENCY_CEILING_S: dict[str, float] = {
    "general": 60.0,
    "coding": 180.0,
    "reasoning": 240.0,
}

# Which registry roles can serve a routing purpose.
PURPOSE_ROLES: dict[str, frozenset[str]] = {
    "general": frozenset({"general", "arabic", "diagnosis"}),
    "coding": frozenset({"coding"}),
    "reasoning": frozenset({"reasoning", "coding", "general"}),
}

# Static knowledge for models AIC is commonly deployed with. Unknown models
# get a best-effort parse from their Ollama tag instead. Sizes are Q4_K_M
# load-time estimates (weights + KV overhead) for eligibility gating only.
_KNOWN: dict[str, dict] = {
    "qwen3:1.7b": {"roles": ["general", "arabic", "diagnosis"], "params_b": 1.7, "ram_gb": 2.5},
    "qwen3:4b": {"roles": ["general", "arabic"], "params_b": 4.0, "ram_gb": 5.0},
    "qwen3:8b": {"roles": ["general", "reasoning", "arabic"], "params_b": 8.0, "ram_gb": 9.5},
    "qwen2.5-coder:1.5b": {"roles": ["coding"], "params_b": 1.5, "ram_gb": 2.5},
    "qwen2.5-coder:7b": {"roles": ["coding", "reasoning"], "params_b": 7.0, "ram_gb": 9.0},
    "qwen2.5-coder:14b": {"roles": ["coding", "reasoning"], "params_b": 14.0, "ram_gb": 17.0},
    "qwen2.5-coder:32b": {"roles": ["coding", "reasoning"], "params_b": 32.0, "ram_gb": 38.0},
}

_PARAMS_RE = re.compile(r"(\d+(?:\.\d+)?)b", re.IGNORECASE)


@dataclass
class ModelEntry:
    name: str
    roles: list[str] = field(default_factory=list)
    params_b: float = 0.0
    quant: str = "Q4_K_M"
    ram_gb: float = 0.0     # RAM requirement; 0 = unknown, treat as fittable
    vram_gb: float = 0.0    # VRAM requirement; 0 = CPU-capable
    benchmarks: dict = field(default_factory=dict)  # profile_key -> measurement

    def measurement(self, pkey: str) -> dict | None:
        """Benchmark valid for this hardware profile, or None.

        A measurement only counts when it was taken on the same hardware
        (profile_key) AND with the current benchmark version — old devices
        and outdated harness runs never silently drive routing.
        """
        m = self.benchmarks.get(pkey)
        if not m or m.get("benchmark_version") != BENCHMARK_VERSION:
            return None
        return m


def _parse_from_name(name: str) -> dict:
    roles = ["coding"] if "coder" in name.lower() else ["general"]
    params = 0.0
    m = _PARAMS_RE.search(name)
    if m:
        try:
            params = float(m.group(1))
        except ValueError:
            params = 0.0
    ram = round(params * 0.8 + 1.0, 1) if params else 0.0
    return {"roles": roles, "params_b": params, "ram_gb": ram}


def fits_hardware(entry: ModelEntry, hw: dict) -> bool:
    """Static requirements vs detected hardware."""
    if entry.ram_gb and entry.ram_gb > (hw.get("ram_total_gb") or 0):
        return False
    if entry.vram_gb:
        gpus = hw.get("gpus") or []
        if not any(
            (g.get("vram_gb") or 0) >= entry.vram_gb or g.get("vram_gb") is None
            for g in gpus
        ):
            return False
    return True


def passes_floors(measurement: dict, purpose: str) -> bool:
    floors = ROLE_FLOORS.get(purpose, ROLE_FLOORS["general"])
    q = measurement.get("quality") or {}
    if (q.get("json") or 0.0) < floors["json"]:
        return False
    if (q.get("tool") or 0.0) < floors["tool"]:
        return False
    if (q.get("hallucination") or 0.0) > floors["hallucination"]:
        return False
    if (q.get("first_attempt") or 0.0) < floors["first_attempt"]:
        return False
    return True


class ModelRegistry:
    """JSON-backed model facts + per-hardware measurements."""

    def __init__(self, path: str | Path | None = None) -> None:
        self.path = Path(path) if path else None
        self.entries: dict[str, ModelEntry] = {}
        if self.path and self.path.exists():
            try:
                raw = json.loads(self.path.read_text(encoding="utf-8"))
            except (OSError, ValueError):
                raw = {}
            for name, data in (raw.get("models") or {}).items():
                known = _KNOWN.get(name) or _parse_from_name(name)
                self.entries[name] = ModelEntry(
                    name=name,
                    roles=data.get("roles") or known.get("roles") or ["general"],
                    params_b=data.get("params_b") or known.get("params_b") or 0.0,
                    quant=data.get("quant") or "Q4_K_M",
                    ram_gb=data.get("ram_gb") or known.get("ram_gb") or 0.0,
                    vram_gb=data.get("vram_gb") or 0.0,
                    benchmarks=data.get("benchmarks") or {},
                )
        # Seed static facts for known models even if never benchmarked, so
        # eligibility gating has requirements to check against.
        for name, known in _KNOWN.items():
            if name not in self.entries:
                self.entries[name] = ModelEntry(name=name, **known)

    # -- persistence -----------------------------------------------------

    def save(self) -> None:
        if not self.path:
            return
        self.path.parent.mkdir(parents=True, exist_ok=True)
        data = {"benchmark_version": BENCHMARK_VERSION, "models": {}}
        for name, e in self.entries.items():
            data["models"][name] = {
                "roles": e.roles,
                "params_b": e.params_b,
                "quant": e.quant,
                "ram_gb": e.ram_gb,
                "vram_gb": e.vram_gb,
                "benchmarks": e.benchmarks,
            }
        self.path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    def upsert_benchmark(self, name: str, pkey: str, measurement: dict) -> None:
        entry = self.entries.get(name)
        if entry is None:
            entry = ModelEntry(name=name, **_parse_from_name(name))
            self.entries[name] = entry
        measurement = dict(measurement)
        measurement["benchmark_version"] = BENCHMARK_VERSION
        entry.benchmarks[pkey] = measurement
        self.save()

    # -- selection ---------------------------------------------------------

    def eligible(
        self, purpose: str, available: set[str], hw: dict, pkey: str
    ) -> list[tuple[ModelEntry, dict]]:
        """Entries usable for *purpose* on this hardware, with measurements.

        Hard gates, in order: role match -> pulled locally -> static
        requirements fit -> benchmarked on THIS hardware at the current
        version -> quality floors. Models failing any gate are excluded no
        matter how fast they are.
        """
        roles = PURPOSE_ROLES.get(purpose, PURPOSE_ROLES["general"])
        out: list[tuple[ModelEntry, dict]] = []
        for name in available:
            entry = self.entries.get(name)
            if entry is None or not roles.intersection(entry.roles):
                continue
            if not fits_hardware(entry, hw):
                continue
            m = entry.measurement(pkey)
            if m is None or not passes_floors(m, purpose):
                continue
            out.append((entry, m))
        return out

    def choose(
        self, purpose: str, available: set[str], hw: dict, pkey: str
    ) -> tuple[ModelEntry, dict] | None:
        """Best eligible model per the purpose's policy."""
        candidates = self.eligible(purpose, available, hw, pkey)
        if not candidates:
            return None
        if purpose == "coding":
            ceiling = LATENCY_CEILING_S["coding"]
            within = [(e, m) for e, m in candidates
                      if (m.get("latency_s") or float("inf")) <= ceiling]
            pool = within or candidates  # never return empty when something fits
            # Quality first: coding score, ties broken by overall quality (a
            # 7B coder and a 1.5B coder can both "fix" the fixture bug, but
            # the stronger model wins equal claims deterministically).
            return max(pool, key=lambda em: (
                (em[1].get("quality") or {}).get("coding", 0.0),
                (em[1].get("quality") or {}).get("overall", 0.0),
            ))
        if purpose == "reasoning":
            return max(
                candidates,
                key=lambda em: ((em[1].get("quality") or {}).get("overall", 0.0)
                                * (em[1].get("quality") or {}).get("json", 0.0)
                                / max(em[1].get("latency_s") or 1.0, 0.1)),
            )
        # general / simple routing: fastest model that passes the floors
        return min(candidates, key=lambda em: em[1].get("latency_s") or float("inf"))

    def fastest_fallback(
        self,
        purpose: str,
        available: set[str],
        hw: dict,
        pkey: str,
        exclude: str,
    ) -> tuple[ModelEntry, dict] | None:
        """Fastest eligible model other than *exclude* (the failed one).

        Keeps the agent alive when a heavy model times out or disappears:
        heavy -> fast local fallback, no full stop.
        """
        candidates = [
            (e, m) for e, m in self.eligible(purpose, available, hw, pkey)
            if e.name != exclude
        ]
        if not candidates:
            return None
        return min(candidates, key=lambda em: em[1].get("latency_s") or float("inf"))

    def fastest(
        self,
        purpose: str,
        available: set[str],
        hw: dict,
        pkey: str,
    ) -> tuple[ModelEntry, dict] | None:
        """Fastest floor-passing model for *purpose* (fast-first attempts)."""
        return self.fastest_fallback(purpose, available, hw, pkey, exclude="")
