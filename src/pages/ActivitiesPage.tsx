import React, { useState, useEffect } from 'react';
import { toStandardDisplayDate } from '../utils/dateUtils';
import { activitiesApi } from '../services';

interface ActivitiesPageProps {
  onNavigate: (page: string, subParam?: string) => void;
}

export interface ActivityItem {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  content?: string;
  image: string;
  author?: string;
  status?: string;
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-youth-anti-narcotics-2026',
    title: 'Citizen Anti-Narcotics Awareness Rally & Ground Mobilization',
    category: 'Youth Wing',
    date: '15/02/2026',
    location: 'Ahmedabad & Surat, Gujarat',
    description: 'Over 2,500 college students, field vigilance volunteers, and local advocates joined RAWF field commanders to rally against synthetic narcotics distribution and demand strict enforcement.',
    content: `The National Youth Directorate of Raid Action Wing Foundation (RAWF) successfully executed a massive anti-narcotics mobilization campaign across educational institutions and urban transit corridors in Gujarat.\n\nCoordinated across Ahmedabad and Surat districts, the taskforce established direct citizen reporting kiosks, educated student leaders on Section 204 BNS protections, and collected actionable intelligence on illicit distribution nexus operating near collegiate campuses.\n\nKey Highlights & Action Items:\n1. Distributed over 5,000 bilingual citizen rights handbooks detailing reporting channels to NCB and State Police.\n2. Conducted forensic awareness workshops showing how clandestine synthetic drugs are masked as pharmaceutical supplements.\n3. Activated 12 institutional whistleblower cells led by trained volunteer paralegals.\n\nRAWF Field Directorate reiterated its unyielding commitment under IFA 760 Charter to protect Indian youth from organized narcotics cartels without compromising citizen privacy.`,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7D1Cv8Zz5hHkHWRsC2dBpAnYUkZ0ZCtxYoBPJYBBLwhi71gukNqmUaq1S7ds7-rpnQy9dgKR1hFGJCvg6fdzR0QNDcs1uncde15aH1Cj_ovJ49wdbEnyi3HcgYt1DebTQ0dmp7nUxPXX0IuIC0B3gzWoAkWgk8l0YIc9eLsbfB7lOIuzdvNL7lz5_EFlnw_PjTKNYWFcNsU5OnVumga3256O6DHiOZwcVeUFcPhTvMLAcYBENLi3UaA',
    author: 'Youth Wing National Directorate'
  },
  {
    id: 'act-legal-empowerment-2026',
    title: 'Pro Bono Legal Empowerment & Police Rights Clinic',
    category: 'Legal Directorate',
    date: '28/01/2026',
    location: 'Mumbai & Thane, Maharashtra',
    description: 'Free legal counseling session attended by senior advocates and retired judicial officers advising victims of delayed FIR filings, illegal police detention, and predatory microfinance harassment.',
    content: `The RAWF Legal Directorate organized a specialized one-day pro bono legal empowerment clinic at Chowpatty, Mumbai, providing direct litigation advice and statutory drafting assistance to over 340 distressed citizens.\n\nChaired by senior trial advocates and retired judicial consultants, the clinic specifically addressed instances of police refusal to register mandatory FIRs under Section 173 BNSS, unlawful commercial search threats by rogue actors, and harassment by unauthorized loan collection syndicates.\n\nAction Outcomes & Case Files:\n1. 42 formal Section 175(3) BNSS applications drafted for submission before Chief Metropolitan Magistrates for direct investigation orders.\n2. 18 emergency bail and quashing petitions vetted for underprivileged victims of false extortion complaints.\n3. Detailed advisory circulated on Supreme Court guidelines in Arnesh Kumar and Lalita Kumari judgments.\n\nRAWF continues to expand free legal assistance nationwide to ensure every Indian citizen exercises their fundamental constitutional rights without fear.`,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz4wFoVz11in_IGPjkes78eAHpnkyEfA5ZXwqE1KWP1VKjyVruWtz0nej_i2ocj5sfgwBSCjEHNU4hlGnX-qZUaD0oLbQwV-EKukFGywaIKIDSJnVlZrJGmfx-q0etbDziMgGbkfoLzCSHqWl4OhAnx2C_PB_fPL11yUmQFfcEHGaF2HwGrBL06gNLCBYR5gx9qeQVlQocvBZIMB5sbkcLf3Yjoxenu8aDnKWqhOIXw8H53syAQdHrBQlB8Q2-vPQoJ2o',
    author: 'Legal Directorate Command'
  },
  {
    id: 'act-anti-corruption-summit-2025',
    title: 'National Anti-Corruption & Whistleblower Protocol Summit',
    category: 'Institutional Command',
    date: '18/11/2025',
    location: 'Constitution Club of India, New Delhi',
    description: 'National convention reviewing encrypted whistleblower intake mechanisms, public procurement transparency audits, and collaborative coordination models with statutory anti-corruption bureaus.',
    content: `The National Action Command of Raid Action Wing Foundation convened its landmark Whistleblower Protocol Summit at the Constitution Club of India, New Delhi. The conference brought together over 400 certified vigilance officers, investigative journalists, and RTI activists from 22 states.\n\nThe summit officially ratified the RAWF 2026 Vigilance Charter, setting strict standards for whistleblower cryptographic protection, anonymous digital grievance dispatch, and forensic corroboration before statutory escalation to CBI, ED, and State Anti-Corruption Bureaus.\n\nCore Summit Resolutions:\n1. Universal deployment of zero-knowledge encrypted report tracking for confidential corruption disclosures.\n2. Mandatory audit training for State Directors on detecting ghost contractors and rigged municipal tenders.\n3. Enhanced public awareness regarding Section 204 BNS penalties against fake badge imposters.`,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUm1YEgLpksGzi3w_3gvQPMzQHxeJlPGIDPYSLpaJCRKoYNLLGbcUdrCUKoSaRyfEzL4ATnteKP2TfyzfoAVh1i5Kpa_VmIijrnduQpaY8f3zG3WoGPNJrVYlAkNW10Af4Sgz53Lwkm1nL1Xp2RSJO1N4pId9Ml-OLibxjnYl8ahmBmrReo3ewBqIGmPn5k_MsnyohwJdt7FnnDgVW2dEYGojLicyUTmbxn8Iv-d5fNMODD99vAKO6VQ',
    author: 'National Action Command HQ'
  },
  {
    id: 'act-women-rights-2026',
    title: 'Women Safety & Anti-Harassment Rapid Action Workshop',
    category: 'Women Rights Wing',
    date: '08/03/2026',
    location: 'Lucknow, Uttar Pradesh',
    description: 'Special workshop on digital cyber harassment, domestic violence emergency helplines, and rapid protective legal intervention for women and minors.',
    content: `On the occasion of International Women's Day, RAWF Women Rights Wing conducted an intensive legal literacy and cyber safety workshop in Lucknow. The session empowered over 500 women students, working professionals, and homemakers with direct legal instruments to counter stalking, cyber blackmailing, and domestic violence.\n\nRAWF counselors provided one-on-one psychological support and prepared instant complaints for immediate submission to the National Commission for Women (NCW) and Cyber Police Cells.`,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7D1Cv8Zz5hHkHWRsC2dBpAnYUkZ0ZCtxYoBPJYBBLwhi71gukNqmUaq1S7ds7-rpnQy9dgKR1hFGJCvg6fdzR0QNDcs1uncde15aH1Cj_ovJ49wdbEnyi3HcgYt1DebTQ0dmp7nUxPXX0IuIC0B3gzWoAkWgk8l0YIc9eLsbfB7lOIuzdvNL7lz5_EFlnw_PjTKNYWFcNsU5OnVumga3256O6DHiOZwcVeUFcPhTvMLAcYBENLi3UaA',
    author: 'Women Rights Wing'
  }
];

const DEFAULT_CATEGORIES = [
  'Youth Wing',
  'Legal Directorate',
  'Institutional Command',
  'Women Rights Wing',
  'Anti-Corruption Cell',
  'Environmental Vigilance',
  'Cyber Crime & Fraud Prevention',
  'Field Taskforce'
];

export const ActivitiesPage: React.FC<ActivitiesPageProps> = ({ onNavigate }) => {
  const [activitiesList, setActivitiesList] = useState<ActivityItem[]>(DEFAULT_ACTIVITIES);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<ActivityItem | null>(null);

  useEffect(() => {
    activitiesApi.getAll()
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setActivitiesList(data.data);
        }
      })
      .catch(() => {
        // Fallback to default
      });

    activitiesApi.getCategories()
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setCategories(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = activitiesList.filter((act) => {
    const matchCat = selectedCategory === 'All' || act.category.toLowerCase() === selectedCategory.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !searchQuery ||
      act.title.toLowerCase().includes(q) ||
      act.description.toLowerCase().includes(q) ||
      act.location.toLowerCase().includes(q) ||
      (act.content && act.content.toLowerCase().includes(q));
    return matchCat && matchQuery;
  });

  const getCategoryBadgeClass = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('youth')) return 'bg-amber-100 text-amber-900 border-amber-300';
    if (cat.includes('legal')) return 'bg-blue-100 text-[#0d47a1] border-blue-300';
    if (cat.includes('women')) return 'bg-rose-100 text-rose-800 border-rose-300';
    if (cat.includes('corruption')) return 'bg-red-100 text-red-800 border-red-300';
    if (cat.includes('environment')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (cat.includes('cyber') || cat.includes('fraud')) return 'bg-purple-100 text-purple-800 border-purple-300';
    if (cat.includes('taskforce') || cat.includes('field')) return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    if (cat.includes('rti') || cat.includes('right')) return 'bg-teal-100 text-teal-800 border-teal-300';
    return 'bg-slate-100 text-slate-800 border-slate-300';
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
            <span className="text-red-400 font-bold">Our Activities & Field Operations</span>
          </div>
          <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight">
            Our Activities & Field Dispatches
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
            Institutional blogs, ground mobilization drives, citizen empowerment rallies, and official anti-corruption operations conducted across India.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        {/* Filters & Search Toolbar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activities, locations, topics..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
              />
            </div>

            <div className="text-xs text-slate-500 font-mono">
              Showing <strong>{filtered.length}</strong> dispatches
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0d47a1] text-white shadow-xs font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Activities / Blog Articles List */}
        <div className="space-y-6">
          {filtered.map((act) => (
            <div
              key={act.id}
              className="bg-white border-2 border-slate-200 hover:border-red-600 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all grid grid-cols-1 md:grid-cols-12 gap-6 items-center group"
            >
              {/* Cover Image */}
              <div className="md:col-span-5 h-60 md:h-full bg-slate-900 overflow-hidden relative">
                <img
                  src={act.image}
                  alt={act.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono font-bold rounded uppercase">
                  {toStandardDisplayDate(act.date)}
                </span>
              </div>

              {/* Content Body */}
              <div className="md:col-span-7 p-6 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 font-mono text-[10.5px] font-bold uppercase rounded border ${getCategoryBadgeClass(
                      act.category
                    )}`}
                  >
                    {act.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {act.location}
                  </span>
                  {act.author && (
                    <span className="text-[11px] text-slate-500 font-medium">
                      • By {act.author}
                    </span>
                  )}
                </div>

                <h3
                  onClick={() => setActiveArticle(act)}
                  className="font-headline font-bold text-xl text-slate-900 leading-snug group-hover:text-red-600 transition-colors cursor-pointer"
                >
                  {act.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {act.description}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  {/* RENAMED BUTTON: Read More */}
                  <button
                    onClick={() => setActiveArticle(act)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0d47a1] hover:bg-blue-900 text-white text-xs font-bold uppercase rounded transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Read more</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>

                  <button
                    onClick={() => onNavigate('apply-online')}
                    className="text-xs font-bold text-slate-600 hover:text-[#0d47a1] underline cursor-pointer"
                  >
                    Join Taskforce
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-xl space-y-3">
              <span className="material-symbols-outlined text-slate-300 text-5xl">article</span>
              <h4 className="font-bold text-slate-700 text-base">No field dispatches found</h4>
              <p className="text-xs text-slate-500">
                Try selecting a different category or clearing your search term.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold uppercase rounded cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Action Schedule Callout Banner */}
        <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-l-4 border-amber-500">
          <div className="space-y-2 text-center sm:text-left">
            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase rounded border border-amber-500/30">
              CITIZEN MOBILIZATION
            </span>
            <h3 className="font-headline font-bold text-xl sm:text-2xl uppercase">
              Want to attend our next ground convention or legal clinic?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Check the upcoming national schedule for anti-corruption summits, legal aid desks, and public awareness clinics.
            </p>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded transition-all shrink-0 cursor-pointer shadow-md flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            <span>View Upcoming Schedule</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BLOG ARTICLE READER MODAL (Read More Destination)        */}
      {/* ======================================================== */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scaleUp my-auto">
            {/* Modal Header Bar with Close */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase rounded border ${getCategoryBadgeClass(
                    activeArticle.category
                  )}`}
                >
                  {activeArticle.category}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {toStandardDisplayDate(activeArticle.date)}
                </span>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Hero Image */}
            <div className="w-full h-64 sm:h-80 bg-slate-900 relative overflow-hidden">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    <span>{activeArticle.location}</span>
                    {activeArticle.author && (
                      <>
                        <span>•</span>
                        <span>Dispatch by {activeArticle.author}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-slate-900 leading-tight">
                {activeArticle.title}
              </h2>

              {/* Brief Excerpt */}
              <div className="p-4 bg-slate-50 border-l-4 border-[#0d47a1] rounded-r-lg text-xs sm:text-sm text-slate-700 font-medium leading-relaxed italic">
                {activeArticle.description}
              </div>

              {/* Full Narrative Paragraphs */}
              <div className="text-xs sm:text-sm text-slate-700 space-y-4 leading-relaxed font-sans">
                {(activeArticle.content || activeArticle.description)
                  .split('\n\n')
                  .map((para, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {para}
                    </p>
                  ))}
              </div>

              {/* Statutory Note Box */}
              <div className="bg-red-50/70 border border-red-200 rounded-xl p-4 text-[11px] text-red-900 space-y-1 font-mono">
                <strong className="block uppercase font-bold text-red-700">
                  STATUTORY NOTICE UNDER IFA 760 CHARTER
                </strong>
                <p>
                  Official citizen vigilance operations conducted in full compliance with the Indian Trusts Act 1882. No commercial searches or unlawful seizures are conducted without statutory authority.
                </p>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveArticle(null);
                      onNavigate('grievance-cell');
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    Report Related Incident
                  </button>
                  <button
                    onClick={() => {
                      setActiveArticle(null);
                      onNavigate('apply-online');
                    }}
                    className="px-4 py-2 bg-[#0d47a1] hover:bg-blue-900 text-white rounded text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    Apply for Volunteer Wing
                  </button>
                </div>

                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-bold uppercase cursor-pointer"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

