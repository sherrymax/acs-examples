# 🚀 Deploy Alfresco Content Services on Azure AKS

This guide shows how to deploy **Alfresco Content Services (ACS)** on **Azure Kubernetes Service (AKS)** using **Helm charts**, **Azure Files** for persistent storage, and an optional **Ingress controller** for web access.

---

## 🧱 Prerequisites

- Azure CLI
- kubectl
- Helm v3+
- Docker (optional for image customization)
- Azure subscription

---

## ⚙️ Step 1: Create AKS Cluster

```bash
az login

# Create resource group
az group create --name alfresco-rg --location eastus

# Create AKS cluster
az aks create \
  --resource-group alfresco-rg \
  --name alfresco-aks \
  --node-count 3 \
  --enable-addons monitoring \
  --generate-ssh-keys

# Connect to the cluster
az aks get-credentials --resource-group alfresco-rg --name alfresco-aks
```

---

## 📦 Step 2: Add Helm Repositories

```bash
helm repo add alfresco https://kubernetes-charts.alfresco.com/stable
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

---

## 📁 Step 3: Prepare Namespace & Secrets

```bash
kubectl create namespace alfresco
```

---

## 📄 Step 4: Create `values.yaml`

Save the following configuration as `values.yaml`:

```yaml
global:
  alfrescoRegistryPullSecrets: []
  environment: "dev"
  persistence:
    storageClass: "azurefile"

alfresco-search:
  enabled: true
  searchServicesImage:
    repository: quay.io/alfresco/alfresco-search-services
    tag: 2.0.6

alfresco-transform-service:
  enabled: true
  tika:
    enabled: true
  imagemagick:
    enabled: true
  libreoffice:
    enabled: true
  pdfrenderer:
    enabled: true
  transformrouter:
    enabled: true
  fileContentStore:
    persistence:
      enabled: true
      size: 5Gi
      storageClass: "azurefile"

alfresco-repository:
  image:
    repository: quay.io/alfresco/alfresco-content-repository
    tag: 7.4.0
  adminPassword: "admin"
  persistence:
    enabled: true
    storageClass: "azurefile"
    size: 10Gi
  database:
    external: false
    driver: org.postgresql.Driver
    url: jdbc:postgresql://alfresco-db-postgresql.alfresco.svc.cluster.local:5432/alfresco
    user: postgres
    password: alfresco

alfresco-share:
  image:
    repository: quay.io/alfresco/alfresco-share
    tag: 7.4.0
  ingress:
    enabled: true
    annotations:
      kubernetes.io/ingress.class: nginx
    hosts:
      - host: your-alfresco.yourdomain.com
        paths:
          - /
    tls:
      - secretName: tls-secret
        hosts:
          - your-alfresco.yourdomain.com

postgresql:
  enabled: true
  auth:
    username: postgres
    password: alfresco
    database: alfresco
  primary:
    persistence:
      storageClass: "azurefile"
      size: 8Gi

```

> Replace `your-alfresco.yourdomain.com` with your actual domain or IP.

---

## 🚀 Step 5: Deploy with Helm

```bash
helm install alfresco alfresco/alfresco-content-services \
  -f values.yaml \
  --namespace alfresco
```

---

## 🌐 Step 6: Access the Application

- Run `kubectl get ingress -n alfresco` or `kubectl get svc -n alfresco` to find the IP.
- Access Alfresco Share UI at:  
  `http://<external-ip>/share`
- Default credentials:  
  `admin / admin`

---

## 🔐 Optional: Enable HTTPS with Let's Encrypt

Install cert-manager and use it to issue TLS certificates:

```bash
# Install cert-manager
kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/latest/download/cert-manager.yaml
```

Create a ClusterIssuer:

```yaml
# cluster-issuer.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    email: your-email@example.com
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```

```bash
kubectl apply -f cluster-issuer.yaml
```

---

## ✅ Additional Notes

- You can replace PostgreSQL with [Azure Database for PostgreSQL](https://learn.microsoft.com/en-us/azure/postgresql/).
- To use Azure DB, set `postgresql.enabled: false` and update `alfresco-repository.database` accordingly.
- Storage can be changed to `managed-premium` for Azure Disks if needed.

---

## 📚 Resources

- [Alfresco Helm Charts](https://github.com/Alfresco/acs-deployment)
- [Azure AKS Documentation](https://learn.microsoft.com/en-us/azure/aks/)
- [Cert-Manager Docs](https://cert-manager.io/)
