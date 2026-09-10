"""Hardware detection + runtime profiles for the adaptive model layer.

Detects CPU/RAM/GPU facts once per runtime start (stdlib only, no new
dependencies), classifies them into a portable profile name
(``cpu_low`` … ``multi_gpu``) and persists the result under ``var_dir`` so
that:

  * benchmark results can be keyed to the profile they were measured on
    (never judge new hardware with old measurements);
  * a hardware change (upgrade, VPS migration, GPU add-on) is detected via a
    fingerprint and triggers re-detection — and lets the caller re-benchmark
    eligible models without touching agent code.

Profiles are capability classes, not machine names: the same code runs
unmodified on a laptop, a VPS or a GPU workstation.
"""

from __future__ import annotations

import ctypes
import hashlib
import json
import os
import platform
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

PROFILES = ("cpu_low", "cpu_high", "gpu_entry", "gpu_mid", "gpu_high", "multi_gpu")

PROFILE_FILE = "hardware_profile.json"


# ---------------------------------------------------------------------------
# Detection (defensive: never raises, unknown facts stay unknown)
# ---------------------------------------------------------------------------

def _total_ram_gb() -> float:
    if sys.platform == "win32":
        try:
            class _MEMORYSTATUSEX(ctypes.Structure):
                _fields_ = [
                    ("dwLength", ctypes.c_ulong),
                    ("dwMemoryLoad", ctypes.c_ulong),
                    ("ullTotalPhys", ctypes.c_ulonglong),
                    ("ullAvailPhys", ctypes.c_ulonglong),
                    ("ullTotalPageFile", ctypes.c_ulonglong),
                    ("ullAvailPageFile", ctypes.c_ulonglong),
                    ("ullTotalVirtual", ctypes.c_ulonglong),
                    ("ullAvailVirtual", ctypes.c_ulonglong),
                    ("ullAvailExtendedVirtual", ctypes.c_ulonglong),
                ]

            stat = _MEMORYSTATUSEX()
            stat.dwLength = ctypes.sizeof(_MEMORYSTATUSEX)
            if ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(stat)):
                return round(stat.ullTotalPhys / (1024 ** 3), 1)
        except Exception:  # noqa: BLE001 - detection must never break startup
            pass
        return 0.0
    try:
        return round(
            os.sysconf("SC_PHYS_PAGES") * os.sysconf("SC_PAGE_SIZE") / (1024 ** 3), 1
        )
    except (ValueError, OSError, AttributeError):
        return 0.0


def _gpu_vendor(name: str) -> str:
    lowered = name.lower()
    if "nvidia" in lowered or "geforce" in lowered or "quadro" in lowered or "rtx" in lowered:
        return "nvidia"
    if "amd" in lowered or "radeon" in lowered:
        return "amd"
    if "intel" in lowered:
        return "intel"
    if "apple" in lowered or "m1" in lowered or "m2" in lowered or "m3" in lowered or "m4" in lowered:
        return "apple"
    return "unknown"


def _run_quiet(cmd: list[str], timeout: float = 5.0) -> str:
    try:
        out = subprocess.run(
            cmd, capture_output=True, timeout=timeout, text=True,
            stdin=subprocess.DEVNULL,
        )
        return out.stdout.strip() if out.returncode == 0 else ""
    except (OSError, subprocess.TimeoutExpired):
        return ""


def _detect_gpus() -> list[dict]:
    """Return [{"vendor", "model", "vram_gb"|None}] from the safest sources.

    ``nvidia-smi`` is preferred because it reports true VRAM. A generic WMI
    (Windows) / sysfs (Linux) fallback records vendor/model only — VRAM from
    those sources is unreliable for >4 GiB cards and is left as None.
    """
    gpus: list[dict] = []

    out = _run_quiet([
        "nvidia-smi", "--query-gpu=name,memory.total",
        "--format=csv,noheader,nounits",
    ])
    if out:
        for line in out.splitlines():
            parts = [p.strip() for p in line.split(",")]
            if not parts or not parts[0]:
                continue
            vram = None
            if len(parts) > 1:
                try:
                    vram = round(int(parts[1]) / 1024, 1)  # MiB -> GiB
                except ValueError:
                    vram = None
            gpus.append({"vendor": "nvidia", "model": parts[0], "vram_gb": vram})

    if not gpus:
        out = _run_quiet(["rocm-smi", "--showproductname", "--csv"])
        if out:
            for line in out.splitlines()[1:]:
                if line.strip():
                    gpus.append({"vendor": "amd", "model": line.split(",")[0].strip(),
                                 "vram_gb": None})

    if not gpus and sys.platform == "win32":
        out = _run_quiet([
            "powershell", "-NoProfile", "-Command",
            "Get-CimInstance Win32_VideoController | ForEach-Object { $_.Name }",
        ], timeout=10.0)
        for line in out.splitlines():
            name = line.strip()
            if name:
                gpus.append({"vendor": _gpu_vendor(name), "model": name, "vram_gb": None})

    if not gpus and sys.platform == "darwin":
        out = _run_quiet(["system_profiler", "SPDisplaysDataType"])
        for line in out.splitlines():
            if "Chipset Model:" in line:
                name = line.split(":", 1)[1].strip()
                gpus.append({"vendor": "apple", "model": name, "vram_gb": None})

    return gpus


def detect_hardware() -> dict:
    """Best-effort hardware facts. Never raises."""
    cpu_model = (
        platform.processor()
        or os.environ.get("PROCESSOR_IDENTIFIER", "")
        or platform.machine()
        or "unknown"
    )
    hw = {
        "cpu_model": cpu_model.strip() or "unknown",
        "cpu_cores": os.cpu_count() or 1,
        "ram_total_gb": _total_ram_gb(),
        "gpus": _detect_gpus(),
        "accelerators": [],
        "detected_at": datetime.now(timezone.utc).isoformat(),
    }
    if any(g.get("vendor") == "nvidia" for g in hw["gpus"]):
        hw["accelerators"].append("cuda")
    if any(g.get("vendor") == "amd" for g in hw["gpus"]):
        hw["accelerators"].append("rocm")
    if any(g.get("vendor") == "apple" for g in hw["gpus"]):
        hw["accelerators"].append("metal")
    return hw


# ---------------------------------------------------------------------------
# Profiles + fingerprint
# ---------------------------------------------------------------------------

def classify_profile(hw: dict) -> str:
    """Map detected facts to a portable capability profile."""
    gpus = hw.get("gpus") or []
    if len(gpus) >= 2:
        return "multi_gpu"
    if not gpus:
        if (hw.get("cpu_cores") or 0) < 8 or 0 < (hw.get("ram_total_gb") or 0) < 16:
            return "cpu_low"
        return "cpu_high"
    vram = gpus[0].get("vram_gb")
    if vram is None:  # GPU present, VRAM unknown -> treat as entry-level
        return "gpu_entry"
    if vram < 8:
        return "gpu_entry"
    if vram < 24:
        return "gpu_mid"
    return "gpu_high"


def hardware_fingerprint(hw: dict) -> str:
    """Stable identity of the hardware for change detection.

    RAM is rounded to GiB (hardware-fixed); GPU list uses vendor+model+VRAM.
    Cosmetic changes (driver versions, free RAM) must not trigger a
    re-benchmark.
    """
    payload = {
        "cpu": hw.get("cpu_model"),
        "cores": hw.get("cpu_cores"),
        "ram_gb": round(hw.get("ram_total_gb") or 0),
        "gpus": [
            [g.get("vendor"), g.get("model"), g.get("vram_gb")]
            for g in (hw.get("gpus") or [])
        ],
    }
    raw = json.dumps(payload, sort_keys=True)
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()


def profile_key(hw: dict) -> str:
    """Benchmark bucket: profile class + hardware fingerprint.

    Measurements are only valid for the exact hardware they were taken on;
    the key makes old-device numbers unusable on a new device.
    """
    return f"{classify_profile(hw)}:{hardware_fingerprint(hw)[:12]}"


def load_or_detect(var_dir: str | Path) -> tuple[dict, bool]:
    """Load the persisted profile, re-detecting when hardware changed.

    Returns (hardware_dict_with_profile, changed). The dict always carries
    ``profile``, ``fingerprint`` and ``profile_key``. On change the new
    profile is persisted, so the next start compares against it.
    """
    var_dir = Path(var_dir)
    path = var_dir / PROFILE_FILE
    hw = detect_hardware()
    hw["profile"] = classify_profile(hw)
    hw["fingerprint"] = hardware_fingerprint(hw)
    hw["profile_key"] = profile_key(hw)

    changed = True
    if path.exists():
        try:
            stored = json.loads(path.read_text(encoding="utf-8"))
            changed = stored.get("fingerprint") != hw["fingerprint"]
        except (OSError, ValueError):
            changed = True  # unreadable file -> treat as changed, rewrite

    if changed:
        try:
            var_dir.mkdir(parents=True, exist_ok=True)
            path.write_text(
                json.dumps(hw, ensure_ascii=False, indent=2), encoding="utf-8"
            )
        except OSError:
            pass  # detection result still usable in-memory
    return hw, changed
