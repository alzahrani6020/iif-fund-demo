$ErrorActionPreference = "Stop"

$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$AicCore = Join-Path $ProjectRoot "platform\aic"

if (-not (Test-Path (Join-Path $AicCore "afaq_intelligence_core"))) {
    throw "AFAQ Intelligence Core not found: $AicCore"
}

Set-Location $ProjectRoot

# Load AIC_* settings only. .env.local overrides .env.
foreach ($EnvFile in @(".env", ".env.local")) {
    $EnvPath = Join-Path $ProjectRoot $EnvFile
    if (Test-Path $EnvPath) {
        foreach ($Line in Get-Content $EnvPath) {
            $Line = $Line.Trim()
            if (-not $Line -or $Line.StartsWith("#") -or -not $Line.Contains("=")) { continue }

            $Key, $Value = $Line -split "=", 2
            $Key = $Key.Trim()

            if ($Key -notlike "AIC_*") { continue }

            $Value = $Value.Trim().Trim('"').Trim("'")
            [Environment]::SetEnvironmentVariable($Key, $Value, "Process")
        }
    }
}

# Internal, portable AFAQ paths always win over machine-specific configuration.
if ($env:PYTHONPATH) {
    $env:PYTHONPATH = "$AicCore;$env:PYTHONPATH"
} else {
    $env:PYTHONPATH = $AicCore
}

$env:AIC_HOME = $ProjectRoot
$env:AIC_DEV_PROJECT_ROOT = $ProjectRoot

Write-Host "[AFAQ] Project root: $ProjectRoot"
Write-Host "[AFAQ] Intelligence core: $AicCore"
Write-Host "[AFAQ] Starting governed runtime..."

python -m afaq_agent_runtime.runtime_server
exit $LASTEXITCODE
