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
          src="https://bluorng.com/cdn/shop/files/BLUORNG01009_937f737c-b67e-4bf8-afce-b4a8370a6606.jpg?v=1764343213&width=1600"
          alt="Levix Atelier Studio"
          className="w-full h-full object-cover object-top opacity-90"
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
            03 / Cultural Collaborations
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            From high-octane racing capsules to official licensed Godzilla monster movie drops, Levix curates rare collaborations that celebrate counter-culture movements and rebellious cinematic artistry.
          </p>
        </div>
      </div>

    </div>
  );
};
