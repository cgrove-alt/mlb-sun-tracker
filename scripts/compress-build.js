const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const COMPRESSIBLE_EXTENSIONS = ['.js', '.css', '.html', '.json', '.svg', '.xml', '.txt'];
const MIN_SIZE_FOR_COMPRESSION = 1000; // 1KB minimum

async function compressFile(filePath) {
  try {
    const fileContent = await readFile(filePath);
    
    if (fileContent.length < MIN_SIZE_FOR_COMPRESSION) {
      return { skipped: true, reason: 'File too small' };
    }

    // Create Brotli compressed version
    const brotliCompressed = await promisify(zlib.brotliCompress)(fileContent, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
      },
    });

    // Create Gzip compressed version as fallback
    const gzipCompressed = await promisify(zlib.gzip)(fileContent, {
      level: zlib.constants.Z_BEST_COMPRESSION,
    });

    // Only save if compression reduces size by at least 10%
    const brotliSavings = ((fileContent.length - brotliCompressed.length) / fileContent.length) * 100;
    const gzipSavings = ((fileContent.length - gzipCompressed.length) / fileContent.length) * 100;

    if (brotliSavings > 10) {
      await writeFile(`${filePath}.br`, brotliCompressed);
    }

    if (gzipSavings > 10) {
      await writeFile(`${filePath}.gz`, gzipCompressed);
    }

    return {
      original: fileContent.length,
      brotli: brotliCompressed.length,
      gzip: gzipCompressed.length,
      brotliSavings: brotliSavings.toFixed(2),
      gzipSavings: gzipSavings.toFixed(2),
    };
  } catch (error) {
    console.error(`Error compressing ${filePath}:`, error);
    return { error: error.message };
  }
}

async function compressDirectory(dirPath) {
  const files = await readdir(dirPath);
  let totalOriginal = 0;
  let totalBrotli = 0;
  let totalGzip = 0;
  let filesCompressed = 0;

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      // Recursively compress subdirectories
      const subResults = await compressDirectory(filePath);
      totalOriginal += subResults.totalOriginal;
      totalBrotli += subResults.totalBrotli;
      totalGzip += subResults.totalGzip;
      filesCompressed += subResults.filesCompressed;
    } else if (COMPRESSIBLE_EXTENSIONS.some(ext => file.endsWith(ext))) {
      const result = await compressFile(filePath);
      
      if (result.original) {
        totalOriginal += result.original;
        totalBrotli += result.brotli;
        totalGzip += result.gzip;
        filesCompressed++;
        
        console.log(`✓ Compressed ${file}: ${result.brotliSavings}% (Brotli), ${result.gzipSavings}% (Gzip)`);
      } else if (result.skipped) {
        console.log(`- Skipped ${file}: ${result.reason}`);
      }
    }
  }

  return { totalOriginal, totalBrotli, totalGzip, filesCompressed };
}

async function main() {
  console.log('🗜️  Starting compression of build output...\n');

  const buildDirs = ['out', '.next/static'];
  let grandTotalOriginal = 0;
  let grandTotalBrotli = 0;
  let grandTotalGzip = 0;
  let totalFilesCompressed = 0;

  for (const dir of buildDirs) {
    if (fs.existsSync(dir)) {
      console.log(`\nCompressing ${dir}...`);
      const results = await compressDirectory(dir);
      
      grandTotalOriginal += results.totalOriginal;
      grandTotalBrotli += results.totalBrotli;
      grandTotalGzip += results.totalGzip;
      totalFilesCompressed += results.filesCompressed;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Compression Results:');
  console.log('='.repeat(50));
  console.log(`Files compressed: ${totalFilesCompressed}`);
  console.log(`Original size: ${(grandTotalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Brotli size: ${(grandTotalBrotli / 1024 / 1024).toFixed(2)} MB (${((1 - grandTotalBrotli / grandTotalOriginal) * 100).toFixed(2)}% reduction)`);
  console.log(`Gzip size: ${(grandTotalGzip / 1024 / 1024).toFixed(2)} MB (${((1 - grandTotalGzip / grandTotalOriginal) * 100).toFixed(2)}% reduction)`);
  console.log('\n✅ Compression complete!');
}

main().catch(console.error);