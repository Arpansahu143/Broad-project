#!/usr/bin/env bash
# =============================================================================
# University MIS - Rollback Script
# Rolls a deployment back to its previous (or a specified) revision and
# waits for the rollback to complete. Use this immediately if a deploy
# introduces errors, elevated latency, or failed health checks.
#
# Usage:
#   ./scripts/rollback.sh backend                # roll back to previous revision
#   ./scripts/rollback.sh frontend                # roll back to previous revision
#   ./scripts/rollback.sh backend 3               # roll back to revision 3
# =============================================================================

set -euo pipefail

COMPONENT="${1:-}"
REVISION="${2:-}"
NAMESPACE="university-mis"
TIMEOUT="300s"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }
die() { echo "[ERROR] $*" >&2; exit 1; }

[[ -z "${COMPONENT}" ]] && die "Usage: $0 <backend|frontend> [revision]"
[[ "${COMPONENT}" != "backend" && "${COMPONENT}" != "frontend" ]] && \
  die "Component must be 'backend' or 'frontend'"

DEPLOYMENT="${COMPONENT}-deployment"

command -v kubectl >/dev/null 2>&1 || die "kubectl is not installed or not on PATH"

log "Rollout history for ${DEPLOYMENT}:"
kubectl -n "${NAMESPACE}" rollout history "deployment/${DEPLOYMENT}"

if [[ -n "${REVISION}" ]]; then
  log "Rolling back ${DEPLOYMENT} to revision ${REVISION}..."
  kubectl -n "${NAMESPACE}" rollout undo "deployment/${DEPLOYMENT}" --to-revision="${REVISION}"
else
  log "Rolling back ${DEPLOYMENT} to the previous revision..."
  kubectl -n "${NAMESPACE}" rollout undo "deployment/${DEPLOYMENT}"
fi

log "Waiting for rollback to complete..."
kubectl -n "${NAMESPACE}" rollout status "deployment/${DEPLOYMENT}" --timeout="${TIMEOUT}"

log "Verifying pod health post-rollback..."
kubectl -n "${NAMESPACE}" get pods -l component="${COMPONENT}" -o wide

log "Running smoke test..."
if [[ "${COMPONENT}" == "backend" ]]; then
  kubectl -n "${NAMESPACE}" run rollback-smoke-test --rm -i --restart=Never \
    --image=curlimages/curl:8.9.1 -- curl -sf http://backend-service:5000/health || \
    die "Smoke test failed after rollback — escalate immediately"
fi

log "✅ Rollback of ${DEPLOYMENT} complete."
