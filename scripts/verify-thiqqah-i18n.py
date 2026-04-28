# -*- coding: utf-8 -*-
"""Sanity checks for thiqqah-site/index.html: translations keys + shared SEO meta."""
import collections
import re
from pathlib import Path

html = Path("thiqqah-site/index.html").read_text(encoding="utf-8")

m = re.search(r"const translations = \{([\s\S]*?)\n    \};", html)
if not m:
    print("FAIL: could not parse translations block")
    raise SystemExit(1)

keys = re.findall(r'^[\s]*"([^"]+)":', m.group(1), re.M)
ctr = collections.Counter(keys)
dups = [k for k, v in ctr.items() if v > 1]

print("translations keys:", len(keys))
print("duplicate keys:", len(dups))
if dups:
    for k in dups[:40]:
        print(" ", repr(k)[:90], ctr[k])

if "__thiqqahDocumentMeta" not in html:
    print("WARN: __thiqqahDocumentMeta not found")

print("OK" if not dups else "FIX DUPLICATES")
raise SystemExit(1 if dups else 0)
