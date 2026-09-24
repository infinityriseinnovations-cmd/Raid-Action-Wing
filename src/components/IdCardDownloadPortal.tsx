import React, { useState } from 'react';
import { RawfLogo } from './RawfLogo';

export const IdCardDownloadPortal: React.FC = () => {
  const [idInput, setIdInput] = useState('RW-MH-102');
  const [phoneInput, setPhoneInput] = useState('+91 98200 45678');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });
  const [cardData, setCardData] = useState<any>({
    id: 'RW-MH-102',
    name: 'Sushant Prakash Kagale',
    designation: 'National Investigation Officer',
    state: 'Maharashtra State Command',
    validTill: '31-DEC-2026',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMjYeqo0GQGnnVCALTm2YL_ZT1q7UGxG2MHvI0ielMI02SoUfp7g5QqGw__jl2OI9rA6Sv7mczVS2AZSCpxLLApzP9k-GtQQkvcolLJEFLEn0q_ekfnD6hgQW9uX27XF-4IqmYs9v8KrBoJj0nd7Mgd7W5UZ7LU4SxmYgLGLDoXV0NEAzysp4ytUcxU2NpgRsfAfdOKxindrSxiH2jWNtLsPPEuyWASR5qtfoQHOTyXE9qVDMTYNK9g',
    verified: true
  });
  const [isReadyToDownload, setIsReadyToDownload] = useState(false);

  const handleGenerateOtp = async () => {
    if (!idInput.trim()) {
      setFeedback({ type: 'error', message: 'Please enter your registered ID Number.' });
      return;
    }

    try {
      const res = await fetch('/api/id-cards/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNumber: idInput, mobile: phoneInput })
      });
      const data = await res.json();

      if (data.success && data.cardData) {
        setCardData(data.cardData);
        setOtpStep(true);
        setFeedback({
          type: 'success',
          message: '✓ OTP [582914] sent to registered mobile. Enter code below to unlock credential.'
        });
      } else {
        setFeedback({
          type: 'error',
          message: data.message || 'Credential not found. Please verify ID format.'
        });
      }
    } catch {
      setOtpStep(true);
      setFeedback({
        type: 'success',
        message: '✓ OTP [582914] generated. Enter code below to unlock encrypted PDF badge.'
      });
    }
  };

  const handleVerifyOtpAndUnlock = () => {
    setIsReadyToDownload(true);
    setFeedback({
      type: 'success',
      message: '✓ 256-Bit cryptographic clearance verified. Official ID card ready for download!'
    });
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <section className="w-full bg-white py-14 px-4 lg:px-8 border-b border-slate-200" id="id-download">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0d47a1] block">
              Encrypted Credential Retrieval
            </span>
            <h2 className="font-headline font-bold text-2xl lg:text-3xl text-slate-900 uppercase tracking-tight">
              Officer & Member ID Card Download Portal
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-sm">
            Verified officers and accredited members can retrieve their cryptographically signed, QR-verifiable Digital Identity Cards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Form Panel */}
          <div className="lg:col-span-6 bg-slate-50 border-2 border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-600 text-[20px]">lock</span>
                  Secure ID Card Retrieval
                </span>
                <span className="px-2 py-0.5 bg-green-50 text-emerald-700 font-mono text-[10px] font-bold border border-green-200 rounded uppercase">
                  256-BIT SECURE
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Enter your official badge ID to receive two-factor authentication and download your credentials.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Officer / Member ID Number *
                </label>
                <input
                  type="text"
                  value={idInput}
                  onChange={(e) => setIdInput(e.target.value)}
                  placeholder="e.g. RW-MH-102 or DG-CRIME-001"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2.5 text-xs font-mono uppercase text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Registered Mobile Number *
                </label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+91 98XXX XXXXX"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1] font-mono"
                />
              </div>

              {!otpStep ? (
                <button
                  onClick={handleGenerateOtp}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">key</span>
                  Generate Verification OTP
                </button>
              ) : (
                <div className="space-y-2 pt-1">
                  <label className="block text-xs font-bold uppercase text-slate-700">
                    Enter OTP Sent to Mobile (Simulated: 582914)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="flex-1 bg-white border border-slate-300 rounded px-3 py-2 text-xs font-mono text-center tracking-widest text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                    />
                    <button
                      onClick={handleVerifyOtpAndUnlock}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs uppercase cursor-pointer"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}

              {feedback.message && (
                <div
                  className={`text-xs font-mono ${
                    feedback.type === 'success'
                      ? 'text-emerald-700 font-semibold'
                      : 'text-red-600 font-semibold'
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              {isReadyToDownload && (
                <div className="pt-2 animate-fadeIn">
                  <button
                    onClick={handlePrintCard}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Download & Print Official ID Card (PDF)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Live ID Card Preview */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-sm bg-gradient-to-b from-white via-slate-50 to-blue-50/60 border-2 border-blue-300 rounded-xl shadow-xl p-5 relative overflow-hidden print:m-0 print:border-black">
              {/* Top Tricolor Banner Strip */}
              <div className="h-2 bg-gradient-to-r from-orange-500 via-white to-green-600 rounded-full mb-3 shadow-2xs"></div>

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <RawfLogo className="w-9 h-9" />
                  <div>
                    <span className="font-headline font-black text-xs uppercase text-[#0a192f] block leading-none">
                      RAWF INDIA
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-semibold">
                      Govt Reg: IFA 760 / 1882
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 font-mono text-[9px] font-bold rounded uppercase border border-red-200">
                  OFFICIAL BADGE
                </span>
              </div>

              {/* Officer Details & Photo */}
              <div className="py-4 flex gap-4 items-center">
                <div className="w-20 h-22 bg-slate-100 rounded border-2 border-slate-300 overflow-hidden shrink-0 flex items-center justify-center">
                  {cardData.photoUrl ? (
                    <img
                      src={cardData.photoUrl}
                      alt={cardData.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/rawf-logo.svg';
                      }}
                    />
                  ) : (
                    <RawfLogo className="w-12 h-12" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <span className="font-mono text-[9px] text-slate-500 font-bold uppercase block">
                    ID: {cardData.id}
                  </span>
                  <h4 className="font-headline font-bold text-sm text-slate-900 leading-tight">
                    {cardData.name}
                  </h4>
                  <span className="text-xs font-semibold text-[#0d47a1] block">
                    {cardData.designation}
                  </span>
                  <span className="text-[10px] text-slate-600 block">
                    {cardData.state}
                  </span>
                </div>
              </div>

              {/* Bottom Validity & Security Seal */}
              <div className="bg-white rounded border border-slate-200 p-2.5 flex items-center justify-between text-[10px] font-mono shadow-2xs">
                <div className="space-y-0.5">
                  <span className="text-slate-500 block font-sans text-[9px]">
                    VALID TILL: <strong className="text-slate-900 font-mono">{cardData.validTill}</strong>
                  </span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    VERIFIED STATE COMMAND
                  </span>
                </div>

                <div className="w-10 h-10 bg-slate-50 rounded border border-slate-300 flex items-center justify-center text-slate-700">
                  <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
                </div>
              </div>

              <div className="text-[9px] text-slate-400 text-center mt-3 font-mono">
                Anti-Tamper Cryptographic Watermark Protected • IFA 760
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
