import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/api';
import { ArrowLeft, Check, RefreshCw } from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/login');
      return;
    }
    if (user && isAdmin) loadOrders();
  }, [user, isAdmin, authLoading, navigate]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      await apiClient.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      await loadOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/10 pb-6 gap-4">
        <div>
          <Link
            to="/admin"
            className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 hover:text-black flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-black">
            Order Administration
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Review customer orders, verify Razorpay payments, and update courier fulfillment states.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs uppercase text-neutral-500">
          Loading order registry...
        </div>
      ) : (
        <div className="bg-white border border-black/10 shadow-sm overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-black/10 uppercase tracking-wider text-[10px] text-neutral-500 bg-neutral-50">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Total (INR)</th>
                <th className="py-3 px-4">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 font-sans">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-neutral-50/50">
                  <td className="py-3 px-4 font-bold font-mono text-black">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-black">{ord.customerName}</p>
                    <p className="text-[11px] text-neutral-500">{ord.customerEmail}</p>
                    <p className="text-[11px] font-mono text-neutral-400">{ord.customerPhone}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono">{ord.items.length} item(s)</span>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                      ord.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-black">
                    RS. {(ord.totalPaise / 100).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={ord.status}
                      disabled={updatingId === ord.id}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                      className="border border-black/20 bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-wider cursor-pointer focus:outline-none"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PAID">PAID</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
