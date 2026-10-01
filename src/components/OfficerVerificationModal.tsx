import React, { useState, useEffect } from 'react';
import { RawfLogo } from './RawfLogo';
import { officersApi } from '../services';

interface OfficerVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillCode?: string;
}

export const OfficerVerificationModal: React.FC<OfficerVerificationModalProps> = ({
  isOpen,
  onClose,
  prefillCode
}) => {
  const [code, setCode] = useState(prefillCode || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    verified: boolean;
    isBlacklisted?: boolean;
    officer?: any;
    message?: string;
  } | null>(null);

  useEffect(() => {
    if (prefillCode) {
      setCode(prefillCode);
      verifyCode(prefillCode);
    } else {
      setCode('');
      setResult(null);
    }
  }, [prefillCode, isOpen]);

  const verifyCode = async (searchCode: string) => {
    const raw = String(searchCode || '').trim();
    if (!raw) return;
    setLoading(true);
    setResult(null);

    const clean = raw.toUpperCase();
    const cleanAlnum = clean.replace(/[^A-Z0-9]/g, '');

    // 1. Check Blacklist in Local Storage
    let blacklistRecords: any[] = [];
    try {
      const savedBl = localStorage.getItem('rawf_data_blacklist');
      if (savedBl) blacklistRecords = JSON.parse(savedBl);
    } catch {}

    const defaultBlacklist = [
      { id: 'RW-DIS-091', badgeNumber: 'RW-DIS-091', uidNumber: 'RW-DIS-091', name: 'R. K. Meena', reason: 'Terminated for unauthorized conduct & extortion attempt', status: 'REVOKED & BLACKLISTED' },
      { id: 'RW-DL-TEMP-44', badgeNumber: 'RW-DL-TEMP-44', uidNumber: 'RW-DL-TEMP-44', name: 'Temporary Probationary', reason: 'Expired probationary badge misuse', status: 'REVOKED & BLACKLISTED' }
    ];

    const allBlacklist = Array.isArray(blacklistRecords) && blacklistRecords.length > 0 ? blacklistRecords : defaultBlacklist;

    const blMatch = allBlacklist.find((b: any) => {
      const bBadge = String(b.badgeNumber || b.uidNumber || b.id || '').toUpperCase();
      const bName = String(b.name || '').toUpperCase();
      const bAlnum = bBadge.replace(/[^A-Z0-9]/g, '');
      return bBadge === clean || (cleanAlnum && bAlnum && cleanAlnum === bAlnum) || clean.includes(bBadge) || (clean.length >= 3 && bName.includes(clean));
    });

    if (blMatch) {
      setResult({
        verified: false,
        isBlacklisted: true,
        message: `CRITICAL ALERT: Credential ${blMatch.badgeNumber || blMatch.uidNumber || clean} is REVOKED & BLACKLISTED (${blMatch.reason || 'Code of Ethics Violation'}). Do not engage; report immediately to 1800-RAW-CELL.`
      });
      setLoading(false);
      return;
    }

    // 2. Build local officers lookup pool
    let localOfficers: any[] = [];
    try {
      const saved = localStorage.getItem('rawf_data_officers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) localOfficers = parsed;
      }
    } catch {}

    const defaultOfficersPool = [
      {
        id: 'DG-CRIME-001',
        uidNumber: 'DG-CRIME-001',
        badgeNumber: 'DG-CRIME-001',
        name: 'Manoj Chauhan',
        designation: 'Director General (Crime & Vigilance Cell)',
        division: 'national',
        state: 'National HQ - New Delhi',
        status: 'COMMAND',
        validTill: '31-DEC-2028',
        mandate: 'Supreme statutory oversight, nationwide whistleblower defense, and anti-corruption field taskforce coordination under Bharatiya Nyaya Sanhita (BNS).',
        photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUm1YEgLpksGzi3w_3gvQPMzQHxeJlPGIDPYSLpaJCRKoYNLLGbcUdrCUKoSaRyfEzL4ATnteKP2TfyzfoAVh1i5Kpa_VmIijrnduQpaY8f3zG3WoGPNJrVYlAkNW10Af4Sgz53Lwkm1nL1Xp2RSJO1N4pId9Ml-OLibxjnYl8ahmBmrReo3ewBqIGmPn5k_MsnyohwJdt7FnnDgVW2dEYGojLicyUTmbxn8Iv-d5fNMODD99vAKO6VQ',
        isActive: true
      },
      {
        id: 'RAWF/2026/1376',
        uidNumber: 'RAWF/2026/1376',
        badgeNumber: 'RAWF/2026/1376',
        name: 'Andrew Paul',
        designation: 'District Special Officer',
        division: 'state',
        state: 'Tamil Nadu',
        status: 'ACTIVE',
        validTill: '11-09-2027',
        mandate: 'District Vigilance & Field Taskforce Enforcement',
        photoUrl: '',
        isActive: true
      }
    ];

    const lookupPool = [...localOfficers, ...defaultOfficersPool];

    const matchedLocal = lookupPool.find((o: any) => {
      const oUid = String(o.uidNumber || o.badgeNumber || o.id || '').toUpperCase();
      const oName = String(o.name || o.fullName || '').toUpperCase();
      const oAlnum = oUid.replace(/[^A-Z0-9]/g, '');

      if (oUid === clean) return true;
      if (cleanAlnum && oAlnum && (cleanAlnum === oAlnum || oAlnum.includes(cleanAlnum) || cleanAlnum.includes(oAlnum))) return true;
      if (oUid.includes(clean) || clean.includes(oUid)) return true;
      if (clean.length >= 3 && oName.includes(clean)) return true;
      return false;
    });

    // 3. Query Server API
    try {
      const data = await officersApi.verify(raw);
      if (data && data.verified && data.officer) {
        setResult({
          verified: true,
          officer: {
            ...data.officer,
            ...(matchedLocal || {}),
            photoUrl: data.officer.photoUrl || matchedLocal?.photoUrl || ''
          },
          message: data.message || `VALID OFFICIAL: Verified active officer in national directory.`
        });
        setLoading(false);
        return;
      }
      if (data && data.isBlacklisted) {
        setResult({
          verified: false,
          isBlacklisted: true,
          message: data.message
        });
        setLoading(false);
        return;
      }
    } catch {
      // Server error/network offline, fallback to local match below
    }

    // 4. Use local matched officer if available
    if (matchedLocal) {
      const displayId = matchedLocal.uidNumber || matchedLocal.badgeNumber || matchedLocal.id;
      setResult({
        verified: true,
        officer: {
          id: displayId,
          uidNumber: displayId,
          badgeNumber: displayId,
          name: matchedLocal.name || matchedLocal.fullName,
          designation: matchedLocal.designation || 'Field Officer',
          division: matchedLocal.division || 'state',
          state: matchedLocal.state || 'India Jurisdiction',
          status: matchedLocal.status || 'ACTIVE',
          validTill: matchedLocal.validTill || '11/09/2027',
          mandate: matchedLocal.mandate || 'Citizen Vigilance & Anti-Corruption Oversight',
          photoUrl: matchedLocal.photoUrl || ''
        },
        message: `VALID OFFICIAL: ${matchedLocal.name || matchedLocal.fullName} (UID: ${displayId}) is an authorized, active officer in the National RAWF Roster.`
      });
      setLoading(false);
      return;
    }

    // 5. Not found in blacklist or active directory
    setResult({
      verified: false,
      message: 'ALERT: Credential not found in active directory. Contact National Command Helpline (1800-RAW-CELL) to report impersonation.'
    });
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyCode(code);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs" role="dialog" aria-modal="true" aria-labelledby="verification-modal-title">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative animate-scaleUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
          aria-label="Close verification modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0d47a1] flex items-center justify-center border border-blue-200">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#0d47a1] font-bold uppercase block">
              NATIONAL INTEGRITY PROTOCOL • CENTRAL DESK
            </span>
            <h3 id="verification-modal-title" className="font-headline font-bold text-lg text-slate-900">
              RAWF Officer Verification Desk
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="officer-verification-code-input" className="block text-xs font-bold uppercase text-slate-700">
            Enter Officer UID / Badge / Full Name
          </label>
          <div className="flex gap-2">
            <input
              id="officer-verification-code-input"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. RAWF/2026/1376 or DG-CRIME-001 or Andrew"
              aria-label="Officer identification code, badge number, or full name"
              className="flex-1 bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs font-mono uppercase text-slate-900 focus:outline-none focus:border-[#0d47a1]"
            />
            <button
              type="submit"
              disabled={loading}
              aria-label="Verify officer credentials"
              className="px-4 py-2 bg-[#0d47a1] hover:bg-blue-900 text-white rounded font-bold text-xs uppercase transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              {loading ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span className="material-symbols-outlined text-[16px]">search</span>
              )}
              <span>Verify</span>
            </button>
          </div>
        </form>

        {result && (
          <div className="pt-2 animate-fadeIn">
            {result.verified && result.officer ? (
              <div className="bg-gradient-to-b from-white via-slate-50 to-blue-50/50 border-2 border-emerald-500 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span className="tracking-wide uppercase">AUTHENTICATED RAWF OFFICIAL</span>
                  </div>
                  <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    VALID TILL: {result.officer.validTill}
                  </span>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div className="w-16 h-20 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-300 flex items-center justify-center shadow-xs" data-nosnippet>
                    {result.officer.photoUrl ? (
                      <img
                        src={result.officer.photoUrl}
                        alt="Accredited Personnel"
                        data-nosnippet
                        className="w-full h-full object-cover select-none pointer-events-none"
                        onContextMenu={(e) => e.preventDefault()}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-1 text-slate-400 text-center">
                        <span className="material-symbols-outlined text-3xl">person</span>
                        <span className="text-[8px] font-mono font-bold uppercase mt-0.5">OFFICER</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <span className="font-mono text-[10px] text-[#0d47a1] font-bold block uppercase">
                      UID: {result.officer.uidNumber || result.officer.id || result.officer.badgeNumber}
                    </span>
                    <h4 className="font-headline font-bold text-slate-900 text-base leading-tight">
                      {result.officer.name}
                    </h4>
                    <p className="text-xs text-[#0d47a1] font-semibold leading-tight">
                      {result.officer.designation}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Jurisdiction: <strong>{result.officer.state}</strong>
                    </p>
                    <div className="pt-1">
                      <span className="px-2 py-0.5 font-mono text-[9px] font-bold uppercase rounded bg-emerald-100 text-emerald-800 inline-block">
                        Status: {result.officer.status || 'ACTIVE'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 p-2.5 text-xs space-y-1">
                  <span className="text-[9.5px] font-bold uppercase text-slate-400 block font-mono">
                    STATUTORY FIELD MANDATE
                  </span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {result.officer.mandate || 'Authorized for citizen vigilance, factual audit, and social oversight under Indian Foundation Act 760.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-red-700 font-bold text-sm">
                  <span className="material-symbols-outlined">gpp_bad</span>
                  <span>{result.isBlacklisted ? 'OFFICER REVOKED / BLACKLISTED' : 'CREDENTIAL VERIFICATION FAILED'}</span>
                </div>
                <p className="text-slate-800 leading-normal font-medium">
                  {result.message}
                </p>
                <div className="pt-1 text-[11px] text-slate-600 border-t border-red-200/60 mt-2">
                  Notice: Posing as a public vigilance officer without statutory charter authorization is a cognizable criminal offense under Bharatiya Nyaya Sanhita (BNS) Section 204.
                </div>
              </div>
            )}
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>National Verification Hotline:</span>
          <a href="tel:18007292355" className="font-mono font-bold text-red-600 hover:underline">
            1800-RAW-CELL
          </a>
        </div>
      </div>
    </div>
  );
};
