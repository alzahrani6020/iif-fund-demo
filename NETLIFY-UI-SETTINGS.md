# إعدادات Netlify (لصقها يدوياً إن طلبت الواجهة الحقول)

| الحقل | القيمة |
|--------|--------|
| **Base directory** | *(فارغ — جذر المستودع)* |
| **Build command** | `npm ci --no-audit --fund=false && npm run build` |
| **Publish directory** | `.` |

**بيئة البناء (اختياري — مكرّرة في `netlify.toml`):**

- `NODE_VERSION` = `22` (أو اترك `netlify.toml` يحددها — يطابق `.nvmrc`)
- `NODE_ENV` = `production`
- `CI` = `true`

بعد ربط GitHub: **Deploy** أو انتظار البناء التلقائي عند الـ push.

**اختصارات (معرّفة في `netlify.toml`):**

| المسار | يوجّه إلى |
|--------|-----------|
| `/fund` | واجهة الصندوق |
| `/gov` | المنصة الحكومية |

للنشر اليدوي من GitHub Actions: أضف الأسرار `NETLIFY_AUTH_TOKEN` و `NETLIFY_SITE_ID` ثم شغّل workflow **Deploy Netlify**.

---

## متغيرات الموقع (Site → Environment variables) — نسخ احتياطي آمن خارج Git

| المتغير | الغرض |
|---------|--------|
| `SEARXNG_URL` | عنوان SearXNG (HTTPS). إن لم يُضبط غالباً يُستخدم الافتراضي من `netlify.toml`. |
| `IIF_TRANSLATE_URL` | مترجمكم (NLLB) على `https://…/translate`. بدونها تُستخدم LibreTranslate احتياطياً في الدالة. |
| `IIF_TRANSLATE_LIBRE_URL` | اختياري — مثيل LibreTranslate عند الاعتماد على الاحتياطي فقط. |
| `IIF_TRANSLATE_LIBRE_API_KEY` | اختياري — إن اشترط المثيل مفتاحاً. |
| `IIF_SEARX_TIMEOUT_MS` / `IIF_TRANSLATE_TIMEOUT_MS` | اختياري — حدود زمن للدوال. |

**بعد النشر:** من جهازك `PROXY_BASE=https://… npm run smoke:live` أو من GitHub → Actions → **Smoke live site** (يدوي) مع إدخال رابط الموقع.

**ضبط المتغيرات عبر API (اختياري):** من جهاز موثوق مع `NETLIFY_AUTH_TOKEN` و`NETLIFY_SITE_ID` — `npm run netlify:env:sync` (انظر `deploy/README.md`).

**فحص سريع من المتصفح:** `https://<موقعك>/healthz` — يعرض حالة اتصال SearX والترجمة (إن وُجدت) دون كسر الصفحة إن فشل جزء.
