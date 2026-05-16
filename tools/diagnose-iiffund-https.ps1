#Requires -Version 5.1
# Arabic: تشخيص ERR_SSL_PROTOCOL_ERROR محلياً — شغّل من مجلد المشروع:
#   powershell -ExecutionPolicy Bypass -File tools\diagnose-iiffund-https.ps1
#   powershell -ExecutionPolicy Bypass -File tools\diagnose-iiffund-https.ps1 -FlushDns
param(
  [switch]$FlushDns
)

$ErrorActionPreference = 'Continue'
$iifDomain = 'iiffund.com'
$iifUrl = ('https://{0}/' -f $iifDomain)

function Write-Step($Title) {
  Write-Host ''
  Write-Host ('--- ' + $Title)
}

Write-Host '========== IIF HTTPS diagnostic =========='
Write-Step '1) DNS resolution'
try {
  $r = Resolve-DnsName -Name $iifDomain -Type A -ErrorAction Stop | Select-Object -First 5
  $r | ForEach-Object { Write-Host ('  A  ' + $_.IPAddress + '  TTL=' + $_.TTL) }
} catch {
  Write-Host ('  [ERR] Resolve-DnsName: ' + $_.Exception.Message)
  try {
    nslookup $iifDomain 2>&1 | ForEach-Object { Write-Host ('  ' + $_) }
  } catch { }
}

Write-Step '2) TCP port 443'
try {
  $tn = Test-NetConnection -ComputerName $iifDomain -Port 443 -WarningAction SilentlyContinue
  Write-Host ('  TcpTestSucceeded: ' + $tn.TcpTestSucceeded)
  if ($tn.RemoteAddress) { Write-Host ('  RemoteAddress: ' + $tn.RemoteAddress) }
} catch {
  Write-Host ('  [ERR] Test-NetConnection: ' + $_.Exception.Message)
}

Write-Step '3) hosts file (iiffund hijack?)'
$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
if (Test-Path $hostsPath) {
  $lines = Get-Content -Path $hostsPath -ErrorAction SilentlyContinue | Where-Object {
    $_ -notmatch '^\s*#' -and $_ -match '\S'
  }
  $bad = $lines | Where-Object { $_ -match 'iiffund' }
  if ($bad) {
    Write-Host '  [WARN] hosts mentions iiffund - may point browser to wrong server:'
    $bad | ForEach-Object { Write-Host ('  >> ' + $_) }
    Write-Host '  Fix: comment line with # or remove, save, retry.'
  } else {
    Write-Host '  OK: no iiffund override in hosts.'
  }
} else {
  Write-Host '  Could not read hosts.'
}

Write-Step '4) WinHTTP proxy'
try {
  netsh winhttp show proxy 2>&1 | ForEach-Object { Write-Host ('  ' + $_) }
} catch { }

Write-Step '5) HTTPS (Invoke-WebRequest HEAD)'
try {
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls13
  $resp = Invoke-WebRequest -Uri $iifUrl -Method Head -TimeoutSec 25 -UseBasicParsing -MaximumRedirection 5
  Write-Host ('  Status: ' + $resp.StatusCode + ' ' + $resp.StatusDescription)
  Write-Host ('  Server: ' + ($resp.Headers['Server'] -join ', '))
} catch {
  Write-Host ('  [FAIL] Invoke-WebRequest: ' + $_.Exception.Message)
}

Write-Step '6) curl.exe (if present)'
$curl = Get-Command curl.exe -ErrorAction SilentlyContinue
if ($curl) {
  & curl.exe -sI --max-time 20 $iifUrl 2>&1 | Select-Object -First 12 | ForEach-Object { Write-Host ('  ' + $_) }
} else {
  Write-Host '  curl.exe not in PATH.'
}

if ($FlushDns) {
  Write-Step 'Flush DNS'
  try {
    ipconfig /flushdns 2>&1 | ForEach-Object { Write-Host ('  ' + $_) }
    Clear-DnsClientCache -ErrorAction SilentlyContinue
    Write-Host '  Done.'
  } catch {
    Write-Host ('  ' + $_.Exception.Message)
  }
}

Write-Host ''
Write-Step 'If steps 5-6 OK but Chrome shows ERR_SSL_PROTOCOL_ERROR'
Write-Host '  - Try Edge/Firefox or a new Chrome profile.'
Write-Host '  - chrome://flags -> disable Experimental QUIC, restart Chrome.'
Write-Host '  - Disable VPN, extensions, AV HTTPS scanning temporarily.'
Write-Host '  - Try phone hotspot instead of Wi-Fi.'
Write-Host ''
Write-Host 'Done.'
exit 0
