# إكمال ما قبل النشر — ملخص جاهزية المستودع

استخدم هذا الملف مع [قبل-النشر.md](./قبل-النشر.md). ما يلي **مُنفَّذ في الكود**؛ يبقى عليك التحقق اليدوي والدفع إلى GitHub.

## ما تم إعداده في المشروع

| البند | الحالة |
|--------|--------|
| صفحات الثقة | `legal/index.html`، `privacy.html`، `disclaimer.html`، `contact.html` |
| اختصارات Netlify | `/legal`، `/privacy`، `/disclaimer`، `/contact` → انظر `netlify.toml` |
| خادم التطوير | نفس الاختصارات + `/legal/` كمجلد — `scripts/dev-server.js` |
| صورة مشاركة اجتماعية | `assets/og-cover.svg` — مرتبطة من المنصة الحكومية |
| فحص الروابط | `scripts/check-urls.js` يشمل الوثائق و`og-cover.svg` |
| تذييلات | روابط للوثائق في المنصة الحكومية، `fund-site`، الرئيسية |

## ما يجب أن تفعله أنت قبل «النشر المبهر»

1. **`npm run verify`** من جذر المشروع — يجب أن ينجح.
2. **`npm start`** ثم **`npm run check-urls`** — كل المسارات يجب أن تعطي 200.
3. **Git:** `git add` / `commit` / `push` إلى `main` (أو الفرع المربوط بـ Netlify).
4. **بعد أول نشر:** افتح النطاق `*.netlify.app` وجرّب `/`، `/fund`، `/gov`، `/privacy`، `/legal`.
5. **مشاركة اجتماعية:** إن احتجت رابط `og:image` مطلقاً 100%، عيّن النطاق النهائي في واجهة Netlify أو حدّث الوسوم يدوياً (بعض المنصات تقبل المسارات النسبية مع النطاق تلقائياً).
6. **SearXNG على الإنترنت:** غيّر `secret_key` — راجع [engines/searxng/SECRET-PRODUCTION.md](./engines/searxng/SECRET-PRODUCTION.md).

---

*آخر تحديث تلقائي للهيكل: مارس 2026.*
