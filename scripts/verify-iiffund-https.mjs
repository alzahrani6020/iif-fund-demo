/**
 * فحص سريع لاتصال HTTPS على iiffund.com (شهادة / TLS / توجيه).
 * الاستخدام: npm run verify:iiffund:https
 */
const URLS = ["https://iiffund.com/", "https://iiffund.com/thiqqah-site/index.html"];

async function one(url) {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
      headers: { Accept: "text/html,*/*" },
    });
    const len = res.headers.get("content-length");
    const loc = res.headers.get("location");
    console.log(`  ${url}`);
    console.log(`    HTTP ${res.status}${loc ? ` → ${loc}` : ""}${len ? ` | Content-Length: ${len}` : ""}\n`);
    return true;
  } catch (e) {
    const msg = e && e.cause && e.cause.message ? e.cause.message : e && e.message ? e.message : String(e);
    console.error(`  ${url}`);
    console.error(`    فشل: ${msg}\n`);
    return false;
  }
}

async function main() {
  console.log("verify-iiffund-https — فحص TLS/HTTPS\n");
  let ok = true;
  for (const u of URLS) {
    if (!(await one(u))) ok = false;
  }
  if (!ok) {
    console.log("— إن ظهر فشل في TLS — راجع NETLIFY-CHECKLIST.md (قسم 8) ولوحة Netlify / DNS.");
    process.exitCode = 1;
  } else {
    console.log("— نجح الاتصال بـ HTTPS من هذه البيئة.");
  }
}

main();
