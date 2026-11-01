# Hostinger VPS Architecture & Deployment Manual

**Domain Target**: Custom Owned Domain  
**Hosting**: Hostinger VPS (KVM Linux)  
**Database**: Localhost PostgreSQL on Hostinger VPS  
**Proxy & SSL**: Nginx Reverse Proxy with Let's Encrypt Certbot  
**Process Supervision**: PM2 Cluster  

---

## 1. Network Topology

```
[Public Internet / Client Browsers]
           │
           ▼
[DNS: @ & www -> Hostinger VPS Public IP]
           │
           ▼
[Hostinger Cloud Firewall & UFW]
(Permits Ports: 22/SSH, 80/HTTP, 443/HTTPS)
           │
           ▼
[Nginx Web Server :80 / :443]
  ├── /               ──> Serves compiled React SPA (/var/www/levix/frontend/dist)
  ├── /api/*          ──> Reverse Proxies to 127.0.0.1:4000 (Node/Express)
  └── /static/*       ──> Long-term cached immutable assets (CSS, JS, Fonts, Images)
           │
           ▼ (Loopback 127.0.0.1 only)
[PM2 Node.js Cluster :4000]
  ├── Express API Router
  ├── Firebase Admin SDK (Token verification)
  ├── Razorpay Gateway
  └── Prisma ORM Client
           │
           ▼ (Loopback 127.0.0.1:5432 only)
[PostgreSQL Database :5432]
  └── levix_prod (User, Product, Order, Cart, Address, Payment)
```

---

## 2. DNS Record Preparation

Ensure the following records exist in your DNS manager (e.g. Hostinger DNS, Cloudflare, GoDaddy):

| Record Type | Host / Name | Target Value | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` (root) | `YOUR_HOSTINGER_VPS_IP` | 300 / Auto |
| **A** | `www` | `YOUR_HOSTINGER_VPS_IP` | 300 / Auto |

*Note: Do not delete or modify existing MX, TXT (SPF/DKIM) records if your email is connected to the domain.*

---

## 3. Firebase Console Configuration

In your Firebase Console:
1. Navigate to **Authentication** > **Settings** > **Authorized Domains**.
2. Add your custom domain (both `yourdomain.com` and `www.yourdomain.com`).
3. Enable **Email/Password** and **Google** sign-in providers.
4. Navigate to **Project Settings** > **Service accounts** and click **Generate new private key** to obtain your Firebase Admin SDK credentials for `backend/.env`.

---

## 4. Razorpay Webhook Configuration

In your Razorpay Dashboard:
1. Navigate to **Settings** > **Webhooks**.
2. Add Webhook URL: `https://YOUR_DOMAIN/api/payments/webhook`.
3. Select Active Events:
   - `payment.captured`
   - `payment.failed`
4. Copy the generated Webhook Secret into `RAZORPAY_WEBHOOK_SECRET` in `backend/.env`.
