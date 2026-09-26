#!/usr/bin/env node
// Review coverage and omission boundaries for the newly added locales.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const { loadCatalogs } = require("./catalogs");
const ROOT = path.resolve(__dirname, "../..");
const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
const json = (file) => JSON.parse(read(file));
const hash = (file) => crypto.createHash("sha256").update(read(file)).digest("hex");
const scope = json("maintenance/localization/scope.json");
const editions = json("source/editions.json");
const englishBefore = read("source/text/en.json");
const uiKeys = (value, prefix = "") =>
  Object.entries(value)
    .flatMap(([key, item]) =>
      typeof item === "object" ? uiKeys(item, prefix + key + ".") : [prefix + key],
    )
    .sort();
for (const lang of Object.keys(editions).filter((code) => ["de", "ja"].includes(code))) {
  const { en, alt } = loadCatalogs(lang);
  for (const id of scope.omittedTextIds) {
    assert.equal(en[id], `<p>${scope.placeholders.en}</p>`);
    assert.equal(alt[id], `<p>${scope.placeholders[lang]}</p>`);
  }
  assert.equal(
    read("source/text/en.json"),
    englishBefore,
    "Scoped loading changed canonical English",
  );
  assert.deepEqual(
    uiKeys(json(`source/ui/${lang}.json`)),
    uiKeys(json("source/ui/fr.json")),
    "UI coverage",
  );
  assert.deepEqual(
    uiKeys(json(`source/visual-ui/${lang}.json`)),
    uiKeys(json("source/visual-ui/en.json")),
    "Visual UI coverage",
  );
  const review = json(`maintenance/localization/${lang}/surface-reviews.json`);
  assert.equal(review.records.length, 6, "Review each non-story surface");
  for (const record of review.records) {
    assert(record.meaning && record.naturalness, "Incomplete surface review: " + record.target);
    const sourceHash = record.sourceKey
      ? crypto
          .createHash("sha256")
          .update(JSON.stringify(json(record.source)[record.sourceKey]))
          .digest("hex")
      : hash(record.source);
    assert.equal(sourceHash, record.sourceHash, "Surface source changed: " + record.source);
    assert.equal(
      hash(record.target),
      record.targetHash,
      "Surface target changed: " + record.target,
    );
  }
  const wiki = read(`source/wiki/${lang}.html`);
  assert.equal(wiki.split(scope.placeholders[lang]).length - 1, 3, "Wiki omission count");
  const pages = (html) => [...html.matchAll(/id="page-([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(
    pages(wiki),
    pages(read("source/wiki/en.html")),
    "Wiki article/navigation coverage",
  );
  const known = new Set(pages(wiki));
  for (const match of wiki.matchAll(/showPage\('([^']+)'\)/g))
    assert(known.has(match[1]), "Broken wiki navigation");
  console.log(
    `Verified ${lang}: reviewed catalogs and six companion surfaces; six game omissions and three wiki omissions; complete wiki navigation.`,
  );
}
