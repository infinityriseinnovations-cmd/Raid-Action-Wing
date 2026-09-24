import React from 'react';

interface ActivitiesPageProps {
  onNavigate: (page: string) => void;
}

interface ActivityItem {
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  image: string;
}

const activities: ActivityItem[] = [
  {
    title: 'Citizen Anti-Narcotics Awareness Rally & Ground Mobilization',
    category: 'Youth Wing',
    date: 'February 2026',
    location: 'Ahmedabad & Surat, Gujarat',
    description: 'Over 2,500 college students, field vigilance volunteers, and local advocates joined RAWF field commanders to rally against synthetic narcotics distribution and demand strict enforcement.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7D1Cv8Zz5hHkHWRsC2dBpAnYUkZ0ZCtxYoBPJYBBLwhi71gukNqmUaq1S7ds7-rpnQy9dgKR1hFGJCvg6fdzR0QNDcs1uncde15aH1Cj_ovJ49wdbEnyi3HcgYt1DebTQ0dmp7nUxPXX0IuIC0B3gzWoAkWgk8l0YIc9eLsbfB7lOIuzdvNL7lz5_EFlnw_PjTKNYWFcNsU5OnVumga3256O6DHiOZwcVeUFcPhTvMLAcYBENLi3UaA'
  },
  {
    title: 'Pro Bono Legal Empowerment & Police Rights Clinic',
    category: 'Legal Directorate',
    date: 'January 2026',
    location: 'Mumbai & Thane, Maharashtra',
    description: 'Free legal counseling session attended by senior advocates and retired judicial officers advising victims of delayed FIR filings, illegal police detention, and predatory microfinance harassment.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz4wFoVz11in_IGPjkes78eAHpnkyEfA5ZXwqE1KWP1VKjyVruWtz0nej_i2ocj5sfgwBSCjEHNU4hlGnX-qZUaD0oLbQwV-EKukFGywaIKIDSJnVlZrJGmfx-q0etbDziMgGbkfoLzCSHqWl4OhAnx2C_PB_fPL11yUmQFfcEHGaF2HwGrBL06gNLCBYR5gx9qeQVlQocvBZIMB5sbkcLf3Yjoxenu8aDnKWqhOIXw8H53syAQdHrBQlB8Q2-vPQoJ2o'
  },
  {
    title: 'National Anti-Corruption & Whistleblower Protocol Summit',
    category: 'Institutional Command',
    date: 'November 2025',
    location: 'New Delhi',
    description: 'National convention reviewing encrypted whistleblower intake mechanisms, public procurement transparency audits, and collaborative coordination models with statutory anti-corruption bureaus.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7D1Cv8Zz5hHkHWRsC2dBpAnYUkZ0ZCtxYoBPJYBBLwhi71gukNqmUaq1S7ds7-rpnQy9dgKR1hFGJCvg6fdzR0QNDcs1uncde15aH1Cj_ovJ49wdbEnyi3HcgYt1DebTQ0dmp7nUxPXX0IuIC0B3gzWoAkWgk8l0YIc9eLsbfB7lOIuzdvNL7lz5_EFlnw_PjTKNYWFcNsU5OnVumga3256O6DHiOZwcVeUFcPhTvMLAcYBENLi3UaA'
  }
];

export const ActivitiesPage: React.FC<ActivitiesPageProps> = ({ onNavigate }) => {
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
            <span className="text-red-400 font-bold">Our Activities</span>
          </div>
          <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight">
            Field Operations & Citizen Mobilization
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
            Recent field rallies, pro-bono legal defense workshops, and anti-narcotics youth summits conducted by RAWF command.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <div className="space-y-6">
          {activities.map((act, i) => (
            <div
              key={i}
              className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
            >
              <div className="md:col-span-5 h-64 md:h-full bg-slate-900 overflow-hidden">
                <img
                  src={act.image}
                  alt={act.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="md:col-span-7 p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 bg-red-50 text-red-600 font-mono text-[10px] font-bold uppercase rounded border border-red-200">
                    {act.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {act.date} • {act.location}
                  </span>
                </div>

                <h3 className="font-headline font-bold text-xl text-slate-900 leading-snug">
                  {act.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {act.description}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('events')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0d47a1] uppercase hover:underline cursor-pointer"
                  >
                    <span>View Upcoming Schedule</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
