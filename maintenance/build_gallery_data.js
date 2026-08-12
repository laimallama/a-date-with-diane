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
  tw: path.join(ROOT, "outputs/tw/dianedate_tw.html"),
};

const BILINGUAL_HTML_PATHS = {
  cn: path.join(ROOT, "outputs/cn/dianedate_cn_bilingual.html"),
  es: path.join(ROOT, "outputs/es/dianedate_es_bilingual.html"),
  fr: path.join(ROOT, "outputs/fr/dianedate_fr_bilingual.html"),
  tw: path.join(ROOT, "outputs/tw/dianedate_tw_bilingual.html"),
};

// Gallery top-level order: 1st–5th, Amanda, Chloe, Day-route, Lounge
// climaxStartTag: first guided choice of the ending payoff (Skip to climax jumps here).
const ENDING_META = {
  first: {
    order: 1, stem: "03_first_prize",
    climaxStartTag: "disaster0", // outdoor walk-home wetting
    title: { en: "First Prize", cn: "一等奖", tw: "一等獎", es: "Primer premio", fr: "Premier prix" },
  },
  second: {
    order: 2, stem: "05_second_prize",
    climaxStartTag: "nicelydesp1", // sofa story → bathroom wetting
    title: { en: "Second Prize", cn: "二等奖", tw: "二等獎", es: "Segundo premio", fr: "Deuxième prix" },
  },
  third: {
    order: 3, stem: "01_third_prize",
    climaxStartTag: "sofadesp", // sofa desperation → stamp album
    title: { en: "Third Prize", cn: "三等奖", tw: "三等獎", es: "Tercer premio", fr: "Troisième prix" },
  },
  fourth: {
    order: 4, stem: "02_fourth_prize",
    climaxStartTag: "walkhomedesp", // outdoor walk-home desperation / squat
    title: { en: "Fourth Prize", cn: "四等奖", tw: "四等獎", es: "Cuarto premio", fr: "Quatrième prix" },
  },
  fifth: {
    order: 5, stem: "04_fifth_prize",
    climaxStartTag: "skirtremove1", // skirt deal → bathroom watch
    title: { en: "Fifth Prize", cn: "五等奖", tw: "五等獎", es: "Quinto premio", fr: "Cinquième prix" },
  },
  amanda: {
    order: 6, stem: "09_amanda_consolation",
    climaxStartTag: "goupstairs", // Amanda upstairs bathroom beat
    title: { en: "Amanda Consolation Prize", cn: "阿曼达安慰奖", tw: "阿曼達安慰獎", es: "Premio de consolación de Amanda", fr: "Prix de consolation d'Amanda" },
  },
  chloe: {
    order: 7, stem: "08a_chloe_consolation",
    climaxStartTag: "watching1", // outside Chloe's door
    title: {
      en: "Wet at the Door",
      cn: "门口没忍住",
      tw: "門口沒忍住",
      es: "Se moja en la puerta",
      fr: "Elle n’y arrive pas à la porte",
    },
  },
  chloeSibling: {
    order: 7, stem: "08b_chloe_outside",
    climaxStartTag: "watching1", // outside Chloe's door
    title: {
      en: "Pees Outside",
      cn: "在门外解决",
      tw: "在門外解決",
      es: "Orina fuera",
      fr: "Elle fait pipi dehors",
    },
  },
  general: {
    order: 8, stem: "07a_consolation_tuesday_pavilion",
    climaxStartTag: "searchdiane", // follow Diane after she slips away outdoors
    title: { en: "Tuesday Pavilion Route", cn: "周二凉亭路线", tw: "週二涼亭路線", es: "Ruta del martes del Pavilion", fr: "Route du mardi au Pavilion" },
  },
  generalThursday: {
    order: 8, stem: "07b_consolation_thursday_subway",
    climaxStartTag: "searchdiane",
    title: { en: "Thursday Subway Route", cn: "周四地下通道路线", tw: "週四地下通道路線", es: "Ruta del jueves por el paso subterráneo", fr: "Route du jeudi par le passage souterrain" },
  },
  generalSaturday: {
    order: 8, stem: "07c_consolation_saturday_car_park",
    climaxStartTag: "searchdiane",
    title: { en: "Saturday Car Park Route", cn: "周六停车场路线", tw: "週六停車場路線", es: "Ruta del sábado por el aparcamiento", fr: "Route du samedi par le parking" },
  },
  loungeHen: {
    order: 9, stem: "06a_lounge_hen_party",
    climaxStartTag: "loungedesp", // lounge story consolation
    title: { en: "Hen Party", cn: "女生派对", tw: "女生派對", es: "Despedida de soltera", fr: "Enterrement de vie de jeune fille" },
  },
  loungeTiramisu: {
    order: 9, stem: "06b_lounge_bus_boy",
    climaxStartTag: "loungedesp",
    title: { en: "Boy from School on the Bus", cn: "公交车上的男生", tw: "公車上的男生", es: "El chico del colegio en el bus", fr: "Le garçon de l’école dans le bus" },
  },
  loungePanna: {
    order: 9, stem: "06c_lounge_chess_lesson",
    climaxStartTag: "loungedesp",
    title: { en: "Chess Lesson", cn: "下棋课", tw: "下棋課", es: "Lección de ajedrez", fr: "Leçon d’échecs" },
  },
  loungeIce: {
    order: 9, stem: "06d_lounge_freshers_week",
    climaxStartTag: "loungedesp",
    title: { en: "Freshers' Week", cn: "迎新周", tw: "迎新週", es: "Semana de bienvenida", fr: "Semaine d’intégration" },
  },
};

const ENDING_GROUPS = [
  {
    groupId: "08_chloe",
    order: 7,
    title: {
      en: "Chloe Consolation Prizes",
      cn: "克洛伊安慰奖",
      tw: "克洛伊安慰獎",
      es: "Premios de consolación de Chloe",
      fr: "Lots de consolation de Chloe",
    },
    variantKeys: ["chloe", "chloeSibling"],
  },
  {
    groupId: "07_consolation_day_routes",
    order: 8,
    title: {
      en: "Day-Route Consolation Prizes",
      cn: "按日路线安慰奖",
      tw: "按日路線安慰獎",
      es: "Premios de consolación por día",
      fr: "Prix de consolation selon le jour",
    },
    variantKeys: ["general", "generalThursday", "generalSaturday"],
  },
  {
    groupId: "06_lounge_story",
    order: 9,
    title: {
      en: "Lounge Story Consolation Prizes",
      cn: "客厅故事安慰奖",
      tw: "客廳故事安慰獎",
      es: "Premios de consolación: historia del salón",
      fr: "Lots de consolation : histoire du salon",
    },
    variantKeys: ["loungeHen", "loungeTiramisu", "loungePanna", "loungeIce"],
  },
];

// Extra hidden scenes (route keys from write_verified_guides `galleryRoutes`).
// sceneStartTag: first tag of the actual scene — everything before is auto-skipped base.
const EXTRA_HIDDEN = [
  {
    stem: "23_brooch",
    routeKey: "brooch",
    sceneStartTag: "givechance",
    title: {
      en: "Giving Diane the Brooch",
      cn: "把胸针送给黛安",
      tw: "把胸針送給黛安",
      es: "Regalarle el broche a Diane",
      fr: "Offrir la broche à Diane",
    },
  },
  {
    stem: "24_phone_call",
    routeKey: "phoneCall",
    sceneStartTag: "showover1",
    title: {
      en: "Diane Phones You the Next Morning",
      cn: "次日清晨黛安来电",
      tw: "次日清晨黛安來電",
      es: "Diane te llama a la mañana siguiente",
      fr: "Diane vous appelle le lendemain matin",
    },
  },
  {
    stem: "25_lootogether",
    routeKey: "lootogether",
    sceneStartTag: "lootogether",
    title: {
      en: "You Follow Diane into the Loo",
      cn: "你跟着黛安进了厕所",
      tw: "你跟著黛安進了廁所",
      es: "Sigues a Diane al baño",
      fr: "Vous suivez Diane aux toilettes",
    },
  },
  {
    stem: "26_train_photo_album",
    routeKey: "sofatrains",
    sceneStartTag: "sofatrains",
    title: {
      en: "You Show Diane Your Train Photo Album",
      cn: "你给黛安看火车相册",
      tw: "你給黛安看火車相簿",
      es: "Le muestras a Diane tu álbum de trenes",
      fr: "Vous montrez à Diane votre album de trains",
    },
  },
  {
    stem: "27_bath_peeing",
    routeKey: "bathpee",
    sceneStartTag: "bathpee",
    title: {
      en: "Peeing in the Bath",
      cn: "在浴缸里尿",
      tw: "在浴缸裡尿",
      es: "Orinar en la bañera",
      fr: "Faire pipi dans la baignoire",
    },
  },
];

// Group sibling branches (same decision point / same scene family)
const HIDDEN_GROUPS = [
  {
    groupId: "portaloo",
    title: {
      en: "Riverside Portaloo",
      cn: "河边临时厕所",
      tw: "河邊臨時廁所",
      es: "Baño portátil junto al río",
      fr: "Toilettes portatives au bord de l’eau",
    },
    stems: ["02_portaloo_ladies_first", "03_portaloo_too_embarrassed"],
  },
  {
    groupId: "molly_towpath",
    title: {
      en: "Molly on the Towpath",
      cn: "纤道上的莫莉",
      tw: "纖道上的莫莉",
      es: "Molly en el sendero",
      fr: "Molly sur le chemin de halage",
    },
    stems: ["05_molly_bruno_towpath", "06_diane_slips_away_while_watching_molly"],
  },
  {
    groupId: "riverside_bushes",
    title: {
      en: "Behind the Riverside Bushes",
      cn: "河边灌木后面",
      tw: "河邊灌木後面",
      es: "Detrás de los arbustos del río",
      fr: "Derrière les buissons au bord de la rivière",
    },
    // Same riverside-emergency bush family (alone vs both). Towpath steps stay separate.
    stems: ["07_riverside_bushes_diane", "09_riverside_bushes_together"],
  },
  {
    groupId: "spyhole",
    title: {
      en: "Public Toilet Spyhole",
      cn: "公厕窥视孔",
      tw: "公廁窺視孔",
      es: "Mirilla del baño público",
      fr: "Judas des toilettes publiques",
    },
    stems: ["10_public_toilet_spyhole", "11_public_toilet_spyhole_stockings"],
  },
  {
    groupId: "closed_toilet",
    title: {
      en: "Closed Toilet Building",
      cn: "关闭的厕所楼",
      tw: "關閉的廁所樓",
      es: "Edificio de baños cerrado",
      fr: "Bâtiment des toilettes fermé",
    },
    stems: [
      "12_closed_toilet_building_lookout",
      "13_closed_toilet_building_together",
      "14_closed_toilet_building_bad_choice",
      "15_riverside_gents_urinal",
    ],
  },
  {
    groupId: "camper",
    title: {
      en: "Brunette by the Camper Van",
      cn: "房车旁的棕发女孩",
      tw: "房車旁的棕髮女孩",
      es: "La morena junto a la autocaravana",
      fr: "La brune près du camping-car",
    },
    stems: [
      "16_brunette_behind_camper",
      "17_diane_brunette_camper_round",
      "18_diane_brunette_camper_under",
      "19_camper_gentleman_choice",
      "22_caught_by_boyfriend",
    ],
  },
  {
    groupId: "sofa_bathroom",
    title: {
      en: "Diane in Your Bathroom",
      cn: "黛安在你家浴室",
      tw: "黛安在你家浴室",
      es: "Diane en tu baño",
      fr: "Diane dans votre salle de bain",
    },
    // Same sofa-story fork: watch a normal pee vs bath wetting.
    stems: ["25_lootogether", "27_bath_peeing"],
  },
];

// Chronological top-level gallery order (stem id or groupId)
const HIDDEN_TOP_ORDER = [
  "01_theatre_flashback",
  "portaloo",
  "04_thursday_bridge_diane_molly",
  "molly_towpath",
  "riverside_bushes",
  "08_riverside_towpath_landing",
  "spyhole",
  "closed_toilet",
  "camper",
  "20_church_lych_gate_glimpse",
  "21_hidden_camera",
  "26_train_photo_album",
  "23_brooch",
  "sofa_bathroom",
  "24_phone_call",
];

function countLeaves(items) {
  return items.reduce((n, item) => n + (item.variants ? item.variants.length : 1), 0);
}

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

function leafFromRoute(ctx, routes, key, meta) {
  return {
    id: meta.stem,
    order: meta.order,
    title: null, // filled per lang
    tags: ctx.routeToTags(routes[key], routes),
    baseLength: 2,
    _key: key,
  };
}

function buildEndingsForLang(ctx, routes, lang) {
  const byKey = {};
  for (const [key, meta] of Object.entries(ENDING_META)) {
    if (!routes[key]) throw new Error(`Missing route for ending key: ${key}`);
    const tags = ctx.routeToTags(routes[key], routes);
    const climaxIndex = tags.indexOf(meta.climaxStartTag);
    if (climaxIndex < 0) {
      throw new Error(`climaxStartTag "${meta.climaxStartTag}" not found in ending route ${key}`);
    }
    byKey[key] = {
      id: meta.stem,
      order: meta.order,
      title: meta.title[lang],
      tags,
      baseLength: 2,
      climaxIndex,
    };
  }

  const groupedKeys = new Set(ENDING_GROUPS.flatMap((g) => g.variantKeys));
  const endings = Object.entries(byKey)
    .filter(([key]) => !groupedKeys.has(key))
    .map(([, item]) => item);

  for (const group of ENDING_GROUPS) {
    endings.push({
      groupId: group.groupId,
      order: group.order,
      title: group.title[lang],
      variants: group.variantKeys.map((key) => ({
        id: byKey[key].id,
        title: byKey[key].title,
        tags: byKey[key].tags,
        baseLength: byKey[key].baseLength,
        climaxIndex: byKey[key].climaxIndex,
      })),
    });
  }

  endings.sort((a, b) => a.order - b.order);
  return endings;
}

function buildHiddenScenesForLang(ctx, routes, definitions, lang) {
  const flat = definitions.scenes.map((scene, index) => {
    const baseTags = definitions.bases[scene.base].tags;
    return {
      id: scene.stem,
      order: index + 1,
      title: scene.title[lang],
      tags: baseTags.concat(scene.tags),
      baseLength: baseTags.length,
    };
  });

  for (const extra of EXTRA_HIDDEN) {
    if (!routes[extra.routeKey]) throw new Error(`Missing route for hidden scene: ${extra.routeKey}`);
    const tags = ctx.routeToTags(routes[extra.routeKey], routes);
    const baseLength = tags.indexOf(extra.sceneStartTag);
    if (baseLength < 0) {
      throw new Error(`sceneStartTag "${extra.sceneStartTag}" not found in route ${extra.routeKey}`);
    }
    flat.push({
      id: extra.stem,
      order: flat.length + 1,
      title: extra.title[lang],
      tags,
      baseLength,
    });
  }

  const byStem = Object.fromEntries(flat.map((s) => [s.id, s]));
  const groupedStems = new Set(HIDDEN_GROUPS.flatMap((g) => g.stems));
  const byKey = {};

  for (const scene of flat) {
    if (groupedStems.has(scene.id)) continue;
    byKey[scene.id] = scene;
  }
  for (const group of HIDDEN_GROUPS) {
    const variants = group.stems.map((stem) => {
      const v = byStem[stem];
      if (!v) throw new Error(`Missing hidden scene stem for group ${group.groupId}: ${stem}`);
      return {
        id: v.id,
        title: v.title,
        tags: v.tags,
        baseLength: v.baseLength,
      };
    });
    byKey[group.groupId] = {
      groupId: group.groupId,
      title: group.title[lang],
      variants,
    };
  }

  const missing = HIDDEN_TOP_ORDER.filter((key) => !byKey[key]);
  if (missing.length) throw new Error(`HIDDEN_TOP_ORDER missing keys: ${missing.join(", ")}`);
  const extras = Object.keys(byKey).filter((key) => !HIDDEN_TOP_ORDER.includes(key));
  if (extras.length) throw new Error(`Hidden scenes not in HIDDEN_TOP_ORDER: ${extras.join(", ")}`);

  const hiddenScenes = HIDDEN_TOP_ORDER.map((key, i) => ({
    ...byKey[key],
    order: i + 1,
  }));
  return hiddenScenes;
}

function buildDataForLang(ctx, routes, definitions, lang) {
  const endings = buildEndingsForLang(ctx, routes, lang);
  const hiddenScenes = buildHiddenScenesForLang(ctx, routes, definitions, lang);

  const endingLeaves = countLeaves(endings);
  const hiddenLeaves = countLeaves(hiddenScenes);
  // 5 prizes + Amanda + Chloe×2 + Day×3 + Lounge×4
  if (endingLeaves !== 15) throw new Error(`Expected 15 ending leaves, got ${endingLeaves}`);
  if (hiddenLeaves !== 22 + EXTRA_HIDDEN.length) {
    throw new Error(`Expected ${22 + EXTRA_HIDDEN.length} hidden-scene leaves, got ${hiddenLeaves}`);
  }

  return { endings, hiddenScenes };
}

function mergeGalleryEntries(enList, otherList) {
  return enList.map((en, i) => {
    const other = otherList[i];
    if (en.variants) {
      return {
        ...en,
        titleAlt: other.title,
        variants: en.variants.map((v, vi) => ({
          ...v,
          titleAlt: other.variants[vi].title,
        })),
      };
    }
    return { ...en, titleAlt: other.title };
  });
}

function buildBilingualData(dataEn, dataLang) {
  return {
    endings: mergeGalleryEntries(dataEn.endings, dataLang.endings),
    hiddenScenes: mergeGalleryEntries(dataEn.hiddenScenes, dataLang.hiddenScenes),
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
  const onlyLang = process.env.GALLERY_EN_ONLY === "1" ? "en" : null;
  const ctx = loadHiddenScenesModule();
  const routes = ctx.loadRoutes();
  const definitions = ctx.buildDefinitions(routes);

  const langs = onlyLang ? [onlyLang] : ["en", "cn", "es", "fr", "tw"];
  const dataByLang = {};
  for (const lang of langs) {
    dataByLang[lang] = buildDataForLang(ctx, routes, definitions, lang);
  }

  // Keep other languages in gallery_data.json when doing an EN-only inject.
  const outPath = path.join(ROOT, "maintenance/gallery_data.json");
  let existing = {};
  if (onlyLang && fs.existsSync(outPath)) {
    existing = JSON.parse(fs.readFileSync(outPath, "utf8"));
  }
  const merged = { ...existing, ...dataByLang };
  fs.writeFileSync(outPath, JSON.stringify(merged, null, 2), "utf8");

  injectIntoFile(HTML_PATHS.en, merged.en);
  if (!onlyLang) {
    for (const lang of ["cn", "es", "fr", "tw"]) {
      injectIntoFile(HTML_PATHS[lang], merged[lang]);
      injectIntoFile(BILINGUAL_HTML_PATHS[lang], buildBilingualData(merged.en, merged[lang]));
    }
  }

  console.log(`Wrote ${outPath}`);
  console.log(onlyLang ? "Injected gallery data into en only" : "Injected gallery data into en, cn, es, fr, tw (single + bilingual where applicable)");
  console.log("EN hidden scenes:");
  merged.en.hiddenScenes.forEach((h, i) => {
    if (h.variants) {
      console.log(`  ${i + 1}. ${h.title}`);
      h.variants.forEach((v, vi) => {
        console.log(`      ${vi + 1}. ${v.title} (bl=${v.baseLength}/${v.tags.length}, end=${v.tags.slice(-2).join("|")})`);
      });
    } else {
      console.log(`  ${i + 1}. ${h.title} (bl=${h.baseLength}/${h.tags.length}, end=${h.tags.slice(-2).join("|")})`);
    }
  });
  console.log(
    `Endings: ${merged.en.endings.length} top-level / ${countLeaves(merged.en.endings)} leaves, ` +
    `Hidden: ${merged.en.hiddenScenes.length} top-level / ${countLeaves(merged.en.hiddenScenes)} leaves`
  );
}

main();
