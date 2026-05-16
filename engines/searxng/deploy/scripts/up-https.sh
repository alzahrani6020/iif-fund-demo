#!/usr/bin/env bash
# تشغيل المكدس مع HTTPS — من مجلد deploy/
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -f .env ]; then
	echo "أنشئ ملف .env من env.example وعيّن SEARXNG_HOST."
	exit 1
fi

docker compose pull
docker compose up -d
docker compose ps
