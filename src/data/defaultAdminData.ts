export interface OfficerRecord {
  id?: number | string;
  name: string;
  fullName?: string;
  uidNumber: string;
  badgeNumber?: string;
  designation: string;
  division?: string;
  state: string;
  gender: string;
  dob: string;
  joinDate: string;
  validTill: string;
  phoneContact: string;
  email: string;
  photoUrl: string;
  mandate: string;
  isActive?: boolean;
  isAssigned?: boolean;
}

export interface ApplicationRecord {
  id?: number | string;
  applicationId: string;
  fullName: string;
  wing: string;
  designation: string;
  state: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  address: string;
  idProofType: string;
  idProofNumber: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Under Review';
  submittedAt: string;
  photoUrl?: string;
}

export interface GrievanceRecord {
  id?: number | string;
  trackingCode: string;
  trackingId?: string;
  category: string;
  title: string;
  description: string;
  state: string;
  district?: string;
  isAnonymous: boolean;
  complainantName: string;
  contactNumber: string;
  status: string;
  statusDetails?: string;
  createdAt: string;
  evidenceFiles?: string[];
}

export interface DonationRecord {
  id?: number | string;
  receiptNumber: string;
  donorName: string;
  amount: number;
  panNumber: string;
  email: string;
  phone: string;
  state: string;
  cause: string;
  paymentMode: string;
  paymentStatus: 'Success' | 'Pending' | 'Failed';
  donationDate: string;
}

export interface ActivityRecord {
  id?: number | string;
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  content: string;
  image: string;
  author: string;
  status: 'Published' | 'Draft';
}

export const INITIAL_OFFICERS: OfficerRecord[] = [
  {
    id: 'RAWF/2026/1376',
    name: 'Andrew Paul',
    fullName: 'Andrew Paul',
    uidNumber: 'RAWF/2026/1376',
    badgeNumber: 'RAWF/2026/1376',
    designation: 'District Special Officer',
    division: 'state',
    state: 'Tamil Nadu',
    gender: 'Male',
    dob: '1995-12-20',
    joinDate: '2024-09-11',
    validTill: '2027-09-11',
    phoneContact: '+91 98200 45678',
    email: 'andrew000us@gmail.com',
    photoUrl: '',
    mandate: 'Citizen Vigilance & Constitutional Anti-Corruption Enforcement',
    isActive: true,
    isAssigned: true
  }
];

export const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 1,
    applicationId: 'APP-2026-RAW-4019',
    fullName: 'Kavita Joshi',
    wing: 'Women Rights Wing',
    designation: 'State Coordinator',
    state: 'Rajasthan',
    phone: '+91 98765 43210',
    email: 'kavita.joshi@example.com',
    dob: '1992-05-14',
    gender: 'Female',
    address: 'Sector 4, Mansarovar, Jaipur, Rajasthan',
    idProofType: 'Aadhaar Card',
    idProofNumber: 'XXXX-XXXX-8921',
    status: 'Pending',
    submittedAt: '2026-09-27 11:30 AM',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 2,
    applicationId: 'APP-2026-RAW-3892',
    fullName: 'Anand K. Mehra',
    wing: 'Youth Vigilance & Anti-Drug Wing',
    designation: 'Field Officer',
    state: 'Punjab',
    phone: '+91 98123 45678',
    email: 'anand.mehra@example.com',
    dob: '1997-09-03',
    gender: 'Male',
    address: 'Model Town, Ludhiana, Punjab',
    idProofType: 'Voter ID',
    idProofNumber: 'PB/04/129841',
    status: 'Pending',
    submittedAt: '2026-09-26 04:15 PM',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 3,
    applicationId: 'APP-2026-RAW-3104',
    fullName: 'Mohd. Tariq Siddiqui',
    wing: 'RTI & Public Transparency Cell',
    designation: 'District Director',
    state: 'Uttar Pradesh',
    phone: '+91 94150 99887',
    email: 'tariq.siddiqui@example.com',
    dob: '1984-11-29',
    gender: 'Male',
    address: 'Civil Lines, Bareilly, Uttar Pradesh',
    idProofType: 'PAN Card',
    idProofNumber: 'ABCPS1234F',
    status: 'Approved',
    submittedAt: '2026-09-24 02:00 PM',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300'
  }
];

export const INITIAL_GRIEVANCES: GrievanceRecord[] = [
  {
    id: 1,
    trackingCode: 'GRV-2026-RAW-8841',
    trackingId: 'GRV-2026-RAW-8841',
    category: 'Illegal Sand Mining & Riverbed Extraction',
    title: 'Unauthorized riverbed sand dredging without NGT environmental clearance',
    description: 'Heavy machinery operating on riverbeds violating NGT monsoon ban and siphoning state royalty in connivance with local authorities.',
    state: 'Madhya Pradesh',
    district: 'Hoshangabad',
    isAnonymous: true,
    complainantName: 'Confidential Citizen',
    contactNumber: 'N/A (Anonymous)',
    status: 'Under Investigation',
    statusDetails: 'Evidence footage compiled; formal representation submitted to District Collector & NGT Principal Bench.',
    createdAt: '2026-09-25'
  },
  {
    id: 2,
    trackingCode: 'GRV-2026-RAW-7712',
    trackingId: 'GRV-2026-RAW-7712',
    category: 'Public Distribution System (PDS) Ration Diversion',
    title: 'Fair price shop siphoning subsidized grain to open black market',
    description: 'BPL ration beneficiaries denied monthly quota; biometrics manipulated with bogus proxy receipts.',
    state: 'Bihar',
    district: 'Gaya',
    isAnonymous: false,
    complainantName: 'Ramesh Kumar Mandal',
    contactNumber: '+91 94312 34567',
    status: 'Escalated to Statutory Body',
    statusDetails: 'Detailed audit dossier submitted to Food & Civil Supplies Directorate and District Magistrate.',
    createdAt: '2026-09-22'
  },
  {
    id: 3,
    trackingCode: 'GRV-2026-RAW-6409',
    trackingId: 'GRV-2026-RAW-6409',
    category: 'Hospital Emergency Overcharging & Bed Blackmarketing',
    title: 'Private hospital refusing emergency admission under Ayushman Bharat card',
    description: 'Hospital administration demanding exorbitant cash deposit despite valid PMJAY card presentation.',
    state: 'Maharashtra',
    district: 'Pune',
    isAnonymous: false,
    complainantName: 'Sunil G. Shinde',
    contactNumber: '+91 98230 11223',
    status: 'Resolved',
    statusDetails: 'RAWF Legal Aid Cell intervened on site; patient admitted under zero-deposit cashless scheme.',
    createdAt: '2026-09-18'
  }
];

export const INITIAL_DONATIONS: DonationRecord[] = [
  {
    id: 1,
    receiptNumber: '80G-2026-0891',
    donorName: 'Harishchandra Mehra',
    amount: 25000,
    panNumber: 'AAAPM1234C',
    email: 'h.mehra@example.com',
    phone: '+91 98201 23456',
    state: 'Maharashtra',
    cause: 'Pro Bono Legal Aid & Whistleblower Defense',
    paymentMode: 'UPI / QR',
    paymentStatus: 'Success',
    donationDate: '2026-09-26'
  },
  {
    id: 2,
    receiptNumber: '80G-2026-0890',
    donorName: 'Dr. Anita Sengupta',
    amount: 10000,
    panNumber: 'BKDPS5678K',
    email: 'anita.sengupta@example.com',
    phone: '+91 98310 98765',
    state: 'West Bengal',
    cause: 'Mid-Day-Meal Nutrition & Food Quality Audits',
    paymentMode: 'Net Banking',
    paymentStatus: 'Success',
    donationDate: '2026-09-24'
  },
  {
    id: 3,
    receiptNumber: '80G-2026-0889',
    donorName: 'Vikas Agarwal & Sons',
    amount: 51000,
    panNumber: 'AAAFV9012J',
    email: 'vikas.agarwal@example.com',
    phone: '+91 98110 55443',
    state: 'Delhi NCR',
    cause: 'Anti-Human Trafficking & Rescue Missions',
    paymentMode: 'Bank NEFT',
    paymentStatus: 'Success',
    donationDate: '2026-09-20'
  }
];

export const INITIAL_ACTIVITIES: ActivityRecord[] = [
  {
    id: 1,
    title: 'National Anti-Corruption Conclave 2026 Held at New Delhi',
    category: 'National Command',
    date: '2026-09-20',
    location: 'Constitution Club of India, New Delhi',
    description: 'Over 450 field vigilance officers convened for the annual strategy session on digital evidence collection and constitutional whistleblower defense.',
    content: 'The National Command Council under Director General Nilesh Thakar declared a nationwide crackdown on bogus NGO representations and launched the automated IFA 760 Digital Verification Portal.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600',
    author: 'RAWF National Command',
    status: 'Published'
  },
  {
    id: 2,
    title: 'Pro Bono Legal Aid Clinic Organised for Rural Farmers',
    category: 'Legal Directorate',
    date: '2026-09-15',
    location: 'Nashik, Maharashtra',
    description: 'Free legal counseling provided to 120+ marginal farmers regarding fraudulent land mortgage agreements and informal moneylender exploitation.',
    content: 'Adv. Sunita Rao and the Maharashtra Legal Directorate reviewed 45 suspicious promissory notes and initiated representation before the Sub-Divisional Magistrate.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
    author: 'Adv. Sunita Rao',
    status: 'Published'
  },
  {
    id: 3,
    title: 'Mid-Day-Meal Food Quality Inspection Drive Across 18 Schools',
    category: 'Field Taskforce',
    date: '2026-09-10',
    location: 'Lucknow & Sitapur, UP',
    description: 'Surprise quality checks conducted on government primary school meal kitchens to verify nutritional compliance and hygiene standards.',
    content: 'Inspection findings and lab sample test requests were formally handed over to the Basic Shiksha Adhikari (BSA) with an ultimatum to replace substandard supplier grain batches.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600',
    author: 'Vikram Singh',
    status: 'Published'
  }
];

export const INITIAL_BLACKLIST = [
  {
    id: 1,
    name: 'Suresh Verma (Former Probationer)',
    uidNumber: 'RW-DIS-091',
    badgeNumber: 'RW-DIS-091',
    jurisdiction: 'Delhi NCR',
    revocationDate: '15-JAN-2024',
    reason: 'Misrepresenting RAWF as official police agency, attempting unauthorized document seizure and soliciting funds from shopkeepers.',
    status: 'REVOKED & BLACKLISTED'
  },
  {
    id: 2,
    name: 'Kailash Nath Sharma',
    uidNumber: 'RW-DL-TEMP-44',
    badgeNumber: 'RW-DL-TEMP-44',
    jurisdiction: 'Uttar Pradesh',
    revocationDate: '02-AUG-2024',
    reason: 'Expiration of temporary volunteer badge; refused return of physical credentials; issued fake inspection threats.',
    status: 'REVOKED & BLACKLISTED'
  },
  {
    id: 3,
    name: 'Pradeep R. Kadam',
    uidNumber: 'RW-MH-EXT-01',
    badgeNumber: 'RW-MH-EXT-01',
    jurisdiction: 'Maharashtra',
    revocationDate: '10-NOV-2024',
    reason: 'Extortion complaint registered at local police station; expelled from RAWF membership with immediate criminal complaint filed.',
    status: 'REVOKED & BLACKLISTED'
  }
];

export const INITIAL_STATS = {
  activeOfficersCount: 6,
  totalOfficersCount: 6,
  pendingApplicationsCount: 2,
  totalApplicationsCount: 3,
  activeGrievancesCount: 2,
  totalGrievancesCount: 3,
  totalDonationsAmount: 86000,
  donationsCount: 3,
  blacklistedCount: 3
};

export const INITIAL_SETTINGS = {
  organizationName: 'RAID ACTION WING FOUNDATION (RAWF)',
  helpline: '1800-RAW-CELL / +91 98200 45678',
  email: 'command@raidactionwing.in',
  address: 'National HQ, New Delhi • Registered under ITA Act 1882 & IFA 760 Charter',
  nitiAayogDarpan: 'DL/2021/RAWF',
  msmeUdyam: 'UP-50-0196301'
};
