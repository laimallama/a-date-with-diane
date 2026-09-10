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

- `visual/shell.css` — chrome + location backdrops
- `visual/scene-map.js` — tag → location + cast focus
- `visual/adapter.js` — hooks `go` / Back / restore; drives sprites + meters

## Cast sprites

`assets/{diane,molly,debbie,amanda,chloe}/` — see `assets/README.md`.

**Clips:** `pee_a` / `pee_b` = intentional peeing; `wetting` = accident; then `wet_idle`. Duo scenes use equal-size sprites.
