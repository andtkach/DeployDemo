$ErrorActionPreference = "Stop"

podman run --rm `
  -e MONGO_HOST=host.containers.internal `
  -e MONGO_PORT=27027 `
  -e MONGO_DB=depdemo-db `
  -e MONGO_USER=admin `
  -e MONGO_PASSWORD=password `
  -e PORT=3031 `
  -p 3031:3031 `
  depdemo-api:latest
