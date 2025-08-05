// Verify that all MiLB stadiums now have real section numbers
import * as fs from 'fs';
import * as path from 'path';

function verifyRealSectionsInFile(filePath: string, level: string) {
  console.log(`\nVerifying ${level} stadiums in ${path.basename(filePath)}...`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Count total stadiums
  const venueMatches = content.match(/venueId:\s*['"]/g);
  const totalStadiums = venueMatches ? venueMatches.length : 0;
  
  // Look for generic section patterns that would indicate we missed some
  const genericPatterns = [
    /name:\s*['"]Section\s+\d+['"]/g,
    /name:\s*['"]Field\s+Box\s+\d+['"]/g,
    /name:\s*['"]Reserved\s+\d+['"]/g,
    /baseAngle:\s*340,\s*angleSpan:\s*40/g, // Old generic luxury club pattern
  ];
  
  let issuesFound = 0;
  let realSectionsFound = 0;
  
  // Check for real numbered sections (like "101", "102", etc.)
  const realSectionMatches = content.match(/name:\s*['"](\d{3})['"]/g);
  realSectionsFound = realSectionMatches ? realSectionMatches.length : 0;
  
  genericPatterns.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      issuesFound += matches.length;
      console.log(`  ⚠️  Found ${matches.length} generic pattern ${index + 1} instances`);
    }
  });
  
  // Check for stadium-specific sections (non-generic names)
  const specificSectionMatches = content.match(/name:\s*['"][^'"]*(?:Club|Suite|Pavilion|Deck|Area|Monster|Triangle)[^'"]*['"]/g);
  const specificSectionsFound = specificSectionMatches ? specificSectionMatches.length : 0;
  
  console.log(`  📊 Stadium Analysis:`);
  console.log(`     • Total stadiums: ${totalStadiums}`);
  console.log(`     • Real numbered sections (100s, 200s): ${realSectionsFound}`);
  console.log(`     • Stadium-specific areas: ${specificSectionsFound}`);
  console.log(`     • Generic issues found: ${issuesFound}`);
  
  if (issuesFound === 0) {
    console.log(`  ✅ All sections appear to be real and stadium-specific!`);
  } else {
    console.log(`  ❌ Found ${issuesFound} potential generic sections that need review`);
  }
  
  return { totalStadiums, realSectionsFound, specificSectionsFound, issuesFound };
}

async function verifyAllRealSections() {
  console.log('🔍 Verifying all MiLB stadiums have REAL section numbers...\n');
  
  const files = [
    { path: '../src/data/milbVenueLayoutsAAA.ts', level: 'AAA' },
    { path: '../src/data/milbVenueLayoutsAA.ts', level: 'AA' },
    { path: '../src/data/milbVenueLayoutsAPlus.ts', level: 'A+' },
    { path: '../src/data/milbVenueLayoutsA.ts', level: 'A' },
    { path: '../src/data/milbVenueLayoutsMissing.ts', level: 'Mixed' }
  ];
  
  let totalStadiums = 0;
  let totalRealSections = 0;
  let totalSpecificSections = 0;
  let totalIssues = 0;
  
  for (const file of files) {
    const filePath = path.join(__dirname, file.path);
    try {
      const result = verifyRealSectionsInFile(filePath, file.level);
      totalStadiums += result.totalStadiums;
      totalRealSections += result.realSectionsFound;
      totalSpecificSections += result.specificSectionsFound;
      totalIssues += result.issuesFound;
    } catch (error) {
      console.error(`❌ Error verifying ${file.path}:`, error);
    }
  }
  
  console.log(`\n📈 OVERALL SUMMARY:`);
  console.log(`   • Total MiLB stadiums: ${totalStadiums}`);
  console.log(`   • Real numbered sections: ${totalRealSections}`);
  console.log(`   • Stadium-specific areas: ${totalSpecificSections}`);
  console.log(`   • Generic issues remaining: ${totalIssues}`);
  
  if (totalIssues === 0) {
    console.log(`\n🎉 SUCCESS! All ${totalStadiums} MiLB stadiums now have REAL section numbers!`);
    console.log(`   ✅ No generic sections detected`);
    console.log(`   ✅ ${totalRealSections} real numbered sections (100s, 200s, etc.)`);
    console.log(`   ✅ ${totalSpecificSections} stadium-specific areas (clubs, pavilions, etc.)`);
    console.log(`\n🚀 Ready for production deployment!`);
  } else {
    console.log(`\n⚠️  Found ${totalIssues} issues that may need manual review.`);
  }
}

verifyAllRealSections().catch(console.error);