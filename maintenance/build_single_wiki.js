#!/usr/bin/env node
/**
 * Build a single-file wiki HTML for a given language.
 * EN: reads from outputs/en/wiki/ HTML files (source of truth).
 * Other langs: reads from outputs/{lang}/wiki/ markdown files + README.md.
 *
 * Usage:
 *   node maintenance/build_single_wiki.js         # builds EN
 *   node maintenance/build_single_wiki.js cn      # builds CN
 *   node maintenance/build_single_wiki.js --all   # builds all langs
 */

"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

// ── Per-language UI strings ────────────────────────────────────────────────────

const LANG_UI = {
  en: {
    htmlLang: "en",
    darkOff: "Dark Mode: Off",
    darkOn: "Dark Mode: On",
    backLabel: "Back to Menu",
    // font-family for body/UI (serif for EN wiki)
    fontFamily: "Georgia, \"Times New Roman\", serif",
  },
  cn: {
    htmlLang: "zh-CN",
    darkOff: "\u6df1\u8272\u6a21\u5f0f\uff1a\u5173\u95ed",   // 深色模式：关闭
    darkOn:  "\u6df1\u8272\u6a21\u5f0f\uff1a\u5f00\u542f",   // 深色模式：开启
    backLabel: "\u8fd4\u56de\u76ee\u5f55",                     // 返回目录
    fontFamily: "\"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", \"Noto Sans CJK SC\", Arial, Helvetica, sans-serif",
  },
  tw: {
    htmlLang: "zh-TW",
    darkOff: "\u6df1\u8272\u6a21\u5f0f\uff1a\u95dc",       // 深色模式：關
    darkOn:  "\u6df1\u8272\u6a21\u5f0f\uff1a\u958b",       // 深色模式：開
    backLabel: "\u8fd4\u56de\u76ee\u9304",                     // 返回目錄
    fontFamily: "\"PingFang TC\", \"Heiti TC\", \"Microsoft JhengHei\", \"Noto Sans CJK TC\", Arial, Helvetica, sans-serif",
  },
  es: {
    htmlLang: "es",
    darkOff: "Modo oscuro: Desactivado",
    darkOn:  "Modo oscuro: Activado",
    backLabel: "Volver al men\u00fa",   // Volver al menú
    fontFamily: "Georgia, \"Times New Roman\", serif",
  },
  fr: {
    htmlLang: "fr",
    darkOff: "Mode sombre\u202f: D\u00e9sactiv\u00e9",   // Mode sombre : Désactivé (narrow nbsp)
    darkOn:  "Mode sombre\u202f: Activ\u00e9",
    backLabel: "Retour au menu",
    fontFamily: "Georgia, \"Times New Roman\", serif",
  },
};

// ── helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineFormat(text) {
  let s = escapeHtml(text);
  // markdown links → showPage() calls for article stems, raw href otherwise
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    const stemMatch = href.match(/^(\d{2}_[^/.]+)(?:\.md|\.html)?$/);
    if (stemMatch) return "<a href=\"#\" onclick=\"showPage('" + stemMatch[1] + "'); return false;\">" + label + "</a>";
    return "<a href=\"" + href.replace(/\.md$/, ".html") + "\">" + label + "</a>";
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return s;
}

function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;
  const para = [];
  function flushPara() {
    const t = para.join(" ").trim();
    if (t) out.push("<p>" + inlineFormat(t) + "</p>");
    para.length = 0;
  }
  while (i < lines.length) {
    const line = lines[i];
    if (/^\|/.test(line)) {
      flushPara();
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) { rows.push(lines[i]); i++; }
      const body = rows.filter((r) => !/^\|\s*[-:| ]+\s*\|/.test(r));
      if (body.length) {
        out.push("<table>");
        body.forEach((r, idx) => {
          const cells = r.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
          const tag = idx === 0 ? "th" : "td";
          out.push("<tr>" + cells.map((c) => "<" + tag + ">" + inlineFormat(c) + "</" + tag + ">").join("") + "</tr>");
        });
        out.push("</table>");
      }
      continue;
    }
    if (/^### /.test(line)) { flushPara(); out.push("<h3>" + inlineFormat(line.slice(4).trim()) + "</h3>"); i++; continue; }
    if (/^## /.test(line))  { flushPara(); out.push("<h2>" + inlineFormat(line.slice(3).trim()) + "</h2>"); i++; continue; }
    if (/^# /.test(line))   { flushPara(); out.push("<h1>" + inlineFormat(line.slice(2).trim()) + "</h1>"); i++; continue; }
    if (!line.trim()) { flushPara(); i++; continue; }
    // Skip numbered list lines handled below in buildIndexFromReadme
    if (/^\d+\. \[/.test(line)) { flushPara(); i++; continue; }
    para.push(line.trim());
    i++;
  }
  flushPara();
  return out.join("\n");
}

// ── CSS ───────────────────────────────────────────────────────────────────────

const BASE_CSS = fs.readFileSync(path.join(ROOT, "outputs/en/wiki/wiki.css"), "utf8");

function buildFullCss(ui) {
  // If the lang uses a different font, override font-family globally
  const fontOverride = (ui.fontFamily !== LANG_UI.en.fontFamily)
    ? "\n/* Lang font override */\nbody, button, table, th, td, h1, h2, h3, p, ol, li, blockquote, .wiki-back-btn {\n  font-family: " + ui.fontFamily + ";\n}\n"
    : "";
  const extra = [
    "/* Single-file SPA */",
    ".wiki-page { display: none; }",
    ".wiki-page.active { display: block; }",
    ".wiki-back-row { margin-top: 2em; }",
    ".wiki-back-btn {",
    "  box-sizing: border-box;",
    "  display: inline-block;",
    "  min-height: 44px;",
    "  padding: 11px 14px;",
    "  border: 1px solid var(--accent);",
    "  border-radius: 6px;",
    "  color: var(--on-accent);",
    "  background: var(--accent);",
    "  font-family: " + ui.fontFamily + ";",
    "  font-size: 1rem;",
    "  line-height: 1.35;",
    "  text-decoration: none;",
    "  cursor: pointer;",
    "}",
    "@media (hover: hover) and (pointer: fine) {",
    "  .wiki-back-btn:hover { background: var(--accent-strong); border-color: var(--accent-strong); }",
    "}",
  ].join("\n");
  return BASE_CSS + fontOverride + "\n" + extra;
}

// ── JS ────────────────────────────────────────────────────────────────────────

function buildScript(ui) {
  return [
    "(function () {",
    "  var root = document.documentElement;",
    "  var btn = document.getElementById('themeToggle');",
    "  var THEME_KEY = 'diane-wiki-theme';",
    "  var SCROLL_KEY = 'diane-wiki-index-scroll';",
    "  var FROM_KEY   = 'diane-wiki-from-index';",
    "  function applyTheme(on) {",
    "    if (on) root.setAttribute('data-theme', 'dark');",
    "    else root.removeAttribute('data-theme');",
    "    if (btn) {",
    "      btn.textContent = on ? '" + ui.darkOn + "' : '" + ui.darkOff + "';",
    "      btn.className = 'theme-toggle-button ' + (on ? 'theme-toggle-on' : 'theme-toggle-off');",
    "      btn.setAttribute('aria-pressed', on ? 'true' : 'false');",
    "      if (document.activeElement === btn) btn.blur();",
    "    }",
    "    try { sessionStorage.setItem(THEME_KEY, on ? 'dark' : 'light'); } catch(e) {}",
    "  }",
    "  function toggleTheme() { applyTheme(root.getAttribute('data-theme') !== 'dark'); }",
    "  var saved = null;",
    "  try { saved = sessionStorage.getItem(THEME_KEY); } catch(e) {}",
    "  applyTheme(saved === 'dark');",
    "  if (btn) btn.addEventListener('click', toggleTheme);",
    "  var indexPage = document.getElementById('page-index');",
    "  var allPages  = document.querySelectorAll('.wiki-page');",
    "  function showIndex() {",
    "    for (var i = 0; i < allPages.length; i++) allPages[i].classList.remove('active');",
    "    indexPage.classList.add('active');",
    "    document.title = 'Welbourne Wiki';",
    "    var fromIdx = null, y = null;",
    "    try { fromIdx = sessionStorage.getItem(FROM_KEY); y = sessionStorage.getItem(SCROLL_KEY); sessionStorage.removeItem(FROM_KEY); } catch(e) {}",
    "    if (fromIdx === '1' && y != null) {",
    "      var n = parseInt(y, 10);",
    "      if (!isNaN(n)) { requestAnimationFrame(function() { window.scrollTo(0, n); }); }",
    "    } else {",
    "      window.scrollTo(0, 0);",
    "    }",
    "  }",
    "  window.showIndex = showIndex;",
    "  window.showPage = function(stem) {",
    "    try {",
    "      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY || window.pageYOffset || 0));",
    "      sessionStorage.setItem(FROM_KEY, '1');",
    "    } catch(e) {}",
    "    var target = document.getElementById('page-' + stem);",
    "    if (!target) return;",
    "    for (var i = 0; i < allPages.length; i++) allPages[i].classList.remove('active');",
    "    target.classList.add('active');",
    "    document.title = target.getAttribute('data-title') + ' | Welbourne Wiki';",
    "    window.scrollTo(0, 0);",
    "  };",
    "  showIndex();",
    "  document.addEventListener('keydown', function(e) {",
    "    if (e.ctrlKey || e.metaKey || e.altKey) return;",
    "    var tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';",
    "    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;",
    "    if (e.repeat) return;",
    "    if (e.key === 'd' || e.key === 'D') { e.preventDefault(); toggleTheme(); }",
    "    if (e.key === 'b' || e.key === 'B') { e.preventDefault(); showIndex(); }",
    "  });",
    "})();",
  ].join("\n");
}

// ── Index content ─────────────────────────────────────────────────────────────

function buildIndexEN(wikiDir) {
  const indexHtml = fs.readFileSync(path.join(wikiDir, "index.html"), "utf8");
  const m = indexHtml.match(/<div id="box" class="wiki-box">([\s\S]*?)<\/div>\s*\n<\/div>/);
  if (!m) throw new Error("Could not parse index.html box content");
  let content = m[1].trim();
  // Patch article links to use showPage()
  content = content.replace(
    /href="(\d{2}_[^.]+)\.html"/g,
    (_, stem) => "href=\"#\" onclick=\"showPage('" + stem + "'); return false;\""
  );
  return content;
}

function buildTable(mdRows, cls) {
  const rows = mdRows.trim().split("\n").filter((r) => !/^\|\s*[-:| ]+\s*\|/.test(r));
  const clsAttr = cls ? " class=\"" + cls + "\"" : "";
  return (
    "<table" + clsAttr + ">" +
    rows.map((r, idx) => {
      const cells = r.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
      const tag = idx === 0 ? "th" : "td";
      return "<tr>" + cells.map((c) => "<" + tag + ">" + inlineFormat(c) + "</" + tag + ">").join("") + "</tr>";
    }).join("") +
    "</table>"
  );
}

function buildIndexFromReadme(wikiDir) {
  const readme = fs.readFileSync(path.join(wikiDir, "README.md"), "utf8");

  // H1 = wiki title
  const titleMatch = readme.match(/^# (.+)$/m);
  const wikiTitle = titleMatch ? titleMatch[1].trim() : "Welbourne Wiki";

  // Lead: first non-empty paragraph after H1, EXCLUDING meta sentences
  // Meta sentences are those about "encyclopedic register", "clinical terms", file order notes
  const META_PATTERNS = [
    /百科语体|百科語調|encyclopédique|enciclopédico/,
    /临床用语|臨床用語|termes cliniques|términos clínicos/,
    /文件编号|文件編號|La numeraci|La num/,
    /文风为|文體採/,
  ];
  const afterTitle = readme.replace(/^# .+\n/, "");
  const leadLines = [];
  for (const line of afterTitle.split("\n")) {
    if (/^##/.test(line)) break; // stop at first section heading
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (META_PATTERNS.some((p) => p.test(trimmed))) continue;
    leadLines.push(trimmed);
  }
  const leadHtml = leadLines.map((l) => inlineFormat(l)).join(" ");

  // Section headings
  const sectionHeadings = [...readme.matchAll(/^## (.+)$/mg)].map((m) => m[1].trim());
  const castHeading = sectionHeadings[0] || "Cast";
  const articlesHeading = sectionHeadings[1] || "Articles";
  const placesHeading = sectionHeadings[2] || "Places";

  // Cast table (first markdown table)
  const castMatch = readme.match(/## [^\n]+\n\n((?:\|[^\n]+\n)+)/);
  const castTable = castMatch ? buildTable(castMatch[1], "wiki-cast") : "";

  // Articles list (numbered markdown list)
  const articlesMatch = readme.match(/## [^\n]+\n\n((?:\d+\. \[.+?\]\(.+?\)\n?)+)/g);
  let articlesList = "";
  if (articlesMatch) {
    const block = articlesMatch[0];
    const liLines = block.split("\n").filter((l) => /^\d+\. \[/.test(l));
    const items = liLines.map((line) => {
      const m2 = line.match(/^\d+\. \[(.+?)\]\((\d{2}_[^/.)]+)/);
      if (!m2) return "";
      return "<li><a href=\"#\" onclick=\"showPage('" + m2[2] + "'); return false;\">" + escapeHtml(m2[1]) + "</a></li>";
    }).filter(Boolean);
    articlesList = "<ol class=\"wiki-articles\">\n" + items.join("\n") + "\n</ol>";
  }

  // Places table (last markdown table)
  const allTables = [...readme.matchAll(/((?:\|[^\n]+\n)+)/g)];
  const placesTable = allTables.length > 1 ? buildTable(allTables[allTables.length - 1][1], "") : "";

  return [
    "<h1>" + escapeHtml(wikiTitle) + "</h1>",
    leadHtml ? "<p class=\"wiki-lead\">" + leadHtml + "</p>" : "",
    "<h2>" + escapeHtml(castHeading) + "</h2>",
    castTable,
    "<h2>" + escapeHtml(articlesHeading) + "</h2>",
    articlesList,
    "<h2>" + escapeHtml(placesHeading) + "</h2>",
    placesTable,
  ].filter(Boolean).join("\n");
}

// ── Build one lang ────────────────────────────────────────────────────────────

const ARTICLES = [
  { stem: "01_welbourne" },
  { stem: "02_simon_hartley" },
  { stem: "03_diane_ellison" },
  { stem: "04_molly_yates" },
  { stem: "05_bruno_palmer" },
  { stem: "06_robert_miles" },
  { stem: "07_daniel_hartley" },
  { stem: "08_chloe_hollis" },
  { stem: "09_amanda_marlow" },
  { stem: "10_debbie_croft" },
  { stem: "11_other_characters" },
];

function getDisplayTitle(content) {
  const m = content.match(/<h1>([^<]+)<\/h1>/);
  if (!m) return "";
  return m[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
}

function buildLang(lang) {
  const ui = LANG_UI[lang];
  if (!ui) { console.error("Unknown lang:", lang); return; }

  const wikiDir = path.join(ROOT, "outputs", lang, "wiki");
  const out = path.join(ROOT, "outputs", lang, "wiki_" + lang + ".html");
  const isEN = lang === "en";

  // Index
  let indexContent;
  if (isEN) {
    indexContent = buildIndexEN(wikiDir);
  } else {
    const readmePath = path.join(wikiDir, "README.md");
    if (!fs.existsSync(readmePath)) { console.warn("  no README.md for", lang); return; }
    indexContent = buildIndexFromReadme(wikiDir);
  }

  // Articles
  const articleDivs = [];
  for (const a of ARTICLES) {
    let content;
    if (isEN) {
      const htmlPath = path.join(wikiDir, a.stem + ".html");
      if (!fs.existsSync(htmlPath)) { console.warn("  missing", htmlPath); continue; }
      const html = fs.readFileSync(htmlPath, "utf8");
      const m = html.match(/<div id="box" class="wiki-box">([\s\S]*?)<div class="nav-row/);
      if (!m) { console.warn("  could not parse", htmlPath); continue; }
      content = m[1].trim().replace(/<p class="wiki-crumb">[\s\S]*?<\/p>\s*/, "");
    } else {
      const mdPath = path.join(wikiDir, a.stem + ".md");
      if (!fs.existsSync(mdPath)) { console.warn("  missing", mdPath); continue; }
      content = mdToHtml(fs.readFileSync(mdPath, "utf8"));
    }

    const displayTitle = getDisplayTitle(content) || a.stem;

    articleDivs.push([
      "<div class=\"wiki-page\" id=\"page-" + a.stem + "\" data-title=\"" + escapeHtml(displayTitle) + "\">",
      content,
      "<div class=\"wiki-back-row\"><button class=\"wiki-back-btn\" onclick=\"showIndex()\">" + ui.backLabel + "</button></div>",
      "</div>",
    ].join("\n"));
  }

  const CSS = buildFullCss(ui);
  const SCRIPT = buildScript(ui);

  const output = [
    "<!DOCTYPE html>",
    "<html lang=\"" + ui.htmlLang + "\">",
    "<head>",
    "<meta charset=\"UTF-8\">",
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">",
    "<title>Welbourne Wiki</title>",
    "<style>",
    CSS,
    "</style>",
    "</head>",
    "<body>",
    "<div class=\"game-shell\">",
    "  <div class=\"game-toolbar\">",
    "    <button type=\"button\" id=\"themeToggle\" class=\"theme-toggle-button theme-toggle-off\" aria-pressed=\"false\">" + ui.darkOff + "</button>",
    "  </div>",
    "  <div id=\"box\" class=\"wiki-box\">",
    "",
    "    <div class=\"wiki-page active\" id=\"page-index\">",
    indexContent,
    "    </div>",
    "",
    articleDivs.join("\n\n"),
    "",
    "  </div>",
    "</div>",
    "<script>",
    SCRIPT,
    "</script>",
    "</body>",
    "</html>",
  ].join("\n");

  fs.writeFileSync(out, output);
  console.log("Written:", path.relative(ROOT, out), "(" + Math.round(output.length / 1024) + " KB)");
}

// ── Main ──────────────────────────────────────────────────────────────────────

const ALL_LANGS = ["en", "cn", "tw", "es", "fr"];
const arg = process.argv[2];

if (arg === "--all") {
  for (const lang of ALL_LANGS) buildLang(lang);
} else {
  buildLang(arg || "en");
}
