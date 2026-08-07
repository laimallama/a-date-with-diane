Maintenance files for A Date With Diane

Keep this folder if you may make future wording, route, guide, or transcript edits.

IMPORTANT: read "Read the rendered output, not the raw source text" near the top of AI_HANDOFF.md before editing any dianedate_*.html file. The raw source is intentionally left with straight quotes, uncapitalized/unpunctuated choice text, legacy uppercase tags, and unparenthesised manner-note asides - a render-time pipeline fixes all of it. Judge text by what it renders as, not by the raw string in the file.

Final outputs are grouped by language. Each language folder keeps playable HTML files and the edition notes at the top level. Supporting material is grouped by purpose:

outputs/en/
- dianedate_en.html
- edition_notes_en.txt
- endings/dianeguide_en.txt
- endings/transcripts contains the verified ending transcript files
- hidden_scenes/hidden_scenes_guide_en.txt
- hidden_scenes/scene_transcripts contains the optional hidden scene transcript files

outputs/cn/
- dianedate_cn.html
- dianedate_cn_bilingual.html
- edition_notes_cn.txt
- endings/dianeguide_cn.txt
- endings/transcripts contains the verified ending transcript files
- hidden_scenes/hidden_scenes_guide_cn.txt
- hidden_scenes/scene_transcripts contains the optional hidden scene transcript files

outputs/es/
- dianedate_es.html
- dianedate_es_bilingual.html
- edition_notes_es.txt
- endings/dianeguide_es.txt
- endings/transcripts contains the verified ending transcript files
- hidden_scenes/hidden_scenes_guide_es.txt
- hidden_scenes/scene_transcripts contains the optional hidden scene transcript files

outputs/fr/
- dianedate_fr.html
- dianedate_fr_bilingual.html
- edition_notes_fr.txt
- endings/dianeguide_fr.txt
- endings/transcripts contains the verified ending transcript files
- hidden_scenes/hidden_scenes_guide_fr.txt
- hidden_scenes/scene_transcripts contains the optional hidden scene transcript files

outputs/tw/
- dianedate_tw.html
- dianedate_tw_bilingual.html
- edition_notes_tw.txt
- endings/dianeguide_tw.txt
- endings/transcripts contains the verified ending transcript files
- hidden_scenes/hidden_scenes_guide_tw.txt
- hidden_scenes/scene_transcripts contains the optional hidden scene transcript files


This maintenance folder keeps only the ongoing toolkit (one-time port/fix installers were removed after the features landed in every HTML edition):

AI_HANDOFF.md
- Detailed project handoff for a future AI or agent.
- Summarizes the final structure, route inventory, style rules, script workflow, verification commands, known decisions, and the 2026-08-07 CN/TW + ES/FR finalize / final-QA handoff.
- Start here before making changes.

README.txt
- This short file-by-file reference.

aligned_text.json
- Lightweight aligned text index rebuilt from the final single-language HTML files.
- Contains 5,013 aligned text entries: 3,882 story strings and 1,131 choice strings.
- Each entry has English, Chinese, Spanish, French, and Traditional Chinese text in the same story/choice position.
- Choice entries keep destination tags, so future edits can be checked against button routing.

qa_protect.json
- Settled best-final wording substrings (mostly CN/TW) that the regression gate checks.

qa_regression_gate.py
- Quick CN/TW regression gate. Run: python3 maintenance/qa_regression_gate.py

fix_logs/
- Optional local archive. Ship text is outputs/ + aligned_text.json — do not re-apply old JSON logs.
- See fix_logs/README.md.

cn_review/
- Optional local tooling only; not part of the playable ship path.
- See cn_review/README.md.

gallery_data.json
- Generated Gallery route data (also embedded as GALLERY_DATA inside each HTML file).
- Do not hand-edit; regenerate with build_gallery_data.js.

check_endings.js
- Shared route arrays and helper exports used by guide/transcript maintenance.

verify_routes.js
- Small command-line helper for replaying one route against an HTML file.
- Defaults to outputs/en/dianedate_en.html.

write_verified_guides.js
- Replays the verified ending routes.
- Currently tracks 10 verified routes, including the Tuesday Pavilion and Thursday subway consolation routes.
- Regenerates outputs/{en,cn,es,fr}/endings/dianeguide_{language}.txt.
- Writes the English guide with a UTF-8 BOM so mobile text viewers are less likely to misread punctuation such as em dashes.

write_ending_transcripts.js
- Replays the verified ending routes.
- Regenerates all four ending transcript folders under outputs/{en,cn,es,fr}/endings/transcripts/.
- Each language currently has 10 ending transcript files.
- Uses English route validation plus internal button destination tags, so localized transcripts use the exact button text shown in each localized HTML file.
- Transcript files skip the age gate and opening rules page, so each one starts with the story after the title.
- In transcripts: manner notes and observational urgency/status italics become square brackets; colored meter status lines stay plain; ordinary narration stays plain; embedded dialogue uses language-appropriate quotation marks; H2 location headings use corner brackets.
- English transcript files use full "intimacy point/points" wording rather than the in-game abbreviation.
- English transcript files are written with a UTF-8 BOM for more reliable mobile text viewing.
- Also removes legacy transcript output folders from older layouts.

write_hidden_scenes.js
- Replays verified optional hidden-scene routes.
- Regenerates outputs/{en,cn,es,fr}/hidden_scenes/hidden_scenes_guide_{language}.txt.
- Regenerates all four hidden-scene transcript folders under outputs/{en,cn,es,fr}/hidden_scenes/scene_transcripts/.
- Each language currently has 21 hidden-scene transcript files after write_zh_tw.js syncs the Traditional Chinese set.
- These are not official Prize endings. They document optional mid-route scenes and non-Prize failure branches.
- Uses the same transcript formatting rules as write_ending_transcripts.js.
- Hidden-scene transcripts omit the guide-style Entry/Exit labels so they read as scene text; Entry/Exit context remains in the hidden scenes guide.
- English hidden-scene guide and transcript files are written with a UTF-8 BOM for more reliable mobile text viewing.

write_zh_tw.js
- Builds the Traditional Chinese outputs from the final Simplified Chinese files.
- Uses macOS Swift/ICU conversion plus Taiwan-specific wording and punctuation cleanup (including 「」 dialogue quotes).
- Regenerates outputs/tw/ and refreshes tw fields in aligned_text.json.
- taiwan_voice_overrides.json affects aligned.tw only; it does not rewrite outputs/tw HTML/transcripts (those always come from CN).
- CN is the source of truth for TW; do not maintain TW as a separate English translation.

build_gallery_data.js
- Rebuilds gallery_data.json and injects GALLERY_DATA into every HTML file that has the in-game Gallery feature (en/cn/es/fr, single and bilingual).
- Run after any route or title change, then run write_zh_tw.js so Traditional Chinese picks up the embedded data from Simplified Chinese.

Recommended regeneration order after wording/route edits:

    node maintenance/write_verified_guides.js
    node maintenance/write_ending_transcripts.js
    node maintenance/write_hidden_scenes.js
    node maintenance/write_zh_tw.js

If Gallery routes or titles changed, also run build_gallery_data.js before write_zh_tw.js.

For playing or sharing the game, outputs/ is enough. For future edits, keep maintenance/ as well.
