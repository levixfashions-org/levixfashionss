# Page & Feature Inventory Specification

**Project**: Full-Stack Levix Recreation  
**Architecture**: React SPA (Vite) + Node.js / Express REST API + PostgreSQL (Prisma)  

---

## 1. Route Map & Component Inventory

| Route Path | Page Title | Component Name | Key Features |
| :--- | :--- | :--- | :--- |
| `/` | Homepage | `HomePage.tsx` | Marquee ticker, Hero editorial slider, Category grid, Collab showcase, Best sellers carousel, Editorial lookbook, Newsletter banner |
| `/collections` | All Collections | `CollectionsPage.tsx` | Directory of brand collections (Godzilla collab, Racing club, Winter drop, Iconics, Basics) |
| `/collections/:handle` | Collection Detail | `CollectionDetailPage.tsx` | Product grid, Category filtering, Price/Alphabetical sorting, Quick Add modal, Secondary image crossfade on hover |
| `/products/:handle` | Product Detail (PDP) | `ProductDetailPage.tsx` | Vertical image gallery, Sticky buy-box, Size selection pills, Out-of-stock indicators, Size guide modal, Accordion specs, Add to Cart & Buy Now |
| `/search` | Search Results | `SearchPage.tsx` | Full-page search view, Live predictive query, Filter by category/price, Result cards |
| `/cart` | Shopping Cart | `CartPage.tsx` | Full shopping cart page (complementing the slide-over Cart Drawer), Item list, Quantity modifiers, Coupon code input, Free shipping threshold progress |
| `/wishlist` | Saved Items | `WishlistPage.tsx` | Customer saved wishlist items, One-click move to cart, Remove from wishlist |
| `/checkout` | Secure Checkout | `CheckoutPage.tsx` | Multi-step checkout: Shipping Address, Contact info, Order Summary, Razorpay payment modal integration |
| `/order-success/:orderNumber` | Order Confirmation | `OrderSuccessPage.tsx` | Order summary, Tracking number, Payment verification badge, Delivery estimates |
| `/account` | Customer Profile | `AccountPage.tsx` | Customer dashboard, Profile editing, Saved addresses, Default address management |
| `/account/orders` | Order History | `OrderHistoryPage.tsx` | List of past orders, Status badges (Pending, Paid, Shipped, Delivered), Detailed order receipts |
| `/login` | Customer Login | `LoginPage.tsx` | Firebase Email/Password login, Google One-Tap sign-in, Redirect to intended destination |
| `/register` | Create Account | `RegisterPage.tsx` | Firebase account creation, First name, Last name, Email, Password, Profile sync to PostgreSQL |
| `/forgot-password` | Password Reset | `ForgotPasswordPage.tsx` | Firebase password reset email trigger |
| `/pages/about` | About Levix | `AboutPage.tsx` | Brand manifesto, Streetwear philosophy, Design atelier story |
| `/pages/store` | Store Locator | `StoreLocatorPage.tsx` | Flagship retail locations (Delhi, Mumbai, Bengaluru), Operating hours, Google Map links |
| `/policies/terms-of-service` | Terms of Service | `PolicyPage.tsx` | Legal terms, Disclaimers, Service conditions |
| `/policies/shipping-policy` | Shipping Policy | `PolicyPage.tsx` | Domestic shipping timelines, Free shipping thresholds, Return & exchange guidelines |
| `/admin` | Admin Dashboard | `AdminDashboardPage.tsx` | Metrics overview (Total sales, Orders, Active customers, Low stock alerts) |
| `/admin/products` | Product Management | `AdminProductsPage.tsx` | Product CRUD, Variant & inventory management, Image URL management, Pricing |
| `/admin/orders` | Order Administration | `AdminOrdersPage.tsx` | Order status management (Processing, Shipped, Delivered, Cancelled), Payment details |

---

## 2. Interactive Global Drawers & Modals

1. **Slide-Over Cart Drawer** (`CartDrawer.tsx`):
   - Opens smoothly from right on clicking header bag icon or adding an item.
   - Dynamic free-shipping bar: "Add Rs. X more for free express shipping".
   - Item rows with thumbnail, title, selected size variant, price, quantity counter, delete button.
   - Subtotal in INR + Checkout CTA button.
2. **Predictive Search Drawer** (`SearchDrawer.tsx`):
   - Fast full-width / right-side search input with auto-focus.
   - Instant live search results as user types (debounced 200ms).
   - Direct jump to product or collection.
3. **Mobile Navigation Drawer** (`MobileNavDrawer.tsx`):
   - Hamburger trigger on mobile (< 1024px).
   - Accordion links for Collections, New In, Categories, Account, and Stores.
4. **Size Guide Modal** (`SizeGuideModal.tsx`):
   - Streetwear oversized fit chart (Chest, Length, Shoulder width in inches/cm).

---

## 3. Product Catalog Sample Set (5 Featured Products)

1. **Cherry Blossom Polo T-Shirt**
   - Handle: `cherry-blossom-polo-t-shirt`
   - Category: `Polo / T-Shirt`
   - Price: `Rs. 4,990`
   - Sizes: `S`, `M`, `L`, `XL`, `XXL`
   - Color: `Off-White / Sakura Pink Embroidery`
   - Heavyweight 260 GSM Pique Cotton

2. **Black Ragnarok T-Shirt**
   - Handle: `black-ragnarok-t-shirt`
   - Category: `Graphic Tee`
   - Price: `Rs. 3,990`
   - Sizes: `S`, `M`, `L`, `XL`
   - Color: `Washed Black`
   - Heavyweight 280 GSM French Terry Cotton, High-density screen print

3. **Thunderstruck Heavyweight Hoodie**
   - Handle: `thunderstruck-hoodie`
   - Category: `Hoodie`
   - Price: `Rs. 6,990`
   - Sizes: `M`, `L`, `XL`, `XXL`
   - Color: `Charcoal Black`
   - 450 GSM Heavy Fleece, Boxy dropped shoulder cut, Double-layer hood

4. **Levix X Godzilla Mothra Rising T-Shirt**
   - Handle: `mothra-rising-t-shirt`
   - Category: `Collab Special Tee`
   - Price: `Rs. 4,490`
   - Sizes: `S`, `M`, `L`, `XL`
   - Color: `Vintage White`
   - Official Godzilla licensed artwork, Puff print details

5. **Black Ripstop Tactical Cargos**
   - Handle: `black-ripstop-cargos`
   - Category: `Cargos / Bottoms`
   - Price: `Rs. 5,990`
   - Sizes: `30`, `32`, `34`, `36`
   - Color: `Matte Black`
   - Military-grade Ripstop cotton, 6 3D utility cargo pockets, Adjustable bungee hem
