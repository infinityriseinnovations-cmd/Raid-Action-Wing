<?php
/**
 * RAID ACTION WING FOUNDATION (RAWF)
 * Production Database Configuration for Serverbyt / StackCP / cPanel
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// --------------------------------------------------------------------------
// DATABASE CONNECTION CONFIGURATION
// Update with your phpMyAdmin / StackCP Database credentials:
// --------------------------------------------------------------------------
define('DB_HOST', getenv('DB_HOST') ?: 'shareddb-s.hosting.stackcp.net');
define('DB_NAME', getenv('DB_NAME') ?: 'rawf_portal-313235b3ec');
define('DB_USER', getenv('DB_USER') ?: 'rawf_portal-313235b3ec'); // Replace with your DB username if different
define('DB_PASS', getenv('DB_PASS') ?: ''); // Set your DB password here or in .env

// Admin Master Credentials
define('ADMIN_USER', 'admin@raidactionwing.in');
define('ADMIN_ALT_USER', 'admin');
define('ADMIN_PASS', 'Admin@RAWF2026!');
define('JWT_SECRET', 'RAWF_COMMAND_TOKEN_SECURE_KEY_2026');

function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        // Return null if DB is not reachable; fallback to mock/in-memory response
        return null;
    }
}
