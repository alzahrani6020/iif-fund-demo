#!/usr/bin/env bash
# Wave13 canary cycle on the existing VPS. Fail-closed harness; PRODUCTION_ACTIVE stays false.
set -uo pipefail
cd /opt/afaq-wave13
CANDIDATE_SHA="$CANDIDATE_SHA" BASELINE_SHA="$BASELINE_SHA" \
CANDIDATE_COMMIT="$CANDIDATE_COMMIT" BASELINE_COMMIT="$BASELINE_COMMIT" \
OBS_SECONDS="${OBS_SECONDS:-120}" INTERVAL="${INTERVAL:-5}" \
python3 bin/wave13_canary_host.py cycle \
  --root /opt/afaq-wave13 \
  --baseline-artifact source/wave11-baseline-af0aa367.zip \
  --baseline-release-id wave11-baseline \
  --baseline-sha256 "$BASELINE_SHA" \
  --baseline-source-commit "$BASELINE_COMMIT" \
  --candidate-artifact source/wave12-candidate-6062635d.zip \
  --candidate-release-id wave12-candidate \
  --candidate-sha256 "$CANDIDATE_SHA" \
  --candidate-source-commit "$CANDIDATE_COMMIT" \
  --observation-seconds "$OBS_SECONDS" --interval-seconds "$INTERVAL" \
  --verifier-identity "kimi-code-vps-canary" 2>&1 | tee /opt/afaq-wave13/cycle-output.json
exit "${PIPESTATUS[0]}"
