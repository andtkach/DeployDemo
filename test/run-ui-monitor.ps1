param(
  [string]$UiUrl = "",
  [int]$IntervalMs = 1000
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

if ([string]::IsNullOrWhiteSpace($UiUrl)) {
  $ipInfo = podman machine ssh -- "ip -4 addr show eth0" 2>$null
  $rawIpInfo = $ipInfo | Out-String
  $match = [regex]::Match($rawIpInfo, "inet\s+(\d+\.\d+\.\d+\.\d+)")
  $podmanIp = if ($match.Success) { $match.Groups[1].Value.Trim() } else { "" }
  $UiUrl = if (-not [string]::IsNullOrWhiteSpace($podmanIp)) {
    "http://$podmanIp:3032"
  } else {
    "http://localhost:3032"
  }
}

Write-Host "Monitoring UI at $UiUrl"

$env:UI_URL = $UiUrl
$env:INTERVAL_MS = $IntervalMs.ToString()

node "ui-monitor.js"
