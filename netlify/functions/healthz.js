const DEFAULT_SEARX = "https://searx.tiekoetter.com";

async function probeSearx(upstreamBase, timeoutMs) {
  const base = String(upstreamBase || "").trim().replace(/\/$/, "");
  if (!base) return { ok: false, note: "no upstream", latencyMs: 0 };
  const url = `${base}/search?q=healthz&format=json`;
  const t0 = Date.now();
  try {
    const r = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
      headers: { Accept: "application/json", "User-Agent": "iif-healthz/1.0" },
    });
    const latencyMs = Date.now() - t0;
    if (!r.ok) {
      return { ok: false, upstream: base, status: r.status, latencyMs };
    }
    const j = await r.json().catch(() => null);
    if (!j || typeof j !== "object") {
      return { ok: false, upstream: base, error: "invalid_json", latencyMs };
    }
    if (j.ok === false && j.error) {
      return { ok: false, upstream: base, error: String(j.error), latencyMs };
    }
    /* استجابة SearXNG JSON لا تتضمن دائماً ok:true */
    return { ok: true, upstream: base, latencyMs };
  } catch (e) {
    return { ok: false, upstream: base, error: String(e && e.message ? e.message : e), latencyMs: Date.now() - t0 };
  }
}

async function probeTranslateUpstream(baseUrl, timeoutMs) {
  const t0 = Date.now();
  try {
    const r = await fetch(`${String(baseUrl).replace(/\/$/, "")}/translate`, {
      method: "POST",
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "iif-healthz/1.0",
      },
      body: JSON.stringify({ text: "ok", target_lang: "arb_Arab", source_lang: "eng_Latn" }),
    });
    const latencyMs = Date.now() - t0;
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.ok) {
      return { ok: false, mode: "upstream", status: r.status, latencyMs, error: j.error || null };
    }
    return { ok: true, mode: "upstream", latencyMs };
  } catch (e) {
    return { ok: false, mode: "upstream", error: String(e && e.message ? e.message : e), latencyMs: Date.now() - t0 };
  }
}

exports.handler = async function handler() {
  const searxTimeout = Number(process.env.IIF_HEALTHZ_SEARX_MS || 6000);
  const translateTimeout = Number(process.env.IIF_HEALTHZ_TRANSLATE_MS || 8000);

  const envSearx = process.env.SEARXNG_URL != null ? String(process.env.SEARXNG_URL).trim() : "";
  const searxBase = envSearx || DEFAULT_SEARX;
  const searx = await probeSearx(searxBase, searxTimeout);

  const translateUrl = String(process.env.IIF_TRANSLATE_URL || "").trim();
  let translate;
  if (translateUrl) {
    translate = await probeTranslateUpstream(translateUrl, translateTimeout);
    translate.configured = true;
  } else {
    translate = {
      ok: null,
      configured: false,
      mode: "libre-fallback-in-function",
      note: "IIF_TRANSLATE_URL unset; live /api/translate uses LibreTranslate fallback when configured.",
    };
  }

  const payload = {
    ok: true,
    now: new Date().toISOString(),
    runtime: "netlify-function",
    searx,
    translate,
  };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(payload, null, 2),
  };
};
