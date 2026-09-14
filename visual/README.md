# Visual edition

Playable visual shell built from the English text game.

## Open

Open in a browser (local file is fine):

`outputs/en/dianedate_visual_en.html`

## Rebuild after text-game changes

```bash
node maintenance/build_visual_edition.js
```

The canonical story, runtime, Gallery routes, wiki, and transcripts live in the sibling ADWD repository. A normal visual build automatically imports the managed English files into this checkout before reading `outputs/en/dianedate_en.html`. You can also run `node maintenance/sync_visual_edition.js` from either repository. Shared edits belong in canonical ADWD; presentation edits belong here. The visual build injects:

- `visual/shell.css` — layout, chrome, shared stage background, and effects styling
- `visual/scene-map.js` — tag → location ID/label and cast focus; explicit exceptions precede legacy matching
- `visual/puddle-sync.js` and `assets/fx/puddle_meta.json` — existing effects timing and metadata
- `visual/adapter.js` — hooks `go` / Back / restore; drives sprites + meters

## Cast sprites

`assets/{diane,molly,debbie,amanda,chloe}/` — see `assets/README.md`.

**Clips:** `pee_a` / `pee_b` = intentional peeing; `wetting` = accident; then `wet_idle`. Duo scenes use equal-size sprites.

## Effect frames and input accessibility

The builder reads the numbered PNG banks under `assets/fx/grow_frames/`, requires contiguous frames starting at `00.png`, and embeds each clip’s `growFrames` count. The effect loader requests exactly that count. A missing expected frame is an error, not a normal end-of-bank marker. Timing stays in `assets/fx/puddle_meta.json`; generated frame counts do not replace its timing fields.

Keep visible keyboard focus on the toolbar, story choices, Gallery controls, and visual organ/label controls. The shared Gallery dialog traps focus, makes its background inert, cancels pending navigation, and returns focus on dismissal. Narrow layouts must constrain both sprites and their matching effect canvases so they remain aligned.

Reduced-motion CSS disables the added sprite tremor, REC pulse, and panel/effect transitions. When `prefers-reduced-motion: reduce` is set, the adapter loads matching `*.still.png` frames instead of looping GIFs, skips bladder/JS drain clocks, and the puddle engine paints a held frame instead of running its interval. Wetting still settles on the idle pose, without the timed oneshot.

## Build checks and scope

`node maintenance/build_visual_edition.js --check` detects a stale generated page without writing. The builder requires its injection anchors to exist and fails if the source structure no longer matches. Run `node maintenance/verify_project.js` for route/state and location regression checks.

Default checks also reject drift from canonical ADWD. `--local-only` explicitly builds/checks an isolated carried snapshot without upstream verification. The visual verifier replays both the companion and generated core; visual adapter behavior still requires browser checks.

Location labels currently share the same stage background. They are not separate illustrated environments. Back reconstructs presentation from the restored narrative state; it does not serialize a precise GIF playback frame.
