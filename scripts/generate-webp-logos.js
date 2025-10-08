#!/usr/bin/env node

/**
 * Generate WebP versions of PNG logo images using Next.js Image Optimization
 *
 * NOTE: This script provides instructions for manual WebP generation.
 * Sharp has platform-specific build requirements that may fail in some environments.
 *
 * AUTOMATIC OPTION: Next.js will automatically serve WebP when using next/image component
 * MANUAL OPTIONS:
 * 1. Use online converter: https://squoosh.app/ or https://cloudconvert.com/png-to-webp
 * 2. Use ImageMagick: convert logo192.png -quality 90 logo192.webp
 * 3. Use cwebp (Google's tool): cwebp -q 90 logo192.png -o logo192.webp
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const LOGOS = [
  { input: 'logo192.png', output: 'logo192.webp' },
  { input: 'logo512.png', output: 'logo512.webp' }
];

function checkTool(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function generateWebPLogos() {
  console.log('🖼️  WebP Logo Generation\n');

  // Check for available tools
  const hasImageMagick = checkTool('convert');
  const hasCwebp = checkTool('cwebp');

  if (!hasImageMagick && !hasCwebp) {
    console.log('❌ No WebP conversion tools found.');
    console.log('\n📋 Manual Conversion Instructions:');
    console.log('\nOption 1 - Install ImageMagick:');
    console.log('  brew install imagemagick');
    console.log('  Then run this script again\n');
    console.log('Option 2 - Install cwebp:');
    console.log('  brew install webp');
    console.log('  Then run this script again\n');
    console.log('Option 3 - Online Converter:');
    console.log('  Visit https://squoosh.app/');
    console.log('  Upload logo192.png and logo512.png');
    console.log('  Convert to WebP (quality: 90)');
    console.log('  Save to public/ directory\n');
    console.log('ℹ️  Note: Next.js will auto-generate WebP when using next/image component');
    return;
  }

  // Generate WebP files
  for (const logo of LOGOS) {
    const inputPath = path.join(PUBLIC_DIR, logo.input);
    const outputPath = path.join(PUBLIC_DIR, logo.output);

    if (!fs.existsSync(inputPath)) {
      console.warn(`⚠️  ${logo.input} not found, skipping...`);
      continue;
    }

    try {
      const originalSize = fs.statSync(inputPath).size;

      if (hasCwebp) {
        execSync(`cwebp -q 90 "${inputPath}" -o "${outputPath}"`, { stdio: 'pipe' });
      } else if (hasImageMagick) {
        execSync(`convert "${inputPath}" -quality 90 "${outputPath}"`, { stdio: 'pipe' });
      }

      if (fs.existsSync(outputPath)) {
        const newSize = fs.statSync(outputPath).size;
        const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

        console.log(`✅ Generated ${logo.output}`);
        console.log(`   Original: ${(originalSize / 1024).toFixed(1)}KB`);
        console.log(`   WebP:     ${(newSize / 1024).toFixed(1)}KB`);
        console.log(`   Savings:  ${savings}%\n`);
      }
    } catch (error) {
      console.error(`❌ Error generating ${logo.output}:`, error.message);
    }
  }

  console.log('✨ WebP logo generation complete!');
}

if (require.main === module) {
  generateWebPLogos();
}

module.exports = { generateWebPLogos };
