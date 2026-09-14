#!/usr/bin/env node
// Choice-driven discovery, not a proof of exhaustive state or browser coverage.
// Does not mutate project files; --output writes an explicitly requested evidence file.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { readSource, tokenize } = require('./text_sources');

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
      const all = { ...attrs };
      if (this.className) all.class = this.className;
      return `<${tag}${Object.entries(all).map(([k, v]) => ` ${k}="${v}"`).join('')}>${this.innerHTML}</${tag}>`;
    },
  };
}

function instrument(source) {
  const tokens = tokenize(source.script), conditions = [], edits = [];
  const offset = source.html.slice(0, source.html.indexOf(source.script)).split('\n').length - 1;
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].raw !== 'if' || tokens[i + 1]?.raw !== '(') continue;
    const open = tokens[i + 1], close = tokens[open.mate];
    const fn = source.functions.filter(f => f.start <= tokens[i].start && f.end > close.end).at(-1);
    const id = conditions.length;
    conditions.push({ id, node: fn?.name || '<top-level>', expression: source.script.slice(open.end, close.start),
      line: offset + source.script.slice(0, open.start).split('\n').length });
    edits.push({ at: open.end, text: `__auditCondition(${id}, (` }, { at: close.start, text: '))' });
  }
  let script = source.script;
  for (const e of edits.sort((a, b) => b.at - a.at)) script = script.slice(0, e.at) + e.text + script.slice(e.at);
  return { script, conditions };
}

const transformedSources = new WeakMap();
function loadRuntime(source, observer = () => {}) {
  const nodes = new Map([['box', element()]]), storage = new Map();
  const document = {
    readyState: 'loading', body: element('body'), documentElement: element('html'), activeElement: null,
    getElementById(id) { if (!nodes.has(id)) nodes.set(id, element()); return nodes.get(id); },
    createElement: element, querySelector() { return null; }, querySelectorAll() { return []; }, addEventListener() {},
  };
  const c = {
    document, console, setTimeout() { return 0; }, clearTimeout() {}, setInterval() { return 0; }, clearInterval() {},
    addEventListener() {}, scrollTo() {}, matchMedia() { return { matches: true }; },
    sessionStorage: { getItem(k) { return storage.get(k) ?? null; }, setItem(k, v) { storage.set(k, String(v)); }, removeItem(k) { storage.delete(k); } },
    __auditCondition(id, value) { observer(id, !!value); return value; },
  };
  c.window = c;
  vm.createContext(c);
  let transformed = transformedSources.get(source);
  if (!transformed) { transformed = instrument(source); transformedSources.set(source, transformed); }
  vm.runInContext(transformed.script, c, { filename: source.file });
  return { context: c, box: nodes.get('box'), conditions: transformed.conditions,
    gallery: vm.runInContext('GALLERY_DATA', c) };
}

function choices(box) {
  return [...box.innerHTML.matchAll(/<button class=['"]choice['"] onclick=(?:"go\('([^']+)'\)"|'go\("([^"]+)"\)')>([\s\S]*?)<\/button>/g)]
    .map(m => ({ tag: m[1] || m[2], text: m[3].replace(/<[^>]+>/g, '').trim() }));
}
function leaves(gallery) {
  return ['endings', 'hiddenScenes'].flatMap(kind => gallery[kind].flatMap(x => (x.variants || [x]).map(v => ({ ...v, kind }))));
}
function plain(value) { return JSON.parse(JSON.stringify(value)); }
function hash(value) { return crypto.createHash('sha256').update(value).digest('hex'); }

function audit(options = {}) {
  const maxStates = options.maxStates ?? 20000, maxPerNode = options.maxPerNode ?? 32;
  const source = readSource(options.lang || 'en', !!options.bilingual), startTime = Date.now();
  let witness = { parent: null, tag: 'start' };
  const outcomeWitnesses = new Map();
  const g = loadRuntime(source, (id, value) => {
    const key = `${id}:${value}`;
    if (!outcomeWitnesses.has(key)) outcomeWitnesses.set(key, { ...witness });
  });
  const c = g.context, initial = plain(c.snapshotGame().state);
  const records = [], byKey = new Map(), counts = new Map(), nodeWitnesses = new Map(), edgeWitnesses = new Map();
  const galleryNodes = new Set(), galleryEdges = new Set(), errors = [], findings = new Map(), ranges = {};
  const prunedByNode = {}, missingSnapshotVars = new Map();
  const tracked = new Set(c.gameStateVars);
  const ignoredGlobals = new Set(['guideIndex', 'guideActive', 'guideOn', 'climaxIndex', 'climaxSkipUsed', 'choiceKeyPending', 'darkMode',
    'enterHoldTimer', 'enterFastTimer', 'backHoldTimer', 'backFastTimer', 'heldActionKey']);
  const scalarGlobals = () => Object.fromEntries(Object.keys(c).filter(k => ['number', 'boolean', 'string'].includes(typeof c[k]) && !tracked.has(k) && !ignoredGlobals.has(k)).map(k => [k, c[k]]));
  const initialExtra = scalarGlobals();

  function route(ref) {
    const out = [];
    for (let id = ref; id !== null && id !== undefined; id = records[id].parent) out.push(records[id].tag);
    return out.reverse();
  }
  function witnessRoute(w) { return [...route(w.parent), w.tag]; }
  function note(key, data) { if (!findings.has(key)) findings.set(key, { ...data, witness: { ...witness } }); }
  function restore(state, extra = initialExtra) {
    for (const k of c.gameStateVars) c[k] = state[k];
    for (const k of Object.keys(scalarGlobals())) if (!(k in extra)) delete c[k];
    Object.assign(c, extra);
    c.gameHistory = []; c.guideHistory = []; c.guideTags = null; c.guideActive = false; c.guideOn = false; c.guideIndex = 0;
    g.box.innerHTML = '';
  }
  function capture(parent, tag, isGallery = false, force = false) {
    const state = plain(c.snapshotGame().state), extra = scalarGlobals(), available = choices(g.box);
    const from = parent === null ? null : records[parent].tag;
    if (from) {
      const edge = `${from}->${tag}`;
      if (!edgeWitnesses.has(edge)) edgeWitnesses.set(edge, { ...witness });
      if (isGallery) galleryEdges.add(edge);
    }
    if (isGallery) galleryNodes.add(tag);
    if (!nodeWitnesses.has(tag)) nodeWitnesses.set(tag, { ...witness });
    for (const [key, value] of Object.entries(state)) {
      if (typeof value === 'number') {
        if (!Number.isFinite(value)) note(`nonfinite:${key}:${tag}`, { type: 'nonfinite-state', node: tag, variable: key, value: String(value) });
        if (!ranges[key]) ranges[key] = { min: value, max: value };
        ranges[key].min = Math.min(ranges[key].min, value); ranges[key].max = Math.max(ranges[key].max, value);
      }
    }
    for (const [key, value] of Object.entries(extra)) if (value !== initialExtra[key] && !missingSnapshotVars.has(key)) {
      missingSnapshotVars.set(key, { variable: key, value, witness: { ...witness } });
    }
    for (const key of ['pounds', 'points', 'luckshots', 'proc', 'blad']) if (state[key] < 0) note(`negative:${key}:${tag}`, { type: 'negative-state', node: tag, variable: key, value: state[key] });
    if (state.luckshots > 3) note(`luckshots:${tag}`, { type: 'luckshot-overflow', node: tag, value: state.luckshots });
    const days = ['tuesday', 'thursday', 'saturday'].filter(k => state[k]);
    if (days.length > 1) note(`days:${tag}`, { type: 'multiple-days', node: tag, value: days });
    const duplicate = available.filter((v, i) => available.findIndex(x => x.tag === v.tag && x.text === v.text) !== i);
    if (duplicate.length) note(`duplicate:${tag}`, { type: 'duplicate-visible-choice', node: tag, choices: duplicate });
    const key = hash(JSON.stringify([state, extra]));
    if (byKey.has(key)) return byKey.get(key);
    if (!force && ((counts.get(tag) || 0) >= maxPerNode || records.length >= maxStates)) {
      prunedByNode[tag] = (prunedByNode[tag] || 0) + 1;
      return null;
    }
    const id = records.length;
    records.push({ parent, tag, state, extra, available }); byKey.set(key, id); counts.set(tag, (counts.get(tag) || 0) + 1);
    return id;
  }
  function step(parent, tag, isGallery = false, force = false) {
    const prev = parent === null ? null : records[parent];
    restore(prev ? prev.state : initial, prev ? prev.extra : initialExtra);
    witness = { parent, tag };
    if (prev && !prev.available.some(x => x.tag === tag)) throw Error(`Unreachable requested choice ${prev.tag} -> ${tag}`);
    try { c.go(tag); return capture(parent, tag, isGallery, force); }
    catch (error) { errors.push({ node: tag, message: error.stack, witness: { ...witness } }); return null; }
  }
  const root = step(null, 'start', true, true);
  const book = options.seedGallery === false ? [] : leaves(g.gallery);
  // Every seed is replayed through actual currently rendered choices, never direct state injection.
  for (const leaf of book) {
    let parent = root;
    for (const tag of leaf.tags) {
      if (parent === null) break;
      parent = step(parent, tag, true, true);
    }
  }
  for (const supplied of options.seedPaths || []) {
    if (!Array.isArray(supplied) || !supplied.every(tag => typeof tag === 'string')) throw Error('Seed paths must be arrays of choice tags');
    const tags = supplied[0] === 'start' ? supplied.slice(1) : supplied;
    let parent = root;
    for (const tag of tags) {
      if (parent === null) break;
      parent = step(parent, tag, false, true);
    }
  }
  const seedStates = records.length;
  let expanded = 0;
  for (; expanded < records.length && expanded < maxStates; expanded++) {
    const rec = records[expanded];
    for (const choice of rec.available) step(expanded, choice.tag);
    if (options.onProgress && expanded % 1000 === 0) options.onProgress({ expanded, retained: records.length, nodes: nodeWitnesses.size });
  }
  const sourceNodes = new Set(source.calls.map(x => x.source.node)), targetNodes = new Set(source.calls.filter(x => x.kind === 'choice').map(x => x.tag));
  const directEdges = [...new Set(source.calls.filter(x => x.kind === 'choice').map(x => `${x.source.node}->${x.tag}`))];
  const conditionResults = g.conditions.filter(x => sourceNodes.has(x.node) || /^(?:digestionTick|pregameCatchupTick|afterpee|adjpoints|spendLuckshot|capEndgameLuckshots)$/.test(x.node)).map(x => ({
    ...x, outcomes: [false, true].filter(v => outcomeWitnesses.has(`${x.id}:${v}`)),
  }));
  const report = {
    formatVersion: 1, source: source.file, sourceSha256: hash(source.html), generatedAt: new Date().toISOString(),
    method: 'Actual choice-driven navigation; all Gallery seeds plus breadth-first alternative exploration; exact full snapshot/scalar-global fingerprints retained under explicit budgets.',
    limits: { maxStates, maxPerNode, seedStatesExemptFromBudget: true,
      note: 'This is bounded discovery, not state equivalence abstraction or exhaustive coverage. Deduplication excludes history/guide/UI state and untracked non-scalar globals; history and browser semantics require separate verification. If outcomes do not prove expression subcondition coverage. Direct source edges may originate in helper functions rather than currentTag.' },
    summary: { sourceFunctions: source.functions.length, textFunctions: sourceNodes.size, sourceChoiceCalls: source.calls.filter(x => x.kind === 'choice').length,
      staticChoiceTargets: targetNodes.size, staticDirectEdges: directEdges.length, galleryRoutes: book.length, additionalSeedPaths: (options.seedPaths || []).length, galleryNodes: galleryNodes.size,
      galleryEdges: galleryEdges.size, retainedExactStates: records.length, seedStates, expandedStates: expanded,
      observedNodes: nodeWitnesses.size, observedEdges: edgeWitnesses.size,
      newNodesBeyondGallery: [...nodeWitnesses.keys()].filter(k => !galleryNodes.has(k)).length,
      newEdgesBeyondGallery: [...edgeWitnesses.keys()].filter(k => !galleryEdges.has(k)).length,
      conditionSites: conditionResults.length, conditionSitesObserved: conditionResults.filter(x => x.outcomes.length).length,
      conditionSitesBothOutcomes: conditionResults.filter(x => x.outcomes.length === 2).length,
      prunedCandidateStates: Object.values(prunedByNode).reduce((a, b) => a + b, 0),
      runtimeErrors: errors.length, findingKindsAtNodes: findings.size, elapsedSeconds: (Date.now() - startTime) / 1000 },
    ranges, statesPerNode: Object.fromEntries([...counts].sort()), prunedByNode,
    unseenStaticTargets: [...targetNodes].filter(k => !nodeWitnesses.has(k)),
    unobservedDirectEdges: directEdges.filter(k => !edgeWitnesses.has(k)),
    conditions: conditionResults.map(x => ({ ...x,
      witnesses: Object.fromEntries(x.outcomes.map(v => [String(v), witnessRoute(outcomeWitnesses.get(`${x.id}:${v}`))])),
    })),
    findings: [...findings.values()].map(({ witness: w, ...rest }) => ({ ...rest, path: witnessRoute(w) })),
    errors: errors.map(({ witness: w, ...rest }) => ({ ...rest, path: witnessRoute(w) })),
    mutableScalarsOutsideSnapshot: [...missingSnapshotVars.values()].map(({ witness: w, ...rest }) => ({ ...rest, path: witnessRoute(w) })),
    nodeWitnesses: Object.fromEntries([...nodeWitnesses].map(([key, w]) => [key, witnessRoute(w)])),
    edgeWitnesses: Object.fromEntries([...edgeWitnesses].map(([key, w]) => [key, witnessRoute(w)])),
    sourceChoiceSites: source.calls.filter(x => x.kind === 'choice').map(x => ({ ...x.source, tag: x.tag, text: x.text })),
  };
  return report;
}

module.exports = { audit, loadRuntime, choices, leaves };
if (require.main === module) {
  const args = process.argv.slice(2), options = {};
  let output;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--output') output = path.resolve(args[++i]);
    else if (arg === '--max-states') options.maxStates = Number(args[++i]);
    else if (arg === '--max-per-node') options.maxPerNode = Number(args[++i]);
    else if (arg === '--lang') options.lang = args[++i];
    else if (arg === '--seed-paths') options.seedPaths = JSON.parse(fs.readFileSync(path.resolve(args[++i]), 'utf8'));
    else if (arg === '--bilingual') options.bilingual = true;
    else if (arg === '--no-gallery-seeds') options.seedGallery = false;
    else if (arg === '--progress') options.onProgress = x => process.stderr.write(JSON.stringify(x) + '\n');
    else throw Error('Unknown argument: ' + arg);
  }
  if (options.seedPaths !== undefined && !Array.isArray(options.seedPaths)) throw Error('Seed paths file must contain an array of paths');
  for (const name of ['maxStates', 'maxPerNode']) if (options[name] !== undefined && (!Number.isInteger(options[name]) || options[name] < 1)) throw Error(name + ' must be a positive integer');
  const result = audit(options);
  if (output) fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result.summary, null, 2));
  if (output) console.log('Evidence: ' + output);
  if (result.errors.length) process.exitCode = 1;
}
