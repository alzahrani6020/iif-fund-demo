#!/usr/bin/env bash
# Wave13 postflight: prove SCC untouched, then print canary state.
set -euo pipefail
api=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 -X POST http://127.0.0.1:3001/auth/login -H 'Content-Type: application/json' -d '{}')
echo "scc_api_code_after=$api"
echo "scc_containers_after:"
docker ps --filter name=scc- --format '{{.Names}} {{.Status}}'
echo "scc_images:"
docker images --filter reference='scc-*' --format '{{.Repository}}:{{.Tag}}'
echo "wave13_releases:"
ls -la /opt/afaq-wave13/releases/ 2>/dev/null || true
echo "current_link=$(readlink /opt/afaq-wave13/current 2>/dev/null || echo none)"
echo "memory_now:"
free -m | head -2
