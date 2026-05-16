# Lists antivirus registered with Windows Security Center + common third-party installs + relevant services
$ErrorActionPreference = 'SilentlyContinue'

Write-Host "`n=== Security Center: registered antivirus products ===" -ForegroundColor Cyan
try {
  Get-CimInstance -Namespace root/SecurityCenter2 -ClassName AntiVirusProduct |
    Select-Object displayName, productState, pathToSignedProductExe |
    Format-List
} catch {
  Write-Host $_.Exception.Message
}

Write-Host "`n=== Windows Defender (if available) ===" -ForegroundColor Cyan
try {
  Get-MpComputerStatus | Select-Object AMServiceEnabled, AntivirusEnabled, RealTimeProtectionEnabled, IoavProtectionEnabled |
    Format-List
} catch {
  Write-Host $_.Exception.Message
}

Write-Host "`n=== Installed programs (security-related keywords) ===" -ForegroundColor Cyan
$rx = 'McAfee|Kaspersky|ESET|Norton|Symantec|Avast|AVG|Bitdefender|Trend Micro|Sophos|Malwarebytes|WebAdvisor|Safe Connect|F-Secure|Avira|Comodo|Panda|G Data|VIPRE|Cylance|Defender'
$paths = @(
  'HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*',
  'HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*'
)
$rows = foreach ($p in $paths) {
  Get-ItemProperty $p -ErrorAction SilentlyContinue |
    Where-Object { $_.DisplayName -and ($_.DisplayName -match $rx) }
}
$rows |
  Select-Object DisplayName, Publisher, DisplayVersion |
  Sort-Object DisplayName -Unique |
  Format-Table -AutoSize

Write-Host "`n=== Services (name match: McAfee, mfe, WinDefend, WdNis, SecurityHealth, Sense) ===" -ForegroundColor Cyan
Get-Service |
  Where-Object {
    $n = $_.Name
    $n -match 'McAfee|mfew|mfe|WinDefend|WdNis|SecurityHealth|Sense|wscsvc|mpssvc'
  } |
  Select-Object Name, DisplayName, Status, StartType |
  Sort-Object Name |
  Format-Table -AutoSize
