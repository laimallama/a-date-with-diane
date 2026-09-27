# Continuity and original-material restoration — 27 September 2026

This implements the user's 22 approved packages from section J of the workspace
`restoration-decisions.md`. The prepatch source commits are text
`dbb168ba3dff54a0cfc7f4e3b1e134932deec6b9` and visual
`16c2012babbafbb9d913ea74ec767a191e5e7e5e`.

## Applied scope

| Package | Implementation |
|---|---|
| P01 | Return from the upstairs porch branch before offering departure. First Prize now uses nine repeated sofa drinks and three additional offered walking choices; the old ten-repeat representative cannot leave legally. Thresholds are unchanged. |
| P02 | Make shared drink references beverage-neutral, including the taxi sibling. |
| P03 | Choose funded/refusal or exhausted-resource labels from the actual luckshot count at all approved sites. |
| P04 | Correct the Chardonnay continuation to the taxi rank and make the hurry line independent of queue history. |
| P05 | Credit both women for the charged quick farewell round, with day-specific amounts, and credit Molly for the Thursday nightcaps at both the Pavilion and pub. |
| P06 | Record the specific picnic agreement separately from general train conversation; condition taxi and album callbacks on that history. |
| P07 | Share dress-opening progression across restaurant, standing and sofa scenes; distinguish one opened button from two or more. |
| P08 | Use actual sofa-touch history for first/repeat wording. |
| P09 | Remove the premature Tuesday hosiery reveal while retaining the established clothing facts and later discovery. |
| P10 | Remove the suggestion that the already-present brother has not arrived home. |
| P11 | Remove the repeated brother introduction and duplicate Chloe entrance; preserve the subsequent information. |
| P12 | Introduce the theatre topic without claiming earlier discussion. |
| P13 | Correct Saturday dress/skirt references and sofa/chair wording. Also cover the adjacent shared bathroom garment line. |
| P14 | Give Saturday a general late-evening departure reason; retain weekday work references. |
| P15 | Restore the father's current railway employment in both game conversations and both related wiki articles in every language. |
| P16 | Restore the affectionate address, using natural localized phrasing. Japanese uses Diane's name as a direct affectionate address rather than a literal, unnatural endearment. |
| P17 | Restore the ravioli saving-money aside without changing cost or routing. |
| P18 | Restore Molly's compact clothing fact in Further Information. |
| P19 | Restore Diane's answer as her own speech in the past tense. |
| P20 | Remove the ineffective sixth album trigger and its two unused functions; retain the emergency check and normal continuation. |
| P21 | Consolidate the proved dead guarded album alternatives, redirect the defensive fallback, and remove the blocked bathroom repeat and its unused state. |
| P22 | Restore the supplied Molly-first Thursday bridge draft, repair positioning and urgency ownership, apply one luckshot cost and event-consistent resets, and rejoin once. |

No other rejected drafts or unused status-array entries were restored. The existing
omission policy and excluded source locations remain unchanged. No new sexual
material was authored for the restoration; the added scene adapts the supplied draft.

The final counterpart check found that `pubdrink8` serves the same four liqueurs
as `pavilion8` and had the same missing Molly intake. Both now add 30 pending
units, separately from digestion. This is included in P05 and its regression test.

## Gallery, guides and companions

The classic Gallery retains its interface and chronological group order. The former
standalone bridge entry becomes group 3, **Under the Bridge**, with **Diane Goes
First** followed by **Molly Goes First**. Both begin on the riverside approach and
end on the reunion page. The next ordinary-story button is outside the scene Guide.
The new branch uses the recorded continuous Thursday route through the pub and
riverside coffee stop. It arrives with Diane at 318 and Molly at 660, with three
luckshots available. This is the richest witnessed setup from the focused bridge
comparison; no synthetic state is used to force the higher conditional paragraph.

The transcript filenames are `03a_bridge_diane_first_*` and
`03b_bridge_molly_first_*`. The obsolete `03_bridge_*` files are removed. Other
groups keep their existing numbers. Each language has **15 ending leaves and 32
hidden-scene leaves**, hence **47 transcripts**, or **329** across seven languages.
Guide routes, generated transcript headings, and all localized Gallery titles use
the same definitions. First Prize's Skip cut remains the start of its climax.

The visual scene map includes both women at the viewpoint and assigns the two
bridge actions to the correct woman in each order. Assets, layout, themes, palette,
and Notes spacing are unchanged. Wikis and transcripts remain stored once in the
text release; visual READMEs link to those companions.

## Exact preservation and maintenance

`continuity-restoration-2026-09-27.json` records every catalog addition, removal,
and edit, plus stable-location moves. Each locale has 47 added entries and 37 retired entries. Existing-entry edits
number 29 in English, Spanish and French, 28 in each Chinese locale, 27 in German
and 26 in Japanese (784 catalog changes across all seven languages). Generic
garment terms already accurate in a locale did not require replacement. The
verifier reverses the ledger to reconstruct the prepatch catalogs and checks their
hashes, then applies the existing older exceptions to check the immutable baseline.
The baseline fixture itself is not changed.

`build_source_locations.js` derives the location index from explicit stable `TEXT`
references. The aligned index now takes those identities directly instead of
inferring ownership from similar wording. Retained IDs are preserved even when
calls move, split, or change all translations simultaneously. Retired IDs are not
reused. German/Japanese hashes are updated only for the reviewed changed or new
entries; unchanged reviews remain intact. All other language changes are captured
in the same exact ledger.

## Verification

`verify_restoration.js` replays the 25 recorded counterexample routes through
actually offered choices, including Back/replay, and tests the affected boundaries,
resource labels, history, drink totals, bridge priority, character order and resets.
Its isolated boundary cases are labelled as such and are not reachability claims.
The full project verifier checks every Gallery route in all thirteen text editions,
all bilingual layers, the 329 transcripts, stable IDs, source preservation and wiki
freshness. Visual verification checks all thirteen generated game cores byte for
byte and the changed character mapping.

Final checks passed: **611 route/edition combinations**, **61,633 Back/replay
checks**, **37,562 static/variant witnesses**, **1,976 paired-status cases**, all
**329 transcripts**, and **13 byte-identical visual game cores**. The focused
restoration tests and historical regression suite passed. After the pub-nightcap
counterpart fix, all 78 route/edition combinations using that node were checked
again, with 6,929 Back/replay checks and visual parity reverified. The verified play-only
export and installation contain **682 files**. Exact logs and manifests are
recorded in the workspace release record and audit archive.
These finite VM/static checks do not prove every arbitrary game-state combination.
No new browser rendering or independent native-speaker review is claimed; the
existing browser-access restriction remains in force.
