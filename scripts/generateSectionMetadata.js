#!/usr/bin/env node

/**
 * Generate lightweight section metadata files
 * Creates small summary files with section info without individual seat data
 * This dramatically reduces the data loaded on stadium pages
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Determine section level based on section ID patterns
 */
function determineSectionLevel(sectionId) {
  const id = sectionId.toString();

  // Common MLB stadium patterns
  if (id.length === 1) return 'field';
  if (id.startsWith('1') || (parseInt(id) >= 1 && parseInt(id) <= 150)) return 'field';
  if (id.startsWith('2') || (parseInt(id) >= 200 && parseInt(id) <= 250)) return 'loge';
  if (id.startsWith('3') || (parseInt(id) >= 300 && parseInt(id) <= 350)) return 'upper';
  if (id.startsWith('4') || (parseInt(id) >= 400 && parseInt(id) <= 450)) return 'upper';
  if (id.startsWith('5')) return 'upper';

  return 'field'; // default
}

/**
 * Calculate average sun exposure for a section
 */
function calculateAverageSunExposure(sectionData) {
  if (!sectionData.rows || sectionData.rows.length === 0) {
    return null;
  }

  let totalExposure = 0;
  let seatCount = 0;

  sectionData.rows.forEach(row => {
    if (row.seats) {
      row.seats.forEach(seat => {
        // Estimate based on covered status and position
        if (seat.covered) {
          totalExposure += 10; // Covered seats get minimal sun
        } else {
          // Estimate based on elevation and position
          const baseExposure = 50; // Base exposure
          const elevationFactor = (seat.elevation || 0) / 100; // Higher seats may get more sun
          totalExposure += baseExposure + (elevationFactor * 20);
        }
        seatCount++;
      });
    }
  });

  return seatCount > 0 ? Math.round(totalExposure / seatCount) : null;
}

/**
 * Extract price level from section data
 */
function extractPriceLevel(sectionId) {
  const id = parseInt(sectionId);

  if (id >= 1 && id <= 50) return 'premium';
  if (id >= 100 && id <= 150) return 'field';
  if (id >= 200 && id <= 250) return 'loge';
  if (id >= 300 && id <= 350) return 'upper';
  if (id >= 400) return 'upper';

  return 'standard';
}

/**
 * Process a single stadium's seat data
 */
async function processStadium(stadiumDir) {
  const stadiumName = path.basename(stadiumDir);
  log(`\nProcessing ${stadiumName}...`, colors.cyan);

  const sections = {};
  let totalSeats = 0;
  let processedSections = 0;

  try {
    // Read all section JSON files
    const files = await readdir(stadiumDir);
    const jsonFiles = files.filter(f => f.endsWith('.json') && !f.endsWith('.gz'));

    for (const file of jsonFiles) {
      const sectionId = file.replace('.json', '');
      const filePath = path.join(stadiumDir, file);

      try {
        const content = await readFile(filePath, 'utf8');
        const sectionData = JSON.parse(content);

        // Extract lightweight metadata
        const metadata = {
          sectionId: sectionId,
          name: sectionData.sectionName || `Section ${sectionId}`,
          seatCount: sectionData.totalSeats || 0,
          rowCount: sectionData.totalRows || sectionData.rows?.length || 0,
          level: determineSectionLevel(sectionId),
          priceLevel: extractPriceLevel(sectionId),
          covered: false, // Will be determined from seat data
          avgSunExposure: null,
          rows: []
        };

        // Check if any seats are covered
        if (sectionData.rows && sectionData.rows.length > 0) {
          let coveredSeats = 0;
          let totalSectionSeats = 0;

          sectionData.rows.forEach(row => {
            metadata.rows.push({
              rowNumber: row.rowNumber,
              seatCount: row.seatCount || row.seats?.length || 0
            });

            if (row.seats) {
              row.seats.forEach(seat => {
                if (seat.covered) coveredSeats++;
                totalSectionSeats++;
              });
            }
          });

          metadata.covered = coveredSeats > totalSectionSeats / 2; // Section is "covered" if >50% seats are
          metadata.avgSunExposure = calculateAverageSunExposure(sectionData);
        }

        sections[sectionId] = metadata;
        totalSeats += metadata.seatCount;
        processedSections++;

      } catch (error) {
        log(`  ⚠️  Failed to process ${file}: ${error.message}`, colors.yellow);
      }
    }

    // Create metadata summary
    const metadataFile = {
      stadiumId: stadiumName,
      lastUpdated: new Date().toISOString(),
      totalSections: processedSections,
      totalSeats: totalSeats,
      sections: sections,
      levels: {
        field: Object.values(sections).filter(s => s.level === 'field').length,
        loge: Object.values(sections).filter(s => s.level === 'loge').length,
        upper: Object.values(sections).filter(s => s.level === 'upper').length
      }
    };

    // Save metadata file
    const outputPath = path.join(stadiumDir, 'metadata.json');
    const outputContent = JSON.stringify(metadataFile, null, 2);
    await writeFile(outputPath, outputContent);

    const fileSize = Buffer.byteLength(outputContent);
    log(`  ✅ Created metadata.json (${formatBytes(fileSize)}) - ${processedSections} sections`, colors.green);

    return { success: true, sections: processedSections, size: fileSize };

  } catch (error) {
    log(`  ❌ Failed to process ${stadiumName}: ${error.message}`, colors.red);
    return { success: false, error: error.message };
  }
}

/**
 * Main function
 */
async function main() {
  log(`${colors.bright}Section Metadata Generator${colors.reset}\n`);
  log(`This creates lightweight metadata files for fast section navigation`, colors.cyan);
  log(`Replaces 16-28MB seat indexes with ~5-10KB metadata files\n`, colors.green);

  const seatDataDir = path.join(__dirname, '..', 'public', 'data', 'seats');

  if (!fs.existsSync(seatDataDir)) {
    log(`❌ Seat data directory not found: ${seatDataDir}`, colors.red);
    process.exit(1);
  }

  // Process in alternative location if public doesn't work
  const alternativeDir = path.join(__dirname, '..', 'src', 'data', 'seatData');
  let targetDir = seatDataDir;

  if (!fs.existsSync(seatDataDir)) {
    if (fs.existsSync(alternativeDir)) {
      targetDir = alternativeDir;
      log(`Using alternative directory: ${alternativeDir}`, colors.yellow);
    } else {
      log(`❌ No seat data directory found`, colors.red);
      process.exit(1);
    }
  }

  // Get all stadium directories
  const stadiumDirs = await readdir(targetDir);
  let totalProcessed = 0;
  let totalSize = 0;
  let failedStadiums = [];

  for (const dir of stadiumDirs) {
    const stadiumPath = path.join(targetDir, dir);
    const dirStat = await stat(stadiumPath);

    if (dirStat.isDirectory()) {
      const result = await processStadium(stadiumPath);

      if (result.success) {
        totalProcessed++;
        totalSize += result.size;
      } else {
        failedStadiums.push(dir);
      }
    }
  }

  // Summary
  log(`\n${colors.bright}========================================${colors.reset}`);
  log(`${colors.bright}📊 Metadata Generation Complete!${colors.reset}`);
  log(`${colors.bright}========================================${colors.reset}`);
  log(`${colors.cyan}✅ Stadiums processed: ${totalProcessed}${colors.reset}`);

  if (failedStadiums.length > 0) {
    log(`${colors.yellow}⚠️  Failed stadiums: ${failedStadiums.join(', ')}${colors.reset}`);
  }

  log(`${colors.green}📦 Total metadata size: ${formatBytes(totalSize)}${colors.reset}`);
  log(`${colors.green}🚀 Replaced ~500MB of seat indexes with ~${formatBytes(totalSize)} of metadata${colors.reset}`);

  // Calculate savings
  const originalSize = 500 * 1024 * 1024; // Approximate original size
  const savings = ((1 - totalSize / originalSize) * 100).toFixed(1);
  log(`${colors.green}💰 Size reduction: ${savings}%${colors.reset}\n`);
}

// Run the script
main().catch(error => {
  log(`\n${colors.red}Fatal error: ${error.message}${colors.reset}`, colors.red);
  process.exit(1);
});