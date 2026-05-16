# محرك البحث SearXNG — **مشروع مستقل + تكامل محلي**

> الحاوية والإعدادات هنا؛ **المنصة الحكومية** تستخدم المحرك على **`localhost`** عبر **`npm start`** → بروكسي **`/api/searx`** وملف **`iif-config.js`**. واجهة الصندوق منفصلة عن هذا المسار.

## التشغيل

**ويندوز:** انقر نقراً مزدوجاً **`start-searxng.bat`** في هذا المجلد (بعد تشغيل Docker Desktop).

من **هذا المجلد** (`engines/searxng/`):

```bash
docker compose up -d
```

**كانت الحاوية قديماً على المنفذ 8080؟** نفّذ `docker compose down` ثم `docker compose up -d` لاعتماد التعيين **`18080:8080`** (المتصفح يفتح **18080**؛ داخل الحاوية لا يزال **8080**).

يشغّل **خدمتين:** **`tor`** (بروكسي SOCKS5 لشبكة Tor) + **`searxng`**. محركات **ahmia** و**torch** (مواقع `.onion`) تُوجَّه عبر `socks5h://tor:9050` — راجع `config/settings.yml`.

- **واجهة المحرك:** [http://127.0.0.1:18080](http://127.0.0.1:18080) (على المضيف؛ الحاوية تستمع داخلياً على 8080)
- يتطلب **Docker Desktop** شغّالاً.
- **المنصة الحكومية** (بحث ويب): من جذر المشروع `npm start` ثم افتح `…/government-search/SIMPLE-GOVERNMENT-PLATFORM.html` على `127.0.0.1:3333` — راجع [README-IIF-INTEGRATION.md](../../financial-consulting/government-search/README-IIF-INTEGRATION.md).

> **قانونياً وأخلاقياً:** استخدام Tor وبحث `.onion` يخضع لقوانين بلدك؛ استخدمهما بمسؤولية.

### الإعدادات (`config/settings.yml`)

- تُحمَّل فوق الإعدادات الافتراضية (`use_default_settings: true`).
- **اسم المثيل**، **اللغة الافتراضية للبحث (ar)**، **SafeSearch متوسط** (`safe_search: 1`)، **إكمال تلقائي** عبر DuckDuckGo، **تفعيل JSON** لواجهة المنصة، **تعطيل metrics** محلياً.
- **مهلات الطلبات** (`outgoing`) متوافقة مع بروكسي التطوير (`/api/searx`).
- **محركات Tor (ahmia، torch):** مفعّلة مع **حاوية Tor** في `docker-compose.yml`؛ التوجيه عبر `socks5h://tor:9050` في `settings.yml`.
- **غيّر `secret_key`** قبل أي نشر عام.

بعد أي تعديل على `settings.yml`:

```bash
docker compose down && docker compose up -d
```

إن كانت لديك حاوية قديمة **بدون** مجلدات `config`/`data`:

```bash
docker compose down
docker compose up -d
```

## الإيقاف

```bash
docker compose down
```

## الإنتاج (عام)

- **نشر VPS (Docker + HTTPS):** مجلد [deploy](./deploy/) وملف [deploy/README-VPS.md](./deploy/README-VPS.md).
- بروكسي Netlify/خادم خارجي لـ SearXNG — راجع [README-IIF-INTEGRATION.md](../../financial-consulting/government-search/README-IIF-INTEGRATION.md).

## قائمة المحركات وحالاتها

جدول مُولَّد (أسماء + `disabled` / `inactive` + تعليقات YAML إن وُجدت): **[محركات-الحالة-والاسباب.md](./محركات-الحالة-والاسباب.md)**  
لإعادة التوليد بعد تحديث الصورة: انسخ `settings.yml` من الحاوية إلى `data/upstream-settings-default.yml` ثم:

`node scripts/build-engines-status-table.mjs`

## خطة التطوير

مراحل العمل التفصيلية: **[خطة-التطوير.md](./خطة-التطوير.md)**

## ملاحظة (أسماء الحاويات)

| الحاوية | الدور |
|---------|--------|
| `iif-tor-socks` | بروكسي Tor (SOCKS5 داخل الشبكة على `tor:9050`) |
| `iif-searxng-standalone` | SearXNG داخل الحاوية على **8080**؛ من المتصفح على المضيف **18080** |
