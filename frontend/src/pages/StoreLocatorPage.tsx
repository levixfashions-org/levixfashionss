import React from 'react';
import { Mail, Globe, Shield, Clock } from 'lucide-react';

export const StoreLocatorPage: React.FC = () => {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 py-12 sm:py-16 space-y-12">
      <div className="border-b border-black/10 pb-6 max-w-2xl">
        <span className="text-[10px] font-mono text-[#FF5400] font-bold uppercase tracking-widest">
          ONLINE EXCLUSIVE DIRECTORY
        </span>
        <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-black mt-1">
          Digital Atelier & Concierge
        </h1>
        <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
          LEVIX operates exclusively through our online flagship drops at thelevix.shop, shipping premier luxury streetwear directly to clients nationwide with express delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 border border-black/10 shadow-sm space-y-4">
          <Globe className="w-6 h-6 text-[#FF5400]" />
          <h3 className="font-display font-bold text-xl uppercase tracking-tight text-black">
            Pan-India Air Express
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            All drops are dispatched directly from our central fulfillment hub in tamper-evident signature dustbags. Metro orders delivered within 48 to 72 hours.
          </p>
        </div>

        <div className="bg-white p-8 border border-black/10 shadow-sm space-y-4">
          <Mail className="w-6 h-6 text-[#FF5400]" />
          <h3 className="font-display font-bold text-xl uppercase tracking-tight text-black">
            Client Concierge
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Direct email assistance for orders, sizing recommendations, and delivery tracking:
          </p>
          <a
            href="mailto:levixfashions@gmail.com"
            className="inline-block font-mono text-xs font-bold text-black border-b border-black hover:text-[#FF5400] hover:border-[#FF5400] transition-colors"
          >
            levixfashions@gmail.com
          </a>
        </div>

        <div className="bg-white p-8 border border-black/10 shadow-sm space-y-4">
          <Shield className="w-6 h-6 text-[#FF5400]" />
          <h3 className="font-display font-bold text-xl uppercase tracking-tight text-black">
            7-Day Size Exchanges
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Need a different drape or volume? Enjoy hassle-free doorstep reverse pickups and size exchanges on all unworn items.
          </p>
        </div>
      </div>
    </div>
  );
};
