from __future__ import annotations

import argparse
import json
import sys

from .orchestrator import AfaqOrchestrator


def main() -> int:
    parser = argparse.ArgumentParser(prog="afaq-governed-agent")
    parser.add_argument("--root", required=True)
    sub = parser.add_subparsers(dest="cmd", required=True)
    sub.add_parser("files")
    r = sub.add_parser("read"); r.add_argument("path")
    q = sub.add_parser("search"); q.add_argument("query")
    e = sub.add_parser("edit"); e.add_argument("path"); e.add_argument("--old", required=True); e.add_argument("--new", required=True); e.add_argument("--approve", action="store_true")
    x = sub.add_parser("run"); x.add_argument("command")
    sub.add_parser("status"); sub.add_parser("diff"); sub.add_parser("map")
    args = parser.parse_args()

    orch = AfaqOrchestrator(args.root)
    payload = {}
    if args.cmd == "read": payload = {"path": args.path}
    elif args.cmd == "search": payload = {"query": args.query}
    elif args.cmd == "edit": payload = {"path": args.path, "old": args.old, "new": args.new, "approved": args.approve}
    elif args.cmd == "run": payload = {"command": args.command}
    result = orch.execute(args.cmd, payload)
    print(json.dumps(result, ensure_ascii=False, indent=2, default=str))
    return 0 if result.get("status") in {"COMPLETE", "NOT_VERIFIED"} else 2


if __name__ == "__main__":
    raise SystemExit(main())
