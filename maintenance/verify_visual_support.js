#!/usr/bin/env node
// Validate every shipped sprite and frame bank, including reduced-motion fallbacks.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const ROOT = path.resolve(__dirname, "..");
const assets = path.join(ROOT, "assets");
const meta = JSON.parse(fs.readFileSync(path.join(assets, "fx/puddle_meta.json"), "utf8"));
const expected = new Set(["README.md", "fx/puddle_meta.json"]);
const casts = new Set(Object.keys(meta.clips).map((key) => key.split("/")[0]));
const clips = new Set(Object.keys(meta.clips));
for (const cast of casts) {
  for (const stem of [
    "01_calm",
    "02_need_pee",
    "03_desperate_pee",
    "04_critical_pee",
    "05_wet_idle",
  ])
    clips.add(cast + "/" + stem);
}
for (const clip of clips) for (const suffix of [".gif", ".still.png"]) expected.add(clip + suffix);
let frames = 0;
for (const [clip, info] of Object.entries(meta.clips)) {
  assert(["pee", "wet"].includes(info.kind), "Unknown clip kind: " + clip);
  assert(Number.isInteger(info.srcFrames) && info.srcFrames > 0, "Invalid frame count: " + clip);
  const bank = "fx/grow_frames/" + clip.replace("/", "_") + "_grow";
  const entries = fs
    .readdirSync(path.join(assets, bank))
    .filter((name) => name !== ".DS_Store")
    .sort();
  assert(entries.length > 0, "Empty bank: " + bank);
  assert.deepEqual(
    entries,
    entries.map((_, i) => String(i).padStart(2, "0") + ".png"),
    "Noncontiguous bank: " + bank,
  );
  for (const entry of entries) expected.add(bank + "/" + entry);
  frames += entries.length;
}
function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.name !== ".DS_Store")
    .flatMap((entry) => {
      const file = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(file) : [path.relative(assets, file)];
    });
}
assert.deepEqual(walk(assets).sort(), [...expected].sort(), "Missing or unreferenced visual asset");
for (const file of expected) {
  if (!/\.(?:gif|png)$/.test(file)) continue;
  const bytes = fs.readFileSync(path.join(assets, file));
  if (file.endsWith(".gif")) {
    assert.match(bytes.toString("ascii", 0, 6), /^GIF8[79]a$/);
    assert.equal(bytes.readUInt16LE(6), 398, file);
    assert.equal(bytes.readUInt16LE(8), 398, file);
  } else {
    assert.equal(bytes.toString("hex", 0, 8), "89504e470d0a1a0a", file);
    assert.equal(bytes.readUInt32BE(16), 398, file);
    assert.equal(bytes.readUInt32BE(20), 398, file);
  }
}
console.log(
  `Verified ${clips.size} GIF/still pairs and ${frames} frames in ${Object.keys(meta.clips).length} banks; no missing or orphan assets.`,
);
