# Maintaining the visual editions

Read `README.md` for releases, commands and source ownership, and `visual/README.md` for
presentation contracts. This repository is `a-date-with-diane-visual`; canonical language
content belongs to the sibling `ADWD` repository. Do not push to the text remote.

## Source ownership and building

ADWD owns the thirteen game cores, seven wikis, Gallery routes, transcripts and seven visual label
catalogs. Edit its maintained `source/` and rebuild the affected releases first. The visual
builder reads these canonical inputs directly. Do not copy non-visual HTML, companions,
locale catalogs or synchronization tools into this repository.

This repository owns `visual/`, `assets/`, the builder and two verifiers. Format visual code
with ADWD's pinned `format_sources.js --visual` and check `verify_maintenance.js --visual`.
The builder preserves every canonical core script byte for byte. Use semantic localization
keys and presentation hooks rather than patches to generated story functions. Language
switches must preserve narrative state, sprites, effects and animation timers.

Building and parity verification require the canonical source checkout. `--check` is
read-only; `ADWD_TEXT_ROOT` selects a nonstandard canonical path. No isolated snapshot or
sync receipt is maintained. Build commands never commit or push automatically.

The normal local folder retains `maintenance/`, `visual/` and asset metadata beside
`outputs/` and `README.md`, matching the GitHub layout without Git history or installed
dependencies. The sibling ADWD folder retains its own maintenance tools, source and
package manifests. Keep this support locally as well as on GitHub.

The installed German/Japanese outputs contain later manual changes absent from the
maintained catalogs. Account for those differences before rebuilding or replacing
installed outputs. Restoring maintenance files does not import the local changes.

For a separate play-only copy, use ADWD's `maintenance/export_games.js`. Such exports
contain no authoring tools or Git history and keep companions once in ADWD. Do not use
a play-only export to replace the normal maintained local folders. Keep temporary
copies, dumps and screenshots outside both projects. README files use plain file paths
and repository names, without hyperlinks or interpuncts.

## Content contracts

Gallery remains the classic interface: 15 ending leaves and 32 hidden-scene leaves. Do not
reintroduce a Variations tab, setup selectors or variation notes. Dialogue alternatives use
one coherent representative route; distinct events may have separate leaves. Canonical ADWD
supplies titles, ordering, transcript cuts and boundaries. Scene-final choices remain
available but unhighlighted beyond the guide endpoint.

Existing story translations and bilingual layers must match their text editions exactly.
Follow ADWD's editorial/state conventions; presentation changes do not authorize new story
wording. Historical school-age sexual flashback material remains outside editorial approval;
mechanical parity/navigation verification is not content curation.

## Verification

Run `node maintenance/verify_project.js` after building. Exact script parity replaces copied
route replay tests here; ADWD tests the shared route/state engine. The asset verifier accounts
for every GIF, reduced-motion still and contiguous effect frame. Use the maintained browser
suite in ADWD for all thirteen visual editions, including both bilingual languages, Guide/Skip/
Back, modal isolation, reduced motion, translated labels and switching during animation.
Document the browser engines actually tested; static checks do not establish browser layout
or exact playback timing on every device.
