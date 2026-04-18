/**
 * يضبط متغيرات بيئة **الموقع** على Netlify (SearXNG + اختياري مترجم) عبر REST API.
 * لا يُشغَّل في CI بدون أسرار — آمن للمستودع.
 *
 * متطلّبات البيئة:
 *   NETLIFY_AUTH_TOKEN  — Netlify → User settings → Applications → Personal access tokens
 *   NETLIFY_SITE_ID     — Site settings → Site details → Site ID
 *
 * اختياري:
 *   SEARXNG_URL_VALUE           (افتراضي: https://searx.tiekoetter.com)
 *   IIF_TRANSLATE_URL_VALUE     — إن وُجد يُضاف/يُحدَّث؛ إن تُرك فارغاً لا يُمسّ المفتاح الحالي
 *   IIF_NETLIFY_ENV_DRY=1       — طباعة فقط بدون تعديل
 *   IIF_NETLIFY_TRIGGER_BUILD=1 — بعد النجاح يطلب build جديداً (يستهلك دقائق بناء)
 *
 * الاستخدام:
 *   $env:NETLIFY_AUTH_TOKEN="..."; $env:NETLIFY_SITE_ID="..."; node scripts/netlify-upsert-site-env.mjs
 */
const API = "https://api.netlify.com/api/v1";

const token = String(process.env.NETLIFY_AUTH_TOKEN || "").trim();
const siteId = String(process.env.NETLIFY_SITE_ID || "").trim();
const dry = String(process.env.IIF_NETLIFY_ENV_DRY || "").trim() === "1";
const triggerBuild = String(process.env.IIF_NETLIFY_TRIGGER_BUILD || "").trim() === "1";

const searxValue = String(process.env.SEARXNG_URL_VALUE || "https://searx.tiekoetter.com").trim();
const translateValue = String(process.env.IIF_TRANSLATE_URL_VALUE || "").trim();

/** رؤوس HTTP (مثل Authorization) لا تقبل إلا ASCII — الأحرف العربية تسبب خطأ ByteString في Node. */
function isAsciiOnly(s) {
  if (!s) return true;
  for (let i = 0; i < s.length; i++) {
    if (s.charCodeAt(i) > 127) return false;
  }
  return true;
}

function authHeaders() {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
  };
}

async function apiFetch(path, opts = {}) {
  const url = path.startsWith("http") ? path : `${API}${path}`;
  const res = await fetch(url, { ...opts, headers: { ...authHeaders(), ...(opts.headers || {}) } });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { _raw: text };
  }
  return { res, json, text };
}

async function getSite() {
  const { res, json } = await apiFetch(`/sites/${encodeURIComponent(siteId)}`, { method: "GET" });
  if (!res.ok) {
    throw new Error(`getSite HTTP ${res.status}: ${json && json.message ? json.message : res.statusText}`);
  }
  return json;
}

async function resolveAccount(site) {
  let a = site && (site.account_slug || site.account_id);
  if (a) return String(a);
  const { res, json } = await apiFetch("/user", { method: "GET" });
  if (res.ok && json && Array.isArray(json.accounts) && json.accounts[0]) {
    return String(json.accounts[0].slug || json.accounts[0].id || "");
  }
  throw new Error("لم يُعثر على account_slug — راجع NETLIFY_SITE_ID أو صلاحية الرمز.");
}

async function envVarExists(account, key) {
  const q = new URLSearchParams({ site_id: siteId });
  const { res } = await apiFetch(
    `/accounts/${encodeURIComponent(account)}/env/${encodeURIComponent(key)}?${q.toString()}`,
    { method: "GET" }
  );
  return res.status === 200;
}

/** إنشاء أو استبدال قيمة المفتاح على مستوى الموقع */
async function upsertSiteEnv(account, key, value) {
  const q = new URLSearchParams({ site_id: siteId });
  const base = `/accounts/${encodeURIComponent(account)}/env`;
  const exists = await envVarExists(account, key);

  const scopes = ["builds", "functions", "runtime", "post-processing"];
  const bodyCreate = [
    {
      key,
      scopes,
      values: [{ context: "all", value: String(value) }],
      is_secret: false,
    },
  ];
  const bodyPut = {
    key,
    scopes,
    values: [{ context: "all", value: String(value) }],
    is_secret: false,
  };

  if (exists) {
    let { res, json } = await apiFetch(`${base}/${encodeURIComponent(key)}?${q.toString()}`, {
      method: "PUT",
      body: JSON.stringify(bodyPut),
    });
    if (!res.ok && res.status === 422) {
      const minimalPut = { key, values: [{ context: "all", value: String(value) }], is_secret: false };
      ({ res, json } = await apiFetch(`${base}/${encodeURIComponent(key)}?${q.toString()}`, {
        method: "PUT",
        body: JSON.stringify(minimalPut),
      }));
    }
    if (!res.ok) {
      throw new Error(`PUT env ${key} HTTP ${res.status}: ${json && json.message ? json.message : res.statusText}`);
    }
    return "updated";
  }

  let { res, json } = await apiFetch(`${base}?${q.toString()}`, {
    method: "POST",
    body: JSON.stringify(bodyCreate),
  });
  if (!res.ok && res.status === 422) {
    const minimal = [{ key, values: [{ context: "all", value: String(value) }], is_secret: false }];
    ({ res, json } = await apiFetch(`${base}?${q.toString()}`, {
      method: "POST",
      body: JSON.stringify(minimal),
    }));
  }
  if (!res.ok) {
    throw new Error(`POST env ${key} HTTP ${res.status}: ${json && json.message ? json.message : res.statusText}`);
  }
  return "created";
}

async function triggerSiteBuild() {
  const { res, json } = await apiFetch(`/sites/${encodeURIComponent(siteId)}/builds`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    throw new Error(`trigger build HTTP ${res.status}: ${json && json.message ? json.message : res.statusText}`);
  }
  return json;
}

async function main() {
  if (!token || !siteId) {
    console.log("SKIP  netlify-upsert-site-env — اضبط NETLIFY_AUTH_TOKEN و NETLIFY_SITE_ID.");
    console.log("      مثال (PowerShell):");
    console.log('        $env:NETLIFY_AUTH_TOKEN="..." ; $env:NETLIFY_SITE_ID="..." ; node scripts/netlify-upsert-site-env.mjs');
    process.exit(0);
  }

  if (!isAsciiOnly(token)) {
    console.error(
      "FAIL  NETLIFY_AUTH_TOKEN يحتوي على أحرف غير ASCII (مثل العربية).\n" +
        "      الصِق الرمز الحقيقي من Netlify (User settings → Applications → Personal access tokens).\n" +
        "      لا تستخدم النص التوضيحي «رمز_الوصول_الشخصي» — استبدله بالرمز الفعلي (يُشبه nfp_... أو حروف/أرقام إنجليزية)."
    );
    process.exit(1);
  }
  if (!isAsciiOnly(siteId)) {
    console.error(
      "FAIL  NETLIFY_SITE_ID يجب أن يكون المعرف الحقيقي للموقع (UUID/حروف إنجليزية وأرقام وشرطات فقط).\n" +
        "      لا تستخدم «معرّف_الموقع» بالعربية — انسخ Site ID من Netlify → Site configuration → Site details."
    );
    process.exit(1);
  }
  if (translateValue && !isAsciiOnly(translateValue)) {
    console.error("FAIL  IIF_TRANSLATE_URL_VALUE يجب أن يكون عنوان https://... باللاتينية فقط (ASCII).");
    process.exit(1);
  }
  if (!isAsciiOnly(searxValue)) {
    console.error("FAIL  SEARXNG_URL_VALUE يجب أن يكون عنوان https://... باللاتينية فقط.");
    process.exit(1);
  }

  const site = await getSite();
  const account = await resolveAccount(site);
  console.log("Site:", site.name || siteId, "| account:", account, dry ? "(DRY RUN)" : "");

  const plan = [{ key: "SEARXNG_URL", value: searxValue }];
  if (translateValue) {
    plan.push({ key: "IIF_TRANSLATE_URL", value: translateValue });
  }

  for (const row of plan) {
    if (dry) {
      console.log("DRY  would upsert", row.key, "=", row.value);
      continue;
    }
    const action = await upsertSiteEnv(account, row.key, row.value);
    console.log("OK  ", row.key, "—", action);
  }

  if (dry) {
    console.log("DRY  done — لم يُجرَ أي تعديل.");
    process.exit(0);
  }

  if (triggerBuild) {
    const b = await triggerSiteBuild();
    console.log("OK  build requested:", b && b.id ? b.id : "(see response)");
  } else {
    console.log("NOTE  لتطبيق المتغيرات على الدوال غالباً تحتاج «Deploy» جديداً في Netlify (أو عيّن IIF_NETLIFY_TRIGGER_BUILD=1).");
  }
}

main().catch((e) => {
  console.error("FAIL ", e && e.message ? e.message : e);
  process.exit(1);
});
