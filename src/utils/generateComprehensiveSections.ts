// Comprehensive Section Generator for All Stadiums
// This utility generates detailed sections with accurate 3D geometry for sun calculations

import { DetailedSection, Vector3D, RowDetail } from '../types/stadium-complete';

// Helper function to generate rows
export function generateRows(
  startRow: number | string,
  endRow: number | string,
  seatsPerRow: number,
  baseElevation: number,
  rake: number,
  covered: boolean = false
): RowDetail[] {
  const rows: RowDetail[] = [];
  const rowHeight = 2.5;
  const rowDepth = 2.8;
  
  const isLetterRows = typeof startRow === 'string';
  
  if (isLetterRows) {
    const startCode = (startRow as string).charCodeAt(0);
    const endCode = (endRow as string).charCodeAt(0);
    
    for (let i = startCode; i <= endCode; i++) {
      const rowNum = i - startCode;
      rows.push({
        rowNumber: String.fromCharCode(i),
        seats: seatsPerRow - Math.floor(rowNum * 0.2), // Slight reduction in upper rows
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 30 - (rowNum * 0.3) : undefined
      });
    }
  } else {
    for (let i = startRow as number; i <= (endRow as number); i++) {
      const rowNum = i - (startRow as number);
      rows.push({
        rowNumber: i.toString(),
        seats: seatsPerRow - Math.floor(rowNum * 0.2),
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 30 - (rowNum * 0.3) : undefined
      });
    }
  }
  
  return rows;
}

// Generate 3D vertices for a section based on polar coordinates
export function generateSectionVertices(
  baseAngle: number,
  angleSpan: number,
  innerRadius: number,
  outerRadius: number,
  baseHeight: number,
  topHeight: number
): Vector3D[] {
  const toRad = (deg: number) => deg * Math.PI / 180;
  
  return [
    // Inner lower corner
    {
      x: innerRadius * Math.cos(toRad(baseAngle)),
      y: innerRadius * Math.sin(toRad(baseAngle)),
      z: baseHeight
    },
    // Inner lower corner (end of span)
    {
      x: innerRadius * Math.cos(toRad(baseAngle + angleSpan)),
      y: innerRadius * Math.sin(toRad(baseAngle + angleSpan)),
      z: baseHeight
    },
    // Outer upper corner (end of span)
    {
      x: outerRadius * Math.cos(toRad(baseAngle + angleSpan)),
      y: outerRadius * Math.sin(toRad(baseAngle + angleSpan)),
      z: topHeight
    },
    // Outer upper corner
    {
      x: outerRadius * Math.cos(toRad(baseAngle)),
      y: outerRadius * Math.sin(toRad(baseAngle)),
      z: topHeight
    }
  ];
}

// Generate comprehensive sections for an MLB stadium
export function generateMLBSections(
  stadiumId: string,
  orientation: number,
  capacity: number
): DetailedSection[] {
  const sections: DetailedSection[] = [];
  let sectionCounter = 100;
  
  // Premium Field Level (Behind Home Plate) - 6 sections
  for (let i = 0; i < 6; i++) {
    const angle = (orientation - 15 + (i * 5) + 360) % 360;
    sections.push({
      id: `${sectionCounter + i}`,
      name: `Field Level ${sectionCounter + i}`,
      level: 'field',
      baseAngle: angle,
      angleSpan: 5,
      rows: generateRows('A', 'N', 18, 0, 18, false),
      vertices3D: generateSectionVertices(angle, 5, 50, 68, 0, 8),
      covered: false,
      distance: 55,
      height: 0,
      rake: 18
    });
  }
  sectionCounter += 10;
  
  // Field Level (Baselines) - 12 sections
  for (let i = 0; i < 12; i++) {
    const side = i < 6 ? 1 : -1;
    const offset = i < 6 ? i : i - 6;
    const angle = (orientation + side * (20 + offset * 8) + 360) % 360;
    sections.push({
      id: `${sectionCounter + i}`,
      name: `Field Level ${sectionCounter + i}`,
      level: 'field',
      baseAngle: angle,
      angleSpan: 8,
      rows: generateRows('A', 'V', 22, 0, 20, false),
      vertices3D: generateSectionVertices(angle, 8, 55, 85, 0, 12),
      covered: false,
      distance: 65,
      height: 0,
      rake: 20
    });
  }
  sectionCounter += 20;
  
  // Lower Level - 14 sections
  for (let i = 0; i < 14; i++) {
    const angle = (orientation - 35 + (i * 5) + 360) % 360;
    sections.push({
      id: `${sectionCounter + i}`,
      name: `Lower Level ${sectionCounter + i}`,
      level: 'lower',
      baseAngle: angle,
      angleSpan: 5,
      rows: generateRows(1, 32, 24, 15, 24, false),
      vertices3D: generateSectionVertices(angle, 5, 85, 125, 15, 38),
      covered: false,
      distance: 95,
      height: 15,
      rake: 24
    });
  }
  sectionCounter = 200;
  
  // Club Level - 8 sections
  for (let i = 0; i < 8; i++) {
    const angle = (orientation - 20 + (i * 5) + 360) % 360;
    sections.push({
      id: `CL-${300 + i}`,
      name: `Club Level ${300 + i}`,
      level: 'club',
      baseAngle: angle,
      angleSpan: 5,
      rows: generateRows('A', 'L', 20, 30, 26, true),
      vertices3D: generateSectionVertices(angle, 5, 125, 150, 30, 45),
      covered: true,
      distance: 135,
      height: 30,
      rake: 26
    });
  }
  
  // Upper Level - 12 sections
  sectionCounter = 400;
  for (let i = 0; i < 12; i++) {
    const angle = (orientation - 30 + (i * 5) + 360) % 360;
    const covered = i >= 2 && i <= 9; // Partial coverage
    sections.push({
      id: `${sectionCounter + i}`,
      name: `Upper Level ${sectionCounter + i}`,
      level: 'upper',
      baseAngle: angle,
      angleSpan: 5,
      rows: generateRows(1, 35, 26, 40, 28, covered),
      vertices3D: generateSectionVertices(angle, 5, 150, 200, 40, 78),
      covered: covered,
      distance: 175,
      height: 40,
      rake: 28
    });
  }
  
  // Outfield/Bleacher sections - 8 sections
  const outfieldAngles = [
    orientation + 70, orientation + 85, orientation + 100, orientation + 115,
    orientation - 70, orientation - 85, orientation - 100, orientation - 115
  ];
  
  outfieldAngles.forEach((angle, i) => {
    const normalizedAngle = (angle + 360) % 360;
    sections.push({
      id: `BL-${140 + i}`,
      name: `Bleachers ${140 + i}`,
      level: 'field',
      baseAngle: normalizedAngle,
      angleSpan: 12,
      rows: generateRows('A', 'T', 24, 8, 20, false),
      vertices3D: generateSectionVertices(normalizedAngle, 12, 200, 245, 8, 25),
      covered: false,
      distance: 220,
      height: 8,
      rake: 20
    });
  });
  
  // Suite Level - 4 sections
  for (let i = 0; i < 4; i++) {
    const angle = (orientation - 10 + (i * 5) + 360) % 360;
    sections.push({
      id: `SUITE-${i + 1}`,
      name: `Suite ${i + 1}`,
      level: 'suite',
      baseAngle: angle,
      angleSpan: 5,
      rows: [{ rowNumber: "1", seats: 20, elevation: 35, depth: 0, covered: true }],
      vertices3D: generateSectionVertices(angle, 5, 140, 160, 35, 35),
      covered: true,
      distance: 150,
      height: 35,
      rake: 0
    });
  }
  
  // Standing Room / Party Areas - 2 sections
  sections.push({
    id: 'PARTY-DECK',
    name: 'Party Deck',
    level: 'standing',
    baseAngle: (orientation + 130) % 360,
    angleSpan: 20,
    rows: [],
    vertices3D: generateSectionVertices((orientation + 130) % 360, 20, 245, 265, 25, 25),
    covered: false,
    distance: 255,
    height: 25,
    rake: 0
  });
  
  return sections;
}

// Generate comprehensive sections for a MiLB stadium
export function generateMiLBSections(
  stadiumId: string,
  orientation: number,
  capacity: number,
  level: 'AAA' | 'AA' | 'High-A' | 'Low-A'
): DetailedSection[] {
  const sections: DetailedSection[] = [];
  
  // Scale sections based on level
  const sectionCounts = {
    'AAA': { field: 10, lower: 8, upper: 6, bleachers: 4 },
    'AA': { field: 8, lower: 6, upper: 4, bleachers: 4 },
    'High-A': { field: 6, lower: 4, upper: 2, bleachers: 4 },
    'Low-A': { field: 6, lower: 4, upper: 0, bleachers: 4 }
  };
  
  const config = sectionCounts[level];
  let sectionId = 100;
  
  // Field Level sections
  for (let i = 0; i < config.field; i++) {
    const angle = (orientation - 30 + (i * 60 / config.field) + 360) % 360;
    sections.push({
      id: `${sectionId++}`,
      name: `Field ${sectionId - 1}`,
      level: 'field',
      baseAngle: angle,
      angleSpan: 60 / config.field,
      rows: generateRows('A', 'P', 20, 0, 18, false),
      vertices3D: generateSectionVertices(angle, 60 / config.field, 40, 65, 0, 10),
      covered: false,
      distance: 50,
      height: 0,
      rake: 18
    });
  }
  
  // Lower Level sections
  sectionId = 200;
  for (let i = 0; i < config.lower; i++) {
    const angle = (orientation - 25 + (i * 50 / config.lower) + 360) % 360;
    sections.push({
      id: `${sectionId++}`,
      name: `Lower ${sectionId - 1}`,
      level: 'lower',
      baseAngle: angle,
      angleSpan: 50 / config.lower,
      rows: generateRows(1, 25, 22, 12, 22, false),
      vertices3D: generateSectionVertices(angle, 50 / config.lower, 65, 95, 12, 28),
      covered: false,
      distance: 75,
      height: 12,
      rake: 22
    });
  }
  
  // Upper Level sections (if applicable)
  if (config.upper > 0) {
    sectionId = 300;
    for (let i = 0; i < config.upper; i++) {
      const angle = (orientation - 20 + (i * 40 / config.upper) + 360) % 360;
      sections.push({
        id: `${sectionId++}`,
        name: `Upper ${sectionId - 1}`,
        level: 'upper',
        baseAngle: angle,
        angleSpan: 40 / config.upper,
        rows: generateRows(1, 20, 24, 28, 26, i < 2),
        vertices3D: generateSectionVertices(angle, 40 / config.upper, 95, 130, 28, 50),
        covered: i < 2,
        distance: 110,
        height: 28,
        rake: 26
      });
    }
  }
  
  // Bleacher sections
  const bleacherAngles = [
    orientation + 60, orientation + 80,
    orientation - 60, orientation - 80
  ];
  
  bleacherAngles.forEach((angle, i) => {
    const normalizedAngle = (angle + 360) % 360;
    sections.push({
      id: `BL-${i + 1}`,
      name: `Bleachers ${i + 1}`,
      level: 'field',
      baseAngle: normalizedAngle,
      angleSpan: 15,
      rows: generateRows('A', 'N', 22, 5, 18, false),
      vertices3D: generateSectionVertices(normalizedAngle, 15, 130, 165, 5, 20),
      covered: false,
      distance: 145,
      height: 5,
      rake: 18
    });
  });
  
  // Add a berm/lawn area for modern MiLB stadiums
  sections.push({
    id: 'BERM',
    name: 'Outfield Berm',
    level: 'standing',
    baseAngle: (orientation + 180) % 360,
    angleSpan: 30,
    rows: [],
    vertices3D: generateSectionVertices((orientation + 180) % 360, 30, 165, 190, 10, 10),
    covered: false,
    distance: 177,
    height: 10,
    rake: 0
  });
  
  return sections;
}

// Generate comprehensive sections for an NFL stadium
export function generateNFLSections(
  stadiumId: string,
  orientation: number,
  capacity: number,
  hasRoof: boolean
): DetailedSection[] {
  const sections: DetailedSection[] = [];
  let sectionId = 100;
  
  // Field Level - 16 sections (surrounding the field)
  for (let i = 0; i < 16; i++) {
    const angle = (i * 22.5 + orientation) % 360;
    sections.push({
      id: `${sectionId++}`,
      name: `Field ${sectionId - 1}`,
      level: 'field',
      baseAngle: angle,
      angleSpan: 22.5,
      rows: generateRows('A', 'X', 25, 0, 22, false),
      vertices3D: generateSectionVertices(angle, 22.5, 60, 95, 0, 15),
      covered: false,
      distance: 75,
      height: 0,
      rake: 22
    });
  }
  
  // Lower Bowl - 20 sections
  sectionId = 200;
  for (let i = 0; i < 20; i++) {
    const angle = (i * 18 + orientation) % 360;
    sections.push({
      id: `${sectionId++}`,
      name: `Lower ${sectionId - 1}`,
      level: 'lower',
      baseAngle: angle,
      angleSpan: 18,
      rows: generateRows(1, 38, 28, 18, 25, false),
      vertices3D: generateSectionVertices(angle, 18, 95, 145, 18, 45),
      covered: false,
      distance: 115,
      height: 18,
      rake: 25
    });
  }
  
  // Club Level - 12 sections
  sectionId = 300;
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 + orientation) % 360;
    sections.push({
      id: `CL-${sectionId++}`,
      name: `Club ${sectionId - 1}`,
      level: 'club',
      baseAngle: angle,
      angleSpan: 30,
      rows: generateRows('A', 'M', 22, 35, 27, hasRoof),
      vertices3D: generateSectionVertices(angle, 30, 145, 175, 35, 52),
      covered: hasRoof,
      distance: 160,
      height: 35,
      rake: 27
    });
  }
  
  // Upper Bowl - 20 sections
  sectionId = 500;
  for (let i = 0; i < 20; i++) {
    const angle = (i * 18 + orientation) % 360;
    const covered = hasRoof || (i >= 5 && i <= 14); // Partial coverage
    sections.push({
      id: `${sectionId++}`,
      name: `Upper ${sectionId - 1}`,
      level: 'upper',
      baseAngle: angle,
      angleSpan: 18,
      rows: generateRows(1, 42, 30, 52, 30, covered),
      vertices3D: generateSectionVertices(angle, 18, 175, 245, 52, 95),
      covered: covered,
      distance: 210,
      height: 52,
      rake: 30
    });
  }
  
  // Suite Level - 8 sections
  for (let i = 0; i < 8; i++) {
    const angle = (i * 45 + orientation) % 360;
    sections.push({
      id: `SUITE-${i + 1}`,
      name: `Suite ${i + 1}`,
      level: 'suite',
      baseAngle: angle,
      angleSpan: 45,
      rows: [{ rowNumber: "1", seats: 24, elevation: 42, depth: 0, covered: true }],
      vertices3D: generateSectionVertices(angle, 45, 160, 185, 42, 42),
      covered: true,
      distance: 172,
      height: 42,
      rake: 0
    });
  }
  
  // Standing Room / Party Decks - 4 areas
  const standingAreas = ['North', 'South', 'East', 'West'];
  standingAreas.forEach((area, i) => {
    const angle = (i * 90 + orientation) % 360;
    sections.push({
      id: `DECK-${area}`,
      name: `${area} Party Deck`,
      level: 'standing',
      baseAngle: angle,
      angleSpan: 30,
      rows: [],
      vertices3D: generateSectionVertices(angle, 30, 245, 265, 30, 30),
      covered: hasRoof,
      distance: 255,
      height: 30,
      rake: 0
    });
  });
  
  return sections;
}