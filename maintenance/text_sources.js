// Read the maintained HTML's text call sites without executing story nodes.
// This lexer deliberately rejects unsupported syntax instead of guessing alignments.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ROOT = path.resolve(__dirname, "..");
const LANGS = Object.keys(require("../source/editions.json"));
const literalContext = vm.createContext({});

function tokenize(source) {
  const tokens = [];
  let i = 0;
  while (i < source.length) {
    if (/\s/.test(source[i])) {
      i++;
      continue;
    }
    if (source.startsWith("//", i)) {
      const end = source.indexOf("\n", i);
      i = end < 0 ? source.length : end;
      continue;
    }
    if (source.startsWith("/*", i)) {
      const end = source.indexOf("*/", i + 2);
      if (end < 0) throw Error("Unclosed comment");
      i = end + 2;
      continue;
    }
    const start = i,
      ch = source[i];
    let type = "punctuation",
      value;
    if (ch === '"' || ch === "'") {
      type = "string";
      i++;
      while (i < source.length && source[i] !== ch) {
        if (source[i] === "\\") i++;
        i++;
      }
      if (i >= source.length) throw Error("Unclosed string");
      i++;
      value = vm.runInContext(source.slice(start, i), literalContext);
    } else if (ch === "`") {
      throw Error("Template literals require an explicit text-source reader update");
    } else if (
      ch === "/" &&
      (!tokens.length || /^(?:[=(,:;!&|?{}\[]|return|case|=>)$/.test(tokens.at(-1).raw))
    ) {
      type = "regexp";
      i++;
      let inClass = false;
      while (i < source.length) {
        if (source[i] === "\\") {
          i += 2;
          continue;
        }
        if (source[i] === "[") inClass = true;
        if (source[i] === "]") inClass = false;
        if (source[i++] === "/" && !inClass) break;
      }
      while (/[a-z]/i.test(source[i] || "") && i < source.length) i++;
    } else if (/[A-Za-z_$]/.test(ch)) {
      type = "identifier";
      i++;
      while (i < source.length && /[\w$]/.test(source[i])) i++;
    } else if (/[0-9]/.test(ch)) {
      type = "number";
      i++;
      while (i < source.length && /[\w.]/.test(source[i])) i++;
    } else {
      i++;
    }
    tokens.push({ start, end: i, raw: source.slice(start, i), type, value });
  }
  const stack = [],
    close = { ")": "(", "]": "[", "}": "{" };
  tokens.forEach((t, index) => {
    if (t.type !== "punctuation") return;
    if (["(", "[", "{"].includes(t.raw)) stack.push(index);
    else if (close[t.raw]) {
      const opening = stack.pop();
      if (opening === undefined || tokens[opening].raw !== close[t.raw])
        throw Error("Unbalanced source tokens");
      tokens[opening].mate = index;
      t.mate = opening;
    }
  });
  if (stack.length) throw Error("Unclosed source tokens");
  return tokens;
}

function argumentsAt(tokens, opening) {
  const args = [];
  let start = opening + 1;
  for (let i = start; i < tokens[opening].mate; i++) {
    if (tokens[i].raw === "," && tokens[i].type === "punctuation") {
      args.push(tokens.slice(start, i));
      start = i + 1;
    } else if (tokens[i].mate > i) i = tokens[i].mate;
  }
  if (start < tokens[opening].mate) args.push(tokens.slice(start, tokens[opening].mate));
  return args;
}

function readSource(lang, bilingual = false) {
  const file = path.join(
    ROOT,
    `outputs/${lang}/dianedate_${lang}${bilingual ? "_bilingual" : ""}.html`,
  );
  const html = fs.readFileSync(file, "utf8");
  const match = /<script>([\s\S]*?)<\/script>/i.exec(html);
  if (!match) throw Error("Missing playable script: " + file);
  const script = match[1];
  new vm.Script(script, { filename: file });
  const tokens = tokenize(script),
    functions = [],
    calls = [],
    variants = [];
  for (let i = 0; i < tokens.length; i++) {
    if (
      tokens[i].raw === "function" &&
      tokens[i + 1]?.type === "identifier" &&
      tokens[i + 2]?.raw === "("
    ) {
      const body = tokens[i + 2].mate + 1;
      if (tokens[body].raw !== "{") throw Error("Unsupported function syntax");
      functions.push({
        name: tokens[i + 1].raw,
        start: tokens[i].start,
        end: tokens[tokens[body].mate].end,
      });
    }
  }
  const slots = new Map();
  function argument(tokens) {
    if (!tokens?.length) return null;
    return {
      text: tokens[0].type === "string" ? tokens[0].value : null,
      static: tokens.length === 1 && tokens[0].type === "string",
      expression: script.slice(tokens[0].start, tokens.at(-1).end),
    };
  }
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (
      t.type === "identifier" &&
      ["s", "c", "sAlt", "cAlt"].includes(t.raw) &&
      tokens[i + 1]?.raw === "(" &&
      !["function", "."].includes(tokens[i - 1]?.raw)
    ) {
      const fn = functions.filter((f) => f.start < t.start && f.end > t.end).at(-1);
      if (!fn) throw Error("Text call outside a named function");
      const args = argumentsAt(tokens, i + 1),
        kind = t.raw.startsWith("s") ? "story" : "choice";
      const arg = argument(args[kind === "story" ? 0 : 1]);
      if (!arg) throw Error("Missing text expression in " + fn.name);
      const slot = (slots.get(fn.name) || 0) + 1;
      slots.set(fn.name, slot);
      calls.push({
        kind,
        source: { node: fn.name, slot },
        tag: kind === "choice" ? argument(args[0]).text : undefined,
        ...arg,
        alternate: argument(args[kind === "story" ? 1 : 2]),
      });
    }
    if (
      /^notYet(?:Sitting|Standing|Queue)$/.test(t.raw) &&
      tokens[i + 1]?.raw === "=" &&
      tokens[i + 2]?.raw === "new" &&
      tokens[i + 3]?.raw === "Array"
    ) {
      argumentsAt(tokens, i + 4).forEach((arg, slot) => {
        const value = argument(arg);
        if (!value.static) throw Error("Nonliteral text variant");
        variants.push({ kind: "variant", source: { node: t.raw, slot: slot + 1 }, ...value });
      });
    }
  }
  return { file, html, script, functions, calls, variants };
}

module.exports = { ROOT, LANGS, tokenize, readSource };
