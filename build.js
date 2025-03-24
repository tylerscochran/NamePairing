#!/usr/bin/env node

/**
 * Enhanced build script for Heroku and other cloud hosting platforms
 * This script should be run manually before deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure we're in production mode
process.env.NODE_ENV = 'production';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

console.log(`${colors.blue}Starting enhanced build process for deployment...${colors.reset}`);

try {
  // 1. Clean previous build artifacts
  console.log(`${colors.yellow}Cleaning previous build...${colors.reset}`);
  if (fs.existsSync('./dist')) {
    fs.rmSync('./dist', { recursive: true, force: true });
  }

  // 2. Build the client with Vite
  console.log(`${colors.yellow}Building client with Vite...${colors.reset}`);
  execSync('vite build', { stdio: 'inherit' });

  // 3. Build the server with esbuild (explicit file list)
  console.log(`${colors.yellow}Building server with esbuild...${colors.reset}`);
  execSync(
    'esbuild server/index.ts server/vite.ts server/routes.ts server/storage.ts shared/schema.ts --platform=node --packages=external --bundle --format=esm --outdir=dist',
    { stdio: 'inherit' }
  );

  // 4. Copy necessary files for production
  console.log(`${colors.yellow}Copying build artifacts...${colors.reset}`);
  
  // Make sure the public directory exists in dist
  if (!fs.existsSync('./dist/public')) {
    fs.mkdirSync('./dist/public', { recursive: true });
  }

  // Copy the client build to dist/public
  fs.cpSync('./dist/client', './dist/public', { recursive: true });

  console.log(`${colors.green}Build completed successfully!${colors.reset}`);
  console.log(`${colors.blue}You can now deploy the application. Run 'node dist/index.js' to start.${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Build failed:${colors.reset}`, error);
  process.exit(1);
}