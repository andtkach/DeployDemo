param(
  [string]$Name
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Name)) {
  Write-Host "Usage: .\insert.ps1 -Name ""CityName"""
  exit 1
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptDir

$escapedName = $Name.Replace("'", "''")
$eval = "db.getSiblingDB('depdemo-db').cities.insertOne({ id: new Date().valueOf(), name: '$escapedName', created_at: new Date(), updated_at: null })"

podman exec depdemo-mongodb mongosh `
  --username admin `
  --password password `
  --authenticationDatabase admin `
  --quiet `
  --eval $eval
