#!/usr/bin/env python3
"""
Strip baked foot-contact shadows (solid RGB 48,48,48 ovals) from cast GIFs.

Stage CSS drop-shadow still grounds the sprite; the hard oval fought dynamic puddles.
Backs up originals once under assets/_archive/with_foot_shadows/.
"""
from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
BACKUP = ASSETS / "_archive" / "with_foot_shadows"
CASTS = ("diane", "molly", "debbie", "amanda", "chloe")
SHADOW_RGB = (48, 48, 48)


def shadow_palette_indices(pal: list[int] | None) -> set[int]:
    if not pal:
        return set()
    hits = set()
    n = min(256, len(pal) // 3)
    for i in range(n):
        r, g, b = pal[i * 3], pal[i * 3 + 1], pal[i * 3 + 2]
        if (r, g, b) == SHADOW_RGB:
            hits.add(i)
    return hits


def strip_frame(im: Image.Image) -> tuple[Image.Image, int]:
    """Return (P-mode frame, pixels cleared). Preserves palette + transparency index."""
    frame = im.convert("P")
    pal = frame.getpalette()
    hits = shadow_palette_indices(pal)
    if not hits:
        # Fallback: RGBA exact match (re-quantize path unused for these assets)
        rgba = np.array(im.convert("RGBA"))
        mask = (
            (rgba[:, :, 0] == SHADOW_RGB[0])
            & (rgba[:, :, 1] == SHADOW_RGB[1])
            & (rgba[:, :, 2] == SHADOW_RGB[2])
            & (rgba[:, :, 3] > 0)
        )
        cleared = int(mask.sum())
        if cleared:
            rgba[mask, 3] = 0
            return Image.fromarray(rgba).convert("P", palette=Image.ADAPTIVE, colors=255), cleared
        return frame.copy(), 0

    arr = np.array(frame)
    mask = np.zeros(arr.shape, dtype=bool)
    for idx in hits:
        mask |= arr == idx
    cleared = int(mask.sum())
    if not cleared:
        return frame.copy(), 0

    trans = frame.info.get("transparency", 0)
    if isinstance(trans, bytes):
        trans = 0
    arr = arr.copy()
    arr[mask] = int(trans) if isinstance(trans, int) else 0
    out = Image.fromarray(arr, mode="P")
    out.putpalette(pal)
    out.info["transparency"] = frame.info.get("transparency", 0)
    return out, cleared


def process_gif(src: Path, dst: Path) -> int:
    im = Image.open(src)
    frames: list[Image.Image] = []
    durations: list[int] = []
    total_cleared = 0
    transparency = im.info.get("transparency", 0)

    for i in range(im.n_frames):
        im.seek(i)
        durations.append(int(im.info.get("duration", 100) or 100))
        fr, cleared = strip_frame(im)
        total_cleared += cleared
        frames.append(fr)

    if not frames:
        raise RuntimeError(f"no frames: {src}")

    save_kw = dict(
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=im.info.get("loop", 0),
        disposal=2,
        optimize=False,
    )
    # Keep transparency index when present
    if transparency is not None:
        save_kw["transparency"] = transparency

    dst.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(dst, **save_kw)
    return total_cleared


def main() -> None:
    targets: list[Path] = []
    for cast in CASTS:
        d = ASSETS / cast
        if not d.is_dir():
            continue
        targets.extend(sorted(d.glob("*.gif")))

    if not targets:
        raise SystemExit("no cast GIFs found")

    print(f"Backing up to {BACKUP.relative_to(ROOT)} (skip existing)…")
    for src in targets:
        bak = BACKUP / src.relative_to(ASSETS)
        if not bak.exists():
            bak.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, bak)

    print(f"Stripping RGB{SHADOW_RGB} foot shadows from {len(targets)} GIFs…")
    grand = 0
    for src in targets:
        # Always strip from backup so re-runs are idempotent
        bak = BACKUP / src.relative_to(ASSETS)
        source = bak if bak.exists() else src
        cleared = process_gif(source, src)
        grand += cleared
        print(f"  {src.relative_to(ROOT)}  cleared={cleared}")

    print(f"Done. Total shadow pixels cleared: {grand}")


if __name__ == "__main__":
    main()
