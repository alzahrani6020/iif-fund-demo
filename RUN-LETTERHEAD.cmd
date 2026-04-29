@echo off
setlocal
set ROOT=%~dp0
cd /d "%ROOT%"

python scripts\letterhead\build_thiqqah_letterhead_docx.py
if errorlevel 1 (
  echo Build failed.
  pause
  exit /b 1
)

start "" "%ROOT%thiqqah-site\letterhead-a4-print.html"
start "" "%ROOT%thiqqah-site\letterhead-thiqqah.docx"
exit /b 0
