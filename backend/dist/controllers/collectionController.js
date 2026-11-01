import { prisma } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';
export async function getCollections(req, res, next) {
    try {
        const collections = await prisma.collection.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: { select: { products: true } }
            }
        });
        res.json({ collections });
    }
    catch (err) {
        next(err);
    }
}
export async function getCollectionBySlug(req, res, next) {
    try {
        const { slug } = req.params;
        const collection = await prisma.collection.findUnique({
            where: { slug },
            include: {
                products: {
                    orderBy: { sortOrder: 'asc' },
                    include: {
                        product: {
                            include: {
                                category: true,
                                images: { orderBy: { sortOrder: 'asc' }, take: 2 },
                                variants: { select: { id: true, size: true, stockQuantity: true } }
                            }
                        }
                    }
                }
            }
        });
        if (!collection || !collection.isActive) {
            throw new AppError('Collection not found or inactive', 404);
        }
        const products = collection.products.map(cp => cp.product).filter(p => p.isActive);
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
    }
    catch (err) {
        next(err);
    }
}
