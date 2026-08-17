/**
 * Optional: forward minimal registration metadata to an HTTPS webhook (e.g. Zapier, Make, internal API).
 * Set IIF_USER_WEBHOOK_URL in Vercel env. Optional IIF_USER_WEBHOOK_SECRET sent as Bearer.
 * If unset, returns 200 { skipped: true } — safe for static-first demos.
 */
const MAX_BODY = 16384;

function readTextBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let len = 0;
    req.on('data', (c) => {
      len += c.length;
      if (len > MAX_BODY) {
        reject(new Error('body_too_large'));
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  if (req.method === 'OPTIONS') {
    res.status(204).set(headers).send('');
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).set(headers).send(JSON.stringify({ ok: false, error: 'method_not_allowed' }));
    return;
  }

  const upstream = (process.env.IIF_USER_WEBHOOK_URL || '').trim();
  if (!upstream || !/^https:\/\//i.test(upstream)) {
    res.status(200).set(headers).send(JSON.stringify({ skipped: true, reason: 'webhook_not_configured' }));
    return;
  }

  let raw;
  try {
    raw = await readTextBody(req);
  } catch (e) {
    const msg = e && e.message;
    if (msg === 'body_too_large') {
      res.status(413).set(headers).send(JSON.stringify({ ok: false, error: 'body_too_large' }));
      return;
    }
    res.status(400).set(headers).send(JSON.stringify({ ok: false, error: 'read_body' }));
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw || '{}');
  } catch (e) {
    res.status(400).set(headers).send(JSON.stringify({ ok: false, error: 'invalid_json' }));
    return;
  }

  const email = String(parsed.email || '')
    .trim()
    .toLowerCase();
  if (!email || email.length > 254 || email.indexOf('@') < 1 || /\s/.test(email)) {
    res.status(400).set(headers).send(JSON.stringify({ ok: false, error: 'email_required' }));
    return;
  }

  const forwardPayload = {
    email,
    name: String(parsed.name || '')
      .trim()
      .slice(0, 500),
    at: typeof parsed.at === 'string' && parsed.at.length < 64 ? parsed.at : new Date().toISOString(),
    source: String(parsed.source || 'iif-site')
      .trim()
      .slice(0, 64)
  };

  const outHeaders = { 'Content-Type': 'application/json' };
  const secret = (process.env.IIF_USER_WEBHOOK_SECRET || '').trim();
  if (secret) outHeaders.Authorization = 'Bearer ' + secret;

  try {
    const r = await fetch(upstream, {
      method: 'POST',
      headers: outHeaders,
      body: JSON.stringify(forwardPayload)
    });
    res.status(200).set(headers).send(
      JSON.stringify({
        forwarded: true,
        upstreamStatus: r.status
      })
    );
  } catch (e) {
    res.status(502).set(headers).send(
      JSON.stringify({
        forwarded: false,
        error: e && e.message ? String(e.message) : 'upstream_failed'
      })
    );
  }
};
