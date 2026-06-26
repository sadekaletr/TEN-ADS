#!/usr/bin/env bash
# Backup PostgreSQL database for TENEGTA Spark
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL is required}"

STAMP=$(date +%Y%m%d_%H%M%S)
OUT_DIR="${1:-./backups}"
mkdir -p "$OUT_DIR"
FILE="$OUT_DIR/tenegta_spark_$STAMP.sql.gz"

echo "Backing up to $FILE"
pg_dump "$DATABASE_URL" | gzip > "$FILE"
echo "Done. Size: $(du -h "$FILE" | cut -f1)"
