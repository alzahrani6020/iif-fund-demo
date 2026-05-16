# -*- coding: utf-8 -*-
import re
from pathlib import Path

html = Path("thiqqah-site/index.html").read_text(encoding="utf-8")
m = re.search(r"const translations = \{([\s\S]*?)\n    \};", html)
if not m:
    raise SystemExit("no translations")
block = m.group(1)
keys = set(re.findall(r'^\s+"([^"]+)":', block, re.M))

sg = re.search(
    r'<div class="services-grid">([\s\S]*?)</div>\s*</div>\s*</section>\s*<section id="categories">',
    html,
)
if not sg:
    raise SystemExit("no services grid")
grid = sg.group(1)
cards = re.findall(r'<article class="service-card">([\s\S]*?)</article>', grid)
texts = set()
for c in cards:
    t = re.sub(r"<[^>]+>", "\n", c)
    for line in t.split("\n"):
        line = line.strip()
        if line and not line.isdigit() and len(line) > 1:
            texts.add(line)

missing = sorted(texts - keys)
Path("thiqqah-site/_missing-i18n-service-cards.txt").write_text(
    "\n".join(missing), encoding="utf-8"
)
print("Total texts in cards:", len(texts))
print("Missing keys:", len(missing))
print("Wrote thiqqah-site/_missing-i18n-service-cards.txt")
