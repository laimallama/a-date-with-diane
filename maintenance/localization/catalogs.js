// New-edition content scope is applied during compilation, never at render time.
// The canonical English and existing translation catalogs remain untouched.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const ROOT = path.resolve(__dirname, "../..");
const read = (file) => JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
const hash = (text) => crypto.createHash("sha256").update(text).digest("hex");
function leaves(value, prefix = "", result = {}) {
  for (const [key, item] of Object.entries(value)) {
    const id = prefix ? prefix + "." + key : key;
    if (typeof item === "string") result[id] = item;
    else leaves(item, id, result);
  }
  return result;
}
function loadCatalogs(lang) {
  const en = read("source/text/en.json");
  const alt = read(`source/text/${lang}.json`);
  if (lang !== "de" && lang !== "ja") return { en, alt };
  const scope = read("maintenance/localization/scope.json");
  assert(scope.resolved && !scope.heldTextIds.length, "Resolve new-edition content scope first");
  const original = leaves(en),
    translated = leaves(alt);
  assert.deepEqual(
    Object.keys(translated).sort(),
    Object.keys(original).sort(),
    `Incomplete ${lang} catalog: partial translations cannot be built or exported`,
  );
  const omissions = new Set(scope.omittedTextIds);
  const reviews = read(`maintenance/localization/${lang}/reviews.json`);
  for (const [id, text] of Object.entries(original)) {
    if (!text.trim()) {
      assert.equal(translated[id], text, `Intentional empty output changed: ${id}`);
      continue;
    }
    if (omissions.has(id)) {
      assert.equal(
        alt[id],
        "<p>" + scope.placeholders[lang] + "</p>",
        `Missing ${lang} placeholder at ${id}`,
      );
      en[id] = "<p>" + scope.placeholders.en + "</p>";
      continue;
    }
    const review = reviews[id];
    assert(review?.meaning && review?.naturalness, `Unreviewed ${lang} translation: ${id}`);
    assert.equal(review.source, hash(text), `Source changed after ${lang} review: ${id}`);
    assert.equal(
      review.target,
      hash(translated[id]),
      `Translation changed after ${lang} review: ${id}`,
    );
  }
  return { en, alt };
}
module.exports = { loadCatalogs };
