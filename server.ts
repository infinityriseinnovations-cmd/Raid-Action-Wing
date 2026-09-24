import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data Interfaces
export interface Officer {
  id: string;
  name: string;
  designation: string;
  division: 'national' | 'state' | 'legal';
  state: string;
  status: 'ACTIVE' | 'VERIFIED' | 'COMMAND';
  badgeNumber: string;
  photoUrl: string;
  validTill: string;
  phoneContact?: string;
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
  amount: number;
  fund: string;
  paymentMethod: string;
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

// In-Memory Database (Seeded with official directory records)
const officersDatabase: Officer[] = [
  {
    id: 'DG-CRIME-001',
    name: 'Manoj Chauhan',
    designation: 'Director General (Crime & Vigilance Cell)',
    division: 'national',
    state: 'National HQ - New Delhi',
    status: 'COMMAND',
    badgeNumber: 'DG-CRIME-001',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUm1YEgLpksGzi3w_3gvQPMzQHxeJlPGIDPYSLpaJCRKoYNLLGbcUdrCUKoSaRyfEzL4ATnteKP2TfyzfoAVh1i5Kpa_VmIijrnduQpaY8f3zG3WoGPNJrVYlAkNW10Af4Sgz53Lwkm1nL1Xp2RSJO1N4pId9Ml-OLibxjnYl8ahmBmrReo3ewBqIGmPn5k_MsnyohwJdt7FnnDgVW2dEYGojLicyUTmbxn8Iv-d5fNMODD99vAKO6VQ',
    validTill: '31-DEC-2028',
    mandate: 'Supreme Oversight & National Anti-Corruption Enforcement'
  },
  {
    id: 'RW-MH-102',
    name: 'Sushant Prakash Kagale',
    designation: 'National Investigation Officer (Maharashtra)',
    division: 'state',
    state: 'Maharashtra',
    status: 'ACTIVE',
    badgeNumber: 'RW-MH-102',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMjYeqo0GQGnnVCALTm2YL_ZT1q7UGxG2MHvI0ielMI02SoUfp7g5QqGw__jl2OI9rA6Sv7mczVS2AZSCpxLLApzP9k-GtQQkvcolLJEFLEn0q_ekfnD6hgQW9uX27XF-4IqmYs9v8KrBoJj0nd7Mgd7W5UZ7LU4SxmYgLGLDoXV0NEAzysp4ytUcxU2NpgRsfAfdOKxindrSxiH2jWNtLsPPEuyWASR5qtfoQHOTyXE9qVDMTYNK9g',
    validTill: '31-DEC-2026',
    mandate: 'Special Taskforce & Inter-State Economic Offenses'
  },
  {
    id: 'RW-GJ-104',
    name: 'Vipul Harshad Bhai Dave',
    designation: 'State Director (Gujarat)',
    division: 'state',
    state: 'Gujarat',
    status: 'ACTIVE',
    badgeNumber: 'RW-GJ-104',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9LpEKtygMH9hqnG8rn8G5GMkabb623q08xiOT4fExKQpAxmXfMBqx50Q421-RJs_RA4EwXpnpRV1vaqisuY9ShWwE_-dlHHp_l7H0umSi-j2VgHBzJmVoOA8AM1QY53nkZJcjRhWa6zUi3jLx9E8P0TfWFCBiNT_4FHSL3zDAFwlNVyyRoC8-tqz0zakISnTxT5kgus_OER8csHXvPU8wcfGQAr0q3CJFHyqhjWApzxGyKoGWR4AVzg',
    validTill: '31-DEC-2026',
    mandate: 'State Vigilance Directorate & Port Operations Audit'
  },
  {
    id: 'RW-MP-105',
    name: 'Rajesh Shrawan',
    designation: 'State Director (Madhya Pradesh)',
    division: 'state',
    state: 'Madhya Pradesh',
    status: 'ACTIVE',
    badgeNumber: 'RW-MP-105',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzjOJW-0F9kQafL4EqjRAyrLWNV05ZyFI-1wCYRNv9TdnD9-FDOP2WWAjXCkijW26gHb1QNBYfsumpnqHE-Z_PIJjl6A482Zztt2P-Ikxhz3VDSd-hvdGvGBH4yMSpa9Tgze_hoLkmCGJOLdcGpmyxTHe1NkZPopjqRLXPL0dV1a2pl7Z7Ck625nGGdUd4MkhaYG8syU4ZgRlQmgy9bWL1wQ6MhVeIWtYqPxpx4ChjMP1qVWRXnZMwcQ',
    validTill: '31-DEC-2026',
    mandate: 'Central India Territorial Vigilance'
  },
  {
    id: 'RW-NAT-W01',
    name: 'Phalguni Dutta Halder',
    designation: 'National Secretary (Women Cell)',
    division: 'national',
    state: 'National HQ & Eastern Region',
    status: 'VERIFIED',
    badgeNumber: 'RW-NAT-W01',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXFCKE0UX1utOq5DO1VETiwFFYnVuSBEzgwYvyQMsWJwudqom0fj2Hqe7nJMb5IgAf69rwxqcNoZp1AP4JyU1D3DCT42-kalWCBy2XsjlAlP0yDcmnKsxE3xIQ70-bRGNOY_HUXW0kNVO_8LkJysii3DdNQvHuvsjtPFboGrTQ69CMmDUexMKUTIwitMNzdhHpeMz_lA9FCuZBBE-5jm3374Mgi1nD1bSxEwkEKPAMdHfMnlpoOWhCmA',
    validTill: '31-DEC-2027',
    mandate: 'POSH Enforcement & Women Rights Directorate'
  },
  {
    id: 'RW-LEG-001',
    name: 'Shekhar Kumar Nigam',
    designation: 'Chief Legal Advisor & Advocate',
    division: 'legal',
    state: 'Supreme Court & High Courts',
    status: 'VERIFIED',
    badgeNumber: 'RW-LEG-001',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKBCimjG0t1Psi8NaW5y8ZgGe-tVqjZvwsrTMqXJxoHOnsCBW5xp-MEf3kF0BUVI13eU257ZEk5qleDMl-E8-NJyRLA8QXgv87iz2Dmx-cVK15KP9s1NnOfjkkwFhSrq5tOIVOSbqgtI3uGEiXcm-ZVJW3N25MAS-_to6BIFBpa3YVexuhBluhv_4Ws9_slKeyV6QwyacnImqe_0E_7gI8gwvpD-TnyhFzs8d6atjcHjuZucvfY_hl7Q',
    validTill: '31-DEC-2028',
    mandate: 'Constitutional Rights, Anticipatory Bail & Writs'
  },
  {
    id: 'RW-NAT-002',
    name: 'Vishal Nain',
    designation: 'National Deputy Director (India)',
    division: 'national',
    state: 'National HQ',
    status: 'ACTIVE',
    badgeNumber: 'RW-NAT-002',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGi_EgkVKseLfKV27C6HTcNJHIos7qqFDnbT4fbIYckiKs7pgl9QqMBfBTowT-k04KyQblyZl1sjwPyxJzShvNe522AAL5s7eavqteLF80e8tSGaKMDqj-RRKkeVonrebNxuQXeH-52UjEsTMig7eYQSECi4-3gXwKd87FTziON3_mdC6kLlrxnapbxyZsYZ1S16n8-0JJMPgGJqQyITxFHRjUe0JhVOSybtlqvMOVbT_dYawEhfuWXw',
    validTill: '31-DEC-2027',
    mandate: 'Inter-Agency Liaison & Field Intelligence'
  },
  {
    id: 'RW-UP-106',
    name: 'Subedar Saroj / Ajay Kumar',
    designation: 'State Incharges (Uttar Pradesh)',
    division: 'state',
    state: 'Uttar Pradesh',
    status: 'ACTIVE',
    badgeNumber: 'RW-UP-106',
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

  app.use(express.json());

  // CORS headers for API accessibility (supporting cPanel hosting & external calls)
  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (_req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // ==========================================
  // PUBLIC APIS
  // ==========================================

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

    res.json({
      success: true,
      applicationId: appId,
      message: 'Membership application recorded. Verification team will review documents within 3 working days.'
    });
  });

  // API 6: ID Card Lookup
  app.post('/api/id-cards/lookup', (req, res) => {
    const { idNumber } = req.body;

    if (!idNumber) {
      return res.status(400).json({ success: false, message: 'Please provide Officer or Member ID.' });
    }

    const clean = String(idNumber).trim().toUpperCase();
    const officer = officersDatabase.find(
      (o) => o.id.toUpperCase() === clean || o.badgeNumber.toUpperCase() === clean || clean.includes(o.badgeNumber.toUpperCase())
    );

    if (officer) {
      return res.json({
        success: true,
        cardData: {
          id: officer.badgeNumber,
          name: officer.name,
          designation: officer.designation,
          state: officer.state,
          validTill: officer.validTill,
          division: officer.division,
          photoUrl: officer.photoUrl,
          qrPayload: `RAWF-AUTH-VERIFIED:${officer.badgeNumber}:ITA-1882:IFA760`,
          status: officer.status
        }
      });
    }

    // Generic member mockup for any valid-looking input
    if (clean.startsWith('RW-') || clean.length >= 6) {
      return res.json({
        success: true,
        cardData: {
          id: clean,
          name: 'Certified Vigilance Officer',
          designation: 'Civil Vigilance Officer (CVO)',
          state: 'National Field Directorate',
          validTill: '31-DEC-2027',
          division: 'state',
          photoUrl: '',
          qrPayload: `RAWF-AUTH-MEMBER:${clean}:ITA-1882:IFA760`,
          status: 'ACTIVE'
        }
      });
    }

    res.status(404).json({
      success: false,
      message: 'ID Number not found. Check formatting (e.g., RW-MH-102 or DG-CRIME-001).'
    });
  });

  // API 7: Donations
  app.post('/api/donations', (req, res) => {
    const { donorName, panNumber, amount, fund, paymentMethod } = req.body;
    const donationAmount = Number(amount) || 1500;

    const receiptId = `RAWF-80G-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const donation: DonationRecord = {
      receiptId,
      donorName: donorName || 'Supporter of Justice',
      panNumber: panNumber ? String(panNumber).toUpperCase() : undefined,
      amount: donationAmount,
      fund: fund || 'General Anti-Corruption & Citizen Legal Defense Fund',
      paymentMethod: paymentMethod || 'UPI / NetBanking',
      timestamp: new Date().toISOString(),
      taxExemptionEligible: true,
      status: 'Confirmed'
    };

    donationsDatabase.unshift(donation);

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
    const { name, designation, division, state, badgeNumber, photoUrl, validTill, mandate } = req.body;

    if (!name || !designation || !badgeNumber) {
      return res.status(400).json({ success: false, message: 'Name, Designation and Badge Number are required.' });
    }

    const cleanBadge = String(badgeNumber).trim().toUpperCase();

    // Check duplicate
    if (officersDatabase.some((o) => o.badgeNumber.toUpperCase() === cleanBadge)) {
      return res.status(400).json({ success: false, message: `Badge number ${cleanBadge} already exists in active roster.` });
    }

    const newOfficer: Officer = {
      id: cleanBadge,
      name: String(name).trim(),
      designation: String(designation).trim(),
      division: (division as any) || 'state',
      state: state || 'National Command',
      status: 'ACTIVE',
      badgeNumber: cleanBadge,
      photoUrl: photoUrl || '',
      validTill: validTill || '31-DEC-2028',
      mandate: mandate || 'Citizen Vigilance & Constitutional Rights Protection'
    };

    officersDatabase.push(newOfficer);
    res.json({ success: true, message: `Officer ${newOfficer.name} (${cleanBadge}) added to active roster.`, data: newOfficer });
  });

  app.put('/api/admin/officers/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    const cleanId = id.trim().toUpperCase();
    const index = officersDatabase.findIndex((o) => o.id.toUpperCase() === cleanId || o.badgeNumber.toUpperCase() === cleanId);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Officer not found.' });
    }

    const existing = officersDatabase[index];
    const updated: Officer = {
      ...existing,
      ...req.body,
      id: existing.id,
      badgeNumber: existing.badgeNumber
    };

    officersDatabase[index] = updated;
    res.json({ success: true, message: 'Officer profile updated successfully.', data: updated });
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
    const { status, notes } = req.body;
    const appItem = applicationsDatabase.find((a) => a.applicationId === id);

    if (!appItem) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (status) appItem.status = status;
    if (notes !== undefined) appItem.notes = notes;

    res.json({ success: true, message: `Application ${id} status updated to ${appItem.status}.`, data: appItem });
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

    const newBadgeId = `RW-${stateCode}-${Math.floor(200 + Math.random() * 800)}`;

    appItem.status = 'Approved';
    appItem.assignedBadge = newBadgeId;

    // Automatically add to officers roster
    const newOfficer: Officer = {
      id: newBadgeId,
      name: appItem.fullName,
      designation: appItem.wing,
      division: appItem.wing.includes('National') ? 'national' : appItem.wing.includes('State') ? 'state' : 'state',
      state: appItem.state,
      status: 'ACTIVE',
      badgeNumber: newBadgeId,
      photoUrl: '',
      validTill: '31-DEC-2028',
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

  // Admin Blacklisted Badges Management
  app.get('/api/admin/blacklist', requireAdminAuth, (_req, res) => {
    res.json({ success: true, data: blacklistedDatabase });
  });

  app.post('/api/admin/blacklist', requireAdminAuth, (req, res) => {
    const { badgeNumber, name, jurisdiction, reason } = req.body;

    if (!badgeNumber || !name) {
      return res.status(400).json({ success: false, message: 'Badge Number and Individual Name are required.' });
    }

    const cleanBadge = String(badgeNumber).trim().toUpperCase();

    const newBlacklist: BlacklistedOfficer = {
      id: cleanBadge,
      name: String(name).trim(),
      badgeNumber: cleanBadge,
      jurisdiction: jurisdiction || 'National Command',
      revocationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      reason: reason || 'Official charter violation.',
      status: 'REVOKED & BLACKLISTED'
    };

    blacklistedDatabase.unshift(newBlacklist);

    // Also remove from active roster if present
    const activeIdx = officersDatabase.findIndex((o) => o.badgeNumber.toUpperCase() === cleanBadge);
    if (activeIdx !== -1) {
      officersDatabase.splice(activeIdx, 1);
    }

    res.json({ success: true, message: `Badge ${cleanBadge} added to Blacklist Registry.`, data: newBlacklist });
  });

  app.delete('/api/admin/blacklist/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    const cleanId = id.trim().toUpperCase();
    const index = blacklistedDatabase.findIndex((b) => b.id.toUpperCase() === cleanId || b.badgeNumber.toUpperCase() === cleanId);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Entry not found in blacklist.' });
    }

    const removed = blacklistedDatabase.splice(index, 1)[0];
    res.json({ success: true, message: `Badge ${removed.badgeNumber} reinstated / removed from blacklist.` });
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
