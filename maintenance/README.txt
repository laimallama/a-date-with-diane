Maintenance files for A Date With Diane

Keep this folder if you may make future wording, route, guide, or transcript edits.

IMPORTANT: read AI_HANDOFF.md before editing any dianedate_*.html file. Raw source is intentionally rough; a render-time pipeline fixes typography. Judge text by what it renders as.

Five independent languages under outputs/: en, cn, tw, es, fr.
Each has playable HTML (+ bilingual except en), edition notes, endings guide + 10 transcripts, hidden-scenes guide + 21 transcripts.

This folder is the ongoing toolkit only:

AI_HANDOFF.md
- Concise handoff for a future AI/agent. Start here.

README.txt
- This short file-by-file reference.

aligned_text.json
- Cross-language string index (~5013 entries). Does not build HTML.
- Keep in sync when you change wording.

gallery_data.json
- Generated Gallery data (also embedded in each HTML). Regenerate with build_gallery_data.js; do not hand-edit.

check_endings.js
- Shared route arrays for guide/transcript scripts.

verify_routes.js
- Replay one route against an HTML file (defaults to EN).

write_verified_guides.js
- Regenerates endings guides for en/cn/tw/es/fr.

write_ending_transcripts.js
- Regenerates ending transcripts (10 per language) for en/cn/tw/es/fr.

write_hidden_scenes.js
- Regenerates hidden-scene guides + transcripts (21 per language) for en/cn/tw/es/fr.

build_gallery_data.js
- Rebuilds gallery_data.json and injects GALLERY_DATA into all HTML editions (including tw and bilingual).

Recommended regeneration after wording/route edits:

    node maintenance/write_verified_guides.js
    node maintenance/write_ending_transcripts.js
    node maintenance/write_hidden_scenes.js

If Gallery routes or titles changed, also run build_gallery_data.js.

For playing or sharing, outputs/ is enough. For future edits, keep maintenance/ as well.
