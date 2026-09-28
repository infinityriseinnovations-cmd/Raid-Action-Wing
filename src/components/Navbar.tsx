import React, { useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleNavClick = (page: string, subParam?: string) => {
    onNavigate(page, subParam);
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-slate-200 font-sans">
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

          {/* Static Unscrolled Right Action Bar: Admin, Apply Online, RTI Cell & Language Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 text-blue-100 text-xs shrink-0 z-10 bg-[#0d47a1] pl-2 sm:pl-3 shadow-[-8px_0_12px_#0d47a1]">
            <button
              onClick={() => handleNavClick('admin')}
              className="hidden lg:inline-flex items-center gap-1 bg-amber-600/90 hover:bg-amber-600 text-white px-2 py-0.5 rounded font-bold transition-colors cursor-pointer text-[11px]"
              title="Director General Admin Command"
            >
              <span className="material-symbols-outlined text-[13px]">admin_panel_settings</span>
              <span>Admin</span>
            </button>
            <span className="hidden lg:inline text-blue-300/40">|</span>
            <button
              onClick={() => handleNavClick('apply-online')}
              className="hidden sm:inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2.5 py-0.5 rounded font-bold transition-colors cursor-pointer"
            >
              Apply Online
            </button>
            <span className="hidden sm:inline text-blue-300/40">|</span>
            <button
              onClick={() => handleNavClick('rights')}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">article</span>
              <span>RTI Cell</span>
            </button>
            <span className="text-blue-300/40">|</span>
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 cursor-pointer hover:text-white bg-blue-900/60 px-2 py-0.5 rounded border border-blue-700/50 transition-colors"
              title="Toggle English / Hindi"
            >
              <span className="material-symbols-outlined text-[14px]">g_translate</span>
              <span className="font-bold">{lang === 'en' ? 'EN' : 'HI'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Title */}
          <button
            onClick={() => handleNavClick('home')}
            className="min-w-0 flex-1 sm:flex-initial flex items-center gap-2 sm:gap-3 group py-1 text-left cursor-pointer overflow-hidden"
          >
            <RawfLogo className="w-10 h-10 sm:w-12 sm:h-12 shrink-0" />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <span className="font-headline font-bold text-xs xs:text-sm sm:text-lg lg:text-xl text-[#0a192f] tracking-tight leading-tight group-hover:text-[#0d47a1] transition-colors truncate">
                  RAID ACTION WING
                </span>
                <span className="hidden sm:inline font-headline font-bold text-xs sm:text-lg lg:text-xl text-[#0a192f] tracking-tight leading-tight">
                  FOUNDATION
                </span>
                <span className="bg-red-600 text-white font-mono text-[9px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded leading-none shrink-0">
                  (F)
                </span>
              </div>
              <div className="flex items-center gap-1 min-w-0">
                <span className="font-bold text-[11px] sm:text-base text-red-600 tracking-tight leading-tight truncate">
                  छापा कार्यवाही विभाग
                </span>
                <span className="bg-[#0d47a1] text-white font-mono text-[8px] sm:text-[9px] font-bold px-1 py-0.2 rounded leading-none shrink-0">
                  (एफ)
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase mt-0.5 hidden md:block">
                JAI HIND CITIZEN VIGILANCE & ANTI-CORRUPTION NETWORK
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden 2xl:flex items-center space-x-0.5 text-xs font-bold text-slate-700">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-2.5 py-2 rounded transition-colors cursor-pointer ${
                currentPage === 'home' ? 'text-[#0d47a1] bg-blue-50' : 'hover:text-[#0d47a1] hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`px-2.5 py-2 rounded transition-colors cursor-pointer ${
                currentPage === 'about' ? 'text-[#0d47a1] bg-blue-50' : 'hover:text-[#0d47a1] hover:bg-slate-50'
              }`}
            >
              About Us
            </button>

            {/* Our Services with Submenu */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('services')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={() => handleNavClick('services')}
                className={`px-2.5 py-2 rounded transition-colors cursor-pointer flex items-center gap-0.5 ${
                  currentPage === 'services' ? 'text-[#0d47a1] bg-blue-50' : 'hover:text-[#0d47a1] hover:bg-slate-50'
                }`}
              >
                <span>Our Services</span>
                <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
              </button>
              {openDropdown === 'services' && (
                <div className="absolute top-full left-0 w-60 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50 animate-fadeIn">
                  <button
                    onClick={() => handleNavClick('services', 'confidential-info')}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-800 text-xs font-semibold cursor-pointer block"
                  >
                    Confidential Information
                  </button>
                  <button
                    onClick={() => handleNavClick('services', 'crime-info')}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-800 text-xs font-semibold cursor-pointer block"
                  >
                    Crime Information
                  </button>
                  <button
                    onClick={() => handleNavClick('services', 'social-investigator')}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-800 text-xs font-semibold cursor-pointer block"
                  >
                    Social Investigator
                  </button>
                  <button
                    onClick={() => handleNavClick('services', 'cyber-forensics')}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-800 text-xs font-semibold cursor-pointer block"
                  >
                    Cyber Crime Forensics
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('projects')}
              className={`px-2.5 py-2 rounded transition-colors cursor-pointer ${
                currentPage === 'projects' ? 'text-[#0d47a1] bg-blue-50' : 'hover:text-[#0d47a1] hover:bg-slate-50'
              }`}
            >
              Our Projects
            </button>

            <button
              onClick={() => handleNavClick('departments')}
              className={`px-2.5 py-2 rounded transition-colors cursor-pointer ${
                currentPage === 'departments' ? 'text-[#0d47a1] bg-blue-50' : 'hover:text-[#0d47a1] hover:bg-slate-50'
              }`}
            >
              Departments
            </button>

            <button
              onClick={() => handleNavClick('rights')}
              className={`px-2.5 py-2 rounded transition-colors cursor-pointer ${
                currentPage === 'rights' ? 'text-[#0d47a1] bg-blue-50' : 'hover:text-[#0d47a1] hover:bg-slate-50'
              }`}
            >
              Your Rights
            </button>

            {/* Our Officers with Submenu */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('officers')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={() => handleNavClick('officers')}
                className={`px-2.5 py-2 rounded transition-colors cursor-pointer flex items-center gap-0.5 ${
                  currentPage === 'officers' || currentPage === 'blacklisted-officers'
                    ? 'text-[#0d47a1] bg-blue-50'
                    : 'hover:text-[#0d47a1] hover:bg-slate-50'
                }`}
              >
                <span>Our Officers</span>
                <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
              </button>
              {openDropdown === 'officers' && (
                <div className="absolute top-full left-0 w-56 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50 animate-fadeIn">
                  <button
                    onClick={() => handleNavClick('officers')}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-800 text-xs font-semibold cursor-pointer block"
                  >
                    Officer Directory & Verification
                  </button>
                  <button
                    onClick={() => handleNavClick('blacklisted-officers')}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-xs font-semibold cursor-pointer block"
                  >
                    Blacklisted Officers Registry
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('indian-laws')}
              className={`px-2.5 py-2 rounded transition-colors cursor-pointer ${
                currentPage === 'indian-laws' ? 'text-[#0d47a1] bg-blue-50' : 'hover:text-[#0d47a1] hover:bg-slate-50'
              }`}
            >
              Indian Laws
            </button>

            <button
              onClick={() => handleNavClick('activities')}
              className={`px-2.5 py-2 rounded transition-colors cursor-pointer ${
                currentPage === 'activities' ? 'text-[#0d47a1] bg-blue-50' : 'hover:text-[#0d47a1] hover:bg-slate-50'
              }`}
            >
              Activities
            </button>

            <button
              onClick={() => handleNavClick('grievance-cell')}
              className={`px-2.5 py-2 rounded transition-colors cursor-pointer ${
                currentPage === 'grievance-cell' ? 'text-[#0d47a1] bg-blue-50' : 'hover:text-[#0d47a1] hover:bg-slate-50'
              }`}
            >
              Public Grievance Cell
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`px-2.5 py-2 rounded transition-colors cursor-pointer ${
                currentPage === 'contact' ? 'text-[#0d47a1] bg-blue-50' : 'hover:text-[#0d47a1] hover:bg-slate-50'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Verify Officer Button */}
            <button
              onClick={() => onOpenVerifyModal()}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded border border-blue-200 text-[#0d47a1] bg-blue-50 hover:bg-[#0d47a1] hover:text-white font-bold text-xs transition-all shadow-xs whitespace-nowrap cursor-pointer"
              title="Verify Officer in Active Roster"
            >
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span className="hidden xs:inline">Verify Officer</span>
              <span className="xs:hidden">Verify</span>
            </button>

            {/* ID Card shortcut */}
            <button
              onClick={() => handleNavClick('id-download')}
              className="hidden lg:inline-flex items-center gap-1 px-3 py-2 rounded border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 font-semibold text-xs transition-all whitespace-nowrap cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">badge</span>
              <span>ID Card</span>
            </button>

            {/* Donate button */}
            <button
              onClick={() => handleNavClick('donate')}
              className="hidden md:inline-flex items-center gap-1 px-3 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs whitespace-nowrap cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
              <span>Donate</span>
            </button>

            {/* Mobile Hamburger Toggle - Bold, High-Contrast & Always Visible on Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="2xl:hidden p-2 sm:p-2.5 text-slate-800 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d47a1] cursor-pointer transition-colors flex items-center justify-center shrink-0 shadow-xs"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              title={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Drawer Backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 top-[100px] sm:top-[116px] bg-slate-950/60 backdrop-blur-xs z-40 2xl:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="relative z-50 2xl:hidden border-t border-slate-200 bg-white max-h-[calc(100vh-100px)] sm:max-h-[calc(100vh-116px)] overflow-y-auto shadow-2xl animate-fadeIn">
            <div className="max-w-7xl mx-auto p-4 space-y-4">
              {/* Priority Quick Actions Bar */}
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
                    setMobileMenuOpen(false);
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

              {/* Utility Row: Donate, Language Toggle, Admin */}
              <div className="flex items-center justify-between gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <button
                  onClick={() => handleNavClick('donate')}
                  className="flex-1 py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded flex items-center justify-center gap-1 transition-colors"
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

              {/* Navigation Links List */}
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

                <button
                  onClick={() => handleNavClick('services')}
                  className={`w-full py-2.5 px-2 rounded-md flex items-center justify-between text-left cursor-pointer transition-colors ${
                    currentPage === 'services' ? 'text-[#0d47a1] bg-blue-50 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">shield</span>
                    <span>Our Services (All Wings &amp; Cells)</span>
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
                </button>

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

                <button
                  onClick={() => handleNavClick('indian-laws')}
                  className={`w-full py-2.5 px-2 rounded-md flex items-center justify-between text-left cursor-pointer transition-colors ${
                    currentPage === 'indian-laws' ? 'text-[#0d47a1] bg-blue-50 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">menu_book</span>
                    <span>Indian Laws &amp; Legal Manuals</span>
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
                </button>

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

              {/* Helpline & Statutory Charter in Drawer */}
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
        )}
      </div>
    </header>
  );
};
