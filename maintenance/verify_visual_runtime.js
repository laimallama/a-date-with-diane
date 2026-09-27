#!/usr/bin/env node
// Run actual visual modules against legal Gallery histories and controlled clocks.
// DOM/image stubs verify selected assets and state, not browser playback or pixels.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { create, leaves, choices } = require("./visual_runtime_harness");
const { EDITIONS } = require("./build_visual_edition");
const ROOT = path.resolve(__dirname, "..");
const result = {
  routeEditions: 0,
  pages: 0,
  eventPages: 0,
  backRestores: 0,
  conditionalCases: 0,
  raceCases: 0,
  reducedMotionCases: 0,
  languageSwitches: 0,
  skipCases: 0,
  galleryStartupCases: 0,
};
const fileFor = (id) =>
  ({ peeA: "07_pee_a", peeB: "08_pee_b", wetting: "06_wetting", wetIdle: "05_wet_idle" })[id];
function assertView(h) {
  const v = h.view(),
    scene = h.c.ADWDSceneMap.resolve(v.tag);
  assert.equal(v.location, scene.location.id, v.tag + ": location");
  assert.deepEqual(
    v.sprites.map((x) => x.cast),
    [scene.cast.primary, scene.cast.secondary].filter(Boolean),
    v.tag + ": cast order",
  );
  const beat = scene.pee;
  for (const sprite of v.sprites) {
    const asset = path.resolve(ROOT, "outputs/en", sprite.src.split("?")[0]);
    assert(fs.existsSync(asset), v.tag + ": existing asset " + asset);
    if (beat?.keys.includes(sprite.cast)) {
      const id = beat.clips?.[beat.keys.indexOf(sprite.cast)] || beat.clip;
      const expected = v.status === "wet" ? "05_wet_idle" : fileFor(id);
      assert(sprite.src.includes(expected), v.tag + ": expected " + sprite.cast + "/" + expected);
      assert.equal(sprite.tremor, false, v.tag + ": action sprite must not shake");
    } else {
      assert(!/0[678]_/.test(sprite.src), v.tag + ": uninvolved actor must not play an action");
    }
  }
  if (beat && beat.clip !== "wetIdle") {
    const actual = v.puddles.filter((x) => !x.spacer).map((x) => x.cast);
    assert.deepEqual(actual, Array.from(beat.keys), v.tag + ": effects track the acting character");
    if (scene.cast.secondary)
      assert.deepEqual(
        v.puddles.map((x) => x.cast),
        v.sprites.map((x) => x.cast),
        v.tag + ": effect slots match sprite positions",
      );
  } else assert.equal(v.puddles.length, 0, v.tag + ": no invented floor effects");
  assert.equal(h.messages.length, 0, h.messages.join("\n"));
}
function setCase(h, flags) {
  Object.assign(
    h.c,
    {
      tuesday: 0,
      thursday: 0,
      saturday: 0,
      tiramisu: 0,
      merlot: 0,
      chardonnay: 0,
      pinot: 0,
      mediumsteak: 0,
      inti: 100,
      blad: 400,
      proc: 0,
    },
    flags,
  );
}
async function main() {
  // Independent expectations, reviewed against the corresponding story branches.
  const h = create();
  const cases = [
    ...[
      "together2",
      "together1a",
      "helpdiane1aa",
      "helphersquat1",
      "goleft2",
      "search1a",
      "passage2b",
      "urinal",
      "ontoilet",
      "ontoilet1",
      "gobathroom",
      "gobathroom1",
      "sofatalkb",
      "sofatalkc",
      "disaster1",
      "disaster2",
      "bathpee1",
      "nicelydesp8",
      "passage2aa",
      "legsz1",
    ].map((tag) => [tag, {}, ["diane"]]),
    ["luckytrip4a", {}, ["molly"]],
    ["luckytrip31b", {}, ["amanda"]],
    ["carpark1", {}, ["debbie"]],
    ["carparkalone", {}, ["debbie"]],
    ["peepround", {}, ["diane", "debbie"]],
    ["peepunder", {}, ["diane", "debbie"]],
    ["underbridge", {}, ["diane"]],
    ["underbridge2", {}, ["molly"]],
    ["underbridgea", {}, ["molly"]],
    ["underbridge2a", {}, ["diane"]],
    ["carparka1", { pinot: 1 }, ["debbie"]],
    ["carparka1", { chardonnay: 1 }, ["debbie"]],
    ["carparka1", { merlot: 1 }, []],
    ["carparka1", {}, []],
    ["hiddencamera", {}, ["diane"]],
    ["story5", {}, []],
    ["luckytrip29a", {}, []],
    ["toiletclosed2a", {}, []],
    ["toiletclosed2b", {}, []],
    ["watching5", { tiramisu: 1 }, ["chloe"]],
    ["watching5", {}, ["chloe"]],
    ["lootogether1", { inti: 109 }, ["diane"]],
    ["lootogether1", { inti: 110 }, []],
    ...["tuesday", "thursday", "saturday"].flatMap((day) => [
      ["justclosed3", { [day]: 1 }, []],
      ["luckytrip5a", { [day]: 1 }, day === "tuesday" ? ["diane"] : []],
    ]),
  ];
  for (const [tag, flags, actors] of cases) {
    setCase(h, flags);
    assert.deepEqual(
      Array.from(h.c.ADWDSceneMap.resolve(tag).pee?.keys || []),
      actors,
      tag + ": semantic expectation",
    );
    result.conditionalCases++;
  }
  for (const [tag, flags, actors] of [
    ["scenario8", {}, ["diane"]],
    ["scenario5", { tuesday: 1 }, ["diane", "chloe"]],
    ["scenario5", { saturday: 1 }, ["diane"]],
    ["scenario6", { mediumsteak: 1 }, ["diane"]],
    ["scenario6", {}, ["diane", "amanda"]],
    ["foyerbar1", {}, ["diane"]],
    ["stagedoor2", {}, ["diane"]],
    ["stagedoor3", {}, ["diane", "molly"]],
    ["carparka0", {}, ["diane"]],
    ["queue1b", {}, ["diane"]],
  ]) {
    setCase(h, flags);
    const cast = h.c.ADWDSceneMap.castFor(tag);
    assert.deepEqual([cast.primary, cast.secondary].filter(Boolean), actors, tag + ": attendance");
    result.conditionalCases++;
  }
  // Post-render thresholds: the church event resets its state on the same page.
  for (const day of ["tuesday", "thursday", "saturday"])
    for (const volume of [0, 715, 716, 900]) {
      setCase(h, { [day]: 1, blad: volume, pregameCaughtUp: true, currentTag: "luckytrip17a" });
      h.c.go("luckytrip17b");
      await h.flush();
      assert.equal(
        !!h.c.ADWDSceneMap.resolve("luckytrip17b").pee,
        day === "thursday" && volume > 715,
      );
      assertView(h);
      result.conditionalCases++;
    }
  for (const edition of process.argv.includes("--focused") ? [] : EDITIONS) {
    const seed = create({ lang: edition.locale, bilingual: edition.bilingual });
    for (const leaf of leaves(seed.gallery)) {
      const g = create({ lang: edition.locale, bilingual: edition.bilingual });
      for (const [i, tag] of leaf.tags.entries()) {
        if (i)
          assert(
            choices(g.box).some((x) => x.tag === tag),
            leaf.id + ": offered choice " + tag,
          );
        g.c.go(tag);
        await g.flush();
        assertView(g);
        result.pages++;
        const scene = g.c.ADWDSceneMap.resolve(tag);
        if (scene.pee) {
          result.eventPages++;
          const meter = g.view().meter;
          const gameState = JSON.stringify(g.c.snapshotGame().state);
          await g.advance(10000);
          assertView(g);
          assert.equal(
            JSON.stringify(g.c.snapshotGame().state),
            gameState,
            tag + ": animation does not mutate game state",
          );
          if (scene.pee.outcome === "calm")
            assert.equal(g.view().rec, true, tag + ": REC for every actor");
          if (!scene.pee.keys.includes("diane"))
            assert.equal(g.view().meter, meter, tag + ": other actor must not drain Diane");
        }
        if (edition.bilingual && scene.pee) {
          const before = g.view();
          g.c.setLanguage("en");
          g.c.setLanguage("alt");
          const after = g.view();
          assert.deepEqual(
            after.sprites,
            before.sprites,
            tag + ": language switch preserves sprites",
          );
          assert.deepEqual(
            after.puddles,
            before.puddles,
            tag + ": language switch preserves effects",
          );
          assert.equal(after.rec, before.rec);
          assert.equal(after.timers, before.timers);
          result.languageSwitches++;
        }
        if (i && (scene.pee || g.c.ADWDSceneMap.wetCastFor(tag))) {
          const snapshot = g.c.snapshotGame();
          g.c.goback();
          await g.flush();
          assertView(g);
          g.c.go(tag);
          await g.flush();
          assertView(g);
          assert.equal(g.c.snapshotGame().html, snapshot.html, tag + ": Back/replay text");
          result.backRestores++;
        }
      }
      result.routeEditions++;
    }
    process.stdout.write("Visual routes passed: " + edition.output + "\n");
  }
  // The completion of a cold image load must belong to the current event.
  for (const tags of [
    ["disaster1", "disaster2"],
    ["gobathroom", "gobathroom1"],
    ["underbridgea", "underbridge2a"],
    ["underbridgea", "underbridge3"],
    ["watching5", "watching6"],
    ["legsz1", "taxihome1"],
  ]) {
    const g = create();
    setCase(g, { tuesday: 1, tiramisu: 1, blad: 900, proc: 10 });
    for (const tag of tags) g.c.go(tag);
    await g.flush();
    await g.advance(10000);
    assertView(g);
    if (tags[1] === "disaster2")
      assert.equal(g.view().status, "wet", "Fast continuation must settle");
    result.raceCases++;
  }
  for (const tag of ["underbridgea", "underbridge2a", "watching5", "legsz1", "peepround"]) {
    const g = create({ reduced: true });
    setCase(g, { tuesday: 1, tiramisu: 1, blad: 900 });
    g.c.go(tag);
    await g.flush();
    await g.advance(10000);
    assertView(g);
    assert(
      g.view().sprites.every((x) => x.src.includes(".still.png")),
      tag + ": reduced motion",
    );
    assert.equal(g.view().timers, 0, tag + ": no animation clocks in reduced motion");
    result.reducedMotionCases++;
  }
  // Gallery startup runs the exact saved route payload. Hidden leaves open at
  // their cut; ending routes additionally offer Skip once.
  for (const id of [
    "03_first_prize",
    "04a_thursday_bridge_molly_diane",
    "04_thursday_bridge_diane_molly",
  ]) {
    for (const bootFirst of [true, false]) {
      const g = create({ boot: bootFirst }),
        leaf = leaves(g.gallery).find((x) => x.id === id);
      g.c.sessionStorage.setItem("dianeGuide", JSON.stringify(leaf));
      g.c.initGuideFromStorage();
      if (!bootFirst) g.c.VisualShell.boot();
      await g.flush();
      assertView(g);
      assert.equal(g.c.currentTag, leaf.tags[leaf.baseLength - 1]);
      result.galleryStartupCases++;
      if (leaf.kind === "endings") {
        assert.equal(g.c.canSkipToClimax(), true);
        g.c.skipToClimax();
        await g.flush();
        await g.advance(10000);
        assertView(g);
        assert.equal(g.c.currentTag, leaf.tags[leaf.climaxIndex - 1]);
        assert.equal(g.c.canSkipToClimax(), false);
        result.skipCases++;
      } else assert.equal(g.c.canSkipToClimax(), false);
    }
  }
  const output = process.argv.find((x) => x.startsWith("--output="))?.slice(9);
  if (output)
    fs.writeFileSync(
      output,
      JSON.stringify({ ...result, browserRendering: false }, null, 2) + "\n",
    );
  console.log("PASS: " + JSON.stringify(result));
}
main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
