#!/usr/bin/env bash
# =============================================================================
# University MIS - Backup Script
# Takes a PostgreSQL logical backup (pg_dump), compresses it, and uploads it
# to S3 with a timestamped key. Intended to be run on a schedule (e.g. via
# a Kubernetes CronJob) or manually before risky maintenance.
#
# Required environment variables:
#   DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, S3_BACKUP_BUCKET
# =============================================================================

set -euo pipefail

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="${BACKUP_DIR:-/tmp/mis-backups}"
BACKUP_FILE="${BACKUP_DIR}/university-mis-${TIMESTAMP}.sql.gz"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }
die() { echo "[ERROR] $*" >&2; exit 1; }

: "${DB_HOST:?DB_HOST must be set}"
: "${DB_PORT:=5432}"
: "${DB_NAME:?DB_NAME must be set}"
: "${DB_USER:?DB_USER must be set}"
: "${DB_PASSWORD:?DB_PASSWORD must be set}"
: "${S3_BACKUP_BUCKET:?S3_BACKUP_BUCKET must be set}"

command -v pg_dump >/dev/null 2>&1 || die "pg_dump not found - install postgresql-client"
command -v aws >/dev/null 2>&1 || die "aws CLI not found"

mkdir -p "${BACKUP_DIR}"

log "Starting PostgreSQL backup of ${DB_NAME}@${DB_HOST}:${DB_PORT}..."
PGPASSWORD="${DB_PASSWORD}" pg_dump \
  --host="${DB_HOST}" \
  --port="${DB_PORT}" \
  --username="${DB_USER}" \
  --dbname="${DB_NAME}" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --verbose \
  | gzip > "${BACKUP_FILE}"

BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
log "Backup complete: ${BACKUP_FILE} (${BACKUP_SIZE})"

log "Uploading backup to s3://${S3_BACKUP_BUCKET}/postgres/..."
aws s3 cp "${BACKUP_FILE}" "s3://${S3_BACKUP_BUCKET}/postgres/$(basename "${BACKUP_FILE}")" \
  --sse aws:kms \
  --storage-class STANDARD_IA

log "Verifying upload..."
aws s3api head-object --bucket "${S3_BACKUP_BUCKET}" --key "postgres/$(basename "${BACKUP_FILE}")" >/dev/null \
  || die "Backup upload verification failed"

log "Cleaning up local backup files older than 1 day..."
find "${BACKUP_DIR}" -name "*.sql.gz" -mtime +1 -delete

log "Cleaning up S3 backups older than ${RETENTION_DAYS} days..."
CUTOFF_DATE=$(date -d "-${RETENTION_DAYS} days" +%Y-%m-%d 2>/dev/null || date -v-"${RETENTION_DAYS}"d +%Y-%m-%d)
aws s3api list-objects-v2 --bucket "${S3_BACKUP_BUCKET}" --prefix "postgres/" \
  --query "Contents[?LastModified<='${CUTOFF_DATE}'].Key" --output text | \
  tr '\t' '\n' | while read -r key; do
    [[ -n "${key}" ]] && aws s3 rm "s3://${S3_BACKUP_BUCKET}/${key}" && log "Deleted old backup: ${key}"
  done

log "✅ Backup completed successfully."
