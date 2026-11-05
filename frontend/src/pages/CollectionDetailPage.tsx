import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { Product, Collection } from '../types';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

export const CollectionDetailPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('featured');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    async function loadCollectionData() {
      try {
        setLoading(true);
        if (handle === 'all-products' || handle === 'new-in') {
          // Fetch global catalog
          const res = await apiClient.get('/products', { sort, limit: 30 });
          setCollection({
            id: handle,
            name: handle === 'new-in' ? 'New In / Latest Drops' : 'All Streetwear Pieces',
            slug: handle,
            description: 'The complete Levix archive of heavyweight garments, accessories, and collaborations.'
          });
          setProducts(res.data.products || []);
        } else {
          // Check if collection exists
          try {
            const res = await apiClient.get(`/collections/${handle}`);
            setCollection(res.data.collection);
            setProducts(res.data.products || []);
          } catch (e) {
            // Fallback to category slug
            const res = await apiClient.get('/products', { category: handle, sort, limit: 30 });
            setCollection({
              id: handle || 'category',
              name: (handle || 'Collection').replace(/-/g, ' ').toUpperCase(),
              slug: handle || '',
              description: 'Curated selection from the Levix catalog.'
            });
            setProducts(res.data.products || []);
          }
        }
      } catch (err) {
        console.warn('Error loading collection:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCollectionData();
  }, [handle, sort]);

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => {
        const catSlug = p.category?.slug?.toLowerCase() || '';
        const catName = p.category?.name?.toLowerCase() || '';
        const target = activeCategory.toLowerCase();
        return (
          catSlug === target ||
          catName === target ||
          catSlug.includes(target) ||
          catName.includes(target) ||
          (target === 'cargos' && (catSlug === 'bottoms' || catSlug === 'cargos'))
        );
      });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 py-8 space-y-8">
      
      {/* Banner / Header */}
      <div className="border-b border-black/10 pb-6 space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 flex items-center gap-1.5">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link to="/collections" className="hover:text-black">Collections</Link>
          <span>/</span>
          <span className="text-black font-bold uppercase">{collection?.name || handle}</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-black">
          {collection?.name || handle}
        </h1>
        {collection?.description && (
          <p className="text-xs text-neutral-600 max-w-2xl leading-relaxed">
            {collection.description}
          </p>
        )}
      </div>

      {/* Filter and Sorting Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-black/10 text-xs">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { label: 'All Pieces', slug: 'all' },
            { label: 'Overlength Tees', slug: 'overlength-t-shirts' },
            { label: 'Waffle Full Sleeves', slug: 'waffle-boxy-fit-full-sleeves' },
            { label: 'Acid Wash Tees', slug: 'acid-wash-t-shirts' },
            { label: 'T-Shirts', slug: 't-shirts' },
            { label: 'Hoodies', slug: 'hoodies' },
            { label: 'Polos', slug: 'polos' },
            { label: 'Cargos', slug: 'cargos' }
          ].map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-3.5 py-1.5 uppercase tracking-wider text-[11px] font-semibold transition-all whitespace-nowrap ${
                activeCategory === cat.slug
                  ? 'bg-black text-white'
                  : 'bg-white/80 border border-black/10 text-black hover:border-black'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-neutral-500 uppercase tracking-widest text-[10px]">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white border border-black/15 text-black px-3 py-1.5 text-xs font-semibold uppercase tracking-wider focus:outline-none cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest Drops</option>
          </select>
        </div>

      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-12">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="aspect-[3/4] bg-neutral-200 animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 sm:gap-x-6 gap-y-8 sm:gap-y-12">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-3">
          <p className="font-display font-bold text-lg uppercase text-black">
            No products found in this category
          </p>
          <button
            onClick={() => setActiveCategory('all')}
            className="px-6 py-2.5 bg-black text-white text-xs uppercase font-bold tracking-widest hover:bg-neutral-800"
          >
            Reset Filter
          </button>
        </div>
      )}

    </div>
  );
};
