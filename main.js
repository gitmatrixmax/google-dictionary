#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// Set up environment variables from .env file if it exists
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

// For pkg executable, we need to set the static files path
if (process.pkg) {
  // When running as executable, static files are in the same directory
  process.env.STATIC_PATH = path.dirname(process.execPath);
}

// Start the application
require('./server/index.js');