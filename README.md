# LEVIX | Luxury Streetwear Platform & Production Deployment

High-fidelity, production-ready full-stack luxury streetwear e-commerce platform for [thelevix.shop](https://thelevix.shop) built with React 19, TypeScript, Vite, Tailwind CSS, Node.js, Express, Prisma ORM, PostgreSQL, Firebase Authentication, and Razorpay Payments.

---

## 1. Project Architecture

```
levix Final pro/
├── frontend/             # React 19 + TypeScript + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── config/       # Firebase Web SDK config
│   │   ├── services/     # API client & authService
│   │   ├── context/      # AuthContext (Firebase ID Token & profile sync)
│   │   ├── store/        # Zustand cart, search & drawer store
│   │   ├── components/   # Header, AnnouncementBar, Footer, ProductCard, CartDrawer, SearchDrawer
│   │   ├── pages/        # Home, Collections, PDP, Cart, Checkout, Account, Orders, Stores, Admin
│   │   └── App.tsx       # Comprehensive SPA routing
├── backend/              # Node.js + Express + TypeScript API
│   ├── prisma/           # schema.prisma & seed.ts (PostgreSQL)
│   ├── src/
│   │   ├── config/       # db, env, firebase-admin, razorpay
│   │   ├── middleware/   # verifyFirebaseToken, errorHandler, rateLimiter
│   │   ├── controllers/  # products, collections, cart, orders, payments, admin
│   │   └── routes/       # Express route handlers
├── deployment/           # Hostinger VPS automation configs & scripts
│   ├── ecosystem.config.cjs # PM2 cluster manager
│   ├── nginx.conf        # Nginx reverse proxy, SPA fallback & SSL
│   └── scripts/          # build.sh, deploy.sh, backup-db.sh, health-check.sh
├── documentation/        # Full technical audit & specification documents
│   ├── INFRASTRUCTURE_AUDIT.md
│   ├── design-system.md
│   ├── page-inventory.md
│   ├── visual-qa-report.md
│   ├── PRODUCTION_CHECKLIST.md
│   ├── ROLLBACK.md
│   ├── HOSTINGER_DEPLOYMENT.md
│   └── SECURITY_CHECKLIST.md
└── inspector/            # Automated CDP browser inspection suite & captured screenshots
```

---

## 2. Key Features

- **Pixel-Accurate Streetwear Design**: Exact `#EFEFEF` chalk off-white canvas, `neue-haas-grotesk-display` / `Anton` typography, aspect ratio `3:4` editorial images, and secondary image crossfades on hover.
- **Firebase Authentication**: Client-side Firebase Web SDK with Google One-Tap + Email/Password registration, paired with server-side `firebase-admin` token verification.
- **Robust PostgreSQL Backend**: Prisma ORM schema with strict UUID primary keys, financial amounts in whole integer paise (preventing floating point errors), and atomic transactional stock deductions.
- **Slide-Over Cart & Search**: Right-sliding cart drawer with dynamic free-shipping progress indicator (threshold: Rs. 2,999), instant search with debounced thumbnail previews.
- **Razorpay Payments**: Complete checkout pipeline with server-side cryptographic HMAC signature verification and webhook idempotency.
- **Admin Dashboard**: Revenue metrics, order status manager (`PROCESSING`, `SHIPPED`, `DELIVERED`), catalog editor, and low-stock alerts.
- **Production Hostinger VPS Deployment**: PM2 cluster supervision, Nginx reverse proxy with SPA client-side route fallback, Let's Encrypt SSL, automated database backups, and health-check monitoring.

---

## 3. Quick Start (Development)

### Backend
```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Front-end will run on `http://localhost:5173` and proxy `/api` calls to `http://localhost:4000`.

---

## 4. Production Deployment to Hostinger VPS

Refer to [documentation/HOSTINGER_DEPLOYMENT.md](documentation/HOSTINGER_DEPLOYMENT.md) and [deployment/README.md](deployment/README.md) for step-by-step instructions.
