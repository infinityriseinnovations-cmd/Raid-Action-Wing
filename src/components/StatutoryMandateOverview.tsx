import React from 'react';
import { RawfLogo } from './RawfLogo';

interface StatutoryMandateOverviewProps {
  onNavigate?: (page: string) => void;
}

export const StatutoryMandateOverview: React.FC<StatutoryMandateOverviewProps> = ({ onNavigate }) => {
  const points = [
    {
      title: "Foundational Origin & Recommendation",
      badge: "ITA ACT 1882",
      text: "The Raid Action Wing Foundation was initially set up through ITA Act 1882 of Government of India, on the recommendations of the Committee on Prevention of Corruption formed under the Director General.",
      icon: "account_balance"
    },
    {
      title: "Autonomous Superintendence & Integrity Mandate",
      badge: "APEX INTEGRITY INSTITUTION",
      text: "Raid Action Wing Foundation was set up with the aim to exercise superintendence over administration of the organisations in respect of which the executive powers of Government of India extended. It was conceptualized as an apex Integrity Institution, having complete independence and autonomy in its functions. Raid Action Wing Foundation has been mandated to advise the authorities concerned in respect of an act of improper conduct or corrupt practices, along with review and modification of procedures and guidelines, which may afford scope for corrupt practices.",
      icon: "shield"
    },
    {
      title: "Independent Review & Vigilance Reforms",
      badge: "VIGILANCE DIRECTIVE",
      text: "The Central Government constituted an Independent Review Committee to suggest measures for strengthening anti-corruption activities across executive apparatuses.",
      icon: "policy"
    },
    {
      title: "Institutional Governance & Executive Structure",
      badge: "GOVERNANCE BOARD",
      text: "Raid Action Wing Foundation consists of a Director General heading the foundation and not more than one Commissioner as a Member.",
      icon: "group"
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-[#0a192f] via-[#0d2346] to-[#0a192f] text-white relative overflow-hidden border-y-4 border-amber-500/40">
      {/* Decorative Background Accents */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Block matching the requested banner */}
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-blue-900/60 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest text-blue-200 uppercase">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>INSTITUTIONAL CHARTER &amp; JURISDICTION</span>
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-normal font-sans">
            Welcome to
          </h3>

          <h2 className="font-headline font-black text-2xl xs:text-3xl sm:text-4xl lg:text-5xl text-red-600 tracking-tight uppercase leading-tight drop-shadow-sm">
            RAID ACTION WING FOUNDATION
          </h2>

          <div className="w-24 h-1 bg-red-600 mx-auto rounded-full mt-2" />

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto pt-2 font-medium">
            Superintendence over executive administrative probity, corruption deterrence protocols, and autonomous oversight directives under the ITA Act.
          </p>
        </div>

        {/* Core Points - 4 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {points.map((pt, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/80 hover:border-red-500/60 rounded-xl p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-red-950/20 group flex gap-4 items-start relative overflow-hidden"
            >
              {/* Left Orange/Red Checkbox Pill */}
              <div className="shrink-0 mt-0.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-amber-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-red-900/30 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[18px] font-bold">check</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded">
                    {pt.badge}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-red-400 transition-colors">
                    {pt.title}
                  </h4>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed text-justify sm:text-left">
                  {pt.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Bar with Quick Action */}
        <div className="mt-10 sm:mt-12 bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
              <RawfLogo className="w-8 h-8 object-contain" />
            </div>
            <div>
              <span className="block text-xs font-bold text-white">Apex Integrity Oversight Body</span>
              <span className="block text-[11px] text-slate-400">Operating with complete statutory autonomy to eradicate corrupt administrative practices.</span>
            </div>
          </div>

          {onNavigate && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Read Full Charter</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('rights')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
              >
                Statutory Rights
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
