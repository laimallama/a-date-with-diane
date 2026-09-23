#!/usr/bin/env node
// Static hygiene for support modules. Dynamic game globals are checked separately.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const ROOT = path.resolve(__dirname, "..");
const visual = process.argv.includes("--visual");
const root = visual
  ? path.resolve(process.env.ADWD_VISUAL_ROOT || path.join(ROOT, "..", "ADWD-visual"))
  : ROOT;
const dirs = visual ? ["maintenance", "visual"] : ["maintenance"];
const files = dirs.flatMap((dir) =>
  fs
    .readdirSync(path.join(root, dir))
    .filter((name) => name.endsWith(".js"))
    .map((name) => path.join(dir, name)),
);
if (!visual) files.push("source/runtime/wiki.js");
const issues = [];
for (const file of files) {
  const ast = parse(fs.readFileSync(path.join(root, file), "utf8"));
  const seen = new Set();
  traverse(ast, {
    Scope(p) {
      for (const [name, binding] of Object.entries(p.scope.bindings)) {
        if (seen.has(binding)) continue;
        seen.add(binding);
        // Callback positions and deliberately ignored exceptions are API syntax.
        if (binding.kind === "param" || binding.kind === "local" || binding.path.isCatchClause())
          continue;
        if (!binding.referenced)
          issues.push(`${file}:${binding.identifier.loc.start.line}: unused ${name}`);
      }
    },
  });
}
assert.deepEqual(issues, [], "Unused support bindings");
console.log(
  `Verified syntax and local binding usage in ${files.length} support modules. Export/dynamic consumers require review.`,
);
