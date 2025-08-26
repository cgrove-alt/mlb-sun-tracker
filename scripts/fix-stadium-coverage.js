#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the stadiums file to identify open-air stadiums
const stadiumsFile = fs.readFileSync(path.join(__dirname, '../src/data/stadiums.ts'), 'utf8');
const sectionsFile = fs.readFileSync(path.join(__dirname, '../src/data/stadiumSections.ts'), 'utf8');

// Extract stadium roof types
const stadiumRoofs = {};
const stadiumMatches = stadiumsFile.matchAll(/id:\s*'([^']+)'[\s\S]*?roof:\s*'([^']+)'/g);
for (const match of stadiumMatches) {
  stadiumRoofs[match[1]] = match[2];
}

console.log('Stadium roof types:', stadiumRoofs);

// Rules for coverage based on actual stadium structures
const coverageRules = {
  // Open-air stadiums - most sections should be uncovered
  'open': {
    // Only these section types should typically have coverage
    coveredPatterns: [
      /Club Level/i,      // Club levels usually have overhead coverage
      /Suite/i,           // Suites are typically covered
      /Loge.*Box/i,       // Some loge boxes have coverage
      /Pavilion.*Club/i,  // Pavilion clubs often covered
    ],
    // Upper deck coverage varies by stadium - only back rows typically
    upperDeckCoverage: {
      'yankees': ['back rows only'],  // Only rows 15+ in upper deck
      'dodgers': ['minimal'],          // Very limited coverage
      'redsox': ['green monster none'], // Green Monster seats have no coverage
      'cubs': ['minimal'],             // Historic stadium, minimal coverage
      'giants': ['club level only'],    // Main coverage is club level
    }
  },
  // Retractable roof stadiums - all sections covered when closed
  'retractable': {
    allCovered: true  // Keep existing coverage
  },
  // Fixed roof stadiums - all sections covered
  'fixed': {
    allCovered: true  // Keep existing coverage
  }
};

// Process each stadium's sections
let modifiedSections = sectionsFile;
let changeCount = 0;

for (const [stadiumId, roofType] of Object.entries(stadiumRoofs)) {
  if (roofType === 'open') {
    console.log(`\nProcessing open-air stadium: ${stadiumId}`);
    
    // Find the stadium's section block
    const stadiumRegex = new RegExp(
      `(stadiumId:\\s*'${stadiumId}'[\\s\\S]*?)(?=stadiumId:|$)`,
      'g'
    );
    
    modifiedSections = modifiedSections.replace(stadiumRegex, (match) => {
      let modifiedMatch = match;
      let stadiumChanges = 0;
      
      // Process each section line
      modifiedMatch = modifiedMatch.replace(
        /(\{[^}]*name:\s*'([^']+)'[^}]*level:\s*'([^']+)'[^}]*covered:\s*)true([^}]*\})/g,
        (sectionMatch, prefix, sectionName, level, suffix) => {
          // Check if this section should remain covered
          let shouldBeCovered = false;
          
          // Check against covered patterns
          for (const pattern of coverageRules.open.coveredPatterns) {
            if (pattern.test(sectionName)) {
              shouldBeCovered = true;
              break;
            }
          }
          
          // Special handling for upper deck
          if (level === 'upper') {
            // Most upper deck sections should be uncovered in open-air stadiums
            // Only keep covered if it's explicitly a club/suite or back rows
            if (!/Club|Suite|Pavilion.*Club/i.test(sectionName)) {
              shouldBeCovered = false;
            }
          }
          
          // Field and lower levels in open-air stadiums are almost never covered
          if (level === 'field' || level === 'lower') {
            // Only covered if it's a club/suite section
            if (!/Club|Suite/i.test(sectionName)) {
              shouldBeCovered = false;
            }
          }
          
          if (!shouldBeCovered) {
            stadiumChanges++;
            changeCount++;
            return `${prefix}false${suffix}`;
          }
          
          return sectionMatch;
        }
      );
      
      console.log(`  Changed ${stadiumChanges} sections from covered to uncovered`);
      return modifiedMatch;
    });
  }
}

// Write the modified file
fs.writeFileSync(path.join(__dirname, '../src/data/stadiumSections.ts'), modifiedSections);

console.log(`\nTotal changes made: ${changeCount} sections updated`);
console.log('Stadium coverage data has been fixed!');

// Report summary
console.log('\n=== Summary ===');
for (const [stadiumId, roofType] of Object.entries(stadiumRoofs)) {
  const coveredCount = (modifiedSections.match(
    new RegExp(`stadiumId:\\s*'${stadiumId}'[\\s\\S]*?(?=stadiumId:|$)`, 'g')
  )?.[0].match(/covered:\s*true/g) || []).length;
  
  console.log(`${stadiumId} (${roofType}): ${coveredCount} covered sections`);
}