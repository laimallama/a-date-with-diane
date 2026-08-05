Maintenance files for A Date With Diane

Keep this folder if you may make future wording, route, guide, or transcript edits.

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


This maintenance folder intentionally keeps only the compact final toolkit:

AI_HANDOFF.md
- Detailed project handoff for a future AI or agent.
- Summarizes the final structure, route inventory, style rules, script workflow, verification commands, and known decisions.

aligned_text.json
- Lightweight aligned text index rebuilt from the final single-language HTML files.
- Contains 4,943 aligned text entries: 3,812 story strings and 1,131 choice strings.
- Each entry has English, Chinese, Spanish, French, and Traditional Chinese text in the same story/choice position.
- Choice entries keep destination tags, so future edits can be checked against button routing.

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
- In the HTML, italic or bold styling can mark either hidden dialogue or stage/action text. In transcript text files, hidden dialogue gets language-appropriate quotation marks, stage/action text is shown in square brackets, and H2 location headings are shown in corner brackets.
- English transcript files use full "intimacy point/points" wording rather than the in-game abbreviation.
- English transcript files are written with a UTF-8 BOM for more reliable mobile text viewing.
- Also removes legacy transcript output folders from older layouts.

write_hidden_scenes.js
- Replays verified optional hidden-scene routes.
- Regenerates outputs/{en,cn,es,fr}/hidden_scenes/hidden_scenes_guide_{language}.txt.
- Regenerates all four hidden-scene transcript folders under outputs/{en,cn,es,fr}/hidden_scenes/scene_transcripts/.
- Each language currently has 21 hidden-scene transcript files after write_zh_tw.js syncs the Traditional Chinese set.
- These are not official Prize endings. They document optional mid-route scenes and non-Prize failure branches.
- Uses the same transcript-only rule for italic and bold text: hidden dialogue gets language-appropriate quotation marks, stage/action text is shown in square brackets, and H2 location headings are shown in corner brackets.
- Hidden-scene transcripts omit the guide-style Entry/Exit labels so they read as scene text; Entry/Exit context remains in the hidden scenes guide.
- English hidden-scene guide and transcript files are written with a UTF-8 BOM for more reliable mobile text viewing.

write_zh_tw.js
- Builds the Traditional Chinese outputs from the final Simplified Chinese files.
- Uses macOS Swift/ICU conversion plus Taiwan-specific wording and punctuation cleanup.
- Regenerates outputs/tw/ and adds tw text to aligned_text.json.

check_endings.js
- Shared route arrays and helper exports used by guide/transcript maintenance.

verify_routes.js
- Small command-line helper for replaying one route against an HTML file.
- Defaults to outputs/en/dianedate_en.html.

For playing or sharing the game, outputs/ is enough. For future edits, keep maintenance/ as well.
