@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo تشغيل Tor + SearXNG (Docker)...

docker info >nul 2>nul
if errorlevel 1 call :ensure_docker
if errorlevel 1 exit /b 1

docker compose up -d
if errorlevel 1 (
  echo فشل التشغيل. تأكد أن Docker Desktop يعمل.
  pause
  exit /b 1
)
echo.
echo الواجهة: http://127.0.0.1:18080
echo مع المنصة: من جذر المشروع npm start ثم افتح المنصة على 127.0.0.1:3333
start "" "http://127.0.0.1:18080/"
pause
exit /b 0

:ensure_docker
echo Docker غير جاهز — محاولة تشغيل Docker Desktop...
if exist "%ProgramFiles%\Docker\Docker\Docker Desktop.exe" (
  start "" "%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
) else if exist "%LocalAppData%\Docker\Docker Desktop.exe" (
  start "" "%LocalAppData%\Docker\Docker Desktop.exe"
) else (
  echo لم يُعثر على Docker Desktop.exe — ثبّت Docker Desktop ثم أعد المحاولة.
  exit /b 1
)
echo انتظر حتى يصبح Docker جاهزاً ^(قد يستغرق دقيقة^)...
set /a tries=0
:waitdocker
docker info >nul 2>nul
if not errorlevel 1 exit /b 0
set /a tries+=1
if %tries% geq 24 (
  echo انتهت مهلة الانتظار — شغّل Docker Desktop يدوياً ثم نفّذ هذا الملف مجدداً.
  exit /b 1
)
timeout /t 5 /nobreak >nul
goto waitdocker
