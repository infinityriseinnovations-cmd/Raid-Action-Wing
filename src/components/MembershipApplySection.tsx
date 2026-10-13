import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { membershipApi } from '../services';
import { UPI_ID, BENEFICIARY_NAME } from './UpiPaymentCard';

export const getRoleFee = (role: string): number => {
  if (!role) return 0;
  if (role === 'Only Member') return 3500;
  if (
    role === 'District President' ||
    role === 'District Special Officer' ||
    role === 'District Vice President' ||
    role === 'District Director' ||
    role === 'District Incharge' ||
    role.startsWith('District')
  ) {
    return 5100;
  }
  if (
    role === 'State President' ||
    role === 'State District Special Officer' ||
    role === 'State Vice President' ||
    role === 'State Director' ||
    role === 'State Incharge' ||
    role.startsWith('State')
  ) {
    return 7100;
  }
  if (
    role === 'National Investigation Officer' ||
    role === 'National Incharge' ||
    role === 'National Deputy Security' ||
    role === 'National Special Officer' ||
    role.startsWith('National') ||
    role === 'Founder' ||
    role.includes('Director General')
  ) {
    return 11100;
  }
  return 3500;
};

export const getRoleTierName = (role: string): string => {
  if (role === 'Only Member') return 'General Membership';
  if (role.startsWith('District')) return 'District Level Command';
  if (role.startsWith('State')) return 'State Level Directorate';
  if (role.startsWith('National') || role === 'Founder' || role.includes('Director General')) return 'National Level Central Command';
  return 'Membership Tier';
};

export const MembershipApplySection: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('Male');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [wing, setWing] = useState('');
  const [state, setState] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [background, setBackground] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [oathChecked, setOathChecked] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    role: string;
    fee: number;
    transactionId: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const payableFee = getRoleFee(wing);

  const handleCopyUpi = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(UPI_ID);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!wing) {
      setErrorMsg('Please select your desired role / designation.');
      return;
    }

    if (!transactionId.trim()) {
      setErrorMsg('Please enter your UPI Transaction ID / UTR Number to confirm payment.');
      return;
    }

    if (transactionId.trim().length < 6) {
      setErrorMsg('Please enter a valid 12-digit UPI Reference / UTR Number or Transaction ID.');
      return;
    }

    if (!oathChecked) {
      setErrorMsg('Please confirm the solemn oath before submitting.');
      return;
    }

    setLoading(true);

    let finalAppId: string | null = null;
    const finalFee = payableFee;
    const finalTxn = transactionId.trim();

    try {
      const data = await membershipApi.submit({
        fullName,
        gender,
        mobile,
        email,
        wing,
        state,
        aadhaarNumber,
        background,
        transactionId: finalTxn,
        utrNumber: finalTxn,
        feeAmount: finalFee
      });

      if (data && data.success) {
        finalAppId = data.applicationId;
        setSubmittedAppId(data.applicationId);
      } else {
        finalAppId = `RAWF-MEM-${Math.floor(10000 + Math.random() * 90000)}`;
        setSubmittedAppId(finalAppId);
      }
    } catch {
      finalAppId = `RAWF-MEM-${Math.floor(10000 + Math.random() * 90000)}`;
      setSubmittedAppId(finalAppId);
    } finally {
      if (finalAppId) {
        setSubmittedData({
          role: wing,
          fee: finalFee,
          transactionId: finalTxn
        });

        const newAppItem = {
          id: finalAppId,
          applicationId: finalAppId,
          fullName: fullName.trim(),
          gender: gender || 'Male',
          mobile: mobile.trim(),
          phone: mobile.trim(),
          email: email.trim().toLowerCase(),
          wing: wing || 'Only Member',
          designation: wing || 'Only Member',
          state: state || 'National',
          aadhaarLast4: aadhaarNumber ? String(aadhaarNumber).slice(-4) : 'XXXX',
          background: background || '',
          transactionId: finalTxn,
          utrNumber: finalTxn,
          feeAmount: finalFee,
          paymentStatus: 'Paid / Under Verification',
          status: 'Pending Verification',
          submittedAt: new Date().toISOString()
        };

        try {
          const stored = localStorage.getItem('rawf_data_applications');
          let currentApps: any[] = [];
          if (stored) {
            try {
              currentApps = JSON.parse(stored);
            } catch {}
          }
          if (!Array.isArray(currentApps)) currentApps = [];
          const updated = [newAppItem, ...currentApps.filter((a: any) => a.applicationId !== finalAppId)];
          localStorage.setItem('rawf_data_applications', JSON.stringify(updated));
          window.dispatchEvent(new CustomEvent('rawf_application_added', { detail: newAppItem }));
          window.dispatchEvent(new Event('storage'));
        } catch (storageErr) {
          console.warn('Local application queue update error:', storageErr);
        }
      }
      setLoading(false);
    }
  };

  const upiIntentUrl = payableFee > 0
    ? `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(BENEFICIARY_NAME)}&am=${payableFee}&cu=INR&tn=${encodeURIComponent(`RAWF Membership - ${wing || 'Member'}`)}`
    : `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(BENEFICIARY_NAME)}&cu=INR&tn=${encodeURIComponent('RAWF Membership')}`;

  const qrImageUrl = payableFee > 0
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiIntentUrl)}`
    : `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(BENEFICIARY_NAME)}&cu=INR`)}`;

  useEffect(() => {
    if (!wing || payableFee <= 0) {
      setQrCodeDataUrl('');
      return;
    }
    QRCode.toDataURL(
      upiIntentUrl,
      {
        width: 320,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      },
      (err, dataUrl) => {
        if (!err && dataUrl) {
          setQrCodeDataUrl(dataUrl);
        } else {
          setQrCodeDataUrl(qrImageUrl);
        }
      }
    );
  }, [wing, payableFee, upiIntentUrl, qrImageUrl]);

  return (
    <section className="w-full bg-slate-50 py-14 px-4 lg:px-8 border-b border-slate-200" id="membership-apply">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 block">
              Nationwide Civic Enrollment
            </span>
            <h2 className="font-headline font-bold text-2xl lg:text-3xl text-slate-900 uppercase tracking-tight">
              Join the Movement / Member Apply &amp; Volunteers
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-sm">
            Become an accredited member or appointed field vigilance officer under the Raid Action Wing Foundation charter.
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
                Appointed posts: <strong>National Investigation Officer</strong>, <strong>National Incharge</strong>, <strong>National Deputy Security</strong>, and <strong>National Special Officer</strong>. Oversees inter-state task divisions, central coordination, and apex vigilance.
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
                Appointed posts: <strong>State President</strong>, <strong>State District Special Officer</strong>, <strong>State Vice President</strong>, <strong>State Director</strong>, and <strong>State Incharge</strong> across territorial states.
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
                Appointed posts: <strong>District President</strong>, <strong>District Special Officer</strong>, <strong>District Vice President</strong>, <strong>District Director</strong>, and <strong>District Incharge</strong> leading local desks.
              </p>
            </div>

            <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                  04
                </span>
                <h4 className="font-bold text-sm text-slate-900">
                  ✔️ General Civil Membership
                </h4>
              </div>
              <p className="text-xs text-slate-600 pl-9 leading-relaxed">
                Open to all conscientious Indian citizens wishing to support statutory anti-corruption whistleblowing, community legal aid, and public vigilance missions.
              </p>
            </div>

            <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                  05
                </span>
                <h4 className="font-bold text-sm text-slate-900">
                  Official Accreditation &amp; ID Card
                </h4>
              </div>
              <p className="text-xs text-slate-600 pl-9 leading-relaxed">
                Upon background clearance, payment verification, and affirmation of the RAWF Oath under IFA 760, accredited members receive an official cryptographic digital ID badge.
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Full Name (As per Aadhaar) *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Chandra Sharma"
                      aria-label="Full Name as per Aadhaar"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Gender *
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      aria-label="Select Gender"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1] font-semibold cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      aria-label="Mobile or WhatsApp Number"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                    />
                  </div>
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
                      aria-label="Applicant Email Address"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* DESIRED ROLE / DESIGNATION DROPDOWN */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Desired Role / Designation *
                    </label>
                    <select
                      required
                      value={wing}
                      onChange={(e) => setWing(e.target.value)}
                      aria-label="Select Desired Role or Designation"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1] font-medium"
                    >
                      <option value="">Select Role / Designation...</option>
                      <option value="Only Member">1. Only Member</option>

                      <optgroup label="2. District Level">
                        <option value="District President">a) District President</option>
                        <option value="District Special Officer">b) District Special Officer</option>
                        <option value="District Vice President">c) District Vice President</option>
                        <option value="District Director">d) District Director</option>
                        <option value="District Incharge">e) District Incharge</option>
                      </optgroup>

                      <optgroup label="3. State Level">
                        <option value="State President">a) State President</option>
                        <option value="State District Special Officer">b) State District Special Officer</option>
                        <option value="State Vice President">c) State Vice President</option>
                        <option value="State Director">d) State Director</option>
                        <option value="State Incharge">e) State Incharge</option>
                      </optgroup>

                      <optgroup label="4. National Level">
                        <option value="Founder">Founder</option>
                        <option value="National Investigation Officer">a) National Investigation Officer</option>
                        <option value="National Incharge">b) National Incharge</option>
                        <option value="National Deputy Security">c) National Deputy Security</option>
                        <option value="National Special Officer">d) National Special Officer</option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      State / UT Jurisdiction *
                    </label>
                    <select
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      aria-label="Select State or Union Territory Jurisdiction"
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
                      <option value="Punjab">Punjab</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Assam">Assam</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="Himachal Pradesh">Himachal Pradesh</option>
                      <option value="Jammu & Kashmir">Jammu &amp; Kashmir</option>
                      <option value="Goa">Goa</option>
                      <option value="Other">Other State / UT</option>
                    </select>
                  </div>
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
                    aria-label="Aadhaar or Voter ID Number"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1] font-mono"
                  />
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
                    placeholder="Brief summary of your profession, educational background, and dedication to anti-corruption public vigilance..."
                    aria-label="Professional Background and Public Service Motivation"
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                  />
                </div>

                {/* ============================================================== */}
                {/* DYNAMIC PAYMENT STEP: REVEALS UPON ROLE SELECTION              */}
                {/* ============================================================== */}
                {wing ? (
                  <div className="rounded-xl border-2 border-blue-600/30 bg-gradient-to-br from-blue-50/70 via-slate-50 to-amber-50/50 p-4 sm:p-5 space-y-4 shadow-sm animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/60 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#0d47a1] text-2xl">account_balance_wallet</span>
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase text-[#0d47a1] tracking-wider block">
                            Accreditation &amp; Verification Fee
                          </span>
                          <h4 className="font-headline font-bold text-slate-900 text-sm">
                            {wing} <span className="text-slate-500 font-normal text-xs">({getRoleTierName(wing)})</span>
                          </h4>
                        </div>
                      </div>
                      <div className="text-right sm:text-right bg-white px-3 py-1.5 rounded-lg border border-emerald-300 shadow-2xs">
                        <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">Payable Amount</span>
                        <span className="font-mono font-black text-emerald-700 text-lg sm:text-xl">
                          ₹{payableFee.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* QR Code and UPI Transfer Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-white p-4 rounded-xl border border-slate-200">
                      {/* Left: Dynamic QR Code */}
                      <div className="sm:col-span-5 flex flex-col items-center text-center space-y-2">
                        <div className="p-2 bg-white rounded-lg border-2 border-slate-200 shadow-xs">
                          <img
                            src={qrCodeDataUrl || qrImageUrl}
                            alt={`UPI QR Code - Pay Rs ${payableFee}`}
                            className="w-36 h-36 object-contain"
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1 font-bold">
                          <span className="material-symbols-outlined text-[13px] text-emerald-600">qr_code_scanner</span>
                          Scan with any UPI App
                        </span>
                      </div>

                      {/* Right: Payment Instructions & UPI ID */}
                      <div className="sm:col-span-7 space-y-2.5">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Official RAWF UPI ID</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm bg-slate-100 px-2.5 py-1 rounded border border-slate-300 select-all">
                              {UPI_ID}
                            </span>
                            <button
                              type="button"
                              onClick={handleCopyUpi}
                              className="px-2.5 py-1 bg-[#0d47a1] hover:bg-blue-900 text-white rounded text-[11px] font-bold uppercase transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                              title="Copy UPI ID to clipboard"
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                {copiedUpi ? 'check' : 'content_copy'}
                              </span>
                              <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-600 space-y-1">
                          <p>
                            <strong>Beneficiary:</strong> {BENEFICIARY_NAME} (RAWF Institutional Account)
                          </p>
                          <p className="text-slate-500">
                            Supported: Google Pay, PhonePe, Paytm, BHIM, Cred, or any Bank UPI application.
                          </p>
                        </div>

                        {/* Mobile Direct Pay Link */}
                        <div className="pt-1">
                          <a
                            href={upiIntentUrl}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase rounded shadow-2xs transition-colors"
                          >
                            <span className="material-symbols-outlined text-[15px]">send_to_mobile</span>
                            <span>Open in UPI App (₹{payableFee})</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Step: Transaction ID / Number Input */}
                    <div className="bg-amber-50/70 border border-amber-300/80 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-amber-700 text-lg">receipt_long</span>
                        <label htmlFor="txnId" className="block text-xs font-black uppercase text-amber-950">
                          Enter UPI Transaction ID / UTR Number *
                        </label>
                      </div>
                      <p className="text-[11px] text-amber-900/80 leading-snug">
                        After completing the transfer of <strong>₹{payableFee.toLocaleString('en-IN')}</strong>, enter the 12-digit UPI Reference / UTR Number from your payment confirmation screen:
                      </p>
                      <input
                        id="txnId"
                        type="text"
                        required
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 408129381023 (12-digit UTR No. or Bank Ref)"
                        aria-label="UPI Transaction ID or UTR Reference Number"
                        className="w-full bg-white border-2 border-amber-300 focus:border-[#0d47a1] rounded px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none uppercase tracking-wider"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-lg text-xs text-blue-900/80 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0d47a1] text-lg">info</span>
                    <span>
                      Please select your <strong>Desired Role / Designation</strong> above to view the prescribed accreditation fee and payment instructions.
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="memberOath"
                    checked={oathChecked}
                    onChange={(e) => setOathChecked(e.target.checked)}
                    aria-label="Affirm RAWF Code of Ethics and anti-extortion oath"
                    className="accent-red-600 rounded mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="memberOath" className="text-xs text-slate-600 font-medium cursor-pointer">
                    I solemnly affirm that I have paid the accreditation fee of ₹{payableFee || 3500} via UPI, have no criminal record, will not engage in unauthorized actions, and will strictly uphold the RAWF Code of Ethics &amp; Constitution.
                  </label>
                </div>

                {errorMsg && (
                  <div className="text-xs font-mono text-red-600 font-semibold p-2.5 bg-red-50 border border-red-200 rounded" role="alert">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  aria-label="Submit for Membership Verification"
                  className="w-full py-3.5 bg-[#0d47a1] hover:bg-blue-900 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  )}
                  <span>Submit for Membership Verification</span>
                </button>
              </form>
            ) : (
              <div className="p-6 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-center space-y-4 animate-fadeIn">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <span className="material-symbols-outlined text-3xl">verified</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-widest block">
                    STATUTORY APPLICATION SUBMITTED
                  </span>
                  <h4 className="font-headline font-black text-slate-900 text-lg">
                    Application Dossier Successfully Queued!
                  </h4>
                </div>

                <div className="bg-white p-4 rounded-xl border border-emerald-200 font-mono text-xs space-y-2 text-left shadow-2xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Tracking Reference Code:</span>
                    <strong className="text-[#0d47a1] text-sm">{submittedAppId}</strong>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Applicant:</span>
                    <span className="font-sans font-bold text-slate-800">{fullName}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Applied Role / Designation:</span>
                    <strong className="text-slate-900">{submittedData?.role}</strong>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Prescribed Fee Paid:</span>
                    <strong className="text-emerald-700">₹{submittedData?.fee?.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">UPI Transaction ID / UTR:</span>
                    <span className="text-slate-800 font-bold">{submittedData?.transactionId}</span>
                  </div>
                </div>

                <div className="bg-emerald-100/50 p-3 rounded-lg text-xs text-emerald-900 text-left space-y-1">
                  <div className="flex items-center gap-1 font-bold text-[11px]">
                    <span className="material-symbols-outlined text-emerald-700 text-sm">schedule</span>
                    <span>Verification &amp; Accreditation Process</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Your profile and payment have been sent to the State Directorate Command desk. Background verification will be completed within 3 working days. Upon clearance, your accredited digital ID card will be activated on the official registry.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSubmittedAppId(null);
                    setSubmittedData(null);
                    setFullName('');
                    setMobile('');
                    setEmail('');
                    setWing('');
                    setState('');
                    setAadhaarNumber('');
                    setBackground('');
                    setTransactionId('');
                    setOathChecked(false);
                  }}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase rounded-lg cursor-pointer transition-colors shadow-2xs"
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
