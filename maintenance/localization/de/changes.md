# German translation record

The German translation and companion surfaces are complete. Existing editions are unchanged.
`reviews.json` ties each completed story/choice review to the exact source and target
SHA-256 hashes. Placeholders are separate scope exceptions in `../scope.json`.

## Completed batches, 25 September 2026

| Scene group | New translated entries | Meaning / naturalness |
|---|---:|---|
| Title, Notes, controls, date selection and arrival | 85 | Both reviewed |
| Wines, meal orders, pizza and spaghetti dialogue | 130 | Both reviewed |
| Remaining meal variants and conversation topics | 140 | Both reviewed |
| Hobbies, desserts, coffee and theatre arrival | 170 | Both reviewed |
| First act, physical-contact alternatives and interval | 200 | Both reviewed |
| Balcony, second act and immediate post-show choices | 200 | Both reviewed |
| Foyer, stage door and first pub sequence | 180 | Both reviewed |
| Last pub drinks, riverside coffee and portable toilets | 160 | Both reviewed |
| Riverside conversations, Molly's detour and Diane's urgency | 180 | Both reviewed |
| Outdoor alternatives and closed public toilets | 180 | Both reviewed |
| Caretaker, public-toilet variants and Pavilion approach | 180 | Both reviewed |
| Pavilion, departure options and bridge route | 180 | Both reviewed |
| Bridge aftermath, bus stop and taxi journey | 180 | Both reviewed |
| Home arrival, Chloe and first guest/coffee branches | 180 | Both reviewed |
| Amanda, upstairs alternatives and brother's picture albums | 180 | Both reviewed |
| Bathroom alternatives and first sofa-loop conversation/affection arms | 180 | Both reviewed |

The scene-group table above records the initial 2,705 entries. Subsequent reviewed
batches complete the remaining sofa conversations, stamp albums, homeward branches,
camper encounters, bathroom scenes, endings, status variants and numerical messages.

Current total: all 5,352 ordinary catalog entries reviewed against English meaning
and separately as German prose. Six approved placeholders and four intentional empty
outputs complete the 5,362 source leaves. Review hashes are authoritative.

The six approved placeholder entries are not included in these translation counts.
No routes, state variables, source IDs, prices, existing-language text or CSS changed.

## Local decisions and revisions

- Standard German `du` narration and `DU:` player cue. No added dialect or archaic
  speech. Original names and British setting retained.
- HUD term calibrated to `Intimität`, with `Intimitätspunkte` for notices; other
  control labels follow the style guide and remain identical in the new UI catalogs.
- `x00066`, `x00071`, `x00076`: replaced stiff future-tense wording with a natural
  present-tense German compliment, preserving the impending performance reference.
- `x00089`, `x00090`: use opportunity wording, avoiding the added permission implication
  of the first draft's `dürfen`.
- `x00118`, `x00160`: English pepperoni means spicy salami, distinct from the separately
  mentioned peppers. German `Peperoni` would misidentify the ingredient.
- `x00134`, `x00136`: preserve the British continental joke and render the medium-steak
  pun as `die goldene Mitte`.
- `x00273`, `x00277`, `x00356`, `x00398`: use natural German for picture of health,
  go to your head, anorak and take the rough with the smooth. Preserve context and tone.
- `x00359`, `x00360`: retain the civilized-travel joke and steam-railway specificity;
  do not replace the latter with the broader museum-railway category.
- `x00469`: name the programme explicitly so the pronoun cannot refer to its seller.
- `x00562`: corrected a first-draft past/present tense mismatch in the recollection.
- `x05090`: removed a cumbersome run of relative pronouns while preserving speaker
  and performer/character identities.
- `x00748`: translate the narrator's uncertain garment terminology as `Unterrock oder
  Unterkleid`, since rendering both English terms as `Unterrock` destroys the question.
- `x05105`, `x00864`: `ganz dringend mal müssen` carries the bathroom euphemism without
  a literal penny reference or added explanation.
- Pounds remain pounds; German uses decimal commas and nonbreaking spaces before £.
  Runtime formatting integration is complete. No quantities are converted to euros.
- `x01230` / `x01231`: preserve the uncertain garment-name conversation using
  `Unterrock` / `Unterkleid`; Robert then identifies a waist slip as a `Unterrock`.
- `x01426`: preserve the player's inference about stockings, rather than presenting
  his conclusion as something he has directly seen.
- `x01440`: `my mate` does not identify gender; use `jemand aus unserer Runde`
  instead of inventing a female friend.
- British beer names, Real Ale, Best and Shandy remain British. Keep Pavilion as
  the venue name, distinct from the ordinary `Musikpavillon` passed on the walk.
- Repeated entries in the riverside/public-toilet branches were reused only after
  reading their predicates and confirming exact source equality and equivalent roles.
- `x02083`, `x02090`, `x_scenario8`: retain British `College` rather than imply that
  the brother and Chloe have finished university. `x02300` uses `Kunst als Fach
  gewählt` for Amanda's art studies without inventing a university stage.
- `x02103`: use `den Tag nicht vor dem Abend loben` for the unhatched-chickens idiom.
- `x02265`: use the idiomatic `Logenplatz` for a grandstand view; do not imply the
  player has sat down.
- `x05589`, `x05231`: English does not specify the cousin's gender. German uses
  `Verwandtschaft` to preserve the family lodging offer without inventing gender;
  this necessarily generalizes the precise degree of relationship. Japanese can
  retain the gender-neutral `いとこ` exactly.
- `x05585`, `x05222`: friendly jealousy becomes `Ein bisschen neidisch bin ich schon,
  aber ich gönne es ihr`, avoiding a literal, unnatural German phrase.
- `x01379`, `x01537`, `x02277`, `x02384`: revised the draft's awkward
  `verzweifelt dringend` wording; urgency remains unchanged. Both reviews updated.

## Companion surfaces and verification

German runtime UI (16 standalone and 22 bilingual keys), visual UI (52 string leaves),
two shells, all 57 Gallery titles and the 357-unit wiki have meaning and naturalness
reviews recorded in `surface-reviews.json`. Wiki quotations match the game catalog.
The three wiki omissions are explicit. English play titles remain in English
consistently, without inventing unverified German production titles.

All four German games, the wiki and 46 transcripts are built in the working checkouts.
The German standalone/bilingual pair passed all 46 Gallery routes each, including
9,310 Back/replay checks, Skip and state equality against the English reference.
Together with the reference replay this was 138 route/edition combinations and
13,965 Back/replay checks. All static bilingual text and 34 focused runtime cases per
translated locale passed. Source integrity covered 32,136 static/variant locations
and 1,672 paired-status cases across the six registered locales. Visual verification
confirmed exact canonical script parity, complete labels, syntax and required assets.
No browser layout, native elastic scrolling or independent native-speaker review is
claimed.

A byte-level comparison confirmed all 288 baseline source/output files unchanged
(excluding the intentionally extended locale registry). Every existing aligned-text
column and all 5,361 source-location identities are preserved. Existing visual outputs,
assets and runtime modules are unchanged. Installed playable folders remain untouched.

## Latest wording decisions

- `x04502`, `x04567`, `x04608`: remove awkward repeated `musste` clauses while
  preserving urgency and the camper-van location where specified.
- `x04509`: witnessing emergency relief is not merely watching a search for a place.
- `x04646`: natural confidential recollection wording replaces a stiff literal phrase.
- `x04800`: `jemand aus unserer Runde` preserves unspecified companion gender.
- Small involuntary curtseys become `kurz/leicht in die Knie gehen` in status messages.
- `lych gate` becomes `überdachtes Friedhofstor` or an equivalent churchyard phrase;
  Portakabin becomes `Fertigbau` without inventing an office use.
- Adult unnamed car-park speaker cue is `DIE JUNGE FRAU:`. Monaco stamps name
  `Fürstin Gracia Patricia`. Freshers’ Week becomes `Einführungswoche am College`.
- `x04147`: `Die Toiletten sind zu.` matches the closed facility in context.
- Visual bus-queue label uses `Warteschlange am Bus`, avoiding the awkward compound.

## Release verification

The final combined integration and preservation results are recorded in
`../verification.md`. Historical milestone counts above describe the earlier
German-only milestone. They are not a separate claim of browser verification.
