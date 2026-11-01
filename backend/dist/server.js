// backend/src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import fs2 from "fs";
import { fileURLToPath } from "url";

// backend/src/config/env.ts
import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
var envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("4000").transform(Number),
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@127.0.0.1:5432/levix?schema=public"),
  FRONTEND_URL: z.string().default("http://localhost:5173"),
  // Firebase Admin Credentials
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_SERVICE_ACCOUNT_PATH: z.string().optional(),
  // Razorpay
  RAZORPAY_KEY_ID: z.string().default("rzp_test_placeholder"),
  RAZORPAY_KEY_SECRET: z.string().default("rzp_secret_placeholder"),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  // Cloudinary / Object Storage
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional()
});
var parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("CRITICAL: Invalid environment configuration:", parsed.error.format());
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
}
var env = parsed.success ? parsed.data : envSchema.parse({});

// backend/src/middleware/rateLimiter.ts
import rateLimit from "express-rate-limit";
var apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 300,
  // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes"
  }
});
var authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 30,
  // 30 requests per 15 minutes for auth endpoints
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many authentication attempts, please try again later"
  }
});
var checkoutRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1e3,
  max: 20,
  // 20 checkout attempts per 10 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many checkout attempts, please slow down"
  }
});

// backend/src/middleware/errorHandler.ts
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
var AppError = class _AppError extends Error {
  statusCode;
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, _AppError.prototype);
  }
};
function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation Error",
      details: err.errors.map((e) => ({ field: e.path.join("."), message: e.message }))
    });
    return;
  }
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(409).json({ error: "A record with this unique value already exists" });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({ error: "The requested resource was not found" });
      return;
    }
  }
  console.error("Unhandled Server Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    ...process.env.NODE_ENV === "development" ? { message: err.message, stack: err.stack } : {}
  });
}

// backend/src/routes/authRoutes.ts
import { Router } from "express";

// backend/src/config/db.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
});

// backend/src/controllers/authController.ts
import { z as z2 } from "zod";
var addressSchema = z2.object({
  fullName: z2.string().min(2),
  line1: z2.string().min(3),
  line2: z2.string().optional(),
  city: z2.string().min(2),
  state: z2.string().min(2),
  postalCode: z2.string().min(4),
  country: z2.string().default("India"),
  phone: z2.string().min(10),
  isDefault: z2.boolean().default(false)
});
async function getProfile(req, res, next) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        addresses: { orderBy: { isDefault: "desc" } },
        _count: { select: { orders: true, reviews: true } }
      }
    });
    if (!user) {
      throw new AppError("User profile not found", 404);
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
async function updateProfile(req, res, next) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    const { name, phone } = z2.object({
      name: z2.string().min(2).optional(),
      phone: z2.string().min(10).optional()
    }).parse(req.body);
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...name ? { name } : {},
        ...phone ? { phone } : {}
      }
    });
    res.json({ user: updatedUser });
  } catch (err) {
    next(err);
  }
}
async function addAddress(req, res, next) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    const data = addressSchema.parse(req.body);
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false }
      });
    }
    const address = await prisma.address.create({
      data: {
        ...data,
        userId: req.user.id
      }
    });
    res.status(201).json({ address });
  } catch (err) {
    next(err);
  }
}
async function deleteAddress(req, res, next) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    const { id } = req.params;
    await prisma.address.deleteMany({
      where: { id, userId: req.user.id }
    });
    res.json({ message: "Address deleted successfully" });
  } catch (err) {
    next(err);
  }
}

// backend/src/config/firebase-admin.ts
import admin from "firebase-admin";
import fs from "fs";
var firebaseApp = null;
function getFirebaseAdmin() {
  if (firebaseApp) return firebaseApp;
  if (admin.apps.length > 0) {
    firebaseApp = admin.apps[0];
    return firebaseApp;
  }
  try {
    if (env.FIREBASE_SERVICE_ACCOUNT_PATH && fs.existsSync(env.FIREBASE_SERVICE_ACCOUNT_PATH)) {
      const serviceAccount = JSON.parse(fs.readFileSync(env.FIREBASE_SERVICE_ACCOUNT_PATH, "utf8"));
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("Firebase Admin initialized with service account file.");
      return firebaseApp;
    }
    if (env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
      const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey
        })
      });
      console.log("Firebase Admin initialized with credentials from environment.");
      return firebaseApp;
    }
    console.warn("WARNING: Firebase Admin credentials not fully configured. Running in mock/development mode.");
    firebaseApp = admin.initializeApp({
      projectId: "levix-dev-mock"
    });
    return firebaseApp;
  } catch (err) {
    console.error("Failed to initialize Firebase Admin SDK:", err.message);
    throw err;
  }
}
var adminAuth = () => getFirebaseAdmin().auth();

// backend/src/middleware/verifyFirebaseToken.ts
import { Role } from "@prisma/client";
async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Missing or invalid Authorization header" });
    return;
  }
  const token = authHeader.split("Bearer ")[1]?.trim();
  if (!token) {
    res.status(401).json({ error: "Unauthorized: Empty bearer token" });
    return;
  }
  try {
    let uid;
    let email;
    let name = null;
    if (process.env.NODE_ENV === "development" && token.startsWith("dev-mock-token-")) {
      uid = token.replace("dev-mock-token-", "");
      email = `${uid}@test.levix.local`;
      name = "Local Dev User";
    } else {
      const decoded = await adminAuth().verifyIdToken(token);
      uid = decoded.uid;
      email = decoded.email || `${uid}@firebase.levix.local`;
      name = decoded.name || null;
    }
    const user = await prisma.user.upsert({
      where: { firebaseUid: uid },
      update: {
        email,
        name: name || void 0
      },
      create: {
        firebaseUid: uid,
        email,
        name,
        role: Role.CUSTOMER
      }
    });
    req.user = {
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      role: user.role
    };
    next();
  } catch (err) {
    console.error("Firebase token verification failed:", err.message);
    res.status(401).json({ error: "Unauthorized: Invalid or expired Firebase ID token" });
  }
}
async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }
  const token = authHeader.split("Bearer ")[1]?.trim();
  if (!token) return next();
  try {
    let uid;
    let email;
    let name = null;
    if (process.env.NODE_ENV === "development" && token.startsWith("dev-mock-token-")) {
      uid = token.replace("dev-mock-token-", "");
      email = `${uid}@test.levix.local`;
      name = "Local Dev User";
    } else {
      const decoded = await adminAuth().verifyIdToken(token);
      uid = decoded.uid;
      email = decoded.email || `${uid}@firebase.levix.local`;
      name = decoded.name || null;
    }
    const user = await prisma.user.upsert({
      where: { firebaseUid: uid },
      update: { email },
      create: {
        firebaseUid: uid,
        email,
        name,
        role: Role.CUSTOMER
      }
    });
    req.user = {
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      role: user.role
    };
  } catch (err) {
  }
  next();
}
function requireAdmin(req, res, next) {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized: Authentication required" });
    return;
  }
  if (req.user.role !== Role.ADMIN) {
    res.status(403).json({ error: "Forbidden: Admin privileges required" });
    return;
  }
  next();
}

// backend/src/routes/authRoutes.ts
var router = Router();
router.use(authRateLimiter);
router.use(verifyFirebaseToken);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/addresses", addAddress);
router.delete("/addresses/:id", deleteAddress);
var authRoutes_default = router;

// backend/src/routes/productRoutes.ts
import { Router as Router2 } from "express";

// backend/src/controllers/productController.ts
async function getProducts(req, res, next) {
  try {
    const { category, collection, search, sort, page = "1", limit = "12" } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const take = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * take;
    const where = { isActive: true };
    if (category) {
      where.category = { slug: category };
    }
    if (collection) {
      where.collections = {
        some: {
          collection: { slug: collection, isActive: true }
        }
      };
    }
    if (search) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } }
      ];
    }
    let orderBy = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { basePrice: "asc" };
    if (sort === "price-desc") orderBy = { basePrice: "desc" };
    if (sort === "name-asc") orderBy = { name: "asc" };
    if (sort === "featured") orderBy = [{ isFeatured: "desc" }, { createdAt: "desc" }];
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          category: { select: { name: true, slug: true } },
          images: { orderBy: { sortOrder: "asc" }, take: 2 },
          variants: { select: { id: true, size: true, stockQuantity: true } }
        }
      })
    ]);
    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: take,
        total,
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (err) {
    next(err);
  }
}
async function getProductBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: { orderBy: { size: "asc" } },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
          take: 10
        }
      }
    });
    if (!product || !product.isActive) {
      throw new AppError("Product not found or inactive", 404);
    }
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true
      },
      take: 4,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 2 }
      }
    });
    res.json({ product, relatedProducts });
  } catch (err) {
    next(err);
  }
}

// backend/src/routes/productRoutes.ts
var router2 = Router2();
router2.get("/", getProducts);
router2.get("/:slug", getProductBySlug);
var productRoutes_default = router2;

// backend/src/routes/collectionRoutes.ts
import { Router as Router3 } from "express";

// backend/src/controllers/collectionController.ts
async function getCollections(req, res, next) {
  try {
    const collections = await prisma.collection.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { products: true } }
      }
    });
    res.json({ collections });
  } catch (err) {
    next(err);
  }
}
async function getCollectionBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const collection = await prisma.collection.findUnique({
      where: { slug },
      include: {
        products: {
          orderBy: { sortOrder: "asc" },
          include: {
            product: {
              include: {
                category: true,
                images: { orderBy: { sortOrder: "asc" }, take: 2 },
                variants: { select: { id: true, size: true, stockQuantity: true } }
              }
            }
          }
        }
      }
    });
    if (!collection || !collection.isActive) {
      throw new AppError("Collection not found or inactive", 404);
    }
    const products = collection.products.map((cp) => cp.product).filter((p) => p.isActive);
    res.json({
      collection: {
        id: collection.id,
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        bannerImageUrl: collection.bannerImageUrl
      },
      products
    });
  } catch (err) {
    next(err);
  }
}

// backend/src/routes/collectionRoutes.ts
var router3 = Router3();
router3.get("/", getCollections);
router3.get("/:slug", getCollectionBySlug);
var collectionRoutes_default = router3;

// backend/src/routes/cartRoutes.ts
import { Router as Router4 } from "express";

// backend/src/controllers/cartController.ts
import { z as z3 } from "zod";
var addToCartSchema = z3.object({
  variantId: z3.string().uuid(),
  quantity: z3.number().int().min(1).default(1),
  anonymousToken: z3.string().optional()
});
async function getOrCreateCart(userId, anonymousToken) {
  if (userId) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: { orderBy: { sortOrder: "asc" }, take: 1 }
                  }
                }
              }
            }
          }
        }
      }
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    images: { orderBy: { sortOrder: "asc" }, take: 1 }
                  }
                }
              }
            }
          }
        }
      });
    }
    return cart;
  }
  if (anonymousToken) {
    let cart = await prisma.cart.findUnique({
      where: { anonymousToken },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  images: { orderBy: { sortOrder: "asc" }, take: 1 }
                }
              }
            }
          }
        }
      }
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { anonymousToken },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    images: { orderBy: { sortOrder: "asc" }, take: 1 }
                  }
                }
              }
            }
          }
        }
      });
    }
    return cart;
  }
  throw new AppError("Either user authentication or an anonymousToken is required for cart operations", 400);
}
async function getCart(req, res, next) {
  try {
    const anonymousToken = req.query.anonymousToken;
    const cart = await getOrCreateCart(req.user?.id, anonymousToken);
    let subtotalPaise = 0;
    const formattedItems = cart.items.map((item) => {
      const unitPrice = item.variant.product.basePrice + item.variant.priceDelta;
      const total = unitPrice * item.quantity;
      subtotalPaise += total;
      return {
        id: item.id,
        variantId: item.variantId,
        quantity: item.quantity,
        size: item.variant.size,
        stockQuantity: item.variant.stockQuantity,
        productId: item.variant.product.id,
        productName: item.variant.product.name,
        productSlug: item.variant.product.slug,
        unitPricePaise: unitPrice,
        totalPaise: total,
        imageUrl: item.variant.product.images[0]?.url || null
      };
    });
    const FREE_SHIPPING_THRESHOLD_PAISE = 299900;
    const shippingPaise = subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE || subtotalPaise === 0 ? 0 : 15e3;
    const remainingForFreeShippingPaise = Math.max(0, FREE_SHIPPING_THRESHOLD_PAISE - subtotalPaise);
    res.json({
      cartId: cart.id,
      items: formattedItems,
      itemCount: formattedItems.reduce((acc, it) => acc + it.quantity, 0),
      subtotalPaise,
      shippingPaise,
      totalPaise: subtotalPaise + shippingPaise,
      freeShippingThresholdPaise: FREE_SHIPPING_THRESHOLD_PAISE,
      remainingForFreeShippingPaise
    });
  } catch (err) {
    next(err);
  }
}
async function addToCart(req, res, next) {
  try {
    const { variantId, quantity, anonymousToken } = addToCartSchema.parse(req.body);
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true }
    });
    if (!variant || !variant.product.isActive) {
      throw new AppError("Product variant not found or inactive", 404);
    }
    const cart = await getOrCreateCart(req.user?.id, anonymousToken);
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId
        }
      }
    });
    const newQuantity = (existingItem?.quantity || 0) + quantity;
    if (newQuantity > variant.stockQuantity) {
      throw new AppError(`Only ${variant.stockQuantity} items available in stock`, 400);
    }
    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId,
          quantity
        }
      });
    }
    return getCart(req, res, next);
  } catch (err) {
    next(err);
  }
}
async function updateCartItem(req, res, next) {
  try {
    const { id } = req.params;
    const { quantity } = z3.object({ quantity: z3.number().int().min(0) }).parse(req.body);
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: { variant: true, cart: true }
    });
    if (!cartItem) {
      throw new AppError("Cart item not found", 404);
    }
    if (req.user?.id && cartItem.cart.userId !== req.user.id) {
      throw new AppError("Unauthorized access to cart", 403);
    }
    if (quantity === 0) {
      await prisma.cartItem.delete({ where: { id } });
    } else {
      if (quantity > cartItem.variant.stockQuantity) {
        throw new AppError(`Only ${cartItem.variant.stockQuantity} items available in stock`, 400);
      }
      await prisma.cartItem.update({
        where: { id },
        data: { quantity }
      });
    }
    return getCart(req, res, next);
  } catch (err) {
    next(err);
  }
}
async function removeCartItem(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.cartItem.delete({ where: { id } });
    return getCart(req, res, next);
  } catch (err) {
    next(err);
  }
}

// backend/src/routes/cartRoutes.ts
var router4 = Router4();
router4.use(optionalAuth);
router4.get("/", getCart);
router4.post("/items", addToCart);
router4.put("/items/:id", updateCartItem);
router4.delete("/items/:id", removeCartItem);
var cartRoutes_default = router4;

// backend/src/routes/orderRoutes.ts
import { Router as Router5 } from "express";

// backend/src/config/razorpay.ts
import Razorpay from "razorpay";
import crypto from "crypto";
var razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET
});
function verifyPaymentSignature(orderId, paymentId, signature) {
  try {
    const text = `${orderId}|${paymentId}`;
    const generatedSignature = crypto.createHmac("sha256", env.RAZORPAY_KEY_SECRET).update(text).digest("hex");
    return generatedSignature === signature;
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}
function verifyWebhookSignature(body, signature) {
  if (!env.RAZORPAY_WEBHOOK_SECRET) {
    console.warn("RAZORPAY_WEBHOOK_SECRET not configured, skipping HMAC verification");
    return true;
  }
  try {
    const expectedSignature = crypto.createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET).update(body).digest("hex");
    return expectedSignature === signature;
  } catch (err) {
    console.error("Webhook signature verification error:", err);
    return false;
  }
}

// backend/src/controllers/orderController.ts
import { z as z4 } from "zod";
import { OrderStatus, PaymentStatus, DiscountType } from "@prisma/client";
var createOrderSchema = z4.object({
  customerEmail: z4.string().email(),
  customerName: z4.string().min(2),
  customerPhone: z4.string().min(10),
  shippingAddress: z4.object({
    fullName: z4.string().min(2),
    line1: z4.string().min(3),
    line2: z4.string().optional(),
    city: z4.string().min(2),
    state: z4.string().min(2),
    postalCode: z4.string().min(4),
    country: z4.string().default("India"),
    phone: z4.string().min(10)
  }),
  cartId: z4.string().uuid().optional(),
  couponCode: z4.string().optional(),
  anonymousToken: z4.string().optional()
});
async function createOrder(req, res, next) {
  try {
    const data = createOrderSchema.parse(req.body);
    const cartWhere = req.user?.id ? { userId: req.user.id } : data.cartId ? { id: data.cartId } : data.anonymousToken ? { anonymousToken: data.anonymousToken } : null;
    if (!cartWhere) {
      throw new AppError("A valid cart is required to place an order", 400);
    }
    const cart = await prisma.cart.findFirst({
      where: cartWhere,
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } }
                }
              }
            }
          }
        }
      }
    });
    if (!cart || cart.items.length === 0) {
      throw new AppError("Your cart is empty", 400);
    }
    let subtotalPaise = 0;
    for (const item of cart.items) {
      if (item.quantity > item.variant.stockQuantity) {
        throw new AppError(`Product ${item.variant.product.name} (Size: ${item.variant.size}) only has ${item.variant.stockQuantity} in stock`, 400);
      }
      const unitPrice = item.variant.product.basePrice + item.variant.priceDelta;
      subtotalPaise += unitPrice * item.quantity;
    }
    let discountPaise = 0;
    if (data.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: data.couponCode.toUpperCase() }
      });
      if (coupon && coupon.isActive && subtotalPaise >= coupon.minOrderPaise) {
        if (coupon.discountType === DiscountType.PERCENTAGE) {
          discountPaise = Math.round(subtotalPaise * coupon.discountValue / 100);
        } else {
          discountPaise = coupon.discountValue;
        }
      }
    }
    const FREE_SHIPPING_THRESHOLD_PAISE = 299900;
    const shippingPaise = subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE ? 0 : 15e3;
    const totalPaise = Math.max(0, subtotalPaise - discountPaise) + shippingPaise;
    const orderNumber = `BLU-${(/* @__PURE__ */ new Date()).getFullYear()}-${Math.floor(1e5 + Math.random() * 9e5)}`;
    let razorpayOrderId = null;
    try {
      const rzpOrder = await razorpay.orders.create({
        amount: totalPaise,
        // amount in paise
        currency: "INR",
        receipt: orderNumber,
        notes: {
          customerEmail: data.customerEmail,
          customerName: data.customerName
        }
      });
      razorpayOrderId = rzpOrder.id;
    } catch (rzpErr) {
      console.warn("Razorpay order creation fallback (test/sandbox):", rzpErr.message);
      razorpayOrderId = `order_mock_${Date.now()}`;
    }
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: req.user?.id || null,
          customerEmail: data.customerEmail,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          shippingAddressSnapshot: data.shippingAddress,
          subtotalPaise,
          shippingPaise,
          discountPaise,
          totalPaise,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          razorpayOrderId,
          items: {
            create: cart.items.map((item) => ({
              productId: item.variant.product.id,
              variantId: item.variantId,
              productName: item.variant.product.name,
              productSlug: item.variant.product.slug,
              size: item.variant.size,
              unitPricePaise: item.variant.product.basePrice + item.variant.priceDelta,
              quantity: item.quantity,
              subtotalPaise: (item.variant.product.basePrice + item.variant.priceDelta) * item.quantity,
              imageUrl: item.variant.product.images[0]?.url || null
            }))
          }
        },
        include: { items: true }
      });
      return order;
    });
    res.status(201).json({
      order: newOrder,
      razorpayOrderId,
      amountPaise: totalPaise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder"
    });
  } catch (err) {
    next(err);
  }
}
async function getUserOrders(req, res, next) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        payment: true
      }
    });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
}
async function getOrderByNumber(req, res, next) {
  try {
    const { orderNumber } = req.params;
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        payment: true
      }
    });
    if (!order) {
      throw new AppError("Order not found", 404);
    }
    if (req.user && order.userId && order.userId !== req.user.id && req.user.role !== "ADMIN") {
      throw new AppError("Forbidden access to order details", 403);
    }
    res.json({ order });
  } catch (err) {
    next(err);
  }
}

// backend/src/routes/orderRoutes.ts
var router5 = Router5();
router5.post("/", checkoutRateLimiter, optionalAuth, createOrder);
router5.get("/my-orders", verifyFirebaseToken, getUserOrders);
router5.get("/:orderNumber", optionalAuth, getOrderByNumber);
var orderRoutes_default = router5;

// backend/src/routes/paymentRoutes.ts
import { Router as Router6 } from "express";

// backend/src/controllers/paymentController.ts
import { z as z5 } from "zod";
import { OrderStatus as OrderStatus2, PaymentStatus as PaymentStatus2 } from "@prisma/client";
var verifyPaymentSchema = z5.object({
  orderNumber: z5.string(),
  razorpayOrderId: z5.string(),
  razorpayPaymentId: z5.string(),
  razorpaySignature: z5.string(),
  cartId: z5.string().optional()
});
async function verifyPayment(req, res, next) {
  try {
    const { orderNumber, razorpayOrderId, razorpayPaymentId, razorpaySignature, cartId } = verifyPaymentSchema.parse(req.body);
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true, payment: true }
    });
    if (!order) {
      throw new AppError("Order not found", 404);
    }
    if (order.status === OrderStatus2.PAID) {
      res.json({ message: "Order is already marked as paid", order });
      return;
    }
    const isMock = process.env.NODE_ENV === "development" && razorpayPaymentId.startsWith("pay_mock_");
    const isValidSignature = isMock || verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValidSignature) {
      await prisma.payment.upsert({
        where: { orderId: order.id },
        update: {
          status: PaymentStatus2.FAILED,
          razorpayPaymentId,
          razorpaySignature
        },
        create: {
          orderId: order.id,
          amountPaise: order.totalPaise,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          status: PaymentStatus2.FAILED
        }
      });
      throw new AppError("Payment verification failed: Invalid cryptographic signature", 400);
    }
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const ord = await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus2.PAID,
          paymentStatus: PaymentStatus2.PAID
        },
        include: { items: true }
      });
      await tx.payment.upsert({
        where: { orderId: order.id },
        update: {
          status: PaymentStatus2.PAID,
          razorpayPaymentId,
          razorpaySignature
        },
        create: {
          orderId: order.id,
          amountPaise: order.totalPaise,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          status: PaymentStatus2.PAID
        }
      });
      for (const item of order.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stockQuantity: {
                decrement: item.quantity
              }
            }
          });
        }
      }
      if (cartId) {
        await tx.cartItem.deleteMany({
          where: { cartId }
        });
      } else if (order.userId) {
        const userCart = await tx.cart.findUnique({
          where: { userId: order.userId }
        });
        if (userCart) {
          await tx.cartItem.deleteMany({
            where: { cartId: userCart.id }
          });
        }
      }
      return ord;
    });
    res.json({
      success: true,
      message: "Payment verified and order confirmed successfully",
      order: updatedOrder
    });
  } catch (err) {
    next(err);
  }
}
async function handleWebhook(req, res, next) {
  try {
    const signature = req.headers["x-razorpay-signature"];
    if (!signature) {
      res.status(400).json({ error: "Missing Razorpay webhook signature" });
      return;
    }
    const rawBody = req.rawBody || JSON.stringify(req.body);
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      res.status(400).json({ error: "Invalid webhook signature" });
      return;
    }
    const event = req.body.event;
    const payload = req.body.payload;
    if (event === "payment.captured") {
      const paymentEntity = payload.payment.entity;
      const rzpOrderId = paymentEntity.order_id;
      if (rzpOrderId) {
        const order = await prisma.order.findUnique({
          where: { razorpayOrderId: rzpOrderId },
          include: { items: true }
        });
        if (order && order.status !== OrderStatus2.PAID) {
          await prisma.$transaction(async (tx) => {
            await tx.order.update({
              where: { id: order.id },
              data: {
                status: OrderStatus2.PAID,
                paymentStatus: PaymentStatus2.PAID
              }
            });
            await tx.payment.upsert({
              where: { orderId: order.id },
              update: {
                status: PaymentStatus2.PAID,
                razorpayPaymentId: paymentEntity.id,
                rawPayload: payload
              },
              create: {
                orderId: order.id,
                amountPaise: paymentEntity.amount,
                razorpayOrderId: rzpOrderId,
                razorpayPaymentId: paymentEntity.id,
                status: PaymentStatus2.PAID,
                rawPayload: payload
              }
            });
            for (const item of order.items) {
              if (item.variantId) {
                await tx.productVariant.update({
                  where: { id: item.variantId },
                  data: {
                    stockQuantity: {
                      decrement: item.quantity
                    }
                  }
                });
              }
            }
          });
        }
      }
    }
    res.json({ status: "ok" });
  } catch (err) {
    next(err);
  }
}

// backend/src/routes/paymentRoutes.ts
var router6 = Router6();
router6.post("/verify", checkoutRateLimiter, verifyPayment);
router6.post("/webhook", handleWebhook);
var paymentRoutes_default = router6;

// backend/src/routes/adminRoutes.ts
import { Router as Router7 } from "express";

// backend/src/controllers/adminController.ts
import { z as z6 } from "zod";
import { OrderStatus as OrderStatus3 } from "@prisma/client";
async function getDashboardMetrics(req, res, next) {
  try {
    const [totalOrders, paidOrders, totalCustomers, totalProducts, lowStockVariants, recentOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({
        where: { paymentStatus: "PAID" },
        select: { totalPaise: true }
      }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.productVariant.findMany({
        where: { stockQuantity: { lte: 5 } },
        include: { product: { select: { name: true, slug: true } } },
        take: 10
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: true }
      })
    ]);
    const totalRevenuePaise = paidOrders.reduce((sum, ord) => sum + ord.totalPaise, 0);
    res.json({
      metrics: {
        totalOrders,
        totalRevenuePaise,
        totalRevenueINR: Math.round(totalRevenuePaise / 100),
        totalCustomers,
        totalProducts,
        lowStockAlertsCount: lowStockVariants.length
      },
      lowStockVariants,
      recentOrders
    });
  } catch (err) {
    next(err);
  }
}
async function getAllOrders(req, res, next) {
  try {
    const { status, page = "1", limit = "20" } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const take = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * take;
    const where = {};
    if (status) {
      where.status = status;
    }
    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        include: { items: true, payment: true }
      })
    ]);
    res.json({
      orders,
      pagination: {
        page: pageNum,
        limit: take,
        total,
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (err) {
    next(err);
  }
}
async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = z6.object({
      status: z6.nativeEnum(OrderStatus3)
    }).parse(req.body);
    const updated = await prisma.order.update({
      where: { id },
      data: { status }
    });
    res.json({ order: updated });
  } catch (err) {
    next(err);
  }
}
async function createProduct(req, res, next) {
  try {
    const productSchema = z6.object({
      name: z6.string().min(2),
      slug: z6.string().min(2),
      description: z6.string().min(10),
      details: z6.string().optional(),
      fabricCare: z6.string().optional(),
      fitGuide: z6.string().optional(),
      basePrice: z6.number().int().positive(),
      // in paise
      comparePrice: z6.number().int().positive().optional(),
      categoryId: z6.string().uuid().optional(),
      isFeatured: z6.boolean().default(false),
      images: z6.array(z6.object({
        url: z6.string().url(),
        altText: z6.string().optional(),
        isCover: z6.boolean().default(false),
        sortOrder: z6.number().int().default(0)
      })).min(1),
      variants: z6.array(z6.object({
        size: z6.string(),
        sku: z6.string(),
        stockQuantity: z6.number().int().min(0),
        priceDelta: z6.number().int().default(0)
      })).min(1)
    });
    const data = productSchema.parse(req.body);
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        details: data.details,
        fabricCare: data.fabricCare,
        fitGuide: data.fitGuide,
        basePrice: data.basePrice,
        comparePrice: data.comparePrice,
        categoryId: data.categoryId,
        isFeatured: data.isFeatured,
        images: { create: data.images },
        variants: { create: data.variants }
      },
      include: {
        images: true,
        variants: true
      }
    });
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
}

// backend/src/routes/adminRoutes.ts
var router7 = Router7();
router7.use(verifyFirebaseToken);
router7.use(requireAdmin);
router7.get("/metrics", getDashboardMetrics);
router7.get("/orders", getAllOrders);
router7.patch("/orders/:id/status", updateOrderStatus);
router7.post("/products", createProduct);
var adminRoutes_default = router7;

// backend/src/app.ts
var app = express();
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
var cleanFrontendUrl = (env.FRONTEND_URL || "").replace(/\/+$/, "");
var allowedOrigins = /* @__PURE__ */ new Set([
  cleanFrontendUrl,
  "https://thelevix.shop",
  "https://www.thelevix.shop",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost"
]);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (env.NODE_ENV !== "production" || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json({
  limit: "5mb",
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use("/api", apiRateLimiter);
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "levix-backend",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uptime: process.uptime(),
    nodeEnv: env.NODE_ENV
  });
});
app.use("/api/auth", authRoutes_default);
app.use("/api/products", productRoutes_default);
app.use("/api/collections", collectionRoutes_default);
app.use("/api/cart", cartRoutes_default);
app.use("/api/orders", orderRoutes_default);
app.use("/api/payments", paymentRoutes_default);
app.use("/api/admin", adminRoutes_default);
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var frontendDist = path.resolve(__dirname, "../../frontend/dist");
if (fs2.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}
app.use(errorHandler);

// backend/src/server.ts
var PORT = env.PORT || 4e3;
async function bootstrap() {
  try {
    await prisma.$connect();
    console.log("\u2713 Connected to MySQL database via Prisma ORM.");
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`\u2713 Levix API server actively listening on http://0.0.0.0:${PORT} [${env.NODE_ENV}]`);
    });
    const shutdown = async (signal) => {
      console.log(`Received ${signal}. Gracefully terminating server...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log("Database connection closed. Exiting process.");
        process.exit(0);
      });
    };
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (err) {
    console.error("CRITICAL: Server failed to start:", err.message);
    process.exit(1);
  }
}
bootstrap();
