# Final audit follow-up — 27 September 2026

The Gallery introduction now uses position-independent wording in all seven
languages. It remains accurate in both the text toolbar and the visual toolbar,
with identical standalone/bilingual wording. No story, route, Gallery title,
number, transcript boundary or game-state rule changes.

The play-only README generator no longer includes an omission-status statement.
The developer documentation and localization scope still describe the repository's
actual content. The installed player copies have later manual German/Japanese edits
that are not in these repositories; those passages were not altered or imported
in this follow-up. This release must not be described as a full source sync of
those local edits.

The visual follow-up removes two unused `--body-base` declarations. The active
paper, outer-background, border and accent variables remain unchanged.

`gallery-location-refinement-2026-09-27.json` records the exact seven Notes changes.
Source-integrity verification reverses them before checking the existing immutable
preservation checkpoints. Only the affected German/Japanese review hashes change.

When maintaining an existing player installation, compare it with the source
export before replacement. Preserve any local edits; export to a new directory.
The installed update for this follow-up changes only the Notes introduction,
README wording and unused visual CSS. It does not replace whole local pages with
repository exports.

Verification covers generated freshness, source/text preservation, bilingual
parity, transcript freshness and visual source/asset checks. Notes, layout and
palette scope are checked separately. Browser rendering and actual animation
playback have not been newly reviewed.
