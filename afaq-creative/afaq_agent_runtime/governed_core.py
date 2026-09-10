from __future__ import annotations

import difflib
import os
from pathlib import Path

from .command_allowlist import run_allowed
from .repository_mapper import map_repository

SKIP = {".git", "node_modules", "__pycache__", ".next", "dist", "build", ".venv", "venv"}
MAX_READ = 300 * 1024


class GovernedAgentError(RuntimeError):
    pass


class GovernedProjectAgent:
    """Deterministic, bounded execution substrate for AFAQ Agent.

    It is intentionally independent from LLM/model providers. The reasoning
    layer must call this core rather than bypassing it.
    """

    def __init__(self, root: str | Path):
        self.root = Path(root).resolve()
        if not self.root.is_dir():
            raise GovernedAgentError(f"project root not found: {self.root}")

    def _path(self, rel: str) -> Path:
        p = (self.root / rel).resolve()
        try:
            p.relative_to(self.root)
        except ValueError:
            raise GovernedAgentError("path outside project root") from None
        return p

    def files(self, limit: int = 500) -> list[str]:
        out: list[str] = []
        for base, dirs, names in os.walk(self.root):
            dirs[:] = [d for d in dirs if d not in SKIP]
            for name in names:
                out.append(str((Path(base) / name).relative_to(self.root)).replace("\\", "/"))
                if len(out) >= limit:
                    return sorted(out)
        return sorted(out)

    def read(self, rel: str) -> str:
        p = self._path(rel)
        if not p.is_file():
            raise GovernedAgentError(f"not a file: {rel}")
        if p.stat().st_size > MAX_READ:
            raise GovernedAgentError("file exceeds read limit")
        return p.read_text(encoding="utf-8")

    def search(self, query: str, limit: int = 50) -> list[dict]:
        if not query:
            raise GovernedAgentError("empty query")
        hits: list[dict] = []
        for rel in self.files(5000):
            try:
                text = self.read(rel)
            except (UnicodeError, OSError, GovernedAgentError):
                continue
            for i, line in enumerate(text.splitlines(), 1):
                if query in line:
                    hits.append({"path": rel, "line": i, "text": line.strip()[:240]})
                    if len(hits) >= limit:
                        return hits
        return hits

    def edit(self, rel: str, old: str, new: str, *, approved: bool = False) -> str:
        if not approved:
            raise GovernedAgentError("write denied: explicit approval required")
        p = self._path(rel)
        before = self.read(rel)
        count = before.count(old)
        if count != 1:
            raise GovernedAgentError(f"bounded edit requires exactly one match; found {count}")
        after = before.replace(old, new, 1)
        p.write_text(after, encoding="utf-8", newline="")
        return "".join(difflib.unified_diff(before.splitlines(True), after.splitlines(True), fromfile=rel, tofile=rel))

    def run(self, command: str) -> dict:
        return run_allowed(command, cwd=str(self.root))

    def git_status(self) -> dict:
        return self.run("git status --porcelain")

    def git_diff(self) -> dict:
        return self.run("git diff")

    def map_repository(self) -> dict:
        return map_repository(self.root)
