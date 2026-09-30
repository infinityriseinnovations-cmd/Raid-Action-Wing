import React, { useState, useEffect } from 'react';
import { RawfLogo } from './RawfLogo';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, subParam?: string) => void;
  onOpenVerifyModal: (prefillId?: string) => void;
  lang: 'en' | 'hi';
  onToggleLang: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenVerifyModal,
  lang,
  onToggleLang
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Close menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNavClick = (page: string, subParam?: string) => {
    onNavigate(page, subParam);
    setMenuOpen(false);
    setExpandedSection(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-xs border-b border-slate-200 font-sans">
      {/* Top Emergency & Statutory Utility Strip (Cobalt Police Navy) with Infinite Marquee Ticker */}
      <div className="bg-[#0d47a1] text-white px-3 sm:px-4 lg:px-8 border-b border-blue-900 overflow-hidden">
        <div className="max-w-7xl mx-auto h-9 flex items-center justify-between text-xs font-medium tracking-wide">
          {/* Scrollable Marquee Ticker Container */}
          <div className="flex-1 overflow-hidden relative mr-2 sm:mr-4 flex items-center h-full">
            <div className="animate-marquee flex items-center">
              {/* Ticker Item Group 1 */}
              <div className="flex items-center gap-5 sm:gap-7 shrink-0 pr-5 sm:pr-7">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span className="font-bold text-red-200">
                    24/7 HELPLINE: <a className="text-white hover:underline font-mono" href="tel:18007292355">1800-RAW-CELL</a>
                  </span>
                </div>
                <span className="text-blue-300/40">|</span>
                <div className="flex items-center gap-1.5 text-blue-100 whitespace-nowrap">
                  <span className="material-symbols-outlined text-[15px] text-amber-300">verified</span>
                  <span>NITI Aayog Darpan: <strong className="text-white font-mono">DL/2021/RAWF</strong></span>
                </div>
                <span className="text-blue-300/40">|</span>
                <div className="flex items-center gap-1.5 text-blue-100 whitespace-nowrap">
                  <span>Register Under: ITA ACT 1882 Charter</span>
                  <span className="text-[10px] bg-blue-800 px-1.5 py-0.5 rounded font-mono text-blue-200 font-bold">IFA 760</span>
                </div>
                <span className="text-blue-300/40">|</span>
                <div className="flex items-center gap-1.5 text-blue-100 whitespace-nowrap">
                  <span className="material-symbols-outlined text-[15px] text-emerald-300">workspace_premium</span>
                  <span>MSME UDYAM: <strong className="text-white font-mono">UP-50-0196301</strong></span>
                </div>
              </div>

              {/* Ticker Item Group 2 (Duplicate for Seamless Endless Loop) */}
              <div className="flex items-center gap-5 sm:gap-7 shrink-0 pr-5 sm:pr-7" aria-hidden="true">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span className="font-bold text-red-200">
                    24/7 HELPLINE: <a className="text-white hover:underline font-mono" href="tel:18007292355">1800-RAW-CELL</a>
                  </span>
                </div>
                <span className="text-blue-300/40">|</span>
                <div className="flex items-center gap-1.5 text-blue-100 whitespace-nowrap">
                  <span className="material-symbols-outlined text-[15px] text-amber-300">verified</span>
                  <span>NITI Aayog Darpan: <strong className="text-white font-mono">DL/2021/RAWF</strong></span>
                </div>
                <span className="text-blue-300/40">|</span>
                <div className="flex items-center gap-1.5 text-blue-100 whitespace-nowrap">
                  <span>Register Under: ITA ACT 1882 Charter</span>
                  <span className="text-[10px] bg-blue-800 px-1.5 py-0.5 rounded font-mono text-blue-200 font-bold">IFA 760</span>
                </div>
                <span className="text-blue-300/40">|</span>
                <div className="flex items-center gap-1.5 text-blue-100 whitespace-nowrap">
                  <span className="material-symbols-outlined text-[15px] text-emerald-300">workspace_premium</span>
                  <span>MSME UDYAM: <strong className="text-white font-mono">UP-50-0196301</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Static Right Action Bar: Admin, Apply Online, RTI Cell & Language Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 text-blue-100 text-xs shrink-0 z-10 bg-[#0d47a1] pl-2 sm:pl-3 shadow-[-8px_0_12px_#0d47a1]">
            <button
              onClick={() => handleNavClick('admin')}
              className="hidden lg:inline-flex items-center gap-1 bg-amber-600/90 hover:bg-amber-600 text-white px-2 py-0.5 rounded font-bold transition-colors cursor-pointer text-[11px]"
              title="Director General Admin Command"
              aria-label="Director General Admin Command"
            >
              <span className="material-symbols-outlined text-[13px]">admin_panel_settings</span>
              <span>Admin</span>
            </button>
            <span className="hidden lg:inline text-blue-300/40">|</span>
            <button
              onClick={() => handleNavClick('apply-online')}
              className="hidden sm:inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2.5 py-0.5 rounded font-bold transition-colors cursor-pointer"
              aria-label="Apply online for RAWF membership"
            >
              Apply Online
            </button>
            <span className="hidden sm:inline text-blue-300/40">|</span>
            <button
              onClick={() => handleNavClick('rights')}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              aria-label="Navigate to RTI Cell & Citizen Rights"
            >
              <span className="material-symbols-outlined text-[14px]">article</span>
              <span>RTI Cell</span>
            </button>
            <span className="text-blue-300/40">|</span>
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 cursor-pointer hover:text-white bg-blue-900/60 px-2 py-0.5 rounded border border-blue-700/50 transition-colors"
              title="Toggle English / Hindi"
              aria-label={`Switch language to ${lang === 'en' ? 'Hindi' : 'English'}`}
            >
              <span className="material-symbols-outlined text-[14px]">g_translate</span>
              <span className="font-bold">{lang === 'en' ? 'EN' : 'HI'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Spacious Logo with Clean Action Buttons & Hamburger Menu */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="h-18 sm:h-20 md:h-22 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Official Title (Uncompressed, Proportionate across Desktop & Mobile) */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-3.5 group py-1 text-left cursor-pointer shrink min-w-0"
            aria-label="Raid Action Wing Foundation - Return to Homepage"
          >
            {/* Round Insignia Emblem */}
            <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 flex items-center justify-center shrink-0">
              <RawfLogo className="w-full h-full object-contain drop-shadow-xs group-hover:scale-105 transition-transform duration-200" />
            </div>

            {/* Official Typography Header */}
            <div className="flex flex-col justify-center text-left min-w-0">
              <span className="font-headline font-black text-xs xs:text-sm sm:text-lg md:text-xl lg:text-2xl text-[#0a192f] tracking-tight leading-none group-hover:text-[#0d47a1] transition-colors truncate">
                RAID ACTING WING (F)
              </span>
              <span className="font-id-hindi font-bold text-[11px] xs:text-xs sm:text-sm lg:text-[15px] text-red-600 tracking-normal leading-tight mt-0.5 truncate">
                छापा कार्यवाही विभाग (एफ)
              </span>
              <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-bold text-slate-700 tracking-wider sm:tracking-widest uppercase leading-tight mt-0.5 truncate">
                GOVERNMENT OF INDIA
              </span>
            </div>
          </button>

          {/* Right Action Bar: [Verify] [ID Card] [DONATE] [Hamburger Menu] */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 shrink-0">
            {/* 1. Verify Officer Button */}
            <button
              onClick={() => onOpenVerifyModal()}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg border border-blue-200 text-[#0d47a1] bg-blue-50/80 hover:bg-[#0d47a1] hover:text-white hover:border-[#0d47a1] font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer whitespace-nowrap"
              title="Verify Officer in Active Roster"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px] md:text-[20px]">verified_user</span>
              <span className="hidden xs:inline font-bold">Verify</span>
            </button>

            {/* 2. ID Card Portal Button */}
            <button
              onClick={() => handleNavClick('id-download')}
              className="hidden sm:inline-flex items-center gap-1 sm:gap-1.5 px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer whitespace-nowrap"
              title="Official ID Card Download Portal"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px] md:text-[20px] text-slate-600">badge</span>
              <span>ID Card</span>
            </button>

            {/* 3. DONATE Button (Vibrant Orange) */}
            <button
              onClick={() => handleNavClick('donate')}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg bg-[#e65100] hover:bg-[#d84315] active:bg-[#bf360c] text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap"
              title="Make 80G Tax-Exempt Contribution"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px] md:text-[20px]">volunteer_activism</span>
              <span>DONATE</span>
            </button>

            {/* 4. Hamburger Menu Button (Matching menu-update.jpg) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 sm:p-2 md:p-2.5 text-slate-800 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d47a1] cursor-pointer transition-colors flex items-center justify-center shrink-0 shadow-xs"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              title={menuOpen ? 'Close Menu' : 'Open Menu'}
            >
              <span className="material-symbols-outlined text-[24px] sm:text-[26px] md:text-[28px]">
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NAVIGATION DRAWER / DROPDOWN (Restored to the Beloved Previous Mobile UI) */}
      {/* ========================================================================= */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fadeIn"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Menu Panel (Responsive: full width on phone, sleek drawer on tablet/desktop) */}
          <div className="relative w-full max-w-md sm:max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-slideLeft">
            
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 bg-linear-to-r from-[#0a192f] via-[#0d47a1] to-[#0a192f] text-white flex items-center justify-between border-b border-blue-900 shadow-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 p-1 flex items-center justify-center border border-white/20">
                  <RawfLogo className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="font-headline font-black text-sm sm:text-base text-white tracking-tight leading-none">
                    RAID ACTING WING (F)
                  </h2>
                  <p className="font-id-hindi text-xs text-amber-300 font-bold leading-tight mt-0.5">
                    छापा कार्यवाही विभाग • National Portal
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Scrollable Container with Previous Mobile UI */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* 1. Priority Quick Actions Bar (2x2 Grid) */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleNavClick('grievance-cell')}
                  className="py-2.5 px-3 bg-red-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer hover:bg-red-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">campaign</span>
                  <span>Report Grievance</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenVerifyModal();
                  }}
                  className="py-2.5 px-3 bg-[#0d47a1] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer hover:bg-blue-900 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Verify Officer</span>
                </button>
                <button
                  onClick={() => handleNavClick('apply-online')}
                  className="py-2.5 px-3 bg-emerald-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer hover:bg-emerald-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  <span>Apply Online</span>
                </button>
                <button
                  onClick={() => handleNavClick('id-download')}
                  className="py-2.5 px-3 bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer hover:bg-slate-900 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                  <span>ID Card Portal</span>
                </button>
              </div>

              {/* 2. Utility Row: Donate, Language Toggle, Admin */}
              <div className="flex items-center justify-between gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <button
                  onClick={() => handleNavClick('donate')}
                  className="flex-1 py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
                  <span>Donate 80G</span>
                </button>
                <button
                  onClick={onToggleLang}
                  className="py-1.5 px-3 bg-white border border-slate-300 text-slate-800 font-bold rounded flex items-center gap-1 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">g_translate</span>
                  <span>{lang === 'en' ? 'हिन्दी (HI)' : 'English (EN)'}</span>
                </button>
                <button
                  onClick={() => handleNavClick('admin')}
                  className="py-1.5 px-3 bg-slate-900 text-amber-300 font-bold rounded flex items-center gap-1 hover:bg-black transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                  <span>Admin</span>
                </button>
              </div>

              {/* 3. Navigation Links List (The exact beloved clean vertical format) */}
              <div className="divide-y divide-slate-100 text-sm font-semibold text-slate-800">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`w-full py-2.5 px-2 rounded-md flex items-center justify-between text-left cursor-pointer transition-colors ${
                    currentPage === 'home' ? 'text-[#0d47a1] bg-blue-50 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">home</span>
                    <span>Home</span>
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
                </button>

                <button
                  onClick={() => handleNavClick('about')}
                  className={`w-full py-2.5 px-2 rounded-md flex items-center justify-between text-left cursor-pointer transition-colors ${
                    currentPage === 'about' ? 'text-[#0d47a1] bg-blue-50 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">info</span>
                    <span>About Us (Mandate &amp; Genesis)</span>
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
                </button>

                {/* Our Services with Expandable Sub-items */}
                <div>
                  <button
                    onClick={() => toggleSection('services')}
                    className={`w-full py-2.5 px-2 rounded-md flex items-center justify-between text-left cursor-pointer transition-colors ${
                      currentPage === 'services' ? 'text-[#0d47a1] bg-blue-50 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">shield</span>
                      <span>Our Services (All Wings &amp; Cells)</span>
                    </span>
                    <span className="material-symbols-outlined text-[16px] text-slate-400 transition-transform">
                      {expandedSection === 'services' ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {expandedSection === 'services' && (
                    <div className="pl-8 pr-2 py-1 space-y-1 bg-slate-50/80 rounded-lg text-xs font-medium text-slate-600">
                      <button
                        onClick={() => handleNavClick('services', 'confidential-info')}
                        className="w-full text-left py-1.5 hover:text-[#0d47a1] cursor-pointer block"
                      >
                        • Confidential Information Cell
                      </button>
                      <button
                        onClick={() => handleNavClick('services', 'crime-info')}
                        className="w-full text-left py-1.5 hover:text-[#0d47a1] cursor-pointer block"
                      >
                        • Crime Information Bureau
                      </button>
                      <button
                        onClick={() => handleNavClick('services', 'social-investigator')}
                        className="w-full text-left py-1.5 hover:text-[#0d47a1] cursor-pointer block"
                      >
                        • Social Investigator Network
                      </button>
                      <button
                        onClick={() => handleNavClick('services', 'cyber-forensics')}
                        className="w-full text-left py-1.5 hover:text-[#0d47a1] cursor-pointer block"
                      >
                        • Cyber Crime Forensics
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleNavClick('projects')}
                  className={`w-full py-2.5 px-2 rounded-md flex items-center justify-between text-left cursor-pointer transition-colors ${
                    currentPage === 'projects' ? 'text-[#0d47a1] bg-blue-50 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">assignment</span>
                    <span>Our Projects (20 Key Initiatives)</span>
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
                </button>

                <button
                  onClick={() => handleNavClick('departments')}
                  className={`w-full py-2.5 px-2 rounded-md flex items-center justify-between text-left cursor-pointer transition-colors ${
                    currentPage === 'departments' ? 'text-[#0d47a1] bg-blue-50 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">domain</span>
                    <span>Our Departments (22 Special Wings)</span>
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
                </button>

                <button
                  onClick={() => handleNavClick('rights')}
                  className={`w-full py-2.5 px-2 rounded-md flex items-center justify-between text-left cursor-pointer transition-colors ${
                    currentPage === 'rights' ? 'text-[#0d47a1] bg-blue-50 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">gavel</span>
                    <span>Your Rights (13 Citizen Charters)</span>
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
                </button>

                <button
                  onClick={() => handleNavClick('officers')}
                  className={`w-full py-2.5 px-2 rounded-md flex items-center justify-between text-left cursor-pointer transition-colors ${
                    currentPage === 'officers' ? 'text-[#0d47a1] bg-blue-50 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">badge</span>
                    <span>National Officers Roster</span>
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
                </button>

                <button
                  onClick={() => handleNavClick('blacklisted-officers')}
                  className={`w-full py-2.5 px-2 rounded-md flex items-center justify-between text-left cursor-pointer text-red-600 transition-colors ${
                    currentPage === 'blacklisted-officers' ? 'bg-red-50 font-bold' : 'hover:bg-red-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5 font-bold">
                    <span className="material-symbols-outlined text-[18px] text-red-600">block</span>
                    <span>Blacklisted Officers Register</span>
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-red-400">chevron_right</span>
                </button>

                {/* Indian Laws with Expandable Sub-items */}
                <div>
                  <button
                    onClick={() => toggleSection('laws')}
                    className={`w-full py-2.5 px-2 rounded-md flex items-center justify-between text-left cursor-pointer transition-colors ${
                      currentPage === 'indian-laws' ? 'text-[#0d47a1] bg-blue-50 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">menu_book</span>
                      <span>Indian Laws &amp; Legal Manuals</span>
                    </span>
                    <span className="material-symbols-outlined text-[16px] text-slate-400 transition-transform">
                      {expandedSection === 'laws' ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {expandedSection === 'laws' && (
                    <div className="pl-8 pr-2 py-1 space-y-1 bg-slate-50/80 rounded-lg text-xs font-medium text-slate-600">
                      <button
                        onClick={() => handleNavClick('indian-laws')}
                        className="w-full text-left py-1.5 hover:text-[#0d47a1] cursor-pointer block"
                      >
                        • Rulings on Indian Police
                      </button>
                      <button
                        onClick={() => handleNavClick('indian-laws')}
                        className="w-full text-left py-1.5 hover:text-[#0d47a1] cursor-pointer block"
                      >
                        • Judiciary Systems of India
                      </button>
                      <button
                        onClick={() => handleNavClick('indian-laws')}
                        className="w-full text-left py-1.5 hover:text-[#0d47a1] cursor-pointer block"
                      >
                        • Sexual Harassment (POSH)
                      </button>
                      <button
                        onClick={() => handleNavClick('indian-laws')}
                        className="w-full text-left py-1.5 hover:text-[#0d47a1] cursor-pointer block"
                      >
                        • Anticipatory Bail &amp; Rights
                      </button>
                      <button
                        onClick={() => handleNavClick('indian-laws')}
                        className="w-full text-left py-1.5 hover:text-[#0d47a1] cursor-pointer block"
                      >
                        • Constitution of India (Bilingual)
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleNavClick('activities')}
                  className={`w-full py-2.5 px-2 rounded-md flex items-center justify-between text-left cursor-pointer transition-colors ${
                    currentPage === 'activities' ? 'text-[#0d47a1] bg-blue-50 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">event_note</span>
                    <span>Our Activities &amp; Raids</span>
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
                </button>

                <button
                  onClick={() => handleNavClick('grievance-cell')}
                  className={`w-full py-2.5 px-2 rounded-md flex items-center justify-between text-left cursor-pointer transition-colors ${
                    currentPage === 'grievance-cell' ? 'text-[#0d47a1] bg-blue-50 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">support_agent</span>
                    <span>Public Grievance Cell &amp; Directories</span>
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
                </button>

                <button
                  onClick={() => handleNavClick('contact')}
                  className={`w-full py-2.5 px-2 rounded-md flex items-center justify-between text-left cursor-pointer transition-colors ${
                    currentPage === 'contact' ? 'text-[#0d47a1] bg-blue-50 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">contact_support</span>
                    <span>Contact National Secretariat</span>
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
                </button>
              </div>

              {/* 4. Helpline & Statutory Charter in Drawer */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <span className="material-symbols-outlined text-[15px] text-red-600">call</span>
                  <span>24/7 Helpline: <strong className="text-slate-900 font-mono">1800-RAW-CELL</strong></span>
                </span>
                <span className="font-mono text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  IFA 760
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
