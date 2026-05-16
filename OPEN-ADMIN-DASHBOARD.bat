@echo off
setlocal

REM افتح لوحة التحكم الإدارية محلياً (ويندوز)
REM - يوقف أي عملية تستمع على المنفذ 3333 (إن وُجدت)
REM - يشغّل خادم التطوير
REM - يفتح رابط لوحة الإدارة في المتصفح

cd /d "%~dp0"

set "PORT=3333"
set "ADMIN_URL_BASE=http://127.0.0.1:%PORT%/financial-consulting/iif-fund-demo/index.html?iif_admin_portal=1"
set "ADMIN_URL=http://127.0.0.1:%PORT%/cp"

echo.
echo [IIF] Restart dev server on port %PORT% ...

REM تأكد من أنك على أحدث نسخة في الريبو لتجنب "تغييرات تختفي بعد أيام"
echo [IIF] Git sync (pull) ...
powershell -NoProfile -Command "git rev-parse --short HEAD" 
git pull --rebase
echo [IIF] Running commit:
powershell -NoProfile -Command "git rev-parse --short HEAD"

REM حاول إيقاف العملية التي تستمع على PORT (قد تفشل إن لم توجد)
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$p = (Get-NetTCPConnection -LocalPort %PORT% -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty OwningProcess); if ($p) { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue }" ^
  >nul 2>nul

REM شغّل الخادم في نافذة منفصلة
start "IIF Dev Server" cmd /k "set PORT=%PORT%&& npm start"

REM انتظر قليلاً ثم افتح اللوحة
REM انتظر حتى يصبح الخادم جاهزاً (تجنب ERR_CONNECTION_REFUSED)
powershell -NoProfile -Command ^
  "$u='%ADMIN_URL%'; $ok=$false; for($i=0;$i -lt 60;$i++){ try{ $r=Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 2; if($r.StatusCode -eq 200){ $ok=$true; break } } catch{}; Start-Sleep -Milliseconds 300 }; if(-not $ok){ Write-Host 'Server not ready in time' }"

REM افتح مدخل الأدمن (PowerShell لفتح المتصفح)
powershell -NoProfile -Command "Start-Process -FilePath '%ADMIN_URL%'"

echo.
echo [IIF] Opened: %ADMIN_URL%
echo.
endlocal
