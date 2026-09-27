# Final audit follow-up — 27 September 2026

Rebuild all thirteen visual editions from the matching text follow-up. Their
Notes introduction no longer describes the Gallery as being at the top left,
so it fits the visual toolbar as well as the text layout.

Remove the unused light/dark `--body-base` declarations from `visual/shell.css`.
Active background, paper, accent and border colours are unchanged. No scene-map,
animation, image, game-state or navigation behaviour changes.

The text repository owns the exact localized change ledger and corrected
play-only README generator. The repositories still differ from later manual
German/Japanese edits in the owner's installed player folders. This follow-up
does not import or overwrite those edits and does not claim a complete sync.

Verification: generated visual freshness, byte-identical text/visual cores,
script syntax, assets and focused visual-runtime checks. This is not a new
browser-rendering or actual-playback review.
