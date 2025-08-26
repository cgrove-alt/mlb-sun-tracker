const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../out');

// Fix paths in HTML files
function fixHtmlPaths(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix favicon and manifest paths
  content = content.replace(/href="\/favicon\.ico"/g, 'href="/mlb-sun-tracker/favicon.ico"');
  content = content.replace(/href="\/manifest\.json"/g, 'href="/mlb-sun-tracker/manifest.json"');
  content = content.replace(/href="\/logo192\.png"/g, 'href="/mlb-sun-tracker/logo192.png"');
  content = content.replace(/href="\/logo512\.png"/g, 'href="/mlb-sun-tracker/logo512.png"');
  
  fs.writeFileSync(filePath, content);
  console.log(`✓ Fixed asset paths in ${path.basename(filePath)}`);
}

// Process all HTML files
function processHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processHtmlFiles(fullPath);
    } else if (file.endsWith('.html')) {
      fixHtmlPaths(fullPath);
    }
  });
}

console.log('🔧 Fixing asset paths for GitHub Pages...');
processHtmlFiles(outDir);
console.log('✅ Asset paths fixed!');