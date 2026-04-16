/**
 * Netlify wrapper for financial-consulting/iif-fund-demo/api/news.js (ESM GET handler).
 * Invoked as /.netlify/functions/news — matches IIF_FUNCS_PREFIX + '/news' on production.
 */

function buildQueryString(event) {
  const raw = event.rawQuery;
  if (raw) return raw.startsWith('?') ? raw : '?' + raw;
  const p = event.multiValueQueryStringParameters || event.queryStringParameters;
  if (!p || typeof p !== 'object') return '';
  const u = new URLSearchParams();
  for (const [k, val] of Object.entries(p)) {
    if (val == null) continue;
    if (Array.isArray(val)) val.forEach((v) => u.append(k, String(v)));
    else u.append(k, String(val));
  }
  const s = u.toString();
  return s ? '?' + s : '';
}

exports.handler = async function (event) {
  const baseHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: baseHeaders, body: '' };
  }
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') {
    return {
      statusCode: 405,
      headers: { ...baseHeaders, 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ items: [] }),
    };
  }
  const host = (event.headers && event.headers.host) || 'localhost';
  const qs = buildQueryString(event);
  const absUrl = `https://${host}/api/news${qs}`;
  try {
    const { GET } = await import('../../financial-consulting/iif-fund-demo/api/news.js');
    const webRes = await GET(new Request(absUrl, { method: event.httpMethod }));
    const buf = Buffer.from(await webRes.arrayBuffer());
    const outHeaders = {};
    webRes.headers.forEach((v, k) => {
      outHeaders[k] = v;
    });
    return {
      statusCode: webRes.status,
      headers: outHeaders,
      body: buf.toString('utf8'),
    };
  } catch (e) {
    console.error('netlify news function:', e);
    return {
      statusCode: 200,
      headers: {
        ...baseHeaders,
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
      body: JSON.stringify({ items: [] }),
    };
  }
};
