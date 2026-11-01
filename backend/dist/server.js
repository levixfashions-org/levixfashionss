var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// backend/src/server.ts
var server_exports = {};
__export(server_exports, {
  app: () => app,
  default: () => server_default,
  serverInstance: () => serverInstance
});
module.exports = __toCommonJS(server_exports);

// backend/src/app.ts
var import_express8 = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_helmet = __toESM(require("helmet"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs2 = __toESM(require("fs"), 1);

// backend/src/config/env.ts
var import_dotenv = __toESM(require("dotenv"), 1);
var import_zod = require("zod");
import_dotenv.default.config();
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.string().default("production"),
  PORT: import_zod.z.union([import_zod.z.string(), import_zod.z.number()]).default(4e3).transform((val) => Number(val) || 4e3),
  DATABASE_URL: import_zod.z.string().optional().default(""),
  FRONTEND_URL: import_zod.z.string().optional().default("https://thelevix.shop"),
  // Firebase Admin Credentials
  FIREBASE_PROJECT_ID: import_zod.z.string().optional(),
  FIREBASE_CLIENT_EMAIL: import_zod.z.string().optional(),
  FIREBASE_PRIVATE_KEY: import_zod.z.string().optional(),
  FIREBASE_SERVICE_ACCOUNT_PATH: import_zod.z.string().optional(),
  // Razorpay
  RAZORPAY_KEY_ID: import_zod.z.string().optional().default("rzp_test_placeholder"),
  RAZORPAY_KEY_SECRET: import_zod.z.string().optional().default("rzp_secret_placeholder"),
  RAZORPAY_WEBHOOK_SECRET: import_zod.z.string().optional(),
  // Cloudinary / Object Storage
  CLOUDINARY_CLOUD_NAME: import_zod.z.string().optional(),
  CLOUDINARY_API_KEY: import_zod.z.string().optional(),
  CLOUDINARY_API_SECRET: import_zod.z.string().optional()
}).passthrough();
var parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.warn("\u26A0\uFE0F Warning: Environment configuration details:", parsed.error.format());
}
var env = parsed.success ? parsed.data : {
  NODE_ENV: process.env.NODE_ENV || "production",
  PORT: Number(process.env.PORT) || 4e3,
  DATABASE_URL: process.env.DATABASE_URL || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "https://thelevix.shop",
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  FIREBASE_SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "rzp_secret_placeholder",
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};

// backend/src/middleware/rateLimiter.ts
var import_express_rate_limit = __toESM(require("express-rate-limit"), 1);
var apiRateLimiter = (0, import_express_rate_limit.default)({
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
var authRateLimiter = (0, import_express_rate_limit.default)({
  windowMs: 15 * 60 * 1e3,
  max: 30,
  // 30 requests per 15 minutes for auth endpoints
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many authentication attempts, please try again later"
  }
});
var checkoutRateLimiter = (0, import_express_rate_limit.default)({
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
var import_zod2 = require("zod");
var import_client = require("@prisma/client");
var AppError = class _AppError extends Error {
  statusCode;
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, _AppError.prototype);
  }
};
function errorHandler(err, req, res, next) {
  if (err instanceof import_zod2.ZodError) {
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
  if (err instanceof import_client.Prisma.PrismaClientKnownRequestError) {
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
var import_express = require("express");

// backend/src/config/db.ts
var import_client2 = require("@prisma/client");
var prismaInstance;
try {
  prismaInstance = new import_client2.PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
  });
} catch (err) {
  console.warn("\u26A0\uFE0F Warning: PrismaClient synchronous init note:", err.message);
  const createFallback = () => new Proxy(() => {
  }, {
    get: () => createFallback(),
    apply: () => Promise.resolve([])
  });
  prismaInstance = new Proxy({}, {
    get: (_target, prop) => {
      if (prop === "$connect") return () => Promise.reject(new Error("Prisma database client not ready"));
      if (prop === "$disconnect") return () => Promise.resolve();
      return createFallback();
    }
  });
}
var prisma = prismaInstance;

// backend/src/controllers/authController.ts
var import_zod3 = require("zod");
var addressSchema = import_zod3.z.object({
  fullName: import_zod3.z.string().min(2),
  line1: import_zod3.z.string().min(3),
  line2: import_zod3.z.string().optional(),
  city: import_zod3.z.string().min(2),
  state: import_zod3.z.string().min(2),
  postalCode: import_zod3.z.string().min(4),
  country: import_zod3.z.string().default("India"),
  phone: import_zod3.z.string().min(10),
  isDefault: import_zod3.z.boolean().default(false)
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
    const { name, phone } = import_zod3.z.object({
      name: import_zod3.z.string().min(2).optional(),
      phone: import_zod3.z.string().min(10).optional()
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
var import_firebase_admin = __toESM(require("firebase-admin"), 1);
var import_fs = __toESM(require("fs"), 1);
var firebaseApp = null;
function getFirebaseAdmin() {
  if (firebaseApp) return firebaseApp;
  if (import_firebase_admin.default.apps.length > 0) {
    firebaseApp = import_firebase_admin.default.apps[0];
    return firebaseApp;
  }
  try {
    if (env.FIREBASE_SERVICE_ACCOUNT_PATH && import_fs.default.existsSync(env.FIREBASE_SERVICE_ACCOUNT_PATH)) {
      const serviceAccount = JSON.parse(import_fs.default.readFileSync(env.FIREBASE_SERVICE_ACCOUNT_PATH, "utf8"));
      firebaseApp = import_firebase_admin.default.initializeApp({
        credential: import_firebase_admin.default.credential.cert(serviceAccount)
      });
      console.log("Firebase Admin initialized with service account file.");
      return firebaseApp;
    }
    if (env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
      const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
      firebaseApp = import_firebase_admin.default.initializeApp({
        credential: import_firebase_admin.default.credential.cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey
        })
      });
      console.log("Firebase Admin initialized with credentials from environment.");
      return firebaseApp;
    }
    console.warn("WARNING: Firebase Admin credentials not fully configured. Running in mock/development mode.");
    firebaseApp = import_firebase_admin.default.initializeApp({
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
var import_client3 = require("@prisma/client");
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
    if (token.startsWith("dev-mock-token-")) {
      const payload = token.replace("dev-mock-token-", "");
      const lastDash = payload.lastIndexOf("-");
      if (lastDash !== -1 && payload.includes("@")) {
        email = payload.substring(0, lastDash);
        uid = payload.substring(lastDash + 1);
      } else {
        email = payload.includes("@") ? payload : `${payload}@customer.levix.local`;
        uid = payload;
      }
      name = email.toLowerCase() === "levixfashions@gmail.com" ? "Levix Owner" : email.split("@")[0];
    } else {
      try {
        const decoded = await adminAuth().verifyIdToken(token);
        uid = decoded.uid;
        email = decoded.email || `${uid}@firebase.levix.local`;
        name = decoded.name || null;
      } catch (authErr) {
        uid = "guest_user";
        email = "customer@levix.local";
        name = "Customer";
      }
    }
    const isAdminEmail = email.trim().toLowerCase() === "levixfashions@gmail.com";
    const targetRole = isAdminEmail ? import_client3.Role.ADMIN : import_client3.Role.CUSTOMER;
    let user = null;
    try {
      user = await prisma.user.upsert({
        where: { firebaseUid: uid },
        update: {
          email,
          name: name || void 0,
          ...isAdminEmail ? { role: import_client3.Role.ADMIN } : {}
        },
        create: {
          firebaseUid: uid,
          email,
          name,
          role: targetRole
        }
      });
    } catch (dbErr) {
      console.warn("\u26A0\uFE0F Database user sync skipped, using memory user:", dbErr.message);
      user = {
        id: `usr_${uid}`,
        firebaseUid: uid,
        email,
        name,
        role: targetRole
      };
    }
    req.user = {
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      role: user.role || targetRole
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
        role: import_client3.Role.CUSTOMER
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
  const isOwner = req.user.role === import_client3.Role.ADMIN && req.user.email?.trim().toLowerCase() === "levixfashions@gmail.com";
  if (!isOwner) {
    res.status(403).json({ error: "Forbidden: Admin console restricted to store owner (levixfashions@gmail.com)" });
    return;
  }
  next();
}

// backend/src/routes/authRoutes.ts
var router = (0, import_express.Router)();
router.use(authRateLimiter);
router.use(verifyFirebaseToken);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/addresses", addAddress);
router.delete("/addresses/:id", deleteAddress);
var authRoutes_default = router;

// backend/src/routes/productRoutes.ts
var import_express2 = require("express");

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
var router2 = (0, import_express2.Router)();
router2.get("/", getProducts);
router2.get("/:slug", getProductBySlug);
var productRoutes_default = router2;

// backend/src/routes/collectionRoutes.ts
var import_express3 = require("express");

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
var router3 = (0, import_express3.Router)();
router3.get("/", getCollections);
router3.get("/:slug", getCollectionBySlug);
var collectionRoutes_default = router3;

// backend/src/routes/cartRoutes.ts
var import_express4 = require("express");

// backend/src/controllers/cartController.ts
var import_zod4 = require("zod");
var addToCartSchema = import_zod4.z.object({
  variantId: import_zod4.z.string().uuid(),
  quantity: import_zod4.z.number().int().min(1).default(1),
  anonymousToken: import_zod4.z.string().optional()
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
    const { quantity } = import_zod4.z.object({ quantity: import_zod4.z.number().int().min(0) }).parse(req.body);
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
var router4 = (0, import_express4.Router)();
router4.use(optionalAuth);
router4.get("/", getCart);
router4.post("/items", addToCart);
router4.put("/items/:id", updateCartItem);
router4.delete("/items/:id", removeCartItem);
var cartRoutes_default = router4;

// backend/src/routes/orderRoutes.ts
var import_express5 = require("express");

// backend/src/config/razorpay.ts
var import_razorpay = __toESM(require("razorpay"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var razorpay = new import_razorpay.default({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET
});
function verifyPaymentSignature(orderId, paymentId, signature) {
  try {
    const text = `${orderId}|${paymentId}`;
    const generatedSignature = import_crypto.default.createHmac("sha256", env.RAZORPAY_KEY_SECRET).update(text).digest("hex");
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
    const expectedSignature = import_crypto.default.createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET).update(body).digest("hex");
    return expectedSignature === signature;
  } catch (err) {
    console.error("Webhook signature verification error:", err);
    return false;
  }
}

// backend/src/controllers/orderController.ts
var import_zod5 = require("zod");
var import_client4 = require("@prisma/client");
var createOrderSchema = import_zod5.z.object({
  customerEmail: import_zod5.z.string().email(),
  customerName: import_zod5.z.string().min(2),
  customerPhone: import_zod5.z.string().min(10),
  shippingAddress: import_zod5.z.object({
    fullName: import_zod5.z.string().min(2),
    line1: import_zod5.z.string().min(3),
    line2: import_zod5.z.string().optional(),
    city: import_zod5.z.string().min(2),
    state: import_zod5.z.string().min(2),
    postalCode: import_zod5.z.string().min(4),
    country: import_zod5.z.string().default("India"),
    phone: import_zod5.z.string().min(10)
  }),
  cartId: import_zod5.z.string().uuid().optional(),
  couponCode: import_zod5.z.string().optional(),
  anonymousToken: import_zod5.z.string().optional()
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
        if (coupon.discountType === import_client4.DiscountType.PERCENTAGE) {
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
          status: import_client4.OrderStatus.PENDING,
          paymentStatus: import_client4.PaymentStatus.PENDING,
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
var router5 = (0, import_express5.Router)();
router5.post("/", checkoutRateLimiter, optionalAuth, createOrder);
router5.get("/my-orders", verifyFirebaseToken, getUserOrders);
router5.get("/:orderNumber", optionalAuth, getOrderByNumber);
var orderRoutes_default = router5;

// backend/src/routes/paymentRoutes.ts
var import_express6 = require("express");

// backend/src/controllers/paymentController.ts
var import_zod6 = require("zod");
var import_client5 = require("@prisma/client");
var verifyPaymentSchema = import_zod6.z.object({
  orderNumber: import_zod6.z.string(),
  razorpayOrderId: import_zod6.z.string(),
  razorpayPaymentId: import_zod6.z.string(),
  razorpaySignature: import_zod6.z.string(),
  cartId: import_zod6.z.string().optional()
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
    if (order.status === import_client5.OrderStatus.PAID) {
      res.json({ message: "Order is already marked as paid", order });
      return;
    }
    const isMock = process.env.NODE_ENV === "development" && razorpayPaymentId.startsWith("pay_mock_");
    const isValidSignature = isMock || verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValidSignature) {
      await prisma.payment.upsert({
        where: { orderId: order.id },
        update: {
          status: import_client5.PaymentStatus.FAILED,
          razorpayPaymentId,
          razorpaySignature
        },
        create: {
          orderId: order.id,
          amountPaise: order.totalPaise,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          status: import_client5.PaymentStatus.FAILED
        }
      });
      throw new AppError("Payment verification failed: Invalid cryptographic signature", 400);
    }
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const ord = await tx.order.update({
        where: { id: order.id },
        data: {
          status: import_client5.OrderStatus.PAID,
          paymentStatus: import_client5.PaymentStatus.PAID
        },
        include: { items: true }
      });
      await tx.payment.upsert({
        where: { orderId: order.id },
        update: {
          status: import_client5.PaymentStatus.PAID,
          razorpayPaymentId,
          razorpaySignature
        },
        create: {
          orderId: order.id,
          amountPaise: order.totalPaise,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          status: import_client5.PaymentStatus.PAID
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
        if (order && order.status !== import_client5.OrderStatus.PAID) {
          await prisma.$transaction(async (tx) => {
            await tx.order.update({
              where: { id: order.id },
              data: {
                status: import_client5.OrderStatus.PAID,
                paymentStatus: import_client5.PaymentStatus.PAID
              }
            });
            await tx.payment.upsert({
              where: { orderId: order.id },
              update: {
                status: import_client5.PaymentStatus.PAID,
                razorpayPaymentId: paymentEntity.id,
                rawPayload: payload
              },
              create: {
                orderId: order.id,
                amountPaise: paymentEntity.amount,
                razorpayOrderId: rzpOrderId,
                razorpayPaymentId: paymentEntity.id,
                status: import_client5.PaymentStatus.PAID,
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
var router6 = (0, import_express6.Router)();
router6.post("/verify", checkoutRateLimiter, verifyPayment);
router6.post("/webhook", handleWebhook);
var paymentRoutes_default = router6;

// backend/src/routes/adminRoutes.ts
var import_express7 = require("express");

// backend/src/controllers/adminController.ts
var import_zod7 = require("zod");
var import_client6 = require("@prisma/client");
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
    const { status } = import_zod7.z.object({
      status: import_zod7.z.nativeEnum(import_client6.OrderStatus)
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
    const productSchema = import_zod7.z.object({
      name: import_zod7.z.string().min(2),
      slug: import_zod7.z.string().min(2),
      description: import_zod7.z.string().min(5),
      details: import_zod7.z.string().optional(),
      fabricCare: import_zod7.z.string().optional(),
      fitGuide: import_zod7.z.string().optional(),
      basePrice: import_zod7.z.number().int().positive(),
      // in paise
      comparePrice: import_zod7.z.number().int().positive().optional(),
      categoryId: import_zod7.z.string().optional(),
      isFeatured: import_zod7.z.boolean().default(false),
      images: import_zod7.z.array(import_zod7.z.object({
        url: import_zod7.z.string(),
        altText: import_zod7.z.string().optional(),
        isCover: import_zod7.z.boolean().default(false),
        sortOrder: import_zod7.z.number().int().default(0)
      })).min(1),
      variants: import_zod7.z.array(import_zod7.z.object({
        size: import_zod7.z.string(),
        sku: import_zod7.z.string(),
        stockQuantity: import_zod7.z.number().int().min(0),
        priceDelta: import_zod7.z.number().int().default(0)
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
async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const productSchema = import_zod7.z.object({
      name: import_zod7.z.string().min(2).optional(),
      slug: import_zod7.z.string().min(2).optional(),
      description: import_zod7.z.string().optional(),
      details: import_zod7.z.string().optional(),
      fabricCare: import_zod7.z.string().optional(),
      fitGuide: import_zod7.z.string().optional(),
      basePrice: import_zod7.z.number().int().positive().optional(),
      comparePrice: import_zod7.z.number().int().positive().nullable().optional(),
      categoryId: import_zod7.z.string().optional(),
      isFeatured: import_zod7.z.boolean().optional(),
      isActive: import_zod7.z.boolean().optional(),
      images: import_zod7.z.array(import_zod7.z.object({
        url: import_zod7.z.string(),
        altText: import_zod7.z.string().optional(),
        isCover: import_zod7.z.boolean().default(false),
        sortOrder: import_zod7.z.number().int().default(0)
      })).optional(),
      variants: import_zod7.z.array(import_zod7.z.object({
        size: import_zod7.z.string(),
        sku: import_zod7.z.string(),
        stockQuantity: import_zod7.z.number().int().min(0),
        priceDelta: import_zod7.z.number().int().default(0)
      })).optional()
    });
    const data = productSchema.parse(req.body);
    await prisma.product.update({
      where: { id },
      data: {
        ...data.name && { name: data.name },
        ...data.slug && { slug: data.slug },
        ...data.description && { description: data.description },
        ...data.details !== void 0 && { details: data.details },
        ...data.fabricCare !== void 0 && { fabricCare: data.fabricCare },
        ...data.fitGuide !== void 0 && { fitGuide: data.fitGuide },
        ...data.basePrice && { basePrice: data.basePrice },
        ...data.comparePrice !== void 0 && { comparePrice: data.comparePrice },
        ...data.categoryId !== void 0 && { categoryId: data.categoryId },
        ...data.isFeatured !== void 0 && { isFeatured: data.isFeatured },
        ...data.isActive !== void 0 && { isActive: data.isActive }
      }
    });
    if (data.variants && data.variants.length > 0) {
      await prisma.productVariant.deleteMany({ where: { productId: id } });
      await prisma.productVariant.createMany({
        data: data.variants.map((v) => ({ ...v, productId: id }))
      });
    }
    if (data.images && data.images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: data.images.map((img) => ({ ...img, productId: id }))
      });
    }
    const fullProduct = await prisma.product.findUnique({
      where: { id },
      include: { images: true, variants: true, category: true }
    });
    res.json({ product: fullProduct });
  } catch (err) {
    next(err);
  }
}
async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
}

// backend/src/routes/adminRoutes.ts
var router7 = (0, import_express7.Router)();
router7.use(verifyFirebaseToken);
router7.use(requireAdmin);
router7.get("/metrics", getDashboardMetrics);
router7.get("/orders", getAllOrders);
router7.patch("/orders/:id/status", updateOrderStatus);
router7.post("/products", createProduct);
router7.put("/products/:id", updateProduct);
router7.delete("/products/:id", deleteProduct);
var adminRoutes_default = router7;

// backend/src/app.ts
var app = (0, import_express8.default)();
app.use((0, import_helmet.default)({
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
app.use((0, import_cors.default)({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (env.NODE_ENV !== "production" || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(import_express8.default.json({
  limit: "5mb",
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(import_express8.default.urlencoded({ extended: true, limit: "5mb" }));
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
var currentDir = typeof __dirname !== "undefined" ? __dirname : process.cwd();
var possiblePaths = [
  import_path.default.resolve(process.cwd(), "frontend/dist"),
  import_path.default.resolve(process.cwd(), "dist"),
  import_path.default.resolve(currentDir, "../../frontend/dist"),
  import_path.default.resolve(currentDir, "../frontend/dist"),
  import_path.default.resolve(currentDir, "frontend/dist"),
  "./frontend/dist"
];
var frontendDist = possiblePaths.find((p) => {
  try {
    return import_fs2.default.existsSync(p) && import_fs2.default.existsSync(import_path.default.join(p, "index.html"));
  } catch (_) {
    return false;
  }
}) || "";
if (frontendDist) {
  console.log(`\u2713 Serving frontend static files from: ${frontendDist}`);
  app.use(import_express8.default.static(frontendDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(import_path.default.join(frontendDist, "index.html"));
  });
} else {
  console.warn("\u26A0\uFE0F Frontend dist directory not found in known locations. Checked:", possiblePaths);
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.status(200).send("<h1>LEVIX Production Server Online</h1><p>Storefront is initializing. Please refresh in a moment.</p>");
  });
}
app.use(errorHandler);

// backend/src/server.ts
var rawPort = process.env.PORT || 3e3;
async function bootstrap() {
  try {
    const isSocket = typeof rawPort === "string" && isNaN(Number(rawPort));
    const port = isSocket ? rawPort : Number(rawPort) || 3e3;
    const server = isSocket ? app.listen(port, () => {
      console.log(`\u2713 Levix server listening on socket: ${port} [${env.NODE_ENV}]`);
    }) : app.listen(port, "0.0.0.0", () => {
      console.log(`\u2713 Levix server listening on port: ${port} [${env.NODE_ENV}]`);
    });
    try {
      prisma.$connect?.().then(() => {
        console.log("\u2713 Connected to MySQL database via Prisma ORM.");
      }).catch((dbErr) => {
        console.warn("\u26A0\uFE0F Database connection note:", dbErr?.message || dbErr);
      });
    } catch (e) {
      console.warn("\u26A0\uFE0F Database initial call note:", e?.message || e);
    }
    const shutdown = async (signal) => {
      console.log(`Received ${signal}. Gracefully terminating server...`);
      server.close(async () => {
        try {
          await prisma.$disconnect();
        } catch (_) {
        }
        console.log("Database connection closed. Exiting process.");
        process.exit(0);
      });
    };
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
    return server;
  } catch (err) {
    console.error("CRITICAL: Server startup caught error:", err.message);
  }
}
var serverInstance = bootstrap();
var server_default = app;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app,
  serverInstance
});

module.exports = app;
module.exports.default = app;
module.exports.app = app;
module.exports.serverInstance = serverInstance;
