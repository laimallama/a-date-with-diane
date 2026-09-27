#!/usr/bin/env node
// The recorded counterexamples use only offered choices. Boundary cases below
// intentionally isolate functions; they are not claimed as reachable histories.
const assert = require("node:assert/strict");
const { readSource } = require("./text_sources");
const { makeGame, render } = require("./verify_text_consistency");
const { loadRuntime, choices } = require("./audit_state_space");
const en = require("../source/text/en.json");
const source = readSource("en");
const routes = require("./fixtures/restoration-routes.json");
const text = (s) =>
  s
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const replays = new Map();
function run(tags) {
  const g = loadRuntime(source);
  g.context.go("start");
  for (const tag of tags) {
    assert(
      choices(g.box).some((o) => o.tag === tag),
      "Unoffered choice: " + g.context.currentTag + " → " + tag,
    );
    g.context.go(tag);
  }
  return g;
}
for (const r of routes) {
  const g = run(r.route);
  replays.set(r.label, g);
  const before = JSON.stringify(g.context.snapshotGame().state);
  const output = g.box.innerHTML;
  g.context.goback();
  g.context.go(r.route.at(-1));
  assert.equal(
    JSON.stringify(g.context.snapshotGame().state),
    before,
    "Recorded route Back: " + r.label,
  );
  assert.equal(g.box.innerHTML, output, "Recorded route replay: " + r.label);
}
const cases = [
  ["taxi_unpromised_picnic", "x06007"],
  ["double_top_button", "x06009"],
  ["first_sofa_repeat", "x02516"],
  ["sofatheatre_shortcut_history", "x02712"],
  ["saturday_work_morning", "x06010"],
  ["saturday_garment_sofatoilet4", "x06013"],
  ["saturday_garment_secondplace", "x06014"],
  ["saturday_garment_bottom1", "x06011"],
  ["saturday_garment_bottom1a", "x06012"],
  ["saturday_garment_stampalbum4", "x06015"],
  ["carpark_chardonnay", "x04136"],
  ["brother_occupancy", "x02150"],
  ["brother_reintroduction", "x02320"],
];
for (const [label, id] of cases)
  assert(text(replays.get(label).box.innerHTML).includes(text(en[id])), label + "/" + id);
for (const label of ["work_no_lager", "carpark_lager_pub_only"])
  assert(!/lager/i.test(text(replays.get(label).box.innerHTML)), label);
for (const label of ["bathroom_no_cider", "sofatalk_no_cider"])
  assert(!/cider/i.test(text(replays.get(label).box.innerHTML)), label);
assert(!/top button/.test(text(replays.get("double_top_button").box.innerHTML)));
assert(!/once more|again/.test(text(replays.get("first_sofa_repeat").box.innerHTML)));
assert(!/not home yet/i.test(text(replays.get("brother_occupancy").box.innerHTML)));

const g = makeGame(source),
  c = g.context;
const initial = JSON.parse(JSON.stringify(c.snapshotGame().state));
function isolate(node, state = {}) {
  Object.assign(c, initial);
  return render(g, node, state);
}
function has(html, id) {
  return text(html).includes(text(en[id]));
}
function offered() {
  return choices(g.box).map((o) => o.tag);
}
for (const blad of [920, 921]) {
  isolate("walkhome1", { blad });
  assert.equal(offered().includes("walkhome1a"), blad === 920);
  assert.equal(offered().includes("walkhome1b"), blad === 921);
}
for (const [node, state, funded, empty] of [
  ["watching1", {}, "x06000", "x03800"],
  ["bushome6", { blad: 700, inti: 0 }, "x06001", "x04464"],
  ["riverside13", {}, "x01318", "x06002"],
  ["riversidepath", { blad: 680, thursday: 2 }, "x01856", "x06003"],
  ["pavilion", { blad: 700 }, "x01733", "x06004"],
  ["pavilion", { blad: 600 }, "x01737", "x06005"],
  ["scenario6c", {}, "x02229", "x06006"],
])
  for (const luckshots of [0, 1]) {
    const html = isolate(node, { ...state, luckshots });
    assert(has(html, luckshots ? funded : empty), "Resource label: " + node + "/" + luckshots);
    assert(
      !offered().some((tag) => tag.startsWith("luckytrip")) || luckshots > 0,
      "No unfunded offer",
    );
  }
for (const day of ["tuesday", "thursday", "saturday"]) {
  isolate("riverside16", { [day]: 2, leavepub1: 1, proc: 200, mollyproc: 200, pounds: 50 });
  const serving = day === "thursday" ? 30 : 100;
  assert.equal(c.proc, 200 + serving);
  assert.equal(c.mollyproc, 200 + serving);
  assert.equal(c.pounds, 40);
}
for (const node of ["pubdrink8", "pavilion8"]) {
  isolate(node, { thursday: 2, proc: 200, mollyproc: 200, mollyblad: 300 });
  assert.equal(c.proc, 230);
  assert.equal(
    c.mollyproc + c.mollyblad,
    530,
    "Molly's total intake includes the nightcap: " + node,
  );
}
for (const picnicPlanned of [0, 1]) {
  assert(
    has(
      isolate("taxihome6", { blad: 750, traintalking: 1, picnicPlanned }),
      picnicPlanned ? "x02000" : "x06007",
    ),
  );
  assert(has(isolate("sofatrains4", { picnicPlanned }), picnicPlanned ? "x06008" : "x03064"));
}
isolate("traintalka");
assert.equal(c.picnicPlanned, 1);
isolate("eatmeal3d", { saturday: 2 });
assert.equal(c.sofaDressOpened, 1);
assert(has(isolate("breasts2", { saturday: 2, sofaDressOpened: 1, inti: 200 }), "x06009"));
assert.equal(c.sofaDressOpened, 2);
for (const sofaSatTouched of [0, 1]) {
  const html = isolate("sofasat1", { saturday: 2, blad: 300, sofaloop: 1, sofaSatTouched });
  assert(has(html, sofaSatTouched ? "x05244" : "x02516"));
  assert.equal(c.sofaSatTouched, 1);
}
// A fresh game load initializes history; Back tracks it in ordinary snapshots.
for (const key of ["picnicPlanned", "sofaSatTouched", "sofaDressOpened"])
  assert(c.gameStateVars.includes(key));
const fresh = makeGame(source).context;
assert.equal(fresh.picnicPlanned, 0);
assert.equal(fresh.sofaSatTouched, 0);
assert.equal(fresh.sofaDressOpened, 0);

for (const [blad, mollyblad, thursday, wanted] of [
  [650, 610, 2, "riversidepath10a"],
  [650, 611, 2, "luckytrip3a"],
  [651, 611, 2, "luckytrip3"],
  [650, 611, 0, "riversidepath10a"],
]) {
  isolate("riversidepath", { blad, mollyblad, mollyproc: 100, thursday, luckshots: 1 });
  assert(offered().includes(wanted), "Bridge priority/threshold");
  assert.equal(c.mollyblad, mollyblad + 30, "Approach digestion occurs once");
}
isolate("riversidepath", { blad: 400, mollyblad: 660, thursday: 2, luckshots: 0 });
assert.deepEqual(offered(), ["riversidepath11"]);
isolate("luckytrip3a", { luckshots: 1 });
assert.equal(c.luckshots, 0);
isolate("luckytrip3a", { luckshots: 0 });
assert.deepEqual(offered(), ["gameover"]);
for (const [blad, mollyblad, id] of [
  [800, 660, "x06038"],
  [300, 701, "x06037"],
]) {
  const html = isolate("underbridgea", { blad, mollyblad, mollyproc: 0 });
  assert(has(html, id), "Molly's urgency uses her own state");
  assert.equal(c.mollyblad, 0);
  assert.equal(c.blad, blad);
}
const savedAfterpee = c.afterpee;
let resets = 0;
c.afterpee = function () {
  resets++;
  savedAfterpee();
};
isolate("underbridge2a", { blad: 600, thursday: 2, rioja: 2, points: 20 });
assert.equal(resets, 1);
assert.equal(c.blad, 45);
assert.equal(c.points, 23);
resets = 0;
isolate("riversidepath11", { blad: 600, mollyblad: 660, thursday: 2, rioja: 2 });
assert.equal(resets, 1);
assert.equal(c.blad, 45);
assert.equal(c.mollyblad, 0);
c.afterpee = savedAfterpee;
for (const name of ["scenario7a", "luckytrip13", "luckytrip206", "luckytrip206a"])
  assert.equal(typeof c[name], "undefined");
isolate("sofatrains6", { blad: 500, rioja: 2, luckshots: 1 });
assert.deepEqual(offered(), ["sofatrains7"]);
console.log(
  `PASS: ${routes.length} original counterexample routes with Back/replay; continuity, drink totals, history/reset, resource, bridge priority/order/threshold/reset and retired-branch regressions.`,
);
