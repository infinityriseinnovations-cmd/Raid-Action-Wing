import React, { useState } from 'react';
import { ALL_INDIAN_LAWS, LawDocument } from '../data/siteData';

interface IndianLawsPageProps {
  onNavigate: (page: string) => void;
}

export const IndianLawsPage: React.FC<IndianLawsPageProps> = ({ onNavigate }) => {
  const [selectedLaw, setSelectedLaw] = useState<LawDocument | null>(null);

  const handleDownload = (law: LawDocument) => {
    const content = `=====================================================
RAID ACTION WING FOUNDATION (RAWF)
PUBLIC LEGAL EMPOWERMENT HUB • IFA 760 / 1882
=====================================================

STATUTORY LAW REFERENCE: ${law.title}
SOURCE FILE: ${law.file}
SIZE: ${law.fileSize}

EXECUTIVE OVERVIEW:
${law.summary}

CONSTITUTIONAL EMPOWERMENT NOTICE:
Knowledge of statutory protections is the greatest shield against administrative injustice.
For assistance with anticipatory bail, police compliance, or filing writ petitions:
- RAWF 24/7 Helpline: 1800-RAW-CELL
- Legal Directorate: legal@raidactionwing.in
- Official URL: https://raidactionwing.in
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RAWF-Law-${law.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <div className="bg-[#0a192f] text-white py-12 px-4 lg:px-8 border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <button onClick={() => onNavigate('home')} className="hover:text-white cursor-pointer">
              Home
            </button>
            <span>/</span>
            <span className="text-red-400 font-bold">Indian Laws</span>
          </div>
          <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight">
            Indian Statutory Laws & Judicial References
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
            Certified legal digests on Supreme Court police rulings, the judiciary hierarchy, anticipatory bail, POSH protections, and the complete Constitution of India.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_INDIAN_LAWS.map((law) => (
            <div
              key={law.id}
              className="bg-white border-2 border-slate-200 hover:border-[#0d47a1] rounded-xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-[#0d47a1] text-3xl">
                    gavel
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">
                    PDF • {law.fileSize}
                  </span>
                </div>

                <h3 className="font-headline font-bold text-slate-900 text-lg group-hover:text-[#0d47a1] transition-colors">
                  {law.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {law.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedLaw(law)}
                  className="text-[#0d47a1] font-bold uppercase hover:underline cursor-pointer"
                >
                  Read Digest
                </button>
                <button
                  onClick={() => handleDownload(law)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
                >
                  <span className="material-symbols-outlined text-[14px]">download</span>
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Law Digest Modal */}
      {selectedLaw && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative animate-scaleUp">
            <button
              onClick={() => setSelectedLaw(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-mono text-red-600 font-bold uppercase block">
                JUDICIAL HANDBOOK DIGEST
              </span>
              <h3 className="font-headline font-bold text-lg text-slate-900 mt-0.5">
                {selectedLaw.title}
              </h3>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {selectedLaw.summary}
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
              <span className="text-slate-500 block font-bold text-[11px] uppercase">
                Official Law Repository File:
              </span>
              <span className="font-mono text-slate-900">{selectedLaw.file}</span>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => setSelectedLaw(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-bold uppercase cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(selectedLaw)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Download Handbook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
