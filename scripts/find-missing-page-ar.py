# -*- coding: utf-8 -*-
"""Find Arabic text snippets on page potentially missing from translations dict."""
import re
from pathlib import Path

html_text = Path("thiqqah-site/index.html").read_text(encoding="utf-8")
m = re.search(r"const translations = \{([\s\S]*?)\n    \};", html_text)
keys = set(re.findall(r'^[\s]*"([^"]+)":', m.group(1), re.M)) if m else set()

# Remove scripts and styles (avoid translating JS strings that duplicate UI)
body_match = re.search(r"<body[^>]*>([\s\S]*)</body>", html_text)
body = body_match.group(1) if body_match else html_text
body = re.sub(r"<script[\s\S]*?</script>", "", body, flags=re.I)
body = re.sub(r"<style[\s\S]*?</style>", "", body, flags=re.I)

txt = re.sub(r"<[^>]+>", "\n", body)
lines = []
for raw in txt.split("\n"):
    line = raw.strip()
    if not line:
        continue
    if not re.search(r"[\u0600-\u06FF]", line):
        continue
    # Skip purely numeric/symbols noise
    if len(line) < 3:
        continue
    lines.append(line)

unique = sorted(set(lines))
missing = [x for x in unique if x not in keys]

Path("thiqqah-site/_missing-rest-ar.txt").write_text("\n".join(missing), encoding="utf-8")
print("Unique Arabic-ish UI strings:", len(unique))
print("Missing from translations:", len(missing))
raise SystemExit(1 if missing else 0)
