#!/usr/bin/env bash
# =============================================================================
# University MIS - Deployment Script
# Applies Kubernetes manifests in the correct dependency order and waits
# for each rollout to succeed. Intended to be run by CI/CD or manually by
# an operator with kubectl configured against the target cluster.
#
# Usage:
#   ./scripts/deploy.sh [staging|production]
# =============================================================================

set -euo pipefail

ENVIRONMENT="${1:-staging}"
NAMESPACE="university-mis"
KUBE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../kubernetes" && pwd)"
TIMEOUT="300s"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }
die() { echo "[ERROR] $*" >&2; exit 1; }

command -v kubectl >/dev/null 2>&1 || die "kubectl is not installed or not on PATH"

log "Deploying University MIS to environment: ${ENVIRONMENT}"

# ---------------------------------------------------------------------------
# 1. Namespace, quotas, RBAC, config, secrets
# ---------------------------------------------------------------------------
log "Applying namespace and cluster-level policies..."
kubectl apply -f "${KUBE_DIR}/namespace.yaml"
kubectl apply -f "${KUBE_DIR}/rbac.yaml"
kubectl apply -f "${KUBE_DIR}/configmap.yaml"

if [[ -z "${SKIP_SECRETS:-}" ]]; then
  log "Applying secrets (ensure secret.yaml has been populated with real values, not the template placeholders)..."
  kubectl apply -f "${KUBE_DIR}/secret.yaml"
else
  log "SKIP_SECRETS set - assuming secrets already exist in-cluster."
fi

# ---------------------------------------------------------------------------
# 2. Storage
# ---------------------------------------------------------------------------
log "Applying storage classes and persistent volume claims..."
kubectl apply -f "${KUBE_DIR}/persistent-volume.yaml"
kubectl apply -f "${KUBE_DIR}/persistent-volume-claim.yaml"

# ---------------------------------------------------------------------------
# 3. Stateful data tier (postgres, redis) - must be ready before backend
# ---------------------------------------------------------------------------
log "Deploying PostgreSQL..."
kubectl apply -f "${KUBE_DIR}/postgres-deployment.yaml"
kubectl -n "${NAMESPACE}" rollout status statefulset/postgres --timeout="${TIMEOUT}"

log "Deploying Redis..."
kubectl apply -f "${KUBE_DIR}/redis-deployment.yaml"
kubectl -n "${NAMESPACE}" rollout status statefulset/redis --timeout="${TIMEOUT}"

# ---------------------------------------------------------------------------
# 4. Application tier
# ---------------------------------------------------------------------------
log "Deploying backend..."
kubectl apply -f "${KUBE_DIR}/backend-deployment.yaml"

log "Deploying frontend..."
kubectl apply -f "${KUBE_DIR}/frontend-deployment.yaml"

log "Applying services..."
kubectl apply -f "${KUBE_DIR}/service.yaml"

log "Applying ingress..."
kubectl apply -f "${KUBE_DIR}/ingress.yaml"

log "Applying autoscalers and pod disruption budgets..."
kubectl apply -f "${KUBE_DIR}/autoscaler.yaml"

log "Applying network policies..."
kubectl apply -f "${KUBE_DIR}/network-policy.yaml"

# ---------------------------------------------------------------------------
# 5. Wait for rollouts
# ---------------------------------------------------------------------------
log "Waiting for backend rollout..."
kubectl -n "${NAMESPACE}" rollout status deployment/backend-deployment --timeout="${TIMEOUT}"

log "Waiting for frontend rollout..."
kubectl -n "${NAMESPACE}" rollout status deployment/frontend-deployment --timeout="${TIMEOUT}"

# ---------------------------------------------------------------------------
# 6. Post-deploy verification
# ---------------------------------------------------------------------------
log "Deployment complete. Current pod status:"
kubectl -n "${NAMESPACE}" get pods -o wide

log "Running smoke test against backend /health endpoint..."
kubectl -n "${NAMESPACE}" run smoke-test --rm -i --restart=Never --image=curlimages/curl:8.9.1 -- \
  curl -sf http://backend-service:5000/health || die "Smoke test failed"

log "✅ Deployment to ${ENVIRONMENT} succeeded."
