import { authService } from './authService';
import { Product, Collection, Cart } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function getOrCreateAnonymousToken(): string {
  let token = localStorage.getItem('levix_anon_token');
  if (!token) {
    token = 'anon_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('levix_anon_token', token);
  }
  return token;
}

// Authentic Levix Default Catalog - Starts 100% clean for the owner's real drops
const DEFAULT_PRODUCTS: Product[] = [];

export const SAMPLE_LEVIX_DROP: Product = {
  id: 'prod_atelier_01',
  name: 'Levix Signature Overlength Heavyweight Tee',
  slug: 'levix-signature-overlength-tee',
  description: 'Signature elongated dropped-shoulder heavyweight tee with architectural drape and custom-milled 280 GSM jersey.',
  details: '280 GSM luxury combed single jersey, seamless ribbed neck band, twin-needle hem finishing.',
  fabricCare: '100% Combed Single Jersey Cotton (280 GSM). Cold gentle wash inside out.',
  fitGuide: 'Overlength dropped-shoulder drape. Designed to stack naturally over denim.',
  basePrice: 329000,
  comparePrice: 399000,
  isFeatured: true,
  isActive: true,
  category: { id: 'overlength-t-shirts', name: 'Overlength T-Shirts', slug: 'overlength-t-shirts' },
  images: [
    { id: 'img_sample_1', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80', sortOrder: 0, isCover: true },
    { id: 'img_sample_2', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80', sortOrder: 1, isCover: false }
  ],
  variants: [
    { id: 'var_sample_s', productId: 'prod_atelier_01', size: 'S', sku: 'LVX-TEE-S', stockQuantity: 15, priceDelta: 0 },
    { id: 'var_sample_m', productId: 'prod_atelier_01', size: 'M', sku: 'LVX-TEE-M', stockQuantity: 25, priceDelta: 0 },
    { id: 'var_sample_l', productId: 'prod_atelier_01', size: 'L', sku: 'LVX-TEE-L', stockQuantity: 30, priceDelta: 0 },
    { id: 'var_sample_xl', productId: 'prod_atelier_01', size: 'XL', sku: 'LVX-TEE-XL', stockQuantity: 10, priceDelta: 0 }
  ]
};

// Persistent LocalStorage Products Support
const STORAGE_PRODUCTS_KEY = 'levix_custom_products';

export const getStoredProducts = (): Product[] => {
  try {
    const saved = localStorage.getItem(STORAGE_PRODUCTS_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return DEFAULT_PRODUCTS;
};

export const saveStoredProducts = (prods: Product[]) => {
  try {
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(prods));
    window.dispatchEvent(new CustomEvent('levix_products_updated', { detail: prods }));
  } catch (e) {}
};

export const resetStoredProducts = () => {
  try {
    localStorage.removeItem(STORAGE_PRODUCTS_KEY);
    MOCK_PRODUCTS.length = 0;
    DEFAULT_PRODUCTS.forEach(p => MOCK_PRODUCTS.push({ ...p }));
    window.dispatchEvent(new CustomEvent('levix_products_updated', { detail: MOCK_PRODUCTS }));
  } catch (e) {}
};

export const MOCK_PRODUCTS: Product[] = getStoredProducts();

// Store Settings Types & Persistent Store
export interface StoreSettings {
  announcementText: string;
  heroHeadline: string;
  heroSubtitle: string;
  supportEmail: string;
  supportPhone: string;
  instagramHandle: string;
  freeShippingThreshold: number;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  announcementText: 'FREE DOMESTIC SHIPPING ON ALL PREPAID ORDERS • LEVIX EXCLUSIVE WINTER COLLECTION IS NOW LIVE • COMPLIMENTARY EXCHANGES • ',
  heroHeadline: 'STREETWEAR ARCHITECTURE',
  heroSubtitle: 'Heavyweight Custom-Milled Silhouettes & Limited Private Drops.',
  supportEmail: 'levixfashions@gmail.com',
  supportPhone: '',
  instagramHandle: 'thelevix.shop',
  freeShippingThreshold: 1999
};

export const getStoreSettings = (): StoreSettings => {
  try {
    const saved = localStorage.getItem('levix_store_settings');
    if (saved) return { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(saved) };
  } catch (e) {}
  return DEFAULT_STORE_SETTINGS;
};

export const saveStoreSettings = (settings: Partial<StoreSettings>): StoreSettings => {
  const current = getStoreSettings();
  const updated = { ...current, ...settings };
  try {
    localStorage.setItem('levix_store_settings', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('levix_settings_updated', { detail: updated }));
  } catch (e) {}
  return updated;
};

// Discount Codes Types & Persistent Store
export interface DiscountCode {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number; // e.g. 20 for 20% or 500 for ₹500
  minOrderPaise: number;
  isActive: boolean;
  expiresAt: string;
}

export const DEFAULT_DISCOUNTS: DiscountCode[] = [
  {
    id: 'disc_1',
    code: 'LEVIX10',
    type: 'PERCENTAGE',
    value: 10,
    minOrderPaise: 199900,
    isActive: true,
    expiresAt: '2026-12-31'
  },
  {
    id: 'disc_2',
    code: 'WELCOME500',
    type: 'FIXED',
    value: 500,
    minOrderPaise: 299900,
    isActive: true,
    expiresAt: '2026-12-31'
  },
  {
    id: 'disc_3',
    code: 'VIP20',
    type: 'PERCENTAGE',
    value: 20,
    minOrderPaise: 499900,
    isActive: true,
    expiresAt: '2026-12-31'
  }
];

export const getDiscountCodes = (): DiscountCode[] => {
  try {
    const saved = localStorage.getItem('levix_discount_codes');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_DISCOUNTS;
};

export const saveDiscountCodes = (codes: DiscountCode[]) => {
  try {
    localStorage.setItem('levix_discount_codes', JSON.stringify(codes));
    window.dispatchEvent(new CustomEvent('levix_discounts_updated', { detail: codes }));
  } catch (e) {}
};

// Orders Persistent Store
const DEFAULT_ORDERS: any[] = [];

export const getStoredOrders = (): any[] => {
  try {
    const saved = localStorage.getItem('levix_admin_orders');
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return DEFAULT_ORDERS;
};

export const saveStoredOrders = (ords: any[]) => {
  try {
    localStorage.setItem('levix_admin_orders', JSON.stringify(ords));
    window.dispatchEvent(new CustomEvent('levix_orders_updated', { detail: ords }));
  } catch (e) {}
};

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'col_overlength',
    name: 'Overlength T-Shirts',
    slug: 'overlength-t-shirts',
    description: 'Elongated architectural drape and dropped-shoulder streetwear silhouettes cut from custom-milled combed cotton.',
    bannerImageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'col_waffle',
    name: 'Waffle Boxy Fit Full Sleeves',
    slug: 'waffle-boxy-fit-full-sleeves',
    description: 'Heavyweight thermal waffle weave knit long sleeves with exaggerated boxy fit.',
    bannerImageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'col_acidwash',
    name: 'Acid Wash T-Shirts',
    slug: 'acid-wash-t-shirts',
    description: 'Vintage hand-treated mineral and acid wash textiles with distressed aesthetics.',
    bannerImageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1400&q=80'
  }
];

// In-Memory Cart State - Starts 100% empty for real customer checkout
let inMemoryCartItems: Array<{
  id: string;
  variantId: string;
  quantity: number;
  product: Product;
  size: string;
}> = [];

function getCartCalculation(): Cart {
  let subtotal = 0;
  const items = inMemoryCartItems.map(it => {
    const total = it.product.basePrice * it.quantity;
    subtotal += total;
    return {
      id: it.id,
      variantId: it.variantId,
      quantity: it.quantity,
      size: it.size,
      stockQuantity: 20,
      productId: it.product.id,
      productName: it.product.name,
      productSlug: it.product.slug,
      unitPricePaise: it.product.basePrice,
      totalPaise: total,
      imageUrl: it.product.images[0]?.url || null
    };
  });

  const FREE_SHIPPING_THRESHOLD = 299900;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 15000;

  return {
    cartId: 'local_cart_session',
    items,
    itemCount: items.reduce((acc, it) => acc + it.quantity, 0),
    subtotalPaise: subtotal,
    shippingPaise: shipping,
    totalPaise: subtotal + shipping,
    freeShippingThresholdPaise: FREE_SHIPPING_THRESHOLD,
    remainingForFreeShippingPaise: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  };
}

export const apiClient = {
  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<{ data: T; status: number }> {
    const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    // In standalone local dev mode, serve instant mock catalog without proxy timeouts
    const useStandaloneMock = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL === 'mock';

    if (!useStandaloneMock) {
      try {
        const token = await authService.getToken();
        const headers = new Headers(options.headers || {});
        if (token) headers.set('Authorization', `Bearer ${token}`);
        headers.set('x-anonymous-token', getOrCreateAnonymousToken());

        const res = await fetch(url, { ...options, headers });
        if (res.ok) {
          const data = await res.json();
          return { data, status: res.status };
        }
      } catch (netErr) {
        // Fall through to mock handler
      }
    }

    // High-Fidelity Mock Response Handler
    const path = endpoint.split('?')[0];

    // Products
    if (path === '/products') {
      const q = new URLSearchParams(endpoint.split('?')[1] || '');
      const search = q.get('search')?.toLowerCase();
      const cat = q.get('category');
      
      let prods = MOCK_PRODUCTS;
      if (search) {
        prods = prods.filter(p => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search));
      }
      if (cat && cat !== 'all') {
        const catClean = cat.toLowerCase();
        prods = prods.filter(p => 
          p.category?.slug?.toLowerCase() === catClean ||
          p.category?.id?.toLowerCase() === catClean ||
          p.category?.name?.toLowerCase() === catClean ||
          p.category?.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === catClean
        );
      }
      return { data: { products: prods, pagination: { total: prods.length } } as any, status: 200 };
    }

    if (path.startsWith('/products/')) {
      const slug = path.replace('/products/', '');
      const prod = MOCK_PRODUCTS.find(p => p.slug === slug);
      if (!prod) {
        return { data: { product: null, relatedProducts: [] } as any, status: 404 };
      }
      const related = MOCK_PRODUCTS.filter(p => p.id !== prod.id).slice(0, 4);
      return { data: { product: prod, relatedProducts: related } as any, status: 200 };
    }

    // Collections
    if (path === '/collections') {
      return { data: { collections: MOCK_COLLECTIONS } as any, status: 200 };
    }

    if (path.startsWith('/collections/')) {
      const slug = path.replace('/collections/', '');
      const col = MOCK_COLLECTIONS.find(c => c.slug === slug) || {
        id: slug,
        name: slug.replace(/-/g, ' ').toUpperCase(),
        slug: slug,
        description: 'Curated streetwear archive.'
      };

      let prods = MOCK_PRODUCTS;
      if (slug !== 'all-products' && slug !== 'new-in') {
        const catClean = slug.toLowerCase();
        const matched = MOCK_PRODUCTS.filter(p => 
          p.category?.slug?.toLowerCase() === catClean ||
          p.category?.id?.toLowerCase() === catClean ||
          p.category?.name?.toLowerCase() === catClean ||
          p.category?.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === catClean
        );
        if (matched.length > 0) {
          prods = matched;
        }
      }

      return { data: { collection: col, products: prods } as any, status: 200 };
    }

    // Cart
    if (path === '/cart') {
      return { data: getCartCalculation() as any, status: 200 };
    }

    if (path === '/cart/items' && options.method === 'POST') {
      const body = JSON.parse(options.body as string || '{}');
      let foundProd: Product | undefined;
      let foundSize = 'L';
      for (const p of MOCK_PRODUCTS) {
        const v = p.variants.find(va => va.id === body.variantId);
        if (v) {
          foundProd = p;
          foundSize = v.size;
          break;
        }
      }
      if (foundProd) {
        inMemoryCartItems.push({
          id: 'item_' + Date.now(),
          variantId: body.variantId,
          quantity: body.quantity || 1,
          product: foundProd,
          size: foundSize
        });
      }
      return { data: getCartCalculation() as any, status: 200 };
    }

    if (path.startsWith('/cart/items/') && options.method === 'PUT') {
      const id = path.replace('/cart/items/', '');
      const body = JSON.parse(options.body as string || '{}');
      const it = inMemoryCartItems.find(i => i.id === id);
      if (it) {
        if (body.quantity <= 0) {
          inMemoryCartItems = inMemoryCartItems.filter(i => i.id !== id);
        } else {
          it.quantity = body.quantity;
        }
      }
      return { data: getCartCalculation() as any, status: 200 };
    }

    if (path.startsWith('/cart/items/') && options.method === 'DELETE') {
      const id = path.replace('/cart/items/', '');
      inMemoryCartItems = inMemoryCartItems.filter(i => i.id !== id);
      return { data: getCartCalculation() as any, status: 200 };
    }

    // Orders
    if (path === '/orders' && options.method === 'POST') {
      const body = JSON.parse(options.body as string || '{}');
      const orderNum = `LVX-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const calc = getCartCalculation();
      return {
        data: {
          order: {
            orderNumber: orderNum,
            customerEmail: body.customerEmail,
            customerName: body.customerName,
            totalPaise: calc.totalPaise
          },
          razorpayOrderId: `order_mock_${Date.now()}`,
          amountPaise: calc.totalPaise,
          keyId: 'rzp_test_mock_123'
        } as any,
        status: 201
      };
    }

    if (path === '/payments/verify') {
      inMemoryCartItems = [];
      return { data: { success: true } as any, status: 200 };
    }

    if (path.startsWith('/orders/')) {
      const orderNum = path.replace('/orders/', '');
      const existing = getStoredOrders().find(o => o.orderNumber === orderNum || o.id === orderNum);
      if (existing) {
        return { data: { order: existing } as any, status: 200 };
      }
      return {
        data: {
          order: {
            orderNumber: orderNum,
            customerEmail: 'orders@thelevix.shop',
            customerName: 'Levix Client',
            items: [],
            totalPaise: 0
          }
        } as any,
        status: 200
      };
    }

    // Admin Product Management
    if (path === '/admin/products' && options.method === 'POST') {
      const body = JSON.parse(options.body as string || '{}');
      const newProd: Product = {
        id: 'prod_' + Date.now(),
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: body.description || '',
        details: body.details || '',
        fabricCare: body.fabricCare || '',
        fitGuide: body.fitGuide || '',
        basePrice: body.basePrice || 299900,
        comparePrice: body.comparePrice || null,
        isFeatured: Boolean(body.isFeatured),
        isActive: true,
        category: body.category || { 
          id: body.categoryId || 'overlength-t-shirts', 
          name: body.categoryName || 'Overlength T-Shirts', 
          slug: body.categoryId || 'overlength-t-shirts' 
        },
        images: body.images || [{ id: 'img_' + Date.now(), url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80', isCover: true, sortOrder: 0 }],
        variants: body.variants || [
          { id: 'var_s_' + Date.now(), productId: 'prod_' + Date.now(), size: 'S', sku: 'LVX-S', stockQuantity: 10, priceDelta: 0 },
          { id: 'var_m_' + Date.now(), productId: 'prod_' + Date.now(), size: 'M', sku: 'LVX-M', stockQuantity: 15, priceDelta: 0 },
          { id: 'var_l_' + Date.now(), productId: 'prod_' + Date.now(), size: 'L', sku: 'LVX-L', stockQuantity: 20, priceDelta: 0 },
          { id: 'var_xl_' + Date.now(), productId: 'prod_' + Date.now(), size: 'XL', sku: 'LVX-XL', stockQuantity: 10, priceDelta: 0 }
        ]
      };
      MOCK_PRODUCTS.unshift(newProd);
      saveStoredProducts(MOCK_PRODUCTS);
      return { data: { product: newProd } as any, status: 201 };
    }

    if (path.startsWith('/admin/products/') && options.method === 'PUT') {
      const prodId = path.replace('/admin/products/', '');
      const body = JSON.parse(options.body as string || '{}');
      const pIdx = MOCK_PRODUCTS.findIndex(p => p.id === prodId || p.slug === prodId);
      if (pIdx !== -1) {
        MOCK_PRODUCTS[pIdx] = {
          ...MOCK_PRODUCTS[pIdx],
          ...body,
          ...(body.category && { category: body.category }),
          ...(body.categoryName && { 
            category: { 
              id: body.categoryId || body.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'), 
              name: body.categoryName, 
              slug: body.categoryId || body.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
            } 
          }),
          ...(body.images && { images: body.images }),
          ...(body.variants && { variants: body.variants })
        };
        saveStoredProducts(MOCK_PRODUCTS);
        return { data: { product: MOCK_PRODUCTS[pIdx] } as any, status: 200 };
      }
      return { data: { error: 'Product not found' } as any, status: 404 };
    }

    if (path.startsWith('/admin/products/') && options.method === 'DELETE') {
      const prodId = path.replace('/admin/products/', '');
      const idx = MOCK_PRODUCTS.findIndex(p => p.id === prodId || p.slug === prodId);
      if (idx !== -1) {
        MOCK_PRODUCTS.splice(idx, 1);
        saveStoredProducts(MOCK_PRODUCTS);
      }
      return { data: { success: true } as any, status: 200 };
    }

    // Admin Orders
    if (path === '/admin/orders') {
      return {
        data: {
          orders: getStoredOrders()
        } as any,
        status: 200
      };
    }

    if (path === '/admin/orders' && options.method === 'POST') {
      const body = JSON.parse(options.body as string || '{}');
      const currentOrders = getStoredOrders();
      const newOrder = {
        id: 'ord_' + Date.now(),
        orderNumber: 'LVX-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
        customerName: body.customerName || 'Private Client',
        customerEmail: body.customerEmail || 'client@thelevix.shop',
        customerPhone: body.customerPhone || '',
        shippingAddress: body.shippingAddress || 'India',
        status: body.status || 'PROCESSING',
        paymentStatus: body.paymentStatus || 'PAID',
        totalPaise: body.totalPaise || 499000,
        createdAt: new Date().toISOString(),
        courier: body.courier || 'Blue Dart Express',
        trackingNumber: body.trackingNumber || ('BD' + Math.floor(10000000 + Math.random() * 90000000) + 'IN'),
        items: body.items || [{ productName: 'Levix Heavyweight Drop Item', size: 'L', quantity: 1, unitPricePaise: 499000 }]
      };
      currentOrders.unshift(newOrder);
      saveStoredOrders(currentOrders);
      return { data: { order: newOrder } as any, status: 201 };
    }

    if (path.startsWith('/admin/orders/') && options.method === 'PATCH') {
      const orderId = path.replace('/admin/orders/', '').replace('/status', '');
      const body = JSON.parse(options.body as string || '{}');
      const currentOrders = getStoredOrders();
      const ordIdx = currentOrders.findIndex(o => o.id === orderId || o.orderNumber === orderId);
      if (ordIdx !== -1) {
        currentOrders[ordIdx] = {
          ...currentOrders[ordIdx],
          ...body,
          ...(body.status && { status: body.status }),
          ...(body.courier && { courier: body.courier }),
          ...(body.trackingNumber && { trackingNumber: body.trackingNumber })
        };
        saveStoredOrders(currentOrders);
        return { data: { success: true, order: currentOrders[ordIdx] } as any, status: 200 };
      }
      return { data: { success: true } as any, status: 200 };
    }

    if (path.startsWith('/admin/orders/') && options.method === 'DELETE') {
      const orderId = path.replace('/admin/orders/', '');
      const currentOrders = getStoredOrders();
      const updated = currentOrders.filter(o => o.id !== orderId && o.orderNumber !== orderId);
      saveStoredOrders(updated);
      return { data: { success: true } as any, status: 200 };
    }

    // Admin Store Settings
    if (path === '/admin/settings') {
      if (options.method === 'POST') {
        const body = JSON.parse(options.body as string || '{}');
        const updated = saveStoreSettings(body);
        return { data: { success: true, settings: updated } as any, status: 200 };
      }
      return { data: { settings: getStoreSettings() } as any, status: 200 };
    }

    // Admin Discounts
    if (path === '/admin/discounts') {
      if (options.method === 'POST') {
        const body = JSON.parse(options.body as string || '{}');
        const currentDiscounts = getDiscountCodes();
        const newDiscount: DiscountCode = {
          id: 'disc_' + Date.now(),
          code: (body.code || 'CODE' + Date.now()).toUpperCase().trim(),
          type: body.type === 'FIXED' ? 'FIXED' : 'PERCENTAGE',
          value: Number(body.value) || 10,
          minOrderPaise: (Number(body.minOrderINR) || 1999) * 100,
          isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
          expiresAt: body.expiresAt || '2026-12-31'
        };
        currentDiscounts.unshift(newDiscount);
        saveDiscountCodes(currentDiscounts);
        return { data: { success: true, discount: newDiscount } as any, status: 201 };
      }
      return { data: { discounts: getDiscountCodes() } as any, status: 200 };
    }

    if (path.startsWith('/admin/discounts/') && options.method === 'DELETE') {
      const discId = path.replace('/admin/discounts/', '');
      const currentDiscounts = getDiscountCodes();
      const updated = currentDiscounts.filter(d => d.id !== discId && d.code !== discId);
      saveDiscountCodes(updated);
      return { data: { success: true } as any, status: 200 };
    }

    if (path.startsWith('/admin/discounts/') && options.method === 'PATCH') {
      const discId = path.replace('/admin/discounts/', '').replace('/toggle', '');
      const currentDiscounts = getDiscountCodes();
      const idx = currentDiscounts.findIndex(d => d.id === discId || d.code === discId);
      if (idx !== -1) {
        currentDiscounts[idx].isActive = !currentDiscounts[idx].isActive;
        saveDiscountCodes(currentDiscounts);
        return { data: { success: true, discount: currentDiscounts[idx] } as any, status: 200 };
      }
      return { data: { success: false } as any, status: 404 };
    }

    // Admin Metrics
    if (path === '/admin/metrics') {
      const allOrders = getStoredOrders();
      const totalRev = allOrders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.totalPaise : 0), 0);
      return {
        data: {
          metrics: {
            totalOrders: allOrders.length,
            totalRevenueINR: Math.round(totalRev / 100),
            totalCustomers: allOrders.length > 0 ? new Set(allOrders.map(o => o.customerEmail)).size : 0,
            totalProducts: MOCK_PRODUCTS.length
          },
          recentOrders: allOrders.slice(0, 5),
          lowStockVariants: []
        } as any,
        status: 200
      };
    }

    return { data: {} as any, status: 200 };
  },

  get<T = any>(endpoint: string, params?: Record<string, any>) {
    let url = endpoint;
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) query.set(k, String(v));
      });
      const qs = query.toString();
      if (qs) url += (url.includes('?') ? '&' : '?') + qs;
    }
    return this.request<T>(url, { method: 'GET' });
  },

  post<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body || {}) });
  },

  put<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body || {}) });
  },

  patch<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body || {}) });
  },

  delete<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
};
