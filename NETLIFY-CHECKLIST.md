# قائمة جاهزية Netlify — iif-web

استخدمها مرة واحدة عند إنشاء الموقع أو للمراجعة.

## لوحة الفريق على Netlify (إدارة المواقع)

- **فريق dr-talal:** [app.netlify.com/teams/dr-talal/projects](https://app.netlify.com/teams/dr-talal/projects)  
  من هنا تضيف مواقع، تربط GitHub، وترى عمليات النشر.  
- **موقع ثقة منفصل (`thiqqah.live`):** [NETLIFY-THIQQAH-STANDALONE.md](./NETLIFY-THIQQAH-STANDALONE.md) — موقع Netlify ثانٍ، Base directory = `thiqqah-site`.
- هذا **ليس** رابط الموقع العام للزوار — رابط الزوار يكون مثل `https://اسم-الموقع.netlify.app` بعد إنشاء الموقع.

### موقع المشروع المربوط حالياً (مثال من إعدادك)

| | |
|---|---|
| **اسم الموقع على Netlify** | `fluffy-meerkat-eff966` |
| **رابط الزوار (الشكل المعتاد)** | [https://fluffy-meerkat-eff966.netlify.app](https://fluffy-meerkat-eff966.netlify.app) |
| **لوحة المشروع** | من [projects](https://app.netlify.com/teams/dr-talal/projects) → اختر الموقع |

> **وكيل Claude (Agent):** إن ظهر *Configuring environment* أو *Claude Agent is working* — **انتظر** حتى ينتهي ولا تغلق الصفحة. إن ذُكر `http://localhost:3333/` فهذا للتطوير على جهازك؛ **العالم الخارجي** يفتح رابط `*.netlify.app` بعد نشر ناجح.

## 1) المستودع على GitHub

- الرابط: **https://github.com/alzahrani6020/iif-web**
- الفرع الافتراضي: **`main`**

## 2) إنشاء الموقع في Netlify / ربط مستودع GitHub

**دليل خطوة بخطوة (من المتصفح):** [اربط-المستودع-الآن.md](./اربط-المستودع-الآن.md)

1. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project** — أو من موقع موجود: **Build & deploy** → **Link repository**.
2. **GitHub** → امنح الصلاحية إن طُلب → اختر **`alzahrani6020/iif-web`** والفرع **`main`**.
3. **Build settings:** اتركها فارغة إن قرأت من المستودع، أو انسخ من [NETLIFY-UI-SETTINGS.md](./NETLIFY-UI-SETTINGS.md)
4. **Deploy site** (يفضّل **Clear cache and deploy** بعد أول ربط).

## 3) بعد أول نشر ناجح

| الإجراء | أين |
|--------|-----|
| **اسم النطاق الفرعي** | Site settings → Domain management → يمكن تغيير `xxx.netlify.app` |
| **فرض HTTPS** | Site settings → HTTPS → **Force HTTPS** (مُنصى به) |
| **النشر التلقائي** | يحدث عند كل **push** إلى `main` (طالما الموقع مربوط بـ GitHub) |

## 4) أسرار اختيارية (GitHub Actions)

لتشغيل workflow **Deploy Netlify** يدوياً من تبويب Actions:

| السر | المصدر |
|------|--------|
| `NETLIFY_AUTH_TOKEN` | Netlify → User settings → Applications → Personal access tokens |
| `NETLIFY_SITE_ID` | Site settings → Site details → Site ID |

> إذا لم تضف الأسرار: لا بأس — النشر عبر **ربط GitHub في Netlify** يكفي لمعظم الحالات.

## 5) التحقق

- افتح الرابط `https://<اسم-موقعك>.netlify.app`
- جرّب: `/` ، واجهة الصندوق، المنصة الحكومية
- روابط مختصرة (إن وُجدت في `netlify.toml`): `/fund` ، `/gov`
- **بعد النشر (من جهازك):** احفظ نسخة احتياطية من **Environment variables** في مكان آمن؛ ثم (PowerShell)  
  `$env:PROXY_BASE="https://<اسم-موقعك>.netlify.app"; npm run smoke:live`  
  يتحقق من صفحة البحث الموحّدة و`/api/searx`؛ فشل الترجمة يظهر تحذيراً فقط حتى لا يُبلغ عن «تعطل» الموقع بالكامل.
- **فحص سريع من المتصفح:** `https://<اسم-موقعك>.netlify.app/healthz` — JSON يوضح اتصال SearX ومترجمكم (إن وُجد `IIF_TRANSLATE_URL`) دون إيقاف الموقع.
- **من GitHub:** Actions → **Smoke live site** (تشغيل يدوي) — الصق رابط الموقع عند الطلب.
- **ضبط المتغيرات من الطرفية (اختياري):** مع `NETLIFY_AUTH_TOKEN` و`NETLIFY_SITE_ID` — `npm run netlify:env:sync` (لا تُخزَّن الرموز في Git؛ راجع `deploy/README.md`).

## 6) الملفات المرجعية في المشروع

| الملف | الغرض |
|-------|--------|
| `قبل-النشر.md` | قائمة تحقق: محتوى مكتمل + تقنية قبل أول نشر عام |
| `netlify.toml` | أمر البناء، النشر، التوجيهات، الرؤوس |
| `NETLIFY-UI-SETTINGS.md` | نسخ ولصق لحقول الواجهة |
| `دليل-المبتدئ-النشر.md` | شرح مبسّط للمبتدئين |
| `scripts/smoke-live-site.mjs` | فحص خفيف بعد النشر (`npm run smoke:live` مع `PROXY_BASE`) |

## 7) الطبقة المجانية — عدم إهدار البناء

راجع **[NETLIFY-FREE-TIER.md](./NETLIFY-FREE-TIER.md)** (تعطيل معاينات PR إن لم تُستخدم، و`[skip netlify]` في رسالة الـ commit عند تعديل التوثيق فقط).

## 8) إذا ظهر `ERR_SSL_PROTOCOL_ERROR` على `iiffund.com`

هذا **ليس** عطلاً في ملفات الريبو؛ يعني أن المتصفح لم يكمل **HTTPS (TLS)** مع الخادم الذي يستقبل الدومين.

| الخطوة | ماذا تفعل |
|--------|-----------|
| 1 | في **Netlify** → الموقع الذي يظهر عنده **`iiffund.com`** في **Domain management** → **HTTPS** — تحقق من الشهادة (Let's Encrypt) وجرّب **Renew** إن وُجد. |
| 2 | في **مسجّل الدومين** — طابق سجلات **A** و **CNAME** (لـ `www`) **حرفياً** مع ما يعرضه Netlify؛ احذف أي **URL forwarding** قديم يتعارض مع الإشارة لـ Netlify. |
| 3 | بعد نقل الدومين لاستضافة أخرى (مثل App Hosting) | فعّل **شهادة HTTPS** على الوجهة الجديدة أولاً، أو أعد DNS إلى Netlify حتى تكتمل الشهادة. |
| 4 | من الطرفية (جذر المشروع) | `npm run verify:iiffund:https` — إن نجح هنا وفشل في المتصفح، جرّب **شبكة/جهازاً آخراً** أو عطّل **VPN / فحص HTTPS في مضاد الفيروسات** مؤقتاً. |

**ثقة على الإنترنت** (بعد إصلاح الدومين): `https://iiffund.com/thiqqah-site/index.html` من نشر الجذر الكامل؛ وللفصل الكامل عن الصندوق اتبع **[NETLIFY-THIQQAH-STANDALONE.md](./NETLIFY-THIQQAH-STANDALONE.md)** لـ `thiqqah.live`.
