export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  tag: string;
  description: string;
  impact: string;
}

export const ALL_PROJECTS: ProjectItem[] = [
  {
    id: 'legal-aid',
    title: 'Legal Aid – Voice for Social Service',
    category: 'Legal Defense',
    tag: 'FLAGSHIP MANDATE',
    description: 'Pro bono legal representation and advisory for underprivileged citizens facing false prosecution, custodial overreach, and delayed trials in high courts and subordinate judiciary.',
    impact: '10,000+ Cases Advised'
  },
  {
    id: 'mid-day-meal',
    title: 'Mid-Day-Meal Mission',
    category: 'Social Welfare',
    tag: 'NUTRITION CELL',
    description: 'Ground inspections, quality assurance audits, and corruption surveillance on rural government school meal supply chains to eliminate food adulteration.',
    impact: '320+ School Audits Conducted'
  },
  {
    id: 'women-empowerment',
    title: 'Women Empowerment',
    category: 'Gender Rights',
    tag: 'WOMEN WING',
    description: 'Vocational training, domestic safety clinics, and legal empowerment for self-reliant rural and urban women battling systemic domestic harassment.',
    impact: '4,500+ Women Counselled'
  },
  {
    id: 'swatch-bharat',
    title: 'Swatch Bharat Mission',
    category: 'Environment',
    tag: 'CIVIC HEALTH',
    description: 'Civic sanitation drives, municipal waste mismanagement reporting, and public hygiene awareness campaigns across community settlements.',
    impact: '85 Municipal Wards Monitored'
  },
  {
    id: 'ek-boond-ek-mission',
    title: 'Ek Boond Ek Mission',
    category: 'Water Conservation',
    tag: 'ECOLOGICAL WING',
    description: 'Monitoring illegal industrial groundwater extraction, contaminated aquifer pollution, and rainwater harvesting installation in drought-prone districts.',
    impact: '150+ Borewell Audits'
  },
  {
    id: 'environment-protection',
    title: 'Environment Protection',
    category: 'Ecology',
    tag: 'GREEN OVERSIGHT',
    description: 'Investigating illegal sand mining, industrial chemical dumping, and illegal deforestation in eco-sensitive zones in coordination with the National Green Tribunal.',
    impact: '60+ Environmental Reports Filed'
  },
  {
    id: 'spiritual-development',
    title: 'Spiritual Development & Mental Peace',
    category: 'Holistic Wellbeing',
    tag: 'CITIZEN WELLNESS',
    description: 'Stress alleviation, ethical leadership discourses, and constitutional fraternity workshops for field volunteers and citizen whistleblowers.',
    impact: '80+ Seminars Held'
  },
  {
    id: 'education-key-of-success',
    title: 'Education - A Key of Success',
    category: 'Education',
    tag: 'YOUTH FOUNDATION',
    description: 'Scholarship guidance, free educational supplies, and anti-drop-out tracking for marginalized tribal and rural children.',
    impact: '3,200+ Students Supported'
  },
  {
    id: 'farmer-annadatta',
    title: 'Farmer “Annadatta” Protection',
    category: 'Agrarian Defense',
    tag: 'RURAL WING',
    description: 'Protecting cultivators from predatory informal loan sharks, seed and fertilizer hoarding cartels, and fraudulent land seizure conspiracies.',
    impact: '45 Rural Panchayat Desks'
  },
  {
    id: 'village-heart',
    title: 'Our Village is Our Heart',
    category: 'Rural Development',
    tag: 'PANCHAYAT CELL',
    description: 'Grassroots oversight on rural development scheme allocations (MGNREGA, PMGSY, housing funds) ensuring 100% transparency.',
    impact: '120+ Panchayats Assisted'
  },
  {
    id: 'women-equality',
    title: 'Women Equality Programme',
    category: 'Constitutional Rights',
    tag: 'EQUALITY CELL',
    description: 'Combating female foeticide, promoting inheritance rights, and upholding constitutional Article 15 guarantees for gender parity.',
    impact: 'Pan-India Outreach'
  },
  {
    id: 'langar-sewa',
    title: 'Langar Sewa & Food Relief',
    category: 'Humanitarian',
    tag: 'SEWA DESK',
    description: 'Emergency food distribution camps for homeless citizens, hospital attendants, and disaster-affected communities without distinction of caste or creed.',
    impact: '50,000+ Meals Served'
  },
  {
    id: 'health-care-mission',
    title: 'Health Care Mission',
    category: 'Healthcare',
    tag: 'MEDICAL AID',
    description: 'Organizing free diagnostic screening camps, spurious drug supply alerts, and investigating private hospital overcharging malpractices.',
    impact: '24 Free Health Camps'
  },
  {
    id: 'illegal-detention',
    title: 'Illegal Detention & Immigration Cell',
    category: 'Human Rights',
    tag: 'WRIT DESK',
    description: 'Emergency habeas corpus intervention, custodial interrogation surveillance, and protecting victims of wrongful administrative incarceration.',
    impact: '180+ Custodial Inquiries'
  },
  {
    id: 'smile-child-education',
    title: 'Smile “Every Child Needs Education”',
    category: 'Child Welfare',
    tag: 'CHILD DESK',
    description: 'Child labor rescue, rehabilitation in bridge schools, and strict enforcement of the Right to Education (RTE) Act Section 12(1)(c).',
    impact: '850+ Rescued Children'
  },
  {
    id: 'crime-prevention',
    title: 'Crime Prevention Network',
    category: 'Public Security',
    tag: 'VIGILANCE CELL',
    description: 'Community neighborhood watch programs, crime telemetry gathering, and sharing intelligence with district superintendents of police.',
    impact: '400+ Local Informer Nodes'
  },
  {
    id: 'say-no-to-drugs',
    title: 'Say No To Drugs',
    category: 'Anti-Narcotics',
    tag: 'SPECIAL FORCE',
    description: 'Intelligence gathering on regional synthetic drug supply routes, cross-border narcotics trafficking, and de-addiction counseling.',
    impact: '120+ High Schools Mobilized'
  },
  {
    id: 'mission-kali',
    title: 'Mission “Kali” & Women Self-Defense',
    category: 'Women Safety',
    tag: 'CRISIS RESPONSE',
    description: 'Special strike taskforce providing 24/7 emergency intervention in stalking, acid attacks, POSH workplace harassment, and domestic brutality.',
    impact: 'State Crisis Response Wings'
  },
  {
    id: 'anti-human-trafficking',
    title: 'Anti Human Trafficking Force',
    category: 'Human Protection',
    tag: 'SPECIAL TASKFORCE',
    description: 'Covert interstate investigation busting commercial sexual exploitation and forced bonded labor networks across transit hubs.',
    impact: 'Inter-Agency Handover Model'
  },
  {
    id: 'crime-free-nation',
    title: 'Crime Free Nation Conclave',
    category: 'Institutional',
    tag: 'NATIONAL MISSION',
    description: 'Annual whistleblower conventions bringing together jurists, retired police commissioners, and investigative journalists to build an accountable India.',
    impact: 'Annual National Convention'
  }
];

export interface DepartmentItem {
  id: string;
  name: string;
  mandate: string;
  headOffice: string;
  code: string;
}

export const ALL_DEPARTMENTS: DepartmentItem[] = [
  { id: 'piracy', name: 'Anti-Piracy Directorate', code: 'W-01/PIR', mandate: 'Monitoring software, cinema, copyright infringement, and black-market intellectual property counterfeiting rings.', headOffice: 'National HQ' },
  { id: 'human-rights', name: 'Human Rights Protection Unit', code: 'W-02/HRU', mandate: 'Monitoring custodial violations, minority harassment, and filing statutory NHRC / SHRC complaints.', headOffice: 'New Delhi' },
  { id: 'intelligence', name: 'Covert Intelligence Unit (CIU)', code: 'W-03/CIU', mandate: 'Gathering actionable confidential surveillance telemetry on illicit operations and compromised public offices.', headOffice: 'Central Command' },
  { id: 'women-empowerment-unit', name: 'Women Empowerment Unit', code: 'W-04/WEU', mandate: 'Investigating workplace POSH complaints, marital harassment, and legal counseling for female victims.', headOffice: 'Eastern & Western Desks' },
  { id: 'investigation-force', name: 'Special Investigation Taskforce', code: 'W-05/SIT', mandate: 'Compiling judicial-grade evidence dossiers on organized crime cartels for formal police transmission.', headOffice: 'Mumbai / Delhi' },
  { id: 'social-engineering', name: 'Social Engineering & Civic Audit', code: 'W-06/SEC', mandate: 'Sociological field research on corruption vulnerability in welfare delivery and public works.', headOffice: 'State Commands' },
  { id: 'human-resources', name: 'Internal Affairs & Human Resources', code: 'W-07/IHR', mandate: 'Background checks, officer integrity vetting, and anti-corruption oath administration.', headOffice: 'National Registry' },
  { id: 'rural-development', name: 'Rural Development Vigilance', code: 'W-08/RDV', mandate: 'Monitoring panchayat fund utilization, agricultural subsidy integrity, and rural public works.', headOffice: 'Northern & Central Hub' },
  { id: 'legal-unit', name: 'Supreme & High Court Legal Directorate', code: 'W-09/LDU', mandate: 'Writ petitions, Public Interest Litigations (PILs), anticipatory bail support, and legal advisory.', headOffice: 'New Delhi Bar' },
  { id: 'local-crime', name: 'Local Crime Information Unit', code: 'W-10/LCI', mandate: 'Grassroots informant networks relaying local illegal gambling, bootlegging, and extortion incidents.', headOffice: 'District Bureaus' },
  { id: 'children-women-safety', name: 'Children & Women Safety Desk', code: 'W-11/CWS', mandate: 'POCSO Act enforcement advisory, missing children tracking, and emergency helpline dispatch.', headOffice: 'Tier-1 Emergency Hub' },
  { id: 'youth-wing', name: 'Youth Vigilance & Anti-Drug Wing', code: 'W-12/YVW', mandate: 'Mobilizing college students against narcotics peddling and promoting constitutional duties.', headOffice: 'University Chapters' },
  { id: 'data-analytics', name: 'Data Analytics & Pattern Mining', code: 'W-13/DAP', mandate: 'Cross-referencing government tender data, corporate filings, and tracking shell company linkages.', headOffice: 'Cyber Command' },
  { id: 'cyber-crime', name: 'Cyber Crime Forensics Division', code: 'W-14/CCD', mandate: 'Digital evidence extraction, online financial scam tracing, and digital identity defense.', headOffice: 'Forensic Lab Unit' },
  { id: 'crime-research', name: 'Crime Research & Analysis Bureau', code: 'W-15/CRA', mandate: 'Publishing whitepapers on emerging criminal methodologies, extortion cartels, and procedural flaws.', headOffice: 'Research Council' },
  { id: 'rd-wings', name: 'Research & Development Wings', code: 'W-16/RDW', mandate: 'Developing surveillance tools, secure whistleblower reporting protocols, and forensic toolkits.', headOffice: 'Tech Bureau' },
  { id: 'it-cell', name: 'Information Technology & Infrastructure', code: 'W-17/ITC', mandate: 'Encrypted databases, verification portal servers, and digital credential security (IFA 760).', headOffice: 'Tech Center' },
  { id: 'rti-cell', name: 'Right to Information (RTI) Taskforce', code: 'W-18/RTI', mandate: 'Drafting high-impact RTI queries to expose public fund siphoning, bribery, and administrative neglect.', headOffice: 'National RTI Desk' },
  { id: 'industrial-force', name: 'Industrial & Labor Development Force', code: 'W-19/IDF', mandate: 'Monitoring factory safety compliance, minimum wage exploitation, and illegal child labor in industries.', headOffice: 'Industrial Corridors' },
  { id: 'educational-research', name: 'Educational Research & Development', code: 'W-20/ERD', mandate: 'Auditing private school fee extortion, RTE quota compliance, and fake university racket exposure.', headOffice: 'Academic Cell' },
  { id: 'anti-trafficking', name: 'Anti-Human Trafficking Force', code: 'W-21/ATF', mandate: 'Inter-state raids liaison, brothel rescue missions, and repatriation of trafficking victims.', headOffice: 'Border & Port Command' },
  { id: 'media-cell', name: 'Public Information & Media Cell', code: 'W-22/PMC', mandate: 'Public interest press briefings, investigative journalist liaison, and documentary disclosures.', headOffice: 'Press Bureau' }
];

export interface RightsDocument {
  id: string;
  title: string;
  file: string;
  fileSize: string;
  category: string;
  summary: string;
}

export const ALL_RIGHTS_DOCS: RightsDocument[] = [
  { id: 'child-right', title: 'Child Right', file: 'assets/images/rights/CHILD_RIGHT.pdf', fileSize: '1.4 MB', category: 'POCSO & Child Rights', summary: 'Covers the protection of children from exploitation, right to free education, mandatory reporting under POCSO 2012, and statutory duties of schools.' },
  { id: 'women-right', title: 'Women Rights', file: 'assets/images/rights/WOMEN_RIGHT.pdf', fileSize: '2.1 MB', category: 'Gender Protections', summary: 'Comprehensive statutory guide to POSH Act 2013, Domestic Violence Act 2005, right to Zero-FIR at any police station, and maternity benefit protections.' },
  { id: 'human-rights', title: 'Human Rights in India', file: 'assets/images/rights/HUMAN_RIGHTS_IN_INDIA.pdf', fileSize: '3.0 MB', category: 'Fundamental Freedoms', summary: 'Protection of Human Rights Act 1993, NHRC filing instructions, procedural safeguards against custodial atrocities and arbitrary police confinement.' },
  { id: 'consumer-right', title: 'Consumer Rights', file: 'assets/images/rights/CONSUMER_RIGHT.pdf', fileSize: '1.1 MB', category: 'Commercial Protections', summary: 'Consumer Protection Act 2019 provisions against unfair trade practices, misleading advertisements, defective goods, and online e-commerce fraud.' },
  { id: 'civil-rights', title: 'Civil Rights', file: 'assets/images/rights/Civil_Rights.pdf', fileSize: '1.6 MB', category: 'Civil Liberties', summary: 'Protection of Civil Rights Act 1955, eradication of untouchability, access to public institutions, and remedies under constitutional Article 17.' },
  { id: 'senior-citizen', title: 'Senior Citizen Rights', file: 'assets/images/rights/senior_citizen_rights.pdf', fileSize: '980 KB', category: 'Elder Care', summary: 'Maintenance and Welfare of Parents and Senior Citizens Act 2007, eviction remedies against abusive relatives, and state medical care rights.' },
  { id: 'freedom-rights', title: 'Rights to Freedom', file: 'assets/images/rights/Freedom_RIGHT.pdf', fileSize: '2.4 MB', category: 'Constitutional Law', summary: 'Articles 19, 20, 21, and 22 of the Constitution: Freedom of speech, assembly, movement, protection in respect of conviction, and personal liberty.' },
  { id: 'trafficking-rights', title: 'Trafficking Rights', file: 'assets/images/rights/Trafficking_Rights.pdf', fileSize: '1.5 MB', category: 'Anti-Trafficking', summary: 'Immunity for trafficking victims, rehabilitation mandates under Immoral Traffic (Prevention) Act, and inter-state witness protection rules.' },
  { id: 'right-to-education', title: 'Rights to Education', file: 'assets/images/rights/Rights_to_Education.pdf', fileSize: '1.2 MB', category: 'Education', summary: 'RTE Act 2009: Mandatory 25% quota for economically disadvantaged children in private unaided schools without tuition fee discrimination.' },
  { id: 'intellectual-property', title: 'Intellectual Property ACT', file: 'assets/images/rights/INTELLECTUAL_PROPERTY_ACT.pdf', fileSize: '2.8 MB', category: 'Commercial Law', summary: 'Patents Act, Trademarks Act, and Designs Act: Legal remedies for infringement, injunctions, and civil/criminal remedies against counterfeiters.' },
  { id: 'copyright-law', title: 'Copyright Law in India', file: 'assets/images/rights/Copyright_Law_in_India.pdf', fileSize: '1.7 MB', category: 'IP Law', summary: 'Copyright Act 1957: Protection of original literary, dramatic, musical, artistic works, software code, and remedies against online digital piracy.' },
  { id: 'rti-act', title: 'Rights to Information (RTI Act)', file: 'assets/images/rights/RTI-act.pdf', fileSize: '950 KB', category: 'Public Transparency', summary: 'RTI Act 2005: Formats for drafting queries, fee exemptions, mandatory 30-day response, and filing first/second appeals before Information Commissions.' },
  { id: 'know-your-rights', title: 'Know Your Rights (Citizen Handbook)', file: 'assets/images/rights/know_your_rights.pdf', fileSize: '3.5 MB', category: 'Citizen Empowerment', summary: 'Consolidated master handbook on what to do when stopped by police, arrest rights, bail procedures, search warrant requirements, and emergency contacts.' }
];

export interface LawDocument {
  id: string;
  title: string;
  file: string;
  fileSize: string;
  summary: string;
}

export const ALL_INDIAN_LAWS: LawDocument[] = [
  { id: 'ruling-police', title: 'Rulings on Indian Police', file: 'assets/images/indian-laws/Ruling of Police.pdf', fileSize: '1.8 MB', summary: 'Supreme Court D.K. Basu guidelines, arrest memo requirements, right to silence, medical checkups every 48 hours, and mandatory registration of FIR.' },
  { id: 'judiciary-india', title: 'Judiciary Systems of India', file: 'assets/images/indian-laws/judiciary-of-india.pdf', fileSize: '2.2 MB', summary: 'Hierarchical structure of the Indian judicial system: Supreme Court, High Courts, District & Sessions Courts, Special CBI/Lokayukta Courts, and writ jurisdictions.' },
  { id: 'sexual-harassment', title: 'Sexual Harassment at Workplace (POSH)', file: 'assets/images/indian-laws/Sexual_Harassment.pdf', fileSize: '1.9 MB', summary: 'The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act 2013: Internal Complaints Committee constitution and inquiry rules.' },
  { id: 'anticipatory-bail', title: 'Anticipatory Bail (CrPC Section 438)', file: 'assets/images/indian-laws/Anticipatory_bail.pdf', fileSize: '1.2 MB', summary: 'Principles governing the grant of anticipatory bail, interim protection against vexatious FIRs, and Supreme Court constitutional bench precedents.' },
  { id: 'constitution-hindi', title: 'Constitution of India (Hindi)', file: 'assets/images/indian-laws/CONSTITUTION_OF_INDIA_IN_HINDI.pdf', fileSize: '8.4 MB', summary: 'भारत का संविधान (सम्पूर्ण पाठ): प्रस्तावना, मूल अधिकार, राज्य की नीति के निदेशक तत्व, न्यायपालिका की शक्तियां एवं संशोधन प्रक्रिया।' },
  { id: 'constitution-english', title: 'Constitution of India (English)', file: 'assets/images/indian-laws/CONSTITUTION_OF_INDIA_IN_ENGLISH.pdf', fileSize: '7.9 MB', summary: 'Complete authoritative English text of the Constitution of India incorporating all landmark amendments, fundamental rights, and institutional checks.' }
];

export interface BlacklistedOfficer {
  id: string;
  name: string;
  badgeNumber: string;
  jurisdiction: string;
  revocationDate: string;
  reason: string;
  status: 'REVOKED & BLACKLISTED';
}

export const BLACKLISTED_OFFICERS: BlacklistedOfficer[] = [
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

export interface PoliceContact {
  state: string;
  dgpOffice: string;
  phone: string;
  antiCorruptionHelpline: string;
}

export const POLICE_DIRECTORY: PoliceContact[] = [
  { state: 'Delhi NCR', dgpOffice: 'Delhi Police Headquarters, Jai Singh Road', phone: '011-23490000 / 112', antiCorruptionHelpline: '1064 (Anti-Corruption Branch)' },
  { state: 'Maharashtra', dgpOffice: 'Director General of Police, Old Council Hall, Mumbai', phone: '022-22026636 / 112', antiCorruptionHelpline: '1064 / 022-24921212 (ACB Maharashtra)' },
  { state: 'Uttar Pradesh', dgpOffice: 'UP Police Headquarters, Signature Building, Lucknow', phone: '0522-2209350 / 112', antiCorruptionHelpline: '9454400100 (UP Vigilance)' },
  { state: 'Gujarat', dgpOffice: 'Police Bhavan, Sector 18, Gandhinagar', phone: '079-23254344 / 112', antiCorruptionHelpline: '1064 (ACB Gujarat)' },
  { state: 'Madhya Pradesh', dgpOffice: 'Police Headquarters, Jahangirabad, Bhopal', phone: '0755-2443000 / 112', antiCorruptionHelpline: '1064 (MP Lokayukta / EOW)' },
  { state: 'Bihar', dgpOffice: 'Sardar Patel Bhavan, Bailey Road, Patna', phone: '0612-2234000 / 112', antiCorruptionHelpline: '0612-2217033 (Vigilance Investigation)' },
  { state: 'Karnataka', dgpOffice: 'Police Headquarters, Nrupathunga Road, Bengaluru', phone: '080-22942111 / 112', antiCorruptionHelpline: '1064 (Lokayukta Karnataka)' },
  { state: 'Tamil Nadu', dgpOffice: 'DGP Office, Dr. Radhakrishnan Salai, Mylapore, Chennai', phone: '044-28447777 / 112', antiCorruptionHelpline: '044-22321085 (DVAC Chennai)' },
  { state: 'West Bengal', dgpOffice: 'Nabanna / Writers Buildings, Kolkata', phone: '033-22145000 / 112', antiCorruptionHelpline: '033-24792626 (Anti-Corruption Branch)' },
  { state: 'Rajasthan', dgpOffice: 'Police Headquarters, Lal Kothi, Jaipur', phone: '0141-2606651 / 112', antiCorruptionHelpline: '1064 (ACB Rajasthan)' }
];

export interface GovernmentAgency {
  name: string;
  role: string;
  website: string;
  tollFree: string;
}

export const GOVT_DIRECTORY: GovernmentAgency[] = [
  { name: 'Central Vigilance Commission (CVC)', role: 'Apex statutory integrity institution for central government departments', website: 'https://cvc.gov.in', tollFree: '1800-11-5555' },
  { name: 'Lokpal of India', role: 'National anti-corruption ombudsman for high-ranking public functionaries', website: 'https://lokpal.gov.in', tollFree: '011-24660000' },
  { name: 'National Human Rights Commission (NHRC)', role: 'Protection and promotion of human rights across India', website: 'https://nhrc.nic.in', tollFree: '14433' },
  { name: 'National Commission for Women (NCW)', role: 'Statutory body reviewing constitutional safeguards for women', website: 'https://ncw.nic.in', tollFree: '7827170170' },
  { name: 'National Commission for Protection of Child Rights (NCPCR)', role: 'Overseeing child welfare, POCSO execution, and RTE defense', website: 'https://ncpcr.gov.in', tollFree: '011-23478200' },
  { name: 'Central Bureau of Investigation (CBI)', role: 'Premier investigation agency for high-stakes economic offenses and graft', website: 'https://cbi.gov.in', tollFree: '011-24362755' }
];
