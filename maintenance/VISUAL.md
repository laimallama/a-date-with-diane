# Visual presentation

One visual shell builds all seven standalone and six bilingual text editions.

## Open

Open in a browser (local file is fine):

`outputs/en/dianedate_visual_en.html`

## Rebuild after text-game changes

```bash
node maintenance/build_visual_edition.js
```

Story, runtime, Gallery and language content share this repository with the visual source.
The builder reads the thirteen text HTML inputs and `source/visual-ui/*.json` directly.
Shared game changes belong in the common source; presentation changes belong in
`source/visual/`. All outputs are grouped by language in `outputs/`. The visual build embeds:

- `source/visual/shell.html` — one shared layout template
- `source/visual/i18n.js` and canonical visual label catalogs — active-language controls, metadata and accessibility labels
- `source/visual/shell.css` — layout, chrome, shared stage background, and effects styling
- `source/visual/scene-map.js` — tag → language-neutral location ID and cast focus; explicit exceptions precede legacy matching
- `source/visual/puddle-sync.js` and `source/visual/puddle_meta.json` — existing effects timing and metadata
- `source/visual/adapter.js` — hooks `go` / Back / restore; drives sprites + meters

## Cast sprites

`assets/{diane,molly,debbie,amanda,chloe}/` — see the asset notes below.

**Clips:** `pee_a` / `pee_b` = intentional peeing; `wetting` = accident; then `wet_idle`. Duo scenes use equal-size sprites.

## Effect frames and input accessibility

The builder reads the numbered PNG banks under `assets/fx/grow_frames/`, requires contiguous frames starting at `00.png`, and embeds each clip’s `growFrames` count. The effect loader requests exactly that count. A missing expected frame is an error, not a normal end-of-bank marker. Timing stays in `source/visual/puddle_meta.json`; generated frame counts do not replace its timing fields.

Keep visible keyboard focus on the toolbar, story choices, Gallery controls, and visual organ/label controls. The shared Gallery dialog traps focus, makes its background inert, cancels pending navigation, and returns focus on dismissal. Narrow layouts must constrain both sprites and their matching effect canvases so they remain aligned.

Reduced-motion CSS disables the added sprite tremor, REC pulse, and panel/effect transitions. When `prefers-reduced-motion: reduce` is set, the adapter loads matching `*.still.png` frames instead of looping GIFs, skips bladder/JS drain clocks, and the puddle engine paints a held frame instead of running its interval. Wetting still settles on the idle pose, without the timed oneshot.

## Build checks and scope

`node maintenance/build_visual_edition.js --check` detects stale generated pages without writing. The builder requires its injection anchors to exist and fails if the source structure no longer matches. Run `node maintenance/verify_visual_project.js` for core parity, locale catalogs, location and asset inventory checks.

Building and checks use the common repository root. The visual verifier proves each generated core script is byte-identical to its canonical input. It also runs `verify_visual_runtime.js`: all 47 Gallery histories in all thirteen editions through the actual adapter and effect engine, using DOM, image and clock stubs. This checks asset selection, actor/effect positions, replay, Back, language switching, conditional events, cold-load races, Gallery startup, Skip and reduced motion. `--focused` runs just the conditional and navigation cases. Browser pixels, layout and actual GIF playback timing still require a browser review.

Aftermath poses are explicit page facts in `wetCastFor`, so Back reconstructs them and one character's outcome cannot affect another. Wet clothing alone does not create a floor effect. A continuing event retains its load identity across pages; navigation invalidates old completions. Every intentional loop can display REC, while only Diane's event animates her meter. Held effects stop their clock. Event duration comes from the verified clip metadata.

Location labels currently share the same stage background. They are not separate illustrated environments. Back reconstructs presentation from the restored narrative state; it does not serialize a precise GIF playback frame.

Language switches call a text-only refresh. Keep sprite/canvas nodes, drain levels and animation
clocks intact. The adapter wraps navigation and restore; the localization module wraps the
shared language, theme and Skip-display hooks. It does not override core story functions.

## Character sprites (`assets/`)

Transparent GIF animation assets for the visual edition.

### Active folders

| Folder | Character | Extra |
|--------|-----------|-------|
| `diane/` | Diane | — |
| `molly/` | Molly | `08_pee_b.gif` |
| `debbie/` | Debbie | — |
| `amanda/` | Amanda | `08_pee_b.gif` |
| `chloe/` | Chloe | — |

### Files (same names on every character; numbered for sort order)

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

**Shared style (all clips):** 398×398, **10 fps** (100 ms/frame), transparency index 0, nearest-neighbour upscale from source PNG frames. Each live GIF also has a matching `*.still.png` first-frame still. The visual adapter uses those stills when the user prefers reduced motion.

Live puddles in the visual shell use `assets/fx/grow_frames/` PNG banks plus `source/visual/puddle_meta.json`, driven by `source/visual/puddle-sync.js` (frame-locked to pee/wet clips).

`maintenance/verify_visual_support.js` accounts for all 37 GIF/still pairs and all
244 PNG frames across 12 banks. It checks names, contiguous numbering, image headers
and 398×398 dimensions. The builder derives frame counts directly; no `count.txt`
sidecars are needed. Reduced-motion stills and frame-bank images are all live assets.
