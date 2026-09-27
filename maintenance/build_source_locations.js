#!/usr/bin/env node
// Derive stable text identities from explicit TEXT references, never from wording.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const ROOT = path.resolve(__dirname, "..");
const file = path.join(ROOT, "source/locations.json");
function buildLocations(previous) {
  const calls = [],
    variants = [];
  for (const name of ["runtime/single.js", "story.js"]) {
    const slots = new Map();
    traverse(parse(fs.readFileSync(path.join(ROOT, "source", name), "utf8")), {
      CallExpression(p) {
        const call = p.node;
        if (!["s", "c"].includes(call.callee.name)) return;
        const fn = p.getFunctionParent()?.node.id?.name;
        assert(fn, "Text call needs a named function");
        const slot = (slots.get(fn) || 0) + 1;
        slots.set(fn, slot);
        const kind = call.callee.name === "s" ? "story" : "choice";
        const arg = call.arguments[kind === "story" ? 0 : 1];
        const literal = arg.type === "MemberExpression" && arg.object.name === "TEXT";
        const old = previous.filter((r) => r.dynamic && r.source.node === fn);
        assert(
          literal || old.length === 1,
          "Dynamic call needs an explicit stable identity: " + fn,
        );
        const row = { id: literal ? arg.property.name : old[0].id, kind };
        if (kind === "choice") {
          assert.equal(call.arguments[0].type, "StringLiteral", "Literal choice target");
          row.tag = call.arguments[0].value;
        }
        row.source = { node: fn, slot };
        if (!literal) row.dynamic = true;
        calls.push(row);
      },
      VariableDeclarator(p) {
        if (!/^notYet(?:Sitting|Standing|Queue)$/.test(p.node.id.name)) return;
        p.node.init.arguments.forEach((arg, i) => {
          assert.equal(arg.object?.name, "TEXT", "Explicit variant identity");
          variants.push({
            id: arg.property.name,
            kind: "variant",
            source: { node: p.node.id.name, slot: i + 1 },
          });
        });
      },
    });
  }
  const rows = [...calls, ...variants];
  assert.equal(
    new Set(rows.map((r) => r.id)).size,
    rows.length,
    "A text identity has multiple call sites",
  );
  return rows;
}
function main() {
  const current = fs.readFileSync(file, "utf8");
  const output = JSON.stringify(buildLocations(JSON.parse(current)), null, 2) + "\n";
  if (process.argv.includes("--check")) assert.equal(current, output, "Stale source locations");
  else if (current !== output) fs.writeFileSync(file, output);
  console.log("Source locations match explicit stable text references.");
}
if (require.main === module) main();
module.exports = { buildLocations };
