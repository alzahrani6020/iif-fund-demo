@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo إيقاف محرك البحث (Tor + SearXNG)...
echo.
pushd "engines\searxng" >nul
docker compose down
set EC=%errorlevel%
popd >nul
if not "%EC%"=="0" (
  echo.
  echo فشل إيقاف Docker Compose. تأكد أن Docker Desktop يعمل ثم أعد المحاولة.
  echo.
  pause
  exit /b %EC%
)
echo.
echo تم الإيقاف.
echo.
