@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo يحتاج المشروع إلى Node.js مثبت: https://nodejs.org
  pause
  exit /b 1
)
echo تشغيل الخادم في نافذة منفصلة، ثم فتح المتصفح...
echo لتشغيل كل شيء ^(Docker + المنصة الحكومية^): انقر START-IIF-FULL.bat
where pnpm >nul 2>nul
if %errorlevel%==0 (
  start "IIF dev server" /D "%~dp0" cmd /k pnpm start
) else (
  start "IIF dev server" /D "%~dp0" cmd /k npm start
)
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:3333/"
