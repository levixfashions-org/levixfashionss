import React from 'react';
import { X } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, closeSizeGuide } = useCartStore();

  if (!isSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeSizeGuide}
      />

      <div className="relative bg-[#EFEFEF] w-full max-w-lg shadow-2xl border border-black/15 p-6 z-10 space-y-6">
        <div className="flex items-center justify-between border-b border-black/10 pb-4">
          <div>
            <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black">
              Oversized Fit Guide
            </h3>
            <p className="text-xs text-neutral-600">All garment measurements are recorded in inches.</p>
          </div>
          <button
            onClick={closeSizeGuide}
            className="p-1 text-black hover:opacity-60 transition-opacity"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Measurement Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-black border-collapse">
            <thead>
              <tr className="border-b-2 border-black uppercase tracking-wider text-[11px] font-bold">
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Chest</th>
                <th className="py-2.5 px-3">Length</th>
                <th className="py-2.5 px-3">Shoulder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 font-mono">
              <tr>
                <td className="py-2.5 px-3 font-bold">S</td>
                <td className="py-2.5 px-3">44"</td>
                <td className="py-2.5 px-3">28.5"</td>
                <td className="py-2.5 px-3">20.5"</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold">M</td>
                <td className="py-2.5 px-3">46"</td>
                <td className="py-2.5 px-3">29.5"</td>
                <td className="py-2.5 px-3">21.5"</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold">L</td>
                <td className="py-2.5 px-3">48"</td>
                <td className="py-2.5 px-3">30.5"</td>
                <td className="py-2.5 px-3">22.5"</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold">XL</td>
                <td className="py-2.5 px-3">50"</td>
                <td className="py-2.5 px-3">31.5"</td>
                <td className="py-2.5 px-3">23.5"</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold">XXL</td>
                <td className="py-2.5 px-3">52"</td>
                <td className="py-2.5 px-3">32.5"</td>
                <td className="py-2.5 px-3">24.5"</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white/70 p-4 border border-black/10 text-xs text-neutral-700 space-y-1">
          <p className="font-bold text-black uppercase">Tailoring Notes:</p>
          <p>
            Levix garments feature a signature dropped shoulder and relaxed oversized silhouette. If you prefer a regular tailored fit, we recommend selecting one size smaller than your usual size.
          </p>
        </div>

        <button
          onClick={closeSizeGuide}
          className="w-full bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
        >
          Got It
        </button>
      </div>
    </div>
  );
};
