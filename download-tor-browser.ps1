# تحميل Tor Browser (Windows 64-bit) — نسخة محمولة رسمية
# يعمل حتى عند فشل حلّ الأسماء في Windows: يستخدم curl + IP ثابت + تعطيل فحص إلغاء الشهادة (schannel).
# المصدر: https://www.torproject.org/download/

$version = "15.0.7"
$fileName = "tor-browser-windows-x86_64-portable-$version.exe"
$dest = Join-Path $env:USERPROFILE "Downloads\$fileName"

# أرشيف Tor (IP من nslookup على 8.8.8.8 — قد يتغيّر مع الوقت)
$archiveHost = "archive.torproject.org"
$archiveIp = "159.69.63.226"
$archiveUrl = "https://$archiveHost/tor-package-archive/torbrowser/$version/$fileName"

$wwwUrl = "https://www.torproject.org/dist/torbrowser/$version/$fileName"
$wwwIp = "116.202.120.165"

Write-Host "الوجهة: $dest" -ForegroundColor Cyan

function Test-Curl {
    return [bool](Get-Command curl.exe -ErrorAction SilentlyContinue)
}

if (-not (Test-Curl)) {
    Write-Host "curl.exe غير متوفر." -ForegroundColor Red
    exit 1
}

$curlBase = @("curl.exe", "-L", "--ssl-no-revoke", "--connect-timeout", "60", "--max-time", "600", "-o", $dest, "-w", "`nHTTP:%{http_code} bytes:%{size_download}`n")

# 1) أرشيف + --resolve
Write-Host "محاولة (أرشيف): $archiveUrl" -ForegroundColor Yellow
$p1 = $curlBase + @("--resolve", "${archiveHost}:443:${archiveIp}", $archiveUrl)
& $p1[0] $p1[1..($p1.Length-1)]
if ((Test-Path $dest) -and (Get-Item $dest).Length -gt 50MB) {
    Write-Host "تم التحميل من الأرشيف." -ForegroundColor Green
    Write-Host "للتثبيت الصامت على سطح المكتب: .\install-tor-browser-silent.ps1" -ForegroundColor Cyan
    exit 0
}

# 2) www + --resolve
if (Test-Path $dest) { Remove-Item $dest -Force -ErrorAction SilentlyContinue }
Write-Host "محاولة (www): $wwwUrl" -ForegroundColor Yellow
$p2 = $curlBase + @("--resolve", "www.torproject.org:443:${wwwIp}", $wwwUrl)
& $p2[0] $p2[1..($p2.Length-1)]
if ((Test-Path $dest) -and (Get-Item $dest).Length -gt 50MB) {
    Write-Host "تم التحميل من www." -ForegroundColor Green
    exit 0
}

Write-Host @"

فشل التحميل. جرّب:
1) تشغيل fix-tor-dns-hosts.ps1 كمسؤول (من مجلد المشروع)
2) VPN ثم إعادة تشغيل هذا السكربت
صفحة التحميل: https://www.torproject.org/download/
"@ -ForegroundColor Yellow
exit 1
