import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { apiClient } from '../services/api';
import { Product } from '../types';

export const SearchDrawer: React.FC = () => {
  const { isSearchOpen, closeSearch } = useCartStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/products', { search: query, limit: 6 });
        setResults(res.data.products || []);
      } catch (err) {
        console.warn('Search query error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isSearchOpen) return null;

  const handleSelectProduct = (slug: string) => {
    closeSearch();
    navigate(`/products/${slug}`);
  };

  const handleViewAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      closeSearch();
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeSearch}
      />

      <div className="fixed inset-x-0 top-0 max-h-[85vh] bg-[#EFEFEF] shadow-2xl border-b border-black/15 overflow-y-auto">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 py-6">
          
          {/* Search Header Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-black/10">
            <form onSubmit={handleViewAll} className="flex-1 flex items-center space-x-3">
              <Search className="w-5 h-5 text-black flex-shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SEARCH TEES, HOODIES, CARGOS, GODZILLA..."
                className="w-full bg-transparent text-base sm:text-xl font-display uppercase tracking-tight placeholder:text-neutral-400 focus:outline-none text-black"
              />
            </form>
            <button
              onClick={closeSearch}
              className="p-2 text-black hover:opacity-60 transition-opacity ml-4"
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Categories Bar */}
          <div className="py-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-neutral-500 uppercase tracking-widest text-[10px] mr-2">Quick Searches:</span>
            {['Godzilla', 'Hoodies', 'Polo', 'Cargos', 'T-Shirts'].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-3 py-1 bg-white border border-black/10 hover:border-black text-black uppercase text-[11px] transition-colors"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Results Grid */}
          <div className="pt-4 pb-8">
            {loading ? (
              <div className="py-12 text-center text-xs text-neutral-500 font-mono uppercase tracking-widest">
                Searching catalog...
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-semibold text-neutral-600">
                  <span>Found {results.length} results</span>
                  <button
                    onClick={handleViewAll}
                    className="text-black hover:underline uppercase text-[11px] flex items-center gap-1 font-bold"
                  >
                    <span>View all matching items</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {results.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleSelectProduct(prod.slug)}
                      className="cursor-pointer group flex flex-col space-y-2 bg-white/50 p-2 border border-black/5 hover:border-black transition-colors"
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-neutral-200">
                        <img
                          src={prod.images[0]?.url}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-semibold text-black line-clamp-1">{prod.name}</p>
                        <p className="text-[11px] font-mono font-bold text-neutral-900">
                          RS. {(prod.basePrice / 100).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : query.trim() ? (
              <div className="py-12 text-center text-xs text-neutral-500 uppercase tracking-widest">
                No streetwear items matching "{query}"
              </div>
            ) : null}
          </div>

        </div>
      </div>
    </div>
  );
};
