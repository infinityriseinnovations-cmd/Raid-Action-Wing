import React from 'react';
import { RawfLogo } from '../components/RawfLogo';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Breadcrumb & Header Banner */}
      <div className="bg-[#0a192f] text-white py-12 px-4 lg:px-8 border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <button onClick={() => onNavigate('home')} className="hover:text-white cursor-pointer">
              Home
            </button>
            <span>/</span>
            <span className="text-red-400 font-bold">About Us</span>
          </div>
          <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight">
            About RAWF — Raid Action Wing Foundation
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
            A Name of Crime and Corruption Free Killer Team, operating across India with the support of dedicated officers and a formidable legal network.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-10">
        {/* Core Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Autonomous Citizen Vigilance & Fact-Finding Collective
            </div>

            <h2 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 leading-snug">
              Playing a Significant Role in the Service of Our Nation & Building a Crime-Free Society
            </h2>

            <p>
              Operating across India with the steadfast support of experienced field vigilance officers and a powerful legal advisory council, the <strong className="text-slate-900 font-bold">Raid Action Wing Foundation (RAWF)</strong> functions independently to make our society crime-free, secure, and legally accountable.
            </p>

            <p>
              We take urgent steps, conduct in-depth intelligence research, and undertake objective field investigations to curtail systemic corruption across public departments. RAWF continues to establish its institutional authority by uncovering irregularities, advising statutory oversight bodies, and educating citizens on their inalienable constitutional safeguards.
            </p>

            <p>
              RAWF collaborates with and assists local, national, and international law enforcement bodies in their constant battle to dismantle criminal syndicates, illicit smuggling rackets, organized commercial fraud, and administrative abuse.
            </p>

            {/* Core Objectives List */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
              <h3 className="font-headline font-bold text-lg text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600">target</span>
                Core Objectives of RAWF
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <span>Eradicating corruption and bribery in government administrative interfaces.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <span>Safeguarding whistleblowers and eyewitnesses with strict confidentiality.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <span>Providing pro-bono legal council and bail advocacy for marginalized citizens.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <span>Youth anti-narcotics intelligence and cross-border drug supply disruption.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <span>Protecting child and women victims of human trafficking and workplace harassment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <span>Promoting RTI literacy to hold public spending accountable to Indian taxpayers.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Institutional Registry Box */}
          <div className="lg:col-span-4 bg-white border-2 border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <RawfLogo className="w-11 h-11" />
              <div>
                <span className="font-headline font-bold text-sm text-slate-900 block">
                  RAWF Official Dossier
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  IFA 760 • ITA ACT 1882
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Legal Classification:</span>
                <span className="font-bold text-slate-900">Autonomous NPO Trust</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Trust Deed Number:</span>
                <span className="font-mono font-bold text-slate-900">IFA-760 / 1882</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">NITI Aayog Darpan:</span>
                <span className="font-mono font-bold text-slate-900">DL/2021/RAWF</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">MSME UDYAM Record:</span>
                <span className="font-mono font-bold text-slate-900">UDYAM-UP-50-0196301</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Jurisdiction:</span>
                <span className="font-bold text-slate-900">All 28 States & UTs of India</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Supreme Command:</span>
                <span className="font-bold text-slate-900">Director General & Commissioners</span>
              </div>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs space-y-1">
              <span className="font-bold text-red-700 block">Statutory Non-Govt Clarification:</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                RAWF operates as a citizen vigilance collective under the Indian Trusts Act 1882. We are not an official executive police force. All investigative dossiers are transmitted to official police authorities for formal prosecution.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('apply-online')}
                className="w-full py-2.5 bg-[#0d47a1] hover:bg-blue-900 text-white font-bold text-xs uppercase rounded transition-colors cursor-pointer"
              >
                Join Movement / Member Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
