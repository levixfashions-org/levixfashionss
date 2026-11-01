#!/usr/bin/env bash
set -e

echo "=========================================="
echo "LEVIX ZERO-DOWNTIME DEPLOYMENT"
echo "=========================================="

APP_ROOT="/var/www/levix"
SCRIPTS_DIR="$APP_ROOT/deployment/scripts"

# 1. Pre-Deployment Database Backup
echo "Step 1: Creating safety database backup..."
bash "$SCRIPTS_DIR/backup-db.sh"

# 2. Git Fetch & Pull
echo "Step 2: Pulling latest changes from repository..."
cd "$APP_ROOT"
git pull origin main

# 3. Build Frontend & Backend
echo "Step 3: Building production bundles..."
bash "$SCRIPTS_DIR/build.sh"

# 4. Production Database Migrations
echo "Step 4: Applying safe Prisma production migrations..."
cd "$APP_ROOT/backend"
npx prisma migrate deploy

# 5. Reload Backend Process via PM2
echo "Step 5: Gracefully reloading PM2 cluster..."
pm2 reload "$APP_ROOT/deployment/ecosystem.config.cjs" --update-env

# 6. Verify Health Endpoint
echo "Step 6: Running post-deployment health verification..."
bash "$SCRIPTS_DIR/health-check.sh"

echo "=========================================="
echo "✓ DEPLOYMENT COMPLETED AND VERIFIED!"
echo "=========================================="
