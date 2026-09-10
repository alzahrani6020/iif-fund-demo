from __future__ import annotations

from enum import Enum
import shlex


class SideEffectClassification(str, Enum):
    READ_ONLY = "READ_ONLY"
    WRITE = "WRITE"
    EXTERNAL_SIDE_EFFECT = "EXTERNAL_SIDE_EFFECT"
    UNKNOWN = "UNKNOWN"


_READ_ACTIONS = {"files", "read", "search", "status", "diff", "map"}


def classify_action(action: str, args: dict | None = None) -> SideEffectClassification:
    action = (action or "").strip().lower()
    args = args or {}
    if action in _READ_ACTIONS:
        return SideEffectClassification.READ_ONLY
    if action == "edit":
        return SideEffectClassification.WRITE
    if action == "run":
        command = str(args.get("command", "")).strip()
        if not command:
            return SideEffectClassification.UNKNOWN
        try:
            argv = shlex.split(command, posix=False)
        except ValueError:
            return SideEffectClassification.UNKNOWN
        if not argv:
            return SideEffectClassification.UNKNOWN
        exe = argv[0].replace("\\", "/").rsplit("/", 1)[-1].lower().removesuffix(".exe")
        if exe == "git" and len(argv) > 1 and argv[1] in {"status", "diff", "log", "show", "rev-parse", "branch", "blame"}:
            return SideEffectClassification.READ_ONLY
        if exe in {"powershell", "pwsh"}:
            return SideEffectClassification.READ_ONLY
        if exe in {"java", "javac"} and len(argv) == 2 and argv[1] in {"-version", "--version"}:
            return SideEffectClassification.READ_ONLY
        if exe in {"python", "python3", "py", "npm", "pnpm", "yarn", "npx"}:
            # tests/builds can create local artifacts, caches or reports.
            return SideEffectClassification.WRITE
        return SideEffectClassification.UNKNOWN
    return SideEffectClassification.UNKNOWN
