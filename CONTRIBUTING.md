# المساهمة والتشغيل — iif-fund-demo

## المتطلبات

- Node.js **22+** (مطابق لـ `engines` في `package.json`)

## التثبيت

```bash
npm ci
```

## التطوير المحلي

1. تشغيل الخادم:

   ```bash
   npm start
   ```

   يعمل عادة على `http://127.0.0.1:3333`.

2. اختصارات مفيدة:

   - واجهة الصندوق الرئيسية: `/` أو  
     `/financial-consulting/iif-fund-demo/index.html`
   - لوحة التحكم (محلي): `/cp` أو `/dashboard` أو ملف  
     `OPEN-ADMIN-DASHBOARD.bat` في جذر المشروع.

## فحوصات الجودة (قبل الدمج أو النشر)

| الأمر | الوظيفة |
|--------|---------|
| `npm run verify` | بناء `government-data` + التحقق من صياغة السكربتات |
| `npm run maintenance:audit` | صياغة JS + JSON + روابط داخلية (بدون خادم) |
| `npm run health` | يتطلب `npm start` في نافذة أخرى: تدقيق + `check-urls` + `smoke` |
| `npm run maintenance:full` | `verify` + تدقيق كامل + `smoke-with-server` + `check-urls` |

### روابط خارجية (اختياري، يعتمد على الشبكة)

```bash
node scripts/maintenance-full-audit.mjs --external
```

لجعل فشل أي رابط خارجي يوقف الخروج بخطأ:

```bash
# Linux / macOS
EXTERNAL_URL_STRICT=1 node scripts/maintenance-full-audit.mjs --external
```

```powershell
# Windows PowerShell
$env:EXTERNAL_URL_STRICT='1'; node scripts/maintenance-full-audit.mjs --external
```

## مسار الإنتاج

الواجهة المعتمدة: **`financial-consulting/iif-fund-demo/index.html`** مع الأصول تحت  
`financial-consulting/iif-fund-demo/assets/`.

مجلد **`archive/`** يحتوي نسخ HTML قديمة للمرجع فقط — لا يُستخدم في النشر.

## CI

عند الدفع إلى `main` أو `master` أو عند فتح Pull Request، يعمل GitHub Actions  
(`.github/workflows/ci.yml`).

### فحوصات مطلوبة على الفرع `main`

قبل دمج Pull Request يجب أن تنجح المهمتان التاليتان (مفعّلة في **Branch protection**):

| الفحص | الوصف |
|--------|--------|
| **`CI / verify`** | `npm ci` في الجذر، ثم `npm run verify`، `maintenance-full-audit`، مزامنة حزم i18n، `check:deploy`، تدقيق SearX، و`check-i18n-keys --strict`. |
| **`CI / IIF public site (anchors + Playwright + a11y)`** | بعد نجاح `verify`: في `financial-consulting/iif-fund-demo` يُشغَّل `npm run test:site` (مراسي ثابتة، E2E، وaxe محدود النطاق على `#trust-entry` و`#contact` و`#partners-trust`). |

تشغيل محلي مكافئ لاختبارات موقع الصندوق (من جذر المستودع):

```bash
npm run test:iif-site
```

أو من المجلد الفرعي:

```bash
cd financial-consulting/iif-fund-demo
npm run test:site
```

متغيرات مفيدة: `SKIP_PLAYWRIGHT_INSTALL=1` عند `npm ci` إن كنت تثبّت المتصفحات يدوياً؛ `PLAYWRIGHT_BASE_URL` لتوجيه E2E نحو خادم محلي غير الافتراضي (انظر `playwright.config.cjs`).

**حماية الفرع `main`:** اضبط فحصين مطلوبين كما في [docs/BRANCH-PROTECTION.md](./docs/BRANCH-PROTECTION.md).

**Lighthouse (إعلامي):** سير العمل [`.github/workflows/lighthouse-scheduled.yml`](./.github/workflows/lighthouse-scheduled.yml) يشغّل تقريراً شهرياً على URL نشر GitHub Pages ويرفع `reports/lh-latest.html` كـ artifact — لا يُشترط لدمج PR.
