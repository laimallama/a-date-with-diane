#!/usr/bin/env node
/**
 * Payoff-only transcripts from Gallery routes.
 * Starts at climaxIndex (endings) or baseLength (hidden scenes) —
 * the same cut as in-game "Skip to the good bit!" / scene start.
 * In-file title = Gallery leaf title (variant only).
 * No guide .txt output — Gallery is the walkthrough.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");

const LANGS = {
  en: { code: "en", htmlPath: path.join(ROOT, "outputs/en/dianedate_en.html") },
  cn: { code: "cn", htmlPath: path.join(ROOT, "outputs/cn/dianedate_cn.html") },
  tw: { code: "tw", htmlPath: path.join(ROOT, "outputs/tw/dianedate_tw.html") },
  es: { code: "es", htmlPath: path.join(ROOT, "outputs/es/dianedate_es.html") },
  fr: { code: "fr", htmlPath: path.join(ROOT, "outputs/fr/dianedate_fr.html") },
};

/** Gallery leaf id (stem) → short transcript slug */
const ENDING_SLUGS = {
  "03_first_prize": "01_first",
  "05_second_prize": "02_second",
  "01_third_prize": "03_third",
  "02_fourth_prize": "04_fourth",
  "04_fifth_prize": "05_fifth",
  "09_amanda_consolation": "06_amanda",
  "08a_chloe_consolation": "07a_door",
  "08b_chloe_outside": "07b_outside",
  "07a_consolation_tuesday_pavilion": "08a_tue_pavilion",
  "07b_consolation_thursday_subway": "08b_thu_subway",
  "07c_consolation_saturday_car_park": "08c_sat_carpark",
  "06a_lounge_hen_party": "09a_hen",
  "06b_lounge_bus_boy": "09b_bus_boy",
  "06c_lounge_chess_lesson": "09c_chess",
  "06d_lounge_freshers_week": "09d_freshers",
};

const HIDDEN_SLUGS = {
  "01_theatre_flashback": "01_theatre",
  "02_portaloo_ladies_first": "02a_portaloo_found",
  "03_portaloo_too_embarrassed": "02b_portaloo_direct",
  "04_thursday_bridge_diane_molly": "03_bridge",
  "05_molly_bruno_towpath": "04a_molly_skip",
  "06_diane_slips_away_while_watching_molly": "04b_diane_slips",
  "07_riverside_bushes_diane": "05a_bushes_diane",
  "09_riverside_bushes_together": "05b_bushes_together",
  "08_riverside_towpath_landing": "06_towpath_steps",
  "10_public_toilet_spyhole": "07a_spyhole_panties",
  "11_public_toilet_spyhole_stockings": "07b_spyhole_stockings",
  "12_closed_toilet_building_lookout": "08a_closed_lookout",
  "13_closed_toilet_building_together": "08b_closed_turns",
  "14_closed_toilet_building_bad_choice": "08c_closed_holdon",
  "15_riverside_gents_urinal": "08d_gents_urinal",
  "16_brunette_behind_camper": "09a_camper_watch",
  "17_diane_brunette_camper_round": "09b_camper_diane",
  "18_diane_brunette_camper_under": "09c_camper_under",
  "19_camper_gentleman_choice": "09d_camper_gentleman",
  "22_caught_by_boyfriend": "09e_camper_caught",
  "20_church_lych_gate_glimpse": "10_lych_gate",
  "21_hidden_camera": "11_hidden_camera",
  "26_train_photo_album": "12_train_album",
  "23_brooch": "13_brooch",
  "25_lootogether": "14a_loo_follow",
  "27_bath_peeing": "14b_bath_pee",
  "24_phone_call": "15_phone_call",
};

function loadGalleryData(htmlPath) {
  const html = fs.readFileSync(htmlPath, "utf8");
  const match = html.match(/const GALLERY_DATA = (\{[\s\S]*?\});/);
  if (!match) throw new Error(`GALLERY_DATA not found in ${htmlPath}`);
  return JSON.parse(match[1]);
}

function flattenLeaves(items, kind) {
  const out = [];
  for (const item of items) {
    if (item.variants) {
      for (const v of item.variants) {
        out.push({
          kind,
          id: v.id,
          title: v.title,
          tags: v.tags,
          payoffStart: kind === "ending" ? v.climaxIndex : v.baseLength,
        });
      }
    } else {
      out.push({
        kind,
        id: item.id,
        title: item.title,
        tags: item.tags,
        payoffStart: kind === "ending" ? item.climaxIndex : item.baseLength,
      });
    }
  }
  return out;
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
  let text = quoteEmphasisForTranscript(removeUi(html), langCode);
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

function plainEnglishTxt(text) {
  return text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
}

function writeTextFile(outPath, text, langCode) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, langCode === "en" ? `\uFEFF${text}` : text, "utf8");
}

function findChoiceByTag(options, tag) {
  return options.find((o) => o.tag === tag);
}

function buildPayoffTranscript(leaf, lang) {
  const { tags, payoffStart, id } = leaf;
  if (typeof payoffStart !== "number" || payoffStart < 0 || payoffStart >= tags.length) {
    throw new Error(`${id}: invalid payoffStart ${payoffStart} (tags=${tags.length})`);
  }

  const game = loadGame(lang.htmlPath);
  const parts = [`${leaf.title}`, ``];

  tags.forEach((tag, index) => {
    const options = choices(game.box);
    const found = findChoiceByTag(options, tag);
    if (!found) {
      throw new Error(
        `Tag not found for ${id} @${index} (${tag})\nAvailable:\n${options.map((o) => `- ${o.tag}: ${o.text}`).join("\n")}\n\nPage:\n${visibleStory(game.box.innerHTML, lang.code).slice(0, 1200)}`,
      );
    }
    if (index >= payoffStart) {
      const page = visibleStory(game.box.innerHTML, lang.code);
      if (page) parts.push(page, "");
      parts.push(`(${found.text})`, "");
    }
    game.context.go(found.tag);
  });

  const finalPage = visibleStory(game.box.innerHTML, lang.code);
  if (finalPage) parts.push(finalPage, "");

  let text = parts.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  if (lang.code === "en") text = plainEnglishTxt(text);
  return text;
}

function outDirFor(kind, langCode) {
  const leaf = kind === "ending" ? "endings" : "hidden_scenes";
  return path.join(ROOT, `outputs/${langCode}/transcripts/${leaf}`);
}

function main() {
  const galleryByLang = {};
  for (const [code, lang] of Object.entries(LANGS)) {
    galleryByLang[code] = loadGalleryData(lang.htmlPath);
  }

  const endingLeavesEn = flattenLeaves(galleryByLang.en.endings, "ending");
  const hiddenLeavesEn = flattenLeaves(galleryByLang.en.hiddenScenes, "hidden");

  if (endingLeavesEn.length !== 15) {
    throw new Error(`Expected 15 ending leaves, got ${endingLeavesEn.length}`);
  }
  if (hiddenLeavesEn.length !== 27) {
    throw new Error(`Expected 27 hidden leaves, got ${hiddenLeavesEn.length}`);
  }

  for (const leaf of endingLeavesEn) {
    if (!ENDING_SLUGS[leaf.id]) throw new Error(`Missing ending slug for ${leaf.id}`);
  }
  for (const leaf of hiddenLeavesEn) {
    if (!HIDDEN_SLUGS[leaf.id]) throw new Error(`Missing hidden slug for ${leaf.id}`);
  }

  // Reset output dirs (new layout + legacy paths)
  for (const code of Object.keys(LANGS)) {
    fs.rmSync(path.join(ROOT, `outputs/${code}/transcripts`), { recursive: true, force: true });
    fs.rmSync(path.join(ROOT, `outputs/${code}/endings`), { recursive: true, force: true });
    fs.rmSync(path.join(ROOT, `outputs/${code}/hidden_scenes`), { recursive: true, force: true });
  }

  let written = 0;

  for (const code of Object.keys(LANGS)) {
    const lang = LANGS[code];
    const gallery = galleryByLang[code];
    const endingLeaves = flattenLeaves(gallery.endings, "ending");
    const hiddenLeaves = flattenLeaves(gallery.hiddenScenes, "hidden");

    // Prefer EN tags (stable) with localized titles from this language's gallery.
    const endings = endingLeavesEn.map((enLeaf, i) => ({
      ...enLeaf,
      title: endingLeaves[i].title,
      tags: enLeaf.tags,
      payoffStart: enLeaf.payoffStart,
    }));
    const hiddens = hiddenLeavesEn.map((enLeaf, i) => ({
      ...enLeaf,
      title: hiddenLeaves[i].title,
      tags: enLeaf.tags,
      payoffStart: enLeaf.payoffStart,
    }));

    for (const leaf of endings) {
      const slug = ENDING_SLUGS[leaf.id];
      const text = buildPayoffTranscript(leaf, lang);
      const outPath = path.join(outDirFor("ending", code), `${slug}_${code}.txt`);
      writeTextFile(outPath, text, code);
      written++;
    }
    for (const leaf of hiddens) {
      const slug = HIDDEN_SLUGS[leaf.id];
      const text = buildPayoffTranscript(leaf, lang);
      const outPath = path.join(outDirFor("hidden", code), `${slug}_${code}.txt`);
      writeTextFile(outPath, text, code);
      written++;
    }
    console.log(`OK ${code}: ${endings.length} endings + ${hiddens.length} hidden`);
  }

  console.log(`Wrote ${written} payoff transcript files.`);
}

if (require.main === module) main();
