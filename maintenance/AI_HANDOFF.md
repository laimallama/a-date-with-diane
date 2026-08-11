# AI handoff — A Date With Diane

Read this before editing. Ship text lives in `outputs/`. Toolkit lives in `maintenance/`.

## What this project is

Restored multi-language edition of the old HTML branching adult text game *A Date With Diane*: cleaned wording/logic, Back with state restore, in-game Gallery + guides/transcripts, dark mode, five playable languages.

**Languages (all independent):** `en`, `cn`, `tw`, `es`, `fr` under `outputs/{lang}/`.
TW is Traditional Chinese with Taiwan-flavoured wording — edit it like ES/FR, not as a derivative of CN.

Each folder has: playable HTML (+ bilingual except EN), edition notes, endings guide + transcripts (10), hidden-scenes guide + transcripts (22).

## Raw HTML vs rendered text

Raw `dianedate_*.html` strings intentionally look rough (straight quotes, uncapitalized choices, legacy `<LI>`/`<EM>`, etc.). A render-time pipeline (`polishStoryHtml`, `polishChoiceText`, `smartenHtml`, speech-aside wrappers, …) fixes that every display.

**Do not "fix" raw source to pre-bake typography.** Judge text in a real render (browser or route scripts). Route matching uses rendered text.

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

**Per-language rendering of category 1 (kept parenthetical cues) only:**
- EN / ES / FR: plain italics + parens, e.g. `(quietly)`.
- CN / TW: italics + **full-width** parens `（）`, not ASCII `()`. This is the general CN/TW convention for *any* surviving `<EM>` aside, not just cues.

Categories 2 and 3 never get parens or italics in any language — they're just narration.

**Titles/play names are a completely separate rule, not affected by any of the above:** EN uses `<EM>italics</EM>` (e.g. `<EM>The Importance of Being Earnest</EM>` — note the "The"; `<EM>Outside Edge</EM>`). CN/TW use `《》` book-title marks with **no** `<EM>` at all (`《不可儿戏》`/`《不可兒戲》`, `《外缘》`/`《外緣》`). ES/FR use guillemets `« »` with no `<EM>` (`«La importancia de llamarse Ernesto»`, `« L'Importance d'être Constant »`). "Gwendolen" (not "Gwendoline") is the correct spelling for the *Earnest* character in all languages that use the Latin name as-is.

**Transcripts use a completely different, independent convention:** `maintenance/write_ending_transcripts.js` / `write_hidden_scenes.js` render any surviving `<EM>`/`<B>` as `[bracketed]` text (via `bracketForTranscript`, which strips whatever parens were in the HTML source first) — this is unrelated to the HTML-source rule above. Don't try to make the two consistent; they're for different mediums.

## Bilingual files are a second copy — treat fixes as two jobs, not one

`outputs/{lang}/dianedate_{lang}_bilingual.html` (all except EN) embeds its **own independent copy** of every English `s()`/`c()` call plus a giant `alternateTranslations = { "<exact EN string>": "<translated string>", ... }` dictionary (`translateAlt()` does an exact-match lookup, falling back to `alternatePrefixTranslations` prefix-matching, falling back to returning the English unchanged if nothing matches — a silent, easy-to-miss failure mode).

**"Bilingual should be exactly the same as the single-language file, just two of them together" is a hard standing rule from the project owner.** Any wording, formatting, or logic fix made to a single-language file (including EN) must be ported to the bilingual EN source **and** the bilingual dictionary too, or the bilingual edition silently drifts out of parity. This has bitten this project more than once — features (peepunder ambient lines, the sofaloop drinking-loop variety) were fixed in single-language files and simply never ported to bilingual for a long stretch before being caught.

When splitting an `s()` call in a bilingual file (per the stage-direction rules above):
1. Find and split the EN source line the same way as the single-language fix.
2. Find the **old** dictionary entry keyed by the old (unsplit) EN string, delete it.
3. Add one new dictionary entry per new split line: `"<new EN line>": "<translated line>"`.
4. **Watch for duplicate keys.** Splitting tends to produce short, generic reusable English fragments (`"<LI>She pauses."`, `"<LI>DIANE: Yes."`) that may already exist as a dictionary key elsewhere, or that you yourself add more than once across different fixes with *different* translations. Since `alternateTranslations` is a flat JS object literal, a duplicate key silently overwrites the earlier one at parse time (last one in the file wins) — so two unrelated scenes can end up showing the same, wrong, translated line. After any batch of dictionary edits, check for new duplicate keys:
   ```js
   const raw = fs.readFileSync(path,'utf8').match(/var alternateTranslations = (\{[\s\S]*?\n\});/)[1];
   const counts = {};
   [...raw.matchAll(/^\s*"((?:[^"\\]|\\.)*)":/gm)].forEach(m => counts[m[1]] = (counts[m[1]]||0)+1);
   Object.entries(counts).filter(([,c]) => c>1).forEach(x => console.log(x));
   ```
   If you find a genuine new duplicate, consolidate to one canonical value and delete the rest — don't leave stale duplicate lines even if the "last wins" behavior happens to resolve correctly, since it's confusing for the next editor.
5. **Watch for the `<LI>`-prefix trap.** A dictionary key sometimes includes the leading `<LI>` as part of the string and sometimes doesn't, depending on how the original `s()` call was written. If you add a fix keyed on the wrong variant, you create a dead, unused entry while the real lookup (with the actual `<LI>` state) stays stale. Always grep the *exact* text the live `s()` call passes, not what you assume it should be.
6. Verify with `.innerHTML`, not `.innerText`/`textContent`, when checking a live render in the browser — `.innerText` silently strips the very tags (`<em>`, parens) you're trying to verify.

Small, generic dictionary values (interjections like `"Mmm."`, `"Yes."`) legitimately being identical to the English is normal and not a bug — check the actual rendered meaning, not just whether EN and translated text happen to match.

## Editing playable text

1. Find the line (`rg`), read surrounding HTML context.
2. If English changes, update **all** language HTMLs that need it (single-language **and** bilingual — see above), plus `maintenance/aligned_text.json`.
3. CN and TW are separate: a CN wording fix does **not** auto-update TW — edit `outputs/tw/` yourself when TW should change. Function names (e.g. `sofasat1`, `admission`, `taxihome2`) are identical across every language file, which makes them the reliable way to locate the corresponding text in another language when you know the English line but not its translation.
4. Regenerate guides/transcripts/gallery if player-facing route or title text changed (see toolkit table below).
5. Syntax-check every touched HTML file before calling it done: `node -e "new Function(fs.readFileSync(path,'utf8').match(/<script>([\s\S]*)<\/script>/)[1])"` (extract the `<script>` body and try to compile it). This catches broken JS from a bad find/replace without needing a browser.
6. For text extraction/replacement, always pull the "old" search string directly out of the file (`.read()` + `.find()`/slicing or `grep -n`) rather than retyping it by hand. This codebase is full of non-ASCII punctuation that looks identical in a terminal but isn't the same byte: full-width CJK `（）：`, French narrow no-break space ` `, curly apostrophes `’` (U+2019) vs straight `'`. A hand-typed "old" string that looks right will silently fail to match (count 0) or, worse, match the wrong thing.
7. When doing a multi-line JS replacement, sanity-check brace balance first: `old.count('{') - old.count('}') == new.count('{') - new.count('}')`.

`aligned_text.json` is a cross-language index for checks — it does **not** build HTML.

## Maintenance toolkit

| File | Role |
|------|------|
| `write_verified_guides.js` | Ending guides for en/cn/tw/es/fr |
| `write_ending_transcripts.js` | Ending transcripts (10 each) |
| `write_hidden_scenes.js` | Hidden-scene guides + transcripts (22 each) |
| `build_gallery_data.js` | Rebuild/inject `GALLERY_DATA` (all langs + bilingual) |
| `check_endings.js` / `verify_routes.js` | Shared routes / single-route replay |
| `gallery_data.json` | Generated gallery snapshot (don't hand-edit) |
| `aligned_text.json` | Aligned EN/CN/TW/ES/FR strings |

Regen after wording/route edits:

```bash
node maintenance/write_verified_guides.js
node maintenance/write_ending_transcripts.js
node maintenance/write_hidden_scenes.js
```

If Gallery routes/titles or route button text changed:

```bash
node maintenance/build_gallery_data.js
```

`write_verified_guides.js` replaying all 10 endings for all 5 languages without error is the fastest smoke test that a batch of text edits didn't break route logic — run it after every batch, not just at the end.

## Settled wording (don't reopen unless asked)

- **Immersion CTA:** EN `On with the story!`; CN `开始约会！`; TW `開始約會！`; ES `¡Empezar la cita!`; FR `C'est parti pour le rendez-vous !` (narrow no-break space before `!`).
- **Buy something:** shop-literal in all langs (`买点东西` / `買點東西` / `Comprar algo` / `Acheter quelque chose`).
- **Prices:** whole pounds, no `.00` (`£1`, `15英镑`). Pence use two places (`£1.50`, `1.50英镑`). FR: `1,50 £`.
- **Caretaker:** CN/TW **管理员** / **管理員** (council first-mention may stay **市政管理员**). Not 看守员/环卫工人/etc.
- **Bouncer (Pavilion):** **保安**. Occasional **门卫** for English *doorman* — not the toilet caretaker.
- **High bladder status:** `…两脚不停地来回挪动。` / `…兩腳不停地來回挪動。`
- **Urinal straddle (`x01569b`):** EN comma before aside (`…urinal, with her back to you`), no em dash. CN/TW: **横跨/橫跨**, aside after `——`, prefer **更省事**. ES `ponerse a horcajadas…`; FR `enjamber l'urinoir…`.
- **Pee-start (`x01570`):** CN `她几乎立刻就尿了。` / TW `她幾乎立刻就尿了。` (keep 几乎/幾乎; no 开始/開始). CN connector **接着** ↔ TW **接著**.
- **Play still on (`x00027`):** **停演** wording (`…想在停演前去看一次…`), not **下演**.
- **Stage directions / asides:** see the dedicated section above — this is the most recently settled and most frequently re-litigated convention in the project; don't reopen the delivery-cue vs. action-vs-mid-dialogue split without being asked.

## UI (keep unless asked otherwise)

- Gallery + guided walkthrough + Back; shortcuts: `b` Back, `h` guide toggle, `g`/Esc Gallery, `l` bilingual language, `1–9` choices. **Enter** selects the highlighted guided choice only when a Gallery guide is active **and** Guide is On; otherwise Enter does nothing (normal play still uses `1` for the first choice). These are also summarized in the in-game Notes (`start1`, `x00014a`/`x00014b`): Gallery top-left, keys, Back full-state restore, and Guide on/off/deviate rules.
- **Dark mode:** a `toggleTheme()` button (`Dark Mode: On/Off`) sets `data-theme` on `<html>`. It is a **runtime-only** toggle — deliberately **not** persisted via `localStorage` or any other storage, so it resets to light on every fresh load. Don't add persistence unless explicitly asked; this was a considered choice, not an oversight. (Gallery guide state, unrelated to theme, does use `sessionStorage` — that's fine to keep as-is, it only survives a same-tab reload, not a new tab/session.)
- Pregame screens freeze/hide stats until the date starts; catch-up digestion ticks on first story screen — don't remove without re-verifying all routes.
- Screen fade on step change (`.screen-fade`, ~0.18s) + scroll-to-top via `presentScreen()`; disabled under `prefers-reduced-motion`.
- Choice number badges and sticky-Back experiments were rejected; don't reintroduce.
- **Bilingual guide highlighting:** because both language layers (`div.lang.lang-en` / `div.lang.lang-alt`) render simultaneously in the DOM (only one is CSS-hidden at a time), any code that does `document.querySelectorAll("button.choice")` will find duplicate buttons across both layers. `applyGuideHighlight()` and related functions guard against this with an `offsetParent !== null` visibility check — don't remove it, and apply the same guard if you add new code that queries `.choice` buttons in a bilingual file. Similarly, `setLanguage()`/`toggleLanguage()` call `syncGuideDisplay()` at the end so an active guide's highlight follows the language switch instead of getting stuck on the now-hidden layer — keep that call if you touch language switching.

## Do / don't

**Do:** targeted user-directed edits; keep HTML + `aligned_text.json` in sync; regenerate guides when routes change; port every fix to bilingual (source + dictionary), not just single-language.

**Don't:** bulk "fluency" rewrites without an explicit ask; treat TW as auto-generated from CN; force-push history unless asked; edit only one language when the English source issue affects all; assume a fix that landed in single-language files also landed in bilingual — check.

## Status

`main` ships the five-language restored edition (10 endings / 22 hidden scenes each, incl. the luckshot-gated "caught by the brunette's boyfriend" scene) with dark mode and full stage-direction formatting parity across all 5 single-language files **and** all 4 bilingual files (source text + translation dictionaries). Dark mode persists across the Gallery's `location.reload()` via `sessionStorage` (not `localStorage` — still resets on a genuinely new tab). All 4 bilingual `alternateTranslations` dictionaries had their duplicate-key translation conflicts resolved (see the dedicated section above — watch for this recurring any time a stage-direction line gets split, since splitting tends to produce short reusable English fragments that collide). Last verified: all 9 game HTML files pass a JS syntax check and `write_verified_guides.js` replays all 10 endings clean in all 5 languages. Pushed to `origin/main` at commit `05cd299`.

**Open work, not yet started:** a full reachability audit found the Gallery documents only 466 of 721 reachable scene functions. A curated list of 10 specific, verified-worthy additions (6 whole undiscovered scenes + 4 unexercised story variants hiding inside already-"documented" functions, e.g. `storytime()` has 4 completely different stories gated by dessert choice and only 1 is ever shown) plus a proposed Gallery UI change (grouped entries with sub-choices, so variant families don't bloat the flat list) is fully written up in [`maintenance/GALLERY_EXPANSION_PLAN.md`](GALLERY_EXPANSION_PLAN.md) — read that before starting any Gallery-content work, it has exact function names, exact text, and an explicit "don't re-investigate these" list from things already checked and rejected this session.
