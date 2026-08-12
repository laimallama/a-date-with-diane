# Gallery expansion plan — handoff doc

Written at the end of a long investigation session (2026-08-12) into how much of the game's
content is reachable-but-undiscovered by the current Gallery. Read this before starting; it
documents exact conclusions, not just methodology, so the content decisions below don't need
to be re-derived — only implemented. All work below is **EN-first**; nothing has been ported
to CN/TW/ES/FR yet.

## Why this exists

The Gallery (`maintenance/write_hidden_scenes.js` + `write_verified_guides.js` +
`build_gallery_data.js`) currently documents 10 endings + 22 hidden scenes, built by
hand-walking specific curated choice sequences — never by exhaustively enumerating the game's
actual branch space. A full reachability audit (see Methodology below) found the game has
**721 total scene functions**, of which **only 466 are touched by any documented route**.
That gap splits into two very different categories, both investigated this session:

1. **Whole undiscovered functions** — branches the documented routes never call at all.
2. **Unexercised conditional variants inside already-documented functions** — a function
   *is* referenced by some documented path, but that function has multiple `if`/`else`
   branches (gated by day-of-week, dessert/wine/coffee choice, etc.) and the recorded
   playthrough only ever triggered one of them. The other branches are real, finished,
   reachable content that simply never got captured in any transcript.

Both were audited exhaustively (every candidate function actually read, not sampled). The
result is a confirmed list of **10 items** worth adding, below.

## The 10 confirmed additions

### From category 1 (whole undiscovered functions)

1. **Brooch scene** — `givebrooch()`. Reached from `givechance()`'s decision menu (help
   Diane find a moment to pee: ask directly / natural break / go pee yourself / **give her
   the brooch**, only offered if you bought it earlier via `buysth()`→`buybrooch()`). Ends by
   continuing into the normal `walkhomeX` flow — doesn't change your final ending.
   **Category: hidden scene.**
2. **Phone-call ending** — `walkhomedesp2()`→`walkhomedesp3`→`5`→`6`→`7`→`showover()`→
   `showover1()`→`showover2()`. Triggered by choosing *not* to spy on Diane at her back door,
   then separately needing a pee yourself and witnessing her locked out the front. Full
   next-morning phone-call scene with tuesday/thursday/other variants (behind-the-bins /
   locked-out-of-back-door farce / wets-herself-on-the-doorstep confession). Ends on generic
   `gameover`. **Category: hidden scene.**
3. **Saturday car-park chase** — `search1()`→`search1a()`→`search1b()`, Saturday-gated.
   Ends on the `consolation` tag — the exact same terminal tag used by the two existing
   day-specific consolation endings (`07a_consolation_tuesday_pavilion`,
   `07b_consolation_thursday_subway`). This is the missing third leg of that trilogy.
   **Category: new ending** (not a hidden scene — it's a genuinely new prize-tier outcome,
   unlike everything else on this list).
4. **Loo-together variant** — `lootogether()`→`ontoilet()`→`ontoilet1()`→`ontoilet2()`.
   Alternate staging of the "go to the bathroom together" beat, parallel to the documented
   `nicelydesp6` version (Second Prize ending) but with its own setup and intimacy-gated
   branching. High-intimacy branch ends by calling `fifthplace()` (same shared "5TH PRIZE"
   screen as the documented Fifth Prize ending, reached via a different route); low-intimacy
   branch (`lootogether2`→`3`) ends on generic `gameover`. **Category: hidden scene.**
5. **Train photo album** — `sofatrains1()` through `sofatrains7()`. Reached by picking "Talk
   about trains?" at the `sofadesp2()`/`sofapee2()` conversation-topic menu (a 5-way menu:
   theatre/stamps/trains/work/toilets — the documented Third Prize path always picks
   "stamps," so trains/theatre/work are all unexplored; only trains turned out to have real
   substance, see "Explicitly ruled out" below for why the other three don't). A sustained
   7-stage scene: skirt riding up further at each stage, day-specific reveals (stocking/
   suspender Tuesday, bare legs Saturday, tights otherwise), escalating physical content,
   while she gets progressively more desperate in the background. Ends by calling into
   `stampalbum7`, the last tag of the documented Third Prize ending. **Category: hidden
   scene.**
6. **Bath-peeing variant** — `bathpee()`→`bathpee1()`. `nicelydesp6()` (already documented,
   part of Second Prize) branches three ways by day: Tuesday and Thursday both lead to her
   sitting on the toilet (`nicelydesp7`, captured); **Saturday** is different — "your rather
   grotty bathroom doesn't have a separate shower, just a shower attachment over the bath,"
   so she stands in the bath instead. Full wetting scene with its own staging, ends on
   `secondplace` (same shared "2ND PRIZE" screen, different route). **Category: hidden
   scene.**

### From category 2 (unexercised variants inside documented functions)

7-9. **Three missing `storytime()` stories.** `storytime()` is technically "documented" — it's
   called from `story()`, part of the "Lounge Story Consolation Prize" ending — but that
   ending's recorded route never ordered a gated dessert, so it only ever captured the
   `else` branch. Three other complete stories are gated by `tiramisu`/`pannacotta`/
   `icecream` and have never been captured:
   - **tiramisu** — "the boy from school on the bus" (the scene that started this whole
     investigation). She's desperate, really fancies him, can't duck into the bushes
     because he's insisting on walking her home.
   - **pannacotta** — a chess lesson from an older guy she was in awe of, getting more
     desperate while trying not to show it, aware he's watching her fidget.
   - **icecream** — Freshers' week, first year of college, wets herself completely in the
     hallway fumbling for her key: "It was like Niagara Falls, in my jeans too."
   Exact text for all three is in the conversation transcript this doc was generated
   from; re-extract from `outputs/en/dianedate_en.html`, function `storytime()`, if needed
   (search for `function\nstorytime()`).
   **Category: 3 new hidden scenes, siblings of the existing Lounge Story entry** — see
   Gallery grouping section below for how these should actually be presented.

10. **`watching5()`'s non-tiramisu branch.** Chloe waiting at her door — polarity note from
    implementation: the *already-documented Chloe Consolation* route orders tiramisu and
    captures the wet-at-the-door / sob beat that ends on the consolation screen. The
    **missing sibling is the non-tiramisu branch**: she pulls down, squats, pees outside,
    then her mum answers — game over ("A nice end to the evening, but—"). Same approach to
    the door, different dessert flag, different outcome. **Category: new hidden scene /
    Gallery sibling of the existing Chloe ending.**

## A bug to fix while in this neighborhood

`carparka1()` (one of the wine-gated branches investigated but not recommended for
inclusion — see below) calls the bus-stop girl "the blonde" three times (search
`"the petite blonde from the bus queue"` and `"the blonde from the bus stop"`). Everywhere
else in the entire game — `watchblonde()`, `carparka2()`, the boyfriend-catch scene, a dozen+
other lines — she's consistently "the brunette." Diane is the blonde one (explicitly stated
elsewhere: "Diane is quite tall... and blonde"). This is a genuine continuity slip in the
original source, present since before this session, almost certainly copied into all 4
translated languages too. Worth a quick fix (change "blonde" → "brunette" in those 3 lines,
check each language file for the same slip) independent of whether `carparka1` itself ever
gets a Gallery entry.

## The Gallery grouping/sub-choice UI (needed before adding items 7-10, useful for 1-6 too)

The user's proposal, and it's the right call: instead of 4 new flat top-level hidden-scene
entries all titled some variant of "The Lounge Story," the Gallery should show **one entry**
("The Lounge Story") that, when clicked, expands to a **sub-list of named variants**
(bus-stop boy / chess lesson / Freshers' week / hen party), each independently playable via
the guide system exactly like today's flat entries. Same treatment would suit Chloe's 2
outcomes, and retroactively the existing Tuesday Pavilion / Thursday Subway consolation pair
(currently two flat entries that are conceptually "the same near-miss, different day").

This is real implementation work, not just data — nothing has been built yet. What's needed:

1. **Data model** (`GALLERY_DATA.hiddenScenes` / `.endings`, built by
   `maintenance/build_gallery_data.js` from definitions in `write_hidden_scenes.js`/
   `write_verified_guides.js`): currently a flat array of `{id, order, title, tags,
   baseLength}`. Needs to support an entry that is either a single scene (as now) *or* a
   group: `{groupId, groupTitle, variants: [{id, title, tags, baseLength}, ...]}`. Decide
   whether existing flat entries get silently wrapped as single-variant groups internally, or
   whether the renderer branches on entry shape — probably cleaner to keep both shapes valid
   and branch on `"variants" in entry`.
2. **Gallery UI** (`renderGalleryLists()` and the `#galleryOverlay` markup/CSS in each
   `dianedate_*.html`): clicking a group entry needs to show its variant list instead of
   immediately calling `startGuidedRoute()`. Simplest approach: inline expand/collapse within
   the existing scroll panel (avoids a third UI layer); each variant row then behaves exactly
   like today's leaf entries.
3. **`startGuidedRoute(kind, index)`**: currently addresses a flat array index. Needs to
   address `(kind, groupIndex, variantIndex)` or equivalent, threaded through to
   `sessionStorage.setItem("dianeGuide", ...)` the same way it does today — the actual guide
   replay mechanism (tags + baseLength) doesn't change, only how the UI locates which
   tags/baseLength to hand it.
4. **Maintenance scripts**: `write_hidden_scenes.js` (and `write_verified_guides.js` for the
   day-specific consolation pair, if that also gets grouped) need their scene-definition
   objects extended to express "these N variants share a route up to point X, then diverge on
   variable Y" — mechanically this just means defining N full tag arrays as before (each
   variant's full path, since `initGuideFromStorage`/`go(tag)` replay doesn't understand
   partial-then-branch, it just walks a flat tag list — see `outputs/en/dianedate_en.html`'s
   `initGuideFromStorage()`), grouped under one parent entry in the output data structure. No
   change needed to how a route is *recorded/verified* — `write_hidden_scenes.js` already
   validates each tag sequence by replaying it in a real `vm` sandbox exactly as before; only
   the *shape of the exported data* and the *rendering* change.

**Suggested order of work for whoever picks this up:**
1. Build the grouping data model + UI + `startGuidedRoute` changes first, proven with the
   *existing* Tuesday/Thursday consolation pair as a group (zero new content, pure
   refactor — safest way to validate the mechanism before adding real new content on top).
2. Once that's verified working (syntax-checked, `write_verified_guides.js` still green,
   manually click-tested in browser), add items 7-9 (storytime siblings) and 10 (watching5
   sibling) as new grouped entries.
3. Add items 1-6 as ordinary flat hidden-scene/ending entries (no grouping needed for these,
   they're standalone).
4. Fix the blonde/brunette line.
5. Regenerate: `write_verified_guides.js`, `write_ending_transcripts.js`,
   `write_hidden_scenes.js`, `build_gallery_data.js`, in that order, and confirm zero errors.
6. Only after EN is fully done and the user has signed off on the actual wording/behavior:
   port everything to CN/TW/ES/FR (single-language **and** bilingual — see the standing
   "bilingual = single-language, just combined" rule in `AI_HANDOFF.md`). This is a big
   translation job on its own; don't start it until EN is locked.

## Methodology (for extending this analysis, not for re-deriving the conclusions above)

The full audit was two passes:

**Pass 1 — whole undiscovered functions.** Parse every `function NAME() { ... }` in
`outputs/en/dianedate_en.html` (watch for the 3 functions — `start`, `under18`, `buysth` —
written with the opening `{` on the *same* line as the name instead of the usual next-line
style; a naive parser will silently skip their bodies and produce false "unreachable"
results, as happened once this session with `buybrooch`/`buywater`). Build a directed graph
from `c("tag",...)`, `go('tag')`, and bare `tag()` calls. BFS from `start`/`start1`/`under18`/
`info` to get the reachable set (721 of 721 — the game has zero genuinely dead code once the
parser bug above is fixed). Diff that against the union of every `tags` array across
`maintenance/gallery_data.json`'s `endings` + `hiddenScenes` (466 covered) to get the
undiscovered set (255). Group undiscovered functions into "islands" by BFS from each entry
point (a function called from a documented function), and — critically — exclude
high-fan-in "hub" functions (`gameover`, `afterpee`, `sitting_desp`, etc., anything called
from 4+ places) when deciding whether an island "merges back" into documented territory,
otherwise everything looks connected via the shared `gameover()` call and nothing looks
novel. Then **read every island's actual text** (island size ranked the 6 winners above
correctly; everything below size 3 turned out to be one-liners, duplicate "watch her pee"
variants of scenes already well-covered, or luckshot-depletion failure states — read all
139 of them individually this session, none of the small ones were worth adding).

**Pass 2 — unexercised conditional variants.** Concatenate every existing transcript
(`outputs/en/endings/transcripts/*.txt` + `outputs/en/hidden_scenes/scene_transcripts/*.txt`)
into one corpus — this is "everything the player has definitely already seen," ground-truthed
against real rendered output rather than simulated state. Scan every function for `if`
conditions gated on a *one-time-choice* variable (`tuesday`/`thursday`/`saturday`,
`tiramisu`/`pannacotta`/`icecream`, wine variety, coffee variety, `pizza`/`mediumsteak` —
**not** `blad`/`inti`/`points`, which are continuously-rising stats whose bands a normal
playthrough naturally passes through, producing mostly-trivial escalation text rather than
genuinely different scenes). For each such function, split into branches and check whether a
distinctive text fragment from each branch appears anywhere in the corpus. This flagged 75
functions; manually filtering out blad-nested false positives and actually reading the
remainder narrowed it to the 4 genuine finds above (`storytime` ×3 branches, `watching5` ×1)
— everything else gated by day/wine/coffee turned out to be minor staging differences on the
same beat (which drink got poured, whether stockings or tights get wet), not different
*stories*, and isn't worth pursuing.

All scratch scripts used for this lived in `/tmp` and will not have survived past this
session — if the analysis needs extending (e.g. auditing `blad`-gated content after all, or
re-running the corpus check after new transcripts are generated), rebuild the two passes
above from this description rather than searching for the original scripts.

## Explicitly ruled out — don't re-investigate these

- **`sofastamps`→`stampalbum1-8`** (one of the 5 conversation-topic-menu options): identical
  functions to the ones already used by the documented Third Prize ending. Zero new content.
- **`chessgame`**: 3 lines, immediate decline, dead end.
- **`sofawork`/`sofawork1`/`sofawork2`, `sofatheatre`**: thin, mechanical, funnel straight
  into the same shared luckshot/toilet mechanic every other branch uses.
- **`sofatalk`→`sofatalka`→`sofatalkb`→`sofatalkc`**: a *fourth* near-identical "watch her
  pee in the bathroom" variant (on top of the documented `nicelydesp6` and the recommended
  `lootogether`). Diminishing returns past two.
- **`luckytrip0`/`6`/`18`/`21`/`181`-`185` and similar luckshot chains**: mostly "you don't
  have a luckshot, you're disqualified" failure states, or alternate entry points into
  content that's already documented via the stamp-album chain.
- **`disaster4a`/`4c`/`5c`/`8b`/`8c`/`8ca`/`8d`**: real, well-written reaction variants to the
  wetting-accident ending, but they're more depth on an ending type that's *already*
  thoroughly documented, not new ground.
- **Ambient status-text arrays** (`molly_desp`, `mollyst_desp`, `queue_desp`, `notYetSitting`/
  `notYetStanding`/`notYetQueue`): rotating flavor text cycling through blad thresholds, not
  scenes.
- **Repeated single mechanics** (`handonthigh`/`leanclose`/`underskirt` × 3 at different
  points in the theatre act; `luckytrip12tues`/`thurs`/`sat` — same choice offered at
  multiple points, not 3 different scenes).
- **Day/wine/coffee-gated staging variants that aren't full alternate scenes**
  (`carparka1`, `disaster2`, `bushome5`/`6`, `sofadrink`, `riverside6`/`9`, `pubdrink1`/`6`/
  `8`/`9`, `eatmeal6b`, `helpdiane`, `luckytrip31a`, `luckytrip11a`, `together1b`): checked
  individually, each is a minor detail swap (which wine got poured, whether her legs glisten
  through stockings or tights) on the same beat, not a different story. `luckytrip11a`'s
  Thursday branch does reveal the hidden-camera plot, but that's already a separately
  documented hidden scene reached another way — a redundant second door, not new content.

## Status

**In progress (EN-first, uncommitted):**
- Gallery group expand/collapse UI is live in all 9 HTML files; Tuesday/Thursday consolations
  are already one grouped ending (`07_consolation_day_routes`).
- Confirmed EN label routes saved under `maintenance/routes_wip/`:
  `lounge_hen`, `lounge_tira`, `lounge_panna`, `lounge_ice`, `chloe`, `chloe_sibling`.
- Item 10 polarity corrected above (documented Chloe = tiramisu consolation; missing =
  non-tiramisu gameover).
- EN `carparka1` blonde→brunette continuity fix applied.
- Still to do: Saturday car-park ending + items 1–6 flat scenes; wire routes into
  `write_verified_guides.js` / transcripts / `build_gallery_data.js`; then CN/TW/ES/FR.
