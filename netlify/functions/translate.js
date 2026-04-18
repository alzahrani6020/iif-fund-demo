const http = require("http");
const https = require("https");

function json(statusCode, obj, headers = {}) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      ...headers,
    },
    body: JSON.stringify(obj, null, 2),
  };
}

/** NLLB-style codes → LibreTranslate ISO codes (مطابقة تقريبية لمترجم FastAPI المحلي) */
const NLLB_TO_LIBRE = {
  arb_Arab: "ar",
  eng_Latn: "en",
  fra_Latn: "fr",
  spa_Latn: "es",
  tur_Latn: "tr",
  deu_Latn: "de",
};

function toLibreCode(nllb) {
  const s = String(nllb || "").trim();
  if (NLLB_TO_LIBRE[s]) return NLLB_TO_LIBRE[s];
  if (/^[a-z]{2}$/i.test(s)) return s.toLowerCase();
  return "en";
}

function guessSourceLibre(text) {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(String(text || "")) ? "ar" : "en";
}

function libreFallbackBases() {
  const envBase = String(process.env.IIF_TRANSLATE_LIBRE_URL || "").trim().replace(/\/$/, "");
  const defaults = ["https://libretranslate.de", "https://de.libretranslate.com"];
  const seen = new Set();
  const out = [];
  if (envBase) {
    seen.add(envBase);
    out.push(envBase);
  }
  for (const b of defaults) {
    if (!seen.has(b)) {
      seen.add(b);
      out.push(b);
    }
  }
  return out;
}

/**
 * ترجمة عبر LibreTranslate (احتياطي). عدة مثيلات + إرجاع النص الأصلي عند الفشل حتى لا يتعطل الواجه.
 */
async function translateOneLibre(text, source, target, apiKey, bases, perTryMs) {
  if (!String(text || "").trim()) return text;
  if (source === target) return text;
  const payload = { q: text, source, target, format: "text" };
  if (apiKey) payload.api_key = apiKey;
  for (const base of bases) {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), perTryMs);
    try {
      const res = await fetch(`${base}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok) {
        const out = j.translatedText != null ? j.translatedText : j.translated_text;
        if (typeof out === "string" && out.length) return out;
      }
    } catch {
      /* جرّب المثيل التالي */
    } finally {
      clearTimeout(tid);
    }
  }
  return text;
}

async function translateLibreFallback(bodyStr) {
  const req = JSON.parse(bodyStr);
  if (!req || typeof req.target_lang !== "string" || !req.target_lang.trim()) {
    throw new Error("Missing target_lang");
  }
  const target = toLibreCode(req.target_lang);
  const explicitSrc = req.source_lang ? toLibreCode(req.source_lang) : null;
  const items = Array.isArray(req.text) ? req.text.map((x) => String(x)) : [String(req.text)];

  const apiKey = String(process.env.IIF_TRANSLATE_LIBRE_API_KEY || "").trim();
  const timeoutMs = Number(process.env.IIF_TRANSLATE_TIMEOUT_MS || 120000);
  const perTryMs = Math.min(45000, Math.max(8000, timeoutMs));
  const bases = libreFallbackBases();

  const results = [];
  for (let i = 0; i < items.length; i++) {
    const text = items[i];
    const source = explicitSrc || guessSourceLibre(text);
    results.push(await translateOneLibre(text, source, target, apiKey, bases, perTryMs));
  }

  const single = !Array.isArray(req.text);
  return {
    ok: true,
    source_lang: req.source_lang || "auto",
    target_lang: req.target_lang,
    result: single ? results[0] : results,
  };
}

function proxyToUpstream(upstreamRaw, bodyBuf) {
  let upstream;
  try {
    upstream = new URL(upstreamRaw);
  } catch {
    return Promise.resolve(json(500, { ok: false, error: "Invalid IIF_TRANSLATE_URL" }));
  }

  const isHttps = upstream.protocol === "https:";
  const mod = isHttps ? https : http;
  const port = Number(upstream.port) || (isHttps ? 443 : 80);
  const timeoutMs = Number(process.env.IIF_TRANSLATE_TIMEOUT_MS || 180000);

  return new Promise((resolve) => {
    const preq = mod.request(
      {
        hostname: upstream.hostname,
        port,
        path: "/translate",
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Length": String(bodyBuf.length),
          "User-Agent": "iif-fund-demo-netlify-translate/1.0",
          Accept: "application/json",
          Host: upstream.hostname,
        },
        timeout: timeoutMs,
      },
      (pres) => {
        const chunks = [];
        pres.on("data", (c) => chunks.push(c));
        pres.on("end", () => {
          const out = Buffer.concat(chunks).toString("utf8");
          resolve({
            statusCode: pres.statusCode || 200,
            headers: {
              "Content-Type": String(pres.headers["content-type"] || "application/json; charset=utf-8"),
              "Cache-Control": "no-store",
              "Access-Control-Allow-Origin": "*",
              "X-IIF-Translate-Upstream": upstream.origin,
            },
            body: out,
          });
        });
      }
    );
    preq.on("timeout", () => {
      preq.destroy();
      resolve(json(504, { ok: false, error: "Translate timeout" }, { "X-IIF-Translate-Upstream": upstream.origin }));
    });
    preq.on("error", (e) => resolve(json(502, { ok: false, error: e.message }, { "X-IIF-Translate-Upstream": upstream.origin })));
    preq.end(bodyBuf);
  });
}

exports.handler = async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": event.headers && event.headers["access-control-request-headers"] ? event.headers["access-control-request-headers"] : "*",
        "Cache-Control": "no-store",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "Method Not Allowed" });
  }

  const body = event.body || "";
  const bodyBuf = event.isBase64Encoded ? Buffer.from(body, "base64") : Buffer.from(body, "utf8");
  const bodyStr = bodyBuf.toString("utf8");

  const upstreamRaw = String(process.env.IIF_TRANSLATE_URL || "").trim();
  if (upstreamRaw) {
    return proxyToUpstream(upstreamRaw, bodyBuf);
  }

  try {
    JSON.parse(bodyStr);
  } catch {
    return json(400, { ok: false, error: "Invalid JSON body" });
  }

  try {
    const out = await translateLibreFallback(bodyStr);
    return json(200, out, { "X-IIF-Translate-Upstream": "libre-fallback" });
  } catch (e) {
    const msg = e && e.name === "AbortError" ? "Translate timeout" : String(e.message || e);
    return json(502, {
      ok: false,
      error: msg,
      howToFix:
        "Optional: set IIF_TRANSLATE_URL to your NLLB server, or IIF_TRANSLATE_LIBRE_URL / IIF_TRANSLATE_LIBRE_API_KEY for a LibreTranslate instance.",
    });
  }
};
