#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import signal
import subprocess
import sys
import tempfile
import time
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def load_json(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise RuntimeError(f"expected JSON object: {path}")
    return data


def safe_extract(zf: zipfile.ZipFile, dest: Path) -> None:
    root = dest.resolve()
    for info in zf.infolist():
        target = (dest / info.filename).resolve()
        if root != target and root not in target.parents:
            raise RuntimeError(f"unsafe zip entry: {info.filename}")
    zf.extractall(dest)


def verify_bundle(path: Path, expected_sha: str, expected_source_commit: str) -> dict[str, Any]:
    if not path.is_file():
        raise RuntimeError(f"artifact missing: {path}")
    actual = sha256_file(path)
    if actual != expected_sha:
        raise RuntimeError(f"artifact sha256 mismatch: expected={expected_sha} actual={actual}")
    with tempfile.TemporaryDirectory(prefix="afaq-w13-verify-") as tmp:
        tmp_path = Path(tmp)
        with zipfile.ZipFile(path) as zf:
            safe_extract(zf, tmp_path)
        manifest = load_json(tmp_path / "RUNTIME_RELEASE_MANIFEST.json")
        source_commit = str(manifest.get("source_commit") or "")
        if source_commit != expected_source_commit:
            raise RuntimeError(
                f"source_commit mismatch: expected={expected_source_commit} actual={source_commit}"
            )
        if not (tmp_path / "afaq-runtime.py").is_file():
            raise RuntimeError("afaq-runtime.py missing from artifact")
    return {
        "status": "PASS",
        "artifact_sha256": actual,
        "source_commit": expected_source_commit,
    }


def install_release(
    root: Path,
    release_id: str,
    artifact: Path,
    expected_sha: str,
    source_commit: str,
) -> Path:
    verify_bundle(artifact, expected_sha, source_commit)
    releases = root / "releases"
    releases.mkdir(parents=True, exist_ok=True)
    final = releases / release_id
    if final.exists():
        fp = load_json(final / ".wave13-fingerprint.json")
        if fp.get("artifact_sha256") != expected_sha:
            raise RuntimeError(f"release id collision: {release_id}")
        return final
    temp = releases / f".{release_id}.tmp-{os.getpid()}"
    if temp.exists():
        shutil.rmtree(temp)
    temp.mkdir(parents=True)
    with zipfile.ZipFile(artifact) as zf:
        safe_extract(zf, temp)
    fp = {
        "schema": "afaq.wave13-runtime-fingerprint/v1",
        "release_id": release_id,
        "artifact_sha256": expected_sha,
        "source_commit": source_commit,
        "installed_at": utc_now(),
        "artifact_size_bytes": artifact.stat().st_size,
    }
    (temp / ".wave13-fingerprint.json").write_text(
        json.dumps(fp, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    os.replace(temp, final)
    return final


def atomic_symlink(target: Path, link: Path) -> None:
    link.parent.mkdir(parents=True, exist_ok=True)
    tmp = link.with_name(link.name + f".tmp-{os.getpid()}")
    tmp.unlink(missing_ok=True)
    os.symlink(target, tmp)
    os.replace(tmp, link)


def current_release_id(root: Path) -> str | None:
    link = root / "current"
    if not link.is_symlink():
        return None
    try:
        target = link.resolve(strict=True)
    except FileNotFoundError:
        return None
    return target.name


def activate(root: Path, release_id: str) -> dict[str, Any]:
    target = root / "releases" / release_id
    if not target.is_dir():
        raise RuntimeError(f"release not installed: {release_id}")
    previous = current_release_id(root)
    atomic_symlink(target, root / "current")
    record = {
        "schema": "afaq.wave13-activation/v1",
        "activated_at": utc_now(),
        "release_id": release_id,
        "previous_release_id": previous,
    }
    evidence = root / "evidence"
    evidence.mkdir(parents=True, exist_ok=True)
    (evidence / "last-activation.json").write_text(
        json.dumps(record, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    return record


def run_gate(release_dir: Path) -> dict[str, Any]:
    start = time.monotonic()
    proc = subprocess.run(
        [sys.executable, "afaq-runtime.py", "--mode", "full-runtime", "--parallel", "1"],
        cwd=release_dir,
        text=True,
        capture_output=True,
        timeout=60,
        check=False,
    )
    elapsed_ms = round((time.monotonic() - start) * 1000, 1)
    state_path = release_dir / "var/runtime_supervisor/state.json"
    state = load_json(state_path) if state_path.is_file() else {}
    snap = state.get("snapshot") if isinstance(state.get("snapshot"), dict) else {}
    result = {
        "status": "PASS" if proc.returncode == 0 and state.get("state") == "READY" else "FAIL",
        "exit_code": proc.returncode,
        "elapsed_ms": elapsed_ms,
        "runtime_state": state.get("state"),
        "ready_count": snap.get("ready_count"),
        "blocked_count": snap.get("blocked_count"),
        "total": snap.get("total"),
        "stdout_tail": proc.stdout[-4000:],
        "stderr_tail": proc.stderr[-4000:],
    }
    if result["status"] != "PASS":
        raise RuntimeError(json.dumps(result, sort_keys=True))
    return result


def proc_rss_kb(pid: int) -> int | None:
    status = Path(f"/proc/{pid}/status")
    if not status.is_file():
        return None
    for line in status.read_text(encoding="utf-8", errors="replace").splitlines():
        if line.startswith("VmRSS:"):
            parts = line.split()
            return int(parts[1]) if len(parts) >= 2 and parts[1].isdigit() else None
    return None


def observe_continuous(
    release_dir: Path,
    seconds: int,
    interval: int,
) -> dict[str, Any]:
    proc = subprocess.Popen(
        [
            sys.executable,
            "afaq-runtime.py",
            "--mode",
            "continuous",
            "--parallel",
            "1",
            "--interval",
            str(interval),
        ],
        cwd=release_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    samples: list[dict[str, Any]] = []
    state_path = release_dir / "var/runtime_supervisor/state.json"
    started = time.monotonic()
    try:
        deadline = started + seconds
        while time.monotonic() < deadline:
            time.sleep(min(interval, max(0.2, deadline - time.monotonic())))
            alive = proc.poll() is None
            state = load_json(state_path) if state_path.is_file() else {}
            snap = state.get("snapshot") if isinstance(state.get("snapshot"), dict) else {}
            hb = state.get("last_heartbeat_at")
            hb_age = None
            if isinstance(hb, str):
                try:
                    hb_dt = datetime.fromisoformat(hb)
                    hb_age = max(
                        0.0,
                        (datetime.now(timezone.utc) - hb_dt).total_seconds(),
                    )
                except ValueError:
                    pass
            samples.append(
                {
                    "at": utc_now(),
                    "alive": alive,
                    "runtime_state": state.get("state"),
                    "ready_count": snap.get("ready_count"),
                    "blocked_count": snap.get("blocked_count"),
                    "total": snap.get("total"),
                    "heartbeat_age_seconds": (
                        round(hb_age, 3) if hb_age is not None else None
                    ),
                    "rss_kb": proc_rss_kb(proc.pid) if alive else None,
                }
            )
            if not alive:
                break
    finally:
        if proc.poll() is None:
            proc.send_signal(signal.SIGTERM)
            try:
                proc.wait(timeout=max(5, interval + 2))
            except subprocess.TimeoutExpired:
                proc.kill()
                proc.wait(timeout=5)
        out, err = proc.communicate(timeout=5)

    max_hb = interval * 2 + 5
    sample_pass = bool(samples) and all(
        s["alive"]
        and s["runtime_state"] == "RUNNING"
        and isinstance(s["total"], int)
        and s["ready_count"] == s["total"]
        and s["blocked_count"] == 0
        and isinstance(s["heartbeat_age_seconds"], (int, float))
        and s["heartbeat_age_seconds"] <= max_hb
        for s in samples
    )
    result = {
        "status": "PASS" if sample_pass else "FAIL",
        "observation_seconds": round(time.monotonic() - started, 1),
        "sample_count": len(samples),
        "heartbeat_slo_seconds": max_hb,
        "samples": samples,
        "process_exit_code_after_sigterm": proc.returncode,
        "stdout_tail": out[-4000:] if out else "",
        "stderr_tail": err[-4000:] if err else "",
    }
    if result["status"] != "PASS":
        raise RuntimeError(json.dumps(result, sort_keys=True))
    return result


def canary_cycle(args: argparse.Namespace) -> dict[str, Any]:
    root = Path(args.root).resolve()
    root.mkdir(parents=True, exist_ok=True)
    evidence_dir = root / "evidence"
    evidence_dir.mkdir(parents=True, exist_ok=True)

    baseline_dir = install_release(
        root,
        args.baseline_release_id,
        Path(args.baseline_artifact).resolve(),
        args.baseline_sha256,
        args.baseline_source_commit,
    )
    candidate_dir = install_release(
        root,
        args.candidate_release_id,
        Path(args.candidate_artifact).resolve(),
        args.candidate_sha256,
        args.candidate_source_commit,
    )

    baseline_gate = run_gate(baseline_dir)
    baseline_activation = activate(root, args.baseline_release_id)
    candidate_activation = activate(root, args.candidate_release_id)
    candidate_gate = run_gate(candidate_dir)
    observation = observe_continuous(
        candidate_dir,
        args.observation_seconds,
        args.interval_seconds,
    )

    rollback_activation = activate(root, args.baseline_release_id)
    rollback_gate = run_gate(baseline_dir)
    rollback_verified = (
        current_release_id(root) == args.baseline_release_id
        and rollback_gate["status"] == "PASS"
    )
    if not rollback_verified:
        raise RuntimeError("rollback verification failed")

    result = {
        "schema": "afaq.wave13-canary-evidence/v1",
        "status": "PASS",
        "verifier_identity": args.verifier_identity,
        "host": {
            "hostname": os.uname().nodename if hasattr(os, "uname") else None,
            "platform": sys.platform,
            "python": sys.version.split()[0],
        },
        "baseline": {
            "release_id": args.baseline_release_id,
            "artifact_sha256": args.baseline_sha256,
            "source_commit": args.baseline_source_commit,
            "gate": baseline_gate,
            "activation": baseline_activation,
        },
        "candidate": {
            "release_id": args.candidate_release_id,
            "artifact_sha256": args.candidate_sha256,
            "source_commit": args.candidate_source_commit,
            "gate": candidate_gate,
            "activation": candidate_activation,
            "observation": observation,
        },
        "rollback": {
            "artifact_identified": True,
            "release_id": args.baseline_release_id,
            "execution_verified": rollback_verified,
            "activation": rollback_activation,
            "gate": rollback_gate,
        },
        "completed_at": utc_now(),
        "production_active": False,
        "e5_candidate_evidence_complete": True,
    }
    out = evidence_dir / f"wave13-canary-{int(time.time())}.json"
    out.write_text(
        json.dumps(result, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    result["evidence_path"] = str(out)
    return result


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        description="Fail-closed Wave13 exact-artifact canary harness"
    )
    sub = p.add_subparsers(dest="command", required=True)

    v = sub.add_parser("verify")
    v.add_argument("--artifact", required=True)
    v.add_argument("--expected-sha256", required=True)
    v.add_argument("--expected-source-commit", required=True)

    c = sub.add_parser("cycle")
    c.add_argument("--root", required=True)
    c.add_argument("--baseline-artifact", required=True)
    c.add_argument("--baseline-release-id", default="wave11-baseline")
    c.add_argument("--baseline-sha256", required=True)
    c.add_argument("--baseline-source-commit", required=True)
    c.add_argument("--candidate-artifact", required=True)
    c.add_argument("--candidate-release-id", default="wave12-candidate")
    c.add_argument("--candidate-sha256", required=True)
    c.add_argument("--candidate-source-commit", required=True)
    c.add_argument("--observation-seconds", type=int, default=60)
    c.add_argument("--interval-seconds", type=int, default=5)
    c.add_argument("--verifier-identity", default="manual-host-verifier")
    return p


def main() -> int:
    args = build_parser().parse_args()
    if args.command == "verify":
        result = verify_bundle(
            Path(args.artifact).resolve(),
            args.expected_sha256,
            args.expected_source_commit,
        )
    else:
        if args.observation_seconds < 10:
            raise SystemExit("observation-seconds must be >= 10")
        if args.interval_seconds < 1:
            raise SystemExit("interval-seconds must be >= 1")
        result = canary_cycle(args)
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
