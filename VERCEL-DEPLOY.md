# نشر Vercel والتحقق من آخر نسخة

**دليل أوسع (Pages + CI + خيار الخادم):** [DEPLOY-AND-MONITOR.md](./DEPLOY-AND-MONITOR.md)

## الروابط المعتمدة حالياً (2026)

| المنصة | رابط الإنتاج الفعلي |
|--------|---------------------|
| **النطاق المخصّص (رسمي للمشاركة)** | **`https://iiffund.com/`** — الصندوق: **`/fund`** أو **`/financial-consulting/iif-fund-demo/`** |
| **Vercel (فريق `dr-talal`، مشروع `iif-fund`)** | `https://iif-fund-dr-talal.vercel.app/index.html` (معاينة/احتياط) |
| **Netlify (اسم فرعي، مثال تاريخي)** | `https://fluffy-meerkat-eff966.netlify.app` |

**لوحة التحكم:** على **`iiffund.com`** استخدم **`/fund-admin`** أو معاملات الاستعلام كما في [CANONICAL-URLS.md](./CANONICAL-URLS.md)؛ على Vercel/نسخ أخرى يمكن **`#dashboard`** على `index.html`.

### عن `iif-fund.vercel.app`

قد يكون الاسم `iif-fund.vercel.app` **مخصصاً لمشروع Vercel آخر**؛ إن حاولت ربط alias بنفس الاسم يظهر: *«already in use»*.  
لتوحيد الاسم: من حساب Vercel الذي يملك **`iif-fund.vercel.app`** احذف الـ alias من المشروع القديم أو انقل النطاق إلى مشروع `dr-talal/iif-fund`، ثم عيّن الـ alias من لوحة Vercel.

#### خطوات من لوحة Vercel (بدون تغيير كود)

1. سجّل الدخول إلى [Vercel Dashboard](https://vercel.com/dashboard) بالحساب الذي يملك المشروع الهدف (`dr-talal` → `iif-fund`) **أو** الحساب الذي يظهر عنده الاسم المشغول.
2. **اعثر على المشروع الحالي لـ `iif-fund.vercel.app`:** من القائمة **All Projects** ابحث عن مشروع يعرض هذا النطاق في المعاينة، أو افتح **Project → Settings → Domains** وابحث عن `iif-fund.vercel.app`.
3. **حرّر الاسم من المشروع القديم:** في المشروع الذي يشغل الاسم حالياً: **Settings → Domains** → أزل `iif-fund.vercel.app` (أو احذف/أعد تسمية المشروع التجريبي إن لم يعد مستخدماً).
4. **أضف الاسم للمشروع المعتمد:** افتح مشروع **`iif-fund`** ضمن الفريق **`dr-talal`** → **Settings → Domains** → **Add** → أدخل `iif-fund.vercel.app` واتبع التحقق إن طُلب.
5. بعد النجاح، حدّث [CANONICAL-URLS.md](./CANONICAL-URLS.md) إن أصبحت الروابط الرسمية تستخدم الاسم القصير فقط.

إن كان الاسم مربوطاً بحساب لا تملكه، يلزم نقل المشروع بين الفرق/الحسابات من إعدادات الفريق أو التواصل مع مالك ذلك الحساب — لا يُحل ذلك من المستودع وحده.

## التحقق السريع

1. بعد الـ deploy، افتح الرابط أعلاه ثم **Ctrl+U** (عرض المصدر).
2. ابحث عن **`v8-fix-main-close`** أو **`dashboard-fullpage-v8-fix-main-close`** أو التعليق **`تحقق-النشر-iif-dashboard-fullpage`**.

## إعداد المشروع في Vercel

1. **Settings → Git:** المستودع `alzahrani6020/iif-web`، الفرع **`main`**, تفعيل **Automatic deployments**.
2. **Root Directory:** `financial-consulting/iif-fund-demo` (حيث `index.html` الكبير و`vercel.json`).
3. **Build Command:** يُعرَّف في `vercel.json` كـ `npm run i18n:packs` حتى تُحدَّث `i18n-service-packs-*.js` و`i18n-service-packs-all.js` عند كل نشر (مع `npm install` الافتراضي من Vercel). إن غيّرت الأمر في لوحة Vercel فتأكد أنه يشمل توليد الحزم.
4. **Deployments:** إن لم يتحدث الإنتاج بعد `git push`، استخدم **Redeploy**.

### ويبهوك تسجيل (اختياري)

بعد إنشاء حساب جديد من الواجهة يُستدعى `POST /api/user-registration-forward`. لإعادة التوجيه إلى خدمة خارجية عيّنوا في **Settings → Environment Variables:** `IIF_USER_WEBHOOK_URL` (HTTPS) واختيارياً `IIF_USER_WEBHOOK_SECRET`. التفاصيل: [DEPLOY-AND-MONITOR.md](./DEPLOY-AND-MONITOR.md) (قسم «ويبهوك تسجيل»).

## أوامر CLI (من مجلد الواجهة)

```bash
cd financial-consulting/iif-fund-demo
npx vercel deploy --prod --yes
```

## نشر اختياري من GitHub Actions

الملف: `.github/workflows/vercel-deploy.yml`  
يحتاج أسرار: `VERCEL_TOKEN`، `VERCEL_ORG_ID`، `VERCEL_PROJECT_ID` (يمكن إنشاء التوكن من [Vercel → Account → Tokens](https://vercel.com/account/tokens)).

**التشغيل:** يدوياً فقط — من **Actions** → **Deploy Vercel (optional)** → **Run workflow** (لا يُشغَّل تلقائياً عند كل `push` لتوفير دقائق Actions وتجنب تشغيلات غير لازمة).

### ازدواجية نشر محتملة

إن كان المشروع **مربوطاً بـ Git** في Vercel مع **Automatic deployments**، فكل **`push`** إلى `main` قد ينشر من Vercel أصلاً. استخدم workflow Actions **فقط** عندما تريد نشراً من GitHub دون الاعتماد على تكامل Vercel، أو عطّل أحد المصدرين لتفادي نشر مزدوج.
