#Requires -Version 5.1
<#
.SYNOPSIS
  يتحقق من المفتاح ثم يستدعي npm run minimax:ask (آمن — لا يطبع المفتاح).
.EXAMPLE
  .\scripts\Invoke-MiniMaxAsk.ps1 "اقترح تحسيناً للواجهة"
#>
$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $Root

& node "$PSScriptRoot\minimax-env-status.mjs" | Out-Host
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

$question = ($args | ForEach-Object { $_ }) -join ' '
if ([string]::IsNullOrWhiteSpace($question)) {
  Write-Host 'Usage: .\scripts\Invoke-MiniMaxAsk.ps1 "your question"' -ForegroundColor Yellow
  exit 1
}

$npmArgs = @('run', 'minimax:ask', '--', $question)
& npm @npmArgs
exit $LASTEXITCODE
