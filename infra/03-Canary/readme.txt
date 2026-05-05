CANARY DEPLOYMENT DEMO
======================
Goal: route 25% of API traffic to a new v3 version alongside 3 stable v2 pods,
with no downtime and no changes to the Service.

How it works: the existing "api" Service selects pods by label "app: depdemo-api".
The canary Deployment adds one pod with that same label plus "track: canary".
Kubernetes load-balances across all 4 pods — 3 v2 + 1 v3 = 25% canary traffic.


PRE-REQUISITES
--------------


Verify 3 v2 api pods are running:
  kubectl get pods -n depdemo


STEP 1 — Start the API monitor (Terminal 1, keep running)
----------------------------------------------------------
  .\test\run-api-monitor.ps1


STEP 2 — Modify the API to v3 (Terminal 2)
-------------------------------------------
Edit api/package.json — change the version field:
  "version": "v3"


STEP 3 — Build the v3 image (Terminal 2)
-----------------------------------------
  .\infra\03-Canary\build-api-v3.ps1


STEP 4 — Load the v3 image into kind (Terminal 2)
---------------------------------------------------
  podman save -o depdemo-api-v3.tar localhost/depdemo-api:v3
  kind load image-archive depdemo-api-v3.tar --name kind-cluster


STEP 5 — Deploy the canary (Terminal 2)
-----------------------------------------
  kubectl apply -f infra/03-Canary/api-canary-deployment.yaml

Verify you now have 3 stable + 1 canary pod:
  kubectl get pods -n depdemo -L track

Expected output:
  NAME                                  READY  STATUS   TRACK
  depdemo-api-xxx                       1/1    Running
  depdemo-api-xxx                       1/1    Running
  depdemo-api-xxx                       1/1    Running
  depdemo-api-canary-xxx                1/1    Running  canary


STEP 6 — Observe traffic split (Terminal 1)
--------------------------------------------
Watch the monitor output. Approximately 1 in 4 requests will hit the canary:
  api 2024-... server=depdemo-api-xxx        version=v2
  api 2024-... server=depdemo-api-yyy        version=v2
  api 2024-... server=depdemo-api-zzz        version=v2
  api 2024-... server=depdemo-api-canary-xxx version=v3   <-- 25% canary
  api 2024-... server=depdemo-api-xxx        version=v2
  ...

The Service and UI are untouched. No downtime occurs.


Script to test canary traffic
 .\infra\03-Canary\run-canary-check.ps1
