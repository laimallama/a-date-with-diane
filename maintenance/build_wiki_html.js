#!/usr/bin/env node
/**
 * Build multi-page EN-style wiki HTML (game chrome) from per-article markdown,
 * if present. EN wiki is HTML-only now — edit the HTML files directly.
 *
 * Usage: node maintenance/build_wiki_html.js [lang]
 * For langs that still have *.md article sources.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const LANG = process.argv[2] || "en";
const WIKI_DIR = path.join(ROOT, "outputs", LANG, "wiki");

const ARTICLES = [
  { stem: "01_welbourne", title: "Welbourne" },
  { stem: "02_simon_hartley", title: "Simon Hartley" },
  { stem: "03_diane_ellison", title: "Diane Ellison" },
  { stem: "04_molly_yates", title: "Molly Yates" },
  { stem: "05_bruno_palmer", title: "Bruno Palmer" },
  { stem: "06_robert_miles", title: "Robert Miles" },
  { stem: "07_daniel_hartley", title: "Daniel Hartley" },
  { stem: "08_chloe_hollis", title: "Chloe Hollis" },
  { stem: "09_amanda_marlow", title: "Amanda Marlow" },
  { stem: "10_debbie_croft", title: "Debbie Croft" },
  { stem: "11_other_characters", title: "Other characters" },
];

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineFormat(text) {
  let s = escapeHtml(text);
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    const h = href.replace(/\.md(#.*)?$/i, ".html$1");
    return `<a href="${h}">${label}</a>`;
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
    if (t) out.push(`<p>${inlineFormat(t)}</p>`);
    para.length = 0;
  }
  while (i < lines.length) {
    const line = lines[i];
    if (/^\|/.test(line)) {
      flushPara();
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        rows.push(lines[i]);
        i++;
      }
      const body = rows.filter((r) => !/^\|\s*[-:| ]+\s*\|/.test(r));
      if (body.length) {
        out.push("<table>");
        body.forEach((r, idx) => {
          const cells = r
            .replace(/^\|/, "")
            .replace(/\|$/, "")
            .split("|")
            .map((c) => c.trim());
          const tag = idx === 0 ? "th" : "td";
          out.push(
            "<tr>" +
              cells.map((c) => `<${tag}>${inlineFormat(c)}</${tag}>`).join("") +
              "</tr>"
          );
        });
        out.push("</table>");
      }
      continue;
    }
    if (/^### /.test(line)) {
      flushPara();
      out.push(`<h3>${inlineFormat(line.slice(4).trim())}</h3>`);
      i++;
      continue;
    }
    if (/^## /.test(line)) {
      flushPara();
      out.push(`<h2>${inlineFormat(line.slice(3).trim())}</h2>`);
      i++;
      continue;
    }
    if (/^# /.test(line)) {
      flushPara();
      out.push(`<h1>${inlineFormat(line.slice(2).trim())}</h1>`);
      i++;
      continue;
    }
    if (!line.trim()) {
      flushPara();
      i++;
      continue;
    }
    para.push(line.trim());
    i++;
  }
  flushPara();
  return out.join("\n");
}

function css() {
  return fs.readFileSync(path.join(ROOT, "outputs/en/wiki/wiki.css"), "utf8");
}

function pageShell({ title, body, showBack }) {
  const crumb = showBack
    ? `    <p class="wiki-crumb"><a href="index.html">Wiki</a><span class="sep">/</span><span class="here">${escapeHtml(title)}</span></p>\n`
    : "";
  const back = showBack
    ? `    <div class="nav-row wiki-nav">
      <a class="back-button" href="index.html">Back to Menu</a>
    </div>\n`
    : "";
  const scrollJs = showBack
    ? ""
    : `
  var SCROLL_KEY = "diane-wiki-index-scroll";
  var FROM_KEY = "diane-wiki-from-index";
  function saveScroll() {
    try {
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY || window.pageYOffset || 0));
    } catch (e) {}
  }
  function leaveForArticle() {
    saveScroll();
    try { sessionStorage.setItem(FROM_KEY, "1"); } catch (e) {}
  }
  function restoreSoon() {
    var fromIndex = null;
    var y = null;
    try {
      fromIndex = sessionStorage.getItem(FROM_KEY);
      y = sessionStorage.getItem(SCROLL_KEY);
      if (fromIndex === "1") sessionStorage.removeItem(FROM_KEY);
    } catch (e) {}
    if (fromIndex !== "1") return;
    var n = parseInt(y, 10);
    if (isNaN(n)) return;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    function go() { window.scrollTo(0, n); }
    go();
    requestAnimationFrame(go);
  }
  var links = document.querySelectorAll("ol.wiki-articles a");
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", leaveForArticle);
  }
  if (document.readyState === "complete") restoreSoon();
  else window.addEventListener("load", restoreSoon);
  window.addEventListener("pageshow", restoreSoon);
`;
  return `<!DOCTYPE html>
<html lang="${LANG}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${escapeHtml(title)} — Welbourne Wiki</title>
<link rel="stylesheet" href="wiki.css">
</head>
<body>
<div class="game-shell">
  <div class="game-toolbar">
    <button type="button" id="themeToggle" class="theme-toggle-button theme-toggle-off" aria-pressed="false">Dark Mode: Off</button>
  </div>
  <div id="box" class="wiki-box">
${crumb}    ${body.split("\n").join("\n    ")}
${back}  </div>
</div>
<script>
(function () {
  var root = document.documentElement;
  var btn = document.getElementById("themeToggle");
  function apply(on) {
    if (on) root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    if (btn) {
      btn.textContent = on ? "Dark Mode: On" : "Dark Mode: Off";
      btn.className = "theme-toggle-button " + (on ? "theme-toggle-on" : "theme-toggle-off");
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    }
    try { sessionStorage.setItem("diane-wiki-theme", on ? "dark" : "light"); } catch (e) {}
  }
  function toggleTheme() {
    apply(root.getAttribute("data-theme") !== "dark");
  }
  var saved = null;
  try { saved = sessionStorage.getItem("diane-wiki-theme"); } catch (e) {}
  apply(saved === "dark");
  if (btn) btn.addEventListener("click", toggleTheme);
${scrollJs}
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
    if (tag === "input" || tag === "textarea" || tag === "select") return;
    if (e.repeat) return;
    if (e.key === "d" || e.key === "D") {
      e.preventDefault();
      toggleTheme();
      return;
    }
    if (e.key === "b" || e.key === "B") {
      var back = document.querySelector("a.back-button");
      if (!back) return;
      e.preventDefault();
      window.location.href = back.href;
    }
  });
})();
</script>
</body>
</html>
`;
}

function buildIndexFront() {
  const castRows = [
    ["You", "Simon Hartley", "27"],
    ["Diane", "Diane Ellison", "25"],
    ["Molly", "Molly Yates", "25"],
    ["Bruno", "Bruno Palmer", "35"],
    ["Robert", "Robert Miles", "60"],
    ["Your brother", "Daniel Hartley", "18"],
    ["Chloe", "Chloe Hollis", "18"],
    ["Amanda", "Amanda Marlow", "18"],
    ["Debbie (the brunette)", "Debbie Croft", "23"],
    ["Debbie’s boyfriend", "Craig Flynn", "25"],
  ];
  const places = [
    ["Welbourne", "Town"],
    ["River Bourne", "River"],
    ["Waterfront Theatre", "Theatre"],
    ["Golden Stream Inn", "Pub"],
    ["The Pavilion", "Pub"],
    ["Pisa Pizzeria", "Restaurant"],
    ["Beck & Partners", "Estate agency"],
    ["Welbourne Players", "Amateur dramatic society"],
    ["Welbourne College", "Sixth-form college"],
  ];
  const articlesTable =
    '<ol class="wiki-articles">' +
    ARTICLES.map(
      (a) => `<li><a href="${a.stem}.html">${escapeHtml(a.title)}</a></li>`
    ).join("\n") +
    "</ol>";
  const castTable =
    '<table class="wiki-cast"><tr><th>Game text</th><th>Name</th><th>Age</th></tr>' +
    castRows
      .map(
        (r) =>
          `<tr><td>${escapeHtml(r[0])}</td><td>${escapeHtml(r[1])}</td><td>${escapeHtml(r[2])}</td></tr>`
      )
      .join("") +
    "</table>";
  const placesTable =
    "<table><tr><th>Name</th><th>Type</th></tr>" +
    places
      .map(
        (r) =>
          `<tr><td>${escapeHtml(r[0])}</td><td>${escapeHtml(r[1])}</td></tr>`
      )
      .join("") +
    "</table>";
  return `<h1>Welbourne Wiki</h1>
<p class="wiki-lead">Setting and character notes for <em>A Date With Diane</em>. The articles cover <strong>Welbourne</strong> and the people around Simon Hartley and Diane Ellison’s first date there in early summer 2005.</p>
<h2>Cast</h2>
${castTable}
<h2>Articles</h2>
${articlesTable}
<h2>Places</h2>
${placesTable}`;
}

function main() {
  if (!fs.existsSync(WIKI_DIR)) {
    console.error("Missing", WIKI_DIR);
    process.exit(1);
  }
  const mdCount = ARTICLES.filter((a) =>
    fs.existsSync(path.join(WIKI_DIR, a.stem + ".md"))
  ).length;
  if (mdCount === 0) {
    console.log(
      LANG,
      "has no article markdown — EN-style wiki is HTML source of truth. Nothing to build."
    );
    process.exit(0);
  }

  // Prefer copying EN css if this lang has none yet
  const cssPath = path.join(WIKI_DIR, "wiki.css");
  const enCss = path.join(ROOT, "outputs/en/wiki/wiki.css");
  if (fs.existsSync(enCss)) fs.copyFileSync(enCss, cssPath);

  fs.writeFileSync(
    path.join(WIKI_DIR, "index.html"),
    pageShell({ title: "Welbourne Wiki", body: buildIndexFront(), showBack: false })
  );

  for (const a of ARTICLES) {
    const mdPath = path.join(WIKI_DIR, a.stem + ".md");
    if (!fs.existsSync(mdPath)) continue;
    const body = mdToHtml(fs.readFileSync(mdPath, "utf8"));
    fs.writeFileSync(
      path.join(WIKI_DIR, a.stem + ".html"),
      pageShell({ title: a.title, body, showBack: true })
    );
    fs.unlinkSync(mdPath);
    console.log("wrote", a.stem + ".html", "(removed .md)");
  }
  const readme = path.join(WIKI_DIR, "README.md");
  if (fs.existsSync(readme)) fs.unlinkSync(readme);
  console.log("OK", LANG);
}

main();
