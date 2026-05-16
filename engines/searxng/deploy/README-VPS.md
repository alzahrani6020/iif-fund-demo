# نشر SearXNG على VPS (Docker + HTTPS)

هذا المجلد يشغّل **Tor** + **SearXNG** + **Caddy** (عكس وكيل مع **Let’s Encrypt**). المسارات `../config` و`../data` نفس المجلد الأب `engines/searxng/`.

**صلاحية الوصول:** لا يمكن لأي أداة خارجية (بما فيها المساعد) إنشاء VPS أو ضبط DNS أو تسجيل الدخول إلى سيرفرك دون مفاتيح وأسرار تضيفها **أنت** في مزوّد الاستضافة أو في GitHub.

## 0) سكربتات مساعدة (على Ubuntu بعد نسخ المشروع)

```bash
# مرة واحدة: تثبيت Docker
bash deploy/scripts/install-docker-ubuntu.sh
# ثم أعد تسجيل الدخول أو: newgrp docker

# بعد إعداد .env و settings.yml — تشغيل HTTPS
bash deploy/scripts/up-https.sh

# أو HTTP فقط
bash deploy/scripts/up-http-only.sh
```

## 1) متطلبات على السيرفر

- Ubuntu (أو توزيعة Linux مشابهة) مع **Docker** و**Docker Compose plugin**
- نطاق (DNS) يشير بسجل **A** إلى عنوان IP السيرفر (للنسخة HTTPS)
- المنافذ **80** و**443** مفتوحة في الجدار الناري (`ufw allow 80,443/tcp` مثلاً)

## 2) إعداد `config/settings.yml` قبل التشغيل

من المجلد الأب `engines/searxng/` عدّل على الأقل:

| مفتاح | قيمة مقترحة للإنتاج |
|--------|---------------------|
| `server.base_url` | `https://نطاقك/` (يجب أن يطابق `SEARXNG_HOST` مع `https://` وشرطة مائلة أخيرة) |
| `server.limiter` | `true` لتقليل الإساءة |
| `server.secret_key` | مفتاح عشوائي — راجع `../SECRET-PRODUCTION.md` |

مثال لـ `base_url` إذا كان النطاق `search.example.com`:

```yaml
server:
  base_url: https://search.example.com/
  limiter: true
```

أعد تشغيل الحاويات بعد أي تغيير على الإعدادات.

## 3) HTTPS (الوضع الافتراضي)

```bash
cd engines/searxng/deploy
cp env.example .env
# عدّل .env — SEARXNG_HOST بدون https وبدون مسار
nano .env

docker compose up -d
```

افتح المتصفح على `https://نطاقك` — Caddy يطلب الشهادة تلقائياً عند أول طلب ناجح (يحتاج المنفذ 80 متاحاً من الإنترنت).

## 4) HTTP فقط (بدون نطاق / تجربة)

```bash
cd engines/searxng/deploy
# عيّن في ../config/settings.yml: base_url: http://IP-السيرفر/
docker compose -f docker-compose.http-only.yml up -d
```

## 5) التحديث وإعادة التشغيل

```bash
docker compose pull
docker compose up -d
```

للنسخة HTTP-only استبدل الأمر بـ `docker compose -f docker-compose.http-only.yml ...`.

## 6) GitHub Actions — نشر تلقائي عبر SSH (اختياري)

يوجد workflow في المستودع: [`.github/workflows/deploy-searxng-vps.yml`](../../../.github/workflows/deploy-searxng-vps.yml)

- التشغيل يدوي فقط: **Actions → Deploy SearXNG VPS → Run workflow**.
- أضف الأسرار المذكورة في تعليقات الملف (مضيف، مستخدم، مفتاح SSH، `SEARXNG_PUBLIC_HOST`).
- الـ `rsync` يستثني مجلد `data/` على السيرفر حتى لا يُحذف الكاش مع `--delete`.

## 7) ملاحظات

- **Netlify / Vercel** لا يستبدلان هذا النشر؛ التشغيل المستمر لحاويات Docker يتم على VPS أو خدمة حاويات.
- راجع شروط مزوّد الـ VPS بخصوص **Tor** (هنا بروكسي داخلي لمحركات `.onion` وليس بالضرورة عقدة خروج).
- لا ترفع `.env` أو مفاتيح إنتاج إلى مستودع عام.
