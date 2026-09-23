#!/usr/bin/env node
// Compile the shared game and reviewed catalogs into portable, self-contained editions.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generate = require("@babel/generator").default;
const prettier = require("prettier");
const ROOT = path.resolve(__dirname, "..");
const langs = ["en", "cn", "tw", "es", "fr"];
const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
const json = (file) => JSON.parse(read(file));
const parseSource = (file) => parse(read("source/" + file));
const variants = ["notYetSitting", "notYetStanding", "notYetQueue"];
function mergeGallery(en, alt) {
  return Object.fromEntries(
    ["endings", "hiddenScenes"].map((kind) => [
      kind,
      alt[kind].map((item) => {
        const other = en[kind].find((e) => (e.id || e.groupId) === (item.id || item.groupId));
        assert(other, "Missing Gallery counterpart");
        return {
          ...other,
          titleAlt: item.title,
          ...(item.variants
            ? {
                variants: item.variants.map((v) => {
                  const leaf = other.variants.find((e) => e.id === v.id);
                  assert(leaf, "Missing Gallery leaf counterpart");
                  return { ...leaf, titleAlt: v.title };
                }),
              }
            : {}),
        };
      }),
    ]),
  );
}
async function build(lang, bilingual) {
  const mode = bilingual ? "bilingual" : "single";
  const en = json("source/text/en.json"),
    alt = json(`source/text/${lang}.json`);
  const current = bilingual ? en : alt;
  const ui = json(`source/ui/${lang}.json`)[mode];
  const story = parseSource("story.js");
  // Expand each bilingual call directly from the same stable catalog ID. No
  // string-keyed translation lookup, fallback or per-render repair is necessary.
  if (bilingual)
    traverse(story, {
      CallExpression(p) {
        if (!["s", "c"].includes(p.node.callee.name)) return;
        const arg = p.node.callee.name === "s" ? 0 : 1;
        const localized = t.cloneNode(p.node.arguments[arg], true);
        traverse(t.file(t.program([t.expressionStatement(localized)])), {
          Identifier(q) {
            if (q.node.name === "TEXT") q.node.name = "ALT";
            else if (q.node.name === "BALANCE") q.node.name = "BALANCE_ALT";
            else if (q.node.name === "LANGUAGE") q.node.name = "ALT_LANGUAGE";
            else if (variants.includes(q.node.name)) q.node.name += "Alt";
          },
        });
        p.node.arguments.push(localized);
        p.node.callee.name += "Alt";
      },
      VariableDeclaration(p) {
        const d = p.node.declarations[0];
        if (!variants.includes(d.id.name)) return;
        const copy = t.cloneNode(p.node, true);
        copy.declarations[0].id.name += "Alt";
        traverse(t.file(t.program([copy])), {
          Identifier(q) {
            if (q.node.name === "TEXT") q.node.name = "ALT";
          },
        });
        p.insertAfter(copy);
      },
    });
  const body = [
    ...parseSource("runtime/common.js").program.body,
    ...parseSource(`runtime/${mode}.js`).program.body,
    ...story.program.body,
  ];
  const ast = t.file(t.program(body));
  traverse(ast, {
    MemberExpression(p) {
      const tables = { TEXT: current, ALT: alt, UI: ui };
      const table = tables[p.node.object.name];
      if (!table) return;
      const key = p.node.property.name;
      assert(Object.hasOwn(table, key), `Missing ${lang}/${mode}/${key}`);
      p.replaceWith(t.valueToNode(table[key]));
    },
    Identifier(p) {
      if (!p.isReferencedIdentifier()) return;
      const values = {
        BALANCE: current.balance,
        BALANCE_ALT: alt.balance,
        LANGUAGE: bilingual ? "en" : lang,
        ALT_LANGUAGE: lang,
      };
      if (Object.hasOwn(values, p.node.name)) p.replaceWith(t.stringLiteral(values[p.node.name]));
    },
  });
  const groupIds = json("source/status-groups.json");
  const status = {};
  for (const [id, group] of Object.entries(groupIds)) {
    assert(current[id], "Missing status message " + id);
    assert(
      status[current[id]] === undefined || status[current[id]] === group,
      "Ambiguous status identity",
    );
    status[current[id]] = group;
  }
  const sceneNames = story.program.body
    .filter((n) => n.type === "FunctionDeclaration")
    .map((n) => n.id.name);
  const registry = t.variableDeclaration("const", [
    t.variableDeclarator(
      t.identifier("SCENES"),
      t.callExpression(t.memberExpression(t.identifier("Object"), t.identifier("freeze")), [
        t.objectExpression([
          t.objectProperty(t.identifier("__proto__"), t.nullLiteral()),
          ...sceneNames.map((name) =>
            t.objectProperty(t.identifier(name), t.identifier(name), false, true),
          ),
        ]),
      ]),
    ),
  ]);
  ast.program.body.push(registry, ...parseSource(`runtime/boot-${mode}.js`).program.body);
  const gallery = json("maintenance/gallery_data.json");
  const constants =
    `const GALLERY_DATA = ${JSON.stringify(bilingual ? mergeGallery(gallery.en, gallery[lang]) : gallery[lang])};\n` +
    `const INTIMACY = ${JSON.stringify(alt.intimacy)};\n` +
    (bilingual ? `const INTIMACY_EN = ${JSON.stringify(en.intimacy)};\n` : "") +
    `const STATUS_GROUPS = ${JSON.stringify(status)};\n`;
  const script =
    constants +
    (await prettier.format(generate(ast, { comments: true, jsescOption: { minimal: true } }).code, {
      parser: "babel",
      printWidth: 100,
    }));
  new vm.Script(script);
  const edition = lang + (bilingual ? "-bilingual" : "");
  const presentation = json("source/editions.json")[lang];
  const style =
    (presentation.font ? ":root { --cjk-font: " + presentation.font + "; }\n" : "") +
    read(`source/styles/${presentation.style}${bilingual ? "-bilingual" : ""}.css`);
  return read(`source/shell/${edition}.html`)
    .replace("/* ADWD:STYLE */", () => style.trimEnd())
    .replace(
      "/* ADWD:SCRIPT */",
      () =>
        "// Generated by maintenance/build_editions.js. Edit source/, then rebuild.\n" +
        script.trimEnd(),
    );
}
async function main() {
  const check = process.argv.includes("--check");
  const pending = [];
  for (const lang of langs)
    for (const bi of lang === "en" ? [false] : [false, true]) {
      const filename = `outputs/${lang}/dianedate_${lang}${bi ? "_bilingual" : ""}.html`;
      const output = await build(lang, bi);
      if (read(filename) !== output) pending.push({ filename, output });
    }
  if (check)
    assert.equal(
      pending.length,
      0,
      "Stale generated editions: " + pending.map((p) => p.filename).join(", "),
    );
  else
    for (const { filename, output } of pending) fs.writeFileSync(path.join(ROOT, filename), output);
  console.log(
    `${check ? "Verified" : "Built"} all nine editions; ${pending.length} ${check ? "stale" : "updated"} files.`,
  );
}
if (require.main === module)
  main().catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
module.exports = { build, mergeGallery };
