import React from 'react';

export const PriorityChannels: React.FC = () => {
  return (
    <section className="w-full bg-white border-b border-slate-200 py-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 block">
              Instant Escalation Infrastructure
            </span>
            <h2 className="font-headline font-bold text-2xl lg:text-3xl text-slate-900 uppercase tracking-tight">
              Citizen Defense Priority Channels
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            Direct high-priority touchpoints established for emergency intervention, pro bono legal council consultation, and women & child protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Channel 01: 24/7 Emergency Live Dispatch */}
          <div className="bg-slate-50 hover:bg-white border-2 border-slate-200 hover:border-red-600 rounded-lg p-6 transition-all shadow-xs flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-headline text-3xl font-extrabold text-red-600">01</span>
                <span className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">phone_in_talk</span>
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">
                  Encrypted Hotline
                </span>
                <h3 className="font-headline text-lg font-bold text-slate-900 mt-0.5">
                  24/7 Live Emergency Dispatch
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Direct connection with active duty duty-officers. Rapid crisis intake for active fraud, public extortion, and illegal confinement instances.
              </p>
            </div>
            <div className="pt-5 border-t border-slate-200 mt-4 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                9 Dispatchers Active
              </span>
              <a
                href="tel:18007292355"
                className="text-red-600 font-bold uppercase hover:underline flex items-center gap-1"
              >
                1800-RAW-CELL <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>
          </div>

          {/* Channel 02: Legal & Vigilance Council */}
          <div className="bg-slate-50 hover:bg-white border-2 border-slate-200 hover:border-[#0d47a1] rounded-lg p-6 transition-all shadow-xs flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-headline text-3xl font-extrabold text-[#0d47a1]">02</span>
                <span className="w-10 h-10 rounded-full bg-blue-100 text-[#0d47a1] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">gavel</span>
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#0d47a1] uppercase tracking-wider block">
                  Judicial Advisory
                </span>
                <h3 className="font-headline text-lg font-bold text-slate-900 mt-0.5">
                  Legal & Vigilance Council
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Consult senior advocates, retired judicial officers, and anti-corruption analysts regarding civil harassment, anticipatory bail, and administrative misconduct.
              </p>
            </div>
            <div className="pt-5 border-t border-slate-200 mt-4 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Chief Advisor Desk</span>
              <a
                href="#officers"
                className="text-[#0d47a1] font-bold uppercase hover:underline flex items-center gap-1"
              >
                Schedule Review <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>
          </div>

          {/* Channel 03: Child & Women Safety Desk */}
          <div className="bg-slate-50 hover:bg-white border-2 border-slate-200 hover:border-red-600 rounded-lg p-6 transition-all shadow-xs flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-headline text-3xl font-extrabold text-red-600">03</span>
                <span className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">family_restroom</span>
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">
                  POCSO & Women Wing
                </span>
                <h3 className="font-headline text-lg font-bold text-slate-900 mt-0.5">
                  Child & Women Safety Desk
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Specialized confidential hotline combating child abuse, POCSO violations, domestic harassment, human trafficking rings, and forced labor networks.
              </p>
            </div>
            <div className="pt-5 border-t border-slate-200 mt-4 flex items-center justify-between text-xs">
              <span className="text-red-600 font-bold uppercase bg-red-50 px-2 py-0.5 rounded">
                Tier-1 Alert Desk
              </span>
              <a
                href="#report-tip-anchor"
                className="text-red-600 font-bold uppercase hover:underline flex items-center gap-1"
              >
                Trigger Desk <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
