const fs = require("fs");
const path = require("path");
const vm = require("vm");

const GUIDE_SOURCE = "maintenance/write_verified_guides.js";
const LEGACY_OUTPUT_DIRS = [
  "outputs/transcripts",
  "outputs/ending_transcripts_en",
  "outputs/en/transcripts_en",
  "outputs/cn/transcripts_cn",
  "outputs/es/transcripts_es",
  "outputs/fr/transcripts_fr",
  "outputs/en/hidden_scene_transcripts_en",
  "outputs/cn/hidden_scene_transcripts_cn",
  "outputs/es/hidden_scene_transcripts_es",
  "outputs/fr/hidden_scene_transcripts_fr",
  "outputs/en/transcripts",
  "outputs/cn/transcripts",
  "outputs/es/transcripts",
  "outputs/fr/transcripts",
];
const OPENING_GAMEPLAY_STEPS_TO_HIDE = 2;

const routeMeta = {
  third: { order: 1, enTitle: "Third Prize", cnTitle: "三等奖", twTitle: "三等獎", esTitle: "Tercer premio", frTitle: "Troisième prix", stem: "01_third_prize" },
  fourth: { order: 2, enTitle: "Fourth Prize", cnTitle: "四等奖", twTitle: "四等獎", esTitle: "Cuarto premio", frTitle: "Quatrième prix", stem: "02_fourth_prize" },
  first: { order: 3, enTitle: "First Prize", cnTitle: "一等奖", twTitle: "一等獎", esTitle: "Primer premio", frTitle: "Premier prix", stem: "03_first_prize" },
  second: { order: 4, enTitle: "Second Prize", cnTitle: "二等奖", twTitle: "二等獎", esTitle: "Segundo premio", frTitle: "Deuxième prix", stem: "05_second_prize" },
  lounge: { order: 5, enTitle: "Lounge Story Consolation Prize", cnTitle: "客厅故事安慰奖", twTitle: "客廳故事安慰獎", esTitle: "Premio de consolación: historia del salón", frTitle: "Lot de consolation: histoire du salon", stem: "06_lounge_story_consolation" },
  fifth: { order: 6, enTitle: "Fifth Prize", cnTitle: "五等奖", twTitle: "五等獎", esTitle: "Quinto premio", frTitle: "Cinquième prix", stem: "04_fifth_prize" },
  chloe: { order: 7, enTitle: "Chloe Consolation Prize", cnTitle: "克洛伊安慰奖", twTitle: "克洛伊安慰獎", esTitle: "Premio de consolación de Chloe", frTitle: "Prix de consolation de Chloe", stem: "08_chloe_consolation" },
  amanda: { order: 8, enTitle: "Amanda Consolation Prize", cnTitle: "阿曼达安慰奖", twTitle: "阿曼達安慰獎", esTitle: "Premio de consolación de Amanda", frTitle: "Prix de consolation d'Amanda", stem: "09_amanda_consolation" },
  general: { order: 9, enTitle: "Tuesday Pavilion Route Consolation Prize", cnTitle: "周二凉亭路线安慰奖", twTitle: "週二涼亭路線安慰獎", esTitle: "Premio de consolación: ruta del martes del Pavilion", frTitle: "Prix de consolation : route du mardi au Pavilion", stem: "07a_consolation_tuesday_pavilion" },
  generalThursday: { order: 10, enTitle: "Thursday Subway Route Consolation Prize", cnTitle: "周四地下通道路线安慰奖", twTitle: "週四地下通道路線安慰獎", esTitle: "Premio de consolación: ruta del jueves por el paso subterráneo", frTitle: "Prix de consolation : route du jeudi par le passage souterrain", stem: "07b_consolation_thursday_subway" },
};

const languages = {
  en: {
    code: "en",
    htmlPath: "outputs/en/dianedate_en.html",
    outDir: "outputs/en/endings/transcripts",
    title(meta) {
      return meta.enTitle;
    },
    endingPatterns: [
      /TRULY, YOU HAVE WON FIRST PRIZE!/,
      /YOU HAVE WON A CONSOLATION PRIZE!/,
      /YOU HAVE WON [^!]+!/,
      /WHICH IS A PRETTY GOOD CONSOLATION PRIZE!/,
    ],
  },
  cn: {
    code: "cn",
    htmlPath: "outputs/cn/dianedate_cn.html",
    outDir: "outputs/cn/endings/transcripts",
    title(meta) {
      return meta.cnTitle;
    },
    endingPatterns: [
      /你真的获得了一等奖！/,
      /你获得了[一二三四五]等奖！/,
      /你获得了(?:一个)?安慰奖！/,
      /说起来，这也算是个相当不错的安慰奖！/,
    ],
  },
  tw: {
    code: "tw",
    htmlPath: "outputs/tw/dianedate_tw.html",
    outDir: "outputs/tw/endings/transcripts",
    title(meta) {
      return meta.twTitle;
    },
    endingPatterns: [
      /你真的獲得了一等獎！/,
      /你獲得了[一二三四五]等獎！/,
      /你獲得了(?:一個)?安慰獎！/,
      /說起來，這也算是個相當不錯的安慰獎！/,
    ],
  },
  es: {
    code: "es",
    htmlPath: "outputs/es/dianedate_es.html",
    outDir: "outputs/es/endings/transcripts",
    title(meta) {
      return meta.esTitle;
    },
    endingPatterns: [
      /¡VERDADERAMENTE, HAS GANADO EL PRIMER PREMIO!/,
      /¡HAS GANADO UN PREMIO DE CONSOLACIÓN!/,
      /¡HAS GANADO EL \d\.(?:er|º) PREMIO!/,
      /¡QUE NO ES MAL PREMIO DE CONSOLACIÓN!/,
    ],
  },
  fr: {
    code: "fr",
    htmlPath: "outputs/fr/dianedate_fr.html",
    outDir: "outputs/fr/endings/transcripts",
    title(meta) {
      return meta.frTitle;
    },
    endingPatterns: [
      /VRAIMENT, VOUS AVEZ REMPORTÉ LE PREMIER PRIX\s*!/,
      /VOUS AVEZ REMPORTÉ UN (?:PRIX|LOT) DE CONSOLATION\s*!/,
      /VOUS AVEZ (?:REMPORTÉ|GAGNÉ) LE \dE PRIX\s*!/,
      /CE QUI EST UN SACRÉ LOT DE CONSOLATION\s*!/,
    ],
  },
};

function loadRoutes() {
  const source = fs.readFileSync(GUIDE_SOURCE, "utf8");
  const context = {
    console: { log() {}, error: console.error },
    require,
    process,
    __dirname: path.resolve("maintenance"),
    __filename: path.resolve(GUIDE_SOURCE),
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

function normalize(text) {
  return stripTags(text)
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function findChoice(options, label) {
  const wanted = normalize(label);
  let found = options.find((o) => normalize(o.text) === wanted);
  if (!found) {
    found = options.find(
      (o) => normalize(o.text).replace(/[.!?。！？]+$/u, "") === wanted.replace(/[.!?。！？]+$/u, ""),
    );
  }
  return found;
}

function findChoiceByTag(options, tag) {
  return options.find((o) => o.tag === tag);
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
    en: /^(i\b|i'm\b|i’m\b|why\b|it\b|we'll\b|we’ll\b|but\b|cheers!?$|that\b|shall\b|do\b|diane,|found\b|hurry\b|come on\b|give\b|you can\b|can i\b|what\b|oh\b|oooh\b|god\b|sorry\b)/i,
    cn: /^(对不起|我|你们先走|你当初|你倒|可总有|干杯|真的|我们|黛安|找到了|快点|走吧|抱抱我|天哪|老天|抱歉|真是)/,
    tw: /^(對不起|我|你們先走|你當初|你倒|可總有|乾杯|真的|我們|黛安|找到了|快點|走吧|抱抱我|天哪|老天|抱歉|真是)/,
    es: /^(lo siento|no podía|¿|a ti\b|pero\b|¡salud|ha sido|he\b|me\b|sé(?:\s|$)|diane,|no encuentro|ya lo|date prisa|¡date prisa|os alcanzamos|necesito|venga|dame|ya ves|qué buena|¡oooh|lo necesitaba|¡dios|perdona)/i,
    fr: /^(je\b|j[’']|pourquoi|c[’']est|mais\b|santé|c[’']était|on s'assoit|on vous|vous savez|diane,|je ne trouve|trouvé|dépêche|dépêchez|allez|fais-moi|vous voyez|quelle bonne|désolée|oh mon|oooh|mon dieu)/i,
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
      .replace(/\b([0-9]+) intimacy pts\b/gi, "$1 intimacy points");
  }
  return out;
}

function visibleStory(html, langCode = "en") {
  let text = quoteEmphasisForTranscript(separateSpeakerStageDirections(removeUi(html)), langCode);
  text = text
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, inner) => `\n\n【${stripTags(inner)}】\n\n`)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<hr\s*\/?>/gi, "\n\n")
    .replace(/<\/(?:p|h1|h2|div)>/gi, "\n\n")
    .replace(/<[^>]+>/g, "");
  const visible = decodeEntities(text)
    .split(/\n/)
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return polishTranscriptText(visible, langCode);
}

function renderStep(index, pageText, choiceText) {
  const body = pageText ? `${pageText}\n\n` : "";
  return `${body}(${choiceText})`;
}

function plainEnglishTxt(text) {
  return text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
}

function writeTextFile(outPath, text, langCode) {
  fs.writeFileSync(outPath, langCode === "en" ? `\uFEFF${text}` : text, "utf8");
}

function endingText(text, lang) {
  for (const pattern of lang.endingPatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return "NO ENDING TEXT FOUND";
}

function routeToTags(key, route) {
  const game = loadGame(languages.en.htmlPath);
  return route.map((label, index) => {
    const options = choices(game.box);
    const found = findChoice(options, label);
    if (!found) {
      throw new Error(
        `Choice not found for ${key}, step ${index + 1}: ${label}\nAvailable:\n${options.map((o) => `- ${o.text}`).join("\n")}\n\nPage:\n${visibleStory(game.box.innerHTML).slice(0, 1500)}`,
      );
    }
    game.context.go(found.tag);
    return found.tag;
  });
}

function buildTranscript(key, tags, lang) {
  const meta = routeMeta[key] || { enTitle: key, cnTitle: key, stem: key };
  const game = loadGame(lang.htmlPath);
  const parts = [
    lang.title(meta),
    "",
  ];

  tags.forEach((tag, index) => {
    const options = choices(game.box);
    const found = findChoiceByTag(options, tag);
    if (!found) {
      throw new Error(
        `Tag not found for ${key}, step ${index + 1}: ${tag}\nAvailable:\n${options.map((o) => `- ${o.tag}: ${o.text}`).join("\n")}\n\nPage:\n${visibleStory(game.box.innerHTML).slice(0, 1500)}`,
      );
    }
    if (index >= OPENING_GAMEPLAY_STEPS_TO_HIDE) {
      parts.push(renderStep(index + 1, visibleStory(game.box.innerHTML, lang.code), found.text), "");
    }
    game.context.go(found.tag);
  });

  const finalText = visibleStory(game.box.innerHTML, lang.code);
  const finalEnding = endingText(finalText, lang);
  if (finalEnding === "NO ENDING TEXT FOUND") {
    throw new Error(`No ending text found for ${key}\n\nFinal page:\n${finalText}`);
  }
  parts.push(finalText, "");
  return parts.join("\n").replace(/\n{3,}/g, "\n\n");
}

function main() {
  const routes = loadRoutes();
  LEGACY_OUTPUT_DIRS.forEach((dir) => fs.rmSync(dir, { recursive: true, force: true }));

  const written = [];
  for (const lang of Object.values(languages)) {
    fs.rmSync(lang.outDir, { recursive: true, force: true });
    fs.mkdirSync(lang.outDir, { recursive: true });
  }

  const orderedRoutes = Object.entries(routes).sort((a, b) => (routeMeta[a[0]]?.order || 99) - (routeMeta[b[0]]?.order || 99));
  for (const [key, route] of orderedRoutes) {
    const meta = routeMeta[key] || { stem: key };
    const tags = routeToTags(key, route);
    for (const lang of Object.values(languages)) {
      let transcript = buildTranscript(key, tags, lang);
      if (lang.code === "en") transcript = plainEnglishTxt(transcript);
      const outPath = path.join(lang.outDir, `${meta.stem}_${lang.code}.txt`);
      writeTextFile(outPath, transcript, lang.code);
      written.push(outPath);
    }
  }

  console.log(`Wrote ${written.length} transcript files`);
  for (const file of written) console.log(file);
}

if (require.main === module) main();
