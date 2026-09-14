#!/usr/bin/env node
// Test reference-ID ownership with tiny source inventories, without editing games.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const LANGS = ['en', 'cn', 'tw', 'es', 'fr'];
const code = fs.readFileSync(process.env.ADWD_INDEX_TEST_BUILDER || path.join(__dirname, 'build_aligned_text.js'), 'utf8');
function row(node, slot, en, translations = en, kind = 'story', tag) {
  return { source: { node, slot }, en, translations, kind, tag };
}
function build(rows, previous, idRemaps) {
  const sources = Object.fromEntries(LANGS.map(lang => [lang, {
    file: '/fixture/outputs/' + lang + '/game.html', variants: [],
    calls: rows.map(r => ({ kind: r.kind, source: r.source, tag: r.tag,
      static: r.static !== false, expression: r.expression,
      text: lang === 'en' ? r.en : lang + ':' + r.translations })),
  }]));
  const module = { exports: {} };
  const context = {
    module, exports: module.exports,
    require(name) {
      if (name === './text_sources') return { ROOT: '/fixture', LANGS, readSource: lang => sources[lang] };
      assert(['node:fs', 'node:path', 'node:assert/strict'].includes(name));
      return require(name);
    },
  };
  vm.runInNewContext(code, context, { filename: 'build_aligned_text.js' });
  return module.exports.buildIndex(previous, idRemaps);
}
const key = r => r.kind + '/' + r.source.node + '/' + r.source.slot;
const at = (data, node, slot) => data.entries.find(r => r.source.node === node && r.source.slot === slot);
const originalRows = [row('early', 1, 'Intro'), row('later', 1, 'Order wine'), row('last', 1, 'Goodbye')];
const baseline = build(originalRows);
const inserted = build([originalRows[0], row('early', 2, 'Order wine'), ...originalRows.slice(1)], baseline);
assert.equal(at(inserted, 'later', 1).id, at(baseline, 'later', 1).id,
  'New text copied into an earlier node must not steal a still-live later occurrence ID');
assert.notEqual(at(inserted, 'early', 2).id, at(baseline, 'later', 1).id);
const shifted = build([row('early', 1, 'New preface'), row('early', 2, 'Intro'), ...originalRows.slice(1)], baseline);
assert.equal(at(shifted, 'early', 2).id, at(baseline, 'early', 1).id, 'Inserted text preserves shifted same-node IDs');
const moved = build([originalRows[0], row('replacement', 1, 'Order wine'), originalRows[2]], baseline);
assert.equal(at(moved, 'replacement', 1).id, at(baseline, 'later', 1).id, 'A genuinely moved occurrence can retain its historical ID');
const reworded = build([originalRows[0], row('later', 1, 'Order two wines', 'Order wine'), originalRows[2]], baseline);
assert.equal(at(reworded, 'later', 1).id, at(baseline, 'later', 1).id, 'English-only wording changes retain the matching occurrence ID');
const deleted = build([originalRows[0], originalRows[2]], baseline);
assert(!deleted.entries.some(r => r.id === at(baseline, 'later', 1).id), 'Removed text leaves no stale active entry');
const repeated = build(inserted.entries.map(r => row(r.source.node, r.source.slot, r.en)), inserted);
assert.equal(JSON.stringify(repeated.entries.map(r => [key(r), r.id])), JSON.stringify(inserted.entries.map(r => [key(r), r.id])), 'Rebuilding is stable');
const choices = [row('early', 1, 'Continue', 'Continue', 'choice', 'a'), row('later', 1, 'Continue', 'Continue', 'choice', 'b')];
const choiceBase = build(choices);
const choiceNew = build([row('early', 1, 'New choice', 'New choice', 'choice', 'c'), ...choices.map(r => r.source.node === 'early' ? { ...r, source: { node: 'early', slot: 2 } } : r)], choiceBase);
assert.equal(at(choiceNew, 'early', 2).id, at(choiceBase, 'early', 1).id);
assert.equal(at(choiceNew, 'later', 1).id, at(choiceBase, 'later', 1).id, 'Repeated labels retain separate target/source references');
const duplicateRows = [row('original', 1, 'Same', 'first'), row('original', 2, 'Same', 'second')];
const duplicateBase = build(duplicateRows);
const partlyMoved = build([duplicateRows[0], row('destination', 1, 'Same', 'second')], duplicateBase);
assert.equal(at(partlyMoved, 'original', 1).id, at(duplicateBase, 'original', 1).id);
assert.equal(at(partlyMoved, 'destination', 1).id, at(duplicateBase, 'original', 2).id,
  'One surviving duplicate must not reserve the ID of a distinct moved occurrence');
const wordingBase = build([row('later', 1, 'Order wine', 'original')]);
const copiedAndReworded = build([row('earlier', 1, 'Order wine', 'new copy'), row('later', 1, 'Order two wines', 'original')], wordingBase);
assert.equal(at(copiedAndReworded, 'later', 1).id, at(wordingBase, 'later', 1).id,
  'Original-node translation matches protect concurrently reworded text from an earlier copy');
assert.notEqual(at(copiedAndReworded, 'earlier', 1).id, at(wordingBase, 'later', 1).id);
const splitBefore = build([row('scene', 1, 'Thanks, with a squeeze'), row('scene', 2, 'Thanks, with a kiss')]);
const splitRows = [row('scene', 1, 'Thanks'), row('scene', 2, 'A squeeze'), row('scene', 3, 'Thanks'), row('scene', 4, 'A kiss')];
const remap = { id: at(splitBefore, 'scene', 2).id, from: { node: 'scene', slot: 2 }, to: { node: 'scene', slot: 3 },
  before: Object.fromEntries(LANGS.map(lang => [lang, at(splitBefore, 'scene', 2)[lang]])),
  after: Object.fromEntries(LANGS.map(lang => [lang, lang === 'en' ? 'Thanks' : lang + ':Thanks'])) };
const split = build(splitRows, splitBefore, [remap]);
assert.equal(at(split, 'scene', 3).id, remap.id, 'Explicitly identified speech keeps its ID after splitting and rewording');
assert.notEqual(at(split, 'scene', 2).id, remap.id, 'A new action does not inherit the other branch’s speech ID');
assert.equal(JSON.stringify(build(splitRows, split).entries), JSON.stringify(split.entries), 'Normal rebuild after a one-off remap is stable');
for (const invalid of [
  [{ ...remap, id: 'missing' }], [remap, remap],
  [{ ...remap, from: { node: 'scene', slot: 99 } }],
  [{ ...remap, to: { node: 'scene', slot: 99 } }],
  [{ ...remap, before: { ...remap.before, en: 'stale' } }],
  [{ ...remap, after: { ...remap.after, tw: 'stale' } }],
]) assert.throws(() => build(splitRows, splitBefore, invalid), /remap|remapped/);
assert.throws(() => build(splitRows, split, [remap]), /Stale remap source/, 'Reapplying a one-off migration fails its old-location guard');
const dynamicBefore = build([splitRows[0], { ...row('scene', 2, 'Thanks, with a kiss'), static: false, expression: '"Thanks, with a kiss" + name' }]);
const dynamicRemap = { ...remap, id: at(dynamicBefore, 'scene', 2).id };
assert.throws(() => build(splitRows, dynamicBefore, [dynamicRemap]), /Dynamic calls cannot use literal-only ID remaps/,
  'Literal guards cannot authorize remapping an old dynamic expression');
const dynamicDestination = splitRows.map(r => r.source.slot === 3 ? { ...r, static: false, expression: '"Thanks" + name' } : r);
assert.throws(() => build(dynamicDestination, splitBefore, [remap]), /Dynamic calls cannot use literal-only ID remaps/,
  'Literal guards cannot authorize remapping to a dynamic expression');
console.log('PASS: nine automatic reference-ID scenarios; explicit split ownership and normal rebuild; seven stale/invalid remap guards; both dynamic-remap rejection cases.');
