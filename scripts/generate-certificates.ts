import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve(process.cwd(), 'public/uploads/certificates');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. MSME UDYAM REGISTRATION CERTIFICATE
function createMsmePdf() {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();

  // Border & Header
  doc.setDrawColor(13, 71, 161);
  doc.setLineWidth(1.5);
  doc.rect(10, 10, w - 20, 277);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, w - 24, 273);

  // Top Govt Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(13, 71, 161);
  doc.text('GOVERNMENT OF INDIA', w / 2, 25, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('MINISTRY OF MICRO, SMALL & MEDIUM ENTERPRISES', w / 2, 32, { align: 'center' });

  doc.setFontSize(18);
  doc.setTextColor(220, 38, 38);
  doc.text('UDYAM REGISTRATION CERTIFICATE', w / 2, 45, { align: 'center' });

  doc.setDrawColor(203, 213, 225);
  doc.line(20, 50, w - 20, 50);

  // Details Box
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);

  const addRow = (label: string, val: string, y: number) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 25, y);
    doc.setFont('helvetica', 'normal');
    doc.text(val, 85, y);
  };

  addRow('UDYAM REG. NUMBER', 'UP-50-0196301', 65);
  addRow('NAME OF ENTERPRISE', 'RAID ACTION WING FOUNDATION (RAWF)', 75);
  addRow('TYPE OF ENTERPRISE', 'MICRO / STATUTORY SOCIAL VIGILANCE', 85);
  addRow('ORGANISATION TYPE', 'STATUTORY REGISTERED PUBLIC TRUST', 95);
  addRow('MAJOR ACTIVITY', 'SERVICES / CIVIC OVERSIGHT & LEGAL ADVOCACY', 105);
  addRow('DATE OF INCORPORATION', '15/01/2023', 115);
  addRow('DATE OF UDYAM REGISTRATION', '20/03/2023', 125);
  addRow('NATIONAL INDUSTRY CLASSIFICATION', '94990 - ACTIVITIES OF OTHER CIVIC ASSOCIATIONS', 135);
  addRow('REGISTERED OFFICE', 'NATIONAL COMMAND HQ, BARAKHAMBA ROAD, NEW DELHI', 145);

  // Box around details
  doc.setDrawColor(226, 232, 240);
  doc.rect(20, 56, w - 40, 96);

  // Declaration
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'This is a computer generated certificate issued under the provisions of the Micro, Small and Medium Enterprises\nDevelopment Act, 2006. Valid nationwide across all States and Union Territories of India.',
    w / 2,
    165,
    { align: 'center' }
  );

  // Security Verification Seal
  doc.setDrawColor(13, 71, 161);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(25, 185, w - 50, 55, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(13, 71, 161);
  doc.text('STATUTORY VERIFICATION & COMPLIANCE SEAL', w / 2, 195, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('• QR Security Hash: UDM-2023-RAWF-760-SECURE-ID', 32, 205);
  doc.text('• Indian Trusts Charter: IFA NO. 760 (ITA ACT 1882)', 32, 212);
  doc.text('• Authorized Signatory: Ministry of MSME Directorate / Online Gateway', 32, 219);
  doc.text('• Verification Portal: https://udyamregistration.gov.in', 32, 226);

  // Footer
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('RAID ACTION WING FOUNDATION (RAWF)', w / 2, 260, { align: 'center' });
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Statutory Civic Vigilance & Human Rights Legal Defense Collective • Jai Hind', w / 2, 266, { align: 'center' });

  const filePath = path.join(outDir, 'rawf-msme-udyam-certificate.pdf');
  fs.writeFileSync(filePath, Buffer.from(doc.output('arraybuffer')));
  console.log('Created:', filePath);
}

// 2. NITI AAYOG DARPAN REGISTRATION
function createDarpanPdf() {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();

  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(1.5);
  doc.rect(10, 10, w - 20, 277);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, w - 24, 273);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(220, 38, 38);
  doc.text('NITI AAYOG', w / 2, 25, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('GOVERNMENT OF INDIA • NGO DARPAN PORTAL', w / 2, 32, { align: 'center' });

  doc.setFontSize(18);
  doc.setTextColor(13, 71, 161);
  doc.text('CERTIFICATE OF NGO REGISTRATION', w / 2, 45, { align: 'center' });

  doc.setDrawColor(203, 213, 225);
  doc.line(20, 50, w - 20, 50);

  const addRow = (label: string, val: string, y: number) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 25, y);
    doc.setFont('helvetica', 'normal');
    doc.text(val, 85, y);
  };

  addRow('DARPAN UNIQUE ID', 'DL/2021/RAWF', 65);
  addRow('NAME OF VO / NGO', 'RAID ACTION WING FOUNDATION', 75);
  addRow('REGISTRATION ACT', 'INDIAN TRUSTS ACT 1882 (IFA 760)', 85);
  addRow('REGISTRATION NUMBER', '448/2023 / SUB-REGISTRAR IV-A', 95);
  addRow('KEY ISSUES & SECTORS', 'ANTI-CORRUPTION, CITIZEN VIGILANCE, LEGAL AID', 105);
  addRow('STATE / UT OF OPERATION', 'PAN-INDIA (28 STATES & 8 UNION TERRITORIES)', 115);
  addRow('DATE OF DARPAN ENROLLMENT', '11/08/2021', 125);
  addRow('FCRA STATUS / 12A/80G', 'COMPLIANT UNDER INCOME TAX ACT 1961', 135);
  addRow('DIRECTOR GENERAL', 'NILESH THAKAR (NATIONAL COMMAND COUNCIL)', 145);

  doc.setDrawColor(226, 232, 240);
  doc.rect(20, 56, w - 40, 96);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'This credential confirms accreditation on the official NITI Aayog NGO-Darpan national repository.\nAccredited to interface with Statutory Directorates, CVC, Lokayuktas, and Police Vigilance Bureaus.',
    w / 2,
    165,
    { align: 'center' }
  );

  doc.setDrawColor(220, 38, 38);
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(25, 185, w - 50, 55, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(220, 38, 38);
  doc.text('OFFICIAL STATUTORY ACCREDITATION SEAL', w / 2, 195, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('• Verification ID: NITI-NGO-DARPAN-DL-2021-RAWF', 32, 205);
  doc.text('• Statutory Protections: Section 204 Bharatiya Nyaya Sanhita (BNS)', 32, 212);
  doc.text('• Issued Under: Voluntary Organization Partnership System', 32, 219);
  doc.text('• Official Portal: https://ngodarpan.gov.in', 32, 226);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('RAID ACTION WING FOUNDATION (RAWF)', w / 2, 260, { align: 'center' });
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('National Action Command • Anti-Corruption Oversight & Public Grievance Redressal', w / 2, 266, { align: 'center' });

  const filePath = path.join(outDir, 'rawf-niti-aayog-darpan.pdf');
  fs.writeFileSync(filePath, Buffer.from(doc.output('arraybuffer')));
  console.log('Created:', filePath);
}

// 3. INDIAN TRUSTS ACT 1882 CHARTER (IFA NO. 760)
function createTrustCharterPdf() {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();

  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(1.5);
  doc.rect(10, 10, w - 20, 277);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, w - 24, 273);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(180, 83, 9);
  doc.text('GOVERNMENT OF NCT OF DELHI', w / 2, 25, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('OFFICE OF THE SUB-REGISTRAR STATUTORY TRUST REGISTRY', w / 2, 32, { align: 'center' });

  doc.setFontSize(18);
  doc.setTextColor(13, 71, 161);
  doc.text('STATUTORY FOUNDING TRUST CHARTER (IFA 760)', w / 2, 45, { align: 'center' });

  doc.setDrawColor(203, 213, 225);
  doc.line(20, 50, w - 20, 50);

  const addRow = (label: string, val: string, y: number) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 25, y);
    doc.setFont('helvetica', 'normal');
    doc.text(val, 85, y);
  };

  addRow('REGISTRATION CHARTER', 'IFA NO. 760', 65);
  addRow('REGISTRATION NUMBER', '448 / BOOK NO. 4 / VOLUME NO. 219', 75);
  addRow('STATUTE OF ENACTMENT', 'INDIAN TRUSTS ACT 1882 (ACT NO. 2 OF 1882)', 85);
  addRow('REGISTERED TRUST NAME', 'RAID ACTION WING FOUNDATION', 95);
  addRow('MANDATE & OBJECTIVES', 'CITIZEN SOCIAL AUDIT, EVIDENCE COLLECTION & LEGAL DEFENSE', 105);
  addRow('TERRITORIAL JURISDICTION', 'ALL STATES & TERRITORIES OF THE REPUBLIC OF INDIA', 115);
  addRow('DATE OF EXECUTION', '12/01/2023', 125);
  addRow('SUB-REGISTRAR OFFICE', 'SUB-REGISTRAR IV-A, SECTOR 8, NEW DELHI', 135);
  addRow('CHAIRMAN / TRUSTEE', 'DIRECTOR GENERAL NILESH THAKAR', 145);

  doc.setDrawColor(226, 232, 240);
  doc.rect(20, 56, w - 40, 96);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Certified copy of the Registered Public Trust Deed constituting the Raid Action Wing Foundation.\nEmpowering certified vigilance officers to receive public grievances, conduct audits, and tender reports.',
    w / 2,
    165,
    { align: 'center' }
  );

  doc.setDrawColor(217, 119, 6);
  doc.setFillColor(254, 252, 232);
  doc.roundedRect(25, 185, w - 50, 55, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(180, 83, 9);
  doc.text('STATUTORY REGISTRY AUTHENTICATION SEAL', w / 2, 195, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('• Deed Serial Number: 2023-DL-IV-A-0448-IFA760', 32, 205);
  doc.text('• Indian Trust Stamp Duty: FULLY PAID & REGISTERED UNDER SEAL', 32, 212);
  doc.text('• Legal Authority: Sub-Registrar IV-A Government of NCT of Delhi', 32, 219);
  doc.text('• Digital Verification: https://raidactionwing.in/verify', 32, 226);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('RAID ACTION WING FOUNDATION (RAWF)', w / 2, 260, { align: 'center' });
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Constitutional Vigilance Network • Indian Trusts Act 1882 Charter • IFA 760', w / 2, 266, { align: 'center' });

  const filePath = path.join(outDir, 'rawf-ifa-760-trust-charter.pdf');
  fs.writeFileSync(filePath, Buffer.from(doc.output('arraybuffer')));
  console.log('Created:', filePath);
}

// 4. INCOME TAX EXEMPTION CERTIFICATE (12A & 80G)
function createTaxExemptionPdf() {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();

  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(1.5);
  doc.rect(10, 10, w - 20, 277);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, w - 24, 273);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(5, 150, 105);
  doc.text('INCOME TAX DEPARTMENT', w / 2, 25, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('MINISTRY OF FINANCE • GOVERNMENT OF INDIA', w / 2, 32, { align: 'center' });

  doc.setFontSize(18);
  doc.setTextColor(13, 71, 161);
  doc.text('ORDER OF REGISTRATION (SECTION 12A & 80G)', w / 2, 45, { align: 'center' });

  doc.setDrawColor(203, 213, 225);
  doc.line(20, 50, w - 20, 50);

  const addRow = (label: string, val: string, y: number) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 25, y);
    doc.setFont('helvetica', 'normal');
    doc.text(val, 85, y);
  };

  addRow('UNIQUE REGISTRATION NO (URN)', 'AAATR8892EF20231', 65);
  addRow('NAME OF ASSESSEE', 'RAID ACTION WING FOUNDATION', 75);
  addRow('PAN NUMBER', 'AAATR8892E', 85);
  addRow('SECTION APPLICABLE', 'SECTION 12A(1)(ac)(i) & 80G(5) OF IT ACT 1961', 95);
  addRow('TAX EXEMPTION BENEFIT', '50% DEDUCTION APPLICABLE FOR DONORS UNDER 80G', 105);
  addRow('ASSESSMENT YEARS', 'FROM AY 2024-25 TO AY 2028-29', 115);
  addRow('ORDER DATE', '18/04/2023', 125);
  addRow('APPROVING AUTHORITY', 'CIT (EXEMPTION), DELHI REGION', 135);

  doc.setDrawColor(226, 232, 240);
  doc.rect(20, 56, w - 40, 86);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Statutory order granting registration under Section 12A and Section 80G of the Income Tax Act, 1961.\nContributions made to RAWF are eligible for tax exemption receipt certification.',
    w / 2,
    155,
    { align: 'center' }
  );

  doc.setDrawColor(16, 185, 129);
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(25, 175, w - 50, 55, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(5, 150, 105);
  doc.text('INCOME TAX EXEMPTION COMPLIANCE SEAL', w / 2, 185, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('• Form 10AC Approval Number: 2023-AAATR8892E-80G', 32, 195);
  doc.text('• Filing Compliance: Form 10BD & Form 10BE compliant annually', 32, 202);
  doc.text('• Direct Portal: https://incometax.gov.in', 32, 209);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('RAID ACTION WING FOUNDATION (RAWF)', w / 2, 260, { align: 'center' });
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Statutory Section 80G Certified Non-Profit Institution • Jai Hind', w / 2, 266, { align: 'center' });

  const filePath = path.join(outDir, 'rawf-12a-80g-tax-exemption.pdf');
  fs.writeFileSync(filePath, Buffer.from(doc.output('arraybuffer')));
  console.log('Created:', filePath);
}

createMsmePdf();
createDarpanPdf();
createTrustCharterPdf();
createTaxExemptionPdf();
console.log('All certificates successfully generated!');
