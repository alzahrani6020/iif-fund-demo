# إرشادات للمساعدين (بشر / ذكاء اصطناعي)

## الهدف

مشروع **واجهات ثابتة** (HTML/CSS/JS) + خادم تطوير Node — **بدون إطار عمل** في الجذر. المستودع على GitHub: **`alzahrani6020/iif-web`**.

**مسارات مثل** `financial-consulting/.../README.md` **ليست روابط ويب** — لا تُبحث في Google؛ راجع [PATHS-NOT-GOOGLE.md](./PATHS-NOT-GOOGLE.md).

**الرؤية (للمستخدمين والثقافات والأنظمة):** مذكورة في [README.md](./README.md) — عند إضافة ميزات، راعِ الخصوصية والامتثال حيث ينطبق.

## أين الملفات المهمة

| المسار | المحتوى |
|--------|---------|
| `financial-consulting/government-search/` | المنصة الحكومية، `government-data.json` → يُولَّد `government-data.js` |
| `financial-consulting/iif-fund-demo/` | واجهة الصندوق الأصلية (ملفات كثيرة) — **قبل نشر تغييرات حرجة:** [QA-PRE-RELEASE.md](./financial-consulting/iif-fund-demo/QA-PRE-RELEASE.md)؛ لوحة التحكم + i18n: [DASHBOARD-I18N-MAP.md](./financial-consulting/iif-fund-demo/DASHBOARD-I18N-MAP.md)؛ تجديد التصميم: [DESIGN-REFRESH-PLAN.md](./financial-consulting/iif-fund-demo/DESIGN-REFRESH-PLAN.md) |
| `financial-consulting/fund-site/` | واجهة أبسط |
| `executive-brief.html`، `sovereign-standards.html` (جذر المستودع) | موجز للمستويات الرفيعة + معايير سيادية؛ اختصارات `/executive`، `/sovereign`، `/charter` |
| `scripts/dev-server.js` | خادم التطوير (`3333`) + بروكسي `/api/searx` → SearXNG على `18080` |
| `engines/searxng/` | **Tor + SearXNG** (Docker) — `npm start` → `/api/searx`؛ محركات `.onion` عبر حاوية `tor` |
| [CANONICAL-URLS.md](./CANONICAL-URLS.md) | روابط **إنتاج** Vercel وNetlify المعتمدة (مرجع واحد) |
| `thiqqah-site/` | موقع **ثقة الذهبية**؛ نشر Netlify مستقل: [NETLIFY-THIQQAH-STANDALONE.md](./NETLIFY-THIQQAH-STANDALONE.md) و`RUN-NETLIFY-THIQQAH-STANDALONE.cmd` / `npm run netlify:thiqqah:setup` |
| [قائمة-تحقق-قبل-الدمج.md](./قائمة-تحقق-قبل-الدمج.md) | تجنّب أخطاء وازدواجية؛ انسجام الجهاز والمنصات والمساعد؛ **قسم 7:** وقاية واستعادة عند خلل في الكود أو الجهاز أو المنصات |

## الأوامر (من جذر المشروع)

**ويندوز — تشغيل كامل:** `START-IIF-FULL.bat` (Docker + خادم 3333 + فتح المنصة الحكومية).

```bash
npm start          # خادم التطوير
npm run build      # توليد government-data.js من JSON
npm run validate   # نفس البناء
npm run verify       # build + فحص صياغة dev-server و check-urls و smoke-with-server (بدون تشغيل خادم)
npm run verify:full  # نفس verify ثم تشغيل خادم مؤقت + smoke:html (تحقق كامل بأمر واحد)
npm run smoke:with-server  # خادم مؤقت + smoke فقط (إن كان المنفذ 3333 مشغولاً: `set PORT=3334` ثم نفس الأمر)
npm run check-urls # بعد تشغيل الخادم — يتحقق من `/` و`iif-fund-demo/index.html` والمنصة وغيرها (انظر scripts/check-urls.js)
npm run health        # بعد `npm start`: check-urls + smoke:html (يشمل index + صفحات حرجة أخرى)
npm run verify:searx  # هل SearXNG يستجيب على 18080؟ (بعد docker compose)
npm run verify:stack  # verify + verify:searx
npm run qa:iif-fund   # نفس smoke:html — اسم صريح لواجهة الصندوق
npm run e2e:public    # Playwright: عرض جوال + lang=ar/Noto + privacy (يتطلب npx playwright install chromium)
npm run e2e:dashboard # Playwright: فتح اللوحة من /admin-direct
```

- **Node:** `>=22` (`.nvmrc` / `.node-version` — مطابق لـ CI وNetlify).

### تكامل MiniMax (سطر أوامر — API السحابي)

- يستدعي **MiniMax Platform API** (مفتاح من [platform.minimax.io](https://platform.minimax.io))، وليس تطبيق **MiniMax Agent** على سطح المكتب — التطبيق لا يوفّر عادةً واجهة برمجية للتحكم به من سكربتات محلية.
- انسخ `.env.example` إلى `.env` وضع `MINIMAX_API_KEY` (لا ترفع `.env`).
- مثال: `npm run minimax:ask -- "اقترح 3 تحسينات لواجهة الصندوق"` — أو أرسل نصًا طويلًا عبر **stdin** (بدون وسائط بعد `--`).
- للمساعدة: `npm run minimax:ask -- --help`
- للتحقق من المفتاح بدون عرضه: `npm run minimax:status`
- ويندوز (PowerShell آمن): `.\scripts\Invoke-MiniMaxAsk.ps1 "سؤالك"` أو **`ASK-MINIMAX-SAFE.bat`**
- **مبتدئ — ضبط المفتاح بنقرة:** انقر **`MINIMAX-KEY-SETUP.bat`** (يفتح صفحة المفتاح + ملف `.env`) ثم **`MINIMAX-TEST.bat`**
- **PowerShell (نفس فكرة الـ bat):** من جذر المشروع: `powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\MiniMax-Key-Setup.ps1`
- فحص المشروع محلياً بدون خادم: `npm run verify:local` أو **`VERIFY-IIF-LOCAL.bat`**

### صيانة دورية (اقتراح)

قائمة مختصرة قبل الدمج (جهاز + CI + منصات + مساعد): [قائمة-تحقق-قبل-الدمج.md](./قائمة-تحقق-قبل-الدمج.md).

- قبل دمج تغييرات كبيرة: `npm run verify:full` أو `npm run health` (مع تشغيل `npm start` للخادم على `3333`).
- تغييرات **حرجة** على واجهة الصندوق: [QA-PRE-RELEASE.md](./financial-consulting/iif-fund-demo/QA-PRE-RELEASE.md).
- بعد تشغيل SearXNG عبر Docker: `npm run verify:stack`.
- عند إضافة حزم npm: `npm audit` من حين لآخر.

## النشر

- **Netlify:** الإعداد في `netlify.toml`؛ الطبقة المجانية: راجع `NETLIFY-FREE-TIER.md` و`[skip netlify]` في رسالة الـ commit عند تعديل التوثيق فقط.
- **`thiqqah.live` (موقع ثقة منفصل):** [NETLIFY-THIQQAH-STANDALONE.md](./NETLIFY-THIQQAH-STANDALONE.md) — **`npm run netlify:thiqqah:complete`** يفتح النشر ويعرض فحص الدومين؛ أو `npm run netlify:thiqqah:setup`؛ **`npm run verify:thiqqah:live-domain`** يتحقق من الإنتاج (404 على `/thiqqah-site/` يعني نشرة/ربط خاطئ). ربط الدومين يدوي بحسابك.
- **`ERR_SSL_PROTOCOL_ERROR` على `iiffund.com`:** ليس خطأ كود — راجع **قسم 8** في [NETLIFY-CHECKLIST.md](./NETLIFY-CHECKLIST.md)؛ **`npm run verify:iiffund:https`** فحص سريع من الطرفية.
- **الإنتاج الرسمي:** **`https://iiffund.com/`** (Netlify + نطاق مخصّص)؛ في `index.html` تُضبط **`iif-funcs-base`** و **`iif-searx-proxy-base`** على هذا النطاق. **Vercel** (`iif-fund-dr-talal.vercel.app`) يبقى معاينة/احتياط — راجع قسم **هـ** في [قبل-النشر.md](./قبل-النشر.md) و [VERCEL-DEPLOY.md](./VERCEL-DEPLOY.md).
- لا تضف تعقيداً على Netlify بدون حاجة (لا دوال جذر إن لم تُستخدم).

## تفضيلات العمل

1. **نفّذ الأوامر** عند الحاجة (تثبيت، بناء، فحص) — لا تكتفِ بنصائح نظرية إن كان البيئة حقيقية.
2. **العربية** مفضّلة للمستخدم في الشرح؛ أسماء الملفات والكود قد تبقى كما هي في المشروع.
3. **لا تكرّر** نسخ المشروع بين أقراص دون داعٍ؛ قد يكون المسار `C:\Users\vip\iif-fund-demo` أو `D:\iif-fund-demo` — اعتمد على **المجلد المفتوح في Cursor**.

## أخطاء شائعة

- تعديل `government-data.js` يدوياً دائماً — المصدر هو **`government-data.json`** ثم `npm run build`.
- خلط إعدادات Netlify بين الجذر و`financial-consulting/iif-fund-demo/netlify.toml` — النشر من الجذر يقرأ **`netlify.toml`** في الجذر.
- في **PowerShell** على ويندوز: ربط الأوامر بـ **`&&`** قد يفشل؛ استخدم **`;`** أو سطوراً منفصلة.

## قواعد Cursor

راجع `.cursor/rules/` للقواعد المختصرة المفعّلة تلقائياً.

### ملف `.cursorignore`

الملف **`.cursorignore`** في الجذر يقلّل ضوضاء فهرسة Cursor (محتواه مطابق لـ [cursorignore.example](./cursorignore.example)؛ يمكنك التخصيص محلياً).

### عندما يقول المستخدم «أكمل اللازم»

راجع **[اكمل-اللازم-قائمة.md](./اكمل-اللازم-قائمة.md)** — البناء، Git نظيف، دفع، عدم إخفاء الأخطاء.

### عندما يقترب النشر أو يقول «المحتوى مكتمل»

راجع **[قبل-النشر.md](./قبل-النشر.md)** — محتوى، `npm run verify`، توقّعات Netlify/SearXNG.
