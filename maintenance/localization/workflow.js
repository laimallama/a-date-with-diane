// Small authoring helper. Partial catalogs are never release-ready by implication.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const ROOT = path.resolve(__dirname, "../..");
const json = (file) => JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");
const scopes = json("maintenance/localization/scope.json");
const stages = ["meaning", "naturalness"];
function flatten(value, prefix = "", result = {}) {
  for (const [key, item] of Object.entries(value)) {
    const id = prefix ? prefix + "." + key : key;
    if (typeof item === "string") result[id] = item;
    else flatten(item, id, result);
  }
  return result;
}
function contextMap() {
  const contexts = {};
  const source = fs.readFileSync(path.join(ROOT, "source/story.js"), "utf8");
  traverse(parse(source), {
    MemberExpression(p) {
      if (p.node.object.name !== "TEXT") return;
      const id = p.node.property.name;
      const node = p.getFunctionParent()?.node.id?.name || "global";
      const conditions = [];
      for (let q = p; q.parentPath; q = q.parentPath) {
        if (q.parentPath.isIfStatement()) {
          const test = generate(q.parentPath.node.test, { compact: true }).code;
          if (q.key === "consequent") conditions.unshift(test);
          if (q.key === "alternate") conditions.unshift("!(" + test + ")");
        }
      }
      (contexts[id] ||= []).push({ node, conditions });
    },
  });
  return contexts;
}
function main() {
  const [command, lang, arg] = process.argv.slice(2);
  assert(["de", "ja"].includes(lang), "Choose de or ja");
  const original = flatten(json("source/text/en.json"));
  const file = `source/text/${lang}.json`;
  const translated = fs.existsSync(path.join(ROOT, file)) ? flatten(json(file)) : {};
  const reviewFile = path.join(__dirname, lang, "reviews.json");
  const reviews = fs.existsSync(reviewFile) ? JSON.parse(fs.readFileSync(reviewFile, "utf8")) : {};
  const held = new Set(scopes.heldTextIds);
  const omitted = new Set(scopes.omittedTextIds || []);
  const empty = new Set(Object.keys(original).filter((id) => !original[id].trim()));
  const signature = (id) => ({ source: hash(original[id]), target: hash(translated[id]) });
  const reviewed = (id, stage) => {
    if (!Object.hasOwn(translated, id)) return false;
    const sig = signature(id),
      record = reviews[id];
    return record?.source === sig.source && record?.target === sig.target && record[stage];
  };
  const tags = (s) => s.match(/<[^>]+>/g) || [];
  const placeholders = (s) => (s.match(/\{[a-zA-Z][\w]*\}/g) || []).sort();
  for (const [id, value] of Object.entries(translated)) {
    assert(Object.hasOwn(original, id), "Unknown source ID: " + id);
    assert(!held.has(id), "Unresolved scope item entered catalog: " + id);
    if (empty.has(id)) {
      assert.equal(value, original[id], "Intentional empty output changed: " + id);
      continue;
    }
    assert(value.trim(), "Empty translation: " + id);
    if (omitted.has(id)) {
      assert.equal(
        value,
        "<p>" + scopes.placeholders[lang] + "</p>",
        "Incorrect placeholder: " + id,
      );
      continue;
    }
    assert.deepEqual(tags(value), tags(original[id]), "Markup differs: " + id);
    assert.deepEqual(placeholders(value), placeholders(original[id]), "Placeholders differ: " + id);
  }
  if (command === "packet") {
    const limit = Number(arg || 60);
    assert(Number.isInteger(limit) && limit > 0 && limit <= 200);
    const ctx = contextMap();
    const items = Object.entries(original)
      .filter(([id]) => !held.has(id) && !omitted.has(id) && !Object.hasOwn(translated, id))
      .slice(0, limit)
      .map(([id, en]) => ({ id, context: ctx[id] || [], en }));
    for (const item of items)
      console.log(
        item.id +
          " [" +
          item.context
            .map((c) => c.node + (c.conditions.length ? " if " + c.conditions.join(" && ") : ""))
            .join("; ") +
          "] " +
          item.en,
      );
  } else if (command === "read") {
    assert(stages.includes(arg), "Choose meaning or naturalness");
    const items = Object.keys(translated)
      .filter((id) => !omitted.has(id) && !empty.has(id) && !reviewed(id, arg))
      .map((id) => ({
        id,
        ...(arg === "meaning" ? { en: original[id] } : {}),
        [lang]: translated[id],
      }));
    for (const item of items)
      console.log(item.id + (item.en ? " EN " + item.en + "\n" : " ") + item[lang]);
  } else if (command === "review") {
    assert(stages.includes(arg), "Choose meaning or naturalness");
    let count = 0;
    for (const id of Object.keys(translated)) {
      if (omitted.has(id) || empty.has(id)) continue;
      if (reviewed(id, arg)) continue;
      if (arg === "naturalness") assert(reviewed(id, "meaning"), "Meaning review first: " + id);
      const sig = signature(id),
        old = reviews[id];
      reviews[id] = {
        ...(old?.source === sig.source && old?.target === sig.target ? old : {}),
        ...sig,
        [arg]: true,
      };
      count++;
    }
    fs.mkdirSync(path.dirname(reviewFile), { recursive: true });
    fs.writeFileSync(reviewFile, JSON.stringify(reviews, null, 2) + "\n");
    console.log(`Recorded ${arg} review for ${count} ${lang} entries.`);
  } else {
    assert(["check", "status"].includes(command), "Unknown command");
    console.log(
      JSON.stringify(
        {
          locale: lang,
          sourceEntries: Object.keys(original).length,
          held: held.size,
          translated: Object.keys(translated).filter((id) => !omitted.has(id) && !empty.has(id))
            .length,
          intentionalEmptyOutputs: Object.keys(translated).filter((id) => empty.has(id)).length,
          placeholders: Object.keys(translated).filter((id) => omitted.has(id)).length,
          meaningReviewed: Object.keys(translated).filter((id) => reviewed(id, "meaning")).length,
          naturalnessReviewed: Object.keys(translated).filter((id) => reviewed(id, "naturalness"))
            .length,
          scopeResolved: scopes.resolved,
          catalogReady:
            scopes.resolved &&
            !held.size &&
            Object.keys(original).length === Object.keys(translated).length &&
            Object.keys(original).every(
              (id) =>
                omitted.has(id) ||
                empty.has(id) ||
                (reviewed(id, "meaning") && reviewed(id, "naturalness")),
            ),
        },
        null,
        2,
      ),
    );
  }
}
if (require.main === module) main();
