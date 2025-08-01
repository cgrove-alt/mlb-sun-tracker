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

// Other league venues
const nflVenues = [
  'sofi-stadium', 'lambeau-field', 'caesars-superdome'
];

const mlsVenues = [
  'bmo-stadium'
];

// MiLB stadiums - organized by level
const milbVenues = {
  'AAA': [
    'buffalo-bisons', 'charlotte-knights', 'columbus-clippers', 'durham-bulls',
    'gwinnett-stripers', 'indianapolis-indians', 'iowa-cubs', 'jacksonville-jumbo-shrimp',
    'las-vegas-aviators', 'lehigh-valley-ironpigs', 'louisville-bats', 'memphis-redbirds',
    'nashville-sounds', 'norfolk-tides', 'oklahoma-city-baseball-club', 'omaha-storm-chasers',
    'reno-aces', 'rochester-red-wings', 'round-rock-express', 'sacramento-river-cats',
    'saint-paul-saints', 'salt-lake-bees', 'scranton-wb-railriders', 'sugar-land-space-cowboys',
    'syracuse-mets', 'tacoma-rainiers', 'toledo-mud-hens', 'worcester-red-sox',
    'albuquerque-isotopes', 'el-paso-chihuahuas'
  ],
  'AA': [
    'akron-rubberducks', 'altoona-curve', 'amarillo-sod-poodles', 'arkansas-travelers',
    'biloxi-shuckers', 'binghamton-rumble-ponies', 'birmingham-barons', 'bowie-baysox',
    'chattanooga-lookouts', 'corpus-christi-hooks', 'erie-seawolves', 'eugene-emeralds',
    'everett-aquasox', 'frisco-roughriders', 'harrisburg-senators', 'hartford-yard-goats',
    'midland-rockhounds', 'mississippi-braves', 'montgomery-biscuits', 'new-hampshire-fisher-cats',
    'northwest-arkansas-naturals', 'pensacola-blue-wahoos', 'portland-sea-dogs', 'reading-fightin-phils',
    'richmond-flying-squirrels', 'rocket-city-trash-pandas', 'san-antonio-missions', 'somerset-patriots',
    'springfield-cardinals', 'tulsa-drillers', 'wichita-wind-surge'
  ],
  'A+': [
    'asheville-tourists', 'beloit-sky-carp', 'bowling-green-hot-rods', 'brooklyn-cyclones',
    'cedar-rapids-kernels', 'dayton-dragons', 'fort-myers-mighty-mussels', 'great-lakes-loons',
    'greensboro-grasshoppers', 'greenville-drive', 'hickory-crawdads', 'hillsboro-hops',
    'hudson-valley-renegades', 'jersey-shore-blueclaws', 'lake-elsinore-storm', 'lansing-lugnuts',
    'peoria-chiefs', 'rome-emperors', 'south-bend-cubs', 'spokane-indians',
    'vancouver-canadians', 'visalia-rawhide', 'west-michigan-whitecaps', 'wilmington-blue-rocks',
    'winston-salem-dash', 'wisconsin-timber-rattlers'
  ],
  'A': [
    'augusta-greenjackets', 'carolina-mudcats', 'charleston-riverdogs', 'clearwater-threshers',
    'columbia-fireflies', 'daytona-tortugas', 'delmarva-shorebirds', 'down-east-wood-ducks',
    'dunedin-blue-jays', 'fort-wayne-tincaps', 'fredericksburg-nationals', 'fresno-grizzlies',
    'fayetteville-woodpeckers', 'inland-empire-66ers', 'jupiter-hammerheads', 'kannapolis-cannon-ballers',
    'lake-county-captains', 'lynchburg-hillcats', 'modesto-nuts', 'myrtle-beach-pelicans',
    'palm-beach-cardinals', 'quad-cities-river-bandits', 'rancho-cucamonga-quakes', 'salem-red-sox',
    'san-jose-giants', 'stockton-ports', 'st-lucie-mets', 'tampa-tarpons'
  ]
};

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
  
  // MLB Stadium pages
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

  // NFL venue pages
  nflVenues.forEach(venue => {
    xml += '  <url>\n';
    xml += `    <loc>https://theshadium.com/venue/${venue}/</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '    <image:image>\n';
    xml += '      <image:loc>https://theshadium.com/logo512.png</image:loc>\n';
    xml += `      <image:title>${venue.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Shade Guide</image:title>\n`;
    xml += '    </image:image>\n';
    xml += '  </url>\n\n';
  });

  // MLS venue pages
  mlsVenues.forEach(venue => {
    xml += '  <url>\n';
    xml += `    <loc>https://theshadium.com/venue/${venue}/</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '    <image:image>\n';
    xml += '      <image:loc>https://theshadium.com/logo512.png</image:loc>\n';
    xml += `      <image:title>${venue.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Shade Guide</image:title>\n`;
    xml += '    </image:image>\n';
    xml += '  </url>\n\n';
  });

  // MiLB venue pages (all levels)
  Object.values(milbVenues).flat().forEach(venue => {
    xml += '  <url>\n';
    xml += `    <loc>https://theshadium.com/venue/${venue}/</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
    xml += '    <image:image>\n';
    xml += '      <image:loc>https://theshadium.com/logo512.png</image:loc>\n';
    xml += `      <image:title>${venue.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Stadium Shade Guide</image:title>\n`;
    xml += '    </image:image>\n';
    xml += '  </url>\n\n';
  });

  // League pages
  const leagues = ['mlb', 'nfl', 'mls', 'milb'];
  leagues.forEach(league => {
    xml += '  <url>\n';
    xml += `    <loc>https://theshadium.com/league/${league}/</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n\n';
  });

  // MiLB level pages
  const milbLevels = ['aaa', 'aa', 'a-plus', 'a'];
  milbLevels.forEach(level => {
    xml += '  <url>\n';
    xml += `    <loc>https://theshadium.com/league/milb/${level}/</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
    xml += '  </url>\n\n';
  });
  
  xml += '</urlset>';
  
  return xml;
};

// Write sitemap to file
const sitemap = generateSitemap();
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap);

// Calculate total URLs
const totalUrls = 9 + // static pages (home, guides, faq, privacy, terms)
  stadiums.length + // MLB stadiums
  nflVenues.length + // NFL venues
  mlsVenues.length + // MLS venues
  Object.values(milbVenues).flat().length + // All MiLB venues
  4 + // League pages (mlb, nfl, mls, milb)
  4; // MiLB level pages

console.log(`✓ Sitemap generated with ${totalUrls} URLs`);
console.log(`  - ${stadiums.length} MLB stadiums`);
console.log(`  - ${nflVenues.length} NFL venues`);
console.log(`  - ${mlsVenues.length} MLS venues`);
console.log(`  - ${Object.values(milbVenues).flat().length} MiLB stadiums`);
console.log(`  - 9 static pages`);
console.log(`  - 8 league/level pages`);
console.log(`✓ Saved to: ${sitemapPath}`);