# دومينان منفصلان: `iiffund.com` (صندوق) و `thiqqah.live` (ثقة)

**الهدف:** يظهر لكل زائر **اسم الدومين فقط** في الشريط — `https://iiffund.com/` للصندوق، و`https://thiqqah.live/` لثقة — **بدون** مسار مثل `/thiqqah-site/` على دومين ثقة.

يتطلب **موقعين منفصلين على Netlify** (نفس المستودع `iif-web`، فرع `main`). **Name.com:** تسجيل + **DNS فقط** (قيم تنسخها من Netlify لكل موقع).

---

## أ) موقع الصندوق — `iiffund.com`

| # | الإجراء |
|---|---------|
| 1 | Netlify → **موقع واحد** ← ربط GitHub بالريبو، **بدون** Base directory (الجذر). |
| 2 | **Domain management** → أضف **`iiffund.com`** و **`www`** لهذا الموقع **فقط**. |
| 3 | Name.com → **DNS** بحسب ما يعرضه Netlify **لهذا الموقع** (A + CNAME لـ www). |
| 4 | عطّل URL forwarding من المسجّل إن وُجد. انتظر **HTTPS** يتحقق في Netlify. |

**تحقق:** `https://iiffund.com/` يفتح واجهة الصندوق/البوابة؛ `npm run verify:iiffund:https`

---

## ب) موقع ثقة — `thiqqah.live`

| # | الإجراء |
|---|---------|
| 1 | Netlify → **موقع جديد** ← نفس الريبو، **Base directory = `thiqqah-site`**, **Publish = `.`** |
| 2 | **Domain management** → أضف **`thiqqah.live`** و **`www`** لهذا الموقع **فقط**. |
| 3 | **احذف** `thiqqah.live` من **أي** موقع Netlify آخر (تعارض يفسد النتيجة). |
| 4 | Name.com → **DNS** بحسب Netlify **لموقع ثقة الجديد** (قد تختلف القيم عن موقع الصندوق). |

**تحقق:** `https://thiqqah.live/` صفحة ثقة كاملة في الجذر؛ `npm run verify:thiqqah:live-domain`

---

## ج) من الطرفية (بعد ضبط اللوحة)

```bash
npm run verify:production-domains
```

أو خطوة بخطوة: **`npm run netlify:thiqqah:complete`** ثم التحقق أعلاه.

**مراجع:** [NETLIFY-THIQQAH-STANDALONE.md](./NETLIFY-THIQQAH-STANDALONE.md) · [NETLIFY-CHECKLIST.md](./NETLIFY-CHECKLIST.md)
