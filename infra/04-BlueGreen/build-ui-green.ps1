$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path))
$uiRoot = Join-Path $repoRoot "ui"
$dockerfilePath = Join-Path $uiRoot "Dockerfile"

podman build `
  --file $dockerfilePath `
  --tag depdemo-ui:v1 `
  --tag depdemo-ui:latest `
  $uiRoot
