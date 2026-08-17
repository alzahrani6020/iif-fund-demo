/**
 * يبني مجلد cf-dist/ — نسخة جاهزة للنشر على Cloudflare Pages.
 * الجذر = واجهة الصندوق (financial-consulting/iif-fund-demo).
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

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
console.log('prepare-cloudflare-site: wrote', OUT);
