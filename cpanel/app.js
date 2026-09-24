/**
 * RAWF cPanel Node.js Application Entry Point
 * Compatible with cPanel "Setup Node.js App" / Phusion Passenger
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// CORS for cross-origin or proxy access
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Load mock data or persistent JSON storage in cPanel environment
const DATA_FILE = path.join(__dirname, 'rawf-data.json');
let database = {
  officers: [],
  grievances: {},
  applications: [],
  donations: [],
  blacklisted: [],
  settings: {
    trustRegistration: 'IFA No. 760 under Indian Trusts Act 1882',
    darpanId: 'DL/2021/RAWF',
    helpline: '1800-RAW-CELL'
  }
};

if (fs.existsSync(DATA_FILE)) {
  try {
    database = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    console.error('Error reading cPanel data file:', e);
  }
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(database, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving cPanel data file:', e);
  }
}

// Serve Frontend Static Build
const publicDir = path.join(__dirname, 'public_html');
const distDir = path.join(__dirname, 'dist');
const staticDir = fs.existsSync(publicDir) ? publicDir : distDir;

if (fs.existsSync(staticDir)) {
  app.use(express.static(staticDir));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    cpanel: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Passenger & port listener
if (typeof(PhusionPassenger) !== 'undefined') {
  app.listen('passenger');
} else {
  app.listen(PORT, () => {
    console.log(`[RAWF cPanel Server] Running on port ${PORT}`);
  });
}
