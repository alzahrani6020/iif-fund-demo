# Site operations — IIF public interface (`iif-fund-demo`)

## Meta tags (backup checklist)

| Meta | Role |
|------|------|
| `iif-app-base` | Optional manual base path for assets (usually empty; `index.html` computes base). |
| `iif-searx-public-url` | Public SearXNG UI URL for the header link on GitHub Pages. |
| `iif-searx-proxy-base` | HTTPS origin that serves **`/api/searx/search`** (production: **`https://iiffund.com`** via Netlify Functions; Vercel optional). Used by in-page **web analysis** fetch on non-localhost hosts. |
| `iif-funcs-base` | API base for news and related calls (production: **`https://iiffund.com`** — paths under **`/api/*`** and **`/.netlify/functions/*`**). |
| `iif-build` | Deployment fingerprint for support / debugging. |

After changing hosts, update **`iif-searx-proxy-base`** and **`iif-funcs-base`** to match your live API origin (default in repo: **`https://iiffund.com`**).

### موجز الأخبار `api/news.js`

- المنطق في `financial-consulting/iif-fund-demo/api/news.js`؛ على **Netlify (جذر الريبو)** تُستدعى عبر **`netlify/functions/news.js`**. بعد أي تعديل على الخلاصات أو الترجمة، **أعد نشر Netlify** حتى تطابق النسخة الحالية ما يظهر عند **`iif-funcs-base`**.
- محلياً على `127.0.0.1:3333` الواجهة تستدعي `/api/news` من `scripts/dev-server.js` (لا تعتمد على نشر قديم).
- متغيرات اختيارية (Vercel / `.env`): `IIF_NEWS_CACHE_MS`, `IIF_TICKER_TRANSLATE_URL`, `IIF_TICKER_TRANSLATE_MAX` — راجع `.env.example`.
- فحص الخلاصات: من جذر المستودع `npm run check:news-feeds`.

### نسخة احتياطية سريعة (للصق في مستند داخلي)

```
iif-searx-public-url:    (من <meta name="iif-searx-public-url" content="...">)
iif-searx-proxy-base:    (من <meta name="iif-searx-proxy-base" content="...">)
iif-funcs-base:          (من <meta name="iif-funcs-base" content="...">)
GitHub Pages URL:        https://<user>.github.io/<repo>/
Vercel project URL:      (لوحة Vercel → Domains)
```

## Vercel — SearX JSON proxy

- File: `api/searx/search.js` (deployed with this directory as the Vercel project root).
- Optional env: **`SEARX_UPSTREAM`** = `https://your-favorite-searx.example` (default: `https://searx.tiekoetter.com`).
- **تحديد معدل (ذاكرة لكل عقدة serverless):** `IIF_PROXY_RL_MAX` (افتراضي 45 طلباً)، `IIF_PROXY_RL_WINDOW_MS` (افتراضي 60000)، أو `IIF_PROXY_RL_OFF=1` لتعطيل الحد مؤقتاً.
- Redeploy after adding env vars.
- مثال محلي: انسخ `.env.example` إلى `.env` وعدّل القيم عند استخدام `vercel dev` (لا ترفع `.env`).

### قائمة تحقق بعد النشر

1. `curl -sI "https://<vercel>/api/searx/search?q=test&format=json"` → HTTP 200 (أو 4xx من upstream وليس 404 من المسار).
2. من موقع GitHub Pages: ميزة التحليل التي تستدعي `fetchSearxPack` تعمل دون خطأ CORS.
3. راجع **Logs** في Vercel إذا ازدادت الطلبات غير المتوقعة.

### فحص واجهة الصندوق محلياً (بعد تغييرات UI أو RSS)

من جذر المستودع:

- `npm run smoke:with-server` — خادم مؤقت ثم فحص HTML وروابط و`/api/news`.
- `npm run check:news-feeds` — التحقق من استجابة خلاصات RSS المعرّفة في `api/news.js`.

## GitHub Pages

- Workflow **excludes** `api/` from the static artifact so serverless source is not published as raw files on Pages.
- Site URL pattern: `https://<user>.github.io/<repo>/`

## Cloudflare (optional, in front of Pages or origin)

1. Create a proxied DNS record to your GitHub Pages (or custom domain CNAME).
2. Enable **Auto minify** (HTML/CSS/JS) if desired.
3. Caching: “Standard” or a Page Rule to cache static assets longer than HTML.
4. **Alternative proxy (Cloudflare Worker)**:
   - الكود: `ops/cloudflare-searx-proxy.js`
   - الإعداد: `ops/wrangler.toml`
   - من المجلد `ops`: `npx wrangler@3 deploy` ثم اربط **Route** (مثل `api.example.com/api/searx/*`).
   - سر اختياري: `npx wrangler secret put SEARX_UPSTREAM`

## Monitoring

- Workflow **Uptime ping** checks the GitHub Pages home URL and `privacy.html`, and performs an informational request to the Vercel proxy URL.
- في GitHub: **Settings → Notifications → Actions** — فعّل إشعار فشل سير العمل إن رغبت (لا يُضبط من المستودع).

## سجل نسخ نصوص حساسة (يدوي)

عند تغيير نصوص تؤثر على الامتثال أو التوقعات القانونية للزائر، سجّل صفاً في الجدول أدناه (أو في نظام تذاكركم) حتى يتسنّى المراجعة لاحقاً.

| التاريخ (UTC) | القسم / الملف | ملخص التغيير |
|---------------|---------------|----------------|
| 2026-04-05 | `index.html` — تذييل | إضافة رابط `transparency.html` مع `footerTransparencyPage` (ترجمة في `i18n.js` en/ar/fr) |
| 2026-04-05 | `i18n.js` — `T.fr` | إكمال نصوص قسم الثقة (#trust-entry … #partners-trust) بالفرنسية بدل الاعتماد على الإنجليزية |
| 2026-04-05 | `i18n.js` — `T.fr` | إكمال بقية المفاتيح الناقصة مقابل `T.en` (خدمات، قطاعات، تذييل إداري، مؤشرات إخبارية، إلخ) — تكافؤ مفاتيح كامل للفرنسية |
| 2026-04-05 | `i18n.js` — `de`/`it`/`es`/`zh`/`tr` | إضافة `footerTransparencyPage` المترجمة بجانب الحزم الجزئية |
| 2026-04-05 | `about-institution.html` | رابط `transparency.html` في شريط التنقل العلوي مع الخصوصية والحوكمة |
| 2026-04-05 | `i18n.js` — `extend(def)` | `footerTransparencyPage` بلغات الحزم الجزئية (فا، أردو، أمهرية، … بنجالي) |
| 2026-04-05 | صفحات ورقية متعددة | توحيد شريط روابط (Home · Privacy · Transparency · About · Terms) في `search`، `health`، `diagnostics`، `analysis`، `connect`، `start-here`، `news-sources`؛ و`transparency.html` |
| _مثال_ | `index.html` — استشارة عاجلة أونلاين | توضيح SLA والرد خلال ~48 ساعة عمل |
| _مثال_ | `i18n.js` — `urgentOnline*` | ترجمة أو صياغة جديدة |
| _مثال_ | `privacy.html` / KYC | بيانات أو أطراف ثالثة |

## Modularization (phased)

- `index.html` is intentionally monolithic for now. Safer splits: move rare sections into separate HTML pages (like `privacy.html` / `transparency.html` / `about-institution.html`) and link from the footer or nav; avoid breaking inline script IDs.

## مسار المستخدم (داخلي)

- راجع `USER-JOURNEY.md` لتدريب الفريق على تسلسل زائر → تسجيل → لوحة التحكم.

## Abuse note (open proxy)

- The SearX proxy is a **GET forwarder**. Monitor Vercel logs; consider rate limits or auth if traffic grows.
- **Per-IP rate limit** is enabled on the Vercel function (`IIF_PROXY_RL_*` — see above).

## Ollama / تحليل المشروع (لوحة التحكم)

- مسارات **`/api/ollama`** تعمل مع **`npm start`** والخادم المحلي فقط. على GitHub Pages **لا يوجد** Ollama افتراضياً — زر التحليل يحتاج جهازاً يشغّل Ollama ويمرّر البروكسي، أو خادماً خاصاً لاحقاً.
- عند غياب البحث على الويب (429 أو خطأ شبكة)، يُكمَل سياق النموذج ببيانات البنك الدولي فقط ورسالة حالة في الواجهة.

## Lighthouse (أداء)

**من المشروع (التقرير الافتراضي `reports/lh-latest.html`، أو أي مسار عبر `IIF_LH_OUT`):**

```bash
npm run lh -- "http://127.0.0.1:3333/cp"
# أو
IIF_LH_URL="https://YOUR_SITE.github.io/REPO/" npm run lh
```

**يدويًا (مع فتح التقرير):**

```bash
npx lighthouse@11 "https://YOUR_SITE.github.io/REPO/" --only-categories=performance --chrome-flags="--headless=new --no-sandbox" --view
```

ملاحظة: `reports/lh-*.html` في `.gitignore` (يُبقى `reports/.gitkeep`).

**في المصدر (مرجع سريع):** preload لـ `assets/emblem.webp` مع `<picture>` (WebP + JPEG احتياطي) للشعار؛ خلفيات CSS تستخدم `image-set()`؛ أيقونات التيكر بـ `loading="lazy"`؛ `prefers-reduced-motion` للتيكر والتمرير؛ `text-rendering: optimizeLegibility` على `body`. بعد استبدال ملف الشعار الأصلي شغّل **`npm run assets:optimize`** (Sharp) لإعادة توليد `emblem.jpg` و`emblem.webp`.

## خطوط محلية

- بعد `npm install` يُشغَّل `postinstall` ويملأ `assets/fonts/*.woff2` من `@fontsource/*` (أو نفّذ `npm run fonts:vendor`).
- **GitHub Pages:** ارفع ملفات `assets/fonts/*.woff2` مع المستودع (لا يُشغَّل npm على الخادم).
- التفاصيل اليدوية: `assets/fonts/HOWTO.txt`.

## i18n (لغات ناقصة جزئياً)

سكربت `npm run i18n:keys` يبيّن أن بعض اللغات (مثل zh، es، de، it، tr) تفتقد مفاتيح كثيرة وتعتمد على الاحتياطي (غالباً الإنجليزية أو الفرنسية). إكمال الترجمة يدوياً أو عبر أدوات مساعدة يبقى عملاً منفصلاً عند الحاجة للجمهور.

- **حزم قسم الخدمات (الأوزان الثقيلة):** تُولَّد تلقائياً عند **`npm run build`** من **جذر المستودع** (`i18n:packs` → `i18n-service-packs-{a–d}.js` و`i18n-service-packs-all.js`). يدوياً من مجلد الواجهة: `npm run i18n:packs`. **GitHub Pages** يشغّل `emit-service-packs.cjs` في workflow قبل نسخ الملفات الثابتة.
- **تطابق رموز اللغات:** `npm run i18n:locales` يتحقق من تطابق مصفوفة `codes` مع مفاتيح جدول `L` في `i18n.js`.

### CI (GitHub Actions)

- Workflow: `.github/workflows/i18n-check.yml` — عند تغيير `i18n.js` أو `scripts/check-i18n-keys.js` يشغّل `node --check i18n.js` ثم `node scripts/check-i18n-keys.js` من مجلد `financial-consulting/iif-fund-demo`.
- محلياً: نفس الأمرين بعد أي تعديل كبير على `i18n.js`. للتحقق الصارم من ثقب الـ dashboard في de/es/it/zh: `node scripts/check-i18n-keys.js --strict`.

### صفحات ثابتة — شريط الاختصارات

- الصفحات `privacy.html`، `transparency.html`، `about-institution.html`، وأدوات `search` / `diagnostics` / `health` / `analysis` / `connect` / `start-here` / `news-sources` تستخدم `<nav class="iif-leaf-nav" aria-label="Site shortcuts">` مع قائمة `<ul class="iif-leaf-nav__list">`؛ الأنماط في `css/public-shell.css`.
- `transparency.html`: سطر تمهيدي يذكر «Last updated with site releases» بأسلوب موازٍ لـ `privacy.html`.
- **ترجمة الشريط:** الصفحات الثابتة تحمّل `i18n.js` و`js/iif-leaf-i18n-boot.js`؛ `<html data-iif-leaf-static="1">` يمنع استبدال عنوان الصفحة وSEO. اللغة من `iif-lang` أو `?lang=`. مفاتيح `leafNav*` مترجمة في الحزم الصريحة `ar` / `fr` / `de` / `es` / `it` / `zh` / `tr`؛ اللغات المبنية على `extend(def, …)` ترث نص الإنجليزية من `def` ما لم تُخصَّص.

## Content-Security-Policy

- **مصدر واحد للنص:** `config/content-security-policy.txt` — ثم شغّل `npm run csp:sync` لتحديث `vercel.json` و`netlify.toml` ووسم `<meta http-equiv="Content-Security-Policy">` في `index.html` و`admin-standalone.html` و`privacy.html` و`transparency.html` و`about-institution.html`.
- **Vercel:** ترويسة CSP في `vercel.json` (Translate، `translate-pa.googleapis.com`، `gstatic.com`، اتصال `https:`، خطوط ذاتية).
- **Netlify:** نفس السياسة في `netlify.toml` ضمن `[[headers]]`.
- **GitHub Pages:** وسوم `<meta>` في HTML تُفعّل CSP حتى بدون ترويسات الخادم.

## npm audit

تشغيل `npm audit fix` يُصلح جزءاً بسيطاً؛ بقية التنبيهات مرتبطة بـ `sqlite3`/`nodemon`/`xlsx` وتتطلب ترقيات قد تكسر التوافق (`npm audit fix --force`) أو استبدال الحزمة — راجع تقرير `npm audit` قبل الإنتاج.

## Smoke test — قبل/بعد النشر (يدوي ~3 دقائق)

1. **الرئيسية:** شريط التحميل العلوي يختفي بعد اكتمال التحميل؛ تمرير سلس من الهيدر إلى `#contact` و`#faq`.
2. **روابط الهاش (نفس المستند):** جرّب `#about`، `#compliance`، `#terms` من الهيدر والتذييل — يجب أن يبقى التبويب الحالي وأن تُحدَّث الأقسام الديناميكية إن وُجدت.
3. **الهيدر (مستندات أخرى):** رابط يشير إلى `privacy.html` أو نطاق خارجي يفتح في تاب جديد كما صُمّم.
4. **التذييل:** روابط الشروط، الخصوصية، عن الصندوق، **الأسئلة الشائعة**، الامتثال تعمل كما يُتوقع.
5. **تسجيل الدخول:** فتح النافذة ثم إغلاقها يعيد التركيز إلى الزر/الرابط الذي فتحها.
6. **لوحة التحكم:** فتح من الهيدر ثم إغلاقها يعيد التركيز إلى زر اللوحة؛ التمرير داخل اللوحة لروابط `#dashboard-…`.
7. **وضع embed/portal:** `?iif_admin_embed=1` أو `?iif_admin_portal=1` على `admin-standalone.html` — لا يظهر شريط التحميل العام؛ تحقق أن لوحة التحكم تفتح/تغلق والتركيز يعود.
8. **صفحات فرعية:** `privacy.html` / `transparency.html` / `about-institution.html` — الروابط تفتح في تاب جديد مع بقاء المقال؛ الخطوط تُحمَّل محلياً.
9. **ترجمة Google (إن مفعّلة):** تظهر الويدجت دون أخطاء CSP في وحدة التحكم على نشر Vercel/Netlify.
10. **لوحة مفاتيح:** Tab إلى «تخطي إلى المحتوى» — يظهر حلقة تركيز واضحة (`:focus-visible`).
11. **تقليل الحركة:** في إعدادات النظام/المتصفح فعّل «تقليل الحركة» — يجب أن يتوقف تمرير التيكر ويصبح التمرير بين الأقسام فورياً (بدون `smooth`).

**English (same checks):** home loader; same-doc hash nav; header cross-doc new tab; footer; auth/dashboard focus; embed/portal; leaf pages + local fonts; Google Translate without CSP console errors; skip-link; reduced-motion ticker + scroll.
