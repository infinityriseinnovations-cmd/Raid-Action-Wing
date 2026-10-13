import React, { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY_DATA = 'rawf_custom_signature_data';
const STORAGE_KEY_VERSION = 'rawf_signature_version';

/**
 * Returns current custom signature URL or null if not configured
 */
export const getAuthorizedSignatureUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  const cached = localStorage.getItem(STORAGE_KEY_DATA);
  if (cached && cached.trim()) return cached;
  const version = localStorage.getItem(STORAGE_KEY_VERSION);
  if (version) return `/rawf-signature.png?v=${version}`;
  return null;
};

/**
 * Hook to reactively track and sync the official Authorized Signatory signature
 */
export const useAuthorizedSignature = () => {
  const [signatureUrl, setSignatureUrl] = useState<string | null>(() => getAuthorizedSignatureUrl());

  const refreshSignature = useCallback(() => {
    const current = getAuthorizedSignatureUrl();
    setSignatureUrl(current);
  }, []);

  useEffect(() => {
    refreshSignature();

    const handleCustomEvent = (e: any) => {
      if (e?.detail?.src !== undefined) {
        setSignatureUrl(e.detail.src || null);
      } else {
        refreshSignature();
      }
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_DATA || e.key === STORAGE_KEY_VERSION) {
        refreshSignature();
      }
    };

    window.addEventListener('rawf_signature_updated', handleCustomEvent);
    window.addEventListener('storage', handleStorageEvent);

    // Initial server check for multi-device sync
    fetch('/api/signature-info')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.exists && data?.url) {
          if (!localStorage.getItem(STORAGE_KEY_DATA)) {
            setSignatureUrl(data.url);
            localStorage.setItem(STORAGE_KEY_VERSION, String(data.version || Date.now()));
          }
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener('rawf_signature_updated', handleCustomEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [refreshSignature]);

  return {
    signatureUrl,
    hasCustomSignature: Boolean(signatureUrl),
    reloadSignature: refreshSignature
  };
};

interface AuthorizedSignatureProps {
  /**
   * Container styling (e.g. height, alignment)
   */
  className?: string;
  /**
   * Class name for the <img> tag
   */
  imgClassName?: string;
  /**
   * Fallback text if no signature image is uploaded
   */
  fallbackText?: string;
  /**
   * Fallback styling for text signature
   */
  fallbackClassName?: string;
  /**
   * Accessible description
   */
  alt?: string;
}

/**
 * Universal Authorized Signature Component.
 * Automatically displays the uploaded authorized signature image with auto-adjusted
 * aspect ratio and bounded dimensions, or falls back to an elegant official cursive script.
 */
export const AuthorizedSignature: React.FC<AuthorizedSignatureProps> = ({
  className = '',
  imgClassName = '',
  fallbackText = 'Manoj Chauhan',
  fallbackClassName = 'font-id-sign text-slate-800 text-[19px] sm:text-[21px] leading-none select-none font-bold pr-1',
  alt = 'Authorized Signatory Signature'
}) => {
  const { signatureUrl } = useAuthorizedSignature();
  const [imgError, setImgError] = useState(false);

  // Reset img error on URL change
  useEffect(() => {
    setImgError(false);
  }, [signatureUrl]);

  if (signatureUrl && !imgError) {
    return (
      <div className={`flex items-end justify-end select-none ${className}`}>
        <img
          src={signatureUrl}
          alt={alt}
          onError={() => setImgError(true)}
          className={`max-h-full max-w-full object-contain object-bottom filter contrast-125 ${imgClassName}`}
          loading="eager"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-end justify-end select-none ${className}`}>
      <span className={fallbackClassName}>{fallbackText}</span>
    </div>
  );
};
