#!/usr/bin/env node
/**
 * Builds outputs/en/dianedate_visual_en.html from the text playable + visual shell.
 * Does not modify story logic — injects chrome, backdrops, and a go() hook.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "outputs/en/dianedate_en.html");
const OUT = path.join(ROOT, "outputs/en/dianedate_visual_en.html");
const VISUAL = path.join(ROOT, "visual");

// Normal builds first import the current canonical English content and tools.
// --check remains read-only; --local-only explicitly builds an isolated snapshot.
if (!process.argv.includes('--local-only')) {
  require('./sync_visual_edition.js').synchronize({ check: process.argv.includes('--check') });
}

function replaceRequired(source, search, replacement) {
  const matched = typeof search === "string" ? source.includes(search) : search.test(source);
  if (!matched) throw new Error("Visual build anchor not found: " + String(search).slice(0, 100));
  // Insert generated code literally; do not interpret $ replacement sequences.
  return source.replace(search, () => replacement);
}

function read(p) {
  return fs.readFileSync(p, "utf8");
}

const shellCss = read(path.join(VISUAL, "shell.css"));
const sceneMap = read(path.join(VISUAL, "scene-map.js"));
const puddleSync = read(path.join(VISUAL, "puddle-sync.js"));
const adapter = read(path.join(VISUAL, "adapter.js"));
const puddleMeta = JSON.parse(read(path.join(ROOT, "assets/fx/puddle_meta.json")));
// Frame banks are the authority for their length. Embed a validated count so
// browsers never discover the end by requesting a nonexistent PNG.
for (const [clip, info] of Object.entries(puddleMeta.clips)) {
  const bank = path.join(ROOT, "assets/fx/grow_frames", clip.replace("/", "_") + "_grow");
  const frames = fs.readdirSync(bank).filter(name => /\.png$/i.test(name)).sort();
  const expected = frames.map((_, index) => String(index).padStart(2, "0") + ".png").sort();
  if (!frames.length || frames.some((name, index) => name !== expected[index])) {
    throw new Error("Puddle frame bank must contain contiguous numbered PNGs starting at 00: " + bank);
  }
  info.growFrames = frames.length;
}
const puddleMetaRaw = JSON.stringify(puddleMeta);

const metersHtml = `
        <div class="visual-meters" id="visualMeters">
          <div class="vessels">
            <span class="tank-name tummy-label" id="tummy-label" tabindex="0">Tummy</span>
            <span class="tank-name blad-label" id="blad-label" tabindex="0">Bladder</span>
            <div class="organ tummy" id="carafe" tabindex="0">
              <svg viewBox="0 0 100 86" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <path id="tummyPath" d="M22 28 C18 14 28 6 42 8 C58 10 72 8 82 18 C92 28 90 44 80 54 C70 64 58 72 48 78 C36 84 24 78 20 64 C16 50 26 40 22 28Z" />
                  <clipPath id="tummyClip"><use href="#tummyPath" /></clipPath>
                  <radialGradient id="tummyWall" cx="36%" cy="30%" r="70%">
                    <stop offset="0%" stop-color="#fcf6f0" />
                    <stop offset="40%" stop-color="#f0e0d4" />
                    <stop offset="100%" stop-color="#cbb4a4" />
                  </radialGradient>
                  <radialGradient id="tummyChyme" cx="46%" cy="55%" r="62%">
                    <stop offset="0%" stop-color="#d9a48c" />
                    <stop offset="50%" stop-color="#c4896e" />
                    <stop offset="100%" stop-color="#a87058" />
                  </radialGradient>
                  <radialGradient id="tummyShade" cx="40%" cy="28%" r="75%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22" />
                    <stop offset="35%" stop-color="#ffffff" stop-opacity="0" />
                    <stop offset="70%" stop-color="#8a6550" stop-opacity="0" />
                    <stop offset="100%" stop-color="#4a3028" stop-opacity="0.32" />
                  </radialGradient>
                </defs>
                <use href="#tummyPath" class="cavity" />
                <g clip-path="url(#tummyClip)">
                  <rect class="fill-shape" id="tummy-fill-rect" x="0" y="0" width="100" height="86" style="transform: scaleY(0.4)" />
                </g>
                <use href="#tummyPath" class="shade" />
                <use href="#tummyPath" class="outline" />
              </svg>
            </div>
            <div class="drip-col" id="drip-col" aria-hidden="true"></div>
            <div class="organ blad" id="vessel" tabindex="0">
              <svg viewBox="0 0 120 96" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <path id="bladPath" d="M60 12 C86 12 106 30 108 50 C110 66 98 78 82 84 C74 88 68 90 64 94 C62 96 58 96 56 94 C52 90 46 88 38 84 C22 78 10 66 12 50 C14 30 34 12 60 12Z" />
                  <clipPath id="bladClip"><use href="#bladPath" /></clipPath>
                  <radialGradient id="bladWall" cx="36%" cy="30%" r="70%">
                    <stop offset="0%" stop-color="#fcf6f0" />
                    <stop offset="40%" stop-color="#f0e0d4" />
                    <stop offset="100%" stop-color="#cbb4a4" />
                  </radialGradient>
                  <radialGradient id="bladUrine" cx="48%" cy="55%" r="60%">
                    <stop id="blad-stop-lit" offset="0%" stop-color="#f8ecc0" />
                    <stop id="blad-stop-mid" offset="45%" stop-color="#f2dc7a" />
                    <stop id="blad-stop-deep" offset="100%" stop-color="#e0c050" />
                  </radialGradient>
                  <radialGradient id="bladShade" cx="40%" cy="28%" r="75%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22" />
                    <stop offset="35%" stop-color="#ffffff" stop-opacity="0" />
                    <stop offset="70%" stop-color="#8a6550" stop-opacity="0" />
                    <stop offset="100%" stop-color="#4a3028" stop-opacity="0.32" />
                  </radialGradient>
                </defs>
                <use href="#bladPath" class="cavity" />
                <g clip-path="url(#bladClip)">
                  <rect class="fill-shape" id="blad-fill-rect" x="0" y="0" width="120" height="96" style="transform: scaleY(0.35)" />
                </g>
                <use href="#bladPath" class="shade" />
                <use href="#bladPath" class="outline" />
              </svg>
            </div>
          </div>
          <div class="bars">
            <div class="bar-row">
              <span>Intimacy</span>
              <div class="bar-track"><div class="bar-fill" id="inti-fill"></div></div>
              <b id="inti-n">20</b>
            </div>
            <div class="bar-row shy">
              <span>Shyness</span>
              <div class="bar-track"><div class="bar-fill" id="shy-fill"></div></div>
              <b id="shy-n">20</b>
            </div>
          </div>
          <div class="footer-stats">
            <span>Luckshots<span class="coins" id="coins"></span></span>
            <span class="pounds">£ <strong id="pounds">100</strong></span>
          </div>
        </div>`;

const shellOpen = `
<div class="visual-app">
  <header class="visual-rail">
    <span class="brand" id="railBrand">A Date with Diane</span>
    <div class="rail-end">
      <button id="skipBtn" class="climax-skip-button" onclick="skipToClimax()" type="button" style="display:none">Skip</button>
      <button id="galleryToggle" class="gallery-button" onclick="openGallery()" type="button">Gallery</button>
      <button id="themeToggle" class="theme-toggle-button theme-toggle-off" onclick="toggleTheme()" type="button">Dark Mode: Off</button>
      <button type="button" class="theme-toggle-button theme-toggle-off" id="backBtn" onclick="goback()" style="display:none">Back</button>
    </div>
  </header>
  <div class="visual-main">
    <section class="visual-panel visual-story-col">
      <div class="visual-kicker"><strong>Story</strong></div>
`;

const shellMid = `
    </section>
    <aside class="visual-panel visual-stage-col">
      <div class="visual-kicker">
        <strong id="focusLabel">Diane</strong>
        <span id="locLabel" class="muted"></span>
      </div>
      <div class="visual-stage" id="visualStage" data-location="title">
        <div class="stage-band" id="stageBand">Comfortable</div>
        <div class="stage-rec" id="stageRec" hidden aria-hidden="true"><span class="rec-dot" aria-hidden="true"></span>REC</div>
        <div class="stage-puddle" id="stagePuddle" aria-hidden="true"></div>
        <div class="stage-cast" id="stageCast"></div>
      </div>
${metersHtml}
    </aside>
  </div>
</div>
`;

let html = read(SRC);

// Title
html = replaceRequired(html,
  /<title>[^<]*<\/title>/i,
  "<title>A Date With Diane — Visual</title>"
);

// Inject visual CSS before </style> of game (append new style block before </head>)
html = replaceRequired(html,
  "</head>",
  "<style id=\"visual-shell-css\">\n" + shellCss + "\n</style>\n</head>"
);

// Mark body
html = replaceRequired(html,/<body>/i, '<body class="visual-edition">');

// Replace game-shell block with visual layout wrapping #box
const oldShell = /<div class="game-shell">[\s\S]*?<div id="box"[^>]*><\/div>\s*<\/div>/;
if (!oldShell.test(html)) {
  console.error("Could not find .game-shell / #box block");
  process.exit(1);
}

html = replaceRequired(html,
  oldShell,
  shellOpen +
    '  <div id="gameToolbar" class="game-toolbar" style="display:none"></div>\n' +
    '  <div id="box" aria-live="polite" aria-atomic="true"></div>\n' +
    shellMid
);

// Inject scene map + adapter before </body>
html = replaceRequired(html,
  "</body>",
  "<script id=\"adwd-puddle-meta\">\nwindow.ADWD_PUDDLE_META = " +
    puddleMetaRaw +
    ";\n</script>\n<script id=\"adwd-scene-map\">\n" +
    sceneMap +
    "\n</script>\n<script id=\"adwd-puddle-sync\">\n" +
    puddleSync +
    "\n</script>\n<script id=\"adwd-visual-adapter\">\n" +
    adapter +
    "\n</script>\n</body>"
);

// Rail brand (title → day), Back, Skip — keep in sync with classic chrome helpers
html = replaceRequired(html,
  "function syncThemeButton() {",
  `function syncVisualChrome() {
  try {
    var brand = document.getElementById("railBrand");
    if (brand && window.ADWDSceneMap) {
      var tag = typeof currentTag !== "undefined" ? String(currentTag || "") : "";
      var day = ADWDSceneMap.dayLabel();
      var titlePhase = !tag || tag === "start" || /^(start1|tuesdaydate|thursdaydate|saturdaydate)/.test(tag);
      brand.textContent = (!titlePhase && day) ? day : "A Date with Diane";
    }
    var back = document.getElementById("backBtn");
    if (back) back.style.display = (gameHistory && gameHistory.length) ? "" : "none";
    if (typeof syncSkipButton === "function") syncSkipButton();
  } catch (e) {}
}
function syncThemeButton() {`
);

html = replaceRequired(html,
  "syncThemeButton();\n",
  "syncThemeButton();\n  try { syncVisualChrome(); } catch (e) {}\n"
);

html = replaceRequired(html,
  "box.classList.add(\"screen-fade\");",
  "box.classList.add(\"screen-fade\");\n    try { syncVisualChrome(); } catch (eVis) {}"
);

// Short Skip label in classic nav + sync to rail #skipBtn
html = replaceRequired(html,
  /Skip to the good bit!/g,
  "Skip"
);

html = replaceRequired(html,
  `function syncSkipButton() {
  var row = document.querySelector("#box .nav-row");
  if (!row) return;
  var existing = row.querySelector(".climax-skip-button");
  if (canSkipToClimax()) {
    if (!existing) {
      var btn = document.createElement("button");
      btn.className = "climax-skip-button";
      btn.setAttribute("onclick", "skipToClimax()");
      btn.textContent = "Skip";
      row.appendChild(btn);
    }
  } else if (existing) {
    existing.parentNode.removeChild(existing);
  }
}`,
  `function syncSkipButton() {
  var show = typeof canSkipToClimax === "function" && canSkipToClimax();
  var rail = document.getElementById("skipBtn");
  if (rail) {
    rail.style.display = show ? "" : "none";
    rail.textContent = "Skip";
  }
  var row = document.querySelector("#box .nav-row");
  if (!row) return;
  var existing = row.querySelector(".climax-skip-button");
  if (show) {
    if (!existing) {
      var btn = document.createElement("button");
      btn.className = "climax-skip-button";
      btn.setAttribute("onclick", "skipToClimax()");
      btn.textContent = "Skip";
      row.appendChild(btn);
    } else {
      existing.textContent = "Skip";
    }
  } else if (existing) {
    existing.parentNode.removeChild(existing);
  }
}`
);

if (process.argv.includes("--check")) {
  if (!fs.existsSync(OUT) || read(OUT) !== html) throw new Error("Visual HTML is stale; run node maintenance/build_visual_edition.js");
  console.log("Visual HTML matches its source and presentation modules (read-only).");
} else {
  fs.writeFileSync(OUT, html, "utf8");
  const size = (Buffer.byteLength(html, "utf8") / 1024 / 1024).toFixed(2);
  console.log("Wrote", OUT, "(" + size + " MB)");
  console.log("Open outputs/en/dianedate_visual_en.html in a browser.");
}
