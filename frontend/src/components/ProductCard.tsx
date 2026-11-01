import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const { addToCart, loading } = useCartStore();

  const primaryImage = product.images[0]?.url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';
  const secondaryImage = product.images[1]?.url || primaryImage;

  const priceINR = (product.basePrice / 100).toLocaleString('en-IN');
  const comparePriceINR = product.comparePrice ? (product.comparePrice / 100).toLocaleString('en-IN') : null;

  const handleQuickAdd = async (variantId: string) => {
    try {
      await addToCart(variantId, 1);
      setShowQuickAdd(false);
    } catch (err: any) {
      alert(err.message || 'Could not add to cart');
    }
  };

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickAdd(false);
      }}
    >
      {/* Image Container with 3:4 Aspect Ratio & 10px Rounded Corners matching Levix */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[10px] bg-neutral-200">
        <Link to={`/products/${product.slug}`} className="block w-full h-full">
          {/* Primary Image */}
          <img
            src={primaryImage}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover object-center product-card-img-primary transition-opacity duration-500`}
            loading="lazy"
          />
          {/* Secondary Editorial Image on Hover */}
          {secondaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.name} back view`}
              className={`absolute inset-0 w-full h-full object-cover object-center product-card-img-secondary transition-opacity duration-500`}
              loading="lazy"
            />
          )}
        </Link>

        {/* Badge (Godzilla collab / Best seller / Sale) */}
        {product.slug.includes('godzilla') && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-black text-[#FF5400] text-[9px] font-mono uppercase font-bold tracking-wider px-2 py-0.5">
            GODZILLA
          </div>
        )}
        {product.comparePrice && !product.slug.includes('godzilla') && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-black text-white text-[9px] font-mono uppercase font-bold tracking-wider px-2 py-0.5">
            SALE
          </div>
        )}

        {/* Quick Add Overlay on Hover (Desktop) */}
        <div
          className={`absolute bottom-0 inset-x-0 p-3 transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
          }`}
        >
          {showQuickAdd ? (
            <div className="bg-white/95 backdrop-blur-md p-2.5 shadow-lg border border-black/10 flex flex-wrap gap-1.5 justify-center">
              <span className="w-full text-[10px] text-center font-bold tracking-wider text-black uppercase mb-1">
                Select Size
              </span>
              {product.variants.map((variant) => {
                const isOutOfStock = variant.stockQuantity <= 0;
                return (
                  <button
                    key={variant.id}
                    disabled={isOutOfStock || loading}
                    onClick={() => handleQuickAdd(variant.id)}
                    className={`text-[11px] font-semibold py-1 px-2.5 border transition-all ${
                      isOutOfStock
                        ? 'border-neutral-300 text-neutral-400 line-through cursor-not-allowed'
                        : 'border-black text-black hover:bg-black hover:text-white'
                    }`}
                  >
                    {variant.size}
                  </button>
                );
              })}
            </div>
          ) : (
            <button
              onClick={() => setShowQuickAdd(true)}
              className="w-full bg-black/90 hover:bg-black text-white text-[11px] font-bold uppercase tracking-widest py-3 transition-colors shadow-md backdrop-blur-sm"
            >
              + Quick Add
            </button>
          )}
        </div>
      </div>

      {/* Product Metadata */}
      <div className="pt-3 pb-1 flex flex-col space-y-1">
        <Link
          to={`/products/${product.slug}`}
          className="text-xs sm:text-[13px] font-medium text-black line-clamp-1 hover:text-neutral-600 transition-colors"
        >
          {product.name}
        </Link>
        <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-900 font-mono">
          <span>RS. {priceINR}</span>
          {comparePriceINR && (
            <span className="text-neutral-500 line-through font-normal text-[11px]">
              RS. {comparePriceINR}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
