Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Measure-HttpLatency {
  param(
    [Parameter(Mandatory=$true)][string]$Url,
    [int]$Count = 20,
    [int]$TimeoutSec = 10,
    [int]$SleepMs = 150
  )
  $times = New-Object System.Collections.Generic.List[int]
  for ($i = 0; $i -lt $Count; $i++) {
    $sw = [Diagnostics.Stopwatch]::StartNew()
    try { Invoke-WebRequest -UseBasicParsing $Url -TimeoutSec $TimeoutSec | Out-Null } catch { }
    $sw.Stop()
    $times.Add([int]$sw.ElapsedMilliseconds) | Out-Null
    Start-Sleep -Milliseconds $SleepMs
  }
  $sorted = $times.ToArray() | Sort-Object
  $p50 = $sorted[[int]($sorted.Length * 0.5)]
  $p90 = $sorted[[int]([Math]::Ceiling($sorted.Length * 0.9) - 1)]
  $p99 = $sorted[[int]([Math]::Ceiling($sorted.Length * 0.99) - 1)]
  $max = $sorted[$sorted.Length - 1]
  return [pscustomobject]@{ url=$Url; count=$Count; p50=$p50; p90=$p90; p99=$p99; max=$max }
}

Write-Host "IIF perf check" -ForegroundColor Cyan

$health = Measure-HttpLatency -Url "http://127.0.0.1:3333/healthz" -Count 20 -TimeoutSec 5
Write-Host ("healthz ms: p50={0} p90={1} p99={2} max={3}" -f $health.p50,$health.p90,$health.p99,$health.max) -ForegroundColor Green

$q = [uri]::EscapeDataString("international investment fund")
$searxUrl = "http://127.0.0.1:3333/api/searx/search?q=$q&format=json"
$searx = Measure-HttpLatency -Url $searxUrl -Count 5 -TimeoutSec 30 -SleepMs 250
Write-Host ("api/searx ms: p50={0} p90={1} max={2}" -f $searx.p50,$searx.p90,$searx.max) -ForegroundColor Green

