<?php
/**
 * RAID ACTION WING FOUNDATION (RAWF)
 * cPanel Standalone PHP MySQL Connectivity Diagnostic Tool
 * 
 * Instructions:
 * 1. Place this file in public_html/db_diagnostic.php on cPanel.
 * 2. Visit https://yourdomain.com/db_diagnostic.php in your browser.
 * 3. Delete this file after verification for security.
 */

header('Content-Type: text/html; charset=utf-8');

// Read configuration from environment or query parameters (with fallback)
$host = getenv('DB_HOST') ?: '127.0.0.1';
$port = (int)(getenv('DB_PORT') ?: 3306);
$user = getenv('DB_USER') ?: '';
$password = getenv('DB_PASSWORD') ?: '';
$database = getenv('DB_NAME') ?: '';

// Allow overrides via POST for quick in-browser credential testing
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $host = $_POST['host'] ?? $host;
    $port = (int)($_POST['port'] ?? $port);
    $user = $_POST['user'] ?? $user;
    $password = $_POST['password'] ?? $password;
    $database = $_POST['database'] ?? $database;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RAWF MySQL Database Diagnostic - cPanel</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 30px 20px; line-height: 1.5; }
        .container { max-width: 760px; margin: 0 auto; background: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 28px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        h1 { color: #ef4444; font-size: 22px; margin-top: 0; text-transform: uppercase; letter-spacing: 0.5px; }
        .box { background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 18px; margin: 18px 0; font-family: monospace; font-size: 13px; }
        .success { border-left: 4px solid #10b981; color: #a7f3d0; }
        .warning { border-left: 4px solid #f59e0b; color: #fde68a; }
        .error { border-left: 4px solid #ef4444; color: #fecaca; }
        label { display: block; font-size: 12px; font-weight: bold; margin-bottom: 4px; color: #cbd5e1; text-transform: uppercase; }
        input { width: 100%; box-sizing: border-box; background: #0f172a; border: 1px solid #475569; color: #fff; padding: 8px 12px; border-radius: 6px; margin-bottom: 12px; font-size: 14px; }
        button { background: #dc2626; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; text-transform: uppercase; font-size: 13px; }
        button:hover { background: #b91c1c; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
        .badge-green { background: #065f46; color: #6ee7b7; }
        .badge-red { background: #991b1b; color: #fca5a5; }
    </style>
</head>
<body>
<div class="container">
    <h1>RAWF cPanel MySQL Diagnostic Tool</h1>
    <p style="font-size: 13px; color: #94a3b8;">
        Verifies database connectivity, socket handshake, user permissions, and table existence under the Indian Trusts Act IFA 760 schema.
    </p>

    <form method="POST" style="margin-top: 20px;">
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px;">
            <div>
                <label>Database Host</label>
                <input type="text" name="host" value="<?php echo htmlspecialchars($host); ?>" placeholder="localhost or 127.0.0.1">
            </div>
            <div>
                <label>Port</label>
                <input type="number" name="port" value="<?php echo htmlspecialchars((string)$port); ?>" placeholder="3306">
            </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
                <label>Database User</label>
                <input type="text" name="user" value="<?php echo htmlspecialchars($user); ?>" placeholder="cpaneluser_dbuser">
            </div>
            <div>
                <label>Database Name</label>
                <input type="text" name="database" value="<?php echo htmlspecialchars($database); ?>" placeholder="cpaneluser_dbname">
            </div>
        </div>
        <div>
            <label>Database Password</label>
            <input type="password" name="password" value="<?php echo htmlspecialchars($password); ?>" placeholder="••••••••••••">
        </div>
        <button type="submit">Run Connectivity Diagnostic</button>
    </form>

    <hr style="border: none; border-top: 1px solid #334155; margin: 24px 0;">

    <h2 style="font-size: 16px; color: #cbd5e1; margin-bottom: 12px;">Diagnostic Telemetry Output:</h2>

    <?php
    if (empty($user) || empty($database)) {
        echo '<div class="box warning">⚠️ Please provide Database User, Database Name, and Password above to perform handshake.</div>';
    } else {
        $startTime = microtime(true);
        $conn = @new mysqli($host, $user, $password, $database, $port);
        $latency = round((microtime(true) - $startTime) * 1000, 2);

        if ($conn->connect_error) {
            echo '<div class="box error">';
            echo '<strong style="color: #ef4444;">❌ Handshake Failed:</strong> ' . htmlspecialchars($conn->connect_error) . '<br><br>';
            echo '<strong>Diagnostic Hints for cPanel:</strong><br>';
            echo '1. <strong>Prefix Check:</strong> Ensure Database Name & User include your cPanel username prefix (e.g., <code>rawf_db</code> vs <code>cpaneluser_rawf_db</code>).<br>';
            echo '2. <strong>User Privileges:</strong> In cPanel > MySQL Databases > "Add User to Database", confirm "ALL PRIVILEGES" is checked.<br>';
            echo '3. <strong>Host:</strong> On shared cPanel hosting, use <code>localhost</code> or <code>127.0.0.1</code>.';
            echo '</div>';
        } else {
            echo '<div class="box success">';
            echo '✅ <span class="badge badge-green">CONNECTED</span> <strong>Successfully established MySQL connection!</strong><br>';
            echo '• Latency: ' . $latency . ' ms<br>';
            echo '• Server Version: ' . htmlspecialchars($conn->server_info) . '<br>';
            echo '• Host Info: ' . htmlspecialchars($conn->host_info) . '<br>';
            echo '• Character Set: ' . htmlspecialchars($conn->character_set_name()) . '<br>';
            echo '</div>';

            // Check tables
            $tablesResult = $conn->query("SHOW TABLES;");
            $tables = [];
            if ($tablesResult) {
                while ($row = $tablesResult->fetch_array()) {
                    $tables[] = $row[0];
                }
            }

            echo '<div class="box success" style="border-left-color: #3b82f6; color: #bfdbfe;">';
            echo '<strong>Database Tables Discovered (' . count($tables) . '):</strong><br>';
            if (empty($tables)) {
                echo '⚠️ Database is connected but empty. Please run the RAWF SQL DDL script in phpMyAdmin.<br>';
            } else {
                echo '<code>' . implode(', ', array_map('htmlspecialchars', $tables)) . '</code><br><br>';

                $expected = ['officers', 'membership_applications', 'grievance_reports', 'activities'];
                $missing = array_diff($expected, $tables);

                if (empty($missing)) {
                    echo '✅ <span style="color: #10b981; font-weight: bold;">All core schema tables verified!</span>';
                } else {
                    echo '⚠️ Missing tables: ' . htmlspecialchars(implode(', ', $missing));
                }
            }
            echo '</div>';

            $conn->close();
        }
    }
    ?>

    <p style="font-size: 11px; color: #64748b; margin-top: 20px; text-align: center;">
        🔒 Security Note: Delete <code>db_diagnostic.php</code> from your server once diagnostic verification is completed.
    </p>
</div>
</body>
</html>
