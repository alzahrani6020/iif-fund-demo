/**
 * قراءة العدّ لمن يعرف VISITOR_STATS_SECRET (Netlify → Environment variables).
 * المتصفح: يعرض صفحة HTML واضحة. curl/API: أرسل Accept: application/json
 */
import { getStore } from "@netlify/blobs";

const STORE = "thiqqah-visitor-v1";
const KEY = "count";

function wantsHtml(request) {
  const q = new URL(request.url).searchParams.get("format");
  if (q === "json") return false;
  if (q === "html") return true;
  const accept = request.headers.get("accept") || "";
  return accept.includes("text/html");
}

function shellHtml({ title, inner, statusOk }) {
  const bg = statusOk
    ? "linear-gradient(165deg,#0a1820,#062824 50%,#0a1c18)"
    : "linear-gradient(165deg,#1a0a0a,#0f0808)";
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0; min-height: 100vh; display: grid; place-items: center;
      font-family: system-ui, "Segoe UI", Tahoma, sans-serif;
      background: ${bg};
      color: #f5efe0;
      padding: 24px;
    }
    .card {
      max-width: 420px; width: 100%;
      padding: 28px 26px;
      border-radius: 24px;
      background: linear-gradient(180deg, rgba(255,252,246,.08), rgba(255,245,220,.04));
      border: 1px solid rgba(212,175,95,.35);
      box-shadow: 0 24px 60px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.12);
    }
    h1 { margin: 0 0 12px; font-size: 1.15rem; font-weight: 800; color: #e8d5a8; }
    .num { font-size: 2.5rem; font-weight: 900; letter-spacing: .04em; color: #fff8e8;
      text-shadow: 0 2px 16px rgba(212,175,95,.35); font-variant-numeric: tabular-nums; }
    p { margin: 14px 0 0; line-height: 1.65; color: rgba(245,239,224,.82); font-size: .92rem; }
    code { display: block; margin-top: 16px; padding: 12px; border-radius: 12px;
      background: rgba(0,0,0,.25); font-size: .78rem; direction: ltr; text-align: left;
      color: #c9b896; word-break: break-all; }
  </style>
</head>
<body>
  <div class="card">${inner}</div>
</body>
</html>`;
}

export default async (request, context) => {
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(request.url);
  let keyParam = url.searchParams.get("key") || "";
  try {
    keyParam = decodeURIComponent(keyParam);
  } catch {
    /* ignore */
  }

  const secret = (process.env.VISITOR_STATS_SECRET || "").trim();
  const html = wantsHtml(request);

  if (!secret) {
    if (html) {
      const msg = shellHtml({
        title: "إعدادات العداد",
        statusOk: false,
        inner: `<h1>لم يُضبط السر بعد</h1>
        <p>أضف في Netlify المتغيّر <strong>VISITOR_STATS_SECRET</strong> ثم أعد النشر.</p>`,
      });
      return new Response(msg, {
        status: 503,
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
      });
    }
    return new Response(JSON.stringify({ error: "VISITOR_STATS_SECRET not set" }), {
      status: 503,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  if (keyParam !== secret) {
    if (html) {
      const body = shellHtml({
        title: "غير مسموح",
        statusOk: false,
        inner: `<h1>المفتاح غير صحيح</h1>
          <p>استخدم في الرابط نفس القيمة التي وضعتها في <strong>VISITOR_STATS_SECRET</strong> (وليس نص التوضيح من الدليل).</p>
          <p>يُفضّل مفتاحاً بالإنجليزي والأرقام فقط لتفادي مشاكل الترميز في الشريط.</p>`,
      });
      return new Response(body, {
        status: 403,
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
      });
    }
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  let count = 0;
  try {
    const store = getStore(STORE, { context });
    const raw = await store.get(KEY);
    if (raw != null) {
      const parsed = parseInt(String(raw), 10);
      if (Number.isFinite(parsed) && parsed >= 0) count = parsed;
    }
  } catch (err) {
    console.error("visitor-stats", err);
    const msg = html
      ? shellHtml({
          title: "خطأ",
          statusOk: false,
          inner: `<h1>تعذّر القراءة</h1>
            <p>تحقق من تفعيل <strong>Netlify Blobs</strong> وسجلات الدالة في لوحة Netlify.</p>
            <code>${String(err && err.message ? err.message : err)}</code>`,
        })
      : null;
    return new Response(msg || JSON.stringify({ error: "read_failed" }), {
      status: 500,
      headers: {
        "Content-Type": html ? "text/html; charset=utf-8" : "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  if (html) {
    const page = shellHtml({
      title: "عداد الزيارات",
      statusOk: true,
      inner: `<h1>عداد الزيارات (خاص)</h1>
        <div class="num" dir="ltr">${count}</div>
        <p>يُحسب تقريباً: جلسة متصفح واحدة لكل زيارة للصفحة الرئيسية. لا يظهر هذا للزوار.</p>
        <p><small>للاستجابة JSON: أضف <code dir="ltr" style="display:inline;margin:0;padding:2px 6px">?format=json</code> مع نفس المفتاح.</small></p>`,
    });
    return new Response(page, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  return new Response(JSON.stringify({ count }, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
};
