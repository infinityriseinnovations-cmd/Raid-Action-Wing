import React from 'react';

export const StatutoryDisclaimer: React.FC = () => {
  return (
    <section className="w-full bg-slate-100 py-10 px-4 lg:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Statutory Disclaimer Callout */}
        <div className="bg-white border-l-4 border-red-600 p-5 rounded-r-lg shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px]">info</span>
            <span>Official Statutory & Non-Governmental Notice</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900">Raid Action Wing Foundation (RAW Foundation)</strong> is registered under{' '}
            <strong>IFA Number 760</strong> as an autonomous Non-Profit Organization operating as a Criminal Information & Citizen Vigilance Provider agency under the Indian Trusts Act 1882. We are not an official executive police agency or judicial court. We maintain no constitutional tie-up or executive subordination with Central/State Governments, CBI, State Police, or MHA. Our primary mandate is independent fact-finding, legal advisory, human rights education, and transmitting actionable public interest crime information to authorized statutory law enforcement authorities for formal prosecution.
          </p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded p-3 flex items-center gap-3 shadow-2xs">
            <span className="material-symbols-outlined text-amber-600 text-[24px]">verified</span>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">REGISTRATION NO</span>
              <span className="text-xs font-bold text-slate-900 font-mono">IFA NO. 760</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded p-3 flex items-center gap-3 shadow-2xs">
            <span className="material-symbols-outlined text-[#0d47a1] text-[24px]">military_tech</span>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">MSME UDYAM</span>
              <span className="text-xs font-bold text-slate-900 font-mono">UP-50-0196301</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded p-3 flex items-center gap-3 shadow-2xs">
            <span className="material-symbols-outlined text-emerald-600 text-[24px]">policy</span>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">NITI AAYOG DARPAN</span>
              <span className="text-xs font-bold text-slate-900 font-mono">DL/2021/RAWF</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded p-3 flex items-center gap-3 shadow-2xs">
            <span className="material-symbols-outlined text-red-600 text-[24px]">assured_workload</span>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">STATUTORY BASE</span>
              <span className="text-xs font-bold text-slate-900 font-mono">ITA ACT 1882</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
