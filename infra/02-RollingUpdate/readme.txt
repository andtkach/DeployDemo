ROLLING UPDATE DEMO
===================
Goal: show that updating the API from v1 to v2 is invisible to consumers.
The API monitor runs continuously in Terminal 1 throughout the entire demo.
All other commands run in Terminal 2.


PRE-REQUISITES
--------------
App must already be deployed and running (see infra/readme.txt).
Verify:
  kubectl get pods -n depdemo
  kubectl get svc -n depdemo


STEP 1 — Start the API monitor (Terminal 1, keep running)
---------------------------------------------------------
  .\test\run-api-monitor.ps1



STEP 2 — Show current pods (Terminal 2)
----------------------------------------
  kubectl get pods -n depdemo

Note the 3 api pod names. These will be replaced one by one during the rollout.


STEP 3 — Modify the API (Terminal 2)
--------------------------------------
Edit api/package.json — change the version field from v1 to v2:
  "version": "v2"


STEP 4 — Build the v2 image (Terminal 2)
-----------------------------------------
  .\infra\02-RollingUpdate\build-api-v2.ps1


STEP 5 — Load the v2 image into kind (Terminal 2)
---------------------------------------------------
  podman save -o depdemo-api-v2.tar localhost/depdemo-api:v2
  kind load image-archive depdemo-api-v2.tar --name kind-cluster


STEP 6 — Apply the rolling update (Terminal 2)
------------------------------------------------
  kubectl apply -f infra/02-RollingUpdate/api-v2-patch.yaml

  kubectl rollout status deployment/depdemo-api -n depdemo

  kubectl get pods -n depdemo
