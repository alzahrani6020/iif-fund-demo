Set-StrictMode -Version Latest
$ErrorActionPreference = "SilentlyContinue"

$taskName = "IIF Local Translator"
try { Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue | Out-Null } catch {}
try { schtasks /Delete /F /TN $taskName | Out-Null } catch {}

$startup = [Environment]::GetFolderPath("Startup")
$launcher = Join-Path $startup "IIF-Local-Translator-Autostart.cmd"
if (Test-Path $launcher) { Remove-Item -Force $launcher }

Write-Host "Removed autostart entries for: $taskName" -ForegroundColor Yellow

