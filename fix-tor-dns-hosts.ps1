# يتطلب تشغيل PowerShell كمسؤول (زر يمين -> تشغيل كمسؤول)
# يضيف سجلات hosts لمواقع Tor حتى يعمل المتصفح و PowerShell مع شبكات تحجب DNS المحلي.
$entries = @(
    "116.202.120.165 www.torproject.org",
    "116.202.120.165 dist.torproject.org",
    "159.69.63.226 archive.torproject.org"
)
$hosts = "$env:SystemRoot\System32\drivers\etc\hosts"
$marker = "# torproject-fix-iif-fund-demo"
$content = Get-Content $hosts -Raw -ErrorAction Stop
if ($content -notmatch [regex]::Escape($marker)) {
    $block = "`n$marker`n" + ($entries -join "`n") + "`n# end torproject-fix`n"
    Add-Content -Path $hosts -Value $block -Encoding ASCII
    ipconfig /flushdns | Out-Null
    Write-Host "تم تحديث hosts." -ForegroundColor Green
} else {
    Write-Host "السجلات موجودة مسبقاً." -ForegroundColor Yellow
}
