$ErrorActionPreference = "Stop"

$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$RuntimeUrl = "http://127.0.0.1:8787"
$WebUrl = "http://127.0.0.1:3008"

Set-Location $ProjectRoot

function Test-TcpPort {
    param([int]$Port)

    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $result = $client.BeginConnect("127.0.0.1", $Port, $null, $null)
        if (-not $result.AsyncWaitHandle.WaitOne(500)) {
            return $false
        }
        $client.EndConnect($result)
        return $true
    }
    catch {
        return $false
    }
    finally {
        $client.Close()
    }
}

function Get-AicToken {
    foreach ($file in @(".env.local", ".env")) {
        $path = Join-Path $ProjectRoot $file
        if (-not (Test-Path $path)) { continue }

        $line = Get-Content $path |
            Where-Object { $_ -match '^\s*AIC_RUNTIME_TOKEN\s*=' } |
            Select-Object -First 1

        if ($line) {
            return (($line -split '=', 2)[1]).Trim().Trim('"').Trim("'")
        }
    }
    return $null
}

function Test-AfaqRuntime {
    $token = Get-AicToken
    $headers = @{}
    if ($token) {
        $headers["Authorization"] = "Bearer $token"
    }

    try {
        $result = Invoke-RestMethod "$RuntimeUrl/health" `
            -Headers $headers `
            -TimeoutSec 3

        return (
            $result.success -eq $true -and
            [string]$result.version
        )
    }
    catch {
        return $false
    }
}

function Test-AfaqWeb {
    try {
        Add-Type -AssemblyName System.Net.Http -ErrorAction SilentlyContinue

        $client = New-Object System.Net.Http.HttpClient
        $client.Timeout = [TimeSpan]::FromSeconds(3)

        try {
            $response = $client.GetAsync("$WebUrl/api/admin/me").Result
            $body = $response.Content.ReadAsStringAsync().Result

            try {
                $json = $body | ConvertFrom-Json
            }
            catch {
                return $false
            }

            if ([int]$response.StatusCode -eq 200 -and $json.success -eq $true) {
                return $true
            }

            if ([int]$response.StatusCode -eq 401 -and $json.success -eq $false) {
                return $true
            }

            return $false
        }
        finally {
            $client.Dispose()
        }
    }
    catch {
        return $false
    }
}

function Wait-For {
    param(
        [scriptblock]$Probe,
        [string]$Name,
        [int]$Seconds = 30
    )

    for ($i = 0; $i -lt $Seconds; $i++) {
        if (& $Probe) {
            Write-Host "[AFAQ] $Name healthy."
            return
        }
        Start-Sleep -Seconds 1
    }

    throw "$Name did not become healthy within $Seconds seconds."
}

Write-Host "[AFAQ] Root: $ProjectRoot"

# ------------------------------------------------------------
# Governed Runtime :8787
# ------------------------------------------------------------

if (Test-TcpPort 8787) {
    if (Test-AfaqRuntime) {
        Write-Host "[AFAQ] Governed runtime already healthy on 8787."
    }
    else {
        throw "Port 8787 is occupied, but the service could not be verified as the AFAQ runtime. Nothing was killed."
    }
}
else {
    Write-Host "[AFAQ] Starting governed runtime..."

    Start-Process `
        -FilePath "powershell.exe" `
        -ArgumentList @(
            "-NoProfile",
            "-ExecutionPolicy", "Bypass",
            "-File", (Join-Path $PSScriptRoot "start-aic-runtime.ps1")
        ) `
        -WorkingDirectory $ProjectRoot

    Wait-For -Probe { Test-AfaqRuntime } -Name "AFAQ runtime"
}

# ------------------------------------------------------------
# Next.js Web :3008
# ------------------------------------------------------------

if (Test-TcpPort 3008) {
    if (Test-AfaqWeb) {
        Write-Host "[AFAQ] Web application already healthy on 3008."
    }
    else {
        throw "Port 3008 is occupied, but the service could not be verified as AFAQ Web. Nothing was killed."
    }
}
else {
    Write-Host "[AFAQ] Starting Next.js..."

    Start-Process `
        -FilePath "npm.cmd" `
        -ArgumentList @("run", "dev") `
        -WorkingDirectory $ProjectRoot

    Wait-For -Probe { Test-AfaqWeb } -Name "AFAQ web" -Seconds 60
}

# ------------------------------------------------------------
# Final integration verification
# ------------------------------------------------------------

if (-not (Test-AfaqRuntime)) {
    throw "Final runtime verification failed."
}

if (-not (Test-AfaqWeb)) {
    throw "Final web verification failed."
}

Write-Host ""
Write-Host "========================================"
Write-Host " AFAQ INTEGRATION = PASS"
Write-Host " Root    : $ProjectRoot"
Write-Host " Runtime : $RuntimeUrl"
Write-Host " Web     : $WebUrl"
Write-Host "========================================"
