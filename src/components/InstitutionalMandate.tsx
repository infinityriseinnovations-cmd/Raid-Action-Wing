import React from 'react';
import { RawfLogo } from './RawfLogo';

export const InstitutionalMandate: React.FC = () => {
  return (
    <section className="w-full bg-slate-50 py-14 px-4 lg:px-8 border-b border-slate-200" id="about">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Details */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-widest">
              <span className="w-4 h-0.5 bg-red-600"></span>
              <span>Institutional Mandate & Origin</span>
            </div>

            <h2 className="font-headline font-bold text-2xl sm:text-3xl lg:text-4xl text-slate-900 uppercase tracking-tight">
              A Name of Crime & Corruption Free <br />
              <span className="text-red-600">Killer Team</span>
            </h2>

            <div className="space-y-3.5 text-sm sm:text-base text-slate-700 leading-relaxed">
              <p>
                Operating across India with the unwavering backing of dedicated field officers and a formidable legal team, the{' '}
                <strong className="text-slate-900 font-semibold">Raid Action Wing Foundation (RAWF)</strong> functions independently to make our society crime-free, secure, and legally accountable.
              </p>
              <p>
                We undertake urgent steps, rigorous intelligence research, and social field investigations to curtail corruption across government departments. RAWF continues to establish its institutional authority by uncovering systemic irregularities, advising oversight bodies, and educating citizens on their constitutional rights.
              </p>
              <p>
                We collaborate with and assist local, national, and international law enforcement agencies in their constant battle to dismantle criminal syndicates, illicit smuggling rackets, organized syndicates, and administrative abuse.
              </p>
            </div>

            {/* Two Sub-mandate cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                <div className="flex items-center gap-2 text-red-600 font-bold text-sm mb-1.5">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>ITA Act 1882 Charter</span>
                </div>
                <p className="text-xs text-slate-600 leading-normal">
                  Constituted on recommendations of the Committee on Prevention of Corruption under Director General mandate.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                <div className="flex items-center gap-2 text-[#0d47a1] font-bold text-sm mb-1.5">
                  <span className="material-symbols-outlined text-[18px]">balance</span>
                  <span>RAWF Integrity Advisory</span>
                </div>
                <p className="text-xs text-slate-600 leading-normal">
                  Empowered to advise statutory bodies on improper conduct, procedural review, and closing corruption loopholes.
                </p>
              </div>
            </div>
          </div>

          {/* Right Dossier & Crest Box */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <RawfLogo className="w-8 h-8" />
                <span className="text-xs font-bold font-headline uppercase tracking-wider text-slate-900">
                  Registration Dossier
                </span>
              </div>
              <span className="px-2 py-0.5 bg-blue-50 text-[#0d47a1] border border-blue-200 font-mono text-[10px] font-bold rounded uppercase">
                NPO IFA 760
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Trust Registration:</span>
                <span className="font-mono font-bold text-slate-900">IFA-760 / 1882</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">MSME UDYAM Record:</span>
                <span className="font-mono font-bold text-slate-900">UDYAM-UP-50-0196301</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">NITI Aayog Darpan:</span>
                <span className="font-mono font-bold text-slate-900">DL/2021/RAWF</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Command Structure:</span>
                <span className="font-semibold text-slate-800">Director General & Commissioners</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Territorial Jurisdiction:</span>
                <span className="font-semibold text-slate-800">Pan-India (All 28 States & UTs)</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="relative rounded-lg overflow-hidden border border-slate-200 shadow-2xs">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7D1Cv8Zz5hHkHWRsC2dBpAnYUkZ0ZCtxYoBPJYBBLwhi71gukNqmUaq1S7ds7-rpnQy9dgKR1hFGJCvg6fdzR0QNDcs1uncde15aH1Cj_ovJ49wdbEnyi3HcgYt1DebTQ0dmp7nUxPXX0IuIC0B3gzWoAkWgk8l0YIc9eLsbfB7lOIuzdvNL7lz5_EFlnw_PjTKNYWFcNsU5OnVumga3256O6DHiOZwcVeUFcPhTvMLAcYBENLi3UaA"
                  alt="Citizen Anti-Narcotics Awareness Rally"
                  className="w-full h-44 object-cover object-center"
                />
              </div>
              <span className="text-[11px] font-mono text-slate-500 block mt-2 tracking-wide">
                Field Operation Brief: Citizen Anti-Narcotics Awareness Rally & Ground Mobilization
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
