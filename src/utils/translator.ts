/**
 * RAID ACTION WING FOUNDATION (RAWF)
 * Official Website Hindi/English Translation Subsystem
 * 
 * Uses Google's official Translation Engine for grammatically accurate,
 * full-page Hindi translation across all components, articles, legal statutes, and modals.
 * Includes absolute protection for Material Symbols ligatures and official brand logos.
 */

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export type SupportedLanguage = 'en' | 'hi';

const LANG_STORAGE_KEY = 'rawf_portal_lang';

/**
 * Get the currently stored language preference
 */
export function getSavedLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en';

  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  if (stored === 'hi' || stored === 'en') {
    return stored;
  }

  // Check cookie as well
  const match = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([a-z]{2})/);
  if (match && (match[1] === 'hi' || match[1] === 'en')) {
    return match[1] as SupportedLanguage;
  }

  return 'en';
}

/**
 * Set the Google Translate cookie for the current host and root domain
 */
function setGoogleTranslateCookie(lang: SupportedLanguage) {
  const value = `/en/${lang}`;
  const maxAge = 60 * 60 * 24 * 365; // 1 year
  
  // Set for current path
  document.cookie = `googtrans=${value}; path=/; max-age=${maxAge}`;
  
  // Set without domain
  document.cookie = `googtrans=${value}; max-age=${maxAge}`;

  // Set for current host
  const host = window.location.hostname;
  document.cookie = `googtrans=${value}; path=/; domain=${host}; max-age=${maxAge}`;

  // Set for parent domain if subdomain
  const parts = host.split('.');
  if (parts.length > 2) {
    const parentDomain = '.' + parts.slice(-2).join('.');
    document.cookie = `googtrans=${value}; path=/; domain=${parentDomain}; max-age=${maxAge}`;
  }
}

/**
 * Protect Material Symbols icons and Brand Logos from being translated or replaced
 * by Google Translate's DOM parsing engine.
 */
export function protectIconsAndLogosFromTranslation() {
  if (typeof document === 'undefined') return;

  const protectElement = (el: Element) => {
    // Prevent translation
    el.setAttribute('translate', 'no');
    el.classList.add('notranslate');

    // For icon fonts (Material Symbols): save original ligature text
    if (el.classList.contains('material-symbols-outlined') || el.className.includes('material-symbols')) {
      const original = (el as HTMLElement).getAttribute('data-original-icon') || el.textContent?.trim();
      if (original && !original.includes(' ') && original.length < 40 && !original.match(/[\u0900-\u097F]/)) {
        (el as HTMLElement).setAttribute('data-original-icon', original);
      }
    }
  };

  const scanAndProtect = () => {
    // 1. All Material Symbols icon elements
    document.querySelectorAll('.material-symbols-outlined, [class*="material-symbols"]').forEach((icon) => {
      protectElement(icon);

      // If Google Translate already replaced text with font tag, revert it back to the original ligature
      const orig = (icon as HTMLElement).getAttribute('data-original-icon');
      if (orig && (icon.querySelector('font') || icon.textContent !== orig)) {
        icon.textContent = orig;
      }
    });

    // 2. All Logo and Emblem headers
    document.querySelectorAll('[data-brand-logo], .rawf-logo-container, .notranslate').forEach((logo) => {
      protectElement(logo);
    });
  };

  // Run immediately
  scanAndProtect();

  // Watch for dynamic DOM additions (e.g. modals, new pages, Google Translate DOM rewrites)
  try {
    const observer = new MutationObserver((mutations) => {
      let shouldScan = false;
      for (const mut of mutations) {
        if (mut.type === 'childList' && mut.addedNodes.length > 0) {
          shouldScan = true;
          break;
        }
        if (mut.type === 'characterData' && mut.target.parentElement?.classList.contains('material-symbols-outlined')) {
          const parent = mut.target.parentElement as HTMLElement;
          const orig = parent.getAttribute('data-original-icon');
          if (orig && parent.textContent !== orig) {
            parent.textContent = orig;
          }
        }
      }
      if (shouldScan) {
        scanAndProtect();
      }
    });

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }
  } catch (e) {
    console.warn('[Translator] MutationObserver setup error:', e);
  }
}

/**
 * Initialize the Google Translate script and element
 */
export function initializeGoogleTranslate(onReady?: () => void) {
  if (typeof window === 'undefined') return;

  // Protect icons and logos immediately
  protectIconsAndLogosFromTranslation();

  // Define global callback before loading script
  window.googleTranslateElementInit = function () {
    try {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi',
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout?.HORIZONTAL || 0,
          },
          'google_translate_element'
        );

        if (onReady) onReady();

        // Ensure protection remains active after widget loads
        protectIconsAndLogosFromTranslation();

        // Apply saved language if set to Hindi
        const saved = getSavedLanguage();
        if (saved === 'hi') {
          setTimeout(() => {
            applyLanguageViaCombo('hi');
            protectIconsAndLogosFromTranslation();
          }, 400);
        }
      }
    } catch (e) {
      console.warn('[Translator] Error initializing Google Translate widget:', e);
    }
  };

  // Check if script is already present
  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onerror = () => {
      console.warn('[Translator] Could not load Google Translate script from CDN.');
    };
    document.head.appendChild(script);
  }
}

/**
 * Apply language directly using the Google Translate select dropdown element
 */
function applyLanguageViaCombo(lang: SupportedLanguage): boolean {
  const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (combo) {
    combo.value = lang;
    combo.dispatchEvent(new Event('change', { bubbles: true }));
    protectIconsAndLogosFromTranslation();
    return true;
  }
  return false;
}

/**
 * Change the language across the entire application
 */
export function changeLanguage(lang: SupportedLanguage, onStateChange?: (newLang: SupportedLanguage) => void) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    setGoogleTranslateCookie(lang);

    if (onStateChange) {
      onStateChange(lang);
    }

    protectIconsAndLogosFromTranslation();

    // Try applying directly via select element
    const applied = applyLanguageViaCombo(lang);

    if (!applied) {
      // If widget combo is not ready yet, set cookies and reload seamlessly
      window.location.reload();
    } else {
      document.documentElement.lang = lang;
      setTimeout(() => protectIconsAndLogosFromTranslation(), 200);
      setTimeout(() => protectIconsAndLogosFromTranslation(), 600);
      setTimeout(() => protectIconsAndLogosFromTranslation(), 1200);
    }
  } catch (err) {
    console.error('[Translator] Failed to switch language:', err);
    window.location.reload();
  }
}
