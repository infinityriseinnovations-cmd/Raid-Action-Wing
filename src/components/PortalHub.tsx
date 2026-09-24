import React from 'react';

export const PortalHub: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-slate-50 via-white to-slate-50 py-14 px-4 lg:px-8 border-b border-slate-200" id="portal-hub">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-600 mb-1">
              <span className="w-4 h-0.5 bg-red-600"></span>
              <span>Interactive Citizen Gateways</span>
            </div>
            <h2 className="font-headline font-bold text-2xl lg:text-3xl text-slate-900 uppercase tracking-tight">
              Civic Action, Membership & Support Hub
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            Direct public gateways to volunteer in constitutional oversight, retrieve cryptographic credentials, attend grassroots rallies, and power pro-bono defense.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Member Apply */}
          <div className="bg-white border-2 border-slate-200 hover:border-red-600 rounded-xl p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div>
                <span className="px-2.5 py-0.5 bg-red-50 text-red-600 font-mono text-[10px] font-bold uppercase rounded border border-red-200 inline-block">
                  Open Enrollment
                </span>
                <div className="w-11 h-11 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mt-3 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">person_add</span>
                </div>
              </div>
              <div>
                <h3 className="font-headline font-bold text-slate-900 text-base group-hover:text-red-600 transition-colors">
                  Member Apply / Join Movement
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Become an accredited civil vigilance officer, legal advocacy volunteer, or student ambassador upholding constitutional integrity.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100">
              <a
                href="#membership-apply"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs"
              >
                <span>Apply for Membership</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
          </div>

          {/* Card 2: Download ID Card */}
          <div className="bg-white border-2 border-slate-200 hover:border-[#0d47a1] rounded-xl p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div>
                <span className="px-2.5 py-0.5 bg-blue-50 text-[#0d47a1] font-mono text-[10px] font-bold uppercase rounded border border-blue-200 inline-block">
                  Encrypted Clearance
                </span>
                <div className="w-11 h-11 rounded-lg bg-blue-50 text-[#0d47a1] flex items-center justify-center mt-3 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">badge</span>
                </div>
              </div>
              <div>
                <h3 className="font-headline font-bold text-slate-900 text-base group-hover:text-[#0d47a1] transition-colors">
                  Download Official ID Card
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Verify credentials and generate secure, 256-bit encrypted official digital identity cards featuring tamper-proof QR verification.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100">
              <a
                href="#id-download"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded bg-[#0d47a1] hover:bg-blue-900 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs"
              >
                <span>Download ID Card</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
          </div>

          {/* Card 3: Upcoming Events */}
          <div className="bg-white border-2 border-slate-200 hover:border-slate-800 rounded-xl p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div>
                <span className="px-2.5 py-0.5 bg-green-50 text-emerald-700 font-mono text-[10px] font-bold uppercase rounded border border-green-200 inline-block">
                  Live Schedule
                </span>
                <div className="w-11 h-11 rounded-lg bg-green-50 text-emerald-700 flex items-center justify-center mt-3 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">event_available</span>
                </div>
              </div>
              <div>
                <h3 className="font-headline font-bold text-slate-900 text-base group-hover:text-slate-900 transition-colors">
                  Upcoming Events & Briefings
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Join state whistleblower conferences, free legal empowerment camps, and youth anti-narcotics ground briefings.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100">
              <a
                href="#events"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs"
              >
                <span>View Events Calendar</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
          </div>

          {/* Card 4: Support & Donate */}
          <div className="bg-white border-2 border-slate-200 hover:border-amber-600 rounded-xl p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div>
                <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 font-mono text-[10px] font-bold uppercase rounded border border-amber-200 inline-block">
                  Tax Exempt 80G
                </span>
                <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mt-3 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">volunteer_activism</span>
                </div>
              </div>
              <div>
                <h3 className="font-headline font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
                  Support & Donate
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Directly fund legal defense for marginalized citizens, investigation logistics, and grassroots anti-corruption operations.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100">
              <a
                href="#donate"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs"
              >
                <span>Donate to Cause</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
