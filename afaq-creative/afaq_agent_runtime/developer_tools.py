"""Developer Agent v2 tools: safe reads and approval-gated writes.

Every path operation is confined to the developer project root. Write-class
tools raise ``ApprovalRequired`` unless an explicit approval token is
presented — the Developer Agent issues that token only after a human grants
approval on a change proposal.
"""

from __future__ import annotations

import os
import re
from pathlib import Path

from afaq_intelligence_core.tools.registry import ToolRegistry, ToolSpec

MAX_READ_BYTES = 300 * 1024
SKIP_DIRS = {".git", "node_modules", "__pycache__", ".next", "dist", "build", "var", ".venv", "venv"}
BINARY_HINT = re.compile(rb"[\x00-\x08\x0e-\x1f]")


class ApprovalTokenMissing(PermissionError):
    """Raised when a write tool is called without a granted approval token."""


class ProjectBoundary:
    """Path containment guard for one project root."""

    def __init__(self, root: str | Path) -> None:
        self.root = Path(root).resolve()
        if not self.root.is_dir():
            raise ValueError(f"project_root is not a directory: {self.root}")

    def inside(self, path: str | Path) -> Path:
        candidate = Path(path).expanduser().resolve()
        try:
            candidate.relative_to(self.root)
        except ValueError:
            raise PermissionError(
                f"path outside project root: {candidate} (root: {self.root})"
            ) from None
        return candidate

    def relpath(self, path: Path) -> str:
        return str(path.relative_to(self.root))


def _read_raw(path: Path) -> bytes:
    if not path.is_file():
        raise FileNotFoundError(f"not a file: {path}")
    if path.stat().st_size > MAX_READ_BYTES:
        raise ValueError(f"file too large (> {MAX_READ_BYTES} bytes): {path}")
    raw = path.read_bytes()
    if BINARY_HINT.search(raw[:4096]):
        raise ValueError(f"binary file not readable as text: {path}")
    return raw


def _read_text(path: Path) -> str:
    # Strict UTF-8: invalid bytes must fail loudly (the caller's rollback path)
    # instead of being silently corrupted by errors="replace".
    # CRLF is normalized to LF so exact-string edits match regardless of the
    # file's on-disk line endings.
    return _read_raw(path).decode("utf-8").replace("\r\n", "\n")


def _write_text(path: Path, content: str, *, crlf: bool) -> None:
    """Write text preserving the file's original EOL style exactly.

    Bytes-level write: text-mode would translate LF -> CRLF on Windows and
    turn a one-line patch into a whole-file diff."""
    if crlf:
        # The caller may hand us replacement text that already contains
        # CRLF; converting naively would produce \r\r\n. Normalize first.
        content = content.replace("\r\n", "\n")
        content = content.replace("\n", "\r\n")
    path.write_bytes(content.encode("utf-8"))


def _iter_files(root: Path):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            yield Path(dirpath) / name


def register_developer_tools(registry: ToolRegistry, boundary: ProjectBoundary) -> None:
    """Register developer read tools (risk=read) and write tools (risk=write)."""

    approval_tokens: set[str] = set()

    # -- read tools --------------------------------------------------------
    def list_project_files(max_files: int = 500) -> dict:
        files = []
        for path in _iter_files(boundary.root):
            files.append(boundary.relpath(path))
            if len(files) >= max_files:
                break
        return {"root": str(boundary.root), "count": len(files), "files": sorted(files)}

    def read_project_file(path: str) -> dict:
        target = boundary.inside(path if Path(path).is_absolute() else boundary.root / path)
        content = _read_text(target)
        return {"path": boundary.relpath(target), "content": content, "size_bytes": len(content)}

    def search_code(query: str, max_results: int = 50) -> dict:
        results = []
        for path in _iter_files(boundary.root):
            try:
                content = _read_text(path)
            except (ValueError, OSError, UnicodeError):
                continue
            for lineno, line in enumerate(content.splitlines(), 1):
                if query in line:
                    results.append({
                        "path": boundary.relpath(path),
                        "line": lineno,
                        "text": line.strip()[:200],
                    })
                    if len(results) >= max_results:
                        return {"query": query, "count": len(results), "results": results}
        return {"query": query, "count": len(results), "results": results}

    def inspect_file(path: str) -> dict:
        target = boundary.inside(path if Path(path).is_absolute() else boundary.root / path)
        content = _read_text(target)
        lines = content.splitlines()
        return {
            "path": boundary.relpath(target),
            "size_bytes": len(content),
            "line_count": len(lines),
            "first_lines": lines[:40],
        }

    def inspect_git_status() -> dict:
        from .command_allowlist import run_allowed
        result = run_allowed(["git", "status", "--porcelain"], cwd=str(boundary.root))
        return {"passed": result["passed"], "stdout": result["stdout"], "stderr": result["stderr"]}

    def inspect_diff() -> dict:
        from .command_allowlist import run_allowed
        result = run_allowed(["git", "diff"], cwd=str(boundary.root))
        return {"passed": result["passed"], "stdout": result["stdout"], "stderr": result["stderr"]}

    def detect_project_type() -> dict:
        from .repository_mapper import detect_project_type as detect
        return detect(boundary.root)

    def inspect_dependencies() -> dict:
        from .repository_mapper import inspect_dependencies as inspect
        return inspect(boundary.root)

    # -- write tools (gated) -------------------------------------------------
    def _require_token(token: str | None, action: str, path: str) -> None:
        if token not in approval_tokens:
            raise ApprovalTokenMissing(
                f"{action} on '{path}' requires an approved change proposal token"
            )

    def create_file(path: str, content: str, approval_token: str | None = None) -> dict:
        target = boundary.inside(path if Path(path).is_absolute() else boundary.root / path)
        _require_token(approval_token, "create_file", boundary.relpath(target))
        if target.exists():
            raise FileExistsError(f"refusing to overwrite existing file: {target}")
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(content.encode("utf-8"))
        return {"path": boundary.relpath(target), "action": "created", "bytes": len(content)}

    def edit_file(path: str, old: str, new: str, approval_token: str | None = None,
                  replace_all: bool = False) -> dict:
        target = boundary.inside(path if Path(path).is_absolute() else boundary.root / path)
        _require_token(approval_token, "edit_file", boundary.relpath(target))
        raw = _read_raw(target)
        crlf = b"\r\n" in raw
        content = raw.decode("utf-8").replace("\r\n", "\n")
        if old == "":
            # Defined append semantics (see apply_patch).
            if not new:
                raise ValueError("empty append: 'new' must not be empty")
            sep = "" if not content or content.endswith("\n") else "\n"
            updated = content + sep + new
            _write_text(target, updated, crlf=crlf)
            return {"path": boundary.relpath(target), "action": "edited", "replacements": 1}
        occurrences = content.count(old)
        if occurrences == 0:
            raise ValueError("old text not found in file")
        if occurrences > 1 and not replace_all:
            raise ValueError(
                f"old text occurs {occurrences} times; refuse ambiguous edit"
            )
        updated = content.replace(old, new) if replace_all else content.replace(old, new, 1)
        _write_text(target, updated, crlf=crlf)
        return {"path": boundary.relpath(target), "action": "edited", "replacements": occurrences if replace_all else 1}

    def apply_patch(path: str, replacements: list, approval_token: str | None = None) -> dict:
        """Structured patch: [{"old": str, "new": str, "replace_all": bool}].

        An empty "old" is defined as append-to-end-of-file (the consistent
        idiom of the local coder models), never a substring search.
        """
        target = boundary.inside(path if Path(path).is_absolute() else boundary.root / path)
        _require_token(approval_token, "apply_patch", boundary.relpath(target))
        raw = _read_raw(target)
        crlf = b"\r\n" in raw
        content = raw.decode("utf-8").replace("\r\n", "\n")
        applied = 0
        for rep in replacements:
            old, new = rep["old"], rep["new"]
            if old == "":
                if not new:
                    raise ValueError("empty append: 'new' must not be empty")
                sep = "" if not content or content.endswith("\n") else "\n"
                content = content + sep + new
                applied += 1
                continue
            occurrences = content.count(old)
            if occurrences == 0:
                raise ValueError(f"patch text not found in {target}: {old[:60]!r}")
            if occurrences > 1 and not rep.get("replace_all"):
                raise ValueError(f"ambiguous patch text ({occurrences} occurrences): {old[:60]!r}")
            content = content.replace(old, new) if rep.get("replace_all") else content.replace(old, new, 1)
            applied += 1
        _write_text(target, content, crlf=crlf)
        return {"path": boundary.relpath(target), "action": "patched", "replacements": applied}

    def rename_file(path: str, new_name: str, approval_token: str | None = None) -> dict:
        target = boundary.inside(path if Path(path).is_absolute() else boundary.root / path)
        destination = boundary.inside(new_name if Path(new_name).is_absolute() else boundary.root / new_name)
        _require_token(approval_token, "rename_file", boundary.relpath(target))
        if destination.exists():
            raise FileExistsError(f"destination already exists: {destination}")
        target.rename(destination)
        return {"path": boundary.relpath(target), "action": "renamed", "to": boundary.relpath(destination)}

    registry.register(ToolSpec("list_project_files", "List files under the project root (bounded)", "read", list_project_files))
    registry.register(ToolSpec("read_project_file", "Read a text file inside the project root", "read", read_project_file))
    registry.register(ToolSpec("search_code", "Search for a literal string in project files", "read", search_code))
    registry.register(ToolSpec("inspect_file", "File overview: size, line count, head", "read", inspect_file))
    registry.register(ToolSpec("inspect_git_status", "git status --porcelain (read-only)", "read", inspect_git_status))
    registry.register(ToolSpec("inspect_diff", "git diff (read-only)", "read", inspect_diff))
    registry.register(ToolSpec("detect_project_type", "Detect project type and config files", "read", detect_project_type))
    registry.register(ToolSpec("inspect_dependencies", "Inspect dependency manifests", "read", inspect_dependencies))

    registry.register(ToolSpec("create_file", "Create a new file (approval-gated)", "write", create_file))
    registry.register(ToolSpec("edit_file", "Exact-string file edit (approval-gated)", "write", edit_file))
    registry.register(ToolSpec("apply_patch", "Structured replacement patch (approval-gated)", "write", apply_patch))
    registry.register(ToolSpec("rename_file", "Rename a file (approval-gated)", "write", rename_file))

    def issue_token(task_id: str) -> str:
        token = f"APPROVED-{task_id}"
        approval_tokens.add(token)
        return token

    def revoke_token(task_id: str) -> None:
        # A granted token must never outlive its task: otherwise the first
        # human approval would authorize writes forever via the same token.
        approval_tokens.discard(f"APPROVED-{task_id}")

    registry.issue_token = issue_token  # runtime-internal helper
    registry.revoke_token = revoke_token  # runtime-internal helper
