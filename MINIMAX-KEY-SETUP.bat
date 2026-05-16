@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ============================================================
echo   MiniMax - ضبط مفتاح API (خطوات بسيطة)
echo ============================================================
echo.

if not exist ".env" (
  if exist ".env.example" (
    copy /y ".env.example" ".env" >nul
    echo [OK] تم إنشاء ملف .env من .env.example
  ) else (
    echo [خطأ] لم يُعثر على .env.example
    pause
    exit /b 1
  )
) else (
  echo [موجود] ملف .env موجود — سيتم فتحه للتعديل فقط.
)

echo.
echo [1] جاري فتح صفحة إنشاء المفتاح في المتصفح...
start "" "https://platform.minimax.io/user-center/basic-information/interface-key"

timeout /t 2 /nobreak >nul

echo [2] جاري فتح ملف .env في المفكرة...
start "" notepad "%~dp0.env"

echo.
echo ------------------------------------------------------------
echo   ماذا تفعل الآن؟
echo ------------------------------------------------------------
echo   1) في المتصفح: سجّل الدخول إن طُلب، ثم اضغط
echo      "Create new secret key" وأنشئ مفتاحاً وانسخه.
echo.
echo   2) في المفكرة: ضع المؤشر بعد علامة = في السطر:
echo      MINIMAX_API_KEY=
echo      والصق المفتاح كاملاً بدون مسافات زائدة.
echo.
echo   3) من القائمة: File ثم Save (حفظ)، ثم أغلق المفكرة.
echo.
echo   4) انقر مرتين على: MINIMAX-TEST.bat للتحقق.
echo ------------------------------------------------------------
echo.
pause
