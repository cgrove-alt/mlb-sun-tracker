/**
 * JSON-LD schema validator (audit Phase 4, step 3).
 *
 * Extracts every <script type="application/ld+json"> block from built HTML and
 * checks that it parses and carries the fields Google needs for each type.
 * This is a structural lint (not a substitute for the Google Rich Results Test,
 * which remains a manual step). Run after `npm run build`:
 *   node scripts/validateSchema.js
 */
const fs = require('fs');
const path = require('path');

const APP = path.join(__dirname, '../.next/server/app');
const TARGETS = [
  { label: 'Homepage', file: path.join(APP, 'index.html') },
  { label: 'MLB venue (yankees)', file: path.join(APP, 'stadium/yankees.html') },
  { label: 'MiLB venue (durham-bulls)', file: path.join(APP, 'stadium/durham-bulls.html') },
  { label: 'NFL venue (sofi-stadium-rams)', file: path.join(APP, 'stadium/sofi-stadium-rams.html') },
  { label: 'Blog post', file: path.join(APP, 'blog/complete-guide-shaded-seats-yankee-stadium.html') },
];

const BLOCK = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;

// Required top-level fields per @type.
const REQUIRED = {
  Article: ['headline', 'datePublished', 'dateModified', 'author', 'publisher'],
  StadiumOrArena: ['name', 'address'],
  FAQPage: ['mainEntity'],
  BreadcrumbList: ['itemListElement'],
  Organization: ['name', 'url'],
  WebSite: ['url', 'potentialAction'],
  WebApplication: ['name'],
};

let totalIssues = 0;

for (const { label, file } of TARGETS) {
  console.log(`\n=== ${label} ===`);
  if (!fs.existsSync(file)) {
    console.log(`  ✗ built file missing: ${path.relative(process.cwd(), file)}`);
    totalIssues++;
    continue;
  }
  const html = fs.readFileSync(file, 'utf-8');
  const blocks = [...html.matchAll(BLOCK)].map((m) => m[1]);
  if (!blocks.length) {
    console.log('  ✗ no JSON-LD <script> blocks found');
    totalIssues++;
    continue;
  }
  for (const raw of blocks) {
    let obj;
    try {
      obj = JSON.parse(raw.trim());
    } catch (err) {
      console.log(`  ✗ invalid JSON: ${err.message}`);
      totalIssues++;
      continue;
    }
    const nodes = Array.isArray(obj) ? obj : [obj];
    for (const node of nodes) {
      const type = node['@type'] || '(no @type)';
      const issues = [];
      if (!node['@context']) issues.push('missing @context');
      const req = REQUIRED[type] || [];
      for (const f of req) if (node[f] == null) issues.push(`missing ${f}`);
      // Specific correctness checks
      if (type === 'Article' && node.datePublished === '2024-01-01') {
        issues.push('datePublished is the old hardcoded 2024-01-01');
      }
      if (type === 'WebSite' && node.potentialAction && node.potentialAction['@type'] !== 'SearchAction') {
        issues.push('potentialAction is not a SearchAction');
      }
      if (issues.length) {
        totalIssues += issues.length;
        console.log(`  ✗ ${type}: ${issues.join('; ')}`);
      } else {
        console.log(`  ✓ ${type}`);
      }
    }
  }
}

console.log(`\n${totalIssues === 0 ? '✓ All JSON-LD valid with required fields.' : `✗ ${totalIssues} issue(s) found.`}`);
process.exit(totalIssues === 0 ? 0 : 1);
