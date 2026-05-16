Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "IIF QA - New Features (One Click)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js not found. Install from https://nodejs.org"
}

Write-Host "[1/5] Running verify (syntax/build)..." -ForegroundColor Yellow
& npm run verify
Write-Host "OK: verify" -ForegroundColor Green
Write-Host ""

Write-Host "[2/5] Starting temp dev server on 3334..." -ForegroundColor Yellow
$port = 3334
$env:PORT = "$port"
$p = Start-Process -FilePath "node" -ArgumentList @("scripts/dev-server.js") -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 2
Write-Host "OK: server started (pid=$($p.Id))" -ForegroundColor Green
Write-Host ""

Write-Host "[3/6] Checking /healthz..." -ForegroundColor Yellow
$r = Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:$port/healthz" -TimeoutSec 8
if ($r.StatusCode -ne 200) { throw "BAD /healthz status $($r.StatusCode)" }
Write-Host "OK: /healthz" -ForegroundColor Green
Write-Host ""

Write-Host "[4/6] Checking /api/searx (if enabled)..." -ForegroundColor Yellow
try {
  $hj = $r.Content | ConvertFrom-Json
  $searxOk = [bool]($hj.searx.ok)
  if ($searxOk) {
    $q = [uri]::EscapeDataString("international investment fund")
    $su = "http://127.0.0.1:$port/api/searx/search?q=$q&format=json"
    $sr = Invoke-WebRequest -UseBasicParsing $su -TimeoutSec 15
    if ($sr.StatusCode -ne 200) { throw "BAD /api/searx status $($sr.StatusCode)" }
    $sj = $sr.Content | ConvertFrom-Json
    if ($null -eq $sj.results) { throw "Unexpected /api/searx payload (missing results)" }
    Write-Host ("OK: /api/searx results=" + ($sj.results.Count)) -ForegroundColor Green
  } else {
    Write-Host "SKIP: /api/searx (SearXNG offline)" -ForegroundColor DarkYellow
  }
} catch {
  throw
}
Write-Host ""

Write-Host "[5/6] Checking /api/fetch allowlist (expect 403)..." -ForegroundColor Yellow
$u = "http://127.0.0.1:$port/api/fetch?url=" + [uri]::EscapeDataString("https://notallowed.example/")
try {
  $null = Invoke-WebRequest -UseBasicParsing $u -TimeoutSec 8
  throw "Expected 403 but got success"
} catch {
  $resp = $_.Exception.Response
  if (-not $resp) { throw }
  $status = [int]$resp.StatusCode
  if ($status -ne 403) { throw "Expected 403 but got $status" }
}
Write-Host "OK: /api/fetch allowlist enforced" -ForegroundColor Green
Write-Host ""

Write-Host "[6/6] Opening pages in browser..." -ForegroundColor Yellow
Start-Process "http://127.0.0.1:$port/"
Start-Process "http://127.0.0.1:$port/health.html"
Start-Process "http://127.0.0.1:$port/connect.html"
Start-Process "http://127.0.0.1:18080/"

Write-Host ""
Write-Host "DONE: All checks OK; pages opened." -ForegroundColor Green

if ($p -and -not $p.HasExited) {
  try { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue } catch {}
}

