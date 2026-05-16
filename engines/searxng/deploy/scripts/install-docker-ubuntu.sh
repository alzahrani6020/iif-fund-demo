#!/usr/bin/env bash
# تثبيت Docker Engine + Compose على Ubuntu/Debian (صلاحيات sudo)
set -euo pipefail

if ! command -v curl >/dev/null 2>&1; then
	echo "ثبّت curl أولاً: sudo apt-get update && sudo apt-get install -y curl"
	exit 1
fi

if [ "$(id -u)" -eq 0 ]; then
	SUDO=""
else
	SUDO="sudo"
fi

curl -fsSL https://get.docker.com | $SUDO sh

if [ -n "${SUDO:-}" ]; then
	$SUDO usermod -aG docker "${SUDO_USER:-$USER}" 2>/dev/null || true
fi

echo "تم. سجّل خروجاً ثم دخولاً (أو newgrp docker) لتشغيل docker بدون sudo."
