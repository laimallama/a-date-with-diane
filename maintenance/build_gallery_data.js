const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const HIDDEN_SCENES_SOURCE = path.join(ROOT, "maintenance/write_hidden_scenes.js");

const HTML_PATHS = {
  en: path.join(ROOT, "outputs/en/dianedate_en.html"),
  cn: path.join(ROOT, "outputs/cn/dianedate_cn.html"),
  es: path.join(ROOT, "outputs/es/dianedate_es.html"),
  fr: path.join(ROOT, "outputs/fr/dianedate_fr.html"),
};

const BILINGUAL_HTML_PATHS = {
  cn: path.join(ROOT, "outputs/cn/dianedate_cn_bilingual.html"),
  es: path.join(ROOT, "outputs/es/dianedate_es_bilingual.html"),
  fr: path.join(ROOT, "outputs/fr/dianedate_fr_bilingual.html"),
};

const ENDING_META = {
  third: {
    order: 1, stem: "01_third_prize",
    title: { en: "Third Prize", cn: "三等奖", es: "Tercer premio", fr: "Troisième prix" },
  },
  fourth: {
    order: 2, stem: "02_fourth_prize",
    title: { en: "Fourth Prize", cn: "四等奖", es: "Cuarto premio", fr: "Quatrième prix" },
  },
  first: {
    order: 3, stem: "03_first_prize",
    title: { en: "First Prize", cn: "一等奖", es: "Primer premio", fr: "Premier prix" },
  },
  fifth: {
    order: 4, stem: "04_fifth_prize",
    title: { en: "Fifth Prize", cn: "五等奖", es: "Quinto premio", fr: "Cinquième prix" },
  },
  second: {
    order: 5, stem: "05_second_prize",
    title: { en: "Second Prize", cn: "二等奖", es: "Segundo premio", fr: "Deuxième prix" },
  },
  lounge: {
    order: 6, stem: "06_lounge_story_consolation",
    title: { en: "Lounge Story Consolation Prize", cn: "客厅故事安慰奖", es: "Premio de consolación: historia del salón", fr: "Lot de consolation : histoire du salon" },
  },
  general: {
    order: 7, stem: "07a_consolation_tuesday_pavilion",
    title: { en: "Consolation Prize: Tuesday Pavilion Route", cn: "安慰奖：周二凉亭路线", es: "Premio de consolación: ruta del martes del Pavilion", fr: "Prix de consolation : route du mardi au Pavilion" },
  },
  generalThursday: {
    order: 8, stem: "07b_consolation_thursday_subway",
    title: { en: "Consolation Prize: Thursday Subway Route", cn: "安慰奖：周四地下通道路线", es: "Premio de consolación: ruta del jueves por el paso subterráneo", fr: "Prix de consolation : route du jeudi par le passage souterrain" },
  },
  chloe: {
    order: 9, stem: "08_chloe_consolation",
    title: { en: "Chloe Consolation Prize", cn: "克洛伊安慰奖", es: "Premio de consolación de Chloe", fr: "Prix de consolation de Chloe" },
  },
  amanda: {
    order: 10, stem: "09_amanda_consolation",
    title: { en: "Amanda Consolation Prize", cn: "阿曼达安慰奖", es: "Premio de consolación de Amanda", fr: "Prix de consolation d'Amanda" },
  },
};

function loadHiddenScenesModule() {
  const source = fs.readFileSync(HIDDEN_SCENES_SOURCE, "utf8").replace(/\nmain\(\);\s*$/, "\n");
  const context = {
    console,
    require,
    process,
    __dirname: path.dirname(HIDDEN_SCENES_SOURCE),
    __filename: HIDDEN_SCENES_SOURCE,
  };
  context.global = context;
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(source, context, { filename: HIDDEN_SCENES_SOURCE });
  return context;
}

function buildDataForLang(ctx, routes, definitions, lang) {
  const endings = Object.entries(ENDING_META)
    .map(([key, meta]) => ({
      id: meta.stem,
      order: meta.order,
      title: meta.title[lang],
      titleAlt: lang === "en" ? undefined : meta.title[lang],
      tags: ctx.routeToTags(routes[key], routes),
      baseLength: 2,
    }))
    .sort((a, b) => a.order - b.order);

  const hiddenScenes = definitions.scenes.map((scene, index) => {
    const baseTags = definitions.bases[scene.base].tags;
    return {
      id: scene.stem,
      order: index + 1,
      title: scene.title[lang],
      tags: baseTags.concat(scene.tags),
      baseLength: baseTags.length,
    };
  });

  if (endings.length !== 10) throw new Error(`Expected 10 endings, got ${endings.length}`);
  if (hiddenScenes.length !== 21) throw new Error(`Expected 21 hidden scenes, got ${hiddenScenes.length}`);

  return { endings, hiddenScenes };
}

function buildBilingualData(dataEn, dataLang) {
  const merge = (en, other) => en.map((e, i) => ({ ...e, titleAlt: other[i].title }));
  return {
    endings: merge(dataEn.endings, dataLang.endings),
    hiddenScenes: merge(dataEn.hiddenScenes, dataLang.hiddenScenes),
  };
}

function injectIntoFile(filePath, galleryData) {
  const marker = /const GALLERY_DATA = [\s\S]*?;\n|\/\* GALLERY_DATA_PLACEHOLDER \*\//;
  const injected = `const GALLERY_DATA = ${JSON.stringify(galleryData)};\n`;
  let html = fs.readFileSync(filePath, "utf8");
  if (!marker.test(html)) throw new Error("GALLERY_DATA_PLACEHOLDER marker not found in " + filePath);
  html = html.replace(marker, injected);
  fs.writeFileSync(filePath, html, "utf8");
}

function main() {
  const ctx = loadHiddenScenesModule();
  const routes = ctx.loadRoutes();
  const definitions = ctx.buildDefinitions(routes);

  const dataByLang = {};
  for (const lang of ["en", "cn", "es", "fr"]) {
    dataByLang[lang] = buildDataForLang(ctx, routes, definitions, lang);
  }

  injectIntoFile(HTML_PATHS.en, dataByLang.en);
  for (const lang of ["cn", "es", "fr"]) {
    injectIntoFile(HTML_PATHS[lang], dataByLang[lang]);
    injectIntoFile(BILINGUAL_HTML_PATHS[lang], buildBilingualData(dataByLang.en, dataByLang[lang]));
  }

  const outPath = path.join(ROOT, "maintenance/gallery_data.json");
  fs.writeFileSync(outPath, JSON.stringify(dataByLang, null, 2), "utf8");

  console.log(`Wrote ${outPath}`);
  console.log("Injected gallery data into en, cn, es, fr (single + bilingual where applicable)");
  console.log(`Endings: ${dataByLang.en.endings.length}, Hidden scenes: ${dataByLang.en.hiddenScenes.length}`);
}

main();
