BLUE-GREEN DEPLOYMENT DEMO
==========================
Goal: run two full versions of the UI simultaneously (blue=v1, green=v2),
preview the new version at a separate URL, then switch the public URL
to green instantly with zero downtime. API is not touched.


PRE-REQUISITES
--------------
App must be deployed and running (see prev demos).

Verify UI pods are running:
  kubectl get pods -n depdemo -l app=depdemo-ui


SETUP (one-time, before the demo)
-----------------------------------
Add a slot label to the existing blue pods and tighten the Service selector.

  kubectl patch deployment depdemo-ui -n depdemo --type merge --patch-file infra/04-BlueGreen/patch-deployment-blue-label.yaml

  kubectl patch svc ui -n depdemo --type merge --patch-file infra/04-BlueGreen/patch-svc-select-blue.yaml

  kubectl rollout status deployment/depdemo-ui -n depdemo

Verify blue pods have the slot label:
  kubectl get pods -n depdemo -l app=depdemo-ui --show-labels


STEP 1 — Open blue UI in browser
----------------------------------
Navigate to http://localhost:3032
You will see the blue background (v1).


STEP 2 — Modify UI source to create green version
---------------------------------------------------
Edit ui/src/styles.css — change background color in TWO places
(both :root and body selectors):

  FROM: background-color: #1d5fa6;   /* blue */
  TO:   background-color: #1f8f4b;   /* green */

Edit ui/package.json — bump the version:
  "version": "v2"


STEP 3 — Build the green image
--------------------------------
  .\infra\04-BlueGreen\build-ui-green.ps1


STEP 4 — Load the green image into kind
-----------------------------------------
  podman save -o depdemo-ui-v2.tar localhost/depdemo-ui:v2
  kind load image-archive depdemo-ui-v2.tar --name kind-cluster


STEP 5 — Deploy green (3 instances)
--------------------------------------
  kubectl apply -f infra/04-BlueGreen/ui-green-deployment.yaml
  kubectl apply -f infra/04-BlueGreen/ui-green-service.yaml
  kubectl rollout status deployment/depdemo-ui-v2 -n depdemo

Verify both blue and green pods are running side by side:
  kubectl get pods -n depdemo -l app=depdemo-ui -L slot


STEP 6 — Preview green at a separate URL
------------------------------------------
In a separate terminal, port-forward to the green service:
  kubectl port-forward svc/ui-v2 3033:80 -n depdemo

Open http://localhost:3033 — green background, v2.
Open http://localhost:3032 — blue background, v1 still live.
Both versions are fully operational at the same time.


STEP 7 — Switch public URL to green (zero downtime)
-----------------------------------------------------
Close the port-forward terminal first, then run:

  kubectl patch svc ui -n depdemo --type merge --patch-file infra/04-BlueGreen/patch-svc-select-green.yaml

Refresh http://localhost:3032 — it now serves the green UI.
No restart, no delay. The switch is instant.


STEP 8 — Verify
-----------------
  kubectl get svc ui -n depdemo -o jsonpath='{.spec.selector}'

Output should show: {"app":"depdemo-ui","slot":"green"}
