-- ==============================================================================
-- RAID ACTION WING FOUNDATION (RAWF) - COMPLETE PRODUCTION SQL SCHEMA
-- Target Engine: MySQL 8.0+ / MariaDB 10.4+ on cPanel (phpMyAdmin)
-- Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- Generated for: Raid Action Wing Foundation (IFA 760 Charter / ITA 1882)
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `activity_media`;
DROP TABLE IF EXISTS `activities`;
DROP TABLE IF EXISTS `grievance_status_history`;
DROP TABLE IF EXISTS `grievance_reports`;
DROP TABLE IF EXISTS `membership_applications`;
DROP TABLE IF EXISTS `otp_verification_logs`;
DROP TABLE IF EXISTS `officer_blacklists`;
DROP TABLE IF EXISTS `donations`;
DROP TABLE IF EXISTS `officers`;
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------------------------
-- 1. OFFICERS TABLE (Active Directory, Credentials, Roster)
-- ------------------------------------------------------------------------------
CREATE TABLE `officers` (
  `id` VARCHAR(64) NOT NULL COMMENT 'Primary Identifier / Officer ID',
  `uid_number` VARCHAR(64) NOT NULL COMMENT 'Unique Identity e.g., RAWF/2026/1995',
  `badge_number` VARCHAR(64) NOT NULL COMMENT 'Badge identifier e.g., RAWF-IND-001',
  `name` VARCHAR(150) NOT NULL COMMENT 'Officer Full Legal Name',
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL DEFAULT 'Male',
  `dob` DATE NULL COMMENT 'Date of Birth (YYYY-MM-DD)',
  `join_date` DATE NOT NULL DEFAULT (CURRENT_DATE) COMMENT 'Commissioning / Appointment Date',
  `phone_contact` VARCHAR(30) NULL COMMENT 'Confidential Mobile Number',
  `email` VARCHAR(150) NOT NULL COMMENT 'Official Email Address',
  `designation` VARCHAR(150) NOT NULL COMMENT 'Rank / Designation',
  `division` ENUM('national', 'state', 'legal') NOT NULL DEFAULT 'national',
  `state` VARCHAR(100) NOT NULL COMMENT 'Jurisdiction / State Directorate',
  `status` ENUM('ACTIVE', 'VERIFIED', 'COMMAND', 'SUSPENDED', 'REVOKED') NOT NULL DEFAULT 'ACTIVE',
  `photo_url` VARCHAR(500) DEFAULT NULL COMMENT 'Path to /uploads/officers/ in cPanel',
  `id_card_qr_url` VARCHAR(500) DEFAULT NULL COMMENT 'Path to /uploads/qr/ in cPanel',
  `valid_till` VARCHAR(50) NOT NULL DEFAULT '31-DEC-2027',
  `mandate` TEXT NULL COMMENT 'Specific Vigilance / Operational Mandate',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_officers_uid` (`uid_number`),
  UNIQUE KEY `idx_officers_badge` (`badge_number`),
  KEY `idx_officers_email` (`email`),
  KEY `idx_officers_state_div` (`state`, `division`),
  KEY `idx_officers_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. REVOKED & BLACKLISTED OFFICERS (Anti-Impersonation Registry)
-- ------------------------------------------------------------------------------
CREATE TABLE `officer_blacklists` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `badge_number` VARCHAR(64) NOT NULL,
  `jurisdiction` VARCHAR(150) NOT NULL,
  `revocation_date` DATE NOT NULL,
  `reason` TEXT NOT NULL,
  `status` VARCHAR(64) NOT NULL DEFAULT 'REVOKED & BLACKLISTED',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_blacklist_badge` (`badge_number`),
  KEY `idx_blacklist_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. MEMBERSHIP APPLICATIONS (Volunteer & Candidate Screening)
-- ------------------------------------------------------------------------------
CREATE TABLE `membership_applications` (
  `application_id` VARCHAR(64) NOT NULL COMMENT 'Format: RAWF-MEM-92140',
  `full_name` VARCHAR(150) NOT NULL,
  `mobile` VARCHAR(30) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `wing` VARCHAR(150) NOT NULL COMMENT 'Target Directorate / Wing',
  `state` VARCHAR(100) NOT NULL,
  `aadhaar_last4` CHAR(4) NOT NULL COMMENT 'Masked Aadhaar Number',
  `voter_id` VARCHAR(50) DEFAULT NULL,
  `background` TEXT NOT NULL,
  `resume_document_url` VARCHAR(500) DEFAULT NULL COMMENT 'Path to /uploads/applications/',
  `status` ENUM('Pending Verification', 'Interview Scheduled', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending Verification',
  `assigned_badge` VARCHAR(50) DEFAULT NULL,
  `reviewed_by_officer_id` VARCHAR(64) DEFAULT NULL,
  `internal_remarks` TEXT DEFAULT NULL,
  `submitted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`application_id`),
  KEY `idx_app_email` (`email`),
  KEY `idx_app_mobile` (`mobile`),
  KEY `idx_app_lookup` (`email`, `mobile`),
  KEY `idx_app_status` (`status`),
  KEY `idx_app_state_wing` (`state`, `wing`),
  CONSTRAINT `fk_app_reviewer` FOREIGN KEY (`reviewed_by_officer_id`) 
    REFERENCES `officers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. GRIEVANCE REPORTS (Encrypted Whistleblower & Citizen Dossiers)
-- ------------------------------------------------------------------------------
CREATE TABLE `grievance_reports` (
  `tracking_id` VARCHAR(64) NOT NULL COMMENT 'Format: GRV-2026-RAW-7192',
  `category` VARCHAR(150) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `target_entity` VARCHAR(255) NOT NULL COMMENT 'Accused Office or Department',
  `narrative` LONGTEXT NOT NULL,
  `is_anonymous` TINYINT(1) NOT NULL DEFAULT 1,
  `reporter_name` VARCHAR(150) DEFAULT NULL,
  `reporter_contact` VARCHAR(150) DEFAULT NULL,
  `status` ENUM(
    'Received',
    'Assigned to Directorate',
    'Fact-Finding & Evidence',
    'Escalated to Statutory Body',
    'Closed'
  ) NOT NULL DEFAULT 'Received',
  `status_details` TEXT DEFAULT NULL,
  `assigned_officer_id` VARCHAR(64) DEFAULT NULL,
  `evidence_archive_url` VARCHAR(500) DEFAULT NULL COMMENT 'Path to /uploads/evidence/',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`tracking_id`),
  KEY `idx_grievance_status` (`status`),
  KEY `idx_grievance_category` (`category`),
  KEY `idx_grievance_state` (`state`),
  KEY `idx_grievance_assigned` (`assigned_officer_id`),
  KEY `idx_grievance_created` (`created_at`),
  CONSTRAINT `fk_grievance_officer` FOREIGN KEY (`assigned_officer_id`) 
    REFERENCES `officers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. GRIEVANCE STATUS HISTORY (Investigation Audit Trail)
-- ------------------------------------------------------------------------------
CREATE TABLE `grievance_status_history` (
  `history_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `tracking_id` VARCHAR(64) NOT NULL,
  `previous_status` VARCHAR(64) NULL,
  `new_status` VARCHAR(64) NOT NULL,
  `action_remarks` TEXT NOT NULL,
  `updated_by_officer_id` VARCHAR(64) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_hist_tracking_id` (`tracking_id`),
  CONSTRAINT `fk_history_tracking` FOREIGN KEY (`tracking_id`) 
    REFERENCES `grievance_reports` (`tracking_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_history_officer` FOREIGN KEY (`updated_by_officer_id`) 
    REFERENCES `officers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. ACTIVITIES & BLOG ARTICLES (Ground Actions, Press Releases)
-- ------------------------------------------------------------------------------
CREATE TABLE `activities` (
  `id` VARCHAR(64) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` ENUM(
    'Ground Action',
    'Training & Drills',
    'Public Awareness',
    'Press Release',
    'Legal Advocacy',
    'Youth Wing',
    'Legal Directorate',
    'Institutional Command',
    'Women Rights Wing'
  ) NOT NULL DEFAULT 'Ground Action',
  `activity_date` DATE NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `summary` TEXT NOT NULL,
  `full_content` LONGTEXT NOT NULL,
  `cover_image_url` VARCHAR(500) NOT NULL COMMENT 'Stored in /uploads/activities/',
  `attendees_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `impact_metric` VARCHAR(150) DEFAULT NULL,
  `lead_officer_id` VARCHAR(64) DEFAULT NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `published_status` ENUM('Draft', 'Published', 'Archived') NOT NULL DEFAULT 'Published',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_activities_slug` (`slug`),
  KEY `idx_activities_cat_date` (`category`, `activity_date`),
  KEY `idx_activities_published` (`published_status`),
  CONSTRAINT `fk_activity_officer` FOREIGN KEY (`lead_officer_id`) 
    REFERENCES `officers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. ACTIVITY MEDIA GALLERY (Multi-Image Evidence)
-- ------------------------------------------------------------------------------
CREATE TABLE `activity_media` (
  `media_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `activity_id` VARCHAR(64) NOT NULL,
  `media_url` VARCHAR(500) NOT NULL COMMENT 'Stored in /uploads/activities/',
  `media_type` ENUM('IMAGE', 'DOCUMENT', 'VIDEO') NOT NULL DEFAULT 'IMAGE',
  `caption` VARCHAR(255) DEFAULT NULL,
  `sort_order` SMALLINT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_media_activity_id` (`activity_id`),
  CONSTRAINT `fk_media_activity` FOREIGN KEY (`activity_id`) 
    REFERENCES `activities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. OTP VERIFICATION LOGS (Time-Expiring 2FA Tokens)
-- ------------------------------------------------------------------------------
CREATE TABLE `otp_verification_logs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uid_number` VARCHAR(64) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `otp_code_hash` VARCHAR(255) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `attempts` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `is_consumed` TINYINT(1) NOT NULL DEFAULT 0,
  `ip_address` VARCHAR(45) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_otp_lookup` (`uid_number`, `is_consumed`, `expires_at`),
  KEY `idx_otp_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 9. DONATIONS & TAX EXEMPTION RECEIPTS (Section 80G)
-- ------------------------------------------------------------------------------
CREATE TABLE `donations` (
  `receipt_id` VARCHAR(64) NOT NULL COMMENT 'Format: RAWF-80G-2026-44912',
  `donor_name` VARCHAR(150) NOT NULL,
  `pan_number` VARCHAR(20) DEFAULT NULL,
  `donor_phone` VARCHAR(30) DEFAULT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `fund` VARCHAR(150) NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL,
  `utr_number` VARCHAR(100) DEFAULT NULL,
  `upi_id` VARCHAR(100) DEFAULT NULL,
  `tax_exemption_eligible` TINYINT(1) NOT NULL DEFAULT 1,
  `status` ENUM('Pending', 'Confirmed', 'Refunded') NOT NULL DEFAULT 'Confirmed',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`receipt_id`),
  KEY `idx_donations_pan` (`pan_number`),
  KEY `idx_donations_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- SEED DATA: OFFICIAL ACTIVE ROSTER INITIALIZATION
-- ------------------------------------------------------------------------------
INSERT INTO `officers` (`id`, `uid_number`, `badge_number`, `name`, `gender`, `dob`, `join_date`, `phone_contact`, `email`, `designation`, `division`, `state`, `status`, `photo_url`, `valid_till`, `mandate`) VALUES
('RAWF/2026/1995', 'RAWF/2026/1995', 'RAWF/2026/1995', 'Akshay Vilas Patil', 'Male', '1995-12-20', '2024-09-11', '+91 98200 45678', 'akshay.patil@raidactionwing.in', 'District Special Officer', 'state', 'Maharashtra', 'ACTIVE', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUm1YEgLpksGzi3w_3gvQPMzQHxeJlPGIDPYSLpaJCRKoYNLLGbcUdrCUKoSaRyfEzL4ATnteKP2TfyzfoAVh1i5Kpa_VmIijrnduQpaY8f3zG3WoGPNJrVYlAkNW10Af4Sgz53Lwkm1nL1Xp2RSJO1N4pId9Ml-OLibxjnYl8ahmBmrReo3ewBqIGmPn5k_MsnyohwJdt7FnnDgVW2dEYGojLicyUTmbxn8Iv-d5fNMODD99vAKO6VQ', '11-09-2027', 'District Vigilance & Field Taskforce Enforcement'),
('DG-CRIME-001', 'DG-CRIME-001', 'DG-CRIME-001', 'Manoj Chauhan', 'Male', '1978-08-14', '2021-01-01', '+91 98110 99887', 'manoj.chauhan@raidactionwing.in', 'Director General (Crime & Vigilance Cell)', 'national', 'National HQ - New Delhi', 'COMMAND', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUm1YEgLpksGzi3w_3gvQPMzQHxeJlPGIDPYSLpaJCRKoYNLLGbcUdrCUKoSaRyfEzL4ATnteKP2TfyzfoAVh1i5Kpa_VmIijrnduQpaY8f3zG3WoGPNJrVYlAkNW10Af4Sgz53Lwkm1nL1Xp2RSJO1N4pId9Ml-OLibxjnYl8ahmBmrReo3ewBqIGmPn5k_MsnyohwJdt7FnnDgVW2dEYGojLicyUTmbxn8Iv-d5fNMODD99vAKO6VQ', '31-DEC-2028', 'Supreme Oversight & National Anti-Corruption Enforcement'),
('RW-MH-102', 'RW-MH-102', 'RW-MH-102', 'Sushant Prakash Kagale', 'Male', '1988-05-15', '2022-03-10', '+91 99201 33445', 'sushant.kagale@raidactionwing.in', 'National Investigation Officer (Maharashtra)', 'state', 'Maharashtra', 'ACTIVE', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMjYeqo0GQGnnVCALTm2YL_ZT1q7UGxG2MHvI0ielMI02SoUfp7g5QqGw__jl2OI9rA6Sv7mczVS2AZSCpxLLApzP9k-GtQQkvcolLJEFLEn0q_ekfnD6hgQW9uX27XF-4IqmYs9v8KrBoJj0nd7Mgd7W5UZ7LU4SxmYgLGLDoXV0NEAzysp4ytUcxU2NpgRsfAfdOKxindrSxiH2jWNtLsPPEuyWASR5qtfoQHOTyXE9qVDMTYNK9g', '31-DEC-2026', 'Special Taskforce & Inter-State Economic Offenses'),
('RW-GJ-104', 'RW-GJ-104', 'RW-GJ-104', 'Vipul Harshad Bhai Dave', 'Male', '1982-09-22', '2022-07-15', '+91 98980 12345', 'vipul.dave@raidactionwing.in', 'State Director (Gujarat)', 'state', 'Gujarat', 'ACTIVE', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9LpEKtygMH9hqnG8rn8G5GMkabb623q08xiOT4fExKQpAxmXfMBqx50Q421-RJs_RA4EwXpnpRV1vaqisuY9ShWwE_-dlHHp_l7H0umSi-j2VgHBzJmVoOA8AM1QY53nkZJcjRhWa6zUi3jLx9E8P0TfWFCBiNT_4FHSL3zDAFwlNVyyRoC8-tqz0zakISnTxT5kgus_OER8csHXvPU8wcfGQAr0q3CJFHyqhjWApzxGyKoGWR4AVzg', '31-DEC-2026', 'State Vigilance Directorate & Port Operations Audit'),
('RW-MP-105', 'RW-MP-105', 'RW-MP-105', 'Rajesh Shrawan', 'Male', '1985-01-10', '2022-11-01', '+91 94250 88776', 'rajesh.shrawan@raidactionwing.in', 'State Director (Madhya Pradesh)', 'state', 'Madhya Pradesh', 'ACTIVE', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzjOJW-0F9kQafL4EqjRAyrLWNV05ZyFI-1wCYRNv9TdnD9-FDOP2WWAjXCkijW26gHb1QNBYfsumpnqHE-Z_PIJjl6A482Zztt2P-Ikxhz3VDSd-hvdGvGBH4yMSpa9Tgze_hoLkmCGJOLdcGpmyxTHe1NkZPopjqRLXPL0dV1a2pl7Z7Ck625nGGdUd4MkhaYG8syU4ZgRlQmgy9bWL1wQ6MhVeIWtYqPxpx4ChjMP1qVWRXnZMwcQ', '31-DEC-2026', 'Central India Territorial Vigilance'),
('RW-NAT-W01', 'RW-NAT-W01', 'RW-NAT-W01', 'Phalguni Dutta Halder', 'Female', '1990-03-05', '2023-08-12', '+91 98310 55667', 'phalguni.halder@raidactionwing.in', 'National Secretary (Women Cell)', 'national', 'National HQ & Eastern Region', 'VERIFIED', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXFCKE0UX1utOq5DO1VETiwFFYnVuSBEzgwYvyQMsWJwudqom0fj2Hqe7nJMb5IgAf69rwxqcNoZp1AP4JyU1D3DCT42-kalWCBy2XsjlAlP0yDcmnKsxE3xIQ70-bRGNOY_HUXW0kNVO_8LkJysii3DdNQvHuvsjtPFboGrTQ69CMmDUexMKUTIwitMNzdhHpeMz_lA9FCuZBBE-5jm3374Mgi1nD1bSxEwkEKPAMdHfMnlpoOWhCmA', '31-DEC-2027', 'POSH Enforcement & Women Rights Directorate'),
('RW-LEG-001', 'RW-LEG-001', 'RW-LEG-001', 'Shekhar Kumar Nigam', 'Male', '1975-11-18', '2021-02-01', '+91 98101 22334', 'shekhar.nigam@raidactionwing.in', 'Chief Legal Advisor & Advocate', 'legal', 'Supreme Court & High Courts', 'VERIFIED', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKBCimjG0t1Psi8NaW5y8ZgGe-tVqjZvwsrTMqXJxoHOnsCBW5xp-MEf3kF0BUVI13eU257ZEk5qleDMl-E8-NJyRLA8QXgv87iz2Dmx-cVK15KP9s1NnOfjkkwFhSrq5tOIVOSbqgtI3uGEiXcm-ZVJW3N25MAS-_to6BIFBpa3YVexuhBluhv_4Ws9_slKeyV6QwyacnImqe_0E_7gI8gwvpD-TnyhFzs8d6atjcHjuZucvfY_hl7Q', '31-DEC-2028', 'Constitutional Rights, Anticipatory Bail & Writs'),
('RW-NAT-002', 'RW-NAT-002', 'RW-NAT-002', 'Vishal Nain', 'Male', '1986-04-08', '2022-05-10', '+91 98112 33445', 'vishal.nain@raidactionwing.in', 'National Deputy Director (India)', 'national', 'National HQ', 'ACTIVE', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGi_EgkVKseLfKV27C6HTcNJHIos7qqFDnbT4fbIYckiKs7pgl9QqMBfBTowT-k04KyQblyZl1sjwPyxJzShvNe522AAL5s7eavqteLF80e8tSGaKMDqj-RRKkeVonrebNxuQXeH-52UjEsTMig7eYQSECi4-3gXwKd87FTziON3_mdC6kLlrxnapbxyZsYZ1S16n8-0JJMPgGJqQyITxFHRjUe0JhVOSybtlqvMOVbT_dYawEhfuWXw', '31-DEC-2027', 'Inter-Agency Liaison & Field Intelligence'),
('RW-UP-106', 'RW-UP-106', 'RW-UP-106', 'Subedar Saroj / Ajay Kumar', 'Male', '1980-06-12', '2023-01-15', '+91 94150 11223', 'subedar.saroj@raidactionwing.in', 'State Incharges (Uttar Pradesh)', 'state', 'Uttar Pradesh', 'ACTIVE', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmZOpfbug19sIOaInPooKLlPo4DYXaV5nnLv02DzRz_QArFJv5Q-1t2gcJEeD5koEUm6UnK-kn1cyEhQvbNXaLWzSEQyXtP3Jtbb0T8Elu-_riLzGqfiIvwj1uiwzvtfozNAXJizD7PouYEdKymX0-LmpzGs3T-hwi8EXEEwOisQDkfNyhOfVKzlXwRz7iVCIn7eF3eLrqYbVfDzq9ur6fypCfinXowr1DIu_NdhigHdqEVtmhC_h8Vw', '31-DEC-2026', 'Northern Zone Field Coordination');
