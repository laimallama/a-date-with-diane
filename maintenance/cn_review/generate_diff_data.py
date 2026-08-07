#!/usr/bin/env python3
"""Build old-vs-new CN review data (pre-fluency baseline vs current aligned_text.json)."""
from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
BASELINE = "8d44c84"


def plain(s: str) -> str:
    return re.sub(r"<[^>]+>", "", s or "")


def main() -> None:
    old_entries = json.loads(
        subprocess.check_output(
            ["git", "show", f"{BASELINE}:maintenance/aligned_text.json"],
            text=True,
            cwd=ROOT,
        )
    )["entries"]
    old_by = {e["id"]: e for e in old_entries}
    cur = json.loads((ROOT / "maintenance/aligned_text.json").read_text(encoding="utf-8"))
    items = []
    for e in cur["entries"]:
        eid = e["id"]
        o = plain(old_by.get(eid, {}).get("cn"))
        n = plain(e.get("cn"))
        if o == n:
            continue
        if not o and not n:
            continue
        items.append(
            {
                "id": eid,
                "kind": e.get("kind") or "",
                "en": plain(e.get("en")),
                "old": o,
                "new": n,
                "old_raw": old_by.get(eid, {}).get("cn") or "",
                "new_raw": e.get("cn") or "",
            }
        )
    tip = subprocess.check_output(
        ["git", "rev-parse", "--short", "HEAD"], text=True, cwd=ROOT
    ).strip()
    data = {
        "meta": {
            "baseline_commit": BASELINE,
            "baseline_note": "CN before full fluency pass",
            "current_note": "CN at generate time",
            "count": len(items),
            "generated_from": tip,
        },
        "items": items,
    }
    out = OUT / "diff_data.json"
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {out} ({len(items)} items)")


if __name__ == "__main__":
    main()
