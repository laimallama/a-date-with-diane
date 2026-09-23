# A Date with Diane (Remastered)

This is a restored, cleaned, and expanded edition of the original *A Date with Diane*, an old omorashi text game.

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

There are **no** separate click-path guide text files. The Gallery is the walkthrough. It currently lists **15 ending leaves** and **31 hidden-scene leaves in every language** (variants inside a group each count as a leaf).

The game boots on the title screen (no age gate). **Gallery** is available from there: pick an ending or hidden scene to restart with the correct choice highlighted at each step. **Guide: On/Off** (**H**) toggles highlighting. **Skip to the good bit!** (**S**) jumps to the same point the climax transcripts start from. **Back** (**B**) restores full state. **G** / Escape open and close the Gallery. **D** toggles Dark Mode. Bilingual: **L** switches language. **1–9** select choices.

**Dark Mode: On/Off** persists across refresh in the same tab (`sessionStorage`). A new tab starts in light mode.

The stats bar is Diane’s date HUD. It stays hidden on title, notes, further information, and day-choice screens, then appears when the date begins (“On with the story!”). It stays up through same-night prize cards, same-night game-overs (including Amanda downstairs), and the Chloe walk-home stretch (so luckshots stay visible). When you turn for home after leaving Diane, her bladder empties off-screen as usual. It hides again the next morning (the phone call). Chloe and Amanda do not get their own meters.

## Maintaining

The maintained story is in [`source/story.js`](source/story.js); the five language
catalogs are in [`source/text/`](source/text/). Shared runtime, interface labels,
styles and document shells live alongside them. All nine playable HTML files are
generated, self-contained releases. English and local bilingual text come directly
from the same catalogs as the standalone games. Text already contains its final
punctuation and markup; no runtime repair or translation fallback is needed.

Use Node.js 20 or newer for development:

```bash
npm ci
npm run build        # rebuild editions, Gallery, reference, transcripts and wikis
npm test             # read-only checks, including build parity with ADWD-visual
npm run check:local  # isolated checkout only
node ../ADWD-visual/maintenance/build_visual_edition.js
```

Read [`maintenance/AI_HANDOFF.md`](maintenance/AI_HANDOFF.md) for editing conventions,
source ownership, verification scope, browser checks and visual synchronization.
[`maintenance/REFACTOR.md`](maintenance/REFACTOR.md) records the source migration and
its recovery commits. Route definitions generate the classic Gallery's 46 leaves and
all 230 localized transcripts. `maintenance/aligned_text.json` is a generated
inspection reference with stable text IDs; edit the catalogs, not that reference.
The five wiki article documents are maintained in `source/wiki/`; their runtime and
stylesheet are shared. The released wiki HTML is generated and self-contained.
`npm run format` / `npm run format:check` cover all maintained code and HTML templates.
Use `npm run format:visual` / `npm run format:visual:check` for the visual repository.

The full verifier covers generated freshness, exact text witnesses, all bilingual
layers, dynamic text, focused historical regressions, all Gallery routes, numerical
state, Back/replay and Skip. Real-browser controls and selected layouts have a separate
Playwright verifier. These checks do not prove linguistic perfection or exhaustive
coverage of arbitrary state combinations.

ADWD is canonical for all language content and visual labels (`source/visual-ui/`).
The sibling **ADWD-visual** checkout reads those inputs directly to build all nine visual
editions. It carries no duplicate text games, wikis, transcripts or language catalogs.
Set `ADWD_TEXT_ROOT` and `ADWD_VISUAL_ROOT` when the source checkouts are not siblings.
Build commands never commit or push automatically.

## Small playable exports

The repository is an authoring checkout; source, tests, package manifests and Git history
are development files. Produce separate play-only folders with:

```bash
node maintenance/export_games.js /path/to/new-release-folder
node maintenance/export_games.js --check /path/to/new-release-folder
```

The exporter requires a new destination and refuses to overlap either source checkout.
It copies all 18 playable HTML editions unchanged. `ADWD/` contains the nine text games,
five wikis and 230 transcripts. `ADWD-visual/` contains only the nine visual games and
318 required image assets; companion references point to ADWD. Each gets an informative
playing README covering the game, contents, controls and companions. Exports have no
`.git`, `node_modules`, `source`, maintenance tools, manifests, synchronization receipts
or duplicated companion files. The visual metadata is already embedded in every visual
HTML page.

`package.json` defines development commands and dependencies; `package-lock.json` pins
exact versions for reproducible installs; `node_modules/` is their disposable installed
copy. `source/` is the authoritative editable code and translation catalogs. Keep these
in the authoring repository, not in a folder intended only for playing. To resume work
from play-only folders, clone both GitHub repositories into sibling development folders,
then run `npm ci` in ADWD. Do not try to run build commands inside a playable export.
