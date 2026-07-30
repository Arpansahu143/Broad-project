#!/usr/bin/env bash
# =============================================================================
# University MIS - Restore Script
# Downloads a PostgreSQL backup from S3 and restores it into the target
# database. DESTRUCTIVE — always confirm the target before running.
#
# Required environment variables:
#   DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, S3_BACKUP_BUCKET
#
# Usage:
#   ./scripts/restore.sh <backup-file-name>          # restore a specific backup
#   ./scripts/restore.sh --latest                     # restore the most recent backup
# =============================================================================

set -euo pipefail

RESTORE_DIR="${RESTORE_DIR:-/tmp/mis-restore}"
TARGET="${1:-}"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }
die() { echo "[ERROR] $*" >&2; exit 1; }

: "${DB_HOST:?DB_HOST must be set}"
: "${DB_PORT:=5432}"
: "${DB_NAME:?DB_NAME must be set}"
: "${DB_USER:?DB_USER must be set}"
: "${DB_PASSWORD:?DB_PASSWORD must be set}"
: "${S3_BACKUP_BUCKET:?S3_BACKUP_BUCKET must be set}"

[[ -z "${TARGET}" ]] && die "Usage: $0 <backup-file-name>|--latest"

command -v pg_restore >/dev/null 2>&1 || die "pg_restore not found - install postgresql-client"
command -v aws >/dev/null 2>&1 || die "aws CLI not found"

mkdir -p "${RESTORE_DIR}"

if [[ "${TARGET}" == "--latest" ]]; then
  log "Locating the most recent backup in s3://${S3_BACKUP_BUCKET}/postgres/..."
  TARGET=$(aws s3api list-objects-v2 --bucket "${S3_BACKUP_BUCKET}" --prefix "postgres/" \
    --query "sort_by(Contents, &LastModified)[-1].Key" --output text)
  [[ -z "${TARGET}" || "${TARGET}" == "None" ]] && die "No backups found in S3"
  TARGET=$(basename "${TARGET}")
fi

LOCAL_FILE="${RESTORE_DIR}/${TARGET}"

log "Downloading s3://${S3_BACKUP_BUCKET}/postgres/${TARGET}..."
aws s3 cp "s3://${S3_BACKUP_BUCKET}/postgres/${TARGET}" "${LOCAL_FILE}" || die "Download failed"

# -----------------------------------------------------------------------
# Safety confirmation before a destructive restore
# -----------------------------------------------------------------------
echo ""
echo "⚠️  WARNING: This will restore '${TARGET}' into database '${DB_NAME}' on ${DB_HOST}."
echo "⚠️  Existing data in that database may be overwritten."
read -r -p "Type the database name (${DB_NAME}) to confirm and proceed: " CONFIRM
[[ "${CONFIRM}" != "${DB_NAME}" ]] && die "Confirmation did not match. Aborting restore."

log "Decompressing backup..."
gunzip -k "${LOCAL_FILE}"
SQL_FILE="${LOCAL_FILE%.gz}"

log "Restoring into ${DB_NAME}@${DB_HOST}:${DB_PORT}..."
PGPASSWORD="${DB_PASSWORD}" pg_restore \
  --host="${DB_HOST}" \
  --port="${DB_PORT}" \
  --username="${DB_USER}" \
  --dbname="${DB_NAME}" \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --verbose \
  "${SQL_FILE}"

log "Cleaning up local restore files..."
rm -f "${LOCAL_FILE}" "${SQL_FILE}"

log "✅ Restore of ${TARGET} into ${DB_NAME} completed successfully."
log "Recommend running application smoke tests now: ./scripts/healthcheck.sh"
