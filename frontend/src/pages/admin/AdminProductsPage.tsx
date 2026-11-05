import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiClient, resetStoredProducts } from '../../services/api';
import { Product } from '../../types';
import { AdminNav } from '../../components/admin/AdminNav';
import { 
  ArrowLeft, 
  Plus, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  X, 
  Check, 
  Image as ImageIcon, 
  Copy, 
  Search, 
  RotateCcw, 
  Filter,
  Package,
  Sparkles
} from 'lucide-react';

export const PRODUCT_CATEGORIES = [
  { 
    name: 'Overlength T-Shirts', 
    slug: 'overlength-t-shirts',
    sampleName: 'Levix Signature Overlength Heavyweight Tee',
    samplePrice: '3290',
    sampleCompare: '3990',
    defaultDesc: 'Signature elongated streetwear silhouette cut from custom-milled 280 GSM combed cotton jersey. Tailored with dropped shoulders and architectural drape extending past the hip line.',
    defaultFabric: '100% Combed Single Jersey Cotton (280 GSM). Cold gentle wash inside out.',
    defaultFit: 'Overlength dropped-shoulder drape. Designed to stack naturally over streetwear trousers and denim.',
    defaultImage1: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    defaultImage2: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80'
  },
  { 
    name: 'Waffle Boxy Fit Full Sleeves', 
    slug: 'waffle-boxy-fit-full-sleeves',
    sampleName: 'Levix Thermal Waffle Boxy Full Sleeve',
    samplePrice: '3990',
    sampleCompare: '4690',
    defaultDesc: 'Engineered from ultra-heavy 340 GSM thermal honeycomb waffle weave. Features wide dropped shoulders, dense 2x2 ribbed storm cuffs, and an exaggerated relaxed boxy torso.',
    defaultFabric: '100% Heavyweight Thermal Waffle Cotton (340 GSM). Machine wash cold, dry flat.',
    defaultFit: 'Generous boxy cut with substantial sleeve volume and structured silhouette.',
    defaultImage1: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
    defaultImage2: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80'
  },
  { 
    name: 'Acid Wash T-Shirts', 
    slug: 'acid-wash-t-shirts',
    sampleName: 'Levix Mineral Acid Wash Distressed Tee',
    samplePrice: '3490',
    sampleCompare: '4290',
    defaultDesc: 'Custom hand-treated mineral acid wash yielding unique cloudy charcoal patterns on heavy 280 GSM combed cotton. High-density typographic branding with subtle raw hem distress.',
    defaultFabric: '100% Mineral Washed Combed Cotton (280 GSM). Wash separately in cold water.',
    defaultFit: 'Vintage boxy oversized drape. Pre-shrunk to preserve architectural proportions.',
    defaultImage1: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
    defaultImage2: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'
  }
];

export const AdminProductsPage: React.FC = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const navigate = useNavigate();

  // Form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryName, setCategoryName] = useState('T-Shirts');
  const [priceINR, setPriceINR] = useState('2999');
  const [comparePriceINR, setComparePriceINR] = useState('3499');
  const [description, setDescription] = useState('');
  const [fabricCare, setFabricCare] = useState('100% Heavyweight Cotton. Wash cold inside out.');
  const [fitGuide, setFitGuide] = useState('Intentionally oversized streetwear boxy drape.');
  const [imageUrl1, setImageUrl1] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);

  // Variant quantities
  const [stockS, setStockS] = useState('15');
  const [stockM, setStockM] = useState('20');
  const [stockL, setStockL] = useState('25');
  const [stockXL, setStockXL] = useState('10');
  const [stockXXL, setStockXXL] = useState('5');

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/products', { limit: 50 });
      setProducts(res.data.products || []);
    } catch (err) {
      console.warn('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/login');
      return;
    }

    if (user && isAdmin) {
      loadProducts();
    }
  }, [user, isAdmin, authLoading, navigate]);

  const applyPreset = (catName: string) => {
    const found = PRODUCT_CATEGORIES.find(c => c.name === catName) || PRODUCT_CATEGORIES[0];
    setEditingProduct(null);
    setName(found.sampleName);
    setSlug(found.sampleName.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    setCategoryName(found.name);
    setPriceINR(found.samplePrice);
    setComparePriceINR(found.sampleCompare);
    setDescription(found.defaultDesc);
    setFabricCare(found.defaultFabric);
    setFitGuide(found.defaultFit);
    setImageUrl1(found.defaultImage1);
    setImageUrl2(found.defaultImage2);
    setIsFeatured(true);
    setStockS('15');
    setStockM('20');
    setStockL('25');
    setStockXL('10');
    setStockXXL('5');
    setShowModal(true);
  };

  const openAddModal = () => {
    applyPreset('Overlength T-Shirts');
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSlug(p.slug);
    setCategoryName(p.category?.name || 'Overlength T-Shirts');
    setPriceINR(String(Math.round(p.basePrice / 100)));
    setComparePriceINR(p.comparePrice ? String(Math.round(p.comparePrice / 100)) : '');
    setDescription(p.description || '');
    setFabricCare(p.fabricCare || '');
    setFitGuide(p.fitGuide || '');
    setImageUrl1(p.images[0]?.url || '');
    setImageUrl2(p.images[1]?.url || '');
    setIsFeatured(Boolean(p.isFeatured));

    // Fill variants stock
    const findStock = (sz: string) => {
      const v = p.variants?.find((va) => va.size.toUpperCase() === sz);
      return v ? String(v.stockQuantity) : '0';
    };
    setStockS(findStock('S'));
    setStockM(findStock('M'));
    setStockL(findStock('L'));
    setStockXL(findStock('XL'));
    setStockXXL(findStock('XXL'));

    setShowModal(true);
  };

  const handleDuplicate = (p: Product) => {
    setEditingProduct(null);
    setName(`${p.name} (Copy)`);
    setSlug(`${p.slug}-copy-${Date.now().toString().slice(-4)}`);
    setCategoryName(p.category?.name || 'Overlength T-Shirts');
    setPriceINR(String(Math.round(p.basePrice / 100)));
    setComparePriceINR(p.comparePrice ? String(Math.round(p.comparePrice / 100)) : '');
    setDescription(p.description || '');
    setFabricCare(p.fabricCare || '');
    setFitGuide(p.fitGuide || '');
    setImageUrl1(p.images[0]?.url || '');
    setImageUrl2(p.images[1]?.url || '');
    setIsFeatured(Boolean(p.isFeatured));

    const findStock = (sz: string) => {
      const v = p.variants?.find((va) => va.size.toUpperCase() === sz);
      return v ? String(v.stockQuantity) : '10';
    };
    setStockS(findStock('S'));
    setStockM(findStock('M'));
    setStockL(findStock('L'));
    setStockXL(findStock('XL'));
    setStockXXL(findStock('XXL'));

    setShowModal(true);
  };

  const handleResetCatalog = () => {
    if (window.confirm('Restore initial sample catalog? Any custom products will be reset to factory defaults.')) {
      resetStoredProducts();
      loadProducts();
      setActionMsg('✓ Restored official factory sample catalog.');
      setTimeout(() => setActionMsg(null), 4000);
    }
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingProduct) {
      setSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const basePaise = Math.round(parseFloat(priceINR || '0') * 100);
      const comparePaise = comparePriceINR ? Math.round(parseFloat(comparePriceINR) * 100) : null;
      const finalSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const images = [
        { url: imageUrl1.trim() || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80', isCover: true, sortOrder: 0 }
      ];
      if (imageUrl2.trim()) {
        images.push({ url: imageUrl2.trim(), isCover: false, sortOrder: 1 });
      }

      const variants = [
        { size: 'S', sku: `${finalSlug.toUpperCase().slice(0, 8)}-S`, stockQuantity: parseInt(stockS, 10) || 0, priceDelta: 0 },
        { size: 'M', sku: `${finalSlug.toUpperCase().slice(0, 8)}-M`, stockQuantity: parseInt(stockM, 10) || 0, priceDelta: 0 },
        { size: 'L', sku: `${finalSlug.toUpperCase().slice(0, 8)}-L`, stockQuantity: parseInt(stockL, 10) || 0, priceDelta: 0 },
        { size: 'XL', sku: `${finalSlug.toUpperCase().slice(0, 8)}-XL`, stockQuantity: parseInt(stockXL, 10) || 0, priceDelta: 0 },
        { size: 'XXL', sku: `${finalSlug.toUpperCase().slice(0, 8)}-XXL`, stockQuantity: parseInt(stockXXL, 10) || 0, priceDelta: 0 }
      ];

      const matchedCat = PRODUCT_CATEGORIES.find(c => c.name.toLowerCase() === categoryName.toLowerCase() || c.slug === categoryName.toLowerCase()) || {
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      };

      const payload = {
        name: name.trim(),
        slug: finalSlug,
        description,
        fabricCare,
        fitGuide,
        basePrice: basePaise,
        comparePrice: comparePaise,
        isFeatured,
        categoryId: matchedCat.slug,
        categoryName: matchedCat.name,
        category: { id: matchedCat.slug, name: matchedCat.name, slug: matchedCat.slug },
        images,
        variants
      };

      if (editingProduct) {
        await apiClient.put(`/admin/products/${editingProduct.id}`, payload);
        setActionMsg(`✓ Product "${name}" updated successfully.`);
      } else {
        await apiClient.post('/admin/products', payload);
        setActionMsg(`✓ New Drop "${name}" published to catalog.`);
      }

      setShowModal(false);
      await loadProducts();
      setTimeout(() => setActionMsg(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Failed to save product. Please check required fields.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, prodName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${prodName}"?`)) {
      return;
    }
    try {
      await apiClient.delete(`/admin/products/${id}`);
      setActionMsg(`✓ Product "${prodName}" deleted.`);
      await loadProducts();
      setTimeout(() => setActionMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category?.name && p.category.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCat = 
      categoryFilter === 'ALL' || 
      (categoryFilter === 'FEATURED' && p.isFeatured) ||
      (p.category?.slug && p.category.slug.toLowerCase().includes(categoryFilter.toLowerCase())) ||
      (p.category?.name && p.category.name.toLowerCase().includes(categoryFilter.toLowerCase()));

    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#EFEFEF] pb-24">
      <AdminNav />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 py-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/10 pb-6 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-[#FF5400] font-bold">
              <span>CATALOG ADMINISTRATION</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-black mt-1">
              Products & Drops Management
            </h1>
            <p className="text-xs text-neutral-600 mt-1">
              Create new streetwear drops, update retail pricing, edit descriptions, adjust size stock, or feature drops on homepage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetCatalog}
              className="px-3.5 py-2.5 border border-black/20 hover:border-black text-neutral-700 hover:text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
              title="Reset Catalog to Factory Sample Items"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Samples</span>
            </button>

            <button
              onClick={openAddModal}
              className="px-5 py-2.5 bg-[#FF5400] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#e04a00] flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Drop</span>
            </button>
          </div>
        </div>

        {actionMsg && (
          <div className="p-4 bg-black text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-between shadow-md">
            <span>{actionMsg}</span>
            <button onClick={() => setActionMsg(null)} className="opacity-70 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-black/10 shadow-xs">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search drops by name, slug or category..."
              className="w-full pl-9 pr-4 py-2 border border-black/20 text-xs focus:border-black focus:outline-none"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
            {[
              { label: 'ALL', value: 'ALL' },
              { label: 'FEATURED', value: 'FEATURED' },
              { label: 'OVERLENGTH TEES', value: 'overlength-t-shirts' },
              { label: 'WAFFLE FULL SLEEVES', value: 'waffle-boxy-fit-full-sleeves' },
              { label: 'ACID WASH TEES', value: 'acid-wash-t-shirts' }
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(cat.value)}
                className={`px-3 py-1.5 rounded-xs transition-all ${
                  categoryFilter === cat.value
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {loading ? (
          <div className="py-20 text-center font-mono text-xs uppercase text-neutral-500">
            Loading catalog items...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white border border-black/10 p-16 text-center space-y-4">
            <Package className="w-10 h-10 text-neutral-300 mx-auto" />
            <h3 className="font-display font-black text-xl uppercase tracking-tight text-black">
              {products.length === 0 ? 'Your Catalog is Ready for Drops' : 'No products match your filter criteria'}
            </h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              {products.length === 0
                ? 'Your store is completely fresh with zero fake products. Click "+ New Drop" above to publish your first authentic piece.'
                : 'Try adjusting your search query or category filter.'}
            </p>
            {products.length === 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3">
                <button
                  onClick={() => applyPreset('Overlength T-Shirts')}
                  className="px-4 py-2.5 bg-[#FF5400] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#e04a00] transition-all shadow-sm cursor-pointer"
                >
                  + Add Overlength Tee
                </button>
                <button
                  onClick={() => applyPreset('Waffle Boxy Fit Full Sleeves')}
                  className="px-4 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-sm cursor-pointer"
                >
                  + Add Waffle Full Sleeve
                </button>
                <button
                  onClick={() => applyPreset('Acid Wash T-Shirts')}
                  className="px-4 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-sm cursor-pointer"
                >
                  + Add Acid Wash Tee
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setSearchTerm(''); setCategoryFilter('ALL'); }}
                className="text-xs font-bold uppercase text-[#FF5400] underline cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white border border-black/10 shadow-sm overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-black/10 uppercase tracking-wider text-[10px] text-neutral-500 bg-neutral-50">
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Name & Slug</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Retail Price</th>
                  <th className="py-3 px-4">Inventory by Size</th>
                  <th className="py-3 px-4">Total Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 font-sans">
                {filteredProducts.map((p) => {
                  const totalStock = p.variants?.reduce((acc, v) => acc + (v.stockQuantity || 0), 0) || 0;
                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="w-12 h-14 bg-neutral-100 overflow-hidden border border-black/5">
                          {p.images && p.images[0] ? (
                            <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-black">
                        <div className="flex items-center gap-2">
                          <span>{p.name}</span>
                          {p.isFeatured && (
                            <span className="px-1.5 py-0.5 bg-[#FF5400]/10 text-[#FF5400] text-[9px] font-mono font-bold uppercase">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-mono text-neutral-400 mt-0.5">/{p.slug}</p>
                      </td>
                      <td className="py-3 px-4 uppercase text-neutral-600 font-medium">
                        {p.category?.name || 'Streetwear'}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-black">
                        RS. {(p.basePrice / 100).toLocaleString('en-IN')}
                        {p.comparePrice && (
                          <span className="block text-[10px] text-neutral-400 line-through">
                            RS. {(p.comparePrice / 100).toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 font-mono text-[9px]">
                          {p.variants?.map((v) => (
                            <span
                              key={v.id || v.size}
                              className={`px-1.5 py-0.5 rounded-xs border ${
                                v.stockQuantity > 0 ? 'bg-neutral-50 border-neutral-300 text-neutral-700' : 'bg-red-50 border-red-200 text-red-600'
                              }`}
                            >
                              {v.size}:{v.stockQuantity}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className={`px-2 py-0.5 text-[10px] font-bold ${
                          totalStock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {totalStock} in stock
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleDuplicate(p)}
                            className="p-1.5 border border-black/20 hover:border-black text-neutral-700 hover:bg-neutral-100 transition-colors"
                            title="Duplicate / Clone Drop"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 border border-black/20 hover:border-black text-black hover:bg-black hover:text-white transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            to={`/products/${p.slug}`}
                            target="_blank"
                            className="p-1.5 border border-black/20 hover:border-black text-neutral-700 hover:bg-black hover:text-white transition-colors"
                            title="View on Storefront"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Product Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl my-8 p-6 sm:p-8 border border-black shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#FF5400] font-bold uppercase tracking-widest">
                  {editingProduct ? 'EDITING CATALOG ITEM' : 'NEW STREETWEAR DROP'}
                </span>
                <h2 className="font-display font-black text-2xl uppercase tracking-tight text-black mt-0.5">
                  {editingProduct ? `Edit: ${editingProduct.name}` : 'Create New Product'}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-neutral-100 text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!editingProduct && (
              <div className="bg-neutral-50 p-3.5 border border-black/10 space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#FF5400] font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Quick Category Presets (1-Click Specifications):</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => applyPreset(cat.name)}
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase border transition-all cursor-pointer ${
                        categoryName === cat.name
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                      }`}
                    >
                      + {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5 text-xs">
              
              {/* Product Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold text-neutral-700 tracking-wider mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Acid Wash Boxy Graphic Tee"
                    className="w-full border border-black/20 p-2.5 font-medium focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold text-neutral-700 tracking-wider mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. acid-wash-boxy-tee"
                    className="w-full border border-black/20 p-2.5 font-mono focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              {/* Category & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase font-bold text-neutral-700 tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryName}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setCategoryName(newCat);
                      const catObj = PRODUCT_CATEGORIES.find(c => c.name === newCat);
                      if (catObj && !editingProduct) {
                        setDescription(catObj.defaultDesc);
                        setFabricCare(catObj.defaultFabric);
                        setFitGuide(catObj.defaultFit);
                        setPriceINR(catObj.samplePrice);
                        setComparePriceINR(catObj.sampleCompare);
                        setImageUrl1(catObj.defaultImage1);
                        setImageUrl2(catObj.defaultImage2);
                      }
                    }}
                    className="w-full border border-black/20 p-2.5 bg-white font-medium focus:border-black focus:outline-none uppercase"
                  >
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block uppercase font-bold text-neutral-700 tracking-wider mb-1">
                    Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={priceINR}
                    onChange={(e) => setPriceINR(e.target.value)}
                    placeholder="2999"
                    className="w-full border border-black/20 p-2.5 font-mono font-bold focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold text-neutral-700 tracking-wider mb-1">
                    MRP / Compare (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={comparePriceINR}
                    onChange={(e) => setComparePriceINR(e.target.value)}
                    placeholder="3499"
                    className="w-full border border-black/20 p-2.5 font-mono focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block uppercase font-bold text-neutral-700 tracking-wider mb-1">
                  Product Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the silhouette, fabric weight, screen printing technique, and styling."
                  className="w-full border border-black/20 p-2.5 font-sans leading-relaxed focus:border-black focus:outline-none"
                />
              </div>

              {/* Image URLs */}
              <div className="space-y-3">
                <label className="block uppercase font-bold text-neutral-700 tracking-wider">
                  Product Imagery (Image URLs) *
                </label>
                <div className="space-y-2">
                  <input
                    type="url"
                    required
                    value={imageUrl1}
                    onChange={(e) => setImageUrl1(e.target.value)}
                    placeholder="Primary Cover Image URL (e.g. https://...)"
                    className="w-full border border-black/20 p-2.5 font-mono focus:border-black focus:outline-none"
                  />
                  <input
                    type="url"
                    value={imageUrl2}
                    onChange={(e) => setImageUrl2(e.target.value)}
                    placeholder="Secondary Hover Image URL (optional)"
                    className="w-full border border-black/20 p-2.5 font-mono focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              {/* Inventory by Size */}
              <div className="space-y-2 pt-2 border-t border-black/10">
                <label className="block uppercase font-bold text-neutral-700 tracking-wider">
                  Inventory / Stock Quantity by Size
                </label>
                <div className="grid grid-cols-5 gap-3">
                  <div>
                    <span className="block text-[10px] font-mono text-center mb-1 font-bold">SIZE S</span>
                    <input
                      type="number"
                      min="0"
                      value={stockS}
                      onChange={(e) => setStockS(e.target.value)}
                      className="w-full border border-black/20 p-2 text-center font-mono focus:border-black focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-center mb-1 font-bold">SIZE M</span>
                    <input
                      type="number"
                      min="0"
                      value={stockM}
                      onChange={(e) => setStockM(e.target.value)}
                      className="w-full border border-black/20 p-2 text-center font-mono focus:border-black focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-center mb-1 font-bold">SIZE L</span>
                    <input
                      type="number"
                      min="0"
                      value={stockL}
                      onChange={(e) => setStockL(e.target.value)}
                      className="w-full border border-black/20 p-2 text-center font-mono focus:border-black focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-center mb-1 font-bold">SIZE XL</span>
                    <input
                      type="number"
                      min="0"
                      value={stockXL}
                      onChange={(e) => setStockXL(e.target.value)}
                      className="w-full border border-black/20 p-2 text-center font-mono focus:border-black focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-center mb-1 font-bold">SIZE XXL</span>
                    <input
                      type="number"
                      min="0"
                      value={stockXXL}
                      onChange={(e) => setStockXXL(e.target.value)}
                      className="w-full border border-black/20 p-2 text-center font-mono focus:border-black focus:outline-none font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Featured Drop Checkbox */}
              <div className="pt-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-black"
                />
                <label htmlFor="featuredToggle" className="font-bold uppercase tracking-wider text-neutral-800 cursor-pointer">
                  Feature this Drop on Homepage Carousel
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-black/10 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-black/20 hover:border-black text-black uppercase font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white uppercase font-bold text-xs tracking-wider flex items-center gap-1.5 shadow-sm"
                >
                  {saving ? (
                    <span>Saving Drop...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-[#FF5400]" />
                      <span>{editingProduct ? 'Save Changes' : 'Publish Product'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
