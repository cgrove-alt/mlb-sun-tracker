const fs = require('fs');
const path = require('path');

const GA_MEASUREMENT_ID = 'G-JXGEKF957C';

const GA_SCRIPT = `
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_MEASUREMENT_ID}');
</script>
`;

function addGoogleAnalytics(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    const filePath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      addGoogleAnalytics(filePath);
    } else if (file.name.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Check if GA is already added
      if (!content.includes('gtag.js')) {
        // Insert GA script before closing </head>
        content = content.replace('</head>', GA_SCRIPT + '</head>');
        fs.writeFileSync(filePath, content);
        console.log(`✓ Added GA to: ${filePath}`);
      }
    }
  });
}

// Add Google Analytics to all HTML files in the out directory
const outDir = path.join(__dirname, '../out');
console.log('Adding Google Analytics to all HTML files...');
addGoogleAnalytics(outDir);
console.log('✨ Google Analytics added successfully!');