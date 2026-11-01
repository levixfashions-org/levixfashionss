import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';
import { z } from 'zod';

const addToCartSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).default(1),
  anonymousToken: z.string().optional()
});

export async function getOrCreateCart(userId?: string, anonymousToken?: string) {
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
                    images: { orderBy: { sortOrder: 'asc' }, take: 1 }
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
                    images: { orderBy: { sortOrder: 'asc' }, take: 1 }
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
                  images: { orderBy: { sortOrder: 'asc' }, take: 1 }
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
                    images: { orderBy: { sortOrder: 'asc' }, take: 1 }
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

  throw new AppError('Either user authentication or an anonymousToken is required for cart operations', 400);
}

export async function getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const anonymousToken = req.query.anonymousToken as string | undefined;
    const cart = await getOrCreateCart(req.user?.id, anonymousToken);

    // Calculate totals in paise
    let subtotalPaise = 0;
    const formattedItems = cart.items.map(item => {
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

    // Free shipping threshold: Rs. 2,999 (299900 paise)
    const FREE_SHIPPING_THRESHOLD_PAISE = 299900;
    const shippingPaise = subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE || subtotalPaise === 0 ? 0 : 15000; // Rs. 150 standard
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

export async function addToCart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { variantId, quantity, anonymousToken } = addToCartSchema.parse(req.body);

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true }
    });

    if (!variant || !variant.product.isActive) {
      throw new AppError('Product variant not found or inactive', 404);
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

export async function updateCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { quantity } = z.object({ quantity: z.number().int().min(0) }).parse(req.body);

    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: { variant: true, cart: true }
    });

    if (!cartItem) {
      throw new AppError('Cart item not found', 404);
    }

    if (req.user?.id && cartItem.cart.userId !== req.user.id) {
      throw new AppError('Unauthorized access to cart', 403);
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

export async function removeCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.cartItem.delete({ where: { id } });
    return getCart(req, res, next);
  } catch (err) {
    next(err);
  }
}
