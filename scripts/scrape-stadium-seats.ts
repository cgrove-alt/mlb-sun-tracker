/**
 * Stadium Seat Scraper using Playwright
 *
 * Extracts accurate seat data from interactive seating charts.
 * Uses browser automation to navigate JavaScript-rendered content.
 */

import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface RowData {
  label: string;
  seatCount: number;
}

interface SectionData {
  sectionId: string;
  sectionName: string;
  rows: RowData[];
  totalRows: number;
  totalSeats: number;
}

interface StadiumData {
  stadiumId: string;
  stadiumName: string;
  scrapedAt: string;
  source: string;
  sections: SectionData[];
}

// Stadium URL mappings for SeatGeek
const STADIUM_URLS: Record<string, string> = {
  rays: 'tropicana-field',
  royals: 'kauffman-stadium',
  pirates: 'pnc-park',
  twins: 'target-field',
  tigers: 'comerica-park',
  guardians: 'progressive-field',
  rangers: 'globe-life-field',
  brewers: 'american-family-field',
  angels: 'angel-stadium',
  astros: 'minute-maid-park',
  athletics: 'sutter-health-park',
  bluejays: 'rogers-centre',
  braves: 'truist-park',
  cardinals: 'busch-stadium',
  cubs: 'wrigley-field',
  diamondbacks: 'chase-field',
  dodgers: 'dodger-stadium',
  giants: 'oracle-park',
  mariners: 't-mobile-park',
  marlins: 'loandepot-park',
  mets: 'citi-field',
  nationals: 'nationals-park',
  orioles: 'oriole-park-at-camden-yards',
  padres: 'petco-park',
  phillies: 'citizens-bank-park',
  redsox: 'fenway-park',
  reds: 'great-american-ball-park',
  rockies: 'coors-field',
  whitesox: 'guaranteed-rate-field',
  yankees: 'yankee-stadium',
};

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// RateYourSeats URL mappings
const RATEYOURSEATS_URLS: Record<string, string> = {
  rays: 'tropicana-field',
  royals: 'kauffman-stadium',
  pirates: 'pnc-park',
  twins: 'target-field',
  tigers: 'comerica-park',
  guardians: 'progressive-field',
  rangers: 'globe-life-field',
  brewers: 'american-family-field',
  angels: 'angel-stadium-of-anaheim',
  astros: 'minute-maid-park',
  athletics: 'oakland-coliseum', // Note: Sutter Health Park not yet on RateYourSeats
  bluejays: 'rogers-centre',
  braves: 'truist-park',
  cardinals: 'busch-stadium',
  cubs: 'wrigley-field',
  diamondbacks: 'chase-field',
  dodgers: 'dodger-stadium',
  giants: 'oracle-park',
  mariners: 't-mobile-park',
  marlins: 'loandepot-park',
  mets: 'citi-field',
  nationals: 'nationals-park',
  orioles: 'oriole-park-at-camden-yards',
  padres: 'petco-park',
  phillies: 'citizens-bank-park',
  redsox: 'fenway-park',
  reds: 'great-american-ball-park',
  rockies: 'coors-field',
  whitesox: 'guaranteed-rate-field',
  yankees: 'yankee-stadium',
};

async function scrapeStadium(browser: Browser, stadiumId: string): Promise<StadiumData | null> {
  const venueSlug = RATEYOURSEATS_URLS[stadiumId];
  if (!venueSlug) {
    console.error(`Unknown stadium: ${stadiumId}`);
    return null;
  }

  // Try RateYourSeats section listing page
  const url = `https://www.rateyourseats.com/${venueSlug}/seating/sections`;
  console.log(`\nScraping ${stadiumId}: ${url}`);

  const page = await browser.newPage();

  try {
    // Set realistic user agent
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    // Navigate to the page
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await delay(3000); // Wait for JS to render

    // Take a screenshot for debugging
    const screenshotDir = path.join(__dirname, '../scraped-data/screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    await page.screenshot({ path: path.join(screenshotDir, `${stadiumId}.png`), fullPage: true });

    // Save page HTML for debugging
    const pageContent = await page.content();
    const htmlDir = path.join(__dirname, '../scraped-data/html');
    if (!fs.existsSync(htmlDir)) {
      fs.mkdirSync(htmlDir, { recursive: true });
    }
    fs.writeFileSync(path.join(htmlDir, `${stadiumId}.html`), pageContent);
    console.log(`Page title: ${await page.title()}`);

    // RateYourSeats has a section list - look for section links
    const sectionLinks = await page.$$('a[href*="/seating/"][href*="section"]');
    console.log(`Found ${sectionLinks.length} section links`);

    if (sectionLinks.length === 0) {
      // Try alternative: look for any links containing section info
      const allLinks = await page.$$('a');
      let sectionCount = 0;
      for (const link of allLinks) {
        const href = await link.getAttribute('href');
        if (href && href.includes('section')) {
          sectionCount++;
        }
      }
      console.log(`Found ${sectionCount} links containing 'section'`);

      // Try to extract any useful info from the page
      const allText = await page.evaluate(() => document.body.innerText);
      console.log(`Page text preview: ${allText.substring(0, 1000)}`);

      if (sectionCount === 0) {
        await page.close();
        return null;
      }
    }

    // Extract all section URLs from the page
    // RateYourSeats format: /tropicana-field/seating/sections/101
    const sectionUrls = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/seating/sections/"]'));
      const seen = new Set<string>();
      return links
        .map(link => ({
          href: (link as HTMLAnchorElement).href,
          text: link.textContent?.trim() || ''
        }))
        .filter(l => {
          // Only include section detail pages (have number at end)
          const isDetailPage = /\/sections\/\d+/.test(l.href);
          // Dedupe
          if (isDetailPage && !seen.has(l.href)) {
            seen.add(l.href);
            return true;
          }
          return false;
        });
    });

    console.log(`Extracted ${sectionUrls.length} unique section URLs`);
    await page.close();

    const sectionDataList: SectionData[] = [];

    // Process each section (limit for testing)
    const maxSections = process.env.SCRAPE_ALL ? sectionUrls.length : 10;
    for (let i = 0; i < Math.min(sectionUrls.length, maxSections); i++) {
      const sectionUrl = sectionUrls[i];

      try {
        // Extract section ID from URL (e.g., /tropicana-field/seating/sections/107 -> 107)
        const sectionIdMatch = sectionUrl.href.match(/\/sections\/(\d+[A-Z]*)/i);
        const sectionId = sectionIdMatch ? sectionIdMatch[1] : sectionUrl.text;

        console.log(`  [${i + 1}/${Math.min(sectionUrls.length, maxSections)}] Processing section ${sectionId}: ${sectionUrl.href}`);

        // Navigate to section detail page
        const sectionPage = await browser.newPage();
        await sectionPage.goto(sectionUrl.href, { waitUntil: 'networkidle', timeout: 30000 });
        await delay(1500);

        // Extract section details from the page
        const sectionData = await sectionPage.evaluate(() => {
          const bodyText = document.body.innerText;

          // Find section name (usually in h1 or title)
          const h1 = document.querySelector('h1')?.textContent?.trim() || '';
          const title = document.title || '';

          // Look for row information - RateYourSeats shows patterns like:
          // "Rows L-Z, AA-JJ, PP-XX" or "Row A through Z"
          // We want to find all row ranges

          const rowRanges: string[] = [];
          // Match patterns like "Rows A-Z" or "rows AA-JJ" (case insensitive)
          // Also match standalone ranges like "L-Z, AA-JJ"
          const rowPatterns = [
            /rows?\s+([A-Z])\s*[-–]\s*([A-Z])(?:\s*,\s*([A-Z]{2})\s*[-–]\s*([A-Z]{2}))?/gi,
            /rows?\s+([A-Z]{2})\s*[-–]\s*([A-Z]{2})/gi,
            /rows?\s+(\d+)\s*[-–]\s*(\d+)/gi,
            // Standalone single-letter ranges (must be surrounded by non-letters)
            /(?:^|[^A-Za-z])([A-Z])\s*[-–]\s*([A-Z])(?:[^A-Za-z]|$)/g,
            // Standalone double-letter ranges
            /(?:^|[^A-Za-z])([A-Z]{2})\s*[-–]\s*([A-Z]{2})(?:[^A-Za-z]|$)/g,
          ];

          let firstRow = '';
          let lastRow = '';
          let allRowLabels: string[] = [];

          // First try to find row ranges (only from the first 500 chars to avoid noise)
          const searchText = bodyText.substring(0, 500);
          for (const pattern of rowPatterns) {
            let match;
            while ((match = pattern.exec(searchText)) !== null) {
              // Validate it looks like a real row range (both parts uppercase)
              if (match[1] && match[2] &&
                  match[1] === match[1].toUpperCase() &&
                  match[2] === match[2].toUpperCase()) {
                if (!firstRow) firstRow = match[1];
                lastRow = match[2];
                rowRanges.push(`${match[1]}-${match[2]}`);
              }
              if (match[3] && match[4]) {
                lastRow = match[4];
                rowRanges.push(`${match[3]}-${match[4]}`);
              }
            }
          }

          // Count rows from ranges
          let totalRowCount = 0;
          for (const range of rowRanges) {
            const parts = range.split('-');
            if (parts.length === 2) {
              const start = parts[0].toUpperCase();
              const end = parts[1].toUpperCase();

              // Single letters (A-Z)
              if (start.length === 1 && end.length === 1 &&
                  /^[A-Z]$/.test(start) && /^[A-Z]$/.test(end)) {
                const count = end.charCodeAt(0) - start.charCodeAt(0) + 1;
                totalRowCount += count;
                for (let c = start.charCodeAt(0); c <= end.charCodeAt(0); c++) {
                  allRowLabels.push(String.fromCharCode(c));
                }
              }
              // Double letters like AA, BB, CC (same letter twice)
              else if (start.length === 2 && end.length === 2 &&
                       start[0] === start[1] && end[0] === end[1] &&
                       /^[A-Z]$/.test(start[0]) && /^[A-Z]$/.test(end[0])) {
                // AA, BB, CC... = A=0, B=1, C=2... so AA-JJ = 10 rows
                const startIdx = start.charCodeAt(0) - 65; // A=0
                const endIdx = end.charCodeAt(0) - 65;
                const count = endIdx - startIdx + 1;
                totalRowCount += count;
                for (let i = startIdx; i <= endIdx; i++) {
                  const letter = String.fromCharCode(65 + i);
                  allRowLabels.push(letter + letter);
                }
              }
              // Numeric rows
              else if (/^\d+$/.test(start) && /^\d+$/.test(end)) {
                const count = parseInt(end) - parseInt(start) + 1;
                totalRowCount += count;
                for (let n = parseInt(start); n <= parseInt(end); n++) {
                  allRowLabels.push(n.toString());
                }
              }
            }
          }

          // Look for explicit "X rows" pattern as fallback
          if (totalRowCount === 0) {
            const rowCountPattern = /(\d+)\s*rows?\b/i;
            const rowCountMatch = rowCountPattern.exec(bodyText);
            if (rowCountMatch) {
              totalRowCount = parseInt(rowCountMatch[1]);
            }
          }

          return {
            sectionName: h1 || title,
            firstRow,
            lastRow,
            rowRanges,
            totalRows: totalRowCount,
            rowLabels: allRowLabels,
            rawText: bodyText.substring(0, 3000)
          };
        });

        // Use the row count we calculated, or estimated seats per row based on section level
        const totalRows = sectionData.totalRows;
        // RateYourSeats doesn't show exact seat counts, but we can estimate based on section type
        // Field level: ~20 seats/row, Lower: ~25 seats/row, Upper: ~30 seats/row
        const estimatedSeatsPerRow = 22; // Average estimate

        console.log(`    Name: ${sectionData.sectionName.substring(0, 50)}`);
        console.log(`    Rows: ${sectionData.rowRanges.join(', ') || 'unknown'} (${totalRows} rows)`);
        console.log(`    Row labels: ${sectionData.rowLabels.slice(0, 5).join(', ')}${sectionData.rowLabels.length > 5 ? '...' : ''}`);

        // Debug: show first 200 chars of raw text for first 3 sections
        if (i < 3) {
          console.log(`    DEBUG rawText: ${sectionData.rawText.substring(0, 300).replace(/\n/g, ' | ')}`);
        }

        sectionDataList.push({
          sectionId,
          sectionName: sectionData.sectionName,
          rows: [], // We'll fill this with estimated data
          totalRows,
          totalSeats: totalRows * estimatedSeatsPerRow, // Estimated
          // Additional data for processing
          firstRow: sectionData.firstRow,
          lastRow: sectionData.lastRow,
          rowRanges: sectionData.rowRanges,
          rowLabels: sectionData.rowLabels,
          seatsPerRow: estimatedSeatsPerRow,
        } as SectionData & { firstRow: string; lastRow: string; rowRanges: string[]; rowLabels: string[]; seatsPerRow: number });

        await sectionPage.close();

        // Rate limiting
        await delay(1000);

      } catch (err) {
        console.log(`    Error processing section: ${err}`);
      }
    }

    return {
      stadiumId,
      stadiumName: venueSlug,
      scrapedAt: new Date().toISOString(),
      source: 'rateyourseats',
      sections: sectionDataList
    };

  } catch (error) {
    console.error(`Error scraping ${stadiumId}:`, error);
    await page.close();
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const stadiumIds = args.length > 0 ? args : ['rays']; // Default to rays for testing

  console.log('Starting stadium seat scraper...');
  console.log(`Stadiums to scrape: ${stadiumIds.join(', ')}`);

  // Launch browser
  const browser = await chromium.launch({
    headless: true, // Set to false to watch the browser
  });

  const results: StadiumData[] = [];

  for (const stadiumId of stadiumIds) {
    const data = await scrapeStadium(browser, stadiumId);
    if (data) {
      results.push(data);
    }
    // Delay between stadiums to be respectful
    await delay(2000);
  }

  await browser.close();

  // Save results
  const outputDir = path.join(__dirname, '../scraped-data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputFile = path.join(outputDir, 'stadium-seats.json');
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to: ${outputFile}`);

  // Summary
  console.log('\n=== Summary ===');
  for (const result of results) {
    console.log(`${result.stadiumId}: ${result.sections.length} sections scraped`);
  }
}

main().catch(console.error);
