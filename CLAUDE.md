# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DeployDemo** is a distributed application demonstrating deployment strategies (blue-green, canary, rolling updates) on Kubernetes. It has three services — a React/Vite UI, an Express.js REST API, and a background processor — all backed by MongoDB.

## Common Commands

### Running the Full Stack Locally

```powershell
# Start all services with Docker Compose (builds images automatically)
./run-compose.ps1
# Equivalent: podman compose -f docker-compose.yml up --build
```

Services: MongoDB on 27027, API on 3031, UI on 3032.

### UI Development

```bash
cd ui
npm run dev       # Vite dev server
npm run build     # Production build to dist/
npm run preview   # Preview production build
```

### API / Proc Development

```bash
cd api && node src/index.js   # Run API directly
cd proc && node src/index.js  # Run processor once
```

### Building Container Images

```powershell
./api/build-api.ps1    # depdemo-api:v1, :latest
./ui/build-ui.ps1      # depdemo-ui:v1, :latest
./proc/build-proc.ps1  # depdemo-proc:v1, :latest
```

### Database Operations

```powershell
./db/run.ps1        # Start MongoDB container
./db/insert.ps1     # Insert a sample city
./db/insert-30.ps1  # Insert 30 test records
./db/select.ps1     # Query all cities
./db/clear.ps1      # Delete all cities
```

### API Testing

```powershell
./api/test-api.ps1     # Full endpoint test
./api/get-cities.ps1   # GET /cities
./api/post-city.ps1    # POST /cities
```

### Monitoring

```powershell
./test/run-api-monitor.ps1   # Poll API health
./test/run-ui-monitor.ps1    # Poll UI health
```

### Kubernetes Deployment

```bash
# Load images into kind cluster
kind load image-archive depdemo-api.tar

# Apply full manifest (namespace: depdemo)
kubectl apply -f infra/01-Deployment/depdemo.yaml

# Verify
kubectl get pods -n depdemo
```

## Architecture

### Services

| Service | Path | Port | Tech |
|---------|------|------|------|
| UI | `ui/` | 3032 | React 18 + Vite + Nginx |
| API | `api/` | 3031 | Node.js 24 + Express |
| Processor | `proc/` | — | Node.js 24 (batch job) |
| Database | `db/` | 27027 | MongoDB |

### API Endpoints (`api/src/`)

- `GET /` — returns `{servername, version, datetime}`
- `GET /cities?num=10` — list cities
- `POST /cities` — create city
- `PUT /cities/:id` — update city
- `DELETE /cities/:id` — delete city (HTTP 204)

CORS is enabled for all origins.

### Data Model

MongoDB collection `cities` (shared by `api` and `proc`):

```js
{ id: Number, name: String, created_at: Date, updated_at: Date|null }
```

### Background Processor (`proc/`)

Runs as a one-shot job (not a daemon). Each invocation:
1. Waits a random delay (0–998ms)
2. Finds up to 3 cities where `updated_at` is null
3. Uppercases their names and sets `updated_at`
4. Exits

Designed to be run repeatedly (e.g., via K8s Job/CronJob).

### UI API Discovery (`ui/src/api/cities.js`)

The UI resolves the API base URL at runtime in priority order:
1. `window.__API_BASE_URL` (injected by Nginx entrypoint script)
2. `VITE_API_BASE_URL` env var (build time)
3. `http://{hostname}:3031` (fallback)

The `window.__UI_CONTAINER_ID` variable identifies which UI replica is serving the request (useful for blue-green/canary demos).

### Docker / Container Strategy

All three services use **multi-stage Dockerfiles** (Node.js 24 Alpine): a builder stage installs prod-only dependencies (`npm install --omit=dev`), and a minimal runner stage copies only the artifacts. The UI adds a Vite build step before serving via Nginx.

### Environment Variables

**API & Proc:**
```
MONGO_HOST, MONGO_PORT, MONGO_DB, MONGO_USER, MONGO_PASSWORD
MONGO_URI  (overrides individual vars)
PORT=3031  (API only)
```

**UI:**
```
VITE_API_BASE_URL=http://localhost:3031
```

### Kubernetes (`infra/01-Deployment/`)

- Namespace: `depdemo`
- MongoDB as a StatefulSet (1 replica, 5Gi PVC)
- API and UI as Deployments (3 replicas each) with LoadBalancer services
- MetalLB for LoadBalancer support in kind clusters (`metallb-native.yaml`, `metallb-config.yaml`)

### Deployment Patterns Demo (`doc/readme.txt`)

The repo demonstrates:
- **Blue-Green:** Two UI versions (ports 3011/3012) behind a proxy on port 80
- **Canary:** API v1 (80% traffic) and v2 (20% traffic)
- **Rolling Update:** Zero-downtime upgrade across all replicas
