$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path))
$apiRoot = Join-Path $repoRoot "api"
$dockerfilePath = Join-Path $apiRoot "Dockerfile"

podman build `
  --file $dockerfilePath `
  --tag depdemo-api:v3 `
  $apiRoot
