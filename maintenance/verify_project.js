#!/usr/bin/env node
// Read-only regression checks for the maintained playable editions.
// The DOM stub tests runtime output/state, not browser layout or animation timing.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const ROOT = path.resolve(__dirname, '..');
const visual = fs.existsSync(path.join(ROOT, 'visual/scene-map.js'));
const langs = visual ? ['en'] : ['en', 'cn', 'tw', 'es', 'fr'];
const gallerySnapshot = JSON.parse(fs.readFileSync(path.join(ROOT, 'maintenance/gallery_data.json'), 'utf8'));

function element(tag = 'div') {
  const attrs = {}, classes = new Set();
  return {
    tagName: tag.toUpperCase(), innerHTML: '', style: {}, className: '',
    classList: {
      add(x) { classes.add(x); }, remove(x) { classes.delete(x); },
      contains(x) { return classes.has(x); },
      toggle(x, force) { const on = force === undefined ? !classes.has(x) : force; if (on) classes.add(x); else classes.delete(x); return on; },
    },
    setAttribute(k, v) { attrs[k] = String(v); },
    getAttribute(k) { return attrs[k] ?? null; },
    appendChild(child) { this.innerHTML += child.outerHTML; },
    querySelector() { return null; }, querySelectorAll() { return []; },
    addEventListener() {}, blur() {},
    get outerHTML() {
      const attributes = { ...attrs };
      if (this.className) attributes.class = this.className;
      return `<${tag}${Object.entries(attributes).map(([k,v]) => ` ${k}="${v}"`).join('')}>${this.innerHTML}</${tag}>`;
    },
  };
}
function loadGame(file) {
  const html = fs.readFileSync(file, 'utf8');
  const blocks = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  for (const [, attrs, script] of blocks) if (!/application\/(?:ld\+)?json/.test(attrs)) new vm.Script(script, { filename: file });
  assert.match(html, /^<!DOCTYPE html>/i, 'Playable document needs standards mode');
  assert.match(html, /<html lang="[^"]+">/);
  assert.match(html, /<title>[^<]+<\/title>/);
  const nodes = new Map([['box', element()]]), storage = new Map();
  const document = {
    readyState: 'loading', body: element('body'), documentElement: element('html'), activeElement: null,
    getElementById(id) { if (!nodes.has(id)) nodes.set(id, element()); return nodes.get(id); },
    createElement: element, querySelector() { return null; }, querySelectorAll() { return []; }, addEventListener() {},
  };
  const context = {
    document, console, setTimeout() { return 0; }, clearTimeout() {}, setInterval() { return 0; }, clearInterval() {},
    addEventListener() {}, scrollTo() {}, matchMedia() { return { matches: true }; },
    sessionStorage: { getItem(k) { return storage.get(k) ?? null; }, setItem(k,v) { storage.set(k, String(v)); }, removeItem(k) { storage.delete(k); } },
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(blocks[0][2], context, { filename: file });
  context.go('start');
  assert.equal(context.gameHistory.length, 0, 'Title must not offer Back');
  const gallery = vm.runInContext('GALLERY_DATA', context);
  return { context, box: nodes.get('box'), gallery };
}
function leaves(gallery) {
  return ['endings','hiddenScenes'].flatMap(kind => gallery[kind].flatMap(x => (x.variants || [x]).map(v => ({ ...v, kind }))));
}
function choiceTags(box) {
  return [...box.innerHTML.matchAll(/<button class=['"]choice['"] onclick=(?:"go\('([^']+)'\)"|'go\("([^"]+)"\)')>/g)].map(m => m[1] || m[2]);
}
function snapshot(g) { return JSON.stringify(g.context.snapshotGame()); }
function guide(g) { return JSON.stringify([g.context.guideIndex, g.context.guideActive]); }
function plain(x) { return JSON.parse(JSON.stringify(x)); }
let totalSteps = 0, totalRoutes = 0;
const referenceStates = new Map();
for (const lang of langs) {
  for (const bilingual of (lang === 'en' || visual ? [false] : [false, true])) {
    const file = path.join(ROOT, `outputs/${lang}/dianedate_${lang}${bilingual ? '_bilingual' : ''}.html`);
    const initial = loadGame(file), book = leaves(initial.gallery);
    assert.equal(book.filter(x => x.kind === 'endings').length, 15);
    assert.equal(book.filter(x => x.kind === 'hiddenScenes').length, 30);
    assert(initial.context.gameStateVars.includes('despLineIndex'), 'Text counter must be restored');
    if (!bilingual) assert.deepEqual(plain(initial.gallery), gallerySnapshot[lang], 'Embedded Gallery must match JSON');
    let steps = 0;
    for (const leaf of book) {
      const g = loadGame(file), c = g.context;
      c.guideTags = leaf.tags; c.guideIndex = 0; c.guideActive = true; c.guideOn = true;
      const fingerprint = crypto.createHash('sha256');
      for (const tag of leaf.tags) {
        const where = `${path.basename(file)} / ${leaf.id} / ${tag}`;
        assert(choiceTags(g.box).includes(tag), 'Unavailable choice: ' + where);
        const before = snapshot(g), guideBefore = guide(g);
        c.go(tag);
        const after = snapshot(g), guideAfter = guide(g);
        c.goback();
        assert.equal(snapshot(g), before, 'Back mismatch: ' + where);
        assert.equal(guide(g), guideBefore, 'Guide Back mismatch: ' + where);
        c.go(tag);
        assert.equal(snapshot(g), after, 'Forward replay mismatch: ' + where);
        assert.equal(guide(g), guideAfter, 'Guide replay mismatch: ' + where);
        const state = c.snapshotGame().state;
        fingerprint.update(JSON.stringify(Object.fromEntries(Object.keys(state).sort().map(k => [k,state[k]]))));
        steps++;
      }
      const digest = fingerprint.digest('hex');
      if (lang === 'en') referenceStates.set(leaf.id, digest);
      else assert.equal(digest, referenceStates.get(leaf.id), `State differs from English: ${path.basename(file)} / ${leaf.id}`);
      // Check the real Skip loop against ordinary forward navigation.
      const cut = leaf.kind === 'endings' ? leaf.climaxIndex : leaf.baseLength;
      assert(Number.isInteger(cut) && cut >= 0 && cut <= leaf.tags.length, 'Invalid Gallery start');
      const skipped = loadGame(file), walked = loadGame(file);
      Object.assign(skipped.context, { guideTags: leaf.tags, guideIndex: 0, guideActive: true, guideOn: true, climaxIndex: cut, climaxSkipUsed: false });
      Object.assign(walked.context, { guideTags: leaf.tags, guideIndex: 0, guideActive: true, guideOn: true, climaxIndex: cut, climaxSkipUsed: false });
      skipped.context.skipToClimax();
      for (const tag of leaf.tags.slice(0,cut)) walked.context.go(tag);
      assert.deepEqual(plain(skipped.context.snapshotGame().state), plain(walked.context.snapshotGame().state), 'Skip state mismatch');
      assert.equal(skipped.context.gameHistory.length, walked.context.gameHistory.length, 'Skip must record every history step');
      skipped.context.goback(); walked.context.goback();
      assert.deepEqual(plain(skipped.context.snapshotGame().state), plain(walked.context.snapshotGame().state), 'Back after Skip state mismatch');
      // Skip is intentionally single-use; its toolbar button may differ.
      assert.equal(skipped.box.innerHTML.replace(/<div class='nav-row'>[\s\S]*$/, ''), walked.box.innerHTML.replace(/<div class='nav-row'>[\s\S]*$/, ''), 'Back after Skip story mismatch');
    }
    totalSteps += steps; totalRoutes += book.length;
    console.log(`OK ${path.relative(ROOT,file)}: ${book.length} routes, ${steps} Back/replay checks, Skip and state parity`);
  }
}
if (visual) {
  const c = {}; vm.createContext(c);
  vm.runInContext(fs.readFileSync(path.join(ROOT,'visual/scene-map.js'),'utf8'),c);
  const expected = { start:'title', start2:'street', traintalk:'restaurant', traintalka:'riverside', luckytrip3:'bridge', luckytrip3a:'bridge', luckytrip31:'home', luckytrip31a:'home', luckytrip19:'night', luckytrip19a:'night', searchdiane:'night', goleft:'night', buywaterfoyer:'foyer', buywaterpav:'pavilion' };
  for (const [tag,location] of Object.entries(expected)) assert.equal(c.ADWDSceneMap.locationFor(tag).id,location,tag);
  execFileSync(process.execPath,[path.join(ROOT,'maintenance/build_visual_edition.js'),'--check'],{stdio:'inherit'});
}
execFileSync(process.execPath,[path.join(ROOT,'maintenance/build_gallery_data.js'),'--check'],{stdio:'inherit'});
console.log(`PASS: ${totalRoutes} route/edition combinations; ${totalSteps} Back/replay checks. No files written.`);
