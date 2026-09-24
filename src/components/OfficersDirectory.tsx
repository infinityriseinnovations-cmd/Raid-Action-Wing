import React, { useState, useMemo } from 'react';
import { RawfLogo } from './RawfLogo';

interface Officer {
  id: string;
  name: string;
  designation: string;
  division: 'national' | 'state' | 'legal';
  state: string;
  status: 'ACTIVE' | 'VERIFIED' | 'COMMAND';
  badgeNumber: string;
  photoUrl: string;
  tagText: string;
  tagColor: 'amber' | 'blue' | 'red';
}

const officersList: Officer[] = [
  {
    id: 'DG-CRIME-001',
    name: 'Manoj Chauhan',
    designation: 'Director General (Crime & Vigilance Cell)',
    division: 'national',
    state: 'National HQ - New Delhi',
    status: 'COMMAND',
    badgeNumber: 'DG-CRIME-001',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUm1YEgLpksGzi3w_3gvQPMzQHxeJlPGIDPYSLpaJCRKoYNLLGbcUdrCUKoSaRyfEzL4ATnteKP2TfyzfoAVh1i5Kpa_VmIijrnduQpaY8f3zG3WoGPNJrVYlAkNW10Af4Sgz53Lwkm1nL1Xp2RSJO1N4pId9Ml-OLibxjnYl8ahmBmrReo3ewBqIGmPn5k_MsnyohwJdt7FnnDgVW2dEYGojLicyUTmbxn8Iv-d5fNMODD99vAKO6VQ',
    tagText: 'DG RAWF',
    tagColor: 'amber'
  },
  {
    id: 'RW-MH-102',
    name: 'Sushant Prakash Kagale',
    designation: 'National Investigation Officer (Maharashtra)',
    division: 'state',
    state: 'Maharashtra',
    status: 'ACTIVE',
    badgeNumber: 'RW-MH-102',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMjYeqo0GQGnnVCALTm2YL_ZT1q7UGxG2MHvI0ielMI02SoUfp7g5QqGw__jl2OI9rA6Sv7mczVS2AZSCpxLLApzP9k-GtQQkvcolLJEFLEn0q_ekfnD6hgQW9uX27XF-4IqmYs9v8KrBoJj0nd7Mgd7W5UZ7LU4SxmYgLpGLDoXV0NEAzysp4ytUcxU2NpgRsfAfdOKxindrSxiH2jWNtLsPPEuyWASR5qtfoQHOTyXE9qVDMTYNK9g',
    tagText: 'MAHARASHTRA',
    tagColor: 'blue'
  },
  {
    id: 'RW-GJ-104',
    name: 'Vipul Harshad Bhai Dave',
    designation: 'State Director (Gujarat)',
    division: 'state',
    state: 'Gujarat',
    status: 'ACTIVE',
    badgeNumber: 'RW-GJ-104',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9LpEKtygMH9hqnG8rn8G5GMkabb623q08xiOT4fExKQpAxmXfMBqx50Q421-RJs_RA4EwXpnpRV1vaqisuY9ShWwE_-dlHHp_l7H0umSi-j2VgHBzJmVoOA8AM1QY53nkZJcjRhWa6zUi3jLx9E8P0TfWFCBiNT_4FHSL3zDAFwlNVyyRoC8-tqz0zakISnTxT5kgus_OER8csHXvPU8wcfGQAr0q3CJFHyqhjWApzxGyKoGWR4AVzg',
    tagText: 'GUJARAT',
    tagColor: 'blue'
  },
  {
    id: 'RW-MP-105',
    name: 'Rajesh Shrawan',
    designation: 'State Director (Madhya Pradesh)',
    division: 'state',
    state: 'Madhya Pradesh',
    status: 'ACTIVE',
    badgeNumber: 'RW-MP-105',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzjOJW-0F9kQafL4EqjRAyrLWNV05ZyFI-1wCYRNv9TdnD9-FDOP2WWAjXCkijW26gHb1QNBYfsumpnqHE-Z_PIJjl6A482Zztt2P-Ikxhz3VDSd-hvdGvGBH4yMSpa9Tgze_hoLkmCGJOLdcGpmyxTHe1NkZPopjqRLXPL0dV1a2pl7Z7Ck625nGGdUd4MkhaYG8syU4ZgRlQmgy9bWL1wQ6MhVeIWtYqPxpx4ChjMP1qVWRXnZMwcQ',
    tagText: 'MADHYA PRADESH',
    tagColor: 'blue'
  },
  {
    id: 'RW-NAT-W01',
    name: 'Phalguni Dutta Halder',
    designation: 'National Secretary (Women Cell)',
    division: 'national',
    state: 'National HQ & Eastern Region',
    status: 'VERIFIED',
    badgeNumber: 'RW-NAT-W01',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXFCKE0UX1utOq5DO1VETiwFFYnVuSBEzgwYvyQMsWJwudqom0fj2Hqe7nJMb5IgAf69rwxqcNoZp1AP4JyU1D3DCT42-kalWCBy2XsjlAlP0yDcmnKsxE3xIQ70-bRGNOY_HUXW0kNVO_8LkJysii3DdNQvHuvsjtPFboGrTQ69CMmDUexMKUTIwitMNzdhHpeMz_lA9FCuZBBE-5jm3374Mgi1nD1bSxEwkEKPAMdHfMnlpoOWhCmA',
    tagText: 'WOMEN CELL',
    tagColor: 'red'
  },
  {
    id: 'RW-LEG-001',
    name: 'Shekhar Kumar Nigam',
    designation: 'Chief Legal Advisor & Advocate',
    division: 'legal',
    state: 'Supreme Court & High Courts',
    status: 'VERIFIED',
    badgeNumber: 'RW-LEG-001',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKBCimjG0t1Psi8NaW5y8ZgGe-tVqjZvwsrTMqXJxoHOnsCBW5xp-MEf3kF0BUVI13eU257ZEk5qleDMl-E8-NJyRLA8QXgv87iz2Dmx-cVK15KP9s1NnOfjkkwFhSrq5tOIVOSbqgtI3uGEiXcm-ZVJW3N25MAS-_to6BIFBpa3YVexuhBluhv_4Ws9_slKeyV6QwyacnImqe_0E_7gI8gwvpD-TnyhFzs8d6atjcHjuZucvfY_hl7Q',
    tagText: 'LEGAL DESK',
    tagColor: 'amber'
  },
  {
    id: 'RW-NAT-002',
    name: 'Vishal Nain',
    designation: 'National Deputy Director (India)',
    division: 'national',
    state: 'National HQ',
    status: 'ACTIVE',
    badgeNumber: 'RW-NAT-002',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGi_EgkVKseLfKV27C6HTcNJHIos7qqFDnbT4fbIYckiKs7pgl9QqMBfBTowT-k04KyQblyZl1sjwPyxJzShvNe522AAL5s7eavqteLF80e8tSGaKMDqj-RRKkeVonrebNxuQXeH-52UjEsTMig7eYQSECi4-3gXwKd87FTziON3_mdC6kLlrxnapbxyZsYZ1S16n8-0JJMPgGJqQyITxFHRjUe0JhVOSybtlqvMOVbT_dYawEhfuWXw',
    tagText: 'DEP DIRECTOR',
    tagColor: 'blue'
  },
  {
    id: 'RW-UP-106',
    name: 'Subedar Saroj / Ajay Kumar',
    designation: 'State Incharges (Uttar Pradesh)',
    division: 'state',
    state: 'Uttar Pradesh',
    status: 'ACTIVE',
    badgeNumber: 'RW-UP-106',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmZOpfbug19sIOaInPooKLlPo4DYXaV5nnLv02DzRz_QArFJv5Q-1t2gcJEeD5koEUm6UnK-kn1cyEhQvbNXaLWzSEQyXtP3Jtbb0T8Elu-_riLzGqfiIvwj1uiwzvtfozNAXJizD7PouYEdKymX0-LmpzGs3T-hwi8EXEEwOisQDkfNyhOfVKzlXwRz7iVCIn7eF3eLrqYbVfDzq9ur6fypCfinXowr1DIu_NdhigHdqEVtmhC_h8Vw',
    tagText: 'UTTAR PRADESH',
    tagColor: 'blue'
  }
];

interface OfficersDirectoryProps {
  onVerifyOfficer: (badgeId: string) => void;
}

export const OfficersDirectory: React.FC<OfficersDirectoryProps> = ({ onVerifyOfficer }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'national' | 'state' | 'legal'>('all');
  const [showBlacklistModal, setShowBlacklistModal] = useState(false);

  const filteredOfficers = useMemo(() => {
    return officersList.filter((officer) => {
      const matchesFilter = filterTab === 'all' || officer.division === filterTab;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        officer.name.toLowerCase().includes(q) ||
        officer.designation.toLowerCase().includes(q) ||
        officer.state.toLowerCase().includes(q) ||
        officer.badgeNumber.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, filterTab]);

  return (
    <section className="w-full bg-white py-14 px-4 lg:px-8 border-b border-slate-200" id="officers">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <RawfLogo className="w-10 h-10" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-red-600 block">
                Official Roster & Anti-Fraud System
              </span>
              <h2 className="font-headline font-bold text-2xl lg:text-3xl text-slate-900 uppercase tracking-tight">
                Active Officers & Directorate Command
              </h2>
            </div>
          </div>

          <div>
            <button
              onClick={() => setShowBlacklistModal(true)}
              className="px-3.5 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded border border-red-200 font-bold text-xs uppercase transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">warning</span>
              <span>Check Revoked / Blacklisted Badges</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full md:flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by Name, State (Maharashtra, Gujarat, Uttar Pradesh...), or Designation"
              className="w-full bg-white border border-slate-300 rounded pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1] placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-2 rounded font-bold text-xs uppercase transition-colors cursor-pointer whitespace-nowrap ${
                filterTab === 'all'
                  ? 'bg-[#0d47a1] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
              }`}
            >
              All Roster ({officersList.length})
            </button>
            <button
              onClick={() => setFilterTab('national')}
              className={`px-3 py-2 rounded font-bold text-xs uppercase transition-colors cursor-pointer whitespace-nowrap ${
                filterTab === 'national'
                  ? 'bg-[#0d47a1] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
              }`}
            >
              National Command
            </button>
            <button
              onClick={() => setFilterTab('state')}
              className={`px-3 py-2 rounded font-bold text-xs uppercase transition-colors cursor-pointer whitespace-nowrap ${
                filterTab === 'state'
                  ? 'bg-[#0d47a1] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
              }`}
            >
              State Directors
            </button>
            <button
              onClick={() => setFilterTab('legal')}
              className={`px-3 py-2 rounded font-bold text-xs uppercase transition-colors cursor-pointer whitespace-nowrap ${
                filterTab === 'legal'
                  ? 'bg-[#0d47a1] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
              }`}
            >
              Legal Council
            </button>
          </div>
        </div>

        {/* Officer Cards Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredOfficers.map((officer) => (
            <div
              key={officer.id}
              className="bg-white border-2 border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:border-[#0d47a1] hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                <div className="relative aspect-square w-full bg-slate-100 rounded overflow-hidden border border-slate-200">
                  <img
                    src={officer.photoUrl}
                    alt={officer.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/rawf-logo.svg';
                    }}
                  />
                  <div
                    className={`absolute top-2 right-2 px-2 py-0.5 font-mono text-[9px] font-bold uppercase rounded shadow-2xs ${
                      officer.tagColor === 'amber'
                        ? 'bg-amber-500 text-white'
                        : officer.tagColor === 'red'
                        ? 'bg-red-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {officer.tagText}
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[10px] text-slate-400 uppercase block font-semibold">
                    {officer.badgeNumber}
                  </span>
                  <h4 className="font-headline font-bold text-slate-900 text-base group-hover:text-[#0d47a1] transition-colors">
                    {officer.name}
                  </h4>
                  <p className="text-xs text-slate-600 leading-tight mt-0.5">
                    {officer.designation}
                  </p>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    {officer.state}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-3 flex justify-between items-center text-[10px] font-mono">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {officer.status}
                </span>

                <button
                  onClick={() => onVerifyOfficer(officer.badgeNumber)}
                  className="px-2 py-1 bg-slate-100 hover:bg-[#0d47a1] hover:text-white rounded text-slate-700 font-bold uppercase transition-colors cursor-pointer"
                >
                  Verify Badge
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredOfficers.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
            <span className="material-symbols-outlined text-4xl text-slate-400">person_search</span>
            <h4 className="font-bold text-slate-800 text-sm mt-2">No matching officers found</h4>
            <p className="text-xs text-slate-500 mt-1">Try a different name, state or designation keyword.</p>
          </div>
        )}
      </div>

      {/* Blacklist Advisory Modal */}
      {showBlacklistModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative animate-scaleUp">
            <button
              onClick={() => setShowBlacklistModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-2 text-red-600 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-2xl">warning</span>
              <h3 className="font-headline font-bold text-lg text-slate-900">
                Official Revocation & Anti-Impersonation Notice
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              RAWF issues strict cryptographic photo identity cards to authorized vigilance officers. Any individual soliciting money, bribes, extortion, or claiming executive police search-and-seizure authority is impersonating a RAWF officer in violation of Bharatiya Nyaya Sanhita (BNS) Section 204.
            </p>

            <div className="bg-red-50 border border-red-200 rounded p-3 space-y-1 text-xs">
              <strong className="text-red-700 uppercase font-bold block">
                Revoked / Terminated Credentials
              </strong>
              <div className="font-mono text-slate-700 space-y-0.5">
                <div>• RW-DIS-091 (Terminated for unauthorized conduct)</div>
                <div>• RW-DL-TEMP-44 (Expired probationary badge)</div>
              </div>
            </div>

            <div className="text-xs text-slate-500 leading-normal">
              To immediately report badge fraud or verify unlisted persons, contact the Director General Command desk at <strong className="text-slate-900">1800-RAW-CELL</strong> or email <span className="font-mono text-slate-900">vigilance@raidactionwing.in</span>.
            </div>

            <div className="text-right pt-2">
              <button
                onClick={() => setShowBlacklistModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase rounded cursor-pointer"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
