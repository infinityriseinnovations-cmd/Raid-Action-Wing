import React, { useState } from 'react';

interface ServicesPageProps {
  onNavigate: (page: string) => void;
  onSelectServiceForReport: (title: string) => void;
  initialService?: string;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigate,
  onSelectServiceForReport,
  initialService = 'confidential-info'
}) => {
  const [activeTab, setActiveTab] = useState(initialService);

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
            <span className="text-red-400 font-bold">Our Services</span>
          </div>
          <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight">
            Specialized Vigilance & Intelligence Wings
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
            We fighting for Crime and Corruption free India — RAID ACTION WING FOUNDATION.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('confidential-info')}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'confidential-info'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Confidential Information (SEC-INT)
          </button>
          <button
            onClick={() => setActiveTab('crime-info')}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'crime-info'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Crime Information (CRIM-DET)
          </button>
          <button
            onClick={() => setActiveTab('social-investigator')}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'social-investigator'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Social Investigator (SOC-INV)
          </button>
          <button
            onClick={() => setActiveTab('cyber-forensics')}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'cyber-forensics'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Cyber Crime Forensics (CYBER-INT)
          </button>
        </div>

        {/* Content for Confidential Information */}
        {activeTab === 'confidential-info' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-50 text-[#0d47a1] font-mono text-xs font-bold uppercase">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                WING: SEC-INT • CLASSIFIED WHISTLEBLOWER PROTOCOL
              </div>

              <h2 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900">
                Confidential Information & Covert Surveillance
              </h2>

              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                Reputed intelligence officers and covert informer network gathering actionable, classified surveillance intelligence across illicit syndicates and compromised administrative wings.
              </p>

              <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="font-headline font-bold text-base text-slate-900 uppercase">
                  Operational Capabilities & Field Methodology
                </h3>
                <div className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-red-600 text-[18px] shrink-0 mt-0.5">shield</span>
                    <span><strong>100% Informer Anonymity:</strong> Direct cryptographic intake preventing witness leaks, official retaliation, or identity exposure.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-red-600 text-[18px] shrink-0 mt-0.5">shield</span>
                    <span><strong>Administrative Irregularities Audit:</strong> Secret surveillance verifying kickback collections, ghost tender allocation, and bribery in local statutory offices.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-red-600 text-[18px] shrink-0 mt-0.5">shield</span>
                    <span><strong>Formal Agency Transmission:</strong> Verified telemetry packets packaged in judicial-grade formats and formally delivered to Anti-Corruption Bureaus (ACB) and State Vigilance.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    onSelectServiceForReport('Confidential Information / Administrative Graft');
                    onNavigate('home');
                    window.location.hash = '#report-tip-anchor';
                  }}
                  className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded transition-colors cursor-pointer"
                >
                  Submit Classified Tip to SEC-INT
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white border-2 border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="rounded-lg overflow-hidden border border-slate-200">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAz4wFoVz11in_IGPjkes78eAHpnkyEfA5ZXwqE1KWP1VKjyVruWtz0nej_i2ocj5sfgwBSCjEHNU4hlGnX-qZUaD0oLbQwV-EKukFGywaIKIDSJnVlZrJGmfx-q0etbDziMgGbkfoLzCSHqWl4OhAnx2C_PB_fPL11yUmQFfcEHGaF2HwGrBL06gNLCBYR5gx9qeQVlQocvBZIMB5sbkcLf3Yjoxenu8aDnKWqhOIXw8H53syAQdHrBQlB8Q2-vPQoJ2o"
                  alt="Confidential Information Desk"
                  className="w-full h-44 object-cover"
                />
              </div>
              <div className="space-y-1 text-xs">
                <span className="text-slate-500 font-bold block uppercase">Protocol Clearance:</span>
                <span className="font-mono text-slate-900 font-bold">IFA 760 Encrypted Channel</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                All evidence submitted through this wing receives high-priority review under the Whistleblowers Protection framework.
              </p>
            </div>
          </div>
        )}

        {/* Content for Crime Information */}
        {activeTab === 'crime-info' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-50 text-red-600 font-mono text-xs font-bold uppercase">
                <span className="material-symbols-outlined text-[16px]">bar_chart</span>
                WING: CRIM-DET • ECONOMIC OFFENSES & CRIME INTELLIGENCE
              </div>

              <h2 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900">
                Crime Information & Anti-Syndicate Action
              </h2>

              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                Specialized secret informer unit monitoring money laundering, institutional graft, commercial fraud, contraband smuggling, and organized cross-state cartels.
              </p>

              <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="font-headline font-bold text-base text-slate-900 uppercase">
                  Targeted Crime Domains
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-600">
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <strong className="text-slate-900 block mb-1">Financial & Banking Fraud</strong>
                    <span>Predatory digital loan apps, counterfeit currency distribution, and commercial embezzlement.</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <strong className="text-slate-900 block mb-1">Contraband & Smuggling</strong>
                    <span>Cross-border narcotics transport, illegal liquor syndicates, and prohibited arms logistics.</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <strong className="text-slate-900 block mb-1">Public Procurement Graft</strong>
                    <span>Rigged government bidding, substandard infrastructure materials, and commission rackets.</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <strong className="text-slate-900 block mb-1">Land Mafia & Grabs</strong>
                    <span>Forged revenue registry records, coerced tribal land sales, and illegal developer encroachment.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onSelectServiceForReport('Crime Information / Commercial Fraud / Syndicates');
                    onNavigate('home');
                    window.location.hash = '#report-tip-anchor';
                  }}
                  className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded transition-colors cursor-pointer"
                >
                  Report Crime Incident to CRIM-DET
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white border-2 border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="rounded-lg overflow-hidden border border-slate-200">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7D1Cv8Zz5hHkHWRsC2dBpAnYUkZ0ZCtxYoBPJYBBLwhi71gukNqmUaq1S7ds7-rpnQy9dgKR1hFGJCvg6fdzR0QNDcs1uncde15aH1Cj_ovJ49wdbEnyi3HcgYt1DebTQ0dmp7nUxPXX0IuIC0B3gzWoAkWgk8l0YIc9eLsbfB7lOIuzdvNL7lz5_EFlnw_PjTKNYWFcNsU5OnVumga3256O6DHiOZwcVeUFcPhTvMLAcYBENLi3UaA"
                  alt="Stop Crime Rally"
                  className="w-full h-44 object-cover"
                />
              </div>
              <div className="space-y-1 text-xs">
                <span className="text-slate-500 font-bold block uppercase">Network Deployment:</span>
                <span className="font-mono text-slate-900 font-bold">28 State Directorates Active</span>
              </div>
            </div>
          </div>
        )}

        {/* Content for Social Investigator */}
        {activeTab === 'social-investigator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-50 text-amber-800 font-mono text-xs font-bold uppercase">
                <span className="material-symbols-outlined text-[16px]">handshake</span>
                WING: SOC-INV • HUMAN RIGHTS & CIVIC DEFENSE
              </div>

              <h2 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900">
                Social Investigator & Human Rights Fact-Finding
              </h2>

              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                India's premier ethical social detective collective. Working honestly to conduct objective fact-finding, human rights defense, and community grievance investigations.
              </p>

              <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="font-headline font-bold text-base text-slate-900 uppercase">
                  Community Fact-Finding Scope
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>Custodial Injustice:</strong> Investigating torture in police lockups, illegal detention beyond 24 hours, and delayed production before magistrates.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>Atrocities on Marginalized Citizens:</strong> Probing violations under the SC/ST Prevention of Atrocities Act, bonded labor, and caste discrimination.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>Public Welfare Delivery Grievances:</strong> Ration shop embezzlement, medical negligence in district civil hospitals, and Anganwadi food adulteration.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onSelectServiceForReport('Social Investigation / Human Rights Violation');
                    onNavigate('home');
                    window.location.hash = '#report-tip-anchor';
                  }}
                  className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded transition-colors cursor-pointer"
                >
                  Request Social Investigator Probe
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white border-2 border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                <strong className="text-[#0d47a1] text-xs uppercase font-bold block">
                  Ethical Charter of SOC-INV
                </strong>
                <p className="text-xs text-slate-600 leading-normal">
                  RAWF social investigators adhere to uncompromised evidence preservation, video testimonies, independent witness notarization, and zero financial extraction from victims.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content for Cyber Forensics */}
        {activeTab === 'cyber-forensics' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-green-50 text-emerald-700 font-mono text-xs font-bold uppercase">
                <span className="material-symbols-outlined text-[16px]">terminal</span>
                WING: CYBER-INT • DIGITAL OSINT & FORENSICS
              </div>

              <h2 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900">
                Cyber Crime Forensics & Telemetry Analysis
              </h2>

              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                Digital evidence extraction, online financial scam mitigation, software & IP copyright piracy deterrence, and OSINT digital telemetry analysis.
              </p>

              <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="font-headline font-bold text-base text-slate-900 uppercase">
                  Technical Division Capabilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-600">
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <strong className="text-slate-900 block mb-1">Financial Cyber Scams</strong>
                    <span>Fake investment platforms, crypto-swindles, WhatsApp trading fraud, and identity theft.</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <strong className="text-slate-900 block mb-1">Women & Child Cyber Defense</strong>
                    <span>Morphed image sextortion, social media cyberstalking, and anonymous trolling networks.</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <strong className="text-slate-900 block mb-1">Anti-Piracy & Counterfeiting</strong>
                    <span>Unauthorized software torrents, educational content piracy, and IP rights infringement.</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <strong className="text-slate-900 block mb-1">Digital Evidence Preservation</strong>
                    <span>Hashing, timestamping, IP header tracing, and metadata integrity certificates for court filing.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onSelectServiceForReport('Cyber Crime Forensics / Digital Scam');
                    onNavigate('home');
                    window.location.hash = '#report-tip-anchor';
                  }}
                  className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded transition-colors cursor-pointer"
                >
                  File Digital Crime Incident
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900 text-white rounded-xl p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                  ACTIVE FORENSIC NODE
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <div className="font-mono text-xs text-blue-200 space-y-2">
                <div>[STATUS: REAL-TIME INGEST]</div>
                <div>[ENCRYPTION: 256-BIT TLS]</div>
                <div>[MAPPING: CYBER CRIME HELPLINE 1930]</div>
              </div>
              <p className="text-xs text-slate-300">
                Immediately report active bank fraud to the National Cyber Crime Helpline <strong className="text-white">1930</strong> or RAWF dispatch.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
