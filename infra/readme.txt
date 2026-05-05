PREPARE / CLEAN
kubectl get namespaces
kubectl delete namespace depdemo

DEPLOY
kubectl apply -f infra/01-Deployment/metallb-native.yaml
kubectl wait --namespace metallb-system --for=condition=available deployment --all --timeout=120s
kubectl apply -f infra/01-Deployment/metallb-config.yaml

podman save -o depdemo-api.tar localhost/depdemo-api:latest
podman save -o depdemo-ui.tar localhost/depdemo-ui:latest
kind load image-archive depdemo-api.tar --name kind-cluster
kind load image-archive depdemo-ui.tar --name kind-cluster

kubectl apply -f infra/01-Deployment/depdemo.yaml

VERIFY
kubectl get pods -n depdemo
kubectl get svc -n depdemo

kubectl port-forward -n depdemo svc/api 3031:3031
kubectl port-forward -n depdemo svc/ui 3032:80

API: http://localhost:3031/
UI: http://localhost:3032/
