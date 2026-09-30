import React from 'react';
import { RawfLogo } from './RawfLogo';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (p: string) => {
    onNavigate(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#0a192f] text-white border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Organization Identity & Emblem (Matching Header Layout with Light Text) */}
          <div className="space-y-4">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-3 text-left cursor-pointer group notranslate"
              translate="no"
              aria-label="Raid Action Wing Foundation Homepage"
            >
              {/* Round Insignia Emblem */}
              <div className="h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center shrink-0">
                <RawfLogo className="w-full h-full object-contain drop-shadow-xs group-hover:scale-105 transition-transform duration-200" />
              </div>

              {/* Official Typography Header in Crisp Light Text */}
              <div className="flex flex-col justify-center text-left">
                <span className="font-headline font-black text-base sm:text-lg lg:text-xl text-white tracking-tight leading-none group-hover:text-blue-300 transition-colors">
                  RAID ACTING WING (F)
                </span>
                <span className="font-id-hindi font-bold text-xs sm:text-sm text-red-400 tracking-normal leading-tight mt-1">
                  छापा कार्यवाही विभाग (एफ)
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-300 tracking-widest uppercase leading-tight mt-0.5">
                  GOVERNMENT OF INDIA
                </span>
              </div>
            </button>

            <p className="text-xs text-slate-300 leading-relaxed">
              A Name of Crime & Corruption Free Killer Team — Citizen Vigilance & Human Rights. Committed to supreme legal accountability and unyielding civic oversight across India.
            </p>

            <div className="flex flex-wrap gap-2 pt-1 notranslate" translate="no">
              <span className="px-2 py-0.5 bg-blue-950 text-blue-200 border border-blue-800 text-[10px] font-mono rounded">
                DARPAN: DL/2021/RAWF
              </span>
              <span className="px-2 py-0.5 bg-blue-950 text-blue-200 border border-blue-800 text-[10px] font-mono rounded">
                MSME UDYAM CERTIFIED
              </span>
              <span className="px-2 py-0.5 bg-blue-950 text-amber-300 border border-blue-800 text-[10px] font-mono rounded font-bold">
                IFA 760 CHARTER
              </span>
            </div>
          </div>

          {/* Col 2: Core Services & Wings */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 block font-headline">
              Core Navigation
            </span>
            <div className="flex flex-col space-y-2 text-xs text-slate-300">
              <button onClick={() => handleNav('about')} aria-label="About RAWF Mandate" className="hover:text-white transition-colors text-left cursor-pointer">
                About RAWF Mandate
              </button>
              <button onClick={() => handleNav('services')} aria-label="Our Services & Wings" className="hover:text-white transition-colors text-left cursor-pointer">
                Our Services & Wings
              </button>
              <button onClick={() => handleNav('projects')} aria-label="Our 20 National Projects" className="hover:text-white transition-colors text-left cursor-pointer">
                Our 20 National Projects
              </button>
              <button onClick={() => handleNav('departments')} aria-label="22 Specialized Departments" className="hover:text-white transition-colors text-left cursor-pointer">
                22 Specialized Departments
              </button>
              <button onClick={() => handleNav('apply-online')} aria-label="Member Apply & Volunteer Intake" className="hover:text-white transition-colors text-left cursor-pointer">
                Member Apply / Volunteers
              </button>
              <button onClick={() => handleNav('id-download')} aria-label="ID Card Download Portal" className="hover:text-white transition-colors text-left cursor-pointer">
                ID Card Download Portal
              </button>
            </div>
          </div>

          {/* Col 3: Legal & Rights Hub */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 block font-headline">
              Legal & Rights Hub
            </span>
            <div className="flex flex-col space-y-2 text-xs text-slate-300">
              <button onClick={() => handleNav('rights')} aria-label="13 Citizen Rights Charters" className="hover:text-white transition-colors text-left cursor-pointer">
                13 Citizen Rights Charters
              </button>
              <button onClick={() => handleNav('indian-laws')} aria-label="Indian Laws and Police Rulings" className="hover:text-white transition-colors text-left cursor-pointer">
                Indian Laws & Police Rulings
              </button>
              <button onClick={() => handleNav('officers')} aria-label="Verified Officers Directory" className="hover:text-white transition-colors text-left cursor-pointer">
                Verified Officers Directory
              </button>
              <button onClick={() => handleNav('blacklisted-officers')} aria-label="Blacklisted Officers Register" className="hover:text-white transition-colors text-left cursor-pointer text-red-300">
                Blacklisted Officers Register
              </button>
              <button onClick={() => handleNav('grievance-cell')} aria-label="Public Grievance Cell" className="hover:text-white transition-colors text-left cursor-pointer">
                Public Grievance Cell
              </button>
              <button onClick={() => handleNav('activities')} aria-label="Our Ground Activities" className="hover:text-white transition-colors text-left cursor-pointer">
                Our Ground Activities
              </button>
            </div>
          </div>

          {/* Col 4: Contact & Grievance */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 block font-headline">
              Contact & Emergency
            </span>
            <div className="space-y-2 text-xs text-slate-300">
              <div>
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Dispatch Headquarters</span>
                <span className="text-white">National Action Command, New Delhi</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Official Inquiries</span>
                <span className="text-white font-mono">info@raidactionwing.in</span>
              </div>
              <div className="pt-2">
                <a
                  className="inline-block px-3 py-1.5 bg-red-600 text-white font-bold text-xs rounded hover:bg-red-700 transition-colors uppercase tracking-wider"
                  href="tel:18007292355"
                >
                  TOLL-FREE: 1800-RAW-CELL
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Legal disclaimer snippet */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-red-400 uppercase">Institutional Mandate & Non-Governmental Notice:</strong>{' '}
          Raid Action Wing Foundation (RAWF) operates as a civic vigilance and human rights defense trust registered under the Indian Trusts Act 1882 (IFA 760). RAWF is not an official executive police agency. All criminal telemetry and evidence dossiers are systematically submitted to state and federal law enforcement agencies for statutory prosecution.
        </div>

        {/* Bottom copyright & policy links */}
        <div className="mt-6 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>© 2026 Raid Action Wing Foundation (RAWF). All rights reserved.</span>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleNav('privacy')}
              aria-label="Read RAWF Privacy Policy & Whistleblower Protection Charter"
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleNav('contact')}
              aria-label="Navigate to National Contact Desk"
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact Desk
            </button>
            <button
              onClick={() => handleNav('admin')}
              aria-label="Director General Admin Command Console"
              className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
              <span>Admin Console</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
