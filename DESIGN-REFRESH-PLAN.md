# خطة تجديد الواجهة — IIF Fund Demo

وثيقة عمل مرجعية لإعادة تصميم الواجهة العامة ثم اللوحة، بدون كسر النشر (GitHub Pages / Vercel) أو i18n.

---

## 1) الوضع الحالي (ملخص تقني)

| العنصر | الملاحظة |
|--------|-----------|
| `index.html` | ما زال كبيراً؛ جزء من التنسيق انتقل إلى `design-system.css` / `public-shell.css` / `public-components.css`؛ الباقي مضمّن (ومنها أنماط اللوحة). |
| `css/design-system.css` | **مصدر `:root` الموحّد** (ألوان IIF، مسافات، نصف أقطار، `--header-height`). |
| `css/public-shell.css` | هيكل `main#main-content`، `footer`، مراسي التمرير، **`.skip-link`**، حلقات تركيز للواجهة العامة. |
| `i18n.js` | مئات المفاتيح؛ أي نص جديد يمر عبر `iifT(...)` / `data-i18n`. |
| لوحة التحكم | قواعد حرجة مضمّنة — راجع `DASHBOARD-I18N-MAP.md`. |
| الخط | Plus Jakarta + **Noto Sans Arabic** (preload)؛ اختبار جوال/RTL: **`npm run e2e:public`**. |

---

## 2) الأهداف

1. **واجهة عامة** أوضح، أكثر ثقة مؤسسية، **جوال أولاً** و**RTL/LTR** متسقان.
2. **نظام تصميم واحد** (رموز لون/مسافة/نصف قطر) يُستورد من ملف واحد ثم يُعاد استخدامه في الصفحات الثانوية واللوحة لاحقاً.
3. **لا انقطاع** في المسارات الحرجة: `<base>`، الاختصارات `/cp` `/panel`، النماذج، التحليل، SearX proxy meta.

---

## 3) المراحل (مقترح التنفيذ)

### المرحلة A — أساس (1–2 جلسات عمل)

- [x] **A1** ربط `css/design-system.css` من `index.html` مبكراً في `<head>` (بعد خطوط Google، قبل `iif-seo-accessibility`)؛ `:root` المضمّن لاحقاً يطغى على التعارض.
- [x] **A2** خريطة المقاطع العامة في `index.html` (مرجع — دون إعادة تسمية):

| منطقة | محدد رئيسي | ملاحظة |
|--------|------------|--------|
| شريط علوي لزوم | `#service-page-back-bar` | يظهر عند سياق صفحة خدمة |
| تحذير HTTPS | `#https-warning` | تنبيه |
| **هيدر الموقع** | `header.site-header` | ساعة `#site-clock-wrap`، قائمة حكومة `#gov-menu`، مصادقة `#header-auth-btns`، بحث `#iif-search`، تيكرات `#ticker-track` / `#ticker-asian-*` / `#ticker-arab-*` |
| **المحتوى العام** | `main#main-content` | يبدأ بعد إغلاق `#dashboard-overlay` في DOM |
| **هيرو** | `section.hero` | `.hero__eyebrow`, `.hero__mission`, `.hero__actions`, `.hero__stats`, `.hero__visual` |
| ثقة ومسارات | `#trust-entry.section` | عنوان `#trust-entry-title` |
| أصحاب المصلحة | `#stakeholders` | |
| معايير الاختيار | `#selection-criteria` | |
| حوكمة | `#governance-snapshot` | |
| شركاء | `#partners-trust` | |
| لماذا الصندوق | `#why-fund` | |
| مجلس أعمال | `#business-council` | |
| قيادة | `#leadership` | |
| تاريخ | `#history` | |
| فريق / من نحن | `#about-team`, `#about` | |
| اقتراحات | `#suggest` | |
| استشارات | `#financial-consultation`, `#urgent-consultation-online` | |
| خدمات | `#services.section--services` | |
| قطاعات | `#sectors` | |
| أمثلة مشاريع | `#project-examples` | |
| رسالة / حكمة | `#mission`, `#hizkama` | |
| أنشطة | `#activities` | |
| امتثال | `#compliance` | |
| كيفية / مجلس / عضوية | `#how`, `#council`, `#membership` | |
| **اتصال (CTA)** | `#contact` | |
| **شروط** | `#terms.terms-section` | |
| **تذييل** | `footer` | روابط إلى `#terms`, `privacy.html`, `about-institution.html`, `#compliance` |
| زر عائم | `#iif-fab-contact` | |

- [x] **A3** ملف **`css/public-shell.css`**: `html` + scroll-margin للمراسي، `main#main-content` (عرض أقصى وتباعد)، `footer` — مربوط من `index.html` و`privacy.html` و`about-institution.html` بعد `design-system.css`. القواعد أُزيلت من المضمّن في `index.html` مع إشارة في التعليقات.
- [x] **A4** سجل تحقق أساسي: دفعة «اتم» — تغطية smoke + روابط CSS؛ **يُنصح** بإعادة فحص 375/768px وRTL يدوياً بعد أي تغيير بصري كبير.

### المرحلة B — الهوية والطباعة (2–3 جلسات)

- [x] **B1** حلقة تركيز (`--iif-focus-ring`) + `focus-visible` لروابط `main#main-content` و`footer`، وأزرار `.btn` في المحتوى العام، وروابط الصفحات الثانوية (`body:not(:has(#main-content))`).
- [x] **B2** **Noto Sans Arabic** (Google Fonts، `display=swap` + preload)؛ على `index.html`: `html[data-lang="ar"] body` يستخدم Noto مع `var(--font-sans)`؛ على الخصوصية/عن الصندوق: كتلة `.ar` + preconnect.
- [x] **B3** ملف **`css/public-components.css`**: `.iif-public-card` / `.iif-public-card--subtle`؛ مربوط من `index` + الصفحات الثانوية؛ بطاقة القيادة في `about-institution.html` تستخدم `iif-public-card`.

### المرحلة C — الصفحات الثانوية

- [x] **C1** `privacy.html` و `about-institution.html`: `design-system.css` + `public-shell.css`.
- [x] **C2** مراجعة روابط التذييل/الهيدر — لم يتغيّر مسار الهيكل في هذه الدفعة؛ الروابط الحالية (`#terms`, `privacy.html`, `about-institution.html`, `#compliance`, `#trust-entry`, …) لا تزال صالحة.

### المرحلة D — لوحة التحكم

- [x] **D1** وثيقة **`DASHBOARD-I18N-MAP.md`**: هيكل `#dashboard-overlay`، جدول TOC ↔ المراسي، قواعد `dash*` / `data-i18n` / نصوص JS.
- [x] **D2** اللوحة تستخدم أصلاً `var(--space-*)`, `var(--radius-*)`, `var(--color-*)` من **`design-system.css`** بعد مواءمة **6ب**؛ لا تغييرات إضافية على `position`/`z-index` في هذه الدفعة.
- [x] **D3** (عملية) تُشغَّل بعد كل دفعة: `npm run verify` + `smoke-with-server`؛ عند تغيير i18n: `check-i18n-keys.js --strict`.

---

## 4) دور MiniMax (أو أي نموذج لغوي)

| الاستخدام | مثال |
|-----------|------|
| مسودات عربية/إنجليزية | عناوين الأقسام، وصف قصير للهيرو، نصوص CTA. |
| بدائل قصيرة | تسميات أزرار، تلميحات أدوات، رسائل ترحيبية. |
| **ليس له** | قرار هيكل HTML المعقّد، أو استبدال مفاتيح i18n دون مراجعة بشرية. |

**سير العمل:** مسودة من النموذج → اختيارك → إدخال في `i18n.js` (en/ar/fr على الأقل للمفاتيح الجديدة) → ربط في HTML.

---

## 5) معايير جاهزية كل دفعة (قبل الدمج)

- [x] **آلي:** `npm run verify` + `npm run smoke:with-server` + (عند تغيير i18n) `check-i18n-keys.js --strict` — في CI.
- [x] **جوال + RTL (آلي اختياري):** `npm run e2e:public` (Playwright) — يُشغَّل أسبوعياً مع `e2e:dashboard`؛ `SKIP_E2E=1` للتخطي محلياً.
- [ ] **يدوي قبل إصدار حرج:** لا أخطاء Console لمسارات `assets/`؛ فتح على **GitHub Pages** و`localhost:3333`؛ فتح/إغلاق اللوحة — انظر [QA-PRE-RELEASE.md](./QA-PRE-RELEASE.md).

---

## 6) توحيد الرموز (6أ + 6ب)

- [x] **6أ** تحميل `design-system.css` قبل الأنماط المضمّنة.
- [x] **6ب** قيم `:root` الموحّدة في **`css/design-system.css`** (ألوان IIF، مسافات، نصف أقطار، `--header-height`، `--service-back-bar-height`)؛ حُذفت الكتل المكررة من `index.html` مع تعليق إحالة. تعديلات `:focus-visible` و`::selection` وشريط التمرير لتناسب `--color-primary` الداكن.

---

*مرجع لوحة: `DASHBOARD-I18N-MAP.md` — آخر تحديث: 2026-04-04.*

### مستقبلي (اختياري — خارج نطاق «المتبقي» المنفَّذ)

- استخراج تدريجي لمزيد من الأنماط من `index.html` إلى ملفات `css/` دون لمس أنماط اللوحة الحرجة.
- توسيع استخدام `.iif-public-card` في أقسام الصفحة الرئيسية.
