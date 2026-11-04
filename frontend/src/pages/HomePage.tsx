import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp, Sparkles, Shield, Layers } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { apiClient } from '../services/api';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCollectionTab, setActiveCollectionTab] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await apiClient.get('/products', { limit: 12, sort: 'featured' });
        setFeaturedProducts(res.data.products || []);
      } catch (err) {
        console.warn('Could not load featured products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();

    const handleUpdate = () => loadFeatured();
    window.addEventListener('levix_products_updated', handleUpdate);
    return () => window.removeEventListener('levix_products_updated', handleUpdate);
  }, []);

  const editorialCollections = [
    {
      name: 'BAGS & LEATHER',
      title: 'Levix Bags & Leather Goods',
      img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
      handle: 'bags'
    },
    {
      name: 'HEADWEAR & CAPS',
      title: 'Architectural Headwear',
      img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80',
      handle: 'caps'
    },
    {
      name: 'POLOS & TOPS',
      title: 'Heritage Heavyweight Pique Polos',
      img: 'https://images.unsplash.com/photo-1625910513413-72210c598007?auto=format&fit=crop&w=1200&q=80',
      handle: 'polos'
    },
    {
      name: 'WINTER CAPSULE',
      title: '450 GSM Diagonal French Terry Fleece',
      img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80',
      handle: 'winter-collection'
    },
    {
      name: 'RACING HERITAGE',
      title: 'Motorsport Geometry & Tactical Ripstop',
      img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
      handle: 'levix-racing-club'
    },
    {
      name: 'DAILY BASICS',
      title: 'Daily Oversized Combed Cotton Staples',
      img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
      handle: 'summer-basics'
    }
  ];

  const faqs = [
    {
      title: 'Feel the Luxury of Premium Streetwear with LEVIX - Architectural Streetwear',
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
      content: 'From our 450 GSM French terry hoodies and custom pique polos to modular multi-pocket cargo pants and exclusive streetwear capsules, our atelier continuously redefines high-end contemporary fashion in India.'
    },
    {
      title: 'FAQS: Shipping, Returns & Authenticity',
      content: 'All prepaid orders receive complimentary domestic air express shipping. Deliveries arrive in metro areas within 48-72 hours. We offer a hassle-free 7-day exchange portal for size replacements and alterations.'
    }
  ];

  const popularSearches = [
    'Oversized T-shirts', 'Heavyweight Hoodies', 'Tactical Cargos', 'Drop-Shoulder Tees',
    'Pique Polos', 'French Terry', 'Acid Wash', 'Streetwear Archive'
  ];

  return (
    <div className="space-y-12 sm:space-y-20 pb-16">
      
      {/* 1. Hero Campaign Section */}
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

      {/* 2. Latest drop Section (Dynamic from real products) */}
      <section className="max-w-[1440px] mx-auto px-3.5 sm:px-6 md:px-8 xl:px-12">
        <div className="flex items-center justify-between border-b border-black/10 pb-3 mb-5 sm:mb-8">
          <div>
            <span className="text-[10px] font-mono text-[#FF5400] font-bold uppercase tracking-widest block">
              CATALOG ARCHIVE
            </span>
            <h2 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-black">
              Latest Streetwear Drops
            </h2>
          </div>
          <Link
            to="/collections/all-products"
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
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 px-6 text-center border border-black/10 bg-white/70 backdrop-blur-sm space-y-4 shadow-sm">
            <span className="text-[10px] font-mono text-[#FF5400] font-bold uppercase tracking-widest">
              COLLECTION 01 • IN PRODUCTION
            </span>
            <h3 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-black">
              New Drops Coming Soon
            </h3>
            <p className="text-xs text-neutral-600 max-w-lg mx-auto leading-relaxed">
              Our inaugural custom-milled drop capsule is currently in production. Follow <span className="font-bold text-black font-mono">@thelevix.shop</span> on Instagram to unlock private release invitations and early drop access.
            </p>
            {isAdmin && (
              <div className="pt-3">
                <Link
                  to="/admin/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5400] hover:bg-[#e04a00] text-white text-xs font-bold uppercase tracking-widest shadow-md transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>+ Add Your First Drop (Admin)</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. Editorial "Discover Collection" Lookbook */}
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

      {/* 4. Atelier Values Banner */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-black/10 shadow-sm space-y-2">
            <span className="text-[10px] font-mono text-[#FF5400] font-bold uppercase tracking-widest">
              01 • PROPRIETARY FABRIC
            </span>
            <h4 className="font-display font-black text-lg uppercase text-black">
              260–450 GSM Heavyweights
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Custom-milled combed cottons and diagonal loopback French terry engineered to maintain architectural boxy drape.
            </p>
          </div>

          <div className="bg-white p-6 border border-black/10 shadow-sm space-y-2">
            <span className="text-[10px] font-mono text-[#FF5400] font-bold uppercase tracking-widest">
              02 • DISPATCH COURIER
            </span>
            <h4 className="font-display font-black text-lg uppercase text-black">
              Express Pan-India Air
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              All prepaid orders dispatch via Blue Dart & Delhivery Express in sealed tamper-evident luxury dustbags.
            </p>
          </div>

          <div className="bg-white p-6 border border-black/10 shadow-sm space-y-2">
            <span className="text-[10px] font-mono text-[#FF5400] font-bold uppercase tracking-widest">
              03 • CLIENT CONCIERGE
            </span>
            <h4 className="font-display font-black text-lg uppercase text-black">
              7-Day Doorstep Exchanges
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Complimentary size alterations and seamless doorstep pickups for complete peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Brand Story & Accordions */}
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
