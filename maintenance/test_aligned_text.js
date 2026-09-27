#!/usr/bin/env node
// Test reference-ID ownership with tiny source inventories, without editing games.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const LANGS = ["en", "cn", "tw", "es", "fr"];
const code = fs.readFileSync(
  process.env.ADWD_INDEX_TEST_BUILDER || path.join(__dirname, "build_aligned_text.js"),
  "utf8",
);
function row(node, slot, en, translations = en, kind = "story", tag) {
  return { source: { node, slot }, en, translations, kind, tag };
}
function build(rows, locations) {
  const sources = Object.fromEntries(
    LANGS.map((lang) => [
      lang,
      {
        file: "/fixture/outputs/" + lang + "/game.html",
        variants: [],
        calls: rows.map((r) => ({
          kind: r.kind,
          source: r.source,
          tag: r.tag,
          static: r.static !== false,
          expression: r.expression,
          text: lang === "en" ? r.en : lang + ":" + r.translations,
        })),
      },
    ]),
  );
  const module = { exports: {} };
  const context = {
    module,
    exports: module.exports,
    require(name) {
      if (name === "./text_sources")
        return { ROOT: "/fixture", LANGS, readSource: (lang) => sources[lang] };
      assert(["node:fs", "node:path", "node:assert/strict"].includes(name));
      return require(name);
    },
  };
  vm.runInNewContext(code, context, { filename: "build_aligned_text.js" });
  return module.exports.buildIndex(locations);
}
const sourceRows = [
  row("original", 1, "Same words", "first"),
  row("moved", 1, "Same words", "second"),
  row("moved", 2, "Continue", "continue", "choice", "next"),
];
const locations = sourceRows.map((r, i) => ({
  id: "x" + String(i + 1).padStart(5, "0"),
  kind: r.kind,
  source: r.source,
  ...(r.tag ? { tag: r.tag } : {}),
}));
const result = build(sourceRows, locations);
assert.equal(result.entries[0].id, "x00001");
assert.equal(result.entries[1].id, "x00002", "Identical text keeps distinct source identities");
const reworded = sourceRows.map((r) => ({
  ...r,
  en: "New wording",
  translations: "New translation",
}));
assert.equal(build(reworded, locations).entries[1].id, "x00002", "Wording does not control IDs");
assert.throws(() => build(sourceRows, locations.slice(1)), /Complete maintained/);
assert.throws(
  () =>
    build(
      sourceRows,
      locations.map((r) => ({ ...r, id: "x00001" })),
    ),
  /Repeated text ID/,
);
assert.throws(
  () =>
    build(
      sourceRows,
      locations.map((r) => ({ ...r, source: locations[0].source, kind: "story" })),
    ),
  /Repeated source location/,
);
assert.throws(
  () =>
    build(
      sourceRows,
      locations.map((r) => (r.tag ? { ...r, tag: "wrong" } : r)),
    ),
  /choice target differs/,
);
assert.throws(
  () =>
    build(
      sourceRows,
      locations.map((r) => ({ ...r, dynamic: true })),
    ),
  /text kind differs/,
);
assert.throws(
  () =>
    build(
      sourceRows,
      locations.map((r) => ({ ...r, source: { ...r.source, slot: 99 } })),
    ),
  /Repeated source location|Unknown compiled/,
);
console.log(
  "PASS: canonical ID ownership across duplicates and rewording; incomplete, duplicate, moved, dynamic and choice-target mismatch guards.",
);
