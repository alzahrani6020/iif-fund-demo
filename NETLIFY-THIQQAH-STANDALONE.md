# موقع Netlify منفصل لـ `thiqqah.live` (ثقة فقط)

**من الجهاز:** نفّذ مرتين **`RUN-NETLIFY-THIQQAH-STANDALONE.cmd`** (جذر المشروع) أو من الطرفية: **`npm run netlify:thiqqah:setup`** — يفتح Netlify والتذكير بالإعدادات (لا يستبدل تسجيل الدخول).

الهدف: **`iiffund.com`** يبقى للصندوق والمشروع الكامل، و **`thiqqah.live`** يفتح **موقع ثقة فقط** — بدون خلط وبدون تحويل إلى دومين آخر.

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
