import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface UpiPaymentCardProps {
  amount?: number;
  note?: string;
  className?: string;
  onPaymentConfirmed?: () => void;
}

export const UPI_ID = '7992102928@ptyes';
export const BENEFICIARY_NAME = 'Chauhan Manoj Munnalal';

export const UpiPaymentCard: React.FC<UpiPaymentCardProps> = ({
  amount,
  note = 'Donation to RAWF',
  className = ''
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('/rawf-donation-qr.png');
  const [copied, setCopied] = useState(false);

  // Generate live UPI payment URL matching NPCI UPI specification
  const upiUrl = amount && amount > 0
    ? `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(BENEFICIARY_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`
    : `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(BENEFICIARY_NAME)}&cu=INR&tn=${encodeURIComponent(note)}`;

  useEffect(() => {
    QRCode.toDataURL(
      upiUrl,
      {
        width: 480,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [upiUrl]);

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`w-full flex flex-col justify-between bg-white border-2 border-slate-200 rounded-xl p-5 shadow-sm select-none ${className}`}>
      {/* Top Beneficiary Header */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            {/* CM Avatar */}
            <div className="w-10 h-10 rounded-full bg-[#bad18b] text-[#3f5724] font-headline font-black text-sm flex items-center justify-center border border-white shadow-2xs shrink-0">
              CM
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="font-headline font-bold text-slate-900 text-sm tracking-tight">
                  {BENEFICIARY_NAME}
                </span>
                <span
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#0070e0] text-white text-[10px] font-bold"
                  title="Verified RAWF Official Beneficiary"
                >
                  ✓
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 block uppercase tracking-wider">
                Director General &amp; Chief Trustee, RAWF
              </span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[9.5px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 block">
              IFA NO. 760
            </span>
            <span className="text-[9px] text-slate-400 font-mono">1882 Trust Act</span>
          </div>
        </div>

        {/* Paytm UPI Styled QR Box */}
        <div className="w-full rounded-xl p-2.5 bg-gradient-to-b from-[#00baf2] via-[#00a2e0] to-[#002970] shadow-xs">
          <div className="w-full bg-white rounded-lg p-3 flex flex-col items-center shadow-inner">
            {/* Paytm UPI Header */}
            <div className="flex items-center justify-center gap-1 mb-2">
              <span className="font-headline font-black text-lg text-[#002970] tracking-tighter">
                paytm
              </span>
              <span className="text-red-500 text-sm">❤</span>
              <span className="font-headline font-black text-lg italic tracking-tight flex items-center">
                <span className="text-[#002970]">U</span>
                <span className="text-[#00baf2]">P</span>
                <span className="text-[#f58220]">I</span>
                <span className="text-[#00a859] -ml-0.5">▶</span>
              </span>
            </div>

            {/* Custom QR Image Display */}
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 bg-white p-1 rounded-md border border-slate-200 flex items-center justify-center shadow-2xs">
              <img
                src={qrDataUrl}
                alt={`Paytm UPI QR - ${UPI_ID}`}
                className="w-full h-full object-contain"
              />
              {amount && amount > 0 && (
                <div className="absolute -top-2 -right-2 bg-emerald-600 text-white font-mono font-black text-[10px] px-2 py-0.5 rounded-full shadow-md border-2 border-white">
                  ₹{amount.toLocaleString('en-IN')}
                </div>
              )}
            </div>

            {/* UPI ID Row */}
            <div className="mt-2.5 flex items-center justify-center gap-1 text-slate-800 font-mono font-bold text-xs">
              <span className="text-[#f58220] font-black text-sm">▶</span>
              <span className="tracking-tight select-all">{UPI_ID}</span>
            </div>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopyUpi}
              className="mt-1 text-[10.5px] font-bold text-[#0d47a1] hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-0.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[12px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied!' : 'Copy UPI ID'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer & Direct App Links */}
      <div className="pt-3 mt-3 border-t border-slate-100 space-y-2.5">
        {/* Scan with any UPI app row */}
        <div className="flex items-center justify-between text-slate-600 text-[10.5px]">
          <span className="font-semibold text-slate-700">Scan with any UPI App:</span>
          <div className="flex items-center gap-2 font-bold text-slate-700 text-[11px]">
            <span className="text-[#002970] font-black">paytm</span>
            <span className="text-[#5f259f]">PhonePe</span>
            <span className="text-slate-800">GPay</span>
            <span className="text-[#002970] font-bold">BHIM</span>
          </div>
        </div>

        {/* Quick Deep Link & Direct Mobile Action */}
        <div className="flex items-center gap-2">
          <a
            href={upiUrl}
            className="flex-1 py-2 px-3 bg-[#002970] hover:bg-[#001f54] text-white rounded-lg font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-[15px]">touch_app</span>
            <span>Open in UPI App</span>
          </a>
          <button
            type="button"
            onClick={handleCopyUpi}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">content_copy</span>
            <span>Copy ID</span>
          </button>
        </div>
      </div>
    </div>
  );
};
