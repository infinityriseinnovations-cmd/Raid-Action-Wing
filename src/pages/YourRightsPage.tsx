import React, { useState } from 'react';
import { ALL_RIGHTS_DOCS, RightsDocument } from '../data/siteData';

interface YourRightsPageProps {
  onNavigate: (page: string) => void;
}

export const YourRightsPage: React.FC<YourRightsPageProps> = ({ onNavigate }) => {
  const [selectedDoc, setSelectedDoc] = useState<RightsDocument | null>(null);

  const handleDownload = (doc: RightsDocument) => {
    const text = `=====================================================
RAID ACTION WING FOUNDATION (RAWF)
PUBLIC LEGAL EMPOWERMENT CELL • IFA 760 / 1882
=====================================================

DOCUMENT: ${doc.title}
CATEGORY: ${doc.category}
SOURCE FILE: ${doc.file}

STATUTORY RIGHTS SUMMARY:
${doc.summary}

CITIZEN RIGHTS ADVISORY:
Under the Constitution of India and statutory enactments, every citizen is entitled to equal protection of laws and speedy justice.
To report violations or seek free legal defense:
- 24/7 Helpline: 1800-RAW-CELL
- Official Portal: https://raidactionwing.in
- Legal Desk Email: legal@raidactionwing.in
=====================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RAWF-Rights-${doc.id}.txt`;
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
            <span className="text-red-400 font-bold">Your Rights</span>
          </div>
          <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight">
            Citizen Rights & Legal Safeguards
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
            13 official citizen rights charters and statutory references curated by the RAWF Bar and Legal Directorate.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_RIGHTS_DOCS.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border-2 border-slate-200 hover:border-[#0d47a1] rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-blue-50 text-[#0d47a1] border border-blue-200 font-mono text-[10px] uppercase font-bold rounded">
                    {doc.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    PDF • {doc.fileSize}
                  </span>
                </div>

                <h3 className="font-headline font-bold text-slate-900 text-lg group-hover:text-[#0d47a1] transition-colors">
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {doc.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="text-[#0d47a1] font-bold uppercase hover:underline cursor-pointer"
                >
                  Read Summary
                </button>
                <button
                  onClick={() => handleDownload(doc)}
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

      {/* Summary Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative animate-scaleUp">
            <button
              onClick={() => setSelectedDoc(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-mono text-[#0d47a1] font-bold uppercase block">
                {selectedDoc.category} • {selectedDoc.fileSize}
              </span>
              <h3 className="font-headline font-bold text-lg text-slate-900 mt-0.5">
                {selectedDoc.title}
              </h3>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {selectedDoc.summary}
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 space-y-1">
              <strong className="text-slate-900 block font-bold text-[11px] uppercase">
                Statutory Reference File
              </strong>
              <div className="font-mono text-slate-800 text-[11px]">{selectedDoc.file}</div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-bold uppercase cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(selectedDoc)}
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
