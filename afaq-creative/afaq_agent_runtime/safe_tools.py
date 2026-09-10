"""Safe tool registrations for runtime v1.

Only read-class operations are registered. Path reads are confined to
explicit allowed roots; anything outside raises. There is deliberately no
shell write, no production DB write, no deploy, and no git mutation here.
"""

from __future__ import annotations

import os
import platform
import sys
from pathlib import Path

from afaq_intelligence_core.tools.registry import ToolRegistry, ToolSpec

MAX_READ_BYTES = 200 * 1024  # 200 KB cap per file read


def _ensure_inside(path: str, roots: tuple[Path, ...]) -> Path:
    candidate = Path(path).expanduser().resolve()
    for root in roots:
        try:
            candidate.relative_to(root.resolve())
            return candidate
        except ValueError:
            continue
    raise PermissionError(
        f"path outside allowed roots: {candidate} (allowed: {[str(r) for r in roots]})"
    )


def register_safe_tools(registry: ToolRegistry, allowed_roots: list[str | Path]) -> None:
    """Register the v1 safe tool set on an existing ToolRegistry."""
    roots = tuple(Path(r).resolve() for r in allowed_roots)

    def read_project_file(path: str) -> dict:
        target = _ensure_inside(path, roots)
        if not target.is_file():
            raise FileNotFoundError(f"not a file: {target}")
        if target.stat().st_size > MAX_READ_BYTES:
            raise ValueError(f"file too large (> {MAX_READ_BYTES} bytes): {target}")
        return {
            "path": str(target),
            "content": target.read_text(encoding="utf-8", errors="replace"),
            "size_bytes": target.stat().st_size,
        }

    def system_status() -> dict:
        stat = os.statvfs(str(roots[0])) if hasattr(os, "statvfs") else None
        usage = None
        if stat is not None:
            usage = {
                "free_bytes": stat.f_bavail * stat.f_frsize,
                "total_bytes": stat.f_blocks * stat.f_frsize,
            }
        else:  # Windows fallback
            usage = {"free_bytes": None, "total_bytes": None}
        return {
            "python_version": sys.version.split()[0],
            "platform": platform.platform(),
            "cwd": os.getcwd(),
            "root_free_bytes": usage["free_bytes"],
        }

    def aic_memory_summary() -> dict:
        # Imported lazily so tool registration never hard-fails on import
        # order; the runtime passes its own store when constructing.
        from .agent_runtime import get_runtime_memory_summary

        return get_runtime_memory_summary()

    registry.register(ToolSpec(
        name="read_project_file",
        description="Read a text file inside the allowed project roots (200KB cap)",
        risk="read",
        handler=read_project_file,
    ))
    registry.register(ToolSpec(
        name="system_status",
        description="Read-only local system status (python, platform, disk)",
        risk="read",
        handler=system_status,
    ))
    registry.register(ToolSpec(
        name="aic_memory_summary",
        description="Call AIC internal function: memory counts from the nucleus store",
        risk="read",
        handler=aic_memory_summary,
    ))
