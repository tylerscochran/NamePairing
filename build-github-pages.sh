#!/bin/bash

# Script to build the client-side app for GitHub Pages

echo "Building client-side application for GitHub Pages..."

# Ensure the directory exists
mkdir -p .github/workflows

# Run the client build script
node client-build.js

echo "Build complete! Files are in the 'dist' directory."
echo "To test locally, you can run: npx serve dist"