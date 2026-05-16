@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo تشغيل محرك البحث (Tor + SearXNG)...
echo.
pushd "engines\searxng" >nul
docker compose up -d
set EC=%errorlevel%
popd >nul
if not "%EC%"=="0" (
  echo.
  echo فشل تشغيل Docker Compose. تأكد أن Docker Desktop يعمل ثم أعد المحاولة.
  echo.
  pause
  exit /b %EC%
)
echo.
echo تم التشغيل. افتح: http://127.0.0.1:18080/
start "" "http://127.0.0.1:18080/"
echo.
