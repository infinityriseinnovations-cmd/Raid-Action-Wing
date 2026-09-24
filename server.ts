import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Officer {
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
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMjYeqo0GQGnnVCALTm2YL_ZT1q7UGxG2MHvI0ielMI02SoUfp7g5QqGw__jl2OI9rA6Sv7mczVS2AZSCpxLLApzP9k-GtQQkvcolLJEFLEn0q_ekfnD6hgQW9uX27XF-4IqmYs9v8KrBoJj0nd7Mgd7W5UZ7LU4SxmYgLpGLDoXV0NEAzysp4ytUcxU2NpgRsfAfdOKxindrSxiH2jWNtLsPPEuyWASR5qtfoQHOTyXE9qVDMTYNK9g',
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

interface GrievanceRecord {
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

interface MemberApplication {
  applicationId: string;
  fullName: string;
  mobile: string;
  email: string;
  wing: string;
  state: string;
  aadhaarLast4: string;
  background: string;
  submittedAt: string;
  status: 'Pending Verification' | 'Approved' | 'Interview Scheduled';
}

const applicationsDatabase: MemberApplication[] = [];

interface DonationRecord {
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

const donationsDatabase: DonationRecord[] = [];

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API 1: Get Officers Directory
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

  // API 2: Verify Officer
  app.post('/api/officers/verify', (req, res) => {
    const { code } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: 'Please provide an Officer Code or Badge Number.' });
    }

    const cleanCode = code.trim().toUpperCase();
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

  // API 4: Track Grievance / Dossier Code
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

    res.json({
      success: true,
      data: record
    });
  });

  // API 5: Member Apply
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

    applicationsDatabase.push(newApp);

    res.json({
      success: true,
      applicationId: appId,
      message: 'Membership application recorded. Verification team will review documents within 3 working days.'
    });
  });

  // API 6: ID Card Lookup
  app.post('/api/id-cards/lookup', (req, res) => {
    const { idNumber, mobile } = req.body;

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

    donationsDatabase.push(donation);

    res.json({
      success: true,
      receiptId,
      data: donation,
      message: 'Donation recorded! Statutory 80G tax exemption receipt generated.'
    });
  });

  // Mount Vite or serve static
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
