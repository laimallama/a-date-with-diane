const fs = require("fs");
const path = require("path");
const vm = require("vm");
const mod = require("module");

const ROOT = path.resolve(__dirname, "..");
const ENDING_ROUTES_SOURCE = path.join(ROOT, "maintenance/verify_ending_routes.js");
// This command checks definitions without modifying any files.

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
      "It’s your round.",
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
      tags: ["luckytrip3", "underbridge", "underbridge2", "underbridge3"],
    },
    {
      stem: "05_molly_bruno_towpath",
      base: "mollyBrunoTowpath",
      title: {
        en: "Molly Pees Behind the Skip",
        cn: "莫莉在废料箱后面撒尿",
        es: "Molly hace pis detrás del contenedor de obra",
        fr: "Molly fait pipi derrière la benne de chantier",
        tw: "莫莉在工地貨櫃後面撒尿"
      },
      tags: ["riverside13", "luckytrip4", "luckytrip4a", "luckytrip4b"],
    },
    {
      stem: "06_diane_slips_away_while_watching_molly",
      base: "mollyBrunoTowpathHigh",
      title: {
        en: "Diane Sneaks a Pee While You Watch Molly",
        cn: "你偷看莫莉时黛安悄悄去撒尿",
        es: "Diane se escapa a hacer pis mientras miras a Molly",
        fr: "Diane va faire pipi en cachette pendant que vous regardez Molly",
        tw: "你偷看莫莉時黛安悄悄去撒尿"
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
      tags: ["helpdiane1a", "helpdiane1aa", "helpdiane1b"],
    },
    {
      stem: "08_riverside_towpath_landing",
      base: "riversideEmergency",
      title: {
        en: "Diane Pees on the Towpath Steps",
        cn: "黛安在河边台阶上小便",
        es: "Diane orina en las escaleras del sendero",
        fr: "Diane fait pipi dans les marches du chemin de halage",
        tw: "黛安在河邊台階上尿尿"
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
      tags: ["justclosed1", "justclosed2", "justclosed3", "urinal", "riverside15"],
    },
    {
      stem: "28_luckshot_brunette_camper",
      base: "luckshotBrunetteBus",
      title: {
        en: "The Brunette Pees Behind the Camper Van",
        cn: "褐发女生在房车后面撒尿",
        es: "La morena hace pis detrás de la autocaravana",
        fr: "La brune fait pipi derrière le camping-car",
        tw: "褐髮女生在房車後面撒尿"
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
      tags: ["hiddencamera", "hiddencamera1", "gameover"],
    },
  ];

  return { bases, scenes };
}

function main() {
  const routes = loadRoutes();
  const definitions = buildDefinitions(routes);
  console.log(
    `Verified ${definitions.scenes.length} hidden-scene definitions for Gallery (read-only; route replay is checked by verify_project.js).`
  );
}

main();
