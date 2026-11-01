import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#EFEFEF] border-t border-black/10 pt-16 pb-12 mt-20 text-black">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12">
        
        {/* Top 4-Column Grid (Exact layout from levix.com) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-16 border-b border-black/10">
          
          {/* Column 1: Connect with us */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-black">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li>
                <a href="mailto:levixfashions@gmail.com" className="hover:text-black transition-colors flex items-center gap-2">
                  <span className="font-semibold text-black">Email:</span>
                  <span className="font-mono text-black">levixfashions@gmail.com</span>
                </a>
              </li>
              <li className="text-[11px] text-neutral-500">
                <span>Support Hours:</span>
                <span className="block font-medium text-neutral-700">Mon – Sat, 10:00 AM – 7:00 PM IST</span>
              </li>
              <li className="pt-2">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                  YouTube
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Order Support */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-black">
              Order Support
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li>
                <Link to="/policies/shipping-policy#returns" className="hover:text-black transition-colors">
                  Make a return/Exchange
                </Link>
              </li>
              <li>
                <Link to="/policies/shipping-policy#refund" className="hover:text-black transition-colors">
                  Refund/Exchange policy
                </Link>
              </li>
              <li>
                <Link to="/account/orders" className="hover:text-black transition-colors">
                  Track your order
                </Link>
              </li>
              <li>
                <Link to="/policies/shipping-policy" className="hover:text-black transition-colors">
                  Shipping policy
                </Link>
              </li>
              <li>
                <Link to="/policies/terms-of-service" className="hover:text-black transition-colors">
                  International Order policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: We are LEVIX */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-black">
              We are LEVIX
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li>
                <Link to="/pages/about" className="hover:text-black transition-colors">
                  The Atelier Manifesto
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-black transition-colors">
                  Capsule Drops
                </Link>
              </li>
              <li>
                <Link to="/collections/all-products" className="hover:text-black transition-colors">
                  Archive Streetwear
                </Link>
              </li>
              <li>
                <Link to="/policies/terms-of-service" className="hover:text-black transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/policies/terms-of-service" className="hover:text-black transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-black">
              Private Drop Access
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Subscribe to unlock secret drops, invitation-only sample releases, and priority collaboration access.
            </p>
            {subscribed ? (
              <div className="p-3 bg-black text-white text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-[#FF5400]" />
                <span>Thank you. You have been added to the private list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative flex items-center border border-black bg-white">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL"
                    className="w-full bg-transparent px-3 py-3 text-xs placeholder:text-neutral-500 focus:outline-none uppercase tracking-wider"
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 bg-black text-white hover:bg-neutral-800 transition-colors flex items-center justify-center flex-shrink-0"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-neutral-500">By joining you accept our Privacy Policy.</p>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Section: Copyright & Accepted Payment Methods */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
          <div>
            © 2026 LEVIX. ALL RIGHTS RESERVED. HIGH FIDELITY STREETWEAR ATELIER.
          </div>

          <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            <span>RAZORPAY</span>
            <span>•</span>
            <span>UPI</span>
            <span>•</span>
            <span>VISA</span>
            <span>•</span>
            <span>MASTERCARD</span>
            <span>•</span>
            <span>NETBANKING</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
