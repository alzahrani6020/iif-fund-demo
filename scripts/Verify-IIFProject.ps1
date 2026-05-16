#Requires -Version 5.1
<#
.SYNOPSIS
  فحص محلي آمن: npm run verify ثم maintenance-full-audit (بدون خادم).
#>
$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $Root

Write-Host '[verify] npm run verify ...' -ForegroundColor Cyan
& npm run verify
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

Write-Host '[verify] maintenance-full-audit ...' -ForegroundColor Cyan
& node "$PSScriptRoot\maintenance-full-audit.mjs"
exit $LASTEXITCODE
