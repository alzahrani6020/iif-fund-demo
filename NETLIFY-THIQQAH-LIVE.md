# ربط الدومين الأساسي لموقع ثقة الذهبية (thiqqah.live) على Netlify

## تشخيص سريع (404 من Netlify رغم صحة DNS)

إذا كان **DNS** يشير فعلاً إلى Netlify (مثلاً سجل **A** للجذر إلى `75.2.60.5` وسجل **CNAME** لـ `www` نحو **`….netlify.app`**) لكن المتصفح أو `curl` يعيد **404** ونصاً مثل `Not Found` مع ترويسة `Server: Netlify`، فالخلل شائعاً **ليس في المستودع** بل في الخطوة الناقصة التالية:

1. ادخل Netlify → الموقع الذي ينشر هذا الريبو (مثلاً الحالي: **`fluffy-meerkat-eff966`**).
2. **Domain management** → **Add domain** وأضف **`thiqqah.live`** ثم **`www.thiqqah.live`** (أو التحقق التلقائي يضيفهما).
3. انتظر **Verify DNS** ثم **HTTPS / Provision certificate** إن لزم.

طالما الدومين **غير مدرج** في قائمة النطاقات لذلك الموقع، لن يُعرَض المحتوى على `https://thiqqah.live/` حتى لو السجلات صحيحة. للمقارنة: إن فتح **`https://fluffy-meerkat-eff966.netlify.app/`** يعطي **200** بينما `https://thiqqah.live/` يعطي **404**، فالمطلوب هو ربط الدومين في اللوحة كما فوق.

### مرّت ساعات (أو 12+ ساعة) وما زال 404؟

**انتشار DNS ليس السبب الوحيد.** عندما يكون سجلّك **صحيحاً مسبقاً** (مثل `A` → `75.2.60.5` و`www` → `….netlify.app`)، التأخير الطويل لا يغيّر شيئاً إن كان **الدومين غير مربوط بالموقع الذي يملك هذا الـ `*.netlify.app`**.

راجع بالترتيب:

1. **افتح بالضبط:** [لوحة المواقع](https://app.netlify.com/teams) → اختر الموقع **`fluffy-meerkat-eff966`** (الذي يطابق سجل **CNAME** لـ `www` عندك: `fluffy-meerkat-eff966.netlify.app`).
2. **Site configuration → Domain management → Custom domains:** يجب أن يظهر **`thiqqah.live`** و **`www.thiqqah.live`** (أو واحد مع إعادة توجيه للآخر) **مع حالة تامة** (مثلاً «Verified» / علامة صح خضراء)، **وليس** «Pending DNS» بدون إكمال.
3. **خطأ شائع:** إضافة الدومين على **موقع Netlify آخر** (موقع جديد فارغ، أو موقع فريق آخر، أو موقع مرتبط بمستودع مختلف). في هذه الحالة يبقى **`https://fluffy-meerkat-eff966.netlify.app`** يعمل بـ **200** بينما **`https://thiqqah.live`** يعطي **404** ونصاً قصيراً مثل `Not Found`.
4. **إن وجدت الدومين مربوطاً بموقع خاطئ:** احذفه من **Domain management** لذلك الموقع، ثم أضفه من جديد تحت **`fluffy-meerkat-eff966`** فقط.
5. **تحقق سريع من جهازك:** إن كان `https://fluffy-meerkat-eff966.netlify.app/` يفتح الموقع بينما `https://thiqqah.live/` لا يفتح، فالمشكلة **حصراً** في خطوة 2–4 وليس في انتظار «ساعة أخرى» للـ DNS.
6. **الدعم:** إن تأكدت أن الدومين مدرج على **`fluffy-meerkat-eff966`** وما زال 404، انسخ **Request ID** من رسالة الخطأ (مثل ترويسة الاستجابة `X-Nf-Request-Id`) وافتح تذكرة مع Netlify مع لقطة شاشة لصفحة **Domain management**.

---

الموقع الثابت موجود في المستودع تحت **`thiqqah-site/`** ويُنشر مع باقي المشروع (`publish = "."` في `netlify.toml`). المسارات الجاهزة:

| المسار | الوصف |
|--------|--------|
| `/thiqqah-site/index.html` | الصفحة الكاملة |
| `/thiqqah` أو `/thiqqah/` | اختصار (302 → نفس الصفحة) |

### تحقق حاسم: هل نشر Netlify يضمّن `thiqqah-site`؟

افتح في المتصفح (أو `curl -I`) **`https://اسم-موقعك.netlify.app/thiqqah-site/index.html`** و **`https://iiffund.com/thiqqah-site/index.html`**.

- إن كان **الأول 404** والثاني **200**، فـ **`thiqqah.live` غالباً مربوط بموقع Netlify مختلف** عن الموقع الذي يخدم **`iiffund.com`** (نشر أقدم أو إعداد لوحة منشور مختلف). الحل الأنظف: في Netlify أنقل أو أضف **`thiqqah.live`** إلى **نفس الموقع** الذي يظهر فيه **`iiffund.com`** ضمن **Domain management**، ثم اضبط DNS كما تطلب اللوحة.  
- **`index.html` في جذر المشروع** يحتوي احتياطاً: على مضيفي `thiqqah.live` يتحقق من وجود `/thiqqah-site/index.html` وإن ردّ الخادم بغير نجاح يُوجّه إلى **`https://iiffund.com/thiqqah-site/index.html`** حتى يعمل الموقع فوراً ريثما يتوحّد الدومين على النشر الصحيح.

## خيار موصى به: نفس موقع Netlify + دومين إضافي

إذا كان الإنتاج الحالي على **`iiffund.com`** من نفس الريبو:

1. في Netlify: **Site configuration → Domain management → Add domain** وأضف **`thiqqah.live`** و **`www.thiqqah.live`** (أو اختر واحداً كأساسي والآخر يعيد التوجيه من الواجهة).
2. اتبع تعليمات **DNS** التي يعرضها Netlify (عادةً سجلّان لـ Netlify أو CNAME لـ `www`).
3. بعد التحقق، يفرض Netlify **HTTPS** تلقائياً.
4. في `netlify.toml` تمت إضافة توجيهات بحيث:
   - **`https://thiqqah.live/`** و **`https://www.thiqqah.live/`** يُعادان إلى **`/thiqqah-site/index.html`**
   - مسارات **صندوق الاستثمار** على نفس النشر (مثل **`/financial-consulting/...`** واختصارات **`/fund`**, **`/admin`**, **`/gov`**, …) تُعاد **على مضيفي `thiqqah.live` و`www` فقط** إلى **`/thiqqah-site/index.html`** حتى لا يظهر موقع الصندوق على دومين «ثقة». على **`iiffund.com`** و**`*.netlify.app`** تبقى تلك المسارات كما هي.
   هذا ضروري لأن الصفحة تستخدم مسارات نسبية مثل **`assets/...`**؛ البقاء تحت مسار **`/thiqqah-site/`** يضمن تحميل الخطوط والصور بشكل صحيح.

**ملاحظة:** الزوار الذين يفتحون الجذر على الدومين الجديد سيرون بعد التوجيه عنواناً يحتوي **`/thiqqah-site/`** (أو يمكنك لاحقاً تحديث الـ canonical في `thiqqah-site/index.html` ليطابق الرابط النهائي الذي تفضله).

## خيار بديل: موقع Netlify منفصل لـ thiqqah فقط

إذا أردت أن يكون **`thiqqah.live`** على **موقع Netlify جديد** مرتبط بنفس الريبو:

1. أنشئ موقعاً جديداً من GitHub → نفس المستودع.
2. في **Site settings → Build & deploy → Build settings**:
   - **Publish directory:** `thiqqah-site`
   - **Build command:** اتركه فارغاً أو `:` (الموقع ثابت بدون بناء).
3. قد يظل **`netlify.toml` في جذر المستودع** يؤثر على البناء؛ راجع لوحة Netlify إن احتجت **تجاوز الإعدادات** (Overrides). إذا تعارض توجيه **`/`** مع واجهة الصندوق، الأفضل فرعاً مستقلاً أو ضبطاً يدوياً في لوحة الموقع الثاني.

## بعد الربط

- راجع تبويب **Deploys** وتأكد أن آخر دفع من **`main`** ناجح.
- افتح `https://thiqqah.live/thiqqah-site/index.html` ثم الجذر `https://thiqqah.live/` وتأكد من التوجيه والأصول.
- راجع **GitHub Actions** لسير عمل **Thiqqah site i18n** عند تعديل `thiqqah-site/` أو سكربتات التحقق.

## إذا ظهر `ERR_CONNECTION_RESET` أو لا يفتح الموقع

1. **DNS لم يُوجَّه بعد إلى Netlify** — أنشئ السجلات التي يعطيك إياها الموقع في **Domain management → DNS configuration** (غالباً **A** إلى عناوين Netlify أو **CNAME** لـ `www`). إذا كان الدومين يستخدم أسماء خوادم من مسجّل آخر (مثل Name.com)، إما تضيف السجلات هناك أو تغيّر **nameservers** إلى خوادم Netlify كما يُنصح في لوحة الدومين.
2. **انتظر انتشار DNS** — قد يستغرق من دقائق إلى ساعات؛ جرّب من شبكة أخرى أو [DNS checker](https://www.whatsmydns.net).
3. **HTTPS** — بعد ربط الدومين، انتظر إصدار الشهادة في Netlify؛ لا تعتمد على `http://` فقط إذا كان المتصفح يفرض HTTPS.
4. **جدار ناري / VPN / برنامج أمان** — قد يقطع TLS فيُظهر إعادة ضبط الاتصال؛ جرّب تعطيل VPN مؤقتاً.

## مراجع داخلية

- `CANONICAL-URLS.md` — روابط الإنتاج المعتمدة للصندوق.
- `thiqqah-site/QA-CHECKLIST.txt` — تحقق يدوي سريع قبل الإطلاق.

## تاريخ تسجيل الدومين (مرجع المحتوى)

يُذكر في **`thiqqah-site/index.html`** أن **تاريخ النشر** يطابق **تاريخ التسجيل** العام لـ **thiqqah.live** حسب سجل **RDAP** للـ TLD (حدث `registration`): **2024-11-30**. عند تجديد أو نقل الدومين لا يُغيّر ذلك تلقائياً — حدّث الميتا وJSON-LD إذا أردت مطابقة تاريخ جديد من مسجل الدومين.
