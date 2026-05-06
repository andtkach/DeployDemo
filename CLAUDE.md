# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DeployDemo** is a distributed application used as a demo for a video/presentation on practical deployment knowledge for developers. It demonstrates three Kubernetes deployment strategies — rolling update, canary, and blue-green — using a realistic three-service app: a React/Vite UI, an Express.js REST API, and a background batch processor, all backed by MongoDB.

## Repository Layout

```
DeployDemo/
├── api/              # Express.js REST API (port 3031)
├── ui/               # React 18 + Vite frontend (port 3032, served via Nginx)
├── proc/             # Node.js batch processor (one-shot job, no port)
├── db/               # MongoDB container scripts and init
├── test/             # API and UI health monitors
├── infra/
│   ├── kind-config.yaml           # Kind cluster config (host port mappings)
│   ├── readme.txt                 # Cluster setup/teardown + full deploy steps
│   ├── 01-Deployment/             # Base K8s manifests (depdemo.yaml, MetalLB)
│   ├── 02-RollingUpdate/          # Rolling update demo (API v1 → v2)
│   ├── 03-Canary/                 # Canary demo (25% traffic to API v3)
│   └── 04-BlueGreen/              # Blue-green demo (UI v1 → v2)
├── doc/
│   ├── 01-run-local.txt           # Individual service local run steps
│   └── demo-readme.txt            # Full video demo script/outline
├── docker-compose.yml             # Full stack (MongoDB + API + UI + Proc)
└── run-compose.ps1                # Shortcut: podman compose -f docker-compose.yml up --build
```

## Common Commands

### Option A — Full Stack with Docker Compose

```powershell
# Start everything (builds images automatically)
./run-compose.ps1
# Equivalent: podman compose -f docker-compose.yml up --build
```

Services: MongoDB on 27027, API on 3031, UI on 3032.

### Option B — Individual Containers (local dev/test)

```powershell
# Database
./db/run.ps1

# API
./api/build-api.ps1
./api/run-api.ps1

# Processor (one-shot)
./proc/build-proc.ps1
./proc/run-proc.ps1

# UI
./ui/build-ui.ps1
./ui/run-ui.ps1
```

### UI Development (Vite dev server)

```bash
cd ui
npm run dev       # Vite HMR dev server
npm run build     # Production build to dist/
npm run preview   # Preview production build
```

### API / Proc Development (run directly)

```bash
cd api && node src/index.js   # Run API without container
cd proc && node src/index.js  # Run processor once without container
```

### Building Container Images

```powershell
./api/build-api.ps1    # depdemo-api:v1, :latest
./ui/build-ui.ps1      # depdemo-ui:v1, :latest
./proc/build-proc.ps1  # depdemo-proc:v1, :latest
```

### Database Operations

```powershell
./db/run.ps1        # Start MongoDB container (port 27027)
./db/insert.ps1     # Insert a single sample city
./db/insert-30.ps1  # Insert 30 test records
./db/select.ps1     # Query all cities
./db/clear.ps1      # Delete all cities
```

### API Testing

```powershell
./api/test-api.ps1     # Full endpoint test suite
./api/get-cities.ps1   # GET /cities
./api/post-city.ps1    # POST /cities
```

### Monitoring

```powershell
./test/run-api-monitor.ps1                       # Poll API health continuously
./test/run-ui-monitor.ps1 -UiUrl "http://localhost:3032"  # Poll UI health
```

### Cleanup (after local container runs)

```powershell
podman stop --all
podman rm --all
podman volume prune
```

---

## Kubernetes Deployment

### Cluster Setup (one-time)

```powershell
# Create kind cluster with host port mappings
kind create cluster --name kind-cluster --config infra/kind-config.yaml

# Install MetalLB (LoadBalancer support for kind)
kubectl apply -f infra/01-Deployment/metallb-native.yaml
kubectl wait --namespace metallb-system --for=condition=available deployment --all --timeout=120s
kubectl apply -f infra/01-Deployment/metallb-config.yaml

# Build images
./api/build-api.ps1
./ui/build-ui.ps1
./proc/build-proc.ps1

# Export and load images into kind
podman save -o depdemo-api-v1.tar  localhost/depdemo-api:latest
podman save -o depdemo-ui-v1.tar   localhost/depdemo-ui:latest
podman save -o depdemo-proc-v1.tar localhost/depdemo-proc:latest
kind load image-archive depdemo-api-v1.tar  --name kind-cluster
kind load image-archive depdemo-ui-v1.tar   --name kind-cluster
kind load image-archive depdemo-proc-v1.tar --name kind-cluster

# Deploy everything
kubectl apply -f infra/01-Deployment/depdemo.yaml
```

### Verify

```powershell
kubectl get pods -n depdemo
kubectl get svc -n depdemo
kubectl get all -n depdemo
```

Access: API at `http://localhost:3031`, UI at `http://localhost:3032`.

### Cluster Teardown

```powershell
kubectl delete namespace depdemo   # Remove app only (keep cluster)
kind delete cluster --name kind-cluster  # Remove everything
```

---

## Deployment Patterns

### Rolling Update (`infra/02-RollingUpdate/`)

Goal: update API from v1 → v2 with zero visible downtime.

1. Start monitor: `./test/run-api-monitor.ps1`
2. Edit `api/package.json` → set `"version": "v2"`
3. Build: `./infra/02-RollingUpdate/build-api-v2.ps1`
4. Load into kind:
   ```powershell
   podman save -o depdemo-api-v2.tar localhost/depdemo-api:v2
   kind load image-archive depdemo-api-v2.tar --name kind-cluster
   ```
5. Apply patch: `kubectl apply -f infra/02-RollingUpdate/api-v2-patch.yaml`
6. Watch: `kubectl rollout status deployment/depdemo-api -n depdemo`

### Canary (`infra/03-Canary/`)

Goal: send 25% of API traffic to v3, 75% stays on v2. No Service changes needed.

Mechanism: the existing `api` Service selects `app: depdemo-api`. Adding one canary pod with that same label gives 1 of 4 pods = 25% traffic automatically.

1. Start monitor: `./test/run-api-monitor.ps1`
2. Edit `api/package.json` → set `"version": "v3"`
3. Build: `./infra/03-Canary/build-api-v3.ps1`
4. Load into kind:
   ```powershell
   podman save -o depdemo-api-v3.tar localhost/depdemo-api:v3
   kind load image-archive depdemo-api-v3.tar --name kind-cluster
   ```
5. Deploy canary: `kubectl apply -f infra/03-Canary/api-canary-deployment.yaml`
6. Verify: `kubectl get pods -n depdemo -L track`
7. Verify traffic split: `./infra/03-Canary/run-canary-check.ps1`

### Blue-Green (`infra/04-BlueGreen/`)

Goal: run two full UI versions simultaneously (blue=v1, green=v2), preview green privately, then switch the public URL instantly.

**Setup (one-time):**
```powershell
kubectl patch deployment depdemo-ui -n depdemo --type merge --patch-file infra/04-BlueGreen/patch-deployment-blue-label.yaml
kubectl patch svc ui -n depdemo --type merge --patch-file infra/04-BlueGreen/patch-svc-select-blue.yaml
kubectl rollout status deployment/depdemo-ui -n depdemo
```

**Demo steps:**
1. Edit `ui/src/styles.css` — change `background-color` to green (`#1f8f4b`) in both `:root` and `body`
2. Edit `ui/package.json` → set `"version": "v2"`
3. Build: `./infra/04-BlueGreen/build-ui-green.ps1`
4. Load into kind:
   ```powershell
   podman save -o depdemo-ui-v2.tar localhost/depdemo-ui:v2
   kind load image-archive depdemo-ui-v2.tar --name kind-cluster
   ```
5. Deploy green:
   ```powershell
   kubectl apply -f infra/04-BlueGreen/ui-green-deployment.yaml
   kubectl apply -f infra/04-BlueGreen/ui-green-service.yaml
   kubectl rollout status deployment/depdemo-ui-v2 -n depdemo
   ```
6. Preview green: `kubectl port-forward svc/ui-v2 3033:80 -n depdemo`
   - Blue (v1): `http://localhost:3032`
   - Green (v2) preview: `http://localhost:3033`
7. Switch traffic (instant, zero downtime):
   ```powershell
   kubectl patch svc ui -n depdemo --type merge --patch-file infra/04-BlueGreen/patch-svc-select-green.yaml
   ```
8. Verify: `kubectl get svc ui -n depdemo -o jsonpath='{.spec.selector}'`

---

## Architecture

### Services

| Service | Path | Port | Tech |
|---------|------|------|------|
| UI | `ui/` | 3032 | React 18 + Vite + Nginx |
| API | `api/` | 3031 | Node.js 24 + Express + Mongoose |
| Processor | `proc/` | — | Node.js 24 + Mongoose (batch job) |
| Database | `db/` | 27027 | MongoDB |

### API Endpoints (`api/src/routes/cityRoutes.js`)

- `GET /` — returns `{servername, version, datetime}`
- `GET /cities?num=10` — list cities (default 10)
- `POST /cities` — create city
- `PUT /cities/:id` — update city
- `DELETE /cities/:id` — delete city (HTTP 204)

CORS is enabled for all origins.

### Data Model

MongoDB database `depdemo-db`, collection `cities` (shared by `api` and `proc`):

```js
{ id: Number, name: String, created_at: Date, updated_at: Date|null }
```

### Background Processor (`proc/src/index.js`)

Runs as a one-shot job (not a daemon). Each invocation:
1. Waits a random delay (0–998 ms)
2. Finds up to 3 cities where `updated_at` is null
3. Uppercases their names and sets `updated_at`
4. Exits

Designed for K8s Job/CronJob. Run repeatedly to process all records.

### UI API Discovery (`ui/src/api/cities.js`)

The UI resolves the API base URL at runtime in priority order:
1. `window.__API_BASE_URL` — injected at container start by `ui/docker-entrypoint.d/10-config.sh`
2. `VITE_API_BASE_URL` — build-time env var
3. `http://{hostname}:3031` — fallback

`window.__UI_CONTAINER_ID` identifies which UI replica is serving (visible in blue-green demos).

### Docker / Container Strategy

All three services use **multi-stage Dockerfiles** (Node.js 24 Alpine):
- Builder stage: `npm install --omit=dev`
- Runner stage: minimal image with only production artifacts
- UI adds a Vite build step before Nginx serves the `dist/`

### Environment Variables

**API & Proc:**
```
MONGO_HOST       default: localhost
MONGO_PORT       default: 27017
MONGO_DB         default: depdemo-db
MONGO_USER
MONGO_PASSWORD
MONGO_URI        overrides all individual MONGO_* vars
PORT=3031        API only
```

**UI (build time):**
```
VITE_API_BASE_URL=http://localhost:3031
```

### Kubernetes (`infra/01-Deployment/depdemo.yaml`)

- Namespace: `depdemo`
- MongoDB: StatefulSet (1 replica, 5Gi PVC)
- API: Deployment (3 replicas) with LoadBalancer service
- UI: Deployment (3 replicas) with LoadBalancer service
- Proc: CronJob
- MetalLB provides LoadBalancer support in the kind cluster
