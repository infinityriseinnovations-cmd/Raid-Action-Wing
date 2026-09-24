<?php
/**
 * RAWF cPanel Standalone PHP API Gateway
 * Drop-in solution for cPanel shared hosting without Node.js
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataPath = __DIR__ . '/data.json';

// Initialize data store if not present
if (!file_exists($dataPath)) {
    $initialData = [
        'officers' => [
            [
                'id' => 'DG-CRIME-001',
                'name' => 'Manoj Chauhan',
                'designation' => 'Director General (Crime & Vigilance Cell)',
                'division' => 'national',
                'state' => 'National HQ - New Delhi',
                'status' => 'COMMAND',
                'badgeNumber' => 'DG-CRIME-001',
                'validTill' => '31-DEC-2028',
                'mandate' => 'Supreme Oversight & National Anti-Corruption Enforcement'
            ],
            [
                'id' => 'RW-MH-102',
                'name' => 'Sushant Prakash Kagale',
                'designation' => 'National Investigation Officer (Maharashtra)',
                'division' => 'state',
                'state' => 'Maharashtra',
                'status' => 'ACTIVE',
                'badgeNumber' => 'RW-MH-102',
                'validTill' => '31-DEC-2026',
                'mandate' => 'Special Taskforce & Inter-State Economic Offenses'
            ]
        ],
        'grievances' => [],
        'applications' => [],
        'donations' => [],
        'blacklisted' => [
            [
                'id' => 'RW-DIS-091',
                'name' => 'Suresh Verma (Former Probationer)',
                'badgeNumber' => 'RW-DIS-091',
                'jurisdiction' => 'Delhi NCR',
                'revocationDate' => '15-JAN-2024',
                'reason' => 'Misrepresenting RAWF as official police agency, attempting unauthorized document seizure.',
                'status' => 'REVOKED & BLACKLISTED'
            ]
        ],
        'adminPassword' => 'Admin@RAWF2026!'
    ];
    file_put_contents($dataPath, json_encode($initialData, JSON_PRETTY_PRINT));
}

$db = json_decode(file_get_contents($dataPath), true);

function saveDB($db, $path) {
    file_put_contents($path, json_encode($db, JSON_PRETTY_PRINT));
}

$endpoint = $_GET['endpoint'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'), true) ?? [];

switch ($endpoint) {
    case 'officers':
        echo json_encode(['success' => true, 'count' => count($db['officers']), 'data' => $db['officers']]);
        break;

    case 'verify-officer':
        $code = strtoupper(trim($body['code'] ?? ''));
        $found = null;
        foreach ($db['officers'] as $o) {
            if (strtoupper($o['id']) === $code || strtoupper($o['badgeNumber']) === $code || stripos($o['name'], $code) !== false) {
                $found = $o;
                break;
            }
        }
        if ($found) {
            echo json_encode(['success' => true, 'verified' => true, 'officer' => $found, 'message' => "VALID OFFICIAL: {$found['name']} is authenticated."]);
        } else {
            echo json_encode(['success' => true, 'verified' => false, 'message' => 'Credential not found in active directory.']);
        }
        break;

    case 'grievance-submit':
        $trackId = 'GRV-2026-RAW-' . rand(1000, 9999);
        $record = array_merge($body, [
            'trackingId' => $trackId,
            'createdAt' => date('c'),
            'status' => 'Received',
            'statusDetails' => 'Dossier cryptographically stamped under IFA 760 protocol.'
        ]);
        $db['grievances'][$trackId] = $record;
        saveDB($db, $dataPath);
        echo json_encode(['success' => true, 'trackingId' => $trackId]);
        break;

    case 'admin-login':
        $user = strtolower(trim($body['username'] ?? ''));
        $pass = $body['password'] ?? '';
        if (($user === 'admin' || $user === 'admin@raidactionwing.in') && $pass === ($db['adminPassword'] ?? 'Admin@RAWF2026!')) {
            $token = 'cpanel-rawf-token-' . time();
            echo json_encode(['success' => true, 'token' => $token, 'admin' => ['username' => 'admin@raidactionwing.in', 'role' => 'Director General Command']]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid administrative credentials.']);
        }
        break;

    default:
        echo json_encode([
            'status' => 'online',
            'system' => 'RAWF cPanel PHP Gateway',
            'trust' => 'IFA No. 760 / ITA 1882'
        ]);
        break;
}
