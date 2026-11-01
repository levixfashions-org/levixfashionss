import React from 'react';
import { useLocation } from 'react-router-dom';

export const PolicyPage: React.FC = () => {
  const location = useLocation();
  const isShipping = location.pathname.includes('shipping');

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 space-y-8 text-black">
      <div className="border-b border-black/10 pb-6">
        <span className="text-[10px] font-mono text-[#FF5400] font-bold uppercase tracking-widest">
          LEGAL & CLIENT COMMITMENT
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight mt-1">
          {isShipping ? 'Shipping & Doorstep Exchange Policy' : 'Terms of Service & Atelier Conditions'}
        </h1>
      </div>

      <div className="prose prose-sm max-w-none text-xs text-neutral-700 leading-relaxed space-y-6">
        {isShipping ? (
          <>
            <section className="space-y-2">
              <h3 className="font-bold uppercase tracking-wider text-black text-sm">
                1. Domestic Dispatch & Timelines
              </h3>
              <p>
                All prepaid orders are packaged in sealed signature Levix dust-proof garment bags and dispatched via premier air express couriers (Bluedart, Delhivery, DTDC). Metro deliveries arrive within 48 to 72 hours; rest of India within 3 to 5 business days.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold uppercase tracking-wider text-black text-sm">
                2. Free Shipping Threshold
              </h3>
              <p>
                Domestic shipping is completely complimentary on all prepaid orders of RS. 2,999 or above. Orders below this threshold carry a nominal express logistics fee of RS. 150.
              </p>
            </section>

            <section id="returns" className="space-y-2">
              <h3 className="font-bold uppercase tracking-wider text-black text-sm">
                3. 7-Day Doorstep Size Exchanges
              </h3>
              <p>
                Because our streetwear silhouettes feature custom oversized geometry, we offer seamless doorstep size exchanges within 7 days of package delivery. Garments must remain unworn with original tags attached.
              </p>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-2">
              <h3 className="font-bold uppercase tracking-wider text-black text-sm">
                1. Overview & Acceptance
              </h3>
              <p>
                This website is operated by LEVIX. By visiting our site and/or purchasing garments from our drops, you engage in our service and agree to be bound by the following terms and conditions.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold uppercase tracking-wider text-black text-sm">
                2. Product Authenticity & Limited Runs
              </h3>
              <p>
                All garments, capsule collections, and accessories are strictly limited edition. Levix reserves the right to limit the quantity of items purchased per client or per household.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold uppercase tracking-wider text-black text-sm">
                3. Intellectual Property
              </h3>
              <p>
                All trademarks, logos, garment typography, graphics, and design patents displayed on this site are the exclusive intellectual property of LEVIX and its licensed collaboration partners.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
