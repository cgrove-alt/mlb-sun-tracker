const fs = require('fs');
const path = require('path');

// Script to add cache control meta tags to HTML files for GitHub Pages
const addCacheHeaders = () => {
  const outDir = path.join(__dirname, '..', 'out');
  
  // Cache control script to inject
  const cacheScript = `
<script>
(function() {
  // Check if this is a static asset
  const pathname = window.location.pathname;
  const isStaticAsset = pathname.includes('/_next/static/') || 
                       pathname.match(/\.(js|css|woff2|jpg|jpeg|png|gif|svg|ico|webp)$/);
  
  if (isStaticAsset && 'serviceWorker' in navigator) {
    // Force service worker to cache with long TTL
    navigator.serviceWorker.ready.then(function(registration) {
      if (registration.active) {
        registration.active.postMessage({
          type: 'CACHE_STATIC_ASSET',
          url: pathname,
          ttl: 31536000 // 1 year
        });
      }
    });
  }
})();
</script>
`;

  // Add to all HTML files
  const processHtmlFile = (filePath) => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Add cache control meta tags
      const metaTags = `
    <meta http-equiv="Cache-Control" content="public, max-age=31536000, immutable" />
    <meta http-equiv="Pragma" content="cache" />
    <meta http-equiv="Expires" content="${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()}" />`;
      
      // Add before closing head tag
      if (content.includes('</head>')) {
        content = content.replace('</head>', metaTags + '\n    ' + cacheScript + '\n  </head>');
        fs.writeFileSync(filePath, content);
        console.log(`✓ Updated: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  };

  // Process all HTML files
  const walkDir = (dir) => {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.html')) {
        processHtmlFile(filePath);
      }
    });
  };

  if (fs.existsSync(outDir)) {
    walkDir(outDir);
    console.log('✨ Cache headers added to all HTML files');
  } else {
    console.error('❌ Output directory not found. Run build first.');
  }
};

// Run the script
addCacheHeaders();