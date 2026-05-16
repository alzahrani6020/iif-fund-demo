@echo off
setlocal
cd /d "%~dp0"

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0translator\\start.ps1"
set EC=%errorlevel%
echo.
pause
exit /b %EC%
