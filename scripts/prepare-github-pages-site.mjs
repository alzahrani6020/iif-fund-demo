/**
 * يبني مجلد gh-pages-dist/ — نسخة ثابتة كاملة لـ GitHub Pages.
 * يستثني node_modules و.git وغيرها؛ يضيف .nojekyll
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'gh-pages-dist');

const IGNORE_DIR_NAMES = new Set([
  'node_modules',
  '.git',
  '.github',
  'gh-pages-dist',
  '.cursor',
  '.minimax',
  '.netlify',
  '.next',            // Next.js build cache (can exceed Cloudflare Pages 26 MB limit)
  'cache',            // Generic cache folders
  'exports',          // Large PPTX files (not needed for web deployment)
  '.uploads',         // Upload folder (not needed for web deployment)
  '.venv_iif',        // Python virtual env (torch DLLs exceed 26 MB limit)
  '.venv',            // Python virtual env
  'venv',             // Python virtual env
]);

const IGNORE_FILE_NAMES = new Set(['.env', '.env.local']);
const IGNORE_FILE_EXTENSIONS = new Set(['.pack']); // Webpack cache packs can exceed 26 MB

function shouldSkipDir(name) {
  return IGNORE_DIR_NAMES.has(name);
}

function shouldSkipFile(name) {
  if (IGNORE_FILE_NAMES.has(name)) return true;
  const ext = path.extname(name);
  if (ext && IGNORE_FILE_EXTENSIONS.has(ext)) return true;
  return false;
}

async function copyTree(from, to, rel = '') {
  await fs.mkdir(to, { recursive: true });
  const entries = await fs.readdir(from, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory()) {
      if (shouldSkipDir(e.name)) continue;
      await copyTree(path.join(from, e.name), path.join(to, e.name), rel ? `${rel}/${e.name}` : e.name);
    } else {
      if (shouldSkipFile(e.name)) continue;
      await fs.copyFile(path.join(from, e.name), path.join(to, e.name));
    }
  }
}

await fs.rm(OUT, { recursive: true, force: true });
await copyTree(ROOT, OUT);
await fs.writeFile(path.join(OUT, '.nojekyll'), '', 'utf8');
console.log('prepare-github-pages-site: wrote', OUT);
