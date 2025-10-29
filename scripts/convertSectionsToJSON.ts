#!/usr/bin/env node
/**
 * Script to convert TypeScript section files to JSON
 * This will extract the section data and save it as JSON files in the public folder
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Source and destination paths
const SRC_BASE = path.join(__dirname, '../src/data/sections');
const DEST_BASE = path.join(__dirname, '../public/data/sections');

// Ensure destination directory exists
function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Convert a single TypeScript file to JSON
async function convertTStoJSON(tsFilePath: string, jsonFilePath: string) {
  try {
    // Dynamically import the TS module
    const module = await import(tsFilePath);

    // Find the exported section data (it could have various names)
    const exportedKeys = Object.keys(module);
    const sectionKey = exportedKeys.find(key => key.includes('Sections') || key.includes('sections'));

    if (!sectionKey) {
      console.warn(`No section data found in ${tsFilePath}`);
      return false;
    }

    const sectionData = module[sectionKey];

    // Write JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(sectionData, null, 2));
    return true;
  } catch (error) {
    console.error(`Error converting ${tsFilePath}:`, error);
    return false;
  }
}

// Process all sections for a league
async function processLeague(league: string) {
  const srcLeagueDir = path.join(SRC_BASE, league);
  const destLeagueDir = path.join(DEST_BASE, league);

  if (!fs.existsSync(srcLeagueDir)) {
    console.log(`No source directory for ${league}`);
    return;
  }

  ensureDir(destLeagueDir);

  const files = fs.readdirSync(srcLeagueDir);
  let converted = 0;
  let failed = 0;

  for (const file of files) {
    if (!file.endsWith('.ts') || file.endsWith('.d.ts')) continue;

    const tsFilePath = path.join(srcLeagueDir, file);
    const jsonFileName = file.replace('.ts', '.json');
    const jsonFilePath = path.join(destLeagueDir, jsonFileName);

    console.log(`Converting ${league}/${file}...`);
    const success = await convertTStoJSON(tsFilePath, jsonFilePath);

    if (success) {
      converted++;
    } else {
      failed++;
    }
  }

  console.log(`${league}: Converted ${converted} files, ${failed} failed`);
  return { converted, failed };
}

// Main conversion process
async function main() {
  console.log('Starting section data conversion...\n');

  ensureDir(DEST_BASE);

  const leagues = ['mlb', 'milb', 'nfl'];
  const stats = {
    totalConverted: 0,
    totalFailed: 0
  };

  for (const league of leagues) {
    console.log(`\nProcessing ${league.toUpperCase()}...`);
    const result = await processLeague(league);
    if (result) {
      stats.totalConverted += result.converted;
      stats.totalFailed += result.failed;
    }

    // Also process sub-leagues for MiLB
    if (league === 'milb') {
      const milbLevels = ['aaa', 'aa', 'a+', 'a'];
      for (const level of milbLevels) {
        const milbPath = `${league}/${level}`;
        console.log(`\nProcessing ${milbPath.toUpperCase()}...`);
        const milbResult = await processLeague(milbPath);
        if (milbResult) {
          stats.totalConverted += milbResult.converted;
          stats.totalFailed += milbResult.failed;
        }
      }
    }
  }

  console.log('\n=================================');
  console.log('Conversion Complete!');
  console.log(`Total files converted: ${stats.totalConverted}`);
  console.log(`Total files failed: ${stats.totalFailed}`);
  console.log('=================================\n');

  // Create an index file listing all available sections
  const indexData: Record<string, string[]> = {};

  function scanForSections(dir: string, basePath = '') {
    const files = fs.readdirSync(dir);
    const sections: string[] = [];

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        const subPath = basePath ? `${basePath}/${file}` : file;
        scanForSections(filePath, subPath);
      } else if (file.endsWith('.json')) {
        sections.push(file.replace('.json', ''));
      }
    }

    if (sections.length > 0 && basePath) {
      indexData[basePath] = sections;
    }
  }

  scanForSections(DEST_BASE);

  // Write index file
  const indexPath = path.join(DEST_BASE, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
  console.log(`Created section index at ${indexPath}`);
}

// Run the conversion
main().catch(console.error);