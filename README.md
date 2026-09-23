# A Date with Diane — Visual editions

Five standalone languages and four English/local bilingual editions share one visual shell,
scene map and asset library. ADWD supplies the unchanged game scripts and settled translations.

## Play

Open a visual HTML file in a browser; no server or installation is required.

| Language | Standalone | With English |
|---|---|---|
| English | [Play](outputs/en/dianedate_visual_en.html) | — |
| 简体中文 | [开始](outputs/cn/dianedate_visual_cn.html) | [双语](outputs/cn/dianedate_visual_cn_bilingual.html) |
| 台灣繁體中文 | [開始](outputs/tw/dianedate_visual_tw.html) | [雙語](outputs/tw/dianedate_visual_tw_bilingual.html) |
| Español | [Jugar](outputs/es/dianedate_visual_es.html) | [Bilingüe](outputs/es/dianedate_visual_es_bilingual.html) |
| Français | [Jouer](outputs/fr/dianedate_visual_fr.html) | [Bilingue](outputs/fr/dianedate_visual_fr_bilingual.html) |

The visual edition adds animated character sprites, location labels, organ meters and a
responsive story/stage layout. Bilingual language buttons switch the story, Gallery and
visual interface together without restarting the current animation. Chinese editions use
native font stacks; Spanish and French use decimal commas and a trailing pound sign.

Gallery retains **15 ending leaves** and **31 hidden-scene leaves**, with the same routes,
ordering and start/end boundaries as the text editions. There is no Variations interface.
The visual toolbar shortens the Skip command; its behavior is unchanged.

**B** goes Back, **G** / Escape opens or closes Gallery, **H** toggles the active guide,
**S** skips to the designated scene start, **D** toggles dark mode, **L** switches bilingual
language, and **1–9** select choices. Dark mode persists in the same tab. Back restores
narrative state and reconstructs the visual presentation; it does not restore an exact GIF
frame or provide a persistent save. Reduced-motion preferences use stills and held effects.

## Development and small playable folders

This GitHub repository contains the visual authoring source and generated releases.
The canonical text source is [a-date-with-diane](https://github.com/laimallama/a-date-with-diane).
Clone the two repositories into sibling `ADWD` and `ADWD-visual` development folders.

The visual builder reads all nine canonical HTML inputs and the five visual label catalogs
straight from ADWD. No non-visual game, wiki, transcript, copied locale catalog or synchronization
receipt is kept here. Existing generated visual pages are self-contained apart from graphics;
playing them does not require ADWD or any build tools.

```bash
node maintenance/build_visual_edition.js
node maintenance/verify_project.js
```

Use `--check` with the builder to verify without writing. Both building and verification
need the canonical source checkout; set `ADWD_TEXT_ROOT` if it is elsewhere. ADWD's tools
use `ADWD_VISUAL_ROOT` for a nonstandard visual checkout. Commands never commit or push.

The visual verifier checks exact game-script parity for all nine editions, Gallery leaf
counts, complete label catalogs, script syntax, generated freshness, scene-map regressions
and all assets. ADWD owns route/state/transcript tests. Its browser verifier covers all nine
visual editions, language switching, navigation, localization and responsive layout. Use
`--editions=visual,visual-cn,visual-cn-bilingual,visual-tw,visual-tw-bilingual,visual-es,visual-es-bilingual,visual-fr,visual-fr-bilingual --currency`.

From the ADWD source checkout, run:

```bash
node maintenance/export_games.js /path/to/new-release-folder
```

This creates two play-only folders. The visual export contains nine HTML games, 318 image
assets and a playing README. The text export holds nine text games and the sole copy of
five wikis and 230 transcripts. No Git metadata, dependency installation, source/build files
or duplicated companions are exported. Keep `assets/` beside `outputs/` in the visual folder.

The source checkout retains `visual/`, the builder, two verifiers, asset metadata and
maintenance documentation because they are needed to develop the game. With ADWD's pinned
development dependencies installed, format/check visual source through
`node ../ADWD/maintenance/format_sources.js --visual` and
`node ../ADWD/maintenance/verify_maintenance.js --visual`. A second dependency tree is unnecessary.

See [maintenance conventions](maintenance/AI_HANDOFF.md) and [presentation notes](visual/README.md).
