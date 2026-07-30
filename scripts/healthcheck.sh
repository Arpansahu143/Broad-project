#!/usr/bin/env bash
# =============================================================================
# University MIS - Health Check Script
# Verifies that all tiers of the application are healthy: Kubernetes pod
# readiness, backend API, frontend, database connectivity, and cache
# connectivity. Exits non-zero if any check fails — suitable for CI gates,
# cron-based synthetic monitoring, or manual post-deploy verification.
#
# Usage:
#   ./scripts/healthcheck.sh
# =============================================================================

set -uo pipefail  # note: not -e, so all checks run and are reported together

NAMESPACE="university-mis"
FRONTEND_URL="${FRONTEND_URL:-https://mis.university.edu}"
BACKEND_URL="${BACKEND_URL:-https://api.mis.university.edu}"
FAILURES=0

log()  { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }
pass() { echo "  ✅ $*"; }
fail() { echo "  ❌ $*"; FAILURES=$((FAILURES + 1)); }

echo "============================================================"
echo " University MIS - Health Check Report"
echo "============================================================"

# ---------------------------------------------------------------------------
# 1. Kubernetes pod readiness
# ---------------------------------------------------------------------------
log "Checking Kubernetes pod readiness in namespace '${NAMESPACE}'..."
if command -v kubectl >/dev/null 2>&1; then
  NOT_READY=$(kubectl -n "${NAMESPACE}" get pods --no-headers 2>/dev/null | \
    awk '{split($2,a,"/"); if (a[1]!=a[2] || $3!="Running") print $1}')
  if [[ -z "${NOT_READY}" ]]; then
    pass "All pods in ${NAMESPACE} are Running and Ready"
  else
    fail "Pods not ready: ${NOT_READY}"
  fi
else
  fail "kubectl not found - skipping pod readiness check"
fi

# ---------------------------------------------------------------------------
# 2. Backend API health endpoint
# ---------------------------------------------------------------------------
log "Checking backend API health endpoint..."
if curl -sf --max-time 10 "${BACKEND_URL}/health" > /tmp/backend_health.json 2>/dev/null; then
  pass "Backend /health responded successfully (${BACKEND_URL}/health)"
else
  fail "Backend /health endpoint did not respond (${BACKEND_URL}/health)"
fi

# ---------------------------------------------------------------------------
# 3. Backend readiness (DB + cache reachability, as reported by the app)
# ---------------------------------------------------------------------------
log "Checking backend readiness endpoint (verifies DB + Redis connectivity)..."
if curl -sf --max-time 10 "${BACKEND_URL}/health/ready" > /tmp/backend_ready.json 2>/dev/null; then
  pass "Backend reports database and cache connections healthy"
else
  fail "Backend readiness check failed - database or cache may be unreachable"
fi

# ---------------------------------------------------------------------------
# 4. Frontend availability
# ---------------------------------------------------------------------------
log "Checking frontend availability..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "${FRONTEND_URL}" 2>/dev/null || echo "000")
if [[ "${FRONTEND_STATUS}" == "200" ]]; then
  pass "Frontend responded with HTTP 200 (${FRONTEND_URL})"
else
  fail "Frontend responded with HTTP ${FRONTEND_STATUS} (${FRONTEND_URL})"
fi

# ---------------------------------------------------------------------------
# 5. Database connectivity (direct, if run from within the cluster/VPC)
# ---------------------------------------------------------------------------
if command -v kubectl >/dev/null 2>&1; then
  log "Checking PostgreSQL readiness via in-cluster probe..."
  if kubectl -n "${NAMESPACE}" exec statefulset/postgres -- pg_isready -U "${DB_USER:-mis_admin}" >/dev/null 2>&1; then
    pass "PostgreSQL is accepting connections"
  else
    fail "PostgreSQL is not accepting connections"
  fi

  log "Checking Redis readiness via in-cluster probe..."
  if kubectl -n "${NAMESPACE}" exec statefulset/redis -- redis-cli ping 2>/dev/null | grep -q PONG; then
    pass "Redis responded to PING"
  else
    fail "Redis did not respond to PING"
  fi
fi

# ---------------------------------------------------------------------------
# 6. Certificate expiry check
# ---------------------------------------------------------------------------
log "Checking TLS certificate expiry for ${FRONTEND_URL}..."
CERT_HOST=$(echo "${FRONTEND_URL}" | sed -E 's~https?://~~; s~/.*~~')
EXPIRY=$(echo | openssl s_client -servername "${CERT_HOST}" -connect "${CERT_HOST}:443" 2>/dev/null | \
  openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
if [[ -n "${EXPIRY}" ]]; then
  pass "TLS certificate valid until: ${EXPIRY}"
else
  fail "Could not retrieve TLS certificate expiry for ${CERT_HOST}"
fi

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
echo "============================================================"
if [[ "${FAILURES}" -eq 0 ]]; then
  echo " ✅ All health checks passed."
  exit 0
else
  echo " ❌ ${FAILURES} health check(s) failed. Investigate before proceeding."
  exit 1
fi
