# A Date With Diane

A restored, cleaned, translated, documented, and expanded edition of the original *A Date With Diane*, an old, single-file, JavaScript-driven adult branching text game.

This edition keeps the original narrative flavour while improving the playable experience. It fixes logic and wording issues, removes obsolete image placeholders, adds a back button with state restoration, adds an in-game Gallery for jumping straight to any ending or hidden scene with guided highlighting, adds a dark mode toggle, adds multiple language editions, and documents every verified ending and hidden scene.

**Adult content.** This is an 18+ text-based game with explicit and fetish-related material. The repository is private for that reason.

## Playing

The playable files are in [`outputs/`](outputs/), grouped by language.

| Folder | Language |
|---|---|
| `outputs/en` | English |
| `outputs/cn` | Simplified Chinese |
| `outputs/tw` | Traditional Chinese (Taiwan-flavoured wording) |
| `outputs/es` | Spanish |
| `outputs/fr` | French |

All five are independent editions. Each language folder contains a single-language HTML file, a bilingual HTML file (switches with English; not present for the English-only edition), edition notes, an endings guide with verified ending transcripts, and a hidden scenes guide with verified hidden-scene transcripts. Just open the `.html` file in a browser to play.

There are currently **10 verified endings** and **22 verified hidden scenes** per language.

Every edition has a Gallery button (top of the page once the age gate is passed) listing every ending and hidden scene. Picking one restarts the game and highlights the correct button at each step, so you can play through it yourself rather than just reading a transcript. The existing Back button works through the whole replayed path, and picking a different entry always starts completely fresh.

Pressing "b" is the same as clicking Back. During a guided walkthrough, a "Guide: On/Off" switch sits next to the Back button so you can turn the highlighting off and on as you like without losing your place; it only appears while a guide is active. Pressing "h" is the same as clicking that switch. Pressing "g" opens and closes the Gallery; Escape also closes it. In bilingual editions, "l" switches languages. Number keys 1-9 select the matching choice on screen, the same as clicking it.

A "Dark Mode: On/Off" button next to the Gallery button switches the page between light and dark themes. It's a per-session toggle only — it resets to light mode the next time you open the file.

The stats bar (Pounds, Bladder, and so on) is hidden and frozen at its starting values while you're on the title screen, the notes, further information, and the day-choice screens. It appears once the date itself begins ("On with the story!") and starts changing from there.

## Maintaining

The [`maintenance/`](maintenance/) folder regenerates ending/hidden-scene guides and transcripts, rebuilds Gallery route data, and keeps `aligned_text.json` for cross-language checks. Conventions and settled wording: [`maintenance/AI_HANDOFF.md`](maintenance/AI_HANDOFF.md). File list: [`maintenance/README.txt`](maintenance/README.txt).

Typical regeneration after wording or route edits:

```bash
node maintenance/write_verified_guides.js
node maintenance/write_ending_transcripts.js
node maintenance/write_hidden_scenes.js
```

If Gallery routes or titles changed, also run `node maintenance/build_gallery_data.js`.
