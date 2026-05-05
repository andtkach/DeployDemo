$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$dockerfilePath = Join-Path $scriptRoot "Dockerfile"

podman build `
  --file $dockerfilePath `
  --tag depdemo-api:v1 `
  --tag depdemo-api:latest `
  $scriptRoot
