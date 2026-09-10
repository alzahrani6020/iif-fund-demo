"""Workspace service for the AIC Code Workspace UI.

Exposes the developer project root to the Control Center with the SAME
guarantees the Developer Agent tools have: every path goes through
``ProjectBoundary`` (no traversal outside the root), generated/vendor
directories are skipped, writes are audited with the gateway actor, and
every terminal command is validated by the existing ``command_allowlist``
(no arbitrary shell — the allowlist is the single policy gate).

This module adds no parallel policy engine; it composes:
  ProjectBoundary (developer_tools) + command_allowlist + audit ledger.
"""

from __future__ import annotations

import os
import re
import shutil
import subprocess
from pathlib import Path
from typing import Any, Callable

from .command_allowlist import CommandNotAllowed, check_allowed, run_allowed
from .developer_tools import (
    MAX_READ_BYTES,
    SKIP_DIRS,
    ProjectBoundary,
    _iter_files,
    _read_raw,
    _read_text,
    _write_text,
)

_MAX_TREE_ENTRIES = 500
_MAX_FLAT_FILES = 3_000
_MAX_SEARCH_RESULTS = 200
_MAX_WRITE_BYTES = 512 * 1024
_MAX_DELETE_ENTRIES = 5_000

# Never writable through the workspace, no matter the boundary: VCS internals
# and the runtime's own state directory.
_PROTECTED_PARTS = {".git", ".hg", ".svn"}
_DETECT_TIMEOUT_S = 6.0


class WorkspaceBlocked(PermissionError):
    """A workspace operation was refused by policy (clear, UI-facing)."""


def _audit_noop(action: str, actor: str, detail: dict) -> None:
    return


class WorkspaceService:
    """File tree, safe file ops, search, runtime detection, safe commands."""

    def __init__(
        self,
        project_root: str | Path,
        audit: Callable[[str, str, dict], None] | None = None,
    ) -> None:
        self.boundary = ProjectBoundary(project_root)
        self._audit = audit or _audit_noop

    # -- guards -------------------------------------------------------------
    def _rel(self, target: Path) -> str:
        """Project-relative path with forward slashes (UI contract)."""
        return self.boundary.relpath(target).replace("\\", "/")

    def _target(self, rel: str, *, must_exist: bool = False) -> Path:
        if not isinstance(rel, str) or not rel.strip():
            raise WorkspaceBlocked("مسار غير صالح")
        rel = rel.strip().replace("\\", "/").lstrip("/")
        if "\x00" in rel:
            raise WorkspaceBlocked("مسار غير صالح")
        # Containment is enforced by the boundary itself (resolved absolute
        # path must stay under the root); ".." segments that resolve outside
        # are rejected there, mid-path ones normalize harmlessly.
        try:
            target = self.boundary.inside(self.boundary.root / rel)
        except PermissionError as exc:
            raise WorkspaceBlocked(f"مسار خارج حدود المشروع: {rel}") from exc
        if must_exist and not target.exists():
            raise FileNotFoundError(f"غير موجود: {rel}")
        return target

    def _check_writable(self, target: Path) -> None:
        parts = target.relative_to(self.boundary.root).parts
        if set(parts) & _PROTECTED_PARTS:
            raise WorkspaceBlocked("مسار محمي لا يمكن تعديله عبر Workspace")
        # The runtime's own state directory (direct child "var") is protected.
        if parts and parts[0] == "var" and (self.boundary.root / "var").is_dir():
            raise WorkspaceBlocked("مجلد var الداخلي محمي")

    @staticmethod
    def _eol_crlf(raw: bytes) -> bool:
        return b"\r\n" in raw[:4096]

    # -- tree / listing -------------------------------------------------------
    def tree(self, rel: str = "") -> dict:
        folder = self._target(rel) if rel.strip() else self.boundary.root
        if not folder.is_dir():
            raise NotADirectoryError(f"ليس مجلدًا: {rel}")
        entries: list[dict] = []
        try:
            children = sorted(folder.iterdir(), key=lambda p: (not p.is_dir(), p.name.lower()))
        except OSError as exc:
            raise WorkspaceBlocked(f"تعذر قراءة المجلد: {exc}") from exc
        for child in children:
            if child.name in SKIP_DIRS:
                continue
            try:
                is_dir = child.is_dir()
                entry: dict[str, Any] = {
                    "name": child.name,
                    "rel": self._rel(child),
                    "type": "dir" if is_dir else "file",
                }
                if not is_dir:
                    entry["size"] = child.stat().st_size
                entries.append(entry)
            except OSError:
                continue
            if len(entries) >= _MAX_TREE_ENTRIES:
                break
        return {
            "root": self._rel(folder) if folder != self.boundary.root else "",
            "name": folder.name,
            "entries": entries,
            "truncated": len(entries) >= _MAX_TREE_ENTRIES,
        }

    def files(self) -> dict:
        """Flat project file list for Quick Open (bounded, cached by client)."""
        out: list[str] = []
        for path in _iter_files(self.boundary.root):
            out.append(self._rel(path))
            if len(out) >= _MAX_FLAT_FILES:
                break
        return {"count": len(out), "files": sorted(out),
                "truncated": len(out) >= _MAX_FLAT_FILES}

    # -- read / write ---------------------------------------------------------
    def read(self, rel: str) -> dict:
        target = self._target(rel, must_exist=True)
        raw = _read_raw(target)
        content = raw.decode("utf-8").replace("\r\n", "\n")
        return {
            "path": self._rel(target),
            "content": content,
            "size_bytes": len(raw),
            "eol": "crlf" if self._eol_crlf(raw) else "lf",
        }

    def write(self, rel: str, content: str, *, actor: str) -> dict:
        if not isinstance(content, str):
            raise WorkspaceBlocked("المحتوى يجب أن يكون نصًا")
        encoded = content.encode("utf-8")
        if len(encoded) > _MAX_WRITE_BYTES:
            raise WorkspaceBlocked(f"الملف أكبر من الحد المسموح ({_MAX_WRITE_BYTES // 1024}KB)")
        target = self._target(rel)
        self._check_writable(target)
        existed = target.exists()
        if existed and not target.is_file():
            raise WorkspaceBlocked("المسار موجود ولا يمكن كتابته كملف")
        eol_crlf = False
        if existed:
            try:
                eol_crlf = self._eol_crlf(_read_raw(target))
            except (ValueError, OSError):
                eol_crlf = False
        target.parent.mkdir(parents=True, exist_ok=True)
        _write_text(target, content, crlf=eol_crlf)
        rel_out = self._rel(target)
        self._audit("workspace_write", actor, {
            "path": rel_out, "bytes": len(encoded), "created": not existed,
        })
        return {"path": rel_out, "bytes": len(encoded), "created": not existed}

    # -- fs ops ---------------------------------------------------------------
    def mkdir(self, rel: str, *, actor: str) -> dict:
        target = self._target(rel)
        self._check_writable(target)
        if target.exists():
            raise WorkspaceBlocked("المسار موجود مسبقًا")
        target.mkdir(parents=True)
        rel_out = self._rel(target)
        self._audit("workspace_mkdir", actor, {"path": rel_out})
        return {"path": rel_out}

    def rename(self, rel: str, new_rel: str, *, actor: str) -> dict:
        source = self._target(rel, must_exist=True)
        dest = self._target(new_rel)
        self._check_writable(source)
        self._check_writable(dest)
        if dest.exists():
            raise WorkspaceBlocked("الوجهة موجودة مسبقًا")
        dest.parent.mkdir(parents=True, exist_ok=True)
        source.rename(dest)
        self._audit("workspace_rename", actor, {
            "path": self._rel(source),
            "new_path": self._rel(dest),
        })
        return {"path": self._rel(source), "new_path": self._rel(dest)}

    def delete(self, rel: str, *, actor: str) -> dict:
        target = self._target(rel, must_exist=True)
        self._check_writable(target)
        removed = 1
        if target.is_dir():
            removed = sum(1 for _ in target.rglob("*"))
            if removed > _MAX_DELETE_ENTRIES:
                raise WorkspaceBlocked("المجلد كبير جدًا للحذف عبر Workspace")
            shutil.rmtree(target)
        else:
            target.unlink()
        self._audit("workspace_delete", actor, {"path": rel, "removed_entries": removed})
        return {"path": rel, "removed_entries": removed}

    # -- search ---------------------------------------------------------------
    def search(self, query: str, *, regex: bool = False) -> dict:
        if not isinstance(query, str) or not query:
            raise WorkspaceBlocked("كلمة البحث فارغة")
        if len(query) > 300:
            raise WorkspaceBlocked("كلمة البحث طويلة جدًا")
        pattern = None
        if regex:
            try:
                pattern = re.compile(query)
            except re.error as exc:
                raise WorkspaceBlocked(f"تعبير regex غير صالح: {exc}") from exc
        results: list[dict] = []
        for path in _iter_files(self.boundary.root):
            try:
                content = _read_text(path)
            except (ValueError, OSError, UnicodeError):
                continue
            for lineno, line in enumerate(content.splitlines(), 1):
                matched = bool(pattern.search(line)) if pattern else query in line
                if matched:
                    results.append({
                        "path": self._rel(path),
                        "line": lineno,
                        "text": line.strip()[:200],
                    })
                    if len(results) >= _MAX_SEARCH_RESULTS:
                        return {"query": query, "regex": regex,
                                "count": len(results), "results": results,
                                "truncated": True}
        return {"query": query, "regex": regex,
                "count": len(results), "results": results, "truncated": False}

    # -- safe command gateway -------------------------------------------------
    def run(self, command: str, *, actor: str, timeout: int = 180) -> dict:
        if not isinstance(command, str) or not command.strip():
            raise WorkspaceBlocked("أمر فارغ")
        if len(command) > 600:
            raise WorkspaceBlocked("الأمر طويل جدًا")
        timeout = max(5, min(int(timeout or 180), 600))
        argv = check_allowed(command)  # raises CommandNotAllowed — the policy gate
        result = run_allowed(argv, cwd=str(self.boundary.root), timeout=timeout)
        self._audit("workspace_run", actor, {
            "command": " ".join(argv), "returncode": result["returncode"],
        })
        return result

    # -- git (read-only, via the same allowlist) ------------------------------
    _GIT_WHAT = {"status": ["git", "status"], "diff": ["git", "diff"],
                 "log": ["git", "log", "--oneline", "-20"]}

    def git(self, what: str, *, actor: str) -> dict:
        argv = self._GIT_WHAT.get(what)
        if argv is None:
            raise WorkspaceBlocked("عملية git غير مدعومة")
        result = run_allowed(argv, cwd=str(self.boundary.root))
        self._audit("workspace_git", actor, {"what": what, "returncode": result["returncode"]})
        return result

    # -- environment detection --------------------------------------------------
    _DETECT_PROBES: tuple[tuple[str, tuple[str, ...]], ...] = (
        ("python", ("python", "--version")),
        ("node", ("node", "--version")),
        ("npm", ("npm", "--version")),
        ("npx", ("npx", "--version")),
        ("git", ("git", "--version")),
        ("java", ("java", "-version")),
        ("javac", ("javac", "-version")),
        ("maven", ("mvn", "-version")),
        ("gradle", ("gradle", "--version")),
        ("powershell", ("powershell", "-NoProfile", "-Command",
                        "$PSVersionTable.PSVersion.ToString()")),
        ("pwsh", ("pwsh", "--version")),
    )

    def detect(self) -> dict:
        """Probe locally installed runtimes — fixed argv only, never user input."""
        runtimes: dict[str, dict] = {}
        for key, argv in self._DETECT_PROBES:
            if key in runtimes:
                continue
            exe = shutil.which(argv[0])
            if exe is None:
                continue
            entry: dict[str, Any] = {"path": exe, "version": None}
            try:
                completed = subprocess.run(
                    list(argv), cwd=str(self.boundary.root),
                    capture_output=True, text=True, timeout=_DETECT_TIMEOUT_S,
                    encoding="utf-8", errors="replace", shell=False,
                )
                output = ((completed.stdout or "") + (completed.stderr or "")).strip()
                entry["version"] = output.splitlines()[0][:120] if output else None
            except (OSError, subprocess.TimeoutExpired):
                entry["version"] = None
            # Prefer pwsh over Windows PowerShell under the same "shell" label.
            runtimes[key] = entry
        project = self._project_hints()
        return {"root": str(self.boundary.root), "runtimes": runtimes, "project": project}

    def _project_hints(self) -> dict:
        root = self.boundary.root
        hints: dict[str, Any] = {"type": None, "test_commands": [], "scripts": []}
        pkg = root / "package.json"
        if pkg.is_file():
            hints["type"] = hints["type"] or "node"
            try:
                data = __import__("json").loads(pkg.read_text(encoding="utf-8"))
                scripts = (data.get("scripts") or {})
                allow = {"test", "build", "lint", "typecheck"}
                hints["scripts"] = [k for k in scripts if k in allow]
                if "test" in scripts:
                    hints["test_commands"].append({"name": "npm test", "command": "npm run test"})
                if "typecheck" in scripts:
                    hints["test_commands"].append(
                        {"name": "npm typecheck", "command": "npm run typecheck"})
            except (ValueError, OSError):
                pass
        if (root / "pytest.ini").is_file() or (root / "pyproject.toml").is_file() \
                or any(root.glob("tests/test_*.py")):
            hints["type"] = hints["type"] or "python"
            hints["test_commands"].append(
                {"name": "pytest", "command": "python -m pytest"})
        if (root / "pom.xml").is_file():
            hints["type"] = hints["type"] or "java-maven"
        if (root / "build.gradle").is_file() or (root / "build.gradle.kts").is_file():
            hints["type"] = hints["type"] or "java-gradle"
        if hints["type"] is None and (root / "requirements.txt").is_file():
            hints["type"] = "python"
        return hints


__all__ = ["WorkspaceService", "WorkspaceBlocked", "CommandNotAllowed",
           "MAX_READ_BYTES"]
