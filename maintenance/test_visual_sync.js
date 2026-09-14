#!/usr/bin/env node
// Isolated integration checks: never writes to either real game checkout.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const realRoot = path.resolve(__dirname, '..');
const syncPath = path.join(realRoot, 'maintenance/sync_visual_edition.js');
const syncSource = fs.readFileSync(syncPath, 'utf8');
const { synchronize, SHARED_SCRIPTS, RECEIPT } = require(syncPath);
const managed = require(path.join(realRoot, 'maintenance/write_transcripts.js')).managedTranscriptFiles();
const sandbox = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'adwd-visual-sync-'));
let number = 0, passed = 0;

function write(root, relative, bytes) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes);
}

function tree(root) {
  const result = {};
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(dir, entry.name), relative = path.relative(root, file);
      if (entry.isDirectory()) walk(file);
      else {
        const stats = fs.statSync(file);
        result[relative] = [crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), stats.mtimeMs];
      }
    }
  }
  if (fs.existsSync(root)) walk(root);
  return result;
}

function fixture() {
  const base = path.join(sandbox, String(++number));
  const textRoot = path.join(base, 'ADWD'), visualRoot = path.join(base, 'ADWD-visual');
  write(textRoot, 'outputs/en/dianedate_en.html', 'canonical English story v1\n');
  write(textRoot, 'outputs/en/wiki_en.html', 'canonical English wiki\n');
  write(textRoot, 'outputs/cn/dianedate_cn.html', 'translation must remain only at source\n');
  for (const file of managed) write(textRoot, file, 'canonical transcript ' + file + '\n');
  write(textRoot, 'maintenance/gallery_data.json', JSON.stringify({ en: { endings: [], hiddenScenes: [] }, cn: { language: 'cn' } }));
  for (const name of SHARED_SCRIPTS) write(textRoot, 'maintenance/' + name, '// shared fixture ' + name + '\n');
  write(textRoot, 'maintenance/sync_visual_edition.js', syncSource);
  write(textRoot, 'maintenance/build_gallery_data.js', "if (!process.argv.includes('--check')) throw Error('Expected read-only validation');\n");
  write(textRoot, 'maintenance/write_transcripts.js',
    'module.exports.managedTranscriptFiles = () => ' + JSON.stringify(managed) + ';\n' +
    "if (require.main === module && !process.argv.includes('--check')) throw Error('Expected read-only validation');\n");
  write(visualRoot, 'visual/scene-map.js', '// presentation fixture\n');
  write(visualRoot, 'assets/diane/keep.bin', Buffer.from([0, 1, 2, 3, 255]));
  write(visualRoot, 'outputs/en/transcripts/unrelated-note.txt', 'user note\n');
  write(visualRoot, 'outputs/en/dianedate_visual_en.html', 'generated output controlled by visual builder\n');
  write(visualRoot, 'maintenance/build_visual_edition.js',
    "const { synchronize } = require('./sync_visual_edition.js');\n" +
    "synchronize({ check: process.argv.includes('--check') });\n");
  return { textRoot, visualRoot };
}

function verifyNoWriteFailure(f, mutate, matcher, options = {}) {
  mutate();
  const beforeSource = tree(f.textRoot), beforeTarget = tree(f.visualRoot);
  assert.throws(() => synchronize({ ...f, ...options }), matcher);
  assert.deepEqual(tree(f.textRoot), beforeSource, 'failure changed canonical files');
  assert.deepEqual(tree(f.visualRoot), beforeTarget, 'failure partially wrote visual files');
}

function test(label, fn) {
  fn();
  passed++;
  console.log('PASS ' + label);
}

try {
  test('one-way English sync preserves visual modules, assets, generated HTML, unrelated files, and source', () => {
    const f = fixture(), beforeSource = tree(f.textRoot), beforeTarget = tree(f.visualRoot);
    const result = synchronize(f);
    assert(result.changed.includes('outputs/en/dianedate_en.html'));
    assert.equal(fs.readFileSync(path.join(f.visualRoot, 'outputs/en/dianedate_en.html'), 'utf8'), 'canonical English story v1\n');
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(f.visualRoot, 'maintenance/gallery_data.json'), 'utf8')), { en: { endings: [], hiddenScenes: [] } });
    assert(!fs.existsSync(path.join(f.visualRoot, 'outputs/cn')));
    assert.deepEqual(tree(f.textRoot), beforeSource);
    const afterTarget = tree(f.visualRoot);
    for (const [file, fingerprint] of Object.entries(beforeTarget)) assert.deepEqual(afterTarget[file], fingerprint, file);
    assert.equal(Object.keys(JSON.parse(fs.readFileSync(path.join(f.visualRoot, RECEIPT), 'utf8')).files).length, managed.length + SHARED_SCRIPTS.length + 3);
  });

  test('--check is read-only when current and fails without writes when stale', () => {
    const f = fixture(); synchronize(f);
    const beforeTarget = tree(f.visualRoot);
    synchronize({ ...f, check: true });
    assert.deepEqual(tree(f.visualRoot), beforeTarget);
    verifyNoWriteFailure(f, () => write(f.textRoot, 'outputs/en/dianedate_en.html', 'canonical English story v2\n'), /out of sync/, { check: true });
    synchronize(f);
    assert.equal(fs.readFileSync(path.join(f.visualRoot, 'outputs/en/dianedate_en.html'), 'utf8'), 'canonical English story v2\n');
  });

  test('CLI builder calling synchronize export terminates and --check changes no files', () => {
    const f = fixture();
    const env = { ...process.env, ADWD_TEXT_ROOT: f.textRoot, ADWD_VISUAL_ROOT: f.visualRoot };
    const cli = path.join(f.textRoot, 'maintenance/sync_visual_edition.js');
    execFileSync(process.execPath, [cli], { env, timeout: 10000, stdio: 'pipe' });
    const beforeSource = tree(f.textRoot), beforeTarget = tree(f.visualRoot);
    execFileSync(process.execPath, [cli, '--check'], { env, timeout: 10000, stdio: 'pipe' });
    assert.deepEqual(tree(f.textRoot), beforeSource);
    assert.deepEqual(tree(f.visualRoot), beforeTarget);
    write(f.textRoot, 'outputs/en/wiki_en.html', 'updated canonical wiki\n');
    const staleSource = tree(f.textRoot), staleTarget = tree(f.visualRoot);
    assert.throws(() => execFileSync(process.execPath, [cli, '--check'], { env, timeout: 10000, stdio: 'pipe' }), /out of sync/);
    assert.deepEqual(tree(f.textRoot), staleSource);
    assert.deepEqual(tree(f.visualRoot), staleTarget);
  });

  test('an older visual sync tool imports a newly shared file on the first rebuild', () => {
    const f = fixture(); synchronize(f);
    const updatedTool = syncSource.replace('const SHARED_SCRIPTS = [', "const SHARED_SCRIPTS = [\n  'future_shared.js',");
    write(f.textRoot, 'maintenance/sync_visual_edition.js', updatedTool);
    write(f.textRoot, 'maintenance/future_shared.js', '// new canonical helper\n');
    const cli = path.join(f.visualRoot, 'maintenance/sync_visual_edition.js');
    execFileSync(process.execPath, [cli], {
      env: { ...process.env, ADWD_TEXT_ROOT: f.textRoot, ADWD_VISUAL_ROOT: f.visualRoot },
      timeout: 10000, stdio: 'pipe',
    });
    assert.equal(fs.readFileSync(path.join(f.visualRoot, 'maintenance/future_shared.js'), 'utf8'), '// new canonical helper\n');
    const receipt = JSON.parse(fs.readFileSync(path.join(f.visualRoot, RECEIPT), 'utf8'));
    assert(receipt.files['maintenance/future_shared.js']);
  });

  test('independent target edits prevent every pending write', () => {
    const f = fixture(); synchronize(f);
    verifyNoWriteFailure(f, () => {
      write(f.visualRoot, 'outputs/en/dianedate_en.html', 'independent visual story edit\n');
      write(f.textRoot, 'outputs/en/wiki_en.html', 'safe upstream wiki update\n');
    }, /edited independently/);
  });

  test('retired receipt entries fail before deletion or any pending write', () => {
    const f = fixture(); synchronize(f);
    verifyNoWriteFailure(f, () => {
      const receipt = JSON.parse(fs.readFileSync(path.join(f.visualRoot, RECEIPT), 'utf8'));
      receipt.files['outputs/en/retired.txt'] = 'former-hash';
      write(f.visualRoot, RECEIPT, JSON.stringify(receipt));
      write(f.visualRoot, 'outputs/en/retired.txt', 'preserve this\n');
      write(f.textRoot, 'outputs/en/wiki_en.html', 'upstream wiki update\n');
    }, /explicit reconciliation/);
  });

  test('missing canonical source fails before writes', () => {
    const f = fixture();
    verifyNoWriteFailure(f, () => fs.unlinkSync(path.join(f.textRoot, 'outputs/en/dianedate_en.html')), /Cannot find canonical/);
  });

  test('missing managed transcript fails before writes', () => {
    const f = fixture();
    verifyNoWriteFailure(f, () => fs.unlinkSync(path.join(f.textRoot, managed[managed.length - 1])), /ENOENT/);
  });

  test('malformed Gallery input fails before writes', () => {
    const f = fixture();
    verifyNoWriteFailure(f, () => write(f.textRoot, 'maintenance/gallery_data.json', '{bad json'), SyntaxError);
  });

  test('absent English Gallery fails before writes', () => {
    const f = fixture();
    verifyNoWriteFailure(f, () => write(f.textRoot, 'maintenance/gallery_data.json', '{"cn":{}}'), /English Gallery is missing/);
  });

  test('failed canonical validation prevents all target writes', () => {
    const f = fixture();
    verifyNoWriteFailure(f, () => write(f.textRoot, 'maintenance/build_gallery_data.js', 'process.exit(4);\n'), /Command failed/);
  });

  test('same root and missing visual checkout are rejected before writes', () => {
    const f = fixture(), before = tree(f.textRoot);
    assert.throws(() => synchronize({ textRoot: f.textRoot, visualRoot: f.textRoot }), /must be separate/);
    assert.deepEqual(tree(f.textRoot), before);
    verifyNoWriteFailure(f, () => fs.unlinkSync(path.join(f.visualRoot, 'visual/scene-map.js')), /Cannot find the visual checkout/);
  });

  test('symlink aliases and nested roots are rejected', () => {
    const f = fixture();
    write(f.textRoot, 'visual/scene-map.js', '// alias detection fixture\n');
    const alias = path.join(sandbox, 'source-alias');
    fs.symlinkSync(f.textRoot, alias, 'dir');
    assert.throws(() => synchronize({ textRoot: f.textRoot, visualRoot: alias }), /non-overlapping/);
    const nested = path.join(f.textRoot, 'nested-visual');
    write(nested, 'visual/scene-map.js', '// nested fixture\n');
    assert.throws(() => synchronize({ textRoot: f.textRoot, visualRoot: nested }), /non-overlapping/);
  });

  console.log(`PASS: ${passed} isolated synchronization cases; real repositories unchanged by this test.`);
} finally {
  fs.rmSync(sandbox, { recursive: true, force: true });
}
