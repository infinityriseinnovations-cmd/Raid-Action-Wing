import React, { useState, useEffect } from 'react';
import { SupportedLanguage, changeLanguage } from '../utils/translator';

interface FloatingLanguageWidgetProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export const FloatingLanguageWidget: React.FC<FloatingLanguageWidgetProps> = ({
  currentLang,
  onLanguageChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const handleSelectLang = (lang: SupportedLanguage) => {
    if (lang === currentLang || isChanging) return;
    setIsChanging(true);
    changeLanguage(lang, (newLang) => {
      onLanguageChange(newLang);
      setTimeout(() => setIsChanging(false), 600);
    });
  };

  const handleToggle = () => {
    const nextLang: SupportedLanguage = currentLang === 'en' ? 'hi' : 'en';
    handleSelectLang(nextLang);
  };

  return (
    <>
      {/* Hidden Container for Official Google Translate Core Engine */}
      <div id="google_translate_element" className="hidden" aria-hidden="true" />

      {/* Floating Right Middle Action Widget */}
      <aside
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center select-none print:hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Language selection tool"
      >
        <div
          className={`flex items-center shadow-2xl transition-all duration-300 rounded-l-2xl border-2 border-r-0 ${
            currentLang === 'hi'
              ? 'bg-[#b91c1c] border-amber-400 text-white'
              : 'bg-[#0d47a1] border-blue-300/40 text-white'
          } ${isHovered ? 'translate-x-0' : 'translate-x-1 sm:translate-x-0'}`}
        >
          {/* Main Clickable Quick Toggle Tab */}
          <button
            onClick={handleToggle}
            disabled={isChanging}
            title={currentLang === 'en' ? 'वेबसाइट को हिन्दी में पढ़ें (Translate to Hindi)' : 'Switch back to English (मूल अंग्रेज़ी)'}
            className="flex items-center gap-2 px-3 py-2.5 sm:py-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300 transition-transform active:scale-95"
            aria-label={`Current language: ${currentLang === 'en' ? 'English' : 'Hindi'}. Click to switch.`}
          >
            {/* Spinning/Icon Indicator */}
            <div className="relative w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
              {isChanging ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[19px] text-amber-300">
                  g_translate
                </span>
              )}
            </div>

            {/* Language Text Label */}
            <div className="flex flex-col text-left leading-tight pr-1">
              <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                {currentLang === 'en' ? 'हिन्दी में बदलें' : 'In English'}
              </span>
              <span className="font-headline font-black text-xs sm:text-sm tracking-wide">
                {currentLang === 'en' ? 'हिन्दी (HI)' : 'English (EN)'}
              </span>
            </div>
          </button>

          {/* Expanded Dual-Pill Selector on Hover or Tablet/Desktop */}
          <div
            className={`overflow-hidden transition-all duration-300 flex items-center border-l border-white/20 pl-1 pr-2 py-1 gap-1 ${
              isHovered ? 'max-w-[160px] opacity-100' : 'max-w-0 opacity-0 pointer-events-none'
            }`}
          >
            <button
              onClick={() => handleSelectLang('en')}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                currentLang === 'en'
                  ? 'bg-white text-[#0d47a1] shadow-xs'
                  : 'bg-white/10 hover:bg-white/25 text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => handleSelectLang('hi')}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                currentLang === 'hi'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-white/10 hover:bg-white/25 text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
