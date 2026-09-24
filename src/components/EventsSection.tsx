import React, { useState } from 'react';

interface EventItem {
  id: string;
  dateStr: string;
  city: string;
  badgeColor: 'red' | 'blue' | 'amber';
  icon: string;
  title: string;
  description: string;
  location: string;
  time: string;
  registeredCount: number;
}

const eventsList: EventItem[] = [
  {
    id: 'delhi-summit-2025',
    dateStr: '18 OCT 2025',
    city: 'DELHI NCR',
    badgeColor: 'red',
    icon: 'campaign',
    title: 'National Anti-Corruption & Whistleblower Summit',
    description: 'Annual national convention discussing institutional whistleblower protection protocols, forensic document analysis, and public procurement transparency.',
    location: 'Constitution Club of India, Rafi Marg, New Delhi',
    time: '10:00 AM – 04:30 PM IST',
    registeredCount: 420
  },
  {
    id: 'mumbai-clinic-2025',
    dateStr: '04 NOV 2025',
    city: 'MUMBAI',
    badgeColor: 'blue',
    icon: 'gavel',
    title: 'Pro Bono Legal Aid & Police Rights Clinic',
    description: 'Free citizen legal advisory for victims of unlawful police detention, delayed FIR filings, and predatory loan shark syndicates in Maharashtra.',
    location: 'Bhartiya Vidya Bhavan, Chowpatty, Mumbai',
    time: '11:00 AM – 05:00 PM IST',
    registeredCount: 280
  },
  {
    id: 'ahmedabad-conclave-2025',
    dateStr: '22 NOV 2025',
    city: 'AHMEDABAD',
    badgeColor: 'amber',
    icon: 'security',
    title: 'Say No To Drugs & Youth Awareness Conclave',
    description: 'Special cross-state taskforce interactive panel with student union leaders, university deans, and de-addiction counselors to stamp out synthetic drug distribution.',
    location: 'Tagore Memorial Hall, Paldi, Ahmedabad, Gujarat',
    time: '02:00 PM – 06:30 PM IST',
    registeredCount: 350
  }
];

export const EventsSection: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone) return;

    const passId = `RAWF-PASS-${Math.floor(10000 + Math.random() * 90000)}`;
    setRegSuccess(passId);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setRegSuccess(null);
    setRegName('');
    setRegPhone('');
    setRegEmail('');
  };

  return (
    <section className="w-full bg-white py-14 px-4 lg:px-8 border-b border-slate-200" id="events">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 block">
              Ground Mobilization & Action Schedule
            </span>
            <h2 className="font-headline font-bold text-2xl lg:text-3xl text-slate-900 uppercase tracking-tight">
              Upcoming Events & Civil Action Briefings
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-sm">
            Join certified citizen vigilance conventions, legal empowerment clinics, and anti-narcotics rallies led by RAWF field commanders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {eventsList.map((event) => (
            <div
              key={event.id}
              className="bg-slate-50 border-2 border-slate-200 hover:border-red-600 rounded-lg p-5 flex flex-col justify-between transition-all group shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded font-mono ${
                      event.badgeColor === 'red'
                        ? 'bg-red-100 text-red-700'
                        : event.badgeColor === 'blue'
                        ? 'bg-blue-100 text-[#0d47a1]'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {event.dateStr} • {event.city}
                  </span>
                  <span className="material-symbols-outlined text-red-600 text-[20px]">
                    {event.icon}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base group-hover:text-red-600 transition-colors">
                  {event.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {event.description}
                </p>

                <div className="pt-2 space-y-1.5 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">schedule</span>
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-600 font-bold uppercase flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {event.registeredCount} Registered
                </span>
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded transition-colors cursor-pointer"
                >
                  Register Free
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Registration Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 relative animate-scaleUp">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {!regSuccess ? (
              <>
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-mono text-red-600 font-bold uppercase block">
                    FREE DELEGATE PASS REGISTRATION
                  </span>
                  <h3 className="font-headline font-bold text-lg text-slate-900 mt-0.5">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedEvent.dateStr} • {selectedEvent.location}
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Delegate Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Anand R. Varma"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98XXX XXXXX"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Email Address (For Pass Dispatch)
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded transition-all cursor-pointer mt-2"
                  >
                    Confirm Free Pass
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-3xl">check</span>
                </div>
                <h3 className="font-headline font-bold text-lg text-slate-900">
                  Delegate Pass Confirmed!
                </h3>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded font-mono text-xs">
                  <span className="text-slate-500 block">Pass Reference ID:</span>
                  <strong className="text-slate-900 text-sm">{regSuccess}</strong>
                </div>
                <p className="text-xs text-slate-600">
                  We look forward to having you at the {selectedEvent.title}. Your pass barcode will be honored at the registration desk.
                </p>
                <button
                  onClick={closeModal}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase rounded cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
