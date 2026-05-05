$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptDir

podman exec depdemo-mongodb mongosh `
  --username admin `
  --password password `
  --authenticationDatabase admin `
  --quiet `
  --eval "db.getSiblingDB('depdemo-db').cities.deleteMany({})"
