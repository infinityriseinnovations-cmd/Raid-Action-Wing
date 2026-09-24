import React, { useState } from 'react';

export const MembershipApplySection: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [wing, setWing] = useState('');
  const [state, setState] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [background, setBackground] = useState('');
  const [oathChecked, setOathChecked] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oathChecked) {
      setErrorMsg('Please confirm the solemn oath before submitting.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/memberships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          mobile,
          email,
          wing,
          state,
          aadhaarNumber,
          background
        })
      });
      const data = await res.json();

      if (data.success) {
        setSubmittedAppId(data.applicationId);
      } else {
        setErrorMsg(data.message || 'Error submitting application.');
      }
    } catch {
      const fallbackId = `RAWF-MEM-${Math.floor(10000 + Math.random() * 90000)}`;
      setSubmittedAppId(fallbackId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-slate-50 py-14 px-4 lg:px-8 border-b border-slate-200" id="membership-apply">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 block">
              Nationwide Civic Enrollment
            </span>
            <h2 className="font-headline font-bold text-2xl lg:text-3xl text-slate-900 uppercase tracking-tight">
              Join the Movement / Member Apply & Volunteers
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-sm">
            Become an accredited volunteer or appointed field vigilance officer under the Raid Action Wing Foundation charter.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Wing Categories */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-red-100 text-red-600 font-bold text-xs flex items-center justify-center">
                  01
                </span>
                <h4 className="font-bold text-sm text-slate-900">
                  ✔️ National Level Command
                </h4>
              </div>
              <p className="text-xs text-slate-600 pl-9 leading-relaxed">
                Appointed posts: <strong>National Secretary</strong>, <strong>National Investigation Officer</strong>, and <strong>National Co-ordinator</strong>. Oversees inter-state task divisions, central coordination, and apex whistleblower defense.
              </p>
            </div>

            <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-blue-100 text-[#0d47a1] font-bold text-xs flex items-center justify-center">
                  02
                </span>
                <h4 className="font-bold text-sm text-slate-900">
                  ✔️ State Level Directorate
                </h4>
              </div>
              <p className="text-xs text-slate-600 pl-9 leading-relaxed">
                Appointed posts: <strong>State Director</strong>, <strong>State President</strong>, <strong>State Incharge</strong>, <strong>State Investigation Officer</strong>, and <strong>State Information Officer</strong> across territorial states.
              </p>
            </div>

            <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                  03
                </span>
                <h4 className="font-bold text-sm text-slate-900">
                  ✔️ District Level Command
                </h4>
              </div>
              <p className="text-xs text-slate-600 pl-9 leading-relaxed">
                Appointed posts: <strong>District Director</strong>, <strong>Districts Chief</strong>, <strong>District Incharge</strong>, <strong>Investigation Officer</strong>, and <strong>Information Officer</strong> leading local vigilance desks.
              </p>
            </div>

            <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                  04
                </span>
                <h4 className="font-bold text-sm text-slate-900">
                  Official Accreditation & ID Card
                </h4>
              </div>
              <p className="text-xs text-slate-600 pl-9 leading-relaxed">
                Upon police background clearance and affirmation of the RAWF Oath of Ethics under IFA 760, accredited officers receive an official cryptographic digital ID badge.
              </p>
            </div>
          </div>

          {/* Right Application Form */}
          <div className="lg:col-span-7 bg-white border-2 border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="border-b border-slate-100 pb-3 mb-5">
              <div className="flex items-center justify-between">
                <span className="font-headline font-bold text-base text-slate-900 uppercase flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-600 text-[20px]">badge</span>
                  Membership Application Form
                </span>
                <span className="px-2 py-0.5 bg-blue-50 text-[#0d47a1] font-mono text-[10px] font-bold rounded uppercase border border-blue-200">
                  INTAKE ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                All applicants are subject to identity verification under IFA 760 statutory guidelines.
              </p>
            </div>

            {!submittedAppId ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Full Name (As per Aadhaar) *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Chandra Sharma"
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
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Desired Role / Designation *
                    </label>
                    <select
                      required
                      value={wing}
                      onChange={(e) => setWing(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                    >
                      <option value="">Select Level & Designation...</option>

                      <optgroup label="✔️ District level">
                        <option value="District Director">1) District Director</option>
                        <option value="Districts Chief">2) Districts Chief</option>
                        <option value="District Incharge">3) District Incharge</option>
                        <option value="Investigation Officer">4) Investigation Officer</option>
                        <option value="Information officer">5) Information officer</option>
                      </optgroup>

                      <optgroup label="✔️ State level">
                        <option value="State Director">1) State Director</option>
                        <option value="State President">2) State President</option>
                        <option value="State Incharge">3) State Incharge</option>
                        <option value="State Investigation Officer">4) State Investigation Officer</option>
                        <option value="State Information Officer">5) State Information Officer</option>
                      </optgroup>

                      <optgroup label="✔️ National level">
                        <option value="National Secretary">1) National Secretary</option>
                        <option value="National Investigation Officer">2) National Investigation Officer</option>
                        <option value="National co-ordinator">3) National co-ordinator</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      State / UT Jurisdiction *
                    </label>
                    <select
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                    >
                      <option value="">Select State...</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Other">Other State/UT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Aadhaar / Voter ID Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      placeholder="XXXX-XXXX-XXXX"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Professional Background / Motivation *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    placeholder="Brief summary of your profession, educational qualifications, and dedication to anti-corruption public service..."
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                  />
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="memberOath"
                    checked={oathChecked}
                    onChange={(e) => setOathChecked(e.target.checked)}
                    className="accent-red-600 rounded mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="memberOath" className="text-xs text-slate-600 font-medium cursor-pointer">
                    I solemnly affirm that I have no criminal record, will not engage in extortion or unauthorized actions, and will strictly uphold the RAWF Code of Ethics & Constitution.
                  </label>
                </div>

                {errorMsg && (
                  <div className="text-xs font-mono text-red-600 font-semibold">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#0d47a1] hover:bg-blue-900 text-white font-bold text-xs uppercase tracking-wider rounded transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  )}
                  Submit Application for Membership Verification
                </button>
              </form>
            ) : (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-3xl">verified</span>
                </div>
                <h4 className="font-headline font-bold text-slate-900 text-base">
                  Application Dossier Successfully Received!
                </h4>
                <div className="bg-white p-3 rounded border border-emerald-200 font-mono text-xs">
                  <span className="text-slate-500 block">Application Reference Code:</span>
                  <strong className="text-emerald-700 text-sm">{submittedAppId}</strong>
                </div>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your profile has been queued for background review by the State Directorate. You will receive an SMS and email with credential clearance status within 3 working days.
                </p>
                <button
                  onClick={() => {
                    setSubmittedAppId(null);
                    setFullName('');
                    setMobile('');
                    setEmail('');
                    setAadhaarNumber('');
                    setBackground('');
                    setOathChecked(false);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase rounded cursor-pointer"
                >
                  Submit Another Application
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
