const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '../docs');

// Fix paths in HTML files for docs folder deployment
function fixHtmlPaths(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove /mlb-sun-tracker prefix since we're serving from root when using /docs folder
  content = content.replace(/\/mlb-sun-tracker\/_next/g, '/_next');
  content = content.replace(/\/mlb-sun-tracker\/favicon/g, '/favicon');
  content = content.replace(/\/mlb-sun-tracker\/manifest/g, '/manifest');
  content = content.replace(/\/mlb-sun-tracker\/logo/g, '/logo');
  content = content.replace(/\/mlb-sun-tracker\/locales/g, '/locales');
  content = content.replace(/\/mlb-sun-tracker\/sw/g, '/sw');
  content = content.replace(/href="\/mlb-sun-tracker\//g, 'href="/');
  
  fs.writeFileSync(filePath, content);
  console.log(`✓ Fixed paths in ${path.basename(filePath)}`);
}

// Fix paths in JS files
function fixJsPaths(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix basePath references
  content = content.replace(/\/mlb-sun-tracker/g, '');
  
  fs.writeFileSync(filePath, content);
  console.log(`✓ Fixed paths in ${path.basename(filePath)}`);
}

// Process all HTML files
function processFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.')) {
      processFiles(fullPath);
    } else if (file.endsWith('.html')) {
      fixHtmlPaths(fullPath);
    }
  });
}

console.log('🔧 Fixing paths for /docs folder deployment...');
processFiles(docsDir);

// Also fix the service worker
const swPath = path.join(docsDir, 'sw.js');
if (fs.existsSync(swPath)) {
  let swContent = fs.readFileSync(swPath, 'utf8');
  swContent = swContent.replace(/\/mlb-sun-tracker/g, '');
  fs.writeFileSync(swPath, swContent);
  console.log('✓ Fixed service worker paths');
}

// Fix the manifest.json
const manifestPath = path.join(docsDir, 'manifest.json');
if (fs.existsSync(manifestPath)) {
  let manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.start_url = '/';
  manifest.scope = '/';
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('✓ Fixed manifest.json');
}

console.log('✅ All paths fixed for /docs deployment!');