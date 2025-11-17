#!/usr/bin/env node

/**
 * Script to optimize seat data JSON files by reducing numeric precision
 * Reduces excessive decimal places from 16+ to 2-3 for significant file size reduction
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// ANSI color codes for output
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
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Round a number to specified decimal places
 */
function roundTo(num, decimals) {
  if (typeof num !== 'number') return num;
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Optimize numeric precision in an object recursively
 */
function optimizePrecision(obj, config = {}) {
  const {
    positionDecimals = 2,     // For x, y, z coordinates
    percentageDecimals = 1,   // For percentages
    angleDecimals = 1,        // For angles
    defaultDecimals = 3      // For other numbers
  } = config;

  if (Array.isArray(obj)) {
    return obj.map(item => optimizePrecision(item, config));
  }

  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const optimized = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'number') {
      // Determine precision based on key name
      let decimals = defaultDecimals;

      if (key === 'x' || key === 'y' || key === 'z' ||
          key.includes('position') || key.includes('Position')) {
        decimals = positionDecimals;
      } else if (key.includes('percentage') || key.includes('Percentage') ||
                 key.includes('exposure') || key.includes('Exposure')) {
        decimals = percentageDecimals;
      } else if (key.includes('angle') || key.includes('Angle') ||
                 key.includes('azimuth') || key.includes('elevation')) {
        decimals = angleDecimals;
      }

      optimized[key] = roundTo(value, decimals);
    } else if (typeof value === 'object') {
      optimized[key] = optimizePrecision(value, config);
    } else {
      optimized[key] = value;
    }
  }

  return optimized;
}

/**
 * Optimize a single JSON file
 */
async function optimizeFile(filePath, backupOriginal = false) {
  try {
    const originalContent = await readFile(filePath, 'utf8');
    const originalSize = originalContent.length;

    // Parse JSON
    const data = JSON.parse(originalContent);

    // Optimize precision
    const optimizedData = optimizePrecision(data);

    // Convert back to JSON with minimal formatting
    const optimizedContent = JSON.stringify(optimizedData);
    const optimizedSize = optimizedContent.length;

    // Backup original if requested
    if (backupOriginal) {
      await writeFile(filePath + '.backup', originalContent);
    }

    // Write optimized version
    await writeFile(filePath, optimizedContent);

    const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

    return {
      originalSize,
      optimizedSize,
      reduction,
      path: filePath
    };
  } catch (error) {
    throw new Error(`Failed to optimize ${filePath}: ${error.message}`);
  }
}

/**
 * Walk through directory and find JSON files
 */
async function* walkDirectory(dir) {
  const files = await readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      yield* walkDirectory(filePath);
    } else if (file.endsWith('.json') && !file.endsWith('.backup')) {
      yield filePath;
    }
  }
}

/**
 * Main function to optimize all seat data
 */
async function optimizeAllSeatData() {
  log(`${colors.bright}Seat Data Precision Optimizer${colors.reset}\n`);

  const seatDataDir = path.join(__dirname, '..', 'public', 'data', 'seats');

  if (!fs.existsSync(seatDataDir)) {
    log(`❌ Seat data directory not found: ${seatDataDir}`, colors.red);
    process.exit(1);
  }

  log(`📂 Scanning for JSON files in: ${seatDataDir}`, colors.cyan);
  log(`📐 Precision settings:`, colors.cyan);
  log(`   • Positions (x,y,z): 2 decimal places`, colors.blue);
  log(`   • Percentages: 1 decimal place`, colors.blue);
  log(`   • Angles: 1 decimal place`, colors.blue);
  log(`   • Other numbers: 3 decimal places\n`, colors.blue);

  let totalOriginal = 0;
  let totalOptimized = 0;
  let fileCount = 0;
  let errorCount = 0;

  const startTime = Date.now();

  try {
    for await (const filePath of walkDirectory(seatDataDir)) {
      try {
        const relativePath = path.relative(seatDataDir, filePath);
        process.stdout.write(`\r${colors.yellow}Processing: ${relativePath}...${colors.reset}`);

        const result = await optimizeFile(filePath, false); // Set to true to keep backups

        totalOriginal += result.originalSize;
        totalOptimized += result.optimizedSize;
        fileCount++;

        // Clear the processing line
        process.stdout.write('\r' + ' '.repeat(80) + '\r');

        log(`✅ ${relativePath}: ${formatBytes(result.originalSize)} → ${formatBytes(result.optimizedSize)} (${result.reduction}% reduction)`, colors.green);
      } catch (error) {
        errorCount++;
        log(`❌ Error: ${error.message}`, colors.red);
      }
    }
  } catch (error) {
    log(`\n❌ Fatal error: ${error.message}`, colors.red);
    process.exit(1);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const overallReduction = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);

  log(`\n${colors.bright}========================================${colors.reset}`);
  log(`${colors.bright}📊 Optimization Complete!${colors.reset}`);
  log(`${colors.bright}========================================${colors.reset}`);
  log(`${colors.cyan}✅ Files optimized: ${fileCount}${colors.reset}`);
  if (errorCount > 0) {
    log(`${colors.yellow}⚠️  Errors encountered: ${errorCount}${colors.reset}`);
  }
  log(`${colors.magenta}📦 Original size: ${formatBytes(totalOriginal)}${colors.reset}`);
  log(`${colors.green}📦 Optimized size: ${formatBytes(totalOptimized)}${colors.reset}`);
  log(`${colors.green}📈 Size reduction: ${overallReduction}%${colors.reset}`);
  log(`${colors.blue}⏱️  Time taken: ${duration} seconds${colors.reset}`);

  // Now regenerate compressed files
  log(`\n${colors.yellow}🔄 Regenerating compressed files...${colors.reset}`);
  const { execSync } = require('child_process');

  try {
    // Remove old .gz files
    execSync(`find ${seatDataDir} -name "*.json.gz" -delete`, { stdio: 'inherit' });

    // Run compression script
    execSync('node scripts/compressSeatData.js', { stdio: 'inherit' });

    log(`${colors.green}✅ Compressed files regenerated successfully!${colors.reset}`);
  } catch (error) {
    log(`${colors.red}❌ Failed to regenerate compressed files: ${error.message}${colors.reset}`);
  }
}

// Run the script
optimizeAllSeatData().catch(error => {
  log(`\n${colors.red}Fatal error: ${error.message}${colors.reset}`, colors.red);
  process.exit(1);
});