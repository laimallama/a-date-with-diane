#!/usr/bin/env node
// Compile localized articles with one shared runtime and stylesheet. Outputs work offline.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const ROOT = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
const editions = JSON.parse(read("source/editions.json"));
const script = read("source/runtime/wiki.js").trimEnd();
new vm.Script(script);
const css = read("source/styles/wiki.css").trimEnd();
const pending = [];
for (const [lang, edition] of Object.entries(editions)) {
  const template = read(`source/wiki/${lang}.html`);
  for (const key of ["STYLE", "SCRIPT"]) {
    assert.equal(
      template.split(`/* ADWD:${key} */`).length,
      2,
      `Expected one ${key} slot in ${lang} wiki`,
    );
  }
  const style = (edition.font ? `:root { --wiki-font: ${edition.font}; }\n` : "") + css;
  const html = template
    .replace("/* ADWD:STYLE */", () => style)
    .replace("/* ADWD:SCRIPT */", () => script);
  const file = path.join(ROOT, `outputs/${lang}/wiki_${lang}.html`);
  if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== html) pending.push({ file, html });
}
const check = process.argv.includes("--check");
if (check) assert.equal(pending.length, 0, "Stale wikis; run node maintenance/build_wikis.js");
else for (const { file, html } of pending) fs.writeFileSync(file, html);
console.log(`${check ? "Verified" : "Built"} five wikis; ${pending.length} changed files.`);
