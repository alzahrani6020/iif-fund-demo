/**
 * Vercel Serverless: يمرّر طلبات JSON إلى مثيل SearXNG (بدون CORS من المتصفح مباشرة).
 * متغيرات بيئة اختيارية:
 *   SEARX_UPSTREAM — مثال: https://searx.tiekoetter.com
 *   IIF_PROXY_RL_MAX — حد الطلبات لكل نافذة لكل IP (افتراضي 45)
 *   IIF_PROXY_RL_WINDOW_MS — مدة النافذة بالمللي (افتراضي 60000)
 *   IIF_PROXY_RL_OFF — ضع "1" لتعطيل الحد (للتشخيص فقط)
 *
 * الحد في الذاكرة لكل عملية serverless (أفضل من لا شيء؛ ليس عالمياً عبر كل العقد).
 */
const DEFAULT_UPSTREAM = 'https://searx.tiekoetter.com';
const MAX_Q = 2000;

function clientIp(req) {
  var xf = req.headers['x-forwarded-for'];
  if (xf && typeof xf === 'string') {
    var first = xf.split(',')[0];
    if (first) return String(first).trim();
  }
  var ri = req.headers['x-real-ip'];
  if (ri && typeof ri === 'string') return String(ri).trim();
  return 'unknown';
}

function rateLimitAllow(ip) {
  if (String(process.env.IIF_PROXY_RL_OFF || '').trim() === '1') return true;
  var max = Number(process.env.IIF_PROXY_RL_MAX || 45);
  var windowMs = Number(process.env.IIF_PROXY_RL_WINDOW_MS || 60000);
  if (!Number.isFinite(max) || max < 1) max = 45;
  if (!Number.isFinite(windowMs) || windowMs < 1000) windowMs = 60000;

  var g = globalThis.__iifSearxRl;
  if (!g) g = globalThis.__iifSearxRl = new Map();

  var now = Date.now();
  if (g.size > 8000) {
    var cutoff = now - windowMs * 2;
    for (var k of g.keys()) {
      var e = g.get(k);
      if (!e || e.start < cutoff) g.delete(k);
    }
  }

  var entry = g.get(ip);
  if (!entry || now - entry.start >= windowMs) {
    g.set(ip, { start: now, n: 1 });
    return true;
  }
  if (entry.n >= max) return false;
  entry.n += 1;
  return true;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed', results: [] });
  }

  var ip = clientIp(req);
  if (!rateLimitAllow(ip)) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({ error: 'rate_limited', results: [] });
  }

  const q = String(req.query.q || '').trim();
  if (!q) {
    return res.status(200).json({ results: [] });
  }
  if (q.length > MAX_Q) {
    return res.status(400).json({ error: 'Query too long', results: [] });
  }

  const format = String(req.query.format || 'json');
  const language = String(req.query.language || 'en');
  const categories = String(req.query.categories || 'general');
  const upstream = String(process.env.SEARX_UPSTREAM || DEFAULT_UPSTREAM).replace(/\/$/, '');

  const params = new URLSearchParams({
    q,
    format,
    language,
    categories,
  });
  const url = `${upstream}/search?${params.toString()}`;

  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'IIF-Searx-Proxy/1.0 (Vercel)',
        Accept: 'application/json, text/plain;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });
    const body = await r.text();
    const ct = r.headers.get('content-type') || 'application/json; charset=utf-8';
    res.status(r.status);
    res.setHeader('Content-Type', ct);
    return res.send(body);
  } catch (e) {
    return res.status(502).json({
      error: 'Upstream fetch failed',
      results: [],
      details: process.env.NODE_ENV === 'development' ? String(e && e.message) : undefined,
    });
  }
};
