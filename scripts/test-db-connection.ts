/**
 * RAID ACTION WING FOUNDATION (RAWF)
 * MySQL Database Diagnostic & Connectivity Verification Script
 *
 * Usage:
 *   npx tsx scripts/test-db-connection.ts
 *   or: npm run test:db
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env if present
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config(); // fallback
}

interface DiagnosticResult {
  step: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  message: string;
  details?: any;
}

async function runDatabaseDiagnostics() {
  console.log('================================================================');
  console.log(' RAID ACTION WING FOUNDATION (RAWF) - CPANEL MYSQL DIAGNOSTIC');
  console.log('================================================================\n');

  const host = process.env.DB_HOST || '127.0.0.1';
  const port = Number(process.env.DB_PORT) || 3306;
  const user = process.env.DB_USER || '';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || '';
  const sslRequired = process.env.DB_SSL === 'true';

  console.log('📋 Configuration Detected:');
  console.log(`  • Host:     ${host}`);
  console.log(`  • Port:     ${port}`);
  console.log(`  • User:     ${user || '(empty / not set)'}`);
  console.log(`  • Database: ${database || '(empty / not set)'}`);
  console.log(`  • Password: ${password ? '******** (configured)' : '(empty / not set)'}`);
  console.log(`  • SSL:      ${sslRequired ? 'Enabled' : 'Disabled'}\n`);

  const results: DiagnosticResult[] = [];

  if (!user || !database) {
    results.push({
      step: 'Environment Variables Validation',
      status: 'WARNING',
      message: 'DB_USER or DB_NAME is missing in .env. Please set valid cPanel MySQL credentials.',
    });
  } else {
    results.push({
      step: 'Environment Variables Validation',
      status: 'SUCCESS',
      message: 'Required environment variables are populated.',
    });
  }

  let connection: mysql.Connection | null = null;
  const startTime = Date.now();

  try {
    console.log('⏳ 1. Attempting TCP Connection & Authentication...');
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database: database || undefined,
      connectTimeout: 8000,
      ssl: sslRequired ? { rejectUnauthorized: false } : undefined,
    });

    const latency = Date.now() - startTime;
    console.log(`✅ Handshake successful! Latency: ${latency}ms\n`);
    results.push({
      step: 'MySQL Server Handshake',
      status: 'SUCCESS',
      message: `Connected successfully to MySQL server at ${host}:${port} (${latency}ms latency).`,
    });

    // Query 1: Check MySQL Version
    console.log('⏳ 2. Fetching Server Version & Charset...');
    const [versionRows]: any = await connection.query('SELECT VERSION() AS version, @@character_set_database AS charset, @@collation_database AS collation;');
    const serverVersion = versionRows?.[0]?.version || 'Unknown';
    const charset = versionRows?.[0]?.charset || 'Unknown';
    const collation = versionRows?.[0]?.collation || 'Unknown';

    console.log(`  • Version:   ${serverVersion}`);
    console.log(`  • Charset:   ${charset}`);
    console.log(`  • Collation: ${collation}\n`);

    results.push({
      step: 'Server Telemetry',
      status: 'SUCCESS',
      message: `MySQL ${serverVersion} (Charset: ${charset}, Collation: ${collation})`,
    });

    // Query 2: Inspect Tables in Database
    if (database) {
      console.log(`⏳ 3. Inspecting Database Tables in [${database}]...`);
      const [tableRows]: any = await connection.query('SHOW TABLES;');
      const tableKey = `Tables_in_${database}`;
      const tables: string[] = tableRows.map((r: any) => r[tableKey] || Object.values(r)[0]);

      console.log(`  Found ${tables.length} table(s): ${tables.length > 0 ? tables.join(', ') : 'None'}\n`);

      const expectedTables = [
        'officers',
        'membership_applications',
        'grievance_reports',
        'activities',
      ];

      const missingTables = expectedTables.filter((t) => !tables.includes(t));

      if (missingTables.length === 0) {
        results.push({
          step: 'Schema & Tables Verification',
          status: 'SUCCESS',
          message: `All core tables exist (${expectedTables.join(', ')}).`,
        });
      } else if (tables.length === 0) {
        results.push({
          step: 'Schema & Tables Verification',
          status: 'WARNING',
          message: `Database [${database}] is connected but empty. Execute the RAWF SQL migration script in phpMyAdmin.`,
        });
      } else {
        results.push({
          step: 'Schema & Tables Verification',
          status: 'WARNING',
          message: `Missing expected tables: ${missingTables.join(', ')}. Found: ${tables.join(', ')}.`,
        });
      }

      // Query 3: Row Counts for Existing Core Tables
      if (tables.includes('officers')) {
        const [officerRows]: any = await connection.query('SELECT COUNT(*) AS count FROM officers;');
        console.log(`  • Officers Table: ${officerRows[0]?.count || 0} record(s)`);
      }
      if (tables.includes('membership_applications')) {
        const [appRows]: any = await connection.query('SELECT COUNT(*) AS count FROM membership_applications;');
        console.log(`  • Applications Table: ${appRows[0]?.count || 0} record(s)`);
      }
      if (tables.includes('grievance_reports')) {
        const [grvRows]: any = await connection.query('SELECT COUNT(*) AS count FROM grievance_reports;');
        console.log(`  • Grievance Reports Table: ${grvRows[0]?.count || 0} record(s)`);
      }
      if (tables.includes('activities')) {
        const [actRows]: any = await connection.query('SELECT COUNT(*) AS count FROM activities;');
        console.log(`  • Activities Table: ${actRows[0]?.count || 0} record(s)`);
      }
      console.log('');
    }

  } catch (error: any) {
    console.error(`❌ Connection Failure: ${error.message}\n`);

    let hint = 'Check that your MySQL credentials in .env match your cPanel database configuration.';
    if (error.code === 'ECONNREFUSED') {
      hint = `Connection refused at ${host}:${port}. If using cPanel shared hosting, ensure DB_HOST is "localhost" or "127.0.0.1". If connecting remotely, verify "Remote MySQL" in cPanel allows your server IP.`;
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      hint = `Access denied for user "${user}". In cPanel: 1) Verify user password. 2) Ensure user is assigned to database with "ALL PRIVILEGES". 3) Check cPanel prefix e.g., "cpaneluser_dbuser".`;
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      hint = `Database "${database}" does not exist. In cPanel, database names often have prefixes like "cpaneluser_${database}". Verify name in phpMyAdmin.`;
    }

    results.push({
      step: 'MySQL Server Handshake',
      status: 'FAILED',
      message: `${error.code || 'ERROR'}: ${error.message}`,
      details: hint,
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }

  console.log('================================================================');
  console.log(' DIAGNOSTIC SUMMARY REPORT');
  console.log('================================================================');
  results.forEach((r, idx) => {
    const icon = r.status === 'SUCCESS' ? '✅' : r.status === 'WARNING' ? '⚠️' : '❌';
    console.log(`${icon} [${r.status}] Step ${idx + 1}: ${r.step}`);
    console.log(`   ${r.message}`);
    if (r.details) {
      console.log(`   💡 Hint: ${r.details}`);
    }
  });
  console.log('================================================================\n');

  const hasFailure = results.some((r) => r.status === 'FAILED');
  if (hasFailure) {
    process.exitCode = 1;
  }
}

runDatabaseDiagnostics().catch((err) => {
  console.error('Fatal diagnostic error:', err);
  process.exit(1);
});
