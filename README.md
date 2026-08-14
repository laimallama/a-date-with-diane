# A Date With Diane (Remastered)

This is a restored, cleaned, and expanded edition of the original *A Date With Diane*, an old omorashi text game.

This edition keeps the original narrative flavour while improving the playable experience: clearer wording and logic, Back with full state restore, an in-game Gallery for endings and hidden scenes (with guided highlighting and Skip to the good bit), dark mode, and five language editions.

## Playing

Playable files are in [`outputs/`](outputs/), grouped by language.

| Folder | Language |
|---|---|
| `outputs/en` | English |
| `outputs/cn` | Simplified Chinese |
| `outputs/tw` | Traditional Chinese (Taiwan) |
| `outputs/es` | Spanish |
| `outputs/fr` | French |

Each language folder contains:

- `dianedate_*.html` — open in a browser to play (bilingual editions switch with English; EN is single-language only)
- `edition_notes_*.txt` — notes on this edition
- `transcripts/endings/` and `transcripts/hidden_scenes/` — **climax transcripts**: each file starts at the climax of the story or the starting point of the hidden scene—the same cut as Skip to the good bit. Gallery order, short filenames, leaf title as heading

There are **no** separate click-path guide text files. The Gallery is the walkthrough. It currently lists **15 ending leaves** and **29 hidden-scene leaves** (variants inside a group each count as a leaf).

**Gallery** (after the age gate): pick an ending or hidden scene to restart with the correct choice highlighted at each step. **Guide: On/Off** (**h**) toggles highlighting. **Skip to the good bit!** (**S**) jumps to the same point the climax transcripts start from. **Back** (**b**) restores full state. **g** / Escape open and close the Gallery. Bilingual: **l** switches language. **1–9** select choices.

**Dark Mode: On/Off** is session-only (resets on a fresh load).

The stats bar stays hidden/frozen on title, notes, further information, and day-choice screens, then appears when the date begins (“On with the story!”).

## Maintaining

Toolkit and conventions: [`maintenance/AI_HANDOFF.md`](maintenance/AI_HANDOFF.md).

All ending/extra Gallery route label sequences live in `write_verified_guides.js`; hidden-scene definitions live in `write_hidden_scenes.js`. There is no separate `routes/` folder.

```bash
node maintenance/write_verified_guides.js   # ending-route smoke test
node maintenance/write_hidden_scenes.js     # hidden-scene definitions check
node maintenance/build_gallery_data.js      # after Gallery route/title changes
node maintenance/write_transcripts.js       # regenerate climax transcripts
```
