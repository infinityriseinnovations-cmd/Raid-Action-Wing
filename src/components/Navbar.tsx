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
      {/* Top Emergency & Statutory Utility Strip (Cobalt Police Navy) */}
      <div className="bg-[#0d47a1] text-white px-4 lg:px-8 border-b border-blue-900">
        <div className="max-w-7xl mx-auto h-9 flex items-center justify-between text-xs font-medium tracking-wide">
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="font-bold text-red-200">
                24/7 HELPLINE: <a className="text-white hover:underline font-mono" href="tel:18007292355">1800-RAW-CELL</a>
              </span>
            </div>
            <span className="hidden md:inline text-blue-300/40">|</span>
            <div className="hidden md:flex items-center gap-1.5 text-blue-100">
              <span className="material-symbols-outlined text-[15px] text-amber-300">verified</span>
              <span>NITI Aayog Darpan: <strong className="text-white font-mono">DL/2021/RAWF</strong></span>
            </div>
            <span className="hidden lg:inline text-blue-300/40">|</span>
            <div className="hidden lg:flex items-center gap-1.5 text-blue-100">
              <span>Register Under: ITA ACT 1882 Charter</span>
              <span className="text-[10px] bg-blue-800 px-1.5 py-0.5 rounded font-mono text-blue-200">IFA 760</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-blue-100 text-xs">
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
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 shrink-0 group py-1 text-left cursor-pointer"
          >
            <RawfLogo className="w-12 h-12" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-base sm:text-lg lg:text-xl text-[#0a192f] tracking-tight leading-tight group-hover:text-[#0d47a1] transition-colors">
                  RAID ACTION WING FOUNDATION
                </span>
                <span className="bg-red-600 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded leading-none">
                  (F)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base text-red-600 tracking-tight leading-tight">
                  छापा कार्यवाही विभाग
                </span>
                <span className="bg-[#0d47a1] text-white font-mono text-[9px] font-bold px-1 py-0.2 rounded leading-none">
                  (एफ)
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase mt-0.5 hidden sm:block">
                AUTONOMOUS CITIZEN VIGILANCE & ANTI-CORRUPTION NETWORK
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
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenVerifyModal()}
              className="inline-flex items-center gap-1 px-3 py-2 rounded border border-blue-200 text-[#0d47a1] bg-blue-50 hover:bg-[#0d47a1] hover:text-white font-bold text-xs transition-all shadow-xs whitespace-nowrap cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>Verify Officer</span>
            </button>

            <button
              onClick={() => handleNavClick('id-download')}
              className="hidden lg:inline-flex items-center gap-1 px-3 py-2 rounded border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 font-semibold text-xs transition-all whitespace-nowrap cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">badge</span>
              <span>ID Card</span>
            </button>

            <button
              onClick={() => handleNavClick('donate')}
              className="inline-flex items-center gap-1 px-3 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs whitespace-nowrap cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
              <span className="hidden sm:inline">Donate</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="2xl:hidden p-2 text-slate-700 hover:bg-slate-100 rounded focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="2xl:hidden py-4 border-t border-slate-200 bg-white space-y-2 animate-fadeIn max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
              <button
                onClick={() => {
                  handleNavClick('grievance-cell');
                }}
                className="py-2.5 px-3 bg-red-50 text-red-600 rounded font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">campaign</span>
                Report Grievance
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenVerifyModal();
                }}
                className="py-2.5 px-3 bg-blue-50 text-[#0d47a1] rounded font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                Verify Badge
              </button>
            </div>

            <nav className="flex flex-col space-y-1 text-sm font-semibold text-slate-700">
              <button
                onClick={() => handleNavClick('home')}
                className="px-3 py-2 hover:bg-slate-50 rounded text-left cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className="px-3 py-2 hover:bg-slate-50 rounded text-left cursor-pointer"
              >
                About Us
              </button>
              <button
                onClick={() => handleNavClick('services')}
                className="px-3 py-2 hover:bg-slate-50 rounded text-left cursor-pointer"
              >
                Our Services (All Wings)
              </button>
              <button
                onClick={() => handleNavClick('projects')}
                className="px-3 py-2 hover:bg-slate-50 rounded text-left cursor-pointer"
              >
                Our Projects (20 Initiatives)
              </button>
              <button
                onClick={() => handleNavClick('departments')}
                className="px-3 py-2 hover:bg-slate-50 rounded text-left cursor-pointer"
              >
                Our Departments (22 Divisions)
              </button>
              <button
                onClick={() => handleNavClick('rights')}
                className="px-3 py-2 hover:bg-slate-50 rounded text-left cursor-pointer"
              >
                Your Rights (13 Charters)
              </button>
              <button
                onClick={() => handleNavClick('officers')}
                className="px-3 py-2 hover:bg-slate-50 rounded text-left cursor-pointer"
              >
                Our Officers Roster
              </button>
              <button
                onClick={() => handleNavClick('blacklisted-officers')}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded text-left cursor-pointer font-bold"
              >
                Blacklisted Officers Register
              </button>
              <button
                onClick={() => handleNavClick('indian-laws')}
                className="px-3 py-2 hover:bg-slate-50 rounded text-left cursor-pointer"
              >
                Indian Laws & Manuals
              </button>
              <button
                onClick={() => handleNavClick('activities')}
                className="px-3 py-2 hover:bg-slate-50 rounded text-left cursor-pointer"
              >
                Our Activities
              </button>
              <button
                onClick={() => handleNavClick('grievance-cell')}
                className="px-3 py-2 hover:bg-slate-50 rounded text-left cursor-pointer"
              >
                Public Grievance Cell & Directories
              </button>
              <button
                onClick={() => handleNavClick('apply-online')}
                className="px-3 py-2 hover:bg-slate-50 rounded text-left cursor-pointer text-emerald-700 font-bold"
              >
                Apply Online / Membership
              </button>
              <button
                onClick={() => handleNavClick('id-download')}
                className="px-3 py-2 hover:bg-slate-50 rounded text-left cursor-pointer text-[#0d47a1]"
              >
                Download ID Card Portal
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="px-3 py-2 hover:bg-slate-50 rounded text-left cursor-pointer"
              >
                Contact Us
              </button>
              <button
                onClick={() => handleNavClick('donate')}
                className="px-3 py-2 hover:bg-slate-50 rounded text-left cursor-pointer text-amber-700 font-bold"
              >
                Support & Donate (80G)
              </button>
            </nav>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-3">
              <span>24/7 Helpline: <strong className="text-slate-900">1800-RAW-CELL</strong></span>
              <span className="font-mono text-red-600 font-bold">IFA 760</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
