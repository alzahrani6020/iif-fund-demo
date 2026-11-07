#!/usr/bin/env bash
# Wave13 VPS preflight: snapshot host + SCC state (read-only).
set -euo pipefail
mkdir -p /opt/afaq-wave13/source /opt/afaq-wave13/bin
python3 - <<'PY'
import json, subprocess, shutil, datetime
def run(cmd):
    return subprocess.run(cmd, shell=True, capture_output=True, text=True).stdout.strip()
containers = sorted(run("docker ps --filter name=scc- --format '{{.Names}}'").splitlines())
api = run("curl -s -o /dev/null -w '%{http_code}' --max-time 10 -X POST http://127.0.0.1:3001/auth/login -H 'Content-Type: application/json' -d '{}'")
disk = shutil.disk_usage('/')
snap = {
    "at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "hostname": run('hostname'),
    "kernel": run('uname -r'),
    "python": run('python3 --version'),
    "memory_total_mb": int(run("free -m | awk '/Mem:/{print $2}'")),
    "disk_free_gb": round(disk.free / (1024**3), 2),
    "scc_containers": containers,
    "scc_api_code": api,
}
open('/opt/afaq-wave13/preflight.json', 'w').write(json.dumps(snap, indent=2, sort_keys=True) + '\n')
print(json.dumps(snap, indent=2, sort_keys=True))
PY
