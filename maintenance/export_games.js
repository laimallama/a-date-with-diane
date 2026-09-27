#!/usr/bin/env node
/** Export one play-only folder without development tools or duplicated companions. */
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { managedTranscriptFiles } = require("./write_transcripts.js");
const ROOT = path.resolve(__dirname, "..");
const LANGUAGES = Object.keys(require("../source/editions.json"));
function listFiles(root) {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(root, entry.name);
    if (entry.isSymbolicLink()) throw Error("Unexpected symlink in release: " + file);
    return entry.isDirectory() ? listFiles(file) : [file];
  });
}
function introduction() {
  const readme = fs.readFileSync(path.join(ROOT, "README.md"), "utf8");
  const marker = "\n## Maintaining\n";
  const end = readme.indexOf(marker);
  if (end < 0) throw Error("README is missing its maintenance section");
  return (
    readme.slice(0, end) +
    "\n## Source and maintenance\n\n" +
    "This play-only copy contains the games, companions and graphics. " +
    "The maintained source and tools are in the GitHub repository " +
    "`laimallama/a-date-with-diane`. Use its README when making changes.\n"
  );
}
function releaseFiles() {
  const files = new Map();
  const include = (relative) => files.set(relative, fs.readFileSync(path.join(ROOT, relative)));
  for (const lang of LANGUAGES) {
    for (const bilingual of lang === "en" ? [false] : [false, true]) {
      const suffix = lang + (bilingual ? "_bilingual" : "");
      include(`outputs/${lang}/dianedate_${suffix}.html`);
      include(`outputs/${lang}/dianedate_visual_${suffix}.html`);
    }
    include(`outputs/${lang}/wiki_${lang}.html`);
  }
  for (const relative of managedTranscriptFiles()) include(relative);
  for (const file of listFiles(path.join(ROOT, "assets"))) {
    if (/\.(?:gif|png)$/i.test(file)) include(path.relative(ROOT, file));
  }
  files.set("README.md", Buffer.from(introduction()));
  return files;
}
function verify(destination, files) {
  const actual = listFiles(destination)
    .map((file) => path.relative(destination, file))
    .sort();
  const expected = [...files.keys()].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected))
    throw Error("Release has missing or extra files");
  for (const [relative, bytes] of files) {
    if (!fs.readFileSync(path.join(destination, relative)).equals(bytes))
      throw Error("Release differs from source: " + relative);
  }
}
function main() {
  const args = process.argv.slice(2),
    check = args.includes("--check");
  const targets = args.filter((arg) => !arg.startsWith("--"));
  if (targets.length !== 1 || args.some((arg) => arg.startsWith("--") && arg !== "--check"))
    throw Error("Usage: node maintenance/export_games.js [--check] /path/to/new-release-folder");
  const destination = path.resolve(targets[0]);
  // Resolve the nearest existing parent so a symlink cannot evade source protection.
  let ancestor = destination;
  while (!fs.existsSync(ancestor)) ancestor = path.dirname(ancestor);
  const resolved = path.join(fs.realpathSync(ancestor), path.relative(ancestor, destination));
  const source = fs.realpathSync(ROOT);
  if (
    resolved === source ||
    resolved.startsWith(source + path.sep) ||
    source.startsWith(resolved + path.sep)
  )
    throw Error("Release destination must not overlap the project folder");
  const files = releaseFiles();
  if (check) verify(destination, files);
  else {
    if (fs.existsSync(destination))
      throw Error("Release destination already exists; refusing to overwrite it");
    const staging = fs.mkdtempSync(path.join(os.tmpdir(), "adwd-export-"));
    try {
      for (const [relative, bytes] of files) {
        const target = path.join(staging, relative);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, bytes);
      }
      verify(staging, files);
      fs.cpSync(staging, destination, { recursive: true, errorOnExist: true, force: false });
      verify(destination, files);
    } finally {
      fs.rmSync(staging, { recursive: true, force: true });
    }
  }
  console.log(
    `${check ? "Verified" : "Exported"} ${files.size} play-only files; no Git, dependencies, build sources or duplicated companions.`,
  );
}
if (require.main === module) main();
