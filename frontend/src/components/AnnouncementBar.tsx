import React from 'react';

export const AnnouncementBar: React.FC = () => {
  const tickerText = "FREE DOMESTIC SHIPPING ON ALL PREPAID ORDERS • LEVIX X GODZILLA EXCLUSIVE COLLABORATION IS NOW LIVE • HEAVYWEIGHT 450 GSM WINTER HOODIES AVAILABLE • COMPLIMENTARY EXCHANGES • ";

  return (
    <div className="h-8 bg-black text-white text-[11px] uppercase tracking-widest font-medium overflow-hidden flex items-center border-b border-white/10 select-none">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        <span>{tickerText}</span>
        <span>{tickerText}</span>
        <span>{tickerText}</span>
        <span>{tickerText}</span>
      </div>
    </div>
  );
};
