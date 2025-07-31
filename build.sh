#!/bin/bash
# Build script for Render deployment

echo "=== Render Build Script ==="
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Check if we're in a subdirectory and need to go up
if [ ! -f "package.json" ] && [ -f "../package.json" ]; then
    echo "Found package.json in parent directory, changing to it"
    cd ..
elif [ ! -f "package.json" ] && [ -f "../../package.json" ]; then
    echo "Found package.json in grandparent directory, changing to it"
    cd ../..
fi

# Ensure we're in the project root
if [ -f "package.json" ]; then
    echo "Found package.json in: $(pwd)"
    echo "Installing dependencies..."
    npm install
    echo "Building application..."
    npm run build
else
    echo "ERROR: package.json not found"
    echo "Current directory: $(pwd)"
    echo "Looking for package.json files:"
    find / -name "package.json" -type f 2>/dev/null | grep -E "(render|project)" | head -20
    exit 1
fi