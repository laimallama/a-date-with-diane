# A Date With Diane (Remastered)

This is a restored, cleaned, and expanded edition of the original *A Date With Diane*, an old omorashi text game.

This edition keeps the original narrative flavour while improving the playable experience: clearer wording and logic, Back with full state restore, an in-game Gallery for endings and hidden scenes (with guided highlighting and Skip to the good bit), dark mode, and five language editions.

## Playing

Playable files are in [`outputs/`](outputs/), grouped by language.

| Folder | Language |
|---|---|
| `outputs/en/` | English |
| `outputs/cn/` | Simplified Chinese |
| `outputs/tw/` | Taiwan Mandarin (Traditional) |
| `outputs/es/` | Spanish |
| `outputs/fr/` | French |

Each language folder contains:

- `dianedate_*.html` — open in a browser to play (bilingual editions switch with English; EN is single-language only)
- `transcripts/endings/` and `transcripts/hidden_scenes/` — **climax transcripts**: each file starts at the climax of the story or the starting point of the hidden scene—the same cut as Skip to the good bit. Gallery order, short filenames, leaf title as heading
- `wiki_*.html` — companion setting and character articles; not playable

There are **no** separate click-path guide text files. The Gallery is the walkthrough. It currently lists **15 ending leaves** and **30 hidden-scene leaves** (variants inside a group each count as a leaf).

The game boots on the title screen (no age gate). **Gallery** is available from there: pick an ending or hidden scene to restart with the correct choice highlighted at each step. **Guide: On/Off** (**H**) toggles highlighting. **Skip to the good bit!** (**S**) jumps to the same point the climax transcripts start from. **Back** (**B**) restores full state. **G** / Escape open and close the Gallery. **D** toggles Dark Mode. Bilingual: **L** switches language. **1–9** select choices.

**Dark Mode: On/Off** persists across refresh in the same tab (`sessionStorage`). A new tab starts in light mode.

The stats bar is Diane’s date HUD. It stays hidden on title, notes, further information, and day-choice screens, then appears when the date begins (“On with the story!”). It stays up through same-night prize cards, same-night game-overs (including Amanda downstairs), and the Chloe walk-home stretch (so luckshots stay visible). When you turn for home after leaving Diane, her bladder empties off-screen as usual. It hides again the next morning (the phone call). Chloe and Amanda do not get their own meters.

## Maintaining

Toolkit and conventions: [`maintenance/AI_HANDOFF.md`](maintenance/AI_HANDOFF.md). Companion wiki: [`outputs/en/wiki_en.html`](outputs/en/wiki_en.html).

All ending/extra Gallery click-paths live in `verify_ending_routes.js`; hidden-scene definitions live in `write_hidden_scenes.js`. There is no separate `routes/` folder.

```bash
node maintenance/verify_project.js          # full read-only regression check
node maintenance/verify_ending_routes.js    # read-only ending-route smoke test
node maintenance/write_hidden_scenes.js     # read-only definition check
node maintenance/verify_text_consistency.js # source and rendered bilingual parity
node maintenance/build_aligned_text.js      # refresh the translation reference
node maintenance/build_bilingual_renderer.js # sync alternate-language formatting
node maintenance/build_gallery_data.js      # pack routes into the Gallery HTML
node maintenance/write_transcripts.js       # regenerate climax transcripts
node maintenance/sync_visual_edition.js     # import shared English into ADWD-visual and rebuild it
```

## Runtime and generated files

The playable HTML files contain the maintained story and runtime. The single-language and bilingual editions contain separate copies of that code; shared runtime fixes must reach all nine playable files. Back restores the game variables, rendered page, and text-variation counter. It is session history, not a persistent save system.

Route definitions are maintained in `maintenance/verify_ending_routes.js` and `maintenance/write_hidden_scenes.js`. `maintenance/build_gallery_data.js` generates both `maintenance/gallery_data.json` and the Gallery data embedded in the playable HTML. Regenerate transcripts after rebuilding the Gallery or changing transcript text. Transcript generation validates all routes before writing its managed files and preserves unrelated files.

```bash
node maintenance/build_gallery_data.js --check  # detect stale generated data; no writes
node maintenance/build_aligned_text.js --check  # detect stale reference entries
node maintenance/write_transcripts.js --check   # compare all 225 managed transcripts
node maintenance/verify_project.js              # all 45 Gallery routes in all nine editions
```

The full verifier checks route availability, Back and forward replay, guided progress, Skip, cross-language numerical state, HTML metadata, JavaScript syntax, and generated Gallery consistency. It also checks the translation reference, all managed transcripts, bilingual translation keys, and the rendered output of every static story/choice call in all four bilingual languages. Focused cases cover dynamic notices, text variants, and previously divergent branches. It uses a small DOM stub; browser layout, keyboard interactions, animation timing, translation meaning, and arbitrary untested branch combinations still need separate review. All maintenance commands above resolve project inputs relative to their script location and can be invoked from another working directory with an absolute script path.

The comprehensive audit adds `maintenance/verify_audit_regressions.js` to the canonical verifier. It checks coffee prices and purchase markers for ordinary and automatic orders, coffee narration after each wine choice, theatre wine preorders and water refusals, naturally reachable high-spending routes, the ordinary-bus luckshot cap, and Back/refunds. Synthetic affordability, drinking and boarding boundaries are labelled separately from normal-play witnesses. The theatre order costs £10 even when Diane buys the programme; Pinot coffee narration respects her earlier wine refusal. `maintenance/audit_state_space.js` discovers alternatives through actual choices and reports witnesses, conditional outcomes, and every state-budget cutoff. Its bounded exploration is not proof of exhaustive state coverage.

`maintenance/verify_browser_controls.js` runs actual Chromium, Firefox, and WebKit checks across the nine text games and the generated visual game. It requires Playwright and matching browser binaries; `ADWD_PLAYWRIGHT_MODULE` and `PLAYWRIGHT_BROWSERS_PATH` can point to an existing installation. It accepts `--output=/absolute/path/results.json`, engine/edition selections, and focused `--currency-only`, `--focus-only`, or `--choices-only` checks. Choice checks follow normal routes with single and interleaved choices and verify their DOM containers after Back/replay. It remains a separate browser command because the ordinary verifier needs only Node.js. The browser matrix covers controls and selected layouts, not every narrative route or animation.

The companion wikis are single HTML files, one per language. `maintenance/aligned_text.json` is a generated translation reference, not a game or wiki generator. Its entries identify the source function and one-based call position; dynamic entries retain complete expressions, and text-variation tables are indexed too. Refresh it with `build_aligned_text.js` after text edits. Preserve existing IDs rather than renumbering the index.

Bilingual files use exact-match dictionaries for shared translations and `sAlt` / `cAlt` for context-specific wording. Their alternate-language rendering helpers are generated from the corresponding standalone edition by `build_bilingual_renderer.js`; rebuild those helpers after changing standalone formatting functions.

The separate visual edition is maintained in `/Users/apple/Documents/ADWD-visual` with its own Git repository. This text repository is the canonical source for shared English content. After English story/runtime, route, wiki, transcript, or shared-tool changes, refresh the affected generated files and run `node maintenance/sync_visual_edition.js`. It copies the managed English files, projects the Gallery snapshot to English, and rebuilds the visual edition while preserving its presentation and assets. It does not copy translations or the reference index into the visual repository.

`node maintenance/sync_visual_edition.js --check` checks shared content and the generated visual page without writing. The normal verifier also requires both checkouts to agree. Default paths are sibling `ADWD` and `ADWD-visual` folders; set `ADWD_TEXT_ROOT` / `ADWD_VISUAL_ROOT` for other locations. `verify_project.js --local-only` explicitly checks an isolated checkout without claiming cross-project synchronization. Local fixes do not automatically commit or push either repository.
