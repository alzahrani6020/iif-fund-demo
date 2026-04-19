/**
 * يطلق نشراً جديداً على Netlify.
 *
 * الطريقة الموصى بها (تعمل مع netlify login بدون PAT):
 *   أنشئ Build hook من: Site → Build & deploy → Build hooks
 *   ثم عيّن (مرة واحدة في PowerShell أو في ملف .env محلي غير مرفوع):
 *     $env:NETLIFY_BUILD_HOOK_URL = "https://api.netlify.com/build_hooks/xxxxxxxx"
 *   ثم: npm run netlify:build:trigger
 *
 * اختياري: ?clear_cache=true يُضاف تلقائياً إذا عيّنت NETLIFY_BUILD_CLEAR_CACHE=1
 */
const https = require("https");

const hookUrl =
  String(process.env.NETLIFY_BUILD_HOOK_URL || process.env.NETLIFY_BUILD_HOOK || "").trim();
const clearCache = String(process.env.NETLIFY_BUILD_CLEAR_CACHE || "").trim() === "1";

function postUrl(urlStr, body) {
  const u = new URL(urlStr);
  if (clearCache && !u.searchParams.has("clear_cache")) {
    u.searchParams.set("clear_cache", "true");
  }
  const payload = body != null ? String(body) : "{}";
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          resolve({ status: res.statusCode || 0, text });
        });
      }
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  if (!hookUrl || !/^https:\/\/api\.netlify\.com\/build_hooks\//i.test(hookUrl)) {
    console.error(
      "FAIL  لم يُضبط NETLIFY_BUILD_HOOK_URL.\n" +
        "      1) Netlify → Site → Build & deploy → Build hooks → Add build hook\n" +
        "      2) انسخ الرابط (يبدأ بـ https://api.netlify.com/build_hooks/)\n" +
        "      3) PowerShell:\n" +
        '         $env:NETLIFY_BUILD_HOOK_URL = "https://api.netlify.com/build_hooks/..."\n' +
        "         npm run netlify:build:trigger\n" +
        "      اختياري لتفريغ الكاش: $env:NETLIFY_BUILD_CLEAR_CACHE = \"1\""
    );
    process.exit(1);
  }

  try {
    const { status, text } = await postUrl(hookUrl, "{}");
    if (status >= 200 && status < 300) {
      console.log("OK  طُلب نشر جديد عبر Build hook — HTTP", status);
      if (text && text.length < 500) console.log(text);
      process.exit(0);
    }
    console.error("FAIL  HTTP", status);
    console.error(text.slice(0, 800));
    process.exit(1);
  } catch (e) {
    console.error("FAIL ", e && e.message ? e.message : e);
    process.exit(1);
  }
}

main();
