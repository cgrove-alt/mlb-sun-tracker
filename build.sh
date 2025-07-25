#!/bin/bash
# Build script for Render deployment

echo "=== Render Build Script ==="
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Ensure we're in the project root
if [ -f "package.json" ]; then
    echo "Found package.json in current directory"
    npm install
    npm run build
else
    echo "ERROR: package.json not found in current directory"
    echo "Looking for package.json files:"
    find . -name "package.json" -type f
    exit 1
fi