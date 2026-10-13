import React, { useState } from 'react';
import { RawfLogo } from './RawfLogo';
import {
  INITIAL_QUOTATION_DATA,
  QuotationDetails,
  calculateQuotationTotals
} from '../data/quotationData';
import { downloadQuotationDocx } from '../utils/quotationDocxGenerator';

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({ isOpen, onClose }) => {
  const [quotationData, setQuotationData] = useState<QuotationDetails>(INITIAL_QUOTATION_DATA);
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'breakdown' | 'terms'>('preview');

  if (!isOpen) return null;

  const totals = calculateQuotationTotals(quotationData.modules, discountPercent);

  const handleDownloadWord = async () => {
    try {
      setDownloading(true);
      setDownloadSuccess(false);
      await downloadQuotationDocx(
        quotationData,
        discountPercent,
        `RAWF_Website_Quotation_${quotationData.quotationNumber.replace(/\//g, '_')}.docx`
      );
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate docx:', err);
      // Fallback to server route
      window.location.href = '/api/download/quotation-docx';
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-scaleUp my-auto">
        {/* Modal Top Bar */}
        <div className="bg-[#0a192f] text-white px-5 sm:px-7 py-4 border-b-4 border-red-600 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <RawfLogo className="w-10 h-10 bg-white rounded p-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-base sm:text-lg uppercase text-white">
                  Commercial Proposal &amp; Technical Quotation
                </span>
                <span className="px-2 py-0.5 bg-blue-600 text-white font-mono text-[10px] font-bold rounded">
                  DOCX READY
                </span>
              </div>
              <span className="text-xs font-mono text-slate-300 block">
                Ref: {quotationData.quotationNumber} • Valid: {quotationData.validUntil}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Word Button */}
            <button
              onClick={handleDownloadWord}
              disabled={downloading}
              className="px-4 py-2 bg-[#2b579a] hover:bg-[#1e3e70] active:scale-95 text-white font-bold text-xs uppercase rounded-lg flex items-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50"
              title="Download formal quotation as Microsoft Word (.docx)"
            >
              {downloading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[18px]">description</span>
              )}
              <span>{downloading ? 'Generating DOCX...' : 'Download Word (.docx)'}</span>
            </button>

            {/* Print Button */}
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Print document or save as PDF"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-full cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        {/* Tab Controls & Discount Selector */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-7 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-md font-bold text-xs uppercase transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-[#0f3889] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Quotation Overview
            </button>
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`px-3 py-1.5 rounded-md font-bold text-xs uppercase transition-all cursor-pointer ${
                activeTab === 'breakdown'
                  ? 'bg-[#0f3889] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Itemized Modules ({quotationData.modules.length})
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-3 py-1.5 rounded-md font-bold text-xs uppercase transition-all cursor-pointer ${
                activeTab === 'terms'
                  ? 'bg-[#0f3889] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Milestones &amp; Terms
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500 font-semibold">Institutional Subsidy:</span>
            <div className="flex items-center gap-1">
              {[0, 5, 10, 15].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setDiscountPercent(pct)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono transition-colors cursor-pointer ${
                    discountPercent === pct
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {downloadSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 font-bold flex items-center justify-between shrink-0 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
              <span>Microsoft Word document (.docx) generated and downloaded successfully!</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 uppercase">Save to Documents / Share</span>
          </div>
        )}

        {/* Scrollable Document Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-slate-800 text-xs sm:text-sm bg-white">
          {/* TAB 1: PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              {/* Document Header Banner */}
              <div className="border-b-2 border-slate-200 pb-5 text-center space-y-1">
                <h1 className="font-headline font-black text-xl sm:text-2xl text-[#0f3889] uppercase tracking-wide">
                  RAID ACTION WING FOUNDATION (RAWF)
                </h1>
                <p className="font-bold text-xs uppercase tracking-wider text-red-600">
                  International Organisation Against Crime &amp; Corruption
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  Statutory Registration: IFA No. 760 (Indian Trusts Act 1882) • NITI Aayog Darpan: DL/2021/0285220
                </p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 bg-slate-900 text-white text-xs font-bold uppercase rounded-full">
                    Official Commercial Proposal &amp; Engineering Quotation
                  </span>
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                  <span className="text-[10px] font-bold text-[#0f3889] uppercase block font-mono">
                    CLIENT / RECIPIENT:
                  </span>
                  <div className="font-bold text-slate-900 text-base">{quotationData.clientOrganization}</div>
                  <div className="text-xs text-slate-700">{quotationData.clientName}</div>
                  <div className="text-[11px] text-slate-500">{quotationData.clientDesignation}</div>
                  <div className="text-[10px] text-slate-400 font-mono pt-1">{quotationData.clientRegistration}</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                  <span className="text-[10px] font-bold text-[#0f3889] uppercase block font-mono">
                    PROPOSAL METADATA:
                  </span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Proposal Reference:</span>
                    <span className="font-mono font-bold text-slate-900">{quotationData.quotationNumber}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Date of Issue:</span>
                    <span className="font-bold text-slate-900">{quotationData.date}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Validity Period:</span>
                    <span className="font-bold text-red-600">{quotationData.validUntil}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Architecture Lead:</span>
                    <span className="text-slate-700">{quotationData.preparedBy}</span>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 sm:p-5 space-y-2">
                <h3 className="font-headline font-bold text-sm text-[#0f3889] uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  Executive Project Summary
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  This quotation covers the comprehensive engineering, interactive multimedia design, security infrastructure, and dual-stack deployment of the <strong>Raid Action Wing Foundation Digital Ecosystem</strong>. The platform empowers national anti-corruption vigilance operations with an <strong>ISO CR80 Digital Officer ID Card Engine</strong>, <strong>Public Credential Verification Portal</strong>, <strong>Confidential Whistleblower Grievance Dossiers</strong>, <strong>80G Tax-Exempt Donation Processing</strong>, and an advanced <strong>Command &amp; Administration Suite</strong> with appointment letter generation and authorized signatory asset management.
                </p>
              </div>

              {/* Financial Highlight Card */}
              <div className="bg-gradient-to-br from-[#0a192f] to-[#0f3889] text-white rounded-xl p-5 sm:p-6 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/20 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 block">
                      Full-Stack Commercial Summary
                    </span>
                    <h3 className="font-headline font-bold text-lg sm:text-xl text-white">
                      All 12 Modules &amp; Systems Engineered
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-300 block">Total Engineering Effort</span>
                    <span className="font-mono font-bold text-base text-white">{totals.totalHours} Hours</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div className="bg-white/10 rounded-lg p-3">
                    <span className="text-[10px] text-slate-300 uppercase block">Gross Development Value</span>
                    <span className="text-base sm:text-lg font-bold font-mono text-white">
                      ₹{totals.subtotalInr.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-slate-300 block font-mono">
                      (${totals.subtotalUsd.toLocaleString('en-US')} USD)
                    </span>
                  </div>

                  <div className="bg-emerald-900/40 border border-emerald-400/40 rounded-lg p-3">
                    <span className="text-[10px] text-emerald-200 uppercase block">
                      Institutional Subsidy ({totals.discountPercent}%)
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-emerald-300">
                      - ₹{totals.discountInr.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-emerald-200/80 block font-mono">
                      (- ${totals.discountUsd.toLocaleString('en-US')} USD)
                    </span>
                  </div>

                  <div className="bg-amber-400/20 border border-amber-300/60 rounded-lg p-3">
                    <span className="text-[10px] text-amber-300 uppercase block font-bold">Net Project Investment</span>
                    <span className="text-lg sm:text-2xl font-black font-mono text-yellow-300">
                      ₹{totals.finalInr.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-white block font-mono">
                      (US ${totals.finalUsd.toLocaleString('en-US')})
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Feature Matrix (Summary of 12 modules) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline font-bold text-sm text-slate-900 uppercase">
                    12 Implemented Core Modules &amp; Subsystems
                  </h3>
                  <button
                    onClick={() => setActiveTab('breakdown')}
                    className="text-xs text-[#0f3889] font-bold hover:underline cursor-pointer"
                  >
                    View Detailed Breakdown →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {quotationData.modules.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.2 bg-blue-100 text-blue-900 font-mono text-[9px] font-bold rounded">
                            {m.id}
                          </span>
                          <span className="font-bold text-xs text-slate-800">{m.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 block">{m.category}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-xs text-slate-900 block">
                          ₹{m.inrAmount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{m.estimatedHours}h</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED MODULES BREAKDOWN */}
          {activeTab === 'breakdown' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-headline font-bold text-base text-slate-900 uppercase">
                    Complete Scope of Work &amp; Module Specifications
                  </h3>
                  <p className="text-xs text-slate-500">
                    Comprehensive technical documentation for each engineered platform capability.
                  </p>
                </div>
                <button
                  onClick={handleDownloadWord}
                  disabled={downloading}
                  className="px-3 py-1.5 bg-[#2b579a] hover:bg-[#1e3e70] text-white text-xs font-bold uppercase rounded flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Export to Word</span>
                </button>
              </div>

              <div className="space-y-4">
                {quotationData.modules.map((m) => (
                  <div key={m.id} className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#0f3889] text-white font-mono text-xs font-bold rounded">
                          {m.id}
                        </span>
                        <h4 className="font-headline font-bold text-sm text-slate-900 uppercase">{m.name}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-semibold text-[11px]">
                          {m.category}
                        </span>
                        <span className="font-mono text-slate-500">{m.estimatedHours} Hours</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          ₹{m.inrAmount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">(${m.usdAmount} USD)</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{m.description}</p>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">
                        Included Deliverables:
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-700">
                        {m.deliverables.map((d, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold shrink-0">✓</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TERMS & MILESTONES */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              {/* Milestones */}
              <div className="space-y-3">
                <h3 className="font-headline font-bold text-base text-slate-900 uppercase">
                  Project Delivery Milestones &amp; Payment Schedule
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quotationData.milestones.map((milestone) => (
                    <div
                      key={milestone.phase}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-blue-100 text-[#0f3889] font-mono text-[10px] font-bold rounded uppercase">
                          {milestone.phase}
                        </span>
                        <span className="text-xs font-bold text-slate-900 font-mono">
                          {milestone.percentage}% (₹
                          {Math.round((totals.finalInr * milestone.percentage) / 100).toLocaleString('en-IN')})
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900">{milestone.title}</h4>
                      <p className="text-[11px] text-slate-600 leading-snug">{milestone.description}</p>
                      <span className="text-[10px] font-mono text-slate-400 block pt-1">
                        Timeline: {milestone.timeline}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="space-y-3">
                <h3 className="font-headline font-bold text-base text-slate-900 uppercase">
                  Technical Architecture &amp; Production Stack
                </h3>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">Frontend Engineering:</span>
                      <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                        {quotationData.techStack.frontend.map((t) => (
                          <span key={t} className="px-2 py-0.5 bg-white border border-slate-200 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">Backend &amp; Server Infrastructure:</span>
                      <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                        {quotationData.techStack.backend.map((t) => (
                          <span key={t} className="px-2 py-0.5 bg-white border border-slate-200 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">Database &amp; Data Schemas:</span>
                      <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                        {quotationData.techStack.database.map((t) => (
                          <span key={t} className="px-2 py-0.5 bg-white border border-slate-200 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">Documents, Barcode &amp; Media:</span>
                      <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                        {quotationData.techStack.documentsAndMedia.map((t) => (
                          <span key={t} className="px-2 py-0.5 bg-white border border-slate-200 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commercial Terms */}
              <div className="space-y-2">
                <h3 className="font-headline font-bold text-base text-slate-900 uppercase">
                  Commercial Terms &amp; Intellectual Property
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  {quotationData.terms.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#0f3889] font-bold">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Signatures */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">SUBMITTED BY:</span>
                  <div className="font-bold text-slate-800 text-sm">Lead Solutions Architect</div>
                  <div className="text-slate-600">{quotationData.preparedByCompany}</div>
                  <div className="text-[11px] text-slate-500 font-mono pt-1">Date: {quotationData.date}</div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">ACCEPTED &amp; APPROVED BY:</span>
                  <div className="font-bold text-[#0f3889] text-sm">Authorized Governing Signatory</div>
                  <div className="text-slate-600">{quotationData.clientOrganization}</div>
                  <div className="text-[11px] text-slate-500 italic pt-1">Official Command Seal / Authorization</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-5 sm:px-7 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="material-symbols-outlined text-[18px] text-blue-600">info</span>
            <span>
              Format: <strong>Microsoft Word (.docx)</strong> • Fully editable &amp; print-formatted
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadWord}
              disabled={downloading}
              className="px-5 py-2.5 bg-[#2b579a] hover:bg-[#1e3e70] active:scale-95 text-white font-bold text-xs uppercase rounded-lg flex items-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50"
            >
              {downloading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[18px]">download</span>
              )}
              <span>{downloading ? 'Preparing Word File...' : 'Download Quotation (.docx)'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-300 hover:bg-slate-400 text-slate-800 font-semibold text-xs uppercase rounded-lg cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
