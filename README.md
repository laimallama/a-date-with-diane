# A Date with Diane (Remastered)

This is a restored, polished and expanded edition of the original *A Date with Diane*, an omorashi text adventure. Your choices shape an evening with Diane. The day, meals, drinks, conversations and journey home can lead to different scenes and endings.

The remaster keeps the original British narrative voice while improving wording, continuity and navigation. It includes seven languages, bilingual editions, Back with full state restore, an in-game Gallery, guided fast-forward, Skip to the good bit, and light and dark themes.

Text and visual editions are together in this folder. The visual editions add animated character sprites, location labels and graphical meters to the same story and choices. Their layout adapts to computers, phones and tablets; reduced-motion preferences use still images and held effects.

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

For English, open `outputs/en/dianedate_en.html` for the text edition or `outputs/en/dianedate_visual_en.html` for the visual edition.

Other text games use `dianedate_<language>.html`; visual games use `dianedate_visual_<language>.html`. Bilingual filenames add `_bilingual` before `.html`. These editions let you switch between English and the other language during play. Taiwan Mandarin uses native local wording rather than a character conversion of Simplified Chinese.

Keep `assets/` beside `outputs/` so the visual games can find their graphics. Each text game is a self-contained HTML file. All editions have on-screen controls and computer keyboard shortcuts.

## What is included

- Thirteen text games and thirteen visual games, each set covering seven standalone languages and six bilingual editions.
- Five main prize endings, consolation endings and hidden scenes, with branches affected by earlier choices.
- A Gallery containing 15 ending routes and 32 hidden-scene routes in every edition.
- Seven companion wikis and 329 transcripts, shared by the text and visual editions.
- One shared collection of 318 image assets for the visual games.

Each language folder contains `wiki_<language>.html`, a reference to the setting and characters. Its `transcripts/endings/` and `transcripts/hidden_scenes/` folders follow Gallery order and titles. Ending transcripts begin at the climax reached by Skip to the good bit; hidden-scene transcripts begin at the scene's starting point. The Gallery supplies the walkthroughs.

## Gallery and controls

The Gallery is available from the title screen. Choose an entry to start its route, then follow the highlighted Guide choices.

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

Skip is available once per newly started ending Guide. Going back can take you before the skipped point, but does not make Skip available again. Turning the Guide off removes Skip and stops fast-forward. The visual toolbar calls this command **Skip**; it behaves like **Skip to the good bit!** in the text editions. The in-game Notes explain the controls in each language.

Dark mode persists across refreshes in the same tab. A new tab starts in light mode. Back restores the previous page, choices and game state within the current session; it is not a persistent save. In visual editions, Back reconstructs the presentation rather than restoring an exact animation frame.

## Maintaining

The complete project is maintained in the GitHub repository `laimallama/a-date-with-diane`. The former visual repository has been retired after consolidation; its commit history is retained in this repository. All current development belongs here.

```text
ADWD/
  README.md
  outputs/       Text and visual games, wikis and transcripts by language
  assets/        Shared visual graphics
  source/        Shared game, translations, interface and visual source
  maintenance/   Build tools, checks, editing conventions and records
  package.json
  package-lock.json
```

`source/story.js` contains the shared game logic. The language catalogs are in `source/text/`; visual presentation code and effect metadata are in `source/visual/`. The builder combines the same text game core with the visual presentation, preserving its story and state. There are no duplicated language catalogs or companion files.

`package.json` defines maintenance commands and dependencies. `package-lock.json` pins exact dependency versions. `.prettierrc.json` defines source formatting, and `.gitignore` excludes temporary files and installed dependencies. The local game folder has no Git history or installed dependency folder. Run `npm ci` when development dependencies are needed; `node_modules/` is disposable afterwards. Playing requires no development tools.

The installed German/Japanese games contain later manual edits absent from the maintained source. This consolidation preserves those installed files without importing the edits into source. Read `maintenance/AI_HANDOFF.md` and account for these differences before rebuilding over the installed games. The repository alone does not reproduce those later local edits.

Use Node.js 20 or newer. From the project root:

```bash
npm ci
npm run build
npm test
```

`npm run build` generates the text editions, Gallery, translation reference, transcripts and wikis, then the visual editions. `npm test` checks the whole project, including the visual presentation. Build commands write generated files; verification commands and builders with `--check` are read-only. Nothing commits or pushes automatically.

For focused maintenance, use `npm run build:visual`, `npm run test:text` or `npm run test:visual`. `npm run format` and `npm run format:check` cover maintained code for both presentation formats with one configuration. All paths resolve from this project; no sibling checkout or separate visual dependency installation is needed.

Read `maintenance/AI_HANDOFF.md` before editing. `maintenance/VISUAL.md` describes the presentation and graphics. `maintenance/localization/GUIDE.md` describes localization records. The aligned translation table is a generated inspection reference; edit the catalogs instead. Historical reports describe their dated scope and may refer to the former two-repository layout.

Verification covers generated freshness, bilingual text, Gallery routes, numerical state, Back, Skip, transcripts, visual state and assets. Browser layout and actual animation playback require separate browser checks. Automated checks do not prove perfect translation or exhaustive coverage of every possible branch combination.

## Optional play-only copy

To make a separate copy containing all games, companions, graphics and one playing README:

```bash
node maintenance/export_games.js /path/to/new-release-folder
node maintenance/export_games.js --check /path/to/new-release-folder
```

The exporter requires a new destination outside the project. It produces one combined folder without source, maintenance tools, dependencies or Git history. It copies current generated outputs and does not reconcile differences between installed games and maintained source.
