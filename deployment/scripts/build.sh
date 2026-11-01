#!/usr/bin/env bash
set -e

echo "=========================================="
echo "LEVIX PRODUCTION BUILD PIPELINE"
echo "=========================================="

APP_ROOT="/var/www/levix"
cd "$APP_ROOT"

echo "1. Installing and building backend..."
cd "$APP_ROOT/backend"
npm ci --omit=dev
npx prisma generate
npm run build

echo "2. Installing and building frontend..."
cd "$APP_ROOT/frontend"
npm ci
npm run build

echo "✓ Build finished successfully. Frontend dist generated at $APP_ROOT/frontend/dist"
