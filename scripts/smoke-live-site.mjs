/**
 * فحص خفيف لموقع منشور — لا يُفترض تشغيله في CI بدون PROXY_BASE.
 * يتحقق من صفحة البحث الموحّدة ومن /api/searx؛ الترجمة تحذير فقط إن فشلت (الموقع يبقى صالحاً للبحث).
 *
 *   PowerShell: $env:PROXY_BASE="https://yoursite.netlify.app"; npm run smoke:live
 */
const raw = (process.env.PROXY_BASE || "").trim().replace(/\/+$/, "");
if (!raw) {
  console.log("SKIP  smoke:live — لم يُضبط PROXY_BASE.");
  console.log("      مثال: $env:PROXY_BASE=\"https://yoursite.netlify.app\"; npm run smoke:live");
  process.exit(0);
}

let base;
try {
  base = new URL(raw);
} catch {
  console.error("FAIL  PROXY_BASE غير صالح:", raw);
  process.exit(1);
}

const timeoutMs = Number(process.env.IIF_SMOKE_LIVE_MS || 25000);
function reqSignal() {
  return AbortSignal.timeout(timeoutMs);
}

async function getOk(path) {
  const u = new URL(path, base);
  const res = await fetch(u, {
    method: "GET",
    redirect: "follow",
    signal: reqSignal(),
    headers: { Accept: "text/html,*/*" },
  });
  return { res, u };
}

try {
  const page = await getOk("/financial-consulting/iif-fund-demo/web-search.html");
  if (page.res.status !== 200) {
    console.error("FAIL  صفحة البحث الموحّدة:", page.res.status, page.u.href);
    process.exit(1);
  }
  const html = await page.res.text();
  if (html.length < 200 || !/iif-ws-form|web-search|بحث الويب/i.test(html)) {
    console.error("FAIL  محتوى صفحة البحث يبدو غير كامل أو غير متوقع.");
    process.exit(1);
  }
  console.log("OK  صفحة web-search.html — HTTP", page.res.status);

  const searxUrl = new URL("/api/searx/search?q=smoke-test&format=json", base);
  const sres = await fetch(searxUrl, {
    method: "GET",
    redirect: "follow",
    signal: reqSignal(),
    headers: { Accept: "application/json" },
  });
  if (sres.status === 429) {
    console.warn("WARN  /api/searx/search — HTTP 429 (Rate limited).");
    console.warn("      هذا يعني أن البروكسي يعمل لكن مثيل SearXNG الخارجي يحد المعدل. جرّب لاحقاً أو استخدم مثيلك الخاص.");
    console.log("OK  smoke:live اكتمل لـ", base.origin);
    process.exit(0);
  }
  if (sres.status === 501) {
    console.error("FAIL  SearXNG غير مضبوط على الخادم (501).");
    process.exit(1);
  }
  if (sres.status >= 500) {
    console.error("FAIL  /api/searx/search — HTTP", sres.status, searxUrl.href);
    process.exit(1);
  }
  if (sres.status >= 400) {
    console.error("FAIL  /api/searx/search — HTTP", sres.status);
    process.exit(1);
  }
  const sjson = await sres.json().catch(() => null);
  if (!sjson || typeof sjson !== "object") {
    console.error("FAIL  استجابة SearX ليست JSON صالحاً.");
    process.exit(1);
  }
  if (sjson.ok === false && sjson.error) {
    console.error("FAIL  SearX أعاد خطأ:", sjson.error);
    process.exit(1);
  }
  if (!Array.isArray(sjson.results)) {
    console.warn("WARN  حقل results غير مصفوفة — قد يكون شكل الاستجابة مختلفاً؛ لكن HTTP ناجح.");
  }
  console.log("OK  /api/searx/search — HTTP", sres.status);

  const trUrl = new URL("/api/translate", base);
  const tres = await fetch(trUrl, {
    method: "POST",
    redirect: "follow",
    signal: reqSignal(),
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ text: "ok", target_lang: "arb_Arab", source_lang: "eng_Latn" }),
  });
  const tjson = await tres.json().catch(() => ({}));
  if (!tres.ok || !tjson.ok) {
    console.warn("WARN  /api/translate — HTTP", tres.status, "— البحث قد يعمل بدون ترجمة كاملة.");
  } else {
    console.log("OK  /api/translate — HTTP", tres.status);
  }

  console.log("OK  smoke:live اكتمل لـ", base.origin);
  process.exit(0);
} catch (e) {
  console.error("FAIL  استثناء أثناء الفحص:", e && e.message ? e.message : e);
  process.exit(1);
}
