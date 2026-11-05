import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User as UserIcon, Menu, ChevronDown, ArrowRight, Heart } from 'lucide-react';
import { LevixCartIcon } from './LevixCartIcon';
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
      title: 'Overlength T-Shirts',
      handle: 'overlength-t-shirts',
      img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Waffle Boxy Full Sleeves',
      handle: 'waffle-boxy-fit-full-sleeves',
      img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Acid Wash T-Shirts',
      handle: 'acid-wash-t-shirts',
      img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80'
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

            <Link to="/collections/overlength-t-shirts" className="text-black hover:text-[#FF5400] transition-colors">
              Overlength
            </Link>
            <Link to="/collections/waffle-boxy-fit-full-sleeves" className="text-black hover:text-[#FF5400] transition-colors">
              Waffle Sleeves
            </Link>
            <Link to="/collections/acid-wash-t-shirts" className="text-black hover:text-[#FF5400] transition-colors">
              Acid Wash
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

        {/* Right: Actions (Search, Wishlist, Account, Cart) */}
        <div className="flex items-center space-x-2 sm:space-x-4 text-black">
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

          {/* Bespoke LEVIX Shopping Bag Trigger */}
          <button
            onClick={toggleCart}
            className="p-1 sm:p-1.5 hover:opacity-75 transition-all active:scale-95 relative flex items-center"
            aria-label="Shopping Cart"
          >
            <LevixCartIcon itemCount={itemCount} className="w-[22px] h-[25px] sm:w-[24px] sm:h-[27px] text-black" />
          </button>
        </div>

      </div>
    </header>
  );
};
