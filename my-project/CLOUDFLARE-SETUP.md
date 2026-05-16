# إعداد خدمات Cloudflare المتقدمة لـ mzahrani.com

## ✅ الخدمات المفعلة حالياً (مجانية)

| الخدمة | الحالة | التفاصيل |
|--------|--------|----------|
| **Cloudflare Pages** | ✅ شغال | الاستضافة الرئيسية |
| **CDN** | ✅ شغال | 300+ مركز بيانات عالمياً |
| **SSL** | ✅ شغال | شهادة تلقائية (Google Trust Services) |
| **DNS** | ✅ شغال | مربوط بـ mzahrani.com |
| **Caching** | ✅ محسّن | `_headers` محدث للأصول الثابتة |
| **Security Headers** | ✅ مفعل | X-Frame-Options, X-Content-Type-Options, إلخ |

---

## 🚀 الخدمات اللي تحتاج API Token إضافي

### 1. Cloudflare R2 (تخزين الصور — بديل S3 مجاني)

**الاستخدام:** تخزين صور المستخدمين والملفات بدلاً من base64 في localStorage

**الصلاحيات المطلوبة:**
- Account: R2 Edit

**خطوات الإعداد:**
1. أنشئ API Token جديد من: https://dash.cloudflare.com/profile/api-tokens
   - Account: R2 Edit
   - Account: Cloudflare Workers Scripts:Edit
   - Account: Access: Apps:Edit
2. شغل السكربت: `scripts/setup-cloudflare-full.bat`
3. أو يدوياً:
   - Dashboard → R2 → Create bucket → `mzahrani-images`
   - Workers → Create Service → انسخ كود `workers/r2-image-upload.js`
   - اربط Worker بـ `images.mzahrani.com`

**السعر:**
- 10GB تخزين مجاني
- 10,000,000 عملية قراءة مجانية
- 1,000,000 عملية كتابة مجانية

---

### 2. Cloudflare Access (Zero Trust)

**الاستخدام:** حماية لوحة التحكم `/admin/` برمز OTP على الإيميل

**الصلاحيات المطلوبة:**
- Account: Access: Apps:Edit
- Account: Access: Policies:Edit

**خطوات الإعداد اليدوي:**
1. Dashboard → Zero Trust → Access → Applications
2. Add an Application → Self-hosted
3. Application name: `Admin Panel`
4. Session duration: `24 hours`
5. Domain: `mzahrani.com/admin/*`
6. Identity providers: One-time PIN
7. Policies: Allow → Include → Emails → `بريدك@email.com`
8. Save

**السعر:**
- 50 مستخدم مجاني

---

### 3. Cloudflare Workers

**الاستخدام:**
- رفع الصور على R2
- معالجة الطلبات قبل ما توصل للموقع

**الملف:** `workers/r2-image-upload.js`

**الصلاحيات المطلوبة:**
- Account: Cloudflare Workers Scripts:Edit

---

### 4. Cloudflare Web Analytics

**الاستخدام:** إحصائيات الزوار بدون كوكيز (privacy-friendly)

**خطوات الإعداد:**
1. Dashboard → Web Analytics
2. Add a site → أضف `mzahrani.com`
3. انسخ التوكن
4. عدّل `app/layout.tsx`:
   ```html
   <script defer src='https://static.cloudflareinsights.com/beacon.min.js' 
     data-cf-beacon='{"token": "التوكن_هنا"}'></script>
   ```

**السعر:** مجاني تماماً

---

## 🔐 API Token المطلوب للإعداد الكامل

أنشئ توكن جديد بهذه الصلاحيات:

| الصلاحية | الوصول |
|----------|--------|
| Zone:Read | All zones |
| Zone:Edit | mzahrani.com |
| Zone Settings:Edit | mzahrani.com |
| DNS:Edit | mzahrani.com |
| Cloudflare Pages:Edit | All accounts |
| Account: R2 Edit | All accounts |
| Account: Cloudflare Workers Scripts:Edit | All accounts |
| Account: Access: Apps:Edit | All accounts |

---

## 📁 الملفات الجاهزة

| الملف | الاستخدام |
|-------|-----------|
| `workers/r2-image-upload.js` | كود Worker لرفع الصور |
| `workers/wrangler.toml` | إعدادات Worker |
| `scripts/setup-cloudflare-full.bat` | سكربت إعداد شامل |
| `public/_headers` | رؤوس HTTP للأمان والتخزين المؤقت |

---

## ⚡ أولويات التفعيل

1. **Web Analytics** ← أسهل شي، بس انسخ التوكن
2. **Access** ← حماية الأدمن (50 مستخدم مجاني)
3. **R2 + Workers** ← تخزين الصور (10GB مجاني)

---

## 📧 للدعم

لو واجهت أي مشكلة، راجع:
- Cloudflare Docs: https://developers.cloudflare.com
- R2 Docs: https://developers.cloudflare.com/r2
- Access Docs: https://developers.cloudflare.com/cloudflare-one/applications
