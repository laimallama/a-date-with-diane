#!/usr/bin/env node
// Visual verification uses exact core parity; route logic is tested once by ADWD.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");
const ROOT = path.resolve(__dirname, "..");
const { EDITIONS, LANGUAGES, buildAll, coreScript } = require("./build_visual_edition.js");
buildAll({ check: true });
const catalogs = Object.fromEntries(
  LANGUAGES.map((locale) => [
    locale,
    JSON.parse(fs.readFileSync(path.join(ROOT, `source/visual-ui/${locale}.json`), "utf8")),
  ]),
);
function keys(object, prefix = "") {
  return Object.entries(object)
    .flatMap(([key, value]) =>
      typeof value === "object" ? keys(value, prefix + key + ".") : [prefix + key],
    )
    .sort();
}
const referenceKeys = keys(catalogs.en);
let localizedChromeChecks = 0;
for (const [locale, catalog] of Object.entries(catalogs)) {
  assert.deepEqual(keys(catalog), referenceKeys, "Complete visual locale: " + locale);
  assert(catalog.volume.includes("{value}"), "Localized volume placeholder");
}
for (const edition of EDITIONS) {
  const html = fs.readFileSync(path.join(ROOT, edition.output), "utf8");
  const source = fs.readFileSync(path.join(ROOT, edition.input), "utf8");
  assert.equal(
    coreScript(html),
    coreScript(source),
    "Unchanged game logic, story, translations and Gallery: " + edition.output,
  );
  assert.match(html, /^<!DOCTYPE html>/i);
  assert.match(html, /<html lang="[^"]+">/);
  for (const [, code] of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))
    new vm.Script(code, { filename: edition.output });
  const gallery = JSON.parse(coreScript(html).match(/const GALLERY_DATA = (\{[\s\S]*?\});/)[1]);
  const count = (kind) =>
    gallery[kind].reduce((sum, item) => sum + (item.variants || [item]).length, 0);
  assert.equal(count("endings"), 15);
  assert.equal(count("hiddenScenes"), 32);
  const outputs = fs
    .readdirSync(path.dirname(path.join(ROOT, edition.output)))
    .filter((name) => /^dianedate_visual_.*\.html$/.test(name));
  const expected = EDITIONS.filter((other) => other.locale === edition.locale).map((other) =>
    path.basename(other.output),
  );
  assert.deepEqual(outputs.sort(), expected.sort(), "No stale visual editions");
  if (["de", "ja"].includes(edition.locale)) {
    // Exercise the compiled localization module without claiming browser layout
    // coverage. The canonical verifier separately checks numeric formatting.
    const nodes = new Map();
    const node = (id) => {
      if (!nodes.has(id))
        nodes.set(id, {
          textContent: "",
          style: {},
          attrs: {},
          classList: { toggle() {} },
          setAttribute(key, value) {
            this.attrs[key] = value;
          },
        });
      return nodes.get(id);
    };
    const labels = referenceKeys
      .filter((key) => !key.includes("."))
      .map((key) => ({ dataset: { visualText: key } }));
    const context = {
      document: {
        title: "",
        getElementById: node,
        querySelector: node,
        querySelectorAll: () => labels,
      },
      currentLanguage: "alt",
      darkMode: false,
      gameHistory: [{}],
      guideActive: true,
      guideOn: true,
      pounds: 13.5,
      luckshots: 2,
      canSkipToClimax: () => true,
      formatPounds: () => "amount",
    };
    context.window = context;
    vm.createContext(context);
    for (const id of ["adwd-visual-config", "adwd-i18n"])
      vm.runInContext(
        html.match(new RegExp(`<script id="${id}">([\\s\\S]*?)<\\/script>`))[1],
        context,
      );
    for (const language of edition.bilingual ? ["alt", "en", "alt"] : ["alt"])
      for (const dark of [false, true]) {
        context.currentLanguage = language;
        context.darkMode = dark;
        const locale = language === "en" ? "en" : edition.locale;
        const local = catalogs[locale];
        context.ADWDVisualUI.syncChrome();
        assert.equal(context.ADWDVisualUI.language(), locale);
        assert.equal(node("galleryToggle").textContent, local.gallery);
        assert.equal(node("themeToggle").textContent, local[dark ? "darkOn" : "darkOff"]);
        assert.equal(node("backBtn").textContent, local.back);
        assert.equal(node("skipBtn").textContent, local.skip);
        assert.equal(node("visualGuide").textContent, local.guideOn);
        assert.equal(node("stageRec").attrs["aria-label"], local.replay);
        assert.equal(
          context.document.title,
          local[edition.bilingual ? "visualBilingualTitle" : "visualTitle"],
        );
        for (const label of labels)
          assert.equal(label.textContent, local[label.dataset.visualText]);
        assert.equal(node("currencyPrefix").textContent, locale === "en" ? "£ " : "");
        assert.equal(
          node("currencySuffix").textContent,
          locale === "de" ? "\u00a0£" : locale === "ja" ? "ポンド" : "",
        );
        assert.equal(node("coins").attrs["aria-label"], local.luckshots + local.separator + "2");
        assert.equal(context.pounds, 13.5);
        assert.equal(context.luckshots, 2);
        assert.equal(context.gameHistory.length, 1);
        localizedChromeChecks++;
      }
  }
}
const c = {};
vm.createContext(c);
vm.runInContext(fs.readFileSync(path.join(ROOT, "source/visual/scene-map.js"), "utf8"), c);
const expected = {
  carparka1: "carpark",
  start: "title",
  start2: "street",
  traintalk: "restaurant",
  traintalka: "riverside",
  luckytrip3: "bridge",
  luckytrip3a: "bridge",
  luckytrip31: "home",
  luckytrip31a: "home",
  luckytrip19: "night",
  luckytrip19a: "night",
  searchdiane: "night",
  goleft: "night",
  buywaterfoyer: "foyer",
  buywaterpav: "pavilion",
  ontoilet1: "bathroom",
  ontoilet2: "home",
  fifthplace: "home",
  luckytrip18: "home",
  luckytrip18a: "home",
  luckytrip20: "home",
  luckytrip20a: "home",
};
for (const day of ["tuesday", "thursday", "saturday"]) {
  Object.assign(c, {
    tuesday: day === "tuesday",
    thursday: day === "thursday",
    saturday: day === "saturday",
  });
  for (const tag of ["gothere", "flirt_l", "flirt_m", "flirt_h"]) {
    assert.equal(
      c.ADWDSceneMap.locationFor(tag).id,
      day === "saturday" ? "theatre" : "foyer",
      "Theatre meeting before the restaurant: " + day + "/" + tag,
    );
  }
  assert.equal(
    c.ADWDSceneMap.locationFor("winelist").id,
    "restaurant",
    "Restaurant starts with the menu",
  );
}
for (const [tag, location] of Object.entries(expected))
  assert.equal(c.ADWDSceneMap.locationFor(tag).id, location, tag);
assert(c.ADWDSceneMap.isPrizeTag("fifthplace"), "Fifth-prize screen is recognized");
assert(c.ADWDSceneMap.isSilentEmpty("fifthplace"), "Prize screen does not start a clip");
assert(
  c.ADWDSceneMap.peeBeat("ontoilet1", c.ADWDSceneMap.castFor("ontoilet1")),
  "Preceding bathroom clip is retained",
);
for (const tag of ["ontoilet2", "fifthplace"])
  assert.equal(
    c.ADWDSceneMap.peeBeat(tag, c.ADWDSceneMap.castFor(tag)),
    null,
    "No lingering clip on " + tag,
  );
for (const [tag, actor] of [
  ["underbridge", "diane"],
  ["underbridge2", "molly"],
  ["underbridgea", "molly"],
  ["underbridge2a", "diane"],
]) {
  const cast = c.ADWDSceneMap.castFor(tag);
  assert.equal(c.ADWDSceneMap.locationFor(tag).id, "bridge");
  assert.equal(cast.primary, "diane");
  assert.equal(cast.secondary, "molly");
  assert.deepEqual(
    Array.from(c.ADWDSceneMap.peeBeat(tag, cast).keys),
    [actor],
    "Bridge actor order: " + tag,
  );
}
assert.equal(c.ADWDSceneMap.castFor("luckytrip3a").secondary, "molly");
assert.equal(c.ADWDSceneMap.peeBeat("underbridge3", c.ADWDSceneMap.castFor("underbridge3")), null);
execFileSync(process.execPath, [path.join(ROOT, "maintenance/verify_visual_support.js")], {
  stdio: "inherit",
});
execFileSync(process.execPath, [path.join(ROOT, "maintenance/verify_visual_runtime.js")], {
  stdio: "inherit",
});
console.log(
  `PASS: ${EDITIONS.length} byte-identical game cores, ${localizedChromeChecks} new-locale chrome/theme/language cases, complete visual catalogs, script syntax, scene regressions, visual assets and adapter runtime checks. Browser rendering is checked separately.`,
);
