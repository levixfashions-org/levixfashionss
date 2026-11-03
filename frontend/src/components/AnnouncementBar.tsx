import React, { useState, useEffect } from 'react';
import { getStoreSettings } from '../services/api';

export const AnnouncementBar: React.FC = () => {
  const [tickerText, setTickerText] = useState(() => {
    return getStoreSettings().announcementText;
  });

  useEffect(() => {
    const handleSettingsUpdate = (e: any) => {
      if (e.detail?.announcementText) {
        setTickerText(e.detail.announcementText);
      } else {
        setTickerText(getStoreSettings().announcementText);
      }
    };
    window.addEventListener('levix_settings_updated', handleSettingsUpdate);
    return () => window.removeEventListener('levix_settings_updated', handleSettingsUpdate);
  }, []);

  const displayText = tickerText.trim() + ' • ';

  return (
    <div className="h-8 bg-black text-white text-[11px] uppercase tracking-widest font-medium overflow-hidden flex items-center border-b border-white/10 select-none">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        <span>{displayText}</span>
        <span>{displayText}</span>
        <span>{displayText}</span>
        <span>{displayText}</span>
      </div>
    </div>
  );
};
