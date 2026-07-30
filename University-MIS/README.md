# University MIS — DevOps Infrastructure

Production-ready DevOps infrastructure for the University Management
Information System (MIS): a React.js + Nginx frontend, a Node.js/Express
backend, PostgreSQL, Redis, AWS S3, JWT auth, deployed on AWS via EKS,
provisioned with Terraform, and automated with GitHub Actions.

> This repository contains **infrastructure and DevOps configuration
> only**. Your `frontend/` and `backend/` application source code should
> live alongside these folders at the repository root (the Dockerfiles
> and CI workflows expect that layout — see [Folder Structure](#folder-structure)).

---

## Table of Contents

1. [Folder Structure](#folder-structure)
2. [Prerequisites](#prerequisites)
3. [Docker & Docker Compose](#docker--docker-compose)
4. [GitHub Actions (CI/CD)](#github-actions-cicd)
5. [Terraform (AWS Infrastructure)](#terraform-aws-infrastructure)
6. [Kubernetes Deployment](#kubernetes-deployment)
7. [Nginx](#nginx)
8. [Monitoring: Prometheus & Grafana](#monitoring-prometheus--grafana)
9. [Logging: ELK Stack](#logging-elk-stack)
10. [Security](#security)
11. [Deployment Commands](#deployment-commands)
12. [Rollback Procedure](#rollback-procedure)
13. [Troubleshooting](#troubleshooting)

---

## Folder Structure

```
University-MIS/
├── frontend/                    # React app source (not included — add your own)
├── backend/                     # Node.js/Express source (not included — add your own)
├── docker/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   ├── docker-compose.yml       # local development stack
│   ├── docker-compose.prod.yml  # production overlay
│   └── .dockerignore
├── .github/workflows/
│   ├── ci.yml                   # lint, unit, integration tests, build
│   ├── cd.yml                   # build, scan, push, deploy to EKS
│   ├── security.yml             # SAST, dependency, secret, container, IaC scans
│   └── test.yml                 # PR-focused unit/integration/e2e suite
├── kubernetes/
│   ├── namespace.yaml
│   ├── frontend-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── postgres-deployment.yaml
│   ├── redis-deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── configmap.yaml
│   ├── secret.yaml              # TEMPLATE ONLY — do not commit real secrets
│   ├── persistent-volume.yaml
│   ├── persistent-volume-claim.yaml
│   ├── autoscaler.yaml          # HPAs + PodDisruptionBudgets
│   ├── network-policy.yaml
│   └── rbac.yaml
├── terraform/
│   ├── provider.tf
│   ├── variables.tf
│   ├── main.tf
│   ├── network.tf               # VPC, subnets, NAT/IGW
│   ├── security.tf              # security groups
│   ├── ec2.tf                   # bastion host
│   ├── eks.tf                   # EKS cluster + node groups
│   ├── rds.tf                   # PostgreSQL + optional ElastiCache Redis
│   ├── s3.tf                    # application storage bucket
│   ├── iam.tf                   # IRSA roles, least-privilege policies
│   ├── cloudwatch.tf            # log groups, alarms, dashboard
│   └── outputs.tf
├── nginx/
│   ├── nginx.conf                # global config, gzip, security headers
│   └── default.conf              # reverse proxy + SPA routing
├── monitoring/
│   ├── prometheus.yml
│   ├── alert.rules.yml
│   ├── alertmanager.yml
│   └── grafana-dashboard.json
├── logging/
│   ├── filebeat/
│   │   ├── filebeat.yml
│   │   └── filebeat-daemonset.yaml
│   ├── logstash/
│   │   └── logstash.conf
│   ├── elasticsearch.yml
│   └── kibana.yml
├── scripts/
│   ├── deploy.sh
│   ├── rollback.sh
│   ├── backup.sh
│   ├── restore.sh
│   ├── cleanup.sh
│   └── healthcheck.sh
└── README.md
```

---

## Prerequisites

Install locally (or ensure available in CI runners):

| Tool | Purpose | Version |
|---|---|---|
| Docker & Docker Compose | Local dev, image builds | 24+ |
| kubectl | Kubernetes management | 1.30+ |
| Terraform | Infrastructure provisioning | 1.7+ |
| AWS CLI v2 | AWS resource access | latest |
| Helm | Installing cluster add-ons | 3.14+ |
| Node.js | Local app development | 20 |

Configure AWS credentials once (`aws configure` or SSO), and add the
following **GitHub Secrets** to your repository (Settings → Secrets and
variables → Actions):

| Secret | Used by |
|---|---|
| `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN` | cd.yml (image push) |
| `AWS_DEPLOY_ROLE_ARN` | cd.yml (OIDC → AWS, no static keys) |
| `SLACK_WEBHOOK_URL` | cd.yml, monitoring notifications |
| `SONAR_TOKEN`, `SONAR_HOST_URL` | security.yml (SAST) |
| `GITLEAKS_LICENSE` | security.yml (secret scanning, optional) |
| `STAGING_URL` | security.yml (DAST) |

---

## Docker & Docker Compose

**Local development** (hot-reload against your source under `frontend/`
and `backend/`):

```bash
cp .env.example .env               # fill in DB_PASSWORD, REDIS_PASSWORD, etc.
docker compose -f docker/docker-compose.yml up -d --build
docker compose -f docker/docker-compose.yml logs -f backend
docker compose -f docker/docker-compose.yml down -v   # tear down + wipe volumes
```

Services: `frontend` (:3000 → nginx :8080), `backend` (:5000), `postgres`
(:5432), `redis` (:6379). All have health checks; `depends_on` uses
`condition: service_healthy` so the backend won't start before its
database and cache are ready.

**Production (single-host)** — layers hardening on top of the base file:
resource limits, read-only root filesystem on the frontend, `no-new-privileges`,
JSON log rotation, and an optional Traefik reverse proxy with automatic
Let's Encrypt certificates:

```bash
export DOCKERHUB_USERNAME=yourorg IMAGE_TAG=abc1234 ACME_EMAIL=ops@university.edu
docker compose -f docker/docker-compose.yml -f docker/docker-compose.prod.yml up -d
```

For real production scale, prefer the [Kubernetes deployment](#kubernetes-deployment)
below instead of single-host Compose.

---

## GitHub Actions (CI/CD)

| Workflow | Trigger | Purpose |
|---|---|---|
| `ci.yml` | push/PR to main, develop, feature/* | Lint → unit tests → integration tests (real Postgres/Redis service containers) → build React & backend → validate Docker builds |
| `test.yml` | pull_request | Focused fast-feedback suite: unit (with coverage gate), integration, and full-stack E2E via Compose |
| `security.yml` | PR, nightly cron, manual | npm audit, SonarQube SAST, Gitleaks secret scan, OWASP ZAP DAST (staging), Trivy container scan, kube-linter, tfsec |
| `cd.yml` | push to main, or manual with environment choice | Build & push versioned images → Trivy scan (blocks on CRITICAL/HIGH) → deploy to EKS via rolling update → smoke test → Slack notification |

`cd.yml` uses **GitHub OIDC** to assume an AWS IAM role
(`AWS_DEPLOY_ROLE_ARN`) — no long-lived AWS access keys are stored in
GitHub Secrets. See `terraform/iam.tf` (`aws_iam_role.github_actions_deploy`)
for the matching trust policy; update the `sub` condition there with your
actual GitHub org/repo before applying.

---

## Terraform (AWS Infrastructure)

Provisions: VPC (public/private/database subnets across 3 AZs, IGW, one
NAT Gateway per AZ), EKS cluster (general-purpose + tainted data-tier node
groups), RDS PostgreSQL (Multi-AZ, encrypted, 14-day backups), optional
ElastiCache Redis, an S3 bucket (encrypted, versioned, TLS-only policy),
least-privilege IAM (IRSA for pods, OIDC for GitHub Actions), and
CloudWatch (log groups, alarms, dashboard).

**One-time state backend bootstrap** (S3 bucket + DynamoDB lock table —
create these manually or via a separate small Terraform config before
running the main `terraform init`, since the backend itself can't
provision its own storage):

```bash
aws s3api create-bucket --bucket university-mis-terraform-state --region us-east-1
aws s3api put-bucket-versioning --bucket university-mis-terraform-state --versioning-configuration Status=Enabled
aws dynamodb create-table --table-name university-mis-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

**Provision the infrastructure:**

```bash
cd terraform
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

**Connect kubectl to the new cluster:**

```bash
$(terraform output -raw kubeconfig_command)
kubectl get nodes
```

Review `variables.tf` before applying — in particular set
`ssh_allowed_cidr` to your own network (it defaults to `0.0.0.0/0`) and
adjust `eks_node_instance_types` / RDS instance class to fit your budget.

---

## Kubernetes Deployment

Manifests apply cleanly with `kubectl apply -f kubernetes/`, but
**apply order matters** for a clean first-time bootstrap — use
`scripts/deploy.sh`, which applies namespace → RBAC → config →
secrets → storage → StatefulSets (Postgres/Redis, waiting for readiness)
→ Deployments → Services → Ingress → autoscalers → network policies, in
that order, then waits for rollout and runs a smoke test.

Key production features already configured:
- **Rolling updates** with `maxUnavailable: 0` for zero-downtime deploys
- **Liveness / readiness / startup probes** on every workload
- **HorizontalPodAutoscalers** (CPU + memory) with separate scale-up/down
  behavior, plus **PodDisruptionBudgets** so node drains don't take down
  a whole tier at once
- **Resource requests/limits** on every container, with a namespace-wide
  `ResourceQuota` and default `LimitRange`
- **Pod anti-affinity** to spread replicas across nodes, and node
  affinity/taints to keep stateful workloads on a dedicated data-tier
  node group
- **NetworkPolicies** implementing default-deny plus explicit allow rules
  per tier (ingress → frontend → backend → postgres/redis)
- **RBAC** with a scoped `ci-cd-deployer` role instead of using
  cluster-admin from CI

Before deploying, replace the `DOCKERHUB_USERNAME` placeholder in
`frontend-deployment.yaml` / `backend-deployment.yaml`, the domains in
`ingress.yaml`, and populate `secret.yaml` with real values (see the
warnings in that file — prefer Sealed Secrets or External Secrets
Operator over committing plaintext).

---

## Nginx

`nginx.conf` sets global performance/security defaults (gzip, hidden
server tokens, rate-limiting zones, cache-control mapping by content
type, and a defense-in-depth CSP/HSTS/X-Frame-Options header set — these
complement, not replace, the same headers set at the Ingress layer).

`default.conf` serves the built React app, proxies `/api/` to the
backend Service with connection reuse and short timeouts, applies rate
limiting to the API location, long-caches hashed static assets while
never caching `index.html`, and falls back to `index.html` for
client-side (React Router) routes.

---

## Monitoring: Prometheus & Grafana

`monitoring/prometheus.yml` auto-discovers scrape targets via the
Kubernetes API: the API server, kubelet/cAdvisor (per-pod CPU/memory),
any pod annotated `prometheus.io/scrape: "true"` (already set on the
frontend and backend Deployments), plus static targets for a
`postgres_exporter` and `redis_exporter` (deploy these as sidecars or
standalone Deployments — not included here, as they depend on your
exact Postgres/Redis versions).

`monitoring/alert.rules.yml` defines alerts for node CPU/memory/disk,
pod crash-looping and readiness, HTTP 5xx rate and P95 latency, and
PostgreSQL/Redis availability and saturation — evaluated by Prometheus
and routed through `monitoring/alertmanager.yml` to Slack (all severities)
and email (critical only), with inhibition rules to avoid paging on both
a critical and a related warning simultaneously.

`monitoring/grafana-dashboard.json` can be imported directly into
Grafana (Dashboards → Import → Upload JSON) for an out-of-the-box
overview: node/pod CPU & memory, HTTP request rate & latency, and
Postgres/Redis metrics.

Typical install via Helm:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace \
  --set-file prometheus.prometheusSpec.additionalScrapeConfigs=monitoring/prometheus.yml
```

---

## Logging: ELK Stack

- **Filebeat** (`logging/filebeat/`) runs as a DaemonSet, auto-discovers
  containers in the `university-mis` namespace, and ships logs to
  Logstash over TLS.
- **Logstash** (`logging/logstash/logstash.conf`) parses structured JSON
  logs from the backend and Nginx access logs from the frontend, drops
  noisy healthcheck lines, and indexes into Elasticsearch with daily,
  per-component indices under ILM management.
- **Elasticsearch** (`logging/elasticsearch.yml`) — 3-node cluster
  config with security (TLS + auth) enabled; deploy via the ECK operator
  or the `elastic/elasticsearch` Helm chart, not bare containers.
- **Kibana** (`logging/kibana.yml`) — web UI for searching and
  visualizing logs, served under `/kibana` behind TLS.

---

## Security

Implemented across this repository:

- **OWASP alignment**: input validation and auth belong in
  `backend/` application code; this infra layer enforces TLS everywhere,
  security headers (CSP, HSTS, X-Frame-Options), rate limiting, and
  network segmentation to reduce attack surface (OWASP Top 10 A01–A05).
- **Secrets management**: `kubernetes/secret.yaml` is a placeholder
  template only — real values should come from Sealed Secrets, External
  Secrets Operator (backed by AWS Secrets Manager, already wired up in
  `terraform/rds.tf`), or `kubectl create secret` run out-of-band, never
  committed. GitHub Secrets hold CI/CD credentials; AWS access uses OIDC,
  not static keys.
- **Image scanning**: Trivy runs in both `cd.yml` (blocks deploy on
  CRITICAL/HIGH) and `security.yml`.
- **Dependency scanning**: `npm audit --audit-level=high` on every PR.
- **Container hardening**: multi-stage builds, non-root users (UID 1001),
  `readOnlyRootFilesystem`, dropped Linux capabilities, no privilege
  escalation — set in both the Dockerfiles and the Kubernetes
  `securityContext` blocks.
- **Network policies & RBAC**: default-deny NetworkPolicies with explicit
  allow rules (`kubernetes/network-policy.yaml`), and least-privilege
  RBAC roles instead of cluster-admin (`kubernetes/rbac.yaml`).

---

## Deployment Commands

```bash
# Full deploy (namespace → data tier → app tier → networking), with smoke test
./scripts/deploy.sh production

# Manual, granular apply
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/

# Update just the image tags after a new build (rolling update)
kubectl -n university-mis set image deployment/backend-deployment backend=yourorg/university-mis-backend:abc1234
kubectl -n university-mis set image deployment/frontend-deployment frontend=yourorg/university-mis-frontend:abc1234
kubectl -n university-mis rollout status deployment/backend-deployment

# Verify
./scripts/healthcheck.sh
```

## Rollback Procedure

```bash
# Roll back to the previous revision
./scripts/rollback.sh backend
./scripts/rollback.sh frontend

# Roll back to a specific revision
kubectl -n university-mis rollout history deployment/backend-deployment
./scripts/rollback.sh backend 3
```

If a rollback doesn't resolve a data-related incident, restore the
database from the most recent backup:

```bash
./scripts/restore.sh --latest
```

---

## Troubleshooting

| Symptom | Check |
|---|---|
| Pods stuck in `Pending` | `kubectl -n university-mis describe pod <pod>` — often insufficient node capacity or an unschedulable node affinity/taint; check `eks_node_desired_size` and data-tier taints |
| Pods `CrashLoopBackOff` | `kubectl -n university-mis logs <pod> --previous`; verify `configmap.yaml`/`secret.yaml` values match what the app expects |
| 502/504 from ingress | `kubectl -n university-mis get endpoints backend-service` — empty endpoints usually means readiness probes are failing |
| Backend can't reach Postgres/Redis | Confirm `NetworkPolicy` allows the traffic (`network-policy.yaml`) and that `DB_HOST`/`REDIS_HOST` match the Service names |
| HPA not scaling | Confirm `metrics-server` is installed (`kubectl get apiservices | grep metrics`) |
| CD pipeline fails at "Configure AWS credentials" | Verify the `sub` claim in `terraform/iam.tf`'s `github_actions_deploy` role matches your actual org/repo/branch |
| Terraform apply fails on S3 backend | Confirm the bootstrap bucket/DynamoDB table (see [Terraform](#terraform-aws-infrastructure)) exist before `terraform init` |
| Trivy blocking deploy on old base image CVEs | Bump the base image tag in the relevant Dockerfile and rebuild — pinning to `alpine`/`node:20-alpine` picks up patches on rebuild |

For anything not covered here, start with:

```bash
kubectl -n university-mis get events --sort-by='.lastTimestamp'
```
