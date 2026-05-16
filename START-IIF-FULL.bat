@echo off
chcp 65001 >nul
set "ROOT=%~dp0"
cd /d "%ROOT%"

where node >nul 2>nul
if errorlevel 1 (
  echo يحتاج المشروع إلى Node.js: https://nodejs.org
  pause
  exit /b 1
)

echo [1/3] محرك SearXNG + Tor ^(Docker^)...
call :iif_ensure_docker
if errorlevel 1 (
  echo تنبيه: Docker لم يستجب — شغّل Docker Desktop ثم أعد تشغيل هذا الملف.
) else if exist "%ROOT%engines\searxng\docker-compose.yml" (
  pushd "%ROOT%engines\searxng"
  docker compose up -d
  if errorlevel 1 (
    echo.
    echo تنبيه: فشل docker compose — شغّل Docker Desktop ثم من engines\searxng نفّذ: docker compose up -d
    echo.
  )
  popd
) else (
  echo لم يُعثر على engines\searxng\docker-compose.yml
)
goto iif_after_compose

:iif_ensure_docker
docker info >nul 2>nul
if not errorlevel 1 exit /b 0
echo Docker غير جاهز — تشغيل Docker Desktop...
if exist "%ProgramFiles%\Docker\Docker\Docker Desktop.exe" (
  start "" "%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
) else if exist "%LocalAppData%\Docker\Docker Desktop.exe" (
  start "" "%LocalAppData%\Docker\Docker Desktop.exe"
)
echo انتظر حتى يصبح Docker جاهزاً...
set /a _t=0
:iif_waitdd
docker info >nul 2>nul
if not errorlevel 1 exit /b 0
set /a _t+=1
if %_t% geq 24 exit /b 1
timeout /t 5 /nobreak >nul
goto iif_waitdd

:iif_after_compose

echo [2/3] خادم التطوير على المنفذ 3333...
where pnpm >nul 2>nul
if %errorlevel%==0 (
  start "IIF dev server" /D "%ROOT%" cmd /k pnpm start
) else (
  start "IIF dev server" /D "%ROOT%" cmd /k npm start
)

echo [3/3] انتظار قصير ثم فتح المنصة الحكومية...
timeout /t 4 /nobreak >nul
start "" "http://127.0.0.1:3333/financial-consulting/government-search/SIMPLE-GOVERNMENT-PLATFORM.html"

echo.
echo جاهز:
echo   المنصة الحكومية — أعلاه في المتصفح
echo   الصندوق / الرئيسية — http://127.0.0.1:3333/
echo   SearXNG — http://127.0.0.1:18080/
echo   تحقق من المحرك — من هذا المجلد: npm run verify:searx
echo.
pause
