export interface QuotationModuleItem {
  id: string;
  name: string;
  category: string;
  description: string;
  deliverables: string[];
  estimatedHours: number;
  inrAmount: number;
  usdAmount: number;
}

export interface QuotationMilestone {
  phase: string;
  title: string;
  timeline: string;
  percentage: number;
  description: string;
}

export interface QuotationDetails {
  quotationNumber: string;
  date: string;
  validUntil: string;
  clientName: string;
  clientOrganization: string;
  clientDesignation: string;
  clientRegistration: string;
  preparedBy: string;
  preparedByCompany: string;
  preparedByEmail: string;
  preparedByPhone: string;
  projectTitle: string;
  projectSubtitle: string;
  modules: QuotationModuleItem[];
  milestones: QuotationMilestone[];
  techStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    documentsAndMedia: string[];
    securityAndDevOps: string[];
  };
  terms: string[];
}

export const INITIAL_QUOTATION_DATA: QuotationDetails = {
  quotationNumber: 'RAWF/PROP/2026/089',
  date: '08 October 2026',
  validUntil: '07 November 2026 (30 Days)',
  clientName: 'Director General & Governing Council',
  clientOrganization: 'Raid Action Wing Foundation (RAWF)',
  clientDesignation: 'Supreme Directorate Command',
  clientRegistration: 'Trust Reg. IFA No. 760 (1882 Act) • NITI Aayog Darpan DL/2021/0285220',
  preparedBy: 'Chief Solutions Architect & Engineering Team',
  preparedByCompany: 'Enterprise Web & Digital Systems Solutions',
  preparedByEmail: 'directorate@raidactionwing.in',
  preparedByPhone: '+91 94544 00100 / 0522-2209350',
  projectTitle: 'Official Enterprise Web Portal & Digital Vigilance Governance Ecosystem',
  projectSubtitle: 'Custom Full-Stack Web Application, Digital ID Card Engine, Citizen Grievance Dossier, 80G Donations & Admin Command Suite',
  modules: [
    {
      id: 'MOD-01',
      name: 'Public Institutional Web Portal & Multimedia Engine',
      category: 'Frontend & Brand Portal',
      description: 'High-performance responsive portal with official Devanagari Hindi and English typography, emergency helpline banner, statutory charter, and interactive video broadcast player with synchronized bilingual teleprompter.',
      deliverables: [
        'Bilingual institutional landing architecture (Hindi / English)',
        'Emergency 24/7 hotline dispatcher & quick action widgets',
        'Director video broadcast player with live bilingual subtitle teleprompter',
        'Statutory mandate & constitutional authority guides (CrPC 39/43, PC Act)',
        'National headquarters, state offices directory, and vigilance contact grids'
      ],
      estimatedHours: 48,
      inrAmount: 42000,
      usdAmount: 520
    },
    {
      id: 'MOD-02',
      name: 'Officer Digital ID Card & Security Barcode/QR Engine',
      category: 'Credential Engineering',
      description: 'ISO CR80 standard digital ID card generation engine featuring diagonal red/blue vector headers, dynamic Code 128 barcode, live online verification QR code, baseline-aligned authorized signature, and reverse-side statutory clauses.',
      deliverables: [
        'ISO CR80 specification vector double-sided card template (510x324px)',
        'Officer photo processor with aspect locking and fallback rendering',
        'High-precision demographic grid with UID, designation, state, and validity',
        'Real-time vector Code 128 barcode generation algorithm',
        'Dynamic encrypted QR code linking to cloud verification page',
        'Reverse-side security markings, headquarters contacts, and legal notices',
        'Client-side print-ready high-resolution PNG & PDF CMYK export'
      ],
      estimatedHours: 54,
      inrAmount: 46000,
      usdAmount: 575
    },
    {
      id: 'MOD-03',
      name: 'Public Officer Verification & Anti-Impersonation Portal',
      category: 'Public Security',
      description: 'Instant public verification portal enabling law enforcement, government officials, and citizens to verify officer accreditation status by UID or Badge ID to eliminate fake identity cards and impersonation.',
      deliverables: [
        'Real-time UID / Badge Number search and live verification modal',
        'Accreditation status badges (Active, Verified, Expired, Revoked)',
        'Tamper-evident officer credential dossier display',
        'Direct synchronization with central officer roster database'
      ],
      estimatedHours: 28,
      inrAmount: 24000,
      usdAmount: 300
    },
    {
      id: 'MOD-04',
      name: 'Officer Self-Service ID Card Download Portal',
      category: 'Self-Service Portal',
      description: 'Dedicated portal allowing accredited vigilance officers nationwide to retrieve and download their official digital identity cards without requiring admin intervention.',
      deliverables: [
        'Dual-factor lookup verification (UID + Registered Mobile / D.O.B.)',
        'Interactive preview modes: Single-Sided (Front/Back) & Double-Sided (Side-by-Side/Stacked)',
        'Automated master layout formatting for high-resolution plastic card printing'
      ],
      estimatedHours: 26,
      inrAmount: 22000,
      usdAmount: 275
    },
    {
      id: 'MOD-05',
      name: 'Officer Recruitment, Membership Intake & KYC Pipeline',
      category: 'Intake & Workflow',
      description: 'Comprehensive membership application workflow supporting multiple designations, dynamic fee computation, KYC document upload (Aadhaar, PAN, Police NOC), and payment verification.',
      deliverables: [
        'Multi-tier role selection (State Director, District CVO, Cyber Investigator, etc.)',
        'Dynamic tenure and subscription fee calculator',
        'KYC proof submission (Aadhaar, PAN, Photo, Police Clearance)',
        'Multi-channel payment readiness (UPI, Netbanking, Bank Transfer Receipt)',
        'Admin status pipeline (Pending Review, Verification, Approved, Rejected)'
      ],
      estimatedHours: 42,
      inrAmount: 36000,
      usdAmount: 450
    },
    {
      id: 'MOD-06',
      name: 'Citizen Grievance & Whistleblower Intelligence Dossier System',
      category: 'Citizen Engagement',
      description: 'Secure statutory grievance reporting channel with optional whistleblower anonymity, automated tracking dossier numbers (RAWF-GRIEV-XXXXXX), and an encrypted public status check portal.',
      deliverables: [
        'Secure multi-category grievance form (Bribery, Police Misconduct, Land Grabbing, Cyber)',
        'Confidential whistleblower protection mode with optional anonymity',
        'Encrypted unique dossier number generator for tracking',
        'Public progress tracker displaying investigation timeline without exposing identity',
        'Admin case dossier management with state assignment and resolution notes'
      ],
      estimatedHours: 40,
      inrAmount: 34000,
      usdAmount: 425
    },
    {
      id: 'MOD-07',
      name: 'Section 80G Tax-Exempt Donation & Instant Receipt Engine',
      category: 'Financial Compliance',
      description: 'Institutional donation system compliant with Section 80G of the Indian Income Tax Act, featuring instant digital tax exemption receipt generation with official seal and 10BE notes.',
      deliverables: [
        'Pre-configured donation tiers and custom contribution workflow',
        'Trust registration (IFA 760) and 80G compliance statutory disclosures',
        'Automated instant PDF/printable donation receipts with official command seal',
        'Financial audit ledger with CSV/Excel export for statutory accounting'
      ],
      estimatedHours: 30,
      inrAmount: 26000,
      usdAmount: 325
    },
    {
      id: 'MOD-08',
      name: 'Operations Bulletin, News & Blacklist Transparency Registry',
      category: 'Public Information',
      description: 'Public operations reporting for anti-corruption raids and legal awareness camps, alongside a statutory Blacklist registry to deter counterfeit operators.',
      deliverables: [
        'Field operations bulletin with image galleries and categorical filters',
        'Statutory Blacklist registry with FIR references and expulsion notices',
        'Admin publishing tools for creating, updating, and archiving bulletins'
      ],
      estimatedHours: 24,
      inrAmount: 20000,
      usdAmount: 250
    },
    {
      id: 'MOD-09',
      name: 'Admin Command Center & Real-Time Telemetry Dashboard',
      category: 'Administration & Control',
      description: 'Centralized administration dashboard providing complete command oversight, telemetry statistics, full CRUD management across all modules, and data export tools.',
      deliverables: [
        'Comprehensive telemetry overview (Officers, Applications, Grievances, Donations)',
        'Full roster management for accredited officers with photo & badge updating',
        'Membership intake application processing and ID card approval triggers',
        'Grievance case dossier review, status updates, and resolution logging',
        'Full JSON database backup export and restore mechanisms'
      ],
      estimatedHours: 44,
      inrAmount: 38000,
      usdAmount: 475
    },
    {
      id: 'MOD-10',
      name: 'Official Executive Appointment Letter Generator',
      category: 'Document Automation',
      description: 'Digital conferral letter generation under the Indian Trusts Act 1882 (Registration IFA No. 760) with dynamic merge fields, official RAWF Command Seal 760, and authorized signatory.',
      deliverables: [
        'Standard executive conferral letterhead on official foundation stationery',
        'Dynamic placeholder merge (Officer Name, Designation, State, UID, Valid Till)',
        'Vector RAWF Command Seal 760 official stamp integration',
        'Dynamic authorized signature placement',
        'One-click print and high-fidelity PDF export'
      ],
      estimatedHours: 26,
      inrAmount: 22000,
      usdAmount: 275
    },
    {
      id: 'MOD-11',
      name: 'Authorized Signatory & Dynamic Brand Asset Subsystem',
      category: 'Asset Management',
      description: 'Admin upload and management interface for the Authorized Signatory signature image, featuring staging comparison, auto-dimension adjustment, universal multi-context preview, and reactive cross-portal synchronization.',
      deliverables: [
        'Admin image uploader (PNG, JPG, WEBP up to 5MB)',
        'Side-by-side comparison staging banner (Current vs New Staged Signature)',
        'Auto-dimension bounding algorithm preventing stretching or distortion',
        'Reactive event broadcaster updating ID cards, letters, and portals instantly',
        'One-click factory cursive format reset',
        'Parallel official RAWF emblem and logo management subsystem'
      ],
      estimatedHours: 24,
      inrAmount: 21000,
      usdAmount: 260
    },
    {
      id: 'MOD-12',
      name: 'Dual-Stack Production & cPanel Hosting Architecture',
      category: 'DevOps & Infrastructure',
      description: 'Versatile deployment architecture supporting modern Node.js/Express as well as standard Apache + PHP 8+ shared cPanel hosting with MySQL schema, zero-Node fallback API, and SMTP email dispatcher.',
      deliverables: [
        'Node.js / Express backend with Vite development middleware',
        'Zero-Node standalone PHP 8+ REST API (cpanel_deploy/api/index.php)',
        'Automated cPanel deployment ZIP package generator (rawf_deploy_package.zip)',
        'Complete production MySQL database schema (rawf_production_schema.sql)',
        'Secure Apache .htaccess rewrite rules, gzip compression, and security headers',
        'Email server & OTP dispatcher diagnostic for mail.raidactionwing.in (Port 465 SSL)'
      ],
      estimatedHours: 36,
      inrAmount: 32000,
      usdAmount: 400
    }
  ],
  milestones: [
    {
      phase: 'Phase 1',
      title: 'Architectural Discovery, UI/UX Design & Brand Portal',
      timeline: 'Week 1 - 2',
      percentage: 25,
      description: 'Institutional structure, bilingual typography, hero multimedia engine, and core navigation.'
    },
    {
      phase: 'Phase 2',
      title: 'Digital ID Card Engine, Barcode/QR & Verification Portal',
      timeline: 'Week 3 - 4',
      percentage: 25,
      description: 'ISO CR80 vector template, Code 128 barcode, live QR verification, and download portal.'
    },
    {
      phase: 'Phase 3',
      title: 'Workflows: Intake, Grievance Dossier, 80G Donations & News',
      timeline: 'Week 5 - 6',
      percentage: 25,
      description: 'Officer application intake, whistleblower tracking, 80G donation receipts, and operations bulletin.'
    },
    {
      phase: 'Phase 4',
      title: 'Admin Command Suite, Asset Manager, Dual cPanel Stack & QA',
      timeline: 'Week 7 - 8',
      percentage: 25,
      description: 'Admin dashboard, appointment letters, signature manager, cPanel packaging, and deployment.'
    }
  ],
  techStack: {
    frontend: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Motion Animations', 'Lucide Icons'],
    backend: ['Node.js', 'Express.js', 'PHP 8+ cPanel API', 'Nodemailer SMTP'],
    database: ['MySQL 8.0 (Production Schema)', 'SQLite / JSON Unified Store', 'In-Memory Cache'],
    documentsAndMedia: ['docx (Word Engine)', 'jsPDF', 'html2canvas', 'html-to-image', 'QRCode SVG', 'Code 128 Barcode Vector'],
    securityAndDevOps: ['SSL/TLS Encryption', 'Apache .htaccess Hardening', 'Zero Key Exposure', 'cPanel Deploy Package (ZIP)']
  },
  terms: [
    'Scope of Work: All deliverables detailed in Modules 01 through 12 are fully engineered, tested, and ready for deployment.',
    'Intellectual Property: Full proprietary ownership of source code, schemas, and brand assets is transferred to Raid Action Wing Foundation upon final settlement.',
    'Warranty & SLA: Includes 12 Months of complimentary bug-fixing, patch updates, and technical stability maintenance.',
    'Hosting Support: Full turnkey deployment on either cPanel Shared Hosting (Apache + PHP 8+) or VPS/Cloud (Node.js/Passenger) included.',
    'Payment Schedule: 25% Project Advance, 25% Milestone 2 Delivery, 25% Milestone 3 Delivery, 25% Final Deployment & Sign-off.'
  ]
};

export const calculateQuotationTotals = (modules: QuotationModuleItem[], discountPercent = 10) => {
  const totalHours = modules.reduce((sum, item) => sum + item.estimatedHours, 0);
  const subtotalInr = modules.reduce((sum, item) => sum + item.inrAmount, 0);
  const subtotalUsd = modules.reduce((sum, item) => sum + item.usdAmount, 0);
  
  const discountInr = Math.round((subtotalInr * discountPercent) / 100);
  const discountUsd = Math.round((subtotalUsd * discountPercent) / 100);

  const finalInr = subtotalInr - discountInr;
  const finalUsd = subtotalUsd - discountUsd;

  return {
    totalHours,
    subtotalInr,
    subtotalUsd,
    discountPercent,
    discountInr,
    discountUsd,
    finalInr,
    finalUsd
  };
};
