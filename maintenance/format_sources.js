#!/usr/bin/env node
// Only maintained source is formatted. Generated releases/data follow their builders.
const fs = require("node:fs");
const path = require("node:path");
const prettier = require("prettier");
const ROOT = path.resolve(__dirname, "..");
const check = process.argv.includes("--check");
const visual = process.argv.includes("--visual");
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}
async function main() {
  const root = visual
    ? path.resolve(process.env.ADWD_VISUAL_ROOT || path.join(ROOT, "..", "ADWD-visual"))
    : ROOT;
  const files = (visual ? ["maintenance", "visual"] : ["maintenance", "source"])
    .flatMap((dir) => walk(path.join(root, dir)))
    .filter((file) => /\.(?:js|css|html)$/.test(file))
    .sort();
  const changed = [];
  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    const options = await prettier.resolveConfig(file, {
      config: path.join(ROOT, ".prettierrc.json"),
    });
    const formatted = await prettier.format(source, { ...options, filepath: file });
    if (source !== formatted) {
      changed.push(path.relative(root, file));
      if (!check) fs.writeFileSync(file, formatted);
    }
  }
  if (check && changed.length) throw new Error("Unformatted sources: " + changed.join(", "));
  console.log(
    `${check ? "Checked" : "Formatted"} ${files.length} maintained files; ${changed.length} changed.`,
  );
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
