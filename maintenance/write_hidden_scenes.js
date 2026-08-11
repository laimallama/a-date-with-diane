const fs = require("fs");
const path = require("path");
const vm = require("vm");
const mod = require("module");

const ROOT = path.resolve(__dirname, "..");
const GUIDE_SOURCE = path.join(ROOT, "maintenance/write_verified_guides.js");
const LEGACY_HIDDEN_OUTPUTS = [
  path.join(ROOT, "outputs/en/hidden_scene_transcripts_en"),
  path.join(ROOT, "outputs/cn/hidden_scene_transcripts_cn"),
  path.join(ROOT, "outputs/es/hidden_scene_transcripts_es"),
  path.join(ROOT, "outputs/fr/hidden_scene_transcripts_fr"),
  path.join(ROOT, "outputs/en/transcripts/hidden_scenes"),
  path.join(ROOT, "outputs/cn/transcripts/hidden_scenes"),
  path.join(ROOT, "outputs/es/transcripts/hidden_scenes"),
  path.join(ROOT, "outputs/fr/transcripts/hidden_scenes"),
  path.join(ROOT, "outputs/en/hidden_scenes_guide_en.txt"),
  path.join(ROOT, "outputs/cn/hidden_scenes_guide_cn.txt"),
  path.join(ROOT, "outputs/es/hidden_scenes_guide_es.txt"),
  path.join(ROOT, "outputs/fr/hidden_scenes_guide_fr.txt"),
  path.join(ROOT, "outputs/en/guides/hidden_scenes_guide_en.txt"),
  path.join(ROOT, "outputs/cn/guides/hidden_scenes_guide_cn.txt"),
  path.join(ROOT, "outputs/es/guides/hidden_scenes_guide_es.txt"),
  path.join(ROOT, "outputs/fr/guides/hidden_scenes_guide_fr.txt"),
  path.join(ROOT, "outputs/en/hidden_scenes/transcripts"),
  path.join(ROOT, "outputs/cn/hidden_scenes/transcripts"),
  path.join(ROOT, "outputs/es/hidden_scenes/transcripts"),
  path.join(ROOT, "outputs/fr/hidden_scenes/transcripts"),
  path.join(ROOT, "outputs/en/hidden_scenes/code_fragments"),
  path.join(ROOT, "outputs/cn/hidden_scenes/code_fragments"),
  path.join(ROOT, "outputs/es/hidden_scenes/code_fragments"),
  path.join(ROOT, "outputs/fr/hidden_scenes/code_fragments"),
  path.join(ROOT, "outputs/tw/hidden_scenes/code_fragments"),
];

const languages = {
  en: {
    htmlPath: path.join(ROOT, "outputs/en/dianedate_en.html"),
    guidePath: path.join(ROOT, "outputs/en/hidden_scenes/hidden_scenes_guide_en.txt"),
    transcriptDir: path.join(ROOT, "outputs/en/hidden_scenes/scene_transcripts"),
    heading: "Hidden Scenes Guide",
    intro: [
      "This guide covers optional hidden scenes rather than official endings.",
      "The official Prize and Consolation Prize routes remain in the main endings guide.",
      "Use the bases below first, then follow the extra steps listed under each scene.",
    ],
    baseLabel: "Base",
    baseHeading: "Bases",
    sceneLabel: "Hidden Scene",
    sceneHeading: "Scenes",
    useBase: "Use base",
    thenPress: "Then press:",
    resultLabel: "Result:",
    entryLabel: "Entry:",
    exitLabel: "Exit:",
    labelJoiner: " ",
    baseJoiner: " ",
    useJoiner: " ",
    sentenceEnd: ".",
  },
  cn: {
    htmlPath: path.join(ROOT, "outputs/cn/dianedate_cn.html"),
    guidePath: path.join(ROOT, "outputs/cn/hidden_scenes/hidden_scenes_guide_cn.txt"),
    transcriptDir: path.join(ROOT, "outputs/cn/hidden_scenes/scene_transcripts"),
    heading: "隐藏场景指南",
    intro: [
      "这份指南收录的是可选隐藏场景，不是正式结局。",
      "正式奖项和安慰奖路线仍然以主结局指南为准。",
      "先按下面的基础路线走到指定位置，再按每个隐藏场景下面的额外步骤继续。",
    ],
    baseLabel: "基础路线",
    baseHeading: "基础路线",
    sceneLabel: "隐藏场景",
    sceneHeading: "隐藏场景",
    useBase: "使用基础路线",
    thenPress: "然后按：",
    resultLabel: "结果：",
    entryLabel: "进入位置：",
    exitLabel: "离开位置：",
    labelJoiner: "",
    baseJoiner: "",
    useJoiner: "",
    sentenceEnd: "。",
  },
  es: {
    htmlPath: path.join(ROOT, "outputs/es/dianedate_es.html"),
    guidePath: path.join(ROOT, "outputs/es/hidden_scenes/hidden_scenes_guide_es.txt"),
    transcriptDir: path.join(ROOT, "outputs/es/hidden_scenes/scene_transcripts"),
    heading: "Guía de escenas ocultas",
    intro: [
      "Esta guía cubre escenas ocultas opcionales, no finales oficiales.",
      "Las rutas de premios y premios de consolación siguen estando en la guía principal de finales.",
      "Usa primero las bases de abajo y después sigue los pasos extra indicados en cada escena.",
    ],
    baseLabel: "Base",
    baseHeading: "Bases",
    sceneLabel: "Escena oculta",
    sceneHeading: "Escenas",
    useBase: "Usa la base",
    thenPress: "Después pulsa:",
    resultLabel: "Resultado:",
    entryLabel: "Entrada:",
    exitLabel: "Salida:",
    labelJoiner: " ",
    baseJoiner: " ",
    useJoiner: " ",
    sentenceEnd: ".",
  },
  fr: {
    htmlPath: path.join(ROOT, "outputs/fr/dianedate_fr.html"),
    guidePath: path.join(ROOT, "outputs/fr/hidden_scenes/hidden_scenes_guide_fr.txt"),
    transcriptDir: path.join(ROOT, "outputs/fr/hidden_scenes/scene_transcripts"),
    heading: "Guide des scènes cachées",
    intro: [
      "Ce guide couvre les scènes cachées optionnelles, pas les fins officielles.",
      "Les routes des prix et des prix de consolation restent dans le guide principal des fins.",
      "Utilisez d'abord les bases ci-dessous, puis suivez les étapes supplémentaires indiquées pour chaque scène.",
    ],
    baseLabel: "Base",
    baseHeading: "Bases",
    sceneLabel: "Scène cachée",
    sceneHeading: "Scènes",
    useBase: "Utilisez la base",
    thenPress: "Puis cliquez sur :",
    resultLabel: "Résultat :",
    entryLabel: "Entrée :",
    exitLabel: "Sortie :",
    labelJoiner: " ",
    baseJoiner: " ",
    useJoiner: " ",
    sentenceEnd: ".",
  },
  tw: {
    htmlPath: path.join(ROOT, "outputs/tw/dianedate_tw.html"),
    guidePath: path.join(ROOT, "outputs/tw/hidden_scenes/hidden_scenes_guide_tw.txt"),
    transcriptDir: path.join(ROOT, "outputs/tw/hidden_scenes/scene_transcripts"),
    heading: "隱藏場景指南",
    intro: [
      "這份指南收錄的是可選隱藏場景，不是正式結局。",
      "正式獎項和安慰獎路線仍然以主結局指南為準。",
      "先按下面的基礎路線走到指定位置，再按每個隱藏場景下面的額外步驟繼續。",
    ],
    baseLabel: "基礎路線",
    baseHeading: "基礎路線",
    sceneLabel: "隱藏場景",
    sceneHeading: "隱藏場景",
    useBase: "使用基礎路線",
    thenPress: "然後按：",
    resultLabel: "結果：",
    entryLabel: "進入位置：",
    exitLabel: "離開位置：",
    labelJoiner: "",
    baseJoiner: "",
    useJoiner: "",
    sentenceEnd: "。",
  },
};

function loadRoutes() {
  const source = fs.readFileSync(GUIDE_SOURCE, "utf8");
  const localRequire = mod.createRequire(GUIDE_SOURCE);
  const context = {
    console: { log() {}, error: console.error },
    require: localRequire,
    process,
    __dirname: path.dirname(GUIDE_SOURCE),
    __filename: GUIDE_SOURCE,
    globalThis: {},
  };
  context.global = context;
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(`${source}\nglobalThis.__routes = routes;`, context, { filename: GUIDE_SOURCE });
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

function shouldQuoteEmphasis(text, langCode) {
  const clean = text.trim();
  if (!clean || clean.length > 140) return false;
  if (/\b(points?|puntos?|点|分|點|timidez|intimidad|亲密度|親密度|害羞值)\b/i.test(clean)) return false;
  const lower = clean.toLowerCase();
  const stageStarts = [
    "almost ", "between ", "softly", "with ", "then ", "she ",
    "en voz baja", "con ", "poniéndose", "casi ", "entre ",
    "à voix", "doucement", "rouge", "glousse", "elle ", "vous l'entendez",
    "她", "几乎", "声音", "轻声", "脸红",
    "幾乎", "聲音", "輕聲", "臉紅",
  ];
  if (langCode === "en" && lower.startsWith("he ")) return false;
  if (stageStarts.some((start) => lower.startsWith(start))) return false;

  const starts = {
    en: /^(i\b|i'm\b|i’m\b|why\b|it\b|if one\b|you want\b|we'll\b|we’ll\b|but\b|cheers!?$|that\b|shall\b|do\b|diane,|found\b|hurry\b|come on\b|give\b|you can\b|can i\b|what\b|oh\b|oooh\b|god\b|sorry\b)/i,
    cn: /^(对不起|我|你们先走|你想|一个去了|你当初|你倒|可总有|干杯|真的|我们|黛安|找到了|快点|走吧|抱抱我|天哪|老天|抱歉|真是)/,
    tw: /^(對不起|我|你們先走|你想|一個去了|你當初|你倒|可總有|乾杯|真的|我們|黛安|找到了|快點|走吧|抱抱我|天哪|老天|抱歉|真是)/,
    es: /^(lo siento|no podía|¿|a ti\b|pero\b|si una\b|tú quieres\b|¡salud|ha sido|he\b|me\b|sé(?:\s|$)|diane,|no encuentro|ya lo|date prisa|¡date prisa|os alcanzamos|necesito|venga|dame|ya ves|qué buena|¡oooh|lo necesitaba|¡dios|perdona)/i,
    fr: /^(je\b|j[’']|pourquoi|c[’']est|mais\b|si l'une\b|tu veux\b|vous voulez\b|santé|c[’']était|on s'assoit|on vous|vous savez|diane,|je ne trouve|trouvé|dépêche|dépêchez|allez|fais-moi|vous voyez|quelle bonne|désolée|oh mon|oooh|mon dieu)/i,
  };
  return (starts[langCode] || starts.en).test(clean);
}

function quoteForTranscript(text, langCode) {
  if ((langCode === "es" || langCode === "fr") && text.endsWith(",")) {
    const body = text.slice(0, -1);
    return langCode === "es" ? `«${body}»,` : `« ${body} »,`;
  }
  if (langCode === "es") return `«${text}»`;
  if (langCode === "fr") return `« ${text} »`;
  if (langCode === "tw") return `「${text}」`;
  return `“${text}”`;
}

function bracketForTranscript(text) {
  const clean = String(text)
    .trim()
    .replace(/^[（(]\s*/, "")
    .replace(/\s*[）)]$/, "");
  return clean ? `[${clean}]` : "";
}

function quoteEmphasisForTranscript(html, langCode) {
  return String(html).replace(/<(EM|B)>([\s\S]*?)<\/\1>/gi, (match, _tag, inner) => {
    if (/<span\b/i.test(inner)) return match;
    const text = stripTags(inner);
    if (!text) return "";
    if (_tag.toUpperCase() === "B") return text;
    if (text === "Outside Edge") return quoteForTranscript(text, langCode);
    if (shouldQuoteEmphasis(text, langCode)) return quoteForTranscript(text, langCode);
    return bracketForTranscript(text);
  });
}

function separateSpeakerStageDirections(html) {
  return String(html);
}

function capitaliseSpeakerBracket(text) {
  return text.replace(
    /((?:YOU|DIANE|MOLLY|BRUNO|ROBERT|CHLOE|AMANDA):\s*)\[([a-z])([^\]]*)\]/g,
    (match, speaker, first, rest) => `${speaker}[${first.toUpperCase()}${rest}]`,
  );
}

function polishTranscriptText(text, langCode) {
  let out = text.replace(
    /((?:YOU|DIANE|MOLLY|BRUNO|ROBERT|CHLOE|AMANDA|Diane|Molly|Chloe|Amanda|TÚ|VOUS|你|黛安|莫莉|布鲁诺|罗伯特|克洛伊|阿曼达|布魯諾|羅伯特)\s*(?:[:：]| :))\s*(\[[^\]]+\])\s*(?:[:：]| :)\s*/g,
    (match, speaker, bracket) => `${speaker}${/：$/.test(speaker.trim()) ? "" : " "}${bracket} `,
  );
  if (langCode === "cn" || langCode === "tw") {
    out = out
      .replace(/(你|黛安|莫莉|布鲁诺|罗伯特|克洛伊|阿曼达|布魯諾|羅伯特)(\[[^\]]+\])：\s*/g, "$1：$2 ")
      .replace(/\]([\u3400-\u9fffA-Za-z0-9])/g, "] $1");
    if (langCode === "cn") {
      out = out
        .replace(/说：\[你想看，我也想看\]\s*/g, "说：“你想看，我也想看。”")
        .replace(/\[有一个就会有第二个\]，他低声耳语道。/g, "“有一个就会有第二个，”他低声耳语道。");
    } else {
      out = out
        .replace(/說：\[你想看，我也想看\]\s*/g, "說：「你想看，我也想看。」")
        .replace(/\[有一個就會有第二個\]，他低聲耳語道。/g, "「有一個就會有第二個，」他低聲耳語道。");
    }
  } else {
    out = out.replace(/\]([A-Za-z0-9À-ÖØ-öø-ÿ¿¡])/g, "] $1");
  }
  if (langCode === "es") {
    out = out.replace(/(susurra[^:\n]*:\s*)\[([^\]\n]+)\]/gi, "$1«$2»");
  }
  if (langCode === "fr") {
    out = out.replace(/(chuchote[^:\n]*:\s*)\[([^\]\n]+)\]/gi, "$1« $2 »");
  }
  if (langCode === "en") {
    out = capitaliseSpeakerBracket(out)
      .replace(/\b1 intimacy pts\b/gi, "1 intimacy point")
      .replace(/\b([0-9]+) intimacy pts\b/gi, "$1 intimacy points")
      .replace(/“If one goes, the other always goes”\s+he whispers/g, "“If one goes, the other always goes,” he whispers")
      .replace(/"If one goes, the other always goes"\s+he whispers/g, "\"If one goes, the other always goes,\" he whispers");
  }
  return out;
}

function visibleStory(html, langCode = "en") {
  const text = quoteEmphasisForTranscript(separateSpeakerStageDirections(removeUi(html)), langCode)
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, inner) => `\n\n【${stripTags(inner)}】\n\n`)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<hr\s*\/?>/gi, "\n\n")
    .replace(/<\/(?:p|h1|h2|div)>/gi, "\n\n")
    .replace(/<[^>]+>/g, "");
  const visible = decodeEntities(text)
    .split(/\n/)
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return polishTranscriptText(visible, langCode);
}

function normalize(text) {
  return stripTags(text)
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function plainEnglishTxt(text) {
  return text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
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

function choiceTextsForTags(tags, lang, context, preludeTags = []) {
  const game = loadGame(lang.htmlPath);
  preludeTags.forEach((tag, index) => {
    runTag(game, tag, `${context} prelude, step ${index + 1}`);
  });
  const texts = [];
  tags.forEach((tag, index) => {
    const text = runTag(game, tag, `${context}, step ${index + 1}`);
    texts.push(text);
  });
  return texts;
}

function numberLines(items) {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

function buildDefinitions(routes) {
  const secondTags = routeToTags(routes.second, routes);
  const generalTags = routeToTags(routes.general, routes);

  const theatreFlashback = secondTags.slice(0, 30);
  const riversideBench = secondTags.slice(0, 71);
  const riversideEmergency = secondTags.slice(0, 80);

  const openPublicToiletSpyhole = [
    "start", "start1a", "start1b", "tuesdaydate", "start2", "gothere",
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
    "start", "start1a", "start1b", "thursdaydate", "start2", "gothere",
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
  ];

  const mollyBrunoTowpath = [
    "start", "start1a", "start1b", "tuesdaydate", "start2", "buysth",
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
    "start", "start1a", "start1b", "tuesdaydate", "start2", "gothere",
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

  const soloBrunetteBus = secondTags.slice(0, 102);
  soloBrunetteBus[10] = "buychardonnay";

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

  const camperDecision = generalTags.slice(0, 103).concat([
    "queue1b",
    "carparka",
    "carparka0",
    "carparka1",
    "carparka2",
    "carparka3",
  ]);

  const hiddenCamera = [
    "start", "start1a", "start1b", "thursdaydate", "start2", "gothere", "flirt_l",
    "winelist", "buyrioja", "eatmeal", "buylasagne", "eatmeal4", "eatmeal4a",
    "eatmeal4b", "eatmeal4c", "eatmeal4d", "eatmeal7", "eatmeal7a", "puddings",
    "buytiramisu", "eatmeal7b", "filtercoffee", "eatmeal7bb", "gotheatre",
    "theatreask", "testtue", "testtue1", "arrivehome", "arrivehome0",
    "arrivehome1", "scenario2", "coffeereal2", "scenario2a", "scenario2b",
    "scenario2c", "asklooneed", "asklooneed1", "asklooneed2", "offercoffeeagain",
    "offercoffeeagain1", "luckytrip11", "luckytrip11a",
  ];

  const churchLychGate = [
    "start", "start1a", "start1b", "thursdaydate", "start2", "gothere",
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
        en: "12: Thursday church lych gate setup",
        cn: "12：周四墓园门廊基础路线",
        es: "12: Base del pórtico de la iglesia del jueves",
        fr: "12 : Base du porche de l'église le jeudi",
        tw: "12：週四墓園門廊基礎路線"
      },
      tags: churchLychGate,
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
        cn: "帮黛安找到隐藏的临时厕所",
        es: "Encontrar el baño portátil oculto para Diane",
        fr: "Trouver les toilettes portatives cachées pour Diane",
        tw: "幫黛安找到隱藏的臨時廁所"
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
        cn: "黛安会用上临时厕所，之后路线继续。",
        es: "Diane puede usar el baño portátil. La ruta continúa después.",
        fr: "Diane peut utiliser les toilettes portatives. La route continue ensuite.",
        tw: "黛安會用上臨時廁所，之後路線繼續。"
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
        cn: "过于直接地提醒她临时厕所",
        es: "Ofrecer el baño portátil de forma demasiado directa",
        fr: "Proposer les toilettes portatives trop directement",
        tw: "過於直接地提醒她臨時廁所"
      },
      entry: {
        en: "This is the alternative Portaloo branch at the same riverside bench.",
        cn: "这是同一处河边长椅上的临时厕所变体分支。",
        es: "Es la variante del baño portátil en el mismo banco junto al río.",
        fr: "C'est la variante des toilettes portatives au même banc au bord de la rivière.",
        tw: "這是同一處河邊長椅上的臨時廁所變體分支。"
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
        en: "This is a Thursday-only riverside branch, after Diane and Molly hint that they are going down to the towpath.",
        cn: "这是周四限定的河边分支，从黛安和莫莉暗示要下到纤道那边开始。",
        es: "Es una rama del jueves junto al río, después de que Diane y Molly insinúen que van a bajar al sendero junto al agua.",
        fr: "C'est une branche du jeudi au bord de la rivière, après que Diane et Molly laissent entendre qu'elles descendent sur le chemin de halage.",
        tw: "這是週四限定的河邊分支，從黛安和莫莉暗示要下到纖道那邊開始。"
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
      tags: ["riverside7", "riverside8", "riverside9", "riversidepath", "luckytrip3", "underbridge", "underbridge2", "underbridge3"],
    },
    {
      stem: "05_molly_bruno_towpath",
      base: "mollyBrunoTowpath",
      title: {
        en: "Watching Molly Behind the Skip",
        cn: "偷看莫莉在废料箱后面撒尿",
        es: "Ver a Molly detrás del contenedor de obra",
        fr: "Regarder Molly derrière la benne de chantier",
        tw: "偷看莫莉在廢料箱後面撒尿"
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
        tw: "你會先看到布魯諾，再看到莫莉在廢料箱後面撒尿，之後黛安會調侃你。"
      },
      exit: {
        en: "The route continues toward the riverside public toilets.",
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
        en: "The route continues toward the riverside public toilets.",
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
        en: "Diane Goes Behind the Riverside Bushes",
        cn: "黛安去河边灌木后面方便",
        es: "Diane va detrás de los arbustos junto al río",
        fr: "Diane va derrière les buissons au bord de la rivière",
        tw: "黛安去河邊灌木後面方便"
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
        tw: "黛安會在灌木後面急著方便一次，之後路線繼續。"
      },
      exit: {
        en: "The route continues toward the riverside public toilets.",
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
        en: "You and Diane Both Go Behind the Bushes",
        cn: "你和黛安一起去灌木后面方便",
        es: "Tú y Diane vais juntos detrás de los arbustos",
        fr: "Vous et Diane allez tous les deux derrière les buissons",
        tw: "你和黛安一起去灌木後面方便"
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
        tw: "你們會分別到灌木後面方便，之後路線繼續。"
      },
      exit: {
        en: "The route continues toward the riverside public toilets.",
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
        en: "The Public Toilet Spyhole and Discarded Panties",
        cn: "公共厕所里的偷看孔和遗落的内裤",
        es: "El agujero para espiar en el baño público y las bragas abandonadas",
        fr: "Le trou d'espionnage des toilettes publiques et la culotte abandonnée",
        tw: "公共廁所裡的偷看孔和遺落的內褲"
      },
      entry: {
        en: "This begins when you send Diane toward the riverside public toilets instead of finding bushes.",
        cn: "这个场景从你让黛安去河边公共厕所开始，而不是直接帮她找灌木。",
        es: "Empieza cuando envías a Diane hacia los baños públicos junto al río en lugar de buscar arbustos.",
        fr: "Cela commence quand vous envoyez Diane vers les toilettes publiques au lieu de chercher des buissons.",
        tw: "這個場景從你讓黛安去河邊公共廁所開始，而不是直接幫她找灌木。"
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
      en: "The Public Toilet Spyhole and Diane's Stockings",
      cn: "公共厕所里的偷看孔和黛安的丝袜",
      es: "El agujero para espiar del baño público y las medias de Diane",
      fr: "Le trou d'espionnage des toilettes publiques et les bas de Diane",
      tw: "公共廁所裡的偷看孔和黛安的絲襪"
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
        cn: "幸运机会让你找到了偷看孔，但黛安选了另一个隔间。如果你继续看，就会看到她在洗手台前整理丝袜。",
        es: "La oportunidad de suerte te lleva al agujero, pero Diane ha elegido otra cabina. Si sigues mirando, la ves en el lavabo arreglándose las medias.",
        fr: "L'opportunité de chance vous mène au trou, mais Diane a choisi une autre cabine. Si vous continuez à regarder, vous la voyez au lavabo en train d'ajuster ses bas.",
        tw: "幸運機會讓你找到了偷看孔，但黛安選了另一個隔間。如果你繼續看，就會看到她在洗手台前整理絲襪。"
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
        en: "Diane Goes Behind the Closed Toilet Building",
        cn: "黛安绕到关门的厕所后面方便",
        es: "Diane va detrás del baño cerrado",
        fr: "Diane va derrière les toilettes fermées",
        tw: "黛安繞到關門的廁所後面方便"
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
        en: "Taking Turns Behind the Closed Toilet Building",
        cn: "和黛安轮流到关门的厕所后面方便",
        es: "Turnarse detrás del baño cerrado",
        fr: "Se relayer derrière les toilettes fermées",
        tw: "和黛安輪流到關門的廁所後面方便"
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
        en: "Asking Diane to Hold On at the Closed Toilet",
        cn: "在关门的厕所前让黛安继续憋着",
        es: "Pedirle a Diane que aguante en el baño cerrado",
        fr: "Demander à Diane de tenir devant les toilettes fermées",
        tw: "在關門的廁所前讓黛安繼續憋著"
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
        tw: "黛安使用男廁小便池"
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
        tw: "管理員打開男廁，但隔間沒法用，黛安只好當著你的面使用小便池。"
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
      stem: "16_brunette_behind_camper",
      base: "soloBrunetteBus",
      title: {
        en: "Watching the Brunette Behind the Camper Van",
        cn: "看褐发女生在房车后面撒尿",
        es: "Ver a la morena detrás de la autocaravana",
        fr: "Regarder la brune derrière le camping-car",
        tw: "看褐髮女生在房車後面撒尿"
      },
      entry: {
        en: "This begins at the late bus queue after you have chosen Chardonnay and become desperate yourself.",
        cn: "这个场景从后段公交站开始，需要你晚餐点霞多丽白葡萄酒，之后自己也憋急。",
        es: "Empieza en la cola del autobús, después de elegir Chardonnay y acabar tú también apurado.",
        fr: "Cela commence dans la file du bus après avoir choisi du Chardonnay et avoir vous-même très envie d'y aller.",
        tw: "這個場景從後段公車站開始，需要你晚餐點霞多麗白葡萄酒，之後自己也憋急。"
      },
      result: {
        en: "You see the brunette have an urgent pee behind the camper van. The route continues if Diane is still there.",
        cn: "你会看到褐发女生在房车后面急着撒尿；如果黛安还在，路线会继续。",
        es: "Ves a la morena hacer pis de urgencia detrás de la autocaravana. La ruta continúa si Diane sigue allí.",
        fr: "Vous voyez la brune faire pipi en urgence derrière le camping-car. La route continue si Diane est encore là.",
        tw: "你會看到褐髮女生在房車後面急著撒尿；如果黛安還在，路線會繼續。"
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
        en: "Diane and the Brunette Behind the Camper Van",
        cn: "黛安和褐发女生一起到房车后面方便",
        es: "Diane y la morena detrás de la autocaravana",
        fr: "Diane et la brune derrière le camping-car",
        tw: "黛安和褐髮女生一起到房車後面方便"
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
        en: "Not Watching Diane and Debbie",
        cn: "选择不偷看黛安和黛比",
        es: "No mirar a Diane y Debbie",
        fr: "Ne pas regarder Diane et Debbie",
        tw: "選擇不偷看黛安和黛比"
      },
      entry: {
        en: "This uses the same camper van decision point, but you decide not to watch.",
        cn: "这个场景使用同一个房车选择点，但你选择不偷看。",
        es: "Usa el mismo punto de decisión de la autocaravana, pero decides no mirar.",
        fr: "Cela utilise le même point de choix du camping-car, mais vous décidez de ne pas regarder.",
        tw: "這個場景使用同一個房車選擇點，但你選擇不偷看。"
      },
      result: {
        en: "Diane leaves with Debbie. This is a non-Prize game over.",
        cn: "黛安会和黛比一起离开。这是非奖项失败结局。",
        es: "Diane se marcha con Debbie. Es un game over sin premio.",
        fr: "Diane part avec Debbie. C'est un game over sans prix.",
        tw: "黛安會和黛比一起離開。這是非獎項失敗結局。"
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
        en: "Church Lych Gate Glimpse",
        cn: "墓园门廊一瞥",
        es: "Vistazo en el pórtico de la iglesia",
        fr: "Aperçu sous le porche de l'église",
        tw: "墓園門廊一瞥"
      },
      entry: {
        en: "This is a very narrow Thursday route after Diane gets off the bus alone and you use your last luckshot to walk back after her.",
        cn: "这是一个非常窄的周四路线。黛安独自下公车后，你用最后一次幸运机会折返回去找她。",
        es: "Es una ruta muy estrecha del jueves, después de que Diane baja sola del autobús y usas tu última oportunidad de suerte para volver a buscarla.",
        fr: "C'est une route très étroite du jeudi, après que Diane descend seule du bus et que vous utilisez votre dernière opportunité de chance pour revenir la chercher.",
        tw: "這是一個非常窄的週四路線。黛安獨自下公車後，你用最後一次幸運機會折返回去找她。"
      },
      result: {
        en: "You glimpse Diane at the church lych gate after she has had an urgent pee there. The route ends immediately afterwards.",
        cn: "你会在教堂墓园门廊处瞥见黛安，她已经在那里急着尿过了。随后路线立刻结束。",
        es: "Ves a Diane junto al pórtico de la iglesia después de que ha hecho pis allí con urgencia. La ruta termina justo después.",
        fr: "Vous apercevez Diane sous le porche de l'église après qu'elle y a fait pipi en urgence. La route se termine juste après.",
        tw: "你會在教堂墓園門廊處瞥見黛安，她已經在那裡急著尿過了。隨後路線立刻結束。"
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

function buildGuide(lang, bases, scenes) {
  const parts = [lang.heading, "", ...lang.intro, "", lang.baseHeading, ""];
  for (const base of Object.values(bases)) {
    parts.push(`${lang.baseLabel}${lang.baseJoiner}${base.name[lang.code] || base.name.en}`);
    parts.push(numberLines(choiceTextsForTags(base.tags, lang, base.name.en)));
    parts.push("");
  }
  parts.push(lang.sceneHeading, "");
  scenes.forEach((scene, index) => {
    const sceneTitle = scene.title[lang.code] || scene.title.en;
    parts.push((lang.code === "cn" || lang.code === "tw") ? `${lang.sceneLabel}${index + 1}：${sceneTitle}` : `${lang.sceneLabel} ${index + 1}: ${sceneTitle}`);
    parts.push(`${lang.entryLabel}${lang.labelJoiner}${scene.entry[lang.code] || scene.entry.en}`);
    parts.push(`${lang.useBase}${lang.useJoiner}${bases[scene.base].name[lang.code] || bases[scene.base].name.en}${lang.sentenceEnd}`);
    parts.push(lang.thenPress);
    parts.push(numberLines(choiceTextsForTags(scene.tags, lang, scene.title.en, bases[scene.base].tags)));
    parts.push(`${lang.resultLabel}${lang.labelJoiner}${scene.result[lang.code] || scene.result.en}`);
    parts.push(`${lang.exitLabel}${lang.labelJoiner}${scene.exit[lang.code] || scene.exit.en}`);
    parts.push("");
  });
  return parts.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

function buildTranscript(lang, scene, bases) {
  const game = loadGame(lang.htmlPath);
  const base = bases[scene.base];
  for (const tag of base.tags) runTag(game, tag, `${scene.title.en} base`);

  const parts = [
    scene.title[lang.code] || scene.title.en,
    "",
  ];

  scene.tags.forEach((tag, index) => {
    const page = visibleStory(game.box.innerHTML, lang.code);
    const choiceText = runTag(game, tag, `${scene.title.en} scene step ${index + 1}`);
    if (page) parts.push(page, "");
    parts.push(`(${choiceText})`, "");
  });

  const finalPage = visibleStory(game.box.innerHTML, lang.code);
  if (finalPage) parts.push(finalPage, "");
  return parts.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

function writeTextFile(outPath, text, langCode) {
  fs.writeFileSync(outPath, langCode === "en" ? `\uFEFF${text}` : text, "utf8");
}

function main() {
  const routes = loadRoutes();
  const definitions = buildDefinitions(routes);
  LEGACY_HIDDEN_OUTPUTS.forEach((target) => fs.rmSync(target, { recursive: true, force: true }));
  for (const [code, lang] of Object.entries(languages)) {
    lang.code = code;
    fs.mkdirSync(path.dirname(lang.guidePath), { recursive: true });
    const guide = buildGuide(lang, definitions.bases, definitions.scenes);
    writeTextFile(lang.guidePath, code === "en" ? plainEnglishTxt(guide) : guide, code);
    fs.rmSync(lang.transcriptDir, { recursive: true, force: true });
    fs.mkdirSync(lang.transcriptDir, { recursive: true });
    definitions.scenes.forEach((scene) => {
      const filename = `${scene.stem}_${code}.txt`;
      const transcript = buildTranscript(lang, scene, definitions.bases);
      writeTextFile(path.join(lang.transcriptDir, filename), code === "en" ? plainEnglishTxt(transcript) : transcript, code);
    });
  }
  console.log(`Wrote ${definitions.scenes.length} hidden scenes for ${Object.keys(languages).length} languages.`);
}

main();
