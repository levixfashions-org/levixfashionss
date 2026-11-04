import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { useCartStore } from '../store/cartStore';
import { Product } from '../types';
import { ChevronDown, ChevronUp, Ruler, Truck, RefreshCw, ShieldCheck, Check } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>('desc');

  const { addToCart, openSizeGuide, loading: cartLoading } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await apiClient.get(`/products/${handle}`);
        const prod = res.data.product;
        setProduct(prod);
        setRelatedProducts(res.data.relatedProducts || []);
        
        // Auto-select first in-stock variant
        const firstAvailable = prod.variants.find((v: any) => v.stockQuantity > 0) || prod.variants[0];
        if (firstAvailable) {
          setSelectedVariantId(firstAvailable.id);
        }
      } catch (err) {
        console.warn('Could not load product:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo(0, 0);
  }, [handle]);

  if (loading || !product) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-20 text-center font-mono text-xs uppercase tracking-widest text-neutral-500">
        Loading product atelier...
      </div>
    );
  }

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const isOutOfStock = !selectedVariant || selectedVariant.stockQuantity <= 0;
  const priceINR = (product.basePrice / 100).toLocaleString('en-IN');
  const comparePriceINR = product.comparePrice ? (product.comparePrice / 100).toLocaleString('en-IN') : null;

  const handleAddToCart = async () => {
    if (!selectedVariantId) return;
    try {
      await addToCart(selectedVariantId, quantity);
    } catch (err: any) {
      alert(err.message || 'Failed to add item to bag');
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariantId) return;
    try {
      await addToCart(selectedVariantId, quantity);
      navigate('/checkout');
    } catch (err: any) {
      alert(err.message || 'Failed to initialize instant checkout');
    }
  };

  const toggleTab = (tab: string) => {
    setOpenAccordion(openAccordion === tab ? null : tab);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 py-6 sm:py-10 space-y-16">
      
      {/* Breadcrumb */}
      <nav className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 flex items-center gap-1.5">
        <Link to="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <Link to="/collections/all-products" className="hover:text-black">Catalog</Link>
        <span>/</span>
        <span className="text-black font-bold uppercase truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        
        {/* Left Column: Multi-Image Editorial Gallery (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Mobile Swipeable Gallery */}
          <div className="lg:hidden relative aspect-[3/4] w-full overflow-hidden bg-neutral-200">
            <div
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none w-full h-full"
              onScroll={(e) => {
                const target = e.currentTarget;
                const scrollLeft = target.scrollLeft;
                const width = target.clientWidth;
                if (width > 0) {
                  const newIdx = Math.round(scrollLeft / width);
                  if (newIdx !== activeImageIndex && newIdx < product.images.length) {
                    setActiveImageIndex(newIdx);
                  }
                }
              }}
            >
              {product.images.map((img, idx) => (
                <div key={img.id || idx} className="w-full h-full flex-shrink-0 snap-center relative">
                  <img
                    src={img.url}
                    alt={`${product.name} visual ${idx + 1}`}
                    className="w-full h-full object-cover object-center"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}
            </div>

            {/* Featured Badge on Mobile */}
            {product.isFeatured && (
              <div className="absolute top-3 left-3 bg-black text-[#FF5400] text-[9px] font-mono uppercase font-bold tracking-widest px-2.5 py-1 z-10">
                FEATURED
              </div>
            )}

            {/* Mobile Image Counter Indicator */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full z-10">
                {activeImageIndex + 1} / {product.images.length}
              </div>
            )}
          </div>

          {/* Desktop Visual Display */}
          <div className="hidden lg:block space-y-4">
            <div className="aspect-[3/4] w-full bg-neutral-200 overflow-hidden relative shadow-sm">
              <img
                src={product.images[activeImageIndex]?.url || product.images[0]?.url}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {product.isFeatured && (
                <div className="absolute top-4 left-4 bg-black text-[#FF5400] text-[10px] font-mono uppercase font-bold tracking-widest px-3 py-1">
                  EXCLUSIVE DROP
                </div>
              )}
            </div>

            {/* Desktop Thumbnail Stack */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-[3/4] bg-neutral-200 overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx ? 'border-black' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Sticky Buy-Box (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 self-start">
          
          {/* Header & Pricing */}
          <div className="space-y-2 border-b border-black/10 pb-5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF5400] font-bold">
              {product.category?.name || 'LEVIX ATELIER'}
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-black leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center space-x-3 pt-1">
              <span className="text-xl sm:text-2xl font-bold font-mono text-black">
                RS. {priceINR}
              </span>
              {comparePriceINR && (
                <span className="text-sm font-mono text-neutral-400 line-through">
                  RS. {comparePriceINR}
                </span>
              )}
              {comparePriceINR && (
                <span className="text-[10px] bg-black text-white font-mono px-2 py-0.5 font-bold uppercase">
                  SAVE 15%
                </span>
              )}
            </div>
            
            <p className="text-[11px] text-neutral-500 font-light pt-1">
              Inclusive of all taxes. Free express domestic delivery on orders over RS. 2,999.
            </p>
          </div>

          {/* Size Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-black">
                Select Size: <span className="font-mono">{selectedVariant?.size || 'Select'}</span>
              </span>
              <button
                onClick={openSizeGuide}
                className="text-[11px] text-neutral-600 hover:text-black flex items-center gap-1 underline underline-offset-2 uppercase tracking-wider"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {product.variants.map((v) => {
                const isSelected = v.id === selectedVariantId;
                const isSoldOut = v.stockQuantity <= 0;
                return (
                  <button
                    key={v.id}
                    disabled={isSoldOut}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`py-3 text-xs font-bold uppercase tracking-wider transition-all border ${
                      isSelected
                        ? 'border-2 border-black bg-black text-white shadow-md'
                        : isSoldOut
                        ? 'border-neutral-200 text-neutral-400 line-through cursor-not-allowed bg-neutral-100/50'
                        : 'border-black/20 text-black hover:border-black bg-white'
                    }`}
                  >
                    {v.size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center border border-black/30 bg-white h-12 px-3">
                <button
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 text-black hover:opacity-60 disabled:opacity-30 font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold font-mono">{quantity}</span>
                <button
                  disabled={selectedVariant ? quantity >= selectedVariant.stockQuantity : true}
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 text-black hover:opacity-60 disabled:opacity-30 font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                disabled={isOutOfStock || cartLoading}
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white h-12 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed shadow-md"
              >
                {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
              </button>
            </div>

            {/* Instant Buy Now CTA */}
            {!isOutOfStock && (
              <button
                onClick={handleBuyNow}
                className="w-full bg-[#FF5400] text-white h-12 text-xs font-bold uppercase tracking-widest hover:bg-[#e04a00] transition-colors shadow-md"
              >
                Buy It Now
              </button>
            )}

          </div>

          {/* Value Props Strip */}
          <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-black/10 text-[11px] text-neutral-700">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-black flex-shrink-0" />
              <span>Ships within 24-48 Hours</span>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-black flex-shrink-0" />
              <span>7-Day Doorstep Exchange</span>
            </div>
          </div>

          {/* Accordions */}
          <div className="divide-y divide-black/10 text-xs">
            
            {/* Description Tab */}
            <div className="py-3">
              <button
                onClick={() => toggleTab('desc')}
                className="w-full flex items-center justify-between text-left font-bold uppercase tracking-wider text-black py-1"
              >
                <span>Product Description</span>
                {openAccordion === 'desc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'desc' && (
                <div className="pt-2 text-neutral-600 leading-relaxed font-light space-y-2">
                  <p>{product.description}</p>
                  {product.details && <p className="font-medium text-neutral-800">{product.details}</p>}
                </div>
              )}
            </div>

            {/* Fabric & Care */}
            <div className="py-3">
              <button
                onClick={() => toggleTab('fabric')}
                className="w-full flex items-center justify-between text-left font-bold uppercase tracking-wider text-black py-1"
              >
                <span>Fabric Composition & Care</span>
                {openAccordion === 'fabric' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'fabric' && (
                <div className="pt-2 text-neutral-600 leading-relaxed font-light">
                  <p>{product.fabricCare || '100% Combed Heavyweight Cotton. Wash inside out in cold water. Do not tumble dry or iron print.'}</p>
                </div>
              )}
            </div>

            {/* Fit Guide */}
            <div className="py-3">
              <button
                onClick={() => toggleTab('fit')}
                className="w-full flex items-center justify-between text-left font-bold uppercase tracking-wider text-black py-1"
              >
                <span>Fit & Silhouette</span>
                {openAccordion === 'fit' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'fit' && (
                <div className="pt-2 text-neutral-600 leading-relaxed font-light">
                  <p>{product.fitGuide || 'Signature oversized streetwear drape with dropped shoulder seams. Order your true size for intended drape or size down for tailored fit.'}</p>
                </div>
              )}
            </div>

            {/* Shipping & Returns */}
            <div className="py-3">
              <button
                onClick={() => toggleTab('shipping')}
                className="w-full flex items-center justify-between text-left font-bold uppercase tracking-wider text-black py-1"
              >
                <span>Shipping & Doorstep Exchanges</span>
                {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'shipping' && (
                <div className="pt-2 text-neutral-600 leading-relaxed font-light space-y-1">
                  <p>• Domestic express orders arrive within 3-5 business days.</p>
                  <p>• Complimentary size exchanges permitted within 7 days of package delivery.</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="pt-16 border-t border-black/10 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF5400] font-bold">COMPLETE THE LOOK</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-black">
                You May Also Like
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Mobile Add To Cart Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md p-3 border-t border-black/10 flex items-center justify-between lg:hidden shadow-2xl">
        <div className="flex flex-col pr-2">
          <span className="font-mono font-bold text-sm text-black">
            RS. {priceINR}
          </span>
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
            Size: <strong className="text-black">{selectedVariant?.size || 'Select'}</strong>
          </span>
        </div>

        <button
          disabled={isOutOfStock || cartLoading}
          onClick={handleAddToCart}
          className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-1.5"
        >
          {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
        </button>
      </div>

    </div>
  );
};
