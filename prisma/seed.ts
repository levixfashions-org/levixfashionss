import { PrismaClient, Role, DiscountType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Levix production database with authentic catalog...');

  // 1. Categories - Strictly the 3 Core Brand Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'overlength-t-shirts' },
      update: {},
      create: {
        name: 'Overlength T-Shirts',
        slug: 'overlength-t-shirts',
        description: 'Elongated architectural drape and dropped-shoulder streetwear tees',
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'waffle-boxy-fit-full-sleeves' },
      update: {},
      create: {
        name: 'Waffle Boxy Fit Full Sleeves',
        slug: 'waffle-boxy-fit-full-sleeves',
        description: 'Heavyweight thermal waffle knit long sleeves with boxy streetwear proportions',
        imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'acid-wash-t-shirts' },
      update: {},
      create: {
        name: 'Acid Wash T-Shirts',
        slug: 'acid-wash-t-shirts',
        description: 'Vintage hand-treated mineral and acid wash heavyweight tees',
        imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'
      }
    })
  ]);

  // 2. Collections
  const atelierCollection = await prisma.collection.upsert({
    where: { slug: 'overlength-t-shirts' },
    update: {},
    create: {
      name: 'Overlength T-Shirts',
      slug: 'overlength-t-shirts',
      description: 'Elongated architectural drape and dropped-shoulder streetwear silhouettes.',
      bannerImageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80',
      isActive: true
    }
  });

  const racingCollection = await prisma.collection.upsert({
    where: { slug: 'waffle-boxy-fit-full-sleeves' },
    update: {},
    create: {
      name: 'Waffle Boxy Fit Full Sleeves',
      slug: 'waffle-boxy-fit-full-sleeves',
      description: 'Heavyweight thermal waffle weave knit long sleeves with exaggerated boxy fit.',
      bannerImageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1400&q=80',
      isActive: true
    }
  });

  const winterCollection = await prisma.collection.upsert({
    where: { slug: 'acid-wash-t-shirts' },
    update: {},
    create: {
      name: 'Acid Wash T-Shirts',
      slug: 'acid-wash-t-shirts',
      description: 'Vintage hand-treated mineral and acid wash textiles with distressed aesthetics.',
      bannerImageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1400&q=80',
      isActive: true
    }
  });

  // 3. Products
  const productsData = [
    {
      name: 'Levix Signature Overlength Heavyweight Tee',
      slug: 'levix-signature-overlength-tee',
      description: 'Signature elongated streetwear silhouette cut from custom-milled 280 GSM combed cotton jersey. Tailored with dropped shoulders and architectural drape extending past the hip line.',
      details: '280 GSM luxury combed single jersey, seamless ribbed neck band, twin-needle hem finishing.',
      fabricCare: '100% Combed Single Jersey Cotton (280 GSM). Cold gentle wash inside out.',
      fitGuide: 'Overlength dropped-shoulder drape. Designed to stack naturally over streetwear trousers and denim.',
      basePrice: 329000, // Rs. 3,290
      comparePrice: 399000,
      isFeatured: true,
      categoryId: categories[0].id,
      collectionId: atelierCollection.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80', isCover: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80', isCover: false, sortOrder: 1 }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      name: 'Levix Thermal Waffle Boxy Full Sleeve',
      slug: 'levix-thermal-waffle-boxy-full-sleeve',
      description: 'Engineered from ultra-heavy 340 GSM thermal honeycomb waffle weave. Features wide dropped shoulders, dense 2x2 ribbed storm cuffs, and an exaggerated relaxed boxy torso.',
      details: '340 GSM thermal honeycomb waffle weave knit, structured collar, reinforced storm cuffs.',
      fabricCare: '100% Heavyweight Thermal Waffle Cotton (340 GSM). Machine wash cold, dry flat.',
      fitGuide: 'Generous boxy cut with substantial sleeve volume and structured silhouette.',
      basePrice: 399000, // Rs. 3,990
      comparePrice: 469000,
      isFeatured: true,
      categoryId: categories[1].id,
      collectionId: racingCollection.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80', isCover: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80', isCover: false, sortOrder: 1 }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      name: 'Levix Mineral Acid Wash Distressed Tee',
      slug: 'levix-mineral-acid-wash-tee',
      description: 'Custom hand-treated mineral acid wash yielding unique cloudy charcoal patterns on heavy 280 GSM combed cotton. High-density typographic branding with subtle raw hem distress.',
      details: '280 GSM mineral washed combed cotton, artisanal cloud-wash treatment, reinforced collar.',
      fabricCare: '100% Mineral Washed Combed Cotton (280 GSM). Wash separately in cold water.',
      fitGuide: 'Vintage boxy oversized drape. Pre-shrunk to preserve architectural proportions.',
      basePrice: 349000, // Rs. 3,490
      comparePrice: 429000,
      isFeatured: true,
      categoryId: categories[2].id,
      collectionId: winterCollection.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80', isCover: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80', isCover: false, sortOrder: 1 }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    }
  ];

  for (const p of productsData) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        details: p.details,
        fabricCare: p.fabricCare,
        fitGuide: p.fitGuide,
        basePrice: p.basePrice,
        comparePrice: p.comparePrice,
        isFeatured: p.isFeatured,
        categoryId: p.categoryId,
        images: {
          create: p.images
        },
        variants: {
          create: p.sizes.map((s, idx) => ({
            size: s,
            sku: `${p.slug.toUpperCase()}-${s}`,
            stockQuantity: 25 + (idx * 5)
          }))
        }
      }
    });

    if (p.collectionId) {
      await prisma.collectionProduct.upsert({
        where: {
          collectionId_productId: {
            collectionId: p.collectionId,
            productId: product.id
          }
        },
        update: {},
        create: {
          collectionId: p.collectionId,
          productId: product.id,
          sortOrder: 0
        }
      });
    }
  }

  // 4. Coupons
  await prisma.coupon.upsert({
    where: { code: 'LEVIX10' },
    update: {},
    create: {
      code: 'LEVIX10',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      minOrderPaise: 299900, // Rs. 2,999 minimum order
      isActive: true
    }
  });

  console.log('Seed completed successfully with 5 authentic products, categories, collections, and variants!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
