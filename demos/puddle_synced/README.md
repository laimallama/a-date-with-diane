# Synced puddles

Raw Mojique `sの水たまり` is a **22-frame grow** meant for one-shot pees. Current game pees/wets are **full-arc pongs** (~3× longer), so a naive overlay drifts and can “unspread” on reverse.

## What we built

| Output | Role |
|--------|------|
| `demos/puddle_synced/{char}_{06\|07\|08}.gif` | Pee/wet **composites** — puddle baked under sprite (frame-locked) |
| `assets/fx/{char}_{clip}_puddle.gif` | Matching **puddle-only** layers (same frame count as the clip) |
| `assets/fx/puddle_grow.gif` / `puddle_hold.gif` | Shared grow + static hold reference |

## Sync rules

1. Recolor olive puddle toward sprite stream yellow  
2. Translate origin under each clip’s floor splash  
3. Start grow at stream→floor onset  
4. Hold full size through pong reverse and later cycles (no reverse puddle)

Open `demos/puddle_synced.html` for side-by-side compare.
