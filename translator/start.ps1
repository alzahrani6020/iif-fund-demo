Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$dir = Join-Path $root "translator"
$venvName = ".venv_iif"
$venvPy = Join-Path $dir ($venvName + "\\Scripts\\python.exe")

Write-Host "IIF Local Translator (NLLB-200)" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $venvPy)) {
  Write-Host "Creating venv..." -ForegroundColor Yellow
  Push-Location $dir
  python -m venv $venvName
  & $venvPy -m pip install -r "requirements.txt"
  Pop-Location
}

$env:IIF_TRANSLATE_PORT = "7071"
Write-Host "Starting service on http://127.0.0.1:7071" -ForegroundColor Green
Start-Process -WorkingDirectory $dir -FilePath $venvPy -ArgumentList @("app.py")

Write-Host "Warming up (first translation)..." -ForegroundColor DarkYellow
Start-Process -WindowStyle Hidden -FilePath "powershell" -ArgumentList @(
  "-NoProfile",
  "-ExecutionPolicy", "Bypass",
  "-File", (Join-Path $dir "warmup.ps1")
)

