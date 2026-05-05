$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$dockerfilePath = Join-Path $scriptRoot "Dockerfile"

podman build `
  --file $dockerfilePath `
  --tag depdemo-proc:v1 `
  --tag depdemo-proc:latest `
  $scriptRoot
