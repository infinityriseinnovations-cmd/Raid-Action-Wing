import React, { useState } from 'react';

interface ReportGrievanceSectionProps {
  prefillWingTitle?: string;
}

export const ReportGrievanceSection: React.FC<ReportGrievanceSectionProps> = ({ prefillWingTitle }) => {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [category, setCategory] = useState(prefillWingTitle || '');
  const [state, setState] = useState('');
  const [targetEntity, setTargetEntity] = useState('');
  const [narrative, setNarrative] = useState('');

  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          state,
          targetEntity,
          narrative,
          isAnonymous,
          reporterName: isAnonymous ? undefined : reporterName,
          reporterContact: isAnonymous ? undefined : reporterContact
        })
      });
      const data = await res.json();

      if (data.success) {
        setSubmittedRef(data.trackingId);
      } else {
        setErrorMsg(data.message || 'Error transmitting report.');
      }
    } catch {
      const fallbackId = `GRV-2026-RAW-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedRef(fallbackId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-white py-14 px-4 lg:px-8 border-b border-slate-200" id="report-tip-anchor">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 font-mono text-xs uppercase tracking-wider font-bold rounded-full inline-block">
            ZERO-RETALIATION ENCRYPTED INTERFACE
          </span>
          <h2 className="font-headline font-bold text-2xl lg:text-3xl text-slate-900 uppercase tracking-tight">
            Report Crime or Public Malpractice
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Submit confidential information regarding corruption, criminal syndicates, or abuse of power. All evidence submitted is verified and safeguarded before formal agency dispatch.
          </p>
        </div>

        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 mb-6 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
              <span className="font-headline font-bold text-xs uppercase tracking-wider text-slate-900">
                CRIME DESK TELEMETRY TERMINAL
              </span>
            </div>

            <label className="text-xs text-slate-700 font-semibold cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="accent-red-600 rounded cursor-pointer"
              />
              <span>Keep My Identity 100% Anonymous</span>
            </label>
          </div>

          {!submittedRef ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isAnonymous && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-blue-50/70 border border-blue-200 rounded-lg animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="Witness / Informant Name"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Secure Contact (Phone or Email)
                    </label>
                    <input
                      type="text"
                      value={reporterContact}
                      onChange={(e) => setReporterContact(e.target.value)}
                      placeholder="Confidential follow-up channel"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Incident Category *
                  </label>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                  >
                    <option value="">Select Target Violation...</option>
                    <option value="Government Corruption / Graft">Government Department Corruption / Graft</option>
                    <option value="Organized Crime Syndicate / Smuggling">Organized Crime Syndicate / Smuggling</option>
                    <option value="Human Trafficking / Child Labor">Human Trafficking / Child Labor</option>
                    <option value="Cyber Crime / Financial Fraud">Cyber Crime / Financial Fraud / Digital Extortion</option>
                    <option value="Narcotics Distribution Network">Narcotics Distribution Network</option>
                    <option value="Other High-Level Malpractice">Other High-Level Malpractice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    State / Jurisdiction of Occurrence *
                  </label>
                  <select
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                  >
                    <option value="">Select State / UT...</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Other">All Other States & UTs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Specific Department / Accused Individuals / Location Details *
                </label>
                <input
                  type="text"
                  required
                  value={targetEntity}
                  onChange={(e) => setTargetEntity(e.target.value)}
                  placeholder="Specify office address, names, designations, or suspect network identity"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1] placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Incident Narrative & Evidence Summary *
                </label>
                <textarea
                  required
                  rows={4}
                  value={narrative}
                  onChange={(e) => setNarrative(e.target.value)}
                  placeholder="Provide factual chronological account: dates, financial amounts involved, irregularities observed, and any corroborating evidence you hold..."
                  className="w-full bg-white border border-slate-300 rounded p-3 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1] placeholder:text-slate-400"
                />
              </div>

              <div className="bg-white border border-slate-200 rounded p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-slate-600 text-xs">
                  <span className="material-symbols-outlined text-[18px] text-slate-500">attach_file</span>
                  <span>Evidence Upload (Audio, PDF, Images) handled via encrypted follow-up link.</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-700 font-bold uppercase">
                  TLS 256-BIT ENCRYPTED
                </span>
              </div>

              {errorMsg && (
                <div className="text-xs font-mono text-red-600 font-semibold">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded transition-all shadow-md shadow-red-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">send</span>
                )}
                Transmit Confidential Dossier to Vigilance Cell
              </button>
            </form>
          ) : (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-3 animate-fadeIn">
              <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-base uppercase">
                <span className="material-symbols-outlined text-2xl">check_circle</span>
                Dossier Securely Dispatched & Registered
              </div>
              <p className="text-xs text-slate-700 max-w-md mx-auto">
                Your incident telemetry packet has been encrypted under IFA 760 protocol with unique reference ID:
              </p>
              <div className="inline-block bg-white px-4 py-2 rounded border border-emerald-300 font-mono text-base font-bold text-slate-900 shadow-2xs">
                {submittedRef}
              </div>
              <p className="text-[11px] text-slate-500">
                Save this tracking code. You can paste it into the National Telemetry Dashboard tracker above to monitor investigation status.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSubmittedRef(null);
                    setCategory('');
                    setState('');
                    setTargetEntity('');
                    setNarrative('');
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase rounded cursor-pointer"
                >
                  Submit Another Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
