#!/usr/bin/env python3
"""Regression gate for CN/TW translation QA. Exit 1 on failures."""
from __future__ import annotations
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROTECT = json.loads((ROOT / "maintenance/qa_protect.json").read_text(encoding="utf-8"))
protect = PROTECT.get("settled_best") or PROTECT.get("protect_substrings") or []

CN = (ROOT / "outputs/cn/dianedate_cn.html").read_text(encoding="utf-8")
TW = (ROOT / "outputs/tw/dianedate_tw.html").read_text(encoding="utf-8")
ALIGNED = json.loads((ROOT / "maintenance/aligned_text.json").read_text(encoding="utf-8"))["entries"]

bad_cn = [
    "不偷看她撒尿",

    "尿了个尿", "小了个便", "尿了个痛快", "步出内裤", "长筒连裤袜", "热火朝天",
    "莞尔", "天造地设", "西高地铁", "换来换去地动", "正面带微笑",
    "馆子方向", "馆子的正门", "馆子门口", "进馆子",
]
# bare pavilion nickname without 凉亭
bare_tingzi = re.findall(r"(?<!凉)亭子", CN)

bad_tw = ["壓小聲音", "筆電電腦", "相冊", "內褲里"]

fails = []
for p in protect:
    # CN file uses simplified; allow either
    if p not in CN and p not in TW:
        # try cross
        if "嘘嘘" in p and "让我去嘘嘘嘛，求你了！" not in CN:
            fails.append(f"missing settled wording in CN: {p}")
        elif "偷看她撒尿" in p and "偷看她撒尿" not in CN:
            fails.append(f"missing settled wording in CN: {p}")
        elif "噓噓" in p and "噓噓" not in TW:
            fails.append(f"missing settled wording in TW: {p}")

if "偷看她撒尿" not in CN:
    fails.append("missing 偷看她撒尿 in CN")
if "让我去嘘嘘嘛，求你了！" not in CN:
    fails.append("missing 嘘嘘 line in CN")

for b in bad_cn:
    if b in CN:
        fails.append(f"banned CN phrase: {b}")
if bare_tingzi:
    fails.append(f"bare 亭子 remains ({len(bare_tingzi)})")
for b in bad_tw:
    if b in TW:
        fails.append(f"banned TW phrase: {b}")
# 長筒襪 should not be shortened wrongly to only 長襪 for stockings — allow 長襪 only if no stockings contexts broken; soft check:
if "長筒襪" not in TW and "长筒袜" in CN:
    fails.append("TW missing 長筒襪 while CN has 长筒袜")

if fails:
    print("FAIL")
    for f in fails:
        print(" -", f)
    sys.exit(1)
print("OK: regression gate passed")
print(f"aligned entries: {len(ALIGNED)}")
