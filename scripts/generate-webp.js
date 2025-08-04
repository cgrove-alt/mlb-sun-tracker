#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Note: This script requires the 'sharp' package to be installed
// Run: npm install --save-dev sharp

async function convertToWebP() {
  try {
    // Try to load sharp - if not available, provide instructions
    let sharp;
    try {
      sharp = require('sharp');
    } catch (error) {
      console.log('Sharp is not installed. To convert images to WebP format, run:');
      console.log('npm install --save-dev sharp');
      console.log('\nThen run this script again: node scripts/generate-webp.js');
      return;
    }

    const publicDir = path.join(__dirname, '../public');
    const images = [
      { input: 'logo192.png', output: 'logo192.webp' },
      { input: 'logo512.png', output: 'logo512.webp' }
    ];

    for (const { input, output } of images) {
      const inputPath = path.join(publicDir, input);
      const outputPath = path.join(publicDir, output);

      if (!fs.existsSync(inputPath)) {
        console.log(`Skipping ${input} - file not found`);
        continue;
      }

      await sharp(inputPath)
        .webp({ quality: 90 })
        .toFile(outputPath);

      const inputSize = fs.statSync(inputPath).size;
      const outputSize = fs.statSync(outputPath).size;
      const savings = ((1 - outputSize / inputSize) * 100).toFixed(1);

      console.log(`✓ Converted ${input} to ${output}`);
      console.log(`  Size: ${(inputSize / 1024).toFixed(1)}KB → ${(outputSize / 1024).toFixed(1)}KB (${savings}% smaller)`);
    }

    console.log('\nWebP conversion complete!');
  } catch (error) {
    console.error('Error converting images:', error);
  }
}

convertToWebP();