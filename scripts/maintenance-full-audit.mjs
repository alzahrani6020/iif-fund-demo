/**
 * فحص صيانة وروابط داخلية — مشروع iif-fund-demo
 * - صياغة JavaScript: node --check لكل .js / .mjs / .cjs (باستثناء المجلدات المهملة)
 * - صحة JSON: تحليل ملفات .json المختارة
 * - روابط نسبية ومطلقة في .html و .css → وجود الملف على القرص (جذر الخادم = مجلد المشروع)
 *
 * الاستخدام:
 *   node scripts/maintenance-full-audit.mjs
 *   node scripts/maintenance-full-audit.mjs --with-server   # يجرّب check-urls إن كان 3333 يستجيب
 *   node scripts/maintenance-full-audit.mjs --external      # عيّنة من روابط https (تحذيرات؛ يبطئ قليلاً)
 *   EXTERNAL_URL_STRICT=1  — يحوّل فشل الروابط الخارجية إلى خطأ (يفشل الخروج)
 *
 * ملاحظات:
 * - لا يُفحص محتوى href="#..." أو mailto/data/javascript
 * - مجلد archive/ و index-comprehensive.html يُستثنان من فحص الروابط (مرجع قديم)
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  'test-results',
  '.cursor',
  'dist',
  'build',
  '.next',
]);

/** تجاهل بيئات بايثون/أدوات طرفية داخل المستودع (روابط اختبار حزم لا تخص المشروع) */
function shouldIgnoreDir(name) {
  if (IGNORE_DIRS.has(name)) return true;
  if (name === 'venv' || name === '.venv' || name === '__pycache__') return true;
  if (name.startsWith('.venv')) return true;
  return false;
}

const HTML_ATTR_RE = /(?:\b(?:src|href|poster|data-main-href)\s*=\s*["']([^"']*)["'])/gi;
const SRCSET_RE = /\bsrcset\s*=\s*["']([^"']*)["']/gi;
const CSS_URL_RE = /url\s*\(\s*["']?([^"')]+?)["']?\s*\)/gi;
const CSS_IMPORT_RE = /@import\s+(?:url\s*\(\s*)?["']([^"']+)["']/gi;

function walkFiles(dir, acc = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const ent of entries) {
    if (shouldIgnoreDir(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

function stripQueryHash(s) {
  let cut = s.length;
  const q = s.indexOf('?');
  const h = s.indexOf('#');
  if (q >= 0) cut = Math.min(cut, q);
  if (h >= 0) cut = Math.min(cut, h);
  return s.slice(0, cut).trim();
}

/** يطابق اختصارات scripts/dev-server.js */
const ROOT_SHORT_PATHS = {
  '/privacy': '/legal/privacy.html',
  '/disclaimer': '/legal/disclaimer.html',
  '/contact': '/legal/contact.html',
  '/legal': '/legal/index.html',
  '/executive': '/executive-brief.html',
  '/brief': '/executive-brief.html',
  '/sovereign': '/sovereign-standards.html',
  '/charter': '/sovereign-standards.html',
};

/** مسارات SPA / واجهة أحادية — لا ملفات ثابتة منفصلة على الخادم */
function isVirtualSpaPath(pathname) {
  if (!pathname || pathname === '/') return false;
  if (pathname === '/dashboard' || pathname === '/cp' || pathname === '/admin') return true;
  // JSON/صحة: خادم التطوير (`npm start`) أو دوال Netlify — ليس ملفاً ثابتاً تحت الجذر دائماً
  if (pathname === '/healthz' || pathname === '/diagnostics.json') return true;
  if (/^\/(about|sectors|team|careers|register|profile|terms|cookies|compliance)(\/|$)/.test(pathname)) return true;
  if (/^\/services(\/|$)/.test(pathname)) return true;
  return false;
}

function shouldSkipRef(raw) {
  const t = (raw || '').trim();
  if (!t || t === '#' || /^#([^/]|$)/.test(t)) return true;
  if (/^(javascript|mailto|tel|data):/i.test(t)) return true;
  if (/^about:/i.test(t)) return true;
  if (t.startsWith('{{') || t.includes('${')) return true;
  if (t === '/' || t === '') return true;
  return false;
}

function resolveInternalTarget(fromFile, ref) {
  const u = stripQueryHash(ref);
  if (!u) return null;
  if (u.startsWith('//')) return { kind: 'external' };
  if (/^https?:\/\//i.test(u)) return { kind: 'external' };
  let abs;
  let rootPathname = null;
  if (u.startsWith('/')) {
    rootPathname = '/' + u.replace(/^\/+/, '').split('/').filter(Boolean).join('/');
    if (rootPathname === '/') rootPathname = '/';
    const mapped = ROOT_SHORT_PATHS[rootPathname];
    const pathPart = (mapped || u).replace(/^\/+/, '');
    abs = path.join(ROOT, pathPart.split('/').join(path.sep));
  } else {
    let baseDir = path.dirname(fromFile);
    const parentName = path.basename(baseDir);
    const grandParent = path.dirname(baseDir);
    if (
      !u.startsWith('..') &&
      parentName === 'components' &&
      path.basename(grandParent) === 'iif-fund-demo'
    ) {
      baseDir = grandParent;
    }
    abs = path.normalize(path.join(baseDir, u));
  }
  if (!abs.startsWith(ROOT)) return { kind: 'outside', abs };
  return { kind: 'internal', abs, rootPathname };
}

function targetExists(absPath) {
  try {
    if (fs.existsSync(absPath)) {
      const st = fs.statSync(absPath);
      if (st.isFile()) return true;
      if (st.isDirectory()) {
        const idx = path.join(absPath, 'index.html');
        return fs.existsSync(idx) && fs.statSync(idx).isFile();
      }
    }
    if (!path.extname(absPath)) {
      const html = absPath + '.html';
      if (fs.existsSync(html) && fs.statSync(html).isFile()) return true;
    }
  } catch {
    return false;
  }
  return false;
}

/** أرشيف ونسخ تجريبية — لا تُدخل في مسار الإنتاج */
function skipLinkAuditFile(file) {
  const lower = file.toLowerCase();
  if (lower.includes(`${path.sep}archive${path.sep}`)) return true;
  if (lower.includes(`${path.sep}gh-pages-dist${path.sep}`)) return true;
  if (lower.endsWith(`${path.sep}index-comprehensive.html`)) return true;
  return false;
}

const EXTERNAL_URL_RE =
  /https?:\/\/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi;

function probeExternalUrl(urlStr) {
  return new Promise((resolve) => {
    let u;
    try {
      u = new URL(urlStr);
    } catch {
      resolve({ ok: false, detail: 'عنوان غير صالح' });
      return;
    }
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
      resolve({ ok: true, skipped: true });
      return;
    }
    const lib = u.protocol === 'https:' ? https : http;
    const opts = {
      method: 'HEAD',
      timeout: 12000,
      headers: { 'User-Agent': 'IIF-maintenance-audit/1.1' },
    };
    const finishGet = (res, cb) => {
      res.resume();
      const ok = res.statusCode >= 200 && res.statusCode < 400;
      cb(ok, res.statusCode);
    };
    const req = lib.request(u, opts, (res) => {
      if (res.statusCode === 405 || res.statusCode === 501) {
        const g = lib.request(
          u,
          {
            method: 'GET',
            timeout: 12000,
            headers: {
              'User-Agent': 'IIF-maintenance-audit/1.1',
              Range: 'bytes=0-0',
            },
          },
          (res2) => finishGet(res2, (ok, st) => resolve({ ok, status: st }))
        );
        g.on('error', (e) => resolve({ ok: false, detail: e.message }));
        g.on('timeout', () => {
          g.destroy();
          resolve({ ok: false, detail: 'timeout' });
        });
        g.end();
        return;
      }
      finishGet(res, (ok, st) => resolve({ ok, status: st }));
    });
    req.on('error', (e) => resolve({ ok: false, detail: e.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, detail: 'timeout' });
    });
    req.end();
  });
}

async function runExternalUrlAudit(allFiles, issues) {
  const max = Math.min(80, Math.max(5, Number(process.env.EXTERNAL_URL_MAX) || 45));
  const urls = new Set();
  for (const f of allFiles) {
    if (skipLinkAuditFile(f)) continue;
    const ext = path.extname(f).toLowerCase();
    if (ext !== '.html' && ext !== '.htm') continue;
    let content;
    try {
      content = fs.readFileSync(f, 'utf8');
    } catch {
      continue;
    }
    EXTERNAL_URL_RE.lastIndex = 0;
    let m;
    while ((m = EXTERNAL_URL_RE.exec(content)) !== null) {
      let u = m[0].replace(/[),.;'">\]}]+$/g, '');
      if (/^https?:\/\//i.test(u)) urls.add(u);
    }
  }
  const list = [...urls].slice(0, max);
  const strict = process.env.EXTERNAL_URL_STRICT === '1';
  const sev = strict ? 'err' : 'warn';
  console.log(`4) فحص روابط خارجية (عيّنة ${list.length} من أصل ~${urls.size})…`);
  for (const urlStr of list) {
    // روابط التطوير المحلي ليست "روابط خارجية" موثوقة في CI (قد لا يكون الخادم شغالاً).
    // كذلك بعض المواقع تمنع الفحص الآلي (403/ECONNRESET) وهذا خارج نطاق صيانة المشروع.
    try {
      const u = new URL(urlStr);
      const h = String(u.hostname || '').toLowerCase();
      const skipHosts = new Set([
        'localhost',
        '127.0.0.1',
        '0.0.0.0',
        'fonts.googleapis.com',
        'fonts.gstatic.com',
        'cdn.sheetjs.com',
        'cdnjs.cloudflare.com',
        'www.reuters.com',
        'www.bloomberg.com',
        'www.ft.com',
        'www.wsj.com',
        'www.imf.org',
        'www.arabnews.com',
        'www.google.com',
        'api.worldbank.org',
        'www.federalreserve.gov',
        'www.w3.org',
        'www.worldbank.org',
      ]);
      if (skipHosts.has(h)) continue;
      // favicon endpoint often rate-limited/blocked
      if (h === 'www.google.com' && u.pathname.startsWith('/s2/favicons')) continue;
    } catch {
      // keep original behavior for invalid URLs (probe will handle)
    }
    const r = await probeExternalUrl(urlStr);
    if (r.skipped) continue;
    if (!r.ok) {
      issues.push({
        sev,
        file: '(روابط خارجية)',
        ref: urlStr,
        msg: r.detail ? `فشل: ${r.detail}` : `HTTP ${r.status}`,
      });
    }
  }
}

function extractFromHtml(content, fromFile, issues, stats) {
  let m;
  HTML_ATTR_RE.lastIndex = 0;
  while ((m = HTML_ATTR_RE.exec(content)) !== null) {
    const raw = m[1];
    if (shouldSkipRef(raw)) continue;
    stats.htmlRefs++;
    const r = resolveInternalTarget(fromFile, raw);
    if (!r || r.kind === 'external') {
      if (r?.kind === 'external') stats.external++;
      continue;
    }
    if (r.kind === 'outside') {
      issues.push({ sev: 'err', file: fromFile, ref: raw, msg: 'مسار خارج جذر المشروع' });
      continue;
    }
    if (!targetExists(r.abs)) {
      if (r.rootPathname && isVirtualSpaPath(r.rootPathname)) continue;
      issues.push({ sev: 'err', file: fromFile, ref: raw, msg: `غير موجود: ${path.relative(ROOT, r.abs)}` });
    }
  }
  SRCSET_RE.lastIndex = 0;
  while ((m = SRCSET_RE.exec(content)) !== null) {
    const parts = m[1].split(',').map((p) => p.trim().split(/\s+/)[0]).filter(Boolean);
    for (const part of parts) {
      if (shouldSkipRef(part)) continue;
      stats.htmlRefs++;
      const r = resolveInternalTarget(fromFile, part);
      if (!r || r.kind === 'external') continue;
      if (r.kind === 'outside') {
        issues.push({ sev: 'err', file: fromFile, ref: part, msg: 'srcset خارج الجذر' });
        continue;
      }
      if (!targetExists(r.abs)) {
        if (r.rootPathname && isVirtualSpaPath(r.rootPathname)) continue;
        issues.push({ sev: 'err', file: fromFile, ref: part, msg: `srcset غير موجود: ${path.relative(ROOT, r.abs)}` });
      }
    }
  }
}

function extractFromCss(content, fromFile, issues, stats) {
  let m;
  CSS_URL_RE.lastIndex = 0;
  while ((m = CSS_URL_RE.exec(content)) !== null) {
    let raw = m[1].trim();
    if (raw.startsWith('data:') || raw.startsWith('#')) continue;
    if (shouldSkipRef(raw)) continue;
    stats.cssRefs++;
    const r = resolveInternalTarget(fromFile, raw);
    if (!r || r.kind === 'external') continue;
    if (r.kind === 'outside') {
      issues.push({ sev: 'err', file: fromFile, ref: raw, msg: 'url() خارج الجذر' });
      continue;
    }
    if (!targetExists(r.abs)) {
      if (r.rootPathname && isVirtualSpaPath(r.rootPathname)) continue;
      issues.push({ sev: 'err', file: fromFile, ref: raw, msg: `CSS url غير موجود: ${path.relative(ROOT, r.abs)}` });
    }
  }
  CSS_IMPORT_RE.lastIndex = 0;
  while ((m = CSS_IMPORT_RE.exec(content)) !== null) {
    const raw = m[1].trim();
    if (shouldSkipRef(raw)) continue;
    stats.cssRefs++;
    const r = resolveInternalTarget(fromFile, raw);
    if (!r || r.kind === 'external') continue;
    if (!targetExists(r.abs)) {
      if (r.rootPathname && isVirtualSpaPath(r.rootPathname)) continue;
      issues.push({ sev: 'err', file: fromFile, ref: raw, msg: `@import غير موجود: ${path.relative(ROOT, r.abs)}` });
    }
  }
}

function checkJsonFiles(issues) {
  const candidates = [
    path.join(ROOT, 'financial-consulting', 'government-search', 'government-data.json'),
    path.join(ROOT, 'package.json'),
    path.join(ROOT, 'financial-consulting', 'iif-fund-demo', 'package.json'),
  ];
  for (const fp of candidates) {
    if (!fs.existsSync(fp)) continue;
    try {
      JSON.parse(fs.readFileSync(fp, 'utf8'));
    } catch (e) {
      issues.push({ sev: 'err', file: fp, ref: '', msg: `JSON تالف: ${e.message}` });
    }
  }
}

function checkAllJsSyntax(issues, stats) {
  const all = walkFiles(ROOT);
  const jsFiles = all.filter((f) => /\.(js|mjs|cjs)$/i.test(f) && !f.includes(`${path.sep}node_modules${path.sep}`));
  for (const f of jsFiles) {
    try {
      execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' });
      stats.jsOk++;
    } catch (e) {
      stats.jsFail++;
      issues.push({ sev: 'err', file: f, ref: '', msg: `خطأ صياغة JS: ${e.stderr?.toString() || e.message}` });
    }
  }
}

function serverListening(port, host) {
  return new Promise((resolve) => {
    const req = http.request({ hostname: host, port, path: '/', method: 'GET', timeout: 1500 }, (res) => {
      res.resume();
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

async function maybeRunCheckUrls() {
  const port = Number(process.env.PORT) || 3333;
  const host = process.env.CHECK_HOST || '127.0.0.1';
  const ok = await serverListening(port, host);
  if (!ok) {
    console.log('\n[تلميح] الخادم غير يعمل على', `${host}:${port}`, '— تخطّي check-urls (شغّل npm start ثم npm run check-urls)');
    return;
  }
  console.log('\n--- تشغيل check-urls.js (الخادم يعمل) ---\n');
  try {
    execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'check-urls.js')], {
      cwd: ROOT,
      stdio: 'inherit',
      env: { ...process.env, PORT: String(port), CHECK_HOST: host },
    });
  } catch {
    process.exitCode = 1;
  }
}

async function main() {
  const withServer = process.argv.includes('--with-server');
  const externalCheck = process.argv.includes('--external') || process.env.EXTERNAL_URL_CHECK === '1';
  console.log('=== فحص صيانة شامل —', ROOT, '===\n');

  const issues = [];
  const stats = { htmlRefs: 0, cssRefs: 0, external: 0, jsOk: 0, jsFail: 0 };

  console.log('1) صياغة JavaScript (node --check)…');
  checkAllJsSyntax(issues, stats);
  console.log(`   ملفات JS/MJS/CJS ناجحة: ${stats.jsOk}  فاشلة: ${stats.jsFail}`);

  console.log('2) صحة JSON…');
  checkJsonFiles(issues);

  console.log('3) فحص روابط HTML/CSS…');
  const files = walkFiles(ROOT);
  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    if (ext !== '.html' && ext !== '.htm' && ext !== '.css') continue;
    if (skipLinkAuditFile(f)) continue;
    let content;
    try {
      content = fs.readFileSync(f, 'utf8');
    } catch {
      continue;
    }
    if (ext === '.css') extractFromCss(content, f, issues, stats);
    else extractFromHtml(content, f, issues, stats);
  }
  console.log(`   مراجع HTML: ${stats.htmlRefs}  CSS: ${stats.cssRefs}  روابط خارجية (تُتخطى في خطوة 3): ~${stats.external}`);

  if (externalCheck) {
    await runExternalUrlAudit(files, issues);
  }

  const errs = issues.filter((i) => i.sev === 'err');
  const warns = issues.filter((i) => i.sev === 'warn');

  if (warns.length) {
    console.log('\n--- تحذيرات (' + warns.length + ') ---');
    for (const w of warns.slice(0, 80)) {
      console.log(`  [تحذير] ${path.relative(ROOT, w.file)} ← "${w.ref}"  ${w.msg}`);
    }
    if (warns.length > 80) console.log(`  … و${warns.length - 80} تحذيراً إضافياً`);
  }

  if (errs.length) {
    console.log('\n--- أخطاء (' + errs.length + ') ---');
    for (const e of errs.slice(0, 100)) {
      console.log(`  [خطأ] ${path.relative(ROOT, e.file)} ← "${e.ref}"  ${e.msg}`);
    }
    if (errs.length > 100) console.log(`  … و${errs.length - 100} خطأ إضافي`);
    console.log('\nفشل الفحص: صحّح الروابط أو الصياغة أعلاه.');
    process.exitCode = 1;
  } else {
    console.log('\n✓ لا أخطاء حرجة في الروابط الداخلية والصياغة.');
  }

  if (withServer) {
    await maybeRunCheckUrls();
  }

  if (process.exitCode === 1) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
