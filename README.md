# DeployDemo

A hands-on demo app for developers who want to understand how real deployments work — not just write the code, but actually ship it.

The app itself is simple: a React UI, an Express API, and a background processor, all backed by MongoDB. The interesting part is what happens after the code is written.

## What's inside

- **Run locally** — spin up the full stack with a single Docker Compose command
- **Deploy to Kubernetes** — deploy to a local kind cluster with MetalLB for realistic LoadBalancer behaviour
- **Rolling Update** — update the API from v1 to v2 with zero downtime, watching live traffic the whole time
- **Canary Deployment** — route 25% of traffic to a new API version while keeping 75% on the stable one
- **Blue-Green Deployment** — run two UI versions side by side, preview the new one privately, then switch traffic instantly

## Quick start

```powershell
# Run everything locally with Docker Compose
./run-compose.ps1
```

API: http://localhost:3031 — UI: http://localhost:3032

## Demo walkthroughs

| Demo | Guide |
|------|-------|
| Local run (individual containers) | `doc/01-run-local.txt` |
| Kubernetes deploy | `infra/01-readme.txt` |
| Rolling Update | `infra/02-RollingUpdate/readme.txt` |
| Canary | `infra/03-Canary/readme.txt` |
| Blue-Green | `infra/04-BlueGreen/readme.txt` |

## Stack

| | Tech |
|---|---|
| UI | React 18 + Vite + Nginx |
| API | Node.js 24 + Express |
| Processor | Node.js 24 (batch job) |
| Database | MongoDB |
| Container runtime | Podman |
| Kubernetes | Kind (local cluster) |
| PowerShell | Terminal |
| Windows | OS where everything runs |


## Demo walkthroughs
Repo: [DeployDemo](https://github.com/andtkach/DeployDemo)
Video: [YouTube](https://www.youtube.com/@andtkach)
