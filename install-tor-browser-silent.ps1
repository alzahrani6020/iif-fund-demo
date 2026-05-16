# يثبت/يحدّث النسخة المحمولة بصمت إلى: سطح المكتب\Tor Browser
$version = "15.0.7"
$exe = Join-Path $env:USERPROFILE "Downloads\tor-browser-windows-x86_64-portable-$version.exe"
if (-not (Test-Path $exe)) {
    Write-Host "الملف غير موجود: $exe — شغّل download-tor-browser.ps1 أولاً" -ForegroundColor Red
    exit 1
}
Write-Host "جاري التثبيت الصامت..." -ForegroundColor Cyan
$p = Start-Process -FilePath $exe -ArgumentList "/S" -Wait -PassThru
Write-Host "انتهى المثبّت. رمز الخروج: $($p.ExitCode)" -ForegroundColor Green
$tb = Join-Path $env:USERPROFILE "Desktop\Tor Browser\Browser\firefox.exe"
if (Test-Path $tb) {
    Write-Host "التثبيت موجود: $tb" -ForegroundColor Green
}
