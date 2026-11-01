import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { verifyPaymentSignature, verifyWebhookSignature } from '../config/razorpay.js';
import { AppError } from '../middleware/errorHandler.js';
import { z } from 'zod';
import { OrderStatus, PaymentStatus } from '@prisma/client';

const verifyPaymentSchema = z.object({
  orderNumber: z.string(),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
  cartId: z.string().optional()
});

export async function verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderNumber, razorpayOrderId, razorpayPaymentId, razorpaySignature, cartId } = verifyPaymentSchema.parse(req.body);

    // 1. Fetch Order
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true, payment: true }
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.status === OrderStatus.PAID) {
      res.json({ message: 'Order is already marked as paid', order });
      return;
    }

    // 2. Cryptographic HMAC Signature Verification
    // Allow development test bypass only if running in mock/dev mode
    const isMock = process.env.NODE_ENV === 'development' && razorpayPaymentId.startsWith('pay_mock_');
    const isValidSignature = isMock || verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValidSignature) {
      // Record failed payment attempt
      await prisma.payment.upsert({
        where: { orderId: order.id },
        update: {
          status: PaymentStatus.FAILED,
          razorpayPaymentId,
          razorpaySignature
        },
        create: {
          orderId: order.id,
          amountPaise: order.totalPaise,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          status: PaymentStatus.FAILED
        }
      });
      throw new AppError('Payment verification failed: Invalid cryptographic signature', 400);
    }

    // 3. Atomic Database Transaction:
    // Update order status, record payment, deduct inventory, and clear user cart
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // A. Update Order
      const ord = await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.PAID,
          paymentStatus: PaymentStatus.PAID
        },
        include: { items: true }
      });

      // B. Upsert Payment
      await tx.payment.upsert({
        where: { orderId: order.id },
        update: {
          status: PaymentStatus.PAID,
          razorpayPaymentId,
          razorpaySignature
        },
        create: {
          orderId: order.id,
          amountPaise: order.totalPaise,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          status: PaymentStatus.PAID
        }
      });

      // C. Atomic Inventory Decrement
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

      // D. Clear Cart
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
      message: 'Payment verified and order confirmed successfully',
      order: updatedOrder
    });
  } catch (err) {
    next(err);
  }
}

export async function handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    if (!signature) {
      res.status(400).json({ error: 'Missing Razorpay webhook signature' });
      return;
    }

    // Pass raw body for HMAC check
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);
    const isValid = verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      res.status(400).json({ error: 'Invalid webhook signature' });
      return;
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'payment.captured') {
      const paymentEntity = payload.payment.entity;
      const rzpOrderId = paymentEntity.order_id;

      if (rzpOrderId) {
        const order = await prisma.order.findUnique({
          where: { razorpayOrderId: rzpOrderId },
          include: { items: true }
        });

        if (order && order.status !== OrderStatus.PAID) {
          await prisma.$transaction(async (tx) => {
            await tx.order.update({
              where: { id: order.id },
              data: {
                status: OrderStatus.PAID,
                paymentStatus: PaymentStatus.PAID
              }
            });

            await tx.payment.upsert({
              where: { orderId: order.id },
              update: {
                status: PaymentStatus.PAID,
                razorpayPaymentId: paymentEntity.id,
                rawPayload: payload
              },
              create: {
                orderId: order.id,
                amountPaise: paymentEntity.amount,
                razorpayOrderId: rzpOrderId,
                razorpayPaymentId: paymentEntity.id,
                status: PaymentStatus.PAID,
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

    res.json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
}
