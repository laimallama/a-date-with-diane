# Visual edition

Playable visual shell built from the English text game.

## Open

Open in a browser (local file is fine):

`outputs/en/dianedate_visual_en.html`

## Rebuild after text-game changes

```bash
node maintenance/build_visual_edition.js
```

Source of truth for story / Gallery / routes remains `outputs/en/dianedate_en.html`. The visual build injects:

- `visual/shell.css` — layout, chrome, shared stage background, and effects styling
- `visual/scene-map.js` — tag → location ID/label and cast focus; explicit exceptions precede legacy matching
- `visual/puddle-sync.js` and `assets/fx/puddle_meta.json` — existing effects timing and metadata
- `visual/adapter.js` — hooks `go` / Back / restore; drives sprites + meters

## Cast sprites

`assets/{diane,molly,debbie,amanda,chloe}/` — see `assets/README.md`.

**Clips:** `pee_a` / `pee_b` = intentional peeing; `wetting` = accident; then `wet_idle`. Duo scenes use equal-size sprites.

## Build checks and scope

`node maintenance/build_visual_edition.js --check` detects a stale generated page without writing. The builder requires its injection anchors to exist and fails if the source structure no longer matches. Run `node maintenance/verify_project.js` for route/state and location regression checks.

Location labels currently share the same stage background. They are not separate illustrated or 3D environments. Back reconstructs presentation from the restored narrative state; it does not serialize a precise GIF playback frame.

The future Godot version has a separate save/checkpoint design documented in `maintenance/GODOT_PLAN.md`. The browser shell keeps its existing Back control.
