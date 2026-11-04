import { PrismaClient, Role, DiscountType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Levix production database with authentic catalog...');

  // 1. Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 't-shirts' },
      update: {},
      create: {
        name: 'T-Shirts',
        slug: 't-shirts',
        description: 'Heavyweight graphic and essential oversized tees',
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'polos' },
      update: {},
      create: {
        name: 'Polo T-Shirts',
        slug: 'polos',
        description: 'Refined knit and pique streetwear polo silhouettes',
        imageUrl: 'https://images.unsplash.com/photo-1625910513413-72210c598007?auto=format&fit=crop&w=800&q=80'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'hoodies' },
      update: {},
      create: {
        name: 'Hoodies & Sweatshirts',
        slug: 'hoodies',
        description: '450 GSM French terry fleece outerwear',
        imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'bottoms' },
      update: {},
      create: {
        name: 'Bottoms & Cargos',
        slug: 'bottoms',
        description: 'Military ripstop and technical utility cargos',
        imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80'
      }
    })
  ]);

  // 2. Collections
  const atelierCollection = await prisma.collection.upsert({
    where: { slug: 'levix-atelier-capsule' },
    update: {},
    create: {
      name: 'LEVIX ATELIER CAPSULE',
      slug: 'levix-atelier-capsule',
      description: 'Exclusive limited-edition drops featuring signature architectural silhouettes.',
      bannerImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80',
      isActive: true
    }
  });

  const racingCollection = await prisma.collection.upsert({
    where: { slug: 'levix-racing-club' },
    update: {},
    create: {
      name: 'Levix Racing Club',
      slug: 'levix-racing-club',
      description: 'Motorsport heritage cut in signature boxy aesthetics.',
      bannerImageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1400&q=80',
      isActive: true
    }
  });

  const winterCollection = await prisma.collection.upsert({
    where: { slug: 'winter-collection' },
    update: {},
    create: {
      name: 'Winter Collection 2025',
      slug: 'winter-collection',
      description: 'Thermal heavyweight hoodies, knitwear and cargos.',
      bannerImageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1400&q=80',
      isActive: true
    }
  });

  // 3. Products
  const productsData = [
    {
      name: 'Levix Cherry Blossom Polo T-Shirt',
      slug: 'cherry-blossom-polo-t-shirt',
      description: 'Crafted from heavyweight custom-milled 260 GSM pique cotton with detailed cherry blossom floral embroidery across the chest and Levix typographic branding.',
      details: 'Tailored oversized fit, ribbed collar, Mother-of-pearl buttons, split hem with reinforced herringbone tape.',
      fabricCare: '100% Combed Pique Cotton. Cold machine wash inside out. Do not tumble dry. Dry in shade.',
      fitGuide: 'Oversized Streetwear Fit. Model is 6 ft 1 in wearing size L for a relaxed drape.',
      basePrice: 499000, // Rs. 4,990
      comparePrice: 599000,
      isFeatured: true,
      categoryId: categories[1].id,
      collectionId: atelierCollection.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1625910513413-72210c598007?auto=format&fit=crop&w=1000&q=80', isCover: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1000&q=80', isCover: false, sortOrder: 1 }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      name: 'Levix Black Ragnarok T-Shirt',
      slug: 'black-ragnarok-t-shirt',
      description: 'Signature dropped-shoulder heavyweight tee with volcanic distressed runes, high-density screen print and vintage mineral wash finish.',
      details: '280 GSM luxury combed single jersey, seamless ribbed neck band, twin-needle hem finishing.',
      fabricCare: '100% Premium Cotton. Reverse wash cold. Iron on reverse side only.',
      fitGuide: 'Intentionally oversized boxy silhouette. Size down for a regular fit.',
      basePrice: 399000, // Rs. 3,990
      comparePrice: 450000,
      isFeatured: true,
      categoryId: categories[0].id,
      collectionId: atelierCollection.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80', isCover: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80', isCover: false, sortOrder: 1 }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      name: 'Levix Thunderstruck Heavyweight Hoodie',
      slug: 'thunderstruck-hoodie',
      description: 'Ultra-heavy 450 GSM diagonal fleece hoodie engineered for winter drape. High-definition screen print with electric atmospheric artwork.',
      details: 'Double-layered substantial hood without drawstrings for clean minimalist aesthetic. Concealed kangaroo pocket seams, heavyweight 2x2 ribbed cuffs.',
      fabricCare: '100% Organic Heavyweight Cotton Fleece. Machine wash cold with like colors.',
      fitGuide: 'Boxy streetwear drape with dropped shoulder seams.',
      basePrice: 699000, // Rs. 6,990
      comparePrice: 799000,
      isFeatured: true,
      categoryId: categories[2].id,
      collectionId: winterCollection.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80', isCover: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80', isCover: false, sortOrder: 1 }
      ],
      sizes: ['M', 'L', 'XL', 'XXL']
    },
    {
      name: 'Levix Botanical Embroidery T-Shirt',
      slug: 'levix-botanical-embroidery-tshirt',
      description: 'Vintage-white heavyweight tee showcasing intricate botanical illustrations with soft puff-print textural dimensions.',
      details: '260 GSM single jersey cotton, bio-washed and pre-shrunk.',
      fabricCare: '100% Combed Cotton. Hand or delicate cycle wash cold.',
      fitGuide: 'Relaxed true-to-size oversized drape.',
      basePrice: 449000, // Rs. 4,490
      comparePrice: null,
      isFeatured: true,
      categoryId: categories[0].id,
      collectionId: atelierCollection.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80', isCover: true, sortOrder: 0 }
      ],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      name: 'Black Ripstop Tactical Cargos',
      slug: 'black-ripstop-cargos',
      description: 'Engineered utility trousers crafted from cross-woven tear-resistant ripstop cotton. Equipped with 6 3D bellow cargo compartments.',
      details: 'Articulated knee darts, bungee-cord adjustable cuffs with metal cord-locks, reinforced seat panel.',
      fabricCare: '100% Cotton Ripstop. Machine wash cold inside out.',
      fitGuide: 'Relaxed straight leg with taper toggle options at the ankle.',
      basePrice: 599000, // Rs. 5,990
      comparePrice: 699000,
      isFeatured: true,
      categoryId: categories[3].id,
      collectionId: racingCollection.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80', isCover: true, sortOrder: 0 }
      ],
      sizes: ['30', '32', '34', '36']
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
