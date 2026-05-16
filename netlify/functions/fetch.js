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

function getAllowlist() {
  const defaults = [
    "api.worldbank.org",
    "data.worldbank.org",
    "www.worldbank.org",
    "restcountries.com",
    "api.github.com",
    "raw.githubusercontent.com",
  ];
  const extra = String(process.env.IIF_FETCH_ALLOWLIST || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return Array.from(new Set([...defaults, ...extra]));
}

function isHostAllowed(hostname, allowlist) {
  const h = String(hostname || "").trim().toLowerCase();
  if (!h) return false;
  for (const rule of allowlist) {
    if (!rule) continue;
    if (rule.startsWith("*.")) {
      const suffix = rule.slice(2);
      if (h === suffix || h.endsWith("." + suffix)) return true;
      continue;
    }
    if (rule.startsWith(".")) {
      const suffix = rule.slice(1);
      if (h === suffix || h.endsWith("." + suffix)) return true;
      continue;
    }
    if (h === rule) return true;
  }
  return false;
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== "GET" && event.httpMethod !== "HEAD") {
    return json(405, { ok: false, error: "Method Not Allowed" });
  }

  const raw = String((event.queryStringParameters && event.queryStringParameters.url) || "").trim();
  if (!raw) return json(400, { ok: false, error: "Missing url" });

  let target;
  try {
    target = new URL(raw);
  } catch {
    return json(400, { ok: false, error: "Invalid url" });
  }
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return json(400, { ok: false, error: "Only http/https allowed" });
  }

  const allowlist = getAllowlist();
  if (!isHostAllowed(target.hostname, allowlist)) {
    return json(403, { ok: false, error: "Host not allowed", host: target.hostname, allowlist });
  }

  const isHttps = target.protocol === "https:";
  const mod = isHttps ? https : http;
  const port = Number(target.port) || (isHttps ? 443 : 80);
  const timeoutMs = Number(process.env.IIF_FETCH_TIMEOUT_MS || 15000);
  const maxBytes = Number(process.env.IIF_FETCH_MAX_BYTES || 1_000_000);

  return await new Promise((resolve) => {
    const preq = mod.request(
      {
        hostname: target.hostname,
        port,
        path: target.pathname + target.search,
        method: "GET",
        headers: {
          "User-Agent": "iif-fund-demo-netlify-fetch/1.0",
          Accept: event.headers && event.headers.accept ? event.headers.accept : "*/*",
        },
        timeout: timeoutMs,
      },
      (pres) => {
        const ct = String(pres.headers["content-type"] || "application/octet-stream");
        let size = 0;
        const chunks = [];

        pres.on("data", (buf) => {
          size += buf.length;
          if (size > maxBytes) {
            pres.destroy();
            resolve(json(413, { ok: false, error: "Response too large", maxBytes }));
            return;
          }
          chunks.push(buf);
        });
        pres.on("end", () => {
          const body = Buffer.concat(chunks);
          resolve({
            statusCode: pres.statusCode || 200,
            headers: {
              "Content-Type": ct,
              "Cache-Control": "no-store",
              "Access-Control-Allow-Origin": "*",
              "X-IIF-Fetch-Host": target.hostname,
            },
            body: body.toString("utf8"),
          });
        });
      }
    );

    preq.on("timeout", () => {
      preq.destroy();
      resolve(json(504, { ok: false, error: "Fetch timeout" }));
    });
    preq.on("error", (e) => resolve(json(502, { ok: false, error: e.message })));
    preq.end();
  });
};

