import React, { useState, useEffect, useRef } from 'react';
import { ALL_INDIAN_LAWS, LawDocument } from '../data/siteData';

interface IndianLawsPageProps {
  onNavigate: (page: string) => void;
}

export const IndianLawsPage: React.FC<IndianLawsPageProps> = ({ onNavigate }) => {
  // Local state for laws, supporting admin updates
  const [laws, setLaws] = useState<LawDocument[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('rawf_custom_laws');
        if (saved) {
          const parsed: LawDocument[] = JSON.parse(saved);
          return ALL_INDIAN_LAWS.map((law) => {
            const override = parsed.find((p) => p.id === law.id);
            return override ? { ...law, ...override } : law;
          });
        }
      } catch (e) {
        console.warn('Failed to parse saved custom laws:', e);
      }
    }
    return ALL_INDIAN_LAWS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Police & Enforcement' | 'Judiciary & Rights' | 'Constitutional'>('All');

  // Modal States
  const [viewingPdfLaw, setViewingPdfLaw] = useState<LawDocument | null>(null);
  const [selectedLawDigest, setSelectedLawDigest] = useState<LawDocument | null>(null);
  const [adminUploadLaw, setAdminUploadLaw] = useState<LawDocument | null>(null);

  // Admin Access State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return Boolean(localStorage.getItem('rawf_admin_token') || localStorage.getItem('rawf_laws_admin'));
    }
    return false;
  });

  useEffect(() => {
    const syncAdminStatus = () => {
      const hasAdmin = Boolean(localStorage.getItem('rawf_admin_token') || localStorage.getItem('rawf_laws_admin'));
      setIsAdmin(hasAdmin);
    };

    syncAdminStatus();
    window.addEventListener('storage', syncAdminStatus);
    window.addEventListener('focus', syncAdminStatus);
    return () => {
      window.removeEventListener('storage', syncAdminStatus);
      window.removeEventListener('focus', syncAdminStatus);
    };
  }, []);

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('rawf_admin_token');
    localStorage.removeItem('rawf_laws_admin');
    setAdminUploadLaw(null);
  };
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');

  // Upload Modal State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save changes to localStorage
  const saveLawsOverride = (updatedLaws: LawDocument[]) => {
    setLaws(updatedLaws);
    try {
      localStorage.setItem('rawf_custom_laws', JSON.stringify(updatedLaws));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  };

  // Direct PDF Download Handler
  const handleDownloadPdf = (law: LawDocument) => {
    const link = document.createElement('a');
    link.href = law.file;
    const filename = law.file.split('/').pop()?.replace(/%20/g, ' ') || `${law.title.replace(/\s+/g, '_')}.pdf`;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Admin Login Handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = adminPasscode.trim();
    if (!clean) {
      setAdminLoginError('Please enter administrator passcode.');
      return;
    }

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'admin@raidactionwing.in',
          password: clean
        })
      });
      const data = await res.json();
      if (data.success && data.token) {
        setIsAdmin(true);
        localStorage.setItem('rawf_admin_token', data.token);
        localStorage.setItem('rawf_laws_admin', 'true');
        setShowAdminLoginModal(false);
        setAdminPasscode('');
        setAdminLoginError('');
        if (adminUploadLaw) {
          setUploadFile(null);
          setUploadFeedback({ type: 'idle', message: '' });
        }
      } else {
        setAdminLoginError(data.message || 'Invalid Administrator Passcode. Access denied.');
      }
    } catch {
      setAdminLoginError('Authentication service unreachable.');
    }
  };

  // Initiate Admin Upload
  const handleInitiateAdminUpload = (law: LawDocument) => {
    if (!isAdmin) {
      setAdminUploadLaw(law);
      setShowAdminLoginModal(true);
    } else {
      setAdminUploadLaw(law);
      setUploadFile(null);
      setUploadFeedback({ type: 'idle', message: '' });
    }
  };

  // Process PDF File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        setUploadFeedback({
          type: 'error',
          message: 'Only PDF documents (.pdf) are permitted.'
        });
        return;
      }
      setUploadFile(file);
      setUploadFeedback({ type: 'idle', message: '' });
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !adminUploadLaw) {
      setUploadFeedback({ type: 'error', message: 'Please select a valid PDF file to upload.' });
      return;
    }

    setUploading(true);
    setUploadFeedback({ type: 'idle', message: '' });

    try {
      // Read file as base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;

        try {
          const res = await fetch('/api/admin/laws/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lawId: adminUploadLaw.id,
              title: adminUploadLaw.title,
              fileName: uploadFile.name,
              pdfBase64: base64Data
            })
          });

          const data = await res.json();

          if (data.success) {
            const updatedLaws = laws.map((l) => {
              if (l.id === adminUploadLaw.id) {
                return {
                  ...l,
                  file: data.fileUrl,
                  fileSize: data.fileSize,
                  summary: l.summary + ' [Updated by Legal Directorate]'
                };
              }
              return l;
            });

            saveLawsOverride(updatedLaws);
            setUploadFeedback({
              type: 'success',
              message: `✓ Successfully uploaded & updated official PDF: ${uploadFile.name} (${data.fileSize})`
            });

            // Update currently selected modal law if open
            if (viewingPdfLaw && viewingPdfLaw.id === adminUploadLaw.id) {
              setViewingPdfLaw({
                ...viewingPdfLaw,
                file: data.fileUrl,
                fileSize: data.fileSize
              });
            }
          } else {
            // Local fallback if server route error
            const blobUrl = URL.createObjectURL(uploadFile);
            const sizeStr = uploadFile.size > 1024 * 1024
              ? `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB`
              : `${Math.round(uploadFile.size / 1024)} KB`;

            const updatedLaws = laws.map((l) => {
              if (l.id === adminUploadLaw.id) {
                return {
                  ...l,
                  file: blobUrl,
                  fileSize: sizeStr
                };
              }
              return l;
            });
            saveLawsOverride(updatedLaws);
            setUploadFeedback({
              type: 'success',
              message: `✓ Applied local document update: ${uploadFile.name} (${sizeStr})`
            });
          }
        } catch {
          // Direct client fallback
          const blobUrl = URL.createObjectURL(uploadFile);
          const sizeStr = uploadFile.size > 1024 * 1024
            ? `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.round(uploadFile.size / 1024)} KB`;

          const updatedLaws = laws.map((l) => {
            if (l.id === adminUploadLaw.id) {
              return {
                ...l,
                file: blobUrl,
                fileSize: sizeStr
              };
            }
            return l;
          });
          saveLawsOverride(updatedLaws);
          setUploadFeedback({
            type: 'success',
            message: `✓ Document updated locally: ${uploadFile.name} (${sizeStr})`
          });
        } finally {
          setUploading(false);
        }
      };

      reader.onerror = () => {
        setUploadFeedback({ type: 'error', message: 'Failed to read the selected PDF file.' });
        setUploading(false);
      };

      reader.readAsDataURL(uploadFile);
    } catch (err: any) {
      setUploadFeedback({ type: 'error', message: err?.message || 'Error uploading file.' });
      setUploading(false);
    }
  };

  // Reset to original raidactionwing.in PDF
  const handleResetToDefault = (lawId: string) => {
    const original = ALL_INDIAN_LAWS.find((l) => l.id === lawId);
    if (!original) return;

    const updatedLaws = laws.map((l) => (l.id === lawId ? original : l));
    saveLawsOverride(updatedLaws);
    setUploadFeedback({
      type: 'success',
      message: `✓ Restored official baseline document from raidactionwing.in repository.`
    });
    if (viewingPdfLaw && viewingPdfLaw.id === lawId) {
      setViewingPdfLaw(original);
    }
  };

  // Filtering
  const filteredLaws = laws.filter((law) => {
    const matchesSearch =
      law.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      law.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      law.file.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategory === 'Police & Enforcement') {
      return law.id.includes('police') || law.id.includes('bail');
    }
    if (activeCategory === 'Judiciary & Rights') {
      return law.id.includes('judiciary') || law.id.includes('harassment');
    }
    if (activeCategory === 'Constitutional') {
      return law.id.includes('constitution');
    }
    return true;
  });

  return (
    <div className="space-y-10 pb-20 min-h-screen bg-slate-50">
      {/* ======================================================== */}
      {/* HEADER BANNER                                            */}
      {/* ======================================================== */}
      <div className="bg-[#0a192f] text-white py-12 px-4 lg:px-8 border-b-4 border-red-600 shadow-md">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <button onClick={() => onNavigate('home')} className="hover:text-white cursor-pointer transition-colors">
                Home
              </button>
              <span>/</span>
              <span className="text-red-400 font-bold">Indian Laws</span>
            </div>

            {/* Admin Access Badge / Toggle - Only shown when active admin */}
            <div className="flex items-center gap-2">
              {isAdmin && (
                <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/60 px-3 py-1.5 rounded-lg text-xs font-mono text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ADMIN ACCESS ACTIVE</span>
                  <button
                    onClick={handleAdminLogout}
                    className="ml-2 text-[10px] text-slate-300 hover:text-white underline cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-red-600 text-white font-mono text-[10px] font-bold rounded uppercase tracking-wider">
                OFFICIAL REPOSITORY &bull; IFA 760
              </span>
              <span className="text-slate-400 text-xs font-mono hidden sm:inline">
                Verified extraction from raidactionwing.in
              </span>
            </div>
            <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white">
              Indian Statutory Laws &amp; Judicial References
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Complete official gazetted laws and statutory references: Supreme Court police rulings, hierarchical judiciary protocols, workplace sexual harassment (POSH), anticipatory bail protections, and bilingual Constitution of India.
            </p>
          </div>

          {/* Quick Stats / Source Verification Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400 text-[18px]">verified</span>
              <div>
                <span className="block text-[10px] text-slate-400">SOURCE PORTAL</span>
                <strong className="text-white">raidactionwing.in</strong>
              </div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-400 text-[18px]">picture_as_pdf</span>
              <div>
                <span className="block text-[10px] text-slate-400">AVAILABLE ACTS</span>
                <strong className="text-white">6 Core Statutory PDFs</strong>
              </div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-[18px]">visibility</span>
              <div>
                <span className="block text-[10px] text-slate-400">PDF VIEWER</span>
                <strong className="text-white">Built-in Reader</strong>
              </div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-[18px]">verified_user</span>
              <div>
                <span className="block text-[10px] text-slate-400">ACCESS LEVEL</span>
                <strong className="text-white">{isAdmin ? 'Admin Clearance' : 'Public Gazette'}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FILTER & SEARCH TOOLBAR                                  */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {(['All', 'Police & Enforcement', 'Judiciary & Rights', 'Constitutional'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#0d47a1] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search statutes, rulings, bails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:border-[#0d47a1] focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">cancel</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* STATUTORY LAWS GRID                                      */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLaws.map((law) => {
            const isCustom = law.summary.includes('[Updated by Legal Directorate]');
            return (
              <div
                key={law.id}
                className="bg-white border-2 border-slate-200 hover:border-[#0d47a1] rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Accent Top Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0d47a1] via-red-600 to-amber-500" />

                <div className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0d47a1] flex items-center justify-center font-bold shadow-2xs group-hover:bg-[#0d47a1] group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">gavel</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        STATUTORY ACT
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isCustom && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded font-mono text-[9px] font-bold uppercase">
                          CUSTOM
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded font-mono text-[10px] font-semibold">
                        {law.fileSize}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="font-headline font-bold text-slate-900 text-lg sm:text-xl group-hover:text-[#0d47a1] transition-colors leading-tight">
                      {law.title}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400 mt-1 truncate" title={law.file}>
                      File: {law.file.split('/').pop()}
                    </p>
                  </div>

                  {/* Summary Overview */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {law.summary}
                  </p>
                </div>

                {/* Bottom Actions Row: View PDF, Download, Admin Upload */}
                <div className="pt-4 border-t border-slate-100 mt-5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* View PDF Button (Primary User Action) */}
                    <button
                      type="button"
                      onClick={() => setViewingPdfLaw(law)}
                      className="px-3 py-1.5 bg-[#0d47a1] hover:bg-blue-900 text-white font-bold uppercase rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-xs shadow-xs"
                      title={`View full PDF file for ${law.title}`}
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>View PDF</span>
                    </button>

                    {/* Direct Download Button */}
                    <button
                      type="button"
                      onClick={() => handleDownloadPdf(law)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 font-bold uppercase rounded-lg flex items-center gap-1 transition-colors cursor-pointer text-xs"
                      title={`Direct download ${law.title} PDF`}
                    >
                      <span className="material-symbols-outlined text-[15px]">download</span>
                      <span className="hidden sm:inline">Download</span>
                    </button>
                  </div>

                  {/* Admin Upload / Replace Button - ONLY SHOWN TO AUTHENTICATED ADMIN */}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleInitiateAdminUpload(law)}
                      className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold uppercase rounded-lg flex items-center gap-1 transition-colors cursor-pointer text-xs"
                      title="Admin Access: Upload or Replace PDF Document"
                    >
                      <span className="material-symbols-outlined text-[15px] text-amber-700">upload_file</span>
                      <span className="text-[11px]">Upload</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredLaws.length === 0 && (
          <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center space-y-3">
            <span className="material-symbols-outlined text-4xl text-slate-400">search_off</span>
            <h4 className="font-bold text-slate-800 text-base">No Statutory Laws Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No acts match your search query "{searchQuery}". Try searching for "Police", "Bail", "POSH", or "Constitution".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold cursor-pointer transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 1. DEDICATED PDF VIEWER MODAL                            */}
      {/* ======================================================== */}
      {viewingPdfLaw && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-6xl h-[94vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold shrink-0">
                  <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-white uppercase tracking-tight truncate leading-tight">
                    {viewingPdfLaw.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono text-slate-300 mt-0.5">
                    <span className="text-red-400 font-bold">OFFICIAL DOCUMENT</span>
                    <span>&bull;</span>
                    <span>{viewingPdfLaw.fileSize}</span>
                    <span>&bull;</span>
                    <span className="truncate max-w-[200px] sm:max-w-md">{viewingPdfLaw.file}</span>
                  </div>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => window.open(viewingPdfLaw.file, '_blank')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold hidden sm:flex items-center gap-1 transition-colors cursor-pointer"
                  title="Open PDF in a new browser tab"
                >
                  <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                  <span>New Tab</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadPdf(viewingPdfLaw)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                  title="Download PDF to computer"
                >
                  <span className="material-symbols-outlined text-[15px]">download</span>
                  <span className="hidden xs:inline">Download</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewingPdfLaw(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Close PDF Viewer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            {/* Modal Body: Embedded PDF View */}
            <div className="flex-1 bg-slate-100 p-2 sm:p-4 flex flex-col relative overflow-hidden">
              <iframe
                src={`${viewingPdfLaw.file}#view=FitH&toolbar=1`}
                className="w-full h-full rounded-xl border border-slate-300 bg-white shadow-inner"
                title={viewingPdfLaw.title}
              />

              {/* Fallback info bar below iframe */}
              <div className="mt-2 bg-white px-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-700 text-[18px]">info</span>
                  <span className="text-[11px]">
                    Viewing official gazetted document from <strong>https://raidactionwing.in</strong>. If viewer is unsupported on mobile:
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.open(viewingPdfLaw.file, '_blank')}
                    className="text-blue-700 hover:underline font-bold text-[11px] cursor-pointer"
                  >
                    Open in Fullscreen
                  </button>
                  {isAdmin && (
                    <>
                      <span>&bull;</span>
                      <button
                        type="button"
                        onClick={() => handleInitiateAdminUpload(viewingPdfLaw)}
                        className="text-amber-700 hover:underline font-bold text-[11px] cursor-pointer flex items-center gap-0.5"
                      >
                        <span className="material-symbols-outlined text-[13px]">upload_file</span>
                        Admin: Replace PDF
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ADMIN PDF UPLOAD MODAL                                */}
      {/* ======================================================== */}
      {adminUploadLaw && !showAdminLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-amber-400 text-[22px]">cloud_upload</span>
                <div>
                  <h3 className="font-bold text-sm sm:text-base uppercase tracking-tight text-white leading-tight">
                    Admin PDF Upload &amp; Replacement
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    STATUTORY LAW REPOSITORY MANAGEMENT
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdminUploadLaw(null)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {/* Upload Form Body */}
            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                  Target Statutory Document:
                </span>
                <strong className="text-slate-900 text-sm block font-headline">
                  {adminUploadLaw.title}
                </strong>
                <span className="text-[11px] font-mono text-slate-500 block truncate">
                  Current: {adminUploadLaw.file} ({adminUploadLaw.fileSize})
                </span>
              </div>

              {/* Drag & Drop File Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#0d47a1] bg-slate-50 hover:bg-blue-50/50 rounded-xl p-6 text-center cursor-pointer transition-colors space-y-2"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,application/pdf"
                  className="hidden"
                />
                <span className="material-symbols-outlined text-4xl text-slate-400">upload_file</span>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    {uploadFile ? uploadFile.name : 'Click to select new PDF or drag and drop'}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {uploadFile
                      ? `Size: ${(uploadFile.size / 1024).toFixed(1)} KB`
                      : 'Accepts official .PDF legal files (up to 150 MB)'}
                  </span>
                </div>
              </div>

              {/* Feedback Alert */}
              {uploadFeedback.message && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    uploadFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {uploadFeedback.type === 'success' ? 'check_circle' : 'error'}
                  </span>
                  <span>{uploadFeedback.message}</span>
                </div>
              )}

              {/* Form Actions */}
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleResetToDefault(adminUploadLaw.id)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  title="Revert back to the baseline PDF extracted from raidactionwing.in"
                >
                  Restore Baseline
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdminUploadLaw(null)}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !uploadFile}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                        <span>Upload &amp; Apply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. ADMIN ACCESS AUTHENTICATION MODAL                     */}
      {/* ======================================================== */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-[20px]">admin_panel_settings</span>
                <h3 className="font-bold text-sm uppercase tracking-tight text-white">
                  Administrator Verification
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAdminLoginModal(false);
                  setAdminLoginError('');
                  setAdminPasscode('');
                }}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAdminLogin} className="p-5 space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Uploading or replacing statutory judicial documents requires Director-level administrative clearance.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Enter Administrator Passcode *
                </label>
                <input
                  type="password"
                  placeholder="Enter passcode..."
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:border-[#0d47a1] focus:bg-white"
                  autoFocus
                />
              </div>

              {adminLoginError && (
                <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <span>{adminLoginError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminLoginModal(false);
                    setAdminLoginError('');
                    setAdminPasscode('');
                  }}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0d47a1] hover:bg-blue-900 text-white rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer shadow-xs"
                >
                  Verify &amp; Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
