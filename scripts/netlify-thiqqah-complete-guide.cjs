/**
 * دليل إكمال ربط thiqqah.live بموقع Netlify المستقل — يفتح الروابط ثم يشغّل الفحص.
 * الاستخدام: npm run netlify:thiqqah:complete
 */
const { exec, spawnSync } = require("child_process");
const path = require("path");

const deployUrl =
  "https://app.netlify.com/start/deploy?repository=https://github.com/alzahrani6020/iif-web&base=thiqqah-site";
const teamProjects = "https://app.netlify.com/teams/dr-talal/projects";
const docPath = path.join(__dirname, "..", "NETLIFY-THIQQAH-STANDALONE.md");

function open(url) {
  if (process.platform === "win32") exec(`start "" "${url}"`);
  else if (process.platform === "darwin") exec(`open "${url}"`);
  else exec(`xdg-open "${url}" || true`);
}

function main() {
  console.log(`
=== إكمال دومين ثقة (thiqqah.live) — لا يُغلق من الكود وحده ===
يجب تنفيذ الخطوات في Netlify ومسجّل الدومين من حسابك.

1) أنشئ موقعاً جديداً (يفتح المتصفح):
   • Base directory: thiqqah-site
   • Publish directory: .
2) بعد أول نشر ناجح:
   Domain management → أضف thiqqah.live و www.thiqqah.live على هذا الموقع فقط.
3) على أي موقع Netlify آخر كان مربوطاً بـ thiqqah.live:
   احذف الدومين من Domain management هناك (تعارض يسبب سلوكاً خاطئاً).
4) DNS عند المسجّل: انسخ القيم التي يعرضها Netlify للموقع الجديد.
5) تحقق: npm run verify:thiqqah:live-domain

الملف التفصيلي: ${docPath}
`);

  console.log("جارٍ فتح: نشر بـ base=thiqqah-site، ثم قائمة المشاريع…\n");
  open(deployUrl);
  setTimeout(() => open(teamProjects), 1200);

  const verify = path.join(__dirname, "verify-thiqqah-live-domain.mjs");
  console.log("— فحص الإنتاج الحالي لـ thiqqah.live —\n");
  const r = spawnSync(process.execPath, [verify], { stdio: "inherit", cwd: path.join(__dirname, "..") });
  const code = r.status;
  if (code === 0) {
    console.log("\n✓ فحص thiqqah.live نجح من الطرفية — راجع الصفحة في المتصفح للتأكد.\n");
    return;
  }
  if (code != null) {
    console.log(
      "\nما زال الفحص يُظهر خللاً: أكمل الخطوات 1–4 في Netlify ومسجّل الدومين ثم أعد: npm run verify:thiqqah:live-domain\n",
    );
    process.exit(code);
  }
}

main();
