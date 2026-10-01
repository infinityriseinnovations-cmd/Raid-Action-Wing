import React, { useState, useEffect, useMemo } from 'react';
import { RawfLogo } from './RawfLogo';

export interface DirectoryOfficer {
  id: string | number;
  name: string;
  designation: string;
  division?: string;
  state: string;
  status?: string;
  badgeNumber?: string;
  uidNumber?: string;
  photoUrl?: string;
  tagText?: string;
  tagColor?: 'amber' | 'blue' | 'red';
  isAssigned?: boolean;
}

interface OfficersDirectoryProps {
  onVerifyOfficer: (badgeId: string) => void;
}

const mapOfficerRecord = (o: any): DirectoryOfficer => {
  const displayUid = o.uidNumber || o.badgeNumber || String(o.id || '');
  const stateStr = o.state || 'National HQ';
  const tag = o.tagText || (stateStr ? stateStr.split(/[-–,]/)[0].trim().toUpperCase() : 'COMMAND');

  return {
    id: o.id || displayUid,
    name: o.name || o.fullName || 'Officer',
    designation: o.designation || 'Field Officer',
    division: o.division || 'state',
    state: stateStr,
    status: o.status || 'ACTIVE',
    badgeNumber: displayUid,
    uidNumber: displayUid,
    photoUrl: o.photoUrl || '',
    tagText: tag,
    tagColor: o.division === 'legal' ? 'amber' : o.status === 'COMMAND' ? 'amber' : 'blue',
    isAssigned: o.isAssigned !== false && o.assigned !== false
  };
};

export const OfficersDirectory: React.FC<OfficersDirectoryProps> = ({ onVerifyOfficer }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showBlacklistModal, setShowBlacklistModal] = useState(false);

  // Initialize ONLY from actual active officers stored in roster
  const [officersList, setOfficersList] = useState<DirectoryOfficer[]>(() => {
    try {
      const saved = localStorage.getItem('rawf_data_officers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const assignedOnly = parsed
            .filter((o: any) => o.isAssigned === true || (o.isAssigned !== false && o.assigned !== false))
            .map(mapOfficerRecord);
          return assignedOnly;
        }
      }
    } catch {}

    // Fallback to real roster defaults if initial storage empty
    return [
      mapOfficerRecord({
        id: 'RAWF/2026/1376',
        uidNumber: 'RAWF/2026/1376',
        badgeNumber: 'RAWF/2026/1376',
        name: 'Andrew Paul',
        designation: 'District Special Officer',
        division: 'state',
        state: 'Tamil Nadu',
        status: 'ACTIVE',
        photoUrl: '',
        isAssigned: true
      })
    ];
  });

  // Dynamically synchronize assigned officers strictly from the active roster
  useEffect(() => {
    const syncAssignedOfficers = async () => {
      try {
        let activeRoster: any[] = [];

        // 1. Primary Source of Truth: Active Officers Roster in Local Storage
        const localSaved = localStorage.getItem('rawf_data_officers');
        if (localSaved) {
          const parsed = JSON.parse(localSaved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            activeRoster = parsed;
          }
        }

        // 2. Secondary check: Fetch from server API
        try {
          const res = await fetch('/api/officers');
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.data) && data.data.length > 0) {
              if (activeRoster.length === 0) {
                activeRoster = data.data;
              } else {
                activeRoster = activeRoster.map((localOff) => {
                  const match = data.data.find(
                    (s: any) =>
                      String(s.uidNumber || s.id).toUpperCase() ===
                      String(localOff.uidNumber || localOff.id).toUpperCase()
                  );
                  return match ? { ...localOff, ...match, photoUrl: localOff.photoUrl || match.photoUrl } : localOff;
                });
              }
            }
          }
        } catch {}

        if (activeRoster.length > 0) {
          const assignedOnly = activeRoster
            .filter((o) => {
              const isAssigned = o.isAssigned === true || (o.isAssigned !== false && o.assigned !== false);
              const isNotRevoked = o.status !== 'REVOKED & BLACKLISTED';
              return isAssigned && isNotRevoked;
            })
            .map(mapOfficerRecord);

          setOfficersList(assignedOnly);
        } else {
          setOfficersList([]);
        }
      } catch (err) {
        console.warn('Error syncing assigned officers:', err);
      }
    };

    syncAssignedOfficers();

    const handleUpdate = () => syncAssignedOfficers();
    window.addEventListener('rawf_officers_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('rawf_officers_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Supreme Directorate Command (Founder: Manoj Chauhan)
  const supremeCommander = useMemo(() => {
    const foundInRoster = officersList.find(
      (o) =>
        (o.name && o.name.toLowerCase().includes('manoj chauhan')) ||
        o.designation.toLowerCase().includes('founder') ||
        (o.uidNumber && (o.uidNumber.toUpperCase().includes('DG-CRIME') || o.uidNumber.toUpperCase().includes('RAW/2023/001'))) ||
        (o.badgeNumber && (o.badgeNumber.toUpperCase().includes('DG-CRIME') || o.badgeNumber.toUpperCase().includes('RAW/2023/001')))
    );
    if (foundInRoster) {
      return {
        ...foundInRoster,
        designation: foundInRoster.designation || 'Founder'
      };
    }

    return {
      id: 'RAW/2023/001',
      uidNumber: 'RAW/2023/001',
      badgeNumber: 'RAW/2023/001',
      name: 'Manoj Chauhan',
      designation: 'Founder',
      division: 'national',
      state: 'National HQ - New Delhi',
      status: 'COMMAND',
      photoUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDUm1YEgLpksGzi3w_3gvQPMzQHxeJlPGIDPYSLpaJCRKoYNLLGbcUdrCUKoSaRyfEzL4ATnteKP2TfyzfoAVh1i5Kpa_VmIijrnduQpaY8f3zG3WoGPNJrVYlAkNW10Af4Sgz53Lwkm1nL1Xp2RSJO1N4pId9Ml-OLibxjnYl8ahmBmrReo3ewBqIGmPn5k_MsnyohwJdt7FnnDgVW2dEYGojLicyUTmbxn8Iv-d5fNMODD99vAKO6VQ',
      tagText: 'FOUNDER',
      tagColor: 'amber' as const,
      isAssigned: true
    };
  }, [officersList]);

  // Assigned Subordinate / Field Officers (excluding Founder to avoid duplication)
  const subordinateOfficers = useMemo(() => {
    return officersList.filter(
      (o) =>
        !o.designation.toLowerCase().includes('founder') &&
        !(o.name && o.name.toLowerCase().includes('manoj chauhan')) &&
        o.uidNumber !== supremeCommander.uidNumber &&
        o.badgeNumber !== supremeCommander.badgeNumber
    );
  }, [officersList, supremeCommander]);

  const filteredOfficers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return subordinateOfficers;
    return subordinateOfficers.filter((officer) => {
      return (
        officer.name.toLowerCase().includes(q) ||
        officer.designation.toLowerCase().includes(q) ||
        officer.state.toLowerCase().includes(q) ||
        (officer.badgeNumber && officer.badgeNumber.toLowerCase().includes(q)) ||
        (officer.uidNumber && officer.uidNumber.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, subordinateOfficers]);

  return (
    <section className="w-full bg-white py-14 px-4 lg:px-8 border-b border-slate-200" id="officers">
      <div className="max-w-7xl mx-auto space-y-7">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <RawfLogo className="w-10 h-10" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-red-600 block">
                Official Roster &amp; Anti-Fraud System
              </span>
              <h2 className="font-headline font-bold text-2xl lg:text-3xl text-slate-900 uppercase tracking-tight">
                Active Officers &amp; Directorate Command
              </h2>
            </div>
          </div>

          <div>
            <button
              onClick={() => setShowBlacklistModal(true)}
              className="px-3.5 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded border border-red-200 font-bold text-xs uppercase transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              aria-label="Check Revoked and Blacklisted Badges"
            >
              <span className="material-symbols-outlined text-[16px]">warning</span>
              <span>Check Revoked / Blacklisted Badges</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SUPREME COMMAND: FOUNDER (MANOJ CHAUHAN)                       */}
        {/* Displayed prominently above the search box                     */}
        {/* ============================================================== */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-gradient-to-br from-slate-950 via-[#071d3a] to-[#0a2540] text-white p-5 sm:p-7 shadow-xl shadow-slate-950/20">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-36 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Header Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20 pb-3 mb-5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-lg">military_tech</span>
              <span className="font-mono text-[11px] sm:text-xs font-black tracking-widest text-amber-400 uppercase">
                Supreme Directorate Command
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 border border-amber-400/50 text-amber-300 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold inline-flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                FOUNDER
              </span>
              <span className="bg-blue-500/20 border border-blue-400/40 text-blue-300 px-2.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase">
                NATIONAL HQ
              </span>
            </div>
          </div>

          {/* Commander Profile Layout */}
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Commander Photo with Executive Gold Frame */}
            <div className="relative shrink-0 group">
              <div className="relative w-32 h-40 sm:w-36 sm:h-44 rounded-xl overflow-hidden border-2 border-amber-400/80 shadow-2xl bg-slate-900 ring-4 ring-amber-400/20">
                {supremeCommander.photoUrl ? (
                  <img
                    src={supremeCommander.photoUrl}
                    alt={supremeCommander.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none select-none"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.parentElement?.querySelector('[data-dg-avatar-fallback]');
                      if (fallback) (fallback as HTMLElement).style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  data-dg-avatar-fallback="true"
                  style={{ display: supremeCommander.photoUrl ? 'none' : 'flex' }}
                  className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-amber-300/70 p-2 text-center"
                >
                  <span className="material-symbols-outlined text-5xl">shield_person</span>
                  <span className="text-[10px] font-mono font-bold uppercase mt-1">FOUNDER</span>
                </div>

                {/* Bottom Gold Ribbon */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-mono text-[9px] font-black uppercase text-center py-0.5 tracking-wider shadow-md">
                  FOUNDER • SUPREME COMMAND
                </div>
              </div>

              {/* Floating Shield Seal */}
              <div className="absolute -bottom-2 -right-2 bg-slate-950 border-2 border-amber-400 rounded-full p-1 shadow-lg text-amber-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
            </div>

            {/* Officer Details & Authority */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded">
                    UID: {supremeCommander.uidNumber || supremeCommander.badgeNumber || 'RAW/2023/001'}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-amber-300 bg-amber-500/15 border border-amber-400/40 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-amber-400">verified</span>
                    Founder &amp; Life Trustee
                  </span>
                </div>
                <h3 className="font-headline font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                  {supremeCommander.name}
                </h3>
                <p className="text-amber-300 font-bold text-sm sm:text-base mt-0.5 flex items-center justify-center md:justify-start gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-amber-400">workspace_premium</span>
                  <span>Founder</span>
                </p>
                <span className="text-xs text-slate-300 flex items-center justify-center md:justify-start gap-1.5 mt-1 font-medium">
                  <span className="material-symbols-outlined text-[15px] text-amber-400">assured_workload</span>
                  <span>Supreme Directorate Command • National Headquarters, New Delhi</span>
                </span>
              </div>

              {/* Mandate Description */}
              <div className="bg-slate-900/60 border-l-3 border-amber-400 rounded-r-lg p-3 text-xs text-slate-200/90 leading-relaxed text-left space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-400 text-sm">stars</span>
                  <strong className="text-amber-300 font-mono text-[10px] uppercase">
                    Founder Mandate &amp; Supreme Authority:
                  </strong>
                </div>
                <p className="text-slate-300">
                  Chief Architect and Founder of Raid Action Wing Foundation under statutory IFA 760 Charter. Directing nationwide whistleblower protection protocols, apex anti-corruption taskforces, public fraud eradication, and statutory coordination with central investigative bodies across India.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <button
                  onClick={() => onVerifyOfficer(supremeCommander.uidNumber || supremeCommander.badgeNumber || 'RAW/2023/001')}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase rounded transition-all shadow-md inline-flex items-center gap-1.5 cursor-pointer"
                  aria-label={`Verify credentials for Founder ${supremeCommander.name}`}
                >
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span>Verify Founder Credentials</span>
                </button>

                <a
                  href="#grievance"
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded font-bold text-xs uppercase transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">campaign</span>
                  <span>Direct Escalation to Founder Desk</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SEARCH BOX & ACTIVE FIELD OFFICERS SECTION                     */}
        {/* Placed immediately below the Director General card             */}
        {/* ============================================================== */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assigned officers by Name, State (Tamil Nadu, Maharashtra...), or Designation..."
              aria-label="Filter roster by Name, State, or Designation"
              className="w-full bg-white border border-slate-300 rounded pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1] placeholder:text-slate-400"
            />
          </div>
          <div className="text-xs font-mono font-bold text-slate-600 uppercase whitespace-nowrap px-2">
            Assigned Field Officers: <span className="text-[#0d47a1]">{filteredOfficers.length}</span> {filteredOfficers.length === 1 ? 'Officer' : 'Officers'}
          </div>
        </div>

        {/* Officer Cards Grid - Assigned Field Officers */}
        {filteredOfficers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredOfficers.map((officer) => {
              const displayBadge = officer.uidNumber || officer.badgeNumber || String(officer.id);
              return (
                <div
                  key={officer.id}
                  className="bg-white border-2 border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:border-[#0d47a1] hover:shadow-md transition-all group"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-square w-full bg-slate-100 rounded overflow-hidden border border-slate-200" data-nosnippet>
                      {officer.photoUrl ? (
                        <img
                          src={officer.photoUrl}
                          alt={`Official RAWF Personnel ${officer.name}`}
                          data-nosnippet
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 pointer-events-none select-none"
                          onContextMenu={(e) => e.preventDefault()}
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.parentElement?.querySelector('[data-card-avatar-fallback]');
                            if (fallback) (fallback as HTMLElement).style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        data-card-avatar-fallback="true"
                        style={{ display: officer.photoUrl ? 'none' : 'flex' }}
                        className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-2 text-center"
                      >
                        <span className="material-symbols-outlined text-[54px] text-slate-400 notranslate select-none">
                          person
                        </span>
                        <span className="text-[9px] font-mono uppercase font-bold text-slate-500 mt-1 select-none">
                          RAWF OFFICER
                        </span>
                      </div>

                      <div
                        className={`absolute top-2 right-2 px-2 py-0.5 font-mono text-[9px] font-bold uppercase rounded shadow-2xs ${
                          officer.tagColor === 'amber'
                            ? 'bg-amber-500 text-white'
                            : officer.tagColor === 'red'
                            ? 'bg-red-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {officer.tagText || 'OFFICER'}
                      </div>
                    </div>

                    <div>
                      <span className="font-mono text-[10px] text-slate-400 uppercase block font-semibold">
                        {displayBadge}
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
                      {officer.status || 'ACTIVE'}
                    </span>

                    <button
                      onClick={() => onVerifyOfficer(displayBadge)}
                      className="px-2 py-1 bg-slate-100 hover:bg-[#0d47a1] hover:text-white rounded text-slate-700 font-bold uppercase transition-colors cursor-pointer"
                      aria-label={`Verify badge credentials for ${officer.name}`}
                    >
                      Verify Badge
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-14 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <span className="material-symbols-outlined text-4xl text-slate-400">shield_person</span>
            <h4 className="font-bold text-slate-800 text-sm">
              {searchQuery ? 'No matching field officers found' : 'No Additional Field Officers Assigned'}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {searchQuery
                ? 'Try a different name, state, or designation keyword.'
                : 'Any field officers assigned in the National Active Officers Roster via the Command Admin Console will be showcased here.'}
            </p>
          </div>
        )}
      </div>

      {/* Blacklist Advisory Modal */}
      {showBlacklistModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs" role="dialog" aria-modal="true" aria-labelledby="blacklist-modal-title">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative animate-scaleUp">
            <button
              onClick={() => setShowBlacklistModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
              aria-label="Close blacklisted badges notice modal"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-2 text-red-600 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-2xl">warning</span>
              <h3 id="blacklist-modal-title" className="font-headline font-bold text-lg text-slate-900">
                Official Revocation &amp; Anti-Impersonation Notice
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
                aria-label="Close revocation advisory notice"
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
