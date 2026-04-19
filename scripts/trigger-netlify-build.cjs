/**
 * يطلب من Netlify إنشاء build للموقع المرتبط (يتجنب مشاكل اقتباس JSON في PowerShell).
 * الاستخدام: node scripts/trigger-netlify-build.cjs
 * اختياري: SITE_ID كوسيط أو NETLIFY_SITE_ID في البيئة.
 */
const { spawnSync } = require("child_process");
const path = require("path");

const siteId =
  process.argv[2] ||
  String(process.env.NETLIFY_SITE_ID || "").trim() ||
  "4d4c58f4-8834-4567-afa9-849abc535ea4";

const data = JSON.stringify({ site_id: siteId });
const cwd = path.join(__dirname, "..");
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

const r = spawnSync(npx, ["netlify-cli", "api", "createSiteBuild", "--data", data], {
  cwd,
  encoding: "utf8",
  shell: false,
  env: process.env,
});

if (r.stdout) process.stdout.write(r.stdout);
if (r.stderr) process.stderr.write(r.stderr);
if (r.error) {
  console.error(r.error.message || r.error);
  process.exit(1);
}
process.exit(r.status === null ? 1 : r.status);
