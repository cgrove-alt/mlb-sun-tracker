#!/bin/bash

# MLB Sun Tracker - Migration to Next.js with PWA
echo "🚀 Starting migration from Create React App to Next.js..."

# Backup current package.json
cp package.json package-cra-backup.json
echo "✅ Backed up current package.json"

# Install Next.js dependencies
echo "📦 Installing Next.js and PWA dependencies..."
npm install next@latest react@^18.2.0 react-dom@^18.2.0 next-pwa@^5.6.0

# Install dev dependencies
npm install --save-dev @types/node@^20.0.0 @types/react@^18.2.0 @types/react-dom@^18.2.0 typescript@^5.0.0 eslint@8.48.0 eslint-config-next@14.0.0

# Update package.json with Next.js scripts
echo "📝 Updating package.json..."
cp package-nextjs.json package.json

# Update TypeScript configuration
echo "⚙️ Updating TypeScript configuration..."
cp tsconfig-nextjs.json tsconfig.json

# Create next-env.d.ts
echo "/// <reference types=\"next\" />" > next-env.d.ts
echo "/// <reference types=\"next/image-types/global\" />" >> next-env.d.ts

# Import WebGL CSS into globals.css
echo "" >> app/globals.css
echo "/* WebGL Stadium Visualization styles */" >> app/globals.css
cat components/WebGLStadiumVisualization.css >> app/globals.css

# Create .gitignore entries for Next.js
echo "" >> .gitignore
echo "# Next.js" >> .gitignore
echo ".next/" >> .gitignore
echo "out/" >> .gitignore
echo "next-env.d.ts" >> .gitignore

# Create deployment script
cat > deploy-nextjs.sh << 'EOF'
#!/bin/bash

echo "🏗️ Building Next.js application..."
npm run build

echo "📤 Exporting static files..."
npm run export

echo "🚀 Ready for deployment!"
echo "Upload the 'out' directory to your web server"
EOF

chmod +x deploy-nextjs.sh

echo ""
echo "✅ Migration to Next.js complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Test the application at http://localhost:3000"
echo "3. Run 'npm run build' to create production build"
echo "4. Run './deploy-nextjs.sh' to build and export for deployment"
echo ""
echo "🌟 New features added:"
echo "- PWA support with offline caching"
echo "- WebGL 3D stadium visualization"
echo "- Enhanced performance with Next.js"
echo "- Better SEO and metadata"
echo "- Service worker for offline functionality"
echo ""
echo "🔧 Configuration files:"
echo "- next.config.js - Next.js configuration with PWA"
echo "- app/layout.tsx - Root layout with metadata"
echo "- app/page.tsx - Main page component"
echo "- components/WebGLStadiumVisualization.tsx - 3D stadium view"
echo "- components/PWAInstallPrompt.tsx - PWA installation prompt"
echo ""