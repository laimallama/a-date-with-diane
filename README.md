# A Date With Diane (Visual)

This is the English-only visual experiment for *A Date With Diane*. The text edition, with five languages and bilingual variants, is maintained separately in `/Users/apple/Documents/ADWD`.

| Project | Local folder | Configured origin |
|---|---|---|
| Text edition | `/Users/apple/Documents/ADWD` | `https://github.com/laimallama/a-date-with-diane.git` |
| Visual experiment | `/Users/apple/Documents/ADWD-visual` | `https://github.com/laimallama/a-date-with-diane-visual.git` |

Keep the repositories separate. Shared English runtime fixes should be applied to both English source files; visual presentation changes belong here. A local change does not authorize committing or pushing.

## Playing

Open [`outputs/en/dianedate_visual_en.html`](outputs/en/dianedate_visual_en.html) in a browser. This is the generated visual edition. Its companion text runtime is [`outputs/en/dianedate_en.html`](outputs/en/dianedate_en.html), and the setting reference is [`outputs/en/wiki_en.html`](outputs/en/wiki_en.html).

The visual edition adds character sprites, location labels, meters, and a two-column layout. It is a 2D browser presentation.

Gallery contains **15 ending leaves** and **30 hidden-scene leaves**. It supplies guided routes and Skip. The visual toolbar labels the command **Skip**; the text companion calls it **Skip to the good bit!**. The English transcripts under `outputs/en/transcripts/` use the corresponding Gallery start positions.

The game opens on the title screen. **B** goes Back, **G** / Escape opens or closes Gallery, **H** toggles the active guide, **S** skips to the route's designated start, **D** toggles dark mode, and **1–9** select choices. Dark mode persists in the same tab through `sessionStorage`. Back restores game state and text variation within the current session; it is not a persistent save system. Visual animations are reconstructed on Back, rather than restored at an exact animation frame.

## Maintained scope and local references

Only `outputs/en/` is maintained and built in this visual repository. This local checkout also contains untracked reference copies under `outputs/cn/`, `outputs/tw/`, `outputs/es/`, and `outputs/fr/`, plus `maintenance/aligned_text.json`. They are retained for reference, are excluded from the supported visual build and verification scope, and may lag behind the maintained text edition. Use `/Users/apple/Documents/ADWD` for current translations. Their presence does not make this a multilingual visual release.

## Maintaining

Project conventions are in [`maintenance/AI_HANDOFF.md`](maintenance/AI_HANDOFF.md); presentation details are in [`visual/README.md`](visual/README.md).

Read-only checks:

```bash
node maintenance/verify_project.js
node maintenance/verify_ending_routes.js
node maintenance/write_hidden_scenes.js
node maintenance/build_gallery_data.js --check
node maintenance/build_visual_edition.js --check
```

`verify_project.js` checks all 45 embedded Gallery routes, exact Back/forward replay, guide progress, Skip, location regression cases, HTML metadata, JavaScript syntax, and generated-file consistency. Its DOM stub does not verify browser layout or animation timing.

After editing route definitions, rebuild in this order:

```bash
node maintenance/build_gallery_data.js
node maintenance/write_transcripts.js
node maintenance/build_visual_edition.js
node maintenance/verify_project.js
```

After an English runtime or presentation-only edit, rebuild the visual edition and run the verifier. Do not edit the generated visual HTML directly. Transcript generation validates routes before overwriting its managed English transcript files; unrelated files are preserved. The commands resolve project inputs relative to their script location.
