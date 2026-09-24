import React from 'react';

interface InitiativeItem {
  badge: string;
  badgeType: 'red' | 'blue' | 'slate';
  icon: string;
  title: string;
  description: string;
  metric: string;
}

const initiatives: InitiativeItem[] = [
  {
    badge: 'Priority Mandate',
    badgeType: 'red',
    icon: 'balance',
    title: 'Legal Aid — Voice for Social Service',
    description: 'Pro bono legal representation and advisory for underprivileged citizens facing false prosecution, custodial overreach, and delayed trials.',
    metric: '10,000+ Cases Advised'
  },
  {
    badge: 'Special Taskforce',
    badgeType: 'blue',
    icon: 'security',
    title: 'Mission “Kali” & Women Rights',
    description: 'Dedicated nationwide defense taskforce protecting women from workplace harassment (POSH), domestic violence, dowry abuse, and systemic gender discrimination.',
    metric: 'State Crisis Response Wings'
  },
  {
    badge: 'Youth Wing',
    badgeType: 'red',
    icon: 'no_drinks',
    title: 'Say No To Drugs & Anti-Narcotics',
    description: 'Intelligence gathering on regional synthetic drug supply routes and grassroots rehabilitation campaigns in schools, colleges, and industrial zones.',
    metric: '120+ High Schools Mobilized'
  },
  {
    badge: 'Confidential Cell',
    badgeType: 'slate',
    icon: 'safety_check',
    title: 'Anti Human Trafficking Force',
    description: 'Cross-border covert intelligence tracing forced labor rackets, child exploitation networks, and inter-state missing person dossiers.',
    metric: 'Inter-Agency Handover Model'
  },
  {
    badge: 'Rural Wing',
    badgeType: 'slate',
    icon: 'agriculture',
    title: 'Farmer “Annadata” & Rural Rights',
    description: 'Safeguarding rural farming communities from predatory loan sharks, seed black-marketing, illegal land grabs, and government subsidy embezzlement.',
    metric: '45 Rural Panchayat Desks'
  },
  {
    badge: 'Ecological Unit',
    badgeType: 'slate',
    icon: 'water_drop',
    title: 'Swachh Bharat & Ek Boond Jal',
    description: 'Public health sanitation advocacy paired with industrial water conservation monitoring and illegal groundwater toxic contamination audits.',
    metric: 'Active Ecological Probes'
  }
];

export const InitiativesSection: React.FC = () => {
  return (
    <section className="w-full bg-slate-50 py-14 px-4 lg:px-8 border-b border-slate-200" id="initiatives">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0d47a1] block">
              Action Deployments
            </span>
            <h2 className="font-headline font-bold text-2xl lg:text-3xl text-slate-900 uppercase tracking-tight">
              National Social & Legal Initiatives
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-sm">
            Grassroots programs enforcing constitutional safeguards, eradicating narcotics abuse, and aiding rural civic infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {initiatives.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-3 hover:border-[#0d47a1] transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span
                    className={`px-2 py-0.5 font-mono text-[10px] uppercase font-bold rounded border ${
                      item.badgeType === 'red'
                        ? 'bg-red-50 text-red-600 border-red-200'
                        : item.badgeType === 'blue'
                        ? 'bg-blue-50 text-[#0d47a1] border-blue-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                  <span className="material-symbols-outlined text-slate-400 text-[20px] group-hover:text-[#0d47a1] transition-colors">
                    {item.icon}
                  </span>
                </div>

                <h3 className="font-headline font-bold text-base text-slate-900 group-hover:text-[#0d47a1] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="text-xs font-semibold text-[#0d47a1] flex items-center gap-1 pt-2 border-t border-slate-100">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                <span>{item.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
