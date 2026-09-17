#!/usr/bin/env node
// Focused reachable regressions for confirmed defects from the comprehensive audit.
// These checks supplement, rather than replace, route/state and browser verification.
const assert = require('node:assert/strict');
const { readSource, LANGS } = require('./text_sources');
const { loadRuntime, choices, leaves } = require('./audit_state_space');
const { makeGame: makeTextGame, render: renderText } = require('./verify_text_consistency');

function click(g, tag) {
  assert(choices(g.box).some(x => x.tag === tag), `Unavailable ${g.context.currentTag} -> ${tag}`);
  g.context.go(tag);
}
function snapshot(g) { return JSON.stringify(g.context.snapshotGame()); }

// Actual visible-choice paths discovered by the audit. These are intentionally
// independent of the Gallery's selected winning routes and do not inject state.
const highSpendPrefix = `start start1a start1b saturdaydate start2 buysth buybrooch buysth buywater gothere flirt_m
winelist buyburgundy eatmeal buysteak steak1 eatmeal6 eatmeal6a eatmeal6b eatmeal6c eatmeal5c ownjob eatmeal5d
eatmeal7 eatmeal7a puddings buytiramisu eatmeal7b cappuccino eatmeal7c gotheatre theatre1 theatre2 theatre3a
theatre4 theatre5 theatre6 theatre7 theatre8 theatre9 theatre10 interval interval1 askloo interval2 interval3
act2 act2a act2b act2c act2d act2e act2f act2fa act2g act2h leavetheatre leavetheatre1 foyerbar foyerbar1
foyerbar1a foyerbar2 foyerbar3 foyerbar4`.split(/\s+/);
const ordinaryPavilion = `choosewalk1 riverside2 riverside3 riverside7 riverside8 riverside9 riverside10
riverside11 riverside12 riverside13a riverside14 toiletopen justclosed riverside15 riverside16 pavilion
pavilion1 pavilion2 pavilion3 pavilion4 pavilion5 pavilion5a pavilion6`.split(/\s+/);
const farewellPavilion = `choosepub pubdrink pubdrink1 pubdrink2 pubdrink3 pubdrink4 pubdrink4a pubdrink5
pubdrink6 riverside2 riverside3 riverside3ab riverside4 sitonbench riverside5 riverside6 riverside7 riverside8
riverside9 riverside10 riverside11 riverside12 riverside13 riverside13b riverside14 justclosed riverside15`.split(/\s+/);

function replay(source, tags) {
  const g = loadRuntime(source);
  for (const tag of tags) {
    if (tag === 'start' && !g.context.currentTag) g.context.go(tag);
    else click(g, tag);
    assert(g.context.pounds >= 0, `${source.file}: negative balance at ${tag}`);
  }
  return g;
}

function verifyCoffee(source) {
  const initial = loadRuntime(source);
  const route = leaves(initial.gallery).find(x => x.tags.includes('filtercoffee'));
  assert(route, 'A reachable coffee route is required');
  const prefix = route.tags.slice(0, route.tags.indexOf('filtercoffee'));
  let checks = 0;
  // Displayed prices: filter £1 each; espresso £1.50 each. On the cappuccino
  // branch Simon orders a £2 cappuccino while Diane chooses a £1.50 espresso.
  for (const [tag, cost, next] of [
    ['filtercoffee', 2, 'eatmeal7bb'],
    ['espresso', 3, 'eatmeal7c'],
    ['cappuccino', 3.5, 'eatmeal7c'],
  ]) {
    const g = loadRuntime(source);
    g.context.go('start');
    for (const step of prefix) click(g, step);
    const before = snapshot(g), balance = g.context.pounds;
    click(g, tag);
    assert.equal(g.context.pounds, balance - cost, `${source.file}: ${tag} price`);
    const ordered = snapshot(g);
    click(g, next);
    assert.equal(g.context.pounds, balance - cost, `${source.file}: no second coffee charge`);
    const served = snapshot(g);
    g.context.goback();
    assert.equal(snapshot(g), ordered, `${source.file}: Back from coffee arrival`);
    click(g, next);
    assert.equal(snapshot(g), served, `${source.file}: coffee arrival replay`);
    g.context.goback(); g.context.goback();
    assert.equal(snapshot(g), before, `${source.file}: Back refunds coffee purchase`);
    click(g, tag);
    assert.equal(snapshot(g), ordered, `${source.file}: replay charges coffee exactly once`);
    checks++;
  }
  return checks;
}

function verifyAutomaticCoffee(source) {
  const minimumPrefix = highSpendPrefix.slice(0, highSpendPrefix.indexOf('ownjob'));
  assert.equal(minimumPrefix.at(-1), 'eatmeal5c', 'Minimum-funds prefix stops at the conversation menu');
  let checks = 0;
  for (const day of ['tuesday', 'thursday', 'saturday', 'minimum-funds']) {
    const prefix = day === 'minimum-funds' ? minimumPrefix :
      `start start1a start1b ${day}date start2 gothere flirt_l winelist buymerlot eatmeal buytort eatmeal5 eatmeal5a eatmeal5b eatmeal5c`.split(' ');
    const g = replay(source, prefix), ordinary = replay(source, prefix);
    const before = snapshot(g), balance = g.context.pounds, previousProc = g.context.proc;
    if (day === 'minimum-funds') assert.equal(balance, 27, 'Most expensive legitimate prefix still affords the two coffees');
    assert.equal(g.context.buyfiltercoffee, 0, 'No coffee ordered at the conversation menu');
    click(g, 'asklootalk');
    assert.equal(g.context.pounds, balance, 'The next choice commits the automatic order');
    assert.equal(g.context.buyfiltercoffee, 0, 'Filter order is not committed yet');
    // Preserve this branch's existing input timing; do not add another coffee
    // dose when correcting its missing order state and charge.
    assert.equal(g.context.proc, Math.max(0, previousProc - 10) + 60, 'Existing coffee input occurs once');
    const conversation = snapshot(g), conversationProc = g.context.proc;
    click(g, 'asklootalk1');
    assert.equal(g.context.pounds, balance - 2, `${source.file}: two automatic filter coffees cost £2`);
    assert.equal(g.context.buyfiltercoffee, 2, 'The ordered filter coffees are recorded');
    assert.equal(g.context.buycappuccino, 0);
    assert.equal(g.context.buyespresso, 0);
    assert.equal(g.context.proc, Math.max(0, conversationProc - 10), 'Ordering does not duplicate the coffee input');
    const ordered = snapshot(g);
    for (const tag of ['asklootalk2', 'gotheatre']) {
      const proc = g.context.proc;
      click(g, tag);
      const theatreCharge = tag === 'gotheatre' ? 10 : 0;
      assert.equal(g.context.pounds, balance - 2 - theatreCharge, 'Serving does not recharge coffee; theatre entry orders the separate £10 interval wines');
      assert.equal(g.context.buyfiltercoffee, 2, 'Filter marker persists into the theatre');
      assert.equal(g.context.proc, Math.max(0, proc - 10), 'Serving and theatre entry do not duplicate the coffee input');
    }
    const arrived = snapshot(g);
    g.context.goback(); click(g, 'gotheatre');
    assert.equal(snapshot(g), arrived, 'Theatre entry replays exactly');
    g.context.goback(); g.context.goback();
    assert.equal(snapshot(g), ordered, 'Back to the placed order preserves its state');
    g.context.goback();
    assert.equal(snapshot(g), conversation, 'Back across the order refunds it and clears the coffee marker');
    g.context.goback();
    assert.equal(snapshot(g), before, 'Back to the conversation menu restores the complete state');
    click(g, 'asklootalk');
    assert.equal(snapshot(g), conversation, 'Conversation replay supplies the existing coffee input once');
    click(g, 'asklootalk1');
    assert.equal(snapshot(g), ordered, 'Order replay charges exactly once');

    // Same earlier purchases, then the ordinary £1-each filter order. The
    // conversations/body timing differ, so compare coffee before theatre entry,
    // whose separate preorder now depends on the foyer branch reached.
    for (const tag of ['ownjob', 'eatmeal5d', 'eatmeal7', 'eatmeal7a', 'eatmeal7b', 'filtercoffee', 'eatmeal7bb']) click(ordinary, tag);
    assert.equal(ordinary.context.pounds, balance - 2, 'Ordinary two filters cost £2 as well');
    assert.equal(ordinary.context.buyfiltercoffee, 2);
    checks++;
  }
  return checks;
}

const coffeeNarrativeExpected = {
  "pinot": {
    "en": "The coffees arrive, and you drink them.",
    "cn": "咖啡端上来，你们喝完了。",
    "tw": "咖啡端上來，你們喝完了。",
    "es": "Llegan los cafés y los tomáis.",
    "fr": "Les cafés arrivent, et vous les buvez."
  },
  "other": {
    "en": "You both drink up the wine. The coffees arrive, and you drink those.",
    "cn": "你们把酒喝完了。咖啡端上来，你们也喝完了。",
    "tw": "你們把酒喝完。咖啡端上來，也喝完了。",
    "es": "Los dos apuráis el vino. Llegan los cafés y también los tomáis.",
    "fr": "Vous finissez le vin tous les deux. Les cafés arrivent, et vous les buvez."
  }
};

// These fixed scene expectations distinguish the rejected wine from the coffee.
function sceneLayers(g, source) {
  const language = /dianedate_([a-z]{2})/.exec(source.file)[1], html = g.box.innerHTML;
  if (!g.context.beginRender) return [{ language, html }];
  // Normal go() commits both layers and clears renderBuffers. Inspect the
  // committed markup rather than treating a cleared buffer as monolingual.
  const layers = [...html.matchAll(/<div\b[^>]*class="lang lang-(en|alt)"[^>]*>/g)];
  assert.deepEqual(layers.map(x => x[1]), ['en', 'alt'], 'Both committed bilingual layers must exist');
  return layers.map((layer, i) => ({ language: layer[1] === 'en' ? 'en' : language,
    html: html.slice(layer.index + layer[0].length, layers[i + 1]?.index ?? html.length) }));
}
function verifyCoffeeNarrative(source) {
  let count = 0;
  for (const wine of ['buypinot', 'buyriesling', 'buymerlot']) for (const [coffee, served, dose] of [
    ['filtercoffee', 'eatmeal7bb', 60], ['espresso', 'eatmeal7c', 15],
  ]) {
    const prefix = `start start1a start1b tuesdaydate start2 gothere flirt_l winelist ${wine}
      eatmeal buytort eatmeal5 eatmeal5a eatmeal5b eatmeal5c ownjob eatmeal5d eatmeal7 eatmeal7a eatmeal7b ${coffee}`.split(/\s+/);
    const g = replay(source, prefix), before = snapshot(g), proc = g.context.proc, pounds = g.context.pounds;
    click(g, served);
    for (const { language, html } of sceneLayers(g, source)) {
      const first = /<p>([\s\S]*?)<\/p>/.exec(html)?.[1];
      assert.equal(first, coffeeNarrativeExpected[wine === 'buypinot' ? 'pinot' : 'other'][language],
        `${source.file}: ${wine}/${coffee}/${language} preserves the wine decision`);
    }
    assert.equal(g.context.proc, Math.max(0, proc - 10) + dose, 'Coffee arrival retains the existing single dose and digestion');
    assert.equal(g.context.pounds, pounds, 'Coffee arrival does not charge again');
    const after = snapshot(g);
    g.context.goback(); assert.equal(snapshot(g), before, 'Back across coffee arrival restores full state and HTML');
    click(g, served); assert.equal(snapshot(g), after, 'Coffee narration and dose replay exactly');
    count++;
  }
  return count;
}

function verifyTheatreWater(source) {
  let reachable = 0, boundaries = 0;
  const initial = loadRuntime(source);
  const refusal = { en: 'She shakes her head.', cn: '她摇摇头。', tw: '她搖搖頭。', es: 'Ella niega con la cabeza.', fr: 'Elle secoue la tête.' };
  const acceptance = { en: 'She says', cn: '她说', tw: '她說', es: 'Dice', fr: 'Elle dit' };
  for (const routeId of ['06c_lounge_chess_lesson', '06d_lounge_freshers_week']) {
    const route = leaves(initial.gallery).find(x => x.id === routeId);
    assert(route && route.tags.includes('act2fa'));
    const g = replay(source, ['start', ...route.tags.slice(0, route.tags.indexOf('act2fa'))]);
    assert(g.context.blad > 650 && g.context.bottlewater === 1, 'Actual high-bladder water witness');
    const before = snapshot(g), proc = g.context.proc, intimacy = g.context.inti;
    click(g, 'act2fa');
    assert.equal(g.context.bottlewater, 1, 'Refusal preserves the water');
    assert.equal(g.context.proc, Math.max(0, proc - 10), 'Refusal adds no drink after the ordinary digestion tick');
    assert.equal(g.context.inti, intimacy, 'Refusal gives no drinking bonus');
    for (const { language, html } of sceneLayers(g, source)) {
      assert(html.includes(refusal[language]), 'Refusal is narrated in ' + language);
      assert(!html.includes(acceptance[language]), 'No contradictory acceptance follows in ' + language);
    }
    const after = snapshot(g);
    g.context.goback(); assert.equal(snapshot(g), before, 'Back restores the water-offer state');
    click(g, 'act2fa'); assert.equal(snapshot(g), after, 'Refusal replays without consuming water');
    reachable++;
  }
  // Synthetic function-entry boundaries use proc=0 so the normal go tick cannot
  // move the tested bladder value across the 550/650 boundaries. Lower-band
  // assertions preserve the existing accepted-drink dose/inventory behavior;
  // they do not certify the narrative quantity remaining in a partial bottle.
  for (const bottle of [0, 1]) for (const bladder of [0, 550, 551, 650, 651]) {
    const g = loadRuntime(source), c = g.context; c.go('start');
    Object.assign(c, { tuesday: 2, thursday: 0, saturday: 0, pregameCaughtUp: true,
      blad: bladder, proc: 0, bottlewater: bottle, inti: 30 });
    const before = snapshot(g); c.go('act2fa');
    const drinks = bottle && bladder <= 650, dose = drinks ? (bladder > 550 ? 25 : 50) : 0;
    assert.equal(c.proc, dose, 'Water dose follows one mutually exclusive response');
    assert.equal(c.bottlewater, drinks ? 0 : bottle, 'Only accepted water is consumed');
    assert.equal(c.inti, 30 + (drinks && bladder <= 550 ? 1 : 0), 'Only the full accepted drink gives the existing bonus');
    assert.equal(c.blad, bladder, 'The offer does not change the tested bladder state');
    const after = snapshot(g); c.goback(); assert.equal(snapshot(g), before);
    c.go('act2fa'); assert.equal(snapshot(g), after); boundaries++;
  }
  return { reachable, boundaries };
}

function verifyTheatrePreorder(source) {
  let reachable = 0, boundaries = 0;
  const prefixes = ['tuesday', 'thursday', 'saturday'].map(day =>
    `start start1a start1b ${day}date start2 gothere flirt_l winelist buymerlot eatmeal buytort
      eatmeal5 eatmeal5a eatmeal5b eatmeal5c asklootalk asklootalk1 asklootalk2`.split(/\s+/));
  prefixes.push(highSpendPrefix.slice(0, highSpendPrefix.indexOf('gotheatre')));
  for (const [index, prefix] of prefixes.entries()) {
    const g = replay(source, prefix), before = snapshot(g), balance = g.context.pounds;
    if (index === 3) assert.equal(balance, 13.5, 'All earlier maximum purchases leave £13.50 before theatre');
    click(g, 'gotheatre');
    assert(choices(g.box).some(x => x.tag === 'theatre1'), 'Witness takes the low-bladder programme branch');
    assert.equal(g.context.pounds, balance - 10, 'Two interval wines cost £10; Diane still buys the programme');
    assert.equal(g.context.wine, 1, 'The interval preorder is recorded');
    assert.equal(g.context.buyprogramme, 1, 'Diane has bought a programme');
    if (index === 3) assert.equal(g.context.pounds, 3.5, 'Maximum spending leaves £3.50 after the preorder');
    const ordered = snapshot(g); click(g, 'theatre1');
    assert.equal(g.context.pounds, balance - 10, 'Taking seats does not charge again');
    g.context.goback(); assert.equal(snapshot(g), ordered);
    g.context.goback(); assert.equal(snapshot(g), before, 'Back refunds the new order and restores programme/wine flags');
    click(g, 'gotheatre'); assert.equal(snapshot(g), ordered, 'Preorder replays exactly once');
    reachable++;
  }
  // Every other normal theatre entry already orders wine. These paths must keep
  // their own charge and must not be charged by the higher-bladder foyer branch.
  const waterRoute = leaves(loadRuntime(source).gallery).find(x => x.id === '06c_lounge_chess_lesson');
  const prefix = ['start', ...waterRoute.tags.slice(0, waterRoute.tags.indexOf('gotheatre'))];
  for (const owner of ['lethergo', 'stopher', 'gotoo', 'luckytrip0']) {
    const g = replay(source, prefix), balance = g.context.pounds;
    click(g, 'gotheatre'); assert.equal(g.context.pounds, balance, 'No premature charge while Diane asks for the loo');
    click(g, 'theatreask');
    if (owner === 'luckytrip0') click(g, owner);
    const beforeOrder = snapshot(g);
    click(g, owner === 'luckytrip0' ? 'luckytrip0a' : owner);
    const cost = owner === 'stopher' ? 10 : 13;
    assert.equal(g.context.pounds, balance - cost, 'Existing wine and optional programme charge remains intact');
    assert.equal(g.context.wine, 1);
    const ordered = snapshot(g);
    g.context.goback(); assert.equal(snapshot(g), beforeOrder);
    click(g, owner === 'luckytrip0' ? 'luckytrip0a' : owner); assert.equal(snapshot(g), ordered);
    if (owner === 'luckytrip0') click(g, 'luckytrip0b');
    click(g, 'theatre1'); assert.equal(g.context.pounds, balance - cost, 'Existing preorder is not charged twice');
    reachable++;
  }
  // Inherited insufficient-funds behavior is kept for synthetic entries. The
  // documented normal-play lower bound is £13.50 before any theatre purchase.
  for (const balance of [0, 9.5, 10, 10.5]) {
    const g = loadRuntime(source), c = g.context; c.go('start');
    Object.assign(c, { pounds: balance, blad: 0, proc: 0, wine: 0, buyprogramme: 0,
      pregameCaughtUp: true, tuesday: 2, thursday: 0, saturday: 0 });
    const before = snapshot(g); c.go('gotheatre');
    assert.equal(c.pounds, balance >= 10 ? balance - 10 : balance);
    assert.equal(c.wine, balance >= 10 ? 1 : 0);
    assert.equal(c.buyprogramme, 1, 'Diane’s programme does not debit Simon');
    assert(choices(g.box).some(x => x.tag === 'theatre1'));
    const after = snapshot(g); c.goback(); assert.equal(snapshot(g), before);
    c.go('gotheatre'); assert.equal(snapshot(g), after); boundaries++;
  }
  return { reachable, boundaries };
}

function verifyMoney(source) {
  // Keep the maximum-spend witness: the new legitimate £10 theatre preorder
  // leaves £3.50, so paid later rounds must disappear while free exits remain.
  const maximum = replay(source, [...highSpendPrefix, ...ordinaryPavilion.slice(0, ordinaryPavilion.indexOf('pavilion5a'))]);
  assert.equal(maximum.context.pounds, 3.5, 'Maximum spending retains a nonnegative £3.50 balance');
  assert(!choices(maximum.box).some(x => x.tag === 'pavilion5a'), 'No unaffordable £7 Pavilion round');
  assert(choices(maximum.box).some(x => x.tag === 'pavilion7'), 'Free Pavilion continuation remains');
  click(maximum, 'pavilion7'); assert.equal(maximum.context.pounds, 3.5);
  const maximumPub = replay(source, [...highSpendPrefix, ...farewellPavilion.slice(0, farewellPavilion.indexOf('pubdrink4a'))]);
  assert.equal(maximumPub.context.pounds, 3.5);
  assert(!choices(maximumPub.box).some(x => x.tag === 'pubdrink4a'), 'No unaffordable £7 pub round');
  for (const tag of ['pubdrink6', 'riverside2', 'riverside3']) click(maximumPub, tag);
  assert(!choices(maximumPub.box).some(x => x.tag === 'riverside3ab'), 'No unaffordable £6 group coffees');
  assert(choices(maximumPub.box).some(x => x.tag === 'riverside7'), 'Free riverside continuation remains');

  // A second witnessed purchase pattern chooses the £10 Pinot rather than £20
  // Burgundy. That £10 saving pays the theatre preorder and retains coverage of
  // the paid later round and the half-pound farewell refusal.
  const paidPrefix = highSpendPrefix.map(tag => tag === 'buyburgundy' ? 'buypinot' : tag);
  const ordinary = replay(source, [...paidPrefix, ...ordinaryPavilion]);
  // £100 - £10 Saturday - £18 shop - £2 juice - £10 Pinot - £23 mains
  // - £10 dessert - £3.50 mixed coffees - £10 interval wines - £7 later round = £6.50.
  // Robert/Bruno explicitly buys the first Pavilion round, so it costs Simon £0.
  assert.equal(ordinary.context.pounds, 6.5, `${source.file}: charge only the player's purchases`);
  const late = replay(source, [...paidPrefix, ...farewellPavilion]);
  assert.equal(late.context.pounds, 0.5, `${source.file}: actual low-money farewell path`);
  assert.equal(late.context.leavepub1, 1);
  const before = snapshot(late);
  click(late, 'riverside16');
  assert.equal(late.context.pounds, 0.5, `${source.file}: unpaid farewell round must not be charged`);
  assert.deepEqual([...new Set(choices(late.box).map(x => x.tag))], ['busqueue'], `${source.file}: skip unaffordable farewell drinks`);
  const after = snapshot(late);
  late.context.goback();
  assert.equal(snapshot(late), before, `${source.file}: Back after low-money detour`);
  click(late, 'riverside16');
  assert.equal(snapshot(late), after, `${source.file}: low-money detour replay`);

  let boundaries = 0;
  // Synthetic boundary tests are separate from the two naturally reachable paths.
  // Directly requested unaffordable endpoints must not supply free drinks or bonuses.
  for (const [menu, offer, endpoint, cost, fallback, next, suppliesDrink] of [
    ['pubdrink4', 'pubdrink4a', 'pubdrink5', 7, 'pubdrink6', 'pubdrink6', true],
    ['pavilion5', 'pavilion5a', 'pavilion6', 7, 'pavilion7', 'pavilion7', true],
    ['riverside3', 'riverside3ab', 'riverside3ab', 6, 'riverside7', 'riverside4', true],
    ['justclosed1', 'justclosed2', 'justclosed2', 10, 'toiletclosed1', 'justclosed3', false],
  ]) for (const balance of [0, cost - 0.5, cost, cost + 0.5]) {
    const g = loadRuntime(source), c = g.context;
    c.go('start');
    Object.assign(c, { pounds: balance, proc: 0, blad: 500, mollyproc: 100, inti: 20,
      pregameCaughtUp: true, saturday: 2, tuesday: 0, thursday: 0 });
    c.go(menu);
    assert.equal(choices(g.box).some(x => x.tag === offer), balance >= cost, `${source.file}: ${menu} affordability at ${balance}`);
    assert(choices(g.box).some(x => x.tag === fallback), `${source.file}: retain free alternative at ${menu}`);
    const previousIntimacy = c.inti, previousMolly = c.mollyproc;
    c.go(endpoint);
    assert.equal(c.pounds, balance >= cost ? balance - cost : balance, `${source.file}: ${endpoint} debit at ${balance}`);
    assert(choices(g.box).some(x => x.tag === (balance >= cost ? next : fallback)));
    if (balance < cost) {
      assert.equal(c.proc, 0, `${source.file}: no free drink at ${endpoint}`);
      assert.equal(c.mollyproc, previousMolly, `${source.file}: no free group drink at ${endpoint}`);
      assert.equal(c.inti, previousIntimacy, `${source.file}: no unearned intimacy at ${endpoint}`);
    } else if (suppliesDrink) assert(c.proc > 0, `${source.file}: paid drink supplied at ${endpoint}`);
    else assert.equal(c.inti, previousIntimacy + 20, `${source.file}: successful paid assistance`);
    boundaries++;
  }
  return { reachable: 4, boundaries };
}

const ordinaryBusPrefix = ["start", "start1a", "start1b", "tuesdaydate", "start2", "buysth", "buywater", "buysth", "gothere", "winelist", "buychardonnay", "eatmeal", "buytort", "eatmeal5", "eatmeal5a", "eatmeal5b", "eatmeal5c", "traintalk", "traintalk1", "traintalk2", "eatmeal7", "eatmeal7a", "eatmeal7b", "espresso", "eatmeal7c", "gotheatre", "theatreask", "stopher", "theatre1", "theatre2", "theatre3c", "theatre4", "theatre5", "theatre6", "theatre7", "holdhand1", "theatre8", "theatre9", "theatre10", "interval", "interval1", "gotoo1", "interval2", "interval3", "act2", "act2a", "act2b", "leanclose2", "act2c", "act2d", "act2e", "act2f", "act2fa", "act2g", "act2h", "leavetheatre", "leavetheatre1", "stagedoor", "stagedoor1", "stagedoor2", "stagedoor3", "stagedoor4", "stagedoor5a", "choosewalk1", "riverside2", "riverside3", "riverside3aa", "riverside4", "sitonbench", "riverside5", "riverside6", "riverside7", "riverside8", "riverside9", "riverside10", "riverside11", "traintalka", "riverside12", "riverside13a", "helpdiane", "helpdiane1a", "helpdiane1aa", "helpdiane1b", "riverside14", "toiletopen", "riverside15", "riverside16", "pavilion", "pavilion2", "pavilion3", "pavilion4", "pavilion5", "pavilion5a", "pavilion6", "pavilion7", "buywaterpav", "pavilion8", "pavilion9", "pavilion9a", "busqueue", "busqueue1", "busqueue2", "busqueue3", "busqueue4", "busqueue5", "carpark", "carpark1", "carpark2", "carpark3"];
function verifyBusLuckshots(source) {
  const g = replay(source, ordinaryBusPrefix);
  assert.equal(g.context.luckshots, 3, 'Actual bus witness retains its early luckshots');
  const before = snapshot(g);
  click(g, 'busqueue7');
  assert.equal(g.context.luckshots, 1, 'Successful ordinary boarding enforces the endgame cap');
  const boarded = snapshot(g);
  g.context.goback();
  assert.equal(snapshot(g), before, 'Back restores the three unspent pre-boarding luckshots');
  click(g, 'busqueue7');
  assert.equal(snapshot(g), boarded, 'Reboarding reproduces the capped state');
  click(g, 'bushome');
  assert.equal(g.context.luckshots, 1, 'Bus departure preserves the cap');
  let boundaries = 0;
  for (const day of ['tuesday', 'thursday', 'saturday']) {
    for (const remaining of [0, 1, 2, 3]) for (const bladder of [758, 759]) {
      const trial = loadRuntime(source), c = trial.context;
      c.go('start');
      Object.assign(c, { tuesday: 0, thursday: 0, saturday: 0, blad: bladder,
        proc: 0, luckshots: remaining, pregameCaughtUp: true });
      c[day] = 2;
      c.go('busqueue7');
      // The node first adds 2 ml: exactly 760 boards, 761 rejects boarding.
      const boards = bladder === 758;
      assert(choices(trial.box).some(x => x.tag === (boards ? 'bushome' : 'lastgamble')));
      assert.equal(c.luckshots, boards ? Math.min(remaining, 1) : remaining,
        day + ': only successful boarding caps luckshots, including zero');
      boundaries++;
    }
  }
  return { reachable: 1, boundaries };
}

const riversideWitnesses = {
  "pintTuesday": [
    "start",
    "start1a",
    "start1b",
    "tuesdaydate",
    "start2",
    "buysth",
    "buywater",
    "buysth",
    "gothere",
    "winelist",
    "buyrioja",
    "eatmeal",
    "buytort",
    "eatmeal5",
    "eatmeal5a",
    "eatmeal5b",
    "eatmeal5c",
    "traintalk",
    "traintalk1",
    "traintalk2",
    "eatmeal7",
    "eatmeal7a",
    "eatmeal7b",
    "espresso",
    "eatmeal7c",
    "gotheatre",
    "theatreask",
    "stopher",
    "theatre1",
    "theatre2",
    "theatre3c",
    "theatre4",
    "theatre5",
    "theatre6",
    "theatre7",
    "holdhand1",
    "theatre8",
    "theatre9",
    "theatre10",
    "interval",
    "interval1",
    "gotoo1",
    "interval2",
    "interval3",
    "act2",
    "act2a",
    "act2b",
    "leanclose2",
    "act2c",
    "act2d",
    "act2e",
    "act2f",
    "act2fa",
    "act2g",
    "act2h",
    "leavetheatre",
    "leavetheatre1",
    "stagedoor",
    "stagedoor1",
    "stagedoor2",
    "stagedoor3",
    "stagedoor4",
    "stagedoor5a",
    "choosepub",
    "pubdrink",
    "pubdrink1",
    "pubdrink2",
    "pubdrink3",
    "pubdrink4",
    "pubdrink6",
    "pubdrink7"
  ],
  "pintThursday": [
    "start",
    "start1a",
    "start1b",
    "thursdaydate",
    "start2",
    "gothere",
    "winelist",
    "buyrioja",
    "eatmeal",
    "buytort",
    "eatmeal5",
    "eatmeal5a",
    "eatmeal5b",
    "eatmeal5c",
    "traintalk",
    "traintalk1",
    "traintalk2",
    "eatmeal7",
    "eatmeal7a",
    "puddings",
    "buypannacotta",
    "eatmeal7b",
    "filtercoffee",
    "eatmeal7bb",
    "gotheatre",
    "theatreask",
    "gotoo",
    "theatre1",
    "theatre2",
    "theatre3c",
    "theatre4",
    "theatre5",
    "theatre6",
    "theatre7",
    "holdhand1",
    "theatre8",
    "theatre9",
    "theatre10",
    "interval",
    "interval1",
    "askloo",
    "interval2",
    "interval3",
    "act2",
    "act2a",
    "act2b",
    "leanclose2",
    "act2c",
    "act2d",
    "act2e",
    "act2f",
    "act2fa",
    "act2g",
    "act2h",
    "leavetheatre",
    "leavetheatre1",
    "stagedoor",
    "stagedoor1",
    "stagedoor2",
    "stagedoor3",
    "stagedoor4",
    "stagedoor5",
    "choosepub1",
    "pubdrink",
    "pubdrink1",
    "pubdrink2",
    "pubdrink3",
    "pubdrink4",
    "pubdrink6",
    "pubdrink7"
  ],
  "freshStamps": [
    "start",
    "start1a",
    "start1b",
    "saturdaydate",
    "start2",
    "gothere",
    "flirt_h",
    "winelist",
    "buypinot",
    "eatmeal",
    "buytort",
    "eatmeal5",
    "eatmeal5a",
    "eatmeal5b",
    "eatmeal5c",
    "asklootalk",
    "asklootalk1",
    "asklootalk2",
    "gotheatre",
    "theatre1",
    "theatre2",
    "theatre3c",
    "theatre4",
    "theatre5",
    "theatre6",
    "theatre7",
    "theatre8",
    "theatre9",
    "theatre10",
    "interval",
    "interval1",
    "luckytrip1",
    "luckytrip1a",
    "interval3",
    "act2",
    "act2a",
    "act2b",
    "act2c",
    "act2d",
    "act2e",
    "act2f",
    "act2fa",
    "act2g",
    "act2h",
    "leavetheatre",
    "leavetheatre1",
    "dianechoice",
    "stagedoor",
    "stagedoor1",
    "stagedoor2",
    "stagedoor3",
    "stagedoor4",
    "stagedoor5a",
    "choosewalk",
    "riverside2",
    "riverside3",
    "riverside7",
    "riverside8",
    "riverside9",
    "riverside10",
    "riverside11",
    "stamptalka"
  ],
  "festival": [
    "start",
    "start1a",
    "start1b",
    "tuesdaydate",
    "start2",
    "buysth",
    "buywater",
    "buysth",
    "gothere",
    "winelist",
    "buyrioja",
    "eatmeal",
    "buyspagbol",
    "eatmeal2",
    "eatmeal2a",
    "eatmeal2b",
    "eatmeal2c",
    "eatmeal2d",
    "eatmeal7",
    "eatmeal7a",
    "puddings",
    "buypannacotta",
    "eatmeal7b",
    "filtercoffee",
    "eatmeal7bb",
    "gotheatre",
    "theatreask",
    "gotoo",
    "theatre1",
    "theatre2",
    "theatre3c",
    "theatre4",
    "theatre5",
    "theatre6",
    "theatre7",
    "holdhand1",
    "theatre8",
    "theatre9",
    "theatre10",
    "interval",
    "interval1",
    "askloo",
    "interval2",
    "interval3",
    "act2",
    "act2a",
    "act2b",
    "leanclose2",
    "act2c",
    "act2d",
    "act2e",
    "act2f",
    "act2fa",
    "act2g",
    "act2h",
    "leavetheatre",
    "leavetheatre1",
    "stagedoor",
    "stagedoor1",
    "stagedoor2",
    "stagedoor3",
    "stagedoor4",
    "stagedoor5a",
    "choosewalk",
    "riverside2",
    "riverside3",
    "riverside3aa",
    "riverside4",
    "sitonbench",
    "riverside5",
    "riverside6",
    "riverside7",
    "riverside8",
    "riverside9",
    "riverside10",
    "riverside11",
    "musictalka"
  ],
  "portaloo": [
    "start",
    "start1a",
    "start1b",
    "tuesdaydate",
    "start2",
    "buysth",
    "buywater",
    "buysth",
    "gothere",
    "winelist",
    "buyrioja",
    "eatmeal",
    "buytort",
    "eatmeal5",
    "eatmeal5a",
    "eatmeal5b",
    "eatmeal5c",
    "traintalk",
    "traintalk1",
    "traintalk2",
    "eatmeal7",
    "eatmeal7a",
    "eatmeal7b",
    "espresso",
    "eatmeal7c",
    "gotheatre",
    "theatreask",
    "stopher",
    "theatre1",
    "theatre2",
    "theatre3c",
    "theatre4",
    "theatre5",
    "theatre6",
    "theatre7",
    "holdhand1",
    "theatre8",
    "theatre9",
    "theatre10",
    "interval",
    "interval1",
    "gotoo1",
    "interval2",
    "interval3",
    "act2",
    "act2a",
    "act2b",
    "leanclose2",
    "act2c",
    "act2d",
    "act2e",
    "act2f",
    "act2fa",
    "act2g",
    "act2h",
    "leavetheatre",
    "leavetheatre1",
    "stagedoor",
    "stagedoor1",
    "stagedoor2",
    "stagedoor3",
    "stagedoor4",
    "stagedoor5a",
    "choosewalk1",
    "riverside2",
    "riverside3",
    "riverside3aa",
    "riverside4",
    "sitonbench",
    "riverside5",
    "riverside6",
    "luckytrip16",
    "luckytrip16a",
    "luckytrip16a1",
    "riverside7",
    "riverside8",
    "riverside9",
    "riverside10",
    "riverside11",
    "traintalka",
    "riverside12",
    "riverside13a"
  ],
  "saturdayRound": [
    "start",
    "start1a",
    "start1b",
    "saturdaydate",
    "start2",
    "gothere",
    "flirt_h",
    "winelist",
    "buypinot",
    "eatmeal",
    "buytort",
    "eatmeal5",
    "eatmeal5a",
    "eatmeal5b",
    "eatmeal5c",
    "asklootalk",
    "asklootalk1",
    "asklootalk2",
    "gotheatre",
    "theatre1",
    "theatre2",
    "theatre3c",
    "theatre4",
    "theatre5",
    "theatre6",
    "theatre7",
    "theatre8",
    "theatre9",
    "theatre10",
    "interval",
    "interval1",
    "luckytrip1",
    "luckytrip1a",
    "interval3",
    "act2",
    "act2a",
    "act2b",
    "act2c",
    "act2d",
    "act2e",
    "act2f",
    "act2fa",
    "act2g",
    "act2h",
    "leavetheatre",
    "leavetheatre1",
    "dianechoice",
    "stagedoor",
    "stagedoor1",
    "stagedoor2",
    "stagedoor3",
    "stagedoor4",
    "stagedoor5a",
    "choosepub1",
    "pubdrink",
    "pubdrink1",
    "pubdrink2",
    "pubdrink3",
    "pubdrink4",
    "pubdrink4a"
  ]
};

// Riverside audit witnesses use visible choices from a fresh title page. They
// neither inject game state nor rely on Gallery Skip. Boundary cases below are
// separately labelled synthetic function entries.
const riversideRenderCache = new Map();
function expectedRiversideLine(source, node, english) {
  let cached = riversideRenderCache.get(source.file);
  if (!cached) {
    const language = /dianedate_([a-z]{2})/.exec(source.file)[1];
    const en = readSource('en'), local = readSource(language);
    cached = { language, en, local, eg: makeTextGame(en), lg: makeTextGame(local) };
    riversideRenderCache.set(source.file, cached);
  }
  const call = cached.en.calls.find(c => c.source.node === node && c.text === english);
  assert(call, `Missing required English regression clause ${node}: ${english}`);
  const translated = cached.local.calls.find(c => c.source.node === node && c.source.slot === call.source.slot);
  assert(translated && translated.static, 'The corresponding localized clause must exist');
  const name = call.kind === 'choice' ? 'c' : 's';
  const args = c => c.kind === 'choice' ? [c.tag, c.text] : [c.text];
  return { en: renderText(cached.eg, name, {}, args(call)),
    local: renderText(cached.lg, name, {}, args(translated)) };
}
function expectRiversideLine(g, source, node, english, present = true) {
  const expected = expectedRiversideLine(source, node, english);
  for (const layer of sceneLayers(g, source)) assert.equal(
    layer.html.includes(layer.language === 'en' ? expected.en : expected.local), present,
    `${source.file}: ${node}/${layer.language}: ${present ? 'show' : 'omit'} ${english}`);
}
function checkRiversideBack(g, tag, before, synthetic = false) {
  const after = snapshot(g);
  g.context.goback(); assert.equal(snapshot(g), before, `${tag}: Back restores the full state and HTML`);
  if (synthetic) g.context.go(tag); else click(g, tag);
  assert.equal(snapshot(g), after, `${tag}: replay restores the same state and HTML`);
}

function verifyRiversideDrinks(source) {
  let reachable = 0;
  const expected = "<LI>It's quite cosy in the pub. Diane is sitting beside you, while Molly and her friend are opposite. Diane hasn't drunk much, but Molly is halfway through her pint. But she seems to be accustomed to drinking real ale. So you don't get too excited.";
  for (const route of [riversideWitnesses.pintTuesday, riversideWitnesses.pintThursday]) {
    const prefix = route.slice(0, route.indexOf('pubdrink4') + 1);
    for (const ordered of [false, true]) {
      const g = replay(source, prefix), balance = g.context.pounds;
      if (ordered) { click(g, 'pubdrink4a'); click(g, 'pubdrink5'); }
      click(g, 'pubdrink6');
      assert.equal(g.context.pounds, balance - (ordered ? 7 : 0), 'Only the selected second pub round is paid');
      const before = snapshot(g), mollyProc = g.context.mollyproc, mollyBlad = g.context.mollyblad;
      click(g, 'pubdrink7');
      assert.equal(g.context.mollyproc, mollyProc - 30, 'Narrative change preserves existing Molly timing');
      assert.equal(g.context.mollyblad, mollyBlad + 30);
      assert.equal(g.context.pounds, balance - (ordered ? 7 : 0));
      expectRiversideLine(g, source, 'pubdrink7', expected);
      checkRiversideBack(g, 'pubdrink7', before); reachable++;
    }
  }
  return { reachable, boundaries: 0 };
}

function verifyRiversideMusic(source) {
  const regret = "<LI>You wish you hadn't started that line of talk.";
  const hurried = '<LI>The conversation falters. She is hurrying you along.';
  const distracted = "<LI>She isn't really concentrating on what you say. Her mind is on other things.";
  const g = replay(source, riversideWitnesses.festival.slice(0, -1)), before = snapshot(g), intimacy = g.context.inti;
  assert.equal(g.context.spagbol, 2, 'Actual festival witness ate spaghetti');
  click(g, 'musictalka'); assert(g.context.blad <= 650, 'Actual festival witness remains in the comfortable band');
  assert.equal(g.context.inti, intimacy + 5); expectRiversideLine(g, source, 'musictalka', regret, false);
  checkRiversideBack(g, 'musictalka', before);
  let boundaries = 0;
  for (const festival of [0, 2]) for (const bladder of [650, 651, 750, 751]) {
    const trial = loadRuntime(source), c = trial.context; c.go('start');
    Object.assign(c, { tuesday: 2, thursday: 0, saturday: 0, pregameCaughtUp: true,
      blad: bladder, proc: 0, spagbol: festival, inti: 20, mollyproc: 100, mollyblad: 100 });
    const before = snapshot(trial); c.go('musictalka');
    expectRiversideLine(trial, source, 'musictalka', regret, !festival && bladder <= 650);
    expectRiversideLine(trial, source, 'musictalka', hurried, bladder > 650 && bladder <= 750);
    expectRiversideLine(trial, source, 'musictalka', distracted, bladder > 750);
    assert.equal(c.blad, bladder); assert.equal(c.proc, 5);
    assert.equal(c.mollyproc, 70); assert.equal(c.mollyblad, 130);
    assert.equal(c.inti, 20 + (festival ? 5 : -5) - (bladder > 750 ? 10 : 0));
    checkRiversideBack(trial, 'musictalka', before, true); boundaries++;
  }
  return { reachable: 1, boundaries };
}

function verifyRiversideStamps(source) {
  const callback = '<LI>DIANE: You said earlier that you collected stamps. Have you got a good collection?';
  const introduction = "<LI>YOU: Actually, I've got a really good stamp collection. It's something I've built up since I was a boy.";
  const freshPrefix = riversideWitnesses.freshStamps.slice(0, -1);
  const fresh = replay(source, freshPrefix), initial = snapshot(fresh), intimacy = fresh.context.inti;
  assert.equal(fresh.context.stampstalking, 0); assert.equal(typeof fresh.context.stamptalking, 'undefined');
  click(fresh, 'stamptalka');
  assert.equal(fresh.context.stampstalking, 1, 'First stamp discussion sets the declared/snapshotted flag');
  assert.equal(typeof fresh.context.stamptalking, 'undefined', 'Do not create an untracked misspelled flag');
  assert.equal(fresh.context.inti, intimacy + 5);
  expectRiversideLine(fresh, source, 'stamptalka', callback, false);
  expectRiversideLine(fresh, source, 'stamptalka', introduction);
  checkRiversideBack(fresh, 'stamptalka', initial);

  // The dinner choice is reached normally. Back must remove this knowledge so
  // taking a different conversation cannot leave an invisible callback flag.
  const dinnerPrefix = riversideWitnesses.pintTuesday.slice(0, riversideWitnesses.pintTuesday.indexOf('eatmeal5c') + 1);
  const dinner = replay(source, dinnerPrefix), beforeDinner = snapshot(dinner);
  click(dinner, 'stamptalk'); assert.equal(dinner.context.stampstalking, 1);
  assert.equal(typeof dinner.context.stamptalking, 'undefined');
  checkRiversideBack(dinner, 'stamptalk', beforeDinner);
  dinner.context.goback(); assert.equal(dinner.context.stampstalking, 0);
  click(dinner, 'traintalk'); assert.equal(dinner.context.stampstalking, 0, 'Alternative dinner topic keeps stamps undisclosed');

  // This actual route keeps the earlier stamp discussion and then asks about it
  // at the river. It is a normal-choice witness, not a directly injected flag.
  const returnPath = [...dinnerPrefix, 'stamptalk', 'eatmeal5d', 'eatmeal7', 'eatmeal7a', 'eatmeal7b', 'espresso', 'eatmeal7c',
    ...riversideWitnesses.pintTuesday.slice(riversideWitnesses.pintTuesday.indexOf('gotheatre'), riversideWitnesses.pintTuesday.indexOf('choosepub')),
    'choosewalk1', 'riverside2', 'riverside3', 'riverside7', 'riverside8', 'riverside9', 'riverside10', 'riverside11'];
  const returning = replay(source, returnPath), beforeReturn = snapshot(returning), priorIntimacy = returning.context.inti;
  assert.equal(returning.context.stampstalking, 1); click(returning, 'stamptalka');
  expectRiversideLine(returning, source, 'stamptalka', callback);
  expectRiversideLine(returning, source, 'stamptalka', introduction, false);
  assert.equal(returning.context.inti, priorIntimacy + 5); assert.equal(returning.context.stampstalking, 1);
  checkRiversideBack(returning, 'stamptalka', beforeReturn);
  // Fresh runtime construction models the game's page-reload reset; actual
  // browser reload/navigation remains covered by the separate browser checks.
  const restarted = replay(source, freshPrefix); assert.equal(restarted.context.stampstalking, 0);
  assert.equal(typeof restarted.context.stamptalking, 'undefined');
  click(restarted, 'stamptalka'); expectRiversideLine(restarted, source, 'stamptalka', callback, false);
  expectRiversideLine(restarted, source, 'stamptalka', introduction);
  return { reachable: 4, boundaries: 0 };
}

function verifyRiversideNeedCue(source) {
  const full = "<LI>Diane has gone rather quiet. It looks as if she needs the loo. But it won't be far to the Pavilion.";
  const comfortable = "<LI>Diane has gone rather quiet. But it won't be far to the Pavilion.";
  const g = replay(source, riversideWitnesses.portaloo.slice(0, -1)), before = snapshot(g);
  assert(riversideWitnesses.portaloo.includes('luckytrip16a1'), 'Witness includes the actual Portaloo visit');
  click(g, 'riverside13a'); assert.equal(g.context.blad, 93, 'Normal post-Portaloo witness is comfortable');
  expectRiversideLine(g, source, 'riverside13a', full, false); expectRiversideLine(g, source, 'riverside13a', comfortable);
  checkRiversideBack(g, 'riverside13a', before);
  let boundaries = 0;
  for (const day of ['tuesday', 'thursday', 'saturday']) for (const bladder of [0, 600, 601, 750, 751]) {
    const trial = loadRuntime(source), c = trial.context; c.go('start');
    Object.assign(c, { tuesday: 0, thursday: 0, saturday: 0, [day]: 2, pregameCaughtUp: true,
      blad: bladder, proc: 0, inti: 20, points: 30 });
    const before = snapshot(trial); c.go('riverside13a');
    expectRiversideLine(trial, source, 'riverside13a', full, bladder > 600);
    expectRiversideLine(trial, source, 'riverside13a', comfortable, bladder <= 600);
    assert.deepEqual([...new Set(choices(trial.box).map(c => c.tag))], [bladder > 750 ? 'helpdiane' : 'riverside14']);
    assert.equal(c.blad, bladder); assert.equal(c.proc, 0); assert.equal(c.inti, 20); assert.equal(c.points, 30);
    checkRiversideBack(trial, 'riverside13a', before, true); boundaries++;
  }
  return { reachable: 1, boundaries };
}

function verifyRiversideRoundLabels(source) {
  const cheap = "It's your round—but a cheap one because of the special offers.";
  const ordinary = "It's your round.";
  let reachable = 0;
  for (const route of [riversideWitnesses.pintTuesday, riversideWitnesses.pintThursday, riversideWitnesses.saturdayRound]) {
    const g = replay(source, route.slice(0, route.indexOf('pubdrink4') + 1)), before = snapshot(g), balance = g.context.pounds;
    click(g, 'pubdrink4a');
    expectRiversideLine(g, source, 'pubdrink4a', ordinary, !!g.context.saturday);
    expectRiversideLine(g, source, 'pubdrink4a', cheap, !g.context.saturday);
    assert.equal(g.context.pounds, balance, 'Round label itself never charges');
    assert.deepEqual([...new Set(choices(g.box).map(c => c.tag))], ['pubdrink5']);
    checkRiversideBack(g, 'pubdrink4a', before);
    const offer = snapshot(g); click(g, 'pubdrink5'); assert.equal(g.context.pounds, balance - 7, 'The same accepted round costs £7 on each day');
    checkRiversideBack(g, 'pubdrink5', offer); reachable++;
  }
  return { reachable, boundaries: 0 };
}

// This ordinary Tuesday witness uses offered choices from the title screen.
// The independent synthetic partitions below do not establish ontoilet2 reachability.
const clothingTuesdayPath = `start start1a start1b tuesdaydate start2 buysth buywater buysth gothere winelist buyrioja eatmeal buytort eatmeal5
eatmeal5a eatmeal5b eatmeal5c traintalk traintalk1 traintalk2 eatmeal7 eatmeal7a eatmeal7b espresso eatmeal7c
gotheatre theatreask stopher theatre1 theatre2 theatre3c theatre4 theatre5 theatre6 theatre7 holdhand1 theatre8
theatre9 theatre10 interval interval1 gotoo1 interval2 interval3 act2 act2a act2b leanclose2 act2c act2d act2e
act2f act2fa act2g act2h leavetheatre leavetheatre1 stagedoor stagedoor1 stagedoor2 stagedoor3 stagedoor4
stagedoor5a choosewalk1 riverside2 riverside3 riverside3aa riverside4 sitonbench riverside5 riverside6 riverside7
riverside8 riverside9 riverside10 riverside11 traintalka riverside12 riverside13a helpdiane helpdiane1a
helpdiane1aa helpdiane1b riverside14 toiletopen riverside15 riverside16 pavilion pavilion2 pavilion3 pavilion4
pavilion5 pavilion5a pavilion6 pavilion7 buywaterpav pavilion8 pavilion9 pavilion9a busqueue busqueue1 busqueue2
taxihome taxihome1 taxihome4 taxihome4a taxiarmround taxihome5 taxihome6 taxihome7 taxihome8 arrivehome arrivehome0
arrivehome1 scenario2 coffeereal2 scenario2a scenario3 scenario3a scenario3b sofakiss sofasnog sofasnog1 sofasnog2
sofabreasts sofabreasts3 sofabreasts4 sofadrink sofaarm1 sofaarm2 sofasnog2 sofalegs sofalegs1 sofalegs2 sofadrink
sofaarm1 sofaarm2 sofasnog2 sofalegs sofalegs2 sofapee sofapee1 decisions sofapee2 sofatoilet sofatoilet1
sofatoilet2 sofatoilet3 sofatoilet4 nicelydesp1 nicelydesp2 nicelydesp3 nicelydesp4 nicelydesp5 lootogether`.split(/\s+/);
const clothingClauses = [
  {
    "node": "lootogether1",
    "branch": "always",
    "thursday": "<LI>Standing right in front of you she reaches up under her skirt, fumbles for a second, then pulls down her tights and knickers, then sits on the toilet. She pushes her tights a bit further down until they are almost at her knees, her sky-blue knickers just above them.",
    "tuesday": "<LI>Standing right in front of you she reaches up under her skirt, fumbles for a second, then pulls down her pink knickers, then sits on the toilet. She pushes her knickers a bit further down until they are almost at her knees.",
    "otherwise": "<LI>Standing right in front of you she reaches up under her dress, fumbles for a second, then pulls down her white knickers, then sits on the toilet. She pushes her knickers a bit further down until they are almost at her knees."
  },
  {
    "node": "lootogether1",
    "branch": "lowIntimacy",
    "thursday": "<LI>Because she's pushed the hem of her skirt down you can't see it, but the sound of her pee stream now at full force is marvellous. After a while it lessens and she murmurs, 'Almost finished,' but then there is a bit more before it trickles into silence. It must have lasted a full minute. She pulls off a piece of toilet tissue, reaches down and wipes herself. 'I really needed that,' she says and, standing up, pulls up her knickers and then her tights.",
    "otherwise": "<LI>Because she's pushed the hem of her skirt down you can't see it, but the sound of her pee stream now at full force is marvellous. After a while it lessens and she murmurs, 'Almost finished,' but then there is a bit more before it trickles into silence. It must have lasted a full minute. She pulls off a piece of toilet tissue, reaches down and wipes herself. 'I really needed that,' she says and, standing up, pulls up her knickers."
  },
  {
    "node": "ontoilet1",
    "branch": "squat",
    "thursday": "<LI>She pulls off a piece of tissue and quickly wipes herself, then stands and pulls on her sky-blue knickers.",
    "tuesday": "<LI>She pulls off a piece of tissue and quickly wipes herself, then stands and pulls on her pink knickers.",
    "otherwise": "<LI>She pulls off a piece of tissue and quickly wipes herself, then stands and pulls on her white knickers."
  },
  {
    "node": "ontoilet1",
    "branch": "squat",
    "thursday": "She then starts to pull up her tights but long before she has finished she is in your arms as you kiss her mouth, her face, her neck. You tell her how wonderful it was.",
    "otherwise": "She then starts to straighten her clothes but long before she has finished she is in your arms as you kiss her mouth, her face, her neck. You tell her how wonderful it was."
  },
  {
    "node": "ontoilet1",
    "branch": "notSquat",
    "thursday": "<LI>She realises you are watching, blushes slightly and pushes the hem of her skirt further towards her knees. You cannot see the stream anymore, but the sound of her pee stream now at full force is marvellous. After a while it lessens and she murmurs, 'Almost finished,' but then there is a bit more before it trickles into silence. It must have lasted a full minute. She pulls off a piece of toilet tissue, reaches down and wipes herself. 'I really needed that,' she says and, standing up, pulls up her knickers and then her tights.",
    "otherwise": "<LI>She realises you are watching, blushes slightly and pushes the hem of her skirt further towards her knees. You cannot see the stream anymore, but the sound of her pee stream now at full force is marvellous. After a while it lessens and she murmurs, 'Almost finished,' but then there is a bit more before it trickles into silence. It must have lasted a full minute. She pulls off a piece of toilet tissue, reaches down and wipes herself. 'I really needed that,' she says and, standing up, pulls up her knickers."
  },
  {
    "node": "lootogether2",
    "branch": "always",
    "thursday": "<LI>She ushers you out of the toilet while she washes her hands and straightens her tights. Then she comes out to join you in the hall.",
    "otherwise": "<LI>She ushers you out of the toilet while she washes her hands and straightens her clothes. Then she comes out to join you in the hall."
  }
];

function verifyClothingContinuity(source) {
  function assertClothes(g, node) {
    const c = g.context;
    for (const row of clothingClauses.filter(r => r.node === node)) {
      const visible = row.branch === 'always' || (row.branch === 'lowIntimacy' && c.inti < 110) ||
        (row.branch === 'squat' && !!c.squat) || (row.branch === 'notSquat' && !c.squat);
      const selected = c.thursday ? row.thursday : c.tuesday && row.tuesday ? row.tuesday : row.otherwise;
      for (const line of new Set([row.thursday, row.tuesday, row.otherwise].filter(Boolean))) {
        expectRiversideLine(g, source, node, line, visible && line === selected);
      }
    }
  }
  const normal = replay(source, clothingTuesdayPath);
  assert.equal(normal.context.tuesday, 2); assert.equal(normal.context.squat, 0);
  assert.equal(normal.context.inti, 160, 'The ordinary witness enters the existing high-intimacy branch');
  for (const tag of ['lootogether1', 'ontoilet', 'ontoilet1', 'lootogether2']) {
    const before = snapshot(normal); click(normal, tag);
    if (tag !== 'ontoilet') assertClothes(normal, tag);
    checkRiversideBack(normal, tag, before);
  }
  assert.equal(normal.context.blad, 11, 'The existing digestion tick follows the preceding bladder reset');

  // Direct function entries cover the exact 110 intimacy boundary and both
  // squat branches on all valid dates. Each input is synthetic and restored.
  const g = loadRuntime(source), c = g.context; c.go('start');
  const initial = JSON.parse(snapshot(g)); let boundaries = 0;
  for (const day of ['tuesday', 'thursday', 'saturday']) for (const intimacy of [109, 110]) {
    for (const squat of [0, 1]) for (const tag of ['lootogether1', 'ontoilet1', 'lootogether2']) {
      c.restoreGame(initial); c.gameHistory = []; c.guideHistory = [];
      Object.assign(c, { tuesday: 0, thursday: 0, saturday: 0, [day]: 2,
        inti: intimacy, squat, blad: 675, proc: 0, pregameCaughtUp: true });
      const before = snapshot(g), expected = JSON.parse(before).state;
      expected.currentTag = tag;
      if (tag === 'ontoilet1' || (tag === 'lootogether1' && intimacy < 110)) expected.blad = 0;
      c.go(tag); assertClothes(g, tag);
      assert.deepEqual(JSON.parse(snapshot(g)).state, expected, 'Clothing wording preserves every tracked state effect');
      const target = tag === 'lootogether1' ? intimacy < 110 ? 'lootogether2' : 'ontoilet' :
        tag === 'ontoilet1' ? squat ? 'ontoilet2' : 'lootogether2' : 'lootogether3';
      assert.deepEqual(choices(g.box).map(x => x.tag), c.beginRender ? [target, target] : [target]);
      checkRiversideBack(g, tag, before, true); boundaries++;
    }
  }
  return { reachable: 1, boundaries };
}

// Specific closeout witnesses use only offered choices, without injected state.
const englishCloseoutRoutes = {
  "fifth": [
    "start",
    "start1a",
    "start1b",
    "tuesdaydate",
    "start2",
    "buysth",
    "buywater",
    "buysth",
    "gothere",
    "winelist",
    "buyburgundy",
    "eatmeal",
    "buytort",
    "eatmeal5",
    "eatmeal5a",
    "eatmeal5b",
    "eatmeal5c",
    "traintalk",
    "traintalk1",
    "traintalk2",
    "eatmeal7",
    "eatmeal7a",
    "puddings",
    "buypannacotta",
    "eatmeal7b",
    "filtercoffee",
    "eatmeal7bb",
    "gotheatre",
    "theatreask",
    "gotoo",
    "theatre1",
    "theatre2",
    "theatre3c",
    "theatre4",
    "theatre5",
    "theatre6",
    "theatre7",
    "theatre8",
    "theatre9",
    "theatre10",
    "interval",
    "interval1",
    "luckytrip1",
    "luckytrip1a",
    "interval2",
    "interval3",
    "act2",
    "act2a",
    "act2b",
    "act2c",
    "act2d",
    "act2e",
    "act2f",
    "act2fa",
    "act2g",
    "act2h",
    "leavetheatre",
    "leavetheatre1",
    "stagedoor",
    "stagedoor1",
    "stagedoor2",
    "stagedoor3",
    "stagedoor4",
    "stagedoor5a",
    "choosewalk",
    "riverside2",
    "riverside3",
    "riverside3aa",
    "riverside4",
    "sitonbench",
    "riverside5",
    "riverside6",
    "riverside7",
    "riverside8",
    "riverside9",
    "riverside10",
    "riverside11",
    "riverside12",
    "riverside13a",
    "riverside14",
    "toiletopen",
    "riverside15",
    "riverside16",
    "pavilion",
    "luckytrip8",
    "luckytrip8a",
    "pavilion2",
    "pavilion3",
    "pavilion4",
    "pavilion5",
    "pavilion5a",
    "pavilion6",
    "pavilion7",
    "buywaterpav",
    "pavilion8",
    "pavilion9",
    "notime",
    "busqueue",
    "busqueue1",
    "busqueue2",
    "busqueue3",
    "queue1a",
    "queue1b",
    "carparka",
    "carparka0",
    "carparka1",
    "carparka2",
    "carparka3",
    "peepround",
    "peepround1",
    "taxihome1",
    "taxihome4",
    "taxihome4a",
    "taxiarmround",
    "taxihome5",
    "taxihome6",
    "taxihome7",
    "taxihome8",
    "arrivehome",
    "arrivehome0",
    "arrivehome1",
    "scenario2",
    "coffeereal2",
    "scenario2a",
    "scenario3",
    "scenario3a",
    "scenario3b",
    "sofakiss",
    "sofasnog",
    "sofasnog1",
    "sofasnog2",
    "sofabreasts",
    "sofabreasts3",
    "sofabreasts4",
    "sofadrink",
    "sofaarm1",
    "sofaarm2",
    "sofasnog2",
    "sofalegs",
    "sofalegs1",
    "sofalegs2",
    "sofadrink",
    "sofaarm1",
    "sofaarm2",
    "sofasnog2",
    "sofalegs",
    "sofalegs2",
    "sofapee",
    "sofapee1",
    "decisions",
    "sofapee2",
    "sofatoilet",
    "sofatoilet1",
    "sofatoilet2",
    "sofatoilet3",
    "sofatoilet4",
    "nicelydesp1",
    "nicelydesp2",
    "nicelydesp3",
    "nicelydesp4",
    "nicelydesp5",
    "lootogether",
    "lootogether1",
    "ontoilet",
    "ontoilet1",
    "ontoilet2",
    "fifthplace"
  ],
  "saturday": [
    "start",
    "start1a",
    "start1b",
    "saturdaydate",
    "start2",
    "gothere",
    "flirt_m",
    "winelist",
    "buyburgundy",
    "eatmeal",
    "buytort",
    "eatmeal5",
    "eatmeal5a",
    "eatmeal5b",
    "eatmeal5c",
    "asklootalk",
    "asklootalk1",
    "asklootalk2",
    "gotheatre",
    "theatre1",
    "theatre2",
    "theatre3a",
    "theatre4",
    "leanclose",
    "theatre5",
    "theatre6",
    "theatre7",
    "holdhand1",
    "theatre8",
    "theatre9",
    "theatre10",
    "interval",
    "interval1",
    "gotoo1",
    "interval2",
    "interval3",
    "act2",
    "act2a",
    "act2b",
    "holdhand2",
    "act2c",
    "act2d",
    "act2e",
    "act2f",
    "act2fa",
    "act2g",
    "act2h",
    "leavetheatre",
    "leavetheatre1",
    "dianechoice",
    "stagedoor",
    "stagedoor1",
    "stagedoor2",
    "stagedoor3",
    "stagedoor4",
    "stagedoor5a",
    "choosepub",
    "pubdrink",
    "pubdrink1",
    "pubdrink2",
    "pubdrink3",
    "pubdrink4",
    "pubdrink4a",
    "pubdrink5",
    "pubdrink6",
    "riverside2",
    "riverside3",
    "riverside3aa",
    "riverside4",
    "sitonbench",
    "riverside5",
    "riverside6",
    "riverside7",
    "riverside8",
    "riverside9",
    "riverside10",
    "riverside11",
    "traintalka",
    "riverside12",
    "riverside13",
    "luckytrip4",
    "luckytrip4a",
    "luckytrip4b",
    "luckytrip4c"
  ],
  "tuesday": [
    "start",
    "start1a",
    "start1b",
    "tuesdaydate",
    "start2",
    "gothere",
    "winelist",
    "buyburgundy",
    "eatmeal",
    "buytort",
    "eatmeal5",
    "eatmeal5a",
    "eatmeal5b",
    "eatmeal5c",
    "asklootalk",
    "asklootalk1",
    "asklootalk2",
    "gotheatre",
    "theatre1",
    "theatre2",
    "theatre3c",
    "theatre4",
    "theatre5",
    "theatre6",
    "theatre7",
    "holdhand1",
    "theatre8",
    "theatre9",
    "theatre10",
    "interval",
    "interval1",
    "gotoo1",
    "interval2",
    "interval3",
    "act2",
    "act2a",
    "act2b",
    "leanclose2",
    "act2c",
    "act2d",
    "act2e",
    "act2f",
    "act2fa",
    "act2g",
    "act2h",
    "leavetheatre",
    "leavetheatre1",
    "stagedoor",
    "stagedoor1",
    "stagedoor2",
    "stagedoor3",
    "stagedoor4",
    "stagedoor5a",
    "choosepub",
    "pubdrink",
    "pubdrink1",
    "pubdrink2",
    "pubdrink3",
    "pubdrink4",
    "pubdrink4a",
    "pubdrink5",
    "pubdrink6",
    "pubdrink7",
    "pubdrink8",
    "pubdrink9",
    "riverside2",
    "riverside3",
    "riverside3aa",
    "riverside4",
    "sitonbench",
    "riverside5",
    "riverside6",
    "riverside7",
    "riverside8",
    "riverside9",
    "riverside10",
    "riverside11",
    "traintalka",
    "riverside12",
    "riverside13",
    "luckytrip4",
    "luckytrip4a",
    "luckytrip4b",
    "luckytrip4c"
  ]
};
function verifyMollyDigest(source) {
  const g = loadRuntime(source); g.context.go('start');
  const c = g.context;
  Object.assign(c, { mollyproc: 100, mollyblad: 100, pregameCaughtUp: true });
  c.digestMolly(30);
  assert.equal(c.mollyproc, 70, `${source.file}: Molly tank depletes by the transferred amount`);
  assert.equal(c.mollyblad, 130, `${source.file}: Molly bladder receives the transferred amount`);
  Object.assign(c, { mollyproc: 10, mollyblad: 500 });
  c.digestMolly(30);
  assert.equal(c.mollyproc, 0, `${source.file}: Molly tank cannot go negative`);
  assert.equal(c.mollyblad, 530, `${source.file}: walking fill is preserved when the tank is short`);
  return { reachable: 2, boundaries: 1 };
}

function verifyEnglishCloseout(source) {
  const fifth = replay(source, englishCloseoutRoutes.fifth.slice(0, -3));
  for (const tag of englishCloseoutRoutes.fifth.slice(-3)) {
    const before = snapshot(fifth); click(fifth, tag);
    assert.equal(fifth.context.squat, 1); assert.equal(fifth.context.inti, 175);
    checkRiversideBack(fifth, tag, before);
  }
  assert.equal(fifth.context.currentTag, 'fifthplace');
  expectRiversideLine(fifth, source, 'fifthplace', "<P><LI><B>You've seen her so desperate that she's had to take an emergency squat behind a camper van.");
  for (const day of ['saturday', 'tuesday']) {
    const route = englishCloseoutRoutes[day], g = replay(source, route.slice(0, -1));
    const before = snapshot(g); click(g, 'luckytrip4c');
    assert.equal(g.context[day], 2);
    expectRiversideLine(g, source, 'luckytrip4c', "<LI>She puts an arm round your waist. You turn towards her, put your arms round her and kiss her. She responds, nervously at first, but then warmly. You kiss again. You slip a hand down to her bottom, pulling her closer to you. She puts her hand on your bottom. Your hand slips further down, to her upper thigh, and moving it round to the side you think you discover the ridge of a suspender—but you can't be sure. She pulls away with a smile.", day === 'tuesday');
    expectRiversideLine(g, source, 'luckytrip4c', "<LI>She puts an arm round your waist. You turn towards her, put your arms round her and kiss her. She responds, nervously at first, but then warmly. You kiss again. You slip a hand down to her bottom, pulling her closer to you. She puts her hand on your bottom. Your hand slips further down, to her upper thigh. She pulls away with a smile.", day !== 'tuesday');
    checkRiversideBack(g, 'luckytrip4c', before);
  }
  const foyer = replay(source, highSpendPrefix.slice(0, highSpendPrefix.indexOf('foyerbar1')));
  const before = snapshot(foyer), balance = foyer.context.pounds;
  click(foyer, 'foyerbar1');
  assert.equal(foyer.context.pounds, balance, 'Diane funds this round; Simon is not charged');
  expectRiversideLine(foyer, source, 'foyerbar1', "<LI>Diane gives you the money for this round. You go to the bar and get a beer for yourself and a lager for her.");
  checkRiversideBack(foyer, 'foyerbar1', before);
  const secondRoute = leaves(foyer.gallery).find(x => x.tags.at(-1) === 'secondplace1');
  assert(secondRoute, 'A maintained second-prize route is required');
  const second = replay(source, ['start', ...secondRoute.tags]);
  assert(second.context.gopee || second.context.gobehindtoilet, 'Earlier emergency-pee history is required');
  expectRiversideLine(second, source, 'secondplace1', "<P><LI><B>You've seen her so desperate that she's had to go for an emergency pee.");
  return 5;
}

function main() {
  let count = 0, automaticCoffeePaths = 0, editions = 0, moneyPaths = 0, moneyBoundaries = 0, busPaths = 0, busBoundaries = 0;
  let coffeeNarrativePaths = 0, waterPaths = 0, waterBoundaries = 0, preorderPaths = 0, preorderBoundaries = 0;
  let riversidePaths = 0, riversideBoundaries = 0;
  let clothingPaths = 0, clothingBoundaries = 0, closeoutPaths = 0;
  for (const lang of LANGS) for (const bilingual of lang === 'en' ? [false] : [false, true]) {
    const source = readSource(lang, bilingual);
    closeoutPaths += verifyEnglishCloseout(source);
    const clothing = verifyClothingContinuity(source); clothingPaths += clothing.reachable; clothingBoundaries += clothing.boundaries;
    count += verifyCoffee(source); editions++;
    automaticCoffeePaths += verifyAutomaticCoffee(source);
    coffeeNarrativePaths += verifyCoffeeNarrative(source);
    const water = verifyTheatreWater(source); waterPaths += water.reachable; waterBoundaries += water.boundaries;
    const preorder = verifyTheatrePreorder(source); preorderPaths += preorder.reachable; preorderBoundaries += preorder.boundaries;
    const bus = verifyBusLuckshots(source); busPaths += bus.reachable; busBoundaries += bus.boundaries;
    const money = verifyMoney(source); moneyPaths += money.reachable; moneyBoundaries += money.boundaries;
    for (const verify of [verifyMollyDigest, verifyRiversideDrinks, verifyRiversideMusic, verifyRiversideStamps, verifyRiversideNeedCue, verifyRiversideRoundLabels]) {
      const result = verify(source); riversidePaths += result.reachable; riversideBoundaries += result.boundaries;
    }
    console.log(`OK ${source.file}: coffee charges/narration, theatre water/preorders, Back/replay, four high-spend routes, ${money.boundaries} synthetic spending boundaries`);
  }
  console.log(`PASS: ${closeoutPaths} actual-choice closeout paths for fifth-prize reachability, date-specific clothing, foyer payment and second-prize recap.`);
  console.log(`PASS: ${coffeeNarrativePaths} reachable coffee-narration paths; ${waterPaths} actual theatre-water paths and ${waterBoundaries} synthetic water boundaries; ${preorderPaths} actual preorder paths and ${preorderBoundaries} synthetic preorder boundaries.`);
  console.log(`PASS: ${riversidePaths} reachable riverside drink/music/stamp/urgency/round cases and ${riversideBoundaries} separately synthetic boundaries.`);
  console.log(`PASS: ${clothingPaths} ordinary Tuesday clothing routes and ${clothingBoundaries} separately synthetic day/intimacy/squat boundaries, with full state and Back/replay checks.`);
  console.log(`PASS: ${busPaths} reachable ordinary bus paths and ${busBoundaries} synthetic boarding boundaries.`);
  console.log(`PASS: ${count} ordinary and ${automaticCoffeePaths} automatic reachable coffee cases, ${moneyPaths} high-spend paths, ${moneyBoundaries} synthetic boundaries across ${editions} editions. No files written.`);
}
module.exports = { verifyCoffee, verifyAutomaticCoffee, verifyMoney, verifyBusLuckshots, verifyCoffeeNarrative, verifyTheatreWater, verifyTheatrePreorder, verifyRiversideDrinks, verifyRiversideMusic, verifyRiversideStamps, verifyRiversideNeedCue, verifyRiversideRoundLabels, verifyClothingContinuity, verifyEnglishCloseout };
if (require.main === module) main();
