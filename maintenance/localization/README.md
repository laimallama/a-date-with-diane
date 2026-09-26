# German and Japanese localization

German and Japanese translation, companion material and technical integration are
complete. Both were translated directly from English at
`da90009ab65f88099d1c57b8800e254a9d53e5cc`; the visual baseline is
`52c91af79b3a1bdd7ed308cb9c6eb2129eb0a8d8`. Existing editions remain unchanged.

Each locale contains 5,352 reviewed ordinary catalog leaves, six explicit omission
placeholders and four preserved empty outputs. Each has four game editions, a wiki
and 46 generated transcripts. See [verification](verification.md), the per-language
style guides, change records and hash-based editorial ledgers. Technical verification
and editorial review do not establish absolute perfection; browser and independent
native-speaker limits are stated explicitly.

`node maintenance/localization/workflow.js packet de 60` emits the next source
packet with scene predicates. `check de` checks keys, placeholders and markup;
`read de meaning` / `read de naturalness` display outstanding review items.
After actually reviewing the displayed items, `review de meaning` or
`review de naturalness` records source and target hashes. A changed source or target
invalidates its review. Automated checks do not count as editorial review.

## Existing-edition preservation and approved new-edition scope

The user explicitly requires ALL existing editions and translations to remain
unchanged. The user has now approved omissions with clear placeholders at every
affected entry in the new editions. See `scope.json` for the exact IDs and labels.
The final scoped count is six game-text entries and three wiki passages per new
language. Generated bilingual, visual and transcript copies are not additional
source locations. Placeholders are accounted for separately from translations.

Any approved exclusions apply to the new standalone, bilingual and visual editions and new
companion outputs only. Within a new bilingual edition, both layers must share the
same safe scene boundaries; retained English strings come unchanged from the English
catalog. This does not authorize editing any existing English or bilingual edition.

Preserve existing catalogs, story source, wikis, transcripts, rendered text, routes,
styles and playable files. Any necessary build/tool registration must leave existing
outputs byte-for-byte unchanged. Record suspected existing defects without fixing
them. Verify this preservation against the baseline before any release or install.

- `storytime` / `storytime1`, panna cotta arm: IDs `x04787`, `x04788`, `x04789`,
  `x05487`, `x04798`, `x04799`. The wiki dates this sexualized chess anecdote to
  approximately age fifteen. Do not translate it.
- English wiki `02_simon_hartley`, second paragraph under Sexual interests:
  sexualized childhood memories. Do not translate it.
- English wiki `03_diane_ellison`, Friends paragraph mentioning the chess lesson,
  and `11_other_characters`, Chess-teaching family friend: linked references require
  consistent omissions. Neutral facts about schooling and nonsexual childhood remain.
- The separate college bus anecdote is retained. `x04790` and `x05143` establish
  Diane's first college year as age eighteen. No source age or event is changed.

Do not change existing releases to implement exclusions. Use explicit placeholders
in the new catalogs and wiki sources, and substitute the six English placeholders
only while building the new German/Japanese bilingual editions. Never modify the
canonical English catalog or conceal a placeholder as completed translation.

## Browser evidence

The earlier tool rejected file-URL browser access and prohibited protocol workarounds.
No new DE/JA rendering has been tested. Do not bypass that restriction with a server,
another browser surface or raw browser automation. Record any user-assisted rendering
review separately from static and runtime tests.

## Shared change log

- 2026-09-25: confirmed both clone heads and installed pinned cached dependencies.
- 2026-09-25: started source packets and durable editorial coverage. No released
  language content, palette, scene routing or installed game files changed.
- 2026-09-25: user confirmed new-edition-only omissions and explicitly prohibited
  changes to all existing editions/translations. Both checkout diffs were empty;
  the only untracked additions were localization records and `source/text/de.json`.

## Reading the records

`workflow.js check de` or `check ja` reports catalog completeness and editorial
coverage. `catalogReady` concerns the catalog only, not publication or browser QA.
`verify.js` checks complete companion surfaces and scoped omission boundaries.
The generated aligned table keeps every existing ID and language column while
adding German and Japanese. Initial translations are indexed by their source IDs;
change records explain substantive revisions without duplicating generated files.
