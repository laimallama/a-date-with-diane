# German/Japanese release verification — 25 September 2026

Translation and technical integration are complete. German was completed first;
Japanese was translated directly from the same English baseline. No original
language translation, game source, route, palette or published game file was edited.
Repository documentation and maintenance support were extended for the new editions.

## Editorial coverage and omissions

Each locale has 5,362 catalog leaves: 5,352 ordinary reviewed entries (including
structural separators), six explicit placeholders and four intentional empty outputs.
Every ordinary entry has both meaning and naturalness review hashes. Each locale
also has 38 runtime UI strings, 52 visual UI leaves, two shells, 57 Gallery labels
and a 357-unit wiki with a completed surface review record.

There are **six omitted game entries and three omitted wiki passages per language**.
The exact IDs, sections and labels are in `scope.json`. They are the same nine source
locations for German and Japanese, not eighteen different source passages. Duplicates
in bilingual, visual and transcript outputs do not increase the source-location count.
New bilingual English layers substitute the six game placeholders only at build time;
canonical English and all existing bilingual editions remain unchanged.

## Passed checks

- Catalog completeness, source/target review hashes, placeholders and markup parity.
- Seven wikis: generated freshness, complete article/navigation structure and three
  scoped placeholders in each new wiki. Direct quoted dialogue matches the game.
- 37,492 static/variant locations and 1,976 paired-status cases; immutable legacy
  witnesses, stable IDs and new-locale review hashes.
- All bilingual English/local text layers, dynamic currency and intimacy messages,
  plus 34 focused rendering/state cases per non-English locale.
- 598 Gallery route/edition combinations across 13 text games and 60,515 Back/replay
  checks, including Guide/Skip and numerical state parity. Gallery remains 15 ending
  leaves and 31 hidden leaves with unchanged ordering and boundaries.
- Historical spending, coffee, theatre-water/preorder, clothing, repetition,
  home-drink, bathroom and riverside regressions across all 13 text editions.
- All 322 transcripts regenerated in memory and matched byte for byte.
- Thirteen visual cores match their canonical text scripts exactly. Sixteen compiled
  German/Japanese chrome/theme/language cases passed in a DOM stub, including currency,
  control labels, accessibility names and unchanged values/history.
- All 318 required visual image assets, script syntax, scene-map checks and generated
  freshness passed. No missing or orphan asset was found.
- Source formatting, support-module syntax/local bindings and Git whitespace checks.
- All ten new game/wiki pages use the approved light/dark palette. Japanese fonts,
  strict punctuation line breaking and normal narrow-status wrapping are scoped to
  Japanese; existing Notes spacing and scrolling styles remain unchanged.
- Every existing aligned-table ID and nested language column is retained: 5,361
  locations. The new language columns are additions only.
- Byte preservation against the starting commits: 288 text source/output files
  (excluding the extended edition registry) and 335 visual output/asset/runtime files
  (excluding presentation documentation). The 571 existing installed non-README files
  match the verified source. The two player READMEs receive the new links and counts.
- Clean export: 675 files, comprising 26 games, seven wikis, 322 transcripts, 318 image
  assets and two player READMEs. No Git metadata, dependencies or development sources
  enter the playable folders; companions exist only in the text folder.

The combined suite initially stopped at a legacy fixture that had no German/Japanese
coffee expectation. The fixture was extended with reviewed text, then the affected
regressions and remaining route/transcript stages passed. Unaffected expensive stages
were not repeated. Two visual maintenance files were reformatted with the repository's
pinned configuration; formatting and generated-output parity were checked afterwards.

## Limits

The earlier browser tool denied local-file access and prohibited protocol workarounds.
No new browser rendering, native elastic-bounce, IME interaction, device-font/zoom,
clipping or animation-timing verification is claimed. Static CSS checks and DOM-stub
checks are not visual evidence. The maintained browser verifier now accepts the new
locale IDs for a future authorized rendering review; it was not run for this release.

There was no independent native-speaker review. Editorial coverage and finite runtime
checks cannot prove absolute linguistic perfection or every arbitrary state combination.
