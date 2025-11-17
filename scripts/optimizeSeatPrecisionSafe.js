#!/usr/bin/env node

/**
 * SAFE Precision Optimizer - Preserves calculation accuracy
 * Only removes truly excessive precision without affecting functionality
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

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
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * SAFE precision rounding - preserves accuracy for calculations
 */
function roundToSafe(num, decimals) {
  if (typeof num !== 'number') return num;
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Conservative precision optimization that preserves accuracy
 */
function optimizePrecisionSafe(obj, config = {}) {
  const {
    // Higher precision to maintain accuracy
    positionDecimals = 6,      // ~0.000001 feet precision (sub-millimeter)
    percentageDecimals = 2,    // 0.01% precision
    angleDecimals = 3,         // 0.001 degree precision (important for sun calculations)
    distanceDecimals = 4,      // For distances, maintain good precision
    defaultDecimals = 6        // Conservative default
  } = config;

  if (Array.isArray(obj)) {
    return obj.map(item => optimizePrecisionSafe(item, config));
  }

  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const optimized = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'number') {
      // Determine precision based on key name and value range
      let decimals = defaultDecimals;

      // Position coordinates - maintain high precision for accuracy
      if (key === 'x' || key === 'y' || key === 'z' ||
          key.includes('position') || key.includes('Position') ||
          key.includes('coord') || key.includes('Coord')) {
        decimals = positionDecimals;
      }
      // Percentages (0-100 range typically)
      else if (key.includes('percentage') || key.includes('Percentage') ||
               key.includes('exposure') || key.includes('Exposure') ||
               (value >= 0 && value <= 100 && key.includes('percent'))) {
        decimals = percentageDecimals;
      }
      // Angles - critical for sun calculations
      else if (key.includes('angle') || key.includes('Angle') ||
               key.includes('azimuth') || key.includes('elevation') ||
               key.includes('bearing') || key.includes('orientation')) {
        decimals = angleDecimals;
      }
      // Distances
      else if (key.includes('distance') || key.includes('Distance') ||
               key.includes('height') || key.includes('Height') ||
               key.includes('width') || key.includes('Width')) {
        decimals = distanceDecimals;
      }

      // Only round if we're actually reducing precision
      const originalStr = value.toString();
      const decimalIndex = originalStr.indexOf('.');
      const currentDecimals = decimalIndex === -1 ? 0 : originalStr.length - decimalIndex - 1;

      if (currentDecimals > decimals) {
        optimized[key] = roundToSafe(value, decimals);
      } else {
        optimized[key] = value; // Keep original precision
      }
    } else if (typeof value === 'object') {
      optimized[key] = optimizePrecisionSafe(value, config);
    } else {
      optimized[key] = value;
    }
  }

  return optimized;
}

async function optimizeFile(filePath, backupOriginal = true) {
  try {
    const originalContent = await readFile(filePath, 'utf8');
    const originalSize = originalContent.length;

    // Parse JSON
    const data = JSON.parse(originalContent);

    // SAFE optimization - preserves accuracy
    const optimizedData = optimizePrecisionSafe(data);

    // Convert back to JSON
    const optimizedContent = JSON.stringify(optimizedData);
    const optimizedSize = optimizedContent.length;

    // Always backup original for safety
    if (backupOriginal) {
      const backupPath = filePath.replace('.json', '.original.json');
      if (!fs.existsSync(backupPath)) {
        await writeFile(backupPath, originalContent);
      }
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

async function* walkDirectory(dir) {
  const files = await readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      yield* walkDirectory(filePath);
    } else if (file.endsWith('.json') &&
               !file.endsWith('.backup') &&
               !file.endsWith('.original.json')) {
      yield filePath;
    }
  }
}

async function optimizeAllSeatData() {
  log(`${colors.bright}SAFE Seat Data Precision Optimizer${colors.reset}\n`);
  log(`${colors.yellow}⚠️  This version preserves accuracy for sun calculations${colors.reset}\n`);

  const seatDataDir = path.join(__dirname, '..', 'public', 'data', 'seats');

  if (!fs.existsSync(seatDataDir)) {
    log(`❌ Seat data directory not found: ${seatDataDir}`, colors.red);
    process.exit(1);
  }

  log(`📂 Scanning for JSON files in: ${seatDataDir}`, colors.cyan);
  log(`📐 SAFE precision settings (preserving accuracy):`, colors.cyan);
  log(`   • Positions (x,y,z): 6 decimal places (sub-millimeter precision)`, colors.green);
  log(`   • Percentages: 2 decimal places (0.01% precision)`, colors.green);
  log(`   • Angles: 3 decimal places (0.001° precision for accurate sun calc)`, colors.green);
  log(`   • Distances: 4 decimal places`, colors.green);
  log(`   • Other numbers: 6 decimal places (conservative)\n`, colors.green);

  const proceed = await new Promise((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    readline.question(`${colors.yellow}This will create .original.json backups. Proceed? (y/n): ${colors.reset}`, (answer) => {
      readline.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });

  if (!proceed) {
    log(`${colors.yellow}Optimization cancelled by user${colors.reset}`);
    process.exit(0);
  }

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

        const result = await optimizeFile(filePath, true);

        totalOriginal += result.originalSize;
        totalOptimized += result.optimizedSize;
        fileCount++;

        // Clear the processing line
        process.stdout.write('\r' + ' '.repeat(80) + '\r');

        if (parseFloat(result.reduction) > 0) {
          log(`✅ ${relativePath}: ${formatBytes(result.originalSize)} → ${formatBytes(result.optimizedSize)} (${result.reduction}% reduction)`, colors.green);
        }
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
  log(`${colors.bright}📊 SAFE Optimization Complete!${colors.reset}`);
  log(`${colors.bright}========================================${colors.reset}`);
  log(`${colors.cyan}✅ Files optimized: ${fileCount}${colors.reset}`);
  if (errorCount > 0) {
    log(`${colors.yellow}⚠️  Errors encountered: ${errorCount}${colors.reset}`);
  }
  log(`${colors.magenta}📦 Original size: ${formatBytes(totalOriginal)}${colors.reset}`);
  log(`${colors.green}📦 Optimized size: ${formatBytes(totalOptimized)}${colors.reset}`);
  log(`${colors.green}📈 Size reduction: ${overallReduction}%${colors.reset}`);
  log(`${colors.blue}⏱️  Time taken: ${duration} seconds${colors.reset}`);
  log(`\n${colors.green}✅ Accuracy preserved with conservative precision limits${colors.reset}`);
  log(`${colors.cyan}💾 Original files backed up as .original.json${colors.reset}`);
}

// Run the script
optimizeAllSeatData().catch(error => {
  log(`\n${colors.red}Fatal error: ${error.message}${colors.reset}`, colors.red);
  process.exit(1);
});