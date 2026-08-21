const fs = require("fs");
const path = require("path");
const vm = require("vm");
const mod = require("module");

const ROOT = path.resolve(__dirname, "..");
const ENDING_ROUTES_SOURCE = path.join(ROOT, "maintenance/verify_ending_routes.js");
// Clean legacy guide/hidden_scenes paths only — never touch outputs/*/transcripts/.
const LEGACY_HIDDEN_OUTPUTS = [
  path.join(ROOT, "outputs/en/hidden_scenes"),
  path.join(ROOT, "outputs/cn/hidden_scenes"),
  path.join(ROOT, "outputs/es/hidden_scenes"),
  path.join(ROOT, "outputs/fr/hidden_scenes"),
  path.join(ROOT, "outputs/tw/hidden_scenes"),
  path.join(ROOT, "outputs/en/hidden_scene_transcripts_en"),
  path.join(ROOT, "outputs/cn/hidden_scene_transcripts_cn"),
  path.join(ROOT, "outputs/es/hidden_scene_transcripts_es"),
  path.join(ROOT, "outputs/fr/hidden_scene_transcripts_fr"),
  path.join(ROOT, "outputs/en/hidden_scenes_guide_en.txt"),
  path.join(ROOT, "outputs/cn/hidden_scenes_guide_cn.txt"),
  path.join(ROOT, "outputs/es/hidden_scenes_guide_es.txt"),
  path.join(ROOT, "outputs/fr/hidden_scenes_guide_fr.txt"),
  path.join(ROOT, "outputs/en/guides/hidden_scenes_guide_en.txt"),
  path.join(ROOT, "outputs/cn/guides/hidden_scenes_guide_cn.txt"),
  path.join(ROOT, "outputs/es/guides/hidden_scenes_guide_es.txt"),
  path.join(ROOT, "outputs/fr/guides/hidden_scenes_guide_fr.txt"),
];

const languages = {
  en: { htmlPath: path.join(ROOT, "outputs/en/dianedate_en.html") },
  cn: { htmlPath: path.join(ROOT, "outputs/cn/dianedate_cn.html") },
  es: { htmlPath: path.join(ROOT, "outputs/es/dianedate_es.html") },
  fr: { htmlPath: path.join(ROOT, "outputs/fr/dianedate_fr.html") },
  tw: { htmlPath: path.join(ROOT, "outputs/tw/dianedate_tw.html") },
};

function loadRoutes() {
  const source = fs.readFileSync(ENDING_ROUTES_SOURCE, "utf8");
  // Stop before route smoke-test side effects — gallery only needs route arrays.
  const cut = source.search(/\n\/\/ --- route smoke test/);
  const trimmed = cut >= 0 ? source.slice(0, cut) : source;
  const localRequire = mod.createRequire(ENDING_ROUTES_SOURCE);
  const savedArgv = process.argv;
  process.argv = [savedArgv[0], ENDING_ROUTES_SOURCE];
  const context = {
    console: { log() {}, error: console.error },
    require: localRequire,
    process,
    __dirname: path.dirname(ENDING_ROUTES_SOURCE),
    __filename: ENDING_ROUTES_SOURCE,
    globalThis: {},
  };
  context.global = context;
  context.globalThis = context;
  vm.createContext(context);
  try {
    vm.runInContext(
      `${trimmed}\nglobalThis.__routes = (typeof galleryRoutes !== "undefined" ? galleryRoutes : routes);`,
      context,
      { filename: ENDING_ROUTES_SOURCE }
    );
  } finally {
    process.argv = savedArgv;
  }
  return context.__routes;
}

function loadGame(htmlPath) {
  const source = fs.readFileSync(htmlPath, "utf8");
  const script = source.match(/<script>([\s\S]*?)<\/script>/i)[1];
  const initialBox = (source.match(/<div id="box"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/body>/i) || [null, ""])[1]
    .replace(/^\s+|\s+$/g, "");
  const box = { innerHTML: initialBox };
  const context = {
    console,
    document: {
      getElementById(id) {
        if (id !== "box") throw new Error(`unknown element ${id}`);
        return box;
      },
    },
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(script, context, { filename: htmlPath });
  return { context, box };
}

function decodeEntities(text) {
  return String(text)
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

function stripTags(text) {
  return decodeEntities(String(text))
    .replace(/<[^>]+>/g, "")
    .replace(/[ \t\r\n]+/g, " ")
    .trim();
}

function choices(box) {
  const out = [];
  const re = /<button class=['"]choice['"] onclick=(?:"go\('([^']+)'\)"|'go\("([^"]+)"\)')>([\s\S]*?)<\/button>/g;
  let match;
  while ((match = re.exec(box.innerHTML))) {
    out.push({ tag: match[1] || match[2], text: stripTags(match[3]) });
  }
  return out;
}

function removeUi(html) {
  return String(html)
    .replace(/<div class=['"]choices['"]>[\s\S]*?<\/div>/g, "")
    .replace(/<aside class=['"]status-bar['"]>[\s\S]*?<\/aside>/g, "")
    .replace(/<div class=['"]nav-row['"]>[\s\S]*?<\/div>/g, "");
}








function visibleStory(html) {
  let text = removeUi(html);
  text = text
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, inner) => `\n\n【${stripTags(inner)}】\n\n`)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<hr\s*\/?>/gi, "\n\n")
    .replace(/<\/(?:p|h1|h2|div)>/gi, "\n\n")
    .replace(/<[^>]+>/g, "");
  return decodeEntities(text)
    .split(/\n/)
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalize(text) {
  // Strip all quote marks (British ‘…’, American “…”, straight '…'/"…") so
  // route labels still match polished choice text after smartenText.
  return stripTags(text)
    .replace(/[“”«»「」『』‘’'"]/g, "")
    .replace(/\s*[—–]\s*/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}


function routeToTags(route, routes) {
  const game = loadGame(languages.en.htmlPath);
  return route.map((label, index) => {
    const options = choices(game.box);
    const wanted = normalize(label);
    const found = options.find((o) => normalize(o.text) === wanted)
      || options.find((o) => normalize(o.text).replace(/[.!?。！？]+$/u, "") === wanted.replace(/[.!?。！？]+$/u, ""));
    if (!found) {
      throw new Error(`Choice not found at route step ${index + 1}: ${label}\nAvailable:\n${options.map((o) => `- ${o.text}`).join("\n")}`);
    }
    game.context.go(found.tag);
    return found.tag;
  });
}

function runTag(game, tag, context) {
  const found = choices(game.box).find((o) => o.tag === tag);
  if (!found) {
    throw new Error(`Tag not found for ${context}: ${tag}\nAvailable:\n${choices(game.box).map((o) => `- ${o.tag}: ${o.text}`).join("\n")}\n\nPage:\n${visibleStory(game.box.innerHTML).slice(0, 1200)}`);
  }
  game.context.go(tag);
  return found.text;
}



function buildDefinitions(routes) {
  const secondTags = routeToTags(routes.second, routes);
  const generalTags = routeToTags(routes.general, routes);

  const theatreFlashback = secondTags.slice(0, 29);
  const riversideBench = secondTags.slice(0, 70);
  const riversideEmergency = secondTags.slice(0, 79);

  const openPublicToiletSpyhole = [
    "start1a", "start1b", "tuesdaydate", "start2", "gothere",
    "winelist", "buyrioja", "eatmeal", "buylasagne", "eatmeal4",
    "eatmeal4a", "eatmeal4b", "eatmeal4c", "eatmeal4d", "eatmeal7",
    "eatmeal7a", "eatmeal7b", "espresso", "eatmeal7c", "gotheatre",
    "theatreask", "stopher", "theatre1", "theatre2", "theatre3c",
    "theatre4", "theatre5", "theatre6", "theatre7", "holdhand1",
    "theatre8", "theatre9", "theatre10", "interval", "interval1",
    "gotoo1", "interval2", "interval3", "act2", "act2a", "act2b",
    "leanclose2", "act2c", "act2d", "act2e", "act2f", "act2fa",
    "act2g", "act2h", "leavetheatre", "leavetheatre1", "stagedoor",
    "stagedoor1", "stagedoor2", "stagedoor3", "stagedoor4",
    "stagedoor5a", "choosewalk1", "riverside2", "riverside3",
    "riverside7", "riverside8", "riverside9", "riverside10",
    "riverside11", "traintalka", "riverside12", "riverside13a",
    "riverside14", "toiletopen",
  ];

  const thursdayBridge = [
    "start1a", "start1b", "thursdaydate", "start2", "gothere",
    "winelist", "buyrioja", "eatmeal", "buytort", "eatmeal5", "eatmeal5a",
    "eatmeal5b", "eatmeal5c", "traintalk", "traintalk1", "traintalk2",
    "eatmeal7", "eatmeal7a", "puddings", "buypannacotta", "eatmeal7b",
    "filtercoffee", "eatmeal7bb", "gotheatre", "theatreask", "stopher",
    "theatre1", "theatre2", "theatre3c", "theatre4", "theatre5",
    "theatre6", "theatre7", "holdhand1", "theatre8", "theatre9",
    "theatre10", "interval", "interval1", "gotoo1", "interval2",
    "interval3", "act2", "act2a", "act2b", "leanclose2", "act2c",
    "act2d", "act2e", "act2f", "act2fa", "act2g", "act2h",
    "leavetheatre", "leavetheatre1", "stagedoor", "stagedoor1",
    "stagedoor2", "stagedoor3", "stagedoor4", "stagedoor5",
    "choosewalk1", "riverside2", "riverside3", "riverside3aa",
    "riverside4", "sitonbench", "riverside5", "riverside6",
    "riverside7", "riverside8", "riverside9", "riversidepath",
  ];

  const mollyBrunoTowpath = [
    "start1a", "start1b", "tuesdaydate", "start2", "buysth",
    "buywater", "buysth", "gothere", "winelist", "buyrioja", "eatmeal",
    "buytort", "eatmeal5", "eatmeal5a", "eatmeal5b", "eatmeal5c",
    "traintalk", "traintalk1", "traintalk2", "eatmeal7", "eatmeal7a",
    "eatmeal7b", "espresso", "eatmeal7c", "gotheatre", "theatreask",
    "stopher", "theatre1", "theatre2", "theatre3c", "theatre4",
    "theatre5", "theatre6", "theatre7", "holdhand1", "theatre8",
    "theatre9", "theatre10", "interval", "interval1", "gotoo1",
    "interval2", "interval3", "act2", "act2a", "act2b", "leanclose2",
    "act2c", "act2d", "act2e", "act2f", "act2fa", "act2g", "act2h",
    "leavetheatre", "leavetheatre1", "stagedoor", "stagedoor1",
    "stagedoor2", "stagedoor3", "stagedoor4", "stagedoor5a",
    "choosepub", "pubdrink", "pubdrink1", "pubdrink2", "pubdrink3",
    "pubdrink4", "pubdrink4a", "pubdrink5", "pubdrink6", "pubdrink7",
    "pubdrink8", "pubdrink9", "riverside2", "riverside3",
    "riverside3aa", "riverside4", "sitonbench", "riverside5",
    "riverside6", "riverside7", "riverside8", "riverside9",
    "riverside10", "riverside11", "traintalka", "riverside12",
  ];

  const mollyBrunoTowpathHigh = [
    "start1a", "start1b", "tuesdaydate", "start2", "gothere",
    "winelist", "buyburgundy", "eatmeal", "buytort", "eatmeal5",
    "eatmeal5a", "eatmeal5b", "eatmeal5c", "asklootalk",
    "asklootalk1", "asklootalk2", "gotheatre", "theatre1", "theatre2",
    "theatre3c", "theatre4", "theatre5", "theatre6", "theatre7",
    "holdhand1", "theatre8", "theatre9", "theatre10", "interval",
    "interval1", "gotoo1", "interval2", "interval3", "act2", "act2a",
    "act2b", "leanclose2", "act2c", "act2d", "act2e", "act2f",
    "act2fa", "act2g", "act2h", "leavetheatre", "leavetheatre1",
    "stagedoor", "stagedoor1", "stagedoor2", "stagedoor3",
    "stagedoor4", "stagedoor5a", "choosepub", "pubdrink",
    "pubdrink1", "pubdrink2", "pubdrink3", "pubdrink4", "pubdrink4a",
    "pubdrink5", "pubdrink6", "pubdrink7", "pubdrink8", "pubdrink9",
    "riverside2", "riverside3", "riverside3aa", "riverside4",
    "sitonbench", "riverside5", "riverside6", "riverside7",
    "riverside8", "riverside9", "riverside10", "riverside11",
    "traintalka", "riverside12",
  ];

  const soloBrunetteBus = secondTags.slice(0, 101);
  soloBrunetteBus[9] = "buychardonnay";

  const riversideUrinalRoute = routes.amanda
    .slice(0, routes.amanda.indexOf("Which will it be?") + 1)
    .concat([
      "Go to the pub.",
      "You go into the pub.",
      "You go to the bar.",
      "You chat away.",
      "You chat away.",
      "You chat on.",
      "Yes, I’ll get more drinks in.",
      "It’s your round—but a cheap one because of the special offers.",
      "Cheers!",
      "You leave the pub.",
      "You reach the river.",
      "Such a good idea you offer to pay for them.",
      "You drink your coffees.",
      "She nestles closer to you.",
      "You are sitting next to Diane.",
      "You chat away.",
      "You all get up and continue your walk.",
      "You walk on.",
      "You walk on.",
      "You walk on.",
      "You’re quite happy about that.",
      "Talk about trains.",
      "She marches you forward.",
      "OK.",
      "You hurry up.",
      "Are you in time?",
    ]);
  const riversideUrinal = routeToTags(riversideUrinalRoute, routes);

  const camperDecision = generalTags.slice(0, 102).concat([
    "queue1b",
    "carparka",
    "carparka0",
    "carparka1",
    "carparka2",
    "carparka3",
  ]);

  // Non-Chardonnay bus wait: brunette slips off alone; luckshot follow (exclusive with leaf 16).
  const luckshotBrunetteBus = generalTags.slice(0, generalTags.indexOf("busqueue6") + 1);

  // Spaghetti bolognese is the flag that lets the bus leave while you spy. Swapping
  // only the meal tags is not enough: higher bladder at the riverside toilets forces
  // the open-toilet pee, which resets Diane, so the later Pavilion / bus-queue
  // choices also change. This is a walked Tuesday route that still reaches busqueue6
  // with spagbol set and a luckshot left.
  const luckshotBrunetteDebbieBus = [
    "start1a", "start1b", "tuesdaydate", "start2", "buysth", "buywater", "buysth",
    "gothere", "winelist", "buyrioja", "eatmeal", "buyspagbol", "eatmeal2",
    "eatmeal2a", "eatmeal2b", "eatmeal2c", "eatmeal2d", "eatmeal7", "eatmeal7a",
    "puddings", "buypannacotta", "eatmeal7b", "filtercoffee", "eatmeal7bb",
    "gotheatre", "theatreask", "gotoo", "theatre1", "theatre2", "theatre3c",
    "theatre4", "theatre5", "theatre6", "theatre7", "holdhand1", "theatre8",
    "theatre9", "theatre10", "interval", "interval1", "askloo", "interval2",
    "interval3", "act2", "act2a", "act2b", "leanclose2", "act2c", "act2d",
    "act2e", "act2f", "act2fa", "act2g", "act2h", "leavetheatre", "leavetheatre1",
    "stagedoor", "stagedoor1", "stagedoor2", "stagedoor3", "stagedoor4",
    "stagedoor5a", "choosewalk", "riverside2", "riverside3", "riverside3aa",
    "riverside4", "sitonbench", "riverside5", "riverside6", "riverside7",
    "riverside8", "riverside9", "riverside10", "riverside11", "riverside12",
    "riverside13a", "riverside14", "toiletopen", "toiletopen1c", "toiletopen1c1",
    "goforpee", "goforpee1", "riverside15", "riverside16", "pavilion",
    "pavilion2", "pavilion3", "pavilion4", "pavilion5", "pavilion5a", "pavilion6",
    "pavilion7", "buywaterpav", "pavilion8", "pavilion9", "pavilion9a",
    "busqueue", "busqueue1", "busqueue2", "busqueue3", "busqueue4", "busqueue5",
    "busqueue6",
  ];

  const hiddenCamera = [
    "start1a", "start1b", "thursdaydate", "start2", "gothere", "flirt_l",
    "winelist", "buyrioja", "eatmeal", "buylasagne", "eatmeal4", "eatmeal4a",
    "eatmeal4b", "eatmeal4c", "eatmeal4d", "eatmeal7", "eatmeal7a", "puddings",
    "buytiramisu", "eatmeal7b", "filtercoffee", "eatmeal7bb", "gotheatre",
    "theatreask", "testtue", "testtue1", "arrivehome", "arrivehome0",
    "arrivehome1", "scenario2", "coffeereal2", "scenario2a", "scenario2b",
    "scenario2c", "asklooneed", "asklooneed1", "asklooneed2", "offercoffeeagain",
    "offercoffeeagain1", "luckytrip11", "luckytrip11a",
  ];

  const churchLychGate = [
    "start1a", "start1b", "thursdaydate", "start2", "gothere",
    "winelist", "buypinot", "eatmeal", "buysteak", "steak3", "eatmeal6",
    "eatmeal6a", "eatmeal6b", "eatmeal6c", "eatmeal5c", "asklootalk",
    "asklootalk1", "asklootalk2", "gotheatre", "theatre1", "theatre2",
    "theatre3c", "theatre4", "theatre5", "theatre6", "theatre7",
    "theatre8", "theatre9", "theatre10", "interval", "interval1",
    "luckytrip1", "luckytrip1a", "interval3", "act2", "act2a",
    "act2b", "act2c", "act2d", "act2e", "act2f", "act2fa", "act2g",
    "act2h", "leavetheatre", "leavetheatre1", "dianechoice",
    "foyerbar1", "foyerbar1a", "foyerbar2", "foyerbar3", "stagedoor5",
    "choosepub1", "pubdrink", "pubdrink1", "pubdrink2", "pubdrink3",
    "pubdrink4", "pubdrink4a", "pubdrink5", "pubdrink6", "pubdrink7",
    "pubdrink8", "riverside2", "riverside3", "riverside7", "riverside8",
    "riverside9", "riversidepath", "riversidepath10a", "riversidepath11a",
    "riversidepath12x", "riverside14", "toiletclosed", "riverside15",
    "riverside16", "riverside16a", "busqueue", "busqueue1", "busqueue2",
    "busqueue3", "queue1a", "watchblonde", "busqueue6", "busqueue6a",
    "busqueue7", "bushome", "bushome1", "bushome2", "bushome3",
    "bushome4", "bushome5", "bushome6",
  ];

  // Same Thursday setup, but Rioja so *you* are desperate on the bus home.
  // Rioja keeps bladder lower at the post-theatre fork, so take stage-door (not foyer).
  // Skipping the foyer pee also leaves bladder high at stagedoor5 → choosepub (not choosepub1),
  // but lower again by the bus queue → busqueue4 path (not queue1a/watchblonde).
  const busStopRioja = [];
  for (const tag of churchLychGate) {
    if (tag === "buypinot") {
      busStopRioja.push("buyrioja");
    } else if (tag === "foyerbar1") {
      busStopRioja.push("stagedoor", "stagedoor1", "stagedoor2", "stagedoor3", "stagedoor4");
    } else if (tag === "foyerbar1a" || tag === "foyerbar2" || tag === "foyerbar3") {
      continue;
    } else if (tag === "choosepub1") {
      busStopRioja.push("choosepub");
    } else if (tag === "queue1a") {
      busStopRioja.push("busqueue4", "busqueue5");
    } else if (tag === "watchblonde") {
      continue;
    } else {
      busStopRioja.push(tag);
    }
  }

  const bases = {
    theatreFlashback: {
      name: {
        en: "1: Theatre flashback setup",
        cn: "1：剧院回忆基础路线",
        es: "1: Base para el recuerdo en el teatro",
        fr: "1 : Base du souvenir au théâtre",
        tw: "1：劇院回憶基礎路線"
      },
      tags: theatreFlashback,
    },
    riversideBench: {
      name: {
        en: "2: Riverside bench setup",
        cn: "2：河边长椅基础路线",
        es: "2: Base del banco junto al río",
        fr: "2 : Base du banc au bord de la rivière",
        tw: "2：河邊長椅基礎路線"
      },
      tags: riversideBench,
    },
    riversideEmergency: {
      name: {
        en: "3: Riverside emergency decision setup",
        cn: "3：河边紧急选择基础路线",
        es: "3: Base de la decisión urgente junto al río",
        fr: "3 : Base du choix urgent au bord de la rivière",
        tw: "3：河邊緊急選擇基礎路線"
      },
      tags: riversideEmergency,
    },
    openPublicToiletSpyhole: {
      name: {
        en: "4: Tuesday open public toilet setup",
        cn: "4：周二公共厕所开放基础路线",
        es: "4: Base del baño público abierto del martes",
        fr: "4 : Base des toilettes publiques ouvertes le mardi",
        tw: "4：週二公共廁所開放基礎路線"
      },
      tags: openPublicToiletSpyhole,
    },
    thursdayBridge: {
      name: {
        en: "5: Thursday bridge lookout setup",
        cn: "5：周四桥下偷看基础路线",
        es: "5: Base del puente el jueves",
        fr: "5 : Base du pont le jeudi",
        tw: "5：週四橋下偷看基礎路線"
      },
      tags: thursdayBridge,
    },
    mollyBrunoTowpath: {
      name: {
        en: "6: Tuesday Molly and Bruno towpath setup",
        cn: "6：周二莫莉和布鲁诺纤道基础路线",
        es: "6: Base de Molly y Bruno en el sendero del martes",
        fr: "6 : Base de Molly et Bruno sur le chemin de halage le mardi",
        tw: "6：週二莫莉和布魯諾纖道基礎路線"
      },
      tags: mollyBrunoTowpath,
    },
    mollyBrunoTowpathHigh: {
      name: {
        en: "7: High-urgency Molly and Bruno towpath setup",
        cn: "7：高尿急版莫莉和布鲁诺纤道基础路线",
        es: "7: Base de alta urgencia de Molly y Bruno en el sendero",
        fr: "7 : Base très pressante de Molly et Bruno sur le chemin de halage",
        tw: "7：高尿急版莫莉和布魯諾纖道基礎路線"
      },
      tags: mollyBrunoTowpathHigh,
    },
    riversideUrinal: {
      name: {
        en: "8: Saturday riverside public toilet setup",
        cn: "8：周六河边公共厕所基础路线",
        es: "8: Base de los baños públicos junto al río del sábado",
        fr: "8 : Base des toilettes publiques au bord de la rivière le samedi",
        tw: "8：週六河邊公共廁所基礎路線"
      },
      tags: riversideUrinal,
    },
    soloBrunetteBus: {
      name: {
        en: "9: Bus queue brunette setup",
        cn: "9：公交站褐发女生基础路线",
        es: "9: Base de la morena en la cola del autobús",
        fr: "9 : Base de la brune dans la file du bus",
        tw: "9：公車站褐髮女生基礎路線"
      },
      tags: soloBrunetteBus,
    },
    luckshotBrunetteBus: {
      name: {
        en: "9b: Bus queue luckshot brunette setup",
        cn: "9b：公交站幸运一击褐发女生基础路线",
        es: "9b: Base de la morena con oportunidad de suerte en la cola",
        fr: "9b : Base de la brune avec opportunité de chance dans la file",
        tw: "9b：公車站幸運一擊褐髮女生基礎路線"
      },
      tags: luckshotBrunetteBus,
    },
    luckshotBrunetteDebbieBus: {
      name: {
        en: "9c: Bus queue luckshot brunette, bus leaves",
        cn: "9c：公交站幸运一击褐发女生，公车先走",
        es: "9c: Base de la morena con suerte, el autobús se va",
        fr: "9c : Base de la brune avec chance, le bus part",
        tw: "9c：公車站幸運一擊褐髮女生，公車先走"
      },
      tags: luckshotBrunetteDebbieBus,
    },
    camperDecision: {
      name: {
        en: "10: Camper van decision setup",
        cn: "10：房车后选择基础路线",
        es: "10: Base de la decisión detrás de la autocaravana",
        fr: "10 : Base du choix derrière le camping-car",
        tw: "10：房車後選擇基礎路線"
      },
      tags: camperDecision,
    },
    hiddenCamera: {
      name: {
        en: "11: Hidden camera setup",
        cn: "11：隐藏摄像头基础路线",
        es: "11: Base de la cámara oculta",
        fr: "11 : Base de la caméra cachée",
        tw: "11：隱藏攝影機基礎路線"
      },
      tags: hiddenCamera,
    },
    churchLychGate: {
      name: {
        en: "12: Thursday bus-stop luckshot setup",
        cn: "12：周四公交站幸运一击基础路线",
        es: "12: Base de la parada del jueves (suerte)",
        fr: "12 : Base de l'arrêt du jeudi (chance)",
        tw: "12：週四公車站幸運一擊基礎路線"
      },
      tags: churchLychGate,
    },
    busStopRioja: {
      name: {
        en: "12b: Thursday bus-stop Rioja setup",
        cn: "12b：周四公交站里奥哈基础路线",
        es: "12b: Base de la parada del jueves (Rioja)",
        fr: "12b : Base de l'arrêt du jeudi (Rioja)",
        tw: "12b：週四公車站里奧哈基礎路線"
      },
      tags: busStopRioja,
    },
  };

  const scenes = [
    {
      stem: "01_theatre_flashback",
      base: "theatreFlashback",
      title: {
        en: "Theatre Flashback to the First Time You Saw Diane",
        cn: "剧院里回想第一次见到黛安",
        es: "Recuerdo en el teatro de la primera vez que viste a Diane",
        fr: "Souvenir au théâtre de la première fois où vous avez vu Diane",
        tw: "劇院裡回想第一次見到黛安"
      },
      entry: {
        en: "This begins during the first act, when your attention wanders in the theatre.",
        cn: "这个场景从剧院第一幕开始，当时你在座位上走神。",
        es: "Empieza durante el primer acto, cuando te distraes en el teatro.",
        fr: "Cela commence pendant le premier acte, quand votre attention se relâche au théâtre.",
        tw: "這個場景從劇院第一幕開始，當時你在座位上走神。"
      },
      result: {
        en: "A flashback scene. It does not end the game and returns to the play.",
        cn: "这是回忆场景，不会结束游戏，之后会回到话剧。",
        es: "Es un recuerdo. No termina la partida y vuelve a la obra.",
        fr: "C'est un souvenir. La partie ne se termine pas et revient à la pièce.",
        tw: "這是回憶場景，不會結束遊戲，之後會回到話劇。"
      },
      exit: {
        en: "The route returns to the theatre scene.",
        cn: "路线会回到剧院剧情。",
        es: "La ruta vuelve a la escena del teatro.",
        fr: "La route revient à la scène du théâtre.",
        tw: "路線會回到劇院劇情。"
      },
      tags: ["theatre3c", "theatre4"],
    },
    {
      stem: "02_portaloo_ladies_first",
      base: "riversideBench",
      title: {
        en: "Finding the Hidden Portaloo for Diane",
        cn: "帮黛安找到隐藏的移动厕所",
        es: "Encontrar el baño portátil oculto para Diane",
        fr: "Trouver les toilettes portatives cachées pour Diane",
        tw: "幫黛安找到隱藏的流動廁所"
      },
      entry: {
        en: "This begins at the riverside bench after Diane seems unable to sit still.",
        cn: "这个场景从河边长椅开始，当时黛安已经有些坐不住。",
        es: "Empieza en el banco junto al río, cuando Diane ya no consigue estarse quieta.",
        fr: "Cela commence sur le banc au bord de la rivière, quand Diane n'arrive plus à rester tranquille.",
        tw: "這個場景從河邊長椅開始，當時黛安已經有些坐不住。"
      },
      result: {
        en: "Diane gets to use the Portaloo. The route continues afterwards.",
        cn: "黛安会用上移动厕所，之后路线继续。",
        es: "Diane puede usar el baño portátil. La ruta continúa después.",
        fr: "Diane peut utiliser les toilettes portatives. La route continue ensuite.",
        tw: "黛安會用上流動廁所，之後路線繼續。"
      },
      exit: {
        en: "The route rejoins the riverside walk.",
        cn: "路线会接回河边散步。",
        es: "La ruta vuelve al paseo junto al río.",
        fr: "La route rejoint la promenade au bord de la rivière.",
        tw: "路線會接回河邊散步。"
      },
      tags: ["luckytrip16", "luckytrip16a", "luckytrip16a1", "riverside7"],
    },
    {
      stem: "03_portaloo_too_embarrassed",
      base: "riversideBench",
      title: {
        en: "Offering the Portaloo Too Directly",
        cn: "过于直白地提起移动厕所",
        es: "Ofrecer el baño portátil de forma demasiado directa",
        fr: "Proposer les toilettes portatives trop directement",
        tw: "過於直白地提起流動廁所"
      },
      entry: {
        en: "This is the alternative Portaloo branch at the same riverside bench.",
        cn: "这是同一处河边长椅上的移动厕所变体分支。",
        es: "Es la variante del baño portátil en el mismo banco junto al río.",
        fr: "C'est la variante des toilettes portatives au même banc au bord de la rivière.",
        tw: "這是同一處河邊長椅上的流動廁所變體分支。"
      },
      result: {
        en: "Diane is too embarrassed to admit she needs it. The route continues.",
        cn: "黛安会因为太尴尬而不承认自己需要去，之后路线继续。",
        es: "Diane se avergüenza demasiado para admitir que lo necesita. La ruta continúa.",
        fr: "Diane est trop gênée pour admettre qu'elle en a besoin. La route continue.",
        tw: "黛安會因為太尷尬而不承認自己需要去，之後路線繼續。"
      },
      exit: {
        en: "The route rejoins the riverside walk.",
        cn: "路线会接回河边散步。",
        es: "La ruta vuelve al paseo junto al río.",
        fr: "La route rejoint la promenade au bord de la rivière.",
        tw: "路線會接回河邊散步。"
      },
      tags: ["luckytrip16", "luckytrip16b", "luckytrip16ba", "riverside7"],
    },
    {
      stem: "04_thursday_bridge_diane_molly",
      base: "thursdayBridge",
      title: {
        en: "Robert Shows You Diane and Molly Under the Bridge",
        cn: "罗伯特带你偷看桥下的黛安和莫莉",
        es: "Robert te lleva a espiar a Diane y Molly bajo el puente",
        fr: "Robert vous emmène espionner Diane et Molly sous le pont",
        tw: "羅伯特帶你偷看橋下的黛安和莫莉"
      },
      entry: {
        en: "This is a Thursday-only riverside branch. It begins once Diane and Molly have peeled off down the towpath, when Robert offers you a luckshot to watch them under the bridge.",
        cn: "这是周四限定的河边分支。从黛安和莫莉已经下到纤道、罗伯特提议用一次幸运机会去桥下偷看开始。",
        es: "Es una rama del jueves junto al río. Empieza cuando Diane y Molly ya se han separado hacia el sendero y Robert te ofrece una oportunidad de suerte para verlas bajo el puente.",
        fr: "C'est une branche du jeudi au bord de la rivière. Elle commence une fois que Diane et Molly sont parties sur le chemin de halage, quand Robert vous propose une opportunité de chance pour les regarder sous le pont.",
        tw: "這是週四限定的河邊分支。從黛安和莫莉已經下到纖道、羅伯特提議用一次幸運機會去橋下偷看開始。"
      },
      result: {
        en: "Robert helps you find a lookout point, and you watch Diane and then Molly under the bridge.",
        cn: "罗伯特会帮你找到一个偷看的位置，你会看到黛安和莫莉先后在桥下解决。",
        es: "Robert te ayuda a encontrar un punto de observación, y ves a Diane y después a Molly bajo el puente.",
        fr: "Robert vous aide à trouver un poste d'observation, et vous voyez Diane puis Molly sous le pont.",
        tw: "羅伯特會幫你找到一個偷看的位置，你會看到黛安和莫莉先後在橋下解決。"
      },
      exit: {
        en: "The route rejoins the riverside walk.",
        cn: "路线会接回河边散步。",
        es: "La ruta vuelve al paseo junto al río.",
        fr: "La route rejoint la promenade au bord de la rivière.",
        tw: "路線會接回河邊散步。"
      },
      tags: ["luckytrip3", "underbridge", "underbridge2", "underbridge3"],
    },
    {
      stem: "05_molly_bruno_towpath",
      base: "mollyBrunoTowpath",
      title: {
        en: "Watching Molly Behind the Skip",
        cn: "偷看莫莉在废料箱后面撒尿",
        es: "Ver a Molly detrás del contenedor de obra",
        fr: "Regarder Molly derrière la benne de chantier",
        tw: "偷看莫莉在工地貨櫃後面撒尿"
      },
      entry: {
        en: "This is a Tuesday riverside branch, after Molly and Bruno peel off down to the towpath.",
        cn: "这是周二河边分支，从莫莉和布鲁诺离队下到纤道开始。",
        es: "Es una rama del martes junto al río, después de que Molly y Bruno se separan para bajar al sendero.",
        fr: "C'est une branche du mardi au bord de la rivière, après que Molly et Bruno se détachent du groupe pour descendre sur le chemin de halage.",
        tw: "這是週二河邊分支，從莫莉和布魯諾離隊下到纖道開始。"
      },
      result: {
        en: "You watch Bruno first, then Molly behind the skip, and Diane teases you afterwards.",
        cn: "你会先看到布鲁诺，再看到莫莉在废料箱后面撒尿，之后黛安会调侃你。",
        es: "Ves primero a Bruno y luego a Molly detrás del contenedor; después Diane se burla de ti.",
        fr: "Vous voyez d'abord Bruno, puis Molly derrière la benne, et Diane vous taquine ensuite.",
        tw: "你會先看到布魯諾，再看到莫莉在工地貨櫃後面撒尿，之後黛安會調侃你。"
      },
      exit: {
        en: "The route continues towards the riverside public toilets.",
        cn: "路线继续走向河边公共厕所。",
        es: "La ruta sigue hacia los baños públicos junto al río.",
        fr: "La route continue vers les toilettes publiques au bord de la rivière.",
        tw: "路線繼續走向河邊公共廁所。"
      },
      tags: ["riverside13", "luckytrip4", "luckytrip4a", "luckytrip4b"],
    },
    {
      stem: "06_diane_slips_away_while_watching_molly",
      base: "mollyBrunoTowpathHigh",
      title: {
        en: "Diane Slips Away While You Watch Molly",
        cn: "你偷看莫莉时黛安也悄悄离开",
        es: "Diane se escapa mientras miras a Molly",
        fr: "Diane s'éclipse pendant que vous regardez Molly",
        tw: "你偷看莫莉時黛安也悄悄離開"
      },
      entry: {
        en: "This is the high-urgency variant of the Tuesday towpath scene, after Molly and Bruno peel off down to the towpath.",
        cn: "这是周二纤道场景的高尿急变体，从莫莉和布鲁诺离队下到纤道开始。",
        es: "Es la variante de alta urgencia de la escena del sendero del martes, después de que Molly y Bruno se separan para bajar al sendero.",
        fr: "C'est la variante très pressante de la scène du chemin de halage du mardi, après que Molly et Bruno se détachent du groupe pour descendre sur le chemin.",
        tw: "這是週二纖道場景的高尿急變體，從莫莉和布魯諾離隊下到纖道開始。"
      },
      result: {
        en: "You still watch Bruno and Molly, but Diane is desperate enough to slip away for a pee while you are distracted.",
        cn: "你仍然会看到布鲁诺和莫莉，但黛安也憋得够急，会趁你分心时悄悄去方便。",
        es: "Sigues viendo a Bruno y Molly, pero Diane está tan apurada que se escapa a hacer pis mientras estás distraído.",
        fr: "Vous voyez toujours Bruno et Molly, mais Diane est assez pressée pour s'éclipser faire pipi pendant que vous êtes distrait.",
        tw: "你仍然會看到布魯諾和莫莉，但黛安也憋得夠急，會趁你分心時悄悄去方便。"
      },
      exit: {
        en: "The route continues towards the riverside public toilets.",
        cn: "路线继续走向河边公共厕所。",
        es: "La ruta sigue hacia los baños públicos junto al río.",
        fr: "La route continue vers les toilettes publiques au bord de la rivière.",
        tw: "路線繼續走向河邊公共廁所。"
      },
      tags: ["riverside13", "luckytrip4", "luckytrip4a", "luckytrip4b", "luckytrip4c", "luckytrip4d"],
    },
    {
      stem: "07_riverside_bushes_diane",
      base: "riversideEmergency",
      title: {
        en: "Diane Pees Behind the Riverside Bushes",
        cn: "黛安在河边灌木后面小便",
        es: "Diane orina detrás de los arbustos junto al río",
        fr: "Diane fait pipi derrière les buissons au bord de la rivière",
        tw: "黛安在河邊樹叢後面尿尿"
      },
      entry: {
        en: "This begins when Diane admits she may not make it to the Pavilion.",
        cn: "这个场景从黛安承认自己可能撑不到凉亭酒吧开始。",
        es: "Empieza cuando Diane admite que quizá no llegue hasta el Pavilion.",
        fr: "Cela commence quand Diane admet qu'elle risque de ne pas tenir jusqu'au Pavilion.",
        tw: "這個場景從黛安承認自己可能撐不到涼亭酒吧開始。"
      },
      result: {
        en: "Diane has an emergency pee behind the bushes. The route continues.",
        cn: "黛安会在灌木后面急着方便一次，之后路线继续。",
        es: "Diane hace pis de urgencia detrás de los arbustos. La ruta continúa.",
        fr: "Diane fait pipi en urgence derrière les buissons. La route continue.",
        tw: "黛安會在樹叢後面急著方便一次，之後路線繼續。"
      },
      exit: {
        en: "The route continues towards the riverside public toilets.",
        cn: "路线继续走向河边公共厕所。",
        es: "La ruta sigue hacia los baños públicos junto al río.",
        fr: "La route continue vers les toilettes publiques au bord de la rivière.",
        tw: "路線繼續走向河邊公共廁所。"
      },
      tags: ["helpdiane1a", "helpdiane1aa", "helpdiane1b"],
    },
    {
      stem: "08_riverside_towpath_landing",
      base: "riversideEmergency",
      title: {
        en: "Diane Cannot Wait on the Towpath Steps",
        cn: "黛安在河边台阶上憋不住",
        es: "Diane no aguanta en las escaleras del sendero",
        fr: "Diane ne tient plus dans les marches du chemin de halage",
        tw: "黛安在河邊台階上憋不住"
      },
      entry: {
        en: "This begins from the same riverside emergency decision, after you say you need to go too.",
        cn: "这个场景同样从河边紧急选择开始，但你要说自己也需要去。",
        es: "Empieza en la misma decisión urgente junto al río, después de decir que tú también necesitas ir.",
        fr: "Cela commence au même choix urgent au bord de la rivière, après avoir dit que vous aussi avez besoin d'y aller.",
        tw: "這個場景同樣從河邊緊急選擇開始，但你要說自己也需要去。"
      },
      result: {
        en: "Diane loses patience on the steps, then confesses an older wetting story if the route conditions fit.",
        cn: "黛安会在台阶上憋不住；条件合适时，她之后还会讲一次以前尿湿的经历。",
        es: "Diane no aguanta en las escaleras y, si las condiciones encajan, después cuenta una experiencia antigua en la que se mojó.",
        fr: "Diane ne tient plus dans les marches et, si les conditions conviennent, raconte ensuite une ancienne fois où elle s'est mouillée.",
        tw: "黛安會在台階上憋不住；條件合適時，她之後還會講一次以前尿濕的經歷。"
      },
      exit: {
        en: "The route rejoins the walk after Diane's confession.",
        cn: "黛安讲完之后，路线会接回散步。",
        es: "La ruta vuelve al paseo después de la confesión de Diane.",
        fr: "La route reprend la promenade après l'aveu de Diane.",
        tw: "黛安講完之後，路線會接回散步。"
      },
      tags: ["helpdiane2a", "together1", "together1a", "together1b"],
    },
    {
      stem: "09_riverside_bushes_together",
      base: "riversideEmergency",
      title: {
        en: "You and Diane Both Pee Behind the Bushes",
        cn: "你和黛安都在灌木后面小便",
        es: "Tú y Diane hacéis pis detrás de los arbustos",
        fr: "Vous et Diane faites tous les deux pipi derrière les buissons",
        tw: "你和黛安都在樹叢後面尿尿"
      },
      entry: {
        en: "This begins from the riverside emergency decision after you say you need to go too.",
        cn: "这个场景从河边紧急选择开始，你要说自己也需要去。",
        es: "Empieza en la decisión urgente junto al río después de decir que tú también necesitas ir.",
        fr: "Cela commence au choix urgent au bord de la rivière après avoir dit que vous aussi avez besoin d'y aller.",
        tw: "這個場景從河邊緊急選擇開始，你要說自己也需要去。"
      },
      result: {
        en: "You both go behind separate bushes. The route continues.",
        cn: "你们会分别到灌木后面方便，之后路线继续。",
        es: "Los dos vais detrás de arbustos separados. La ruta continúa.",
        fr: "Vous allez chacun derrière des buissons séparés. La route continue.",
        tw: "你們會分別到樹叢後面方便，之後路線繼續。"
      },
      exit: {
        en: "The route continues towards the riverside public toilets.",
        cn: "路线继续走向河边公共厕所。",
        es: "La ruta sigue hacia los baños públicos junto al río.",
        fr: "La route continue vers les toilettes publiques au bord de la rivière.",
        tw: "路線繼續走向河邊公共廁所。"
      },
      tags: ["helpdiane2a", "together2", "helpdiane1b"],
    },
    {
      stem: "10_public_toilet_spyhole",
      base: "riversideEmergency",
      title: {
        en: "Discarded Knickers",
        cn: "遗落的内裤",
        es: "Las bragas abandonadas",
        fr: "La culotte abandonnée",
        tw: "遺落的內褲"
      },
      entry: {
        en: "This begins when you send Diane towards the riverside public toilets instead of finding bushes.",
        cn: "这个场景从你让黛安去河边公共厕所开始，而不是直接帮她找灌木。",
        es: "Empieza cuando envías a Diane hacia los baños públicos junto al río en lugar de buscar arbustos.",
        fr: "Cela commence quand vous envoyez Diane vers les toilettes publiques au lieu de chercher des buissons.",
        tw: "這個場景從你讓黛安去河邊公共廁所開始，而不是直接幫她找樹叢。"
      },
      result: {
        en: "This is a voyeur branch that ends the date badly. It is not a Prize ending.",
        cn: "这是偷看分支，会让约会失败，不是奖项结局。",
        es: "Es una rama voyeur que acaba mal la cita. No es un final con premio.",
        fr: "C'est une branche voyeur qui finit mal pour le rendez-vous. Ce n'est pas une fin avec prix.",
        tw: "這是偷看分支，會讓約會失敗，不是獎項結局。"
      },
      exit: {
        en: "The route ends in a non-Prize game over.",
        cn: "路线会进入非奖项失败结局。",
        es: "La ruta termina en un game over sin premio.",
        fr: "La route se termine par un game over sans prix.",
        tw: "路線會進入非獎項失敗結局。"
      },
      tags: ["helpdiane3a", "riverside14", "toiletopen", "toiletopen1b", "toiletopen1bb", "luckytrip5", "luckytrip5a", "luckytrip5tue", "luckytrip5tue1", "luckytrip5tue2", "gameover"],
    },
    {
      stem: "11_public_toilet_spyhole_stockings",
    base: "openPublicToiletSpyhole",
    title: {
      en: "Diane's Stockings",
      cn: "黛安的丝袜",
      es: "Las medias de Diane",
      fr: "Les bas de Diane",
      tw: "黛安的絲襪"
    },
      entry: {
        en: "This begins on the Tuesday riverside walk, when the public toilets are still open and Diane goes in before she is at her absolute limit.",
        cn: "这个场景从周二河边散步开始，当时公共厕所还开着，黛安还没急到彻底失控就先进去了。",
        es: "Empieza en el paseo del martes junto al río, cuando los baños públicos siguen abiertos y Diane entra antes de llegar a su límite absoluto.",
        fr: "Cela commence pendant la promenade du mardi au bord de la rivière, quand les toilettes publiques sont encore ouvertes et que Diane y entre avant d'être à bout.",
        tw: "這個場景從週二河邊散步開始，當時公共廁所還開著，黛安還沒急到徹底失控就先進去了。"
      },
      result: {
        en: "Your luckshot finds the spyhole, but Diane picked another cubicle. If you keep watching, you catch her at the washbasin adjusting her stockings.",
        cn: "幸运机会让你找到了偷窥孔，但黛安选了另一个隔间。如果你继续看，就会看到她在洗手台前整理丝袜。",
        es: "La oportunidad de suerte te lleva a la mirilla, pero Diane ha elegido otra cabina. Si sigues mirando, la ves en el lavabo arreglándose las medias.",
        fr: "L'opportunité de chance vous mène au judas, mais Diane a choisi une autre cabine. Si vous continuez à regarder, vous la voyez au lavabo en train d'ajuster ses bas.",
        tw: "幸運機會讓你找到了偷窺孔，但黛安選了另一個隔間。如果你繼續看，就會看到她在洗手台前整理絲襪。"
      },
      exit: {
        en: "The route rejoins the riverside walk.",
        cn: "路线会接回河边散步。",
        es: "La ruta vuelve al paseo junto al río.",
        fr: "La route rejoint la promenade au bord de la rivière.",
        tw: "路線會接回河邊散步。"
      },
      tags: ["toiletopen1c", "toiletopen1c1", "luckytrip5c", "luckytrip5ca", "luckytrip5cb", "luckytrip5cc", "luckytrip5cd", "riverside15"],
    },
    {
      stem: "12_closed_toilet_building_lookout",
      base: "riversideUrinal",
      title: {
        en: "Diane Pees Behind the Building",
        cn: "黛安在建筑后面小便",
        es: "Diane orina detrás del edificio",
        fr: "Diane fait pipi derrière le bâtiment",
        tw: "黛安在建築後面尿尿"
      },
      entry: {
        en: "This is a Saturday branch at the riverside public toilets, after the caretaker has just locked up.",
        cn: "这是周六河边公共厕所分支，从管理员刚把厕所锁上开始。",
        es: "Es una rama del sábado en los baños públicos junto al río, justo después de que el encargado los cierra.",
        fr: "C'est une branche du samedi aux toilettes publiques du bord de la rivière, juste après que le gardien les a fermées.",
        tw: "這是週六河邊公共廁所分支，從管理員剛把廁所鎖上開始。"
      },
      result: {
        en: "You suggest the back of the closed toilet building and keep watch while Diane goes.",
        cn: "你建议她绕到关着的厕所后面解决，并替她望风。",
        es: "Le sugieres ir detrás del baño cerrado y montas guardia mientras ella va.",
        fr: "Vous lui suggérez de passer derrière les toilettes fermées et montez la garde pendant qu'elle y va.",
        tw: "你建議她繞到關著的廁所後面解決，並替她望風。"
      },
      exit: {
        en: "The route rejoins the riverside walk.",
        cn: "路线会接回河边散步。",
        es: "La ruta vuelve al paseo junto al río.",
        fr: "La route rejoint la promenade au bord de la rivière.",
        tw: "路線會接回河邊散步。"
      },
      tags: ["justclosed1", "toiletclosed1", "toiletclosed2a", "riverside15"],
    },
    {
      stem: "13_closed_toilet_building_together",
      base: "riversideUrinal",
      title: {
        en: "Taking Turns Peeing Behind the Building",
        cn: "轮流在建筑后面小便",
        es: "Turnarse para hacer pis detrás del edificio",
        fr: "Se relayer pour faire pipi derrière le bâtiment",
        tw: "輪流在建築後面尿尿"
      },
      entry: {
        en: "This uses the same Saturday closed-toilet decision point, but you tell Diane you need to go too.",
        cn: "这个场景使用同一个周六关门厕所选择点，但你要告诉黛安自己也想去。",
        es: "Usa el mismo punto de decisión del baño cerrado del sábado, pero le dices a Diane que tú también necesitas ir.",
        fr: "Cela utilise le même point de choix des toilettes fermées du samedi, mais vous dites à Diane que vous aussi avez besoin d'y aller.",
        tw: "這個場景使用同一個週六關門廁所選擇點，但你要告訴黛安自己也想去。"
      },
      result: {
        en: "Diane goes first behind the building, then you take your turn and notice what she left behind.",
        cn: "黛安会先绕到建筑后面，然后轮到你；你会注意到她留下的痕迹。",
        es: "Diane pasa primero detrás del edificio; luego vas tú y ves lo que ha dejado.",
        fr: "Diane passe d'abord derrière le bâtiment, puis c'est votre tour et vous remarquez ce qu'elle a laissé.",
        tw: "黛安會先繞到建築後面，然後輪到你；你會注意到她留下的痕跡。"
      },
      exit: {
        en: "The route rejoins the riverside walk.",
        cn: "路线会接回河边散步。",
        es: "La ruta vuelve al paseo junto al río.",
        fr: "La route rejoint la promenade au bord de la rivière.",
        tw: "路線會接回河邊散步。"
      },
      tags: ["justclosed1", "toiletclosed1", "toiletclosed2b", "riverside15"],
    },
    {
      stem: "14_closed_toilet_building_bad_choice",
      base: "riversideUrinal",
      title: {
        en: "Asking Diane to Hold On",
        cn: "让黛安继续憋着",
        es: "Pedirle a Diane que aguante",
        fr: "Demander à Diane de tenir",
        tw: "讓黛安繼續憋著"
      },
      entry: {
        en: "This uses the same Saturday closed-toilet decision point, but you choose the selfish option.",
        cn: "这个场景使用同一个周六关门厕所选择点，但你选择了自私的选项。",
        es: "Usa el mismo punto de decisión del baño cerrado del sábado, pero eliges la opción egoísta.",
        fr: "Cela utilise le même point de choix des toilettes fermées du samedi, mais vous choisissez l'option égoïste.",
        tw: "這個場景使用同一個週六關門廁所選擇點，但你選擇了自私的選項。"
      },
      result: {
        en: "Diane is disgusted, goes behind the building without you, and the date ends badly.",
        cn: "黛安会非常反感，自己绕到建筑后面解决，然后约会失败。",
        es: "Diane se queda asqueada, va detrás del edificio sin ti y la cita acaba mal.",
        fr: "Diane est dégoûtée, passe derrière le bâtiment sans vous, et le rendez-vous finit mal.",
        tw: "黛安會非常反感，自己繞到建築後面解決，然後約會失敗。"
      },
      exit: {
        en: "The route ends in a non-Prize game over.",
        cn: "路线会进入非奖项失败结局。",
        es: "La ruta termina en un game over sin premio.",
        fr: "La route se termine par un game over sans prix.",
        tw: "路線會進入非獎項失敗結局。"
      },
      tags: ["justclosed1", "toiletclosed1", "toiletclosed2c", "gameover"],
    },
    {
      stem: "15_riverside_gents_urinal",
      base: "riversideUrinal",
      title: {
        en: "Diane Uses the Gents Urinal",
        cn: "黛安使用男厕小便池",
        es: "Diane usa el urinario de caballeros",
        fr: "Diane utilise l'urinoir des hommes",
        tw: "黛安使用男廁小便斗"
      },
      entry: {
        en: "This is a Saturday-only branch at the riverside public toilets, after Diane is very desperate and the caretaker has just locked up.",
        cn: "这是河边公共厕所处的周六限定分支，需要黛安已经非常尿急，而且管理员刚把厕所锁上。",
        es: "Es una rama exclusiva del sábado en los baños públicos junto al río, cuando Diane está muy apurada y el encargado acaba de cerrar.",
        fr: "C'est une branche réservée au samedi aux toilettes publiques du bord de la rivière, quand Diane est très pressée et que le gardien vient de fermer.",
        tw: "這是河邊公共廁所處的週六限定分支，需要黛安已經非常尿急，而且管理員剛把廁所鎖上。"
      },
      result: {
        en: "The caretaker opens the Gents, the cubicle is unusable, and Diane uses a urinal while you are there.",
        cn: "管理员打开男厕，但隔间没法用，黛安只好当着你的面使用小便池。",
        es: "El encargado abre el baño de caballeros, la cabina no se puede usar y Diane acaba usando un urinario contigo presente.",
        fr: "Le gardien ouvre les toilettes des hommes, la cabine est inutilisable, et Diane finit par utiliser un urinoir pendant que vous êtes là.",
        tw: "管理員打開男廁，但隔間沒法用，黛安只好當著你的面使用小便斗。"
      },
      exit: {
        en: "The route rejoins the riverside walk.",
        cn: "路线会接回河边散步。",
        es: "La ruta vuelve al paseo junto al río.",
        fr: "La route rejoint la promenade au bord de la rivière.",
        tw: "路線會接回河邊散步。"
      },
      tags: ["justclosed1", "justclosed2", "justclosed3", "urinal", "riverside15"],
    },
    {
      stem: "28_luckshot_brunette_camper",
      base: "luckshotBrunetteBus",
      title: {
        en: "Spying on the Brunette Behind the Camper Van",
        cn: "偷看房车后面的褐发女生",
        es: "Espiar a la morena detrás de la autocaravana",
        fr: "Espionner la brune derrière le camping-car",
        tw: "偷看房車後面的褐髮女生"
      },
      entry: {
        en: "This begins in the late bus queue when you still have a luckshot. The brunette leaves alone; Diane stays with you (not the Chardonnay path).",
        cn: "这个场景从后段公交站开始，需要你还剩至少一次幸运机会。褐发女生独自离开，黛安仍在你身边（不是霞多丽那条线）。",
        es: "Empieza en la cola del autobús cuando aún te queda una oportunidad de suerte. La morena se va sola; Diane se queda contigo (no es la ruta del Chardonnay).",
        fr: "Cela commence dans la file du bus quand il vous reste une opportunité de chance. La brune part seule ; Diane reste avec vous (ce n'est pas la route du Chardonnay).",
        tw: "這個場景從後段公車站開始，需要你還剩至少一次幸運機會。褐髮女生獨自離開，黛安仍在你身邊（不是霞多麗那條線）。"
      },
      result: {
        en: "You lie that you need a pee, follow her, and watch her alone behind the camper van, then return to Diane.",
        cn: "你谎称自己要小便，跟上她，独自在房车后面看她急尿，然后回到黛安身边。",
        es: "Mientes diciendo que tienes que hacer pis, la sigues, la ves sola detrás de la autocaravana y vuelves con Diane.",
        fr: "Vous mentez en disant que vous devez faire pipi, vous la suivez, vous la regardez seule derrière le camping-car, puis vous retournez auprès de Diane.",
        tw: "你謊稱自己要尿尿，跟上她，獨自在房車後面看她急尿，然後回到黛安身邊。"
      },
      exit: {
        en: "The route returns to the bus queue with Diane.",
        cn: "路线会回到和黛安一起的公交队伍。",
        es: "La ruta vuelve a la cola del autobús con Diane.",
        fr: "La route revient à la file du bus avec Diane.",
        tw: "路線會回到和黛安一起的公車隊伍。"
      },
      tags: ["luckytrip7", "carparkalone", "carpark2", "carpark3"],
    },
    {
      stem: "28b_luckshot_brunette_debbie",
      base: "luckshotBrunetteDebbieBus",
      title: {
        en: "The Brunette Shares a Taxi with You",
        cn: "褐发女生和你共乘出租车",
        es: "La morena comparte un taxi contigo",
        fr: "La brune partage un taxi avec vous",
        tw: "褐髮女生和你共乘計程車"
      },
      entry: {
        en: "Same luckshot spy as the previous scene, but dinner was spaghetti bolognese. That single flag makes the bus leave while you are in the car park. Spaghetti also changes the meal timing, so this Gallery path uses the still-open riverside toilets rather than walking past them.",
        cn: "和上一场相同的幸运一击偷看，但晚餐点了肉酱意大利面。只要这一个标记，公车就会在你还在停车场时先走。肉酱面也会改变用餐节奏，所以这条图鉴路线会走进仍开放的河边厕所，而不是直接走过。",
        es: "El mismo espiar con golpe de suerte que la escena anterior, pero la cena fue espaguetis a la boloñesa. Esa sola marca hace que el autobús se vaya mientras estás en el aparcamiento. Los espaguetis también cambian el ritmo de la comida, así que esta ruta de la Galería usa los baños del río que siguen abiertos, en lugar de pasar de largo.",
        fr: "Le même espionnage avec coup de chance que la scène précédente, mais le dîner était des spaghetti bolognaise. Ce seul drapeau fait partir le bus pendant que vous êtes sur le parking. Les spaghetti changent aussi le rythme du repas, donc cette route de la Galerie utilise les toilettes du bord de rivière encore ouvertes, au lieu de passer devant.",
        tw: "和上一場相同的幸運一擊偷看，但晚餐點了肉醬義大利麵。只要這一個標記，公車就會在你還在停車場時先走。肉醬麵也會改變用餐節奏，所以這條圖鑑路線會走進仍開放的河邊廁所，而不是直接走過。"
      },
      result: {
        en: "You watch the brunette behind the camper van, then return to an empty stop. Diane has caught the bus. You share a taxi with the girl and arrange a date. This is a non-Prize game over.",
        cn: "你在房车后面看完那个褐发女生，回到空荡荡的车站。黛安已经坐上了那班车。你和她共乘出租车，还约了下次见面。这是非奖项失败结局。",
        es: "Ves a la morena detrás de la autocaravana y vuelves a una parada vacía. Diane ha cogido el autobús. Compartes un taxi con ella y quedáis para una cita. Es un game over sin premio.",
        fr: "Vous regardez la brune derrière le camping-car, puis vous revenez à un arrêt vide. Diane a pris le bus. Vous partagez un taxi avec elle et convenez d'un rendez-vous. C'est un game over sans prix.",
        tw: "你在房車後面看完那個褐髮女生，回到空蕩蕩的車站。黛安已經坐上了那班車。你和她共乘計程車，還約了下次見面。這是非獎項失敗結局。"
      },
      exit: {
        en: "The route ends immediately.",
        cn: "路线会直接结束。",
        es: "La ruta termina inmediatamente.",
        fr: "La route se termine immédiatement.",
        tw: "路線會直接結束。"
      },
      tags: ["luckytrip7", "carparkalone", "carpark2", "gameover"],
    },
    {
      stem: "16_brunette_behind_camper",
      base: "soloBrunetteBus",
      title: {
        en: "The Brunette Pees Where You Just Peed",
        cn: "褐发女生在你刚尿过的地方又尿一泡",
        es: "La morena hace pis donde acabas de hacer pis",
        fr: "La brune fait pipi là où vous venez de faire pipi",
        tw: "褐髮女生在你剛尿過的地方又尿一泡"
      },
      entry: {
        en: "This begins at the late bus queue after you have chosen Chardonnay and become desperate yourself.",
        cn: "这个场景从后段公交站开始，需要你晚餐点霞多丽白葡萄酒，之后自己也憋急。",
        es: "Empieza en la cola del autobús, después de elegir Chardonnay y acabar tú también apurado.",
        fr: "Cela commence dans la file du bus après avoir choisi du Chardonnay et avoir vous-même très envie d'y aller.",
        tw: "這個場景從後段公車站開始，需要你晚餐點霞多麗白葡萄酒，之後自己也憋急。"
      },
      result: {
        en: "You pee behind the camper van first; then the brunette squats in almost exactly the same spot. The route continues if Diane is still there.",
        cn: "你先在房车后面撒尿；接着褐发女生几乎就蹲在同一处急尿。如果黛安还在，路线会继续。",
        es: "Primero haces pis detrás de la autocaravana; luego la morena se agacha casi exactamente en el mismo sitio. La ruta continúa si Diane sigue allí.",
        fr: "Vous faites d'abord pipi derrière le camping-car ; puis la brune s'accroupit presque exactement au même endroit. La route continue si Diane est encore là.",
        tw: "你先在房車後面撒尿；接著褐髮女生幾乎就蹲在同一處急尿。如果黛安還在，路線會繼續。"
      },
      exit: {
        en: "The route returns to the bus queue.",
        cn: "路线会回到公交队伍。",
        es: "La ruta vuelve a la cola del autobús.",
        fr: "La route revient à la file du bus.",
        tw: "路線會回到公車隊伍。"
      },
      tags: ["busqueue3", "busqueue4", "busqueue5", "carpark", "carpark1", "carpark2"],
    },
    {
      stem: "17_diane_brunette_camper_round",
      base: "camperDecision",
      title: {
        en: "Peeping Round the Back of the Camper Van",
        cn: "绕到房车后面偷看",
        es: "Espiar por detrás de la autocaravana",
        fr: "Regarder par derrière le camping-car",
        tw: "繞到房車後面偷看"
      },
      entry: {
        en: "This begins after Diane and the brunette both fail to find an open toilet near the bus stop.",
        cn: "这个场景从黛安和褐发女生都找不到开放厕所开始。",
        es: "Empieza después de que Diane y la morena no encuentran un baño abierto cerca de la parada.",
        fr: "Cela commence après que Diane et la brune n'ont pas trouvé de toilettes ouvertes près de l'arrêt.",
        tw: "這個場景從黛安和褐髮女生都找不到開放廁所開始。"
      },
      result: {
        en: "You peep round the camper van and see both girls. The route continues to the taxi rank.",
        cn: "你会绕到房车后偷看两人，之后路线继续去出租车队伍。",
        es: "Espías por detrás de la autocaravana y ves a las dos chicas. La ruta continúa hacia la parada de taxis.",
        fr: "Vous jetez un coup d'œil derrière le camping-car et voyez les deux filles. La route continue vers la station de taxis.",
        tw: "你會繞到房車後偷看兩人，之後路線繼續去計程車隊伍。"
      },
      exit: {
        en: "The route continues to the taxi queue.",
        cn: "路线继续到出租车队伍。",
        es: "La ruta continúa hacia la cola de taxis.",
        fr: "La route continue vers la file de taxis.",
        tw: "路線繼續到計程車隊伍。"
      },
      tags: ["peepround", "peepround1"],
    },
    {
      stem: "18_diane_brunette_camper_under",
      base: "camperDecision",
      title: {
        en: "Peeping Underneath the Camper Van",
        cn: "从房车底下偷看",
        es: "Espiar por debajo de la autocaravana",
        fr: "Regarder sous le camping-car",
        tw: "從房車底下偷看"
      },
      entry: {
        en: "This uses the same camper van decision point, but you choose the riskier angle.",
        cn: "这个场景使用同一个房车选择点，但你选择更冒险的角度。",
        es: "Usa el mismo punto de decisión de la autocaravana, pero eliges el ángulo más arriesgado.",
        fr: "Cela utilise le même point de choix du camping-car, mais vous choisissez l'angle le plus risqué.",
        tw: "這個場景使用同一個房車選擇點，但你選擇更冒險的角度。"
      },
      result: {
        en: "You see both girls from underneath. On some routes this can become a failure branch.",
        cn: "你会从车底看到两人；在某些路线中，这可能变成失败分支。",
        es: "Ves a las dos chicas desde abajo. En algunas rutas puede convertirse en una rama de fracaso.",
        fr: "Vous voyez les deux filles par-dessous. Sur certaines routes, cela peut devenir une branche d'échec.",
        tw: "你會從車底看到兩人；在某些路線中，這可能變成失敗分支。"
      },
      exit: {
        en: "On this verified route it continues to the taxi queue.",
        cn: "在这条已验证路线中，它会继续到出租车队伍。",
        es: "En esta ruta verificada continúa hacia la cola de taxis.",
        fr: "Dans cette route vérifiée, cela continue vers la file de taxis.",
        tw: "在這條已驗證路線中，它會繼續到計程車隊伍。"
      },
      tags: ["peepunder", "peepunderluck"],
    },
    {
      stem: "22_caught_by_boyfriend",
      base: "camperDecision",
      title: {
        en: "Caught by the Brunette's Boyfriend",
        cn: "被褐发女生的男友抓包",
        es: "Pillado por el novio de la morena",
        fr: "Surpris par le petit ami de la brune",
        tw: "被褐髮女生的男友抓包"
      },
      entry: {
        en: "This uses the same camper van decision point, but you choose to stay put and risk it instead of spending a luckshot to duck out of sight.",
        cn: "这个场景使用同一个房车选择点，但你选择原地不动、赌一把，而不是花一次幸运机会躲开。",
        es: "Usa el mismo punto de decisión de la autocaravana, pero decides quedarte quieto y arriesgarte en lugar de usar una oportunidad de suerte para esconderte.",
        fr: "Cela utilise le même point de choix du camping-car, mais vous décidez de rester immobile et de risquer le coup plutôt que d'utiliser une opportunité de chance pour vous cacher.",
        tw: "這個場景使用同一個房車選擇點，但你選擇原地不動、賭一把，而不是花一次幸運機會躲開。"
      },
      result: {
        en: "The brunette's boyfriend catches you watching. He hits you and the girls look at you in disgust. This is a non-Prize game over.",
        cn: "褐发女生的男友抓到你在偷看。他打了你一拳，两个女生都用嫌恶的眼神看着你。这是非奖项失败结局。",
        es: "El novio de la morena te pilla mirando. Te pega y las chicas te miran con asco. Es un game over sin premio.",
        fr: "Le petit ami de la brune vous surprend en train de regarder. Il vous frappe et les filles vous regardent avec dégoût. C'est un game over sans prix.",
        tw: "褐髮女生的男友抓到你在偷看。他打了你一拳，兩個女生都用嫌惡的眼神看著你。這是非獎項失敗結局。"
      },
      exit: {
        en: "The route ends in a non-Prize game over.",
        cn: "路线会进入非奖项失败结局。",
        es: "La ruta termina en un game over sin premio.",
        fr: "La route se termine par un game over sans prix.",
        tw: "路線會進入非獎項失敗結局。"
      },
      tags: ["peepunder", "peepunderrisk", "gameover"],
    },
    {
      stem: "19_camper_gentleman_choice",
      base: "camperDecision",
      title: {
        en: "Not Watching Diane and the Brunette",
        cn: "选择不偷看黛安和褐发女生",
        es: "No mirar a Diane y a la morena",
        fr: "Ne pas regarder Diane et la brune",
        tw: "選擇不偷看黛安和褐髮女生"
      },
      entry: {
        en: "This uses the same camper van decision point, but you decide not to watch.",
        cn: "这个场景使用同一个房车选择点，但你选择不偷看。",
        es: "Usa el mismo punto de decisión de la autocaravana, pero decides no mirar.",
        fr: "Cela utilise le même point de choix du camping-car, mais vous décidez de ne pas regarder.",
        tw: "這個場景使用同一個房車選擇點，但你選擇不偷看。"
      },
      result: {
        en: "Diane leaves with the brunette (Debbie). This is a non-Prize game over.",
        cn: "黛安会和褐发女生（黛比）一起离开。这是非奖项失败结局。",
        es: "Diane se marcha con la morena (Debbie). Es un game over sin premio.",
        fr: "Diane part avec la brune (Debbie). C'est un game over sans prix.",
        tw: "黛安會和褐髮女生（黛比）一起離開。這是非獎項失敗結局。"
      },
      exit: {
        en: "The route ends immediately.",
        cn: "路线会直接结束。",
        es: "La ruta termina inmediatamente.",
        fr: "La route se termine immédiatement.",
        tw: "路線會直接結束。"
      },
      tags: ["gentleman", "gameover"],
    },
    {
      stem: "20_church_lych_gate_glimpse",
      base: "churchLychGate",
      title: {
        en: "Diane Pees by the Church",
        cn: "黛安在教堂旁小便",
        es: "Diane orina junto a la iglesia",
        fr: "Diane fait pipi près de l'église",
        tw: "黛安在教堂旁尿尿"
      },
      entry: {
        en: "This is a narrow Thursday route. It begins at Diane's stop: she gets off alone, desperate, and you spend a luckshot to walk back after her.",
        cn: "这是一条很窄的周四路线。从黛安那一站开始：她独自下车、明显憋急，你用一次幸运机会折返回去跟。",
        es: "Es una ruta estrecha del jueves. Empieza en la parada de Diane: baja sola y desesperada, y usas una oportunidad de suerte para volver tras ella.",
        fr: "C'est une route étroite du jeudi. Elle commence à l'arrêt de Diane : elle descend seule, pressée, et vous utilisez une opportunité de chance pour revenir sur vos pas.",
        tw: "這是一條很窄的週四路線。從黛安那一站開始：她獨自下車、明顯憋急，你用一次幸運機會折返回去跟。"
      },
      result: {
        en: "You glimpse Diane having an urgent pee in the church lych gate. The route ends immediately afterwards.",
        cn: "你会瞥见黛安在教堂停柩门里急着方便。随后路线立刻结束。",
        es: "Ves a Diane haciendo pis con urgencia en el lych gate de la iglesia. La ruta termina justo después.",
        fr: "Vous apercevez Diane en train de faire pipi en urgence sous le porche d'église. La route se termine juste après.",
        tw: "你會瞥見黛安在教堂停柩門裡急著方便。隨後路線立刻結束。"
      },
      exit: {
        en: "The route ends in a non-Prize game over.",
        cn: "路线会进入非奖项失败结局。",
        es: "La ruta termina en un game over sin premio.",
        fr: "La route se termine par un game over sans prix.",
        tw: "路線會進入非獎項失敗結局。"
      },
      tags: ["luckytrip17", "luckytrip17a", "luckytrip17b", "gameover"],
    },
    {
      stem: "20b_rioja_bus_glimpse",
      base: "busStopRioja",
      title: {
        en: "You Are Too Desperate to Walk Her Home",
        cn: "你因尿急没法送她回家",
        es: "Estás demasiado apurado para acompañarla a casa",
        fr: "Vous êtes trop pressé pour la raccompagner",
        tw: "你因尿急沒辦法送她回家"
      },
      entry: {
        en: "Same Thursday bus home, but you drank Rioja. It begins at her stop: you are too desperate to get off with her, pee behind a bush, then walk back.",
        cn: "同一条周四回家公交线，但你喝了里奥哈。从她那一站开始：自己憋得没法陪她下车，先在树丛后解决，再折返回去。",
        es: "La misma vuelta en bus del jueves, pero bebiste Rioja. Empieza en su parada: estás demasiado apurado para bajar con ella, haces pis detrás de un arbusto y luego vuelves.",
        fr: "Même retour en bus le jeudi, mais vous avez bu du Rioja. Cela commence à son arrêt : trop pressé pour descendre avec elle, vous faites pipi derrière un buisson puis vous revenez.",
        tw: "同一條週四回家公車線，但你喝了里奧哈。從她那一站開始：自己憋得沒辦法陪她下車，先在樹叢後解決，再折返回去。"
      },
      result: {
        en: "You relieve yourself behind a bush and walk back towards her stop—but you only scare up a stray cat. No glimpse of Diane. The route ends immediately afterwards.",
        cn: "你在树丛后解决后折返回她那站——却只惊起一只野猫，没瞥见黛安。随后路线立刻结束。",
        es: "Te alivias detrás de un arbusto y vuelves hacia su parada, pero solo espantas a un gato callejero. Sin vislumbre de Diane. La ruta termina justo después.",
        fr: "Vous vous soulagez derrière un buisson et revenez vers son arrêt — mais vous ne faites que faire fuir un chat errant. Pas d'aperçu de Diane. La route se termine juste après.",
        tw: "你在樹叢後解決後折返回她那站——卻只驚起一隻野貓，沒瞥見黛安。隨後路線立刻結束。"
      },
      exit: {
        en: "The route ends in a non-Prize game over.",
        cn: "路线会进入非奖项失败结局。",
        es: "La ruta termina en un game over sin premio.",
        fr: "La route se termine par un game over sans prix.",
        tw: "路線會進入非獎項失敗結局。"
      },
      tags: ["peestop1", "peestop2", "luckytrip17b", "gameover"],
    },
    {
      stem: "21_hidden_camera",
      base: "hiddenCamera",
      title: {
        en: "Your Brother's Hidden Bathroom Camera",
        cn: "弟弟的浴室隐藏摄像头",
        es: "La cámara oculta de tu hermano en el baño",
        fr: "La caméra cachée de votre frère dans la salle de bains",
        tw: "弟弟的浴室隱藏攝影機"
      },
      entry: {
        en: "This begins at your house on the Thursday short route, after Diane goes upstairs and you use a luckshot.",
        cn: "这个场景从周四短版到你家后开始，黛安上楼去厕所时你使用幸运机会。",
        es: "Empieza en tu casa en la ruta corta del jueves, después de que Diane suba y uses una oportunidad de suerte.",
        fr: "Cela commence chez vous dans la route courte du jeudi, après que Diane monte et que vous utilisez une opportunité de chance.",
        tw: "這個場景從週四短版到你家後開始，黛安上樓去廁所時你使用幸運機會。"
      },
      result: {
        en: "You and your brother watch the bathroom camera. This is a non-Prize game over.",
        cn: "你和弟弟会看到浴室摄像头画面。这是非奖项失败结局。",
        es: "Tú y tu hermano veis la cámara del baño. Es un game over sin premio.",
        fr: "Vous et votre frère regardez la caméra de la salle de bains. C'est un game over sans prix.",
        tw: "你和弟弟會看到浴室攝影機畫面。這是非獎項失敗結局。"
      },
      exit: {
        en: "The route ends after Diane leaves.",
        cn: "黛安离开后路线结束。",
        es: "La ruta termina cuando Diane se marcha.",
        fr: "La route se termine après le départ de Diane.",
        tw: "黛安離開後路線結束。"
      },
      tags: ["hiddencamera", "hiddencamera1", "gameover"],
    },
  ];

  return { bases, scenes };
}

function main() {
  const routes = loadRoutes();
  const definitions = buildDefinitions(routes);
  LEGACY_HIDDEN_OUTPUTS.forEach((target) => fs.rmSync(target, { recursive: true, force: true }));
  console.log(
    `Verified ${definitions.scenes.length} hidden-scene definitions for Gallery (no guide/transcript files written).`
  );
}

main();
