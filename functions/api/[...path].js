export async function onRequest(context) {
  const { request, params, env } = context;
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  if (request.method === 'OPTIONS') {
    return new Response('', { status: 204, headers });
  }
  const base = (env.NETLIFY_FUNCS_BASE || '').trim();
  const path = (params && params.path) ? String(params.path) : '';
  if (!base) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing NETLIFY_FUNCS_BASE' }), { status: 200, headers });
  }
  const url = base.replace(/\/+$/, '') + '/.netlify/functions/' + path.replace(/^\/+/, '');
  const init = {
    method: request.method,
    headers: request.headers,
    body: ['GET','HEAD'].includes(request.method) ? undefined : request.body
  };
  try {
    const resp = await fetch(url, init);
    const body = await resp.arrayBuffer();
    const outHeaders = new Headers(resp.headers);
    outHeaders.set('Access-Control-Allow-Origin', '*');
    outHeaders.set('Access-Control-Allow-Headers', 'Content-Type');
    return new Response(body, { status: resp.status, headers: outHeaders });
  } catch (_e) {
    return new Response(JSON.stringify({ ok: false, error: 'upstream unavailable' }), { status: 200, headers });
  }
}

