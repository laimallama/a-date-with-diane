#!/usr/bin/env python3
"""Apply CN review decisions (old/new) to aligned_text.json + CN HTML, then rebuild TW."""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REVIEW = Path(__file__).resolve().parent
BASELINE = "8d44c84"


def plain(s: str) -> str:
    return re.sub(r"<[^>]+>", "", s or "")


def load_baseline_cn() -> dict[str, str]:
    entries = json.loads(
        subprocess.check_output(
            ["git", "show", f"{BASELINE}:maintenance/aligned_text.json"],
            text=True,
            cwd=ROOT,
        )
    )["entries"]
    return {e["id"]: e.get("cn") or "" for e in entries}


def replace_cn_keeping_tags(current: str, old_plain: str, new_plain: str, new_raw: str) -> str:
    """Swap CN text; prefer exact plain replace inside tagged string, else use new_raw."""
    cur_plain = plain(current)
    if old_plain and old_plain in current:
        return current.replace(old_plain, new_plain, 1)
    if cur_plain == old_plain and new_raw:
        # keep outer tags from current if shapes match roughly
        if current.startswith("<") and ">" in current:
            # replace innermost text-ish: fall back to new_raw
            return new_raw
        return new_plain
    if new_raw:
        return new_raw
    return new_plain


def main() -> int:
    ap = argparse.ArgumentParser(description="Apply CN old/new review decisions")
    ap.add_argument("decisions", type=Path, help="Path to decisions.json from review.html export")
    ap.add_argument("--skip-tw", action="store_true", help="Do not run write_zh_tw.js")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    payload = json.loads(args.decisions.read_text(encoding="utf-8"))
    decisions = payload.get("decisions") or payload
    if not isinstance(decisions, dict):
        print("decisions.json must contain a decisions object", file=sys.stderr)
        return 1

    diff = json.loads((REVIEW / "diff_data.json").read_text(encoding="utf-8"))
    by_diff = {it["id"]: it for it in diff["items"]}
    baseline = load_baseline_cn()

    aligned_path = ROOT / "maintenance/aligned_text.json"
    aligned = json.loads(aligned_path.read_text(encoding="utf-8"))
    html_paths = [
        ROOT / "outputs/cn/dianedate_cn.html",
        ROOT / "outputs/cn/dianedate_cn_bilingual.html",
    ]
    html_texts = {p: p.read_text(encoding="utf-8") for p in html_paths}

    restore_n = 0
    keep_n = 0
    skip_n = 0
    missing = []
    html_reps: list[tuple[str, str]] = []

    for e in aligned["entries"]:
        eid = e["id"]
        choice = decisions.get(eid)
        if not choice or choice == "skip":
            if choice == "skip":
                skip_n += 1
            continue
        if choice == "new":
            keep_n += 1
            continue
        if choice != "old":
            print(f"ignore unknown choice {eid}={choice!r}")
            continue

        info = by_diff.get(eid)
        old_raw = baseline.get(eid) or (info or {}).get("old_raw") or ""
        old_plain = plain(old_raw) if old_raw else (info or {}).get("old") or ""
        new_plain = plain(e.get("cn"))
        if not old_plain and not old_raw:
            missing.append(eid)
            continue
        if new_plain == old_plain:
            keep_n += 1
            continue

        cur = e.get("cn") or ""
        target_raw = old_raw or old_plain
        target_plain = plain(target_raw)
        # record html replace using plains (unique enough usually)
        if new_plain and target_plain and new_plain != target_plain:
            html_reps.append((new_plain, target_plain))
        e["cn"] = target_raw if (target_raw.startswith("<") or "<" in target_raw) else (
            replace_cn_keeping_tags(cur, new_plain, target_plain, target_raw)
        )
        # If current had tags and baseline raw has tags, prefer baseline raw entirely
        if old_raw:
            e["cn"] = old_raw
        restore_n += 1

    # longest-first html replace to reduce partial clobber
    html_reps = sorted(set(html_reps), key=lambda x: -len(x[0]))
    html_counts = {p: 0 for p in html_paths}
    for p, text in html_texts.items():
        t = text
        for a, b in html_reps:
            if a and a in t:
                c = t.count(a)
                t = t.replace(a, b)
                html_counts[p] += c
        html_texts[p] = t

    print(f"restore old: {restore_n}")
    print(f"keep new:    {keep_n}")
    print(f"skip:        {skip_n}")
    if missing:
        print(f"missing baseline ({len(missing)}):", ", ".join(missing[:20]))
    for p, c in html_counts.items():
        print(f"html {p.name}: {c} replacements")

    if args.dry_run:
        print("dry-run: no files written")
        return 0

    aligned_path.write_text(json.dumps(aligned, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for p, t in html_texts.items():
        p.write_text(t, encoding="utf-8")

    log = {
        "applied_from": str(args.decisions),
        "restore_old": restore_n,
        "keep_new": keep_n,
        "skip": skip_n,
        "missing": missing,
        "html_counts": {p.name: html_counts[p] for p in html_paths},
    }
    (REVIEW / "last_apply_log.json").write_text(
        json.dumps(log, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    if not args.skip_tw:
        print("Running write_zh_tw.js …")
        subprocess.check_call(["node", "maintenance/write_zh_tw.js"], cwd=ROOT)
    print("Done. Consider regenerating guides/transcripts if player-facing lines changed a lot:")
    print("  node maintenance/write_verified_guides.js")
    print("  node maintenance/write_ending_transcripts.js")
    print("  node maintenance/write_hidden_scenes.js")
    print("  node maintenance/write_zh_tw.js")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
