Set-StrictMode -Version Latest
$ErrorActionPreference = "SilentlyContinue"

$port = $env:IIF_TRANSLATE_PORT
if (-not $port) { $port = "7071" }
$base = "http://127.0.0.1:$port"

function Try-JsonPost([string]$url, [string]$jsonBody, [int]$timeoutSec) {
  try {
    return Invoke-RestMethod -Method Post -Uri $url -ContentType "application/json" -Body $jsonBody -TimeoutSec $timeoutSec
  } catch {
    return $null
  }
}

function Try-Get([string]$url, [int]$timeoutSec) {
  try {
    return Invoke-RestMethod -Method Get -Uri $url -TimeoutSec $timeoutSec
  } catch {
    return $null
  }
}

# Wait for /healthz
for ($i = 0; $i -lt 60; $i++) {
  $h = Try-Get "$base/healthz" 2
  if ($h -and $h.ok) { break }
  Start-Sleep -Milliseconds 500
}

# Warm-up translation (forces model load)
$body = '{"text":"hello","target_lang":"arb_Arab"}'
for ($i = 0; $i -lt 10; $i++) {
  $r = Try-JsonPost "$base/translate" $body 30
  if ($r -and $r.ok) { break }
  Start-Sleep -Seconds 2
}

