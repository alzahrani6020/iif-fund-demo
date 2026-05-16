#Requires -Version 5.1
<#
.SYNOPSIS
  يجهّز .env ويفتح صفحة مفاتيح MiniMax وملف .env في المفكرة (ويندوز).
.EXAMPLE
  cd C:\Users\vip\iif-fund-demo
  powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\MiniMax-Key-Setup.ps1
#>
$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $Root

$envFile = Join-Path $Root '.env'
$example = Join-Path $Root '.env.example'

if (-not (Test-Path -LiteralPath $envFile)) {
  if (-not (Test-Path -LiteralPath $example)) {
    Write-Error '.env.example not found.'
    exit 1
  }
  Copy-Item -LiteralPath $example -Destination $envFile -Force
  Write-Host '[OK] Created .env from .env.example' -ForegroundColor Green
} else {
  Write-Host '[OK] .env already exists — opening for edit only.' -ForegroundColor Cyan
}

$url = 'https://platform.minimax.io/user-center/basic-information/interface-key'
Start-Process $url
Start-Sleep -Seconds 2
Start-Process notepad.exe -ArgumentList $envFile

Write-Host ''
Write-Host 'Next steps:'
Write-Host '  1) In the browser: Create new secret key, copy the key.'
Write-Host '  2) In Notepad: paste after MINIMAX_API_KEY= then Save.'
Write-Host '  3) Run: npm run minimax:status'
Write-Host '  4) Run: npm run minimax:ask -- "test"'
Write-Host ''
