#!/usr/bin/env node
// Read-only source parity and focused rendering checks, including non-Gallery branches.
const assert = require("node:assert/strict");
const vm = require("node:vm");
const { LANGS, readSource } = require("./text_sources");

function makeGame(source) {
  const box = { innerHTML: "" },
    node = { style: {}, classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {} };
  const context = {
    console,
    document: {
      readyState: "loading",
      body: node,
      documentElement: node,
      addEventListener() {},
      getElementById(id) {
        return id === "box" ? box : node;
      },
    },
    addEventListener() {},
    setTimeout() {},
    clearTimeout() {},
    setInterval() {},
    clearInterval() {},
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(source.script, context);
  return { context, box };
}
function render(game, name, state, args = []) {
  const c = game.context;
  Object.assign(c, state, { ulopen: 0 });
  game.box.innerHTML = "";
  if (c.beginRender) c.beginRender();
  c[name](...args);
  c.finishChoiceBlock();
  return c.beginRender ? { en: c.renderBuffers.en, alt: c.renderBuffers.alt } : game.box.innerHTML;
}

function main() {
  const sources = Object.fromEntries(LANGS.map((lang) => [lang, readSource(lang)]));
  const en = sources.en,
    enCalls = en.calls.filter((c) => c.source.node !== "getinti");
  const signature = (c) => [c.source.node, c.source.slot, c.kind, c.tag, c.static];
  for (const lang of LANGS.slice(1)) {
    const mono = sources[lang],
      bilingual = readSource(lang, true);
    assert.deepEqual(
      mono.calls.map(signature),
      en.calls.map(signature),
      `${lang}: single-language call structure`,
    );
    assert.deepEqual(
      bilingual.calls.map(signature),
      enCalls.map(signature),
      `${lang}: bilingual call structure`,
    );
    const monoCalls = mono.calls.filter((c) => c.source.node !== "getinti");
    enCalls.forEach((call, i) => {
      const b = bilingual.calls[i],
        m = monoCalls[i],
        where = `${lang}/${call.source.node}/${call.source.slot}`;
      if (call.static) {
        assert.equal(b.text, call.text, "English source mismatch: " + where);
        assert(b.alternate, "Missing explicit bilingual text: " + where);
        const alt = b.alternate.text;
        assert.equal(alt, m.text, "Localized source mismatch: " + where);
      } else {
        // Compare code tokens so whitespace alone is immaterial.
        assert.equal(
          b.expression.replace(/\s+/g, ""),
          call.expression.replace(/\s+/g, ""),
          "Dynamic English expression mismatch: " + where,
        );
      }
    });
    assert.deepEqual(
      bilingual.variants.map((c) => [c.source, c.text]),
      en.variants.map((c) => [c.source, c.text]),
      `${lang}: bilingual English variants`,
    );
    const eg = makeGame(en),
      mg = makeGame(mono),
      bg = makeGame(bilingual);
    // Typography is now explicit in the catalogs. Exact baseline witnesses and
    // the source/content checks cover every static line, including French spacing.
    for (const [amount, english, localized] of [
      [0, "0", "0"],
      [1, "1", "1"],
      [13.5, "13.50", ["es", "fr"].includes(lang) ? "13,50" : "13.50"],
      [1.05, "1.05", ["es", "fr"].includes(lang) ? "1,05" : "1.05"],
      [100, "100", "100"],
    ]) {
      assert.equal(eg.context.formatPounds(amount), english, "English balance formatting");
      assert.equal(mg.context.formatPounds(amount, lang), localized, `${lang} balance formatting`);
      assert.equal(
        bg.context.formatPounds(amount, lang),
        localized,
        `${lang} bilingual balance formatting`,
      );
    }
    // Parity alone would let the same grammatical error survive in both editions.
    // These independent expectations cover singular, plural, gain, loss, and zero.
    const noticeExamples = {
      es: [
        [-2, "Has perdido 2 puntos de intimidad."],
        [-1, "Has perdido 1 punto de intimidad."],
        [0, "Has ganado 0 puntos de intimidad."],
        [1, "Has ganado 1 punto de intimidad."],
        [2, "Has ganado 2 puntos de intimidad."],
      ],
      fr: [
        [-2, "Vous avez perdu 2 points d’intimité."],
        [-1, "Vous avez perdu 1 point d’intimité."],
        [0, "Vous avez gagné 0 point d’intimité."],
        [1, "Vous avez gagné 1 point d’intimité."],
        [2, "Vous avez gagné 2 points d’intimité."],
      ],
    };
    const noticeGames = noticeExamples[lang]
      ? [
          ["standalone", makeGame(mono)],
          ["bilingual", makeGame(bilingual)],
        ]
      : [];
    for (const [amount, text] of noticeExamples[lang] || []) {
      for (const [edition, game] of noticeGames) {
        const output = render(game, "getinti", { inti: 20 }, [amount]);
        const html = typeof output === "string" ? output : output.alt;
        assert(
          html.includes(text),
          `Incorrect ${lang}/${edition} intimacy notice for ${amount}: ${html}`,
        );
      }
    }
    enCalls.forEach((call, i) => {
      if (!call.static) return;
      const b = bilingual.calls[i],
        m = monoCalls[i],
        choice = call.kind === "choice";
      const name = choice ? "c" : "s",
        args = choice ? [call.tag, call.text] : [call.text];
      const altArgs = choice ? [m.tag, m.text] : [m.text];
      const actualArgs = b.alternate
        ? choice
          ? [call.tag, call.text, b.alternate.text]
          : [call.text, b.alternate.text]
        : args;
      const expectedEn = render(eg, name, {}, args),
        expectedAlt = render(mg, name, {}, altArgs);
      const actual = render(bg, b.alternate ? name + "Alt" : name, {}, actualArgs);
      const where = `${lang}/${call.source.node}/${call.source.slot}`;
      assert.equal(actual.en, expectedEn, "English text rendering mismatch: " + where);
      assert.equal(actual.alt, expectedAlt, "Localized text rendering mismatch: " + where);
    });
    const cases = [{ name: "theatreask", state: { luckshots: 3 } }];
    for (const name of ["sitting_desp", "standing_desp", "queue_desp"])
      for (let index = 0; index < 4; index++) {
        cases.push({ name, state: { blad: 410, despLineIndex: index } });
      }
    for (const amount of [-16, -2, -1, 0, 1, 2, 16])
      cases.push({ name: "getinti", state: { inti: 20 }, args: [amount] });
    for (const pounds of [0, 1, 1.05, 13.5, 15, 100])
      cases.push({ name: "buysth", state: { pounds, bottlewater: 0, brooch: 0 } });
    cases.push({ name: "luckytrip5a", state: { tuesday: 0, thursday: 2, saturday: 0 } });
    for (const blad of [590, 625, 675])
      cases.push({ name: "scenario1c", state: { blad, ravioli: 0, pizza: 1, steak: 0 } });
    for (const saturday of [0, 2])
      cases.push({
        name: "sofabreasts0",
        state: { undobra: 0, buyespresso: 1, saturday, inti: 20 },
      });
    for (const undobra of [0, 1])
      cases.push({ name: "sofabreasts4", state: { undobra, blad: 600, inti: 20 } });
    for (const test of cases) {
      const expectedEn = render(eg, test.name, test.state, test.args);
      const expectedAlt = render(mg, test.name, test.state, test.args);
      const actual = render(bg, test.name, test.state, test.args);
      assert.equal(
        actual.en,
        expectedEn,
        `English render mismatch: ${lang}/${test.name}/${JSON.stringify(test.state)}`,
      );
      assert.equal(
        actual.alt,
        expectedAlt,
        `Localized render mismatch: ${lang}/${test.name}/${JSON.stringify(test.state)}`,
      );
      for (const key of ["inti", "blad", "despLineIndex"]) {
        assert.equal(
          mg.context[key],
          eg.context[key],
          `State mismatch: ${lang}/${test.name}/${key}`,
        );
        assert.equal(
          bg.context[key],
          eg.context[key],
          `Bilingual state mismatch: ${lang}/${test.name}/${key}`,
        );
      }
    }
    console.log(
      `OK ${lang}: all static text rendered in both languages, explicit catalog translations, English variants, ${cases.length} focused render/state cases.`,
    );
  }
}
if (require.main === module) main();
module.exports = { makeGame, render };
