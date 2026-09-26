# Visual edition

One visual shell builds all seven standalone and six bilingual text editions.

## Open

Open in a browser (local file is fine):

`outputs/en/dianedate_visual_en.html`

## Rebuild after text-game changes

```bash
node maintenance/build_visual_edition.js
```

The canonical story, runtime, Gallery and language content live in the sibling ADWD source
checkout. The builder reads its thirteen HTML inputs and `source/visual-ui/*.json` directly.
No copied text games or localization snapshots are stored here. Shared edits belong in ADWD;
presentation edits belong here. The visual build embeds:

- `visual/shell.html` — one shared layout template
- `visual/i18n.js` and canonical visual label catalogs — active-language controls, metadata and accessibility labels
- `visual/shell.css` — layout, chrome, shared stage background, and effects styling
- `visual/scene-map.js` — tag → language-neutral location ID and cast focus; explicit exceptions precede legacy matching
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

`node maintenance/build_visual_edition.js --check` detects stale generated pages without writing. The builder requires its injection anchors to exist and fails if the source structure no longer matches. Run `node maintenance/verify_project.js` for core parity, locale catalogs, location and asset inventory checks.

Building and checks require the canonical ADWD source checkout; use `ADWD_TEXT_ROOT` to select its path. The visual verifier proves each generated core script is byte-identical to its canonical input. Route/state tests stay in ADWD; visual adapter behavior and layout require browser checks.

Location labels currently share the same stage background. They are not separate illustrated environments. Back reconstructs presentation from the restored narrative state; it does not serialize a precise GIF playback frame.

Language switches call a text-only refresh. Keep sprite/canvas nodes, drain levels and animation
clocks intact. The adapter wraps navigation and restore; the localization module wraps the
shared language, theme and Skip-display hooks. It does not override core story functions.
