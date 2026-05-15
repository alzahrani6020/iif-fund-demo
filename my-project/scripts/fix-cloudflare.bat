@echo off
chcp 65001 >nul
echo ═══════════════════════════════════════════════════════
echo   إصلاح ربط الدومين mzahrani.com في Cloudflare
echo ═══════════════════════════════════════════════════════
echo.

if "%CF_API_TOKEN%"=="" (
    echo ❌ لازم تحط الـ API Token
echo.
    echo الطريقة:
    echo 1. افتح من تلفونك: https://dash.cloudflare.com/profile/api-tokens
echo 2. Create Token ^> Custom token
echo 3. الصلاحيات: Zone:Read, Zone:Edit, Cloudflare Pages:Edit
echo 4. انسخ التوكن والصقه هنا:
echo.
    echo    set CF_API_TOKEN=توكن_هنا
echo    set CF_ACCOUNT_ID=الآي_دي_هنا
echo    scripts\fix-cloudflare.bat
echo.
    pause
    exit /b 1
)

if "%CF_ACCOUNT_ID%"=="" (
    echo ❌ لازم تحط Account ID
echo    set CF_ACCOUNT_ID=الآي_دي_هنا
echo.
    pause
    exit /b 1
)

echo 🔍 جاري التحقق...
curl -s -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" -H "Authorization: Bearer %CF_API_TOKEN%" | findstr "success" >nul
if errorlevel 1 (
    echo ❌ API Token غير صحيح!
    pause
    exit /b 1
)

echo ✅ Token شغال
echo.

echo 🗑️ حذف Workers الفاشلين...
for %%W in (mazahrni mzahrani) do (
    curl -s -X DELETE "https://api.cloudflare.com/client/v4/accounts/%CF_ACCOUNT_ID%/workers/scripts/%%W" -H "Authorization: Bearer %CF_API_TOKEN%" >nul
    echo   %%W: محذوف (أو غير موجود)
)

echo.
echo 🌐 إضافة CNAME للدومين...
curl -s -X POST "https://api.cloudflare.com/client/v4/zones?name=mzahrani.com" -H "Authorization: Bearer %CF_API_TOKEN%" > zone.json

for /f "tokens=*" %%a in ('powershell -Command "(Get-Content zone.json | ConvertFrom-Json).result[0].id"') do set ZONE_ID=%%a
del zone.json

echo   Zone ID: %ZONE_ID%

curl -s -X POST "https://api.cloudflare.com/client/v4/zones/%ZONE_ID%/dns_records" -H "Authorization: Bearer %CF_API_TOKEN%" -H "Content-Type: application/json" -d "{\"type\":\"CNAME\",\"name\":\"mzahrani.com\",\"content\":\"mzahrani.pages.dev\",\"ttl\":1,\"proxied\":true}" >nul
echo ✅ CNAME مضاف

echo.
echo 📋 ربط الدومين في Pages...
curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/%CF_ACCOUNT_ID%/pages/projects/mzahrni/domains" -H "Authorization: Bearer %CF_API_TOKEN%" -H "Content-Type: application/json" -d "{\"name\":\"mzahrani.com\"}" >nul
echo ✅ الدومين مربوط

echo.
echo ═══════════════════════════════════════════════════════
echo   ✅ تم الانتهاء!
echo ═══════════════════════════════════════════════════════
echo.
echo جرب افتح: https://mzahrani.com
echo (يحتاج 2-5 دقايق)
echo.
pause
