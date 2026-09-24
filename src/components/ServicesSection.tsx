import React, { useState } from 'react';

interface ServiceItem {
  id: string;
  title: string;
  wingCode: string;
  icon: string;
  badge: string;
  image: string;
  description: string;
  features: string[];
}

const servicesData: ServiceItem[] = [
  {
    id: 'confidential-info',
    title: 'Confidential Information',
    wingCode: 'WING: SEC-INT',
    icon: 'lock',
    badge: 'CLASSIFIED WING',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz4wFoVz11in_IGPjkes78eAHpnkyEfA5ZXwqE1KWP1VKjyVruWtz0nej_i2ocj5sfgwBSCjEHNU4hlGnX-qZUaD0oLbQwV-EKukFGywaIKIDSJnVlZrJGmfx-q0etbDziMgGbkfoLzCSHqWl4OhAnx2C_PB_fPL11yUmQFfcEHGaF2HwGrBL06gNLCBYR5gx9qeQVlQocvBZIMB5sbkcLf3Yjoxenu8aDnKWqhOIXw8H53syAQdHrBQlB8Q2-vPQoJ2o',
    description: 'Reputed intelligence officers and covert informer network gathering actionable, classified surveillance intelligence across illicit syndicates and compromised administrative wings.',
    features: ['Zero-leak whistleblower channels', 'Covert surveillance protocols', 'Inter-agency intelligence briefs']
  },
  {
    id: 'crime-info',
    title: 'Crime Information',
    wingCode: 'WING: CRIM-DET',
    icon: 'bar_chart',
    badge: 'STOP CRIME',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7D1Cv8Zz5hHkHWRsC2dBpAnYUkZ0ZCtxYoBPJYBBLwhi71gukNqmUaq1S7ds7-rpnQy9dgKR1hFGJCvg6fdzR0QNDcs1uncde15aH1Cj_ovJ49wdbEnyi3HcgYt1DebTQ0dmp7nUxPXX0IuIC0B3gzWoAkWgk8l0YIc9eLsbfB7lOIuzdvNL7lz5_EFlnw_PjTKNYWFcNsU5OnVumga3256O6DHiOZwcVeUFcPhTvMLAcYBENLi3UaA',
    description: 'Specialized secret informer unit monitoring money laundering, institutional graft, commercial fraud, contraband smuggling, and organized cross-state cartels.',
    features: ['Financial irregularities tracking', 'Public procurement fraud audits', 'Smuggling network interception']
  },
  {
    id: 'social-investigator',
    title: 'Social Investigator',
    wingCode: 'WING: SOC-INV',
    icon: 'handshake',
    badge: 'CIVIC DEFENSE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7D1Cv8Zz5hHkHWRsC2dBpAnYUkZ0ZCtxYoBPJYBBLwhi71gukNqmUaq1S7ds7-rpnQy9dgKR1hFGJCvg6fdzR0QNDcs1uncde15aH1Cj_ovJ49wdbEnyi3HcgYt1DebTQ0dmp7nUxPXX0IuIC0B3gzWoAkWgk8l0YIc9eLsbfB7lOIuzdvNL7lz5_EFlnw_PjTKNYWFcNsU5OnVumga3256O6DHiOZwcVeUFcPhTvMLAcYBENLi3UaA',
    description: "India's premier ethical social detective collective. Working honestly to conduct objective fact-finding, human rights defense, and community grievance investigations.",
    features: ['Community human rights audits', 'Custodial torture probes', 'Atrocities fact-finding teams']
  },
  {
    id: 'cyber-forensics',
    title: 'Cyber Crime Forensics',
    wingCode: 'WING: CYBER-INT',
    icon: 'terminal',
    badge: 'OSINT TELEMETRY',
    image: '',
    description: 'Digital evidence extraction, online financial scam mitigation, software & IP copyright piracy deterrence, and OSINT digital telemetry analysis.',
    features: ['Encrypted transaction tracing', 'Online sextortion & POSH defense', 'Forensic packet preservation']
  }
];

interface ServicesSectionProps {
  onSelectServiceForReport?: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForReport }) => {
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceItem | null>(null);

  return (
    <section className="w-full bg-white py-14 px-4 lg:px-8 border-b border-slate-200" id="services">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest text-red-600">
            <span className="w-8 h-0.5 bg-red-600 inline-block"></span>
            <span>OUR SERVICES</span>
            <span className="w-8 h-8 rounded-full"></span>
            <span className="w-8 h-0.5 bg-red-600 inline-block"></span>
          </div>
          <h2 className="font-headline font-bold text-2xl lg:text-3xl text-slate-900 tracking-tight">
            We fighting for Crime and Corruption free India —{' '}
            <span className="text-red-600 font-extrabold">RAID ACTION WING FOUNDATION</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Deploying multidisciplinary intelligence, legal, social investigation, and forensic methodologies across Indian jurisdictions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.map((svc) => (
            <div
              key={svc.id}
              className="bg-white border-2 border-slate-200 hover:border-[#0d47a1] rounded-lg overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div className="relative">
                <div className="w-full h-44 overflow-hidden relative bg-slate-900">
                  {svc.image ? (
                    <img
                      src={svc.image}
                      alt={svc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4 text-center">
                      <div className="font-mono text-xs text-blue-300 space-y-1">
                        <div className="text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                          OSINT TELEMETRY
                        </div>
                        <div>[FORENSIC NODE: ACTIVE]</div>
                        <div className="text-[10px] text-slate-400">ENCRYPTED TELEMETRY LINK</div>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-blue-900/10"></div>
                </div>

                <div className="absolute -bottom-5 left-5 w-12 h-12 bg-gradient-to-br from-red-600 to-amber-600 rounded text-white flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[24px]">{svc.icon}</span>
                </div>
              </div>

              <div className="pt-8 px-5 pb-5 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-red-600 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                    {svc.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
                  <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">
                    {svc.wingCode}
                  </span>
                  <button
                    onClick={() => setSelectedServiceModal(svc)}
                    className="text-red-600 font-bold uppercase flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Inquire</span>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Detail & Trigger Modal */}
      {selectedServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative animate-scaleUp">
            <button
              onClick={() => setSelectedServiceModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded bg-red-50 text-red-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">{selectedServiceModal.icon}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">
                  {selectedServiceModal.wingCode}
                </span>
                <h3 className="font-headline font-bold text-lg text-slate-900">
                  {selectedServiceModal.title}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedServiceModal.description}
            </p>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                Standard Protocols & Field Powers
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {selectedServiceModal.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 font-mono">
                Mandate: ITA ACT 1882 Charter
              </span>
              <a
                href="#report-tip-anchor"
                onClick={() => {
                  if (onSelectServiceForReport) onSelectServiceForReport(selectedServiceModal.title);
                  setSelectedServiceModal(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-xs uppercase tracking-wide transition-colors"
              >
                Submit Incident To This Wing
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
