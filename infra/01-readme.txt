CLUSTER SETUP (one-time)
# Create kind cluster with host port mappings so services are accessible directly from the browser
kind create cluster --name kind-cluster --config infra/kind-config.yaml

CLUSTER TEARDOWN
# Delete the namespace only (keep the cluster)
kubectl delete namespace depdemo

# Delete the entire cluster
kind delete cluster --name kind-cluster

DEPLOY

# 1. Build images
.\api\build-api.ps1
.\ui\build-ui.ps1
.\proc\build-proc.ps1

# 2. Install MetalLB (LoadBalancer support for kind)
kubectl apply -f infra/01-Deployment/metallb-native.yaml
kubectl wait --namespace metallb-system --for=condition=available deployment --all --timeout=120s
kubectl apply -f infra/01-Deployment/metallb-config.yaml

# 3. Load images into kind (check cluster name with: kind get clusters)
podman save -o depdemo-api-v1.tar  localhost/depdemo-api:latest
podman save -o depdemo-ui-v1.tar   localhost/depdemo-ui:latest
podman save -o depdemo-proc-v1.tar localhost/depdemo-proc:latest
kind load image-archive depdemo-api-v1.tar  --name kind-cluster
kind load image-archive depdemo-ui-v1.tar   --name kind-cluster
kind load image-archive depdemo-proc-v1.tar --name kind-cluster

# 4. Deploy
kubectl apply -f infra/01-Deployment/depdemo.yaml

VERIFY
kubectl get pods -n depdemo
kubectl get svc -n depdemo
kubectl get all -n depdemo

ACCESS
API: http://localhost:3031/
UI:  http://localhost:3032/

Run tests
.\test\run-api-monitor.ps1
.\test\run-ui-monitor.ps1 -UiUrl "http://localhost:3032"
