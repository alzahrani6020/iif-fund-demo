#!/usr/bin/env python3
"""عدّ تقريبي لمحركات SearXNG بدون PyYAML (تحليل بسيط للكتل)."""
import re
from pathlib import Path

def parse_engine_blocks(text):
    """يقسّم على '- name:' كبداية كتلة."""
    blocks = re.split(r"\n(?=\s*-\s*name:\s)", text)
    return [b for b in blocks if re.match(r"\s*-\s*name:\s", b, re.M)]

def block_enabled(block):
    if re.search(r"^\s*disabled:\s*true\s*$", block, re.M):
        return False
    return True

def main():
    default_path = Path("/usr/local/searxng/searx/settings.yml")
    user_path = Path("/etc/searxng/settings.yml")
    text = default_path.read_text(encoding="utf-8")
    # قسم engines فقط
    m = re.search(r"^engines:\s*\n", text, re.M)
    if not m:
        print("لم يُعثر على engines:")
        return
    start = m.end()
    rest = text[start:]
    # حتى المفتاح الجذري التالي على عمود 0
    m2 = re.search(r"^[a-zA-Z_][a-zA-Z0-9_]*:\s*$", rest[1:], re.M)
    engines_text = rest if not m2 else rest[: m2.start() + 1]
    blocks = parse_engine_blocks(engines_text)
    total = len(blocks)
    enabled = sum(1 for b in blocks if block_enabled(b))

    removed = []
    if user_path.exists():
        ut = user_path.read_text(encoding="utf-8")
        rm = re.search(r"remove:\s*\n((?:\s+-\s+\w+\s*\n)+)", ut)
        if rm:
            removed = re.findall(r"^\s+-\s+(\S+)\s*$", rm.group(1), re.M)

    # استخراج الاسم من كل كتلة
    names_enabled = []
    names_all = []
    for b in blocks:
        nm = re.search(r"^\s*-\s*name:\s*(.+)$", b, re.M)
        if not nm:
            continue
        name = nm.group(1).strip().strip('"\'')
        names_all.append(name)
        if block_enabled(b) and name not in removed:
            names_enabled.append(name)

    print("تعريفات المحركات (كتل name في الملف الافتراضي):", total)
    print("مفعّلة افتراضياً (بدون disabled: true في الكتلة):", enabled)
    print("مُزالة بإعدادكم (remove):", removed or "لا شيء")
    print("—")
    print("محركات يُستعان بها فعلياً (تقريب: مفعّلة وغير مُزالة):", len(names_enabled))
    names_enabled.sort()
    for n in names_enabled[:20]:
        print("  ·", n)
    if len(names_enabled) > 20:
        print("  … و", len(names_enabled) - 20, "أخرى")

if __name__ == "__main__":
    main()
