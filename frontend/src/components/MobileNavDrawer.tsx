import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronRight, ChevronDown, User, MapPin, Shield, Search } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../context/AuthContext';

export const MobileNavDrawer: React.FC = () => {
  const { isMobileNavOpen, closeMobileNav, openCart } = useCartStore();
  const { user, isAdmin, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isTopOpen, setIsTopOpen] = useState(false);
  const [isBottomOpen, setIsBottomOpen] = useState(false);
  const [isAccOpen, setIsAccOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const navigate = useNavigate();

  if (!isMobileNavOpen) return null;

  const handleNav = (path: string) => {
    closeMobileNav();
    navigate(path);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      closeMobileNav();
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeMobileNav}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-xs sm:max-w-sm bg-[#EFEFEF] flex flex-col shadow-2xl border-r border-black/10">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-black/10 flex items-center justify-between bg-[#EFEFEF]">
            <span className="font-display font-black text-2xl uppercase tracking-tighter text-black">
              LEVIX
            </span>
            <button
              onClick={closeMobileNav}
              className="p-1.5 text-black hover:opacity-60 transition-opacity"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search inside Drawer */}
          <div className="p-4 border-b border-black/10 bg-white/40">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center border border-black/20 bg-white">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH CATALOG..."
                className="w-full bg-transparent px-3 py-2 text-xs placeholder:text-neutral-400 focus:outline-none uppercase tracking-wider font-medium"
              />
              <button
                type="submit"
                className="p-2 text-black hover:opacity-60 transition-opacity"
                aria-label="Submit search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Nav List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 text-xs sm:text-sm font-semibold uppercase tracking-wider text-black">
            
            {/* Top Featured Drops */}
            <div className="space-y-3 pb-4 border-b border-black/10">
              <button
                onClick={() => handleNav('/collections/new-in')}
                className="w-full flex items-center justify-between text-left py-1 hover:text-neutral-600 transition-colors"
              >
                <span>New Arrivals</span>
                <span className="text-[9px] bg-black text-white px-1.5 py-0.2 font-mono">2026</span>
              </button>

              <button
                onClick={() => handleNav('/collections/t-shirts')}
                className="w-full flex items-center justify-between text-left py-1 hover:text-neutral-600 transition-colors"
              >
                <span>T-Shirts & Tops</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={() => handleNav('/collections/winter-collection')}
                className="w-full flex items-center justify-between text-left py-1 hover:text-neutral-600 transition-colors"
              >
                <span>Winter Collection 2025</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={() => handleNav('/collections/levix-racing-club')}
                className="w-full flex items-center justify-between text-left py-1 hover:text-neutral-600 transition-colors"
              >
                <span>Levix Racing Club</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={() => handleNav('/collections/summer-basics')}
                className="w-full flex items-center justify-between text-left py-1 hover:text-neutral-600 transition-colors"
              >
                <span>Basics</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={() => handleNav('/collections/all-products')}
                className="w-full flex items-center justify-between text-left py-1 hover:text-neutral-600 transition-colors"
              >
                <span>Icons Archive</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            {/* 1. Accordion: Top */}
            <div className="space-y-1.5 pb-3 border-b border-black/10">
              <button
                onClick={() => setIsTopOpen(!isTopOpen)}
                className="w-full flex items-center justify-between text-left py-1 text-black font-semibold text-xs tracking-wider uppercase"
              >
                <span>Top</span>
                {isTopOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
              </button>
              
              {isTopOpen && (
                <div className="pl-2 pt-1 space-y-2 text-neutral-700 text-xs font-normal">
                  {[
                    { label: 'T-shirts', slug: 't-shirts' },
                    { label: 'Polos', slug: 'polos' },
                    { label: 'Shirts', slug: 't-shirts' },
                    { label: 'Sweatshirts', slug: 'hoodies' },
                    { label: 'Hoodies', slug: 'hoodies' },
                    { label: 'Jackets', slug: 'winter-collection' }
                  ].map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => handleNav(`/collections/${cat.slug}`)}
                      className="block w-full text-left py-0.5 hover:text-black text-[12px]"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Accordion: Bottom */}
            <div className="space-y-1.5 pb-3 border-b border-black/10">
              <button
                onClick={() => setIsBottomOpen(!isBottomOpen)}
                className="w-full flex items-center justify-between text-left py-1 text-black font-semibold text-xs tracking-wider uppercase"
              >
                <span>Bottom</span>
                {isBottomOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
              </button>
              
              {isBottomOpen && (
                <div className="pl-2 pt-1 space-y-2 text-neutral-700 text-xs font-normal">
                  {[
                    { label: 'Cargos', slug: 'bottoms' },
                    { label: 'Jeans', slug: 'bottoms' },
                    { label: 'Pants', slug: 'bottoms' },
                    { label: 'Shorts', slug: 'bottoms' }
                  ].map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => handleNav(`/collections/${cat.slug}`)}
                      className="block w-full text-left py-0.5 hover:text-black text-[12px]"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Accordion: Accessories */}
            <div className="space-y-1.5 pb-3 border-b border-black/10">
              <button
                onClick={() => setIsAccOpen(!isAccOpen)}
                className="w-full flex items-center justify-between text-left py-1 text-black font-semibold text-xs tracking-wider uppercase"
              >
                <span>Accessories</span>
                {isAccOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
              </button>
              
              {isAccOpen && (
                <div className="pl-2 pt-1 space-y-2 text-neutral-700 text-xs font-normal">
                  {[
                    { label: 'Bags & Totes', slug: 'bags' },
                    { label: 'Caps & Beanies', slug: 'caps' }
                  ].map((acc) => (
                    <button
                      key={acc.label}
                      onClick={() => handleNav(`/collections/${acc.slug}`)}
                      className="block w-full text-left py-0.5 hover:text-black text-[12px]"
                    >
                      {acc.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Accordion: Shop by color */}
            <div className="space-y-1.5 pb-3 border-b border-black/10">
              <button
                onClick={() => setIsColorOpen(!isColorOpen)}
                className="w-full flex items-center justify-between text-left py-1 text-black font-semibold text-xs tracking-wider uppercase"
              >
                <span>Shop by color</span>
                {isColorOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
              </button>
              
              {isColorOpen && (
                <div className="pl-2 pt-1 grid grid-cols-2 gap-2 text-xs">
                  {[
                    { name: 'BLUES', bg: '#2563EB' },
                    { name: 'BROWNS', bg: '#78350F' },
                    { name: 'GREENS', bg: '#15803D' },
                    { name: 'NEUTRALS', bg: '#737373' },
                    { name: 'PURPLES', bg: '#7E22CE' },
                    { name: 'REDS', bg: '#DC2626' }
                  ].map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handleNav(`/collections/all-products?color=${c.name}`)}
                      className="flex items-center space-x-2 py-1 text-neutral-700 hover:text-black text-[11px] font-medium"
                    >
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c.bg }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Secondary Services Links */}
            <div className="space-y-3 text-xs text-neutral-600 font-medium">
              <button
                onClick={() => handleNav('/pages/store')}
                className="w-full flex items-center space-x-2 text-left hover:text-black"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Flagship Stores Directory</span>
              </button>

              <button
                onClick={() => handleNav('/pages/about')}
                className="w-full flex items-center space-x-2 text-left hover:text-black"
              >
                <span>Our Story & Manifesto</span>
              </button>

              <button
                onClick={() => handleNav('/policies/shipping-policy')}
                className="w-full flex items-center space-x-2 text-left hover:text-black"
              >
                <span>Order Support & Express Shipping</span>
              </button>

              <button
                onClick={() => handleNav('/policies/shipping-policy#returns')}
                className="w-full flex items-center space-x-2 text-left hover:text-black"
              >
                <span>Returns & Exchanges Portal</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => handleNav('/admin')}
                  className="w-full flex items-center space-x-2 text-left text-[#FF5400] font-bold"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Dashboard</span>
                </button>
              )}
            </div>

          </div>

          {/* Account Footer Bar */}
          <div className="p-4 sm:p-5 border-t border-black/10 bg-white/70 space-y-3">
            {user ? (
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-black">{user.email}</p>
                  <button
                    onClick={() => handleNav('/account')}
                    className="text-neutral-500 hover:underline"
                  >
                    View Account
                  </button>
                </div>
                <button
                  onClick={async () => {
                    await logout();
                    closeMobileNav();
                  }}
                  className="px-3 py-1.5 border border-black text-black font-semibold uppercase text-[10px]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('/login')}
                className="w-full bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Members Login / Register</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
