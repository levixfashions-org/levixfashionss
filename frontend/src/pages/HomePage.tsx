import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp, MapPin, Phone, ExternalLink } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { apiClient } from '../services/api';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCollectionTab, setActiveCollectionTab] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await apiClient.get('/products', { limit: 8, sort: 'featured' });
        setFeaturedProducts(res.data.products || []);
      } catch (err) {
        console.warn('Could not load featured products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const editorialCollections = [
    {
      name: 'BAGS',
      title: 'Levix Bags & Leather Goods',
      img: 'https://bluorng.com/cdn/shop/files/dgbetbet-Recovered.jpg?v=1787987969&width=1600',
      handle: 'bags'
    },
    {
      name: 'CAPS',
      title: 'Architectural Headwear',
      img: 'https://bluorng.com/cdn/shop/files/erfscersd.jpg?v=1781695074&width=1600',
      handle: 'caps'
    },
    {
      name: 'LEVIX POLO CLUB',
      title: 'Heritage Heavyweight Pique Polos',
      img: 'https://bluorng.com/cdn/shop/files/UJNLL_JN.jpg?v=1770039557&width=1600',
      handle: 'polos'
    },
    {
      name: 'WINTER COLLECTION 2025',
      title: '450 GSM Diagonal French Terry Fleece',
      img: 'https://bluorng.com/cdn/shop/files/cdwasa.jpg?v=1769161054&width=1600',
      handle: 'winter-collection'
    },
    {
      name: 'LEVIX RACING CLUB',
      title: 'Motorsport Geometry & Tactical Ripstop',
      img: 'https://bluorng.com/cdn/shop/files/qewrsceqwdsa.jpg?v=1769161060&width=1600',
      handle: 'levix-racing-club'
    },
    {
      name: 'LEVIX BASICS',
      title: 'Daily Oversized Combed Cotton Staples',
      img: 'https://bluorng.com/cdn/shop/files/BLUORNG00111.jpg?v=1764336787&width=1600',
      handle: 'summer-basics'
    },
    {
      name: 'YACHT COLLECTION',
      title: 'Resort High-Octane Streetwear',
      img: 'https://bluorng.com/cdn/shop/files/grvfcre.jpg?v=1770966605&width=1600',
      handle: 'yacht-collection'
    }
  ];

  const bagsAccessories = [
    {
      name: 'Jacquard Card Case',
      slug: 'cherry-blossom-polo-t-shirt',
      basePrice: 299000,
      img: 'https://bluorng.com/cdn/shop/files/DSC08722copy_jpg.jpg?v=1788681078&width=600',
      hoverImg: 'https://bluorng.com/cdn/shop/files/smallwallet-4.jpg?v=1788595423&width=600'
    },
    {
      name: 'Crest Mini Backpack Jacquard',
      slug: 'black-ragnarok-t-shirt',
      basePrice: 899000,
      img: 'https://bluorng.com/cdn/shop/files/smallwallet-4.jpg?v=1788595423&width=600',
      hoverImg: 'https://bluorng.com/cdn/shop/files/DSC08722copy_jpg.jpg?v=1788681078&width=600'
    },
    {
      name: 'Crest Duffle Leather',
      slug: 'thunderstruck-hoodie',
      basePrice: 1499000,
      img: 'https://bluorng.com/cdn/shop/files/DSC09084_copy_2_jpg.jpg?v=1788681132&width=600',
      hoverImg: 'https://bluorng.com/cdn/shop/files/DSC09102_copy_jpg.jpg?v=1788681189&width=600'
    },
    {
      name: 'Crest Carryall Leather',
      slug: 'mothra-rising-t-shirt',
      basePrice: 1299000,
      img: 'https://bluorng.com/cdn/shop/files/DSC09102_copy_jpg.jpg?v=1788681189&width=600',
      hoverImg: 'https://bluorng.com/cdn/shop/files/DSC09084_copy_2_jpg.jpg?v=1788681132&width=600'
    }
  ];

  const winterHoodies = [
    {
      name: 'Brown Star Studded Hoodie',
      slug: 'thunderstruck-hoodie',
      basePrice: 1700000,
      img: 'https://bluorng.com/cdn/shop/files/BLUORNG00261.jpg?v=1764337091&width=600',
      hoverImg: 'https://bluorng.com/cdn/shop/files/hjbmhn.jpg?v=1764337091&width=600'
    },
    {
      name: 'Grey Star Studded Hoodie',
      slug: 'thunderstruck-hoodie',
      basePrice: 1700000,
      img: 'https://bluorng.com/cdn/shop/files/hjbmhn.jpg?v=1764337091&width=600',
      hoverImg: 'https://bluorng.com/cdn/shop/files/BLUORNG00261.jpg?v=1764337091&width=600'
    },
    {
      name: 'Brown Embroidered Zip Hoodie',
      slug: 'thunderstruck-hoodie',
      basePrice: 1650000,
      img: 'https://bluorng.com/cdn/shop/files/BLUORNG00276.jpg?v=1764337091&width=600',
      hoverImg: 'https://bluorng.com/cdn/shop/files/BLUORNG00170.jpg?v=1764337091&width=600'
    },
    {
      name: 'Levix Racing Club Heavyweight Hoodie',
      slug: 'thunderstruck-hoodie',
      basePrice: 1400000,
      img: 'https://bluorng.com/cdn/shop/files/BLUORNG00170.jpg?v=1764337091&width=600',
      hoverImg: 'https://bluorng.com/cdn/shop/files/BLUORNG00276.jpg?v=1764337091&width=600'
    }
  ];

  const phoneCases = [
    {
      name: '5 Lakh Case',
      price: 'RS. 1,490',
      img: 'https://bluorng.com/cdn/shop/files/REDO1.jpg?v=1779904207&width=600',
      hoverImg: 'https://bluorng.com/cdn/shop/files/REDO2.jpg?v=1779904209&width=600'
    },
    {
      name: 'Maximum Spend Case',
      price: 'RS. 1,490',
      img: 'https://bluorng.com/cdn/shop/files/REDO4.jpg?v=1779904243&width=600',
      hoverImg: 'https://bluorng.com/cdn/shop/files/REDO1.jpg?v=1779904207&width=600'
    },
    {
      name: 'Levix Favourite Child Case',
      price: 'RS. 1,490',
      img: 'https://bluorng.com/cdn/shop/files/Orange_Money_1.png?v=1779972887&width=600',
      hoverImg: 'https://bluorng.com/cdn/shop/files/REDO4.jpg?v=1779904243&width=600'
    },
    {
      name: 'Red Birds Of Paradise Case',
      price: 'RS. 1,490',
      img: 'https://bluorng.com/cdn/shop/files/REDO2.jpg?v=1779904209&width=600',
      hoverImg: 'https://bluorng.com/cdn/shop/files/Orange_Money_1.png?v=1779972887&width=600'
    }
  ];

  const stores = [
    {
      city: 'Delhi (Vasant Kunj)',
      address: 'Ground Floor, Ambience Mall, Nelson Mandela Marg, Vasant Kunj, New Delhi 110070',
      phone: '+91 9958958313',
      img: 'https://bluorng.com/cdn/shop/files/IMG_0689_2_jpg.jpg?v=1791445063&width=800',
      mapUrl: 'https://maps.app.goo.gl/3XRY1CwTqt2ANt4t5'
    },
    {
      city: 'Gurugram (DLF Summit Plaza)',
      address: 'Shop 14, DLF Summit Plaza, DLF Phase 5, Sector 54, Gurugram 122002',
      phone: '+91 9958952988',
      img: 'https://bluorng.com/cdn/shop/files/image_47.png?v=1786104753&width=800',
      mapUrl: 'https://maps.app.goo.gl/y3SK4Tu2Bvm6Gwmj6'
    },
    {
      city: 'Delhi (Dhan Mill)',
      address: 'Shed 12, The Dhan Mill, 100 Feet Road, SSN Marg, Chhatarpur, New Delhi 110074',
      phone: '+91 9599191998',
      img: 'https://bluorng.com/cdn/shop/files/delhi_store_9b995cfd-8fe8-41df-a58c-7844e1e8cc49.jpg?v=1734518093&width=800',
      mapUrl: 'https://goo.gl/maps/Sgr5nZuiSzGA2eT8A'
    },
    {
      city: 'Mumbai (Kala Ghoda)',
      address: 'Ground Floor, Ropewalk Lane, Behind Jehangir Art Gallery, Kala Ghoda, Fort, Mumbai 400001',
      phone: '+91 9599199537',
      img: 'https://bluorng.com/cdn/shop/files/image_5.png?v=1789450926&width=800',
      mapUrl: 'https://maps.app.goo.gl/dC5mkJ6UrnRqzFv86'
    }
  ];

  const faqs = [
    {
      title: 'Feel the Luxury of Premium Streetwear with LEVIX - Best Unisex Clothing Brand',
      content: 'Levix is an independent luxury streetwear atelier founded on architectural tailoring, heavy custom-milled textiles, and provocative cultural narratives. Every silhouette is patterned with dropped shoulders, structured proportions, and custom-milled 260-450 GSM cottons designed to preserve volume and drape over years of wear.'
    },
    {
      title: 'What is Gender Neutral Streetwear Fashion?',
      content: 'Gender-neutral streetwear prioritizes structure, volume, fabric weight, and silhouette over traditional gender classifications. By adopting generous cuts, dropped armholes, and relaxed straight-leg cargo proportions, Levix garments are universally tailored for all genders.'
    },
    {
      title: 'What Makes LEVIX Unique Among Streetwear Brands in India?',
      content: 'Levix manufactures everything from proprietary custom yarn-dyed textiles, heavy loopback French terry, and tear-resistant tactical ripstop. Every drop is produced in strictly limited quantities, ensuring unmatched individuality, high collectors value, and luxury finish.'
    },
    {
      title: 'Explore a Curated Range of Luxury Streetwear Clothing',
      content: 'From our 450 GSM French terry hoodies and custom pique polos to modular multi-pocket cargo pants and licensed pop-culture collaborations, our atelier continuously redefines high-end contemporary fashion in India.'
    },
    {
      title: 'FAQS: Shipping, Returns & Authenticity',
      content: 'All prepaid orders receive complimentary domestic air express shipping. Deliveries arrive in metro areas within 48-72 hours. We offer a hassle-free 7-day exchange portal for size replacements and alterations.'
    }
  ];

  const popularSearches = [
    'Oversized T-shirts', 'Joggers', 'Acid Wash T-shirts', 'Designer Shirts',
    'Casual Jackets', 'Black Hoodies', 'Printed Sweatshirts', 'Cargo Pants',
    'Winter Drop', 'Godzilla Collaboration', 'Heavyweight Polos'
  ];

  return (
    <div className="space-y-12 sm:space-y-20 pb-16">
      
      {/* 1. Hero Campaign Section (Full Viewport Height Match to levix.com) */}
      <section className="relative w-full overflow-hidden bg-neutral-900">
        <div className="relative w-full h-[100svh] max-h-[950px] min-h-[640px]">
          <picture className="block w-full h-full">
            <source media="(max-width: 950px)" srcSet="/hero_mobile.jpg" />
            <img
              src="/hero_desktop.jpg"
              alt="Levix Luxury Streetwear Campaign"
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
          </picture>
          
          <div className="absolute bottom-[20%] sm:bottom-[9%] left-1/2 -translate-x-1/2 text-center z-10">
            <Link
              to="/collections/all-products"
              className="relative inline-block text-black sm:text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 after:content-[''] after:absolute after:bottom-[-3px] after:left-1/2 after:-translate-x-1/2 after:w-[65%] after:border-b after:border-black sm:after:border-white hover:after:w-full"
            >
              Shop now
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Latest drop (Section 1 on levix.com) */}
      <section className="max-w-[1440px] mx-auto px-3.5 sm:px-6 md:px-8 xl:px-12">
        <div className="flex items-center justify-between border-b border-black/10 pb-3 mb-5 sm:mb-8">
          <h2 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-black">
            Latest drop
          </h2>
          <Link
            to="/collections/new-in"
            className="px-3.5 py-1 bg-black text-white text-[11px] font-medium rounded-full hover:bg-neutral-800 transition-colors flex items-center gap-1 group"
          >
            <span>Discover more</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[3/4] bg-neutral-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Levix Bags & Leather Goods (Section 2 on levix.com) */}
      <section className="max-w-[1440px] mx-auto px-3.5 sm:px-6 md:px-8 xl:px-12">
        <div className="flex items-center justify-between border-b border-black/10 pb-3 mb-5 sm:mb-8">
          <h2 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-black">
            Levix Bags
          </h2>
          <Link
            to="/collections/bags"
            className="px-3.5 py-1 bg-black text-white text-[11px] font-medium rounded-full hover:bg-neutral-800 transition-colors flex items-center gap-1 group"
          >
            <span>Discover more</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {bagsAccessories.map((bag, i) => (
            <div key={i} className="group flex flex-col">
              <Link to={`/products/${bag.slug}`} className="relative aspect-[3/4] overflow-hidden rounded-[10px] bg-neutral-200 block">
                <img
                  src={bag.img}
                  alt={bag.name}
                  className="absolute inset-0 w-full h-full object-cover product-card-img-primary"
                  loading="lazy"
                />
                <img
                  src={bag.hoverImg}
                  alt={bag.name}
                  className="absolute inset-0 w-full h-full object-cover product-card-img-secondary"
                  loading="lazy"
                />
              </Link>
              <div className="pt-2 sm:pt-3 pb-1 flex flex-col space-y-0.5 sm:space-y-1">
                <Link
                  to={`/products/${bag.slug}`}
                  className="text-xs sm:text-[13px] font-medium text-black line-clamp-1 hover:text-neutral-600 transition-colors"
                >
                  {bag.name}
                </Link>
                <span className="text-[11px] sm:text-xs font-semibold text-neutral-900 font-mono">
                  RS. {(bag.basePrice / 100).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Editorial "Discover Collection" Gallery (Section 5 & 6) */}
      <section className="max-w-[1440px] mx-auto px-3.5 sm:px-6 md:px-8 xl:px-12">
        <div className="border border-black/10 overflow-hidden bg-black text-white grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
          
          {/* Left: Dynamic Campaign Image */}
          <div className="lg:col-span-8 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto overflow-hidden bg-neutral-950">
            <img
              src={editorialCollections[activeCollectionTab].img}
              alt={editorialCollections[activeCollectionTab].title}
              className="w-full h-full object-cover transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 sm:p-6 lg:p-10">
              <div>
                <p className="text-[9px] sm:text-[11px] font-mono text-[#FF5400] font-bold uppercase tracking-widest mb-1">
                  ATELIER CAPSULE
                </p>
                <h3 className="font-display font-black text-xl sm:text-2xl lg:text-4xl uppercase tracking-tight">
                  {editorialCollections[activeCollectionTab].title}
                </h3>
              </div>
            </div>
          </div>

          {/* Right: Typographic Collection Navigation */}
          <div className="lg:col-span-4 p-4 sm:p-8 lg:p-10 flex flex-col justify-between bg-black text-white space-y-4 sm:space-y-6">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-2 sm:mb-4">
                DISCOVER COLLECTION
              </span>
              <div className="flex overflow-x-auto gap-2 pb-2 sm:block sm:space-y-3 sm:pb-0 scrollbar-none">
                {editorialCollections.map((col, idx) => (
                  <button
                    key={col.name}
                    onClick={() => setActiveCollectionTab(idx)}
                    className={`whitespace-nowrap px-3 py-1.5 sm:px-0 sm:py-1 rounded-none border sm:border-0 text-left text-xs sm:text-base font-bold uppercase tracking-wider transition-all ${
                      activeCollectionTab === idx
                        ? 'text-[#FF5400] border-[#FF5400] sm:translate-x-2'
                        : 'text-neutral-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {col.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-white/10">
              <Link
                to={`/collections/${editorialCollections[activeCollectionTab].handle}`}
                className="w-full py-3 sm:py-3.5 bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
              >
                <span>Shop {editorialCollections[activeCollectionTab].name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Winter Collection 2025 Featured Drop (Exact Match to Section 4 on levix.com) */}
      <section className="max-w-[1440px] mx-auto px-3.5 sm:px-6 md:px-8 xl:px-12">
        <div className="flex items-center justify-between border-b border-black/10 pb-3 mb-5 sm:mb-8">
          <h2 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-black">
            Winter Collection 2025
          </h2>
          <Link
            to="/collections/winter-collection"
            className="px-3.5 py-1 bg-black text-white text-[11px] font-medium rounded-full hover:bg-neutral-800 transition-colors flex items-center gap-1 group"
          >
            <span>Discover more</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {winterHoodies.map((hoodie, i) => (
            <div key={i} className="group flex flex-col">
              <Link to={`/products/${hoodie.slug}`} className="relative aspect-[3/4] overflow-hidden rounded-[10px] bg-neutral-200 block">
                <img
                  src={hoodie.img}
                  alt={hoodie.name}
                  className="absolute inset-0 w-full h-full object-cover product-card-img-primary"
                  loading="lazy"
                />
                <img
                  src={hoodie.hoverImg}
                  alt={hoodie.name}
                  className="absolute inset-0 w-full h-full object-cover product-card-img-secondary"
                  loading="lazy"
                />
              </Link>
              <div className="pt-2 sm:pt-3 pb-1 flex flex-col space-y-0.5 sm:space-y-1">
                <Link
                  to={`/products/${hoodie.slug}`}
                  className="text-xs sm:text-[13px] font-medium text-black line-clamp-1 hover:text-neutral-600 transition-colors"
                >
                  {hoodie.name}
                </Link>
                <span className="text-[11px] sm:text-xs font-semibold text-neutral-900 font-mono">
                  RS. {(hoodie.basePrice / 100).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. iPhone Cases Drop (Section 5 on levix.com) */}
      <section className="max-w-[1440px] mx-auto px-3.5 sm:px-6 md:px-8 xl:px-12">
        <div className="flex items-center justify-between border-b border-black/10 pb-3 mb-5 sm:mb-8">
          <h2 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-black">
            iPhone Case
          </h2>
          <Link
            to="/collections/iphone-case"
            className="px-3.5 py-1 bg-black text-white text-[11px] font-medium rounded-full hover:bg-neutral-800 transition-colors flex items-center gap-1 group"
          >
            <span>Discover more</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {phoneCases.map((item, i) => (
            <div key={i} className="group flex flex-col">
              <Link to="/products/cherry-blossom-polo-t-shirt" className="relative aspect-[3/4] overflow-hidden rounded-[10px] bg-neutral-200 block">
                <img
                  src={item.img}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover product-card-img-primary"
                  loading="lazy"
                />
                <img
                  src={item.hoverImg}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover product-card-img-secondary"
                  loading="lazy"
                />
              </Link>
              <div className="pt-2 sm:pt-3 pb-1 flex flex-col space-y-0.5 sm:space-y-1">
                <Link
                  to="/products/cherry-blossom-polo-t-shirt"
                  className="text-xs sm:text-[13px] font-medium text-black line-clamp-1 hover:text-neutral-600 transition-colors"
                >
                  {item.name}
                </Link>
                <span className="text-[11px] sm:text-xs font-semibold text-neutral-900 font-mono">
                  {item.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Physical Stores Section (Section 6 on levix.com) */}
      <section className="max-w-[1440px] mx-auto px-3.5 sm:px-6 md:px-8 xl:px-12">
        <div className="flex items-center justify-between border-b border-black/10 pb-3 mb-5 sm:mb-8">
          <h2 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-black">
            Stores across India
          </h2>
          <Link
            to="/pages/store"
            className="px-3.5 py-1 bg-black text-white text-[11px] font-medium rounded-full hover:bg-neutral-800 transition-colors flex items-center gap-1 group"
          >
            <span>All Locations</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Swipe / Desktop Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-3 scrollbar-none sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:pb-0">
          {stores.map((store) => (
            <div
              key={store.city}
              className="min-w-[280px] w-[80vw] sm:w-auto flex-shrink-0 snap-center rounded-[10px] border border-black/10 bg-white flex flex-col justify-between overflow-hidden group shadow-sm"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-200">
                <img
                  src={store.img}
                  alt={store.city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wide text-black mb-1.5">
                    {store.city}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {store.address}
                  </p>
                </div>
                <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs">
                  <a
                    href={store.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold uppercase tracking-wider text-black hover:text-[#FF5400] flex items-center gap-1 transition-colors"
                  >
                    <span>Get Direction</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={`tel:${store.phone}`}
                    className="text-neutral-500 font-mono hover:text-black transition-colors"
                  >
                    {store.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Brand Story & SEO Accordions (Section 12) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 border-t border-black/10 pt-12 pb-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-[11px] font-mono text-[#FF5400] font-bold uppercase tracking-widest block text-center mb-6">
            ATELIER ARCHIVES & FAQS
          </span>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openAccordion === index;
              return (
                <div
                  key={index}
                  className="border border-black/10 bg-white/70 backdrop-blur-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpenAccordion(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between hover:bg-black/5 transition-colors"
                  >
                    <span className="font-bold text-xs sm:text-sm uppercase tracking-wide text-black pr-4">
                      {faq.title}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-black flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-neutral-600 leading-relaxed border-t border-black/5">
                      <p>{faq.content}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Popular searches tag cloud */}
          <div className="pt-8 border-t border-black/10 mt-10">
            <h4 className="text-[11px] font-mono uppercase tracking-widest font-bold text-neutral-500 mb-3 text-center">
              Popular Searches
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  to={`/search?q=${encodeURIComponent(term)}`}
                  className="px-3 py-1 bg-white border border-black/10 text-[11px] text-neutral-700 hover:bg-black hover:text-white transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
