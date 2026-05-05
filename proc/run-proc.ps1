$ErrorActionPreference = "Stop"

podman run --rm `
  -e MONGO_HOST=host.containers.internal `
  -e MONGO_PORT=27027 `
  -e MONGO_DB=depdemo-db `
  -e MONGO_USER=admin `
  -e MONGO_PASSWORD=password `
  depdemo-proc:latest
