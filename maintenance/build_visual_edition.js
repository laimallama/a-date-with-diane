#!/usr/bin/env node
/** Builds registered visual editions around byte-identical canonical game scripts. */
const fs = require("node:fs");
const path = require("node:path");
const ROOT = path.resolve(__dirname, "..");
const locales = JSON.parse(fs.readFileSync(path.join(ROOT, "source/editions.json"), "utf8"));
const LANGUAGES = Object.keys(locales);
const EDITIONS = LANGUAGES.flatMap((locale) =>
  (locale === "en" ? [false] : [false, true]).map((bilingual) => {
    const suffix = locale + (bilingual ? "_bilingual" : "");
    return {
      locale,
      bilingual,
      input: `outputs/${locale}/dianedate_${suffix}.html`,
      output: `outputs/${locale}/dianedate_visual_${suffix}.html`,
    };
  }),
);
const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
function replaceRequired(source, search, replacement) {
  if (!search.test(source)) throw Error("Missing visual build anchor: " + search);
  return source.replace(search, () => replacement);
}
function coreScript(html) {
  const match = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i);
  if (!match) throw Error("Missing core game script");
  return match[1];
}
function inputs() {
  const catalogs = Object.fromEntries(
    LANGUAGES.map((locale) => [
      locale,
      JSON.parse(fs.readFileSync(path.join(ROOT, `source/visual-ui/${locale}.json`), "utf8")),
    ]),
  );
  const meta = JSON.parse(read("source/visual/puddle_meta.json"));
  for (const [clip, info] of Object.entries(meta.clips)) {
    const bank = path.join(ROOT, "assets/fx/grow_frames", clip.replace("/", "_") + "_grow");
    const frames = fs
      .readdirSync(bank)
      .filter((name) => /\.png$/i.test(name))
      .sort();
    const expected = frames.map((_, index) => String(index).padStart(2, "0") + ".png").sort();
    if (!frames.length || frames.some((name, index) => name !== expected[index]))
      throw Error("Non-contiguous puddle frames: " + bank);
    info.growFrames = frames.length;
  }
  return {
    catalogs,
    meta,
    shell: read("source/visual/shell.html"),
    css: read("source/visual/shell.css"),
    modules: ["i18n", "scene-map", "puddle-sync", "adapter"].map(
      (name) => `<script id="adwd-${name}">\n${read(`source/visual/${name}.js`)}\n</script>`,
    ),
  };
}
function build(edition, shared = inputs()) {
  const original = fs.readFileSync(path.join(ROOT, edition.input), "utf8");
  let html = original;
  const catalog = shared.catalogs[edition.locale];
  const title = catalog[edition.bilingual ? "visualBilingualTitle" : "visualTitle"];
  const visualCss =
    shared.css +
    (edition.locale === "ja"
      ? '\nhtml[lang="ja"] body.visual-edition { --font-visual: var(--cjk-font); }\n'
      : "");
  html = replaceRequired(html, /<title>[^<]*<\/title>/i, `<title>${title}</title>`);
  html = replaceRequired(
    html,
    /<\/head>/i,
    `<style id="visual-shell-css">\n${visualCss}\n</style>\n</head>`,
  );
  html = html.replace(
    /<body([^>]*)>/i,
    (_, attrs) =>
      `<body${/class=/.test(attrs) ? attrs.replace(/class="([^"]*)"/, 'class="$1 visual-edition"') : attrs + ' class="visual-edition"'}>`,
  );
  const languageButton = edition.bilingual
    ? '<button id="languageToggle" class="language-toggle-button theme-toggle-button" onclick="toggleLanguage()" type="button">English</button>'
    : "";
  const shell = shared.shell.replace(
    /^[ \t]*\{\{languageButton\}\}\n/m,
    languageButton ? `      ${languageButton}\n` : "",
  );
  html = replaceRequired(
    html,
    /^[ \t]*<div class="game-shell">[\s\S]*?<div id="box"[^>]*><\/div>\s*<\/div>/m,
    shell,
  );
  const config = {
    locale: edition.locale,
    bilingual: edition.bilingual,
    catalogs: Object.fromEntries(
      [...new Set(["en", edition.locale])].map((key) => [key, shared.catalogs[key]]),
    ),
  };
  const json = (value) => JSON.stringify(value).replace(/</g, "\\u003c");
  // Locale additions are compiled only into the new editions. Existing
  // releases retain their original scripts and presentation byte for byte.
  const modules = shared.modules.map((originalScript) => {
    if (!originalScript.startsWith('<script id="adwd-i18n">')) return originalScript;
    let script = originalScript;
    if (locales[edition.locale].decimalComma)
      script = replaceRequired(
        script,
        /var comma = language\(\) === "es" \|\| language\(\) === "fr";/,
        `var comma = language() === "es" || language() === "fr" || language() === ${JSON.stringify(edition.locale)};`,
      );
    if (locales[edition.locale].currencySuffix) {
      script = replaceRequired(
        script,
        /label\("currencyPrefix", comma \? "" : "£ "\);/,
        `var localCurrency = language() === ${JSON.stringify(edition.locale)};\n    label("currencyPrefix", localCurrency || comma ? "" : "£ ");`,
      );
      script = replaceRequired(
        script,
        /label\("currencySuffix", comma \? "\\u00a0£" : ""\);/,
        `label("currencySuffix", localCurrency ? ${JSON.stringify(locales[edition.locale].currencySuffix)} : comma ? "\\u00a0£" : "");`,
      );
    }
    return script;
  });
  html = replaceRequired(
    html,
    /<\/body>/i,
    `<script id="adwd-visual-config">\nwindow.ADWD_VISUAL_CONFIG = ${json(config)};\nwindow.ADWD_PUDDLE_META = ${json(shared.meta)};\n</script>\n${modules.join("\n")}\n</body>`,
  );
  if (coreScript(html) !== coreScript(original))
    throw Error("Visual build modified game script: " + edition.input);
  return html;
}
function buildAll({ check = false, locale = null } = {}) {
  if (locale && !LANGUAGES.includes(locale)) throw Error("Unknown visual locale");
  const shared = inputs();
  const selected = EDITIONS.filter((edition) => !locale || edition.locale === locale);
  for (const edition of selected) {
    const html = build(edition, shared);
    const output = path.join(ROOT, edition.output);
    if (check) {
      if (!fs.existsSync(output) || fs.readFileSync(output, "utf8") !== html)
        throw Error("Stale visual edition: " + edition.output);
    } else {
      fs.mkdirSync(path.dirname(output), { recursive: true });
      fs.writeFileSync(output, html);
    }
  }
  console.log(
    `${check ? "Verified" : "Built"} ${selected.length} visual editions; canonical game scripts unchanged.`,
  );
}
if (require.main === module) {
  const check = process.argv.includes("--check");
  const locale = process.argv.find((arg) => arg.startsWith("--lang="))?.slice(7);
  buildAll({ check, locale });
}
module.exports = { EDITIONS, LANGUAGES, buildAll, coreScript };
