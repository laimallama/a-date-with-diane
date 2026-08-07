# Fix logs (optional archive)

These JSON folders are **local review archives only**.

**Current ship text** is always:

- `outputs/{en,cn,tw,es,fr}/`
- `maintenance/aligned_text.json`

Do not re-apply files under `cn_fluency/`, `tw_voice/`, `es_fluency/`, `fr_fluency/`, or `es_fr_rollback/` onto the game.

## Durable pipeline files (still used)

- `maintenance/taiwan_voice_fixes.json`
- `maintenance/taiwan_voice_overrides.json`
- `maintenance/qa_protect.json`
- `maintenance/qa_regression_gate.py`
- `maintenance/write_zh_tw.js`

For conventions and handoff, read `maintenance/AI_HANDOFF.md`.
