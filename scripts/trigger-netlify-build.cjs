/**
 * يطلق نشراً جديداً على Netlify.
 *
 * الطريقة الموصى بها (تعمل مع netlify login بدون PAT):
 *   أنشئ Build hook من: Site → Build & deploy → Build hooks
 *   ثم عيّن (مرة واحدة في PowerShell أو في ملف .env محلي غير مرفوع):
 *     $env:NETLIFY_BUILD_HOOK_URL = "https://api.netlify.com/build_hooks/xxxxxxxx"
 *   ثم: npm run netlify:build:trigger
 *
 * بديل (مفيد إذا كان الموقع غير مربوط بـ Git و build hook لا يشغّل بناء فعلي):
 *   يرفع zip للمستودع إلى Build API لتشغيل build وتجميع Functions.
 *   المتطلبات:
 *     - NETLIFY_SITE_ID (مثال: 4d4c58f4-8834-4567-afa9-849abc535ea4)
 *     - NETLIFY_AUTH_TOKEN (اختياري؛ إن لم يُضبط نحاول قراءته من netlify login local config)
 *   اختياري:
 *     - NETLIFY_BUILD_ZIP: مسار ملف zip جاهز (بدلاً من git archive)
 *     - NETLIFY_BUILD_BRANCH: الفرع (افتراضي: main)
 *     - NETLIFY_BUILD_TITLE: عنوان البناء
 *
 * اختياري: ?clear_cache=true يُضاف تلقائياً إذا عيّنت NETLIFY_BUILD_CLEAR_CACHE=1
 */
const https = require("https");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

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

function maybeGetNetlifyTokenFromLocalConfig() {
  // netlify login يضع token محلياً. لا نطبع أي شيء منه.
  try {
    const appData =
      process.env.APPDATA ||
      (process.platform === "win32" ? path.join(os.homedir(), "AppData", "Roaming") : "");
    if (!appData) return "";
    const cfgPath = path.join(appData, "netlify", "Config", "config.json");
    if (!fs.existsSync(cfgPath)) return "";
    const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
    const users = cfg && cfg.users ? Object.values(cfg.users) : [];
    const first = users && users[0] ? users[0] : null;
    const token = first && first.auth && first.auth.token ? String(first.auth.token) : "";
    return token.trim();
  } catch {
    return "";
  }
}

function buildMultipartBody({ title, zipBuffer }) {
  const boundary = "----iifNetlifyBoundary" + Math.random().toString(36).slice(2);
  const chunks = [];

  if (title) {
    chunks.push(Buffer.from(`--${boundary}\r\n`));
    chunks.push(Buffer.from(`Content-Disposition: form-data; name="title"\r\n\r\n${title}\r\n`));
  }

  chunks.push(Buffer.from(`--${boundary}\r\n`));
  chunks.push(
    Buffer.from(
      `Content-Disposition: form-data; name="zip"; filename="site.zip"\r\nContent-Type: application/zip\r\n\r\n`
    )
  );
  chunks.push(zipBuffer);
  chunks.push(Buffer.from(`\r\n--${boundary}--\r\n`));

  return { boundary, body: Buffer.concat(chunks) };
}

function createZipFromGitArchive(cwd) {
  const out = path.join(os.tmpdir(), `iif-netlify-upload-${Date.now()}.zip`);
  execFileSync("git", ["archive", "-o", out, "HEAD"], { cwd, stdio: "ignore" });
  const buf = fs.readFileSync(out);
  try {
    fs.unlinkSync(out);
  } catch {
    // best-effort cleanup
  }
  return buf;
}

async function postBuildZip({ siteId, token, zipBuffer, branch, title }) {
  const u = new URL(`https://api.netlify.com/api/v1/sites/${siteId}/builds`);
  if (clearCache && !u.searchParams.has("clear_cache")) u.searchParams.set("clear_cache", "true");
  if (branch) u.searchParams.set("branch", branch);
  if (title) u.searchParams.set("title", title);

  const { boundary, body } = buildMultipartBody({ title: "", zipBuffer });

  return await new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
          "Content-Length": body.length,
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
    req.write(body);
    req.end();
  });
}

async function main() {
  const hasValidHook = hookUrl && /^https:\/\/api\.netlify\.com\/build_hooks\//i.test(hookUrl);
  const siteId = String(process.env.NETLIFY_SITE_ID || "").trim();

  // 1) Prefer build hook if provided.
  if (hasValidHook) {
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

  try {
    // 2) Fallback: Build API (zip upload) to actually run a build (Functions included).
    if (!siteId) {
      console.error(
        "FAIL  لم يُضبط NETLIFY_BUILD_HOOK_URL ولا NETLIFY_SITE_ID.\n" +
          "      خيار 1 (Build hook):\n" +
          '        $env:NETLIFY_BUILD_HOOK_URL="https://api.netlify.com/build_hooks/..."\n' +
          "        npm run netlify:build:trigger\n" +
          "      خيار 2 (Build API):\n" +
          '        $env:NETLIFY_SITE_ID="..."\n' +
          '        $env:NETLIFY_AUTH_TOKEN="..."  (أو نفّذ netlify login محلياً)\n' +
          "        npm run netlify:build:trigger\n"
      );
      process.exit(1);
    }

    const token = String(process.env.NETLIFY_AUTH_TOKEN || "").trim() || maybeGetNetlifyTokenFromLocalConfig();
    if (!token) {
      console.error(
        "FAIL  لم أجد NETLIFY_AUTH_TOKEN، ولم أتمكن من قراءة token من netlify login.\n" +
          "      نفّذ netlify login أو عيّن NETLIFY_AUTH_TOKEN (محلياً فقط)."
      );
      process.exit(1);
    }

    const zipPath = String(process.env.NETLIFY_BUILD_ZIP || "").trim();
    const branch = String(process.env.NETLIFY_BUILD_BRANCH || "main").trim();
    const title =
      String(process.env.NETLIFY_BUILD_TITLE || "").trim() ||
      `manual-build-${new Date().toISOString().slice(0, 19)}`;

    const zipBuffer = zipPath
      ? fs.readFileSync(zipPath)
      : createZipFromGitArchive(process.cwd());

    const { status, text } = await postBuildZip({
      siteId,
      token,
      zipBuffer,
      branch,
      title,
    });

    if (status >= 200 && status < 300) {
      console.log("OK  طُلب build جديد عبر Build API — HTTP", status);
      if (text && text.length < 1200) console.log(text);
      process.exit(0);
    }

    console.error("FAIL  Build API — HTTP", status);
    console.error(text.slice(0, 1200));
    process.exit(1);
  } catch (e) {
    console.error("FAIL ", e && e.message ? e.message : e);
    process.exit(1);
  }
}

main();
