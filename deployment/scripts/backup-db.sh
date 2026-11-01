#!/usr/bin/env bash
set -e

BACKUP_DIR="/var/backups/levix/postgres"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/levix_db_$TIMESTAMP.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "Backing up PostgreSQL database to $BACKUP_FILE..."

# Parse credentials or use default local socket / connection
if [ -z "$DATABASE_URL" ]; then
  # Load from backend .env if present
  if [ -f "/var/www/levix/backend/.env" ]; then
    export $(grep -v '^#' /var/www/levix/backend/.env | xargs)
  fi
fi

if [ -n "$DATABASE_URL" ]; then
  pg_dump "$DATABASE_URL" | gzip > "$BACKUP_FILE"
else
  pg_dump -U postgres levix_prod | gzip > "$BACKUP_FILE"
fi

echo "✓ Database backup created successfully: $(du -h "$BACKUP_FILE" | cut -f1)"

# Keep 14 days of historical backups and purge older snapshots
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +14 -delete
echo "✓ Old backup rotation completed (retaining past 14 days)."
