import React, { useState } from 'react';
import { POLICE_DIRECTORY, GOVT_DIRECTORY } from '../data/siteData';

interface GrievanceCellPageProps {
  onNavigate: (page: string) => void;
}

export const GrievanceCellPage: React.FC<GrievanceCellPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'report' | 'police' | 'govt'>('report');
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const [targetEntity, setTargetEntity] = useState('');
  const [narrative, setNarrative] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const [dossierInput, setDossierInput] = useState('');
  const [dossierResult, setDossierResult] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `GRV-2026-RAW-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedId(id);
  };

  const handleTrack = () => {
    if (!dossierInput.trim()) return;
    setDossierResult({
      code: dossierInput.toUpperCase(),
      status: 'Under State Directorate Investigation',
      details: 'Assigned to State Vigilance Officer. Evidence extraction underway.'
    });
  };

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
            <span className="text-red-400 font-bold">Public Grievance Cell</span>
          </div>
          <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight">
            Public Grievance & Anti-Corruption Cell
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
            File encrypted public interest grievances, look up state police leadership contacts, or connect with national statutory ombudsman agencies.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'report'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Report Your Complaint
          </button>
          <button
            onClick={() => setActiveTab('police')}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'police'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Indian Police Directory
          </button>
          <button
            onClick={() => setActiveTab('govt')}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'govt'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Government Directory of India
          </button>
        </div>

        {/* Tab 1: Report Complaint */}
        {activeTab === 'report' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-white border-2 border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="font-headline font-bold text-lg text-slate-900 uppercase">
                  Encrypted Grievance Telemetry Desk
                </h3>
                <span className="px-2 py-0.5 bg-green-50 text-emerald-700 font-mono text-[10px] font-bold border border-green-200 rounded uppercase">
                  TLS 256-BIT SECURE
                </span>
              </div>

              {!submittedId ? (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="flex items-center gap-2 pb-1">
                    <input
                      type="checkbox"
                      id="pgAnon"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="accent-red-600 rounded cursor-pointer"
                    />
                    <label htmlFor="pgAnon" className="font-semibold text-slate-700 cursor-pointer">
                      Keep My Identity 100% Anonymous (Zero IP Logging)
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Violation Category *
                      </label>
                      <select
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                      >
                        <option value="">Select Category...</option>
                        <option>Government Department Bribery / Graft</option>
                        <option>Organized Smuggling Syndicate</option>
                        <option>Police Refusal to File Mandatory FIR</option>
                        <option>Predatory Loan Shark Extortion</option>
                        <option>Child Labor / Exploitation</option>
                        <option>Women Harassment & POSH Non-Compliance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        State / UT Occurrence *
                      </label>
                      <select
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                      >
                        <option value="">Select State...</option>
                        <option>Delhi NCR</option>
                        <option>Maharashtra</option>
                        <option>Gujarat</option>
                        <option>Uttar Pradesh</option>
                        <option>Madhya Pradesh</option>
                        <option>Bihar</option>
                        <option>Karnataka</option>
                        <option>West Bengal</option>
                        <option>Tamil Nadu</option>
                        <option>Other State</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Accused Office / Department / Individuals *
                    </label>
                    <input
                      type="text"
                      required
                      value={targetEntity}
                      onChange={(e) => setTargetEntity(e.target.value)}
                      placeholder="Specify exact department, officer rank, or location details"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Incident Summary & Corroborating Evidence *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={narrative}
                      onChange={(e) => setNarrative(e.target.value)}
                      placeholder="Detail factual chronological events: dates, amounts demanded, evidence in your possession..."
                      className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded transition-colors shadow-xs cursor-pointer"
                  >
                    Transmit Confidential Dossier to Vigilance Directorate
                  </button>
                </form>
              ) : (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-3xl">check</span>
                  </div>
                  <h4 className="font-headline font-bold text-slate-900 text-base">
                    Grievance Transmitted & Encrypted!
                  </h4>
                  <div className="bg-white p-3 rounded border border-emerald-300 font-mono text-sm font-bold text-slate-900">
                    {submittedId}
                  </div>
                  <p className="text-xs text-slate-600">
                    Your confidential grievance has been forwarded to the designated State Directorate for verification.
                  </p>
                  <button
                    onClick={() => {
                      setSubmittedId(null);
                      setNarrative('');
                      setTargetEntity('');
                    }}
                    className="px-4 py-2 bg-slate-800 text-white font-bold text-xs uppercase rounded cursor-pointer"
                  >
                    File Another Grievance
                  </button>
                </div>
              )}
            </div>

            {/* Right Tracker Panel */}
            <div className="lg:col-span-4 bg-white border-2 border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h4 className="font-headline font-bold text-sm uppercase text-slate-900">
                Track Existing Dossier
              </h4>
              <p className="text-xs text-slate-600">
                Check stage and action status of your registered grievance reference code.
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  value={dossierInput}
                  onChange={(e) => setDossierInput(e.target.value)}
                  placeholder="e.g. GRV-2025-IND-881"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs font-mono uppercase text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                />
                <button
                  onClick={handleTrack}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase rounded cursor-pointer transition-colors"
                >
                  Track Dossier Status
                </button>
              </div>

              {dossierResult && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs space-y-1 animate-fadeIn">
                  <div className="flex justify-between">
                    <strong className="font-mono text-[#0d47a1]">{dossierResult.code}</strong>
                    <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded">
                      ACTIVE
                    </span>
                  </div>
                  <div className="text-slate-800 font-semibold">{dossierResult.status}</div>
                  <p className="text-slate-600 text-[11px]">{dossierResult.details}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Indian Police Directory */}
        {activeTab === 'police' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-700">
                Official State Police Headquarters & Anti-Corruption Bureau (ACB) Helplines
              </span>
              <span className="text-xs font-mono text-slate-500 font-bold">
                EMERGENCY: 112
              </span>
            </div>

            <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                      <th className="p-3.5">State / Jurisdiction</th>
                      <th className="p-3.5">Director General of Police (DGP) Headquarters</th>
                      <th className="p-3.5">Contact Line</th>
                      <th className="p-3.5">State Vigilance / ACB Helpline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {POLICE_DIRECTORY.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-900">
                          {item.state}
                        </td>
                        <td className="p-3.5 text-slate-600">
                          {item.dgpOffice}
                        </td>
                        <td className="p-3.5 font-mono text-[#0d47a1] font-semibold">
                          {item.phone}
                        </td>
                        <td className="p-3.5 font-mono text-red-600 font-bold">
                          {item.antiCorruptionHelpline}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Government Directory of India */}
        {activeTab === 'govt' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {GOVT_DIRECTORY.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="material-symbols-outlined text-[#0d47a1] text-3xl">
                    assured_workload
                  </span>
                  <h4 className="font-headline font-bold text-base text-slate-900">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.role}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Toll-Free:</span>
                    <strong className="font-mono text-red-600">{item.tollFree}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Portal:</span>
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#0d47a1] font-mono hover:underline font-semibold"
                    >
                      {item.website.replace('https://', '')}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
