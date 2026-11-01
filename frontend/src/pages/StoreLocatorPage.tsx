import React from 'react';
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';

export const StoreLocatorPage: React.FC = () => {
  const stores = [
    {
      city: 'New Delhi',
      name: 'Levix Dhan Mill Flagship',
      address: 'Shed 12, The Dhan Mill, 100 Feet Road, SSN Marg, Chhatarpur, New Delhi 110074',
      phone: '+91 11 4987 6543',
      hours: 'Mon – Sun: 11:00 AM – 9:00 PM',
      mapsUrl: 'https://maps.google.com'
    },
    {
      city: 'Mumbai',
      name: 'Levix Kala Ghoda Atelier',
      address: 'Ground Floor, Ropewalk Lane, Behind Jehangir Art Gallery, Kala Ghoda, Fort, Mumbai 400001',
      phone: '+91 22 2288 1234',
      hours: 'Mon – Sun: 11:00 AM – 9:00 PM',
      mapsUrl: 'https://maps.google.com'
    },
    {
      city: 'Bengaluru',
      name: 'Levix Indiranagar Experience',
      address: '777/A, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038',
      phone: '+91 80 4123 9876',
      hours: 'Mon – Sun: 11:00 AM – 9:30 PM',
      mapsUrl: 'https://maps.google.com'
    }
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 py-10 space-y-12">
      <div className="border-b border-black/10 pb-6">
        <span className="text-[10px] font-mono text-[#FF5400] font-bold uppercase tracking-widest">
          PHYSICAL ATELIERS
        </span>
        <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-black mt-1">
          Store Directory
        </h1>
        <p className="text-xs text-neutral-600 mt-2 max-w-xl">
          Experience our heavyweight custom-milled textiles and oversized geometry in person at our flagship retail destinations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stores.map((st) => (
          <div key={st.name} className="bg-white p-6 border border-black/10 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[11px] font-mono font-bold uppercase text-[#FF5400] tracking-wider">
                {st.city}
              </span>
              <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-black">
                {st.name}
              </h3>
              
              <div className="space-y-2 text-xs text-neutral-600 pt-2 font-light">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                  <span>{st.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-black flex-shrink-0" />
                  <span className="font-mono">{st.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-black flex-shrink-0" />
                  <span>{st.hours}</span>
                </div>
              </div>
            </div>

            <a
              href={st.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 border border-black text-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex items-center justify-center space-x-2"
            >
              <span>Get Directions</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
