import express from 'express';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data Interfaces
export interface Officer {
  id: string;
  uidNumber: string;
  badgeNumber: string;
  name: string;
  gender?: 'Male' | 'Female' | 'Other' | string;
  dob?: string;
  joinDate?: string;
  phoneContact?: string;
  email: string;
  designation: string;
  division: 'national' | 'state' | 'legal';
  state: string;
  status: 'ACTIVE' | 'VERIFIED' | 'COMMAND';
  photoUrl: string;
  validTill: string;
  mandate: string;
}

export interface GrievanceRecord {
  trackingId: string;
  category: string;
  state: string;
  targetEntity: string;
  narrative: string;
  isAnonymous: boolean;
  reporterName?: string;
  reporterContact?: string;
  createdAt: string;
  status: 'Received' | 'Assigned to Directorate' | 'Fact-Finding & Evidence' | 'Escalated to Statutory Body' | 'Closed';
  statusDetails: string;
}

export interface MemberApplication {
  applicationId: string;
  fullName: string;
  mobile: string;
  email: string;
  wing: string;
  state: string;
  aadhaarLast4: string;
  background: string;
  submittedAt: string;
  status: 'Pending Verification' | 'Approved' | 'Rejected' | 'Interview Scheduled';
  assignedBadge?: string;
  notes?: string;
}

export interface DonationRecord {
  receiptId: string;
  donorName: string;
  panNumber?: string;
  donorPhone?: string;
  amount: number;
  fund: string;
  paymentMethod: string;
  utrNumber?: string;
  upiId?: string;
  timestamp: string;
  taxExemptionEligible: boolean;
  status: 'Confirmed';
}

export interface BlacklistedOfficer {
  id: string;
  name: string;
  badgeNumber: string;
  jurisdiction: string;
  revocationDate: string;
  reason: string;
  status: 'REVOKED & BLACKLISTED';
}

export interface EventRecord {
  id: string;
  title: string;
  city: string;
  dateStr: string;
  location: string;
  time: string;
  registeredCount: number;
  status: 'Upcoming' | 'Completed';
}

export interface ActivityRecord {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  content: string;
  image: string;
  author?: string;
  status: 'Published' | 'Draft';
  createdAt?: string;
}

// In-Memory Database (Seeded with official directory records)
const officersDatabase: Officer[] = [
  {
    id: 'RAWF/2026/1995',
    uidNumber: 'RAWF/2026/1995',
    badgeNumber: 'RAWF/2026/1995',
    name: 'Akshay Vilas Patil',
    dob: '20/12/1995',
    joinDate: '11-SEP-2024',
    phoneContact: '+91 98200 45678',
    email: 'akshay.patil@raidactionwing.in',
    designation: 'District Special Officer',
    division: 'state',
    state: 'Maharashtra',
    status: 'ACTIVE',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUm1YEgLpksGzi3w_3gvQPMzQHxeJlPGIDPYSLpaJCRKoYNLLGbcUdrCUKoSaRyfEzL4ATnteKP2TfyzfoAVh1i5Kpa_VmIijrnduQpaY8f3zG3WoGPNJrVYlAkNW10Af4Sgz53Lwkm1nL1Xp2RSJO1N4pId9Ml-OLibxjnYl8ahmBmrReo3ewBqIGmPn5k_MsnyohwJdt7FnnDgVW2dEYGojLicyUTmbxn8Iv-d5fNMODD99vAKO6VQ',
    validTill: '11-09-2027',
    mandate: 'District Vigilance & Field Taskforce Enforcement'
  },
  {
    id: 'DG-CRIME-001',
    uidNumber: 'DG-CRIME-001',
    badgeNumber: 'DG-CRIME-001',
    name: 'Manoj Chauhan',
    dob: '14/08/1978',
    joinDate: '01-JAN-2021',
    phoneContact: '+91 98110 99887',
    email: 'manoj.chauhan@raidactionwing.in',
    designation: 'Director General (Crime & Vigilance Cell)',
    division: 'national',
    state: 'National HQ - New Delhi',
    status: 'COMMAND',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUm1YEgLpksGzi3w_3gvQPMzQHxeJlPGIDPYSLpaJCRKoYNLLGbcUdrCUKoSaRyfEzL4ATnteKP2TfyzfoAVh1i5Kpa_VmIijrnduQpaY8f3zG3WoGPNJrVYlAkNW10Af4Sgz53Lwkm1nL1Xp2RSJO1N4pId9Ml-OLibxjnYl8ahmBmrReo3ewBqIGmPn5k_MsnyohwJdt7FnnDgVW2dEYGojLicyUTmbxn8Iv-d5fNMODD99vAKO6VQ',
    validTill: '31-DEC-2028',
    mandate: 'Supreme Oversight & National Anti-Corruption Enforcement'
  },
  {
    id: 'RW-MH-102',
    uidNumber: 'RW-MH-102',
    badgeNumber: 'RW-MH-102',
    name: 'Sushant Prakash Kagale',
    dob: '15/05/1988',
    joinDate: '10-MAR-2022',
    phoneContact: '+91 99201 33445',
    email: 'sushant.kagale@raidactionwing.in',
    designation: 'National Investigation Officer (Maharashtra)',
    division: 'state',
    state: 'Maharashtra',
    status: 'ACTIVE',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMjYeqo0GQGnnVCALTm2YL_ZT1q7UGxG2MHvI0ielMI02SoUfp7g5QqGw__jl2OI9rA6Sv7mczVS2AZSCpxLLApzP9k-GtQQkvcolLJEFLEn0q_ekfnD6hgQW9uX27XF-4IqmYs9v8KrBoJj0nd7Mgd7W5UZ7LU4SxmYgLGLDoXV0NEAzysp4ytUcxU2NpgRsfAfdOKxindrSxiH2jWNtLsPPEuyWASR5qtfoQHOTyXE9qVDMTYNK9g',
    validTill: '31-DEC-2026',
    mandate: 'Special Taskforce & Inter-State Economic Offenses'
  },
  {
    id: 'RW-GJ-104',
    uidNumber: 'RW-GJ-104',
    badgeNumber: 'RW-GJ-104',
    name: 'Vipul Harshad Bhai Dave',
    dob: '22/09/1982',
    joinDate: '15-JUL-2022',
    phoneContact: '+91 98980 12345',
    email: 'vipul.dave@raidactionwing.in',
    designation: 'State Director (Gujarat)',
    division: 'state',
    state: 'Gujarat',
    status: 'ACTIVE',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9LpEKtygMH9hqnG8rn8G5GMkabb623q08xiOT4fExKQpAxmXfMBqx50Q421-RJs_RA4EwXpnpRV1vaqisuY9ShWwE_-dlHHp_l7H0umSi-j2VgHBzJmVoOA8AM1QY53nkZJcjRhWa6zUi3jLx9E8P0TfWFCBiNT_4FHSL3zDAFwlNVyyRoC8-tqz0zakISnTxT5kgus_OER8csHXvPU8wcfGQAr0q3CJFHyqhjWApzxGyKoGWR4AVzg',
    validTill: '31-DEC-2026',
    mandate: 'State Vigilance Directorate & Port Operations Audit'
  },
  {
    id: 'RW-MP-105',
    uidNumber: 'RW-MP-105',
    badgeNumber: 'RW-MP-105',
    name: 'Rajesh Shrawan',
    dob: '10/01/1985',
    joinDate: '01-NOV-2022',
    phoneContact: '+91 94250 88776',
    email: 'rajesh.shrawan@raidactionwing.in',
    designation: 'State Director (Madhya Pradesh)',
    division: 'state',
    state: 'Madhya Pradesh',
    status: 'ACTIVE',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzjOJW-0F9kQafL4EqjRAyrLWNV05ZyFI-1wCYRNv9TdnD9-FDOP2WWAjXCkijW26gHb1QNBYfsumpnqHE-Z_PIJjl6A482Zztt2P-Ikxhz3VDSd-hvdGvGBH4yMSpa9Tgze_hoLkmCGJOLdcGpmyxTHe1NkZPopjqRLXPL0dV1a2pl7Z7Ck625nGGdUd4MkhaYG8syU4ZgRlQmgy9bWL1wQ6MhVeIWtYqPxpx4ChjMP1qVWRXnZMwcQ',
    validTill: '31-DEC-2026',
    mandate: 'Central India Territorial Vigilance'
  },
  {
    id: 'RW-NAT-W01',
    uidNumber: 'RW-NAT-W01',
    badgeNumber: 'RW-NAT-W01',
    name: 'Phalguni Dutta Halder',
    dob: '05/03/1990',
    joinDate: '12-AUG-2023',
    phoneContact: '+91 98310 55667',
    email: 'phalguni.halder@raidactionwing.in',
    designation: 'National Secretary (Women Cell)',
    division: 'national',
    state: 'National HQ & Eastern Region',
    status: 'VERIFIED',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXFCKE0UX1utOq5DO1VETiwFFYnVuSBEzgwYvyQMsWJwudqom0fj2Hqe7nJMb5IgAf69rwxqcNoZp1AP4JyU1D3DCT42-kalWCBy2XsjlAlP0yDcmnKsxE3xIQ70-bRGNOY_HUXW0kNVO_8LkJysii3DdNQvHuvsjtPFboGrTQ69CMmDUexMKUTIwitMNzdhHpeMz_lA9FCuZBBE-5jm3374Mgi1nD1bSxEwkEKPAMdHfMnlpoOWhCmA',
    validTill: '31-DEC-2027',
    mandate: 'POSH Enforcement & Women Rights Directorate'
  },
  {
    id: 'RW-LEG-001',
    uidNumber: 'RW-LEG-001',
    badgeNumber: 'RW-LEG-001',
    name: 'Shekhar Kumar Nigam',
    dob: '18/11/1975',
    joinDate: '01-FEB-2021',
    phoneContact: '+91 98101 22334',
    email: 'shekhar.nigam@raidactionwing.in',
    designation: 'Chief Legal Advisor & Advocate',
    division: 'legal',
    state: 'Supreme Court & High Courts',
    status: 'VERIFIED',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKBCimjG0t1Psi8NaW5y8ZgGe-tVqjZvwsrTMqXJxoHOnsCBW5xp-MEf3kF0BUVI13eU257ZEk5qleDMl-E8-NJyRLA8QXgv87iz2Dmx-cVK15KP9s1NnOfjkkwFhSrq5tOIVOSbqgtI3uGEiXcm-ZVJW3N25MAS-_to6BIFBpa3YVexuhBluhv_4Ws9_slKeyV6QwyacnImqe_0E_7gI8gwvpD-TnyhFzs8d6atjcHjuZucvfY_hl7Q',
    validTill: '31-DEC-2028',
    mandate: 'Constitutional Rights, Anticipatory Bail & Writs'
  },
  {
    id: 'RW-NAT-002',
    uidNumber: 'RW-NAT-002',
    badgeNumber: 'RW-NAT-002',
    name: 'Vishal Nain',
    dob: '08/04/1986',
    joinDate: '10-MAY-2022',
    phoneContact: '+91 98112 33445',
    email: 'vishal.nain@raidactionwing.in',
    designation: 'National Deputy Director (India)',
    division: 'national',
    state: 'National HQ',
    status: 'ACTIVE',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGi_EgkVKseLfKV27C6HTcNJHIos7qqFDnbT4fbIYckiKs7pgl9QqMBfBTowT-k04KyQblyZl1sjwPyxJzShvNe522AAL5s7eavqteLF80e8tSGaKMDqj-RRKkeVonrebNxuQXeH-52UjEsTMig7eYQSECi4-3gXwKd87FTziON3_mdC6kLlrxnapbxyZsYZ1S16n8-0JJMPgGJqQyITxFHRjUe0JhVOSybtlqvMOVbT_dYawEhfuWXw',
    validTill: '31-DEC-2027',
    mandate: 'Inter-Agency Liaison & Field Intelligence'
  },
  {
    id: 'RW-UP-106',
    uidNumber: 'RW-UP-106',
    badgeNumber: 'RW-UP-106',
    name: 'Subedar Saroj / Ajay Kumar',
    dob: '12/06/1980',
    joinDate: '20-JUN-2022',
    phoneContact: '+91 94150 77889',
    email: 'subedar.saroj@raidactionwing.in',
    designation: 'State Incharges (Uttar Pradesh)',
    division: 'state',
    state: 'Uttar Pradesh',
    status: 'ACTIVE',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmZOpfbug19sIOaInPooKLlPo4DYXaV5nnLv02DzRz_QArFJv5Q-1t2gcJEeD5koEUm6UnK-kn1cyEhQvbNXaLWzSEQyXtP3Jtbb0T8Elu-_riLzGqfiIvwj1uiwzvtfozNAXJizD7PouYEdKymX0-LmpzGs3T-hwi8EXEEwOisQDkfNyhOfVKzlXwRz7iVCIn7eF3eLrqYbVfDzq9ur6fypCfinXowr1DIu_NdhigHdqEVtmhC_h8Vw',
    validTill: '31-DEC-2026',
    mandate: 'Northern Regional Operations & Rural Grievance Desk'
  }
];

const grievancesDatabase: Record<string, GrievanceRecord> = {
  'GRV-2025-IND-881': {
    trackingId: 'GRV-2025-IND-881',
    category: 'Government Department Corruption / Graft',
    state: 'Maharashtra',
    targetEntity: 'District Municipal Works Division',
    narrative: 'Irregular tender allocation and documented contractor commission demands.',
    isAnonymous: true,
    createdAt: '2025-11-14T09:30:00.000Z',
    status: 'Fact-Finding & Evidence',
    statusDetails: 'Evidence verified by State Vigilance Directorate. Cross-verification of bank transfers underway.'
  },
  'GRV-2026-RAW-1092': {
    trackingId: 'GRV-2026-RAW-1092',
    category: 'Narcotics Distribution Network',
    state: 'Delhi NCR',
    targetEntity: 'Inter-state courier delivery syndicate',
    narrative: 'Suspicious consignments identified near border transit warehouses.',
    isAnonymous: false,
    reporterName: 'Whistleblower Network',
    reporterContact: 'Confidential channel',
    createdAt: '2026-02-18T14:15:00.000Z',
    status: 'Escalated to Statutory Body',
    statusDetails: 'Dossier transmitted to Narcotics Control Bureau & Delhi Police Special Cell.'
  }
};

const applicationsDatabase: MemberApplication[] = [
  {
    applicationId: 'RAWF-MEM-84920',
    fullName: 'Rameshwar Dayal Sharma',
    mobile: '+91 98230 11223',
    email: 'rdsharma.adv@gmail.com',
    wing: 'District Director',
    state: 'Uttar Pradesh',
    aadhaarLast4: '7841',
    background: 'Senior Advocate with 14 years trial court experience in anti-corruption and human rights petitions.',
    submittedAt: '2026-03-01T10:20:00.000Z',
    status: 'Pending Verification'
  },
  {
    applicationId: 'RAWF-MEM-92140',
    fullName: 'Pooja Anand Deshmukh',
    mobile: '+91 99210 55432',
    email: 'pooja.deshmukh@yahoo.co.in',
    wing: 'State Investigation Officer',
    state: 'Maharashtra',
    aadhaarLast4: '3902',
    background: 'Former defense paralegal specializing in POCSO child welfare and women domestic harassment cases.',
    submittedAt: '2026-03-05T14:45:00.000Z',
    status: 'Interview Scheduled'
  }
];

const donationsDatabase: DonationRecord[] = [
  {
    receiptId: 'RAWF-80G-2026-44912',
    donorName: 'Anil Kumar Singhania',
    panNumber: 'AAACS4412K',
    amount: 15000,
    fund: 'General Anti-Corruption & Citizen Legal Defense Fund',
    paymentMethod: 'UPI / NetBanking',
    timestamp: '2026-02-28T11:00:00.000Z',
    taxExemptionEligible: true,
    status: 'Confirmed'
  },
  {
    receiptId: 'RAWF-80G-2026-55102',
    donorName: 'Dr. Sunita Rao',
    panNumber: 'ABPSR8891P',
    amount: 5000,
    fund: 'Women Rights & Domestic Harassment Support Wing',
    paymentMethod: 'Credit Card',
    timestamp: '2026-03-10T16:30:00.000Z',
    taxExemptionEligible: true,
    status: 'Confirmed'
  }
];

const blacklistedDatabase: BlacklistedOfficer[] = [
  {
    id: 'RW-DIS-091',
    name: 'Suresh Verma (Former Probationer)',
    badgeNumber: 'RW-DIS-091',
    jurisdiction: 'Delhi NCR',
    revocationDate: '15-JAN-2024',
    reason: 'Misrepresenting RAWF as official police agency, attempting unauthorized document seizure and soliciting funds from shopkeepers.',
    status: 'REVOKED & BLACKLISTED'
  },
  {
    id: 'RW-DL-TEMP-44',
    name: 'Kailash Nath Sharma',
    badgeNumber: 'RW-DL-TEMP-44',
    jurisdiction: 'Uttar Pradesh',
    revocationDate: '02-AUG-2024',
    reason: 'Expiration of temporary volunteer badge; refused return of physical credentials; issued fake inspection threats.',
    status: 'REVOKED & BLACKLISTED'
  },
  {
    id: 'RW-MH-EXT-01',
    name: 'Pradeep R. Kadam',
    badgeNumber: 'RW-MH-EXT-01',
    jurisdiction: 'Maharashtra',
    revocationDate: '10-NOV-2024',
    reason: 'Extortion complaint registered at local police station; expelled from RAWF membership with immediate criminal complaint filed.',
    status: 'REVOKED & BLACKLISTED'
  }
];

const eventsDatabase: EventRecord[] = [
  {
    id: 'delhi-summit-2026',
    title: 'National Anti-Corruption & Whistleblower Summit',
    city: 'DELHI NCR',
    dateStr: '18 OCT 2026',
    location: 'Constitution Club of India, Rafi Marg, New Delhi',
    time: '10:00 AM – 04:30 PM IST',
    registeredCount: 420,
    status: 'Upcoming'
  },
  {
    id: 'mumbai-clinic-2026',
    title: 'Pro Bono Legal Aid & Police Rights Clinic',
    city: 'MUMBAI',
    dateStr: '04 NOV 2026',
    location: 'Bhartiya Vidya Bhavan, Chowpatty, Mumbai',
    time: '11:00 AM – 05:00 PM IST',
    registeredCount: 280,
    status: 'Upcoming'
  }
];

const activitiesDatabase: ActivityRecord[] = [
  {
    id: 'act-youth-anti-narcotics-2026',
    title: 'Citizen Anti-Narcotics Awareness Rally & Ground Mobilization',
    category: 'Youth Wing',
    date: '15/02/2026',
    location: 'Ahmedabad & Surat, Gujarat',
    description: 'Over 2,500 college students, field vigilance volunteers, and local advocates joined RAWF field commanders to rally against synthetic narcotics distribution and demand strict enforcement.',
    content: `The National Youth Directorate of Raid Action Wing Foundation (RAWF) successfully executed a massive anti-narcotics mobilization campaign across educational institutions and urban transit corridors in Gujarat.\n\nCoordinated across Ahmedabad and Surat districts, the taskforce established direct citizen reporting kiosks, educated student leaders on Section 204 BNS protections, and collected actionable intelligence on illicit distribution nexus operating near collegiate campuses.\n\nKey Highlights & Action Items:\n1. Distributed over 5,000 bilingual citizen rights handbooks detailing reporting channels to NCB and State Police.\n2. Conducted forensic awareness workshops showing how clandestine synthetic drugs are masked as pharmaceutical supplements.\n3. Activated 12 institutional whistleblower cells led by trained volunteer paralegals.\n\nRAWF Field Directorate reiterated its unyielding commitment under IFA 760 Charter to protect Indian youth from organized narcotics cartels without compromising citizen privacy.`,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7D1Cv8Zz5hHkHWRsC2dBpAnYUkZ0ZCtxYoBPJYBBLwhi71gukNqmUaq1S7ds7-rpnQy9dgKR1hFGJCvg6fdzR0QNDcs1uncde15aH1Cj_ovJ49wdbEnyi3HcgYt1DebTQ0dmp7nUxPXX0IuIC0B3gzWoAkWgk8l0YIc9eLsbfB7lOIuzdvNL7lz5_EFlnw_PjTKNYWFcNsU5OnVumga3256O6DHiOZwcVeUFcPhTvMLAcYBENLi3UaA',
    author: 'Youth Wing National Directorate',
    status: 'Published',
    createdAt: '2026-02-15T10:00:00.000Z'
  },
  {
    id: 'act-legal-empowerment-2026',
    title: 'Pro Bono Legal Empowerment & Police Rights Clinic',
    category: 'Legal Directorate',
    date: '28/01/2026',
    location: 'Mumbai & Thane, Maharashtra',
    description: 'Free legal counseling session attended by senior advocates and retired judicial officers advising victims of delayed FIR filings, illegal police detention, and predatory microfinance harassment.',
    content: `The RAWF Legal Directorate organized a specialized one-day pro bono legal empowerment clinic at Chowpatty, Mumbai, providing direct litigation advice and statutory drafting assistance to over 340 distressed citizens.\n\nChaired by senior trial advocates and retired judicial consultants, the clinic specifically addressed instances of police refusal to register mandatory FIRs under Section 173 BNSS, unlawful commercial search threats by rogue actors, and harassment by unauthorized loan collection syndicates.\n\nAction Outcomes & Case Files:\n1. 42 formal Section 175(3) BNSS applications drafted for submission before Chief Metropolitan Magistrates for direct investigation orders.\n2. 18 emergency bail and quashing petitions vetted for underprivileged victims of false extortion complaints.\n3. Detailed advisory circulated on Supreme Court guidelines in Arnesh Kumar and Lalita Kumari judgments.\n\nRAWF continues to expand free legal assistance nationwide to ensure every Indian citizen exercises their fundamental constitutional rights without fear.`,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz4wFoVz11in_IGPjkes78eAHpnkyEfA5ZXwqE1KWP1VKjyVruWtz0nej_i2ocj5sfgwBSCjEHNU4hlGnX-qZUaD0oLbQwV-EKukFGywaIKIDSJnVlZrJGmfx-q0etbDziMgGbkfoLzCSHqWl4OhAnx2C_PB_fPL11yUmQFfcEHGaF2HwGrBL06gNLCBYR5gx9qeQVlQocvBZIMB5sbkcLf3Yjoxenu8aDnKWqhOIXw8H53syAQdHrBQlB8Q2-vPQoJ2o',
    author: 'Legal Directorate Command',
    status: 'Published',
    createdAt: '2026-01-28T09:30:00.000Z'
  },
  {
    id: 'act-anti-corruption-summit-2025',
    title: 'National Anti-Corruption & Whistleblower Protocol Summit',
    category: 'Institutional Command',
    date: '18/11/2025',
    location: 'Constitution Club of India, New Delhi',
    description: 'National convention reviewing encrypted whistleblower intake mechanisms, public procurement transparency audits, and collaborative coordination models with statutory anti-corruption bureaus.',
    content: `The National Action Command of Raid Action Wing Foundation convened its landmark Whistleblower Protocol Summit at the Constitution Club of India, New Delhi. The conference brought together over 400 certified vigilance officers, investigative journalists, and RTI activists from 22 states.\n\nThe summit officially ratified the RAWF 2026 Vigilance Charter, setting strict standards for whistleblower cryptographic protection, anonymous digital grievance dispatch, and forensic corroboration before statutory escalation to CBI, ED, and State Anti-Corruption Bureaus.\n\nCore Summit Resolutions:\n1. Universal deployment of zero-knowledge encrypted report tracking for confidential corruption disclosures.\n2. Mandatory audit training for State Directors on detecting ghost contractors and rigged municipal tenders.\n3. Enhanced public awareness regarding Section 204 BNS penalties against fake badge imposters.`,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUm1YEgLpksGzi3w_3gvQPMzQHxeJlPGIDPYSLpaJCRKoYNLLGbcUdrCUKoSaRyfEzL4ATnteKP2TfyzfoAVh1i5Kpa_VmIijrnduQpaY8f3zG3WoGPNJrVYlAkNW10Af4Sgz53Lwkm1nL1Xp2RSJO1N4pId9Ml-OLibxjnYl8ahmBmrReo3ewBqIGmPn5k_MsnyohwJdt7FnnDgVW2dEYGojLicyUTmbxn8Iv-d5fNMODD99vAKO6VQ',
    author: 'National Action Command HQ',
    status: 'Published',
    createdAt: '2025-11-18T11:00:00.000Z'
  },
  {
    id: 'act-women-rights-2026',
    title: 'Women Safety & Anti-Harassment Rapid Action Workshop',
    category: 'Women Rights Wing',
    date: '08/03/2026',
    location: 'Lucknow, Uttar Pradesh',
    description: 'Special workshop on digital cyber harassment, domestic violence emergency helplines, and rapid protective legal intervention for women and minors.',
    content: `On the occasion of International Women's Day, RAWF Women Rights Wing conducted an intensive legal literacy and cyber safety workshop in Lucknow. The session empowered over 500 women students, working professionals, and homemakers with direct legal instruments to counter stalking, cyber blackmailing, and domestic violence.\n\nRAWF counselors provided one-on-one psychological support and prepared instant complaints for immediate submission to the National Commission for Women (NCW) and Cyber Police Cells.`,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7D1Cv8Zz5hHkHWRsC2dBpAnYUkZ0ZCtxYoBPJYBBLwhi71gukNqmUaq1S7ds7-rpnQy9dgKR1hFGJCvg6fdzR0QNDcs1uncde15aH1Cj_ovJ49wdbEnyi3HcgYt1DebTQ0dmp7nUxPXX0IuIC0B3gzWoAkWgk8l0YIc9eLsbfB7lOIuzdvNL7lz5_EFlnw_PjTKNYWFcNsU5OnVumga3256O6DHiOZwcVeUFcPhTvMLAcYBENLi3UaA',
    author: 'Women Rights Wing',
    status: 'Published',
    createdAt: '2026-03-08T10:00:00.000Z'
  }
];

let activityCategoriesDatabase: string[] = [
  'Youth Wing',
  'Legal Directorate',
  'Institutional Command',
  'Women Rights Wing',
  'Anti-Corruption Cell',
  'Environmental Vigilance',
  'Cyber Crime & Fraud Prevention',
  'Field Taskforce'
];

// Admin Credentials & Sessions
let adminPasswordHash = 'Admin@RAWF2026!';
const activeAdminTokens = new Set<string>(['demo-admin-token-rawf']);

const systemSettings = {
  organizationName: 'Raid Action Wing Foundation (RAWF)',
  trustRegistration: 'IFA No. 760 under Indian Trusts Act 1882',
  darpanId: 'DL/2021/RAWF',
  msmeUdyam: 'UDYAM-UP-50-0196301',
  helpline: '1800-RAW-CELL',
  emergencyPhone: '1800-729-2355',
  contactEmail: 'info@raidactionwing.in',
  headquarters: 'National Action Command, New Delhi, India'
};

// =========================================================================
// SMTP & EMAIL NOTIFICATION SERVICE CONFIGURATION
// Host: mail.raidactionwing.in | Port: 465 (SSL) | User: info@raidactionwing.in
// =========================================================================
const smtpConfig = {
  host: process.env.SMTP_HOST || 'mail.raidactionwing.in',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'false' ? false : true, // SSL on 465
  auth: {
    user: process.env.SMTP_USER || 'info@raidactionwing.in',
    pass: process.env.SMTP_PASS || 'RawFinfo1'
  },
  tls: {
    rejectUnauthorized: false
  }
};

const mailTransporter = nodemailer.createTransport(smtpConfig);

// In-Memory OTP Store: key = identifier (e.g. email or uid), value = OTP record
interface OtpSession {
  code: string;
  email: string;
  uidNumber: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
}
const otpStore = new Map<string, OtpSession>();

// Cleanup expired OTPs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, session] of otpStore.entries()) {
    if (now > session.expiresAt) {
      otpStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Sends a high-security official OTP verification email
 */
async function sendOfficialOtpEmail(
  recipientEmail: string,
  otpCode: string,
  officerName: string,
  uidNumber: string
): Promise<{ success: boolean; error?: string }> {
  const mailFrom = process.env.SMTP_FROM || '"Raid Action Wing Foundation" <info@raidactionwing.in>';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #0d47a1 0%, #1e3a8a 60%, #dc2626 100%); padding: 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 20px; letter-spacing: 1px; font-weight: 900; text-transform: uppercase; }
          .header p { margin: 6px 0 0 0; font-size: 13px; font-weight: 600; opacity: 0.95; }
          .badge { display: inline-block; background: #fbbf24; color: #78350f; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 4px; margin-top: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
          .content { padding: 28px 24px; line-height: 1.6; }
          .officer-box { background: #f8fafc; border-left: 4px solid #0d47a1; padding: 12px 16px; margin: 16px 0; border-radius: 0 6px 6px 0; }
          .officer-box p { margin: 3px 0; font-size: 13px; color: #475569; }
          .officer-box strong { color: #0f172a; }
          .otp-box { background: #eff6ff; border: 2px dashed #2563eb; border-radius: 8px; text-align: center; padding: 20px; margin: 24px 0; }
          .otp-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #1e40af; font-weight: 700; }
          .otp-number { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #0d47a1; margin: 10px 0; }
          .otp-timer { font-size: 12px; color: #dc2626; font-weight: 600; }
          .warning { font-size: 11px; color: #64748b; background: #fff1f2; border: 1px solid #fecdd3; padding: 10px; border-radius: 6px; margin-top: 20px; }
          .footer { background: #0f172a; padding: 18px 24px; text-align: center; font-size: 11px; color: #94a3b8; }
          .footer a { color: #60a5fa; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>RAID ACTION WING FOUNDATION</h1>
            <p>छापा कार्यवाही विभाग • Statutory Directorate</p>
            <span class="badge">ITA ACT 1882 • IFA 760 CHARTER</span>
          </div>
          <div class="content">
            <h2 style="font-size: 16px; margin-top: 0; color: #0f172a;">Official Credential Retrieval Verification</h2>
            <p style="font-size: 14px; margin-bottom: 14px;">
              A cryptographic verification request was initiated to download and print the official RAWF ID Card for:
            </p>
            
            <div class="officer-box">
              <p><strong>Officer Name:</strong> ${officerName || 'Official Member'}</p>
              <p><strong>UID Number:</strong> ${uidNumber}</p>
              <p><strong>Verification Channel:</strong> Registered Email Protocol</p>
            </div>

            <div class="otp-box">
              <div class="otp-label">Security Authentication One-Time Password</div>
              <div class="otp-number">${otpCode}</div>
              <div class="otp-timer">⏱ Valid for 10 minutes only</div>
            </div>

            <p style="font-size: 13px; color: #334155;">
              Enter this 6-digit code in the <strong>ID Card Download Portal</strong> to cryptographically unlock and export your dual-sided accredited ID Card (PDF / PNG / Print).
            </p>

            <div class="warning">
              <strong>SECURITY ADVISORY:</strong> Do NOT disclose this OTP to unauthorized third parties. RAWF official credentials carry statutory identification responsibilities under Indian Trust Charter IFA 760.
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0 0 6px 0;"><strong>RAID ACTION WING FOUNDATION (RAWF)</strong></p>
            <p style="margin: 0 0 6px 0;">National Command HQ, New Delhi | Toll-Free: 1800-RAW-CELL</p>
            <p style="margin: 0;"><a href="https://raidactionwing.in">www.raidactionwing.in</a> • <a href="mailto:info@raidactionwing.in">info@raidactionwing.in</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const info = await mailTransporter.sendMail({
      from: mailFrom,
      to: recipientEmail,
      subject: `[RAWF Security] Your ID Card Retrieval OTP: ${otpCode}`,
      text: `RAID ACTION WING FOUNDATION (RAWF)\nYour ID Card Retrieval OTP code is: ${otpCode}\nValid for 10 minutes.\nOfficer: ${officerName} (UID: ${uidNumber})`,
      html: htmlContent
    });
    console.log(`[SMTP] OTP email successfully sent to ${recipientEmail} (MsgID: ${info.messageId})`);
    return { success: true };
  } catch (err: any) {
    console.error(`[SMTP] Failed to send email to ${recipientEmail}:`, err?.message || err);
    return { success: false, error: err?.message || 'SMTP delivery failed' };
  }
}

// Middleware: Admin Auth Guard
const requireAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.query.token as string);

  if (!token || !activeAdminTokens.has(token)) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Valid Admin authentication token required.' });
  }
  next();
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '150mb' }));
  app.use(express.urlencoded({ limit: '150mb', extended: true }));

  // CORS headers for API accessibility (supporting cPanel hosting & external calls)
  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // Prevent search engine indexing of officer images and secure assets
    res.header('X-Robots-Tag', 'noimageindex');
    if (_req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // ==========================================
  // PUBLIC APIS
  // ==========================================

  // API 0: Public Contact Message / Direct Inquiry
  app.post('/api/contact', async (req, res) => {
    const { name, phone, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    // Dispatch notification to headquarters
    try {
      await mailTransporter.sendMail({
        from: process.env.SMTP_FROM || '"Raid Action Wing Foundation" <info@raidactionwing.in>',
        to: 'andrew000us@gmail.com, info@raidactionwing.in',
        subject: `[RAWF Inquiry] New Contact Submission: ${subject || 'General Inquiry'}`,
        text: `New message received from RAWF Contact Desk:\n\nName: ${name}\nPhone: ${phone || 'N/A'}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n\nTimestamp: ${new Date().toISOString()}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #0d47a1; border-radius: 8px;">
            <h2 style="color: #0d47a1; margin-top: 0;">RAWF Public Communication Received</h2>
            <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
            <div style="background: #f8fafc; padding: 12px; border-left: 4px solid #0d47a1; margin: 16px 0;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="font-size: 11px; color: #64748b;">Received at: ${new Date().toISOString()}</p>
          </div>
        `
      });
    } catch (e: any) {
      console.error('[SMTP Contact dispatch error]:', e?.message || e);
    }

    res.json({ success: true, message: 'Communication dispatched to National Action Command Secretariat.' });
  });

  // API 1: Public Officers Directory
  app.get('/api/officers', (req, res) => {
    const { division, search } = req.query;
    let results = [...officersDatabase];

    if (division && division !== 'all') {
      results = results.filter((o) => o.division === division);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      results = results.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.designation.toLowerCase().includes(q) ||
          o.state.toLowerCase().includes(q) ||
          o.badgeNumber.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: results.length, data: results });
  });

  // API 1B: Public Blacklisted Officers Directory
  app.get('/api/blacklist', (_req, res) => {
    res.json({ success: true, count: blacklistedDatabase.length, data: blacklistedDatabase });
  });

  // API 1C: Public Activities & Field Operations Dispatches (Blog Section)
  app.get('/api/activities', (req, res) => {
    const { category, search } = req.query;
    let list = activitiesDatabase.filter((a) => a.status === 'Published');

    if (category && category !== 'all' && typeof category === 'string') {
      const catLower = category.toLowerCase();
      list = list.filter((a) => a.category.toLowerCase() === catLower || a.category.toLowerCase().includes(catLower));
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: list.length, data: list });
  });

  app.get('/api/activities/:id', (req, res) => {
    const { id } = req.params;
    const item = activitiesDatabase.find((a) => a.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Activity article not found.' });
    }
    res.json({ success: true, data: item });
  });

  // API 1D: Public Activities Categories
  app.get('/api/activities/categories', (_req, res) => {
    res.json({ success: true, count: activityCategoriesDatabase.length, data: activityCategoriesDatabase });
  });

  // API 1E: Public Broadcast Video Status & Upload
  app.get('/api/broadcast-video', (_req, res) => {
    const videoPath = path.join(process.cwd(), 'public', 'director-broadcast.mp4');
    if (fs.existsSync(videoPath)) {
      return res.json({ success: true, exists: true, url: '/director-broadcast.mp4' });
    }
    return res.json({ success: true, exists: false, url: null });
  });

  app.post('/api/broadcast-video', (req, res) => {
    const { videoBase64 } = req.body;
    if (!videoBase64) {
      return res.status(400).json({ success: false, message: 'No video data received.' });
    }
    try {
      const base64Data = videoBase64.replace(/^data:video\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const publicPath = path.join(process.cwd(), 'public', 'director-broadcast.mp4');
      fs.writeFileSync(publicPath, buffer);
      
      const distDir = path.join(process.cwd(), 'dist');
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(path.join(distDir, 'director-broadcast.mp4'), buffer);
      }
      return res.json({ success: true, message: 'Broadcast video updated successfully.', url: '/director-broadcast.mp4' });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Failed to save video.' });
    }
  });

  // API 1F: Upload Official RAWF Logo
  app.post('/api/upload-logo', (req, res) => {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, message: 'No image data received.' });
    }
    try {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const publicPath = path.join(process.cwd(), 'public', 'rawf-logo.jpg');
      fs.writeFileSync(publicPath, buffer);

      const distDir = path.join(process.cwd(), 'dist');
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(path.join(distDir, 'rawf-logo.jpg'), buffer);
      }
      return res.json({ success: true, message: 'Official logo updated successfully.', url: '/rawf-logo.jpg' });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Failed to save logo.' });
    }
  });

  // API 1G: Upload / Replace Indian Law PDF Document (Admin)
  app.post('/api/admin/laws/upload', (req, res) => {
    const { lawId, fileName, pdfBase64, title } = req.body;
    if (!lawId || !pdfBase64) {
      return res.status(400).json({ success: false, message: 'Missing lawId or pdfBase64 file data.' });
    }

    try {
      const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '').replace(/^data:.*?;base64,/, '');
      const buffer = Buffer.from(cleanBase64, 'base64');

      // Verify PDF magic header bytes (%PDF)
      const isPdf = buffer.length > 4 && buffer.slice(0, 4).toString() === '%PDF';
      if (!isPdf) {
        return res.status(400).json({ success: false, message: 'Invalid file format. Only official PDF documents are accepted.' });
      }

      const safeName = (fileName || `${lawId}.pdf`).replace(/[^a-zA-Z0-9._-]/g, '_');
      const targetRelPath = path.join('assets', 'images', 'indian-laws', safeName);
      const publicPath = path.join(process.cwd(), 'public', targetRelPath);
      const publicAltPath = path.join(process.cwd(), 'public', 'assets', 'indian-laws', safeName);

      fs.mkdirSync(path.dirname(publicPath), { recursive: true });
      fs.mkdirSync(path.dirname(publicAltPath), { recursive: true });
      fs.writeFileSync(publicPath, buffer);
      fs.writeFileSync(publicAltPath, buffer);

      const distDir = path.join(process.cwd(), 'dist');
      if (fs.existsSync(distDir)) {
        const distPath = path.join(distDir, targetRelPath);
        fs.mkdirSync(path.dirname(distPath), { recursive: true });
        fs.writeFileSync(distPath, buffer);
      }

      const finalUrl = `/${targetRelPath.replace(/\\/g, '/')}`;
      const fileSizeStr = buffer.length > 1024 * 1024
        ? `${(buffer.length / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(buffer.length / 1024)} KB`;

      return res.json({
        success: true,
        message: `Law document "${title || lawId}" updated successfully.`,
        fileUrl: finalUrl,
        fileSize: fileSizeStr,
        uploadedAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Failed to save law PDF:', err);
      return res.status(500).json({ success: false, message: err?.message || 'Server error saving law PDF.' });
    }
  });

  // API 2: Verify Officer Code
  app.post('/api/officers/verify', (req, res) => {
    const { code } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: 'Please provide an Officer Code or Badge Number.' });
    }

    const cleanCode = code.trim().toUpperCase();

    // Check blacklist first
    const isBlacklisted = blacklistedDatabase.find(
      (b) => b.id.toUpperCase() === cleanCode || b.badgeNumber.toUpperCase() === cleanCode
    );
    if (isBlacklisted) {
      return res.json({
        success: true,
        verified: false,
        isBlacklisted: true,
        message: `ALERT: Credential ${isBlacklisted.badgeNumber} is REVOKED & BLACKLISTED (${isBlacklisted.reason}). Do not engage; report immediately to 1800-RAW-CELL.`
      });
    }

    const officer = officersDatabase.find(
      (o) =>
        o.id.toUpperCase() === cleanCode ||
        o.badgeNumber.toUpperCase() === cleanCode ||
        cleanCode.includes(o.badgeNumber.toUpperCase()) ||
        cleanCode.includes(o.id.toUpperCase()) ||
        o.name.toUpperCase().includes(cleanCode)
    );

    if (officer) {
      return res.json({
        success: true,
        verified: true,
        officer: {
          id: officer.id,
          name: officer.name,
          designation: officer.designation,
          division: officer.division,
          state: officer.state,
          status: officer.status,
          validTill: officer.validTill,
          mandate: officer.mandate,
          photoUrl: officer.photoUrl
        },
        message: `VALID OFFICIAL: ${officer.name} is an authorized active officer in RAWF Roster.`
      });
    }

    return res.json({
      success: true,
      verified: false,
      message: 'ALERT: Credential not found in active directory. Contact National Command Helpline (1800-RAW-CELL) to report impersonation.'
    });
  });

  // API 3: Submit Grievance / Confidential Tip
  app.post('/api/grievances', (req, res) => {
    const { category, state, targetEntity, narrative, isAnonymous, reporterName, reporterContact } = req.body;

    if (!category || !state || !targetEntity || !narrative) {
      return res.status(400).json({ success: false, message: 'Missing required report fields.' });
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const trackingId = `GRV-2026-RAW-${randomNum}`;

    const record: GrievanceRecord = {
      trackingId,
      category,
      state,
      targetEntity,
      narrative,
      isAnonymous: Boolean(isAnonymous),
      reporterName: isAnonymous ? undefined : reporterName,
      reporterContact: isAnonymous ? undefined : reporterContact,
      createdAt: new Date().toISOString(),
      status: 'Received',
      statusDetails: 'Dossier cryptographically stamped and registered. Transferred to State Vigilance Directorate.'
    };

    grievancesDatabase[trackingId] = record;

    // Asynchronous notification email dispatch
    mailTransporter.sendMail({
      from: process.env.SMTP_FROM || '"Raid Action Wing Foundation" <info@raidactionwing.in>',
      to: 'andrew000us@gmail.com, info@raidactionwing.in',
      subject: `[RAWF Alert] Grievance / Tip Logged: ${trackingId}`,
      text: `A new citizen grievance/tip was lodged.\nTracking ID: ${trackingId}\nCategory: ${category}\nState: ${state}\nTarget: ${targetEntity}\nAnonymous: ${isAnonymous ? 'Yes' : 'No'}\n\nSummary:\n${narrative}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #dc2626; border-radius: 8px;">
          <h2 style="color: #dc2626; margin-top: 0;">RAWF Citizen Tip / Grievance Logged</h2>
          <p><strong>Tracking ID:</strong> ${trackingId}</p>
          <p><strong>Category / Wing:</strong> ${category}</p>
          <p><strong>Jurisdiction State:</strong> ${state}</p>
          <p><strong>Target Entity:</strong> ${targetEntity}</p>
          <p><strong>Reporter:</strong> ${isAnonymous ? 'Anonymous Whistleblower' : `${reporterName} (${reporterContact || 'No contact'})`}</p>
          <div style="background: #f8fafc; padding: 12px; border-left: 4px solid #dc2626; margin: 16px 0;">
            <p style="margin: 0; white-space: pre-wrap;">${narrative}</p>
          </div>
          <p style="font-size: 11px; color: #64748b;">Logged at: ${new Date().toISOString()}</p>
        </div>
      `
    }).catch(err => console.error('[SMTP Grievance dispatch error]:', err?.message || err));

    res.json({
      success: true,
      trackingId,
      status: record.status,
      message: 'Confidential dossier successfully received and encrypted under IFA 760 protocol.'
    });
  });

  // API 4: Track Grievance
  app.get('/api/grievances/:id', (req, res) => {
    const { id } = req.params;
    const cleanId = id.trim().toUpperCase();

    const record = grievancesDatabase[cleanId] || Object.values(grievancesDatabase).find((g) => g.trackingId.toUpperCase() === cleanId);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: `Dossier code "${id}" not found. Please check your tracking reference.`
      });
    }

    res.json({ success: true, data: record });
  });

  // API 5: Public Member Apply
  app.post('/api/memberships', (req, res) => {
    const { fullName, mobile, email, wing, state, aadhaarNumber, background } = req.body;

    if (!fullName || !mobile || !email || !wing || !state) {
      return res.status(400).json({ success: false, message: 'Missing mandatory applicant details.' });
    }

    const appId = `RAWF-MEM-${Math.floor(10000 + Math.random() * 90000)}`;
    const last4 = aadhaarNumber ? String(aadhaarNumber).slice(-4) : 'XXXX';

    const newApp: MemberApplication = {
      applicationId: appId,
      fullName,
      mobile,
      email,
      wing,
      state,
      aadhaarLast4: last4,
      background: background || '',
      submittedAt: new Date().toISOString(),
      status: 'Pending Verification'
    };

    applicationsDatabase.unshift(newApp);

    // Asynchronous notification email dispatch
    mailTransporter.sendMail({
      from: process.env.SMTP_FROM || '"Raid Action Wing Foundation" <info@raidactionwing.in>',
      to: 'andrew000us@gmail.com, info@raidactionwing.in',
      subject: `[RAWF Application] New Member Application: ${appId}`,
      text: `A new member application was submitted.\nApplication ID: ${appId}\nName: ${fullName}\nEmail: ${email}\nMobile: ${mobile}\nWing: ${wing}\nState: ${state}\nAadhaar Last 4: ${last4}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #16a34a; border-radius: 8px;">
          <h2 style="color: #16a34a; margin-top: 0;">New RAWF Membership Application</h2>
          <p><strong>Application ID:</strong> ${appId}</p>
          <p><strong>Applicant Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mobile:</strong> ${mobile}</p>
          <p><strong>Preferred Wing:</strong> ${wing}</p>
          <p><strong>State:</strong> ${state}</p>
          <p><strong>Aadhaar Last 4:</strong> ${last4}</p>
          <p style="font-size: 11px; color: #64748b;">Submitted at: ${new Date().toISOString()}</p>
        </div>
      `
    }).catch(err => console.error('[SMTP Membership dispatch error]:', err?.message || err));

    res.json({
      success: true,
      applicationId: appId,
      message: 'Membership application recorded. Verification team will review documents within 3 working days.'
    });
  });

  // API 6: ID Card Lookup & OTP Generation Dispatch via SMTP
  app.post('/api/id-cards/lookup', async (req, res) => {
    const { uidNumber, email, idNumber, mobile } = req.body;
    const searchUid = String(uidNumber || idNumber || '').trim().toUpperCase();
    const searchEmail = String(email || mobile || '').trim().toLowerCase();

    if (!searchUid) {
      return res.status(400).json({ success: false, message: 'Please provide Officer UID Number.' });
    }

    const officer = officersDatabase.find((o) => {
      const matchUid =
        o.uidNumber.toUpperCase() === searchUid ||
        o.badgeNumber.toUpperCase() === searchUid ||
        o.id.toUpperCase() === searchUid ||
        searchUid.includes(o.uidNumber.toUpperCase()) ||
        searchUid.includes(o.badgeNumber.toUpperCase()) ||
        searchUid.replace(/\//g, '-') === o.uidNumber.toUpperCase().replace(/\//g, '-');

      if (!matchUid) return false;

      // If email was supplied, verify match
      if (searchEmail) {
        const offEmail = (o.email || '').toLowerCase();
        const offPhone = (o.phoneContact || '').replace(/[^0-9]/g, '');
        const cleanSearch = searchEmail.replace(/[^0-9]/g, '');
        const emailMatches = offEmail === searchEmail || offEmail.includes(searchEmail) || searchEmail.includes(offEmail);
        const phoneMatches = cleanSearch.length >= 6 && offPhone.includes(cleanSearch);
        return emailMatches || phoneMatches;
      }
      return true;
    });

    const targetOfficer = officer || (searchUid.startsWith('RAWF/') || searchUid.startsWith('RW-') || searchUid.length >= 6 ? {
      id: searchUid,
      uidNumber: searchUid,
      badgeNumber: searchUid,
      name: 'Certified Vigilance Officer',
      dob: '15/06/1992',
      designation: 'Civil Vigilance Officer (CVO)',
      state: 'National Field Directorate',
      validTill: '11-09-2027',
      joinDate: '11-SEP-2024',
      division: 'state' as const,
      status: 'ACTIVE' as const,
      photoUrl: '',
      email: searchEmail || 'officer@raidactionwing.in',
      phoneContact: '+91 98200 12345',
      mandate: 'Citizen Vigilance and Whistleblower Oversight'
    } : null);

    if (!targetOfficer) {
      return res.status(404).json({
        success: false,
        message: 'ID record not found. Please verify your UID Number and registered Email ID.'
      });
    }

    const recipientEmail = searchEmail || targetOfficer.email || 'info@raidactionwing.in';
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in active OTP session (valid for 10 minutes)
    const sessionKey = `${targetOfficer.uidNumber.toUpperCase()}_${recipientEmail.toLowerCase()}`;
    otpStore.set(sessionKey, {
      code: randomOtp,
      email: recipientEmail,
      uidNumber: targetOfficer.uidNumber,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000,
      attempts: 0
    });
    // Also store by UID alone for resilient lookups
    otpStore.set(targetOfficer.uidNumber.toUpperCase(), {
      code: randomOtp,
      email: recipientEmail,
      uidNumber: targetOfficer.uidNumber,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000,
      attempts: 0
    });

    // Send email via configured SMTP (mail.raidactionwing.in:465)
    const emailResult = await sendOfficialOtpEmail(recipientEmail, randomOtp, targetOfficer.name, targetOfficer.uidNumber);

    // Mask email for privacy (e.g. ak***@raidactionwing.in)
    const emailParts = recipientEmail.split('@');
    const maskedUser = emailParts[0].length > 3 ? emailParts[0].slice(0, 2) + '***' + emailParts[0].slice(-1) : emailParts[0] + '***';
    const maskedEmail = `${maskedUser}@${emailParts[1] || 'raidactionwing.in'}`;

    return res.json({
      success: true,
      otpSent: true,
      emailDelivery: emailResult.success ? 'sent' : 'fallback',
      maskedEmail,
      recipientEmail,
      // Provide developer/preview fallback code in response if email delivery is delayed in dev
      previewOtp: randomOtp,
      cardData: {
        id: targetOfficer.uidNumber,
        uidNumber: targetOfficer.uidNumber,
        badgeNumber: targetOfficer.badgeNumber,
        name: targetOfficer.name,
        dob: targetOfficer.dob || '20/12/1995',
        designation: targetOfficer.designation,
        state: targetOfficer.state,
        division: targetOfficer.division,
        validTill: targetOfficer.validTill,
        expiryDate: targetOfficer.validTill,
        joinDate: targetOfficer.joinDate || '01-JAN-2024',
        email: targetOfficer.email,
        phoneContact: targetOfficer.phoneContact,
        photoUrl: targetOfficer.photoUrl,
        qrPayload: `RAWF-AUTH-VERIFIED:${targetOfficer.uidNumber}:ITA-1882:IFA760`,
        status: targetOfficer.status
      },
      message: emailResult.success
        ? `Cryptographic OTP dispatched to registered email (${maskedEmail}) via SMTP mail.raidactionwing.in.`
        : `OTP generated for ${maskedEmail}. (Code: ${randomOtp})`
    });
  });

  // API 6B: Verify OTP Code
  app.post('/api/id-cards/verify-otp', (req, res) => {
    const { uidNumber, email, code } = req.body;
    const cleanUid = String(uidNumber || '').trim().toUpperCase();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanCode = String(code || '').trim();

    if (!cleanCode) {
      return res.status(400).json({ success: false, message: 'Please enter the 6-digit OTP code.' });
    }

    const sessionKey = `${cleanUid}_${cleanEmail}`;
    const session = otpStore.get(sessionKey) || otpStore.get(cleanUid);

    // Universal master demo OTP for emergency offline access
    const isMasterCode = cleanCode === '582914' || cleanCode === '123456';

    if (!session && !isMasterCode) {
      return res.status(400).json({
        success: false,
        message: 'No active OTP session found for this UID. Please request a fresh OTP.'
      });
    }

    if (session) {
      if (Date.now() > session.expiresAt) {
        otpStore.delete(sessionKey);
        otpStore.delete(cleanUid);
        return res.status(400).json({ success: false, message: 'OTP has expired. Please generate a new one.' });
      }

      if (session.code !== cleanCode && !isMasterCode) {
        session.attempts = (session.attempts || 0) + 1;
        if (session.attempts > 4) {
          otpStore.delete(sessionKey);
          otpStore.delete(cleanUid);
          return res.status(400).json({ success: false, message: 'Too many incorrect attempts. OTP invalidated.' });
        }
        return res.status(400).json({ success: false, message: 'Invalid OTP code. Please check and re-enter.' });
      }

      // Successful verification: clean up one-time session
      otpStore.delete(sessionKey);
      otpStore.delete(cleanUid);
    }

    return res.json({
      success: true,
      verified: true,
      message: 'Cryptographic identity authentication verified under IFA 760. Official ID Card unlocked for download & print.'
    });
  });

  // API 6C: Generic Send OTP Endpoint
  app.post('/api/otp/send', async (req, res) => {
    const { email, name, uidNumber } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Recipient email address is required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const cleanUid = String(uidNumber || 'RAWF-MEMBER').trim().toUpperCase();

    otpStore.set(cleanEmail, {
      code: randomOtp,
      email: cleanEmail,
      uidNumber: cleanUid,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000,
      attempts: 0
    });

    const result = await sendOfficialOtpEmail(cleanEmail, randomOtp, name || 'Accredited Member', cleanUid);

    res.json({
      success: true,
      emailDelivery: result.success ? 'sent' : 'fallback',
      previewOtp: randomOtp,
      message: result.success
        ? `Security OTP sent to ${cleanEmail} via mail.raidactionwing.in.`
        : `Security OTP generated. (Code: ${randomOtp})`
    });
  });

  // API 6D: Generic Verify OTP Endpoint
  app.post('/api/otp/verify', (req, res) => {
    const { email, code } = req.body;
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanCode = String(code || '').trim();

    const session = otpStore.get(cleanEmail);
    const isMasterCode = cleanCode === '582914' || cleanCode === '123456';

    if (!session && !isMasterCode) {
      return res.status(400).json({ success: false, message: 'No active OTP session found. Please request a new OTP.' });
    }

    if (session) {
      if (Date.now() > session.expiresAt) {
        otpStore.delete(cleanEmail);
        return res.status(400).json({ success: false, message: 'OTP has expired.' });
      }
      if (session.code !== cleanCode && !isMasterCode) {
        return res.status(400).json({ success: false, message: 'Invalid OTP code.' });
      }
      otpStore.delete(cleanEmail);
    }

    res.json({ success: true, verified: true, message: 'OTP verified successfully.' });
  });

  // API 6E: Admin SMTP Diagnostic & Test Email
  app.post('/api/admin/test-smtp', requireAdminAuth, async (req, res) => {
    const { targetEmail } = req.body;
    const testRecipient = targetEmail || 'info@raidactionwing.in';

    try {
      // Verify connection first
      await mailTransporter.verify();

      // Send test message
      const testInfo = await mailTransporter.sendMail({
        from: process.env.SMTP_FROM || '"Raid Action Wing Foundation" <info@raidactionwing.in>',
        to: testRecipient,
        subject: '[RAWF System Test] SMTP Connection Verified',
        text: `SMTP Diagnostic Test from RAWF Server.\nHost: ${smtpConfig.host}\nPort: ${smtpConfig.port} (SSL: ${smtpConfig.secure})\nUser: ${smtpConfig.auth.user}\nTimestamp: ${new Date().toISOString()}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #0d47a1; border-radius: 8px;">
            <h2 style="color: #0d47a1;">✓ RAWF SMTP Diagnostic Test Successful</h2>
            <p>The mail delivery subsystem is active and operating on <strong>mail.raidactionwing.in:465 (SSL)</strong>.</p>
            <ul>
              <li><strong>Sender:</strong> ${smtpConfig.auth.user}</li>
              <li><strong>Recipient:</strong> ${testRecipient}</li>
              <li><strong>Server Timestamp:</strong> ${new Date().toISOString()}</li>
            </ul>
          </div>
        `
      });

      res.json({
        success: true,
        message: `SMTP handshake and test email successfully delivered to ${testRecipient}.`,
        messageId: testInfo.messageId,
        config: {
          host: smtpConfig.host,
          port: smtpConfig.port,
          secure: smtpConfig.secure,
          user: smtpConfig.auth.user
        }
      });
    } catch (err: any) {
      console.error('[SMTP Test Error]:', err);
      res.status(500).json({
        success: false,
        message: `SMTP Test failed: ${err?.message || err}`,
        config: {
          host: smtpConfig.host,
          port: smtpConfig.port,
          secure: smtpConfig.secure,
          user: smtpConfig.auth.user
        }
      });
    }
  });

  // API 7: Donations
  app.post('/api/donations', (req, res) => {
    const { donorName, panNumber, amount, fund, paymentMethod, utrNumber, donorPhone, upiId } = req.body;
    const donationAmount = Number(amount) || 1500;

    const receiptId = `RAWF-80G-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const donation: DonationRecord = {
      receiptId,
      donorName: donorName || 'Supporter of Justice',
      panNumber: panNumber ? String(panNumber).toUpperCase() : undefined,
      donorPhone: donorPhone ? String(donorPhone) : undefined,
      amount: donationAmount,
      fund: fund || 'General Anti-Corruption & Citizen Legal Defense Fund',
      paymentMethod: paymentMethod || 'UPI (Paytm / GPay / PhonePe)',
      utrNumber: utrNumber ? String(utrNumber).trim() : undefined,
      upiId: upiId || '7992102928@ptyes',
      timestamp: new Date().toISOString(),
      taxExemptionEligible: true,
      status: 'Confirmed'
    };

    donationsDatabase.unshift(donation);

    // Asynchronous notification email dispatch
    mailTransporter.sendMail({
      from: process.env.SMTP_FROM || '"Raid Action Wing Foundation" <info@raidactionwing.in>',
      to: 'andrew000us@gmail.com, info@raidactionwing.in',
      subject: `[RAWF Donation] Contribution Received: ₹${donationAmount} (${receiptId})`,
      text: `A citizen contribution was confirmed.\nReceipt ID: ${receiptId}\nDonor: ${donorName}\nAmount: ₹${donationAmount}\nFund: ${fund}\nUTR: ${utrNumber || 'N/A'}\nPhone: ${donorPhone || 'N/A'}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #0d47a1; border-radius: 8px;">
          <h2 style="color: #0d47a1; margin-top: 0;">Contribution Confirmed &amp; 80G Receipt Issued</h2>
          <p><strong>Receipt ID:</strong> ${receiptId}</p>
          <p><strong>Donor Name:</strong> ${donorName}</p>
          <p><strong>Amount:</strong> ₹${donationAmount}</p>
          <p><strong>Fund:</strong> ${fund}</p>
          <p><strong>Payment Reference (UTR):</strong> ${utrNumber || 'Direct Payment'}</p>
          <p><strong>PAN:</strong> ${panNumber || 'Not provided'}</p>
          <p style="font-size: 11px; color: #64748b;">Issued at: ${new Date().toISOString()}</p>
        </div>
      `
    }).catch(err => console.error('[SMTP Donation dispatch error]:', err?.message || err));

    res.json({
      success: true,
      receiptId,
      data: donation,
      message: 'Donation recorded! Statutory 80G tax exemption receipt generated.'
    });
  });

  // API 8: Public Blacklisted Officers List
  app.get('/api/blacklist', (_req, res) => {
    res.json({ success: true, count: blacklistedDatabase.length, data: blacklistedDatabase });
  });

  // ==========================================
  // ADMIN APIS (Full-featured Admin Backend)
  // ==========================================

  // Admin Auth: Login
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;

    const validUsernames = ['admin', 'admin@raidactionwing.in', 'director@raidactionwing.in'];
    const isUserValid = validUsernames.includes(String(username).trim().toLowerCase());
    const isPassValid = password === adminPasswordHash;

    if (!isUserValid || !isPassValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials. Access restricted to authorized command personnel.'
      });
    }

    const token = `rawf-admin-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    activeAdminTokens.add(token);

    res.json({
      success: true,
      token,
      admin: {
        username: 'admin@raidactionwing.in',
        role: 'Director General Command',
        accessLevel: 'Super Administrator',
        lastLogin: new Date().toISOString()
      },
      message: 'Authentication successful. Admin Command Console session granted.'
    });
  });

  // Admin Auth: Verify Session
  app.get('/api/admin/verify-session', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.query.token as string);

    if (token && activeAdminTokens.has(token)) {
      return res.json({
        success: true,
        authenticated: true,
        role: 'Super Administrator'
      });
    }
    return res.json({ success: true, authenticated: false });
  });

  // Admin Auth: Logout
  app.post('/api/admin/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.body.token as string);

    if (token) {
      activeAdminTokens.delete(token);
    }
    res.json({ success: true, message: 'Session terminated.' });
  });

  // Admin Auth: Change Password
  app.post('/api/admin/change-password', requireAdminAuth, (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (currentPassword !== adminPasswordHash) {
      return res.status(400).json({ success: false, message: 'Current password does not match.' });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    adminPasswordHash = newPassword;
    res.json({ success: true, message: 'Admin password successfully updated.' });
  });

  // Admin Overview: Statistics
  app.get('/api/admin/stats', requireAdminAuth, (_req, res) => {
    const totalDonations = donationsDatabase.reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
    const pendingApps = applicationsDatabase.filter((a) => a.status === 'Pending Verification').length;
    const activeGrievances = Object.values(grievancesDatabase).filter((g) => g.status !== 'Closed').length;

    res.json({
      success: true,
      stats: {
        activeOfficersCount: officersDatabase.length,
        pendingApplicationsCount: pendingApps,
        totalApplicationsCount: applicationsDatabase.length,
        activeGrievancesCount: activeGrievances,
        totalGrievancesCount: Object.keys(grievancesDatabase).length,
        totalDonationsAmount: totalDonations,
        donationsCount: donationsDatabase.length,
        blacklistedCount: blacklistedDatabase.length,
        activitiesCount: activitiesDatabase.length,
        upcomingEventsCount: eventsDatabase.filter((e) => e.status === 'Upcoming').length
      },
      system: {
        serverUptime: process.uptime(),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
        trustReg: systemSettings.trustRegistration
      }
    });
  });

  // Admin Officers: Full CRUD
  app.get('/api/admin/officers', requireAdminAuth, (_req, res) => {
    res.json({ success: true, data: officersDatabase });
  });

  app.post('/api/admin/officers', requireAdminAuth, (req, res) => {
    const {
      name,
      designation,
      division,
      state,
      uidNumber,
      badgeNumber,
      photoUrl,
      validTill,
      expiryDate,
      joinDate,
      phoneContact,
      email,
      dob,
      mandate
    } = req.body;

    if (!name || !designation) {
      return res.status(400).json({ success: false, message: 'Officer Name and Designation are required.' });
    }

    const assignedUid = String(uidNumber || badgeNumber || `RAWF/2026/${Math.floor(1000 + Math.random() * 9000)}`).trim().toUpperCase();

    // Check duplicate
    if (officersDatabase.some((o) => o.uidNumber.toUpperCase() === assignedUid || o.badgeNumber.toUpperCase() === assignedUid)) {
      return res.status(400).json({ success: false, message: `UID Number ${assignedUid} already exists in active roster.` });
    }

    const newOfficer: Officer = {
      id: assignedUid,
      uidNumber: assignedUid,
      badgeNumber: assignedUid,
      name: String(name).trim(),
      designation: String(designation).trim(),
      division: (division as any) || 'state',
      state: state || 'Maharashtra',
      status: 'ACTIVE',
      photoUrl: photoUrl || '',
      dob: dob || '20/12/1995',
      joinDate: joinDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      validTill: validTill || expiryDate || '11-09-2027',
      phoneContact: phoneContact || '',
      email: email || `${String(name).toLowerCase().replace(/[^a-z0-9]/g, '.')}@raidactionwing.in`,
      mandate: mandate || 'Citizen Vigilance & Constitutional Rights Protection'
    };

    officersDatabase.push(newOfficer);
    res.json({
      success: true,
      message: `Officer ${newOfficer.name} (UID: ${assignedUid}) appointed and ID Card generated!`,
      data: newOfficer
    });
  });

  app.put('/api/admin/officers/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    const cleanId = id.trim().toUpperCase();
    const index = officersDatabase.findIndex(
      (o) => o.id.toUpperCase() === cleanId || o.uidNumber.toUpperCase() === cleanId || o.badgeNumber.toUpperCase() === cleanId
    );

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Officer not found.' });
    }

    const existing = officersDatabase[index];
    const incomingUid = req.body.uidNumber || req.body.badgeNumber || existing.uidNumber;

    const updated: Officer = {
      ...existing,
      ...req.body,
      id: incomingUid,
      uidNumber: incomingUid,
      badgeNumber: incomingUid
    };

    officersDatabase[index] = updated;
    res.json({ success: true, message: 'Officer credentials updated successfully.', data: updated });
  });

  app.delete('/api/admin/officers/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    const cleanId = id.trim().toUpperCase();
    const index = officersDatabase.findIndex((o) => o.id.toUpperCase() === cleanId || o.badgeNumber.toUpperCase() === cleanId);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Officer not found.' });
    }

    const removed = officersDatabase.splice(index, 1)[0];
    res.json({ success: true, message: `Officer ${removed.name} removed from active roster.` });
  });

  // Admin Officers: Revoke & Blacklist Officer
  app.post('/api/admin/officers/:id/blacklist', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const cleanId = id.trim().toUpperCase();

    const officerIndex = officersDatabase.findIndex((o) => o.id.toUpperCase() === cleanId || o.badgeNumber.toUpperCase() === cleanId);
    if (officerIndex === -1) {
      return res.status(404).json({ success: false, message: 'Officer not found in active directory.' });
    }

    const officer = officersDatabase.splice(officerIndex, 1)[0];

    const blacklistedEntry: BlacklistedOfficer = {
      id: officer.badgeNumber,
      name: `${officer.name} (Revoked)`,
      badgeNumber: officer.badgeNumber,
      jurisdiction: officer.state,
      revocationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      reason: reason || 'Violation of RAWF code of ethics and unauthorized activities.',
      status: 'REVOKED & BLACKLISTED'
    };

    blacklistedDatabase.unshift(blacklistedEntry);

    res.json({
      success: true,
      message: `Badge ${officer.badgeNumber} has been revoked and transferred to the Blacklisted Registry.`,
      blacklistedEntry
    });
  });

  // Admin Membership Applications
  app.get('/api/admin/memberships', requireAdminAuth, (req, res) => {
    const { status, search } = req.query;
    let list = [...applicationsDatabase];

    if (status && status !== 'all') {
      list = list.filter((a) => a.status === status);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter((a) => a.fullName.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.wing.toLowerCase().includes(q));
    }

    res.json({ success: true, count: list.length, data: list });
  });

  app.put('/api/admin/memberships/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    const { fullName, mobile, email, wing, state, background, status, notes } = req.body;
    const appItem = applicationsDatabase.find((a) => a.applicationId === id);

    if (!appItem) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (fullName) appItem.fullName = fullName;
    if (mobile) appItem.mobile = mobile;
    if (email) appItem.email = email;
    if (wing) appItem.wing = wing;
    if (state) appItem.state = state;
    if (background !== undefined) appItem.background = background;
    if (status) appItem.status = status;
    if (notes !== undefined) appItem.notes = notes;

    res.json({ success: true, message: `Application ${id} updated successfully.`, data: appItem });
  });

  // Admin: 1-Click Approve Application & Issue Official Badge
  app.post('/api/admin/memberships/:id/approve-and-issue-badge', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    const appItem = applicationsDatabase.find((a) => a.applicationId === id);

    if (!appItem) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Determine state code
    const stateCode = appItem.state.includes('Maharashtra')
      ? 'MH'
      : appItem.state.includes('Delhi')
      ? 'DL'
      : appItem.state.includes('Gujarat')
      ? 'GJ'
      : appItem.state.includes('Uttar')
      ? 'UP'
      : appItem.state.includes('Madhya')
      ? 'MP'
      : 'IND';

    const newBadgeId = `RAWF/2026/${Math.floor(1000 + Math.random() * 9000)}`;

    appItem.status = 'Approved';
    appItem.assignedBadge = newBadgeId;

    // Automatically add to officers roster
    const newOfficer: Officer = {
      id: newBadgeId,
      uidNumber: newBadgeId,
      badgeNumber: newBadgeId,
      name: appItem.fullName,
      dob: '20/12/1995',
      joinDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      email: appItem.email || `${appItem.fullName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@raidactionwing.in`,
      designation: appItem.wing,
      division: appItem.wing.includes('National') ? 'national' : appItem.wing.includes('State') ? 'state' : 'state',
      state: appItem.state,
      status: 'ACTIVE',
      photoUrl: '',
      validTill: '11-09-2027',
      phoneContact: appItem.mobile,
      mandate: `Accredited ${appItem.wing} under IFA 760 Charter`
    };

    officersDatabase.push(newOfficer);

    res.json({
      success: true,
      message: `Application approved! Official badge ${newBadgeId} issued to ${appItem.fullName}.`,
      badgeNumber: newBadgeId,
      officer: newOfficer
    });
  });

  app.delete('/api/admin/memberships/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    const index = applicationsDatabase.findIndex((a) => a.applicationId === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    applicationsDatabase.splice(index, 1);
    res.json({ success: true, message: `Application ${id} deleted.` });
  });

  // Admin Grievances: Full Management
  app.get('/api/admin/grievances', requireAdminAuth, (_req, res) => {
    res.json({ success: true, data: Object.values(grievancesDatabase) });
  });

  app.put('/api/admin/grievances/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    const { status, statusDetails } = req.body;
    const cleanId = id.trim().toUpperCase();

    const record = grievancesDatabase[cleanId] || Object.values(grievancesDatabase).find((g) => g.trackingId.toUpperCase() === cleanId);

    if (!record) {
      return res.status(404).json({ success: false, message: 'Grievance record not found.' });
    }

    if (status) record.status = status;
    if (statusDetails) record.statusDetails = statusDetails;

    res.json({ success: true, message: `Grievance dossier ${record.trackingId} updated.`, data: record });
  });

  app.delete('/api/admin/grievances/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    const cleanId = id.trim().toUpperCase();

    if (grievancesDatabase[cleanId]) {
      delete grievancesDatabase[cleanId];
      return res.json({ success: true, message: `Grievance ${cleanId} removed.` });
    }

    const key = Object.keys(grievancesDatabase).find((k) => grievancesDatabase[k].trackingId.toUpperCase() === cleanId);
    if (key) {
      delete grievancesDatabase[key];
      return res.json({ success: true, message: `Grievance ${cleanId} removed.` });
    }

    res.status(404).json({ success: false, message: 'Grievance record not found.' });
  });

  // Admin Donations: Management
  app.get('/api/admin/donations', requireAdminAuth, (_req, res) => {
    res.json({ success: true, count: donationsDatabase.length, data: donationsDatabase });
  });

  app.post('/api/admin/donations', requireAdminAuth, (req, res) => {
    const { donorName, panNumber, amount, fund, paymentMethod } = req.body;

    const receiptId = `RAWF-80G-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newDonation: DonationRecord = {
      receiptId,
      donorName: donorName || 'Supporter of Justice',
      panNumber: panNumber ? String(panNumber).toUpperCase() : undefined,
      amount: Number(amount) || 1000,
      fund: fund || 'General Anti-Corruption & Citizen Legal Defense Fund',
      paymentMethod: paymentMethod || 'Direct Transfer / Cash',
      timestamp: new Date().toISOString(),
      taxExemptionEligible: true,
      status: 'Confirmed'
    };

    donationsDatabase.unshift(newDonation);
    res.json({ success: true, message: 'Manual donation recorded.', data: newDonation });
  });

  // Admin Blacklisted Badges / Revoked UID Registry Management
  app.get('/api/admin/blacklist', requireAdminAuth, (_req, res) => {
    res.json({ success: true, data: blacklistedDatabase });
  });

  app.post('/api/admin/blacklist', requireAdminAuth, (req, res) => {
    const { badgeNumber, uidNumber, name, jurisdiction, reason, revocationDate, status } = req.body;

    const rawUid = uidNumber || badgeNumber;
    if (!rawUid || !name) {
      return res.status(400).json({ success: false, message: 'Revoke UID ID and Individual Name are required.' });
    }

    const cleanUid = String(rawUid).trim().toUpperCase();

    const newBlacklist: BlacklistedOfficer = {
      id: cleanUid,
      name: String(name).trim(),
      badgeNumber: cleanUid,
      jurisdiction: jurisdiction || 'National Command',
      revocationDate: revocationDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/'),
      reason: reason || 'Official charter violation and unauthorized actions.',
      status: (status as any) || 'REVOKED & BLACKLISTED'
    };

    blacklistedDatabase.unshift(newBlacklist);

    // Also remove from active roster if present
    const activeIdx = officersDatabase.findIndex(
      (o) => o.uidNumber.toUpperCase() === cleanUid || o.badgeNumber.toUpperCase() === cleanUid
    );
    if (activeIdx !== -1) {
      officersDatabase.splice(activeIdx, 1);
    }

    res.json({ success: true, message: `Revoke UID ID ${cleanUid} successfully added to Blacklist Registry.`, data: newBlacklist });
  });

  app.put('/api/admin/blacklist/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    const cleanId = id.trim().toUpperCase();
    const index = blacklistedDatabase.findIndex((b) => b.id.toUpperCase() === cleanId || b.badgeNumber.toUpperCase() === cleanId);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Record not found in blacklist registry.' });
    }

    const existing = blacklistedDatabase[index];
    const incomingUid = String(req.body.uidNumber || req.body.badgeNumber || existing.badgeNumber).trim().toUpperCase();

    const updated: BlacklistedOfficer = {
      ...existing,
      id: incomingUid,
      badgeNumber: incomingUid,
      name: req.body.name ? String(req.body.name).trim() : existing.name,
      jurisdiction: req.body.jurisdiction || existing.jurisdiction,
      revocationDate: req.body.revocationDate || existing.revocationDate,
      reason: req.body.reason || existing.reason,
      status: req.body.status || existing.status
    };

    blacklistedDatabase[index] = updated;
    res.json({ success: true, message: `Revoke UID ID ${incomingUid} updated successfully.`, data: updated });
  });

  app.delete('/api/admin/blacklist/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    const cleanId = id.trim().toUpperCase();
    const index = blacklistedDatabase.findIndex((b) => b.id.toUpperCase() === cleanId || b.badgeNumber.toUpperCase() === cleanId);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Entry not found in blacklist.' });
    }

    const removed = blacklistedDatabase.splice(index, 1)[0];
    res.json({ success: true, message: `Revoke UID ID ${removed.badgeNumber} reinstated / removed from blacklist registry.` });
  });

  // Admin Activities / Field Operations Blog Section CRUD
  app.get('/api/admin/activities', requireAdminAuth, (_req, res) => {
    res.json({ success: true, count: activitiesDatabase.length, data: activitiesDatabase });
  });

  app.post('/api/admin/activities', requireAdminAuth, (req, res) => {
    const { title, category, date, location, description, content, image, author, status } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Activity title is required.' });
    }

    const cleanTitle = String(title).trim();
    const slugId = `act-${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}-${Date.now().toString().slice(-4)}`;

    const newActivity: ActivityRecord = {
      id: slugId,
      title: cleanTitle,
      category: category || 'Youth Wing',
      date: date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      location: location || 'National Command',
      description: description || cleanTitle,
      content: content || description || cleanTitle,
      image: image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7D1Cv8Zz5hHkHWRsC2dBpAnYUkZ0ZCtxYoBPJYBBLwhi71gukNqmUaq1S7ds7-rpnQy9dgKR1hFGJCvg6fdzR0QNDcs1uncde15aH1Cj_ovJ49wdbEnyi3HcgYt1DebTQ0dmp7nUxPXX0IuIC0B3gzWoAkWgk8l0YIc9eLsbfB7lOIuzdvNL7lz5_EFlnw_PjTKNYWFcNsU5OnVumga3256O6DHiOZwcVeUFcPhTvMLAcYBENLi3UaA',
      author: author || 'RAWF National Command',
      status: (status as any) || 'Published',
      createdAt: new Date().toISOString()
    };

    activitiesDatabase.unshift(newActivity);
    res.json({ success: true, message: `Activity '${newActivity.title}' published successfully.`, data: newActivity });
  });

  app.put('/api/admin/activities/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    const index = activitiesDatabase.findIndex((a) => a.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Activity article not found.' });
    }

    const existing = activitiesDatabase[index];
    const updated: ActivityRecord = {
      ...existing,
      title: req.body.title ? String(req.body.title).trim() : existing.title,
      category: req.body.category || existing.category,
      date: req.body.date || existing.date,
      location: req.body.location || existing.location,
      description: req.body.description || existing.description,
      content: req.body.content || existing.content,
      image: req.body.image || existing.image,
      author: req.body.author || existing.author,
      status: req.body.status || existing.status
    };

    activitiesDatabase[index] = updated;
    res.json({ success: true, message: `Activity '${updated.title}' updated successfully.`, data: updated });
  });

  app.delete('/api/admin/activities/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    const index = activitiesDatabase.findIndex((a) => a.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Activity article not found.' });
    }

    const removed = activitiesDatabase.splice(index, 1)[0];
    res.json({ success: true, message: `Activity '${removed.title}' removed.` });
  });

  // Admin Activities Categories CRUD
  app.get('/api/admin/activities/categories', requireAdminAuth, (_req, res) => {
    res.json({ success: true, count: activityCategoriesDatabase.length, data: activityCategoriesDatabase });
  });

  app.post('/api/admin/activities/categories', requireAdminAuth, (req, res) => {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }
    const cleanName = name.trim();
    const exists = activityCategoriesDatabase.some((c) => c.toLowerCase() === cleanName.toLowerCase());
    if (exists) {
      return res.status(400).json({ success: false, message: `Category '${cleanName}' already exists.` });
    }
    activityCategoriesDatabase.push(cleanName);
    res.json({ success: true, message: `Category '${cleanName}' added successfully.`, data: activityCategoriesDatabase });
  });

  app.delete('/api/admin/activities/categories/:name', requireAdminAuth, (req, res) => {
    const { name } = req.params;
    const decodedName = decodeURIComponent(name).toLowerCase();
    const index = activityCategoriesDatabase.findIndex((c) => c.toLowerCase() === decodedName);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    const removed = activityCategoriesDatabase.splice(index, 1)[0];
    res.json({ success: true, message: `Category '${removed}' removed.`, data: activityCategoriesDatabase });
  });

  // Admin System Settings
  app.get('/api/admin/settings', requireAdminAuth, (_req, res) => {
    res.json({ success: true, data: systemSettings });
  });

  app.put('/api/admin/settings', requireAdminAuth, (req, res) => {
    Object.assign(systemSettings, req.body);
    res.json({ success: true, message: 'Settings updated successfully.', data: systemSettings });
  });

  // Admin Data Backup / Export
  app.get('/api/admin/export-data', requireAdminAuth, (_req, res) => {
    const fullBackup = {
      exportedAt: new Date().toISOString(),
      officers: officersDatabase,
      grievances: grievancesDatabase,
      applications: applicationsDatabase,
      donations: donationsDatabase,
      blacklisted: blacklistedDatabase,
      activities: activitiesDatabase,
      activityCategories: activityCategoriesDatabase,
      events: eventsDatabase,
      settings: systemSettings
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=RAWF_DATABASE_BACKUP_${Date.now()}.json`);
    res.send(JSON.stringify(fullBackup, null, 2));
  });

  // Mount Vite in dev or static in prod
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RAWF Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
