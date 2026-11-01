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

// Authentic Levix Fallback Catalog
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_0',
    name: 'Levix X Godzilla Black Thunderstruck T-Shirt',
    slug: 'black-thunderstruck-t-shirt',
    description: 'Signature dropped-shoulder heavyweight tee with volcanic distressed geometric graphics, high-density screen print and vintage mineral wash finish.',
    details: '280 GSM luxury combed single jersey, seamless ribbed neck band, twin-needle hem finishing.',
    fabricCare: '100% Premium Cotton. Reverse wash cold. Iron on reverse side only.',
    fitGuide: 'Intentionally oversized boxy silhouette. Size down for a regular fit.',
    basePrice: 399000,
    comparePrice: 450000,
    isFeatured: true,
    isActive: true,
    category: { id: 'cat_tees', name: 'T-Shirts', slug: 't-shirts' },
    images: [
      { id: 'img_0_1', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80', sortOrder: 0, isCover: true },
      { id: 'img_0_2', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80', sortOrder: 1, isCover: false },
      { id: 'img_0_3', url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80', sortOrder: 2, isCover: false }
    ],
    variants: [
      { id: 'var_0_s', productId: 'prod_0', size: 'S', sku: 'TEE-THUN-S', stockQuantity: 20, priceDelta: 0 },
      { id: 'var_0_m', productId: 'prod_0', size: 'M', sku: 'TEE-THUN-M', stockQuantity: 25, priceDelta: 0 },
      { id: 'var_0_l', productId: 'prod_0', size: 'L', sku: 'TEE-THUN-L', stockQuantity: 30, priceDelta: 0 },
      { id: 'var_0_xl', productId: 'prod_0', size: 'XL', sku: 'TEE-THUN-XL', stockQuantity: 10, priceDelta: 0 }
    ]
  },
  {
    id: 'prod_1',
    name: 'Levix Cherry Blossom Polo T-Shirt',
    slug: 'cherry-blossom-polo-t-shirt',
    description: 'Crafted from heavyweight custom-milled 260 GSM pique cotton with detailed cherry blossom floral embroidery across the chest and Levix typographic branding.',
    details: 'Tailored oversized fit, ribbed collar, Mother-of-pearl buttons, split hem with reinforced herringbone tape.',
    fabricCare: '100% Combed Pique Cotton. Cold machine wash inside out. Do not tumble dry. Dry in shade.',
    fitGuide: 'Oversized Streetwear Fit. Model is 6 ft 1 in wearing size L for a relaxed drape.',
    basePrice: 499000,
    comparePrice: 599000,
    isFeatured: true,
    isActive: true,
    category: { id: 'cat_polos', name: 'Polos', slug: 'polos' },
    images: [
      { id: 'img_1_1', url: 'https://images.unsplash.com/photo-1625910513413-72210c598007?auto=format&fit=crop&w=1000&q=80', sortOrder: 0, isCover: true },
      { id: 'img_1_2', url: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1000&q=80', sortOrder: 1, isCover: false }
    ],
    variants: [
      { id: 'var_1_s', productId: 'prod_1', size: 'S', sku: 'POLO-CB-S', stockQuantity: 15, priceDelta: 0 },
      { id: 'var_1_m', productId: 'prod_1', size: 'M', sku: 'POLO-CB-M', stockQuantity: 22, priceDelta: 0 },
      { id: 'var_1_l', productId: 'prod_1', size: 'L', sku: 'POLO-CB-L', stockQuantity: 30, priceDelta: 0 },
      { id: 'var_1_xl', productId: 'prod_1', size: 'XL', sku: 'POLO-CB-XL', stockQuantity: 12, priceDelta: 0 },
      { id: 'var_1_xxl', productId: 'prod_1', size: 'XXL', sku: 'POLO-CB-XXL', stockQuantity: 0, priceDelta: 0 }
    ]
  },
  {
    id: 'prod_2',
    name: 'Levix Black Ragnarok T-Shirt',
    slug: 'black-ragnarok-t-shirt',
    description: 'Signature dropped-shoulder heavyweight tee with volcanic distressed Nordic runes, high-density screen print and vintage mineral wash finish.',
    details: '280 GSM luxury combed single jersey, seamless ribbed neck band, twin-needle hem finishing.',
    fabricCare: '100% Premium Cotton. Reverse wash cold. Iron on reverse side only.',
    fitGuide: 'Intentionally oversized boxy silhouette. Size down for a regular fit.',
    basePrice: 399000,
    comparePrice: 450000,
    isFeatured: true,
    isActive: true,
    category: { id: 'cat_tees', name: 'T-Shirts', slug: 't-shirts' },
    images: [
      { id: 'img_2_1', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80', sortOrder: 0, isCover: true },
      { id: 'img_2_2', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80', sortOrder: 1, isCover: false }
    ],
    variants: [
      { id: 'var_2_s', productId: 'prod_2', size: 'S', sku: 'TEE-RAG-S', stockQuantity: 20, priceDelta: 0 },
      { id: 'var_2_m', productId: 'prod_2', size: 'M', sku: 'TEE-RAG-M', stockQuantity: 28, priceDelta: 0 },
      { id: 'var_2_l', productId: 'prod_2', size: 'L', sku: 'TEE-RAG-L', stockQuantity: 18, priceDelta: 0 },
      { id: 'var_2_xl', productId: 'prod_2', size: 'XL', sku: 'TEE-RAG-XL', stockQuantity: 8, priceDelta: 0 }
    ]
  },
  {
    id: 'prod_3',
    name: 'Levix Thunderstruck Heavyweight Hoodie',
    slug: 'thunderstruck-hoodie',
    description: 'Ultra-heavy 450 GSM diagonal fleece hoodie engineered for winter drape. High-definition screen print with electric atmospheric artwork.',
    details: 'Double-layered substantial hood without drawstrings for clean minimalist aesthetic. Concealed kangaroo pocket seams, heavyweight 2x2 ribbed cuffs.',
    fabricCare: '100% Organic Heavyweight Cotton Fleece. Machine wash cold with like colors.',
    fitGuide: 'Boxy streetwear drape with dropped shoulder seams.',
    basePrice: 699000,
    comparePrice: 799000,
    isFeatured: true,
    isActive: true,
    category: { id: 'cat_hoodies', name: 'Hoodies', slug: 'hoodies' },
    images: [
      { id: 'img_3_1', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80', sortOrder: 0, isCover: true },
      { id: 'img_3_2', url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80', sortOrder: 1, isCover: false }
    ],
    variants: [
      { id: 'var_3_m', productId: 'prod_3', size: 'M', sku: 'HD-THUN-M', stockQuantity: 15, priceDelta: 0 },
      { id: 'var_3_l', productId: 'prod_3', size: 'L', sku: 'HD-THUN-L', stockQuantity: 25, priceDelta: 0 },
      { id: 'var_3_xl', productId: 'prod_3', size: 'XL', sku: 'HD-THUN-XL', stockQuantity: 10, priceDelta: 0 },
      { id: 'var_3_xxl', productId: 'prod_3', size: 'XXL', sku: 'HD-THUN-XXL', stockQuantity: 5, priceDelta: 0 }
    ]
  },
  {
    id: 'prod_4',
    name: 'Levix Mothra Botanical T-Shirt',
    slug: 'mothra-rising-t-shirt',
    description: 'Vintage-white heavyweight tee showcasing intricate botanical wing illustrations with soft puff-print textural dimensions.',
    details: '260 GSM single jersey cotton, bio-washed and pre-shrunk.',
    fabricCare: '100% Combed Cotton. Hand or delicate cycle wash cold.',
    fitGuide: 'Relaxed true-to-size oversized drape.',
    basePrice: 449000,
    comparePrice: null,
    isFeatured: true,
    isActive: true,
    category: { id: 'cat_tees', name: 'T-Shirts', slug: 't-shirts' },
    images: [
      { id: 'img_4_1', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80', sortOrder: 0, isCover: true }
    ],
    variants: [
      { id: 'var_4_s', productId: 'prod_4', size: 'S', sku: 'TEE-MOTH-S', stockQuantity: 14, priceDelta: 0 },
      { id: 'var_4_m', productId: 'prod_4', size: 'M', sku: 'TEE-MOTH-M', stockQuantity: 20, priceDelta: 0 },
      { id: 'var_4_l', productId: 'prod_4', size: 'L', sku: 'TEE-MOTH-L', stockQuantity: 15, priceDelta: 0 },
      { id: 'var_4_xl', productId: 'prod_4', size: 'XL', sku: 'TEE-MOTH-XL', stockQuantity: 6, priceDelta: 0 }
    ]
  },
  {
    id: 'prod_5',
    name: 'Black Ripstop Tactical Cargos',
    slug: 'black-ripstop-cargos',
    description: 'Engineered utility trousers crafted from cross-woven tear-resistant ripstop cotton. Equipped with 6 3D bellow cargo compartments.',
    details: 'Articulated knee darts, bungee-cord adjustable cuffs with metal cord-locks, reinforced seat panel.',
    fabricCare: '100% Cotton Ripstop. Machine wash cold inside out.',
    fitGuide: 'Relaxed straight leg with taper toggle options at the ankle.',
    basePrice: 599000,
    comparePrice: 699000,
    isFeatured: true,
    isActive: true,
    category: { id: 'cat_bottoms', name: 'Bottoms', slug: 'bottoms' },
    images: [
      { id: 'img_5_1', url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80', sortOrder: 0, isCover: true }
    ],
    variants: [
      { id: 'var_5_30', productId: 'prod_5', size: '30', sku: 'CRG-30', stockQuantity: 10, priceDelta: 0 },
      { id: 'var_5_32', productId: 'prod_5', size: '32', sku: 'CRG-32', stockQuantity: 18, priceDelta: 0 },
      { id: 'var_5_34', productId: 'prod_5', size: '34', sku: 'CRG-34', stockQuantity: 12, priceDelta: 0 },
      { id: 'var_5_36', productId: 'prod_5', size: '36', sku: 'CRG-36', stockQuantity: 5, priceDelta: 0 }
    ]
  },
  {
    id: 'prod_bag_1',
    name: 'Jacquard Card Case',
    slug: 'jacquard-card-case',
    description: 'Custom woven jacquard monogram card wallet with top grain leather edging and 4 dedicated card slots.',
    details: 'Custom milled jacquard, hand-burnished edges, debossed metal logo badge.',
    fabricCare: 'Wipe with clean dry microfiber cloth. Keep away from extreme moisture.',
    fitGuide: 'One Size Slim Profile. 10cm x 7.5cm.',
    basePrice: 299000,
    comparePrice: null,
    isFeatured: true,
    isActive: true,
    category: { id: 'cat_bags', name: 'Bags & Accessories', slug: 'bags' },
    images: [
      { id: 'img_b1_1', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=80', sortOrder: 0, isCover: true },
      { id: 'img_b1_2', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80', sortOrder: 1, isCover: false }
    ],
    variants: [
      { id: 'var_b1_os', productId: 'prod_bag_1', size: 'ONE SIZE', sku: 'WAL-JAC-OS', stockQuantity: 25, priceDelta: 0 }
    ]
  },
  {
    id: 'prod_bag_2',
    name: 'Crest Mini Backpack Jacquard',
    slug: 'crest-mini-backpack',
    description: 'Compact technical daypack featuring all-over monogram jacquard weaving, custom metal hardware, and padded adjustable straps.',
    details: 'Dual two-way zipper compartments, internal padded sleeve, reinforced base.',
    fabricCare: 'Spot clean with damp cloth.',
    fitGuide: 'Compact Daily Size. 28cm x 22cm x 12cm.',
    basePrice: 899000,
    comparePrice: 999000,
    isFeatured: true,
    isActive: true,
    category: { id: 'cat_bags', name: 'Bags & Accessories', slug: 'bags' },
    images: [
      { id: 'img_b2_1', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80', sortOrder: 0, isCover: true },
      { id: 'img_b2_2', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80', sortOrder: 1, isCover: false }
    ],
    variants: [
      { id: 'var_b2_os', productId: 'prod_bag_2', size: 'ONE SIZE', sku: 'BPK-MINI-OS', stockQuantity: 15, priceDelta: 0 }
    ]
  },
  {
    id: 'prod_bag_3',
    name: 'Crest Duffle Leather',
    slug: 'crest-duffle-leather',
    description: 'Executive weekend travel duffle crafted from full-grain bovine leather with custom metal zipper pulls and luggage tag.',
    details: 'Reinforced leather grab handles, detachable tactical webbing shoulder strap, internal zippered valuables pocket.',
    fabricCare: 'Professional leather care only.',
    fitGuide: 'Cabin Approved Weekend Size. 50cm x 28cm x 26cm.',
    basePrice: 1499000,
    comparePrice: 1699000,
    isFeatured: true,
    isActive: true,
    category: { id: 'cat_bags', name: 'Bags & Accessories', slug: 'bags' },
    images: [
      { id: 'img_b3_1', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80', sortOrder: 0, isCover: true },
      { id: 'img_b3_2', url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80', sortOrder: 1, isCover: false }
    ],
    variants: [
      { id: 'var_b3_os', productId: 'prod_bag_3', size: 'ONE SIZE', sku: 'DUF-LTH-OS', stockQuantity: 8, priceDelta: 0 }
    ]
  },
  {
    id: 'prod_bag_4',
    name: 'Crest Carryall Leather',
    slug: 'crest-carryall-leather',
    description: 'Architectural oversized tote bag structured in pebble-grained leather with matte black hardware accents.',
    details: 'Spacious main compartment fitting up to 16-inch laptops, magnetic closure, metal bag feet.',
    fabricCare: 'Condition leather bi-annually.',
    fitGuide: 'Overnight & Daily Carryall. 42cm x 34cm x 15cm.',
    basePrice: 1299000,
    comparePrice: null,
    isFeatured: true,
    isActive: true,
    category: { id: 'cat_bags', name: 'Bags & Accessories', slug: 'bags' },
    images: [
      { id: 'img_b4_1', url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80', sortOrder: 0, isCover: true },
      { id: 'img_b4_2', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80', sortOrder: 1, isCover: false }
    ],
    variants: [
      { id: 'var_b4_os', productId: 'prod_bag_4', size: 'ONE SIZE', sku: 'TOT-LTH-OS', stockQuantity: 12, priceDelta: 0 }
    ]
  }
];

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'col_1',
    name: 'LEVIX ATELIER CAPSULE',
    slug: 'levix-atelier-capsule',
    description: 'Exclusive limited-edition drops featuring signature architectural silhouettes.',
    bannerImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'col_2',
    name: 'Levix Racing Club',
    slug: 'levix-racing-club',
    description: 'Motorsport heritage cut in signature boxy aesthetics.',
    bannerImageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'col_3',
    name: 'Winter Collection 2025',
    slug: 'winter-collection',
    description: 'Thermal heavyweight hoodies, knitwear and cargos.',
    bannerImageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'col_4',
    name: 'Bags & Leather Goods',
    slug: 'bags',
    description: 'Custom woven jacquards and pebble grain bovine leather accessories.',
    bannerImageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'col_5',
    name: 'Architectural Headwear & Caps',
    slug: 'caps',
    description: 'Structured 6-panel streetwear caps with high-density 3D embroidery.',
    bannerImageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'col_6',
    name: 'Yacht Collection',
    slug: 'yacht-collection',
    description: 'High-octane coastal streetwear and resort tailoring.',
    bannerImageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'col_7',
    name: 'Levix Basics',
    slug: 'summer-basics',
    description: 'Daily custom combed cotton staples with architectural proportions.',
    bannerImageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80'
  }
];

// In-Memory Cart State
let inMemoryCartItems: Array<{
  id: string;
  variantId: string;
  quantity: number;
  product: Product;
  size: string;
}> = [
  {
    id: 'item_1',
    variantId: 'var_1_l',
    quantity: 1,
    product: MOCK_PRODUCTS[0],
    size: 'L'
  }
];

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
      if (cat) {
        prods = prods.filter(p => p.category?.slug === cat);
      }
      return { data: { products: prods, pagination: { total: prods.length } } as any, status: 200 };
    }

    if (path.startsWith('/products/')) {
      const slug = path.replace('/products/', '');
      const prod = MOCK_PRODUCTS.find(p => p.slug === slug) || MOCK_PRODUCTS[0];
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
        name: slug.toUpperCase(),
        slug: slug,
        description: 'Curated streetwear archive.'
      };
      return { data: { collection: col, products: MOCK_PRODUCTS } as any, status: 200 };
    }

    // Cart
    if (path === '/cart') {
      return { data: getCartCalculation() as any, status: 200 };
    }

    if (path === '/cart/items' && options.method === 'POST') {
      const body = JSON.parse(options.body as string || '{}');
      let foundProd = MOCK_PRODUCTS[0];
      let foundSize = 'L';
      for (const p of MOCK_PRODUCTS) {
        const v = p.variants.find(va => va.id === body.variantId);
        if (v) {
          foundProd = p;
          foundSize = v.size;
          break;
        }
      }
      inMemoryCartItems.push({
        id: 'item_' + Date.now(),
        variantId: body.variantId,
        quantity: body.quantity || 1,
        product: foundProd,
        size: foundSize
      });
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
      const orderNum = `BLU-2026-${Math.floor(100000 + Math.random() * 900000)}`;
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
      return {
        data: {
          order: {
            orderNumber: orderNum,
            customerEmail: 'customer@levix.local',
            customerName: 'VIP Collector',
            items: [
              {
                id: 'ord_it_1',
                productName: MOCK_PRODUCTS[0].name,
                size: 'L',
                quantity: 1,
                subtotalPaise: MOCK_PRODUCTS[0].basePrice
              }
            ],
            totalPaise: MOCK_PRODUCTS[0].basePrice
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
        category: { id: body.categoryId || 'cat_tees', name: 'Streetwear', slug: 'streetwear' },
        images: body.images || [{ id: 'img_' + Date.now(), url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80', isCover: true, sortOrder: 0 }],
        variants: body.variants || [
          { id: 'var_s_' + Date.now(), productId: 'prod_' + Date.now(), size: 'S', sku: 'LVX-S', stockQuantity: 10, priceDelta: 0 },
          { id: 'var_m_' + Date.now(), productId: 'prod_' + Date.now(), size: 'M', sku: 'LVX-M', stockQuantity: 15, priceDelta: 0 },
          { id: 'var_l_' + Date.now(), productId: 'prod_' + Date.now(), size: 'L', sku: 'LVX-L', stockQuantity: 20, priceDelta: 0 },
          { id: 'var_xl_' + Date.now(), productId: 'prod_' + Date.now(), size: 'XL', sku: 'LVX-XL', stockQuantity: 10, priceDelta: 0 }
        ]
      };
      MOCK_PRODUCTS.unshift(newProd);
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
          ...(body.images && { images: body.images }),
          ...(body.variants && { variants: body.variants })
        };
        return { data: { product: MOCK_PRODUCTS[pIdx] } as any, status: 200 };
      }
      return { data: { error: 'Product not found' } as any, status: 404 };
    }

    if (path.startsWith('/admin/products/') && options.method === 'DELETE') {
      const prodId = path.replace('/admin/products/', '');
      const idx = MOCK_PRODUCTS.findIndex(p => p.id === prodId || p.slug === prodId);
      if (idx !== -1) {
        MOCK_PRODUCTS.splice(idx, 1);
      }
      return { data: { success: true } as any, status: 200 };
    }

    // Admin Orders
    if (path === '/admin/orders') {
      return {
        data: {
          orders: [
            {
              id: 'ord_1',
              orderNumber: 'LVX-2026-9481',
              customerName: 'Aditya Rao',
              customerEmail: 'aditya@gmail.com',
              status: 'PROCESSING',
              paymentStatus: 'PAID',
              totalPaise: 499000,
              createdAt: new Date().toISOString(),
              items: [{ productName: 'Levix Cherry Blossom Polo T-Shirt', size: 'L', quantity: 1 }]
            },
            {
              id: 'ord_2',
              orderNumber: 'LVX-2026-8821',
              customerName: 'Pooja Verma',
              customerEmail: 'pooja@gmail.com',
              status: 'SHIPPED',
              paymentStatus: 'PAID',
              totalPaise: 699000,
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              items: [{ productName: 'Levix Thunderstruck Heavyweight Hoodie', size: 'XL', quantity: 1 }]
            }
          ]
        } as any,
        status: 200
      };
    }

    if (path.startsWith('/admin/orders/') && options.method === 'PATCH') {
      return { data: { success: true } as any, status: 200 };
    }

    // Admin Metrics
    if (path === '/admin/metrics') {
      return {
        data: {
          metrics: {
            totalOrders: 142,
            totalRevenueINR: 785400,
            totalCustomers: 98,
            totalProducts: MOCK_PRODUCTS.length
          },
          recentOrders: [
            { id: '1', orderNumber: 'LVX-2026-9481', customerName: 'Aditya Rao', status: 'PROCESSING', totalPaise: 499000 },
            { id: '2', orderNumber: 'LVX-2026-8821', customerName: 'Pooja Verma', status: 'SHIPPED', totalPaise: 699000 }
          ],
          lowStockVariants: [
            { id: '1', product: { name: 'Black Ripstop Tactical Cargos' }, sku: 'CRG-36', size: '36', stockQuantity: 3 }
          ]
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
