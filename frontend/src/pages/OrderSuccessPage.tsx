import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import { Order } from '../types';
import { CheckCircle2, Package, ArrowRight, ShieldCheck } from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await apiClient.get(`/orders/${orderNumber}`);
        setOrder(res.data.order);
      } catch (err) {
        console.warn('Could not load order:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderNumber]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-8">
      
      <div className="flex flex-col items-center space-y-3">
        <CheckCircle2 className="w-16 h-16 text-black stroke-[1.5]" />
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF5400] font-bold">
          ORDER CONFIRMED & SECURED
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-black">
          Thank You For Your Order
        </h1>
        <p className="text-xs text-neutral-600 max-w-md">
          A confirmation receipt and courier tracking details will be sent to your email.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 border border-black/10 shadow-sm text-left space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-black/10 gap-2">
          <div>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Order Number</span>
            <p className="font-mono font-bold text-base text-black">{orderNumber}</p>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Payment Status</span>
            <p className="text-xs font-bold uppercase tracking-wider text-green-700 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>PAID & VERIFIED</span>
            </p>
          </div>
        </div>

        {order && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-black">
              Items Ordered ({order.items.length})
            </h4>
            <div className="divide-y divide-black/5">
              {order.items.map((it) => (
                <div key={it.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-semibold text-black">{it.productName}</p>
                    <p className="text-[11px] text-neutral-500 font-mono">
                      Size: {it.size} • Qty: {it.quantity}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-black">
                    RS. {(it.subtotalPaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-black/10 pt-3 flex justify-between items-center text-sm font-bold text-black">
              <span className="uppercase tracking-wider">Total Paid</span>
              <span className="font-mono text-base">
                RS. {(order.totalPaise / 100).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}

      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/collections/all-products"
          className="w-full sm:w-auto px-8 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/account/orders"
          className="w-full sm:w-auto px-8 py-3.5 border border-black text-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
        >
          View Order History
        </Link>
      </div>

    </div>
  );
};
