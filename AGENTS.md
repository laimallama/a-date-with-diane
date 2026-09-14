# Shared English content

The owner requires this edition to stay synchronized with ADWD's English content.

- Read `README.md`, `maintenance/AI_HANDOFF.md`, and `visual/README.md` before editing.
- Shared English story/runtime, Gallery routes, wiki, transcripts, and maintenance tools originate in the sibling ADWD repository. Make shared content changes there, including its required translations, then run `node maintenance/sync_visual_edition.js` from either checkout.
- Never maintain a divergent copy of shared English content here. The sync command imports it and rebuilds `outputs/en/dianedate_visual_en.html`.
- Keep visual-only changes in `visual/`, `assets/`, and `maintenance/build_visual_edition.js`. Rebuild with `node maintenance/build_visual_edition.js`; normal builds automatically synchronize shared English content first.
- Shared changes to scene tags, on-screen cast, or tracked state also require reviewing/updating `visual/scene-map.js` and `visual/adapter.js`, followed by browser checks of the affected scenes. A content sync alone does not establish new visual mappings.
- Verify both repositories after shared changes. After presentation-only changes, run this repository's verifier and the relevant browser checks.
- Default checkout locations are sibling folders `ADWD` and `ADWD-visual`; environment overrides are `ADWD_TEXT_ROOT` and `ADWD_VISUAL_ROOT`. If canonical ADWD is unavailable, report that upstream synchronization is unverified. `--local-only` explicitly uses the carried snapshot.
- Synchronization does not authorize committing or pushing either repository.
