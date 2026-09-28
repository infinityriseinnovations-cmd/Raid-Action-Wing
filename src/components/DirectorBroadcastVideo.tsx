import React, { useState, useEffect, useRef } from 'react';

interface DirectorBroadcastVideoProps {
  onApplyClick?: () => void;
  onVerifyClick?: () => void;
  className?: string;
}

const SUBTITLE_CUES = [
  { time: 0, hi: "नमस्कार! रेड एक्शन विंग फाउंडेशन के राष्ट्रीय डायरेक्टर श्री नीलेश ठाकर जी आप सभी का स्वागत करते हैं।", en: "Greetings! Shri Nilesh Thakar, National Director of Raid Action Wing Foundation, welcomes you all." },
  { time: 8, hi: "रेड एक्शन विंग फाउंडेशन इंडियन ट्रस्ट एक्ट 1882 और मिनिस्ट्री ऑफ कॉर्पोरेट अफेयर्स के तहत पंजीकृत है।", en: "RAWF is registered under Indian Trusts Act 1882 & Ministry of Corporate Affairs." },
  { time: 19, hi: "नीति आयोग के साथ एमएसएमई में भी रजिस्टर्ड है रेड एक्शन विंग फाउंडेशन।", en: "Registered with NITI Aayog Darpan and MSME UDYAM." },
  { time: 29, hi: "आईएसओ 9001 और 26000 से भी सर्टिफाइड है रेड एक्शन विंग फाउंडेशन।", en: "ISO 9001 and ISO 26000 certified citizen oversight foundation." },
  { time: 38, hi: "मुख्य उद्देश्य अपराध रोकने में एडमिनिस्ट्रेशन का सहयोग करना और समाज में सुरक्षा को बढ़ावा देना है।", en: "Our objective: assist administration in curbing crime and foster citizen safety." },
  { time: 47, hi: "फाउंडेशन से जुड़ने पर आपको आईडी कार्ड, अपॉइंटमेंट लेटर, वॉकी-टॉकी और दो टी-शर्ट्स प्रदान की जाएगी।", en: "On joining: accredited ID card, official appointment letter, walkie-talkie & 2 uniform T-shirts provided." },
  { time: 57, hi: "सबसे महत्वपूर्ण: स्टेट या नेशनल लेवल पर जुड़ने से आपकी जॉइनिंग फीस 6 महीने बाद वापस कर दी जाएगी।", en: "Crucial mandate: for state/national postings, joining fees are refundable after 6 months." },
  { time: 67, hi: "अधिक जानकारी के लिए फाउंडेशन की वेबसाइट देखें या 8530341193 पर संपर्क करें।", en: "For more details, visit raidactionwing.in or dial national helpline +91 8530341193." },
  { time: 76, hi: "धन्यवाद! जय हिंद, जय भारत!", en: "Thank you! Jai Hind, Jai Bharat!" }
];

export const DirectorBroadcastVideo: React.FC<DirectorBroadcastVideoProps> = ({
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>('/director-broadcast.mp4');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(82);
  const [showCaptions, setShowCaptions] = useState(false);
  const [captionLang, setCaptionLang] = useState<'hi' | 'en'>('hi');
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);

  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Check admin status and video availability
  useEffect(() => {
    const adminToken = localStorage.getItem('rawf_admin_token');
    setIsAdmin(Boolean(adminToken));

    fetch('/api/broadcast-video')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.exists && data.url) {
          setVideoSrc(data.url);
        }
      })
      .catch(() => {});
  }, [isOpen]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleCloseModal = () => {
    if (videoElementRef.current) {
      videoElementRef.current.pause();
    }
    setIsOpen(false);
  };

  const handleOpenModal = () => {
    const adminToken = localStorage.getItem('rawf_admin_token');
    setIsAdmin(Boolean(adminToken));
    setIsOpen(true);
  };

  // Admin-Only: Replace Video File
  const handleAdminFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local blob URL for immediate preview
    const blobUrl = URL.createObjectURL(file);
    setVideoSrc(blobUrl);
    setUploadLoading(true);
    setUploadMsg('Admin: Saving replacement video to server...');

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const res = await fetch('/api/broadcast-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoBase64: base64Data })
        });
        const data = await res.json();
        if (data.success && data.url) {
          setVideoSrc(data.url);
          setUploadMsg('✓ Video successfully updated and saved on server!');
        } else {
          setUploadMsg('Video loaded for current session.');
        }
      } catch {
        setUploadMsg('Video loaded locally.');
      } finally {
        setUploadLoading(false);
        setTimeout(() => setUploadMsg(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const activeCue = [...SUBTITLE_CUES].reverse().find((c) => currentTime >= c.time) || SUBTITLE_CUES[0];

  return (
    <>
      {/* ======================================================== */}
      {/* 1. HOMEPAGE ACTION BANNER (NO LOGO ON THUMBNAIL)         */}
      {/* ======================================================== */}
      <div
        className={`relative rounded-xl overflow-hidden border-2 border-slate-300 shadow-md group bg-slate-950 cursor-pointer transition-all hover:border-[#0d47a1] hover:shadow-xl ${className}`}
        onClick={handleOpenModal}
        title="Click to Watch Official Broadcast by National Director Shri Nilesh Thakar"
      >
        {/* Main Thumbnail Vector Graphic / Image (NO LOGO) */}
        <div className="relative w-full h-52 sm:h-56 bg-slate-900 overflow-hidden">
          <img
            src="/nilesh-thakar-video-thumb.svg"
            alt="Official Welcome & Mandate Broadcast by Shri Nilesh Thakar, National Director, Raid Action Wing Foundation (RAWF)"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          />

          {/* Top Live Tag */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
            <span className="px-2 py-0.5 bg-red-600 text-white font-mono text-[10px] font-black rounded uppercase tracking-wider flex items-center gap-1 shadow-xs animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              OFFICIAL BROADCAST
            </span>
            <span className="px-2 py-0.5 bg-black/80 backdrop-blur-xs text-amber-300 font-mono text-[10px] font-bold rounded">
              01:22 MIN
            </span>
          </div>

          {/* Central Pulsing Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-red-700 transition-all border-2 border-white/90">
              <span className="material-symbols-outlined text-[32px] sm:text-[36px] ml-1">play_arrow</span>
            </div>
          </div>

          {/* Lower Gradient & Direct Speaker Tag (NO LOGO) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent flex flex-col justify-end p-3 text-white pointer-events-none">
            <div className="mb-0.5">
              <span className="text-xs font-bold font-headline uppercase tracking-wide text-amber-300 block leading-tight">
                श्री नीलेश ठाकर — राष्ट्रीय डायरेक्टर, RAWF
              </span>
              <span className="text-[10px] text-slate-300 line-clamp-1">
                National Directive on Anti-Crime Collaboration &amp; Whistleblower Mandate
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-slate-300">
              <span className="text-slate-300 font-mono">
                Indian Trust Act 1882 Reg. No. 760
              </span>
              <span className="text-amber-400 font-bold uppercase underline">
                Watch Address ▶
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. VIDEO BROADCAST PLAYER POPUP MODAL                    */}
      {/* ======================================================== */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn"
          onClick={(e) => {
            // Click outside the modal box to close
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div className="bg-slate-950 border-2 border-slate-700 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden relative space-y-0 my-auto flex flex-col animate-scaleUp">
            {/* PROMINENT TOP-RIGHT CLOSE BUTTON */}
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 z-30 px-3 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs uppercase rounded-full shadow-2xl flex items-center gap-1 cursor-pointer transition-all border border-white/30"
              title="Close Video Popup (Esc)"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
              <span>CLOSE</span>
            </button>

            {/* Broadcast Top Bar */}
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between pr-24">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="px-2 py-0.5 bg-red-600 text-white font-mono text-[10px] font-black rounded uppercase tracking-wider flex items-center gap-1 animate-pulse shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  LIVE ON AIR
                </span>
                <div className="leading-tight">
                  <h3 className="font-headline font-bold text-sm sm:text-base text-white">
                    National Director Address — Shri Nilesh Thakar
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400 block sm:inline">
                    Raid Action Wing Foundation • Ministry of Corporate Affairs &amp; NITI Aayog
                  </span>
                </div>
              </div>
            </div>

            {/* Video Player Display Screen (Direct Native Audio & Video) */}
            <div className="relative w-full aspect-video bg-black overflow-hidden flex items-center justify-center">
              <video
                ref={videoElementRef}
                src={videoSrc}
                poster="/nilesh-thakar-video-thumb.svg"
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain bg-black"
                onTimeUpdate={(e) => {
                  const target = e.currentTarget;
                  setCurrentTime(target.currentTime);
                  if (target.duration) setDuration(target.duration);
                }}
              />

              {/* Optional Synchronized Subtitles Overlay */}
              {showCaptions && (
                <div className="absolute bottom-16 left-4 right-4 z-20 pointer-events-none">
                  <div className="bg-black/85 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 text-center max-w-2xl mx-auto shadow-2xl">
                    <span className="text-[10px] font-mono text-amber-400 uppercase block font-bold mb-0.5">
                      [CAPTION • {captionLang === 'hi' ? 'HINDI' : 'ENGLISH'}]
                    </span>
                    <p className="text-xs sm:text-sm font-sans font-semibold text-white leading-snug">
                      {captionLang === 'hi' ? activeCue.hi : activeCue.en}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Bar Controls & Secondary Actions */}
            <div className="bg-slate-900 border-t border-slate-800 p-3 sm:p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Left: Subtitles & Helpline */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCaptions(!showCaptions)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1 cursor-pointer transition-all ${
                      showCaptions ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title="Toggle Subtitles"
                  >
                    <span className="material-symbols-outlined text-[16px]">subtitles</span>
                    <span>CC</span>
                  </button>

                  {showCaptions && (
                    <button
                      onClick={() => setCaptionLang(captionLang === 'hi' ? 'en' : 'hi')}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-mono font-bold uppercase cursor-pointer"
                      title="Switch Subtitle Language"
                    >
                      {captionLang === 'hi' ? 'हिंदी (HI)' : 'ENGLISH (EN)'}
                    </button>
                  )}

                  <a
                    href="tel:8530341193"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs uppercase flex items-center gap-1 cursor-pointer shadow-xs transition-all ml-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">call</span>
                    <span>Call 8530341193</span>
                  </a>
                </div>

                {/* Right: ADMIN ONLY 'Replace Video' Button & Bottom Close Button */}
                <div className="flex items-center gap-2">
                  {/* ADMIN ONLY: Replace Video Option */}
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/40 rounded-lg text-xs font-bold uppercase flex items-center gap-1 cursor-pointer transition-all"
                        title="Admin Authorized: Replace broadcast video with a new file (.mp4, .webm)"
                      >
                        <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                        <span>Replace Video (Admin)</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        className="hidden"
                        onChange={handleAdminFileUpload}
                      />
                    </>
                  )}

                  {/* Prominent Close Player Button */}
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer border border-slate-600 transition-all shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                    <span>Close Player</span>
                  </button>
                </div>
              </div>

              {uploadMsg && (
                <div className="text-[11px] font-mono text-amber-300 bg-slate-800 px-3 py-1.5 rounded flex items-center justify-between border border-amber-500/30">
                  <span>{uploadMsg}</span>
                  {uploadLoading && <span className="animate-spin text-xs">⏳</span>}
                </div>
              )}
            </div>

            {/* Bottom Mandate Details from Speech */}
            <div className="bg-slate-950 border-t border-slate-800 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex items-start gap-2">
                <span className="material-symbols-outlined text-amber-400 text-lg">badge</span>
                <div>
                  <span className="font-bold text-white block">Official Credentials</span>
                  <span className="text-[11px] text-slate-400">ID Card, Appointment Letter, Walkie-Talkie &amp; 2 T-Shirts provided.</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-lg">currency_rupee</span>
                <div>
                  <span className="font-bold text-white block">Joining Fee Refund</span>
                  <span className="text-[11px] text-slate-400">Joining fee is 100% refundable after 6 months of state/national mandate.</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex items-start gap-2">
                <span className="material-symbols-outlined text-blue-400 text-lg">verified_user</span>
                <div>
                  <span className="font-bold text-white block">Govt Reg. No. 760</span>
                  <span className="text-[11px] text-slate-400">Trust Act 1882, MCA, MSME &amp; NITI Aayog accredited.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
