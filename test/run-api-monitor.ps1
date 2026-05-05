param(
  [string]$ApiUrl = "http://localhost:3031",
  [int]$IntervalMs = 1000
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

$env:API_URL = $ApiUrl
$env:INTERVAL_MS = $IntervalMs.ToString()

node "api-monitor.js"
