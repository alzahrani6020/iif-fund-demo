# IIF Fund Demo — المنصة الحكومية + الصندوق

> **محرك البحث (SearXNG)** في `engines/searxng/` — يشغّل **Tor + SearXNG** عبر Docker؛ على **جهاز التطوير** (`npm start`) يُربَط بالمنصة عبر **`/api/searx`**. على **Netlify** يبقى **بحث الجهات محلياً** ما لم يُضف لاحقاً خادم/بروكسي للمحرك.

## الرؤية / Vision

**العربية:** نعمل لخدمة المستخدمين في مختلف أنحاء العالم، مع احترام تنوّع الثقافات والأنظمة القانونية، ونسعى لتقديم خدمة تُفيد البشرية بشفافية ومسؤولية — بما يتوافق مع الخصوصية والامتثال حيثما ينطبق.

**English:** We build for people everywhere, honoring diverse cultures and legal frameworks, and we strive to deliver services that serve humanity with transparency and responsibility — aligned with privacy and compliance where it applies.

**ماذا تفعل أنت على جهازك وحساباتك حتى يكون كل شيء جاهزاً للبدء:** [للبدء-ما-عليك-أنت.md](./للبدء-ما-عليك-أنت.md)

**للمبتدئين — رفع المشروع إلى GitHub ثم Netlify (بدون مصطلحات معقدة):** [دليل-المبتدئ-النشر.md](./دليل-المبتدئ-النشر.md)

**قبل إصدار أو رابط رسمي:** [docs/PRE-RELEASE-CHECKLIST.md](./docs/PRE-RELEASE-CHECKLIST.md) · **حماية الفرع `main`:** [docs/BRANCH-PROTECTION.md](./docs/BRANCH-PROTECTION.md) · **CI وفحوصات الدمج:** [CONTRIBUTING.md#ci](./CONTRIBUTING.md#ci) · **مراقبة توفر المواقع:** سير العمل **Uptime ping** في Actions (جدول + تشغيل يدوي).

**المستودع على GitHub:** [alzahrani6020/iif-web](https://github.com/alzahrani6020/iif-web)

**للمساعد الذكاء الاصطناعي (Cursor / غيره):** اقرأ [AGENTS.md](./AGENTS.md) ومجلد `.cursor/rules/`.

**تعريف «أكمل اللازم» (للمساعد وللمستخدم):** [اكمل-اللازم-قائمة.md](./اكمل-اللازم-قائمة.md)

**مسارات الملفات ليست روابط ويب — لا تُدخلها في Google:** [PATHS-NOT-GOOGLE.md](./PATHS-NOT-GOOGLE.md)

**متابعة التطوير (أولويات مقترحة):** [تطوير-الخطوات-التالية.md](./تطوير-الخطوات-التالية.md)  

**عندما يكتمل المحتوى — قبل النشر:** [قبل-النشر.md](./قبل-النشر.md)

**فهرسة Cursor أسرع:** يوجد [`.cursorignore`](./.cursorignore) في الجذر (يمكن التخصيص انطلاقاً من [cursorignore.example](./cursorignore.example)).

## موقع المشروع (اتفاق)

| | |
|---|---|
| **العمل والتخزين (مفضّل)** | **`D:\iif-fund-demo`** — لا تكرّر المشروع على **C:** بلا داعٍ (توفير مساحة). |
| **نسخة على C: (مثلاً Cursor)** | **`C:\Users\...\iif-fund-demo`** مقبولة إن كان هذا المجلد المفتوح في Cursor — نعمل على **المجلد المفتوح فعلياً**. |
| **البرامج** | استخدم **Node، Docker، Cursor، Git**… كالمعتاد؛ تثبيتها على C: طبيعي. |
| **Cursor** | **Open Folder** → مجلد المشروع (D: أو C: حسب نسختك). |
| **Git** | من مجلد المشروع. تفاصيل: [WORKSPACE-D-DRIVE.md](./WORKSPACE-D-DRIVE.md). |
| **نسخة قديمة على C:** | بعد التأكد من النسخة الصحيحة — [scripts/optional-remove-c-copy.bat](./scripts/optional-remove-c-copy.bat) (قالب آمن، لا يحذف تلقائياً). |

**نقاط الدخول المعتمدة:** واجهة الصندوق [`financial-consulting/iif-fund-demo/index.html`](./financial-consulting/iif-fund-demo/index.html)؛ الفهرس الحكومي المرجعي [`financial-consulting/government-search/SIMPLE-GOVERNMENT-PLATFORM.html`](./financial-consulting/government-search/SIMPLE-GOVERNMENT-PLATFORM.html). نسخ `index-*.html` التجريبية القديمة مؤرشفة في [`financial-consulting/iif-fund-demo/archive/previous-index-variants/`](./financial-consulting/iif-fund-demo/archive/previous-index-variants/).

**للاطلاع الرسمي / المستويات الرفيعة:** [`executive-brief.html`](./executive-brief.html) (أو `/executive`) — موجز مؤسسي ثنائي اللغة؛ [`sovereign-standards.html`](./sovereign-standards.html) (أو `/sovereign`) — معايير الجودة والحوكمة بما يليق بالقيادات السيادية؛ دليل الاستضافة: [`EXECUTIVE-HOSTING-GUIDE.md`](./EXECUTIVE-HOSTING-GUIDE.md).

### أين أقرأ ماذا؟

| إن كنت تبحث عن… | ابدأ من |
|------------------|---------|
| عرض للمستويات الرفيعة / موجز مؤسسي | [`executive-brief.html`](./executive-brief.html) و [`EXECUTIVE-HOSTING-GUIDE.md`](./EXECUTIVE-HOSTING-GUIDE.md) |
| معايير الجودة بما يليق بالقيادات السيادية | [`sovereign-standards.html`](./sovereign-standards.html) و [`SOVEREIGN-STANDARDS.md`](./SOVEREIGN-STANDARDS.md) |
| تشغيل المشروع وروابط التطوير | هذا الملف (README) — قسم **التشغيل السريع** |
| قائمة قبل النشر (محتوى + تقنية) | [`قبل-النشر.md`](./قبل-النشر.md) |
| **روابط الإنتاج المعتمدة** (Vercel / Netlify / GitHub Pages) | [`CANONICAL-URLS.md`](./CANONICAL-URLS.md) |
| **قبل الدمج** — أخطاء، ازدواجية، انسجام مع المنصات والمساعد | [`قائمة-تحقق-قبل-الدمج.md`](./قائمة-تحقق-قبل-الدمج.md) |
| مسارات الملفات ≠ بحث Google | [`PATHS-NOT-GOOGLE.md`](./PATHS-NOT-GOOGLE.md) |
| خطوات Netlify والاختصارات `/fund` و `/gov` | [`NETLIFY-CHECKLIST.md`](./NETLIFY-CHECKLIST.md) و [`netlify.toml`](./netlify.toml) |
| ربط المنصة الحكومية بالصندوق | [`financial-consulting/government-search/README-IIF-INTEGRATION.md`](./financial-consulting/government-search/README-IIF-INTEGRATION.md) |
| واجهة الصندوق (تفاصيل المجلد) | [`financial-consulting/iif-fund-demo/README.md`](./financial-consulting/iif-fund-demo/README.md) |
| إطار مبسّط + iframe للمنصة الحكومية | [`financial-consulting/fund-site/index.html`](./financial-consulting/fund-site/index.html) — **للمعاينة**؛ الإنتاج يفضّل الواجهة الكاملة أعلاه |
| تعليمات للمساعد (Cursor) | [`AGENTS.md`](./AGENTS.md) |

---

## التشغيل السريع

### ويندوز — «كل شيء» بنقرة واحدة

1. شغّل **Docker Desktop** وانتظر حتى يصبح جاهزاً.
2. انقر نقراً مزدوجاً **[`START-IIF-FULL.bat`](./START-IIF-FULL.bat)** في جذر المشروع.  
   يشغّل **SearXNG + Tor** (`engines/searxng`)، ثم **خادم التطوير** على **3333** في نافذة منفصلة، ثم يفتح **المنصة الحكومية** في المتصفح.
3. للتحقق من المحرك من الطرفية: `npm run verify:searx` (يجب أن يطبع `OK`).

**بدون Docker** (واجهات فقط): **[`START-IIF-DEMO.bat`](./START-IIF-DEMO.bat)** — يشغّل `npm start` ويفتح **http://127.0.0.1:3333/** (المجلد الصحيح مضمون عبر `/D`).

### 1) خادم التطوير (الواجهات الثابتة)

يتطلب **Node.js 22+** (انظر `.nvmrc` و`.node-version` — نفس الإصدار في CI وNetlify):

```bash
npm run verify   # بناء + فحص صياغة السكربتات (اختياري قبل الدفع)
npm run verify:local   # verify + فحص صيانة الروابط في الملفات (بدون خادم؛ أو VERIFY-IIF-LOCAL.bat)
npm start
```

**MiniMax API (اختياري):** لضبط المفتاح من ويندوز بدون أوامر معقّدة، انقر **`MINIMAX-KEY-SETUP.bat`** ثم **`MINIMAX-TEST.bat`** (تفاصيل في [AGENTS.md](./AGENTS.md)).

**قبل فتح الروابط في المتصفح** (في طرفية أخرى):

```bash
npm run check-urls
# أو فحصاً أوسع (نفس المتطلبات — الخادم يعمل على 3333):
npm run health
```
(`health` = `check-urls` + `smoke:html`: التحقق من محتوى الصفحات الحرجة وروابط iframe والمعرّفات العميقة.)

ثم افتح:

- **الجذر:** [http://localhost:3333/](http://localhost:3333/)  
- **الصندوق الكامل (الأصلية):** [http://localhost:3333/financial-consulting/iif-fund-demo/index.html](http://localhost:3333/financial-consulting/iif-fund-demo/index.html)

> **للمطورين:** المنصة الحكومية مباشرة:  
> `…/financial-consulting/government-search/SIMPLE-GOVERNMENT-PLATFORM.html`  
> (بحث **محلي** دائماً؛ **نتائج الويب** عبر SearXNG عند تشغيل **`START-IIF-FULL.bat`** أو `engines/searxng` + `npm start` — انظر [README-IIF-INTEGRATION.md](./financial-consulting/government-search/README-IIF-INTEGRATION.md).)

### 2) محرك البحث (اختياري — مشروع مستقل)

من **`engines/searxng/`** (ليس من جذر IIF):

```bash
cd engines/searxng
docker compose up -d
```

- الواجهة: [http://127.0.0.1:18080](http://127.0.0.1:18080) (المضيف؛ داخل الحاوية 8080)  
- التفاصيل: [engines/searxng/README.md](./engines/searxng/README.md)

### 3) ويندوز — تشغيل ومتصفح

- **`START-IIF-FULL.bat`** — Docker + الخادم + فتح المنصة الحكومية (موصى به للبحث الويب).  
- **`START-IIF-DEMO.bat`** — الخادم + الصفحة الرئيسية فقط.

---

## الملفات المهمة

| المسار | الوظيفة |
|--------|---------|
| `قبل-النشر.md` | قائمة تحقق قبل النشر العام (محتوى + تقنية) |
| `PREPUBLISH-COMPLETE.md` | ملخص ما أُعدّ للنشر (وثائق، اختصارات، فحص روابط) |
| [فحص-الأداء-خطوة-بخطوة.md](./فحص-الأداء-خطوة-بخطوة.md) | دليل فحص الواجهات والأداء والمحرك خطوة بخطوة |
| `legal/` | صفحات الخصوصية وإخلاء المسؤولية والتواصل + فهرس |
| `financial-consulting/government-search/SIMPLE-GOVERNMENT-PLATFORM.html` | المنصة الحكومية (بحث محلي؛ محرك الويب لاحقاً) |
| `financial-consulting/government-search/SITE-GLOBAL-STANDARDS.md` | معايير الجودة العالمية للمنصة الحكومية (SEO، a11y، أداء) |
| `financial-consulting/government-search/government-data.json` | بيانات الجهات |
| `financial-consulting/government-search/government-data.js` | يُولَّد من JSON |
| `financial-consulting/government-search/iif-config.js` | يُحمَّل من المنصة — تفعيل بحث الويب على `localhost`/`127.0.0.1` |
| `financial-consulting/iif-fund-demo/` | **واجهة الصندوق الأصلية** |
| `financial-consulting/fund-site/index.html` | واجهة تجريبية أبسط |
| `scripts/dev-server.js` | خادم تطوير (`3333`) + بروكسي **`/api/searx`** → SearXNG على `18080` |
| `engines/searxng/` | **Docker (Tor + SearXNG) + توثيق المحرك** |

تفاصيل الربط المستقبلي: [financial-consulting/government-search/README-IIF-INTEGRATION.md](./financial-consulting/government-search/README-IIF-INTEGRATION.md).

### تحديث بيانات الجهات

1. عدّل `government-data.json` (أو استخدم `npm run expand:gov-un195` لتغطية دول إضافية وفق نموذج الأمم المتحدة).
2. من جذر المشروع: `npm run build:gov-data` لتوليد `government-data.js`.
3. **إكمال السياق:** الفهرس المحلي لا يُغني عن الويب؛ مع `npm start` + SearXNG يُكمّل المحرك النتائج (راجع [README-IIF-INTEGRATION.md](./financial-consulting/government-search/README-IIF-INTEGRATION.md)).
4. **روابط البنك الدولي:** إن تغيّرت صيغة الموقع، شغّل `npm run fix:worldbank-urls` لتحديث مسارات `data.worldbank.org/country/*`.
5. أعد تحميل الصفحة.

---

## Netlify (ربط GitHub)

- **قبل أول نشر عام:** راجع [قبل-النشر.md](./قبل-النشر.md) (محتوى + تقنية + توقّعات بحث الويب).
- الإعدادات في **`netlify.toml`** (أمر البناء: `npm ci && npm run build`، النشر: **`.`**).
- **قائمة خطوات جاهزة:** [NETLIFY-CHECKLIST.md](./NETLIFY-CHECKLIST.md)
- لصق حقول الواجهة يدوياً: [NETLIFY-UI-SETTINGS.md](./NETLIFY-UI-SETTINGS.md)
- **اختصارات بعد النشر:** `/fund` → واجهة الصندوق، `/gov` → المنصة الحكومية، `/legal` → الوثائق، `/privacy` / `/disclaimer` / `/contact` → صفحات قانونية (انظر `netlify.toml`)
- نشر يدوي من GitHub: workflow **`Deploy Netlify`** (اختياري) يحتاج الأسرار `NETLIFY_AUTH_TOKEN` و `NETLIFY_SITE_ID`.

> **ملاحظة:** إذا ربطت Netlify بمستودع `iif-web` على الفرع `main`، كل **push** يُعيد بناء الموقع تلقائياً — لا تحتاج أسرار Actions لذلك.

**توفير الطبقة المجانية (Netlify / Actions):** [NETLIFY-FREE-TIER.md](./NETLIFY-FREE-TIER.md)

**أمان (أسرار، مفاتيح):** [SECURITY.md](./SECURITY.md)

### GitHub Pages (بديل عند توقف Netlify أو للمعاينة العامة)

- سير العمل: [`.github/workflows/github-pages.yml`](./.github/workflows/github-pages.yml) — ينشر **`financial-consulting/iif-fund-demo/`** كموقع ثابت.
- **تفعيل لمرة واحدة:** المستودع على GitHub → **Settings** → **Pages** → **Build and deployment** → المصدر: **GitHub Actions** (وليس Branch). إذا ظهرت صفحة 404 «لا يوجد موقع» رغم وجود الـ workflow، غالباً لم يُنشَأ موقع Pages بعد: من الطرفية مع [GitHub CLI](https://cli.github.com) بعد `gh auth login` نفّذ `gh api -X POST repos/alzahrani6020/iif-web/pages -f build_type=workflow` أو شغّل `.\scripts\enable-github-pages.ps1` من جذر المشروع.
- بعد نجاح التشغيل: الرابط يكون `https://<user>.github.io/<repo>/` (مثال للمستودع المرتبط: [alzahrani6020/iif-web](https://github.com/alzahrani6020/iif-web)).
- يوجد ملف [`.nojekyll`](./financial-consulting/iif-fund-demo/.nojekyll) في مجلد الواجهة لتعطيل معالج Jekyll الافتراضي.
- **دفع التغييرات:** `git push origin main` يشغّل النشر تلقائياً عند تعديل ملفات داخل `financial-consulting/iif-fund-demo/` أو سير العمل نفسه؛ أو من تبويب **Actions** → **Deploy GitHub Pages** → **Run workflow**.
- **ما لا يعمل على Pages وحدها (موقع ثابت):** مسارات مثل **`/healthz`** و**`/diagnostics.json`** و**`/api/*`** يوفّرها **`npm start`** (تطوير) أو **دوال Netlify** عند النشر هناك — وليست ملفاتاً ثابتة في كل البيئات.

### Vercel وNetlify من Actions

- **Deploy Netlify** و**Deploy Vercel (optional):** تشغيل **يدوي** من تبويب **Actions** → **Run workflow** بعد إضافة الأسرار في **Settings → Secrets and variables → Actions** (انظر تعليقات ملفات الـ workflow و[VERCEL-DEPLOY.md](./VERCEL-DEPLOY.md)).
- النشر التلقائي عند **push** يمكن ضبطه من **لوحة Netlify / Vercel** عند ربط المستودع بـ Git هناك.

---

## متغيرات اختيارية

| المتغير | المعنى |
|---------|--------|
| `PORT` | منفذ خادم التطوير (افتراضي `3333`) |
| `MINIMAX_API_KEY` | مفتاح **MiniMax Platform API** (اختياري) لتشغيل `npm run minimax:ask` — انسخ `.env.example` إلى `.env` |
| `MINIMAX_MODEL` | نموذج النص (افتراضي `MiniMax-M2.7` في السكربت) |

```bash
set PORT=4000
npm start
```
