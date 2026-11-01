import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, closeCart, cart, fetchCart, updateQuantity, removeItem, loading } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (!isCartOpen) return null;

  const subtotalINR = cart ? (cart.subtotalPaise / 100).toLocaleString('en-IN') : '0';
  const remainingINR = cart ? (cart.remainingForFreeShippingPaise / 100).toLocaleString('en-IN') : '2,999';
  const freeShippingPct = cart
    ? Math.min(100, Math.round((cart.subtotalPaise / cart.freeShippingThresholdPaise) * 100))
    : 0;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#EFEFEF] flex flex-col shadow-2xl border-l border-black/10">
          
          {/* Header */}
          <div className="p-5 border-b border-black/10 flex items-center justify-between bg-[#EFEFEF]">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-black" />
              <h2 className="font-display font-black text-xl uppercase tracking-tight text-black">
                Your Bag ({cart?.itemCount || 0})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-black hover:opacity-60 transition-opacity"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Tier Banner */}
          <div className="px-5 py-3.5 bg-neutral-200 border-b border-black/10">
            {freeShippingPct >= 100 ? (
              <p className="text-xs font-semibold text-green-800 text-center uppercase tracking-wide">
                🎉 Congratulations! You unlocked FREE Domestic Shipping.
              </p>
            ) : (
              <p className="text-xs font-medium text-neutral-800 text-center tracking-wide">
                Add <span className="font-bold text-black font-mono">RS. {remainingINR}</span> more for <span className="font-bold text-black">FREE SHIPPING</span>
              </p>
            )}
            <div className="w-full bg-neutral-300 h-1.5 mt-2 rounded-full overflow-hidden">
              <div
                className="bg-black h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingPct}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {!cart || cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                <ShoppingBag className="w-12 h-12 text-neutral-400 stroke-1" />
                <div className="space-y-1">
                  <p className="font-display font-bold text-lg uppercase tracking-tight text-black">
                    Your bag is empty
                  </p>
                  <p className="text-xs text-neutral-500">
                    Discover new drops and essential luxury streetwear.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/collections/all-products');
                  }}
                  className="mt-4 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                >
                  Explore Drops
                </button>
              </div>
            ) : (
              cart.items.map((item) => {
                const itemPriceINR = (item.totalPaise / 100).toLocaleString('en-IN');
                return (
                  <div
                    key={item.id}
                    className="flex space-x-3.5 pb-4 border-b border-black/5 bg-white/60 p-3 shadow-sm"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-20 h-24 bg-neutral-200 flex-shrink-0 overflow-hidden relative">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">
                          LEVIX
                        </div>
                      )}
                    </div>

                    {/* Item Metadata */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold text-black line-clamp-1">
                          {item.productName}
                        </h4>
                        <p className="text-[11px] text-neutral-600 font-mono">
                          Size: <span className="font-bold text-black uppercase">{item.size}</span>
                        </p>
                        <p className="text-xs font-bold text-black font-mono">
                          RS. {itemPriceINR}
                        </p>
                      </div>

                      {/* Quantity & Delete Controls */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-black/20 bg-white">
                          <button
                            disabled={loading || item.quantity <= 1}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-neutral-100 disabled:opacity-40"
                          >
                            <Minus className="w-3 h-3 text-black" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold font-mono">
                            {item.quantity}
                          </span>
                          <button
                            disabled={loading || item.quantity >= item.stockQuantity}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-neutral-100 disabled:opacity-40"
                          >
                            <Plus className="w-3 h-3 text-black" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cart && cart.items.length > 0 && (
            <div className="p-5 bg-white border-t border-black/10 space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="uppercase tracking-wider text-neutral-600">Subtotal</span>
                <span className="font-bold font-mono text-base text-black">RS. {subtotalINR}</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Taxes included. Shipping calculated at checkout.
              </p>
              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
