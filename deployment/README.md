# Hostinger VPS Production Deployment Guide

This directory contains the production automation scripts and configuration templates for hosting the full-stack Levix application on your Hostinger VPS.

---

## 1. Directory Structure on Hostinger VPS

```
/var/www/levix/
├── frontend/             # React 19 + TypeScript + Vite SPA
│   ├── dist/             # Compiled static bundles served directly by Nginx
│   └── .env              # Production Vite environment variables
├── backend/              # Node.js + Express + Prisma API
│   ├── dist/             # Compiled TypeScript server
│   ├── prisma/           # Schema & migrations
│   └── .env              # Production backend secrets (DB, Firebase, Razorpay)
└── deployment/
    ├── ecosystem.config.cjs # PM2 process management config
    ├── nginx.conf        # Nginx reverse proxy + SPA fallback
    └── scripts/          # build.sh, deploy.sh, backup-db.sh, health-check.sh
```

---

## 2. Initial Server Provisioning Steps (Hostinger VPS)

### 2.1 Install System Dependencies (Ubuntu 22.04 / 24.04 LTS)
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx postgresql postgresql-contrib certbot python3-certbot-nginx

# Install Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2
```

### 2.2 Configure PostgreSQL Database
```bash
sudo -u postgres psql

-- Within PostgreSQL shell:
CREATE DATABASE levix_prod;
CREATE USER levix_user WITH ENCRYPTED PASSWORD 'YOUR_SECURE_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE levix_prod TO levix_user;
\q
```

### 2.3 Clone & Setup Environment Files
```bash
sudo mkdir -p /var/www/levix
sudo chown -R $USER:$USER /var/www/levix
git clone <YOUR_GIT_REPO_URL> /var/www/levix

# Configure backend environment
cd /var/www/levix/backend
cp .env.example .env
nano .env   # Fill in DATABASE_URL, Firebase Admin credentials, Razorpay keys

# Configure frontend environment
cd /var/www/levix/frontend
cp .env.example .env
nano .env   # Fill in VITE_FIREBASE_* keys
```

### 2.4 Build Application & Run Production Migrations
```bash
cd /var/www/levix
bash deployment/scripts/build.sh

# Run database migrations and seed catalog
cd /var/www/levix/backend
npx prisma migrate deploy
npm run prisma:seed
```

### 2.5 Start Backend with PM2
```bash
sudo mkdir -p /var/log/levix
sudo chown -R $USER:$USER /var/log/levix

pm2 start /var/www/levix/deployment/ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

### 2.6 Configure Nginx & SSL
```bash
# Link Nginx configuration
sudo cp /var/www/levix/deployment/nginx.conf /etc/nginx/sites-available/levix.conf
sudo ln -s /etc/nginx/sites-available/levix.conf /etc/nginx/sites-enabled/

# Replace yourdomain.com with your actual domain in the conf
sudo sed -i 's/yourdomain.com/YOUR_ACTUAL_DOMAIN.com/g' /etc/nginx/sites-available/levix.conf

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx

# Issue free SSL via Certbot Let's Encrypt
sudo certbot --nginx -d YOUR_ACTUAL_DOMAIN.com -d www.YOUR_ACTUAL_DOMAIN.com
```

---

## 3. Ongoing Zero-Downtime Deployments

To deploy new code updates:
```bash
bash /var/www/levix/deployment/scripts/deploy.sh
```

---

## 4. Automated Database Backups (Cron Job)

Add daily automated backups via crontab:
```bash
crontab -e

# Run database backup every night at 2:00 AM
0 2 * * * /bin/bash /var/www/levix/deployment/scripts/backup-db.sh >> /var/log/levix/backup.log 2>&1
```
