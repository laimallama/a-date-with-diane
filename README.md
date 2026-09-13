# A Date With Diane — visual

This folder is **ADWD-visual**: an English-only sandbox for a visual / visual-novel version of *A Date With Diane*.

The finished **text** game (five languages, Gallery, transcripts, wiki) lives in the original tree and on GitHub. That edition is settled. Do not treat this copy as a place to keep shipping CN/TW/ES/FR or bilingual HTML.

| | Path |
|---|---|
| Settled text edition | `/Users/apple/Documents/ADWD` |
| GitHub (text edition) | https://github.com/laimallama/a-date-with-diane.git |
| This sandbox | `/Users/apple/Documents/ADWD-visual` |
| GitHub (visual edition) | https://github.com/laimallama/a-date-with-diane-visual.git |

Keep this repo separate from the text edition. Do not push visual work to `a-date-with-diane`.

## English only

Playable files are under [`outputs/en/`](outputs/en/):

- `dianedate_en.html` — open in a browser
- `transcripts/endings/` and `transcripts/hidden_scenes/` — climax transcripts (same cut as Skip to the good bit)
- `wiki_en.html` — companion wiki; not playable

There is no `outputs/cn`, `tw`, `es`, or `fr` here. Translation indexes (`aligned_text.json`, bilingual dictionaries) were removed; they belong with the old text editions.

The Gallery is the walkthrough: **15 ending leaves** and **30 hidden-scene leaves**.

The game boots on the title screen (no age gate). **Gallery** is available from there. **Guide: On/Off** (**H**) toggles highlighting. **Skip to the good bit!** (**S**) jumps to the same point the climax transcripts start from. **Back** (**B**) restores full state. **G** / Escape open and close the Gallery. **D** toggles Dark Mode. **1–9** select choices.

## Maintaining

Conventions: [`maintenance/AI_HANDOFF.md`](maintenance/AI_HANDOFF.md).

```bash
node maintenance/verify_ending_routes.js    # English ending-route smoke test
node maintenance/write_hidden_scenes.js     # hidden-scene definitions check
node maintenance/build_gallery_data.js      # pack routes into the Gallery HTML
node maintenance/write_transcripts.js       # regenerate English climax transcripts
```
