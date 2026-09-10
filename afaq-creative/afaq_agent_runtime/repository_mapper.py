"""Repository Mapper — deterministic project understanding for Developer v2.

Reports project type, main folders, package managers, dependency manifests,
test/build commands, and important config files. Pure filesystem inspection,
no network, no model calls.
"""

from __future__ import annotations

import json
from pathlib import Path

_CONFIG_CANDIDATES = (
    "package.json", "pyproject.toml", "setup.py", "setup.cfg",
    "requirements.txt", "tsconfig.json", "next.config.js", "next.config.mjs",
    "tailwind.config.js", "tailwind.config.ts", "jest.config.js",
    "pytest.ini", "tox.ini", ".eslintrc.json", "ruff.toml", "mypy.ini",
    "Cargo.toml", "go.mod", "Dockerfile", "docker-compose.yml",
    "prisma/schema.prisma", "vercel.json",
)

_IMPORTANT_FOLDERS = ("src", "app", "lib", "components", "pages", "tests", "test", "scripts", "prisma", "docs")

_TEST_SKIP_DIRS = {
    ".git", "node_modules", "__pycache__", ".next", "dist", "build",
    "out", ".venv", "venv", "vendor", ".cache", "coverage",
}


def _has_test_file(root: Path, max_dirs: int = 4000) -> bool:
    """Pruned, bounded test-file probe — safe on large monorepo roots where a
    plain rglob would walk dependency trees (node_modules) to exhaustion."""
    stack = [Path(root)]
    seen = 0
    while stack and seen < max_dirs:
        current = stack.pop()
        seen += 1
        try:
            entries = list(current.iterdir())
        except OSError:
            continue
        for entry in entries:
            name = entry.name
            if name.startswith(".") or name in _TEST_SKIP_DIRS:
                continue
            try:
                if entry.is_dir():
                    stack.append(entry)
                elif name.startswith("test_") and name.endswith(".py"):
                    return True
            except OSError:
                continue
    return False


def detect_project_type(root: Path) -> dict:
    root = Path(root)
    types = []
    if (root / "package.json").exists():
        types.append("node")
    if (root / "pyproject.toml").exists() or (root / "requirements.txt").exists() or (root / "setup.py").exists() \
            or any(root.glob("*.py")) or any(root.rglob("test_*.py")):
        types.append("python")
    if (root / "Cargo.toml").exists():
        types.append("rust")
    if (root / "go.mod").exists():
        types.append("go")
    if not types:
        types.append("unknown")
    config_files = [c for c in _CONFIG_CANDIDATES if (root / c).exists()]
    return {
        "project_types": types,
        "config_files": config_files,
        "package_managers": [pm for pm in ("package.json", "pyproject.toml", "requirements.txt", "Cargo.toml", "go.mod") if (root / pm).exists()],
    }


def inspect_dependencies(root: Path) -> dict:
    root = Path(root)
    deps: dict = {}
    package_json = root / "package.json"
    if package_json.exists():
        try:
            data = json.loads(package_json.read_text(encoding="utf-8"))
            deps["node"] = {
                "dependencies": sorted((data.get("dependencies") or {}).keys()),
                "devDependencies": sorted((data.get("devDependencies") or {}).keys()),
                "scripts": sorted((data.get("scripts") or {}).keys()),
            }
        except (json.JSONDecodeError, OSError) as exc:
            deps["node"] = {"error": str(exc)}
    for manifest in ("requirements.txt", "pyproject.toml"):
        path = root / manifest
        if path.exists():
            try:
                deps[manifest] = path.read_text(encoding="utf-8", errors="replace")[:2000]
            except OSError as exc:
                deps[manifest] = f"error: {exc}"
    return deps


def map_repository(root: Path) -> dict:
    root = Path(root)
    detected = detect_project_type(root)
    main_folders = [
        name for name in _IMPORTANT_FOLDERS
        if (root / name).is_dir()
    ]
    # walk one extra level for scoped folders like app/, src/
    subfolders: dict[str, list[str]] = {}
    for name in main_folders:
        children = sorted(
            c.name for c in (root / name).iterdir()
            if c.is_dir() and not c.name.startswith(".")
        )[:12]
        if children:
            subfolders[name] = children

    types = detected["project_types"]
    test_commands: list[list[str]] = []
    build_commands: list[list[str]] = []
    if "python" in types:
        if (root / "tests").is_dir() or any(root.glob("test_*.py")) or _has_test_file(root):
            test_commands.append(["python", "-m", "unittest", "discover", "-s", "tests"])
        if (root / "pyproject.toml").exists():
            build_commands.append(["python", "-m", "build"])
    if "node" in types:
        test_commands.append(["npm", "run", "test"])
        build_commands.append(["npm", "run", "build"])

    return {
        "root": str(root),
        **detected,
        "main_folders": main_folders,
        "subfolders": subfolders,
        "test_commands": test_commands,
        "build_commands": build_commands,
        "dependency_summary": inspect_dependencies(root),
    }
