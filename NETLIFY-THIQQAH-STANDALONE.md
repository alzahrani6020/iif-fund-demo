# موقع Netlify منفصل لـ `thiqqah.live` (ثقة فقط)

**اختصار لدومينين:** [DOMINI-IIFFUND-THIQQAH.md](./DOMINI-IIFFUND-THIQQAH.md) — جدول `iiffund.com` + `thiqqah.live` و **`npm run verify:production-domains`**.

**واقع الإنتاج:** فصل الدومينات لا يظهر للزوار من تعديل الكود وحده — **`thiqqah.live` يجب أن يشير إلى نشرة Netlify تُنشأ من مجلد `thiqqah-site`** وأن يُزال من أي موقع Netlify آخر. ما في الريبو (`thiqqah-site/netlify.toml` وإلخ) يجهّز ذلك؛ **الخطوة الحاسمة على لوحة Netlify + DNS**.

**أسرع طريق (يضبط Base directory تلقائياً):**  
[Deploy Thiqqah from GitHub — base = `thiqqah-site`](https://app.netlify.com/start/deploy?repository=https://github.com/alzahrani6020/iif-web&base=thiqqah-site)

بعد الموافقة على GitHub، راجع أن **Publish directory** = `.` (يُستمد عادة من `thiqqah-site/netlify.toml`) ثم ثبّت الدومين كما في الأسفل.

**من الجهاز:** **`RUN-NETLIFY-THIQQAH-STANDALONE.cmd`** أو **`npm run netlify:thiqqah:setup`** — يفتح رابط النشر أعلاه وقائمة الفريق (لا يستبدل تسجيل الدخول).

**إكمال الخطوات + فتح الروابط + فحص مباشر:** **`npm run netlify:thiqqah:complete`** (أو **`RUN-NETLIFY-THIQQAH-COMPLETE.cmd`** في جذر المشروع).

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

**الفكرة:** **Netlify** يخبرك **ماذا** يجب أن تكون سجلات DNS (قيم **A** و **CNAME** وغيرها). **Name.com** (أو أي مسجّل آخر حيث مسجَّل الدومين) هو المكان الذي **تُدخل فيه** هذه السجلات فعلياً — بدون ذلك يبقى `thiqqah.live` يشير لوجهة قديمة أو لا يُفعَّل HTTPS بشكل صحيح.

1. **Domain management** على Netlify → أضف **`thiqqah.live`** و **`www.thiqqah.live`** على **هذا الموقع الجديد فقط**.
2. انسخ من Netlify قسم **DNS** أو **Domain management → DNS configuration** (القيم الموصى بها لربط الدومين بـ Netlify).
3. على **الموقع القديم** الذي كان يعلّق عليه `thiqqah.live` (مثل `fluffy-meerkat-eff966`): **احذف** `thiqqah.live` من **Domain management** حتى لا يتعرض دومينان لنفس الاسم على موقعين.
4. في **Name.com** (لوحة **DNS Records** للدومين): أضف أو حدّث السجلات لتطابق ما نسخته من Netlify **للموقع الجديد** الذي أنشأته لثقة.

### إن كان الدومين مسجَّلاً عند Name.com تحديداً

| ماذا تفعل | لماذا |
|-----------|--------|
| أضف أو حدّث سجل **A** للجذر (`@`) إلى عناوين **IPv4** التي يعطيها Netlify | حتى يستقبل **`thiqqah.live`** طلبات **Netlify** وليس خادماً آخر |
| أضف أو حدّث **CNAME** لـ **`www`** نحو **`اسم-الموقع.netlify.app`** كما يظهر لـ **هذا** الموقع على Netlify | **`www.thiqqah.live`** يخدم نفس نشرة ثقة |
| عطّل أو احذف **URL Forwarding** / **Redirect** القديم في Name.com | التوجيه من المسجّل قد يكسر HTTPS أو يوجّه لوجهة خاطئة |
| إن غيّرت **Nameservers** | إمّا إدارة السجلات في **Netlify DNS** أو الإبقاء على خوادم Name.com وإدخال السجلات يدوياً — المهم أن النتيجة تطابق طلب Netlify |

قد يختلف **CNAME** لـ `www` بين موقع `iiffund.com` والموقع الجديد لثقة — انسخ القيمة **من الموقع الذي أضفت عليه `thiqqah.live` الآن** فقط.

## 4) التحقق

- `https://thiqqah.live/` — صفحة ثقة.
- `https://iiffund.com/` — كما هو (صندوق وباقي المسارات).
- لا يجب أن يظهر مسار الصندوق على دومين ثقة لأن الملفات المنشورة **لا تحتوي** على بوابة الجذر للصندوق.

## 5) الأعطال

- إن فشل البناء: تأكد أن **Base directory** = `thiqqah-site` وليس الجذر.
- إن بقي الدومين يفتح موقعاً خاطئاً: تأكد أن **DNS** يشير لموقع Netlify الذي أضفت عليه `thiqqah.live` **الآن**، وليس لموقع قديم.

## ملف الإعداد

الإعداد محفوظ في **`thiqqah-site/netlify.toml`** ويُقرأ عندما يكون **Base directory** هو `thiqqah-site`.
