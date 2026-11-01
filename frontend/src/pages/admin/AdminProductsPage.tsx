import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/api';
import { Product } from '../../types';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/login');
      return;
    }

    async function load() {
      try {
        setLoading(true);
        const res = await apiClient.get('/products', { limit: 50 });
        setProducts(res.data.products || []);
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    }

    if (user && isAdmin) load();
  }, [user, isAdmin, authLoading, navigate]);

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
            Catalog Management
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Manage product titles, descriptions, pricing in paise, and size variants.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs uppercase text-neutral-500">
          Loading catalog items...
        </div>
      ) : (
        <div className="bg-white border border-black/10 shadow-sm overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-black/10 uppercase tracking-wider text-[10px] text-neutral-500 bg-neutral-50">
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Name & Slug</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (INR)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 font-sans">
              {products.map((p) => {
                const totalStock = p.variants.reduce((acc, v) => acc + v.stockQuantity, 0);
                return (
                  <tr key={p.id} className="hover:bg-neutral-50/50">
                    <td className="py-3 px-4">
                      <div className="w-10 h-12 bg-neutral-200 overflow-hidden">
                        {p.images[0] && (
                          <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-black">
                      <Link to={`/products/${p.slug}`} className="hover:underline">
                        {p.name}
                      </Link>
                      <p className="text-[10px] font-mono text-neutral-400">{p.slug}</p>
                    </td>
                    <td className="py-3 px-4 uppercase text-neutral-600">
                      {p.category?.name || 'Unassigned'}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-black">
                      RS. {(p.basePrice / 100).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className={`px-2 py-0.5 text-[10px] font-bold ${
                        totalStock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {totalStock} in stock
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        to={`/products/${p.slug}`}
                        className="px-2.5 py-1 border border-black text-black hover:bg-black hover:text-white uppercase text-[10px] font-bold"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
