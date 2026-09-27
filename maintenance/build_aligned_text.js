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

function buildIndex(locations) {
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
  const identities = new Map(locations.map((row) => [key(row), row]));
  assert.equal(identities.size, locations.length, "Repeated source location");
  assert.equal(new Set(locations.map((row) => row.id)).size, locations.length, "Repeated text ID");
  assert.equal(rows.en.length, locations.length, "Complete maintained source inventory");
  const entries = rows.en.map((row, i) => {
    const location = identities.get(key(row));
    assert(location, "Unknown compiled source location: " + key(row));
    assert.equal(row.tag, location.tag, "Compiled choice target differs: " + location.id);
    assert.equal(!row.static, !!location.dynamic, "Compiled text kind differs: " + location.id);
    const id = location.id;
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
  const locations = JSON.parse(fs.readFileSync(path.join(ROOT, "source/locations.json"), "utf8"));
  const data = buildIndex(locations);
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
