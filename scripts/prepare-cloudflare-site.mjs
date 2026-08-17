/**
 * يبني مجلد cf-dist/ — نسخة جاهزة للنشر على Cloudflare Pages.
 * الجذر = واجهة الصندوق (financial-consulting/iif-fund-demo).
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import CleanCSS from 'clean-css';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'financial-consulting', 'iif-fund-demo');
const OUT = path.join(ROOT, 'cf-dist');

async function copyTree(from, to, rel = '') {
  await fs.mkdir(to, { recursive: true });
  const entries = await fs.readdir(from, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === '.git') continue;
    const srcPath = path.join(from, e.name);
    const destPath = path.join(to, e.name);
    if (e.isDirectory()) {
      await copyTree(srcPath, destPath, rel ? `${rel}/${e.name}` : e.name);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

await fs.rm(OUT, { recursive: true, force: true });
await copyTree(SRC, OUT);

// Minify CSS for production
const cleanCss = new CleanCSS({ level: 2 });
async function minifyCss(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await minifyCss(p);
    else if (e.name.endsWith('.css')) {
      const original = await fs.readFile(p, 'utf8');
      const result = cleanCss.minify(original);
      if (result.errors.length) {
        console.warn('clean-css errors for', p, result.errors);
      }
      await fs.writeFile(p, result.styles, 'utf8');
    }
  }
}
await minifyCss(OUT);
console.log('prepare-cloudflare-site: wrote', OUT);
