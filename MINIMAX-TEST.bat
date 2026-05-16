@echo off
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo يحتاج المشروع إلى Node.js: https://nodejs.org
  pause
  exit /b 1
)

echo.
echo === التحقق من المفتاح ===
call npm run minimax:status
if errorlevel 1 (
  echo.
  echo فشل التحقق. شغّل أولاً: MINIMAX-KEY-SETUP.bat
  pause
  exit /b 1
)

echo.
echo === تجربة سؤال قصير ===
call npm run minimax:ask -- "قل مرحبا بجملة واحدة بالعربية"
echo.
pause
