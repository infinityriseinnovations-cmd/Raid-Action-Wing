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
          {/* Col 1: Organization Identity & Emblem */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <RawfLogo className="w-10 h-10 bg-white" />
              <div>
                <span className="font-headline font-bold text-base uppercase text-white block leading-tight">
                  RAWF India
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  IFA 760 • ITA ACT 1882
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              A Name of Crime & Corruption Free Killer Team — Citizen Vigilance & Human Rights. Committed to supreme legal accountability and unyielding civic oversight across India.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2 py-0.5 bg-blue-950 text-blue-200 border border-blue-800 text-[10px] font-mono rounded">
                DARPAN: DL/2021/RAWF
              </span>
              <span className="px-2 py-0.5 bg-blue-950 text-blue-200 border border-blue-800 text-[10px] font-mono rounded">
                MSME UDYAM CERTIFIED
              </span>
            </div>
          </div>

          {/* Col 2: Core Services & Wings */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 block font-headline">
              Core Navigation
            </span>
            <div className="flex flex-col space-y-2 text-xs text-slate-300">
              <button onClick={() => handleNav('about')} className="hover:text-white transition-colors text-left cursor-pointer">
                About RAWF Mandate
              </button>
              <button onClick={() => handleNav('services')} className="hover:text-white transition-colors text-left cursor-pointer">
                Our Services & Wings
              </button>
              <button onClick={() => handleNav('projects')} className="hover:text-white transition-colors text-left cursor-pointer">
                Our 20 National Projects
              </button>
              <button onClick={() => handleNav('departments')} className="hover:text-white transition-colors text-left cursor-pointer">
                22 Specialized Departments
              </button>
              <button onClick={() => handleNav('apply-online')} className="hover:text-white transition-colors text-left cursor-pointer">
                Member Apply / Volunteers
              </button>
              <button onClick={() => handleNav('id-download')} className="hover:text-white transition-colors text-left cursor-pointer">
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
              <button onClick={() => handleNav('rights')} className="hover:text-white transition-colors text-left cursor-pointer">
                13 Citizen Rights Charters
              </button>
              <button onClick={() => handleNav('indian-laws')} className="hover:text-white transition-colors text-left cursor-pointer">
                Indian Laws & Police Rulings
              </button>
              <button onClick={() => handleNav('officers')} className="hover:text-white transition-colors text-left cursor-pointer">
                Verified Officers Directory
              </button>
              <button onClick={() => handleNav('blacklisted-officers')} className="hover:text-white transition-colors text-left cursor-pointer text-red-300">
                Blacklisted Officers Register
              </button>
              <button onClick={() => handleNav('grievance-cell')} className="hover:text-white transition-colors text-left cursor-pointer">
                Public Grievance Cell
              </button>
              <button onClick={() => handleNav('activities')} className="hover:text-white transition-colors text-left cursor-pointer">
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
          Raid Action Wing Foundation (RAWF) operates as an autonomous civic vigilance and human rights defense trust registered under the Indian Trusts Act 1882 (IFA 760). RAWF is not an official executive police agency. All criminal telemetry and evidence dossiers are systematically submitted to state and federal law enforcement agencies for statutory prosecution.
        </div>

        {/* Bottom copyright & policy links */}
        <div className="mt-6 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>© 2026 Raid Action Wing Foundation (RAWF). All rights reserved.</span>
          <div className="flex items-center space-x-4">
            <button onClick={() => handleNav('privacy')} className="hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors cursor-pointer">
              Contact Desk
            </button>
            <button onClick={() => handleNav('admin')} className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
              <span>Admin Console</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
