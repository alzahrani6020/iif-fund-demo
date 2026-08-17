/**
 * Cloudflare Worker template — يعادل مسار /api/searx/search على Vercel.
 *
 * النشر: wrangler deploy بعد ضبط route مثل https://yourdomain.com/api/searx/*
 * المتغيرات السرية (اختياري): SEARX_UPSTREAM = https://searx.example.com
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }
    if (request.method !== 'GET') {
      return json(405, { error: 'Method not allowed', results: [] });
    }

    const upstreamBase = (env.SEARX_UPSTREAM || 'https://searx.tiekoetter.com').replace(/\/$/, '');
    const q = url.searchParams.get('q') || '';
    if (!q.trim()) {
      return json(200, { results: [] });
    }
    if (q.length > 2000) {
      return json(400, { error: 'Query too long', results: [] });
    }

    const format = url.searchParams.get('format') || 'json';
    const language = url.searchParams.get('language') || 'en';
    const categories = url.searchParams.get('categories') || 'general';
    const target = new URL('/search', upstreamBase);
    target.searchParams.set('q', q);
    target.searchParams.set('format', format);
    target.searchParams.set('language', language);
    target.searchParams.set('categories', categories);

    try {
      const r = await fetch(target.toString(), {
        headers: {
          'User-Agent': 'IIF-Searx-Proxy/1.0 (Cloudflare)',
          Accept: 'application/json, text/plain;q=0.9,*/*;q=0.8',
        },
      });
      const body = await r.text();
      const h = new Headers(corsHeaders());
      const ct = r.headers.get('content-type') || 'application/json; charset=utf-8';
      h.set('Content-Type', ct);
      return new Response(body, { status: r.status, headers: h });
    } catch (e) {
      return json(502, { error: 'Upstream fetch failed', results: [] });
    }
  },
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
}

function json(status, obj) {
  const h = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
  const c = corsHeaders();
  Object.keys(c).forEach((k) => h.set(k, c[k]));
  return new Response(JSON.stringify(obj), { status, headers: h });
}
