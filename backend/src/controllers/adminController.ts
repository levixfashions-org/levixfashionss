import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';
import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

export async function getDashboardMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [totalOrders, paidOrders, totalCustomers, totalProducts, lowStockVariants, recentOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({
        where: { paymentStatus: 'PAID' },
        select: { totalPaise: true }
      }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.productVariant.findMany({
        where: { stockQuantity: { lte: 5 } },
        include: { product: { select: { name: true, slug: true } } },
        take: 10
      }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
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

export async function getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, page = '1', limit = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const take = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * take;

    const where: any = {};
    if (status) {
      where.status = status as OrderStatus;
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
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

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = z.object({
      status: z.nativeEnum(OrderStatus)
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

export async function createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const productSchema = z.object({
      name: z.string().min(2),
      slug: z.string().min(2),
      description: z.string().min(5),
      details: z.string().optional(),
      fabricCare: z.string().optional(),
      fitGuide: z.string().optional(),
      basePrice: z.number().int().positive(), // in paise
      comparePrice: z.number().int().positive().optional(),
      categoryId: z.string().optional(),
      isFeatured: z.boolean().default(false),
      images: z.array(z.object({
        url: z.string(),
        altText: z.string().optional(),
        isCover: z.boolean().default(false),
        sortOrder: z.number().int().default(0)
      })).min(1),
      variants: z.array(z.object({
        size: z.string(),
        sku: z.string(),
        stockQuantity: z.number().int().min(0),
        priceDelta: z.number().int().default(0)
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

export async function updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const productSchema = z.object({
      name: z.string().min(2).optional(),
      slug: z.string().min(2).optional(),
      description: z.string().optional(),
      details: z.string().optional(),
      fabricCare: z.string().optional(),
      fitGuide: z.string().optional(),
      basePrice: z.number().int().positive().optional(),
      comparePrice: z.number().int().positive().nullable().optional(),
      categoryId: z.string().optional(),
      isFeatured: z.boolean().optional(),
      isActive: z.boolean().optional(),
      images: z.array(z.object({
        url: z.string(),
        altText: z.string().optional(),
        isCover: z.boolean().default(false),
        sortOrder: z.number().int().default(0)
      })).optional(),
      variants: z.array(z.object({
        size: z.string(),
        sku: z.string(),
        stockQuantity: z.number().int().min(0),
        priceDelta: z.number().int().default(0)
      })).optional()
    });

    const data = productSchema.parse(req.body);

    await prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.description && { description: data.description }),
        ...(data.details !== undefined && { details: data.details }),
        ...(data.fabricCare !== undefined && { fabricCare: data.fabricCare }),
        ...(data.fitGuide !== undefined && { fitGuide: data.fitGuide }),
        ...(data.basePrice && { basePrice: data.basePrice }),
        ...(data.comparePrice !== undefined && { comparePrice: data.comparePrice }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      }
    });

    if (data.variants && data.variants.length > 0) {
      await prisma.productVariant.deleteMany({ where: { productId: id } });
      await prisma.productVariant.createMany({
        data: data.variants.map(v => ({ ...v, productId: id }))
      });
    }

    if (data.images && data.images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: data.images.map(img => ({ ...img, productId: id }))
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

export async function deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
}
