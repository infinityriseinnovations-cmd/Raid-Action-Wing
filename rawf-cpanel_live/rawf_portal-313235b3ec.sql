-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: shareddb-s.hosting.stackcp.net
-- Generation Time: Oct 15, 2026 at 06:03 AM
-- Server version: 10.11.18-MariaDB-log
-- PHP Version: 8.3.35

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rawf_portal-313235b3ec`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` varchar(64) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` enum('Ground Action','Training & Drills','Public Awareness','Press Release','Legal Advocacy','Youth Wing','Legal Directorate','Institutional Command','Women Rights Wing') NOT NULL DEFAULT 'Ground Action',
  `activity_date` date NOT NULL,
  `location` varchar(150) NOT NULL,
  `summary` text NOT NULL,
  `full_content` longtext NOT NULL,
  `cover_image_url` varchar(500) NOT NULL COMMENT 'Stored in /uploads/activities/',
  `attendees_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `impact_metric` varchar(150) DEFAULT NULL,
  `lead_officer_id` varchar(64) DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `published_status` enum('Draft','Published','Archived') NOT NULL DEFAULT 'Published',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `activity_media`
--

CREATE TABLE `activity_media` (
  `media_id` bigint(20) UNSIGNED NOT NULL,
  `activity_id` varchar(64) NOT NULL,
  `media_url` varchar(500) NOT NULL COMMENT 'Stored in /uploads/activities/',
  `media_type` enum('IMAGE','DOCUMENT','VIDEO') NOT NULL DEFAULT 'IMAGE',
  `caption` varchar(255) DEFAULT NULL,
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donations`
--

CREATE TABLE `donations` (
  `receipt_id` varchar(64) NOT NULL COMMENT 'Format: RAWF-80G-2026-44912',
  `donor_name` varchar(150) NOT NULL,
  `pan_number` varchar(20) DEFAULT NULL,
  `donor_phone` varchar(30) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `fund` varchar(150) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `utr_number` varchar(100) DEFAULT NULL,
  `upi_id` varchar(100) DEFAULT NULL,
  `tax_exemption_eligible` tinyint(1) NOT NULL DEFAULT 1,
  `status` enum('Pending','Confirmed','Refunded') NOT NULL DEFAULT 'Confirmed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `grievance_reports`
--

CREATE TABLE `grievance_reports` (
  `tracking_id` varchar(64) NOT NULL COMMENT 'Format: GRV-2026-RAW-7192',
  `category` varchar(150) NOT NULL,
  `state` varchar(100) NOT NULL,
  `target_entity` varchar(255) NOT NULL COMMENT 'Accused Office or Department',
  `narrative` longtext NOT NULL,
  `is_anonymous` tinyint(1) NOT NULL DEFAULT 1,
  `reporter_name` varchar(150) DEFAULT NULL,
  `reporter_contact` varchar(150) DEFAULT NULL,
  `status` enum('Received','Assigned to Directorate','Fact-Finding & Evidence','Escalated to Statutory Body','Closed') NOT NULL DEFAULT 'Received',
  `status_details` text DEFAULT NULL,
  `assigned_officer_id` varchar(64) DEFAULT NULL,
  `evidence_archive_url` varchar(500) DEFAULT NULL COMMENT 'Path to /uploads/evidence/',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `grievance_status_history`
--

CREATE TABLE `grievance_status_history` (
  `history_id` bigint(20) UNSIGNED NOT NULL,
  `tracking_id` varchar(64) NOT NULL,
  `previous_status` varchar(64) DEFAULT NULL,
  `new_status` varchar(64) NOT NULL,
  `action_remarks` text NOT NULL,
  `updated_by_officer_id` varchar(64) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `membership_applications`
--

CREATE TABLE `membership_applications` (
  `application_id` varchar(64) NOT NULL COMMENT 'Format: RAWF-MEM-92140',
  `full_name` varchar(150) NOT NULL,
  `mobile` varchar(30) NOT NULL,
  `email` varchar(150) NOT NULL,
  `wing` varchar(150) NOT NULL COMMENT 'Target Directorate / Wing',
  `state` varchar(100) NOT NULL,
  `aadhaar_last4` char(4) NOT NULL COMMENT 'Masked Aadhaar Number',
  `voter_id` varchar(50) DEFAULT NULL,
  `background` text NOT NULL,
  `resume_document_url` varchar(500) DEFAULT NULL COMMENT 'Path to /uploads/applications/',
  `status` enum('Pending Verification','Interview Scheduled','Approved','Rejected') NOT NULL DEFAULT 'Pending Verification',
  `assigned_badge` varchar(50) DEFAULT NULL,
  `reviewed_by_officer_id` varchar(64) DEFAULT NULL,
  `internal_remarks` text DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `officers`
--

CREATE TABLE `officers` (
  `id` varchar(64) NOT NULL COMMENT 'Primary Identifier / Officer ID',
  `uid_number` varchar(64) NOT NULL COMMENT 'Unique Identity e.g., RAWF/2026/1995',
  `badge_number` varchar(64) NOT NULL COMMENT 'Badge identifier e.g., RAWF-IND-001',
  `name` varchar(150) NOT NULL COMMENT 'Officer Full Legal Name',
  `gender` enum('Male','Female','Other') NOT NULL DEFAULT 'Male',
  `dob` date DEFAULT NULL COMMENT 'Date of Birth (YYYY-MM-DD)',
  `join_date` date NOT NULL DEFAULT curdate() COMMENT 'Commissioning / Appointment Date',
  `phone_contact` varchar(30) DEFAULT NULL COMMENT 'Confidential Mobile Number',
  `email` varchar(150) NOT NULL COMMENT 'Official Email Address',
  `designation` varchar(150) NOT NULL COMMENT 'Rank / Designation',
  `division` enum('national','state','legal') NOT NULL DEFAULT 'national',
  `state` varchar(100) NOT NULL COMMENT 'Jurisdiction / State Directorate',
  `status` enum('ACTIVE','VERIFIED','COMMAND','SUSPENDED','REVOKED') NOT NULL DEFAULT 'ACTIVE',
  `photo_url` varchar(500) DEFAULT NULL COMMENT 'Path to /uploads/officers/ in cPanel',
  `id_card_qr_url` varchar(500) DEFAULT NULL COMMENT 'Path to /uploads/qr/ in cPanel',
  `valid_till` varchar(50) NOT NULL DEFAULT '31-DEC-2027',
  `mandate` text DEFAULT NULL COMMENT 'Specific Vigilance / Operational Mandate',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `officers`
--

INSERT INTO `officers` (`id`, `uid_number`, `badge_number`, `name`, `gender`, `dob`, `join_date`, `phone_contact`, `email`, `designation`, `division`, `state`, `status`, `photo_url`, `id_card_qr_url`, `valid_till`, `mandate`, `created_at`, `updated_at`) VALUES
('DG-CRIME-001', 'DG-CRIME-001', 'DG-CRIME-001', 'Manoj Chauhan', 'Male', '1978-08-14', '2021-01-01', '+91 98110 99887', 'manoj.chauhan@raidactionwing.in', 'Director General (Crime & Vigilance Cell)', 'national', 'National HQ - New Delhi', 'COMMAND', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUm1YEgLpksGzi3w_3gvQPMzQHxeJlPGIDPYSLpaJCRKoYNLLGbcUdrCUKoSaRyfEzL4ATnteKP2TfyzfoAVh1i5Kpa_VmIijrnduQpaY8f3zG3WoGPNJrVYlAkNW10Af4Sgz53Lwkm1nL1Xp2RSJO1N4pId9Ml-OLibxjnYl8ahmBmrReo3ewBqIGmPn5k_MsnyohwJdt7FnnDgVW2dEYGojLicyUTmbxn8Iv-d5fNMODD99vAKO6VQ', NULL, '31-DEC-2028', 'Supreme Oversight & National Anti-Corruption Enforcement', '2026-10-01 06:59:21', '2026-10-01 06:59:21'),
('RAWF/2026/1995', 'RAWF/2026/1995', 'RAWF/2026/1995', 'Akshay Vilas Patil', 'Male', '1995-12-20', '2024-09-11', '+91 98200 45678', 'akshay.patil@raidactionwing.in', 'District Special Officer', 'state', 'Maharashtra', 'ACTIVE', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUm1YEgLpksGzi3w_3gvQPMzQHxeJlPGIDPYSLpaJCRKoYNLLGbcUdrCUKoSaRyfEzL4ATnteKP2TfyzfoAVh1i5Kpa_VmIijrnduQpaY8f3zG3WoGPNJrVYlAkNW10Af4Sgz53Lwkm1nL1Xp2RSJO1N4pId9Ml-OLibxjnYl8ahmBmrReo3ewBqIGmPn5k_MsnyohwJdt7FnnDgVW2dEYGojLicyUTmbxn8Iv-d5fNMODD99vAKO6VQ', NULL, '11-09-2027', 'District Vigilance & Field Taskforce Enforcement', '2026-10-01 06:59:21', '2026-10-01 06:59:21'),
('RW-GJ-104', 'RW-GJ-104', 'RW-GJ-104', 'Vipul Harshad Bhai Dave', 'Male', '1982-09-22', '2022-07-15', '+91 98980 12345', 'vipul.dave@raidactionwing.in', 'State Director (Gujarat)', 'state', 'Gujarat', 'ACTIVE', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9LpEKtygMH9hqnG8rn8G5GMkabb623q08xiOT4fExKQpAxmXfMBqx50Q421-RJs_RA4EwXpnpRV1vaqisuY9ShWwE_-dlHHp_l7H0umSi-j2VgHBzJmVoOA8AM1QY53nkZJcjRhWa6zUi3jLx9E8P0TfWFCBiNT_4FHSL3zDAFwlNVyyRoC8-tqz0zakISnTxT5kgus_OER8csHXvPU8wcfGQAr0q3CJFHyqhjWApzxGyKoGWR4AVzg', NULL, '31-DEC-2026', 'State Vigilance Directorate & Port Operations Audit', '2026-10-01 06:59:21', '2026-10-01 06:59:21'),
('RW-LEG-001', 'RW-LEG-001', 'RW-LEG-001', 'Shekhar Kumar Nigam', 'Male', '1975-11-18', '2021-02-01', '+91 98101 22334', 'shekhar.nigam@raidactionwing.in', 'Chief Legal Advisor & Advocate', 'legal', 'Supreme Court & High Courts', 'VERIFIED', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKBCimjG0t1Psi8NaW5y8ZgGe-tVqjZvwsrTMqXJxoHOnsCBW5xp-MEf3kF0BUVI13eU257ZEk5qleDMl-E8-NJyRLA8QXgv87iz2Dmx-cVK15KP9s1NnOfjkkwFhSrq5tOIVOSbqgtI3uGEiXcm-ZVJW3N25MAS-_to6BIFBpa3YVexuhBluhv_4Ws9_slKeyV6QwyacnImqe_0E_7gI8gwvpD-TnyhFzs8d6atjcHjuZucvfY_hl7Q', NULL, '31-DEC-2028', 'Constitutional Rights, Anticipatory Bail & Writs', '2026-10-01 06:59:21', '2026-10-01 06:59:21'),
('RW-MH-102', 'RW-MH-102', 'RW-MH-102', 'Sushant Prakash Kagale', 'Male', '1988-05-15', '2022-03-10', '+91 99201 33445', 'sushant.kagale@raidactionwing.in', 'National Investigation Officer (Maharashtra)', 'state', 'Maharashtra', 'ACTIVE', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMjYeqo0GQGnnVCALTm2YL_ZT1q7UGxG2MHvI0ielMI02SoUfp7g5QqGw__jl2OI9rA6Sv7mczVS2AZSCpxLLApzP9k-GtQQkvcolLJEFLEn0q_ekfnD6hgQW9uX27XF-4IqmYs9v8KrBoJj0nd7Mgd7W5UZ7LU4SxmYgLGLDoXV0NEAzysp4ytUcxU2NpgRsfAfdOKxindrSxiH2jWNtLsPPEuyWASR5qtfoQHOTyXE9qVDMTYNK9g', NULL, '31-DEC-2026', 'Special Taskforce & Inter-State Economic Offenses', '2026-10-01 06:59:21', '2026-10-01 06:59:21'),
('RW-MP-105', 'RW-MP-105', 'RW-MP-105', 'Rajesh Shrawan', 'Male', '1985-01-10', '2022-11-01', '+91 94250 88776', 'rajesh.shrawan@raidactionwing.in', 'State Director (Madhya Pradesh)', 'state', 'Madhya Pradesh', 'ACTIVE', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzjOJW-0F9kQafL4EqjRAyrLWNV05ZyFI-1wCYRNv9TdnD9-FDOP2WWAjXCkijW26gHb1QNBYfsumpnqHE-Z_PIJjl6A482Zztt2P-Ikxhz3VDSd-hvdGvGBH4yMSpa9Tgze_hoLkmCGJOLdcGpmyxTHe1NkZPopjqRLXPL0dV1a2pl7Z7Ck625nGGdUd4MkhaYG8syU4ZgRlQmgy9bWL1wQ6MhVeIWtYqPxpx4ChjMP1qVWRXnZMwcQ', NULL, '31-DEC-2026', 'Central India Territorial Vigilance', '2026-10-01 06:59:21', '2026-10-01 06:59:21'),
('RW-NAT-002', 'RW-NAT-002', 'RW-NAT-002', 'Vishal Nain', 'Male', '1986-04-08', '2022-05-10', '+91 98112 33445', 'vishal.nain@raidactionwing.in', 'National Deputy Director (India)', 'national', 'National HQ', 'ACTIVE', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGi_EgkVKseLfKV27C6HTcNJHIos7qqFDnbT4fbIYckiKs7pgl9QqMBfBTowT-k04KyQblyZl1sjwPyxJzShvNe522AAL5s7eavqteLF80e8tSGaKMDqj-RRKkeVonrebNxuQXeH-52UjEsTMig7eYQSECi4-3gXwKd87FTziON3_mdC6kLlrxnapbxyZsYZ1S16n8-0JJMPgGJqQyITxFHRjUe0JhVOSybtlqvMOVbT_dYawEhfuWXw', NULL, '31-DEC-2027', 'Inter-Agency Liaison & Field Intelligence', '2026-10-01 06:59:21', '2026-10-01 06:59:21'),
('RW-NAT-W01', 'RW-NAT-W01', 'RW-NAT-W01', 'Phalguni Dutta Halder', 'Female', '1990-03-05', '2023-08-12', '+91 98310 55667', 'phalguni.halder@raidactionwing.in', 'National Secretary (Women Cell)', 'national', 'National HQ & Eastern Region', 'VERIFIED', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXFCKE0UX1utOq5DO1VETiwFFYnVuSBEzgwYvyQMsWJwudqom0fj2Hqe7nJMb5IgAf69rwxqcNoZp1AP4JyU1D3DCT42-kalWCBy2XsjlAlP0yDcmnKsxE3xIQ70-bRGNOY_HUXW0kNVO_8LkJysii3DdNQvHuvsjtPFboGrTQ69CMmDUexMKUTIwitMNzdhHpeMz_lA9FCuZBBE-5jm3374Mgi1nD1bSxEwkEKPAMdHfMnlpoOWhCmA', NULL, '31-DEC-2027', 'POSH Enforcement & Women Rights Directorate', '2026-10-01 06:59:21', '2026-10-01 06:59:21'),
('RW-UP-106', 'RW-UP-106', 'RW-UP-106', 'Subedar Saroj / Ajay Kumar', 'Male', '1980-06-12', '2023-01-15', '+91 94150 11223', 'subedar.saroj@raidactionwing.in', 'State Incharges (Uttar Pradesh)', 'state', 'Uttar Pradesh', 'ACTIVE', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmZOpfbug19sIOaInPooKLlPo4DYXaV5nnLv02DzRz_QArFJv5Q-1t2gcJEeD5koEUm6UnK-kn1cyEhQvbNXaLWzSEQyXtP3Jtbb0T8Elu-_riLzGqfiIvwj1uiwzvtfozNAXJizD7PouYEdKymX0-LmpzGs3T-hwi8EXEEwOisQDkfNyhOfVKzlXwRz7iVCIn7eF3eLrqYbVfDzq9ur6fypCfinXowr1DIu_NdhigHdqEVtmhC_h8Vw', NULL, '31-DEC-2026', 'Northern Zone Field Coordination', '2026-10-01 06:59:21', '2026-10-01 06:59:21');

-- --------------------------------------------------------

--
-- Table structure for table `officer_blacklists`
--

CREATE TABLE `officer_blacklists` (
  `id` varchar(64) NOT NULL,
  `name` varchar(150) NOT NULL,
  `badge_number` varchar(64) NOT NULL,
  `jurisdiction` varchar(150) NOT NULL,
  `revocation_date` date NOT NULL,
  `reason` text NOT NULL,
  `status` varchar(64) NOT NULL DEFAULT 'REVOKED & BLACKLISTED',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `otp_verification_logs`
--

CREATE TABLE `otp_verification_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uid_number` varchar(64) NOT NULL,
  `email` varchar(150) NOT NULL,
  `otp_code_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `is_consumed` tinyint(1) NOT NULL DEFAULT 0,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` longtext NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES
('address', 'National HQ, New Delhi • Registered under ITA Act 1882 & IFA 760 Charter', '2026-10-01 06:59:21'),
('email', 'command@raidactionwing.in', '2026-10-01 06:59:21'),
('helpline', '1800-RAW-CELL / +91 98200 45678', '2026-10-01 06:59:21'),
('msmeUdyam', 'UP-50-0196301', '2026-10-01 06:59:21'),
('nitiAayogDarpan', 'DL/2021/RAWF', '2026-10-01 06:59:21'),
('organizationName', 'RAID ACTION WING FOUNDATION (RAWF)', '2026-10-01 06:59:21');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_activities_slug` (`slug`),
  ADD KEY `idx_activities_cat_date` (`category`,`activity_date`),
  ADD KEY `idx_activities_published` (`published_status`),
  ADD KEY `fk_activity_officer` (`lead_officer_id`);

--
-- Indexes for table `activity_media`
--
ALTER TABLE `activity_media`
  ADD PRIMARY KEY (`media_id`),
  ADD KEY `idx_media_activity_id` (`activity_id`);

--
-- Indexes for table `donations`
--
ALTER TABLE `donations`
  ADD PRIMARY KEY (`receipt_id`),
  ADD KEY `idx_donations_pan` (`pan_number`),
  ADD KEY `idx_donations_created` (`created_at`);

--
-- Indexes for table `grievance_reports`
--
ALTER TABLE `grievance_reports`
  ADD PRIMARY KEY (`tracking_id`),
  ADD KEY `idx_grievance_status` (`status`),
  ADD KEY `idx_grievance_category` (`category`),
  ADD KEY `idx_grievance_state` (`state`),
  ADD KEY `idx_grievance_assigned` (`assigned_officer_id`),
  ADD KEY `idx_grievance_created` (`created_at`);

--
-- Indexes for table `grievance_status_history`
--
ALTER TABLE `grievance_status_history`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `idx_hist_tracking_id` (`tracking_id`),
  ADD KEY `fk_history_officer` (`updated_by_officer_id`);

--
-- Indexes for table `membership_applications`
--
ALTER TABLE `membership_applications`
  ADD PRIMARY KEY (`application_id`),
  ADD KEY `idx_app_email` (`email`),
  ADD KEY `idx_app_mobile` (`mobile`),
  ADD KEY `idx_app_lookup` (`email`,`mobile`),
  ADD KEY `idx_app_status` (`status`),
  ADD KEY `idx_app_state_wing` (`state`,`wing`),
  ADD KEY `fk_app_reviewer` (`reviewed_by_officer_id`);

--
-- Indexes for table `officers`
--
ALTER TABLE `officers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_officers_uid` (`uid_number`),
  ADD UNIQUE KEY `idx_officers_badge` (`badge_number`),
  ADD KEY `idx_officers_email` (`email`),
  ADD KEY `idx_officers_state_div` (`state`,`division`),
  ADD KEY `idx_officers_status` (`status`);

--
-- Indexes for table `officer_blacklists`
--
ALTER TABLE `officer_blacklists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_blacklist_badge` (`badge_number`),
  ADD KEY `idx_blacklist_name` (`name`);

--
-- Indexes for table `otp_verification_logs`
--
ALTER TABLE `otp_verification_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_otp_lookup` (`uid_number`,`is_consumed`,`expires_at`),
  ADD KEY `idx_otp_email` (`email`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_media`
--
ALTER TABLE `activity_media`
  MODIFY `media_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `grievance_status_history`
--
ALTER TABLE `grievance_status_history`
  MODIFY `history_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `otp_verification_logs`
--
ALTER TABLE `otp_verification_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activities`
--
ALTER TABLE `activities`
  ADD CONSTRAINT `fk_activity_officer` FOREIGN KEY (`lead_officer_id`) REFERENCES `officers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `activity_media`
--
ALTER TABLE `activity_media`
  ADD CONSTRAINT `fk_media_activity` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `grievance_reports`
--
ALTER TABLE `grievance_reports`
  ADD CONSTRAINT `fk_grievance_officer` FOREIGN KEY (`assigned_officer_id`) REFERENCES `officers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `grievance_status_history`
--
ALTER TABLE `grievance_status_history`
  ADD CONSTRAINT `fk_history_officer` FOREIGN KEY (`updated_by_officer_id`) REFERENCES `officers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_history_tracking` FOREIGN KEY (`tracking_id`) REFERENCES `grievance_reports` (`tracking_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `membership_applications`
--
ALTER TABLE `membership_applications`
  ADD CONSTRAINT `fk_app_reviewer` FOREIGN KEY (`reviewed_by_officer_id`) REFERENCES `officers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
