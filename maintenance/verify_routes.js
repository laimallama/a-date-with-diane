const fs = require("fs");
const vm = require("vm");

const htmlPath = process.argv[2] || "outputs/en/dianedate_en.html";
const source = fs.readFileSync(htmlPath, "utf8");
const script = source.match(/<script>([\s\S]*?)<\/script>/i)[1];

function makeGame() {
  const initialBox = (source.match(/<div id="box">([\s\S]*?)<\/div>\s*<\/div>\s*<\/body>/i) || [null, ""])[1]
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

function stripTags(text) {
  return String(text)
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
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

function visibleText(box) {
  return stripTags(box.innerHTML);
}

function normalize(text) {
  return stripTags(text)
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function click(game, label) {
  const opts = choices(game.box);
  const wanted = normalize(label);
  let found = opts.find((o) => normalize(o.text) === wanted);
  if (!found) {
    found = opts.find((o) => normalize(o.text).replace(/[.!?。！？]+$/u, "") === wanted.replace(/[.!?。！？]+$/u, ""));
  }
  if (!found) {
    const available = opts.map((o) => `- ${o.text}`).join("\n");
    throw new Error(`Choice not found: ${label}\nAvailable:\n${available}\n\nPage:\n${visibleText(game.box).slice(0, 1200)}`);
  }
  game.context.go(found.tag);
}

function runRoute(route) {
  const game = makeGame();
  for (const label of route) {
    click(game, label);
  }
  return {
    text: visibleText(game.box),
    choices: choices(game.box),
    vars: Object.fromEntries(game.context.gameStateVars.map((k) => [k, game.context[k]])),
  };
}

module.exports = { makeGame, runRoute, choices, click, visibleText };

if (require.main === module) {
  const route = process.argv.slice(3);
  const result = runRoute(route);
  console.log(result.text);
  if (result.choices.length) {
    console.log("\nChoices:");
    for (const choice of result.choices) console.log(`- ${choice.text} [${choice.tag}]`);
  }
  console.log("\nState:", JSON.stringify(result.vars, null, 2));
}
