# AI handoff (ADWD-visual)

This tree is **ADWD-visual**, not the settled text edition.

**What this is:** English-only sandbox for a visual / visual-novel take on *A Date With Diane*. Work stays in English (`outputs/en/`). Do not port CN/TW/ES/FR or bilingual files here unless the owner asks.

**Playable visual edition:** `outputs/en/dianedate_visual_en.html` (rebuild with `node maintenance/build_visual_edition.js`). Story/Gallery logic is still the text game; `visual/` holds shell CSS, scene→cast map, effects synchronizer, and the navigation adapter. Sprites: `assets/{diane,molly,debbie,amanda,chloe}/`.

**What this is not:** the finished five-language HTML text game. That lives at `/Users/apple/Documents/ADWD` and https://github.com/laimallama/a-date-with-diane.git (old / settled versions). This repository has its own origin, `https://github.com/laimallama/a-date-with-diane-visual.git`. Do not push visual work to the text-edition repository.

Read this before editing. Playable English lives in `outputs/en/`. Toolkit lives in `maintenance/`. (Trailing `/` marks a folder; omit it for files.)

## What is in this folder

English playable HTML (`outputs/en/dianedate_en.html`), English climax transcripts, English wiki (`wiki_en.html`). Gallery: **15 ending leaves** and **30 hidden-scene leaves**.

Translations and `aligned_text.json` belong in the text repository only. The visual game checks, Gallery builder, and transcript writer operate on English only; legacy wiki utilities remain separate.

There are **no** external click-path guide `.txt` files. The Gallery is the walkthrough. **Climax transcripts** start at the climax of the story or the starting point of the hidden scene for each Gallery entry (Gallery `climaxIndex` / `baseLength`; same cut as in-game Skip to the good bit / scene start). Gallery order, short slugs. In-file title = Gallery **leaf** title only (no group prefix). Bus-home is two hidden-scene leaves: `10a` luckshot (church) and `10b` rioja (too desperate to walk her home).

Gallery currently documents **15 ending leaves** and **30 hidden-scene leaves** (leaf counts, not top-level group rows).

All Gallery route label sequences live inline in `verify_ending_routes.js` (endings + extras) and `write_hidden_scenes.js` (classic hidden scenes). There is **no** separate `routes/` JSON folder.

**Wiki pack** (not playable): [`outputs/en/wiki_en.html`](../outputs/en/wiki_en.html). Lead names: Simon Hartley (27), Diane Ellison (25). Neutral encyclopedic register; body/sexual subjects use clinical terms (`urinate`, `urinary urgency`, bladder, lose control) — not slang. Backstory only; do not retell playable branches; do not spell links from wiki traits to in-game beats. Ages: `born …` + `N-year-old` / `aged N` only (never `25 in 2005`). No em dashes and no colons in wiki prose (use a new sentence or a comma construction instead). Character H2s when relevant: Early life and family; Education; Career; Personal life; Residence. Under Personal life reuse the same H3 labels for the same topics (`Friends`, `Relationships`, `Sexual interests`, `Urinary habits` / `Urinary accidents`, `Hobbies` as needed). `Friends` and `Relationships` stay separate (`Relationships` = romantic/sexual partners). Category H3s take the plural even when the article mainly covers one example. The English wiki is the single `outputs/en/wiki_en.html` file. Work/game titles use italics (`<em>A Date With Diane</em>`, `<em>Outside Edge</em>`); article-subject names in leads use bold (`<strong>Welbourne</strong>`).

## Raw HTML vs rendered text

Raw `dianedate_*.html` strings intentionally look rough (straight quotes, uncapitalized choices, legacy `<LI>`/`<EM>`, etc.). A render-time pipeline (`polishStoryHtml`, `polishChoiceText`, `smartenHtml`, speech-aside wrappers, …) fixes that every display.

**Quotes in source → render:**
- **EN:** write straight `'...'` (or straight `"..."`); `smartenText` renders British singles `‘…’`. Do not hardcode American `“…”`.

**Dashes in source → render (EN):** unspaced em dashes (`word—word`) are Chicago/US. British house style (Hart's, Guardian) is a **spaced en dash** (`word – word`). `polishStoryHtml` / `polishChoiceText` convert `—` at render; do not bulk-replace source dashes. Route `normalize()` folds `—` / `–` / spaced dashes so Gallery labels still match.

**Do not "fix" raw source to pre-bake typography.** Judge text in a real render (browser or route scripts). Route matching uses rendered text; `verify_ending_routes.js` `normalize()` strips quote marks so British `‘…’` still matches guide labels written with `“…”` / `"..."`.

## The `s()` rendering pipeline (know this before touching any narration line)

`s(t)` is the core "print a line" function. It calls `normaliseLegacyHtml(t)` (converts `<LI>`→`<p>`, `<EM>`→`<em>`, etc.) → `ensureStoryBlock(html)` (if the text doesn't already start with a block tag, wraps the **whole** string in `<p>…</p>` automatically) → `polishStoryHtml` → `balanceLegacyHtml` (auto-closes any unclosed allowed tag) → appends to `#box`.

**Key implication:** every `s()` call becomes its own separate `<p>` paragraph automatically. There is no special line-break syntax. Splitting one `s()` call into two or three separate calls is the correct, clean way to create distinct narration lines or dialogue turns — see the stage-direction rules below.

`c(tag, label)` appends a clickable choice button; `go(tag)` evals `tag+'()'`.

## Stage-direction / aside formatting (settled convention — read before touching any `<EM>`)

Historically the game embedded stage directions mid-sentence like `SPEAKER: <EM>action</EM> dialogue`, which reads badly once rendered. The settled rule, sorted by **what the aside is doing**, not by where it happens to sit in the old source:

1. **Delivery / addressee cue** — modifies *how* a line is spoken or *to whom* it's addressed (`quietly`, `whispering`, `to you`, `aside, to you`, `under her breath`). Keep it as a parenthetical, in italics, **at the front of the line**: `SPEAKER: (cue) dialogue`. Lowercase the cue unless it's a full sentence.
2. **Action / physical description** — describes what a character visibly does (`She is standing with one leg half crossed over the other.`). Move it **out to its own plain narration line**, no italics, no parentheses: split the `s()` call and add a new one, e.g. `Diane stands with one leg half-crossed over the other.`
3. **Mid-dialogue interruption** — a pause/gesture that happens *between* two halves of the same speaker's line (`DIANE: Lots better! <EM>she pauses</EM> I've been wanting to go for ages...`). Split into **separate dialogue turns** with the action as its own narration line in between:
   ```
   DIANE: Lots better!
   She pauses.
   DIANE: I've been wanting to go for ages...
   ```
4. **Spoken stress in dialogue** (contrastive or intensified word: *you*, *have*, *dying*) — `<EM>…</EM>`, not `<STRONG>`. Reserve `<STRONG>` for headings, venue banners, tannoy, full-line shouts, and points notices.

**Delivery cues (kept parenthetical):** EN uses plain italics + parens, e.g. `(quietly)`.

Categories 2 and 3 never get parens or italics — they're just narration.

**Titles/play names:** EN uses `<EM>italics</EM>` (e.g. `<EM>The Importance of Being Earnest</EM>` — note the "The"; `<EM>Outside Edge</EM>`). "Gwendolen" (not "Gwendoline") is the correct spelling.

## Editing playable text

1. Find the line (`rg`), read surrounding HTML context in `outputs/en/dianedate_en.html`.
2. Re-run the English route smoke test; rebuild Gallery if routes/titles changed; regenerate transcripts after climax wording or `write_transcripts.js` changes (see toolkit below).
3. Syntax-check touched HTML: extract the `<script>` body and `new Function(...)`.
4. Pull search strings from the file; don’t retype punctuation by hand.
5. For multi-line JS replacements, check brace balance.

Do not recreate bilingual dictionaries or `aligned_text.json` in this tree.

## Settled wording (don't reopen unless asked)

**UI / meters**
- **Immersion CTA:** `On with the story!`
- **Buy something:** shop-literal (`Buy something`).
- **Money meter:** `Pounds`.
- **Prices:** whole pounds, no `.00` (`£1`). Pence use two places (`£1.50`).
- **Status-bar tummy (`proc`):** `Tummy`.
- **Intimacy amounts:** only via `getinti` (exact notice). Hand-written scene summaries may cover shyness/scene, not vague “lots of / a few” intimacy. **Shyness** changes go through `adjpoints(±n)` and clamp at **0**; intimacy may still go negative.
- **Luckshots:** start at 3. Early uses `spendLuckshot()` (decrement, floor 0). From taxi home / bus home / short Tuesday–Thursday jump, `capEndgameLuckshots()` leaves at most 1 remaining. Home/lounge luckshots must decrement, never `luckshots = 0`. Chloe doorbell luckshot (`luckytrip19`) also spends.
- **Miniskirt:** one word (`miniskirt` / `miniskirted`). First clothing-list mention of the bus-queue girl is `Debbie (the brunette) wears a miniskirt.`
- **Underwear:** narration and clothing notes use **knickers**. Spoken idioms keep **pants** (`get my pants down`, `wet my pants`, `pants and trousers`). Do not use *panties*. Gallery leaf: *Discarded Knickers* (transcript slug `07a_spyhole_panties` is a filename only).

**Scene lines**
- **Urinal straddle (`x01569b`):** comma before aside (`…urinal, with her back to you`), no em dash.
- **Church mind-races (bus luckshot):** `…and only then could she finally relieve herself.` — inversion after *only then*; not *only now*, not *only then she could*, no trailing *there*.

## UI / Gallery conventions

**Boot and theme**
- No age gate. Boot opens on `start` (title); first `go("start")` does not push history, so Back is not offered on the title screen.
- **Dark mode** persists across refresh via `sessionStorage.dianeDarkMode` (`1`/`0`). Gallery guide reload keeps the same preference automatically. A new tab starts light.
- Pregame screens freeze/hide stats until the date starts.
- **Theme tokens** live in each `outputs/*/dianedate_*.html` `:root` / `[data-theme="dark"]`. Light stays wine-on-parchment. Dark uses pale straw gold for accents + CTA fills (`--on-accent` = dark ink on straw); dark `--status` is `#2f2822` (above paper, near choice) so the attribute table reads as a panel; dark `--choice-hover` `#534433`; `--highlight-bg` `#4a4024`; `--guide-hover-bg` `#5f4c32` (hover fills stay below ink luminance). Hover/key-press text uses `--ink-on-hover` (dark: `#faf6ee`; light: same as ink) so straw text doesn’t wash into the hover tray. Guide + hover: fill → `--guide-hover-bg`, accent inset stays.

**Shortcuts**
- `b` Back, `h` guide toggle, `g`/Esc Gallery, `1–9` choices, `S` Skip to the good bit (`climaxIndex`, same cut as climax transcripts).
- Number-key / guided Enter flash: one pending pick only (`choiceKeyPending`); `#box.choice-key-armed` suppresses `.choice:hover` so keyboard wins over mouse. A numbered pick on a Guide-highlighted row uses `--guide-hover-bg` (same as guide hover), not the ordinary `--choice-hover` wash.
- **Enter** selects the highlighted guided choice only when a Gallery guide is active **and** Guide is On.

**Gallery names and hover**
- Leaf titles keep proper names even if the group already names that person (*Watching Molly…*, *the Brunette…*, *Diane Pees in the Bath*, *Chloe Wets Her Knickers*). Do not replace a name with *her/she* as the scene subject.
- Chloe’s group is singular **Chloe Consolation Prize** (two variants of one prize, like Amanda); Outdoor / Lounge stay plural.
- Gallery rows hover/focus-visible with `--choice-hover` wash **and** `--accent` text (wine `#9b2f3f` light / gold dark — same token family as links/CTAs; brighter than heading `--accent-dark` so light-mode hover reads clearly). Rows are `appearance: none` buttons so WebKit honours `color`. Open groups: no wash — chevron ▾ plus revealed children mark open; wash is hover-only.

**Notices**
- **Points notices** (intimacy via `getinti`, shyness/bladder status lines): `<p class='notice'><strong>…</strong></p>` — bold, **no** `<EM>` and **no** orange `#FF9966` spans.

## Maintenance toolkit

| Path | Role |
|------|------|
| `AI_HANDOFF.md` | This file — conventions + toolkit map |
| `verify_ending_routes.js` | Click-paths for prize endings and extra hidden scenes; running it smoke-tests those paths. Read-only; does not write or delete files. |
| `write_hidden_scenes.js` | Classic hidden-scene Gallery definitions (titles, climax starts). Not transcripts. |
| `write_transcripts.js` | Writes climax `.txt` transcripts → `outputs/en/transcripts/{endings,hidden_scenes}/` |
| `build_gallery_data.js` | Packs the two route books into `GALLERY_DATA` and injects that into the English HTML |
| `check_endings.js` | Shared early-bush base + helpers |
| `replay_route.js` | Replay one click-path against an HTML file (helper for `check_endings.js`) |
| `gallery_data.json` | Generated Gallery snapshot (don’t hand-edit) |
| `build_wiki_html.js` / `build_single_wiki.js` | Wiki builders (English in this tree) |

Do **not** leave scratch audit dumps in this folder (delete after use). Ignore local `.DS_Store` files; do not commit them.

After wording/route edits:

```bash
node maintenance/verify_ending_routes.js
node maintenance/write_hidden_scenes.js
```

If Gallery routes/titles changed:

```bash
node maintenance/build_gallery_data.js
```

After climax wording or transcript-writer changes (also after Gallery rebuild):

```bash
node maintenance/write_transcripts.js
```

`verify_ending_routes.js` green on English is the fastest smoke test after a text batch.

## Do / don't

**Do:** targeted user-directed edits in English; rebuild Gallery when routes/titles change; regenerate English transcripts after climax wording.

**Don't:** recreate translation files or other-language HTML unless asked; bulk "fluency" rewrites without an explicit ask; push visual changes to the text-edition origin; force-push history unless asked.


## Verified maintenance baseline (13 September 2026)

- Run `node maintenance/verify_project.js` for the complete maintained-edition regression check. It replays all 45 embedded Gallery routes and checks Back/forward HTML and state, guided progress, and Skip. In the text repository it also checks all nine playable editions against English numerical state. It is not a substitute for browser layout or animation testing.
- `gameStateVars` includes `despLineIndex`. Any future state or text counter that affects replay must be included in snapshots. Restore must not execute a story node a second time. Back remains session history, not a disk save.
- All playable documents have a doctype, page title, and language metadata. Bilingual layers declare their own languages; `setLanguage()` updates the document language too.
- `verify_ending_routes.js` and `write_hidden_scenes.js` are read-only. The latter checks definitions; the full verifier checks actual routes. Never add implicit deletion to a check command.
- Route definitions are authoritative for generated Gallery data. `build_gallery_data.js --check` detects drift without writing. Rebuild the Gallery and then transcripts after route changes. Transcript generation renders every managed output before writing and preserves unrelated files.
- Input paths in the maintained game-check/build commands are resolved from the script location. Do not rely on the caller's working directory.
- Run `build_visual_edition.js` after source runtime or presentation edits. Its `--check` mode is read-only, and missing injection anchors are errors. Never hand-edit the generated visual HTML.
- Location matching treats numbered route families as distinct, so `luckytrip3` cannot capture `luckytrip31`. Explicit location exceptions precede legacy heuristics. The current CSS uses a shared stage background; location IDs and labels do not imply finished environmental artwork.
