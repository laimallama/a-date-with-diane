# AI handoff — A Date With Diane

Read this before editing. Ship text lives in `outputs/`. Toolkit lives in `maintenance/`.

## What this project is

Restored multi-language edition of the old HTML branching adult text game *A Date With Diane*: cleaned wording/logic, Back with state restore, in-game Gallery (guided walkthroughs + Skip to the good bit), dark mode, five playable languages.

**Languages (all independent):** `en`, `cn`, `tw`, `es`, `fr` under `outputs/{lang}/`.
TW is Traditional Chinese with Taiwan-flavoured wording — edit it like ES/FR, not as a derivative of CN.

Each language folder ships:

- playable HTML (`dianedate_*.html`; bilingual with English except EN)
- `edition_notes_*.txt`
- climax transcripts under `transcripts/endings/` and `transcripts/hidden_scenes/`
- English only, for now: companion wiki under `outputs/en/wiki/` (not playable)

There are **no** external click-path guide `.txt` files. The Gallery is the walkthrough. **Climax transcripts** start at the climax of the story or the starting point of the hidden scene for each Gallery entry (Gallery `climaxIndex` / `baseLength`; same cut as in-game Skip to the good bit / scene start). Gallery order, short slugs. In-file title = Gallery **leaf** title only (no group prefix). Bus-home is two hidden-scene leaves: `10a` luckshot (church) and `10b` rioja (too desperate to walk her home).

Gallery currently documents **15 ending leaves** and **29 hidden-scene leaves** per language (leaf counts, not top-level group rows).

All Gallery route label sequences live inline in `write_verified_guides.js` (endings + extras) and `write_hidden_scenes.js` (classic hidden scenes). There is **no** separate `routes/` JSON folder.

The old archive dig (`dianedate27a.html`) is finished: remaining archive-only stubs are unreachable drafts and are not merge candidates.

**Wiki pack** (English only, not playable): [`outputs/en/wiki/`](../outputs/en/wiki/). Numbered encyclopedic articles for Welbourne (early summer 2005). Lead names: Simon Hartley (27), Diane Ellison (25). Neutral encyclopedic register; body/sexual subjects use clinical terms (`urinate`, `urinary urgency`, bladder, lose control) — not slang. Backstory only; do not retell playable branches; do not spell links from wiki traits to in-game beats. Ages: `born …` + `N-year-old` / `aged N` only (never `25 in 2005`). No em dashes and no colons in wiki prose (use a new sentence or a comma construction instead). Character H2s when relevant: Early life and family; Education; Career; Personal life; Residence. Under Personal life reuse the same H3 labels for the same topics (`Relationships`, `Sexual interests`, `Urinary habits` / `Urinary accidents` as needed). Category H3s take the plural (`Relationships`, `Interests`, `Sexual interests`) even when the article mainly covers one example. Do not leak into playable HTML unless asked (then all langs + bilingual).

## Raw HTML vs rendered text

Raw `dianedate_*.html` strings intentionally look rough (straight quotes, uncapitalized choices, legacy `<LI>`/`<EM>`, etc.). A render-time pipeline (`polishStoryHtml`, `polishChoiceText`, `smartenHtml`, speech-aside wrappers, …) fixes that every display.

**Quotes in source → render:**
- **EN:** write straight `'...'` (or straight `"..."`); `smartenText` renders British singles `‘…’`. Do not hardcode American `“…”`.
- **CN:** quoted spans become curly doubles `“…”`.
- **TW:** quoted spans become `「…」`.

**Do not "fix" raw source to pre-bake typography.** Judge text in a real render (browser or route scripts). Route matching uses rendered text; `write_verified_guides.js` `normalize()` strips quote marks so British `‘…’` still matches guide labels written with `“…”` / `"..."`.

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
2. If English changes, update **all** language HTMLs that need it (single-language **and** bilingual), plus `maintenance/aligned_text.json`.
3. CN and TW are separate — a CN wording fix does **not** auto-update TW.
4. Re-run route smoke tests; rebuild Gallery if routes/titles changed; regenerate transcripts after climax wording or `write_transcripts.js` changes (see toolkit below).
5. Syntax-check touched HTML: extract the `<script>` body and `new Function(...)`.
6. Pull search strings from the file; don’t retype non-ASCII punctuation by hand.
7. For multi-line JS replacements, check brace balance.

`aligned_text.json` is a cross-language index for checks — it does **not** build HTML.

## Settled wording (don't reopen unless asked)

**UI / meters**
- **Immersion CTA:** EN `On with the story!`; CN `开始约会！`; TW `開始約會！`; ES `¡Empezar la cita!`; FR `C'est parti pour le rendez-vous !` (narrow no-break space before `!`).
- **Buy something:** shop-literal in all langs (`买点东西` / `買點東西` / `Comprar algo` / `Acheter quelque chose`).
- **Money meter:** EN `Pounds`; CN `英镑`; TW `英鎊`; ES `Libras`; FR `Livres sterling`.
- **Prices:** whole pounds, no `.00` (`£1`, `15英镑`). Pence use two places (`£1.50`, `1.50英镑`). FR: `1,50 £`.
- **Status-bar tummy (`proc`):** EN `Tummy`; CN/TW `肚子`; ES `Vientre`; FR `Ventre`. Match the notes’ body word — do not revive mechanic glosses (`待转化水分`, `Líquido en tránsito`, etc.).
- **Intimacy amounts:** only via `getinti` (exact notice). Hand-written scene summaries may cover shyness/scene, not vague “lots of / a few” intimacy. **Shyness** changes go through `adjpoints(±n)` and clamp at **0**; intimacy may still go negative.

**CN / TW register**
- **Caretaker:** CN/TW **管理员** / **管理員** (council first-mention may stay **市政管理员**). Not 看守员/环卫工人/etc.
- **Bouncer (Pavilion):** **保安**. Occasional **门卫** for English *doorman* — not the toilet caretaker.
- **Bra:** CN **文胸** throughout; TW **胸罩**. Do not mix.
- **Miniskirt:** one word in EN (`miniskirt` / `miniskirted`), never `mini-skirt` / `mini skirt`. First clothing-list mention of the bus-queue girl is `Debbie (the brunette) wears a miniskirt.`
- **High bladder status:** `…两脚不停地来回挪动。` / `…兩腳不停地來回挪動。`
- ***Can't stand still* (fidget):** CN/TW **站不定**, not **站不住** (后者偏站不稳/要垮). Keep **站不稳** only for physical unsteadiness (key in lock, *hardly stand upright*).
- **Pee-start (`x01570`):** CN `她几乎立刻就尿了。` / TW `她幾乎立刻就尿了。` (keep 几乎/幾乎; no 开始/開始). CN connector **接着** ↔ TW **接著**.
- **Play still on (`x00027`):** **停演** wording (`…想在停演前去看一次…`), not **下演**.
- **TW-only (do not copy onto CN):** Gallery/story register uses **流動廁所** (CN **移动厕所**), **樹叢** (CN gallery **灌木**), **尿尿** on several Gallery pee leaves (CN often **小便**), **西洋棋課** (CN **下棋课**).

**Scene lines**
- **Urinal straddle (`x01569b`):** EN comma before aside (`…urinal, with her back to you`), no em dash. CN/TW: **横跨/橫跨**, aside after `——`, prefer **更省事**. ES `ponerse a horcajadas…`; FR `enjamber l'urinoir…`.
- **Church mind-races (bus luckshot):** `…and only then could she finally relieve herself.` — inversion after *only then*; not *only now*, not *only then she could*, no trailing *there*.

## UI / Gallery conventions

**Boot and theme**
- No age gate. Boot opens on `start` (title); first `go("start")` does not push history, so Back is not offered on the title screen.
- **Dark mode** persists across refresh via `sessionStorage.dianeDarkMode` (`1`/`0`). Gallery guide reload keeps the same preference automatically. A new tab starts light.
- Pregame screens freeze/hide stats until the date starts.
- **Theme tokens** live in each `outputs/*/dianedate_*.html` `:root` / `[data-theme="dark"]`. Light stays wine-on-parchment. Dark uses pale straw gold for accents + CTA fills (`--on-accent` = dark ink on straw); dark `--status` is `#2f2822` (above paper, near choice) so the attribute table reads as a panel; dark `--choice-hover` `#534433`; `--highlight-bg` `#4a4024`; `--guide-hover-bg` `#5f4c32` (hover fills stay below ink luminance). Hover/key-press text uses `--ink-on-hover` (dark: `#faf6ee`; light: same as ink) so straw text doesn’t wash into the hover tray. Guide + hover: fill → `--guide-hover-bg`, accent inset stays.

**Shortcuts**
- `b` Back, `h` guide toggle, `g`/Esc Gallery, `l` bilingual language, `1–9` choices, `S` Skip to the good bit (`climaxIndex`, same cut as climax transcripts).
- Number-key / guided Enter flash: one pending pick only (`choiceKeyPending`); `#box.choice-key-armed` suppresses `.choice:hover` so keyboard wins over mouse.
- **Enter** selects the highlighted guided choice only when a Gallery guide is active **and** Guide is On.

**Gallery names and hover**
- Leaf titles keep proper names even if the group already names that person (*Watching Molly…*, *the Brunette…*, *Diane Pees in the Bath*, *Chloe Wets Her Knickers*). Do not replace a name with *her/she* as the scene subject.
- Chloe’s group is singular **Chloe Consolation Prize** (two variants of one prize, like Amanda); Outdoor / Lounge stay plural.
- Gallery rows hover/focus-visible with `--choice-hover` wash **and** `--accent` text (wine `#9b2f3f` light / gold dark — same token family as links/CTAs; brighter than heading `--accent-dark` so light-mode hover reads clearly). Rows are `appearance: none` buttons so WebKit honours `color`. Open groups: no wash — chevron ▾ plus revealed children mark open; wash is hover-only.

**Notices and bilingual UI**
- **Points notices** (intimacy via `getinti`, shyness/bladder status lines): `<p class='notice'><strong>…</strong></p>` — bold, **no** `<EM>` and **no** orange `#FF9966` spans. Port to every mono + bilingual (source `s()` + dictionary keys/values) and `aligned_text.json`.
- **Bilingual guide highlighting:** guard `querySelectorAll("button.choice")` with `offsetParent !== null`; `setLanguage()`/`toggleLanguage()` must call `syncGuideDisplay()`.

## Maintenance toolkit

| Path | Role |
|------|------|
| `AI_HANDOFF.md` | This file — conventions + toolkit map |
| `write_verified_guides.js` | Ending-route smoke test (en/cn/tw/es/fr); holds **all** ending/extra route label sequences (bases/tails + expanded Gallery routes); **no guide `.txt` output** |
| `write_hidden_scenes.js` | Hidden-scene definitions for Gallery; verify only from `main` |
| `write_transcripts.js` | Climax transcripts → `outputs/{lang}/transcripts/{endings,hidden_scenes}/` (from climax/scene start) |
| `build_gallery_data.js` | Rebuild/inject `GALLERY_DATA` into all HTML (+ bilingual) |
| `check_endings.js` | Shared early-bush base + helpers |
| `verify_routes.js` | Replay one route against an HTML file |
| `gallery_data.json` | Generated Gallery snapshot (don’t hand-edit) |
| `aligned_text.json` | Aligned EN/CN/TW/ES/FR strings |

Do **not** leave scratch audit dumps in this folder (delete after use). Ignore local `.DS_Store` files; do not commit them.

After wording/route edits:

```bash
node maintenance/write_verified_guides.js
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

`write_verified_guides.js` green across all five languages is the fastest smoke test after a text batch.

## Do / don't

**Do:** targeted user-directed edits; keep HTML + `aligned_text.json` in sync; rebuild Gallery when routes/titles change; regenerate transcripts after climax wording or transcript-writer changes; port every fix to bilingual (source + dictionary).

**Don't:** bulk "fluency" rewrites without an explicit ask; treat TW as auto-generated from CN; force-push history unless asked; edit only one language when the English source issue affects all; assume a single-language fix also landed in bilingual.
