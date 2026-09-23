#!/usr/bin/env node
/** Export play-only folders without duplicating development tools or companions. */
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { managedTranscriptFiles } = require("./write_transcripts.js");
const ROOT = path.resolve(__dirname, "..");
const VISUAL_ROOT = path.resolve(
  process.env.ADWD_VISUAL_ROOT || path.join(ROOT, "..", "ADWD-visual"),
);
const LANGUAGES = ["en", "cn", "tw", "es", "fr"];
function listFiles(root) {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(root, entry.name);
    if (entry.isSymbolicLink()) throw Error("Unexpected symlink in release: " + file);
    return entry.isDirectory() ? listFiles(file) : [file];
  });
}
function introduction(visual) {
  const rows = LANGUAGES.map((lang) => {
    const base = `outputs/${lang}/dianedate_${visual ? "visual_" : ""}${lang}`;
    return `| ${lang} | [Play](${base}.html) | ${lang === "en" ? "—" : `[English + ${lang}](${base}_bilingual.html)`} |`;
  });
  return [
    `# A Date with Diane${visual ? " — Visual" : ""}`,
    "",
    "Open any game HTML file in your browser. No installation or server is needed.",
    "",
    "| Language | Standalone | Bilingual |",
    "|---|---|---|",
    ...rows,
    "",
    "Language codes: en = English; cn = Simplified Chinese; tw = Taiwan Mandarin; es = Spanish; fr = French.",
    "",
    ...(visual
      ? [
          "Keep the assets folder beside outputs. Wikis and transcripts are kept once in the sibling ADWD folder:",
          ...LANGUAGES.map(
            (lang) =>
              `- ${lang}: [Wiki](../ADWD/outputs/${lang}/wiki_${lang}.html) · [Transcripts](../ADWD/outputs/${lang}/transcripts/)`,
          ),
        ]
      : [
          "Offline companions:",
          ...LANGUAGES.map(
            (lang) =>
              `- ${lang}: [Wiki](outputs/${lang}/wiki_${lang}.html) · [Transcripts](outputs/${lang}/transcripts/)`,
          ),
        ]),
    "",
    "These are play-only files. Editable sources, build tools and version history are on GitHub:",
    "- [Text source](https://github.com/laimallama/a-date-with-diane)",
    "- [Visual source](https://github.com/laimallama/a-date-with-diane-visual)",
    "",
    "To maintain the games, clone both repositories into sibling ADWD and ADWD-visual development folders and follow their READMEs.",
    "",
  ].join("\n");
}
function releaseFiles() {
  const files = new Map();
  const include = (project, root, relative) =>
    files.set(`${project}/${relative}`, fs.readFileSync(path.join(root, relative)));
  for (const lang of LANGUAGES) {
    for (const bilingual of lang === "en" ? [false] : [false, true]) {
      const suffix = lang + (bilingual ? "_bilingual" : "");
      include("ADWD", ROOT, `outputs/${lang}/dianedate_${suffix}.html`);
      include("ADWD-visual", VISUAL_ROOT, `outputs/${lang}/dianedate_visual_${suffix}.html`);
    }
    include("ADWD", ROOT, `outputs/${lang}/wiki_${lang}.html`);
  }
  for (const relative of managedTranscriptFiles()) include("ADWD", ROOT, relative);
  for (const file of listFiles(path.join(VISUAL_ROOT, "assets"))) {
    if (/\.(?:gif|png)$/i.test(file))
      include("ADWD-visual", VISUAL_ROOT, path.relative(VISUAL_ROOT, file));
  }
  for (const [project, visual] of [
    ["ADWD", false],
    ["ADWD-visual", true],
  ]) {
    files.set(project + "/README.md", Buffer.from(introduction(visual)));
  }
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
  for (const source of [ROOT, VISUAL_ROOT].map((root) => fs.realpathSync(root))) {
    if (
      resolved === source ||
      resolved.startsWith(source + path.sep) ||
      source.startsWith(resolved + path.sep)
    )
      throw Error("Release destination must not overlap either source checkout");
  }
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
