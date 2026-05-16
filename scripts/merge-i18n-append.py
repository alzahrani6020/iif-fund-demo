# -*- coding: utf-8 -*-
from pathlib import Path

base = Path(__file__).resolve().parents[1]
html_path = base / "thiqqah-site/index.html"
frag_path = base / "thiqqah-site/_i18n-append-services.txt"

html = html_path.read_text(encoding="utf-8")
frag = frag_path.read_text(encoding="utf-8").strip()

old = """      \"جميع الخدمات والبحث المتقدم\": \"All services and advanced search\"
    };"""

new = (
    """      \"جميع الخدمات والبحث المتقدم\": \"All services and advanced search\",
"""
    + frag
    + """
    };"""
)

if old not in html:
    raise SystemExit("anchor not found in index.html")

html_path.write_text(html.replace(old, new), encoding="utf-8")
print("Merged", frag.count("\n") + 1, "lines into translations.")
