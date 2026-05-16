#Requires -Version 5.1
<#
.SYNOPSIS
  يسأل المستخدم عن MINIMAX_API_KEY (Secure input) ويكتبها في ملف .env داخل الجذر.

.NOTES
  لا يطبع المفتاح في المخرجات.
  الاستخدام:
    cd C:\Users\vip\iif-fund-demo
    powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\Set-MiniMaxApiKey.ps1"
#>

$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $Root

$envFile = Join-Path $Root '.env'
if (-not (Test-Path -LiteralPath $envFile)) {
  if (Test-Path -LiteralPath (Join-Path $Root '.env.example')) {
    Copy-Item -LiteralPath (Join-Path $Root '.env.example') -Destination $envFile -Force | Out-Null
  } else {
    throw 'لم يتم العثور على .env أو .env.example في جذر المشروع.'
  }
}

$sec = Read-Host -AsSecureString 'Paste MINIMAX_API_KEY (سيتم حفظه في .env)'
if ($null -eq $sec) {
  throw 'لم يتم إدخال مفتاح.'
}

try {
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
  $plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
} finally {
  if ($bstr -ne $null) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) | Out-Null
  }
}

$plain = [string]$plain
$plain = $plain.Trim()
if ([string]::IsNullOrWhiteSpace($plain)) {
  throw 'المفتاح المدخل فارغ.'
}

$lines = Get-Content -LiteralPath $envFile -Encoding UTF8
$updated = $false

for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i] -match '^MINIMAX_API_KEY=') {
    $lines[$i] = "MINIMAX_API_KEY=$plain"
    $updated = $true
    break
  }
}

if (-not $updated) {
  # إذا لم يوجد السطر أصلاً نضيفه في آخر الملف
  if ($lines.Count -gt 0 -and -not ($lines[-1] -match '\S')) {
    $lines += ''
  }
  $lines += "MINIMAX_API_KEY=$plain"
}

Set-Content -LiteralPath $envFile -Value $lines -Encoding UTF8

Write-Host '[OK] تم حفظ MINIMAX_API_KEY داخل .env' -ForegroundColor Green

# فحص سريع بدون طباعة المفتاح
npm run minimax:status

