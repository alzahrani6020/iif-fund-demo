# Extract inline app bundle from financial-consulting/iif-fund-demo/index.html
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
if (-not (Test-Path (Join-Path $root 'financial-consulting'))) {
  $root = 'C:\Users\vip\iif-fund-demo'
}
$htmlPath = Join-Path $root 'financial-consulting\iif-fund-demo\index.html'
$outPath = Join-Path $root 'financial-consulting\iif-fund-demo\js\iif-index-app-bundle.js'
$enc = New-Object System.Text.UTF8Encoding $false
$lines = [System.IO.File]::ReadAllLines($htmlPath, $enc)
Write-Host "Total lines: $($lines.Length)"
# 1-based: line 16800 = opening script; content 16801-30701; 30702 = </script>
$startIdx = 16800  # first line of JS (1-based line 16801)
$endIdx = 30700    # last line of JS (1-based line 30701)
$bundle = $lines[$startIdx..$endIdx]
[System.IO.File]::WriteAllLines($outPath, $bundle, $enc)
Write-Host "Wrote $($bundle.Length) lines to $outPath"
# Rebuild HTML: keep [0..16798] (lines 1-16799), new script, then [30702..end] skip </script> line — use 30702..end to drop closing tag only
$before = $lines[0..16798]
$after = $lines[30702..($lines.Length - 1)]
$newLines = New-Object System.Collections.Generic.List[string]
$newLines.AddRange([string[]]$before)
$newLines.Add('  <script src="js/iif-index-app-bundle.js"></script>')
$newLines.AddRange([string[]]$after)
[System.IO.File]::WriteAllLines($htmlPath, $newLines.ToArray(), $enc)
Write-Host "Updated index.html; removed $($lines.Length - $newLines.Count) lines (net)."
