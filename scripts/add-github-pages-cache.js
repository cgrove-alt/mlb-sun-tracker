const fs = require('fs');
const path = require('path');

// Add cache control meta tags to HTML files for GitHub Pages
function addCacheHeaders() {
  const outDir = path.join(__dirname, '..', 'out');
  
  // Create .htaccess file for Apache servers (some GitHub Pages deployments use Apache)
  const htaccessContent = `
# Enable browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Images
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  
  # Fonts
  ExpiresByType font/ttf "access plus 1 year"
  ExpiresByType font/otf "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType application/font-woff "access plus 1 year"
  
  # CSS and JavaScript
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType text/javascript "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  
  # HTML
  ExpiresByType text/html "access plus 1 hour"
  
  # Data
  ExpiresByType text/xml "access plus 0 seconds"
  ExpiresByType application/xml "access plus 0 seconds"
  ExpiresByType application/json "access plus 0 seconds"
</IfModule>

# Cache control headers
<IfModule mod_headers.c>
  # Static assets - 1 year
  <FilesMatch "\\.(ico|pdf|flv|jpg|jpeg|png|gif|js|css|swf|woff|woff2|ttf|eot|svg)$">
    Header set Cache-Control "max-age=31536000, public, immutable"
  </FilesMatch>
  
  # HTML - 1 hour
  <FilesMatch "\\.(html)$">
    Header set Cache-Control "max-age=3600, public, must-revalidate"
  </FilesMatch>
  
  # Service worker
  <FilesMatch "sw\\.js$">
    Header set Cache-Control "max-age=0, must-revalidate"
  </FilesMatch>
</IfModule>
`;

  fs.writeFileSync(path.join(outDir, '.htaccess'), htaccessContent);
  console.log('✓ Created .htaccess file for cache control');

  // Also create a _config.yml for Jekyll processing
  const configContent = `# GitHub Pages configuration
plugins:
  - jekyll-redirect-from

# Exclude files from processing
exclude:
  - "*.json"
  - "*.xml"
  - "*.txt"
  - "*.md"

# Force UTF-8 encoding
encoding: utf-8

# Add cache headers via Jekyll
defaults:
  - scope:
      path: "_next/static"
    values:
      cache_control: "public, max-age=31536000, immutable"
  - scope:
      path: "*.js"
    values:
      cache_control: "public, max-age=31536000, immutable"
  - scope:
      path: "*.css"
    values:
      cache_control: "public, max-age=31536000, immutable"
`;

  fs.writeFileSync(path.join(outDir, '_config.yml'), configContent);
  console.log('✓ Created _config.yml for GitHub Pages configuration');
  
  // Create .nojekyll file to prevent Jekyll processing of _next directory
  fs.writeFileSync(path.join(outDir, '.nojekyll'), '');
  console.log('✓ Created .nojekyll file for GitHub Pages');
}

addCacheHeaders();