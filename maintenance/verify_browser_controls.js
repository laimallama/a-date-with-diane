#!/usr/bin/env node
"use strict";

// Real-browser regression for navigation controls and modal isolation.
// Requires Playwright (or playwright-core with its matching browser installs).
// ADWD_PLAYWRIGHT_MODULE may point at an existing package outside this checkout.
// Example: ADWD_PLAYWRIGHT_MODULE=/path/to/playwright-core node maintenance/verify_browser_controls.js
// Optional: --engines=chromium,firefox,webkit --editions=en,fr-bilingual,visual --output=/path/results.json --currency
// --currency-only runs the synthetic currency display cases without repeating the controls suite.
// --focus-only checks keyboard focus styling without repeating the controls suite.
// --choices-only checks real choice grouping and Back on two normal-play routes.
// --localization-only checks visual labels, layout and bilingual switches during animation.
const fs = require("fs");
const path = require("path");
const assert = require("assert/strict");
const { pathToFileURL } = require("url");
let playwright;
if (process.env.ADWD_PLAYWRIGHT_MODULE) playwright = require(process.env.ADWD_PLAYWRIGHT_MODULE);
else {
  try {
    playwright = require("playwright");
  } catch (e) {
    try {
      playwright = require("playwright-core");
    } catch (missing) {
      throw new Error(
        "Install Playwright and its browsers, or set ADWD_PLAYWRIGHT_MODULE to an existing package.",
      );
    }
  }
}
const arg = (name) => process.argv.find((x) => x.startsWith(`--${name}=`))?.slice(name.length + 3);
const root = path.resolve(__dirname, "..");
const visualRoot = process.env.ADWD_VISUAL_ROOT || path.resolve(root, "../ADWD-visual");
const languages = Object.keys(require("../source/editions.json"));
const engines = (arg("engines") === undefined ? "chromium,firefox,webkit" : arg("engines"))
  .split(",")
  .map((x) => x.trim());
const requested = arg("editions")
  ?.split(",")
  .map((x) => x.trim());
const currencyOnly = process.argv.includes("--currency-only");
const focusOnly = process.argv.includes("--focus-only");
const choicesOnly = process.argv.includes("--choices-only");
const localizationOnly = process.argv.includes("--localization-only");
const editions = languages.flatMap((lang) =>
  [false, true]
    .filter((bilingual) => lang !== "en" || !bilingual)
    .map((bilingual) => ({
      id: lang + (bilingual ? "-bilingual" : ""),
      bilingual,
      locale: lang,
      file: path.join(
        root,
        "outputs",
        lang,
        `dianedate_${lang}${bilingual ? "_bilingual" : ""}.html`,
      ),
    })),
);
editions.push(
  ...languages.flatMap((locale) =>
    (locale === "en" ? [false] : [false, true]).map((bilingual) => ({
      id: locale === "en" ? "visual" : "visual-" + locale + (bilingual ? "-bilingual" : ""),
      locale,
      bilingual,
      visual: true,
      file: path.join(
        visualRoot,
        `outputs/${locale}/dianedate_visual_${locale}${bilingual ? "_bilingual" : ""}.html`,
      ),
    })),
  ),
);

function validateSelection(name, selected, allowed) {
  if (!selected.length || selected.some((x) => !x || !allowed.includes(x))) {
    throw new Error(`Invalid --${name} selection. Choose from: ${allowed.join(", ")}.`);
  }
  if (new Set(selected).size !== selected.length) throw new Error(`Duplicate --${name} selection.`);
}
validateSelection("engines", engines, ["chromium", "firefox", "webkit"]);
if (requested)
  validateSelection("editions", requested, [
    ...editions.map((x) => x.id),
    ...languages.map((lang) => "wiki-" + lang),
  ]);
const results = {
  started: new Date().toISOString(),
  scope: localizationOnly
    ? "Localized visual controls/layout, active-language typography and animation-preserving bilingual switches."
    : choicesOnly
      ? "Actual single/interleaved choice screens and Back/replay in real browsers; no injected game state."
      : focusOnly
        ? "Focused visible-control styling in light and dark themes only."
        : currencyOnly
          ? "Synthetic currency display boundaries only; not reachable-route coverage."
          : "Controls, modal focus and input races; sampled layout, not exhaustive story/browser coverage.",
  engines: [],
  cases: [],
};
const save = () => {
  if (arg("output")) fs.writeFileSync(arg("output"), JSON.stringify(results, null, 2) + "\n");
};
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function read(page) {
  return page.evaluate(() => ({
    tag: currentTag,
    history: gameHistory.length,
    index: guideIndex,
    guide: guideActive,
    on: guideOn,
    theme: document.documentElement.dataset.theme || "light",
    lang: document.documentElement.lang,
    gallery: document.getElementById("galleryOverlay").classList.contains("open"),
    focus:
      document.activeElement.id ||
      document.activeElement.className ||
      document.activeElement.tagName,
    focusInGallery: document.getElementById("galleryOverlay").contains(document.activeElement),
    width: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
}
async function hiddenModalCannotFocus(page) {
  await page.locator("#galleryToggle").focus();
  await page.locator(".gallery-close").evaluate((x) => x.focus());
  assert.equal(
    (await read(page)).focusInGallery,
    false,
    "Closed Gallery must not accept keyboard focus",
  );
}
async function checkCurrency(page, edition) {
  // Synthetic display boundaries, separate from reachable-route state coverage.
  let balanceAssertions = 0,
    staticPriceAssertions = 0;
  await page.evaluate(() => {
    go("start1a");
    go("start1b");
    go("tuesdaydate");
    go("start2");
  });
  const languages = edition.bilingual ? ["en", "alt"] : [null];
  for (const language of languages) {
    if (language) await page.evaluate((language) => setLanguage(language), language);
    for (const [amount, expected] of [
      [13.5, "13.50"],
      [20, "20"],
      [6.300000000000001, "6.30"],
    ]) {
      await page.evaluate((amount) => {
        pounds = amount;
        go("gothere");
      }, amount);
      const local = !edition.bilingual || language === "alt";
      const comma = local && /^(fr|es|de)$/.test(edition.locale);
      const wanted = comma ? expected.replace(".", ",") : expected;
      const actual = edition.visual
        ? await page.locator("#pounds").textContent()
        : await page.locator(".status-row-main b:visible").first().textContent();
      assert.equal(actual, wanted, `${edition.id}/${language || "standalone"} balance ${amount}`);
      balanceAssertions++;
    }
    if (/^(fr|es)$/.test(edition.locale)) {
      // Fixed price expectations are independent of the locale formatter.
      // Direct node entry tests rendering, not reachability of these sequences.
      const screens = [
        ["start1", ["100"]],
        ["saturdaydate", ["10"]],
        ["buysth", ["100", "3", "15"]],
        ["winelist", ["12", "12", "20", "15", "12", "10"]],
        ["eatmeal", ["9", "9", "8", "7", "8", "8", "14"]],
        ["puddings", ["5", "4", "3"]],
        ["eatmeal7b", ["1", "2", "1.50"]],
        ["lethergo", ["3", "10"]],
        ["gotoo", ["3", "10"]],
        ["luckytrip0a", ["3"]],
        ["busqueue1", ["20"]],
      ];
      for (const [tag, amounts] of screens) {
        await page.evaluate((tag) => {
          pounds = 100;
          bottlewater = 0;
          brooch = 0;
          tuesday = 2;
          thursday = 0;
          saturday = 0;
          go(tag);
        }, tag);
        const text = await page.locator("#box").innerText();
        const actual =
          text.match(/£[ \u00a0\u202f]*\d+(?:[.,]\d+)?|\d+(?:[.,]\d+)?[ \u00a0\u202f]+£/g) || [];
        const localized = !edition.bilingual || language === "alt";
        // The English taxi narration spells out "20 pounds"; the translations
        // use the currency symbol. The shop also displays the current balance.
        const expectedAmounts = tag === "busqueue1" && !localized ? [] : amounts;
        const expected = expectedAmounts.map((amount) =>
          localized ? amount.replace(".", ",") + "\u00a0£" : "£" + amount,
        );
        assert.deepEqual(
          actual,
          expected,
          edition.id + "/" + (language || "standalone") + "/" + tag + " static prices",
        );
        assert(
          (await read(page)).documentWidth <= (await read(page)).width + 1,
          "Price screen overflows",
        );
        staticPriceAssertions += expectedAmounts.length;
      }
    }
  }
  return { balanceAssertions, staticPriceAssertions };
}
async function checkFocus(page, edition) {
  const selectors = ["#galleryToggle", "#themeToggle", "#box .choice"];
  if (edition.bilingual) selectors.push("#languageToggle");
  if (edition.visual) selectors.push("#vessel", "#carafe", "#tummy-label", "#blad-label");
  await page.keyboard.press("1");
  await pause(160);
  selectors.push(edition.visual ? "#backBtn" : ".back-button");
  for (const theme of ["light", "dark"]) {
    if ((await read(page)).theme !== theme) await page.evaluate(() => toggleTheme());
    await page.keyboard.press("Tab");
    for (const selector of selectors) {
      const control = page.locator(selector).filter({ visible: true }).first();
      await control.focus();
      const style = await control.evaluate((x) => ({
        focused: document.activeElement === x,
        visible: x.matches(":focus-visible"),
        outline: getComputedStyle(x).outlineStyle,
        width: getComputedStyle(x).outlineWidth,
      }));
      assert.deepEqual(
        style,
        { focused: true, visible: true, outline: "solid", width: "2px" },
        `${edition.id} ${theme} ${selector} focus indicator`,
      );
    }
  }
}
async function checkChoiceContainers(page, edition) {
  const routes = [
    {
      id: "single",
      tags: "start start1a start1b tuesdaydate start2 gothere winelist buyrioja eatmeal buyravioli".split(
        " ",
      ),
    },
    {
      id: "interleaved",
      tags: "start start1a start1b tuesdaydate start2 buysth buywater buysth gothere winelist buyrioja eatmeal buytort eatmeal5 eatmeal5a eatmeal5b eatmeal5c traintalk traintalk1 traintalk2 eatmeal7 eatmeal7a eatmeal7b espresso eatmeal7c gotheatre theatreask".split(
        " ",
      ),
    },
  ];
  const rootSelector = edition.bilingual ? "#box .lang-en" : "#box";
  async function choose(tag) {
    const options = await page.locator(rootSelector + " button.choice").evaluateAll((buttons) =>
      buttons.map((button) => ({
        tag: /go\(['"]([^'"]+)['"]\)/.exec(button.getAttribute("onclick") || "")?.[1],
      })),
    );
    const index = options.findIndex((option) => option.tag === tag);
    assert(index >= 0, "Expected actual visible choice to " + tag);
    const button = page.locator(rootSelector + " button.choice").nth(index);
    assert(await button.isVisible());
    await button.click();
    await page.waitForFunction((tag) => currentTag === tag, tag);
  }
  async function grouping(scenario) {
    const layers = await page.evaluate(() => {
      const box = document.getElementById("box");
      const roots = [...box.querySelectorAll(":scope > .lang")];
      return (roots.length ? roots : [box]).map((root) => ({
        groups: root.querySelectorAll(".choices").length,
        empty: [...root.querySelectorAll(".choices")].filter((group) => !group.children.length)
          .length,
        choices: [...root.querySelectorAll("button.choice")].map((button) => ({
          tag: /go\(['"]([^'"]+)['"]\)/.exec(button.getAttribute("onclick") || "")?.[1],
          grouped: button.parentElement.classList.contains("choices"),
        })),
        separatorInside: !!root.querySelector(".choices > hr"),
      }));
    });
    for (const layer of layers) {
      assert.equal(layer.groups, 1, "Exactly one real choice group");
      assert.equal(layer.empty, 0, "No empty wrapper left by incremental HTML parsing");
      assert(
        layer.choices.every((choice) => choice.grouped),
        "Every choice belongs to its container",
      );
      assert.equal(layer.choices.length, scenario === "single" ? 1 : 5);
      if (scenario === "interleaved") {
        assert(
          layer.separatorInside,
          "Interleaved story separator stays between choices in the group",
        );
        assert.equal(layer.choices.at(-1).tag, "testtue");
      }
    }
    return layers;
  }
  const results = [];
  for (const route of routes) {
    await page.goto(pathToFileURL(edition.file).href);
    await page.waitForFunction(() => typeof currentTag !== "undefined" && currentTag === "start");
    if (edition.bilingual && (await page.evaluate(() => currentLanguage !== "en"))) {
      await page.locator("#languageToggle").click();
      await page.waitForFunction(() => currentLanguage === "en");
    }
    for (const tag of route.tags.slice(1)) await choose(tag);
    const state = await page.evaluate(() => snapshotGame().state);
    const before = await grouping(route.id);
    const back = page.locator(edition.visual ? "#backBtn" : rootSelector + " .back-button");
    assert(await back.isVisible());
    await back.click();
    await page.waitForFunction((tag) => currentTag === tag, route.tags.at(-2));
    await choose(route.tags.at(-1));
    assert.deepEqual(
      await page.evaluate(() => snapshotGame().state),
      state,
      "Back/replay restores complete story state",
    );
    assert.deepEqual(await grouping(route.id), before, "Back/replay preserves real DOM grouping");
    results.push({ scenario: route.id, transitions: route.tags.length - 1, layers: before });
  }
  return results;
}

async function check(page, edition) {
  await page.goto(pathToFileURL(edition.file).href);
  await page.waitForFunction(() => typeof currentTag !== "undefined" && currentTag === "start");
  assert.equal((await read(page)).history, 0, "Title must start without Back history");
  await hiddenModalCannotFocus(page);
  await page.locator("#galleryToggle").focus();
  await page.keyboard.down("Enter");
  await page.waitForFunction(() =>
    document.getElementById("galleryOverlay").classList.contains("open"),
  );
  assert.equal((await read(page)).focusInGallery, true, "Opening Gallery must move focus into it");
  const galleryLayout = await page.evaluate(() => {
    const list = document.getElementById("galleryEndings");
    const rows = [
      ...list.querySelectorAll(":scope > .gallery-row, :scope > .gallery-group > .gallery-row"),
    ];
    const first = rows[0],
      second = rows[1];
    const index = first && first.querySelector(".gallery-index");
    const title = first && first.querySelector(".gallery-title");
    const listCs = getComputedStyle(list);
    const rowCs = first ? getComputedStyle(first) : {};
    return {
      listDisplay: listCs.display,
      listDir: listCs.flexDirection,
      rowDisplay: rowCs.display,
      rowWidth: first ? first.getBoundingClientRect().width : 0,
      listWidth: list.getBoundingClientRect().width,
      stacked: !!(
        first &&
        second &&
        second.getBoundingClientRect().top > first.getBoundingClientRect().top + 8
      ),
      indexWidth: index ? index.getBoundingClientRect().width : 0,
      gap:
        index && title
          ? title.getBoundingClientRect().left - index.getBoundingClientRect().right
          : -1,
      count: rows.length,
    };
  });
  assert.equal(galleryLayout.listDisplay, "flex", "Gallery list must be a column, not inline wrap");
  assert.equal(galleryLayout.listDir, "column");
  assert.equal(galleryLayout.rowDisplay, "grid", "Gallery rows must use the number/title grid");
  assert.ok(galleryLayout.count >= 9, `Gallery endings list looks empty (${galleryLayout.count})`);
  assert.ok(
    Math.abs(galleryLayout.rowWidth - galleryLayout.listWidth) < 2,
    "Gallery rows must span the list",
  );
  assert.equal(galleryLayout.stacked, true, "Gallery rows must stack, not wrap as chips");
  assert.ok(galleryLayout.indexWidth > 8, "Gallery numbers need a reserved column");
  assert.ok(
    galleryLayout.gap >= 2,
    `Gallery number collides with the title (gap ${galleryLayout.gap})`,
  );
  await page.keyboard.down("Enter");
  await page.keyboard.down("Enter");
  await page.keyboard.up("Enter");
  assert.equal(
    (await read(page)).gallery,
    true,
    "Held Enter must not activate the newly focused Close button",
  );
  assert.equal(await page.locator("#galleryOverlay").getAttribute("role"), "dialog");
  assert.equal(await page.locator("#galleryOverlay").getAttribute("aria-modal"), "true");
  assert.equal(
    await page.evaluate(() =>
      [...document.body.children]
        .filter(
          (x) =>
            x !== document.getElementById("galleryOverlay") &&
            !/^(SCRIPT|STYLE|LINK)$/.test(x.tagName),
        )
        .every((x) => x.inert),
    ),
    true,
    "Background must be inert",
  );
  await page.locator(".gallery-close").focus();
  await page.keyboard.press("Shift+Tab");
  assert.equal((await read(page)).focusInGallery, true, "Reverse Tab must remain in Gallery");
  await page.keyboard.press("Tab");
  assert.match(
    (await read(page)).focus,
    /gallery-close/,
    "Tab must wrap from last Gallery control to Close",
  );
  await page.keyboard.press("Escape");
  assert.equal((await read(page)).gallery, false);
  assert.equal(
    (await read(page)).focus,
    "galleryToggle",
    "Closing Gallery must restore invoking focus",
  );
  await hiddenModalCannotFocus(page);
  await page.locator("#themeToggle").focus();
  await page.keyboard.press("Enter");
  assert.equal((await read(page)).theme, "dark", "Native Enter must activate theme button");
  await page.reload();
  await page.waitForFunction(() => currentTag === "start");
  assert.equal((await read(page)).theme, "dark", "Theme must persist in same tab");
  await page.keyboard.press("1");
  await pause(160);
  assert.equal(
    (await read(page)).tag,
    "start1",
    "Number shortcut must select first visible choice",
  );
  await page.keyboard.press("b");
  await pause(220);
  assert.equal((await read(page)).tag, "start", "B must restore title");
  if (edition.bilingual) {
    const lang = (await read(page)).lang;
    await page.keyboard.press("l");
    assert.notEqual((await read(page)).lang, lang, "L must switch bilingual document language");
    await page.keyboard.press("l");
    assert.equal((await read(page)).lang, lang);
  }
  await page.locator("#galleryToggle").click();
  await page.locator("#galleryEndings > button").first().click();
  await page.waitForFunction(() => guideActive && guideIndex === 2);
  await page.keyboard.down("Enter");
  await pause(160);
  await page.locator("#galleryToggle").click();
  const opened = await read(page);
  await pause(620);
  assert.equal(
    (await read(page)).index,
    opened.index,
    "Held guide Enter must stop when Gallery opens",
  );
  assert.equal((await read(page)).tag, opened.tag, "Story must remain unchanged behind Gallery");
  await page.keyboard.up("Enter");
  await page.keyboard.press("Escape");
  // A queued 120 ms choice is cancelled by opening Gallery on the same input turn.
  // Dispatch invokes production keyboard handlers without changing game state directly.
  await page.evaluate(() => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "1", bubbles: true }));
    document.dispatchEvent(new KeyboardEvent("keyup", { key: "1", bubbles: true }));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "g", bubbles: true }));
    document.dispatchEvent(new KeyboardEvent("keyup", { key: "g", bubbles: true }));
  });
  const pending = await read(page);
  assert.equal(pending.gallery, true);
  await pause(180);
  assert.equal(
    (await read(page)).tag,
    pending.tag,
    "Pending number choice must not fire behind Gallery",
  );
  assert.equal((await read(page)).history, pending.history);
  await page.keyboard.press("Escape");
  // Focus is on the invoking Gallery toolbar after close. Body Enter follows the guide.
  await page.locator("#galleryToggle").evaluate((x) => x.blur());
  const beforeEnter = (await read(page)).index;
  await page.keyboard.press("Enter");
  await pause(160);
  assert.equal((await read(page)).index, beforeEnter + 1, "Guided Enter must remain functional");
  await page.keyboard.press("h");
  assert.equal((await read(page)).on, false);
  await page.keyboard.press("h");
  assert.equal((await read(page)).on, true);
  if (edition.bilingual) {
    await page.keyboard.press("l");
    assert.equal(
      await page.locator("#box button.choice.guide-highlight:visible").count(),
      1,
      "Switching language must retain exactly one visible guide target",
    );
  }
  await page.keyboard.press("s");
  await pause(240);
  assert.equal(
    await page.evaluate(() => climaxSkipUsed && guideIndex === climaxIndex),
    true,
    "Skip must reach designated climax",
  );
  const afterSkip = await read(page);
  await page.keyboard.press("b");
  await pause(220);
  assert.equal(
    (await read(page)).history,
    afterSkip.history - 1,
    "Back must rewind one step after Skip",
  );
  const final = await read(page);
  assert.ok(
    final.documentWidth <= final.width + 1,
    `Sampled final layout overflows: ${final.documentWidth} > ${final.width}`,
  );
  return final;
}
async function checkVisualLocalization(page, edition) {
  await page.goto(pathToFileURL(edition.file).href);
  await page.waitForFunction(() => window.VisualShell && document.querySelector(".sprite"));
  let checks = 0;
  const phases = ["start", "start2", "pavilion", "underbridge"];
  for (const tag of phases) {
    // Presentation boundaries; route reachability is covered by the core verifier.
    await page.evaluate((tag) => {
      tuesday = 1;
      thursday = 0;
      saturday = 0;
      go(tag);
    }, tag);
    for (const language of edition.bilingual ? ["alt", "en", "alt"] : [null]) {
      if (language) await page.evaluate((value) => setLanguage(value), language);
      const observed = await page.evaluate(() => {
        const ui = ADWDVisualUI;
        const mismatches = [];
        document.querySelectorAll("[data-visual-text]").forEach((node) => {
          if (node.textContent !== ui.text(node.dataset.visualText))
            mismatches.push(node.dataset.visualText);
        });
        for (const [id, key] of [
          ["galleryToggle", "gallery"],
          ["backBtn", "back"],
          ["skipBtn", "skip"],
          ["themeToggle", darkMode ? "darkOn" : "darkOff"],
          ["visualGuide", guideOn ? "guideOn" : "guideOff"],
        ]) {
          if (document.getElementById(id).textContent !== ui.text(key)) mismatches.push(id);
        }
        const scene = ADWDSceneMap.resolve(currentTag);
        if (
          document.getElementById("locLabel").textContent !==
          ui.text("locations." + scene.location.id)
        )
          mismatches.push("location");
        if (
          document.getElementById("focusLabel").textContent !==
          scene.cast.focus.map((name) => ui.text("names." + name)).join(ui.text("join"))
        )
          mismatches.push("cast");
        for (const sprite of document.querySelectorAll(".sprite"))
          if (sprite.alt !== ui.text("names." + sprite.dataset.cast)) mismatches.push("sprite alt");
        const status = document.getElementById("stageBand");
        if (
          status.dataset.status &&
          status.textContent !== ui.text("status." + status.dataset.status)
        )
          mismatches.push("status");
        const tummy = document.getElementById("carafe");
        if (!tummy.getAttribute("aria-label").startsWith(ui.text("tummy") + ui.text("separator")))
          mismatches.push("volume aria");
        const currency = document.querySelector(".footer-stats .pounds").textContent;
        if (
          ui.language() === "ja"
            ? !currency.endsWith("ポンド")
            : ["es", "fr", "de"].includes(ui.language())
              ? !currency.endsWith("£")
              : !currency.startsWith("£")
        )
          mismatches.push("currency position");
        const clipped = [
          ...document.querySelectorAll(
            ".visual-rail button, .bar-row > span, .luck-label, .tank-name, #locLabel, #focusLabel",
          ),
        ]
          .filter((node) => node.offsetWidth && node.scrollWidth > node.clientWidth + 1)
          .map((node) => node.id || node.className);
        return {
          mismatches,
          clipped,
          language: ui.language(),
          font: getComputedStyle(document.getElementById("box")).fontFamily,
          cjkFont: getComputedStyle(document.body).getPropertyValue("--cjk-font").trim(),
          titleCount: document.querySelectorAll("#box h1.game-title").length,
          width: innerWidth,
          documentWidth: document.documentElement.scrollWidth,
        };
      });
      assert.deepEqual(observed.mismatches, [], `${edition.id}/${tag}/${language}: localized UI`);
      assert.deepEqual(observed.clipped, [], `${edition.id}/${tag}/${language}: clipped labels`);
      assert.equal(observed.language, language === "en" ? "en" : edition.locale);
      assert.equal(observed.titleCount, 0, "No duplicate title in either language layer");
      assert(observed.documentWidth <= observed.width + 1, "Localized layout overflow");
      if (observed.language === "cn" || observed.language === "tw") {
        assert(observed.cjkFont && observed.font.includes("PingFang"), "Use native CJK font stack");
      }
      if (observed.language === "ja") {
        assert(
          observed.cjkFont && observed.font.includes("Hiragino"),
          "Use the Japanese font stack",
        );
      }
      checks++;
    }
  }
  // A real reachable Gallery route supplies an animated adult cast scene.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() => {
    const group = GALLERY_DATA.hiddenScenes.findIndex((item) =>
      (item.variants || [item]).some((leaf) => leaf.id === "17_diane_brunette_camper_round"),
    );
    const item = GALLERY_DATA.hiddenScenes[group];
    const index = item.variants
      ? item.variants.findIndex((leaf) => leaf.id === "17_diane_brunette_camper_round")
      : undefined;
    startGuidedRoute("hiddenScenes", group, index);
  });
  await page.waitForFunction(
    () =>
      typeof guideTags !== "undefined" &&
      guideTags &&
      guideActive &&
      document.querySelector(".sprite"),
  );
  await page.evaluate(() => {
    while (currentTag !== "peepround" && guideIndex < guideTags.length) go(guideTags[guideIndex]);
  });
  await page.waitForFunction(() => document.querySelector("#stagePuddle canvas"));
  const animation = await page.evaluate(() => {
    const sprite = document.querySelector(".sprite");
    const canvas = document.querySelector("#stagePuddle canvas");
    return {
      tag: currentTag,
      sprite: sprite.getAttribute("src"),
      canvas: !!canvas,
    };
  });
  assert.equal(animation.tag, "peepround");
  assert(animation.sprite.includes(".gif"), "Normal motion uses animated assets");
  if (edition.bilingual) {
    const unchanged = await page.evaluate(() => {
      const images = [...document.querySelectorAll(".sprite")];
      const canvases = [...document.querySelectorAll("#stagePuddle canvas")];
      const srcs = images.map((image) => image.src);
      const snapshot = JSON.stringify(snapshotGame().state);
      const history = gameHistory.length;
      const guide = JSON.stringify([guideIndex, guideActive, guideOn, climaxSkipUsed]);
      const fill = document.getElementById("blad-fill-rect").style.transform;
      const observer = new MutationObserver(() => {});
      observer.observe(document.getElementById("stageCast"), {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src"],
      });
      let clocks = 0;
      const interval = window.setInterval,
        timeout = window.setTimeout;
      window.setInterval = function () {
        clocks++;
        return interval.apply(this, arguments);
      };
      window.setTimeout = function () {
        clocks++;
        return timeout.apply(this, arguments);
      };
      try {
        toggleLanguage();
        toggleLanguage();
      } finally {
        window.setInterval = interval;
        window.setTimeout = timeout;
      }
      const mutations = observer.takeRecords().length;
      observer.disconnect();
      return {
        state: snapshot === JSON.stringify(snapshotGame().state),
        history: history === gameHistory.length,
        guide: guide === JSON.stringify([guideIndex, guideActive, guideOn, climaxSkipUsed]),
        sprites: images.every(
          (image, index) =>
            image === document.querySelectorAll(".sprite")[index] && image.src === srcs[index],
        ),
        canvases: canvases.every(
          (canvas, index) => canvas === document.querySelectorAll("#stagePuddle canvas")[index],
        ),
        meter: fill === document.getElementById("blad-fill-rect").style.transform,
        clocks,
        mutations,
      };
    });
    assert.deepEqual(
      unchanged,
      {
        state: true,
        history: true,
        guide: true,
        sprites: true,
        canvases: true,
        meter: true,
        clocks: 0,
        mutations: 0,
      },
      "Language switches preserve running animations and route state",
    );
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  return {
    localizedScreens: checks,
    animatedScene: animation.tag,
    switchDuringAnimation: edition.bilingual,
  };
}

async function checkReducedMotionVisual(page) {
  await page.evaluate(() => {
    go("start1a");
    go("start1b");
    go("tuesdaydate");
    go("start2");
    go("gothere");
  });
  await page.waitForSelector(".sprite");
  const srcs = await page
    .locator(".sprite")
    .evaluateAll((els) => els.map((e) => e.getAttribute("src") || ""));
  assert.ok(srcs.length, "Visual stage must render a sprite");
  assert.ok(
    srcs.every((s) => /\.still\.png(\?|$)/.test(s)),
    `Reduced motion must use still sprites, got ${srcs.join(",")}`,
  );
  const fade = await page.evaluate(
    () => getComputedStyle(document.getElementById("box")).animationName,
  );
  assert.ok(!fade || fade === "none", `Reduced motion must not run the screen fade (${fade})`);
}
async function checkWiki(page, file) {
  await page.goto(pathToFileURL(file).href);
  const originalTitle = await page.title();
  const expected = await page
    .locator("#themeToggle")
    .evaluate((button) => ({ on: button.dataset.themeOn, off: button.dataset.themeOff }));
  await page.keyboard.press("d");
  assert.equal(await page.locator("#themeToggle").textContent(), expected.on);
  await page.keyboard.press("d");
  assert.equal(await page.locator("#themeToggle").textContent(), expected.off);
  const stems = await page
    .locator(".wiki-page:not(#page-index)")
    .evaluateAll((pages) => pages.map((page) => page.id.slice(5)));
  for (const stem of stems) {
    await page.evaluate((stem) => window.showPage(stem), stem);
    assert.equal(await page.locator(".wiki-page.active").getAttribute("id"), "page-" + stem);
    await page.keyboard.press("b");
    assert.equal(await page.locator(".wiki-page.active").getAttribute("id"), "page-index");
    assert.equal(await page.title(), originalTitle);
  }
  const storageBefore = await page.evaluate(() => JSON.stringify(sessionStorage));
  await page.evaluate(() => window.showPage("missing-article"));
  assert.equal(await page.evaluate(() => JSON.stringify(sessionStorage)), storageBefore);

  const metrics = await page.evaluate(() => {
    const link = document.querySelector("ol.wiki-articles li a");
    const bar = document.querySelector(".game-toolbar");
    return {
      width: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      wrap: link ? getComputedStyle(link).whiteSpace : "",
      minHeight: link ? parseFloat(getComputedStyle(link).minHeight) : 0,
      sticky: bar ? getComputedStyle(bar).position : "",
      reduced: !!(
        window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ),
    };
  });
  assert.equal(metrics.reduced, true, "Wiki check must run with reduced motion");
  assert.ok(
    metrics.wrap === "normal" || metrics.wrap === "break-spaces",
    `Wiki index links must wrap, got ${metrics.wrap}`,
  );
  assert.ok(
    metrics.minHeight >= 44,
    `Wiki index links must keep a 44px tap target, got ${metrics.minHeight}`,
  );
  assert.ok(
    metrics.sticky === "static" || metrics.sticky === "relative",
    `Wiki toolbar must scroll with the page, got ${metrics.sticky}`,
  );
  assert.ok(
    metrics.documentWidth <= metrics.width + 1,
    `Wiki index overflows: ${metrics.documentWidth} > ${metrics.width}`,
  );
  await page.locator("ol.wiki-articles li a").first().click();
  await page.waitForFunction(() => {
    const active = document.querySelector(".wiki-page.active");
    return active && active.id !== "page-index";
  });
  const article = await page.evaluate(() => {
    const dark = document.querySelector(".theme-toggle-button");
    const back = document.querySelector(".wiki-back-btn");
    const ds = dark ? getComputedStyle(dark) : null;
    const bs = back ? getComputedStyle(back) : null;
    return {
      width: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      darkHeight: dark ? dark.getBoundingClientRect().height : 0,
      backHeight: back ? back.getBoundingClientRect().height : 0,
      darkFont: ds ? ds.fontSize : "",
      backFont: bs ? bs.fontSize : "",
      darkLine: ds ? ds.lineHeight : "",
      backLine: bs ? bs.lineHeight : "",
      darkPad: ds ? ds.padding : "",
      backPad: bs ? bs.padding : "",
    };
  });
  assert.ok(
    article.documentWidth <= article.width + 1,
    `Wiki article overflows: ${article.documentWidth} > ${article.width}`,
  );
  assert.ok(article.backHeight > 0, "Wiki article must show Back to Menu");
  assert.equal(
    article.darkHeight,
    article.backHeight,
    `Wiki Dark Mode and Back to Menu heights must match (${article.darkHeight} vs ${article.backHeight})`,
  );
  assert.equal(
    article.darkFont,
    article.backFont,
    `Wiki Dark Mode and Back to Menu font-size must match (${article.darkFont} vs ${article.backFont})`,
  );
  assert.equal(
    article.darkLine,
    article.backLine,
    `Wiki Dark Mode and Back to Menu line-height must match (${article.darkLine} vs ${article.backLine})`,
  );
  assert.equal(
    article.darkPad,
    article.backPad,
    `Wiki Dark Mode and Back to Menu padding must match (${article.darkPad} vs ${article.backPad})`,
  );
}
(async () => {
  for (const engine of engines) {
    let browser;
    try {
      browser = await playwright[engine].launch({ headless: true });
      results.engines.push({ engine, version: browser.version() });
    } catch (e) {
      results.engines.push({ engine, unavailable: String(e) });
      process.exitCode = 1;
      save();
      continue;
    }
    for (const edition of editions.filter((x) => !requested || requested.includes(x.id))) {
      for (const viewport of [
        { width: 1280, height: 900 },
        { width: 390, height: 844 },
      ]) {
        const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
        const page = await context.newPage();
        page.setDefaultTimeout(5000);
        const result = { engine, edition: edition.id, viewport, errors: [] };
        results.cases.push(result);
        page.on("pageerror", (e) => result.errors.push(String(e)));
        page.on("console", (m) => {
          if (m.type() === "error") result.errors.push(m.text());
        });
        try {
          if (localizationOnly) {
            assert(edition.visual, "Localization-only requires a visual edition");
            result.localization = await checkVisualLocalization(page, edition);
          } else if (choicesOnly) {
            result.choiceContainers = await checkChoiceContainers(page, edition);
          } else if (currencyOnly || focusOnly) {
            await page.goto(pathToFileURL(edition.file).href);
            await page.waitForFunction(
              () => typeof currentTag !== "undefined" && currentTag === "start",
            );
          } else {
            result.choiceContainers = await checkChoiceContainers(page, edition);
            result.final = await check(page, edition);
            if (edition.visual) {
              result.reducedMotionSprites = await checkReducedMotionVisual(page);
              result.localization = await checkVisualLocalization(page, edition);
            }
          }
          if (currencyOnly || process.argv.includes("--currency")) {
            result.currency = await checkCurrency(page, edition);
            result.currencyPassed = true;
          }
          if (focusOnly) {
            await checkFocus(page, edition);
            result.focusPassed = true;
          }
          assert.deepEqual(result.errors, []);
          result.passed = true;
        } catch (e) {
          result.failure = String(e);
          process.exitCode = 1;
        }
        await context.close();
        save();
        console.log(
          `${result.passed ? "PASS" : "FAIL"} ${engine} ${edition.id} ${viewport.width}${result.failure ? ": " + result.failure : ""}`,
        );
      }
    }
    if (
      !currencyOnly &&
      !focusOnly &&
      !choicesOnly &&
      !localizationOnly &&
      (!requested || requested.some((id) => id.startsWith("wiki-")))
    ) {
      for (const lang of languages.filter(
        (lang) => !requested || requested.includes("wiki-" + lang),
      )) {
        const wikiFile = path.join(root, `outputs/${lang}/wiki_${lang}.html`);
        for (const viewport of [
          { width: 1280, height: 900 },
          { width: 390, height: 844 },
        ]) {
          const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
          const page = await context.newPage();
          page.setDefaultTimeout(5000);
          const result = { engine, edition: "wiki-" + lang, viewport, errors: [] };
          results.cases.push(result);
          page.on("pageerror", (e) => result.errors.push(String(e)));
          try {
            await checkWiki(page, wikiFile);
            assert.deepEqual(result.errors, []);
            result.passed = true;
          } catch (e) {
            result.failure = String(e);
            process.exitCode = 1;
          }
          await context.close();
          save();
          console.log(
            `${result.passed ? "PASS" : "FAIL"} ${engine} wiki-${lang} ${viewport.width}${result.failure ? ": " + result.failure : ""}`,
          );
        }
      }
    }
    await browser.close();
  }
  if (!results.cases.length)
    throw new Error("No browser cases executed; verification is incomplete.");
  results.finished = new Date().toISOString();
  save();
  console.log(
    `${results.cases.filter((x) => x.passed).length}/${results.cases.length} browser verification cases passed.`,
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
  save();
});
