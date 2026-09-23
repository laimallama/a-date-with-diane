# Shared-source cleanup — 23 September 2026

The complete previous versions were committed and pushed before refactoring:
[text 60be4ae](https://github.com/laimallama/a-date-with-diane/commit/60be4ae1ce5cede005363248b6a43e7b377824dd)
and [visual d1c1dc6](https://github.com/laimallama/a-date-with-diane-visual/commit/d1c1dc6979cc80f79465c668fbca792079641be1).

## Result

All five standalone and four bilingual editions now compile from one story, one shared
runtime, two presentation adapters and five explicit language catalogs. The distributed
HTML remains self-contained. Bilingual translations are supplied by stable text IDs at
build time, eliminating exact-string dictionaries, silent fallback and duplicated
editorial work. The catalog values are the final rendered text, including punctuation,
capitalization, currency typography, speech cues and balanced HTML. The former per-render
repair functions and their alternate-renderer builder have been removed.

Shared initializers and functions are maintained once. Eleven unconsumed legacy globals,
their writes and saved-state fields were removed after checking both game and visual
consumers. The theatre wine preorder marker remains part of the tested state contract
and now has an explicit declaration. Two unused legacy description arrays and two
unused bilingual helpers were removed. Scene dispatch uses a frozen registry instead
of `eval`, rejects unknown names before state mutation, and initializes before boot.
Source/build files have consistent formatting and pinned development dependencies.
Five stylesheet templates replace nine copies while retaining locale fonts and layout.
Game globals intentionally use `var`: snapshot/restore and visual adapters access them
through the browser's global object.

The nine HTML releases total 8,650,005 bytes, down from 9,324,358 bytes (about 7.2%).
This is an output-size measurement, not a browser-speed benchmark. Individual standalone
pages are larger because their markup is explicit and their JavaScript is formatted;
the bilingual pages are substantially smaller without duplicate lookup dictionaries.

## Behavior and wording

Combined Diane/Molly status output previously relied on broken escaped word boundaries
and stale translated sentence comparisons. Explicit status identities now choose the
existing combined paragraph only when both descriptions represent the same condition.
Different conditions keep their separate paragraphs. Bilingual capture retains both
layers. Body state and the rotating-text counter are preserved.

The final review refined four CN/TW combined-status translations, making urgency wording
more natural and removing redundant descriptions of the same hand position. Exact
before/after text, reasons and synchronization scope are in
[`refactor_text_changes.json`](refactor_text_changes.json). English, Spanish and French
story text is unchanged. Three French transcript headings now use the same curly
apostrophe as their already-rendered Gallery titles. Gallery topology, ordering, route
choices, boundaries and the absence of a Variations interface are preserved.

## Evidence

- All 5,361 source identities and choice targets are retained. The five catalogs contain
  26,780 static/variant locations: four documented editorial changes; all others exactly
  preserve the checkpoint's rendered text. Complete catalog hashes and explicit
  exceptions prevent an unrelated change from passing unnoticed.
- Every static bilingual layer matches its corresponding standalone edition. Dynamic
  notices, balances and all rotating lines pass the existing focused checks.
- 1,368 paired-status boundary cases cover matching/different conditions in all nine
  editions, with numerical-state and English/localized output checks.
- Before installation, all 46 English Gallery routes were compared with the checkpoint
  across 4,655 steps. Live state matches after excluding the eleven proven unused fields.
  Full page markup matches when a corrected combined status is expanded to its two
  equivalent original lines. All 312 Gallery group/entry/language renders also match.
- The full text suite passed 414 route/edition combinations and 41,895 Back/replay checks,
  including Guide, Skip, state parity and focused historical regressions. The four later
  CN/TW wording changes received the complete affected catalog, bilingual and paired-status
  checks, followed by regeneration/freshness checks of their dependent artifacts.
- The visual suite passed 92 combinations and 9,310 Back/replay checks. Shared English,
  generated visual HTML, Gallery data and all 230 text/46 visual-reference transcripts
  are synchronized. Existing visual presentation and assets were preserved.
- Chrome 153 passed 22 desktop/narrow control/layout cases across all nine text games,
  visual English and the English wiki. These include currency display, real choice
  containers, modal isolation and visual reduced-motion behavior. Firefox and WebKit
  were not available and were not claimed as tested.

The language closure builds on the completed English, independent Simplified Chinese,
Taiwan Mandarin, Spanish-from-Spain and French-from-France editorial reviews. Every
indexed branch remains present, and wiki prose is unchanged. This is not a claim that
all translation has one perfect wording or that every possible game state was replayed.
The previously identified school-age sexual flashback sequences and linked material
remain outside editorial approval; mechanical preservation is not editorial review.

## Continuing maintenance

Use `npm ci`, edit `source/`, then `npm run build` and `npm test`. Read
[`AI_HANDOFF.md`](AI_HANDOFF.md) for ownership and conventions. Keep new intentional
wording revisions explicit in the preservation record; never update baseline evidence
just to conceal a failure. Build/sync commands do not commit or push automatically.
