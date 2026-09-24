import React from 'react';
import { MembershipApplySection } from '../components/MembershipApplySection';

interface ApplyOnlinePageProps {
  onNavigate: (page: string) => void;
}

export const ApplyOnlinePage: React.FC<ApplyOnlinePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-[#0a192f] text-white py-12 px-4 lg:px-8 border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <button onClick={() => onNavigate('home')} className="hover:text-white cursor-pointer">
              Home
            </button>
            <span>/</span>
            <span className="text-red-400 font-bold">Apply Online</span>
          </div>
          <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight">
            Accredited Membership & Volunteer Intake
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
            Join the Raid Action Wing Foundation under IFA 760 Charter as a Civil Vigilance Officer (CVO), Legal Aid Volunteer, Cyber Crime Investigator, or Youth Ambassador.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <MembershipApplySection />
      </div>
    </div>
  );
};
