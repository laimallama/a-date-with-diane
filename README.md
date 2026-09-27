# A Date with Diane (Remastered)

This is a restored, polished and expanded edition of the original *A Date with Diane*, an omorashi text adventure. Your choices shape an evening with Diane. The day, meals, drinks, conversations and journey home can lead to different scenes and endings.

The remaster keeps the original British narrative voice while improving wording, continuity and navigation. It includes seven languages, six bilingual editions, Back with full state restore, an in-game Gallery, guided fast-forward, Skip to the good bit, and light and dark themes.

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

Open `outputs/en/dianedate_en.html` for English. Other standalone games use `dianedate_<language>.html`; bilingual games add `_bilingual` before `.html`. Bilingual editions let you switch between English and the other language during play. Taiwan Mandarin uses native local wording rather than a character conversion of Simplified Chinese.

## What is included

There are thirteen self-contained text games, covering five main prize endings, consolation endings and hidden scenes. Each language folder also contains:

- `wiki_<language>.html`, a companion reference to the setting and characters.
- `transcripts/endings/`, the ending transcripts.
- `transcripts/hidden_scenes/`, the hidden-scene transcripts.

The seven wikis and 329 transcripts are kept here, with no duplicate copies in ADWD-visual. Transcripts follow Gallery order and titles. Ending transcripts begin at the climax reached by Skip to the good bit; hidden-scene transcripts begin at the scene's starting point. The separate ADWD-visual folder contains the visual editions.

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

## Maintaining

The local folder keeps the same maintained file layout as the GitHub repository `laimallama/a-date-with-diane`:

- `outputs/` contains the games, wikis and transcripts.
- `maintenance/` contains build tools, verification tools, change records and editing conventions.
- `source/` contains the shared story code, seven language catalogs, interface labels, styles, document templates and wiki articles.
- `package.json` defines development commands and dependencies. `package-lock.json` pins their versions.
- `.prettierrc.json` defines source formatting. `.gitignore` excludes temporary files and installed dependencies from version control.

The maintenance tools need these supporting files beside them. The local installation has no `.git` history or `node_modules/` folder. Run `npm ci` when development dependencies are needed; the resulting `node_modules/` folder can be removed afterwards. Playing requires none of these development tools.

The current local installation contains later manual German/Japanese edits that are absent from the maintained source. Restoring maintenance files does not import those edits. Read `maintenance/AI_HANDOFF.md` before rebuilding, and account for the local differences before replacing any installed outputs.

Use Node.js 20 or newer. From ADWD, the normal development commands are:

```bash
npm ci
npm run build
npm test
npm run build:visual
node ../ADWD-visual/maintenance/verify_project.js
```

Build commands write generated files. Tests and builders with `--check` are read-only. Use `npm run check:local` when the visual project is unavailable; it does not verify cross-project consistency. Run `npm run format:check` for maintained code formatting, and `npm run format:visual:check` for visual source formatting.

ADWD owns the shared story, translations, Gallery routes, wikis, transcripts and visual labels. ADWD-visual owns the presentation and graphics. Keep the folders side by side, or set `ADWD_TEXT_ROOT` and `ADWD_VISUAL_ROOT` for other locations. Build commands never commit or push automatically.

Read `maintenance/AI_HANDOFF.md` before editing. It covers source ownership, stable text IDs, preservation rules and verification scope. `maintenance/aligned_text.json` is a generated inspection reference; edit the language catalogs instead. Restoration and localization records remain in `maintenance/`.

The checks cover generated freshness, bilingual text, Gallery routes, game state, Back, Skip and transcript consistency. Browser layout and animation playback require separate browser checks. Automated checks do not prove perfect translation or exhaustive coverage of every possible branch combination.

## Optional play-only copies

The normal local folders retain their maintenance files. For a separate copy containing only the games and companion material, run:

```bash
node maintenance/export_games.js /path/to/new-release-folder
node maintenance/export_games.js --check /path/to/new-release-folder
```

The exporter requires a new destination and refuses to overwrite either source folder. It creates ADWD and ADWD-visual folders without maintenance tools, source files, dependencies or Git history. It copies the current generated outputs; it does not reconcile differences between installed games and maintained source.
