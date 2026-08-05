# AI handoff for A Date With Diane

This document is for any future AI or agent taking over maintenance of this project.
Read this before making changes.

## Project identity

This project is a restored, cleaned, translated, documented, and expanded edition of the old HTML text game *A Date With Diane*.

The original game was an old, single-file, JavaScript-driven adult branching text game. The restored edition keeps the original narrative flavour but improves the playable experience, fixes logic and wording issues, removes obsolete image placeholders, adds a back button with state restoration, adds multiple language editions, and documents all verified endings and hidden scenes.

The publishable files are in 'outputs/'.

The maintenance toolkit is in 'maintenance/'.

Do not treat the old original HTML as the working source unless the user explicitly asks for comparison with the historical original. The current final edition lives in 'outputs/'.

## Current final language set

There are five language folders:

- 'outputs/en'
- 'outputs/cn'
- 'outputs/tw'
- 'outputs/es'
- 'outputs/fr'

The languages are:

- 'en': English
- 'cn': Simplified Chinese
- 'tw': Traditional Chinese using Taiwan-flavoured wording
- 'es': Spanish
- 'fr': French

The bilingual editions are:

- 'outputs/cn/dianedate_cn_bilingual.html'
- 'outputs/tw/dianedate_tw_bilingual.html'
- 'outputs/es/dianedate_es_bilingual.html'
- 'outputs/fr/dianedate_fr_bilingual.html'

Each bilingual edition switches between that language and English. The English-only edition does not need a bilingual counterpart.

## Output structure

Each language folder has this shape:

outputs/{language}/
  dianedate_{language}.html
  dianedate_{language}_bilingual.html, except English
  edition_notes_{language}.txt
  endings/
    dianeguide_{language}.txt
    transcripts/
      ending transcript files
  hidden_scenes/
    hidden_scenes_guide_{language}.txt
    scene_transcripts/
      hidden scene transcript files


There should be no 'code_fragments' output folder. Earlier in the project one code-only Church Lych Gate fragment existed, but it was later verified as playable and promoted to an official hidden scene.

## Current route inventory

There are currently:

- 10 verified ending transcripts per language.
- 21 verified hidden scene transcripts per language.

These counts should remain true unless the user explicitly asks to add or remove routes.

## Verified endings

The ending transcript files are currently:

01_third_prize
02_fourth_prize
03_first_prize
04_fifth_prize
05_second_prize
06_lounge_story_consolation
07a_consolation_tuesday_pavilion
07b_consolation_thursday_subway
08_chloe_consolation
09_amanda_consolation


The endings guide is not arranged as a pure story timeline. It is arranged for player clarity:

1. Formal Prize endings.
2. Lounge Story consolation.
3. Two general consolation variants.
4. Chloe and Amanda special consolation endings.
5. Common failure endings.

The '07a' and '07b' naming is intentional. They are sibling consolation routes, not a normal eighth and ninth prize ladder.

## Verified hidden scenes

The current hidden scene order is:

01_theatre_flashback
02_portaloo_ladies_first
03_portaloo_too_embarrassed
04_thursday_bridge_diane_molly
05_molly_bruno_towpath
06_diane_slips_away_while_watching_molly
07_riverside_bushes_diane
08_riverside_towpath_landing
09_riverside_bushes_together
10_public_toilet_spyhole
11_public_toilet_spyhole_stockings
12_closed_toilet_building_lookout
13_closed_toilet_building_together
14_closed_toilet_building_bad_choice
15_riverside_gents_urinal
16_brunette_behind_camper
17_diane_brunette_camper_round
18_diane_brunette_camper_under
19_camper_gentleman_choice
20_church_lych_gate_glimpse
21_hidden_camera


This is the intended final order. It is not a mechanical discovery order. It is a player-facing order based on story progression and scene clusters:

1. Theatre and early flashback.
2. Riverside and portaloo material.
3. Molly and Bruno towpath material.
4. Public toilet spyhole variants.
5. Closed toilet building variants.
6. Gents urinal special branch.
7. Bus stop and camper van scenes.
8. Church lych gate on the bus-home route.
9. Hidden bathroom camera after arriving home.

Do not move '20_church_lych_gate_glimpse' back after '21_hidden_camera'. It was initially added last because it was discovered last, but the current order is more coherent.

## Redundancy judgement for hidden scenes

The hidden scenes are intentionally separate. Do not merge them casually.

Important distinctions:

- '02_portaloo_ladies_first' and '03_portaloo_too_embarrassed' are not duplicates. One is the successful hidden portaloo route, and the other is the bad variant where the player offers it too directly.
- '05_molly_bruno_towpath' and '06_diane_slips_away_while_watching_molly' are not duplicates. The second is a higher-urgency variant where Diane slips away while the player is distracted by Molly.
- '10_public_toilet_spyhole' and '11_public_toilet_spyhole_stockings' are not duplicates. The first is the Bruno catch and discarded panties failure route. The second is the stockings variant where the route rejoins the walk.
- '12_closed_toilet_building_lookout', '13_closed_toilet_building_together', and '14_closed_toilet_building_bad_choice' are separate choices around the closed toilet building.
- '16', '17', '18', and '19' are separate camper van outcomes.
- '20_church_lych_gate_glimpse' is a narrow Thursday route during the trip home.
- '21_hidden_camera' is a short-route house scene with the brother's hidden camera.

## Important restored or connected branches

Several branches that were unused, redundant, or awkward in the original were either repaired or removed during restoration.

Important repaired/connected areas included:

- 'loungedesp': kept and connected because it fit the story context.
- 'luckytrip': repaired where needed for route logic.
- 'nicelydesp': repaired and integrated.
- Church Lych Gate Glimpse: confirmed reachable without threshold changes and added as hidden scene 20.
- Closed toilet building variants: verified and added to Hidden Scenes.
- Gents urinal branch: verified and added to Hidden Scenes.
- Molly and Bruno towpath variants: verified and added to Hidden Scenes.

Earlier obsolete image helper logic and visible image placeholders were removed because this edition is text-only.

## User preferences and style principles

The user wants this edition to preserve the original charm. Do not rewrite the game in a polished literary style.

The ideal style is:

- grammatically clean
- readable
- direct
- playful
- slightly old-fashioned
- still recognisably the original game
- not over-literary
- not over-sanitised
- not machine-translated

For Chinese, the user strongly prefers natural native phrasing over literal translation. Avoid translationese.

For fetish-related wording, be accurate and natural, but do not add new events or intensify beyond the original.

For Chinese pee/desperation language, context matters. Possible vocabulary includes:

- 憋尿
- 尿急
- 憋得难受
- 憋得快不行
- 憋不住
- 撒尿
- 尿尿
- 上厕所
- 去厕所
- 方便
- 解决

Do not use one term everywhere. Choose based on whether Diane is speaking politely, the narrator is describing an event, or the line is more explicit.

Some settled Chinese decisions:

- 'Little Girls Room' was localised as '让我去嘘嘘嘛，求你了！' in the relevant line. Do not change it just because another reviewer dislikes it.
- 'Brunette' is '褐发女生' in Simplified Chinese and '褐髮女生' in Traditional Chinese.
- The UI stat formerly translated around tummy/liquid is '待转化水分' in Simplified Chinese and '待轉化水分' in Traditional Chinese.
- 'Shyness' is '害羞值'.
- 'Intimacy' is '亲密度' or '親密度'.

## Chinese spacing rule

For Simplified and Traditional Chinese text files and HTML text, do not insert Western-style spaces around English words, numbers, or acronyms just because they touch Chinese characters.

Examples of the desired style:

- '我已满18岁。'
- '3英镑'
- '10个结局'
- 'HTML文件'

This is intentional. Other languages keep normal word spacing.

## Punctuation and quotation rules

The final HTML and transcript files use different conventions on purpose.

HTML:

- Normal spoken dialogue is usually represented as 'DIANE:' or 'YOU:'.
- Hidden dialogue or quoted speech can appear in italics rather than quotation marks.
- Stage directions or manner notes in dialogue are shown with italic parentheses in HTML, such as 'DIANE: <em>(Whispers in your ear)</em> I’m dying...'.
- Location headings and their short explanatory sublines are not wrapped in transcript-style brackets.
- Choice buttons are punctuated when they read like sentences.
- Price/menu labels are usually not punctuated.
- Dates are now punctuated as choices.

TXT transcripts:

- Button choices are shown in round parentheses.
- Hidden dialogue is converted to language-appropriate quotation marks.
- Stage/action notes are shown in square brackets.
- H2 location headings are shown in corner brackets.
- Transcript files omit the age gate and opening rules page.
- Hidden-scene transcripts omit Entry/Exit labels because those belong in the guide, not the transcript.

English typography:

- Curly apostrophes and curly double quotation marks are used in HTML.
- In text files, curly marks are acceptable and currently used.
- '’50s' must use a right curly apostrophe, not a left quote.
- 'Information board' was corrected to 'information board' because it is a common noun, not a proper sign name.

Chinese typography:

- Chinese quotation marks are used in TXT where appropriate.
- There should be no extra space between a closing Chinese quote and following narration, such as '“真是个好主意。”她说。'
- Chinese stage directions in TXT use square brackets, followed by a space before the spoken text when they appear inline after a speaker label.

Spanish and French:

- Spanish uses normal Spanish punctuation and can use '« »' where that is more natural.
- Spanish em dash spacing follows Spanish norms around parenthetical or interruptive usage.
- French uses French punctuation where appropriate, including French spacing before certain marks.

## UI and layout principles

The current HTML UI is considered final unless the user asks for a specific change.

Important choices:

- The large redundant game header was removed.
- The main game card is the primary screen.
- Image placeholders were removed.
- The game is text-based.
- The back button restores the previous step and previous state.
- The age rejection screen should not show stats.
- The stats are arranged as two rows of three:
  - Resources/body state first, then social/hidden-state values as already implemented.
- European-language UI uses a serif body and a distinct UI treatment as currently implemented.
- Chinese UI uses Chinese font stacks to avoid awkward punctuation rendering.
- Location heading separators were simplified. Do not reintroduce unnecessary horizontal rules.
- The small subline under a location title is explanatory text and should not be wrapped in '【】' in transcripts.

## Maintenance scripts

Use Node.js to run the scripts.

The maintenance folder intentionally contains only the final compact toolkit:

maintenance/README.txt
maintenance/AI_HANDOFF.md
maintenance/aligned_text.json
maintenance/check_endings.js
maintenance/verify_routes.js
maintenance/write_verified_guides.js
maintenance/write_ending_transcripts.js
maintenance/write_hidden_scenes.js
maintenance/write_zh_tw.js


### 'aligned_text.json'

This is the compact aligned text index rebuilt from the final single-language HTML files.

It contains:

- 4,943 aligned text entries.
- 3,812 story strings.
- 1,131 choice strings.
- English, Simplified Chinese, Spanish, French, and Traditional Chinese text in matching positions.
- Destination tags for choices.

If text is changed in one language, update aligned text when appropriate. This file is important for future cross-language consistency checks.

### 'write_verified_guides.js'

Replays the verified ending routes and regenerates:

outputs/{en,cn,es,fr}/endings/dianeguide_{language}.txt


The Traditional Chinese guide is generated later by 'write_zh_tw.js'.

### 'write_ending_transcripts.js'

Replays ending routes and regenerates:

outputs/{en,cn,es,fr}/endings/transcripts/


The Traditional Chinese ending transcripts are generated later by 'write_zh_tw.js'.

### 'write_hidden_scenes.js'

Replays hidden scene routes and regenerates:

outputs/{en,cn,es,fr}/hidden_scenes/hidden_scenes_guide_{language}.txt
outputs/{en,cn,es,fr}/hidden_scenes/scene_transcripts/


The Traditional Chinese hidden scene guide and transcripts are generated later by 'write_zh_tw.js'.

This script also removes legacy hidden-scene output folders from older layouts.

### 'write_zh_tw.js'

Builds Traditional Chinese outputs from the final Simplified Chinese outputs.

It uses macOS Swift/ICU conversion plus Taiwan-specific replacement rules.

Run this after generating guides or transcripts, and after any Simplified Chinese HTML/text update that should be reflected in Traditional Chinese.

### 'check_endings.js'

Shared route arrays and helper exports used by the ending guide and transcript scripts.

### 'verify_routes.js'

Small command-line helper for replaying a route against an HTML file. It defaults to:

outputs/en/dianedate_en.html


## Recommended regeneration order

After edits that affect visible game text, route text, guides, or transcripts, use this order:

    node maintenance/write_verified_guides.js
    node maintenance/write_ending_transcripts.js
    node maintenance/write_hidden_scenes.js
    node maintenance/write_zh_tw.js

If only hidden scenes changed, you may run:

    node maintenance/write_hidden_scenes.js
    node maintenance/write_zh_tw.js

If only endings changed, run:

    node maintenance/write_verified_guides.js
    node maintenance/write_ending_transcripts.js
    node maintenance/write_zh_tw.js

## Verification commands

After substantial edits, check route document counts:

    node - <<'NODE'
    const fs=require('fs'), path=require('path');
    for(const lang of ['en','cn','tw','es','fr']){
      const eDir=path.join('outputs',lang,'endings','transcripts');
      const hDir=path.join('outputs',lang,'hidden_scenes','scene_transcripts');
      const e=fs.readdirSync(eDir).filter(f=>f.endsWith('_'+lang+'.txt')).length;
      const h=fs.readdirSync(hDir).filter(f=>f.endsWith('_'+lang+'.txt')).length;
      const eg=fs.existsSync(path.join('outputs',lang,'endings','dianeguide_'+lang+'.txt'));
      const hg=fs.existsSync(path.join('outputs',lang,'hidden_scenes','hidden_scenes_guide_'+lang+'.txt'));
      console.log(lang+': endings='+e+', hidden='+h+', endingGuide='+eg+', hiddenGuide='+hg);
    }
    NODE

Expected final output:

en: endings=10, hidden=21, endingGuide=true, hiddenGuide=true
cn: endings=10, hidden=21, endingGuide=true, hiddenGuide=true
tw: endings=10, hidden=21, endingGuide=true, hiddenGuide=true
es: endings=10, hidden=21, endingGuide=true, hiddenGuide=true
fr: endings=10, hidden=21, endingGuide=true, hiddenGuide=true


Check HTML JavaScript parseability:

    node - <<'NODE'
    const fs=require('fs'), vm=require('vm');
    for(const file of [
      'outputs/en/dianedate_en.html',
      'outputs/cn/dianedate_cn.html',
      'outputs/cn/dianedate_cn_bilingual.html',
      'outputs/tw/dianedate_tw.html',
      'outputs/tw/dianedate_tw_bilingual.html',
      'outputs/es/dianedate_es.html',
      'outputs/es/dianedate_es_bilingual.html',
      'outputs/fr/dianedate_fr.html',
      'outputs/fr/dianedate_fr_bilingual.html'
    ]){
      const html=fs.readFileSync(file,'utf8');
      const script=html.match(/<script>([\s\S]*?)<\/script>/i)?.[1];
      const box={innerHTML:''};
      const context={console,document:{getElementById(){return box;}}};
      context.window=context;
      vm.createContext(context);
      try{vm.runInContext(script,context,{filename:file}); console.log('OK',file);}
      catch(e){console.log('FAIL',file,e.message);}
    }
    NODE

Expected result: all nine HTML files print 'OK'.

Useful text searches:

    rg -n "Information board|Code-Only|code_fragments|races overtime" outputs maintenance

Expected result: no output except the intentional legacy-cleanup paths in 'maintenance/write_hidden_scenes.js' if searching for 'code_fragments'.

## Known intentional cleanup paths

'maintenance/write_hidden_scenes.js' still contains 'code_fragments' paths in 'LEGACY_HIDDEN_OUTPUTS'.

This is intentional. Those paths are only there so the script can delete old generated folders if they ever exist. They are not current output folders.

## Important wording decisions already settled

Do not reopen these unless the user specifically asks:

- 'Church Lych Gate Glimpse' is verified and official hidden scene 20.
- 'Your Brother's Hidden Bathroom Camera' is hidden scene 21.
- 'information board' is lowercase in English.
- 'Chloe wears a short tartan skirt and black tights.' is the settled English line.
- 'Diane wears a black and white patterned dress ... She has a lacy white bra, white panties, no slip and bare legs.' is the cleaned English grammar for that clothing note.
- 'Diane chooses the Tortelloni (£9).' style does not need 'at'.
- 'Don’t let it go to your head.' means “do not get too pleased with yourself”, not “do not let the wine make you drunk”.
- 'Shame on you' is the natural English form, not 'Shame upon you'.
- In game stat notices, English uses past tense such as 'You gained 2 intimacy points.' and 'You lost 7 intimacy points.'
- English uses 'points', not 'pts', in transcript files.
- 'A Date with Diane' is title case, not all caps.
- Formal prize ending lines have consistent exclamation marks.

## Known original logic clarification

The game has several moments where Diane knows or suspects some things but not everything.

For example, Diane knows the player also missed a bus and may know he went somewhere around the car park. That does not mean she knows he watched her pee. Do not “fix” this as a contradiction unless reviewing a specific line with context.

## Translation quality rules

When editing translations:

1. Translate from English source, not from another translation, unless working specifically on Traditional Chinese from Simplified Chinese.
2. Preserve route structure and button destination tags.
3. Do not add new plot events.
4. Do not make the writing overly literary.
5. Keep sexual and fetish language natural for the target language.
6. Check every changed line against surrounding context.
7. If a reviewer gives suggestions, accept only the ones that are genuinely better. Several external suggestions during this project were intentionally rejected.

## Traditional Chinese workflow

Traditional Chinese is not separately hand-translated from English.

The intended workflow is:

1. Final Simplified Chinese is updated.
2. 'write_zh_tw.js' converts it using Swift/ICU.
3. Taiwan-specific wording replacements are applied.

This means that if you hand-edit 'outputs/tw' directly, those changes may be overwritten next time 'write_zh_tw.js' runs. Prefer updating Simplified Chinese plus 'write_zh_tw.js' replacement rules if the change should persist.

## File editing cautions

- Do not edit old source files in Downloads.
- Do not delete 'maintenance/'.
- Do not delete 'aligned_text.json'.
- Do not casually remove helper functions from HTML just because they look redundant. Some functions support punctuation cleanup, bilingual switching, state history, or regenerated text behaviour.
- Do not revert UI choices unless the user asks.
- Do not change route order unless you can explain why the new order is clearer for players.
- Do not let generated transcripts drift away from HTML display text.
- Do not edit only one language when a source wording issue affects all languages.

## If a future user asks for a small wording fix

Recommended procedure:

1. Locate the line with 'rg'.
2. Read surrounding context in the HTML and transcript.
3. Decide whether it is a source English issue or only a translation issue.
4. If English source changes, update all relevant HTML files and 'aligned_text.json'.
5. If Simplified Chinese changes, update 'outputs/cn' and then run 'write_zh_tw.js'.
6. Regenerate affected guides and transcripts.
7. Verify counts and HTML parseability.
8. Report exact changed phrasing and files touched.

## If a future user asks for a new language

Use the current language folders as the model.

Recommended procedure:

1. Work from English, not from Chinese.
2. Create a single-language HTML.
3. Create a bilingual HTML with English.
4. Add language entries to aligned text or create a parallel aligned structure if needed.
5. Generate edition notes, endings guide, ending transcripts, hidden scenes guide, and hidden scene transcripts.
6. Verify route counts match the existing languages.
7. Do language-specific punctuation and naturalness QA.

## If a future user asks for final packaging

For release, 'outputs/' is enough.

For future editable archival, keep both:

outputs/
maintenance/


The old original HTML can be kept separately for historical comparison, but it is not needed to play or maintain the final edition.

## Final current status

As of this handoff:

- The playable HTML files are final.
- The Simplified Chinese, Traditional Chinese, Spanish, and French editions are final.
- The bilingual editions are final.
- The ending guides are final.
- The hidden scene guides are final.
- The ending transcripts are final.
- The hidden scene transcripts are final.
- The maintenance folder is compact and sufficient for future continuation.

The project is ready for manual layout, packaging, publication, or careful future minor edits.
