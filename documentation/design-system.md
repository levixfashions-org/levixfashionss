# Levix Recreated Design System Specification

**Reference Website**: [https://levix.com/](https://levix.com/)  
**Extraction Method**: Automated Chrome DevTools Protocol & Computed CSS Style Extraction  
**Framework Target**: Tailwind CSS v3 / Custom CSS + React 19 + TypeScript  

---

## 1. Color Palette

Levix uses a stark, high-contrast, editorial streetwear color palette defined by an off-white canvas, deep ink blacks, and calculated energetic accent pops.

```css
:root {
  /* Canvas & Backgrounds */
  --color-canvas: #EFEFEF;            /* Exact body background: rgb(239, 239, 239) */
  --color-canvas-pure: #FFFFFF;       /* Pure white card / modal backgrounds */
  --color-canvas-alt: #E8E8E8;        /* Subtle secondary section background */
  
  /* Typography & Foreground */
  --color-text-primary: #000000;      /* Deep black for titles, headings, and CTA */
  --color-text-secondary: rgba(18, 18, 18, 0.75); /* Subdued metadata, descriptions, prices */
  --color-text-muted: #737373;        /* Inactive states, breadcrumbs, placeholder */
  
  /* Brand Signatures */
  --color-brand-orange: #FF5400;      /* Signature Levix electric orange accent */
  --color-brand-blue: #183B7E;        /* Deep cobalt contrast blue */
  
  /* UI Borders & Dividers */
  --color-border-subtle: #E5E5E5;     /* Clean separation lines */
  --color-border-medium: #CCCCCC;     /* Form inputs, size pills */
  --color-border-dark: #171717;       /* High-contrast borders */
  
  /* Badges & System Feedback */
  --color-badge-sale-bg: #000000;
  --color-badge-sale-text: #FFFFFF;
  --color-badge-collab-bg: #FF5400;
  --color-badge-collab-text: #FFFFFF;
  --color-success: #15803D;
  --color-error: #DC2626;
}
```

---

## 2. Typography Hierarchy

Levix pairs a bold, industrial display font with a clean, highly legible grotesk sans-serif.

### 2.1 Font Families
* **Display / Heavy Titles**: `"Neue Haas Grotesk Display", "Anton", "Inter", -apple-system, sans-serif`
* **Text / Editorial Body**: `"Neue Haas Grotesk Text", "Assistant", "Inter", system-ui, sans-serif`
* **Monospace / Technical specs**: `"SF Mono", "Fira Code", monospace`

### 2.2 Scale & Line Heights

| Style Name | Font Size | Line Height | Weight | Letter Spacing | Transform | Typical Element |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | 48px - 64px | 1.05 | 800 - 900 | -0.03em | UPPERCASE | Homepage Hero & Collab banners |
| **Section Heading** | 28px - 36px | 1.15 | 700 | -0.02em | UPPERCASE | "NEW IN", "COLLECTIONS", "BEST SELLERS" |
| **PDP Product Title** | 24px - 30px | 1.2 | 600 | 0.01em | UPPERCASE | Product detail main title |
| **PDP Price** | 20px - 22px | 1.25 | 600 | 0.00em | None | Product pricing (e.g. `RS. 5,500`) |
| **Nav Header Link** | 12px - 13px | 1.3 | 500 | 0.05em | UPPERCASE / Title | Main desktop navigation bar |
| **Product Card Title**| 14px - 15px | 1.3 | 500 | 0.01em | None | Grid product titles |
| **Product Card Price**| 13px - 14px | 1.3 | 400 | 0.00em | None | Grid product prices |
| **Body Standard** | 15px - 16px | 1.6 | 400 | 0.00em | None | Paragraphs, editorial copy, accordions |
| **Badge / Caption** | 10px - 11px | 1.2 | 600 | 0.08em | UPPERCASE | Sale badges, size pills, mini tags |

---

## 3. Layout Grid & Breakpoints

* **Container Max Width**: `1440px` (fluid with margins `px-4 sm:px-6 md:px-8 xl:px-12`)
* **Responsive Breakpoints**:
  * `sm`: `640px` (Tablets / large phones)
  * `md`: `768px` (Tablets portrait)
  * `lg`: `1024px` (Laptops / Small desktops)
  * `xl`: `1280px` (Standard desktop)
  * `2xl`: `1536px` (Wide displays)

### 3.1 Product Grid Specifications
* **Mobile (< 768px)**: 2 Columns (`grid-cols-2 gap-x-3 gap-y-6`)
* **Tablet (768px - 1023px)**: 3 Columns (`grid-cols-3 gap-x-4 gap-y-8`)
* **Desktop (>= 1024px)**: 4 Columns (`grid-cols-4 gap-x-6 gap-y-10`)
* **Image Aspect Ratio**: `3:4` (Width: Height = `0.75`), object-fit: `cover`
* **Card Hover State**: Smooth cross-fade to secondary editorial/model image (`duration-300 ease-out`).

---

## 4. Component Design Patterns

### 4.1 Header & Announcement Bar
* **Announcement Bar**: Sticky or top-fixed, `height: 32px`, `bg-black text-white`, marquee ticker scrolling with key announcements ("FREE SHIPPING ON ALL PREPAID DOMESTIC ORDERS").
* **Main Header**: `height: 64px - 72px`, sticky backdrop blur `bg-[#EFEFEF]/90 backdrop-blur-md`, subtle bottom border `border-b border-black/5`.
* **Header Actions**:
  * Search button (opens right slide-over predictive search drawer).
  * Account link (directs to `/account` or opens login modal).
  * Cart button with live counter badge pill.

### 4.2 Buttons & Interactive States
* **Primary CTA** (`Add to Cart`, `Checkout`):
  * Class: `w-full bg-black text-white hover:bg-neutral-800 transition-colors uppercase font-medium text-xs tracking-widest py-4 px-6`
  * Active/Click: Scale down `active:scale-[0.99]`.
* **Secondary CTA** (`Explore`, `View Collection`):
  * Class: `border border-black text-black hover:bg-black hover:text-white transition-all uppercase font-medium text-xs tracking-widest py-3.5 px-6`
* **Size Selector Pills**:
  * Default: `border border-neutral-300 text-neutral-800 text-xs py-2 px-4 rounded-none hover:border-black transition-colors`
  * Selected: `border-2 border-black bg-black text-white font-semibold`
  * Sold Out: `opacity-40 line-through border-dashed border-neutral-300 cursor-not-allowed`

### 4.3 Slide-Over Drawers (Cart & Search)
* **Cart Drawer**: Slides from right (`w-full sm:max-w-md`), dark overlay backdrop (`bg-black/50 backdrop-blur-sm`).
* **Cart Features**:
  * Free shipping progress indicator with dynamic threshold (`Rs. 2,999` free shipping bar).
  * Quantity increment/decrement buttons (`-`, `qty`, `+`).
  * Instant subtotal calculation in paise (`INR`).
  * Direct checkout button launching Razorpay checkout pipeline.
* **Search Drawer**: Instant predictive results with thumbnail preview, title, price, and instant category filters.

### 4.4 Product Detail Page (PDP) Layout
* **Desktop**: 2-Column Split:
  * Left: Multi-image vertical editorial gallery (`w-7/12` or `w-1/2`) with full-bleed high-res photography.
  * Right: Sticky buy-box (`w-5/12` or `w-1/2` `sticky top-24 self-start space-y-6`).
* **Accordions**: Clean border-t dividers with plus/minus toggles for:
  1. Product Description & Craftsmanship
  2. Fabric Composition & Heavyweight GSM specs
  3. Size & Fit Guide (Oversized Streetwear fit notes)
  4. Shipping & Returns Policy
