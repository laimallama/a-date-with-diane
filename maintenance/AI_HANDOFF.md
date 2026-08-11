# AI handoff — A Date With Diane

Read this before editing. Ship text lives in `outputs/`. Toolkit lives in `maintenance/`.

## What this project is

Restored multi-language edition of the old HTML branching adult text game *A Date With Diane*: cleaned wording/logic, Back with state restore, in-game Gallery + guides/transcripts, five playable languages.

**Languages (all independent):** `en`, `cn`, `tw`, `es`, `fr` under `outputs/{lang}/`.  
TW is Traditional Chinese with Taiwan-flavoured wording — edit it like ES/FR, not as a derivative of CN.

Each folder has: playable HTML (+ bilingual except EN), edition notes, endings guide + transcripts (10), hidden-scenes guide + transcripts (21).

## Raw HTML vs rendered text

Raw `dianedate_*.html` strings intentionally look rough (straight quotes, uncapitalized choices, legacy `<LI>`/`<EM>`, etc.). A render-time pipeline (`polishStoryHtml`, `polishChoiceText`, `smartenHtml`, speech-aside wrappers, …) fixes that every display.

**Do not “fix” raw source to pre-bake typography.** Judge text in a real render (browser or route scripts). Route matching uses rendered text.

## Editing playable text

1. Find the line (`rg`), read surrounding HTML context.
2. If English changes, update **all** language HTMLs that need it, plus `maintenance/aligned_text.json`.
3. CN and TW are separate: a CN wording fix does **not** auto-update TW — edit `outputs/tw/` yourself when TW should change.
4. Regenerate guides/transcripts/gallery if player-facing route or title text changed.

`aligned_text.json` is a cross-language index for checks — it does **not** build HTML.

## Maintenance toolkit

| File | Role |
|------|------|
| `write_verified_guides.js` | Ending guides for en/cn/tw/es/fr |
| `write_ending_transcripts.js` | Ending transcripts (10 each) |
| `write_hidden_scenes.js` | Hidden-scene guides + transcripts (21 each) |
| `build_gallery_data.js` | Rebuild/inject `GALLERY_DATA` (all langs + bilingual) |
| `check_endings.js` / `verify_routes.js` | Shared routes / single-route replay |
| `gallery_data.json` | Generated gallery snapshot (don’t hand-edit) |
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

## Settled wording (don’t reopen unless asked)

- **Immersion CTA:** EN `On with the story!`; CN `开始约会！`; TW `開始約會！`; ES `¡Empezar la cita!`; FR `C'est parti pour le rendez-vous\u202f!` (narrow no-break space before `!`).
- **Buy something:** shop-literal in all langs (`买点东西` / `買點東西` / `Comprar algo` / `Acheter quelque chose`).
- **Prices:** whole pounds, no `.00` (`£1`, `15英镑`). Pence use two places (`£1.50`, `1.50英镑`). FR: `1,50 £`.
- **Caretaker:** CN/TW **管理员** / **管理員** (council first-mention may stay **市政管理员**). Not 看守员/环卫工人/etc.
- **Bouncer (Pavilion):** **保安**. Occasional **门卫** for English *doorman* — not the toilet caretaker.
- **High bladder status:** `…两脚不停地来回挪动。` / `…兩腳不停地來回挪動。`
- **Urinal straddle (`x01569b`):** EN comma before aside (`…urinal, with her back to you`), no em dash. CN/TW: **横跨/橫跨**, aside after `——`, prefer **更省事**. ES `ponerse a horcajadas…`; FR `enjamber l'urinoir…`.
- **Pee-start (`x01570`):** CN `她几乎立刻就尿了。` / TW `她幾乎立刻就尿了。` (keep 几乎/幾乎; no 开始/開始). CN connector **接着** ↔ TW **接著**.
- **Play still on (`x00027`):** **停演** wording (`…想在停演前去看一次…`), not **下演**.

## UI (keep unless asked otherwise)

- Gallery + guided walkthrough + Back; shortcuts: `b` Back, `h` guide toggle, `g`/Esc Gallery, `l` bilingual language, `1–9` choices. **Enter** selects the highlighted guided choice only when a Gallery guide is active **and** Guide is On; otherwise Enter does nothing (normal play still uses `1` for the first choice). These are also summarized in the in-game Notes (`start1`, `x00014a`/`x00014b`): Gallery top-left, keys, Back full-state restore, and Guide on/off/deviate rules.
- Pregame screens freeze/hide stats until the date starts; catch-up digestion ticks on first story screen — don’t remove without re-verifying all routes.
- Screen fade on step change (`.screen-fade`, ~0.18s) + scroll-to-top via `presentScreen()`; disabled under `prefers-reduced-motion`.
- Choice number badges and sticky-Back experiments were rejected; don’t reintroduce.

## Do / don’t

**Do:** targeted user-directed edits; keep HTML + `aligned_text.json` in sync; regenerate guides when routes change.

**Don’t:** bulk “fluency” rewrites without an explicit ask; treat TW as auto-generated from CN; force-push history unless asked; edit only one language when the English source issue affects all.

## Status

`main` ships the five-language restored edition (10 endings / 21 hidden scenes each). Ready for packaging or careful minor edits.
