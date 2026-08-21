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

The stats bar stays hidden/frozen on title, notes, further information, and day-choice screens, then appears when the date begins (“On with the story!”).

## Maintaining

Toolkit and conventions: [`maintenance/AI_HANDOFF.md`](maintenance/AI_HANDOFF.md). Companion wiki: [`outputs/en/wiki_en.html`](outputs/en/wiki_en.html).

All ending/extra Gallery click-paths live in `verify_ending_routes.js`; hidden-scene definitions live in `write_hidden_scenes.js`. There is no separate `routes/` folder.

```bash
node maintenance/verify_ending_routes.js    # ending-route smoke test
node maintenance/write_hidden_scenes.js     # hidden-scene definitions check
node maintenance/build_gallery_data.js      # pack routes into the Gallery HTML
node maintenance/write_transcripts.js       # regenerate climax transcripts
```
