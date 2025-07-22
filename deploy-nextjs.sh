#!/bin/bash

echo "🏗️ Building Next.js application..."
npm run build

echo "📤 Exporting static files..."
npm run export

echo "🚀 Ready for deployment!"
echo "Upload the 'out' directory to your web server"
