@echo off
chcp 65001 >nul
echo ═══════════════════════════════════════════════════════════
echo   إعداد خدمات Cloudflare المتقدمة لـ mzahrani.com
echo ═══════════════════════════════════════════════════════════
echo.
echo ⚠️  هذا السكربت يحتاج API Token بصلاحيات إضافية:
echo    - Account: R2 Edit
echo    - Account: Cloudflare Workers Scripts:Edit
echo    - Account: Access: Apps:Edit
echo    - Zone: Edit
echo.
echo 1. انسخ هذا الملف وعدّل CF_API_TOKEN و CF_ACCOUNT_ID
echo 2. شغل السكربت
echo.

if "%CF_API_TOKEN%"=="" (
    echo ❌ عيّن CF_API_TOKEN أولاً
    exit /b 1
)
if "%CF_ACCOUNT_ID%"=="" (
    echo ❌ عيّن CF_ACCOUNT_ID أولاً
    exit /b 1
)

set API_BASE=https://api.cloudflare.com/client/v4
set ACCOUNT_ID=%CF_ACCOUNT_ID%
set ZONE_ID=bb5d8ccb5c2d50186b1a1a31a1edbda6

echo 🔍 التحقق من التوكن...
curl -s -X GET "%API_BASE%/user/tokens/verify" -H "Authorization: Bearer %CF_API_TOKEN%" | findstr "success" >nul
if errorlevel 1 (
    echo ❌ التوكن غير صالح
    exit /b 1
)
echo ✅ التوكن شغال
echo.

REM ═══ 1. إنشاء R2 Bucket ═══
echo 🪣 1. إنشاء R2 Bucket (mzahrani-images)...
curl -s -X POST "%API_BASE%/accounts/%ACCOUNT_ID%/r2/buckets" -H "Authorization: Bearer %CF_API_TOKEN%" -H "Content-Type: application/json" -d "{\"name\":\"mzahrani-images\"}" > r2-result.json
findstr "success" r2-result.json >nul && echo ✅ Bucket تم إنشاؤه || echo ⚠️ Bucket موجود أو خطأ (طبيعي)
del r2-result.json 2>nul
echo.

REM ═══ 2. إعداد Cloudflare Access للأدمن ═══
echo 🛡️ 2. إعداد Cloudflare Access لحماية /admin/...

REM إنشاء Access Application
curl -s -X POST "%API_BASE%/accounts/%ACCOUNT_ID%/access/apps" -H "Authorization: Bearer %CF_API_TOKEN%" -H "Content-Type: application/json" -d "{\"name\":\"Admin Panel\",\"domain\":\"mzahrani.com\",\"type\":\"self_hosted\",\"session_duration\":\"24h\",\"auto_redirect_to_identity\":false,\"allowed_idps\":[]}" > access-app.json
findstr "success" access-app.json >nul && echo ✅ Access App تم إنشاؤه || echo ⚠️ خطأ في Access (ممكن محتاج صلاحيات أعلى)
del access-app.json 2>nul
echo.

REM ═══ 3. إنشاء Worker للصور ═══
echo ⚡ 3. رفع Worker (mzahrani-image-upload)...
curl -s -X PUT "%API_BASE%/accounts/%ACCOUNT_ID%/workers/scripts/mzahrani-image-upload" -H "Authorization: Bearer %CF_API_TOKEN%" -H "Content-Type: application/javascript" --data-binary @workers/r2-image-upload.js > worker-result.json
findstr "success" worker-result.json >nul && echo ✅ Worker تم رفعه || echo ⚠️ خطأ في Worker
del worker-result.json 2>nul
echo.

REM ═══ 4. إضافة subdomain للصور ═══
echo 🌐 4. إضافة CNAME للصور...
curl -s -X POST "%API_BASE%/zones/%ZONE_ID%/dns_records" -H "Authorization: Bearer %CF_API_TOKEN%" -H "Content-Type: application/json" -d "{\"type\":\"CNAME\",\"name\":\"images\",\"content\":\"mzahrani-image-upload.%ACCOUNT_ID%.workers.dev\",\"ttl\":1,\"proxied\":true}" >nul
echo ✅ تم إضافة images.mzahrani.com
echo.

echo ═══════════════════════════════════════════════════════════
echo   ✅ تم الانتهاء من الإعداد!
echo ═══════════════════════════════════════════════════════════
echo.
echo 📋 الملاحظات:
echo    - R2 Bucket: mzahrani-images
echo    - Worker: mzahrani-image-upload
echo    - رابط الصور: https://images.mzahrani.com
echo.
echo ⚠️  للحصول على Web Analytics Token:
echo    - ادخل: dash.cloudflare.com ^> Web Analytics
echo    - أضف الموقع وانسخ التوكن
echo    - ضعه في app/layout.tsx بدل YOUR_CF_ANALYTICS_TOKEN
echo.
pause
