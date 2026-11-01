# Visual QA & Reverse Engineering Report

**Target**: [https://levix.com/](https://levix.com/)  
**Date**: 2026-11-01  
**Inspection Instrument**: Headless Chrome Automation via Chrome DevTools Protocol (`puppeteer-core`)  

---

## 1. Automated Inspection Execution Summary

| Inspection Target | Viewport / Mode | Artifact Saved | Observations & Key Findings |
| :--- | :--- | :--- | :--- |
| **Homepage Desktop** | 1440x900 (Above Fold) | `01_homepage_desktop_above_fold.png` | Stark `#EFEFEF` background, centered bold minimalist logo, uppercase editorial nav links (`New in`, `Collections`, `Caps`), clean search & cart triggers. |
| **Homepage Fullpage** | 1440x900 (Fullpage Scroll) | `01_homepage_desktop_fullpage.png` | High-impact full-bleed banner slider, multi-grid category features, lookbook editorial sections, newsletter footer with payment method badges. |
| **Homepage Mobile** | 390x844 (iPhone 14) | `02_homepage_mobile_above_fold.png` | Responsive header with compact logo, left hamburger menu, right search and cart bag icons. |
| **Homepage Mobile Fullpage** | 390x844 (Fullpage Scroll) | `02_homepage_mobile_fullpage.png` | 2-column compact product card grid, single-column full-width banner stacks, optimized touch-friendly touch targets. |
| **Collection Page** | 1440x900 (Desktop) | `04_collection_desktop_fullpage.png` | Clean grid layout for "LEVIX X GODZILLA", product cards with clean title and price formatting (`RS. 5,500`), subtle border dividers. |
| **PDP 1 (Cherry Blossom Polo)** | 1440x900 & 390x844 | `05_pdp_1_cherry-blossom-polo-t-shirt_desktop.png` | Vertical image gallery on left, sticky buy-box on right, size selector pills, add to cart button. |
| **PDP 2 (Black Ragnarok Tee)** | 1440x900 | `05_pdp_2_black-ragnarok-t-shirt_desktop.png` | High-density graphic tee presentation, oversized streetwear fit notes, accordion details. |
| **PDP 3 (Thunderstruck Hoodie)**| 1440x900 | `05_pdp_3_thunderstruck-hoodie_desktop.png` | Heavyweight fleece details, size availability, price in INR. |
| **PDP 4 (Mothra Rising Tee)** | 1440x900 | `05_pdp_4_mothra-rising-t-shirt_desktop.png` | Collaboration badge styling, licensed graphic details. |
| **PDP 5 (Black Ripstop Cargos)**| 1440x900 | `05_pdp_5_black-ripstop-cargos_desktop.png` | Tactical cargo bottom details, waist sizing pills (`30`, `32`, `34`, `36`), technical specs. |

---

## 2. Visual Fidelity & Measurement Checklist

1. **Colors**:
   - Canvas: Exact hex `#EFEFEF` matches original `rgb(239, 239, 239)`.
   - Typography: Exact `#000000` and secondary `rgba(18, 18, 18, 0.75)`.
   - Brand Accent: Levix `#FF5400` signal orange for collaboration banners and key alerts.
2. **Typography**:
   - Headings styled with high-impact uppercase tracking (`neue-haas-grotesk-display`, `Anton`, `Inter`).
   - Body copy set with legible grotesque sans-serif (`Assistant`, `Inter`).
3. **Layout & Grids**:
   - Desktop catalog uses a 4-column responsive grid with aspect ratio `3:4` images.
   - Mobile catalog uses a 2-column grid with generous vertical rhythm (`gap-y-6`).
4. **Interactive States**:
   - Primary buttons: Full-bleed solid black with white uppercase typography and slight active scaling.
   - Size Pills: Bordered rectangular pills with active selection fill and dashed line-through disabled states for sold-out inventory.
   - Drawers: Smooth ease-in-out slide-over animations for cart and search.

---

## 3. Deep Mobile Reverse Engineering & Parity Audit

A dedicated mobile browser inspection session was conducted against `https://levix.com/` using an iPhone 14 viewport (`390 x 844`, deviceScaleFactor 3, touch enabled) via Chrome DevTools Protocol to measure exact mobile dimensions, computed styles, and section ordering.

### 3.1 Measured Mobile Computed Styles
* **Mobile Header**: Exact computed height `58.5px`, seamless background `rgb(239, 239, 239)` (`#EFEFEF`), borderless.
  * Left: 24px Hamburger drawer button with clean touch target.
  * Center: Bold uppercase `LEVIX` logo centered with zero collision.
  * Right: Search icon, Wishlist (`Heart`) icon, and Cart Bag icon with live item count pill.
* **Mobile Drawer Navigation**:
  * Top: Quick search input (`SEARCH CATALOG...`).
  * Drop Capsules: `New Arrivals`, `Levix X Godzilla` with exclusive orange badge, `Winter Collection 2025`, `Levix Racing Club`, `Basics`, `Icons Archive`.
  * Collapsible Accordions: `Apparel Categories` (T-Shirts, Polos, Hoodies, Cargos, Denim) and `Accessories & Leather` (Bags, Caps, iPhone Cases).
  * Client Care: Flagship Stores Directory, Our Story & Manifesto, Order Support, Returns & Exchanges Portal, Members Login.
* **Mobile Homepage Section Inventory (1-to-1 Match with Live Reference)**:
  1. **Hero Campaign Banner**: Height `72vh` (`~608px` on mobile), authentic high-res campaign image (`wedcwa.jpg`), centered `Shop now` button.
  2. **Featured Collection ("Latest drop")**: 2-column mobile grid (`gap-2.5`), 3:4 image aspect ratio, dual-image crossfade, clean pricing.
  3. **Bags & Leather ("Levix Bags")**: 2-column mobile grid with luxury leather accessories.
  4. **Discover Collection Gallery**: Horizontal scrollable capsule tabs on mobile (`scrollbar-none`) with dynamic campaign banner updates.
  5. **Winter Collection 2025 Drop**: 2-column mobile grid showcasing heavyweight French terry hoodies and zip jackets.
  6. **iPhone Streetwear Cases**: 2-column mobile grid featuring limited graphic cases.
  7. **Stores across India**: Horizontal snap swipe on mobile (`snap-x snap-mandatory min-w-[280px] w-[80vw]`) with direct tap-to-directions Google Maps links and click-to-call phone links.
  8. **Atelier Archives & FAQs Accordions**: Collapsible brand story and SEO information blocks.
* **Mobile Product Detail Page (PDP)**:
  * Swipeable horizontal image carousel with snap scroll (`snap-x snap-mandatory`) and floating image position counter (e.g. `1 / 4`).
  * Finger-friendly size selector pills with large touch targets (`min-h-[44px]`).
  * **Sticky Bottom CTA Bar**: Fixed bottom bar on mobile (`fixed bottom-0 inset-x-0 z-30 lg:hidden bg-white/95 backdrop-blur-md`) showing product price, selected size, and instant `Add to Bag` button so mobile users never lose purchasing context.
* **Validation Results**:
  * Automated headless mobile flow test: **0 console errors** across Homepage, Mobile Drawer, Collection detail, PDP, and Cart.

