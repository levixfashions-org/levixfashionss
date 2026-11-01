# Infrastructure & Environment Audit Report

**Generated Date**: 2026-11-01  
**Project**: Full-Stack Levix Recreation & Hostinger VPS Production Deployment  
**Status**: Preliminary Environment Discovery & Target Architecture Specification  

---

## 1. Local Workspace & Tooling Discovery

| Component | Detected Value | Notes |
| :--- | :--- | :--- |
| **Workspace Path** | `C:\Users\mohan\Downloads\levix Final pro` | Clean workspace designated for the full-stack recreation |
| **Operating System** | Windows 10/11 Home Single Language (Build 26100) | Local development and inspection environment |
| **Node.js Version** | `v22.21.0` | Node.js 22 LTS compatible with Vite 6 / React 19 / Express 4/5 |
| **Package Manager** | `npm v10.9.4` | Standard package manager available |
| **Git Version** | `2.56.0.windows.1` | Source control ready |
| **Installed Chrome** | `C:\Program Files\Google\Chrome\Application\chrome.exe` | Used for active CDP browser inspection suite |

---

## 2. Reference Website Architecture (Levix)

* **URL**: `https://levix.com/`
* **Platform**: Custom Shopify Plus Architecture
* **Primary Fonts**: `neue-haas-grotesk-display`, `neue-haas-grotesk-text`, `Anton`, `Assistant`
* **Color Palette**: 
  * Background: `#EFEFEF` (Chalk Off-White)
  * Surface / Cards: `#FFFFFF` and `#F5F5F5`
  * Typography: `#000000` (Deep Black), `#121212` (90% contrast)
  * Accent / Brand: `#FF5500` (Signal Orange), `#1E3A8A` (Deep Cobalt Blue)
* **Key Modules**:
  * Persistent Sticky Header with Dropdown Mega Menu & Ticker Banner
  * Drawer Navigation & Mobile Slide-Over Menu
  * Predictive Search Drawer with Instant Thumbnail Filtering
  * Slide-over Cart Drawer with Free Shipping Tiered Progress Indicator
  * Dynamic Collection Grid (2-column mobile, 3/4-column desktop, aspect ratio 3:4 / 2:3)
  * Product Detail Pages with Multi-Image Editorial Gallery, Size Pills, Accordion Details
  * Store Locator (`/pages/store`), Legal & Shipping Policy Pages

---

## 3. Hostinger VPS Target Infrastructure Specification

### 3.1 Operating System & Server Environment
* **Platform**: Hostinger VPS (KVM / Cloud VPS running Ubuntu 22.04 / 24.04 LTS or Debian 12)
* **Pre-deployment Verification Checklist**:
  * Check existing web server: Check whether Nginx, Apache, OpenLiteSpeed, or a control panel (e.g. CloudPanel, CyberPanel) is actively managing ports 80/443.
  * If panel-managed: Configure reverse proxy via the panel's vhost configuration rather than clobbering system Nginx.
  * If standalone Ubuntu/Debian: Use native Nginx reverse proxy.
* **Firewall Rules**:
  * Permit SSH (`Port 22` or custom SSH port).
  * Permit HTTP (`Port 80`).
  * Permit HTTPS (`Port 443`).
  * Deny public access to PostgreSQL (`5432`) and backend Express (`4000`) — both bound to `127.0.0.1` loopback only.

### 3.2 Database Configuration (PostgreSQL + Prisma)
* **Database Engine**: PostgreSQL (Installed locally on VPS).
* **Binding**: `127.0.0.1:5432` (strictly localhost, never exposed publicly).
* **Connection String Format**: `postgresql://DB_USER:DB_PASSWORD@127.0.0.1:5432/levix_prod?schema=public`
* **ORM**: Prisma ORM with idempotent migrations (`npx prisma migrate deploy`).
* **Security & Reliability**:
  * Passwords and database credentials stored only in production `.env` files.
  * Automated database backup script (`deployment/scripts/backup-db.sh`) using `pg_dump` with gzip compression and retention rotation.

### 3.3 Process Management (PM2)
* **Process Manager**: PM2 running in production mode.
* **Config File**: `deployment/ecosystem.config.cjs`
* **Features**:
  * Cluster / Fork mode with automatic restart on failure.
  * Memory limit threshold (`max_memory_restart: '500M'`).
  * Dedicated log files (`combined.log`, `err.log`) with logrotate.
  * PM2 systemd startup persistence (`pm2 startup` && `pm2 save`).

### 3.4 Web Server & Reverse Proxy (Nginx)
* **Ports**: 80 (Redirect to HTTPS) and 443 (SSL/TLS).
* **SSL Certificate**: Let's Encrypt automated via Certbot.
* **Routing Architecture**:
  * `https://YOUR_DOMAIN/` $\rightarrow$ Serves pre-built React SPA (`frontend/dist`) with `try_files $uri $uri/ /index.html;` for seamless client-side routing.
  * `https://YOUR_DOMAIN/api/` $\rightarrow$ Reverse proxied to `http://127.0.0.1:4000/api/` with preserved headers (`Host`, `X-Real-IP`, `X-Forwarded-For`, `Authorization`).
  * Strict security headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Content-Security-Policy`.
  * Deny access to hidden files (`.env`, `.git`).

### 3.5 External Integrations
* **Authentication**: Firebase Authentication (Client SDK) + Firebase Admin SDK (Server verification).
* **Payments**: Razorpay (Paise-level precision, webhook HMAC verification).
* **Asset Storage**: Cloudinary / S3-compatible Object Storage for customer and product imagery.

---

## 4. Next Steps in Execution Plan

1. Complete automated reference browser inspection suite and save visual artifacts.
2. Formulate `documentation/design-system.md` and `documentation/page-inventory.md`.
3. Scaffold and implement the React + TypeScript + Vite frontend.
4. Scaffold and implement the Express + TypeScript + Prisma backend.
5. Create PostgreSQL database schema, migrations, and seed data.
6. Build deployment configs and verification test suites.
