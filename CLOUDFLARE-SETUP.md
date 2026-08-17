# إعداد Cloudflare Pages — دليل سريع

## الخطوة 1: إنشاء مشروع Cloudflare Pages

1. ادخل [dash.cloudflare.com](https://dash.cloudflare.com)
2. اذهب إلى **Pages** → **Create a project**
3. اختر **Direct Upload**
4. اكتب اسم المشروع: **`iif-fund`** (يجب أن يطابق `projectName` في `.github/workflows/cloudflare-pages.yml`)
5. اضغط **Create project**

## الخطوة 2: الحصول على Account ID

1. في أي صفحة Cloudflare، انظر إلى **الجانب الأيمن**
2. ستجد **Account ID** — انسخه

## الخطوة 3: إنشاء API Token

1. اذهب إلى **My Profile** (أعلى اليمين) → **API Tokens**
2. اضغط **Create Token**
3. اختر **Custom token**
4. املأ الحقول:
   - **Token name**: `GitHub Actions Deploy`
   - **Permissions**:
     - `Cloudflare Pages` → `Edit`
   - **Account Resources**: Include your account
   - **Zone Resources**: Include all zones (أو حدد `iiffund.com` فقط)
5. اضغط **Continue to summary** → **Create Token**
6. **انسخ التوكن فوراً** (لن يُعرض مرة أخرى!)

## الخطوة 4: إضافة Secrets في GitHub

1. افتح [github.com/alzahrani6020/iif-fund-demo](https://github.com/alzahrani6020/iif-fund-demo)
2. اذهب إلى **Settings** → **Secrets and variables** → **Actions**
3. أضف Secret الأول:
   - **Name**: `CLOUDFLARE_ACCOUNT_ID`
   - **Value**: *(القيمة من الخطوة 2)*
4. أضف Secret الثاني:
   - **Name**: `CLOUDFLARE_API_TOKEN`
   - **Value**: *(التوكن من الخطوة 3)*

## الخطوة 5: تفعيل النشر

1. ادفع أي تغيير إلى `main` (أو اضغط **Run workflow** يدوياً)
2. اذهب إلى **Actions** في GitHub
3. ستجد workflow **"Deploy to Cloudflare Pages"**
4. انتظر حتى يكتمل ✅

## الخطوة 6: ربط الدومين المخصص

1. في صفحة المشروع على Cloudflare، اذهب إلى **Custom domains**
2. اضف: **`iiffund.com`**
3. إذا كان الدومين في نفس حساب Cloudflare، ستُضاف سجلات DNS تلقائياً
4. إذا كان الدومين خارج Cloudflare، حدّث الـ nameservers لتكون Cloudflare (انظر [DOMINI-IIFFUND-THIQQAH.md](./DOMINI-IIFFUND-THIQQAH.md))
5. انتظر دقائق حتى يصبح الدومين **Active**

## الخطوة 7: التحقق

```bash
npm run verify:iiffund:https
```

أو افتح: `https://iiffund.com/`

## ملاحظات

- Workflow ينشر مجلد `financial-consulting/iif-fund-demo/` كجذر للموقع.
- الملف `_redirects` داخل نفس المجلد يُفعّل الاختصارات (`/dashboard`, `/panel`, `/cp`, `/admin`...).
- لا توجد دوال خادم (`/api/*`) على Cloudflare Pages بشكل افتراضي؛ الموقع ثابت بالكامل.
