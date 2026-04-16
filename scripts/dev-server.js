/**
 * خادم تطوير للصفحات الثابتة + بروكسي SearXNG على /api/searx
 * الاستخدام: npm start  →  http://localhost:3333
 * المحرك: engines/searxng/  →  docker compose up -d  (المضيف 18080 → الحاوية 8080)
 */
'use strict';

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL, pathToFileURL } = require('url');

const PORT = Number(process.env.PORT) || 3333;
const ROOT = path.join(__dirname, '..');
/** موجز الأخبار (RSS) — نفس منطق financial-consulting/iif-fund-demo/api/news.js */
const IIF_NEWS_API_JS = path.join(ROOT, 'financial-consulting', 'iif-fund-demo', 'api', 'news.js');
let iifNewsApiModulePromise = null;
function getIifNewsApiModule() {
  if (!iifNewsApiModulePromise) {
    iifNewsApiModulePromise = import(pathToFileURL(IIF_NEWS_API_JS).href);
  }
  return iifNewsApiModulePromise;
}
/** upstream SearXNG (Docker) */
const SEARX_UPSTREAM = new URL(process.env.SEARXNG_URL || 'http://127.0.0.1:18080');
/** upstream Ollama (local) */
const OLLAMA_UPSTREAM = new URL(process.env.OLLAMA_URL || 'http://127.0.0.1:11434');
/** upstream Translator (local, NLLB-200) */
const TRANSLATE_UPSTREAM = new URL(process.env.IIF_TRANSLATE_URL || 'http://127.0.0.1:7071');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    'Cache-Control': 'no-store',
    ...headers,
  });
  res.end(body);
}

function sendJson(res, status, obj, headers = {}) {
  send(res, status, JSON.stringify(obj, null, 2), {
    'Content-Type': 'application/json; charset=utf-8',
    ...headers,
  });
}

const DIAG_MAX = Number(process.env.IIF_DIAG_MAX || 200);
const DIAG = [];
function diagPush(event) {
  try {
    const item = { ts: new Date().toISOString(), ...event };
    DIAG.unshift(item);
    if (DIAG.length > DIAG_MAX) DIAG.length = DIAG_MAX;
  } catch (e) { }
}

/** دخول أدمن بدون كلمة مرور — معطّل عند NODE_ENV=production إلا إذا IIF_ALLOW_ADMIN_DIRECT=1 */
function allowDevAdminDirect() {
  if (String(process.env.IIF_ALLOW_ADMIN_DIRECT || '').trim() === '1') return true;
  return process.env.NODE_ENV !== 'production';
}

function getClientIp(req) {
  const xf = String(req.headers['x-forwarded-for'] || '').trim();
  if (xf) return xf.split(',')[0].trim();
  const ra = (req.socket && req.socket.remoteAddress) ? String(req.socket.remoteAddress) : '';
  return ra || 'unknown';
}

function createRateLimiter({ windowMs, max, label: _label }) {
  const hits = new Map();
  let lastCleanup = Date.now();
  function cleanup(now) {
    if (now - lastCleanup < Math.min(windowMs, 30000)) return;
    lastCleanup = now;
    for (const [k, v] of hits.entries()) {
      if (now - v.ts > windowMs) hits.delete(k);
    }
  }
  function check(req, res, label) {
    const now = Date.now();
    cleanup(now);
    const ip = getClientIp(req);
    const key = `${label}:${ip}`;
    const v = hits.get(key);
    if (!v || now - v.ts > windowMs) {
      hits.set(key, { ts: now, n: 1 });
      return true;
    }
    v.n += 1;
    if (v.n > max) {
      diagPush({ type: 'rate_limit', label, ip, path: req.url, method: req.method, max, windowMs });
      send(res, 429, 'تم تجاوز حد الطلبات. انتظر قليلاً ثم أعد المحاولة.', {
        'Content-Type': 'text/plain; charset=utf-8',
        'Retry-After': String(Math.ceil(windowMs / 1000)),
      });
      return false;
    }
    return true;
  }
  function snapshot(label) {
    const now = Date.now();
    cleanup(now);
    let keys = 0;
    let total = 0;
    for (const [k, v] of hits.entries()) {
      if (!k.startsWith(label + ':')) continue;
      keys += 1;
      total += v.n;
    }
    return { windowMs, max, trackedKeys: keys, totalHits: total };
  }
  return { check, snapshot };
}

const RL_SEARX = createRateLimiter({
  windowMs: Number(process.env.IIF_RL_WINDOW_MS || 60000),
  max: Number(process.env.IIF_RL_SEARX_MAX || 120),
  label: 'searx',
});
const RL_FETCH = createRateLimiter({
  windowMs: Number(process.env.IIF_RL_WINDOW_MS || 60000),
  max: Number(process.env.IIF_RL_FETCH_MAX || 60),
  label: 'fetch',
});
const RL_TRANSLATE = createRateLimiter({
  windowMs: Number(process.env.IIF_RL_WINDOW_MS || 60000),
  max: Number(process.env.IIF_RL_TRANSLATE_MAX || 120),
  label: 'translate',
});
const RL_NEWS = createRateLimiter({
  windowMs: Number(process.env.IIF_RL_WINDOW_MS || 60000),
  max: Number(process.env.IIF_RL_NEWS_MAX || 90),
  label: 'news',
});

function parseSearxSafeSearchMode() {
  const raw = String(process.env.IIF_SEARX_SAFESEARCH || '').trim().toLowerCase();
  if (!raw) return null;
  if (raw === 'off' || raw === '0' || raw === 'false') return '0';
  if (raw === 'moderate' || raw === '1' || raw === 'true') return '1';
  if (raw === 'strict' || raw === '2') return '2';
  return null;
}

function safeJoin(base, reqPath) {
  const decoded = decodeURIComponent(reqPath.split('?')[0]);
  const target = path.normalize(path.join(base, decoded));
  if (!target.startsWith(base)) return null;
  return target;
}

function proxySearx(req, res) {
  const u = new URL(req.url, 'http://127.0.0.1');
  const subPath = u.pathname.replace(/^\/api\/searx/, '') || '/';
  const forceSafe = parseSearxSafeSearchMode();
  if (forceSafe !== null && !u.searchParams.has('safesearch')) {
    u.searchParams.set('safesearch', forceSafe);
  }
  const targetPath = subPath + (u.searchParams.toString() ? ('?' + u.searchParams.toString()) : '');
  const port = Number(SEARX_UPSTREAM.port) || 18080;
  const headers = {};
  for (const k of Object.keys(req.headers)) {
    const lk = k.toLowerCase();
    if (lk === 'host' || lk === 'connection') continue;
    headers[k] = req.headers[k];
  }
  headers.host = `${SEARX_UPSTREAM.hostname}:${port}`;
  const preq = http.request(
    {
      hostname: SEARX_UPSTREAM.hostname,
      port,
      path: targetPath,
      method: req.method,
      headers,
      /** أطول من مهلة المتصفح في SIMPLE-GOVERNMENT-PLATFORM (SearXNG قد يستغرق >30 ث مع عدة محركات / Tor) */
      timeout: 100000,
    },
    (pres) => {
      res.writeHead(pres.statusCode, pres.headers);
      pres.pipe(res);
    }
  );
  preq.on('timeout', () => {
    preq.destroy();
    if (!res.headersSent) {
      diagPush({ type: 'proxy_timeout', label: 'searx', path: req.url });
      send(res, 504, 'انتهت مهلة الاتصال بـ SearXNG', { 'Content-Type': 'text/plain; charset=utf-8' });
    }
  });
  preq.on('error', (e) => {
    if (!res.headersSent) {
      diagPush({ type: 'proxy_error', label: 'searx', path: req.url, error: e.message });
      send(
        res,
        502,
        'SearXNG غير متاح: ' +
        e.message +
        '\n\nشغّل المحرك من: engines/searxng\n  docker compose up -d\n',
        { 'Content-Type': 'text/plain; charset=utf-8' }
      );
    }
  });
  req.pipe(preq);
}

function getFetchAllowlist() {
  const defaults = [
    'example.com',
    'api.worldbank.org',
    'data.worldbank.org',
    'www.worldbank.org',
    'restcountries.com',
    'api.github.com',
    'raw.githubusercontent.com',
  ];
  const extra = String(process.env.IIF_FETCH_ALLOWLIST || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return Array.from(new Set([...defaults, ...extra]));
}

function isHostAllowed(hostname, allowlist) {
  const h = String(hostname || '').trim().toLowerCase();
  if (!h) return false;
  for (const rule of allowlist) {
    if (!rule) continue;
    if (rule.startsWith('*.')) {
      const suffix = rule.slice(2);
      if (h === suffix || h.endsWith('.' + suffix)) return true;
      continue;
    }
    if (rule.startsWith('.')) {
      const suffix = rule.slice(1);
      if (h === suffix || h.endsWith('.' + suffix)) return true;
      continue;
    }
    if (h === rule) return true;
  }
  return false;
}

function proxyFetch(req, res) {
  const u = new URL(req.url, 'http://127.0.0.1');
  const raw = String(u.searchParams.get('url') || '').trim();
  if (!raw) {
    diagPush({ type: 'bad_request', label: 'fetch', path: req.url, error: 'Missing url' });
    sendJson(res, 400, { ok: false, error: 'Missing url' }, { 'Access-Control-Allow-Origin': '*' });
    return;
  }
  let target;
  try {
    target = new URL(raw);
  } catch (e) {
    diagPush({ type: 'bad_request', label: 'fetch', path: req.url, error: 'Invalid url' });
    sendJson(res, 400, { ok: false, error: 'Invalid url' }, { 'Access-Control-Allow-Origin': '*' });
    return;
  }
  if (target.protocol !== 'http:' && target.protocol !== 'https:') {
    diagPush({ type: 'bad_request', label: 'fetch', path: req.url, error: 'Only http/https allowed' });
    sendJson(res, 400, { ok: false, error: 'Only http/https allowed' }, { 'Access-Control-Allow-Origin': '*' });
    return;
  }

  const allowlist = getFetchAllowlist();
  if (!isHostAllowed(target.hostname, allowlist)) {
    diagPush({ type: 'blocked', label: 'fetch', host: target.hostname, url: raw });
    sendJson(
      res,
      403,
      { ok: false, error: 'Host not allowed', host: target.hostname, allowlist },
      { 'Access-Control-Allow-Origin': '*' }
    );
    return;
  }

  const isHttps = target.protocol === 'https:';
  const mod = isHttps ? https : http;
  const port = Number(target.port) || (isHttps ? 443 : 80);

  const headers = {
    'User-Agent': 'iif-fund-demo-dev-server/1.0',
    Accept: req.headers.accept || '*/*',
  };

  const preq = mod.request(
    {
      hostname: target.hostname,
      port,
      path: target.pathname + target.search,
      method: 'GET',
      headers,
      timeout: Number(process.env.IIF_FETCH_TIMEOUT_MS || 20000),
    },
    (pres) => {
      const ct = String(pres.headers['content-type'] || 'application/octet-stream');
      const maxBytes = Number(process.env.IIF_FETCH_MAX_BYTES || 2_000_000);
      let size = 0;
      const chunks = [];
      pres.on('data', (buf) => {
        size += buf.length;
        if (size > maxBytes) {
          pres.destroy();
          diagPush({ type: 'too_large', label: 'fetch', host: target.hostname, maxBytes });
          sendJson(res, 413, { ok: false, error: 'Response too large', maxBytes }, { 'Access-Control-Allow-Origin': '*' });
          return;
        }
        chunks.push(buf);
      });
      pres.on('end', () => {
        if (res.headersSent) return;
        const body = Buffer.concat(chunks);
        res.writeHead(pres.statusCode || 200, {
          'Content-Type': ct,
          'Cache-Control': 'no-store',
          'Access-Control-Allow-Origin': '*',
          'X-IIF-Fetch-Host': target.hostname,
        });
        res.end(body);
      });
    }
  );

  preq.on('timeout', () => {
    preq.destroy();
    if (!res.headersSent) {
      diagPush({ type: 'proxy_timeout', label: 'fetch', host: target.hostname, url: raw });
      sendJson(res, 504, { ok: false, error: 'Fetch timeout' }, { 'Access-Control-Allow-Origin': '*' });
    }
  });
  preq.on('error', (e) => {
    if (!res.headersSent) {
      diagPush({ type: 'proxy_error', label: 'fetch', host: target.hostname, url: raw, error: e.message });
      sendJson(res, 502, { ok: false, error: e.message }, { 'Access-Control-Allow-Origin': '*' });
    }
  });
  preq.end();
}

function proxyOllama(req, res) {
  const u = new URL(req.url, 'http://127.0.0.1');
  const subPath = u.pathname.replace(/^\/api\/ollama/, '') || '/';
  const targetPath = subPath + u.search;
  const port = Number(OLLAMA_UPSTREAM.port) || 11434;
  const headers = {};
  for (const k of Object.keys(req.headers)) {
    const lk = k.toLowerCase();
    if (lk === 'host' || lk === 'connection') continue;
    headers[k] = req.headers[k];
  }
  headers.host = `${OLLAMA_UPSTREAM.hostname}:${port}`;
  const preq = http.request(
    {
      hostname: OLLAMA_UPSTREAM.hostname,
      port,
      path: targetPath,
      method: req.method,
      headers,
      timeout: 120000,
    },
    (pres) => {
      res.writeHead(pres.statusCode, pres.headers);
      pres.pipe(res);
    }
  );
  preq.on('timeout', () => {
    preq.destroy();
    if (!res.headersSent) {
      send(res, 504, 'انتهت مهلة الاتصال بـ Ollama', { 'Content-Type': 'text/plain; charset=utf-8' });
    }
  });
  preq.on('error', (e) => {
    if (!res.headersSent) {
      send(
        res,
        502,
        'Ollama غير متاح: ' +
        e.message +
        '\n\nثبّت وشغّل Ollama محلياً ثم حمّل نموذجاً.\nمثال:\n  ollama pull llama3.1:8b\n',
        { 'Content-Type': 'text/plain; charset=utf-8' }
      );
    }
  });
  req.pipe(preq);
}

function proxyTranslate(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, error: 'Method Not Allowed' }, { 'Access-Control-Allow-Origin': '*' });
    return;
  }
  const port = Number(TRANSLATE_UPSTREAM.port) || 7071;
  const timeoutMs = Number(process.env.IIF_TRANSLATE_TIMEOUT_MS || 180000);
  const headers = {
    'Content-Type': req.headers['content-type'] || 'application/json',
    Accept: req.headers.accept || 'application/json',
    host: `${TRANSLATE_UPSTREAM.hostname}:${port}`,
  };
  const preq = http.request(
    {
      hostname: TRANSLATE_UPSTREAM.hostname,
      port,
      path: '/translate',
      method: 'POST',
      headers,
      timeout: timeoutMs,
    },
    (pres) => {
      res.writeHead(pres.statusCode, {
        ...pres.headers,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      });
      pres.pipe(res);
    }
  );
  preq.setTimeout(timeoutMs);
  preq.on('timeout', () => {
    preq.destroy();
    if (!res.headersSent) {
      diagPush({ type: 'proxy_timeout', label: 'translate', path: req.url });
      sendJson(res, 504, { ok: false, error: 'Translate timeout' }, { 'Access-Control-Allow-Origin': '*' });
    }
  });
  preq.on('error', (e) => {
    if (!res.headersSent) {
      diagPush({ type: 'proxy_error', label: 'translate', path: req.url, error: e.message });
      sendJson(
        res,
        502,
        {
          ok: false,
          error: 'Translator not available: ' + e.message,
          hint: 'Run START-IIF-TRANSLATOR.bat (local NLLB-200 service) then retry.',
        },
        { 'Access-Control-Allow-Origin': '*' }
      );
    }
  });
  req.pipe(preq);
}

function searxProbe() {
  const start = Date.now();
  return new Promise((resolve) => {
    const port = Number(SEARX_UPSTREAM.port) || 18080;
    const req = http.request(
      {
        hostname: SEARX_UPSTREAM.hostname,
        port,
        path: '/',
        method: 'GET',
        timeout: 2500,
      },
      (res) => {
        res.resume();
        resolve({ ok: res.statusCode === 200, status: res.statusCode, latencyMs: Date.now() - start });
      }
    );
    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, status: 0, latencyMs: Date.now() - start, error: 'timeout' });
    });
    req.on('error', (e) => {
      resolve({ ok: false, status: 0, latencyMs: Date.now() - start, error: e.message });
    });
    req.end();
  });
}

function serveStatic(req, res) {
  let urlPath = new URL(req.url, 'http://localhost').pathname;
  if (urlPath.startsWith('/api/ollama/')) {
    proxyOllama(req, res);
    return;
  }
  /**
   * محلياً فقط: اجعل /admin يذهب مباشرة إلى /admin-direct
   * لتفادي: iframe + تكرار تسجيل الدخول + صفحات فارغة.
   */
  if (urlPath === '/admin') {
    if (!allowDevAdminDirect()) {
      send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
      return;
    }
    const html = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>لوحة الإدارة</title>
<script>location.replace('/admin-direct');</script></head><body><a href="/admin-direct">متابعة إلى لوحة الإدارة</a></body></html>`;
    send(res, 200, html, { 'Content-Type': 'text/html; charset=utf-8' });
    return;
  }
  /** دخول مباشر محلي (تطوير فقط): يضبط جلسة المالك ثم يمرّر إلى /dashboard (نفس مسار لوحة التحكم المعتمد) */
  if (urlPath === '/admin-direct') {
    if (!allowDevAdminDirect()) {
      send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
      return;
    }
    const ownerEmail = String(process.env.IIF_OWNER_EMAIL || 'talalkenani@gmail.com').trim().toLowerCase();
    /** نفس سلوك [[redirects]] /dashboard في netlify.toml — رابط قصير مخصّص للوحة فقط */
    const adminUrl = '/dashboard';
    const html = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>دخول الإدارة (محلي)</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="background:#05070c;color:#e9ddbf;font-family:system-ui,-apple-system,Segoe UI,Arial;padding:18px;">
<h2 style="margin:0 0 10px;font-size:18px;">دخول الإدارة (محلي)</h2>
<p style="margin:0 0 12px;opacity:.9">سيتم فتح لوحة الإدارة تلقائياً. إذا بقيت هذه الصفحة، اضغط الزر:</p>
<p style="margin:0 0 14px;">
  <a href="${adminUrl}" style="display:inline-block;padding:10px 12px;border-radius:12px;border:1px solid rgba(201,162,39,.55);background:rgba(12,14,18,.82);color:#f5e7b6;text-decoration:none;">فتح لوحة الإدارة</a>
</p>
<script>
(function(){
  try {
    localStorage.setItem('iif-user-email', ${JSON.stringify(ownerEmail)});
    localStorage.setItem('iif-logged-in', '1');
    localStorage.setItem('iif-is-admin', '1');
    try { sessionStorage.setItem('iif_admin_portal_mode', '1'); } catch (e) {}
  } catch (e) {}
  try { location.replace(${JSON.stringify(adminUrl)}); } catch (e3) { location.href = ${JSON.stringify(adminUrl)}; }
})();
</script>
<noscript>فعّل JavaScript ثم افتح: <a href="${adminUrl}">${adminUrl}</a></noscript>
</body></html>`;
    send(res, 200, html, { 'Content-Type': 'text/html; charset=utf-8' });
    return;
  }
  /**
   * لوحة التحكم — رابط منفصل عن الرئيسية:
   *   /dashboard | /cp | /panel → index.html?iif_admin_portal=1&open_dashboard=1
   * الرئيسية: / أو /financial-consulting/iif-fund-demo/index.html بدون تلك المعاملات
   */
  if (urlPath === '/dashboard' || urlPath === '/cp' || urlPath === '/panel' || urlPath === '/fund-admin') {
    /* بدون # في العنوان — يُفتح من الاستعلام + sessionStorage (تفادي سقوط الهاش من PowerShell/اختصارات) */
    const dashPath =
      '/financial-consulting/iif-fund-demo/index.html?iif_admin_portal=1&open_dashboard=1';
    const html = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>لوحة التحكم</title><script>location.replace(${JSON.stringify(
      dashPath
    )});</script></head><body><p><a href="${dashPath}">متابعة إلى لوحة التحكم</a></p></body></html>`;
    send(res, 200, html, { 'Content-Type': 'text/html; charset=utf-8' });
    return;
  }
  /** مجلدات: /legal/ → /legal/index.html (مثل Netlify) */
  if (urlPath !== '/' && urlPath.endsWith('/')) {
    urlPath = urlPath.slice(0, -1) + '/index.html';
  }
  /** اختصارات مثل netlify.toml — للتطوير المحلي */
  const shortPaths = {
    '/fund': '/financial-consulting/iif-fund-demo/index.html',
    '/gov': '/financial-consulting/government-search/SIMPLE-GOVERNMENT-PLATFORM.html',
    '/admin': '/financial-consulting/iif-fund-demo/admin.html',
    '/privacy': '/legal/privacy.html',
    '/disclaimer': '/legal/disclaimer.html',
    '/contact': '/legal/contact.html',
    '/legal': '/legal/index.html',
    '/executive': '/executive-brief.html',
    '/brief': '/executive-brief.html',
    '/sovereign': '/sovereign-standards.html',
    '/charter': '/sovereign-standards.html',
    '/news-sources': '/financial-consulting/iif-fund-demo/news-sources.html',
  };
  if (shortPaths[urlPath]) {
    urlPath = shortPaths[urlPath];
  }
  /** الصفحة الرئيسية للموقع (الزوار والأعضاء والمستخدمون): نفس الملف بدون معاملات لوحة — لوحة التحكم من /dashboard فقط */
  if (urlPath === '/' || urlPath === '/index.html') {
    const primary = path.join(ROOT, 'financial-consulting', 'iif-fund-demo', 'index.html');
    urlPath = fs.existsSync(primary)
      ? '/financial-consulting/iif-fund-demo/index.html'
      : '/financial-consulting/fund-site/index.html';
  }
  let filePath = safeJoin(ROOT, urlPath);
  if (!filePath) {
    send(res, 403, 'Forbidden', { 'Content-Type': 'text/plain; charset=utf-8' });
    return;
  }
  function pipeFile(fp) {
    const ext = path.extname(fp).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    fs.createReadStream(fp).pipe(res);
  }
  fs.stat(filePath, (err, st) => {
    if (err) {
      send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
      return;
    }
    if (st.isDirectory()) {
      const indexInDir = path.join(filePath, 'index.html');
      fs.stat(indexInDir, (e2, st2) => {
        if (!e2 && st2.isFile()) pipeFile(indexInDir);
        else send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
      });
      return;
    }
    if (!st.isFile()) {
      send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
      return;
    }
    pipeFile(filePath);
  });
}

const server = http.createServer((req, res) => {
  const urlPath = new URL(req.url, 'http://localhost').pathname;
  const method = String(req.method || 'GET').toUpperCase();
  /**
   * توحيد المضيف محلياً لتفادي "عدم حفظ الدخول" بسبب اختلاف الـ origin:
   * localhost:3333 ≠ 127.0.0.1:3333 (localStorage منفصل لكل واحد).
   */
  try {
    const host = String(req.headers.host || '');
    if (host.toLowerCase().startsWith('localhost:')) {
      const port = host.split(':')[1] || String(PORT);
      res.writeHead(302, { Location: `http://127.0.0.1:${port}${req.url || '/'}` });
      res.end();
      return;
    }
  } catch (e) { }
  /** CORS / إضافات قد ترسل OPTIONS — بدون ردّ مناسب قد يظهر «Method Not Allowed» */
  if (method === 'OPTIONS') {
    send(res, 204, '', {
      Allow: 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': req.headers['access-control-request-headers'] || '*',
      'Access-Control-Allow-Origin': '*',
    });
    return;
  }
  if (urlPath === '/healthz') {
    (async () => {
      const searx = await searxProbe();
      const safe = parseSearxSafeSearchMode();
      sendJson(res, 200, {
        ok: true,
        now: new Date().toISOString(),
        port: PORT,
        searx: { ...searx, upstream: SEARX_UPSTREAM.origin, safeSearchForced: safe !== null ? safe : null },
        rateLimit: {
          searx: RL_SEARX.snapshot('searx'),
          fetch: RL_FETCH.snapshot('fetch'),
          news: RL_NEWS.snapshot('news'),
        },
        fetchAllowlist: getFetchAllowlist(),
        diagnostics: { max: DIAG_MAX, size: DIAG.length },
      }, { 'Access-Control-Allow-Origin': '*' });
    })().catch((e) => {
      sendJson(res, 500, { ok: false, error: e.message }, { 'Access-Control-Allow-Origin': '*' });
    });
    return;
  }
  if (urlPath === '/diagnostics.json') {
    sendJson(res, 200, { ok: true, now: new Date().toISOString(), items: DIAG }, { 'Access-Control-Allow-Origin': '*' });
    return;
  }
  if (urlPath === '/api/news') {
    if (method !== 'GET' && method !== 'HEAD') {
      send(res, 405, 'Method Not Allowed', { 'Content-Type': 'text/plain; charset=utf-8' });
      return;
    }
    if (!RL_NEWS.check(req, res, 'news')) return;
    (async () => {
      try {
        const { GET } = await getIifNewsApiModule();
        const abs = `http://127.0.0.1${req.url || '/api/news'}`;
        const webRes = await GET(new Request(abs, { method: 'GET' }));
        const headers = {};
        webRes.headers.forEach((v, k) => {
          headers[k] = v;
        });
        if (method === 'HEAD') {
          res.writeHead(webRes.status, headers);
          res.end();
          return;
        }
        const buf = Buffer.from(await webRes.arrayBuffer());
        res.writeHead(webRes.status, headers);
        res.end(buf);
      } catch (e) {
        diagPush({ type: 'api_news_error', path: req.url, error: e.message });
        sendJson(
          res,
          200,
          { items: [] },
          {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
          }
        );
      }
    })();
    return;
  }
  if (urlPath === '/api/translate') {
    if (!RL_TRANSLATE.check(req, res, 'translate')) return;
    proxyTranslate(req, res);
    return;
  }
  if (urlPath.startsWith('/api/searx')) {
    if (method !== 'GET' && method !== 'HEAD') {
      send(res, 405, 'Method Not Allowed', { 'Content-Type': 'text/plain; charset=utf-8' });
      return;
    }
    if (!RL_SEARX.check(req, res, 'searx')) return;
    proxySearx(req, res);
    return;
  }
  if (urlPath === '/api/fetch') {
    if (method !== 'GET' && method !== 'HEAD') {
      sendJson(res, 405, { ok: false, error: 'Method Not Allowed' }, { 'Access-Control-Allow-Origin': '*' });
      return;
    }
    if (!RL_FETCH.check(req, res, 'fetch')) return;
    proxyFetch(req, res);
    return;
  }
  /**
   * للملفات الثابتة في التطوير: تساهل مع طرق HTTP غير المتوقعة (إضافات/برامج)
   * حتى لا تتوقف الواجهة برسالة 405. نتعامل معها كـ GET عملياً.
   */
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log('');
  console.log('  الواجهة: http://127.0.0.1:' + PORT + '/');
  console.log('  موجز للمستويات الرفيعة: /executive-brief.html أو /executive');
  console.log('  معايير سيادية: /sovereign-standards.html أو /sovereign');
  console.log('  المنصة: …/government-search/SIMPLE-GOVERNMENT-PLATFORM.html');
  console.log('  بروكسي SearXNG: /api/searx/*  →  ' + SEARX_UPSTREAM.origin + '/*');
  console.log('  صحة النظام (JSON): /healthz');
  console.log('  تشخيص (JSON): /diagnostics.json');
  console.log('  ترجمة (POST JSON): /api/translate  →  ' + TRANSLATE_UPSTREAM.origin + '/translate');
  console.log('  Proxy fetch (Allowlist): /api/fetch?url=https://example.com/data.json');
  console.log('  موجز الأخبار (RSS): /api/news?lang=en|ar&cat=asian|arabic|…  (حد معدل: IIF_RL_NEWS_MAX)');
  console.log('  المحرك: cd engines/searxng && docker compose up -d');
  console.log('  لوحة (اختصار): /dashboard أو /cp أو /panel أو /fund-admin  →  واجهة الصندوق + open_dashboard=1');
  if (allowDevAdminDirect()) {
    console.log('  أدمن مباشر (محلي): /admin-direct  →  دخول بدون كلمة مرور (معطّل عند NODE_ENV=production ما لم يُضبط IIF_ALLOW_ADMIN_DIRECT=1)');
  } else {
    console.log('  أدمن مباشر: معطّل (NODE_ENV=production). للتفعيل: IIF_ALLOW_ADMIN_DIRECT=1');
  }
  console.log('');
});
