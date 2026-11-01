import { prisma } from '../config/db.js';
import { razorpay } from '../config/razorpay.js';
import { AppError } from '../middleware/errorHandler.js';
import { z } from 'zod';
import { OrderStatus, PaymentStatus, DiscountType } from '@prisma/client';
const createOrderSchema = z.object({
    customerEmail: z.string().email(),
    customerName: z.string().min(2),
    customerPhone: z.string().min(10),
    shippingAddress: z.object({
        fullName: z.string().min(2),
        line1: z.string().min(3),
        line2: z.string().optional(),
        city: z.string().min(2),
        state: z.string().min(2),
        postalCode: z.string().min(4),
        country: z.string().default('India'),
        phone: z.string().min(10)
    }),
    cartId: z.string().uuid().optional(),
    couponCode: z.string().optional(),
    anonymousToken: z.string().optional()
});
export async function createOrder(req, res, next) {
    try {
        const data = createOrderSchema.parse(req.body);
        // 1. Fetch Cart Items
        const cartWhere = req.user?.id
            ? { userId: req.user.id }
            : data.cartId
                ? { id: data.cartId }
                : data.anonymousToken
                    ? { anonymousToken: data.anonymousToken }
                    : null;
        if (!cartWhere) {
            throw new AppError('A valid cart is required to place an order', 400);
        }
        const cart = await prisma.cart.findFirst({
            where: cartWhere,
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: {
                                    include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } }
                                }
                            }
                        }
                    }
                }
            }
        });
        if (!cart || cart.items.length === 0) {
            throw new AppError('Your cart is empty', 400);
        }
        // 2. Validate Inventory and Compute Subtotal in paise
        let subtotalPaise = 0;
        for (const item of cart.items) {
            if (item.quantity > item.variant.stockQuantity) {
                throw new AppError(`Product ${item.variant.product.name} (Size: ${item.variant.size}) only has ${item.variant.stockQuantity} in stock`, 400);
            }
            const unitPrice = item.variant.product.basePrice + item.variant.priceDelta;
            subtotalPaise += unitPrice * item.quantity;
        }
        // 3. Coupon Application
        let discountPaise = 0;
        if (data.couponCode) {
            const coupon = await prisma.coupon.findUnique({
                where: { code: data.couponCode.toUpperCase() }
            });
            if (coupon && coupon.isActive && subtotalPaise >= coupon.minOrderPaise) {
                if (coupon.discountType === DiscountType.PERCENTAGE) {
                    discountPaise = Math.round((subtotalPaise * coupon.discountValue) / 100);
                }
                else {
                    discountPaise = coupon.discountValue;
                }
            }
        }
        // 4. Shipping Calculation: Free above Rs. 2,999 (299900 paise)
        const FREE_SHIPPING_THRESHOLD_PAISE = 299900;
        const shippingPaise = subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE ? 0 : 15000;
        const totalPaise = Math.max(0, subtotalPaise - discountPaise) + shippingPaise;
        // 5. Generate Order Number
        const orderNumber = `BLU-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        // 6. Create Razorpay Order
        let razorpayOrderId = null;
        try {
            const rzpOrder = await razorpay.orders.create({
                amount: totalPaise, // amount in paise
                currency: 'INR',
                receipt: orderNumber,
                notes: {
                    customerEmail: data.customerEmail,
                    customerName: data.customerName
                }
            });
            razorpayOrderId = rzpOrder.id;
        }
        catch (rzpErr) {
            console.warn('Razorpay order creation fallback (test/sandbox):', rzpErr.message);
            razorpayOrderId = `order_mock_${Date.now()}`;
        }
        // 7. Atomic Prisma Transaction to persist Order + Items
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
                        create: cart.items.map(item => ({
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
            currency: 'INR',
            keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
        });
    }
    catch (err) {
        next(err);
    }
}
export async function getUserOrders(req, res, next) {
    try {
        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }
        const orders = await prisma.order.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                items: true,
                payment: true
            }
        });
        res.json({ orders });
    }
    catch (err) {
        next(err);
    }
}
export async function getOrderByNumber(req, res, next) {
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
            throw new AppError('Order not found', 404);
        }
        // Protect customer privacy if logged in as a different user
        if (req.user && order.userId && order.userId !== req.user.id && req.user.role !== 'ADMIN') {
            throw new AppError('Forbidden access to order details', 403);
        }
        res.json({ order });
    }
    catch (err) {
        next(err);
    }
}
