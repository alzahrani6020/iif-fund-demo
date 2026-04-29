# موقع Netlify منفصل لـ `thiqqah.live` (ثقة فقط)

**واقع الإنتاج:** فصل الدومينات لا يظهر للزوار من تعديل الكود وحده — **`thiqqah.live` يجب أن يشير إلى نشرة Netlify تُنشأ من مجلد `thiqqah-site`** وأن يُزال من أي موقع Netlify آخر. ما في الريبو (`thiqqah-site/netlify.toml` وإلخ) يجهّز ذلك؛ **الخطوة الحاسمة على لوحة Netlify + DNS**.

**أسرع طريق (يضبط Base directory تلقائياً):**  
[Deploy Thiqqah from GitHub — base = `thiqqah-site`](https://app.netlify.com/start/deploy?repository=https://github.com/alzahrani6020/iif-web&base=thiqqah-site)

بعد الموافقة على GitHub، راجع أن **Publish directory** = `.` (يُستمد عادة من `thiqqah-site/netlify.toml`) ثم ثبّت الدومين كما في الأسفل.

**من الجهاز:** **`RUN-NETLIFY-THIQQAH-STANDALONE.cmd`** أو **`npm run netlify:thiqqah:setup`** — يفتح رابط النشر أعلاه وقائمة الفريق (لا يستبدل تسجيل الدخول).

الهدف: **`iiffund.com`** يبقى للصندوق والمشروع الكامل، و **`thiqqah.live`** يفتح **موقع ثقة فقط** — بدون خلط وبدون تحويل إلى دومين آخر.

## 0) تشخيص «عجز الفصل» (قبل تعديل الكود مرة أخرى)

من جذر المشروع:

```bash
npm run verify:thiqqah:live-domain
```

**أنماط نتيجة فعلية (مثال تم التحقق منه على الإنترنت):**

| المسار | إن كان الوضع خاطئاً |
|--------|----------------------|
| `/` | **200** بحجم صغير جداً (~9.5 KB) = ملف **`index.html` البوابة** في الجذر، وليس ثقة. |
| `/thiqqah-site/index.html` | **404** = النشرة المرتبطة بالدومين **لا تحتوي** مجلد `thiqqah-site`، لذلك لا يمكن لتوجيهات `netlify.toml` أن «تُصلح» العرض بوجود الملف. |
| `/financial-consulting/iif-fund-demo/index.html` | **200** بحجم كبير (~700KB+) = واجهة الصندوف **ما زالت ضمن نفس النشرة** |

هذا لا يعني خطأً في الريبو وحده؛ يعني أن **`thiqqah.live` في Netlify مربوط بموقع/نشر لا يطابق «نشر الجذر الكامل» الذي يضم `thiqqah-site`**، أو أن النشر قديم. الحل هو **موقع Netlify مستقل لـ `thiqqah-site`** (الأقسام 1–3 أدناه) ونقل الدومين إليه، وليس حذف المشروع بالكامل من Netlify.

## 1) إنشاء موقع جديد على Netlify

1. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
2. اختر **GitHub** والمستودع **`alzahrani6020/iif-web`** (أو نفس الريبو المستخدم لـ `iiffund.com`).

## 2) إعداد البناء (مهم)

| الحقل | القيمة |
|--------|--------|
| **Base directory** | `thiqqah-site` |
| **Build command** | اتركه **فارغاً** (أو سيُستخدم `true` من `thiqqah-site/netlify.toml`) |
| **Publish directory** | `.` (نقطة فقط) |

بهذا يُنشر **محتوى `thiqqah-site` كأن يكون جذر الموقع** — أي `https://thiqqah.live/` يخدم `index.html` لثقة مباشرة.

## 3) الدومين

1. **Domain management** → أضف **`thiqqah.live`** و **`www.thiqqah.live`** على **هذا الموقع الجديد فقط**.
2. على **الموقع القديم** الذي كان يعلّق عليه `thiqqah.live` (مثل `fluffy-meerkat-eff966`): **احذف** `thiqqah.live` من **Domain management** حتى لا يتعارض اثنان.
3. في **Name.com** (DNS): طبّق السجلات التي يعرضها Netlify **لهذا الموقع الجديد** (قد يختلف **CNAME** لـ `www` عن الموقع الآخر).

## 4) التحقق

- `https://thiqqah.live/` — صفحة ثقة.
- `https://iiffund.com/` — كما هو (صندوق وباقي المسارات).
- لا يجب أن يظهر مسار الصندوق على دومين ثقة لأن الملفات المنشورة **لا تحتوي** على بوابة الجذر للصندوق.

## 5) الأعطال

- إن فشل البناء: تأكد أن **Base directory** = `thiqqah-site` وليس الجذر.
- إن بقي الدومين يفتح موقعاً خاطئاً: تأكد أن **DNS** يشير لموقع Netlify الذي أضفت عليه `thiqqah.live` **الآن**، وليس لموقع قديم.

## ملف الإعداد

الإعداد محفوظ في **`thiqqah-site/netlify.toml`** ويُقرأ عندما يكون **Base directory** هو `thiqqah-site`.
