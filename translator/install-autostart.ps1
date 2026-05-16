Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$taskName = "IIF Local Translator"
$root = Split-Path -Parent $PSScriptRoot
$startPs1 = Join-Path $root "translator\\start.ps1"

if (-not (Test-Path $startPs1)) {
  throw "Missing: $startPs1"
}

$action = "powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$startPs1`""

# Preferred: Scheduled Task (may be blocked by policy). Fallback: Startup folder.
try {
  $taskAction = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$startPs1`""
  $taskTrigger = New-ScheduledTaskTrigger -AtLogOn
  $taskPrincipal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited
  $taskSettings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances IgnoreNew

  try { Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue | Out-Null } catch {}
  Register-ScheduledTask -TaskName $taskName -Action $taskAction -Trigger $taskTrigger -Principal $taskPrincipal -Settings $taskSettings | Out-Null

  Write-Host "Installed autostart via Scheduled Task: $taskName" -ForegroundColor Green
  Write-Host "Run-as user: $env:USERNAME"
  Write-Host "Command: $action"
  exit 0
} catch {
  Write-Host "Scheduled Task install failed (policy/permissions). Falling back to Startup folder." -ForegroundColor Yellow
}

$startup = [Environment]::GetFolderPath("Startup")
$launcher = Join-Path $startup "IIF-Local-Translator-Autostart.cmd"
$cmd = "@echo off`r`n" +
       "powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$startPs1`"`r`n"
Set-Content -LiteralPath $launcher -Value $cmd -Encoding ASCII

Write-Host "Installed autostart via Startup folder." -ForegroundColor Green
Write-Host "File: $launcher"
Write-Host "Command: $action"

