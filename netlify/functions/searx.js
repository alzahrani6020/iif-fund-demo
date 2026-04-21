const http = require("http");
const https = require("https");

const PROXY_TAG = "searx-v6-accept-lang";
const DEFAULT_UPSTREAM = "https://searx.tiekoetter.com";

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

function parseUpstreamList(envRaw) {
  const raw = envRaw != null ? String(envRaw).trim() : "";
  if (!raw) return [new URL(DEFAULT_UPSTREAM)];
  const pieces = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const urls = [];
  for (const p of pieces) {
    try {
      urls.push(new URL(p));
    } catch {
      /* skip invalid */
    }
  }
  return urls.length ? urls : [new URL(DEFAULT_UPSTREAM)];
}

function wantsJsonFormat(rawQuery) {
  const q = rawQuery != null ? String(rawQuery) : "";
  return /(?:^|&)format=json(?:&|$)/.test(q);
}

function isEmptyJsonResults(body) {
  try {
    const j = JSON.parse(body);
    return Boolean(j && Array.isArray(j.results) && j.results.length === 0);
  } catch {
    return false;
  }
}

function shouldRetryHttp(res) {
  if (res.error) return true;
  const c = Number(res.statusCode) || 0;
  return c === 429 || c === 502 || c === 503 || c === 504;
}

function shouldRetryEmptyResults(res, rawQuery) {
  if (String(process.env.IIF_SEARX_RETRY_EMPTY || "").trim() !== "1") return false;
  const c = Number(res.statusCode) || 0;
  if (c !== 200 || res.error) return false;
  if (!wantsJsonFormat(rawQuery)) return false;
  return isEmptyJsonResults(res.body);
}

function clientHeader(event, name) {
  if (!event || !event.headers) return "";
  const h = event.headers;
  const lower = name.toLowerCase();
  if (h[name] != null && String(h[name]).trim()) return String(h[name]).trim();
  for (const k of Object.keys(h)) {
    if (k && k.toLowerCase() === lower) return String(h[k]).trim();
  }
  return "";
}

function requestUpstream(upstream, pathAndQuery, method, timeoutMs, event) {
  const isHttps = upstream.protocol === "https:";
  const mod = isHttps ? https : http;
  const port = Number(upstream.port) || (isHttps ? 443 : 80);
  const accept = clientHeader(event, "accept") || "*/*";
  const acceptLang = clientHeader(event, "accept-language");
  const hdr = {
    "User-Agent": "iif-fund-demo-netlify-searx/1.0",
    Accept: accept,
    Host: upstream.hostname,
  };
  if (acceptLang) hdr["Accept-Language"] = acceptLang;
  return new Promise((resolve) => {
    const preq = mod.request(
      {
        hostname: upstream.hostname,
        port,
        path: pathAndQuery,
        method,
        headers: hdr,
        timeout: timeoutMs,
      },
      (pres) => {
        const chunks = [];
        pres.on("data", (c) => chunks.push(c));
        pres.on("end", () => {
          const body = Buffer.concat(chunks).toString("utf8");
          resolve({
            statusCode: pres.statusCode || 200,
            headers: pres.headers || {},
            body,
            upstreamOrigin: upstream.origin,
            error: "",
          });
        });
      }
    );
    preq.on("timeout", () => {
      preq.destroy();
      resolve({
        statusCode: 504,
        headers: {},
        body: "",
        upstreamOrigin: upstream.origin,
        error: "timeout",
      });
    });
    preq.on("error", (e) => {
      resolve({
        statusCode: 502,
        headers: {},
        body: "",
        upstreamOrigin: upstream.origin,
        error: e && e.message ? e.message : "socket_error",
      });
    });
    preq.end();
  });
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

  const upstreams = parseUpstreamList(process.env.SEARXNG_URL);
  const suffix = upstreamPathSuffix(event);
  const qs = event.rawQuery ? "?" + event.rawQuery : "";
  const pathAndQuery = suffix + qs;
  const timeoutMs = Number(process.env.IIF_SEARX_TIMEOUT_MS || 15000);

  let last = null;
  for (let i = 0; i < upstreams.length; i++) {
    const u = upstreams[i];
    last = await requestUpstream(u, pathAndQuery, event.httpMethod, timeoutMs, event);

    const more = i < upstreams.length - 1;
    const retryHttp = more && shouldRetryHttp(last);
    const retryEmpty = more && shouldRetryEmptyResults(last, event.rawQuery);
    if (!retryHttp && !retryEmpty) break;
  }

  if (!last) {
    return json(502, { ok: false, error: "No upstream configured" });
  }

  if (last.error === "timeout") {
    return json(504, { ok: false, error: "SearX timeout" }, { "X-IIF-Searx-Upstream": last.upstreamOrigin, "X-IIF-Searx-Proxy": PROXY_TAG });
  }
  if (last.error && last.statusCode === 502 && !last.body) {
    return json(502, { ok: false, error: last.error }, { "X-IIF-Searx-Upstream": last.upstreamOrigin, "X-IIF-Searx-Proxy": PROXY_TAG });
  }

  const ct = String(last.headers["content-type"] || "text/plain; charset=utf-8");
  return {
    statusCode: last.statusCode,
    headers: {
      "Content-Type": ct,
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "X-IIF-Searx-Upstream": last.upstreamOrigin,
      "X-IIF-Searx-Proxy": PROXY_TAG,
      "X-IIF-Searx-Upstream-Count": String(upstreams.length),
    },
    body: last.body,
  };
};
