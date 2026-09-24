# RAWF (Raid Action Wing Foundation) - cPanel Hosting Deployment Guide

This project is architected to run seamlessly on any **cPanel hosting environment**, whether using **cPanel Node.js Application Manager** or **standard cPanel Shared Hosting (Apache + PHP/Static)**.

---

## Default Administrative Credentials
- **Portal URL**: `https://your-domain.com/#admin` (or click **"Admin Command Console"** in the footer)
- **Default Username**: `admin@raidactionwing.in` (or `admin`)
- **Default Password**: `Admin@RAWF2026!`
- **Access Level**: Super Administrator / Director General Command

---

## Option A: Deploying via cPanel "Setup Node.js App" (Recommended)

Modern cPanel environments (with CloudLinux & Phusion Passenger) allow native Node.js application hosting.

### Step 1: Build the Frontend Assets
On your local machine or terminal:
```bash
npm install
npm run build
```
This generates the optimized production build in the `dist/` directory.

### Step 2: Upload Files to cPanel
1. Open **cPanel File Manager**.
2. Create an application directory outside or inside `public_html` (e.g. `/home/username/rawf-app`).
3. Upload the following files and folders:
   - `dist/` (the built client folder)
   - `server.ts` or `server.js`
   - `package.json`
   - `tsconfig.json`
   - `cpanel/app.js` (cPanel startup script)
   - `cpanel/.htaccess` (copy into the public document root)

### Step 3: Create the Node.js App in cPanel
1. In cPanel, find and click **Setup Node.js App**.
2. Click **Create Application**.
3. Configure the fields:
   - **Node.js version**: Choose `18.x`, `20.x`, or `22.x`.
   - **Application mode**: `Production`
   - **Application root**: `rawf-app` (the folder you created in Step 2).
   - **Application URL**: Select your domain or subdomain (e.g. `yourdomain.com`).
   - **Application startup file**: `server.ts` (if tsx is installed) or `cpanel/app.js`.
4. Click **Create**.
5. Under **Detected configuration files**, click **Run NPM Install** to install dependencies.
6. Click **Restart Application**.
7. Visit your domain: the application is live with all admin APIs active!

---

## Option B: Deploying as Static SPA + PHP API on Standard Shared cPanel (Zero Node.js Required)

If your shared cPanel host does **not** provide the Node.js selector:

### Step 1: Build the Project
```bash
npm run build
```

### Step 2: Upload Static Files to `public_html`
1. In cPanel **File Manager**, navigate to `public_html/`.
2. Extract or upload all files from inside the `dist/` folder directly into `public_html/`.
3. Copy `cpanel/.htaccess` into `public_html/.htaccess`. This enables clean HTML5 PushState routing and security headers.

### Step 3: Enable the PHP API Mirror
1. Inside `public_html/`, upload the `cpanel/php-api/` directory as `public_html/api/`.
2. Ensure `public_html/api/data.json` has write permissions (`chmod 664` or `chmod 666`).
3. All verification, grievance, donation, and admin functions now operate directly on standard PHP 7.4/8.x!

---

## Option C: Deploying via Docker or VPS (Alternative)
If you manage a VPS or Container:
```bash
npm install
npm run build
NODE_ENV=production PORT=3000 npm run start
```

---

## Key Administrative Features Included
- **Officer Roster Command**: Add new accredited officers, issue official badges, edit state jurisdiction, or 1-click **Revoke & Blacklist** rogue credentials.
- **Membership Applications**: Review intake applications across **District**, **State**, and **National** tiers, and 1-click **Approve & Generate Official Badge** (e.g., `RW-MH-109`).
- **Confidential Grievances**: Review encrypted citizen dossiers, assign state directorates, and update public investigation stages (*Received*, *Fact-Finding*, *Transmitted to ACB/Police*, *Closed*).
- **80G Donations**: Track and issue printable statutory 80G tax exemption receipts.
- **Blacklist Registry**: Public warning registry with Section 204 BNS statutory notice against badge fraud.
- **1-Click Database Export**: Download complete JSON snapshots of all applications, officers, and complaints for audit retention.
