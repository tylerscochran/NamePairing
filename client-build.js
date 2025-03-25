// Client-side build script for GitHub Pages
const { build } = require('vite');
const { resolve } = require('path');
const fs = require('fs');

async function buildClient() {
  console.log('Building client-side app for GitHub Pages...');
  
  try {
    // Create a client-only build configuration
    await build({
      root: './client',
      base: './', // Use relative paths 
      build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
          input: {
            main: resolve(__dirname, 'client/index.html')
          }
        }
      }
    });
    
    console.log('Client build completed successfully!');
    
    // Copy index.html to 404.html to support SPA routing
    fs.copyFileSync('./dist/index.html', './dist/404.html');
    console.log('Created 404.html for SPA routing support');
    
    console.log('Build artifacts are available in the dist/ directory');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildClient();