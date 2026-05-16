#!/usr/bin/env bash
# تشغيل المكدس HTTP فقط — من مجلد deploy/
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

docker compose -f docker-compose.http-only.yml pull
docker compose -f docker-compose.http-only.yml up -d
docker compose -f docker-compose.http-only.yml ps
