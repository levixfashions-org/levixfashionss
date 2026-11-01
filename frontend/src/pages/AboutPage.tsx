import React from 'react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 py-12 sm:py-16 space-y-16">
      
      <div className="max-w-3xl space-y-4">
        <span className="text-[11px] font-mono text-[#FF5400] font-bold uppercase tracking-widest">
          THE LEVIX MANIFESTO
        </span>
        <h1 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tight text-black leading-tight">
          Architectural Tailoring & Raw Subcultural Expression
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed font-light">
          Founded with an uncompromising global perspective, Levix bridges contemporary luxury couture craftsmanship with unfiltered underground streetwear culture.
        </p>
      </div>

      <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-900 shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
          alt="Levix Design Studio"
          className="w-full h-full object-cover object-center opacity-90"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-black/10 pt-12">
        <div className="space-y-3">
          <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-black">
            01 / Textile Innovation
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Every millimeter of fabric is custom-milled in certified partner ateliers. We utilize 260 to 450 GSM ultra-heavy combed cottons, loopback French terry, and tear-resistant tactical ripstop fabrics designed to age gracefully over decades.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-black">
            02 / Boxy Drape Geometry
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Our dropped shoulders, reinforced ribbed collars, and structured silhouettes are meticulously patterned to preserve architectural volume without clinging, creating the unmistakable signature Levix fit.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-black">
            03 / Underground Streetwear Heritage
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            From high-density botanical embroidery to industrial motorsport capsules, Levix curates rare limited-edition drops that celebrate contemporary subcultural aesthetics and architectural precision.
          </p>
        </div>
      </div>

    </div>
  );
};
