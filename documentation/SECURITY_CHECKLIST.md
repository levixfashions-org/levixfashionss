# Production Security & Hardening Checklist

**Target**: Full-Stack Levix Recreation & Hostinger VPS  

---

## 1. Network & Port Hardening
- [x] **PostgreSQL**: Bound strictly to `127.0.0.1:5432`. No public network interfaces listen on PostgreSQL.
- [x] **Express Backend**: Listening only on loopback or behind Nginx on port `4000`. Direct access to port 4000 is blocked by the public firewall.
- [x] **Public Ingress**: Only Ports `80` (HTTP), `443` (HTTPS), and custom SSH are permitted.
- [x] **SSH**: Root password login disabled; SSH key-based authentication enforced.

---

## 2. Authentication & Authorization
- [x] **Firebase Admin Token Verification**: All protected backend endpoints verify the Bearer token via `admin.auth().verifyIdToken()`.
- [x] **No Client-Trusted IDs**: Client requests never dictate user identity; the verified Firebase UID is extracted exclusively from the decoded cryptographic token.
- [x] **Admin Authorization**: Administrative endpoints (`/api/admin/*`) require server-verified `Role.ADMIN` claims.
- [x] **No Password Storage**: Zero customer passwords exist in PostgreSQL; all credential security is delegated to Google Firebase Authentication.

---

## 3. Financial Integrity & Payments
- [x] **Integer Paise Precision**: All currency values (`basePrice`, `subtotalPaise`, `totalPaise`) are stored as whole integers in paise (`1 INR = 100 paise`), preventing binary floating-point rounding errors.
- [x] **Cryptographic Signature Verification**: Orders are never transitioned to `PAID` based on client callbacks alone; HMAC SHA-256 signatures from Razorpay are verified on the backend.
- [x] **Atomic Inventory Deduction**: Variant stock deductions occur within transactional database locks to prevent race conditions or double-spending.

---

## 4. API & Application Defenses
- [x] **Helmet**: Enforces secure HTTP headers (`X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`).
- [x] **Rate Limiting**: Rate limiting configured for auth routes (30/15min) and checkout routes (20/10min) to mitigate brute-force and DDoS attempts.
- [x] **Input Validation**: Centralized request validation via Zod schemas for all mutations.
- [x] **Error Masking**: Internal server errors and database stack traces are suppressed in production mode to avoid reconnaissance leakage.
- [x] **Dotfile Shielding**: Nginx blocks public requests matching `/\.` (e.g. `.env`, `.git`).
