# A Date with Diane (Visual)

This is a restored, polished and expanded edition of the original *A Date with Diane*, an omorashi text adventure. Your choices shape an evening with Diane. The day, meals, drinks, conversations and journey home can lead to different scenes and endings.

The remaster keeps the original British narrative voice while improving wording, continuity and navigation. It includes seven languages, six bilingual editions, Back with full state restore, an in-game Gallery, guided fast-forward, Skip to the good bit, and light and dark themes.

The visual editions add animated character sprites, location labels and graphical meters to the same story, choices and Gallery routes. The layout adapts to computers, phones and tablets. Reduced-motion preferences use still images and held effects.

## Playing

Open an HTML game in your browser. No installation, server or internet connection is needed to play. The files are grouped by language:

| Folder | Language |
|---|---|
| `outputs/en/` | English |
| `outputs/cn/` | Simplified Chinese |
| `outputs/tw/` | Taiwan Mandarin (Traditional Chinese) |
| `outputs/es/` | Spanish |
| `outputs/fr/` | French |
| `outputs/de/` | German |
| `outputs/ja/` | Japanese |

Open `outputs/en/dianedate_visual_en.html` for English. Other standalone games use `dianedate_visual_<language>.html`; bilingual games add `_bilingual` before `.html`. Switching language updates the story, Gallery and visual interface without restarting the current animation.

## What is included

This folder contains thirteen visual games and 318 shared image assets. Keep `assets/` beside `outputs/`, preserving their folder structure.

The companion wikis and transcripts are kept once in the sibling ADWD folder, under `outputs/<language>/`. Each language has a `wiki_<language>.html` file and a `transcripts/` folder. The transcripts follow Gallery order, titles and scene boundaries. Text-only games are also kept in ADWD. These references are optional; the visual games run without the ADWD folder.

## Gallery and controls

The Gallery contains 15 ending routes and 32 hidden-scene routes. It is available from the title screen and supplies the walkthroughs. Choose an entry to start its route, then follow the highlighted Guide choices.

| Key | Action |
|---|---|
| **1–9** | Select a choice. |
| **G** / **Esc** | Open / close the Gallery. |
| **H** | Turn the active Guide on or off. |
| **Enter** | Follow the highlighted Guide choice. Hold to fast-forward; release to stop. |
| **B** | Use the Back button. Hold to rewind quickly; release to stop. |
| **S** | Skip to the climax while following an ending Guide. |
| **D** | Toggle dark mode. |
| **L** | Switch language in a bilingual edition. |

Skip is available once per newly started ending Guide. Going back can take you before the skipped point, but does not make Skip available again. Turning the Guide off removes Skip and stops fast-forward. The in-game Notes explain the controls in each language.

Dark mode persists across refreshes in the same tab. A new tab starts in light mode. Back restores the previous page, choices and game state within the current session; it is not a persistent save.

The visual toolbar calls the skip command **Skip**. It has the same behaviour as **Skip to the good bit!** in the text editions. Back reconstructs the visual presentation from the restored state; it does not restore an exact animation frame.

## Maintaining

The local folder keeps the same maintained file layout as the GitHub repository `laimallama/a-date-with-diane-visual`:

- `outputs/` contains the thirteen visual games.
- `assets/` contains the graphics, effect metadata and asset notes.
- `maintenance/` contains the builder, verification tools and editing conventions.
- `visual/` contains the shared document template, styles, scene map, interface and animation code.
- `.gitignore` excludes temporary files from version control.

The local installation has no `.git` history or installed dependency folder. Maintenance uses the sibling ADWD source and its pinned development dependencies; a second dependency installation is unnecessary.

The current local installation contains later manual German/Japanese edits that are absent from the maintained source. Restoring maintenance files does not import those edits. Read `maintenance/AI_HANDOFF.md` before rebuilding, and account for the local differences before replacing any installed outputs.

Use Node.js 20 or newer. Run `npm ci` in ADWD when its development dependencies are needed. From ADWD-visual:

```bash
node maintenance/build_visual_edition.js --check
node maintenance/verify_project.js
```

To regenerate visual games after an approved source change, run `node maintenance/build_visual_edition.js` without `--check`. It reads all thirteen text games and the visual label catalogs from ADWD. Set `ADWD_TEXT_ROOT` if that folder is elsewhere. ADWD's tools use `ADWD_VISUAL_ROOT` for a nonstandard visual location. Commands never commit or push automatically.

Read `maintenance/AI_HANDOFF.md` before editing. `visual/README.md` explains presentation behaviour; `assets/README.md` describes the graphics. Shared story and translation changes belong in ADWD, while visual presentation changes belong here.

Verification checks game-script parity, generated freshness, interface labels, scene mapping and assets. Simulated runtime tests cover presentation state, Back, language switching, Skip, reduced motion and loading races. Browser layout and actual animation playback require separate browser checks.

For a separate play-only copy, run ADWD's `maintenance/export_games.js` with a new destination. Such exports omit maintenance files and keep the wikis and transcripts only in ADWD. The normal local folders retain their maintenance support.
