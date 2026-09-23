#!/usr/bin/env node
// Independent preservation witnesses and focused tests for the source migration.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const { readSource, LANGS } = require("./text_sources");
const { makeGame, render } = require("./verify_text_consistency");
const ROOT = path.resolve(__dirname, "..");
const json = (file) => JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");
const locations = json("source/locations.json");
const baseline = json("maintenance/fixtures/text-baseline.json");
const reviewedChanges = json("maintenance/refactor_text_changes.json").changes;
const groups = json("source/status-groups.json");
const aligned = json("maintenance/aligned_text.json");
const key = (r) => `${r.kind}/${r.source.node}/${r.source.slot}`;
const expectedLocations = new Map(locations.map((r) => [key(r), r]));
const alignedLocations = new Map(aligned.entries.map((r) => [key(r), r]));
const allowedGlobals = new Set([
  "window",
  "document",
  "location",
  "sessionStorage",
  "setTimeout",
  "clearTimeout",
  "setInterval",
  "clearInterval",
]);
const jsonCatalogEn = json("source/text/en.json");
let witnessed = 0,
  paired = 0;
for (const lang of LANGS) {
  const catalog = json(`source/text/${lang}.json`);
  const source = readSource(lang);
  const baselineRows = Object.entries(catalog)
    .filter(([id]) => id.startsWith("x"))
    .sort(([a], [b]) => a.localeCompare(b, "en"));
  assert.equal(baselineRows.length, baseline.catalogs[lang].entries, "Reviewed inventory size");
  // Reconstruct the checkpoint from explicitly recorded editorial exceptions.
  // All other text still has to match the original immutable preservation hash.
  for (const change of reviewedChanges.filter((c) => c.lang === lang)) {
    const row = baselineRows.find(([id]) => id === change.id);
    assert(row, "Missing recorded editorial location");
    assert.equal(row[1], change.after, "Unrecorded revision of " + lang + "/" + change.id);
    row[1] = change.before;
  }

  assert.equal(
    hash(JSON.stringify(baselineRows)),
    baseline.catalogs[lang].sha256,
    "Reviewed rendering changed in " + lang,
  );

  assert.equal(
    source.calls.length + source.variants.length,
    locations.length,
    "Complete source inventory",
  );
  for (const row of [...source.calls, ...source.variants]) {
    const location = expectedLocations.get(key(row));
    assert(location, "Unexpected location " + key(row));
    assert.equal(row.tag, location.tag, "Choice target changed at " + location.id);
    const reference = alignedLocations.get(key(row));
    assert.equal(reference.id, location.id, "Stable ID moved at " + key(row));
    if (!row.static) continue;
    assert.equal(
      row.text,
      catalog[location.id],
      "Compiled text differs from catalog: " + location.id,
    );
    witnessed++;
  }
  assert.deepEqual(
    Object.keys(catalog)
      .filter((k) => k.startsWith("x"))
      .sort(),
    locations
      .filter((r) => !r.dynamic)
      .map((r) => r.id)
      .sort(),
    "No missing or orphan catalog rows",
  );
  for (const bilingual of lang === "en" ? [false] : [false, true]) {
    const src = bilingual ? readSource(lang, true) : source;
    assert(
      !/function (?:polishChoiceText|polishStoryHtml|normaliseLegacyHtml|balanceLegacyHtml|translateAlt)\b|\beval\(/.test(
        src.script,
      ),
      "Legacy repair/dispatch layer returned",
    );
    const ast = parse(src.script);
    traverse(ast, {
      ReferencedIdentifier(p) {
        assert(
          p.scope.hasBinding(p.node.name) || allowedGlobals.has(p.node.name),
          "Undeclared reference: " + p.node.name,
        );
      },
      AssignmentExpression(p) {
        if (p.node.left.type === "Identifier")
          assert(
            p.scope.hasBinding(p.node.left.name),
            "Implicit global assignment: " + p.node.left.name,
          );
      },
    });
    const g = makeGame(src);
    const enGame = makeGame(readSource("en"));
    const monoGame = makeGame(source);
    // Every threshold band and mismatched pair must preserve each character's
    // actual condition. Equal-looking translations must not change identities.
    for (const [pair, first, second] of [
      ["pair_bench_desp", "sitting_desp", "molly_desp"],
      ["pair_walk_desp", "standing_desp", "mollyst_desp"],
    ]) {
      for (const blad of [
        0, 410, 440, 460, 485, 510, 535, 560, 585, 610, 635, 660, 685, 710, 735, 760, 785, 810, 900,
      ]) {
        for (const mollyblad of [0, blad, Math.max(0, blad - 50), 900]) {
          const state = { blad, mollyblad, despLineIndex: 0 };
          const actual = render(g, pair, state);
          const d = render(monoGame, first, state),
            m = render(monoGame, second, {
              ...state,
              despLineIndex: monoGame.context.despLineIndex,
            });
          const enD = render(enGame, first, state),
            enM = render(enGame, second, {
              ...state,
              despLineIndex: enGame.context.despLineIndex,
            });
          const idFor = (html) => locations.find((r) => r.id && jsonCatalogEn[r.id] === html)?.id;
          const dKey = groups[idFor(enD)],
            mKey = groups[idFor(enM)];
          let expected = d + m,
            expectedEn = enD + enM;
          // captureDesp uses the final emitted status line. Current status
          // functions emit at most one nonempty paragraph per invocation.
          if (dKey !== undefined && dKey === mKey) {
            expected = render(monoGame, "emitDuoDesp", state, [dKey]);
            expectedEn = render(enGame, "emitDuoDesp", state, [dKey]);
          }
          assert.equal(
            bilingual ? actual.alt : actual,
            expected,
            `${lang}/${bilingual}/${pair}/${blad}/${mollyblad}`,
          );
          if (bilingual) assert.equal(actual.en, expectedEn, "Bilingual combined English status");
          assert.equal(g.context.blad, blad);
          assert.equal(g.context.mollyblad, mollyblad);
          paired++;
        }
      }
    }
    // Dispatch rejects invalid targets before touching history or body state.
    const nav = require("./audit_state_space").loadRuntime(src);
    nav.context.go("start");
    const state = JSON.stringify(nav.context.snapshotGame());
    assert.throws(() => nav.context.go("constructor"), /Unknown scene/);
    assert.equal(JSON.stringify(nav.context.snapshotGame()), state);
  }
}
console.log(
  `PASS: ${witnessed} static/variant locations (${reviewedChanges.length} recorded editorial refinements; all others preserve the checkpoint); ${paired} paired-status cases; stable IDs, explicit globals, safe scene dispatch.`,
);
