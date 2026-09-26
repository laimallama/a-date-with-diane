#!/usr/bin/env node
// Reconcile the translation reference with actual text call sites in all editions.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { ROOT, LANGS, readSource } = require("./text_sources");
const FILE = path.join(ROOT, "maintenance/aligned_text.json");
const INDEX_LANGS = [
  "en",
  "cn",
  "es",
  "fr",
  "tw",
  ...LANGS.filter((lang) => ["de", "ja"].includes(lang)),
];

function buildIndex(previous, idRemaps = []) {
  const files = Object.fromEntries(LANGS.map((lang) => [lang, readSource(lang)]));
  const rows = Object.fromEntries(
    LANGS.map((lang) => [lang, [...files[lang].calls, ...files[lang].variants]]),
  );
  const key = (row) => `${row.kind}/${row.source.node}/${row.source.slot}`;
  for (const lang of LANGS.slice(1)) {
    assert.deepEqual(
      rows[lang].map((r) => [key(r), r.tag, r.static]),
      rows.en.map((r) => [key(r), r.tag, r.static]),
      `Text call structure differs in ${lang}; reconcile the source before rebuilding`,
    );
  }
  const oldRows = previous?.entries || [],
    used = new Set();
  const matches = new Array(rows.en.length);
  const sameKindAndTarget = (old, row) =>
    (!old.kind || old.kind === row.kind) && (!old.tag || old.tag === row.tag);
  const sameTranslations = (old, i) =>
    LANGS.slice(1)
      .filter((lang) => Object.hasOwn(old, lang))
      .every((lang) => old[lang] === rows[lang][i].text);
  // An editor can resolve an ambiguous simultaneous split/reword explicitly.
  // Guard both locations and every language so stale instructions fail closed.
  assert(Array.isArray(idRemaps), "ID remaps must be an array");
  for (const remap of idRemaps) {
    const old = oldRows.find((row) => row.id === remap.id);
    assert(old && !used.has(old.id), "Missing or repeated remapped ID: " + remap.id);
    assert(
      old.source?.node === remap.from?.node && old.source?.slot === remap.from?.slot,
      "Stale remap source: " + remap.id,
    );
    const i = rows.en.findIndex(
      (row) => row.source.node === remap.to?.node && row.source.slot === remap.to?.slot,
    );
    assert(
      i >= 0 && !matches[i] && sameKindAndTarget(old, rows.en[i]),
      "Missing, repeated or incompatible remap destination: " + remap.id,
    );
    assert(
      !old.expressions && LANGS.every((lang) => rows[lang][i].static),
      "Dynamic calls cannot use literal-only ID remaps: " + remap.id,
    );
    for (const lang of LANGS) {
      assert.equal(
        old[lang],
        remap.before?.[lang],
        "Stale remap before text: " + remap.id + "/" + lang,
      );
      assert.equal(
        rows[lang][i].text,
        remap.after?.[lang],
        "Stale remap after text: " + remap.id + "/" + lang,
      );
    }
    matches[i] = old;
    used.add(old.id);
  }
  function matchRemaining(predicate) {
    rows.en.forEach((row, i) => {
      if (matches[i]) return;
      const old = oldRows.find((old) => old.id && !used.has(old.id) && predicate(old, row, i));
      if (old) {
        matches[i] = old;
        used.add(old.id);
      }
    });
  }
  // Claim surviving occurrences one-to-one across the whole inventory before
  // allowing new copies to reuse IDs from other nodes. Translations distinguish
  // repeated English text when its original location has moved or been reworded.
  matchRemaining(
    (old, row, i) =>
      old.source &&
      key(old) === key(row) &&
      old.en === row.text &&
      sameKindAndTarget(old, row) &&
      sameTranslations(old, i),
  );
  matchRemaining(
    (old, row, i) =>
      old.source?.node === row.source.node &&
      old.en === row.text &&
      sameKindAndTarget(old, row) &&
      sameTranslations(old, i),
  );
  matchRemaining(
    (old, row) =>
      old.source && key(old) === key(row) && old.en === row.text && sameKindAndTarget(old, row),
  );
  matchRemaining(
    (old, row) =>
      old.source?.node === row.source.node && old.en === row.text && sameKindAndTarget(old, row),
  );
  matchRemaining(
    (old, row, i) =>
      old.source &&
      key(old) === key(row) &&
      sameKindAndTarget(old, row) &&
      sameTranslations(old, i),
  );
  matchRemaining(
    (old, row, i) =>
      old.source?.node === row.source.node &&
      sameKindAndTarget(old, row) &&
      sameTranslations(old, i),
  );
  matchRemaining(
    (old, row, i) => old.en === row.text && sameKindAndTarget(old, row) && sameTranslations(old, i),
  );
  matchRemaining((old, row) => old.en === row.text && sameKindAndTarget(old, row));
  matchRemaining((old, row, i) => sameKindAndTarget(old, row) && sameTranslations(old, i));
  matchRemaining(
    (old, row) =>
      old.source &&
      key(old) === key(row) &&
      !rows.en.some(
        (current) => current.source.node === row.source.node && current.text === old.en,
      ),
  );
  let nextId =
    Math.max(0, ...oldRows.map((r) => Number((r.id || "").match(/^x(\d+)/)?.[1] || 0))) + 1;
  const entries = rows.en.map((row, i) => {
    const old = matches[i];
    const id = old?.id || `x${String(nextId++).padStart(5, "0")}`;
    used.add(id);
    const entry = { id, kind: row.kind };
    if (row.tag !== undefined) entry.tag = row.tag;
    for (const lang of INDEX_LANGS) entry[lang] = rows[lang][i].text;
    entry.source = row.source;
    if (!row.static)
      entry.expressions = Object.fromEntries(LANGS.map((lang) => [lang, rows[lang][i].expression]));
    return entry;
  });
  const counts = Object.fromEntries(
    ["story", "choice", "variant"].map((kind) => [
      kind,
      entries.filter((e) => e.kind === kind).length,
    ]),
  );
  return {
    purpose:
      "Generated maintenance reference for the current single-language HTML. Each source node and one-based slot identifies a story/choice call or text-variant array item. Dynamic calls include complete expressions as well as their literal prefix. This index does not generate the games or wikis.",
    source_files: Object.fromEntries(
      INDEX_LANGS.map((lang) => [lang, path.relative(ROOT, files[lang].file)]),
    ),
    counts: { total: entries.length, ...counts, entries: entries.length },
    entries,
  };
}

function main() {
  const current = fs.readFileSync(FILE, "utf8");
  const remapArg = process.argv.find((arg) => arg.startsWith("--id-remap="));
  const idRemaps = remapArg
    ? JSON.parse(fs.readFileSync(path.resolve(remapArg.slice("--id-remap=".length)), "utf8"))
    : [];
  const data = buildIndex(JSON.parse(current), idRemaps);
  const output =
    JSON.stringify(data, null, 2).replace(
      /"source": \{\n\s+"node": ("[^"]+"),\n\s+"slot": (\d+)\n\s+\}/g,
      '"source": { "node": $1, "slot": $2 }',
    ) + "\n";
  if (process.argv.includes("--check")) {
    assert.equal(
      current === output,
      true,
      "Stale aligned_text.json; run node maintenance/build_aligned_text.js",
    );
    console.log(
      `Aligned text matches all ${LANGS.length} standalone editions: ${data.entries.length} source locations (read-only).`,
    );
  } else {
    if (current !== output) fs.writeFileSync(FILE, output);
    console.log(
      `Aligned text synchronized: ${data.counts.story} story calls, ${data.counts.choice} choices, ${data.counts.variant} text variants.`,
    );
  }
}
if (require.main === module) main();
module.exports = { buildIndex };
