import React, { useState, useEffect } from 'react';
import { certificatesApi, CertificateRecord } from '../services/apiService';
import { INITIAL_CERTIFICATES } from '../data/defaultAdminData';

interface CertificatesPageProps {
  onNavigate: (page: string) => void;
}

export const CertificatesPage: React.FC<CertificatesPageProps> = ({ onNavigate }) => {
  const [certificates, setCertificates] = useState<CertificateRecord[]>(INITIAL_CERTIFICATES);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inspectingCert, setInspectingCert] = useState<CertificateRecord | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Fetch certificates from backend API, fall back to initial data if needed
  useEffect(() => {
    let isMounted = true;
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const res = await certificatesApi.getAll();
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setCertificates(res.data);
        }
      } catch (err) {
        console.warn('Using seeded certificates repository fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCertificates();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter logic
  const filteredCertificates = certificates.filter((cert) => {
    // Only published certificates in public view
    if (cert.status && cert.status !== 'Published') return false;

    const matchesSearch =
      (cert.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cert.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cert.registrationNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cert.issuingAuthority || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      (cert.category && cert.category.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleDownload = (cert: CertificateRecord) => {
    const link = document.createElement('a');
    link.href = cert.fileUrl;
    link.download = cert.fileName || `${cert.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.${cert.fileType === 'pdf' ? 'pdf' : 'jpg'}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = (cert: CertificateRecord) => {
    const fullUrl = window.location.origin + cert.fileUrl;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    });
  };

  return (
    <div className="w-full bg-[#f8fafc] text-slate-800 pb-20">
      {/* 1. Header Banner & Statutory Seal */}
      <section className="relative bg-gradient-to-r from-[#0d47a1] via-[#1565c0] to-[#0a3875] text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500 shadow-lg">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 mb-4">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">home</span>
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-amber-300 font-bold">Official Certificates &amp; Accreditations</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Government of India &amp; Statutory Accreditations</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-headline tracking-tight text-white uppercase leading-tight">
                Statutory Certificates &amp; Institutional Charter
              </h1>
              <p className="text-blue-100 text-sm sm:text-base max-w-3xl leading-relaxed text-justify [text-align-last:left]">
                Public repository of legal registrations, statutory foundational charters, and government accreditations governing the <strong>Raid Action Wing Foundation (RAWF)</strong>. All certificates are published transparently for citizen verification, judicial inquiry, and statutory compliance.
              </p>

              {/* Quick Badge List */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 text-xs">
                <span className="bg-white/10 backdrop-blur-xs border border-white/20 px-3 py-1.5 rounded-md flex items-center gap-1.5 font-mono">
                  <span className="material-symbols-outlined text-amber-400 text-[16px]">workspace_premium</span>
                  <span>MSME: <strong>UP-50-0196301</strong></span>
                </span>
                <span className="bg-white/10 backdrop-blur-xs border border-white/20 px-3 py-1.5 rounded-md flex items-center gap-1.5 font-mono">
                  <span className="material-symbols-outlined text-emerald-400 text-[16px]">verified</span>
                  <span>NITI Aayog: <strong>DL/2021/RAWF</strong></span>
                </span>
                <span className="bg-white/10 backdrop-blur-xs border border-white/20 px-3 py-1.5 rounded-md flex items-center gap-1.5 font-mono">
                  <span className="material-symbols-outlined text-red-400 text-[16px]">gavel</span>
                  <span>Trust Charter: <strong>IFA No. 760</strong></span>
                </span>
                <span className="bg-white/10 backdrop-blur-xs border border-white/20 px-3 py-1.5 rounded-md flex items-center gap-1.5 font-mono">
                  <span className="material-symbols-outlined text-blue-300 text-[16px]">receipt_long</span>
                  <span>IT Act: <strong>12A &amp; 80G Tax Exempt</strong></span>
                </span>
              </div>
            </div>

            {/* Right Emblem Card */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center max-w-sm w-full shadow-2xl relative overflow-hidden">
                <div className="w-20 h-20 mx-auto mb-3 bg-white rounded-full p-2.5 shadow-md flex items-center justify-center">
                  <img src="/rawf-logo.jpg" alt="RAWF Insignia" className="w-full h-full object-contain" />
                </div>
                <h3 className="font-bold text-white text-base uppercase font-headline">National Registry</h3>
                <p className="text-blue-100 text-xs mt-1">
                  100% Validated Document Archive · Section 204 BNS &amp; Indian Trusts Act 1882
                </p>
                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-around text-center text-xs">
                  <div>
                    <span className="block text-amber-300 font-extrabold text-lg">{certificates.length}</span>
                    <span className="text-[11px] text-blue-200">Statutory Charters</span>
                  </div>
                  <div className="w-px h-8 bg-white/20"></div>
                  <div>
                    <span className="block text-emerald-400 font-extrabold text-lg">Active</span>
                    <span className="text-[11px] text-blue-200">Legal Standing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Search & Category Filter Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Title, Registration No, Authority..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0d47a1] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {[
              { id: 'all', label: 'All Certificates' },
              { id: 'government accreditation', label: 'Govt. Accreditations' },
              { id: 'trust charter', label: 'Trust Charters' },
              { id: 'tax exemption', label: 'Tax Orders (12A/80G)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-[#0d47a1] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Certificate Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-headline text-slate-900 uppercase">
              Official Registrations &amp; Charters
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Showing {filteredCertificates.length} verified document{filteredCertificates.length === 1 ? '' : 's'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('activities')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">campaign</span>
              <span className="hidden sm:inline">View Field Activities &amp; Videos</span>
              <span className="sm:hidden">Activities</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-xl border border-slate-200">
            <div className="w-10 h-10 mx-auto rounded-full border-4 border-[#0d47a1] border-t-transparent animate-spin"></div>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              Retrieving verified statutory certificates...
            </p>
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8 space-y-3">
            <span className="material-symbols-outlined text-slate-400 text-5xl">folder_off</span>
            <h3 className="font-bold text-slate-800 text-lg">No matching certificates found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No official documents matched your query. Try resetting your search filters or browse all statutory records.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-[#0d47a1] text-white rounded-lg text-xs font-bold uppercase hover:bg-blue-900 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredCertificates.map((cert) => {
              const isPdf = cert.fileType === 'pdf' || cert.fileUrl.toLowerCase().endsWith('.pdf');
              return (
                <div
                  key={cert.id}
                  className="bg-white rounded-xl border border-slate-200 hover:border-[#0d47a1] hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between group"
                >
                  {/* Card Header Top Strip */}
                  <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        isPdf
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-blue-50 text-[#0d47a1] border border-blue-200'
                      }`}>
                        <span className="material-symbols-outlined text-[15px]">
                          {isPdf ? 'picture_as_pdf' : 'image'}
                        </span>
                        <span>{isPdf ? 'PDF DOCUMENT' : 'CERTIFICATE IMAGE'}</span>
                      </span>

                      {cert.fileSize && (
                        <span className="text-[11px] text-slate-500 font-mono">
                          {cert.fileSize}
                        </span>
                      )}
                    </div>

                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>VERIFIED STATUTORY</span>
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 space-y-4">
                    {/* Visual Preview / Thumbnail Box */}
                    <div
                      onClick={() => setInspectingCert(cert)}
                      className="w-full h-44 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg border border-slate-300 relative overflow-hidden flex items-center justify-center cursor-pointer group-hover:border-[#0d47a1] transition-all"
                    >
                      {isPdf ? (
                        <div className="text-center p-4 space-y-2">
                          <div className="w-14 h-14 mx-auto rounded-xl bg-red-100 text-red-600 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-3xl">picture_as_pdf</span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block truncate max-w-xs mx-auto">
                              {cert.fileName || 'Statutory Official Document.pdf'}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              Click to Inspect Document
                            </span>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={cert.fileUrl}
                          alt={cert.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}

                      {/* Hover Overlay Hint */}
                      <div className="absolute inset-0 bg-[#0d47a1]/75 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider backdrop-blur-2xs">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                        <span>Open Document Lightbox</span>
                      </div>
                    </div>

                    {/* Meta Details */}
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {cert.registrationNumber || 'Statutory Order'}
                        </span>
                        {cert.category && (
                          <span className="text-xs text-slate-500 font-medium">
                            · {cert.category}
                          </span>
                        )}
                      </div>

                      <h3 className="font-headline font-black text-slate-900 text-lg group-hover:text-[#0d47a1] transition-colors">
                        {cert.title}
                      </h3>

                      <p className="text-xs text-slate-600 mt-2 leading-relaxed text-justify [text-align-last:left]">
                        {cert.description}
                      </p>
                    </div>

                    {/* Statutory Metadata Bar */}
                    <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block uppercase font-bold text-[10px]">Issuing Authority</span>
                        <span className="font-semibold text-slate-800 truncate block">
                          {cert.issuingAuthority || 'National Command Secretariat'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block uppercase font-bold text-[10px]">Effective Date</span>
                        <span className="font-mono text-slate-800 block">
                          {cert.issueDate || 'Perpetual Charter'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center gap-2.5">
                    <button
                      onClick={() => setInspectingCert(cert)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#0d47a1] hover:bg-blue-900 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Inspect Document</span>
                    </button>

                    <button
                      onClick={() => handleDownload(cert)}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase transition-all shadow-xs cursor-pointer"
                      title="Download Official File"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#0d47a1]">download</span>
                      <span className="hidden sm:inline">Download</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Statutory Authenticity Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex flex-col sm:flex-row items-start gap-4">
          <div className="p-2.5 bg-amber-100 text-amber-800 rounded-lg shrink-0">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-headline font-bold text-amber-900 text-sm uppercase">
              Statutory Transparency &amp; Direct Verification Mandate
            </h4>
            <p className="text-xs text-amber-800/90 leading-relaxed text-justify [text-align-last:left]">
              All certificates and registration numbers published on this portal are authorized under the constitution of the <strong>Raid Action Wing Foundation (RAWF)</strong> and registered under the Indian Trusts Act 1882 (IFA No. 760). To cross-verify with original government registries (NITI Aayog NGO Darpan or MSME UDYAM Portal), citizens and public bodies may utilize the official registration IDs provided above.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Document Lightbox / Viewer Modal */}
      {inspectingCert && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-white/10 rounded-lg shrink-0">
                  <span className="material-symbols-outlined text-amber-400 text-2xl">
                    {inspectingCert.fileType === 'pdf' ? 'picture_as_pdf' : 'image'}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded">
                      {inspectingCert.registrationNumber || 'Statutory Charter'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                      {inspectingCert.fileName}
                    </span>
                  </div>
                  <h3 className="font-headline font-black text-white text-base sm:text-lg truncate mt-0.5">
                    {inspectingCert.title}
                  </h3>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setInspectingCert(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-3"
                title="Close Lightbox"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Modal Document Viewer Area */}
            <div className="flex-1 bg-slate-100 p-3 sm:p-5 overflow-auto flex items-center justify-center min-h-[420px] max-h-[68vh]">
              {inspectingCert.fileType === 'pdf' || inspectingCert.fileUrl.toLowerCase().endsWith('.pdf') ? (
                <div className="w-full h-full min-h-[500px] flex flex-col bg-white rounded-xl shadow-inner border border-slate-200 overflow-hidden">
                  <iframe
                    src={`${inspectingCert.fileUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                    title={inspectingCert.title}
                    className="w-full flex-1 min-h-[460px] border-0"
                  />
                  <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>Document Viewer: Native PDF Render Engine</span>
                    <a
                      href={inspectingCert.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0d47a1] hover:underline font-bold flex items-center gap-1"
                    >
                      <span>Open in Full Tab</span>
                      <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="max-w-full max-h-full flex items-center justify-center bg-slate-900 rounded-xl overflow-hidden p-2 shadow-inner">
                  <img
                    src={inspectingCert.fileUrl}
                    alt={inspectingCert.title}
                    className="max-h-[60vh] max-w-full object-contain rounded"
                  />
                </div>
              )}
            </div>

            {/* Modal Description & Metadata Details */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-700 shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="line-clamp-2 text-justify [text-align-last:left]">
                  <strong>Statutory Scope:</strong> {inspectingCert.description}
                </p>
                <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono text-slate-500">
                  <span>Authority: <strong>{inspectingCert.issuingAuthority || 'Govt of India'}</strong></span>
                  <span>Date: <strong>{inspectingCert.issueDate || 'Active'}</strong></span>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="bg-white px-5 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyLink(inspectingCert)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {copySuccess ? 'check' : 'link'}
                  </span>
                  <span>{copySuccess ? 'Link Copied!' : 'Copy Direct Link'}</span>
                </button>

                <a
                  href={inspectingCert.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                  <span>Open Full Window</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInspectingCert(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase transition-colors cursor-pointer"
                >
                  Close
                </button>

                <button
                  onClick={() => handleDownload(inspectingCert)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Download Certificate ({inspectingCert.fileType.toUpperCase()})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
