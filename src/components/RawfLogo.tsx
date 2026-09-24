import React from 'react';

interface RawfLogoProps {
  className?: string;
  size?: number;
}

export const RawfLogo: React.FC<RawfLogoProps> = ({ className = "w-12 h-12", size }) => {
  return (
    <div 
      className={`relative flex items-center justify-center p-0.5 rounded border border-slate-200 bg-white shadow-xs overflow-hidden shrink-0 ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <img
        src="/rawf-logo.svg"
        alt="RAWF Official Emblem Crest"
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback to jpg or display icon
          (e.currentTarget as HTMLImageElement).src = '/rawf-logo.jpg';
        }}
      />
    </div>
  );
};
