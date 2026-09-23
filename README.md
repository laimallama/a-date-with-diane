# A Date with Diane (Visual)

This is the English-only visual experiment for *A Date with Diane*. The text edition, with five languages and bilingual variants, is maintained separately in `/Users/apple/Documents/ADWD`.

| Project | Local folder | Configured origin |
|---|---|---|
| Text edition | `/Users/apple/Documents/ADWD` | `https://github.com/laimallama/a-date-with-diane.git` |
| Visual experiment | `/Users/apple/Documents/ADWD-visual` | `https://github.com/laimallama/a-date-with-diane-visual.git` |

Keep the repositories separate. ADWD owns shared English content; the sync command imports it here. Visual presentation changes belong here. A local change does not authorize committing or pushing.

## Playing

Open [`outputs/en/dianedate_visual_en.html`](outputs/en/dianedate_visual_en.html) in a browser. This is the generated visual edition. Its companion text runtime is [`outputs/en/dianedate_en.html`](outputs/en/dianedate_en.html), and the setting reference is [`outputs/en/wiki_en.html`](outputs/en/wiki_en.html).

The visual edition adds character sprites, location labels, meters, and a two-column layout. It is a 2D browser presentation.

Gallery contains **15 ending leaves** and **31 hidden-scene leaves**. It supplies guided routes and Skip. The visual toolbar labels the command **Skip**; the text companion calls it **Skip to the good bit!**. The English transcripts under `outputs/en/transcripts/` use the corresponding Gallery start positions.

The game opens on the title screen. **B** goes Back, **G** / Escape opens or closes Gallery, **H** toggles the active guide, **S** skips to the route's designated start, **D** toggles dark mode, and **1–9** select choices. Dark mode persists in the same tab through `sessionStorage`. Back restores game state and text variation within the current session; it is not a persistent save system. Visual animations are reconstructed on Back, rather than restored at an exact animation frame.

## Maintained scope

Only `outputs/en/` is maintained and built in this visual repository. Translations live in `/Users/apple/Documents/ADWD`. This is not a multilingual visual release.

## Maintaining

Project conventions are in [`maintenance/AI_HANDOFF.md`](maintenance/AI_HANDOFF.md); presentation details are in [`visual/README.md`](visual/README.md).

Read-only checks:

```bash
node maintenance/verify_project.js
node maintenance/verify_ending_routes.js
node maintenance/write_hidden_scenes.js
node maintenance/build_gallery_data.js --check
node maintenance/build_visual_edition.js --check
node maintenance/sync_visual_edition.js --check
node maintenance/write_transcripts.js --check
```

`verify_project.js` checks all 46 embedded Gallery routes in both the companion and generated visual core, exact Back/forward replay, guide progress, Skip, numerical state parity, location cases, HTML metadata, JavaScript syntax, and generated-file consistency. It also checks shared content against ADWD and all 46 English transcripts. Its DOM stub does not execute visual adapter behavior or verify browser layout or animation timing.

For shared English story/runtime, route, wiki, transcript, or maintenance changes, edit canonical ADWD first and refresh its affected generated files. Then, from either checkout:

```bash
node maintenance/sync_visual_edition.js
node maintenance/verify_project.js
```

Also run ADWD's verifier after shared changes. After a presentation-only edit, run `build_visual_edition.js` and this verifier. Normal visual builds synchronize shared English content first. Do not edit the generated visual HTML directly.

Synchronization copies only the managed English game, wiki, transcripts, English Gallery snapshot, and shared maintenance scripts. It preserves `visual/`, `assets/`, the visual builder, and unrelated files. The first sync adopts canonical content; later syncs use `maintenance/shared_content_state.json` to reject independently changed shared targets before writes. Reconcile such edits into ADWD before syncing. Nothing is automatically committed or pushed.

Default paths are sibling folders `ADWD` and `ADWD-visual`; override them with `ADWD_TEXT_ROOT` and `ADWD_VISUAL_ROOT`. An isolated clone can use `build_visual_edition.js --local-only` and `verify_project.js --local-only` to work with its carried snapshot, which does not verify synchronization against ADWD. All commands resolve project inputs relative to their script location.

The Gallery contains **15 ending leaves and 31 hidden-scene leaves** in all five standalone languages, all four bilingual editions, and visual English. The camper-group addition “You and Diane Come Across the Brunette” is localized in every interface. Routes, ordering, scene boundaries and localized transcripts are synchronized. Dialogue differences use one coherent representative route, without extra variation controls or menu notes.

The direct camper encounter is fourth within its group: after the solo encounters and before the covert-watching branches. Its title remains “You and Diane Come Across the Brunette”. The guide and transcript open on `carparka0`, cover the encounter on `carparka1`, and stop before `taxihome1`. The final taxi-rank choice correctly remains unhighlighted because it is outside this scene; Back restores the highlighted waiting choice. The transcript filename `09ba_camper_encounter_en.txt` keeps it in Gallery order without renaming existing transcripts.

The camper group pairs “Caught by the Brunette’s Boyfriend” immediately after “Peeping Underneath”, then closes with the non-watching choice. Its transcript slug is `09da_camper_caught`; the retired `09f_camper_caught` filenames were deliberately migrated. The Chardonnay solo scene now includes the return-to-queue response on `carpark3`, ending before `busqueue7`. All scene-final continuation choices remain available but unhighlighted.
