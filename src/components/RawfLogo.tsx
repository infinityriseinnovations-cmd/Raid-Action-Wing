import React, { useState, useEffect } from 'react';

interface RawfLogoProps {
  className?: string;
  size?: number;
}

// Global cached logo state across all RawfLogo instances
let globalLogoSrc: string | null = null;
let fetchPromise: Promise<string> | null = null;

const getInitialLogoSrc = (): string => {
  if (globalLogoSrc) return globalLogoSrc;
  if (typeof window !== 'undefined') {
    const savedCustom = localStorage.getItem('rawf_custom_logo_data');
    if (savedCustom) return savedCustom;
    const version = localStorage.getItem('rawf_logo_version');
    if (version) return `/rawf-logo.jpg?v=${version}`;
  }
  return '/rawf-logo.jpg';
};

const fetchLatestLogoVersion = async (): Promise<string> => {
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const res = await fetch('/api/logo', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          const newUrl = data.url;
          globalLogoSrc = newUrl;
          if (data.version) {
            localStorage.setItem('rawf_logo_version', String(data.version));
          }
          // Notify any other instances or listeners
          window.dispatchEvent(new CustomEvent('rawf_logo_updated', { detail: { src: newUrl, url: newUrl } }));
          return newUrl;
        }
      }
    } catch {
      // Fallback to static if network is unreachable
    }
    return globalLogoSrc || '/rawf-logo.jpg';
  })();

  return fetchPromise;
};

export const RawfLogo: React.FC<RawfLogoProps> = ({ className = "w-full h-full", size }) => {
  const [logoSrc, setLogoSrc] = useState<string>(getInitialLogoSrc);

  useEffect(() => {
    // Query server on mount so ANY browser (different device, incognito, new visitor)
    // receives the latest uploaded server logo without falling back to stale ?v=1
    fetchLatestLogoVersion().then((url) => {
      if (url && url !== logoSrc) {
        const savedCustom = localStorage.getItem('rawf_custom_logo_data');
        if (!savedCustom) {
          setLogoSrc(url);
        }
      }
    });

    const handleLogoUpdate = (e: any) => {
      if (e?.detail?.src) {
        setLogoSrc(e.detail.src);
      } else if (e?.detail?.url) {
        setLogoSrc(e.detail.url);
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
      className={`object-contain block max-w-full max-h-full shrink-0 notranslate ${className}`}
      loading="eager"
      crossOrigin="anonymous"
      translate="no"
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
