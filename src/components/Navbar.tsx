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
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Close menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when drawer is open
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navCategories = [
    {
      title: 'Core Directives & About',
      icon: 'account_balance',
      items: [
        { label: 'Home Page', page: 'home', icon: 'home', desc: 'National Citizen Vigilance Command' },
        { label: 'About RAWF Mandate', page: 'about', icon: 'info', desc: 'Genesis, Vision & ITA Act 1882 Charter' },
        { label: 'Our Projects & Operations', page: 'projects', icon: 'assignment', desc: '20 National Strategic Initiatives' },
        { label: 'Departments & Special Wings', page: 'departments', icon: 'domain', desc: '22 Autonomous Tactical Wings' },
      ]
    },
    {
      title: 'Citizen Services & Vigilance',
      icon: 'shield',
      items: [
        { label: 'Our Services Overview', page: 'services', icon: 'shield_with_heart', desc: 'Full Citizen Vigilance Matrix' },
        { label: 'Confidential Information Cell', page: 'services', subParam: 'confidential-info', icon: 'lock', desc: 'Whistleblower encrypted intelligence' },
        { label: 'Crime Information Network', page: 'services', subParam: 'crime-info', icon: 'policy', desc: 'Anti-graft & economic offense reporting' },
        { label: 'Social Investigator Bureau', page: 'services', subParam: 'social-investigator', icon: 'search', desc: 'Ground fact-finding & RTI investigations' },
        { label: 'Cyber Forensics Unit', page: 'services', subParam: 'cyber-forensics', icon: 'terminal', desc: 'Digital evidence & financial fraud audit' },
        { label: 'Public Grievance Redressal', page: 'grievance-cell', icon: 'support_agent', desc: 'Lodge corruption complaints & track cases' },
      ]
    },
    {
      title: 'Officers Directory & Credentials',
      icon: 'badge',
      items: [
        { label: 'National Officers Directory', page: 'officers', icon: 'groups', desc: 'Active Field & Directorate Roster' },
        { label: 'Officer Verification Portal', action: () => onOpenVerifyModal(), icon: 'verified_user', desc: 'Instant QR & UID validity check' },
        { label: 'Official ID Card Download', page: 'id-download', icon: 'badge', desc: 'Cryptographic digital identity pass' },
        { label: 'Blacklisted Officers Registry', page: 'blacklisted-officers', icon: 'block', desc: 'Revoked badges & public warning notices', danger: true },
      ]
    },
    {
      title: 'Legal Hub & Statutory Laws',
      icon: 'gavel',
      items: [
        { label: 'Statutory Indian Laws Library', page: 'indian-laws', icon: 'menu_book', desc: 'Acts, POSH, Police Rulings & Bail Law' },
        { label: 'Citizen Rights Charters', page: 'rights', icon: 'fact_check', desc: '13 Constitutional Rights Guidelines & RTI' },
        { label: 'Constitution of India (Bilingual)', page: 'indian-laws', icon: 'history_edu', desc: 'Complete English & Hindi official texts' },
      ]
    },
    {
      title: 'Media, News & Contact',
      icon: 'campaign',
      items: [
        { label: 'Activities & Dispatch Desk', page: 'activities', icon: 'newspaper', desc: 'Field raids, summits & press releases' },
        { label: 'Apply Online for Membership', page: 'apply-online', icon: 'how_to_reg', desc: 'Join RAWF as Citizen Vigilance Officer' },
        { label: 'Contact National Secretariat', page: 'contact', icon: 'contact_support', desc: 'Headquarters, State Bureaus & Helpline' },
        { label: 'Director General Admin Console', page: 'admin', icon: 'admin_panel_settings', desc: 'Restricted administrative portal' },
      ]
    }
  ];

  const filteredCategories = searchQuery.trim()
    ? navCategories.map(cat => ({
        ...cat,
        items: cat.items.filter(item => 
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.items.length > 0)
    : navCategories;

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
        <div className="h-20 sm:h-22 flex items-center justify-between gap-4">
          
          {/* Logo & Official Title (Full Spacious Layout Matching menu-update.jpg) */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 sm:gap-4 group py-1 text-left cursor-pointer shrink-0"
            aria-label="Raid Action Wing Foundation - Return to Homepage"
          >
            {/* Round Insignia Emblem */}
            <div className="h-14 sm:h-16 w-14 sm:w-16 flex items-center justify-center shrink-0">
              <RawfLogo className="w-full h-full object-contain drop-shadow-xs group-hover:scale-105 transition-transform duration-200" />
            </div>

            {/* Official Typography Header */}
            <div className="flex flex-col justify-center text-left">
              <span className="font-headline font-black text-base sm:text-xl lg:text-2xl text-[#0a192f] tracking-tight leading-none group-hover:text-[#0d47a1] transition-colors">
                RAID ACTING WING (F)
              </span>
              <span className="font-id-hindi font-bold text-xs sm:text-sm lg:text-[15px] text-red-600 tracking-normal leading-tight mt-0.5">
                छापा कार्यवाही विभाग (एफ)
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-700 tracking-widest uppercase leading-tight mt-0.5">
                GOVERNMENT OF INDIA
              </span>
            </div>
          </button>

          {/* Right Action Bar: [Verify] [ID Card] [DONATE] [Hamburger Menu] */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* 1. Verify Officer Button */}
            <button
              onClick={() => onOpenVerifyModal()}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-blue-200 text-[#0d47a1] bg-blue-50/80 hover:bg-[#0d47a1] hover:text-white hover:border-[#0d47a1] font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
              title="Verify Officer in Active Roster"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">verified_user</span>
              <span className="font-bold">Verify</span>
            </button>

            {/* 2. ID Card Portal Button */}
            <button
              onClick={() => handleNavClick('id-download')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
              title="Official ID Card Download Portal"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px] text-slate-600">badge</span>
              <span>ID Card</span>
            </button>

            {/* 3. DONATE Button (Vibrant Orange) */}
            <button
              onClick={() => handleNavClick('donate')}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#e65100] hover:bg-[#d84315] active:bg-[#bf360c] text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer"
              title="Make 80G Tax-Exempt Contribution"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">volunteer_activism</span>
              <span>DONATE</span>
            </button>

            {/* 4. Hamburger Menu Button (Clean Toggle matching menu-update.jpg) */}
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 sm:p-2.5 text-slate-800 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d47a1] cursor-pointer transition-colors flex items-center justify-center shrink-0 shadow-xs"
              aria-label="Open full navigation menu"
              title="Navigation Menu"
            >
              <span className="material-symbols-outlined text-[26px] sm:text-[28px]">menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SLIDE-OVER NAVIGATION DRAWER & MEGA MENU (Desktop & Mobile)              */}
      {/* ========================================================================= */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fadeIn"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Drawer Panel */}
          <div className="relative w-full max-w-lg sm:max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 animate-slideLeft">
            
            {/* Drawer Header */}
            <div className="p-4 sm:p-6 bg-linear-to-r from-[#0a192f] via-[#0d47a1] to-[#0a192f] text-white flex items-center justify-between border-b border-blue-900 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/10 p-1 flex items-center justify-center border border-white/20">
                  <RawfLogo className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="font-headline font-black text-base sm:text-lg text-white tracking-tight leading-none">
                    RAID ACTION WING (F)
                  </h2>
                  <p className="font-id-hindi text-xs text-amber-300 font-bold leading-tight mt-0.5">
                    छापा कार्यवाही विभाग • National Portal
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Quick Search & Fast Actions */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search portals, acts, services, officers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d47a1] focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">cancel</span>
                  </button>
                )}
              </div>

              {/* Priority Action Shortcuts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleNavClick('grievance-cell')}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-xs cursor-pointer transition-colors text-center"
                >
                  <span className="material-symbols-outlined text-[20px]">campaign</span>
                  <span className="text-[11px] leading-tight">Report Graft</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenVerifyModal();
                  }}
                  className="p-2 bg-[#0d47a1] hover:bg-blue-900 text-white rounded-lg font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-xs cursor-pointer transition-colors text-center"
                >
                  <span className="material-symbols-outlined text-[20px]">verified_user</span>
                  <span className="text-[11px] leading-tight">Verify Officer</span>
                </button>

                <button
                  onClick={() => handleNavClick('apply-online')}
                  className="p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-xs cursor-pointer transition-colors text-center"
                >
                  <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                  <span className="text-[11px] leading-tight">Apply Online</span>
                </button>

                <button
                  onClick={() => handleNavClick('admin')}
                  className="p-2 bg-slate-900 hover:bg-black text-amber-300 rounded-lg font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-xs cursor-pointer transition-colors text-center"
                >
                  <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                  <span className="text-[11px] leading-tight">Admin Login</span>
                </button>
              </div>
            </div>

            {/* Scrollable Navigation Categories */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {filteredCategories.map((category, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                    <span className="material-symbols-outlined text-[16px] text-[#0d47a1]">
                      {category.icon}
                    </span>
                    <span>{category.title}</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200/70">
                    {category.items.map((item, itemIdx) => {
                      const isActive = item.page && currentPage === item.page;
                      return (
                        <button
                          key={itemIdx}
                          onClick={() => {
                            if (item.action) {
                              setMenuOpen(false);
                              item.action();
                            } else if (item.page) {
                              handleNavClick(item.page, item.subParam);
                            }
                          }}
                          className={`w-full p-3 flex items-start gap-3 text-left transition-colors cursor-pointer group ${
                            isActive
                              ? 'bg-blue-100/70 text-[#0d47a1]'
                              : item.danger
                              ? 'hover:bg-red-50 text-slate-800 hover:text-red-700'
                              : 'hover:bg-white text-slate-800 hover:text-[#0d47a1]'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isActive
                              ? 'bg-[#0d47a1] text-white'
                              : item.danger
                              ? 'bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white'
                              : 'bg-white border border-slate-200 text-slate-600 group-hover:bg-[#0d47a1] group-hover:text-white group-hover:border-[#0d47a1]'
                          } transition-colors`}>
                            <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-bold truncate ${item.danger ? 'text-red-600' : ''}`}>
                                {item.label}
                              </span>
                              <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:translate-x-0.5 transition-transform">
                                chevron_right
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {filteredCategories.length === 0 && (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
                  <p className="text-sm font-semibold">No navigation portals found for "{searchQuery}"</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-bold text-[#0d47a1] hover:underline cursor-pointer"
                  >
                    Clear Search Filter
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Footer: Language Toggle, 24/7 Helpline & Statutory Info */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs">
                <button
                  onClick={onToggleLang}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-bold hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#0d47a1]">g_translate</span>
                  <span>{lang === 'en' ? 'Language: हिन्दी (HI)' : 'Language: English (EN)'}</span>
                </button>

                <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-slate-600 bg-white px-2 py-1.5 rounded-lg border border-slate-200">
                  <span>CHARTER:</span>
                  <span className="text-blue-700">IFA 760</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-red-600">call</span>
                  <span>24/7 Helpline: <strong className="text-slate-900 font-mono">1800-RAW-CELL</strong></span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  DL/2021/RAWF
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
