# Implementation Plan: Certificates Section & Homepage Showcase

Comprehensive specification for introducing a dedicated public **Certificates & Accreditations** directory, a streamlined **Admin Certificate Management (PDF/Image Uploader)** system, and prominent **Dual Highlight Buttons** on the homepage for Certificates and Activities/Blog.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX choices incorporate the user's confirmed choices from Phase 1:
> - **Public View Mode**: Dedicated **Certificates page** (`/certificates`) with interactive document viewer lightbox and one-click PDF/Image download.
> - **Homepage Prominence**: Dual highlighted action buttons in both the **Hero Command Center** and top **Navigation Bar** linking directly to Certificates and Activities/Blog.
> - **Admin Upload Workflow**: Simple, focused PDF and Image file uploader requiring only **Title**, **Description**, and **Document File**, with optional issuing details and status toggle.

- **Confirmed Decision 1**: Dedicated Certificates page with document viewer and download option.
- **Confirmed Decision 2**: Dual prominent action buttons in the hero section and navbar for Certificates and Activities/Blog.
- **Confirmed Decision 3**: Simple PDF and image uploader in Admin with title, description, and preview.

---

## 1. Overview & Core Concept

### What It Does
1. **Public Certificates & Statutory Accreditations Page**: A high-credibility public showcase of official government registrations and charters, featuring **MSME UDYAM** (`UP-50-0196301`), **NITI AAYOG DARPAN** (`DL/2021/RAWF`), and **Indian Trusts Act 1882 Charter (IFA No. 760)**. Visitors can search, inspect high-resolution documents in an interactive viewer, and download verified files.
2. **Admin Certificate Management Tab**: An administrative dashboard tab under `Admin > Certificates` allowing authorized officers to upload new PDF documents or certificate images, view existing certificates, edit descriptions, or remove outdated documents.
3. **Homepage & Navbar Highlights**: Visual call-to-action buttons placed strategically in the primary Hero Section and Navbar highlighting **"Official Certificates"** and **"Field Activities & Blog"**, steering public visitors toward institutional transparency.

### Target Audience
- Citizens verifying institutional bona fides before filing sensitive corruption grievances.
- Law enforcement personnel, judicial officers, and government bodies verifying RAWF's statutory accreditation under IFA 760.
- Donors, volunteers, and legal advocates seeking trust charters and compliance credentials.
- RAWF National Command administrators uploading certified certificates.

---

## 2. User Experience & Visual Design

### Key User Flows

#### A. Public Citizen & Visitor Flow
1. **Homepage Hero Discovery**: Visitor lands on the homepage; immediately notices the highlighted dual CTA strip below the hero directive:
   - `[ 📜 Official Certificates & Accreditations ]` (Navy Gold Accent)
   - `[ 📰 Field Activities & Video Dispatches ]` (Crimson Red Accent)
2. **Certificates Page Experience**: Visitor clicks "Official Certificates" and is routed to `/certificates`:
   - Sees an authoritative trust banner with national trust seal, DARPAN ID, IFA 760 registration details, and instant verification badge.
   - Interactive search bar to filter certificates by name or registration number.
   - Certificate cards displaying statutory authority, certificate title, description, file format badge (`PDF` / `IMAGE`), and "View Certificate" action.
3. **Interactive Document Viewer Modal**: Clicking "View Document" opens an inspection lightbox:
   - Full-width PDF reader iframe or high-resolution zoomable image viewer.
   - Direct "Download Certificate" button initiating secure file download.
   - Statutory notice indicating government verification status.

#### B. Administrator Flow
1. **Admin Portal Navigation**: Admin logs into `/admin` and selects the new **"Certificates"** tab in the sidebar.
2. **Uploading New Certificate**:
   - Clicks `+ Upload Certificate` button.
   - Enters **Certificate Title** (e.g. *MSME UDYAM Registration Certificate*).
   - Enters **Description / Remarks** (e.g. *Enterprise accreditation UP-50-0196301 under Ministry of MSME*).
   - Uploads file: Drag-and-drop or file picker accepting PDF (`application/pdf`) and Images (`.png`, `.jpg`, `.jpeg`, `.webp`).
   - Live preview appears instantly in the form.
   - Submits form; document is saved to `/uploads/certificates/` and published to the live registry.
3. **Editing & Deletion**: Admin can modify title/description, replace the file, or delete certificates with instant feedback.

### Visual Identity & Theme Tokens
- **Design System Alignment**: Institutional Government & Law Enforcement aesthetic with deep navy blue (`#0d47a1`), crisp police blue (`#1565c0`), crimson alert red (`#dc2626`), and warm gold/amber verification accents (`#f59e0b`).
- **Zero-Pill Discipline**: Metadata (document formats, dates, issuing bodies) rendered with clean typographic separators (`·` or `|`) rather than static candy pill capsules.
- **Hero Highlight Buttons**:
  - Certificates Button: Deep navy container with gold certificate icon, crisp border, hover shadow-md, and subtle sheen.
  - Activities/Blog Button: Rich slate/white container with vibrant red broadcast icon, distinct hover state.

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Rationale & Trade-Offs |
| :--- | :--- | :--- |
| **Document Formats** | Dual support for **PDF** and **Images** (PNG/JPG/WEBP) | Government certificates are commonly issued in PDF format, while scans or social seals may be images. Both formats preview natively in modern browsers. |
| **Storage & Persistence** | Dual-layer persistence: filesystem storage (`/uploads/certificates/`) + JSON database store with localStorage synchronization | Enables instant local preview in dev/SPA mode while providing reliable persistent storage across Node.js server and cPanel PHP environments. |
| **Viewer Modal** | Universal modal supporting embedded PDF iframe and responsive image viewer | Avoids forcing external downloads for casual verification while retaining a prominent 1-click Download button for users who need physical copies. |
| **Homepage CTAs** | Dual prominent action buttons in Hero Command Center + top Navbar link | Directly fulfills the user's explicit request while maintaining clean layout balance without cluttering the homepage. |

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE LAYER                          │
├────────────────────────────────┬───────────────────────────────────────┤
│          PUBLIC PORTAL         │             ADMIN PORTAL              │
│  ┌──────────────────────────┐  │  ┌──────────────────────────────────┐ │
│  │   Hero Command Center    │  │  │        Admin Navigation          │ │
│  │  [Certificates] [Blog]   │  │  │        (Certificates Tab)        │ │
│  └─────────────┬────────────┘  │  └──────────────────┬───────────────┘ │
│                │               │                     │                 │
│  ┌─────────────▼────────────┐  │  ┌──────────────────▼───────────────┐ │
│  │     CertificatesPage     │  │  │     Upload / Edit Modal          │ │
│  │   • Directory Grid       │  │  │   • Title & Description          │ │
│  │   • Document Lightbox    │  │  │   • PDF / Image File Uploader    │ │
│  │   • 1-Click Download     │  │  │   • Live Preview Box             │ │
│  └─────────────┬────────────┘  │  └──────────────────┬───────────────┘ │
└────────────────┼─────────────────────────────────────┼─────────────────┘
                 │                                     │
                 ▼                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        SERVICES & API CLIENT                           │
│  • certificatesApi.getAll()          • certificatesApi.create()        │
│  • certificatesApi.uploadFile()      • certificatesApi.delete()        │
└────────────────────────────────┬───────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       BACKEND & SERVER LAYER                           │
│  Express API (server.ts) & PHP API (public/api/index.php)              │
│  • GET    /api/certificates                                            │
│  • POST   /api/admin/certificates/upload                               │
│  • POST   /api/admin/certificates                                      │
│  • PUT    /api/admin/certificates/:id                                  │
│  • DELETE /api/admin/certificates/:id                                  │
│  • File Store: /uploads/certificates/ (PDFs & Images)                  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model (`CertificateRecord`)

```typescript
export interface CertificateRecord {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: 'pdf' | 'image';
  fileName: string;
  fileSize?: string;
  registrationNumber?: string;
  issuingAuthority?: string;
  issueDate?: string;
  status: 'Published' | 'Draft';
  createdAt?: string;
}
```

### Seed Certificates
1. **MSME UDYAM Registration Certificate**: Registration No. `UP-50-0196301`, Ministry of Micro, Small and Medium Enterprises.
2. **NITI Aayog NGO Darpan Certificate**: Unique ID `DL/2021/RAWF`, NITI Aayog Government of India.
3. **Indian Trusts Act 1882 Charter (IFA No. 760)**: Trust Reg. No. `448/2023`, Indian Trusts Act 1882 statutory foundation deed.
4. **Section 12A & 80G Statutory Exemption**: Income Tax Department recognition for charitable vigilance collective.

### Implementation Checklist
1. **`src/types` & `src/services/apiService.ts`**:
   - Define `CertificateRecord` interface.
   - Implement `certificatesApi` with `getAll`, `create`, `update`, `delete`, and `uploadFile`.
2. **`server.ts` & PHP API (`public/api/index.php`, `cpanel_deploy/api/index.php`)**:
   - Add in-memory `certificatesDatabase` with default seeded certificates.
   - Implement `/api/certificates` and `/api/admin/certificates` endpoints.
   - Implement `/api/admin/certificates/upload` accepting base64 file data and saving to `public/uploads/certificates/`.
3. **`src/pages/CertificatesPage.tsx`**:
   - Create public certificates directory page with search, filter tabs, document cards, and full-screen PDF/image inspection modal with download support.
4. **`src/components/HeroCommandCenter.tsx`**:
   - Add dual prominent action buttons linking to Certificates and Activities/Blog.
5. **`src/components/Navbar.tsx`**:
   - Add "Certificates" navigation link and highlighted quick badge.
6. **`src/pages/AdminPage.tsx`**:
   - Add "Certificates" management tab, table list, search, and Add/Edit Certificate modal with simple PDF/image uploader.
7. **`src/App.tsx`**:
   - Route `certificates` page and hash anchor `#certificates-page`.
