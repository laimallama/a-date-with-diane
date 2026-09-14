#!/usr/bin/env node
// ADWD owns shared English content. ADWD-visual owns its presentation and assets.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const SHARED_SCRIPTS = [
  'verify_ending_routes.js', 'write_hidden_scenes.js', 'check_endings.js',
  'replay_route.js', 'build_gallery_data.js', 'write_transcripts.js',
  'verify_project.js', 'sync_visual_edition.js', 'test_visual_sync.js',
];
const RECEIPT = 'maintenance/shared_content_state.json';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

function projectPaths(root = path.resolve(__dirname, '..')) {
  const isVisual = fs.existsSync(path.join(root, 'visual/scene-map.js'));
  return {
    textRoot: path.resolve(process.env.ADWD_TEXT_ROOT || (isVisual ? path.join(root, '..', 'ADWD') : root)),
    visualRoot: path.resolve(process.env.ADWD_VISUAL_ROOT || (isVisual ? root : path.join(root, '..', 'ADWD-visual'))),
  };
}

function expectedFiles(textRoot) {
  const writer = require(path.join(textRoot, 'maintenance/write_transcripts.js'));
  const relativePaths = [
    'outputs/en/dianedate_en.html', 'outputs/en/wiki_en.html',
    ...SHARED_SCRIPTS.map(name => 'maintenance/' + name),
    ...writer.managedTranscriptFiles().filter(file => file.startsWith('outputs/en/')),
  ];
  const files = new Map(relativePaths.map(file => [file, fs.readFileSync(path.join(textRoot, file))]));
  const gallery = JSON.parse(fs.readFileSync(path.join(textRoot, 'maintenance/gallery_data.json'), 'utf8'));
  if (!gallery.en) throw Error('Canonical English Gallery is missing');
  files.set('maintenance/gallery_data.json', Buffer.from(JSON.stringify({ en: gallery.en }, null, 2)));
  return files;
}

function synchronize(options = {}) {
  const defaults = projectPaths();
  let textRoot = path.resolve(options.textRoot || defaults.textRoot);
  let visualRoot = path.resolve(options.visualRoot || defaults.visualRoot);
  const check = !!options.check;
  if (textRoot === visualRoot) throw Error('Text and visual repositories must be separate');
  if (!fs.existsSync(path.join(textRoot, 'outputs/en/dianedate_en.html'))) {
    throw Error('Cannot find canonical ADWD English source at ' + textRoot + '. Set ADWD_TEXT_ROOT to its checkout.');
  }
  if (!fs.existsSync(path.join(visualRoot, 'visual/scene-map.js'))) {
    throw Error('Cannot find the visual checkout at ' + visualRoot + '. Set ADWD_VISUAL_ROOT to its checkout.');
  }
  textRoot = fs.realpathSync(textRoot);
  visualRoot = fs.realpathSync(visualRoot);
  if (textRoot === visualRoot || textRoot.startsWith(visualRoot + path.sep) || visualRoot.startsWith(textRoot + path.sep)) {
    throw Error('Text and visual repositories must be separate, non-overlapping directories');
  }
  // A visual checkout may carry an older sync manifest. Let the canonical tool
  // plan the update so newly shared files are included on the first rebuild.
  const canonicalTool = path.join(textRoot, 'maintenance/sync_visual_edition.js');
  if (fs.realpathSync(canonicalTool) !== fs.realpathSync(__filename)
      && !fs.readFileSync(canonicalTool).equals(fs.readFileSync(__filename))) {
    return require(canonicalTool).synchronize({ ...options, textRoot, visualRoot });
  }
  const files = expectedFiles(textRoot);
  const receiptPath = path.join(visualRoot, RECEIPT);
  const previous = fs.existsSync(receiptPath) ? JSON.parse(fs.readFileSync(receiptPath, 'utf8')) : null;
  const changed = [], conflicts = [];
  for (const [file, bytes] of files) {
    const target = path.join(visualRoot, file);
    const current = fs.existsSync(target) ? fs.readFileSync(target) : null;
    if (current && current.equals(bytes)) continue;
    changed.push(file);
    if (previous?.files[file] && current && hash(current) !== previous.files[file]) conflicts.push(file);
  }
  const retired = Object.keys(previous?.files || {}).filter(file => !files.has(file));
  // A renamed or removed managed file needs a deliberate migration; never delete by discovery.
  if (retired.length) throw Error('Previously shared files need explicit reconciliation: ' + retired.join(', '));
  const receipt = JSON.stringify({ version: 1, source: 'ADWD English edition', files: Object.fromEntries([...files].map(([file, bytes]) => [file, hash(bytes)])) }, null, 2) + '\n';
  const receiptChanged = !fs.existsSync(receiptPath) || fs.readFileSync(receiptPath, 'utf8') !== receipt;
  if (check) {
    if (changed.length || receiptChanged) {
      throw Error('Visual shared content is out of sync: ' + [...changed, ...(receiptChanged ? [RECEIPT] : [])].join(', ') + '. Run node maintenance/sync_visual_edition.js from either repository.');
    }
    console.log(`Shared English content matches across repositories (${files.size} managed files; read-only).`);
    return { textRoot, visualRoot, changed: [] };
  }
  if (conflicts.length) {
    throw Error('Shared files were edited independently in the visual checkout: ' + conflicts.join(', ') + '. Reconcile those edits into ADWD first; visual-only work belongs in visual/ or assets/. No shared files were written.');
  }
  if (changed.length || receiptChanged) {
    // Validate canonical generated content before copying any managed file.
    for (const script of ['build_gallery_data.js', 'write_transcripts.js']) {
      execFileSync(process.execPath, [path.join(textRoot, 'maintenance', script), '--check'], { stdio: 'inherit' });
    }
    for (const file of changed) {
      const target = path.join(visualRoot, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, files.get(file));
    }
    fs.writeFileSync(receiptPath, receipt);
  }
  console.log(`Synchronized shared English content: ${changed.length} updated files; visual presentation and assets preserved.`);
  return { textRoot, visualRoot, changed };
}

function main() {
  const check = process.argv.includes('--check');
  const { visualRoot } = synchronize({ check });
  execFileSync(process.execPath, [path.join(visualRoot, 'maintenance/build_visual_edition.js'), ...(check ? ['--check'] : [])], { stdio: 'inherit' });
}
if (require.main === module) main();
module.exports = { SHARED_SCRIPTS, RECEIPT, projectPaths, expectedFiles, synchronize };
