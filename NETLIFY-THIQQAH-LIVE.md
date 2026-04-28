# ربط الدومين الأساسي لموقع ثقة الذهبية (thiqqah.live) على Netlify

الموقع الثابت موجود في المستودع تحت **`thiqqah-site/`** ويُنشر مع باقي المشروع (`publish = "."` في `netlify.toml`). المسارات الجاهزة:

| المسار | الوصف |
|--------|--------|
| `/thiqqah-site/index.html` | الصفحة الكاملة |
| `/thiqqah` أو `/thiqqah/` | اختصار (302 → نفس الصفحة) |

## خيار موصى به: نفس موقع Netlify + دومين إضافي

إذا كان الإنتاج الحالي على **`iiffund.com`** من نفس الريبو:

1. في Netlify: **Site configuration → Domain management → Add domain** وأضف **`thiqqah.live`** و **`www.thiqqah.live`** (أو اختر واحداً كأساسي والآخر يعيد التوجيه من الواجهة).
2. اتبع تعليمات **DNS** التي يعرضها Netlify (عادةً سجلّان لـ Netlify أو CNAME لـ `www`).
3. بعد التحقق، يفرض Netlify **HTTPS** تلقائياً.
4. في `netlify.toml` تمت إضافة توجيهات بحيث:
   - **`https://thiqqah.live/`** و **`https://www.thiqqah.live/`** يُعادان إلى **`/thiqqah-site/index.html`**  
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

## مراجع داخلية

- `CANONICAL-URLS.md` — روابط الإنتاج المعتمدة للصندوق.
- `thiqqah-site/QA-CHECKLIST.txt` — تحقق يدوي سريع قبل الإطلاق.
