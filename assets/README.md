# Character sprites (`assets/`)

Transparent GIF animation assets for the visual edition. Art © Ao Kurage (Mojique), adapted for ADWD.

## Active folders

| Folder | Character | Extra |
|--------|-----------|-------|
| `diane/` | Diane | — |
| `molly/` | Molly | `08_pee_b.gif` |
| `debbie/` | Debbie | — |
| `amanda/` | Amanda | `08_pee_b.gif` |
| `chloe/` | Chloe | — |

## Files (same names on every character; numbered for sort order)

| File | Use |
|------|-----|
| `01_calm.gif` | Comfortable |
| `02_need_pee.gif` | Needs to go |
| `03_desperate_pee.gif` | Desperate |
| `04_critical_pee.gif` | Critical |
| `05_wet_idle.gif` | Already wet (after accident) |
| `06_wetting.gif` | Forward event sequence; the shell switches to `05_wet_idle.gif` after one pass |
| `07_pee_a.gif` | Intentional pee |
| `08_pee_b.gif` | Second pee pose (Molly & Amanda only) |

`07` / `08` use full-arc bidirectional loops. Active `06` files are forward sequences, not the old bidirectional loops. Their one-pass durations are Diane 2.2 s, Molly 3.0 s, Debbie 2.9 s, Amanda 2.5 s, and Chloe 2.7 s. The adapter controls the transition to the idle clip; the files themselves contain finite-repeat GIF metadata.

**Shared style (all clips):** 398×398, **10 fps** (100 ms/frame), transparency index 0, nearest-neighbour upscale from Mojique `Pictures` PNGs.

Live puddles in the visual shell use `assets/fx/` + `visual/puddle-sync.js` (frame-locked to pee/wet clips).

## Archive (not used in-game)

`_archive/` — short **original** pee/wet one-shots plus puddle/stream FX, kept for reference. See `_archive/README.md`.
