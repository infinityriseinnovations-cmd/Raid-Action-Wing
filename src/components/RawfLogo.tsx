import React, { useState, useEffect } from 'react';

interface RawfLogoProps {
  className?: string;
  size?: number;
}

export const RawfLogo: React.FC<RawfLogoProps> = ({ className = "w-full h-full", size }) => {
  const [logoSrc, setLogoSrc] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedCustom = localStorage.getItem('rawf_custom_logo_data');
      if (savedCustom) return savedCustom;
      const version = localStorage.getItem('rawf_logo_version') || '1';
      return `/rawf-logo.jpg?v=${version}`;
    }
    return '/rawf-logo.jpg';
  });

  useEffect(() => {
    const handleLogoUpdate = (e: any) => {
      if (e?.detail?.src) {
        setLogoSrc(e.detail.src);
      } else {
        const savedCustom = localStorage.getItem('rawf_custom_logo_data');
        if (savedCustom) {
          setLogoSrc(savedCustom);
        } else {
          const version = localStorage.getItem('rawf_logo_version') || String(Date.now());
          setLogoSrc(`/rawf-logo.jpg?v=${version}`);
        }
      }
    };

    window.addEventListener('rawf_logo_updated', handleLogoUpdate);
    window.addEventListener('storage', handleLogoUpdate);
    return () => {
      window.removeEventListener('rawf_logo_updated', handleLogoUpdate);
      window.removeEventListener('storage', handleLogoUpdate);
    };
  }, []);

  return (
    <img
      src={logoSrc}
      alt="RAID ACTION WING (RAW)"
      width={size}
      height={size}
      className={`object-contain block max-w-full max-h-full shrink-0 ${className}`}
      loading="eager"
      crossOrigin="anonymous"
      onError={(e) => {
        // Fallback to SVG if JPEG network fails
        const target = e.currentTarget as HTMLImageElement;
        if (!target.src.endsWith('.svg')) {
          target.src = '/rawf-logo.svg';
        }
      }}
    />
  );
};
