====================================================================
RAID ACTION WING FOUNDATION (RAWF) - CPANEL DEPLOYMENT INSTRUCTIONS
====================================================================

This folder (cpanel_deploy) contains all pre-compiled production files
ready to be uploaded to your cPanel hosting account.

--------------------------------------------------------------------
STEP 1: UPLOAD TO CPANEL
--------------------------------------------------------------------
1. Log into your cPanel account.
2. Open "File Manager".
3. Open "public_html" (or your target subdomain/addon domain folder).
4. Upload all the files and folders from inside this "cpanel_deploy" 
   folder directly into "public_html".
   Make sure the hidden file ".htaccess" is uploaded!
   (In cPanel File Manager Settings top-right, enable "Show Hidden Files (dotfiles)").

--------------------------------------------------------------------
STEP 2: CREATE MYSQL DATABASE IN CPANEL
--------------------------------------------------------------------
1. In cPanel, click "MySQL Databases".
2. Create a new database (e.g. youruser_rawf).
3. Create a new user & secure password.
4. Under "Add User To Database", select your user and database, click "Add",
   and check "ALL PRIVILEGES".

--------------------------------------------------------------------
STEP 3: IMPORT DATABASE TABLES
--------------------------------------------------------------------
1. In cPanel, open "phpMyAdmin".
2. Click your newly created database on the left sidebar.
3. Click the "Import" tab at the top.
4. Click "Choose File" and select "rawf_production_schema.sql"
   (found inside this deploy folder).
5. Click "Go" at the bottom to run the import.

--------------------------------------------------------------------
STEP 4: CONFIGURE DATABASE CONNECTION
--------------------------------------------------------------------
1. In cPanel File Manager, open "public_html/api/config.php".
2. Edit the database credentials to match your cPanel MySQL details:
   define('DB_HOST', 'localhost');
   define('DB_USER', 'your_cpanel_db_user');
   define('DB_PASS', 'your_cpanel_db_password');
   define('DB_NAME', 'your_cpanel_db_name');
3. Save the file.

--------------------------------------------------------------------
STEP 5: VERIFY YOUR LIVE WEBSITE
--------------------------------------------------------------------
1. Visit your domain (e.g. https://yourdomain.com).
2. The entire RAWF portal is live with:
   - Full public portal & Hindi/English support
   - Institutional mandate, Legal repository, and Services
   - Instant Officer & Badge verification desk
   - Online Grievance submission cell
   - 80G Tax Exemption receipts
   - ID Card download desk
   - Administrative Command Console (https://yourdomain.com/#admin)
     Default Admin: admin@raidactionwing.in
     Default Pass:  Admin@RAWF2026!
====================================================================
