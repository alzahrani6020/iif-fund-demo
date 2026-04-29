/**
 * يتحقق من أن thiqqah.live يشير إلى نشرة تحتوي موقع ثقة (وليس نشرة ناقصة أو خاطئة).
 * الاستخدام: npm run verify:thiqqah:live-domain
 */
const ORIGIN = "https://thiqqah.live";

const PATHS = [
  { path: "/", label: "جذر الدومين" },
  { path: "/thiqqah-site/index.html", label: "مسار ثقة داخل نشرة الجذر الكامل" },
  {
    path: "/financial-consulting/iif-fund-demo/index.html",
    label: "واجهة الصندوق (يجب ألا تُعرض على دومين ثقة بعد الفصل)",
  },
];

async function probe(url) {
  const res = await fetch(url, {
    method: "HEAD",
    redirect: "manual",
    headers: { Accept: "text/html,*/*" },
  });
  const len = res.headers.get("content-length");
  const loc = res.headers.get("location");
  const contentLength = len != null ? parseInt(String(len), 10) : null;
  return {
    status: res.status,
    contentLength: Number.isFinite(contentLength) ? contentLength : null,
    location: loc,
  };
}

function fmtBytes(status, n) {
  if (n == null || Number.isNaN(n)) return "؟";
  if (status === 404) return `${n} B (غالباً صفحة خطأ — الملف غير منشور على هذه النشرة)`;
  if (n < 12_000) return `${n} B (صغير — غالباً بوابة IIF وليس صفحة ثقة كاملة)`;
  if (n < 50_000) return `${n} B`;
  return `${Math.round(n / 1024)} KB`;
}

function main() {
  console.log("verify-thiqqah-live-domain — يفحص الإنتاج على", ORIGIN, "\n");
}

async function run() {
  main();
  for (const { path, label } of PATHS) {
    const url = `${ORIGIN}${path}`;
    try {
      const { status, contentLength, location } = await probe(url);
      const line1 = `  ${label}`;
      const line2 = `    ${url}`;
      const line3 = `    HTTP ${status}${location ? ` → ${location}` : ""} | Content-Length: ${fmtBytes(status, contentLength)}`;
      console.log(line1 + "\n" + line2 + "\n" + line3 + "\n");
    } catch (e) {
      console.error(`  فشل الطلب: ${url}\n    ${e && e.message ? e.message : e}\n`);
    }
  }

  console.log("— تفسير مختصر —");
  console.log(
    "• إن كان /thiqqah-site/index.html يعطي 404 بينما مسار الصندوق يعطي 200 بحجم كبير، فالدومين مربوط بنشرة لا تتضمن مجلد thiqqah-site (أو موقع Netlify قديم/خاطئ).",
  );
  console.log(
    "• الحل: موقع Netlify ثانٍ من Base directory = thiqqah-site (انظر NETLIFY-THIQQAH-STANDALONE.md)، أو نشر كامل من جذر الريبو ثم إعادة ربط الدومين بعد التأكد أن الملفات موجودة في النشر.",
  );
  console.log(
    "• بعد الفصل الصحيح (موقع ثقة مستقل): الجذر يعيد HTML كبيراً لصفحة ثقة ولا يوجد مسار /financial-consulting/ على هذه النشرة.",
  );
}

run();
