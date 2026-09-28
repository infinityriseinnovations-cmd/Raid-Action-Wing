import React from 'react';
import { RawfLogo } from './RawfLogo';
import { toStandardDisplayDate } from '../utils/dateUtils';

export interface OfficialIdCardData {
  uidNumber?: string;
  badgeNumber?: string;
  name: string;
  gender?: string;
  dob?: string;
  designation: string;
  state?: string;
  division?: string;
  validTill?: string;
  expiryDate?: string;
  joinDate?: string;
  email?: string;
  phoneContact?: string;
  photoUrl?: string;
}

interface OfficialIdCardProps {
  cardData: OfficialIdCardData;
  showBothSides?: boolean;
  side?: 'front' | 'back' | 'both';
  className?: string;
  layout?: 'stacked' | 'side-by-side' | 'auto';
  idPrefix?: string;
}

export const OfficialIdCard: React.FC<OfficialIdCardProps> = ({
  cardData,
  showBothSides = true,
  side = 'both',
  className = '',
  layout = 'auto',
  idPrefix = ''
}) => {
  // Normalize fields to match template exactly
  const uid = cardData.uidNumber || cardData.badgeNumber || 'RAWF/2026/1995';
  const name = cardData.name || 'Akshay Vilas Patil';
  const dob = toStandardDisplayDate(cardData.dob) || '20/12/1995';
  const designation = cardData.designation || 'District Special Officer';
  const state = cardData.state || 'Maharashtra';
  const expiryDate = toStandardDisplayDate(cardData.expiryDate || cardData.validTill) || '11/09/2027';
  const photoUrl =
    cardData.photoUrl ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDUm1YEgLpksGzi3w_3gvQPMzQHxeJlPGIDPYSLpaJCRKoYNLLGbcUdrCUKoSaRyfEzL4ATnteKP2TfyzfoAVh1i5Kpa_VmIijrnduQpaY8f3zG3WoGPNJrVYlAkNW10Af4Sgz53Lwkm1nL1Xp2RSJO1N4pId9Ml-OLibxjnYl8ahmBmrReo3ewBqIGmPn5k_MsnyohwJdt7FnnDgVW2dEYGojLicyUTmbxn8Iv-d5fNMODD99vAKO6VQ';

  // Determine whether to display front / back
  const shouldShowFront = side === 'both' ? showBothSides : side === 'front';
  const shouldShowBack = side === 'both' ? showBothSides : side === 'back';

  // Determine layout class
  const layoutClass =
    layout === 'stacked'
      ? 'flex flex-col gap-6 items-center justify-start'
      : layout === 'side-by-side'
      ? 'flex flex-row gap-6 items-start justify-start flex-nowrap'
      : 'flex flex-col 2xl:flex-row gap-6 items-center justify-center';

  return (
    <div className={`w-full ${className} rawf-printable-id-card-root`}>
      <div className={`${layoutClass} rawf-print-cards-container print:flex-row print:gap-4 print:items-start select-none`}>
        {/* ======================================================== */}
        {/* FRONT SIDE OF ID CARD */}
        {/* ======================================================== */}
        {shouldShowFront && (
          <div
            data-id-card="true"
            data-card-side="front"
            id={`${idPrefix}rawf-card-front`}
            className="print-exact-card relative w-[510px] max-w-full h-[324px] bg-white border-x border-b border-[#333333] shadow-md flex flex-col justify-between shrink-0 overflow-hidden"
            style={{ boxSizing: 'border-box' }}
          >
            {/* 1. TOP HEADER (Blue with Diagonal Red Stripe Slants from Top-Right (100% 0) down to Bottom-Left (0 100%)) */}
            <div className="relative h-[82px] px-3 pt-2 pb-1 flex items-center overflow-hidden shrink-0">
              {/* Precision Vector Diagonal Split: Top-Right (100% 0) to Bottom-Left (0 100%) */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <rect width="100" height="100" fill="#0f3889" />
                <polygon points="100,0 100,100 0,100" fill="#d81820" shapeRendering="geometricPrecision" />
              </svg>

              {/* Header Content with Logo Badge on Left and Center-Aligned Titles */}
              <div className="relative z-10 flex items-center w-full">
                {/* Logo Badge on Left */}
                <div className="w-[62px] h-[66px] bg-white p-0.5 shadow-none shrink-0 flex items-center justify-center overflow-hidden border-r border-slate-200/50">
                  <RawfLogo className="w-full h-full object-contain" />
                </div>

                {/* Center-Aligned Header Titles (Tight standard tracking matching official template) */}
                <div className="flex-1 text-center flex flex-col justify-center items-center px-1">
                  <h2 className="font-sans font-black text-white text-[20.5px] sm:text-[22.5px] tracking-normal uppercase leading-none text-center">
                    RAID ACTION WING (F)
                  </h2>
                  <h3 className="font-id-hindi font-extrabold text-white text-[16.5px] sm:text-[18px] tracking-normal leading-tight mt-1 text-center">
                    छापा कार्यवाही विभाग (एफ)
                  </h3>
                  <div className="font-sans text-[9px] sm:text-[9.8px] font-bold text-white tracking-normal uppercase leading-none mt-1.5 text-center">
                    REGISTERED UNDER GOVERNMENT OF INDIA NUMBER 760
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CARD BODY: PHOTO + DETAILS + CUSTOM QR + SIGNATURE */}
            <div className="px-3.5 pt-2 pb-1.5 flex-1 flex flex-col justify-between bg-white overflow-hidden">
              <div className="flex gap-3.5 items-start">
                {/* Photo Box (Height 154px to fill bottom gap down towards barcode) */}
                <div className="w-[108px] shrink-0 flex flex-col items-center">
                  <div className="w-[108px] h-[154px] bg-slate-100 border border-[#333333] overflow-hidden flex items-center justify-center shadow-2xs" data-nosnippet>
                    <img
                      src={photoUrl}
                      alt="RAWF ID Card Personnel"
                      data-nosnippet
                      className="w-full h-full object-cover object-center select-none"
                      onContextMenu={(e) => e.preventDefault()}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/rawf-logo.jpg';
                      }}
                    />
                  </div>
                </div>

                {/* Content Space & Height from UID No. to Expiry Date (Height 154px to fill bottom gap down towards signature) */}
                <div className="font-id-sans flex-1 h-[154px] flex flex-col justify-between text-black font-bold text-[12.5px] sm:text-[13px] leading-tight">
                  <div className="grid grid-cols-[82px_12px_1fr] items-baseline">
                    <span className="font-id-sans font-bold text-black uppercase">UID No.</span>
                    <span className="font-id-sans font-bold text-black text-center">:</span>
                    <span className="font-id-sans font-bold text-black font-mono tracking-tight break-all">
                      {uid}
                    </span>
                  </div>

                  <div className="grid grid-cols-[82px_12px_1fr] items-baseline">
                    <span className="font-id-sans font-bold text-black">Name</span>
                    <span className="font-id-sans font-bold text-black text-center">:</span>
                    <span className="font-id-sans font-bold text-black">{name}</span>
                  </div>

                  <div className="grid grid-cols-[82px_12px_1fr] items-baseline">
                    <span className="font-id-sans font-bold text-black">D.O.B.</span>
                    <span className="font-id-sans font-bold text-black text-center">:</span>
                    <span className="font-id-sans font-bold text-black">{dob}</span>
                  </div>

                  <div className="grid grid-cols-[82px_12px_1fr] items-baseline">
                    <span className="font-id-sans font-bold text-black">Designation</span>
                    <span className="font-id-sans font-bold text-black text-center">:</span>
                    <span className="font-id-sans font-bold text-black leading-tight">{designation}</span>
                  </div>

                  <div className="grid grid-cols-[82px_12px_1fr] items-baseline">
                    <span className="font-id-sans font-bold text-black">Div / State</span>
                    <span className="font-id-sans font-bold text-black text-center">:</span>
                    <span className="font-id-sans font-bold text-black">{state}</span>
                  </div>

                  <div className="grid grid-cols-[82px_12px_1fr] items-baseline">
                    <span className="font-id-sans font-bold text-black">Expiry Date</span>
                    <span className="font-id-sans font-bold text-black text-center">:</span>
                    <span className="font-id-sans font-bold text-black font-mono">{expiryDate}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Row inside Body: Barcode directly under Photo on Left + Signature on Right */}
              <div className="flex items-end justify-between pt-1">
                {/* Code 128 Barcode directly under photo (Width 108px) */}
                <div className="w-[108px] flex justify-center">
                  <svg className="w-full h-[25px]" viewBox="0 0 108 25" fill="currentColor">
                    <rect x="0" y="0" width="2.5" height="25" fill="#000" />
                    <rect x="4" y="0" width="1.2" height="25" fill="#000" />
                    <rect x="7" y="0" width="3.2" height="25" fill="#000" />
                    <rect x="12" y="0" width="1.8" height="25" fill="#000" />
                    <rect x="15" y="0" width="1" height="25" fill="#000" />
                    <rect x="18" y="0" width="3" height="25" fill="#000" />
                    <rect x="22" y="0" width="1.8" height="25" fill="#000" />
                    <rect x="26" y="0" width="1" height="25" fill="#000" />
                    <rect x="29" y="0" width="3.5" height="25" fill="#000" />
                    <rect x="34" y="0" width="1.8" height="25" fill="#000" />
                    <rect x="38" y="0" width="2.5" height="25" fill="#000" />
                    <rect x="42" y="0" width="1.2" height="25" fill="#000" />
                    <rect x="45" y="0" width="2.8" height="25" fill="#000" />
                    <rect x="50" y="0" width="1.8" height="25" fill="#000" />
                    <rect x="53" y="0" width="3.5" height="25" fill="#000" />
                    <rect x="58" y="0" width="1" height="25" fill="#000" />
                    <rect x="61" y="0" width="3" height="25" fill="#000" />
                    <rect x="66" y="0" width="1.8" height="25" fill="#000" />
                    <rect x="70" y="0" width="3.2" height="25" fill="#000" />
                    <rect x="75" y="0" width="1" height="25" fill="#000" />
                    <rect x="78" y="0" width="2.8" height="25" fill="#000" />
                    <rect x="83" y="0" width="1.8" height="25" fill="#000" />
                    <rect x="87" y="0" width="1.2" height="25" fill="#000" />
                    <rect x="90" y="0" width="3" height="25" fill="#000" />
                    <rect x="95" y="0" width="1.8" height="25" fill="#000" />
                    <rect x="99" y="0" width="3.2" height="25" fill="#000" />
                    <rect x="104" y="0" width="1.8" height="25" fill="#000" />
                  </svg>
                </div>

                {/* Authorised Signature Row (Right-Aligned) */}
                <div className="text-right pr-2">
                  <div className="font-id-sign text-slate-800 text-[18px] sm:text-[20px] leading-none select-none font-bold pr-1">
                    Manoj Chauhan
                  </div>
                  <div className="font-id-sans font-bold text-[#0f3889] text-[10.5px] sm:text-[11.5px] uppercase tracking-tight mt-0.5">
                    Authorised Signatory
                  </div>
                </div>
              </div>
            </div>

            {/* 3. BOTTOM BANNER (Blue and Red split at center vertical line with Yellow Text) */}
            <div className="relative bg-[#0f3889] h-[32px] flex items-center justify-center overflow-hidden shrink-0">
              {/* Equal 50-50 Vertical Split: Left Half Blue, Right Half Red (No Slant) */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#d81820]" />

              {/* Center Yellow Bold Text across the entire banner */}
              <span className="font-id-sans font-bold text-[#ffeb3b] text-[10.5px] sm:text-[11.5px] tracking-[0.03em] uppercase relative z-10 block leading-none px-2 text-center">
                International Organisation Against Crime & Corruption
              </span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BACK SIDE OF ID CARD */}
        {/* ======================================================== */}
        {shouldShowBack && (
          <div
            data-id-card="true"
            data-card-side="back"
            id={`${idPrefix}rawf-card-back`}
            className="print-exact-card relative w-[510px] max-w-full h-[324px] bg-white border-x border-b border-[#333333] shadow-md flex flex-col justify-between shrink-0 overflow-hidden"
            style={{ boxSizing: 'border-box' }}
          >
            {/* Top Section: Red/Blue Titles + Full Width Dual Divider Stripe matching back-header.jpg */}
            <div className="w-full pt-3 px-3 shrink-0">
              <div className="text-center">
                <h2 className="font-sans font-black text-[#d81820] text-[20px] sm:text-[22px] tracking-normal uppercase leading-none text-center">
                  RAID ACTION WING FOUNDATION
                </h2>
                <h3 className="font-id-hindi font-extrabold text-[#0f3889] text-[16.5px] sm:text-[18.5px] tracking-normal leading-tight mt-1 text-center">
                  छापा कार्यवाही विभाग (एफ)
                </h3>
              </div>

              {/* Dual-Color Horizontal Divider Stripe Split at Center Vertical Line (50% Blue, 50% Red) */}
              <div className="mt-2 flex h-[4.5px] w-full">
                <div className="w-1/2 bg-[#0f3889]" />
                <div className="w-1/2 bg-[#d81820]" />
              </div>
            </div>

            {/* Middle Section: Numbered Notes (Evenly fills available vertical space) */}
            <div className="px-5 pt-2 pb-2.5 flex-1 flex flex-col justify-between bg-white text-black overflow-hidden">
              <div className="font-id-sans font-black text-[12.5px] uppercase text-black tracking-wide shrink-0">
                NOTE :
              </div>
              <ol className="font-id-sans flex-1 flex flex-col justify-between pt-1 pb-0.5 text-[11px] sm:text-[11.8px] font-bold leading-[1.38] text-black list-none pl-0">
                <li className="flex items-start gap-1.5">
                  <span className="shrink-0 font-id-sans">1.</span>
                  <span className="font-id-sans">Authenticity of ID Card can be verified from the Head Office.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="shrink-0 font-id-sans">2.</span>
                  <span className="font-id-sans">This card is property of RAWF. If found please send it to the Headquarter.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="shrink-0 font-id-sans">3.</span>
                  <span className="font-id-sans">For Security reasons personal information of the officer is not disclosed.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="shrink-0 font-id-sans">4.</span>
                  <span className="font-id-sans">
                    If any misbehave raised against card holder strict action will initiated as
                    per the laws of RAWF.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="shrink-0 font-id-sans">5.</span>
                  <span className="font-id-sans">RAWF is not responsible for any illegal activity done by officers.</span>
                </li>
              </ol>
            </div>

            {/* Bottom Footer Section (Diagonal Blue & Red Slanted from Top-Right (100% 0) down to Bottom-Left (0 100%)) */}
            <div className="relative text-white py-2 px-3 text-center space-y-[2px] shrink-0 overflow-hidden w-full mt-auto">
              {/* Precision Vector Background: Solid Red base fills seam to red with zero white space; Blue polygon on upper-left has smooth anti-aliased edge */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {/* 100% Red base across the full container ensuring bottom edge is solid red and seam has zero white */}
                <rect width="100" height="100" fill="#d81820" />
                {/* Crisp Blue Upper-Left Triangle (0,0) to (100,0) to (0,100) with smooth geometricPrecision vector edge */}
                <polygon points="0,0 100,0 0,100" fill="#0f3889" shapeRendering="geometricPrecision" />
              </svg>

              {/* 3-line Office Address and Contacts */}
              <div className="font-id-sans font-bold text-[9px] sm:text-[10px] tracking-wide uppercase text-white leading-none relative z-10">
                CENTRAL OFFICE : RAID ACTION WING FOUNDATION
              </div>
              <div className="font-id-sans font-bold text-[8px] sm:text-[9.2px] text-white uppercase leading-none relative z-10">
                CENTRAL OFFICE KIRAN GARDEN VADWA NEW DELHI -110059
              </div>
              <div className="font-id-sans text-[8px] sm:text-[9.2px] text-white font-bold pt-0.5 leading-none relative z-10">
                E-mail: info@raidactionwing.com &nbsp;&nbsp; Website : www.raidactionwing.in
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
