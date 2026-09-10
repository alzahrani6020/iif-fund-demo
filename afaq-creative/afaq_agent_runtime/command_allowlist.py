"""Allowlisted local development commands for Developer Agent v2.

No arbitrary shell. Commands are matched as token sequences against a fixed
allowlist of *read-only or local-test* operations. Anything else is denied
with a clear reason. v2 forbids: git push, deploy commands, force resets,
credential tooling, and any shell builtin.
"""

from __future__ import annotations

import re
import shlex

# Each rule: (executable, second-token or subcommand pattern, description)
_RULES = (
    (("python", "python3", "py"), ("-m",), "python module"),
)

_PYTHON_MODULES = {
    "unittest", "pytest", "py_compile", "compileall",
    "mypy", "ruff", "flake8", "build",
    # NOTE: "pip" is deliberately absent — "python -m pip install" would
    # download and run arbitrary code, bypassing the "no pip" guarantee.
}
_NPM_SCRIPTS = {"test", "build", "lint", "typecheck"}
_GIT_READONLY = {"status", "diff", "log", "show", "rev-parse", "branch", "blame"}

# Read-only PowerShell cmdlets exposed to the Workspace terminal. The command
# string is matched against a strict shape: ONE cmdlet plus plain arguments —
# no pipelines, variables, script blocks, redirection, or command chaining —
# so a browser-originated line can never become arbitrary script execution.
_PS_CMDLETS = (
    "Get-ChildItem", "dir", "gci", "ls",
    "Get-Content", "type", "cat",
    "Get-Item",
    "Select-String",
    "Get-Process", "ps",
    "Get-Location", "pwd",
    "Get-Date",
)
_PS_BANNED = re.compile(r"[;&|`$(){}\[\]<>~\r\n]")
_PS_ARGS_RE = r"[\w\s\\./:\-*?'\",=]{0,300}"
_PS_SAFE_RE = re.compile(
    r"^(?:" + "|".join(_PS_CMDLETS) + r")(?:\s+" + _PS_ARGS_RE + r")?$",
    re.IGNORECASE,
)

# Version probes only — enough for a Java profile to prove its runtime
# without opening the door to executing arbitrary classes/jars.
_VERSION_ONLY = {"java", "javac"}


def _check_powershell(argv: list[str]) -> list[str]:
    if len(argv) < 3 or "-Command" not in argv:
        raise CommandNotAllowed(
            "powershell may only run '-NoProfile -NonInteractive -Command <one safe cmdlet>'"
        )
    idx = argv.index("-Command")
    if idx != len(argv) - 2:
        raise CommandNotAllowed("powershell accepts exactly one -Command string")
    flags = set(argv[1:idx])
    if not flags.issubset({"-NoProfile", "-NonInteractive"}):
        raise CommandNotAllowed(f"unsupported powershell flags: {sorted(flags)}")
    command = argv[idx + 1]
    if _PS_BANNED.search(command):
        raise CommandNotAllowed("powershell command contains a banned character (; & | $ ` ( ) etc.)")
    if not _PS_SAFE_RE.match(command.strip()):
        raise CommandNotAllowed(
            f"powershell cmdlet not allowlisted (allowed: {sorted(_PS_CMDLETS)})"
        )
    return argv



class CommandNotAllowed(PermissionError):
    pass


def _exe_name(token: str) -> str:
    name = token.replace("\\", "/").rsplit("/", 1)[-1].lower()
    # Any *.exe spelling normalizes to its bare name (git.exe == git),
    # not just the python family.
    if name.endswith(".exe"):
        name = name[:-4]
    return name


def check_allowed(command: list[str] | str) -> list[str]:
    """Validate a command against the allowlist; returns the argv.

    Raises CommandNotAllowed with a clear reason otherwise."""
    if isinstance(command, str):
        try:
            # posix=False keeps Windows backslashes intact inside quoted
            # paths (posix=True would eat \" escapes and mangle C:\paths);
            # surrounding quotes are then stripped token-wise.
            argv = [
                t[1:-1] if len(t) >= 2 and t[0] == t[-1] and t[0] in "\"'" else t
                for t in shlex.split(command, posix=False)
            ]
        except ValueError as exc:
            raise CommandNotAllowed(f"unparseable command: {exc}") from exc
    else:
        argv = list(command)
    if not argv:
        raise CommandNotAllowed("empty command")

    exe = _exe_name(argv[0])

    if exe in ("python", "python3", "py"):
        if len(argv) >= 3 and argv[1] == "-m" and argv[2] in _PYTHON_MODULES:
            return argv
        raise CommandNotAllowed(
            f"python may only run allowlisted modules {_PYTHON_MODULES}; got {argv[1:]}"
        )

    if exe == "pip":
        raise CommandNotAllowed("pip is not allowlisted in v2")

    if exe in ("npm", "pnpm", "yarn", "npx"):
        if exe == "npm" and len(argv) >= 3 and argv[1] == "run" and argv[2] in _NPM_SCRIPTS:
            return argv
        if exe == "npx" and len(argv) >= 2 and argv[1] in {"tsc"}:
            return argv
        raise CommandNotAllowed(
            f"{exe} may only run {_NPM_SCRIPTS} (or 'npx tsc'); got {argv[1:]}"
        )

    if exe in ("powershell", "powershell.exe", "pwsh", "pwsh.exe"):
        return _check_powershell(argv)

    if exe in _VERSION_ONLY:
        if len(argv) == 2 and argv[1] in ("-version", "--version"):
            return argv
        raise CommandNotAllowed(f"{exe} may only run '-version' in v2")

    if exe == "git":
        if len(argv) >= 2 and argv[1] in _GIT_READONLY:
            return argv
        raise CommandNotAllowed(
            f"git is read-only in v2 (allowed: {sorted(_GIT_READONLY)}); got '{argv[1] if len(argv) > 1 else ''}'"
        )

    raise CommandNotAllowed(f"executable not allowlisted: {exe}")


def run_allowed(command: list[str] | str, cwd: str, timeout: int = 180) -> dict:
    """Run an allowlisted command locally; never raises for non-zero exit.

    Each run gets a fresh ``PYTHONPYCACHEPREFIX`` so Python never serves a
    stale ``__pycache__`` entry after the agent rewrote a file within the
    same mtime granularity second (same-size edits would otherwise pass the
    timestamp validation and keep failing/passing against old bytecode)."""
    import os
    import subprocess
    import tempfile

    argv = check_allowed(command)
    env = dict(os.environ)
    env["PYTHONPYCACHEPREFIX"] = tempfile.mkdtemp(prefix="aic-pycache-")
    completed = subprocess.run(
        argv, cwd=cwd, capture_output=True, text=True, timeout=timeout,
        encoding="utf-8", errors="replace", shell=False, env=env,
    )
    return {
        "command": argv,
        "returncode": completed.returncode,
        "stdout": completed.stdout[-4000:],
        "stderr": completed.stderr[-4000:],
        "passed": completed.returncode == 0,
    }
