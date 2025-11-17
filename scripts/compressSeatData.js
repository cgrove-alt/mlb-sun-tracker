#!/usr/bin/env node

/**
 * Script to compress seat data JSON files for optimized serving
 * Reduces 557MB of uncompressed data to ~110-170MB with gzip compression
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { promisify } = require('util');

const gzip = promisify(zlib.gzip);
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

async function compressFile(filePath) {
  try {
    const fileContent = await readFile(filePath);
    const compressed = await gzip(fileContent, { level: 9 }); // Maximum compression

    const gzipPath = filePath + '.gz';
    await writeFile(gzipPath, compressed);

    const originalSize = fileContent.length;
    const compressedSize = compressed.length;
    const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);

    return {
      originalSize,
      compressedSize,
      ratio,
      path: filePath
    };
  } catch (error) {
    throw new Error(`Failed to compress ${filePath}: ${error.message}`);
  }
}

async function* walkDirectory(dir) {
  const files = await readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      yield* walkDirectory(filePath);
    } else if (file.endsWith('.json') && !file.endsWith('.gz')) {
      yield filePath;
    }
  }
}

async function compressAllSeatData() {
  log(`${colors.bright}Seat Data Compression Tool${colors.reset}\n`);

  const seatDataDir = path.join(__dirname, '..', 'public', 'data', 'seats');

  if (!fs.existsSync(seatDataDir)) {
    log(`❌ Seat data directory not found: ${seatDataDir}`, colors.red);
    process.exit(1);
  }

  log(`📂 Scanning for JSON files in: ${seatDataDir}`, colors.cyan);

  let totalOriginal = 0;
  let totalCompressed = 0;
  let fileCount = 0;
  let errorCount = 0;

  const startTime = Date.now();

  try {
    for await (const filePath of walkDirectory(seatDataDir)) {
      try {
        const relativePath = path.relative(seatDataDir, filePath);
        process.stdout.write(`\r${colors.yellow}Processing: ${relativePath}...${colors.reset}`);

        const result = await compressFile(filePath);

        totalOriginal += result.originalSize;
        totalCompressed += result.compressedSize;
        fileCount++;

        // Clear the processing line
        process.stdout.write('\r' + ' '.repeat(80) + '\r');

        log(`✅ ${relativePath}: ${formatBytes(result.originalSize)} → ${formatBytes(result.compressedSize)} (${result.ratio}% reduction)`, colors.green);
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
  const overallRatio = ((1 - totalCompressed / totalOriginal) * 100).toFixed(1);

  log(`\n${colors.bright}========================================${colors.reset}`);
  log(`${colors.bright}📊 Compression Complete!${colors.reset}`);
  log(`${colors.bright}========================================${colors.reset}`);
  log(`${colors.cyan}✅ Files compressed: ${fileCount}${colors.reset}`);
  if (errorCount > 0) {
    log(`${colors.yellow}⚠️  Errors encountered: ${errorCount}${colors.reset}`);
  }
  log(`${colors.magenta}📦 Original size: ${formatBytes(totalOriginal)}${colors.reset}`);
  log(`${colors.green}📦 Compressed size: ${formatBytes(totalCompressed)}${colors.reset}`);
  log(`${colors.green}📈 Overall reduction: ${overallRatio}%${colors.reset}`);
  log(`${colors.blue}⏱️  Time taken: ${duration} seconds${colors.reset}`);

  if (overallRatio > 60) {
    log(`\n${colors.green}🎉 Excellent compression achieved! The seat data will load much faster.${colors.reset}`);
  }
}

// Run the script
compressAllSeatData().catch(error => {
  log(`\n${colors.red}Fatal error: ${error.message}${colors.reset}`, colors.red);
  process.exit(1);
});