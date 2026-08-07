# AI handoff for A Date With Diane

This document is for any future AI or agent taking over maintenance of this project.
Read this before making changes.

## Project identity

This project is a restored, cleaned, translated, documented, and expanded edition of the old HTML text game *A Date With Diane*.

The original game was an old, single-file, JavaScript-driven adult branching text game. The restored edition keeps the original narrative flavour but improves the playable experience, fixes logic and wording issues, removes obsolete image placeholders, adds a back button with state restoration, adds multiple language editions, and documents all verified endings and hidden scenes.

The publishable files are in `outputs/`.

The maintenance toolkit is in `maintenance/`.

Do not treat the old original HTML as the working source unless the user explicitly asks for comparison with the historical original. The current final edition lives in `outputs/`.

## Read the rendered output, not the raw source text

The raw JavaScript source in every `outputs/*.html` file is intentionally left "rough" in specific, predictable ways: straight quotes and apostrophes instead of curly ones, choice text that isn't capitalized or doesn't end in punctuation, legacy uppercase tags like `<LI>`/`<STRONG>`/`<EM>`, occasionally unbalanced or unclosed tags, and italic manner-note asides (`DIANE: <EM>whispers</EM> ...`) with no surrounding parentheses. **This is by design, not a backlog of bugs.** A render-time pipeline fixes all of it automatically, every time, for every language. The functions (all defined near the top of each file's script, called from `s()` and `c()`):

- `normaliseLegacyHtml()` — lowercases legacy tags (`<LI>` → `<p>`, `<STRONG>` → `<strong>`, `<EM>` → `<em>`, etc.) and normalises `<div align="center">` to a class.
- `balanceLegacyHtml()` — auto-closes/re-balances mismatched tags left over from the legacy source.
- `ensureStoryBlock()` — wraps bare text in a `<p>` if it isn't already block-wrapped.
- `polishStoryHtml()` — collapses whitespace before punctuation, fixes doubled punctuation, normalises speaker-name colons (`YOU::` → `YOU:`), fixes `carpark` → `car park`, collapses runs of "..."/"!!!"/"???", strips empty formatting artifacts, auto-applies the title/venue-note/ending-congrats CSS classes by pattern-matching the visible text, and ensures the paragraph ends in punctuation (period or CJK equivalent) before finally calling `smartenHtml()`.
- `polishChoiceText()` — the same idea for choice-button text specifically: capitalizes the first letter, fixes trailing/doubled punctuation, applies special-case full-phrase overrides (e.g. `go ahead` → `Start the game.`), `carpark` → `car park`, then calls `smartenHtml()`.
- `smartenText()` / `smartenHtml()` — converts straight quotes and apostrophes to correct curly typography. This is not a simple 1:1 substitution: a straight-quoted phrase becomes curly **double** quotes (not single), `'80s`-style leading quotes before a two-digit number are special-cased, and contractions vs. quotation-marking apostrophes are told apart by surrounding context via several order-dependent regex passes.
- `wrapEnglishSpeechAsides()` / `wrapChineseSpeechAsides()` (with `isEnglishSpeechAside`, `isRomanceSpeechAside`, `isChineseSpeechAside`) — wraps recognised manner-note asides in parentheses. Documented in full further down under "User preferences and style principles."

**Do not "fix" the raw source to pre-bake what these functions already produce.** This was discussed and explicitly rejected: the functions run on effectively every line of narrative and every choice button, across 5 languages — thousands of call sites. Hand-converting all of them correctly (getting the curly-quote/phrase-vs-contraction distinction right every single time, replicating six chained order-dependent regex rules by hand) is far higher-risk than it looks, and deleting the functions afterward would remove a permanent guarantee and replace it with a one-time snapshot: every future edit would then need a human to remember to manually apply correct typography, capitalization, and punctuation, with nothing catching a slip. The route-verification system (`write_verified_guides.js` etc.) also matches against *rendered* text, not raw source, so a bulk migration risks silently breaking recorded routes in ways that don't surface as a clean failure.

**When judging whether text "looks right," check it in a real render** (browser preview, or a Node harness like the one `verify_routes.js` uses) — not by reading the raw string in the source file. A straight apostrophe or an uncapitalized choice string in the source is expected and correct; it is not something to patch.

## Current final language set

There are five language folders:

- `outputs/en`
- `outputs/cn`
- `outputs/tw`
- `outputs/es`
- `outputs/fr`

The languages are:

- `en`: English
- `cn`: Simplified Chinese
- `tw`: Traditional Chinese using Taiwan-flavoured wording
- `es`: Spanish
- `fr`: French

The bilingual editions are:

- `outputs/cn/dianedate_cn_bilingual.html`
- `outputs/tw/dianedate_tw_bilingual.html`
- `outputs/es/dianedate_es_bilingual.html`
- `outputs/fr/dianedate_fr_bilingual.html`

Each bilingual edition switches between that language and English. The English-only edition does not need a bilingual counterpart.

## Output structure

Each language folder has this shape:

```
outputs/{language}/
  dianedate_{language}.html
  dianedate_{language}_bilingual.html   # not present for English
  edition_notes_{language}.txt
  endings/
    dianeguide_{language}.txt
    transcripts/
      …ending transcript files
  hidden_scenes/
    hidden_scenes_guide_{language}.txt
    scene_transcripts/
      …hidden scene transcript files
```


There should be no `code_fragments` output folder. Earlier in the project one code-only Church Lych Gate fragment existed, but it was later verified as playable and promoted to an official hidden scene.

## Current route inventory

There are currently:

- 10 verified ending transcripts per language.
- 21 verified hidden scene transcripts per language.

These counts should remain true unless the user explicitly asks to add or remove routes.

## Verified endings

The ending transcript files are currently:

- `01_third_prize`
- `02_fourth_prize`
- `03_first_prize`
- `04_fifth_prize`
- `05_second_prize`
- `06_lounge_story_consolation`
- `07a_consolation_tuesday_pavilion`
- `07b_consolation_thursday_subway`
- `08_chloe_consolation`
- `09_amanda_consolation`


The endings guide is not arranged as a pure story timeline. It is arranged for player clarity:

1. Formal Prize endings.
2. Lounge Story consolation.
3. Two general consolation variants.
4. Chloe and Amanda special consolation endings.
5. Common failure endings.

The `07a` and `07b` naming is intentional. They are sibling consolation routes, not a normal eighth and ninth prize ladder.

## Verified hidden scenes

The current hidden scene order is:

- `01_theatre_flashback`
- `02_portaloo_ladies_first`
- `03_portaloo_too_embarrassed`
- `04_thursday_bridge_diane_molly`
- `05_molly_bruno_towpath`
- `06_diane_slips_away_while_watching_molly`
- `07_riverside_bushes_diane`
- `08_riverside_towpath_landing`
- `09_riverside_bushes_together`
- `10_public_toilet_spyhole`
- `11_public_toilet_spyhole_stockings`
- `12_closed_toilet_building_lookout`
- `13_closed_toilet_building_together`
- `14_closed_toilet_building_bad_choice`
- `15_riverside_gents_urinal`
- `16_brunette_behind_camper`
- `17_diane_brunette_camper_round`
- `18_diane_brunette_camper_under`
- `19_camper_gentleman_choice`
- `20_church_lych_gate_glimpse`
- `21_hidden_camera`


This is the intended final order. It is not a mechanical discovery order. It is a player-facing order based on story progression and scene clusters:

1. Theatre and early flashback.
2. Riverside and portaloo material.
3. Molly and Bruno towpath material.
4. Public toilet spyhole variants.
5. Closed toilet building variants.
6. Gents urinal special branch.
7. Bus stop and camper van scenes.
8. Church lych gate on the bus-home route.
9. Hidden bathroom camera after arriving home.

Do not move `20_church_lych_gate_glimpse` back after `21_hidden_camera`. It was initially added last because it was discovered last, but the current order is more coherent.

## Redundancy judgement for hidden scenes

The hidden scenes are intentionally separate. Do not merge them casually.

Important distinctions:

- `02_portaloo_ladies_first` and `03_portaloo_too_embarrassed` are not duplicates. One is the successful hidden portaloo route, and the other is the bad variant where the player offers it too directly.
- `05_molly_bruno_towpath` and `06_diane_slips_away_while_watching_molly` are not duplicates. The second is a higher-urgency variant where Diane slips away while the player is distracted by Molly.
- `10_public_toilet_spyhole` and `11_public_toilet_spyhole_stockings` are not duplicates. The first is the Bruno catch and discarded panties failure route. The second is the stockings variant where the route rejoins the walk.
- `12_closed_toilet_building_lookout`, `13_closed_toilet_building_together`, and `14_closed_toilet_building_bad_choice` are separate choices around the closed toilet building.
- `16`, `17`, `18`, and `19` are separate camper van outcomes.
- `20_church_lych_gate_glimpse` is a narrow Thursday route during the trip home.
- `21_hidden_camera` is a short-route house scene with the brother's hidden camera.

## Important restored or connected branches

Several branches that were unused, redundant, or awkward in the original were either repaired or removed during restoration.

Important repaired/connected areas included:

- `loungedesp`: kept and connected because it fit the story context.
- `luckytrip`: repaired where needed for route logic.
- `nicelydesp`: repaired and integrated.
- Church Lych Gate Glimpse: confirmed reachable without threshold changes and added as hidden scene 20.
- Closed toilet building variants: verified and added to Hidden Scenes.
- Gents urinal branch: verified and added to Hidden Scenes.
- Molly and Bruno towpath variants: verified and added to Hidden Scenes.

Earlier obsolete image helper logic and visible image placeholders were removed because this edition is text-only.

## User preferences and style principles

The user wants this edition to preserve the original charm. Do not rewrite the game in a polished literary style.

The ideal style is:

- grammatically clean
- readable
- direct
- playful
- slightly old-fashioned
- still recognisably the original game
- not over-literary
- not over-sanitised
- not machine-translated

For Chinese, the user strongly prefers natural native phrasing over literal translation. Avoid translationese.

For fetish-related wording, be accurate and natural, but do not add new events or intensify beyond the original.

For Chinese pee/desperation language, context matters. Possible vocabulary includes:

- `憋尿`
- `尿急`
- `憋得难受`
- `憋得快不行`
- `憋不住`
- `撒尿`
- `尿尿`
- `上厕所`
- `去厕所`
- `方便`
- `解决`

Do not use one term everywhere. Choose based on whether Diane is speaking politely, the narrator is describing an event, or the line is more explicit.

Some settled Chinese decisions:

- `Little Girls Room` was localised as `让我去嘘嘘嘛，求你了！` in the relevant line. Do not change it just because another reviewer dislikes it.
- `Brunette` is `褐发女生` in Simplified Chinese and `褐髮女生` in Traditional Chinese.
- The UI stat formerly translated around tummy/liquid is `待转化水分` in Simplified Chinese and `待轉化水分` in Traditional Chinese.
- `Shyness` is `害羞值`.
- `Intimacy` is `亲密度` or `親密度`.

## Chinese spacing rule

For Simplified and Traditional Chinese text files and HTML text, do not insert Western-style spaces around English words, numbers, or acronyms just because they touch Chinese characters.

Examples of the desired style:

- `我已满18岁。`
- `3英镑`
- `10个结局`
- `HTML文件`

This is intentional. Other languages keep normal word spacing.

## Punctuation and quotation rules

The final HTML and transcript files use different conventions on purpose.

HTML:

- Normal spoken dialogue is usually represented as `DIANE:` or `YOU:`.
- Embedded non-script dialogue (narrated speech) uses language-appropriate quotation marks in source/render, not italics. Source EN typically uses straight single quotes inside `s("...")` (for example `s("... 'Oh no!' ...")`; smarten → curly “…”); CN uses “…”; ES/FR use «…».
- Ordinary narration and independent action lines are plain (roman), not italic — e.g. wine top-ups, kisses, giggles-as-action on their own line. Italics are reserved for: (1) manner notes attached to speech; (2) urgency/status cues (colored meter `<SPAN>` blocks wrapped in `<EM>`, plus the observational status line `She is standing with one leg half crossed over the other.`); (3) titles / word emphasis (`Outside Edge`, `really <EM>has</EM>`).
- Stage directions or manner notes in dialogue are shown with italic parentheses in HTML, such as `DIANE: <em>(Whispers in your ear)</em> I'm dying...`. The parentheses are not typed into the raw source text. Raw `SPEAKER: <EM>manner note</EM> dialogue` calls stay plain, and a render-time wrapper (`wrapEnglishSpeechAsides` / `wrapChineseSpeechAsides`, with per-language detection helpers such as `isEnglishSpeechAside`, `isRomanceSpeechAside`, `isChineseSpeechAside`) adds the parentheses when it recognises the italic text as a manner note. Recognition works from a whitelist of leading words (verbs/gerunds like `thinks`, `pauses`, `whispers`, `interrupting`, `joking`, `laughing`, `blushing`; adverbs like `softly`, `quietly`), not from the raw text itself. If a legitimate manner note is not rendering with parentheses, the fix is to extend that whitelist, not to hand-edit the raw string. Do not put ordinary action/narration sentences in `<EM>` just to get brackets in transcripts — keep them plain. As of this handoff, English, Chinese, Spanish, and French whitelists have all been audited and expanded to cover the categories used in each language's own text (laughing/giggling, blushing, joking, interrupting, whispering, softly/quietly, and the language-specific fixed phrases already in place). If a future edit adds new narrative content, a newly-introduced manner-note phrasing can still fall outside the whitelist and will need the same treatment: verify with a real render (not just a source-text read), and extend the whitelist rather than hand-editing parentheses into the raw string.
- Location headings and their short explanatory sublines are not wrapped in transcript-style brackets.
- Choice buttons are punctuated when they read like sentences.
- Price/menu labels are usually not punctuated.
- Dates are now punctuated as choices.

TXT transcripts:

- Button choices are shown in round parentheses.
- Hidden dialogue is converted to language-appropriate quotation marks.
- Manner notes and observational urgency/status italics become square brackets (e.g. `[Whispers to you]`, `[She is standing with one leg half crossed over the other.]`). Colored meter status lines stay plain text (no brackets). Ordinary plain narration/actions stay plain (no brackets).
- H2 location headings are shown in corner brackets.
- Transcript files omit the age gate and opening rules page.
- Hidden-scene transcripts omit Entry/Exit labels because those belong in the guide, not the transcript.

English typography:

- Curly apostrophes and curly double quotation marks are used in HTML.
- In text files, curly marks are acceptable and currently used.
- "’50s" must use a right curly apostrophe, not a left quote.
- "Information board" was corrected to "information board" because it is a common noun, not a proper sign name.

Chinese typography:

- Chinese quotation marks are used in TXT where appropriate.
- There should be no extra space between a closing Chinese quote and following narration, such as `“真是个好主意。”她说。`
- Chinese stage directions in TXT use square brackets, followed by a space before the spoken text when they appear inline after a speaker label.

Spanish and French:

- Spanish uses normal Spanish punctuation and can use `« »` where that is more natural.
- Spanish em dash spacing follows Spanish norms around parenthetical or interruptive usage.
- French uses French punctuation where appropriate, including French spacing before certain marks (including narrow no-break spaces before `?` `!` `:` `;` where already used).
- Prefer spoken, characterful localization over stiff calques. Bathroom register should follow context (polite / desperate / blunt joke), same principle as Chinese — do not flatten everything to one euphemism.
- **On with the story!** — English keeps the meta wording. All other languages use start-the-date immersion: CN `开始约会！` / TW `開始約會！` / ES `¡Empezar la cita!` / FR `C'est parti pour le rendez-vous !`. Shop **Buy something** stays literal everywhere (`买点东西` / `買點東西` / `Comprar algo` / `Acheter quelque chose`).
- After any bulk ES/FR polish, run a **cross-id swap QA**: confirm each changed string still matches its English meaning, and that short choice labels were not overwritten by neighbouring narration/dialogue. See "2026-08-07 localization finalize" below.

## UI and layout principles

The current HTML UI is considered final unless the user asks for a specific change.

Important choices:

- The large redundant game header was removed.
- The main game card is the primary screen.
- Image placeholders were removed.
- The game is text-based.
- The back button restores the previous step and previous state.
- The age rejection screen should not show stats.
- The stats are arranged as two rows of three:
  - Resources/body state first, then social/hidden-state values as already implemented.
- European-language UI uses a serif body and a distinct UI treatment as currently implemented.
- Chinese UI uses Chinese font stacks to avoid awkward punctuation rendering.
- Location heading separators were simplified. Do not reintroduce unnecessary horizontal rules.
- The small subline under a location title is explanatory text and should not be wrapped in `【】` in transcripts.

### The `.choices` wrapper div never actually wraps anything — do not "fix" this in JS

`c(tag, desc)` opens a choices group with `document.getElementById('box').innerHTML += "<div class='choices'>"` — an unclosed tag — then appends each `<button class='choice'>...</button>` with further `innerHTML +=` calls, and `go()` later appends a closing `</div>` once the group ends (tracked via `ulopen`).

This looks like it nests the buttons inside `.choices`, but it does not. `innerHTML +=` is a read-serialize-then-parse cycle on every call: the moment the unclosed `<div class='choices'>` string is assigned, the HTML parser hits end-of-string and auto-closes it immediately, producing `<div class="choices"></div>` (empty, already closed) in the live DOM. Every subsequent `innerHTML +=` for a button re-reads that already-closed div and appends the new button as a **sibling after it**, not a child inside it. The trailing `</div>` that `go()` appends later is an orphan closing tag with no matching open element, which the parser silently drops. Verified live: `document.getElementById('box').innerHTML` after a multi-choice screen renders literally shows `<div class="choices"></div><button class="choice">...</button><button class="choice">...</button>...` — buttons as siblings, div empty.

Practical effect: `#box .choices { display: grid; gap: 10px; }` was dead CSS — it styled an always-empty div, contributing nothing to real button spacing. The actual fix (already applied, in every language) does **not** touch this JS at all — restructuring `c()`/`go()` to properly nest buttons would mean rewriting the buffer-append pattern used by literally every route function in every language, for a purely cosmetic payoff, with real risk of breaking route rendering across the entire game. Instead, `#box .choices`/`#box ul` lost their `display`/`gap`, and a `.choice + .choice { margin-top: 10px; }` sibling-selector rule was added, which produces the identical 10px gap whether or not a given button happens to be sitting inside a (real or already-closed-and-empty) `.choices` wrapper. If a future change reintroduces `gap` on `.choices` while this sibling rule still exists, check the one screen that genuinely has properly-nested choices (the static age-gate markup, hand-written directly in the HTML, never touched by `c()`) — it would double up.

### Choice-press visual feedback and the `gameHistory` snapshot leak it caused

Pressing a number key (1–9) to select a choice calls `pressChoiceByNumber(n)`, which adds a `.key-pressed` class (same visual as `:hover`) to the target button, waits ~120ms so the "press" is visible, then calls `.click()`. That class addition happens on the *live* button, which is still sitting in `#box` when `go()` runs moments later. `go()`'s very first line used to be `gameHistory.push(snapshotGame())` — and `snapshotGame()` just reads `box.innerHTML` as-is, so the snapshot captured the outgoing screen **with the `key-pressed` class still baked into that button's HTML**. Backing up to that screen later (`goback()` → `restoreGame()`, a raw `innerHTML` assignment) would reinstate that stale highlight — a real, reproducible visual bug — and worse, `pressChoiceByNumber`'s own re-entrancy guard (`if (btn.classList.contains("key-pressed")) return;`) would then treat that leftover class as "a press is already in flight" and silently swallow every future number-key press aimed at that same button index, which is what made the game look "stuck."

Fixed at the source: `go(tag)` now strips any `#box button.choice.key-pressed` before it does anything else, every time, so no snapshot can ever be pushed with that transient class present. This is a prerequisite for `pressChoiceByNumber`'s existence — don't add other transient/animation classes to live game buttons without the same discipline (either strip them at the top of `go()`, or don't let them persist across a `go()` call at all).

## Maintenance scripts

Use Node.js to run the scripts.

The maintenance folder intentionally contains only the ongoing toolkit. One-time port/fix installers (Gallery, guide toggle, keyboard shortcuts, pregame stats freeze, choice-spacing/`key-pressed` snapshot fix, and similar) were already applied to every HTML edition and then removed from this folder. Do not look for them. Behaviour is documented below and lives in the HTML files themselves. To add a new language later, copy structural/engine pieces from an existing finished edition rather than reintroducing deleted installers.

Kept files:

- `maintenance/README.txt`
- `maintenance/AI_HANDOFF.md`
- `maintenance/aligned_text.json`
- `maintenance/gallery_data.json`
- `maintenance/check_endings.js`
- `maintenance/verify_routes.js`
- `maintenance/write_verified_guides.js`
- `maintenance/write_ending_transcripts.js`
- `maintenance/write_hidden_scenes.js`
- `maintenance/write_zh_tw.js`
- `maintenance/build_gallery_data.js`


## Gallery and guided walkthrough feature

Every HTML edition (all 5 languages, single and bilingual) has an in-game Gallery. A small "Gallery" button sits in a toolbar at the top of the page (top left for single-language editions, top left next to the language toggle for bilingual editions). It is hidden on the age-check screen and only appears once real gameplay starts, and it correctly re-hides if the player backs all the way out to the age-check screen again.

That re-hiding depends on a `currentTag` global (registered in `gameStateVars`, so it round-trips through `snapshotGame()`/`restoreGame()` like any other state variable) set at the top of `go(tag)`. `goback()` reads the just-restored `currentTag` to decide the toolbar's `display` after popping history, rather than assuming "forward" logic (`tag !== "under18"`) still applies — the toolbar element lives outside `#box`, so it is never touched by `restoreGame()`'s `box.innerHTML` swap and needs this explicit step. The condition is `currentTag && currentTag !== "under18"`: the `&&` guards the true initial state, where `currentTag` is still `null` because no `go()` call has happened yet.

Opening the Gallery shows two lists: the 10 endings and the 21 hidden scenes, in the same player-facing order as the guides. Picking one reloads the page and replays the route silently up to a fixed point (the true story start for endings, skipping the age gate and rules screens; the scene's own setup steps for hidden scenes), then highlights the correct button at every step from there on so the player can click through it themselves. Endings are highlighted all the way to the end. Hidden scenes are highlighted through the whole scene to its documented Exit point, then hand back to normal free play.

The existing Back button works through the whole real path, including the silently replayed portion, exactly as if the player had clicked every step themselves. Going off the highlighted path at any point cancels guidance for that playthrough without otherwise disrupting normal play. Picking a different Gallery entry, or reloading the page, always starts completely fresh.

In bilingual editions, Gallery reloads still preserve the player's current language. `startGuidedRoute()` stores `lang: currentLanguage` in the `dianeGuide` session payload, and `initGuideFromStorage()` calls `setLanguage(data.lang)` before the silent replay. Without that, every Gallery pick reset the UI to the default local language (`alt`). Do not drop this when editing Gallery bootstrap code.

There is no bladder color-coding or similar stat highlighting. That was tried and deliberately removed. Keep the status bar plain unless the user asks for a stat-visualization feature again specifically.

### Keyboard shortcuts and guide on/off toggle

All shortcuts live in one top-level `keydown` listener registered once per file. It bails out early on any modifier key (`ctrlKey`/`metaKey`/`altKey`) or `e.repeat` (auto-repeat from a held key), so a held key never fires the same action twice. Current bindings:

- "b" — Back, if `.back-button` is present.
- "h" — toggles guide highlighting, if `.guide-toggle-button` is present.
- "g" — toggles the Gallery: closes it if it's open; otherwise opens it, if the `#galleryToggle` button exists and is currently visible (`offsetParent !== null` — this check works for both single-language editions, where the whole `#gameToolbar` wrapper gets hidden, and bilingual editions, where `#galleryToggle` itself gets hidden, without needing edition-specific logic).
- Escape — also closes the Gallery, only if it is currently open. Kept alongside "g" rather than replaced by it, since Escape-closes-modal is a near-universal convention independent of any app-specific hotkey.
- "l" — bilingual editions only: toggles the language, if `#languageToggle` is visible.
- "1"–"9" — presses the matching choice button on screen (`#box button.choice`, 1-indexed). Only **visible** choice buttons count (`offsetParent !== null`), so bilingual editions do not double-count the hidden language layer. Adds a `.key-pressed` class (same visual as `:hover`) for ~120ms before calling `.click()`, so the keypress reads as a real press rather than an instant jump; the delayed click checks `document.body.contains(btn)` first in case the DOM already moved on.

Every handler except "g" and Escape checks `galleryOpen` (whether `#galleryOverlay` has the `open` class) first and bails if the Gallery is open, so shortcuts never silently act on the game behind an open Gallery modal.

Whenever a guided walkthrough is active (`guideActive`), a second button sits next to Back: a toggle, not a one-way "stop" button. It reads "Guide: On"/"Guide: Off" (localized per language; bilingual editions show the correct label in both language layers via a `data-lang` attribute on each toggle instance). It starts on automatically the moment a Gallery entry is picked. Clicking it flips a `guideOn` flag and calls `syncGuideDisplay()`, which clears/reapplies the highlight and resyncs every toggle button's text and class. It does not touch `guideActive` or `guideIndex` — turning it off just stops the highlight from being drawn while `go()` keeps silently tracking progress through the route underneath. That means the player can toggle off, keep playing, toggle back on, and the highlight picks up exactly where it should, for as long as `guideActive` stays true (i.e. until the route is exhausted or the player deviates off-script). The Back button (and the "b" shortcut) goes through `goback()`, which restores `guideIndex`/`guideActive` from `guideHistory` as before and then calls `syncGuideDisplay()` — `guideOn` itself is never snapshotted or restored, since it is a display preference for the current playthrough, not part of route progress. Picking a new Gallery entry always resets `guideOn` to true again.

The toggle only ever appears during a guided walkthrough; normal free play has no Back-row toggle button, since `navRow()`/`backbutton()` only emit it when `guideActive` is true.

`.guide-toggle-off`'s border is `var(--line)` (the same subtle tan used for ordinary choice-button borders), not `transparent` and not dashed — a fully transparent border looked like a rendering bug, and a dashed one read as visually noisy against the rest of the flat-button UI. `.nav-row`'s `margin-top` is `24px` (up from `12px`), matching the gap the status bar already uses above it (`.status-bar { margin-top: 24px; }`), so the Back/Guide row doesn't look cramped against the choices above it on pregame screens where the status bar is hidden and the row sits directly under the choices.

`.choice.guide-highlight`'s background is a hardcoded `#f7e2e5` (a pale rose pulled from `--accent`), not `var(--choice-hover)`. It used to share the exact hover background, so a highlighted button and a merely-hovered button looked identical at a glance — only the border (plain `#c59c73` for hover vs. `var(--accent)` + an inset ring for highlight) told them apart, which is easy to miss when scanning quickly. The rose tint is now unmistakable even without checking the border, and stays in the same warm colour family as the rest of the UI.

`.game-toolbar`'s (Gallery button, and language toggle in bilingual editions) `margin-bottom` is `16px` (up from `8px`) — the gap between the toolbar and the top edge of the `#box` card felt cramped at 8px given how much padding `#box` itself has. The `@media (max-width: 640px)` override (`margin-bottom: 10px`, paired with tighter toolbar padding) was deliberately left alone — that's an intentional compact-mobile value, not a leftover of the old 8px baseline.

### `gallery_data.json`

Generated data file (also embedded as `GALLERY_DATA` inside each HTML file) listing, per language, the 10 endings and 21 hidden scenes with their id, order, title (and `titleAlt` for bilingual editions), the exact tag sequence needed to replay the route, and `baseLength` (how many of those tags are replayed silently before highlighting begins). Do not hand-edit; regenerate with `build_gallery_data.js`.

### `build_gallery_data.js`

Rebuilds `gallery_data.json` and re-injects fresh `GALLERY_DATA` into every HTML file that already has the feature (en, cn, cn_bilingual, es, es_bilingual, fr, fr_bilingual). Run this whenever a route changes, an ending/hidden-scene title changes, or after any edit that could shift button text along a route (since tags are resolved by replaying routes against the real HTML). Traditional Chinese is not touched directly; run `write_zh_tw.js` afterward to pick up the change from Simplified Chinese.

### `aligned_text.json`

This is the compact aligned text index rebuilt from the final single-language HTML files.

It contains:

- 5,013 aligned text entries.
- 3,882 story strings.
- 1,131 choice strings.
- English, Simplified Chinese, Spanish, French, and Traditional Chinese text in matching positions.
- Destination tags for choices.

If text is changed in one language, update aligned text when appropriate. This file is important for future cross-language consistency checks.

### `write_verified_guides.js`

Replays the verified ending routes and regenerates:

outputs/{en,cn,es,fr}/endings/dianeguide_{language}.txt


The Traditional Chinese guide is generated later by `write_zh_tw.js`.

### `write_ending_transcripts.js`

Replays ending routes and regenerates:

outputs/{en,cn,es,fr}/endings/transcripts/


The Traditional Chinese ending transcripts are generated later by `write_zh_tw.js`.

### `write_hidden_scenes.js`

Replays hidden scene routes and regenerates:

- outputs/{en,cn,es,fr}/hidden_scenes/hidden_scenes_guide_{language}.txt
- outputs/{en,cn,es,fr}/hidden_scenes/scene_transcripts/


The Traditional Chinese hidden scene guide and transcripts are generated later by `write_zh_tw.js`.

This script also removes legacy hidden-scene output folders from older layouts.

### `write_zh_tw.js`

Builds Traditional Chinese outputs from the final Simplified Chinese outputs.

It uses macOS Swift/ICU conversion plus Taiwan-specific replacement rules (`taiwan_voice_fixes.json` + rules inside the script).

**Important:** `taiwan_voice_overrides.json` is applied when updating `aligned_text.json`'s `tw` field. It is **not** applied when rewriting `outputs/tw/*.html` / transcripts — those files are always regenerated from CN. So:

- Prefer changing **CN** (then re-run this script) when CN and TW should stay parallel.
- If a TW-only override must stay, also keep the playable TW HTML in sync by hand after the script, or the next run will overwrite it with the CN-derived conversion.
- Do not assume editing override alone updates what players see.

### `check_endings.js`

Shared route arrays and helper exports used by the ending guide and transcript scripts.

### `verify_routes.js`

Small command-line helper for replaying a route against an HTML file. It defaults to:

outputs/en/dianedate_en.html


## Recommended regeneration order

After edits that affect visible game text, route text, guides, or transcripts, use this order:

    node maintenance/write_verified_guides.js
    node maintenance/write_ending_transcripts.js
    node maintenance/write_hidden_scenes.js
    node maintenance/write_zh_tw.js

If Gallery routes or titles changed (or button text along a recorded route shifted), also run:

    node maintenance/build_gallery_data.js
    node maintenance/write_zh_tw.js

If only hidden scenes changed, you may run:

    node maintenance/write_hidden_scenes.js
    node maintenance/write_zh_tw.js

If only endings changed, run:

    node maintenance/write_verified_guides.js
    node maintenance/write_ending_transcripts.js
    node maintenance/write_zh_tw.js

## Verification commands

After substantial edits, check route document counts:

    node - <<'NODE'
    const fs=require('fs'), path=require('path');
    for(const lang of ['en','cn','tw','es','fr']){
      const eDir=path.join('outputs',lang,'endings','transcripts');
      const hDir=path.join('outputs',lang,'hidden_scenes','scene_transcripts');
      const e=fs.readdirSync(eDir).filter(f=>f.endsWith('_'+lang+'.txt')).length;
      const h=fs.readdirSync(hDir).filter(f=>f.endsWith('_'+lang+'.txt')).length;
      const eg=fs.existsSync(path.join('outputs',lang,'endings','dianeguide_'+lang+'.txt'));
      const hg=fs.existsSync(path.join('outputs',lang,'hidden_scenes','hidden_scenes_guide_'+lang+'.txt'));
      console.log(lang+': endings='+e+', hidden='+h+', endingGuide='+eg+', hiddenGuide='+hg);
    }
    NODE

Expected final output:

    en: endings=10, hidden=21, endingGuide=true, hiddenGuide=true
    cn: endings=10, hidden=21, endingGuide=true, hiddenGuide=true
    tw: endings=10, hidden=21, endingGuide=true, hiddenGuide=true
    es: endings=10, hidden=21, endingGuide=true, hiddenGuide=true
    fr: endings=10, hidden=21, endingGuide=true, hiddenGuide=true


Check HTML JavaScript parseability:

    node - <<'NODE'
    const fs=require('fs'), vm=require('vm');
    for(const file of [
      'outputs/en/dianedate_en.html',
      'outputs/cn/dianedate_cn.html',
      'outputs/cn/dianedate_cn_bilingual.html',
      'outputs/tw/dianedate_tw.html',
      'outputs/tw/dianedate_tw_bilingual.html',
      'outputs/es/dianedate_es.html',
      'outputs/es/dianedate_es_bilingual.html',
      'outputs/fr/dianedate_fr.html',
      'outputs/fr/dianedate_fr_bilingual.html'
    ]){
      const html=fs.readFileSync(file,'utf8');
      const script=html.match(/<script>([\s\S]*?)<\/script>/i)?.[1];
      const box={innerHTML:''};
      const context={console,document:{getElementById(){return box;}}};
      context.window=context;
      vm.createContext(context);
      try{vm.runInContext(script,context,{filename:file}); console.log('OK',file);}
      catch(e){console.log('FAIL',file,e.message);}
    }
    NODE

Expected result: all nine HTML files print `OK`.

Useful text searches:

    rg -n "Information board|Code-Only|code_fragments|races overtime" outputs maintenance

Expected result: no output except the intentional legacy-cleanup paths in `maintenance/write_hidden_scenes.js` if searching for `code_fragments`.

## Known intentional cleanup paths

`maintenance/write_hidden_scenes.js` still contains `code_fragments` paths in `LEGACY_HIDDEN_OUTPUTS`.

This is intentional. Those paths are only there so the script can delete old generated folders if they ever exist. They are not current output folders.

## Important wording decisions already settled

Do not reopen these unless the user specifically asks:

- "Church Lych Gate Glimpse" is verified and official hidden scene 20.
- "Your Brother's Hidden Bathroom Camera" is hidden scene 21.
- "information board" is lowercase in English.
- "Chloe wears a short tartan skirt and black tights." is the settled English line.
- "Diane wears a black and white patterned dress ... She has a lacy white bra, white panties, no slip and bare legs." is the cleaned English grammar for that clothing note.
- "Diane chooses the Tortelloni (£9)." style does not need `at`.
- "Don't let it go to your head." means "do not get too pleased with yourself", not "do not let the wine make you drunk".
- "Shame on you" is the natural English form, not "Shame upon you".
- In game stat notices, English uses past tense such as "You gained 2 intimacy points." and "You lost 7 intimacy points."
- English uses `points`, not `pts`, in transcript files.
- "A Date with Diane" is title case, not all caps.
- Formal prize ending lines have consistent exclamation marks.
- Story-start immersion UI: CN `开始约会！` / TW via CN pipeline / ES `¡Empezar la cita!` / FR `C'est parti pour le rendez-vous !` (EN keeps meta `On with the story!`).
- "Buy something" stays shop-literal in all languages (CN `买点东西` / TW `買點東西` / ES `Comprar algo` / FR `Acheter quelque chose`) — not a "continue the story" immersion rewrite.
- CN is source of truth for TW; TW uses Taiwan lexicon + `「」` quotes via `write_zh_tw.js`.
- English `caretaker` / `council caretaker` → CN/TW **管理员** / **管理員** (first mention of the council role may stay **市政管理员** / **市政管理員**). Do **not** use 看守员、看门人、环卫工人、保洁工人、保洁阿姨.
- English `bouncer` → CN/TW **保安** (Pavilion door). Occasional English `doorman` in that beat may be **门卫** / **門衛**; do not confuse with the toilet caretaker.
- Highest bladder-status lines for Diane/Molly: `…站不住，两脚不停地来回挪动。` / `…站不住，兩腳不停地來回挪動。` (not 换脚 / 跺脚).
- **Money / menu prices:** whole pounds have no decimals (`£1`, `£15`, `3英镑`). Pence use two places (`£1.50`, `1.50英镑` / `1.50英鎊`). French uses a decimal comma before the symbol (`1,50 £`). Do not write `£1.00` / `1.5英镑`.
- **Gents-urinal straddle (`x01569b`):** EN keeps a comma before the secondary posture aside (`straddle the urinal, with her back to you`) and no em dash. CN/TW put that aside after an em dash and prefer **更省事** over "faster", and **横跨** / **橫跨** (standing astride) over **跨坐**. ES uses `ponerse a horcajadas…, de espaldas a ti`; FR `enjamber l'urinoir, dos à vous`.
- **Pee-start beat (`x01570`):** EN *Almost immediately she is peeing.* → CN `她几乎立刻就尿了。` / TW `她幾乎立刻就尿了。` (keep **几乎/幾乎**; no **开始/開始**).
- **Play still on (`x00027`):** CN/TW use the parallel wording with **停演** (`…一直想在停演前去看一次，再拖就赶不上了` / TW equivalent). Do not use **下演**.

## Known original logic clarification

The game has several moments where Diane knows or suspects some things but not everything.

For example, Diane knows the player also missed a bus and may know he went somewhere around the car park. That does not mean she knows he watched her pee. Do not "fix" this as a contradiction unless reviewing a specific line with context.

## Pregame stats freeze and the digestion-tick compensation

`go(tag)` used to run the "digestion tick" (drains `proc` by 10, adds a similar amount to `blad`) on every single navigation, including the meta screens before the date narrative begins (age gate, title, notes, further information, day choice). That meant `blad` was already visibly climbing before the player had even started the story, and the total amount drained from `proc` there meant less digestion pool was left to matter later. This was a real, user-reported bug, not intended design.

The fix has two parts, both required, both present in every edition:

1. **`PREGAME_TAGS`** — an array of the meta-screen tags (`under18`, `start`, `start1`, `info`, `start1a`, `start1b`, `tuesdaydate`, `thursdaydate`, `saturdaydate`). `go()` computes `showStats = PREGAME_TAGS.indexOf(tag) === -1` and skips the digestion tick, hides the whole status bar (not just the number), while still running `eval(tag + "()")` and still showing the Back button and Gallery toolbar as before. `blad`/`proc` sit untouched at their initial values the whole time the player is on those screens.
2. **`pregameCatchupTick()` and the one-time catch-up burst** — the first time `showStats` becomes true (structurally always the `start2` tag, "On with the story!"), `go()` fires `pregameCatchupTick()` four times before the normal `digestionTick()` for that call. This reproduces, in one silent step, the exact same cumulative `blad`/`proc` outcome the old always-ticking code would have reached by that point, given the canonical minimum pregame path (`start` → `start1a` → `start1b` → day-choice, skipping the optional notes/further-info detour, which is also how every recorded guide/ending route is built). `pregameCatchupTick()` deliberately always takes the "no day chosen yet" branch of the tick formula (it never checks `tuesday`/`thursday`), because historically the day flag is not set until *after* the day-choice screen's own tick has already fired — the catch-up runs later than that, after the flag is already set, so it must not read it. `digestionTick()` (used for the catch-up's final, non-batched tick and every normal turn afterward) is unchanged and does read the day flag normally.

`pregameCaughtUp` (a one-shot boolean, starts `false`) gates the catch-up so it only fires once, and is registered in `gameStateVars` so Back navigation correctly un-fires it if the player backs out past `start2`.

**Do not remove the catch-up burst** even though it looks redundant with the freeze. Without it, `blad` ends up lower than before from `start2` onward, which flips several stat-threshold branches later in the game (confirmed: the Pavilion scene's `blad >825/>700/>500` branches, which changed 6 of the 10 documented endings' recorded click sequences when tested without compensation). With the catch-up in place, every existing ending and hidden-scene route verifies unchanged — this was confirmed by running the full `write_verified_guides.js` / `write_hidden_scenes.js` suite both before and after, and the guide/transcript output files are byte-identical to before this fix.

If a future change touches `go()`, `digestionTick()`, `pregameCatchupTick()`, or `PREGAME_TAGS`, re-run `write_verified_guides.js` and `write_hidden_scenes.js` afterward and confirm zero throws — that is the concrete evidence the compensation math is still exactly right, not just "probably fine."

## Translation quality rules

When editing translations:

1. Translate from English source, not from another translation, unless working specifically on Traditional Chinese from Simplified Chinese.
2. Preserve route structure and button destination tags.
3. Do not add new plot events.
4. Do not make the writing overly literary.
5. Keep sexual and fetish language natural for the target language.
6. Check every changed line against surrounding context.
7. If a reviewer gives suggestions, accept only the ones that are genuinely better. Several external suggestions during this project were intentionally rejected.

## Traditional Chinese workflow

Traditional Chinese is not separately hand-translated from English. CN is the source of truth for TW.

The intended workflow is:

1. Final Simplified Chinese is updated in `outputs/cn` and `aligned_text.json`.
2. `write_zh_tw.js` converts playable TW files from CN using Swift/ICU + global Taiwan fixes.
3. The same script refreshes `aligned.tw`, preferring `taiwan_voice_overrides.json` when an id has an override (see script section above — overrides do **not** rewrite HTML).
4. TW dialogue quotation uses `「」`. Do not reintroduce CN-style `“”` into TW outputs.

Hand-edits under `outputs/tw` are wiped on the next `write_zh_tw.js` run unless CN (and any needed override) already encode the same wording.

## QA tooling (do not ignore)

- `maintenance/qa_protect.json` — settled best-final substrings (mostly CN/TW wording the user locked). Do not casually reopen.
- `maintenance/qa_regression_gate.py` — quick CN/TW regression gate. Run after Chinese/TW edits: `python3 maintenance/qa_regression_gate.py`.
- `maintenance/fix_logs/` — optional local archive only; **ship text is always `outputs/` + current `aligned_text.json`**. Do not re-apply old log JSON as if it were current.

`aligned_text.json` currently has **5013** unique entries (story + choice). Keep HTML and aligned in sync when you change wording.

## File editing cautions

- Do not edit old source files in Downloads.
- Do not delete `maintenance/`.
- Do not delete `aligned_text.json`.
- Do not casually remove helper functions from HTML just because they look redundant. Some functions support punctuation cleanup, bilingual switching, state history, or regenerated text behaviour.
- Do not revert UI choices unless the user asks.
- Do not change route order unless you can explain why the new order is clearer for players.
- Do not let generated transcripts drift away from HTML display text.
- Do not edit only one language when a source wording issue affects all languages.

## If a future user asks for a small wording fix

Recommended procedure:

1. Locate the line with `rg`.
2. Read surrounding context in the HTML and transcript.
3. Decide whether it is a source English issue or only a translation issue.
4. If English source changes, update all relevant HTML files and `aligned_text.json`.
5. If Simplified Chinese changes, update `outputs/cn` and then run `write_zh_tw.js`.
6. Regenerate affected guides and transcripts.
7. Verify counts and HTML parseability.
8. Report exact changed phrasing and files touched.

## If a future user asks for a new language

Use the current language folders as the model. Copy engine/UI structure (Gallery, shortcuts, pregame stats freeze, render polish, bilingual toggle if needed) from an existing finished edition — do not expect deleted one-time port scripts to still exist in `maintenance/`.

Recommended procedure:

1. Work from English, not from Chinese.
2. Create a single-language HTML by cloning a finished edition and replacing the story/UI strings.
3. Create a bilingual HTML with English the same way, if needed.
4. Add language entries to aligned text or create a parallel aligned structure if needed.
5. Extend the guide/transcript/gallery scripts for the new language folder.
6. Generate edition notes, endings guide, ending transcripts, hidden scenes guide, and hidden scene transcripts.
7. Verify route counts match the existing languages.
8. Do language-specific punctuation and naturalness QA.

## If a future user asks for final packaging

For release, `outputs/` is enough.

For future editable archival, keep both:

- outputs/
- maintenance/


The old original HTML can be kept separately for historical comparison, but it is not needed to play or maintain the final edition.

## Current handoff (for the next AI)

**Branch:** `main` / `origin/main`. History may be intentionally squashed when the user asks; local `backup/main-before-squash-*` branches are optional recovery only.

### Ship posture

- Prefer **targeted, user-directed** wording edits. Do not launch a bulk “make everything more fluent” pass on any language unless the user explicitly asks.
- EN / CN / TW / ES / FR playable trees under `outputs/` are the source of truth for what players see.
- Route inventory: **10 endings / 21 hidden scenes** per language.
- After Chinese/TW edits: `python3 maintenance/qa_regression_gate.py`.

### Do

- Read this file + `maintenance/README.txt` before editing.
- For CN→TW: edit CN (+ `aligned_text.json`), run `write_zh_tw.js`, remember overrides do not rewrite HTML (see above).
- For small wording fixes: update HTML + `aligned_text.json`, regenerate guides/transcripts if player-facing route text changed.
- Keep settled wording in the section above (prices, urinal beats, immersion UI, caretaker/保安, etc.).

### Do not

- Reopen settled immersion UI or locked CN/TW protect strings without an explicit user ask.
- “Fix” raw HTML typography that the render pipeline already handles.
- Hand-edit TW as if it were an independent translation from English.
- Force-push or rewrite git history unless the user explicitly asks.
- Treat files under `maintenance/fix_logs/` or `maintenance/cn_review/` as current ship text.

## Final current status

`main` ships the restored multi-language edition with guides, transcripts, Gallery, and the settled conventions above. Ready for packaging, publication, or careful minor edits.
