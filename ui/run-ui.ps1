param(
  [string]$ApiBaseUrl = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($ApiBaseUrl)) {
  $ApiBaseUrl = "http://localhost:3031"
}

Write-Host "Starting UI with API base URL: $ApiBaseUrl"
Write-Host "Example: .\run-ui.ps1 -ApiBaseUrl ""http://172.23.231.30:3031"""

$ipInfo = podman machine ssh -- "ip -4 addr show eth0" 2>$null
$podmanIp = ($ipInfo | Select-String -Pattern "inet\s+(\d+\.\d+\.\d+\.\d+)").Matches.Groups[1].Value.Trim()

if (-not [string]::IsNullOrWhiteSpace($podmanIp)) {
  Write-Host "UI will be available at http://$podmanIp:3032/"
} else {
  Write-Host "UI will be available on port 3032."
}

podman run --rm `
  -it `
  --name depdemo-ui `
  -e API_BASE_URL=$ApiBaseUrl `
  -p 0.0.0.0:3032:80 `
  depdemo-ui:latest
