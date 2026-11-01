# Emergency Rollback Procedures

This document provides clear, deterministic instructions to revert the production environment in the event of an unexpected incident or build failure on the Hostinger VPS.

---

## 1. Quick Revert Scenarios

### Scenario A: Frontend Build Regression
If a new frontend build has layout or client-side JavaScript issues:
```bash
# Revert frontend dist to the previous release
cd /var/www/levix/frontend
git checkout HEAD~1 dist/
sudo systemctl reload nginx
```

### Scenario B: Backend Process Crash or API Regression
If the Node.js backend fails health checks after deployment:
```bash
# 1. Revert to previous Git commit
cd /var/www/levix
git checkout HEAD~1

# 2. Rebuild backend
cd backend
npm run build

# 3. Reload PM2
pm2 reload /var/www/levix/deployment/ecosystem.config.cjs

# 4. Verify health
bash /var/www/levix/deployment/scripts/health-check.sh
```

---

## 2. PostgreSQL Disaster Recovery & Database Restore

In the event of corrupted database state or accidental deletion:

```bash
# 1. Locate the latest safety backup
ls -lht /var/backups/levix/postgres/

# 2. Drop current active connections
sudo -u postgres psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'levix_prod' AND pid <> pg_backend_pid();"

# 3. Restore the gzipped SQL snapshot
gunzip -c /var/backups/levix/postgres/levix_db_LATEST_SNAPSHOT.sql.gz | sudo -u postgres psql levix_prod

# 4. Verify table row counts
sudo -u postgres psql -d levix_prod -c "SELECT 'User' as table_name, count(*) from \"User\" UNION SELECT 'Product', count(*) from \"Product\" UNION SELECT 'Order', count(*) from \"Order\";"
```

---

## 3. Web Server & SSL Recovery

If Nginx fails to restart:
```bash
# Check syntax
sudo nginx -t

# Check Nginx error logs
sudo tail -n 50 /var/log/nginx/error.log

# Restore backup default config if necessary
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
sudo systemctl restart nginx
```
