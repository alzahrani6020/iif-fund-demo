/**
 * فحص إنتاج الدومينين: HTTPS لـ iiffund.com وفصل thiqqah.live.
 * الاستخدام: npm run verify:production-domains
 */
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const isWin = process.platform === "win32";

function runNpmScript(name) {
  const r = spawnSync(isWin ? "npm.cmd" : "npm", ["run", name], {
    cwd: root,
    stdio: "inherit",
    shell: isWin,
  });
  if (r.error) {
    console.error(r.error.message || r.error);
    return false;
  }
  return r.status === 0;
}

console.log("verify-production-domains — iiffund.com ثم thiqqah.live\n");

let ok = true;
console.log("— 1) iiffund.com (HTTPS) —\n");
if (!runNpmScript("verify:iiffund:https")) ok = false;

console.log("\n— 2) thiqqah.live (فصل عن الصندوق) —\n");
if (!runNpmScript("verify:thiqqah:live-domain")) ok = false;

if (ok) {
  console.log("\n✓ كلا الفحصين نجحا — راجع المتصفح للتأكد البصري.\n");
} else {
  console.log(
    "\n✗ يوجد فصل أو TLS ناقص — راجع DOMINI-IIFFUND-THIQQAH.md ولوحات Netlify / Name.com.\n",
  );
  process.exit(1);
}
