import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/api';
import { ShieldCheck, Lock, ArrowRight, Tag } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, fetchCart } = useCartStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [email, setEmail] = useState(user?.email || '');
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="font-display font-black text-2xl uppercase text-black">Your bag is empty</h2>
        <p className="text-xs text-neutral-600">Please add items to your cart before proceeding to checkout.</p>
        <Link to="/collections/all-products" className="inline-block px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest">
          Explore Drops
        </Link>
      </div>
    );
  }

  const subtotalINR = Math.round(cart.subtotalPaise / 100);
  const shippingINR = Math.round(cart.shippingPaise / 100);
  const discountINR = Math.round(couponDiscount / 100);
  const totalINR = Math.max(0, subtotalINR - discountINR) + shippingINR;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'LEVIX10' || code === 'WELCOME10') {
      const disc = Math.round((cart.subtotalPaise * 10) / 100);
      setAppliedCoupon('LEVIX10');
      setCouponDiscount(disc);
      setErrorMsg(null);
    } else {
      setErrorMsg('Invalid coupon code. Try LEVIX10');
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      // 1. Create Order on Backend
      const orderRes = await apiClient.post('/orders', {
        customerEmail: email,
        customerName: fullName,
        customerPhone: phone,
        shippingAddress: {
          fullName,
          line1,
          line2: line2 || undefined,
          city,
          state,
          postalCode,
          country: 'India',
          phone
        },
        cartId: cart.cartId,
        couponCode: appliedCoupon || undefined
      });

      const { order, razorpayOrderId, amountPaise, keyId } = orderRes.data;

      // 2. Launch Razorpay Checkout Modal
      if ((window as any).Razorpay && razorpayOrderId && !razorpayOrderId.startsWith('order_mock_')) {
        const options = {
          key: keyId,
          amount: amountPaise,
          currency: 'INR',
          name: 'LEVIX',
          description: `Order #${order.orderNumber}`,
          order_id: razorpayOrderId,
          handler: async function (response: any) {
            try {
              // Verify Cryptographic Signature on Backend
              await apiClient.post('/payments/verify', {
                orderNumber: order.orderNumber,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                cartId: cart.cartId
              });
              await fetchCart();
              navigate(`/order-success/${order.orderNumber}`);
            } catch (vErr: any) {
              alert('Payment signature verification failed: ' + vErr.message);
            }
          },
          prefill: {
            name: fullName,
            email: email,
            contact: phone
          },
          theme: {
            color: '#000000'
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          alert('Payment Failed: ' + resp.error.description);
          setLoading(false);
        });
        rzp.open();
      } else {
        // Test / Sandbox auto-verify path
        console.log('Running test payment verification for order:', order.orderNumber);
        await apiClient.post('/payments/verify', {
          orderNumber: order.orderNumber,
          razorpayOrderId: razorpayOrderId || 'order_mock_123',
          razorpayPaymentId: `pay_mock_${Date.now()}`,
          razorpaySignature: 'mock_signature_test',
          cartId: cart.cartId
        });
        await fetchCart();
        navigate(`/order-success/${order.orderNumber}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order. Please check your information.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 py-10">
      
      <div className="border-b border-black/10 pb-6 mb-8">
        <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-black">
          Express Checkout
        </h1>
        <p className="text-xs text-neutral-600 mt-1">
          Complete your order using 256-bit encrypted Razorpay payment gateway.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 mb-6 bg-red-100 border border-red-300 text-red-800 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Customer & Address Details (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-bold uppercase tracking-wider text-sm text-black">
              1. Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white border border-black/20 p-3 text-xs focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Phone Number (for Courier SMS) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full bg-white border border-black/20 p-3 text-xs focus:border-black focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="font-bold uppercase tracking-wider text-sm text-black">
              2. Shipping Address
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Full Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aarav Sharma"
                  className="w-full bg-white border border-black/20 p-3 text-xs focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Address Line 1 (Street, Building, Flat) *
                </label>
                <input
                  type="text"
                  required
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  placeholder="House / Flat No., Street, Area"
                  className="w-full bg-white border border-black/20 p-3 text-xs focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Address Line 2 (Landmark, Optional)
                </label>
                <input
                  type="text"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  placeholder="Apartment, suite, landmark (optional)"
                  className="w-full bg-white border border-black/20 p-3 text-xs focus:border-black focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full bg-white border border-black/20 p-3 text-xs focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Delhi"
                    className="w-full bg-white border border-black/20 p-3 text-xs focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="110001"
                    className="w-full bg-white border border-black/20 p-3 text-xs focus:border-black focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/70 border border-black/10 flex items-center space-x-3 text-xs text-neutral-700">
            <Lock className="w-5 h-5 text-black flex-shrink-0" />
            <span>All transactions are secured with 256-bit SSL encryption via Razorpay.</span>
          </div>

        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 border border-black/10 shadow-sm space-y-6 self-start">
          <h3 className="font-display font-black text-xl uppercase tracking-tight text-black border-b border-black/10 pb-3">
            Order Summary ({cart.itemCount})
          </h3>

          {/* Items Preview */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 text-xs">
                <div className="w-14 h-16 bg-neutral-200 overflow-hidden flex-shrink-0">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-black truncate">{item.productName}</p>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    Size: {item.size} • Qty: {item.quantity}
                  </p>
                </div>
                <span className="font-bold font-mono text-black">
                  RS. {(item.totalPaise / 100).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Coupon Code Input */}
          <div className="pt-2 border-t border-black/10">
            <div className="flex space-x-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="PROMO CODE (e.g. LEVIX10)"
                className="flex-1 border border-black/20 px-3 py-2 text-xs uppercase font-mono focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black"
              >
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <p className="text-[11px] text-green-700 font-semibold mt-1.5 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span>Coupon {appliedCoupon} applied (10% Off)!</span>
              </p>
            )}
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-2 border-t border-black/10 pt-4 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-mono text-black font-semibold">RS. {subtotalINR.toLocaleString('en-IN')}</span>
            </div>
            {discountINR > 0 && (
              <div className="flex justify-between text-green-700 font-semibold">
                <span>Coupon Discount</span>
                <span className="font-mono">- RS. {discountINR.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Express Delivery</span>
              <span className="font-mono text-black font-semibold">
                {shippingINR === 0 ? 'FREE' : `RS. ${shippingINR}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-black border-t border-black/10 pt-3">
              <span className="uppercase tracking-wider">Total</span>
              <span className="font-mono text-lg">RS. {totalINR.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
          >
            <span>{loading ? 'Securing Transaction...' : `Pay RS. ${totalINR.toLocaleString('en-IN')} via Razorpay`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </form>

    </div>
  );
};
