# Hostinger VPS Production Readiness Checklist

**Project**: Full-Stack Levix Recreation  
**Target Environment**: Hostinger VPS (PostgreSQL + Node/Express + React + Nginx + PM2 + Firebase Auth + Razorpay)  

---

## 1. Pre-Deployment Infrastructure Verification

- [ ] **VPS Access**: Tested secure SSH connection using SSH key (not root password).
- [ ] **Port Audit**: Confirmed ports `80` (HTTP), `443` (HTTPS), and custom SSH port are allowed in Hostinger Cloud Firewall and OS `ufw`.
- [ ] **PostgreSQL Binding**: Confirmed PostgreSQL is strictly bound to `127.0.0.1:5432` and never exposed on the public IP.
- [ ] **Node.js LTS**: Verified `node -v` is `v20.x` or `v22.x` LTS.
- [ ] **Disk & Memory Resources**: Confirmed at least 15GB free disk space and 2GB+ available RAM.

---

## 2. Secrets & Environment Configuration

- [ ] **Backend `.env`**:
  - `NODE_ENV=production`
  - `PORT=4000`
  - `DATABASE_URL` configured with strong random password for `levix_user`.
  - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` populated.
  - `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` populated (test mode validated first).
  - `RAZORPAY_WEBHOOK_SECRET` populated for signature verification.
- [ ] **Frontend `.env`**:
  - `VITE_API_BASE_URL=/api`
  - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc. populated.
  - Confirmed NO backend secrets or database passwords are leaked into `VITE_` variables.

---

## 3. Database & Migrations

- [ ] **Safe Migrations**: Ran `npx prisma migrate deploy` (NEVER run `prisma migrate reset` in production).
- [ ] **Catalog Seeding**: Verified `npm run prisma:seed` ran successfully and loaded 5 core products with variants.
- [ ] **Automated Backup**: Tested `backup-db.sh` manually and scheduled cron job at 2:00 AM daily.
- [ ] **Paise-Level Financial Amounts**: Verified all prices in DB are integer paise to eliminate floating point issues.

---

## 4. Frontend & Nginx

- [ ] **SPA Route Refresh**: Verified direct browser visits to `/collections/levix-x-godzilla`, `/products/cherry-blossom-polo-t-shirt`, `/account`, and `/checkout` load properly without 404s (`try_files $uri $uri/ /index.html;`).
- [ ] **SSL / TLS**: Verified A+ SSL rating via Let's Encrypt Certbot with automatic HTTPS redirection.
- [ ] **Security Headers**: Confirmed `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, and `Content-Security-Policy`.
- [ ] **Gzip Compression**: Verified text, CSS, and JS assets are served with gzip compression.

---

## 5. End-to-End E-Commerce Functional Testing

- [ ] **Firebase Authentication**:
  - Tested client registration with email/password.
  - Tested Google Sign-In popup.
  - Verified backend extracted Bearer token and created user row in PostgreSQL.
- [ ] **Cart & Free Shipping**:
  - Added products to cart.
  - Verified dynamic free shipping progress bar updates as total crosses `RS. 2,999`.
- [ ] **Razorpay Checkout Flow**:
  - Entered shipping address and launched Razorpay checkout modal.
  - Verified order created in DB with status `PENDING`.
  - Verified payment signature validated with HMAC SHA-256 and order transitioned to `PAID`.
  - Verified variant inventory decremented atomically.
- [ ] **Admin Dashboard**:
  - Logged in with admin credentials.
  - Verified revenue metrics, order statuses, and low stock inventory alerts.
