import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User as UserIcon, Menu, ChevronDown, ArrowRight, Heart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const { cart, toggleCart, openSearch, openMobileNav } = useCartStore();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const itemCount = cart?.itemCount || 0;

  const megaMenuCollections = [
    {
      title: 'Bags & Leather',
      handle: 'bags',
      img: 'https://bluorng.com/cdn/shop/files/dgbetbet-Recovered.jpg?v=1787987969&width=400'
    },
    {
      title: 'Headwear & Caps',
      handle: 'caps',
      img: 'https://bluorng.com/cdn/shop/files/erfscersd.jpg?v=1781695074&width=400'
    },
    {
      title: 'Winter Collection 2025',
      handle: 'winter-collection',
      img: 'https://bluorng.com/cdn/shop/files/cdwasa.jpg?v=1769161054&width=400'
    },
    {
      title: 'Levix Racing Club',
      handle: 'levix-racing-club',
      img: 'https://bluorng.com/cdn/shop/files/qewrsceqwdsa.jpg?v=1769161060&width=400'
    },
    {
      title: 'Levix Basics',
      handle: 'summer-basics',
      img: 'https://bluorng.com/cdn/shop/files/UJNLL_JN.jpg?v=1770039557&width=400'
    },
    {
      title: 'Yacht Collection',
      handle: 'yacht-collection',
      img: 'https://bluorng.com/cdn/shop/files/grvfcre.jpg?v=1770966605&width=400'
    }
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#EFEFEF]/95 backdrop-blur-md shadow-sm border-b border-black/5 h-[58px] sm:h-[68px]'
          : 'bg-[#EFEFEF] h-[58px] sm:h-[68px] border-b border-black/5'
      } flex items-center`}
    >
      <div className="max-w-[1440px] w-full mx-auto px-3 sm:px-6 md:px-8 xl:px-12 flex items-center justify-between">
        
        {/* Left: Mobile Hamburger & Desktop Navigation Links */}
        <div className="flex items-center space-x-6">
          <button
            onClick={openMobileNav}
            className="lg:hidden p-1.5 text-black hover:opacity-70 transition-opacity flex items-center justify-center"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <nav className="hidden lg:flex items-center space-x-7 text-[12px] uppercase tracking-wider font-semibold">
            <Link to="/collections/all-products" className="text-black hover:text-neutral-600 transition-colors">
              Explore
            </Link>
            <Link to="/collections/new-in" className="text-black hover:text-neutral-600 transition-colors">
              New In
            </Link>
            
            {/* Collections Mega Menu Trigger */}
            <div
              className="relative py-2"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <Link
                to="/collections"
                className="text-black hover:text-neutral-600 transition-colors flex items-center gap-1"
              >
                <span>Collections</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </Link>

              {/* Mega Menu Dropdown */}
              {isMegaMenuOpen && (
                <div className="absolute top-full -left-20 w-[840px] bg-[#EFEFEF] border border-black/10 shadow-2xl p-6 grid grid-cols-3 gap-5 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  {megaMenuCollections.map((col) => (
                    <Link
                      key={col.handle}
                      to={`/collections/${col.handle}`}
                      onClick={() => setIsMegaMenuOpen(false)}
                      className="group block relative overflow-hidden bg-neutral-200 aspect-[16/10] border border-black/5"
                    >
                      <img
                        src={col.img}
                        alt={col.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3.5">
                        <span className="text-[11px] font-bold text-white uppercase tracking-wider group-hover:text-[#FF5400] transition-colors flex items-center justify-between w-full">
                          <span>{col.title}</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                      </div>
                    </Link>
                  ))}
                  <div className="col-span-3 pt-2 border-t border-black/10 flex justify-between items-center text-[11px]">
                    <span className="text-neutral-500 uppercase tracking-widest font-mono">Curated Atelier Capsules</span>
                    <Link
                      to="/collections"
                      onClick={() => setIsMegaMenuOpen(false)}
                      className="font-bold uppercase tracking-wider text-black hover:text-[#FF5400] underline"
                    >
                      View All Collections →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/collections/levix-x-godzilla"
              className="text-[#FF5400] font-bold hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              <span>Godzilla</span>
              <span className="text-[9px] bg-black text-white px-1.5 py-0.2 rounded-none font-mono">NEW</span>
            </Link>
            <Link to="/collections/levix-racing-club" className="text-black hover:text-neutral-600 transition-colors">
              Racing Club
            </Link>
          </nav>
        </div>

        {/* Center: Brand Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="group block text-center select-none">
            <span className="font-sans font-black text-xl sm:text-2xl md:text-3xl tracking-[0.25em] uppercase text-black inline-block hover:opacity-80 transition-opacity">
              LEVIX
            </span>
          </Link>
        </div>

        {/* Right: Actions (Stores, Search, Wishlist, Account, Cart) */}
        <div className="flex items-center space-x-2 sm:space-x-4 text-black">
          <Link
            to="/pages/store"
            className="hidden md:inline-block text-[11px] uppercase tracking-widest font-semibold hover:text-neutral-600 transition-colors mr-1"
          >
            Stores
          </Link>

          {/* Search Trigger */}
          <button
            onClick={openSearch}
            className="p-1 sm:p-1.5 hover:opacity-70 transition-opacity"
            aria-label="Search catalog"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Wishlist Bookmark Icon (Exact Levix Ribbon Match) */}
          <Link
            to="/account"
            className="p-1 sm:p-1.5 hover:opacity-70 transition-opacity flex items-center"
            aria-label="Wishlist"
          >
            <svg
              className="w-3.5 h-4 sm:w-4 sm:h-5 text-black"
              viewBox="0 0 18 27"
              fill="currentColor"
            >
              <path d="M0 3.333A3.333 3.333 0 0 1 3.333 0H14.776a3.333 3.333 0 0 1 3.333 3.333V25.895a1.111 1.111 0 0 1-1.839.839l-4.861-4.219a3.333 3.333 0 0 0-4.369 0L1.819 26.827A1.111 1.111 0 0 1 0 25.971Z" />
            </svg>
          </Link>

          {/* Account Profile / Login */}
          <button
            onClick={() => navigate(user ? '/account' : '/login')}
            className="p-1 sm:p-1.5 hover:opacity-70 transition-opacity relative hidden sm:inline-block"
            aria-label="User Account"
          >
            <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            {isAdmin && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF5400] rounded-full" />
            )}
          </button>

          {/* Cart Bag Trigger */}
          <button
            onClick={toggleCart}
            className="p-1 sm:p-1.5 hover:opacity-70 transition-opacity relative flex items-center"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] sm:text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {itemCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
