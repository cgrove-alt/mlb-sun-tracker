const fs = require('fs');
const path = require('path');

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// MLB stadiums data
const stadiums = [
  'angels', 'astros', 'athletics', 'bluejays', 'orioles', 'redsox', 
  'yankees', 'rays', 'whitesox', 'guardians', 'tigers', 'royals',
  'twins', 'rangers', 'mariners', 'diamondbacks', 'rockies', 'dodgers',
  'padres', 'giants', 'braves', 'marlins', 'mets', 'phillies',
  'nationals', 'brewers', 'cubs', 'reds', 'pirates', 'cardinals'
];

// Generate sitemap XML
const generateSitemap = () => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
  xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
  xml += '                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';
  
  // Homepage
  xml += '  <url>\n';
  xml += '    <loc>https://theshadium.com/</loc>\n';
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += '    <changefreq>daily</changefreq>\n';
  xml += '    <priority>1.0</priority>\n';
  xml += '  </url>\n\n';
  
  // Guide pages
  const guidePages = [
    { path: '/guide/', priority: '0.9' },
    { path: '/guide/how-to-find-shaded-seats/', priority: '0.8' },
    { path: '/guide/best-shaded-seats-mlb/', priority: '0.8' },
    { path: '/guide/avoid-sun-baseball-games/', priority: '0.8' },
    { path: '/seats-shade-finder/', priority: '0.9' }, // New SEO page
  ];
  
  guidePages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>https://theshadium.com${page.path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n\n';
  });
  
  // FAQ and other pages
  const otherPages = [
    { path: '/faq/', priority: '0.7' },
    { path: '/privacy/', priority: '0.3' },
    { path: '/terms/', priority: '0.3' },
  ];
  
  otherPages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>https://theshadium.com${page.path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n\n';
  });
  
  // Stadium pages
  stadiums.forEach(stadium => {
    xml += '  <url>\n';
    xml += `    <loc>https://theshadium.com/stadium/${stadium}/</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '    <image:image>\n';
    xml += '      <image:loc>https://theshadium.com/logo512.png</image:loc>\n';
    xml += `      <image:title>${stadium.charAt(0).toUpperCase() + stadium.slice(1)} Stadium Shade Guide</image:title>\n`;
    xml += '    </image:image>\n';
    xml += '  </url>\n\n';
  });
  
  xml += '</urlset>';
  
  return xml;
};

// Write sitemap to file
const sitemap = generateSitemap();
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap);

console.log(`✓ Sitemap generated with ${stadiums.length + 7} URLs`);
console.log(`✓ Saved to: ${sitemapPath}`);