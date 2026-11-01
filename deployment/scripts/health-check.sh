#!/usr/bin/env bash
set -e

HEALTH_URL="http://127.0.0.1:4000/api/health"
echo "Probing backend health endpoint at $HEALTH_URL..."

HTTP_RESPONSE=$(curl -s -o /tmp/health_response.json -w "%{http_code}" "$HEALTH_URL" || echo "000")

if [ "$HTTP_RESPONSE" -eq 200 ]; then
  echo "✓ Health check succeeded! Response:"
  cat /tmp/health_response.json
  echo ""
  exit 0
else
  echo "✗ Health check failed with HTTP status: $HTTP_RESPONSE"
  if [ -f /tmp/health_response.json ]; then
    cat /tmp/health_response.json
  fi
  exit 1
fi
