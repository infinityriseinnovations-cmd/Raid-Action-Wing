import React from 'react';
import { RawfLogo } from './RawfLogo';

interface TopHeroBannerProps {
  className?: string;
}

export const TopHeroBanner: React.FC<TopHeroBannerProps> = ({ className = '' }) => {
  return (
    <section
      aria-label="RAWF Official Insignia Top Banner"
      className={`relative w-full overflow-hidden select-none shadow-[0_6px_16px_rgba(0,0,0,0.12)] z-20 ${className}`}
    >
      {/* Full-width dual-tone split background (Red on left, Blue on right) with increased height and spacious padding */}
      <div className="relative w-full h-[180px] sm:h-[230px] md:h-[280px] lg:h-[320px] flex items-center justify-center">
        {/* Left Half: Vibrant Action Red with subtle gradient */}
        <div className="w-1/2 h-full bg-[#e31b23] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-800/15 via-transparent to-black/5 pointer-events-none" />
        </div>

        {/* Right Half: Vibrant Action Royal Blue with subtle gradient */}
        <div className="w-1/2 h-full bg-[#0052a5] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-blue-950/20 pointer-events-none" />
        </div>

        {/* Center Official Logo with generous top/bottom breathing space and clean shadow - Synced with RawfLogo */}
        <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-5 md:p-6 lg:p-7 pointer-events-none">
          <div
            className="h-full aspect-square bg-white rounded-lg flex items-center justify-center p-3 sm:p-4 md:p-5 shadow-[0_6px_20px_rgba(0,0,0,0.18)] overflow-hidden"
            data-nosnippet
          >
            <RawfLogo
              className="w-full h-full object-contain filter contrast-105 select-none pointer-events-none"
            />
          </div>
        </div>

        {/* Delicate subtle bottom shadow gradient (No harsh bottom border) */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
      </div>
    </section>
  );
};

export default TopHeroBanner;
