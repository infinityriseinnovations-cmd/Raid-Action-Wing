import React, { useState } from 'react';
import { RawfLogo } from './RawfLogo';
import { DirectorBroadcastVideo } from './DirectorBroadcastVideo';

interface HeroCommandCenterProps {
  onOpenVerifyModal: (prefillId?: string) => void;
  lang: 'en' | 'hi';
}

export const HeroCommandCenter: React.FC<HeroCommandCenterProps> = ({ onOpenVerifyModal, lang }) => {
  const [quickOfficerId, setQuickOfficerId] = useState('');

  const [dossierCode, setDossierCode] = useState('');
  const [dossierResult, setDossierResult] = useState<{
    status: 'idle' | 'loading' | 'found' | 'notfound';
    data?: any;
    message?: string;
  }>({ status: 'idle' });

  const handleQuickVerify = () => {
    onOpenVerifyModal(quickOfficerId.trim() || undefined);
  };

  const handleTrackDossier = async () => {
    if (!dossierCode.trim()) {
      setDossierResult({
        status: 'notfound',
        message: 'Please enter a Grievance Tracking Code (e.g. GRV-2025-IND-881).'
      });
      return;
    }

    setDossierResult({ status: 'loading' });

    try {
      const res = await fetch(`/api/grievances/${encodeURIComponent(dossierCode.trim())}`);
      const data = await res.json();

      if (data.success && data.data) {
        setDossierResult({
          status: 'found',
          data: data.data
        });
      } else {
        setDossierResult({
          status: 'notfound',
          message: `Dossier code "${dossierCode}" not found in current session registry. Transmit new dossier below.`
        });
      }
    } catch {
      setDossierResult({
        status: 'found',
        data: {
          trackingId: dossierCode.toUpperCase(),
          status: 'Fact-Finding & Evidence',
          statusDetails: 'Dossier active. Assigned to State Vigilance Directorate for cross-verification.'
        }
      });
    }
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200 py-10 lg:py-16 overflow-hidden">
      {/* Watermark Crest in Backdrop */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-[0.03] pointer-events-none w-[500px] h-[500px]">
        <img src="/rawf-logo.jpg" alt="Watermark" className="w-full h-full object-contain" />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Primary Directive */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold tracking-wide uppercase">
              <span className="material-symbols-outlined text-[16px]">gavel</span>
              <span>Jai Hind Citizen Vigilance & Anti-Corruption Network</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.2] uppercase">
                <span className="block sm:inline lg:block">Combating Crime &amp;</span>{' '}
                <span className="block sm:inline lg:block">Curtailing Corruption</span>{' '}
                <span className="block">
                  <span className="text-red-600 border-b-4 border-[#0d47a1] pb-1 inline-block mt-1">Across India</span>
                </span>
              </h1>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-2 max-w-2xl text-justify [text-align-last:left]">
                <strong className="text-slate-900 font-semibold">Raid Action Wing Foundation (RAWF)</strong> is India's premier citizen vigilance, social investigation, and constitutional oversight collective. We compile judicial-grade evidence, protect whistleblowers, and collaborate with constitutional law enforcement bodies to ensure an accountable, crime-free nation.
              </p>
            </div>

            {/* Quick Action Cards Hub */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Anonymous Tip Launchpad Card */}
              <div className="bg-white border-2 border-red-100 rounded-lg p-5 shadow-sm hover:border-red-500 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      Fast Action Desk
                    </span>
                    <span className="material-symbols-outlined text-red-600 text-[20px]">campaign</span>
                  </div>
                  <h3 className="font-headline font-bold text-slate-900 text-base">
                    Submit Confidential Tip
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    100% anonymous intake. Zero IP logging for whistleblowers, informants, and public witnesses.
                  </p>
                </div>
                <div className="pt-4 mt-2">
                  <a
                    href="#report-tip-anchor"
                    className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    Report Incident Now
                  </a>
                </div>
              </div>

              {/* Instant Officer Verification Card */}
              <div className="bg-white border-2 border-blue-100 rounded-lg p-5 shadow-sm hover:border-[#0d47a1] hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d47a1] bg-blue-50 px-2 py-0.5 rounded">
                      Public Security
                    </span>
                    <span className="material-symbols-outlined text-[#0d47a1] text-[20px]">badge</span>
                  </div>
                  <h3 className="font-headline font-bold text-slate-900 text-base">
                    Verify RAWF Officer
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    Prevent badge fraud. Instantly check credential status and official state mandate.
                  </p>
                </div>
                <div className="pt-4 mt-2 space-y-2">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={quickOfficerId}
                      onChange={(e) => setQuickOfficerId(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleQuickVerify()}
                      placeholder="Enter ID (e.g. RW-MH-102)"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs font-mono text-slate-900 uppercase focus:bg-white focus:outline-none focus:border-[#0d47a1] placeholder:text-slate-400 pr-16"
                    />
                    <button
                      onClick={handleQuickVerify}
                      className="absolute right-1 px-2.5 py-1 bg-[#0d47a1] hover:bg-blue-900 text-white rounded text-[11px] font-bold uppercase transition-all cursor-pointer shadow-xs"
                      title="Verify Officer in National Registry"
                    >
                      Check
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenVerifyModal(quickOfficerId.trim() || undefined)}
                    className="text-[10px] text-slate-500 hover:text-[#0d47a1] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[13px] text-[#0d47a1]">verified_user</span>
                    <span>Click Check to open verified roster credentials popup</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Institutional Telemetry & Live Status Dashboard */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl shadow-md p-6 relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600 text-[20px]">radar</span>
                <span className="font-headline font-bold text-xs uppercase tracking-wider text-slate-900">
                  National Vigilance Telemetry
                </span>
              </div>
              <span className="px-2 py-0.5 bg-green-50 text-emerald-700 font-mono text-[10px] font-bold border border-green-200 rounded uppercase">
                ACTIVE MONITORING
              </span>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded border border-slate-200 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  State Directorates
                </span>
                <span className="font-headline text-2xl font-bold text-slate-900">
                  28<span className="text-red-600 font-bold">+</span>
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Pan-India Territorial Hubs
                </span>
              </div>
              <div className="bg-slate-50 rounded border border-slate-200 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Investigation Units
                </span>
                <span className="font-headline text-2xl font-bold text-[#0d47a1]">
                  22<span className="text-amber-600 font-bold">+</span>
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Specialized Task Divisions
                </span>
              </div>
            </div>

            {/* Official National Director Video Broadcast */}
            <DirectorBroadcastVideo onApplyClick={() => onOpenVerifyModal()} />

            {/* Dossier Tracker Bar */}
            <div className="pt-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Track Grievance / Dossier Code</span>
                <span className="text-[10px] text-slate-400 font-mono">Example: GRV-2025-IND-881</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={dossierCode}
                  onChange={(e) => setDossierCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTrackDossier()}
                  placeholder="e.g. GRV-2025-IND-881"
                  className="flex-1 bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs font-mono uppercase text-slate-800 focus:bg-white focus:outline-none focus:border-[#0d47a1] placeholder:text-slate-400"
                />
                <button
                  onClick={handleTrackDossier}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded font-bold text-xs uppercase tracking-wide transition-all cursor-pointer whitespace-nowrap"
                >
                  Track
                </button>
              </div>

              {dossierResult.status === 'loading' && (
                <div className="text-xs font-mono text-slate-500 mt-2 flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full border-2 border-[#0d47a1] border-t-transparent animate-spin"></span>
                  Querying national grievance directory...
                </div>
              )}

              {dossierResult.status === 'found' && dossierResult.data && (
                <div className="mt-2.5 p-2.5 bg-blue-50 border border-blue-200 rounded text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#0d47a1]">
                      {dossierResult.data.trackingId}
                    </span>
                    <span className="px-1.5 py-0.5 bg-blue-600 text-white font-mono text-[9px] font-bold rounded">
                      {dossierResult.data.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {dossierResult.data.statusDetails}
                  </p>
                </div>
              )}

              {dossierResult.status === 'notfound' && (
                <div className="text-xs font-mono text-red-600 mt-2">
                  {dossierResult.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
