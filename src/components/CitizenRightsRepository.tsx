import React, { useState } from 'react';

interface LawDocument {
  id: string;
  icon: string;
  iconColor: 'red' | 'blue' | 'green' | 'amber';
  title: string;
  description: string;
  fileSize: string;
  keyActs: string[];
  summary: string;
}

const lawDocs: LawDocument[] = [
  {
    id: 'child-rights',
    icon: 'child_care',
    iconColor: 'red',
    title: 'Child Rights & POCSO Guide',
    description: 'Statutory rights of children, anti-exploitation protocols, and judicial helpline access.',
    fileSize: '1.4 MB',
    keyActs: ['POCSO Act 2012', 'Juvenile Justice Act 2015', 'Right to Education Act'],
    summary: 'Comprehensive legal handbook covering protection of children from sexual offenses, mandatory reporting guidelines for schools and hospitals, non-disclosure of victim identity, and special court trials within 1 year.'
  },
  {
    id: 'women-rights',
    icon: 'female',
    iconColor: 'red',
    title: 'Women Rights & Protection Laws',
    description: 'Acts against workplace sexual harassment (POSH), domestic violence guidelines, and custody rights.',
    fileSize: '2.1 MB',
    keyActs: ['POSH Act 2013', 'Domestic Violence Act 2005', 'Dowry Prohibition Act'],
    summary: 'Statutory safeguards including mandatory Internal Complaints Committee (ICC) in organizations with 10+ employees, zero-FIR filing rights at any police station regardless of jurisdiction, and virtual recording of statements.'
  },
  {
    id: 'human-rights',
    icon: 'diversity_3',
    iconColor: 'blue',
    title: 'Human Rights in India Charter',
    description: 'Protection of Human Rights Act 1993, NHRC filing instructions, and fundamental liberties.',
    fileSize: '3.0 MB',
    keyActs: ['Protection of Human Rights Act 1993', 'Articles 14, 19, 21 of Constitution'],
    summary: 'Procedures for filing complaints before the National Human Rights Commission (NHRC) and State Commissions against illegal detentions, custodial atrocities, encounter deaths, and state negligence.'
  },
  {
    id: 'rti-act',
    icon: 'fact_check',
    iconColor: 'green',
    title: 'Right to Information (RTI Act)',
    description: 'Step-by-step drafting templates for government scrutiny, public accountability, and first appeals.',
    fileSize: '950 KB',
    keyActs: ['RTI Act 2005', 'Section 6(1) Drafting', 'Section 19 First & Second Appeals'],
    summary: 'Standard RTI drafting formats for road tenders, public fund expenditures, welfare scheme lists, and police action reports. Enforces mandatory 30-day response timeline (48 hours for life & liberty).'
  },
  {
    id: 'police-rulings',
    icon: 'local_police',
    iconColor: 'red',
    title: 'Supreme Court Rulings on Police',
    description: 'D.K. Basu guidelines, arrest procedures, mandatory FIR filing rights, and protection against police overreach.',
    fileSize: '1.8 MB',
    keyActs: ['D.K. Basu v. State of West Bengal', 'Lalita Kumari Mandatory FIR Mandate', 'Arnesh Kumar Notice 41A'],
    summary: 'Landmark Supreme Court directives: Police must display clear identification tags; arrest memo must be prepared on the spot and signed by a witness; medical examination every 48 hours; right to consult an advocate.'
  },
  {
    id: 'bail-crpc',
    icon: 'assured_workload',
    iconColor: 'amber',
    title: 'Anticipatory Bail & CrPC Manual',
    description: 'Section 438 provisions, protection from malicious complaints, and procedural safeguards.',
    fileSize: '1.2 MB',
    keyActs: ['CrPC Section 438 / BNSS 482', 'Gurbaksh Singh Sibbia Precedent'],
    summary: 'Grounds and drafting guidelines for securing anticipatory bail from Sessions Court or High Court in case of apprehension of arrest on false, politically motivated, or frivolous allegations.'
  },
  {
    id: 'constitution-hindi',
    icon: 'book_2',
    iconColor: 'blue',
    title: 'भारत का संविधान (Hindi)',
    description: 'पूर्ण संवैधानिक अधिकार, मूल अधिकार और नागरिक स्वतंत्रता का विस्तृत हिंदी संकलन।',
    fileSize: '8.4 MB',
    keyActs: ['भाग III: मौलिक अधिकार', 'अनुच्छेद 32: संवैधानिक उपचारों का अधिकार'],
    summary: 'भारत के संविधान का अधिकृत हिंदी संस्करण। नागरिकों के मौलिक अधिकार, नीति निदेशक तत्व, मूल कर्तव्य और सर्वोच्च न्यायालय में रिट याचिका (Habeas Corpus, Mandamus, Quo Warranto) दायर करने के नियम।'
  },
  {
    id: 'constitution-english',
    icon: 'menu_book',
    iconColor: 'blue',
    title: 'Constitution of India (English)',
    description: 'Complete unedited text of the Constitution of India with all foundational amendments and rights schedules.',
    fileSize: '7.9 MB',
    keyActs: ['Preamble', 'Fundamental Rights', 'Judicial Review Powers'],
    summary: 'Full unedited reference of the supreme law of India, establishing the framework of political principles, institutional authority, and fundamental rights of every citizen.'
  }
];

export const CitizenRightsRepository: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<LawDocument | null>(null);

  const handleDownloadFile = (doc: LawDocument) => {
    // Generate and download printable summary text file
    const content = `=====================================================
RAID ACTION WING FOUNDATION (RAWF)
PUBLIC LEGAL EMPOWERMENT CELL • IFA 760 / 1882
=====================================================

TITLE: ${doc.title}
KEY STATUTES: ${doc.keyActs.join(' | ')}
DOCUMENT CODE: RAWF-LEG-${doc.id.toUpperCase()}

LEGAL EXECUTIVE SUMMARY:
${doc.summary}

CITIZEN RIGHTS NOTICE:
If you or your family are experiencing illegal detention, refusal of police to file mandatory FIR, or violation of the above statutory rights, immediately alert RAWF Legal Desk:
- 24/7 Helpline: 1800-RAW-CELL
- Email: legal@raidactionwing.in
- Website: https://raidactionwing.in

Issued in Public Interest under ITA Act 1882 Charter.
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RAWF-Statutory-Guide-${doc.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="w-full bg-slate-50 py-14 px-4 lg:px-8 border-b border-slate-200" id="know-your-rights">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 block">
              Public Legal Empowerment Hub
            </span>
            <h2 className="font-headline font-bold text-2xl lg:text-3xl text-slate-900 uppercase tracking-tight">
              Indian Statutory Rights & Law Repository
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-sm">
            Download certified citizens' rights charters, constitutional references, and procedural guides prepared by RAWF legal counsel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {lawDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs hover:border-[#0d47a1] transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`material-symbols-outlined text-[24px] ${
                      doc.iconColor === 'red'
                        ? 'text-red-600'
                        : doc.iconColor === 'blue'
                        ? 'text-[#0d47a1]'
                        : doc.iconColor === 'green'
                        ? 'text-emerald-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {doc.icon}
                  </span>
                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="text-[10px] font-mono font-bold uppercase text-slate-400 hover:text-slate-800 cursor-pointer"
                  >
                    Preview
                  </button>
                </div>

                <h4 className="font-headline font-bold text-slate-900 text-sm group-hover:text-[#0d47a1] transition-colors leading-tight">
                  {doc.title}
                </h4>

                <p className="text-xs text-slate-600 leading-normal line-clamp-2">
                  {doc.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-3 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  PDF • {doc.fileSize}
                </span>
                <button
                  onClick={() => handleDownloadFile(doc)}
                  className="text-red-600 font-bold uppercase flex items-center gap-0.5 hover:underline cursor-pointer"
                >
                  <span>Download</span>
                  <span className="material-symbols-outlined text-[14px]">download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guide Detail & Preview Modal */}
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
                STATUTORY CITIZEN CHARTER
              </span>
              <h3 className="font-headline font-bold text-lg text-slate-900 mt-0.5">
                {selectedDoc.title}
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
                <strong className="text-slate-900 block uppercase font-bold text-[11px]">
                  Governing Acts & Precedents
                </strong>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {selectedDoc.keyActs.map((act, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-[#0d47a1] font-mono rounded text-[10px] font-bold border border-blue-100">
                      {act}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">
                {selectedDoc.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-500">
                Size: {selectedDoc.fileSize}
              </span>
              <button
                onClick={() => handleDownloadFile(selectedDoc)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Download Statutory Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
