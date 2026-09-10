#!/usr/bin/env python3
"""Bake forward-only multi-spurt wetting GIFs (oneshot, no reverse pong) for all casts."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
PONG_BAK = ASSETS / "_archive" / "wetting_pong_before_oneshot"
FORWARD = {
    "diane": 22,
    "molly": 30,
    "debbie": 29,
    "amanda": 25,
    "chloe": 27,
}
SHADOW = (48, 48, 48)
KEY = (1, 2, 3)


def strip(rgba: np.ndarray) -> np.ndarray:
    m = (
        (rgba[:, :, 0] == SHADOW[0])
        & (rgba[:, :, 1] == SHADOW[1])
        & (rgba[:, :, 2] == SHADOW[2])
        & (rgba[:, :, 3] > 0)
    )
    out = rgba.copy()
    out[m, 3] = 0
    return out


def save_gif(path: Path, frames: list[np.ndarray], durs: list[int], loop: int = 1) -> None:
    indexed = []
    for fr in frames:
        alpha = fr[:, :, 3]
        rgb = fr[:, :, :3].copy()
        rgb[alpha < 16] = KEY
        im = Image.fromarray(rgb, "RGB")
        p = im.quantize(colors=255, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
        pal = p.getpalette() or []
        trans = 0
        for i in range(min(256, len(pal) // 3)):
            if pal[i * 3 : i * 3 + 3] == list(KEY):
                trans = i
                break
        p.info["transparency"] = trans
        indexed.append(p)
    indexed[0].save(
        path,
        save_all=True,
        append_images=indexed[1:],
        duration=durs,
        loop=loop,
        disposal=2,
        transparency=indexed[0].info["transparency"],
        optimize=False,
    )


def main() -> None:
    for cast, n in FORWARD.items():
        live = ASSETS / cast / "06_wetting.gif"
        bak = PONG_BAK / cast / "06_wetting.gif"
        if not bak.exists():
            bak.parent.mkdir(parents=True, exist_ok=True)
            bak.write_bytes(live.read_bytes())
        im = Image.open(bak)
        frames, durs = [], []
        for i in range(min(n, im.n_frames)):
            im.seek(i)
            durs.append(int(im.info.get("duration", 100) or 100))
            frames.append(strip(np.array(im.convert("RGBA"))))
        save_gif(live, frames, durs, loop=1)
        print(f"{cast}: wrote {n}f oneshot → {live.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
