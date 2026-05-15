# إعداد Cloudflare Pages — دليل سريع

## الخطوة 1: الحصول على Account ID

1. ادخل [dash.cloudflare.com](https://dash.cloudflare.com)
2. في أي صفحة، انظر إلى **الجانب الأيمن**
3. ستجد **Account ID** — انسخه

## الخطوة 2: إنشاء API Token

1. في Cloudflare، اذهب إلى **My Profile** (أعلى اليمين)
2. اذهب إلى **API Tokens**
3. اضغط **Create Token**
4. اختر **Custom token**
5. املأ الحقول:
   - **Token name**: `GitHub Actions Deploy`
   - **Permissions**:
     - `Cloudflare Pages` → `Edit`
   - **Account Resources**: Include your account
   - **Zone Resources**: Include all zones (أو حدد iiffund.com فقط)
6. اضغط **Continue to summary** → **Create Token**
7. **انسخ التوكن فوراً** (لن يُعرض مرة أخرى!)

## الخطوة 3: إضافة Secrets في GitHub

1. افتح [github.com/alzahrani6020/iif-fund-demo](https://github.com/alzahrani6020/iif-fund-demo)
2. اذهب إلى **Settings** → **Secrets and variables** → **Actions**
3. اضغط **New repository secret**
4. أضف secret الأول:
   - **Name**: `CLOUDFLARE_ACCOUNT_ID`
   - **Value**: *(القيمة التي نسختها من الخطوة 1)*
5. اضغط **Add secret**
6. أضف secret الثاني:
   - **Name**: `CLOUDFLARE_API_TOKEN`
   - **Value**: *(التوكن الذي نسخته من الخطوة 2)*
7. اضغط **Add secret**

## الخطوة 4: تفعيل البناء

1. ادفع أي تغيير إلى `main` (أو اضغط على زر **Run workflow** يدوياً)
2. اذهب إلى **Actions** في GitHub
3. ستجد workflow **"Deploy to Cloudflare Pages"** يعمل
4. انتظر حتى يكتمل ✅

## النتيجة

عند كل push إلى `main`، GitHub Actions يبني الموقع تلقائياً وينشره على Cloudflare Pages!
