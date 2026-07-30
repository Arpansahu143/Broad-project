#!/usr/bin/env bash
# =============================================================================
# University MIS - Cleanup Script
# Removes stale Docker images/build cache, completed/failed Kubernetes jobs
# and pods, and old ReplicaSets to keep the cluster and CI runners tidy.
# Safe to run on a schedule (e.g. weekly via cron or a CronJob).
#
# Usage:
#   ./scripts/cleanup.sh            # clean both Docker and Kubernetes
#   ./scripts/cleanup.sh docker     # Docker only
#   ./scripts/cleanup.sh k8s        # Kubernetes only
# =============================================================================

set -euo pipefail

TARGET="${1:-all}"
NAMESPACE="university-mis"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

clean_docker() {
  command -v docker >/dev/null 2>&1 || { log "Docker not found, skipping."; return 0; }

  log "Removing dangling Docker images..."
  docker image prune -f

  log "Removing unused Docker images older than 72h..."
  docker image prune -a -f --filter "until=72h"

  log "Removing stopped containers..."
  docker container prune -f

  log "Removing unused Docker volumes (excluding named data volumes)..."
  docker volume prune -f

  log "Removing build cache older than 7 days..."
  docker builder prune -f --filter "until=168h"

  log "Docker cleanup complete. Current disk usage:"
  docker system df
}

clean_kubernetes() {
  command -v kubectl >/dev/null 2>&1 || { log "kubectl not found, skipping."; return 0; }

  log "Removing completed Jobs older than 24h in ${NAMESPACE}..."
  kubectl -n "${NAMESPACE}" get jobs -o json | \
    jq -r --arg cutoff "$(date -u -d '-24 hours' +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v-24H +%Y-%m-%dT%H:%M:%SZ)" \
    '.items[] | select(.status.completionTime != null and .status.completionTime < $cutoff) | .metadata.name' | \
    xargs -r -n1 kubectl -n "${NAMESPACE}" delete job

  log "Removing failed Pods in ${NAMESPACE}..."
  kubectl -n "${NAMESPACE}" delete pods --field-selector=status.phase=Failed --ignore-not-found

  log "Removing evicted Pods in ${NAMESPACE}..."
  kubectl -n "${NAMESPACE}" get pods -o json | \
    jq -r '.items[] | select(.status.reason == "Evicted") | .metadata.name' | \
    xargs -r -n1 kubectl -n "${NAMESPACE}" delete pod

  log "Scaling down old ReplicaSets with zero desired replicas (rollout history is preserved separately)..."
  kubectl -n "${NAMESPACE}" get rs -o json | \
    jq -r '.items[] | select(.spec.replicas == 0 and .status.replicas == 0) | .metadata.name' | \
    xargs -r -n1 kubectl -n "${NAMESPACE}" delete rs

  log "Kubernetes cleanup complete. Current pod status:"
  kubectl -n "${NAMESPACE}" get pods
}

case "${TARGET}" in
  docker) clean_docker ;;
  k8s) clean_kubernetes ;;
  all)
    clean_docker
    clean_kubernetes
    ;;
  *)
    echo "Usage: $0 [docker|k8s|all]" >&2
    exit 1
    ;;
esac

log "✅ Cleanup finished."
