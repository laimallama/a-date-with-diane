# Shared English content

The owner requires shared English content changes to reach both ADWD and ADWD-visual.

- Read `README.md` and `maintenance/AI_HANDOFF.md` before editing.
- This repository owns the canonical English story/runtime, Gallery routes, English wiki, transcripts, and shared maintenance scripts. Apply applicable translations and bilingual changes here as described in the handoff.
- After a shared English/content/tool change, refresh the affected generated files, run `node maintenance/sync_visual_edition.js`, and verify both repositories with `node maintenance/verify_project.js` using each script's absolute path if necessary. The sync command also rebuilds the visual HTML.
- Synchronization is part of completing the change, not a separate optional follow-up. Do not stop with only the text checkout updated.
- Visual presentation, scene mapping, sprites, and effects remain in the separate visual repository. Do not replace those with text-edition files.
- When shared changes add/rename scene tags, change the on-screen cast, or alter tracked state, review and update `visual/scene-map.js` / `visual/adapter.js` in ADWD-visual and browser-check those scenes. Copying text cannot infer new presentation mappings.
- Default checkout locations are sibling folders `ADWD` and `ADWD-visual`. `ADWD_TEXT_ROOT` and `ADWD_VISUAL_ROOT` can override them. If a checkout is unavailable, report that cross-project verification is incomplete; `--local-only` verifies only the available snapshot.
- This standing synchronization request does not authorize committing or pushing either repository.
