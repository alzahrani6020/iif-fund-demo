@echo off
setlocal
cd /d "%~dp0"

REM Wrapper to run the PowerShell QA (more reliable with UTF-8 + quoting)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0QA-NEW-FEATURES.ps1"
set EC=%errorlevel%
echo.
pause
exit /b %EC%

