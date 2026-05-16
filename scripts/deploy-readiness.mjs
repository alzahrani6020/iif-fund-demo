/**
 * فحص سريع: ملفات النشر والـ CI الحرجة موجودة ومنطقية (بدون اتصال بمنصات).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const errors = [];
const warnings = [];

function must(rel, hint) {
  const p = path.join(ROOT, ...rel.split('/'));
  if (!fs.existsSync(p)) errors.push(`Missing: ${rel}${hint ? ' — ' + hint : ''}`);
}

function readText(rel) {
  return fs.readFileSync(path.join(ROOT, ...rel.split('/')), 'utf8');
}

must('.nvmrc', 'Node version for CI and local');
must('financial-consulting/iif-fund-demo/vercel.json');
must('financial-consulting/iif-fund-demo/api/user-registration-forward.js');
must('financial-consulting/iif-fund-demo/emit-service-packs.cjs');
must('.github/workflows/ci.yml');
must('.github/workflows/github-pages.yml');
must('githooks/pre-commit');
must('scripts/git-hooks/pre-commit.js');
must('scripts/install-git-hooks.js');

for (const x of ['a', 'b', 'c', 'd', 'all']) {
  must(`financial-consulting/iif-fund-demo/i18n-service-packs-${x}.js`);
}

try {
  const raw = readText('financial-consulting/iif-fund-demo/vercel.json');
  const j = JSON.parse(raw);
  const bc = j.buildCommand != null ? String(j.buildCommand) : '';
  if (!/i18n|packs|emit/i.test(bc)) {
    warnings.push(
      'vercel.json: buildCommand should regenerate i18n packs (e.g. npm run i18n:packs) if Root Directory is the site folder.'
    );
  }
} catch (e) {
  errors.push('vercel.json: invalid JSON — ' + (e && e.message));
}

try {
  const ci = readText('.github/workflows/ci.yml');
  if (!ci.includes('verify:i18n-packs-sync')) {
    warnings.push('ci.yml: consider verify:i18n-packs-sync after build');
  }
} catch (e) {
  /* already must() */
}

try {
  const ghp = readText('.github/workflows/github-pages.yml');
  if (!ghp.includes('emit-service-packs') && !ghp.includes('i18n')) {
    warnings.push('github-pages.yml: ensure i18n packs run before static copy');
  }
} catch (e) {}

if (warnings.length) {
  console.warn('[deploy-readiness] تحذيرات / Warnings:\n' + warnings.map((w) => '  - ' + w).join('\n'));
}

if (errors.length) {
  console.error('[deploy-readiness] أخطاء / Errors:\n' + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}

console.log(
  '[deploy-readiness] OK — layout ready. Manual: Vercel dashboard Build Command, GitHub Pages Actions, branch protection.'
);
process.exit(0);
