@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo يحتاج المشروع إلى Node.js مثبت: https://nodejs.org
  echo.
  pause
  exit /b 1
)

echo ==========================================
echo IIF SAFE MODE
echo - SafeSearch (strict) + rate limits
echo - fetch limits (timeout/max bytes)
echo ==========================================
echo.

echo [1/3] تشغيل محرك البحث (Docker)...
pushd "engines\searxng" >nul
docker compose up -d
set DC=%errorlevel%
popd >nul
if not "%DC%"=="0" (
  echo.
  echo فشل تشغيل Docker Compose. تأكد أن Docker Desktop يعمل ثم أعد المحاولة.
  echo.
  pause
  exit /b %DC%
)

echo [2/3] تشغيل خادم التطوير (SAFE env)...
echo سيتم فتح الواجهة بعد ثوانٍ.
echo.

REM SAFE defaults (can be overridden by user)
set IIF_SEARX_SAFESEARCH=2
set IIF_RL_WINDOW_MS=60000
set IIF_RL_SEARX_MAX=60
set IIF_RL_FETCH_MAX=30
set IIF_FETCH_TIMEOUT_MS=15000
set IIF_FETCH_MAX_BYTES=1000000

start "IIF dev server (SAFE)" /D "%~dp0" cmd /k npm start

timeout /t 3 /nobreak >nul

echo [3/3] فتح الصفحات...
start "" "http://127.0.0.1:3333/"
start "" "http://127.0.0.1:3333/health.html"
start "" "http://127.0.0.1:3333/connect.html"
start "" "http://127.0.0.1:18080/"

echo.
echo DONE.
echo.
