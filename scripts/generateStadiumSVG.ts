#!/usr/bin/env ts-node

/**
 * Stadium SVG Map Generator
 *
 * Generates interactive SVG stadium maps based on section data.
 * Creates accurate seating bowl representations with clickable sections.
 *
 * Usage: npx tsx scripts/generateStadiumSVG.ts --stadium=dodgers
 */

import * as fs from 'fs';
import * as path from 'path';
import { MLB_STADIUMS } from '../src/data/stadiums';

interface SectionLayout {
  id: string;
  level: string;
  angle: number;  // Position around the stadium (0-360 degrees)
  radius: number; // Distance from center
  width: number;  // Arc width in degrees
  seats: number;
}

/**
 * Map stadium ID to seat data directory name
 */
function getSeatDataStadiumId(stadiumId: string): string {
  return stadiumId === 'dodgers' ? 'dodger-stadium' : stadiumId;
}

/**
 * Extract level from section ID
 */
function extractLevel(sectionId: string): string {
  if (/^[1-9]$|^[1-4][0-9]$|^5[0-3]$/.test(sectionId)) return 'field';
  if (/^1\d{2}$/.test(sectionId)) return 'loge';
  if (sectionId.includes('RS') || /^2\d{2}$/.test(sectionId)) return 'reserve';
  if (sectionId.includes('IR')) return 'club';
  if (sectionId.includes('TD') || /^3\d{2}$/.test(sectionId)) return 'upper';
  if (sectionId.includes('PV') || sectionId.includes('LF') || sectionId.includes('RF') || /^30[0-9]$|^31[0-6]$/.test(sectionId)) {
    return 'pavilion';
  }
  return 'other';
}

/**
 * Calculate section position in stadium
 * Arranges sections in circular/oval layout based on numbering
 */
function calculateSectionPosition(sectionId: string, level: string): { angle: number; radius: number; width: number } {
  // Parse section number
  const baseNum = parseInt(sectionId.replace(/[A-Z]/g, ''));

  // Level-specific radii (from center)
  const radiusMap: Record<string, number> = {
    field: 200,
    club: 250,
    loge: 300,
    reserve: 350,
    upper: 400,
    pavilion: 450,
    other: 300,
  };

  // Calculate angle based on section number
  // Lower numbers on third base side (left), higher on first base (right)
  let angle = 0;
  let width = 15; // Default arc width in degrees

  if (level === 'field') {
    // Field level: 1-53 sections around the field
    angle = (baseNum / 53) * 270 + 45; // 270 degree arc, starting at 45
    width = 270 / 53;
  } else if (level === 'loge') {
    // Loge level: 101-168
    const sectionCount = 68;
    const normalized = baseNum - 101;
    angle = (normalized / sectionCount) * 300 + 30;
    width = 300 / sectionCount;
  } else if (level === 'club') {
    // Club level: fewer sections, premium locations
    angle = (baseNum / 20) * 180 + 90;
    width = 180 / 20;
  } else if (level === 'reserve') {
    // Reserve level
    angle = (baseNum / 30) * 300 + 30;
    width = 300 / 30;
  } else if (level === 'upper') {
    // Upper deck
    angle = (baseNum / 30) * 300 + 30;
    width = 300 / 30;
  } else if (level === 'pavilion') {
    // Pavilion: outfield sections (301-316)
    const normalized = baseNum - 301;
    angle = (normalized / 16) * 60 + 150; // 60 degree arc in center field
    width = 60 / 16;
  }

  return {
    angle,
    radius: radiusMap[level],
    width,
  };
}

/**
 * Generate SVG path for a section
 */
function generateSectionPath(section: SectionLayout): string {
  const { angle, radius, width } = section;

  // Convert to radians
  const startAngle = (angle - width / 2) * (Math.PI / 180);
  const endAngle = (angle + width / 2) * (Math.PI / 180);

  // Inner and outer radii for the section
  const innerRadius = radius - 30;
  const outerRadius = radius + 30;

  // Calculate path points
  const x1 = 500 + innerRadius * Math.cos(startAngle);
  const y1 = 500 + innerRadius * Math.sin(startAngle);
  const x2 = 500 + outerRadius * Math.cos(startAngle);
  const y2 = 500 + outerRadius * Math.sin(startAngle);
  const x3 = 500 + outerRadius * Math.cos(endAngle);
  const y3 = 500 + outerRadius * Math.sin(endAngle);
  const x4 = 500 + innerRadius * Math.cos(endAngle);
  const y4 = 500 + innerRadius * Math.sin(endAngle);

  // Large arc flag (1 if angle > 180)
  const largeArc = width > 180 ? 1 : 0;

  return `
    M ${x1} ${y1}
    L ${x2} ${y2}
    A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3}
    L ${x4} ${y4}
    A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1}
    Z
  `;
}

/**
 * Generate complete SVG map for a stadium
 */
async function generateStadiumSVG(stadiumId: string): Promise<string> {
  console.log(`\n🏟️  Generating SVG map for ${stadiumId}...`);

  const seatDataStadiumId = getSeatDataStadiumId(stadiumId);
  const sectionsDir = path.join(
    process.cwd(),
    'src',
    'data',
    'seatData',
    seatDataStadiumId,
    'sections'
  );

  if (!fs.existsSync(sectionsDir)) {
    throw new Error(`No sections directory found for ${stadiumId}`);
  }

  // Read all sections
  const sectionFiles = fs
    .readdirSync(sectionsDir)
    .filter((f) => f.endsWith('.ts') && f !== '_template.ts');

  const sections: SectionLayout[] = [];

  for (const file of sectionFiles) {
    const sectionId = file.replace('.ts', '');
    const level = extractLevel(sectionId);
    const position = calculateSectionPosition(sectionId, level);

    // Read seat count from file
    const filePath = path.join(sectionsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const seatsMatch = content.match(/totalSeats:\s*(\d+)/);
    const seats = seatsMatch ? parseInt(seatsMatch[1]) : 0;

    sections.push({
      id: sectionId,
      level,
      ...position,
      seats,
    });
  }

  console.log(`✓ Processed ${sections.length} sections`);

  // Generate SVG
  const levelColors: Record<string, string> = {
    field: '#2563eb',    // Blue
    club: '#7c3aed',     // Purple
    loge: '#0891b2',     // Cyan
    reserve: '#059669',  // Green
    upper: '#ea580c',    // Orange
    pavilion: '#dc2626', // Red
    other: '#6b7280',    // Gray
  };

  const svgSections = sections.map((section) => {
    const path = generateSectionPath(section);
    const color = levelColors[section.level] || '#6b7280';

    return `
      <g class="section" data-section-id="${section.id}" data-level="${section.level}">
        <path
          d="${path}"
          fill="${color}"
          fill-opacity="0.6"
          stroke="#1f2937"
          stroke-width="1"
          class="section-path"
          data-section="${section.id}"
        />
        <title>${section.id} (${section.seats} seats)</title>
      </g>
    `;
  }).join('\n');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" class="stadium-map">
  <defs>
    <style>
      .section-path {
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .section-path:hover {
        fill-opacity: 0.9;
        stroke-width: 2;
        stroke: #ffffff;
      }
      .field {
        fill: #22c55e;
      }
    </style>
  </defs>

  <!-- Baseball field -->
  <circle cx="500" cy="500" r="150" class="field" fill="#22c55e" opacity="0.3" />
  <circle cx="500" cy="500" r="120" fill="#a16207" opacity="0.2" />

  <!-- Home plate indicator -->
  <circle cx="500" cy="580" r="5" fill="#dc2626" />

  <!-- Sections -->
  ${svgSections}

  <!-- Legend -->
  <g transform="translate(800, 50)">
    <text x="0" y="0" font-size="14" font-weight="bold" fill="#1f2937">Levels</text>
    <rect x="0" y="10" width="20" height="20" fill="${levelColors.field}" opacity="0.6" />
    <text x="25" y="25" font-size="12" fill="#1f2937">Field</text>
    <rect x="0" y="35" width="20" height="20" fill="${levelColors.club}" opacity="0.6" />
    <text x="25" y="50" font-size="12" fill="#1f2937">Club</text>
    <rect x="0" y="60" width="20" height="20" fill="${levelColors.loge}" opacity="0.6" />
    <text x="25" y="75" font-size="12" fill="#1f2937">Loge</text>
    <rect x="0" y="85" width="20" height="20" fill="${levelColors.reserve}" opacity="0.6" />
    <text x="25" y="100" font-size="12" fill="#1f2937">Reserve</text>
    <rect x="0" y="110" width="20" height="20" fill="${levelColors.upper}" opacity="0.6" />
    <text x="25" y="125" font-size="12" fill="#1f2937">Upper</text>
    <rect x="0" y="135" width="20" height="20" fill="${levelColors.pavilion}" opacity="0.6" />
    <text x="25" y="150" font-size="12" fill="#1f2937">Pavilion</text>
  </g>
</svg>`;

  return svg;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const stadiumArg = args.find((arg) => arg.startsWith('--stadium='));

  if (!stadiumArg) {
    console.error('❌ Please specify a stadium: --stadium=dodgers');
    process.exit(1);
  }

  const stadiumId = stadiumArg.split('=')[1];
  const stadium = MLB_STADIUMS.find((s) => s.id === stadiumId);

  if (!stadium) {
    console.error(`❌ Stadium not found: ${stadiumId}`);
    process.exit(1);
  }

  try {
    const svg = await generateStadiumSVG(stadiumId);

    // Save to public directory
    const outputDir = path.join(process.cwd(), 'public', 'stadiums', 'maps');
    const outputPath = path.join(outputDir, `${stadiumId}.svg`);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, svg, 'utf-8');

    const fileSizeKB = (fs.statSync(outputPath).size / 1024).toFixed(2);
    console.log(`\n✅ Stadium SVG map generated successfully!`);
    console.log(`  File: ${outputPath}`);
    console.log(`  Size: ${fileSizeKB} KB`);

  } catch (error) {
    console.error('❌ Error generating SVG:', error);
    process.exit(1);
  }
}

main();
