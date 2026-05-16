# روابط الإنتاج المعتمدة

مرجع واحد لتفادي خلط النطاقات القديمة مع الحالية.

## الرابط الرسمي للجهات الخارجية

**الرابط الرسمي الحالي للمشاركة والمراسلات:** **`https://iiffund.com/`** — واجهة الصندوق: **`https://iiffund.com/financial-consulting/iif-fund-demo/`** (اختصار: **`https://iiffund.com/fund`**).

في `index.html` تُضبط عناوين **`iif-funcs-base`** و **`iif-searx-proxy-base`** على **`https://iiffund.com`** حتى تمر طلبات API (الأخبار، SearXNG، إلخ) عبر **Netlify Functions** على نفس النطاق.

**منصات إضافية** (احتياط أو معاينة):

| إن كان الإنتاج الفعلي على… | الرابط المقترح للجهات |
|----------------------------|-------------------------|
| **GitHub Pages** | `https://alzahrani6020.github.io/iif-web/` |
| **Netlify (اسم فرعي)** | مثال تاريخي: `fluffy-meerkat-eff966.netlify.app` — يُفضّل للجمهور استخدام **`iiffund.com`** |

قبل إرسال رابط رسمي: [قائمة ما قبل الإصدار](docs/PRE-RELEASE-CHECKLIST.md).

## واجهة الصندوق + اللوحة (`#dashboard`)

### أين «اللوحة الإدارية»؟

- **ليست موقعاً آخر ولا ملف HTML منفصل.** اللوحة = **نفس صفحة** `index.html` مع **طبقة ملء الشاشة** (`#dashboard-overlay`) تُفتح بعد تسجيل الدخول بحساب مسموح. لذلك يبقى عنوان المتصفح يشبه «الصفحة الرئيسية» — هذا طبيعي حتى تُفتح الطبقة أو نافذة الدخول.
- **بعد الفتح الناجح:** ترى واجهة لوحة (شريط علوي خاص باللوحة، أقسام إدارية، زر إغلاق للوحة) وليس الهيرو العام للموقع فقط.
- **المدخل الأكثر موثوقية (بدون `#`):** بعض البرامج والطرفيات **تقطع الجزء بعد `#`** عند فتح الرابط. استخدم **معاملات الاستعلام**؛ بعد تسجيل الدخول تُفتح اللوحة تلقائياً عبر `sessionStorage`:

  `http://127.0.0.1:3333/financial-consulting/iif-fund-demo/index.html?iif_admin_portal=1&open_dashboard=1`

- **اختصار محلي (لا يحتوي `#`):** `http://127.0.0.1:3333/cp` أو `/dashboard` أو `/admin` (خادم التطوير فقط — **أعد تشغيل `npm start`** بعد التحديث).
- **Netlify:** بعد النشر يمكن `https://<موقعك>/fund-admin` (يحوّل لنفس معاملات الاستعلام أعلاه).
- **بدون جلسة:** تظهر **نافذة تسجيل الدخول** أولاً؛ بعد النجاح تُفتح اللوحة عند استخدام `open_dashboard=1` أو عند بقاء `#dashboard` / الهاش السري في `IIF_CONFIG`.
- **بديل قديم يعتمد على الهاش:** `…?iif_admin_portal=1#dashboard` أو `#dashboard` فقط — يعمل في المتصفح عند لصق الرابط يدوياً.
- **إن بقي الموقع الرئيسي فقط:** حدّث قوياً (**Ctrl+F5**) أو نافذة خاصة؛ على الإنتاج انتظر نشراً ناجحاً ثم أعد المحاولة.

### حلول شائعة (عنوان، 405، خادم قديم)

1. **`ERR_NAME_NOT_RESOLVED` واسم مضيف مثل `financial-consulting`**  
   وضعتَ في الشريط **مسار الملف فقط** (`financial-consulting/iif-fund-demo/index.html#dashboard`) دون عنوان الخادم. المتصفح يفسر `financial-consulting` كاسم موقع على الإنترنت — وليس مجلداً.  
   **الصحيح محلياً:** الصق الرابط **كاملاً** (مع `http://` والمنفذ):

   `http://127.0.0.1:3333/financial-consulting/iif-fund-demo/index.html#dashboard`

2. **`Method Not Allowed` على مسار المجلد**  
   غالباً طلب **ليس GET** (إضافة متصفح، أو خادم قديم). حدّث المشروع وأعد **`npm start`**. يدعم الخادم الآن **OPTIONS** للتطوير. يُفضّل فتح الملف صراحة: `…/iif-fund-demo/index.html` وليس إنهاء العنوان بـ `#` فقط.

3. **`127.0.0.1:3333/dashboard` يعرض «Not found» ونصاً قديماً عن الرابط المعتمد**  
   عملية **`node`** التي تشغّل المنفذ 3333 ما زالت من **نسخة قديمة** من `scripts/dev-server.js` (قبل اختصار `/dashboard`).  
   **الحل:** من جذر المشروع نفّذ `git pull` إن لزم، ثم **أوقف** الخادم (Ctrl+C في نافذة `npm start`) و**شغّل من جديد** `npm start`. بعدها جرّب مرة أخرى `/dashboard` أو الرابط الكامل أعلاه.

| المنصة | الرابط المعتمد |
|--------|----------------|
| **النطاق المخصّص (إنتاج)** | **`https://iiffund.com/`** — الصندوق: **`/financial-consulting/iif-fund-demo/`** أو **`/fund`** — اللوحة: **`/fund-admin`** أو معاملات الاستعلام كما في الأعلى |
| **Vercel** (معاينة/احتياط، فريق `dr-talal`) | `https://iif-fund-dr-talal.vercel.app/index.html` — اللوحة: `…/index.html#dashboard` |
| **Netlify** (اسم فرعي، مثال `fluffy-meerkat-eff966`) | `https://fluffy-meerkat-eff966.netlify.app/fund` — يُفضّل للجمهور **`iiffund.com`** |
| **GitHub Pages** (سير عمل `Deploy GitHub Pages`) | `https://alzahrani6020.github.io/iif-web/` — واجهة الصندوق عند جذر الموقع المنشور (المصدر في الـ workflow: `financial-consulting/iif-fund-demo/`)؛ اللوحة: `…/index.html#dashboard` أو معاملات الاستعلام كما في الأعلى. **لا** توجد دوال `/api/*` على Pages (خلاف Netlify). **لا** يوجد **`/healthz`** JSON ثابت هناك (يُخدم محلياً أو عبر Netlify/Vercel حسب الإعداد). **localStorage** خاص بكل نطاق — صورة الملف على `localhost` لا تظهر تلقائياً على `github.io`؛ أعد رفع الصورة على النطاق الذي تستخدمه أو استخدم نفس الموقع دائماً. رابط **SearXNG** في الهيدر على Pages يوجّه إلى واجهة عامة (ميتا `iif-searx-public-url` في `index.html`) وليس خادمك المحلي. |

## ملاحظات

- **`iif-fund.vercel.app`:** قد يكون مربوطاً بمشروع Vercel آخر أو نسخة قديمة. لتوحيد الاسم القصير انقل الـ alias من لوحة Vercel (انظر [VERCEL-DEPLOY.md](./VERCEL-DEPLOY.md)).
- **لا تلصق التوكنات** في الكود؛ الأسرار في GitHub فقط — راجع [SECURITY.md](./SECURITY.md).

## صيانة سريعة قبل الدمج

1. من جذر المشروع: `npm run verify` (أو `npm run verify:full`).
2. تأكد أن **CI** على `main` أخضر بعد `git push`.
3. في PowerShell على ويندوز: فضّل الفصل بـ **`;`** بين الأوامر بدل **`&&`** إن ظهرت أخطاء.
4. إن اعتمدت على SearXNG محلياً (Docker): `npm run verify:stack`.
5. عند إضافة حزم: `npm audit` من حين لآخر.

تفاصيل إضافية: [AGENTS.md](./AGENTS.md) (قسم «صيانة دورية»). قائمة تحقق أوسع (جهاز + منصات + مساعد): [قائمة-تحقق-قبل-الدمج.md](./قائمة-تحقق-قبل-الدمج.md).
