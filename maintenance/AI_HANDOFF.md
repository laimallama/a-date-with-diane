# AI handoff — A Date with Diane

Read `README.md` and this file before editing. Ship text lives in `outputs/`. Toolkit lives in `maintenance/`. (Trailing `/` marks a folder; omit it for files.)

## Required visual-edition synchronization

The owner requires every shared English content change to reach the separate ADWD-visual checkout. This repository is canonical for the English story/runtime, Gallery routes, wiki, transcripts, and shared maintenance scripts. After the applicable language edits and generated-file refreshes, run `node maintenance/sync_visual_edition.js`, then run `verify_project.js` in both repositories. The sync command rebuilds the generated visual page. This is part of completing shared changes, not an optional later task. Do not stop with only the text checkout updated.

Normal visual builds also synchronize first. Both verifiers check shared file equality; `sync_visual_edition.js --check` additionally checks the generated visual output without writing. Keep visual-only code and assets in ADWD-visual. The visual tree stays English-only; do not copy the translation index or bilingual rendering tools there.

If shared edits add/rename scene tags, change on-screen characters, or alter tracked state, also review and update ADWD-visual's scene map/adapter and browser-check the affected scenes. Synchronization cannot infer new visual mappings.

Shared maintenance scripts are byte-identical and detect the visual tree at runtime to select English-only processing. The sync manifest is an explicit file list in `sync_visual_edition.js`, with managed transcripts supplied by `write_transcripts.js`. Its receipt in the visual repository records last-synced hashes. Initial synchronization adopts canonical content; subsequent independent edits to shared visual files cause an error before writes, so reconcile them into ADWD. Previously managed files removed from the manifest also require explicit reconciliation; the sync command never deletes discovered files.

Checkout defaults are sibling folders `ADWD` and `ADWD-visual`, overridable with `ADWD_TEXT_ROOT` and `ADWD_VISUAL_ROOT`. Use `--local-only` only to explicitly check/build a carried snapshot when the other checkout is unavailable, and report that upstream synchronization was not verified. No commit or push is implied.

## What this project is

Restored multi-language edition of the old HTML branching adult text game *A Date with Diane*: cleaned wording/logic, Back with state restore, in-game Gallery (guided walkthroughs + Skip to the good bit), dark mode, five playable languages.

**Languages (all independent):** `en`, `cn`, `tw`, `es`, `fr` under `outputs/{lang}/`.
**TW** is Taiwan Mandarin (國語) in Traditional script — same standing as ES/FR. Edit it as its own edition, not as CN run through conversion. Keep settled playable terms (`胸罩`, `計程車`, `流動廁所`, `樹叢`, `管理員`, `站不定`, `接著`, intimacy `撫摸`/`愛撫`). Particles sparingly; narration almost none.

Each language folder ships:

- playable HTML (`dianedate_*.html`; bilingual with English except EN)
- climax transcripts under `transcripts/endings/` and `transcripts/hidden_scenes/`
- companion wiki (`wiki_*.html`; not playable; all five languages)

There are **no** external click-path guide `.txt` files. The Gallery is the walkthrough. **Climax transcripts** start at the climax of the story or the starting point of the hidden scene for each Gallery entry (Gallery `climaxIndex` / `baseLength`; same cut as in-game Skip to the good bit / scene start). Gallery order, short slugs. In-file title = Gallery **leaf** title only (no group prefix). Bus-home is two hidden-scene leaves: `10a` luckshot (church) and `10b` rioja (too desperate to walk her home).

Gallery currently documents **15 ending leaves** and **31 hidden-scene leaves in every language** (leaf counts, not top-level group rows).

All Gallery route label sequences live inline in `verify_ending_routes.js` (endings + extras) and `write_hidden_scenes.js` (classic hidden scenes). There is **no** separate `routes/` JSON folder.

The old archive dig (`dianedate27a.html`) is finished: remaining archive-only stubs are unreachable drafts and are not merge candidates.

**Wiki pack** (not playable): [`outputs/en/wiki_en.html`](../outputs/en/wiki_en.html) (parallel `wiki_{cn,tw,es,fr}.html`). Same numbered articles in each language. Lead names: Simon Hartley (27), Diane Ellison (25). Neutral encyclopedic register; body/sexual subjects use clinical terms (`urinate`, `urinary urgency`, bladder, lose control — or the language’s clinical equivalents) — not slang. Backstory only; do not retell playable branches; do not spell links from wiki traits to in-game beats. Ages: `born …` + `N-year-old` / `aged N` only (never `25 in 2005`). No em dashes and no colons in wiki prose (use a new sentence or a comma construction instead). Character H2s when relevant: Early life and family; Education; Career; Personal life; Residence (localized). Under Personal life reuse the same H3 labels for the same topics (`Friends`, `Relationships`, `Sexual interests`, `Urinary habits` / `Urinary accidents`, `Hobbies` as needed). Use those H3s when Personal life covers more than one topic (or when matching a labelled topic used on other character pages); a Personal life section that is only one short undifferentiated block may stay as plain paragraphs. `Friends` and `Relationships` stay separate (`Relationships` = romantic/sexual partners). Category H3s take the plural even when the article mainly covers one example. Proper names in wiki and sofa lounge chats must match that language’s playable HTML (e.g. CN/TW Wilde play title 《不可儿戏》/《不可兒戲》 — not the literal 《认真的重要性》; 金流酒馆/金流酒館; TW 里茲; ES/FR keep Molly/Welbourne and localize Earnest / Pavilion→Pabellón/Pavillon). Sofa lounge chats also need entries in each bilingual `alternateTranslations` map. Do not leak into playable HTML unless asked (then all langs + bilingual). Each wiki is a single `outputs/{lang}/wiki_{lang}.html` file; there are no separate article pages or wiki stylesheets in the shipped outputs. Work/game titles use italics (`<em>A Date with Diane</em>`, `<em>Outside Edge</em>`); article-subject names in leads use bold (`<strong>Welbourne</strong>`). All five shipped wikis are HTML. Edit those files directly. The old markdown wiki builders are gone; they are not a repair step.

## Raw HTML vs rendered text

Raw `dianedate_*.html` strings intentionally look rough (straight quotes, uncapitalized choices, legacy `<LI>`/`<EM>`, etc.). A render-time pipeline (`polishStoryHtml`, `polishChoiceText`, `smartenHtml`, speech-aside wrappers, …) fixes that every display.

**Quotes in source → render:**
- **EN:** write straight `'...'` (or straight `"..."`); `smartenText` renders British singles `‘…’`. Do not hardcode American `“…”`.
- **CN:** quoted spans become curly doubles `“…”`.
- **TW:** quoted spans become `「…」`.

**Dashes in source → render (EN):** unspaced em dashes (`word—word`) are Chicago/US. British house style (Hart's, Guardian) is a **spaced en dash** (`word – word`). `polishStoryHtml` / `polishChoiceText` convert `—` at render; do not bulk-replace source dashes. Route `normalize()` folds `—` / `–` / spaced dashes so Gallery labels still match.

**Do not "fix" raw source to pre-bake typography.** Judge text in a real render (browser or route scripts). Route matching uses rendered text; `verify_ending_routes.js` `normalize()` strips quote marks so British `‘…’` still matches guide labels written with `“…”` / `"..."`.

## The `s()` rendering pipeline (know this before touching any narration line)

`s(t)` is the core "print a line" function. It calls `normaliseLegacyHtml(t)` (converts `<LI>`→`<p>`, `<EM>`→`<em>`, etc.) → `ensureStoryBlock(html)` (if the text doesn't already start with a block tag, wraps the **whole** string in `<p>…</p>` automatically) → `polishStoryHtml` → `balanceLegacyHtml` (auto-closes any unclosed allowed tag) → appends to `#box`.

**Key implication:** every `s()` call becomes its own separate `<p>` paragraph automatically. There is no special line-break syntax. Splitting one `s()` call into two or three separate calls is the correct, clean way to create distinct narration lines or dialogue turns — see the stage-direction rules below.

`c(tag, label)` appends a clickable choice button; `go(tag)` evals `tag+'()'`.

Standalone choice rendering keeps a complete, closed `.choices` block on every DOM write. Do not append an unclosed opening tag to `innerHTML`: the browser closes it immediately and leaves later buttons outside the group. `s()` calls between choices append inside the same group, matching the bilingual buffers. `go()` calls `finishChoiceBlock()` after the scene; direct rendering checks must finalize too. The standalone prefix/content buffers are transient and are cleared when the scene finishes, so Back restores the saved page without rerunning the scene.

## Status bar (Diane’s date HUD)

`showStats` is Diane’s date HUD only. `PREGAME_TAGS` hide it before “On with the story!”. `HIDE_DATE_STATS_TAGS` hide it the next morning (`showover1`, `showover2`). `gameover` inherits `holdDateStatsOff` so a hidden stretch does not bring the bar back. Same-night prize cards, same-night game-overs (including Amanda downstairs), and Chloe from `walkhome6` (“You turn for home”) through `watching6` / `luckytrip19` keep it — luckshots must stay visible for the doorbell shot. At `walkhome6` call `afterpee()` (she has gone inside; off-screen leftover, not a fake `blad = 0`). Digestion ticks whenever the bar is shown. Do not give Chloe or Amanda their own meters.

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

**Per-language rendering of category 1 (kept parenthetical cues) only:**
- EN / ES / FR: plain italics + parens, e.g. `(quietly)`.
- CN / TW: italics + **full-width** parens `（）`, not ASCII `()`. This is the general CN/TW convention for *any* surviving `<EM>` aside, not just cues. **No spaces** around the cue: `黛安：（苦中带笑）还好…` — tight `：（` and no space after `）` before dialogue. Do not mirror EN’s `(quietly) Lucky…` spacing.

Categories 2 and 3 never get parens or italics in any language — they're just narration.

**Titles/play names are a completely separate rule, not affected by any of the above:** EN uses `<EM>italics</EM>` (e.g. `<EM>The Importance of Being Earnest</EM>` — note the "The"; `<EM>Outside Edge</EM>`). CN/TW use `《》` book-title marks with **no** `<EM>` at all (`《不可儿戏》`/`《不可兒戲》`, `《外缘》`/`《外緣》`). ES/FR use guillemets `« »` with no `<EM>` (`«La importancia de llamarse Ernesto»`, `« L'Importance d'être Constant »`). "Gwendolen" (not "Gwendoline") is the correct spelling for the *Earnest* character in all languages that use the Latin name as-is.

## Bilingual files are a second copy — treat fixes as two jobs, not one

`outputs/{lang}/dianedate_{lang}_bilingual.html` (all except EN) embeds its **own independent copy** of every English `s()`/`c()` call plus a giant `alternateTranslations = { "<exact EN string>": "<translated string>", ... }` dictionary (`translateAlt()` does an exact-match lookup, falling back to `alternatePrefixTranslations` prefix-matching, falling back to returning the English unchanged if nothing matches — a silent, easy-to-miss failure mode).

**"Bilingual should be exactly the same as the single-language file, just two of them together" is a hard standing rule from the project owner.** Any wording, formatting, or logic fix made to a single-language file (including EN) must be ported to the bilingual EN source **and** the bilingual dictionary too, or the bilingual edition silently drifts out of parity.

When splitting an `s()` call in a bilingual file (per the stage-direction rules above):
1. Find and split the EN source line the same way as the single-language fix.
2. Find the **old** dictionary entry keyed by the old (unsplit) EN string, delete it.
3. Add one new dictionary entry per new split line: `"<new EN line>": "<translated line>"`.
4. **Watch for duplicate keys.** Splitting tends to produce short, generic reusable English fragments that may already exist as a dictionary key. A duplicate key silently overwrites earlier ones. After dictionary edits, check for duplicates.
5. **Watch for the `<LI>`-prefix trap.** Always grep the *exact* text the live `s()` call passes.
6. Verify with `.innerHTML`, not `.innerText`/`textContent`.

## Editing playable text

1. Find the line (`rg`), read surrounding HTML context.
2. If English changes, update **all** language HTMLs that need it (single-language **and** bilingual), then regenerate `maintenance/aligned_text.json` with `node maintenance/build_aligned_text.js`.
3. CN and TW are separate — a CN wording fix does **not** auto-update TW.
4. Re-run route smoke tests; rebuild Gallery if routes/titles changed; regenerate transcripts after climax wording or `write_transcripts.js` changes (see toolkit below).
5. Syntax-check touched HTML: extract the `<script>` body and `new Function(...)`.
6. Pull search strings from the file; don’t retype non-ASCII punctuation by hand.
7. For multi-line JS replacements, check brace balance.

Shared scenes must respect the current date's clothing in `info()`: Tuesday has stockings and pink knickers, Thursday has tights and sky-blue knickers, and Saturday has a dress, white knickers and bare legs. Preserve those distinctions when branches converge. The declared `stampstalking` flag records whether the stamp collection has already been introduced; it is included in Back/replay snapshots.

`aligned_text.json` is a generated cross-language reference — it does **not** build HTML. Each entry records a source function/array and one-based slot. Story and choice calls align by location across the five standalone editions; dynamic calls retain complete expressions, and the three text-variant arrays are included. Do not hand-edit reference text or counts. Run `build_aligned_text.js` after source changes, or `build_aligned_text.js --check` to detect drift without writing. Existing IDs are retained where possible; deleted entries are removed without renumbering the rest.

When adding a copy of existing text in another scene, preserve the original occurrence’s reference ID. The generator claims surviving source/function matches one-to-one across the inventory before considering cross-function reuse. Translations help distinguish repeated English text and identify a reworded original. `test_aligned_text.js` covers copied, shifted, moved, reworded and removed occurrences, repeat builds, repeated choice labels, and simultaneous copy/move/reword interactions; the full canonical verifier runs it. Truly indistinguishable repeated occurrences still require editorial judgment.

For an ambiguous simultaneous split and reword, `build_aligned_text.js --id-remap=/absolute/path/remaps.json` accepts an explicitly reviewed one-off ID assignment. The JSON array supplies `id`, old `from` and new `to` source objects (`node`, `slot`), and exact `before`/`after` text objects for all five language codes. The generator validates the ID, locations, kind/choice target and every language before claiming that ID; stale or conflicting assignments fail before writing. Explicit remaps accept only static text: dynamic calls are rejected because literal prefixes do not guard their complete expressions. Keep the mapping and its source guards with the audit evidence. Subsequent ordinary builds need no remap file. Do not rerun a consumed migration or use it to conceal an unintended ownership change.

The bilingual alternate-language formatting helpers are generated inside `BEGIN ALTERNATE_RENDERER` / `END ALTERNATE_RENDERER` markers from the corresponding standalone edition. Run `build_bilingual_renderer.js` after changing standalone rendering functions. `s`, `sAlt`, `c`, `cAlt`, and bilingual intimacy notices use this renderer for the alternate layer. Keep the English renderer separate so French spacing and language-specific typography match their respective standalone editions.

Identical English strings can have different translations in different contexts. Use `sAlt(en, alt)` or `cAlt(tag, en, alt)` for those cases instead of duplicate dictionary keys. Dynamic status lines use separate English and alternate variant arrays with the same `despLineIndex`; these arrays are fixed text, not mutable game state.

## Settled wording (don't reopen unless asked)

**UI / meters**
- **Immersion CTA:** EN `On with the story!`; CN `开始约会！`; TW `開始約會！`; ES `¡Empezar la cita!`; FR `C'est parti pour le rendez-vous !` (narrow no-break space before `!`).
- **Buy something:** shop-literal in all langs (`买点东西` / `買點東西` / `Comprar algo` / `Acheter quelque chose`).
- **Money meter:** EN `Pounds`; CN `英镑`; TW `英鎊`; ES `Libras`; FR `Livres sterling`.
- **Prices:** whole pounds, no `.00` (`£1`, `15英镑`). Pence use two places (`£1.50`, `1.50英镑`). FR: `1,50 £`.
- **French speaker labels:** `smartenText` supplies the narrow nonbreaking space before a known speaker’s colon, including when source spacing was ordinary or absent. It does not rewrite times or URL colons. Keep the bilingual English renderer independent.
- **Localized price rendering:** ES/FR `smartenText` displays symbol prices with the amount first, a decimal comma, and a nonbreaking space before £. It handles both source orders within visible text; `smartenHtml` leaves HTML attributes untouched. Keep the bilingual English renderer separate and regenerate alternate renderers after changes. Do not pre-bake price typography throughout the source. Ambiguous thousands/long decimal forms are not guessed; current game prices use whole pounds or two decimal places.
- **Money accounting and balances:** `formatPounds(amount, language)` formats displayed balances while state stays numeric; ES/FR use decimal commas. Restaurant coffee is charged once when ordered: two filters £2, two espressos £3, or Simon's cappuccino plus Diane's espresso £3.50. The automatic order at `asklootalk1` also charges £2 and sets `buyfiltercoffee = 2`; retain its existing drink-input timing without adding another dose. The foyer-bar beer/lager round at `foyerbar1` is explicitly funded by Diane; keep Simon's balance unchanged. This payer was clarified editorially because no original price was documented. The ordinary Pavilion first round is paid by Robert/Bruno, so do not charge Simon for it. Optional spending offers require sufficient funds and their endpoints also guard insufficient funds. If the late farewell round is unaffordable, continue to the bus without buying it. Do not clamp a negative balance to hide a missed debit/affordability bug.
- **Molly digestion (`mollyproc`):** Molly has no HUD. `digestMolly(n)` moves `n` ml into `mollyblad` and depletes `mollyproc`, flooring that tank at 0 so it cannot go negative. Walking and chat beats still fill `mollyblad` by the same amounts as before; `molly_desp()` and the skip-scene threshold continue to read `mollyblad`. Do not invent a foyer beer/lager price.
- **Status-bar tummy (`proc`):** EN `Tummy`; CN/TW `肚子`; ES `Vientre`; FR `Ventre`. Match the notes’ body word — do not revive mechanic glosses (`待转化水分`, `Líquido en tránsito`, etc.).
- **Intimacy amounts:** only via `getinti` (exact notice). Hand-written scene summaries may cover shyness/scene, not vague “lots of / a few” intimacy. **Shyness** changes go through `adjpoints(±n)` and clamp at **0**; intimacy may still go negative.
- **Luckshots:** start at 3. Early uses `spendLuckshot()` (decrement, floor 0). From taxi home / either successful bus-home boarding path / short Tuesday–Thursday jump, `capEndgameLuckshots()` leaves at most 1 remaining (the on-screen “only one beyond this stage” notice is not display-only). Home/lounge luckshots must decrement, never `luckshots = 0` (that wiped 3→0 after Skip-to-the-good-bit + Back, because Skip records every `go()` but those functions used to zero the meter in one step). Chloe doorbell luckshot (`luckytrip19`) also spends.

**CN / TW register**
- **Caretaker:** CN/TW **管理员** / **管理員** (council first-mention may stay **市政管理员**). Not 看守员/环卫工人/etc.
- **Bouncer (Pavilion):** **保安**. Occasional **门卫** for English *doorman* — not the toilet caretaker.
- **Bra:** CN **文胸** throughout; TW **胸罩**. Do not mix.
- **Miniskirt:** one word in EN (`miniskirt` / `miniskirted`), never `mini-skirt` / `mini skirt`. First clothing-list mention of the bus-queue girl is `Debbie (the brunette) wears a miniskirt.`
- **Underwear (EN playable):** narration and clothing notes use **knickers**. Spoken idioms keep **pants** (`get my pants down`, `wet my pants`, `pants and trousers`). Do not use *panties*. Gallery leaf: *Discarded Knickers* (transcript slug `07a_spyhole_panties` is a filename only).
- **High bladder status:** `…两脚不停地来回挪动。` / `…兩腳不停地來回挪動。`
- ***Can't stand still* (fidget):** CN/TW **站不定**, not **站不住** (后者偏站不稳/要垮). Keep **站不稳** only for physical unsteadiness (key in lock, *hardly stand upright*).
- **Pee-start (`x01570`):** CN `她几乎立刻就尿了。` / TW `她幾乎立刻就尿了。` (keep 几乎/幾乎; no 开始/開始). CN connector **接着** ↔ TW **接著**.
- **Play still on (`x00027`):** **停演** wording (`…想在停演前去看一次…`), not **下演**.
- **TW-only (do not copy onto CN):** Gallery/story register uses **流動廁所** (CN **移动厕所**), **樹叢** (CN gallery **灌木**), **尿尿** on several Gallery pee leaves (CN often **小便**), **西洋棋課** (CN **下棋课**).

**Scene lines**
- **Urinal straddle (`x01569b`):** EN comma before aside (`…urinal, with her back to you`), no em dash. CN/TW: **横跨/橫跨**, aside after `——`, prefer **更省事**. ES `ponerse a horcajadas…`; FR `enjamber l'urinoir…`.
- **Church mind-races (bus luckshot):** `…and only then could she finally relieve herself.` — inversion after *only then*; not *only now*, not *only then she could*, no trailing *there*.

## Conversation continuity

Saturday sofa topics record what has actually been displayed in `sofaTopicsSeen`; repeat visits retain their timing and actions without restarting the eight biographical conversations. `sofaEveningAsked` prevents repeating the evening-review question and its answer. The sofa uses `stampstalking`, `theatretalking` and `movingtalking` to acknowledge earlier conversations; both dinner job branches set `movingtalking`.

`brotherHome` records an established presence at home, including the upstairs bathroom scene. The stamp/train luckshot arrival branches require `!brotherHome`; when he is already home, they use the existing relaxed-album continuation instead of bringing him and Chloe through the front door again. Ordinary first introductions remain available. All four new history variables start at zero and belong to `gameStateVars`, so Back restores dialogue and arrival history. `verifyRepetition` in `verify_audit_regressions.js` covers the real routes, translated text, Back/replay and separately labelled rendering boundaries.

## UI / Gallery conventions

**Boot and theme**
- No age gate. Boot opens on `start` (title); first `go("start")` does not push history, so Back is not offered on the title screen.
- **Dark mode** persists across refresh via `sessionStorage.dianeDarkMode` (`1`/`0`). Gallery guide reload keeps the same preference automatically. A new tab starts light.
- Pregame screens freeze/hide stats until the date starts.
- **Theme tokens** live in each `outputs/*/dianedate_*.html` `:root` / `[data-theme="dark"]`. Light stays wine-on-parchment. Dark uses pale straw gold for accents + CTA fills (`--on-accent` = dark ink on straw); dark `--status` is `#2f2822` (above paper, near choice) so the attribute table reads as a panel; dark `--choice-hover` `#534433`; `--highlight-bg` `#4a4024`; `--guide-hover-bg` `#5f4c32` (hover fills stay below ink luminance). Hover/key-press text uses `--ink-on-hover` (dark: `#faf6ee`; light: same as ink) so straw text doesn’t wash into the hover tray. Guide + hover: fill → `--guide-hover-bg`, accent inset stays.

**Shortcuts**
- `b` Back, `h` guide toggle, `g`/Esc Gallery, `l` bilingual language, `1–9` choices, `S` Skip to the good bit (`climaxIndex`, same cut as climax transcripts).
- Number-key / guided Enter flash: one pending pick only (`choiceKeyPending`); `#box.choice-key-armed` suppresses `.choice:hover` so keyboard wins over mouse. A numbered pick on a Guide-highlighted row uses `--guide-hover-bg` (same as guide hover), not the ordinary `--choice-hover` wash.
- **Enter** selects the highlighted guided choice only when a Gallery guide is active **and** Guide is On.
- Focused toolbar buttons and links retain native Enter activation. Opening Gallery cancels held navigation and any pending numbered-choice flash. The labelled dialog traps focus, makes background elements inert, restores focus on close, and is itself inert while closed. Preserve the visible `:focus-visible` indicators; opacity and pointer-events alone do not exclude hidden controls from keyboard focus.
- **Reduced motion / zoom / touch:** `prefers-reduced-motion: reduce` skips the screen-fade, Gallery overlay transitions, visual GIF loops (still PNGs), JS drain/puddle clocks, and sprite tremor. Do not set `user-scalable=no` or a maximum scale. Keep 44px tap targets and `touch-action: manipulation` on controls so pinch-zoom still works on the page. Wiki article lists wrap. Wiki Dark Mode scrolls with the page; do not make the toolbar sticky. Wiki Dark Mode and Back to Menu share the same control height, padding, font-size, and line-height.

**Gallery names and hover**
- Leaf titles keep proper names even if the group already names that person (*Molly Pees Behind the Skip*, *the Brunette…*, *Diane Pees in the Bath*, *Chloe Wets Her Knickers*). Do not replace a name with *her/she* as the scene subject.
- Chloe’s group is singular **Chloe Consolation Prize** (two variants of one prize, like Amanda); Outdoor / Lounge stay plural.
- Gallery rows hover/focus-visible with `--choice-hover` wash **and** `--accent` text (wine `#9b2f3f` light / gold dark — same token family as links/CTAs; brighter than heading `--accent-dark` so light-mode hover reads clearly). Rows are `appearance: none` buttons so WebKit honours `color`. Open groups: no wash — chevron ▾ plus revealed children mark open; wash is hover-only.

**Notices and bilingual UI**
- **Points notices** (intimacy via `getinti`, shyness/bladder status lines): `<p class='notice'><strong>…</strong></p>` — bold, **no** `<EM>` and **no** orange `#FF9966` spans. Port to every mono + bilingual (source `s()` + dictionary keys/values) and `aligned_text.json`.
- **Bilingual guide highlighting:** guard `querySelectorAll("button.choice")` with `offsetParent !== null`; `setLanguage()`/`toggleLanguage()` must call `syncGuideDisplay()`.

## Maintenance toolkit

| Path | Role |
|------|------|
| `AI_HANDOFF.md` | This file — conventions + toolkit map |
| `verify_ending_routes.js` | Click-paths for prize endings and extra hidden scenes; running it smoke-tests those paths. Read-only; does not write or delete files. |
| `write_hidden_scenes.js` | Classic hidden-scene Gallery definitions (titles, climax starts). Not transcripts. |
| `write_transcripts.js` | Writes climax `.txt` transcripts → `outputs/{lang}/transcripts/{endings,hidden_scenes}/` |
| `build_gallery_data.js` | Packs the two route books into `GALLERY_DATA` and injects that into the HTML |
| `check_endings.js` | Shared early-bush base + helpers |
| `replay_route.js` | Replay one click-path against an HTML file (helper for `check_endings.js`) |
| `gallery_data.json` | Generated Gallery snapshot (don’t hand-edit) |
| `aligned_text.json` | Aligned EN/CN/TW/ES/FR strings |
| `build_aligned_text.js` | Rebuild the source-located translation reference; `--check` is read-only |
| `text_sources.js` | Shared lexer for text call sites, variant arrays, and translation dictionaries |
| `build_bilingual_renderer.js` | Copy standalone formatting helpers into the bilingual alternate renderer; `--check` is read-only |
| `verify_text_consistency.js` | Check all static text in both rendered bilingual layers, dictionary uniqueness, and focused dynamic/branch cases |
| `sync_visual_edition.js` | Synchronize canonical English files/tools to ADWD-visual and rebuild; `--check` is read-only |
| `test_visual_sync.js` | Isolated synchronization tests using temporary fixture repositories; does not alter the real checkouts |
| `audit_state_space.js` | Bounded actual-choice exploration with state fingerprints, conditional outcomes, witnesses, and explicit pruning limits; not exhaustive proof |
| `verify_audit_regressions.js` | Canonical-only coffee accounting/narration, theatre preorder/water, high-spending routes, ordinary-bus cap, riverside continuity, date-specific clothing, Back/replay, and labelled synthetic boundary checks |
| `verify_browser_controls.js` | Separate real-browser controls, modal focus, selected layout, and money/focus display checks; requires Playwright and matching engines |

Do **not** leave scratch audit dumps in this folder (delete after use). Ignore local `.DS_Store` files; do not commit them.

After wording/route edits:

```bash
node maintenance/verify_ending_routes.js
node maintenance/write_hidden_scenes.js
node maintenance/build_aligned_text.js
node maintenance/verify_text_consistency.js
```

If Gallery routes/titles changed:

```bash
node maintenance/build_gallery_data.js
```

After climax wording or transcript-writer changes (also after Gallery rebuild):

```bash
node maintenance/write_transcripts.js
```

`write_transcripts.js --check` compares the 226 managed transcripts against current route renders without writing. The full `verify_project.js` also checks this, the reference index, alternate renderer generation, and bilingual text consistency.

`verify_ending_routes.js` green across all five languages is the fastest smoke test after a text batch.

## Do / don't

**Do:** targeted user-directed edits; keep HTML + `aligned_text.json` in sync; rebuild Gallery when routes/titles change; regenerate transcripts after climax wording or transcript-writer changes; port every fix to bilingual (source + dictionary).

**Don't:** bulk "fluency" rewrites without an explicit ask; treat TW as auto-generated from CN; force-push history unless asked; edit only one language when the English source issue affects all; assume a single-language fix also landed in bilingual.


## Verified maintenance baseline (13 September 2026)

- Run `node maintenance/verify_project.js` for the complete maintained-edition regression check. It replays 46 Gallery routes in each edition and checks Back/forward HTML and state, guided progress, and Skip. In the text repository it also checks all nine playable editions against English numerical state. It is not a substitute for browser layout or animation testing.
- `gameStateVars` includes `despLineIndex`. Any future state or text counter that affects replay must be included in snapshots. Restore must not execute a story node a second time. Back remains session history, not a disk save.
- All playable documents have a doctype, page title, and language metadata. Bilingual layers declare their own languages; `setLanguage()` updates the document language too.
- `verify_ending_routes.js` and `write_hidden_scenes.js` are read-only. The latter checks definitions; the full verifier checks actual routes. Never add implicit deletion to a check command.
- Route definitions are authoritative for generated Gallery data. `build_gallery_data.js --check` detects drift without writing. Rebuild the Gallery and then transcripts after route changes. Transcript generation renders every managed output before writing and preserves unrelated files.
- Input paths in the maintained game-check/build commands are resolved from the script location. Do not rely on the caller's working directory.

## Gallery curation rule — September 2026

The owner rejected the variations-panel design. Keep the classic Gallery layout: no Variations buttons, extra explanatory menu notes, setup selectors or conversation-variation section. Add a leaf only for a meaningfully different event, action, encounter or outcome. When the scene differs only in dialogue, select one coherent, complete representative route using real earlier choices. Do not splice text, force state flags or create a leaf for each wine/day/meal.

The camper encounter “You and Diane Come Across the Brunette” uses the fuller Saturday/Pinot variant and is now localized in all editions. The curation pass compares complete playable routes for endings and only each hidden scene’s displayed duration. Fourth Prize, the two portaloo scenes and the two solo camper approaches use reviewed representatives. The train/stamp albums retain their complete variants. Gallery and transcripts pair translations by stable leaf ID. All five standalone and four bilingual editions contain the same 46 leaves; the 230 standalone transcripts are generated from those routes. The school-age flashbacks were excluded from content curation; their existing navigation and parity remain covered.

The direct camper encounter is fourth within its group: after the solo encounters and before the covert-watching branches. Its title remains “You and Diane Come Across the Brunette”. The guide and transcript open on `carparka0`, cover the encounter on `carparka1`, and stop before `taxihome1`. The final taxi-rank choice correctly remains unhighlighted because it is outside this scene; Back restores the highlighted waiting choice. The transcript filename `09ba_camper_encounter_en.txt` keeps it in Gallery order without renaming existing transcripts.

The camper group pairs “Caught by the Brunette’s Boyfriend” immediately after “Peeping Underneath”, then closes with the non-watching choice. Its transcript slug is `09da_camper_caught`; the retired `09f_camper_caught` filenames were deliberately migrated. The Chardonnay solo scene now includes the return-to-queue response on `carpark3`, ending before `busqueue7`. All scene-final continuation choices remain available but unhighlighted.
