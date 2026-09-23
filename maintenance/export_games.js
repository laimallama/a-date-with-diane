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
  const names = {
    en: "English",
    cn: "Simplified Chinese",
    tw: "Taiwan Mandarin (Traditional Chinese)",
    es: "Spanish",
    fr: "French",
  };
  const rows = LANGUAGES.map((lang) => {
    const base = `outputs/${lang}/dianedate_${visual ? "visual_" : ""}${lang}`;
    return `| ${names[lang]} | [Play](${base}.html) | ${lang === "en" ? "—" : `[Play with English](${base}_bilingual.html)`} |`;
  });
  const companions = LANGUAGES.map(
    (lang) =>
      `- ${names[lang]}: [Wiki](${visual ? "../ADWD/" : ""}outputs/${lang}/wiki_${lang}.html) · [Transcripts](${visual ? "../ADWD/" : ""}outputs/${lang}/transcripts/)`,
  );
  return [
    `# A Date with Diane${visual ? " — Visual editions" : " (Remastered)"}`,
    "",
    "A restored, polished and expanded edition of the original *A Date with Diane*, an omorashi text adventure. Your choices shape an evening with Diane: the day, meals, drinks, conversations and journey home can lead to different scenes and endings. The remaster preserves the original British narrative voice while improving wording, continuity and navigation.",
    "",
    ...(visual
      ? [
          "The visual editions add animated character sprites, locations and graphical meters to the same story, choices, translations and Gallery routes as the text editions. The layout adapts to computers, phones and tablets; reduced-motion preferences use still images and held effects.",
          "",
        ]
      : []),
    "## Play",
    "",
    "Open one of the HTML files below in your browser. No installation, server or internet connection is needed to play. Use the on-screen buttons on any device, or the keyboard shortcuts on a computer.",
    "",
    "| Language | Standalone | Bilingual |",
    "|---|---|---|",
    ...rows,
    "",
    "Bilingual editions let you switch between English and the other language during play. Each language uses the same text as its standalone edition; Taiwan Mandarin uses local wording, not just converted Simplified Chinese characters.",
    "",
    "## What is included",
    "",
    "- Five standalone languages and four bilingual editions.",
    "- Five main prize endings, consolation endings and hidden scenes, with branches affected by your earlier choices.",
    "- A Gallery containing 15 ending routes and 31 hidden-scene routes. Expand grouped entries to choose a scene, then follow the highlighted Guide choices.",
    "- Back navigation that restores the previous page, choices and game state; guided fast-forward and Skip to the good bit.",
    "- Light and dark themes, responsive layouts and localized interface labels.",
    ...(visual
      ? [
          "- Nine visual game pages and 318 required image assets, shared across the editions.",
          "- Animated presentation and graphical status meters, synchronized with the text game's state.",
        ]
      : [
          "- Nine self-contained game pages, five companion wikis and 230 scene transcripts (46 per language).",
        ]),
    "",
    "## Controls",
    "",
    "| Key | Action |",
    "|---|---|",
    "| **1–9** | Select a choice. |",
    "| **G** / **Esc** | Open / close the Gallery. |",
    "| **H** | Turn an already-started Guide on or off. |",
    "| **Enter** | Follow the highlighted Guide choice. Hold to fast-forward; release to stop. |",
    "| **B** | Use the Back button. Hold to rewind quickly; release to stop. |",
    "| **S** | Skip to the climax while following an ending Guide. |",
    "| **D** | Toggle dark mode. |",
    "| **L** | Switch language in a bilingual edition. |",
    "",
    "Skip is available once per newly started ending Guide. Going back can take you before the skipped point; turning the Guide off removes Skip and stops fast-forward. The in-game Notes explain these controls in each language.",
    "",
    "Dark mode persists when you refresh the same tab. Back history lasts only during the current game session; it is not a saved game.",
    "",
    "## Wiki and transcripts",
    "",
    visual
      ? "The companion wikis and transcripts are kept once, in the sibling **ADWD** folder. They are optional references; the visual games run without that folder."
      : "Each language folder includes a wiki about the setting and characters, plus transcripts of the Gallery's endings and hidden scenes.",
    "",
    "Transcripts follow Gallery order and titles. Ending transcripts begin at the climax reached by Skip to the good bit; hidden-scene transcripts begin at the scene's starting point. The in-game Gallery supplies the walkthroughs.",
    "",
    ...companions,
    "",
    "## Folder contents and source",
    "",
    visual
      ? "Keep **assets/** beside **outputs/**, preserving their folder structure. This folder contains the visual games and their graphics; the text-only games and companion references are in ADWD."
      : "**outputs/** contains the language folders, games, wikis and transcripts. Each text game is a single HTML file; the visual editions are available separately in ADWD-visual.",
    "",
    "These folders contain the files needed to play and read the companion material. Editable sources, maintenance tools and version history are kept in the GitHub repositories:",
    "",
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
