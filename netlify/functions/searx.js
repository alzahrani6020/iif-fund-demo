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

/** مسار SearXNG على المثيل (مثل /search) — يدعم /api/searx/* ومسار /.netlify/functions/searx */
function upstreamPathSuffix(event) {
  const p = String(event.path || "").split("?")[0];
  if (p.startsWith("/api/searx")) {
    return p.slice("/api/searx".length) || "/";
  }
  const markers = ["/.netlify/functions/searx", "/.netlify/functions/iif-searx-proxy"];
  for (const m of markers) {
    const i = p.indexOf(m);
    if (i >= 0) {
      return p.slice(i + m.length) || "/";
    }
  }
  return "/";
}

exports.handler = async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": event.headers && event.headers["access-control-request-headers"] ? event.headers["access-control-request-headers"] : "*",
        "Cache-Control": "no-store",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "GET" && event.httpMethod !== "HEAD") {
    return json(405, { ok: false, error: "Method Not Allowed" });
  }

  const DEFAULT_UPSTREAM = "https://searx.tiekoetter.com";
  const envRaw = process.env.SEARXNG_URL != null ? String(process.env.SEARXNG_URL).trim() : "";
  const upstreamRaw = envRaw || DEFAULT_UPSTREAM;

  let upstream;
  try {
    upstream = new URL(upstreamRaw);
  } catch {
    return json(500, { ok: false, error: "Invalid SEARXNG_URL" });
  }

  const suffix = upstreamPathSuffix(event);
  const qs = event.rawQuery ? "?" + event.rawQuery : "";

  const isHttps = upstream.protocol === "https:";
  const mod = isHttps ? https : http;
  const port = Number(upstream.port) || (isHttps ? 443 : 80);
  const timeoutMs = Number(process.env.IIF_SEARX_TIMEOUT_MS || 15000);

  return await new Promise((resolve) => {
    const preq = mod.request(
      {
        hostname: upstream.hostname,
        port,
        path: suffix + qs,
        method: event.httpMethod,
        headers: {
          "User-Agent": "iif-fund-demo-netlify-searx/1.0",
          Accept: event.headers && event.headers.accept ? event.headers.accept : "*/*",
          Host: upstream.hostname,
        },
        timeout: timeoutMs,
      },
      (pres) => {
        const chunks = [];
        pres.on("data", (c) => chunks.push(c));
        pres.on("end", () => {
          const out = Buffer.concat(chunks);
          resolve({
            statusCode: pres.statusCode || 200,
            headers: {
              "Content-Type": String(pres.headers["content-type"] || "text/plain; charset=utf-8"),
              "Cache-Control": "no-store",
              "Access-Control-Allow-Origin": "*",
              "X-IIF-Searx-Upstream": upstream.origin,
              "X-IIF-Searx-Proxy": "searx-v4-tiekoetter-default",
            },
            body: out.toString("utf8"),
          });
        });
      }
    );
    preq.on("timeout", () => {
      preq.destroy();
      resolve(json(504, { ok: false, error: "SearX timeout" }, { "X-IIF-Searx-Upstream": upstream.origin }));
    });
    preq.on("error", (e) => resolve(json(502, { ok: false, error: e.message }, { "X-IIF-Searx-Upstream": upstream.origin })));
    preq.end();
  });
};
