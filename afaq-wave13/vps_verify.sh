#!/usr/bin/env bash
# Wave13 VPS verification gate: exact SHA256 + manifest source_commit (fail-closed).
set -euo pipefail
cd /opt/afaq-wave13/source
c=$(sha256sum wave12-candidate-6062635d.zip | awk '{print $1}')
b=$(sha256sum wave11-baseline-af0aa367.zip | awk '{print $1}')
echo "candidate_sha256=$c"
echo "baseline_sha256=$b"
[ "$c" = "$CANDIDATE_SHA" ] || { echo "CANDIDATE_SHA_MISMATCH"; exit 1; }
[ "$b" = "$BASELINE_SHA" ] || { echo "BASELINE_SHA_MISMATCH"; exit 1; }
CANDIDATE_SHA="$CANDIDATE_SHA" BASELINE_SHA="$BASELINE_SHA" \
CANDIDATE_COMMIT="$CANDIDATE_COMMIT" BASELINE_COMMIT="$BASELINE_COMMIT" \
python3 - <<'PY'
import json, os, zipfile
def commit(path):
    with zipfile.ZipFile(path) as zf:
        return json.loads(zf.read('RUNTIME_RELEASE_MANIFEST.json'))['source_commit']
c = commit('wave12-candidate-6062635d.zip')
b = commit('wave11-baseline-af0aa367.zip')
assert c == os.environ['CANDIDATE_COMMIT'], f'candidate source_commit {c}'
assert b == os.environ['BASELINE_COMMIT'], f'baseline source_commit {b}'
assert zipfile.ZipFile('wave12-candidate-6062635d.zip').namelist().count('afaq-runtime.py') >= 1
print('VERIFY_PASS sha256+source_commit+runtime-entry')
PY
