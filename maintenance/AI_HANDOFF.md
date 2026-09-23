# Maintaining A Date with Diane

## Source and generated editions

`source/story.js` is the single maintained story and game-logic source. It uses stable
`TEXT.x…` references. `source/text/{en,cn,tw,es,fr}.json` contains the complete, reviewed
HTML and choice labels for each language. Text is already punctuated, capitalized and
balanced. There is no render-time legacy repair pipeline or translation fallback.

`source/runtime/common.js` owns shared state, snapshots and controls. `single.js` and
`bilingual.js` contain the presentation differences; their boot files run after all
state and the scene registry have initialized. `source/ui/` holds localized runtime
labels. `source/shell/`, `source/styles/` and `source/editions.json` own document shells,
styles and language-specific fonts. `source/status-groups.json` assigns stable text
IDs to the nine existing combined Diane/Molly descriptions. Do not infer these groups
from translated wording or regular expressions.

`maintenance/build_editions.js` compiles all five standalone and four bilingual games.
The shipped HTML remains self-contained and works without a server or dependencies.
Edit the source, then rebuild; never hand-edit the generated playable HTML. The
bilingual English layer must equal standalone English, and its local layer must equal
the corresponding standalone language. Both are compiled directly from those catalogs.

`source/locations.json` records each text ID, kind, node, slot and choice target.
`maintenance/aligned_text.json` is a generated cross-language inspection reference.
Preserve IDs when moving or splitting existing text; do not renumber them. When adding
or removing calls, update locations and all catalogs together. Computed messages are
limited to complete intimacy templates, the balance template and rotating status lines.
Keep singular/plural and French zero handling in the templates.

## Build and verification

Use Node.js 20 or newer. Install the pinned development dependencies with `npm ci`.
No dependency installation is needed to play the released HTML.

```bash
npm run build                 # editions, Gallery, reference, transcripts, wikis
npm test                      # full read-only text and synchronization checks
npm run check:local           # isolated text checkout; no cross-project claim
node ../ADWD-visual/maintenance/build_visual_edition.js
node ../ADWD-visual/maintenance/verify_project.js
```

The full verifier checks generated-source freshness, catalog completeness, stable IDs,
syntax, exact static rendering witnesses, all bilingual layers, dynamic amounts and
variants, paired status boundaries, focused historical regressions, all 46 Gallery
routes per edition, Back/replay, Skip, numerical state and all 230 transcripts.
`maintenance/fixtures/text-baseline.json` records the approved rendering baseline from
the recovery commit. Intentional editorial changes require a reviewed baseline update;
do not refresh it merely to silence a failure. The four localization refinements from
this cleanup are explicit exceptions in `maintenance/refactor_text_changes.json`.

`verify_browser_controls.js` is the separate Playwright check for controls, modal focus,
input races and selected layouts. It accepts `--engines=chromium,firefox,webkit`,
`--editions=…`, `--output=/absolute/path/results.json`, and focused `--currency-only`,
`--focus-only` or `--choices-only` modes. `ADWD_PLAYWRIGHT_MODULE` can point to an existing
Playwright installation. Browser binaries must be installed separately. Automated
checks do not prove perfect translation or exhaustive coverage of arbitrary state.

`audit_state_space.js` explores actual choices under explicit limits. Keep its witnesses
and cutoff counts when reporting coverage; do not call bounded exploration exhaustive.
Do not retain temporary copies, logs, screenshots or large audit dumps in the repository.

## Visual synchronization

ADWD is canonical for all language story/runtime, routes, wikis, transcripts and visual labels
(`source/visual-ui/*.json`). ADWD-visual owns presentation and assets. Its builder reads the
canonical inputs directly; there are no imported text games/catalogs, duplicated companions
or synchronization receipts in the visual checkout. Rebuild the canonical releases first,
then run the visual builder. `--check` verifies without writing. Default paths are sibling
ADWD and ADWD-visual source checkouts; override with `ADWD_TEXT_ROOT` and `ADWD_VISUAL_ROOT`.
The canonical verifier's `--local-only` option skips checking the visual checkout.

Use `export_games.js` for play-only folders; it excludes all development files and keeps
companions once in ADWD. A playable export is not a source checkout. Keep authoring sources
and package manifests in GitHub even when the user removes local development copies.

## Text and localization conventions

Preserve the original British voice. Change wording or punctuation when the result is
clearly better in context, without mechanically adding commas. English uses British
single quotation marks, curly apostrophes and spaced en dashes. CN uses curly double
quotes; Taiwan Mandarin uses corner quotes and native Taiwanese vocabulary and syntax.
Taiwan Mandarin is not a character conversion of Simplified Chinese. Do not add dialect
or particles that change a character's voice. Spanish uses Spain's established register;
French uses its established idiomatic register and typographic spacing.

Write final typography in catalogs: French speaker colons use a narrow nonbreaking
space; French guillemets use nonbreaking inner spaces. ES/FR amounts precede £ with a
nonbreaking space and decimal comma. Whole-pound amounts have no decimal places;
pence have two. Currency state remains numeric. Bilingual English retains English
price formatting. Balance formatting alone is performed at runtime.

Delivery/addressee cues stay in italic parentheses at the front of dialogue. CN/TW use
full-width parentheses with no surrounding spaces. Physical actions belong in separate
plain narration paragraphs. An action interrupting speech separates two dialogue turns.
Spoken stress uses `<em>`; headings, announcements, full-line shouts and points notices
use `<strong>`. Each narration catalog value contains its complete block markup;
`s()` does not supply paragraphs or fix tags. Keep distinct narration/dialogue turns in
separate calls. Choices may be interleaved with narration, inside a complete `.choices`
block; direct render tests must call `finishChoiceBlock()`.

Play titles: English uses italics; CN/TW use book-title marks without italics; ES/FR use
guillemets. The English title is *The Importance of Being Earnest* and the character is
Gwendolen. CN/TW use 《不可儿戏》/《不可兒戲》. Preserve localized proper names across game,
Gallery, transcripts and wiki. English narration uses “knickers”; spoken “pants” idioms
remain. “Miniskirt” is one word. CN uses 文胸, TW uses 胸罩. CN/TW use 管理员/管理員 for the
caretaker and 保安 for the Pavilion bouncer. Do not translate fidgeting “can't stand
still” as physical unsteadiness.

The companion articles are maintained in `source/wiki/{lang}.html`.
`build_wikis.js` embeds `source/runtime/wiki.js` and `source/styles/wiki.css` to create
the five self-contained `outputs/{lang}/wiki_{lang}.html` releases. They use neutral encyclopedic language, consistent names and numbered articles.
They describe backstory rather than retelling playable branches. Keep prose free of
em dashes and colons; use a sentence or comma construction. Use consistent localized
section headings, separate friends from romantic relationships, italicize work titles,
and bold lead subject names. Historical school-age sexual flashback material has not
received editorial approval; mechanical preservation/navigation checks are not content
curation or endorsement.

## State and continuity

Back restores saved state and HTML without executing the scene again. Every variable
or rotating-text counter that affects play belongs in `gameStateVars`. History is
session history, not a persistent save system. Scene dispatch uses a fixed registry and
rejects unknown tags before state changes. Do not reintroduce `eval`.

The HUD describes Diane only. Hide it before the date and on the next-morning screens.
Same-night endings and the Chloe walk-home stretch retain it. `gameover` inherits the
current visibility. Digestion runs at the existing displayed-scene timing. Preserve the
four initial catch-up ticks. Off-screen emptying uses `afterpee()` and its day/wine
leftover; witnessed emptying can reach zero. Do not duplicate digestion or emptying.

Intimacy changes use `getinti`; shyness uses `adjpoints` and floors at zero. Luckshots
start at three, use `spendLuckshot`, and are capped at one on the homeward transition.
Spending must be guarded and charged once; Back refunds by restoring the snapshot.
Restaurant coffees cost £2 for two filters, £3 for two espressos, or £3.50 for the mixed
cappuccino/espresso order. The automatic filter order charges £2 and records its marker
without a second drink dose. Theatre interval wines cost £10. Diane pays the foyer round;
Robert/Bruno pays the ordinary Pavilion first round. Do not invent missing prices or
clamp a negative balance to conceal an accounting error. `digestMolly` preserves the
existing bladder increment and floors her processing tank at zero.

Keep conversation recall coherent: prior job, family, hobbies and story topics must not
be introduced twice as new information. Earlier drinks, clothing, wine refusals, day
and location affect later narration. The focused regressions cover these decisions and
should be extended for a demonstrated new bug rather than duplicating entire audits.

## Gallery and transcripts

Maintain the classic Gallery: 15 ending leaves and 31 hidden-scene leaves in every
language and all nine visual editions. No Variations tab/button, setup selectors or explanatory
variation notes. Add a leaf for a meaningfully different event or outcome. For dialogue
alternatives choose one complete, coherent, especially engaging real route. Endings
consider the whole route; hidden scenes consider their displayed duration. Never splice
text or inject state to make a representative route.

Routes live in `verify_ending_routes.js`; hidden definitions live in
`write_hidden_scenes.js`. `build_gallery_data.js` generates the Gallery snapshot and
embedded data. `write_transcripts.js` renders the 230 managed climax transcripts from
those routes and preserves unrelated files. Their cuts and ordering match Gallery/Skip.
Scene-final continuation choices stay available but unhighlighted outside the guide.

The direct camper encounter is fourth within its group, after solo approaches and
before covert watching. It begins at `carparka0`, includes `carparka1`, and ends before
`taxihome1`; its slug is `09ba_camper_encounter`. “Caught by the Brunette's Boyfriend”
follows “Peeping Underneath” with slug `09da_camper_caught`. The Chardonnay solo scene
includes `carpark3` and ends before `busqueue7`. Pair translations by stable leaf ID.

## Support-code maintenance

`npm run format` formats all maintained JavaScript, CSS and HTML templates;
`npm run format:check` is part of the full verifier. HTML template slots are explicit
`/* ADWD:STYLE */` and `/* ADWD:SCRIPT */` comments. Do not format generated editions
independently. Generated catalogs/reference data and transcripts follow their builders.
`verify_maintenance.js` parses support modules and rejects unused local bindings;
exports, callbacks and dynamic consumers still require a semantic review.

Gallery builders import explicit CommonJS exports. Importing the route book or hidden
scene definitions must not run their command-line checks. The obsolete `check_endings.js`
was folded into the route book; `replay_route.js` remains a useful standalone debugging
command. `write_hidden_scenes.js` retains its historical filename but only checks
and exports definitions; `write_transcripts.js` owns transcript output.

Visual formatting uses the pinned tools here (`npm run format:visual:check`), avoiding
a second dependency installation. The visual repository's `verify_visual_support.js`
checks every GIF/still pair and frame bank for missing or orphan files. Frame counts
are derived; do not restore obsolete `count.txt` copies.
