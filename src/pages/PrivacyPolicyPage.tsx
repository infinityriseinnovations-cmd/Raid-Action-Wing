import React from 'react';

interface PrivacyPolicyPageProps {
  onNavigate: (page: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-16 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#0a192f] text-white py-12 px-4 lg:px-8 border-b-4 border-red-600">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <button
              onClick={() => onNavigate('home')}
              aria-label="Return to Home"
              className="hover:text-white cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-red-400 font-bold">Privacy Policy</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-900/60 border border-blue-700/50 font-mono text-xs text-blue-200">
            <span className="material-symbols-outlined text-[15px] text-emerald-400">verified_user</span>
            <span>STATUTORY DATA INTEGRITY &amp; WHISTLEBLOWER PROTECTION DIRECTIVE</span>
          </div>
          <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight">
            Privacy Policy &amp; Data Protection Charter
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
            Raid Action Wing Foundation (RAWF) is committed to stringent privacy standards, cryptographically secured citizen telemetry, and non-retaliation safeguards for whistleblowers across India.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 space-y-8 text-slate-800">
        {/* Policy Summary Callout */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <span className="material-symbols-outlined text-3xl text-[#0d47a1]">shield</span>
            <div>
              <h2 className="font-headline font-bold text-lg text-slate-900">
                Institutional Privacy Commitment
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Effective Date: 2026-01-01 • Version: 2.4 (Statutory IFA 760 Compliance)
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            This Privacy Policy governs the collection, processing, storage, and statutory disclosure of information collected by <strong>Raid Action Wing Foundation (RAWF)</strong> through our official national web portal, digital officer registries, grievance filing terminals, and membership application desks.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <strong className="text-slate-900 block font-bold mb-0.5">Zero Data Commercialization</strong>
              <span className="text-slate-600">RAWF will never sell, rent, monetize, or broker personal information to advertisers.</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <strong className="text-slate-900 block font-bold mb-0.5">Whistleblower Anonymity</strong>
              <span className="text-slate-600">IP scrubbing and metadata dissociation for confidential anti-corruption informants.</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <strong className="text-slate-900 block font-bold mb-0.5">TLS 256-Bit Cryptography</strong>
              <span className="text-slate-600">All submissions, OTP verification logs, and officer records are encrypted in transit.</span>
            </div>
          </div>
        </div>

        {/* Section 1: Statutory Framework */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
          <h3 className="font-headline font-bold text-xl text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0d47a1]">gavel</span>
            1. Statutory Framework &amp; Legal Compliance
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            RAWF processes information strictly in accordance with applicable Indian legislation:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 pl-4 list-disc">
            <li><strong>Digital Personal Data Protection Act, 2023 (DPDPA):</strong> Respecting data principals' consent, purpose limitation, and storage minimization principles.</li>
            <li><strong>Information Technology Act, 2000:</strong> Section 43A and Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.</li>
            <li><strong>Whistleblowers Protection Act, 2014 &amp; Indian Trusts Act, 1882:</strong> Ensuring institutional protection and confidentiality for citizens submitting crime or graft intelligence.</li>
          </ul>
        </section>

        {/* Section 2: Information We Collect */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
          <h3 className="font-headline font-bold text-xl text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0d47a1]">inventory_2</span>
            2. Categories of Information Collected
          </h3>
          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 uppercase text-xs">A. Public Grievances &amp; Whistleblower Telemetry</h4>
              <p className="text-slate-600">
                When you submit a crime report, corruption complaint, or evidence dossier:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Anonymous Mode (Default):</strong> No personal name, email, or telephone number is collected or stored. Identifying network telemetry is scrubbed prior to permanent logging.</li>
                <li><strong>Disclosed Mode (Optional):</strong> If you choose direct contact, we collect your name, mobile/WhatsApp number, secure email, and incident location to facilitate investigator callbacks.</li>
                <li><strong>Incident Telemetry:</strong> Accused entity names, dates, financial amounts, narrative descriptions, and submitted evidence documents.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 uppercase text-xs">B. Volunteer &amp; Officer Membership Applications</h4>
              <p className="text-slate-600">
                When applying for appointment as a Field Officer, Social Investigator, or Legal Council member:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Full legal name, gender, date of birth, contact phone number, and residential address.</li>
                <li>Government identity verification (Aadhaar masked last 4 digits or Voter ID number). <em>Note: RAWF never stores biometric fingerprint or iris data.</em></li>
                <li>Professional qualifications, educational background, and signed declaration under the RAWF Anti-Extortion &amp; Ethical Oath.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 uppercase text-xs">C. Digital ID Card Verification Desk</h4>
              <p className="text-slate-600">
                When verifying an active officer badge or retrieving digital credentials:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Officer UID Number (e.g. <code>RAWF/2026/xxxx</code>), registered official email address, and single-use time-based One-Time Password (OTP) validation logs.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 uppercase text-xs">D. Contributions &amp; Public Donations</h4>
              <p className="text-slate-600">
                For processing voluntary public contributions and issuing statutory donation receipts:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Donor name, Permanent Account Number (PAN) where tax exemption is requested, donation amount, chosen fund allocation, and UPI / Banking transaction reference (UTR) numbers.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: How We Use Information */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
          <h3 className="font-headline font-bold text-xl text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0d47a1]">tune</span>
            3. Purpose of Processing
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            All gathered data is utilized exclusively for genuine institutional and civic defense mandates:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3 border border-slate-200 rounded-lg">
              <strong className="text-slate-900 block font-bold mb-1">Investigation &amp; Fact-Finding</strong>
              <p className="text-slate-600">Corroborating public interest evidence and packaging verified dossiers for statutory submission.</p>
            </div>
            <div className="p-3 border border-slate-200 rounded-lg">
              <strong className="text-slate-900 block font-bold mb-1">Anti-Impersonation Defense</strong>
              <p className="text-slate-600">Maintaining public roster verification so citizens and police can verify authorized officers in real-time.</p>
            </div>
            <div className="p-3 border border-slate-200 rounded-lg">
              <strong className="text-slate-900 block font-bold mb-1">Statutory Law Enforcement Filing</strong>
              <p className="text-slate-600">Escalating actionable criminal intel to the Anti-Corruption Bureau (ACB), CBI, and State Police.</p>
            </div>
            <div className="p-3 border border-slate-200 rounded-lg">
              <strong className="text-slate-900 block font-bold mb-1">Administrative Transparency</strong>
              <p className="text-slate-600">Maintaining statutory audit trails required under the Indian Trusts Act 1882.</p>
            </div>
          </div>
        </section>

        {/* Section 4: Information Sharing */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
          <h3 className="font-headline font-bold text-xl text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-red-600">policy</span>
            4. Third-Party Disclosures &amp; Lawful Escalation
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            RAWF maintains an absolute zero-leakage security posture. Information is never shared with commercial entities, marketing affiliates, or unauthorized third parties. Information is only disclosed under the following strict conditions:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 pl-4 list-disc">
            <li><strong>Official Statutory Escalation:</strong> When an investigation yields verified evidence of cognizable crime, dossiers are officially transmitted to competent legal authorities (Police, ACB, Enforcement Directorate, National Human Rights Commission).</li>
            <li><strong>Judicial Mandate:</strong> Upon receipt of a valid summons, court order, or formal direction from a competent magistrate or judicial authority under Indian law.</li>
            <li><strong>Whistleblower Shield:</strong> Informant identity is redacted in all public representations and court petitions unless the whistleblower expressly grants written consent for witness deposition.</li>
          </ul>
        </section>

        {/* Section 5: Security Standards */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
          <h3 className="font-headline font-bold text-xl text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0d47a1]">lock</span>
            5. Cryptographic &amp; Security Controls
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <strong className="text-slate-900 block font-bold">End-to-End Transport Encryption</strong>
              <p className="text-slate-600">All data passing between your browser and our servers is secured with TLS 1.3 encryption with modern cipher suites.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <strong className="text-slate-900 block font-bold">Strict Role-Based Access Control (RBAC)</strong>
              <p className="text-slate-600">Only verified Director General Command personnel with hardware key verification can access grievance investigation queues.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <strong className="text-slate-900 block font-bold">Automated Time-to-Live (TTL) OTPs</strong>
              <p className="text-slate-600">Credential verification codes expire automatically within 10 minutes to prevent unauthorized badge access.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <strong className="text-slate-900 block font-bold">Regular Vulnerability Audits</strong>
              <p className="text-slate-600">Continuous technical audits and penetration testing to protect infrastructure against cyber adversaries.</p>
            </div>
          </div>
        </section>

        {/* Section 6: Citizen Data Rights */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
          <h3 className="font-headline font-bold text-xl text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0d47a1]">person_search</span>
            6. Citizen Rights Under Indian Law
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            As a data principal under the Digital Personal Data Protection Act 2023, you have the right to:
          </p>
          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 pl-4 list-disc">
            <li><strong>Right to Summary Information:</strong> Request confirmation of what personal data RAWF retains regarding your membership or submissions.</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate contact numbers, addresses, or profile details.</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your volunteer application profile (subject to statutory audit and legal compliance retention obligations).</li>
            <li><strong>Right of Grievance Redressal:</strong> Direct escalation of privacy concerns to our appointed Data Protection Officer.</li>
          </ul>
        </section>

        {/* Section 7: Grievance Officer Contact */}
        <section className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <span className="material-symbols-outlined text-3xl text-red-500">contact_support</span>
            <div>
              <h3 className="font-headline font-bold text-lg text-white">
                7. Institutional Data Protection &amp; Grievance Redressal Desk
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Designated in accordance with Section 43A of the IT Act &amp; DPDPA 2023
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            For questions regarding this policy, to request data rectification, or to report any security concern:
          </p>
          <div className="bg-slate-800 p-4 rounded-lg space-y-2 text-xs font-mono">
            <div><strong>Designated Officer:</strong> Legal &amp; Data Compliance Council, RAWF</div>
            <div><strong>Headquarters:</strong> Raid Action Wing Foundation National Command, New Delhi, India</div>
            <div><strong>Official Email:</strong> <span className="text-blue-300">privacy@raidactionwing.in</span> / <span className="text-blue-300">info@raidactionwing.in</span></div>
            <div><strong>Helpline:</strong> <span className="text-emerald-400">1800-RAW-CELL (1800 729 2355)</span></div>
          </div>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('contact')}
              aria-label="Open Contact Desk"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold uppercase transition-colors cursor-pointer"
            >
              Open Contact Desk
            </button>
            <button
              onClick={() => onNavigate('home')}
              aria-label="Return to Homepage"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-bold uppercase transition-colors cursor-pointer"
            >
              Return to Homepage
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
export default PrivacyPolicyPage;
