-- Alias for rawf_production_schema.sql
-- Visit /rawf_production_schema.sql for the full database schema.
-- ==============================================================================
-- RAID ACTION WING FOUNDATION (RAWF) - PRODUCTION SQL SCHEMA
-- Target Engine: MySQL 8.0+ / MariaDB 10.4+ on cPanel (phpMyAdmin)
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

CREATE TABLE `officers` (
  `id` VARCHAR(64) NOT NULL,
  `uid_number` VARCHAR(64) NOT NULL,
  `badge_number` VARCHAR(64) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL DEFAULT 'Male',
  `dob` DATE NULL,
  `join_date` DATE NOT NULL DEFAULT (CURRENT_DATE),
  `phone_contact` VARCHAR(30) NULL,
  `email` VARCHAR(150) NOT NULL,
  `designation` VARCHAR(150) NOT NULL,
  `division` ENUM('national', 'state', 'legal') NOT NULL DEFAULT 'national',
  `state` VARCHAR(100) NOT NULL,
  `status` ENUM('ACTIVE', 'VERIFIED', 'COMMAND', 'SUSPENDED', 'REVOKED') NOT NULL DEFAULT 'ACTIVE',
  `photo_url` VARCHAR(500) DEFAULT NULL,
  `id_card_qr_url` VARCHAR(500) DEFAULT NULL,
  `valid_till` VARCHAR(50) NOT NULL DEFAULT '31-DEC-2027',
  `mandate` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_officers_uid` (`uid_number`),
  UNIQUE KEY `idx_officers_badge` (`badge_number`),
  KEY `idx_officers_email` (`email`),
  KEY `idx_officers_state_div` (`state`, `division`),
  KEY `idx_officers_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE `membership_applications` (
  `application_id` VARCHAR(64) NOT NULL,
  `full_name` VARCHAR(150) NOT NULL,
  `mobile` VARCHAR(30) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `wing` VARCHAR(150) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `aadhaar_last4` CHAR(4) NOT NULL,
  `voter_id` VARCHAR(50) DEFAULT NULL,
  `background` TEXT NOT NULL,
  `resume_document_url` VARCHAR(500) DEFAULT NULL,
  `status` ENUM('Pending Verification', 'Interview Scheduled', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending Verification',
  `assigned_badge` VARCHAR(50) DEFAULT NULL,
  `reviewed_by_officer_id` VARCHAR(64) DEFAULT NULL,
  `internal_remarks` TEXT DEFAULT NULL,
  `submitted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`application_id`),
  KEY `idx_app_email` (`email`),
  KEY `idx_app_mobile` (`mobile`),
  KEY `idx_app_status` (`status`),
  CONSTRAINT `fk_app_reviewer` FOREIGN KEY (`reviewed_by_officer_id`) 
    REFERENCES `officers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `grievance_reports` (
  `tracking_id` VARCHAR(64) NOT NULL,
  `category` VARCHAR(150) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `target_entity` VARCHAR(255) NOT NULL,
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
  `evidence_archive_url` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`tracking_id`),
  KEY `idx_grievance_status` (`status`),
  CONSTRAINT `fk_grievance_officer` FOREIGN KEY (`assigned_officer_id`) 
    REFERENCES `officers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `cover_image_url` VARCHAR(500) NOT NULL,
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

CREATE TABLE `activity_media` (
  `media_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `activity_id` VARCHAR(64) NOT NULL,
  `media_url` VARCHAR(500) NOT NULL,
  `media_type` ENUM('IMAGE', 'DOCUMENT', 'VIDEO') NOT NULL DEFAULT 'IMAGE',
  `caption` VARCHAR(255) DEFAULT NULL,
  `sort_order` SMALLINT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_media_activity_id` (`activity_id`),
  CONSTRAINT `fk_media_activity` FOREIGN KEY (`activity_id`) 
    REFERENCES `activities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE `donations` (
  `receipt_id` VARCHAR(64) NOT NULL,
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
-- 10. SYSTEM SETTINGS & METADATA TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `system_settings` (
  `setting_key` VARCHAR(100) NOT NULL PRIMARY KEY,
  `setting_value` LONGTEXT NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `system_settings` (`setting_key`, `setting_value`) VALUES
('organizationName', 'RAID ACTION WING FOUNDATION (RAWF)'),
('helpline', '1800-RAW-CELL / +91 98200 45678'),
('email', 'command@raidactionwing.in'),
('address', 'National HQ, New Delhi • Registered under ITA Act 1882 & IFA 760 Charter'),
('nitiAayogDarpan', 'DL/2021/RAWF'),
('msmeUdyam', 'UP-50-0196301')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

