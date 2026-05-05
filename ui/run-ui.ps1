$ErrorActionPreference = "Stop"

podman run --rm `
  --name depdemo-ui `
  -p 3032:80 `
  depdemo-ui:latest
