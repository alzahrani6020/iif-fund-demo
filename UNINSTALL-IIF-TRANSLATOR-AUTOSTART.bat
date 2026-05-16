@echo off
setlocal
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0translator\\uninstall-autostart.ps1"
echo.
pause
