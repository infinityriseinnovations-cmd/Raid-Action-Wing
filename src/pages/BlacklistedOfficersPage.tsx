import React from 'react';
import { BLACKLISTED_OFFICERS } from '../data/siteData';

interface BlacklistedOfficersPageProps {
  onNavigate: (page: string) => void;
  onOpenVerifyModal: (code?: string) => void;
}

export const BlacklistedOfficersPage: React.FC<BlacklistedOfficersPageProps> = ({
  onNavigate,
  onOpenVerifyModal
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <div className="bg-[#0a192f] text-white py-12 px-4 lg:px-8 border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <button onClick={() => onNavigate('home')} className="hover:text-white cursor-pointer">
              Home
            </button>
            <span>/</span>
            <button onClick={() => onNavigate('officers')} className="hover:text-white cursor-pointer">
              Our Officers
            </button>
            <span>/</span>
            <span className="text-red-400 font-bold">Blacklisted Officers</span>
          </div>
          <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight">
            Blacklisted & Revoked Credentials Register
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
            Public advisory regarding terminated badges, revoked appointments, and anti-fraud protocols.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        {/* Warning Callout Box */}
        <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-red-700 font-headline font-bold text-base uppercase">
            <span className="material-symbols-outlined text-2xl">gpp_bad</span>
            <span>CRITICAL STATUTORY NOTICE REGARDING BADGE FRAUD</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            RAWF is registered under the Indian Trusts Act 1882 (IFA No. 760) as a citizen vigilance collective. <strong>We are NOT an official executive police agency</strong>. No officer or member is authorized to carry out house raids, demand bribes, conduct commercial searches, or intimidate citizens. Posing as a public servant or vigilance officer without charter clearance is a cognizable, non-bailable offense under Section 204 of the Bharatiya Nyaya Sanhita (BNS).
          </p>
          <div className="text-xs text-red-800 font-bold flex items-center gap-2">
            <span>If anyone listed below approaches you, immediately dial 112 (Police) or RAWF Command:</span>
            <a href="tel:18007292355" className="underline font-mono">1800-RAW-CELL</a>
          </div>
        </div>

        {/* Blacklisted Officers Table */}
        <div className="bg-white border-2 border-red-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <span className="font-headline font-bold text-sm uppercase flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500 text-[20px]">block</span>
              Revoked Identification Registry
            </span>
            <span className="text-xs font-mono text-red-400 font-bold">
              UPDATED: 2026 ACTIVE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                  <th className="p-3.5">Revoked Badge ID</th>
                  <th className="p-3.5">Individual Name</th>
                  <th className="p-3.5">Jurisdiction</th>
                  <th className="p-3.5">Revocation Date</th>
                  <th className="p-3.5">Reason for Blacklisting</th>
                  <th className="p-3.5">Action Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {BLACKLISTED_OFFICERS.map((officer) => (
                  <tr key={officer.id} className="hover:bg-red-50/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-red-600">
                      {officer.badgeNumber}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      {officer.name}
                    </td>
                    <td className="p-3.5 text-slate-600">
                      {officer.jurisdiction}
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">
                      {officer.revocationDate}
                    </td>
                    <td className="p-3.5 text-slate-600 max-w-xs leading-normal">
                      {officer.reason}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-1 bg-red-100 text-red-700 font-mono text-[10px] font-bold rounded uppercase">
                        {officer.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Check Callout */}
        <div className="bg-slate-50 border-2 border-blue-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-headline font-bold text-slate-900 text-base">
              Need to check an unlisted badge or officer ID?
            </h4>
            <p className="text-xs text-slate-600">
              Instantly run the ID code through the centralized National Directorate Command roster.
            </p>
          </div>
          <button
            onClick={() => onOpenVerifyModal()}
            className="px-5 py-2.5 bg-[#0d47a1] hover:bg-blue-900 text-white font-bold text-xs uppercase rounded transition-all shrink-0 cursor-pointer"
          >
            Verify Officer Code Now
          </button>
        </div>
      </div>
    </div>
  );
};
