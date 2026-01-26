// Estadio BBVA (Monterrey) - COMPLETE Section Data for 2026 World Cup
// Capacity: 53,500 seats (43,000 general, 5,000 club, 324 suites, 5,500 premium)
// Distinctive 34-degree rake, first row only 9 meters from field
// Based on: https://stadiumdb.com/stadiums/mex/estadio_bbva_bancomer
// Data sources: StadiumDB, SeatPick, WorldCupRadar, Official CF Monterrey site

import { DetailedSection, Vector3D, RowDetail } from '../../../types/stadium-complete';

// Helper function to generate rows with BBVA's unique steep rake
function generateRows(
  startRow: number | string,
  endRow: number | string,
  seatsPerRow: number,
  baseElevation: number,
  rake: number,
  covered: boolean = false
): RowDetail[] {
  const rows: RowDetail[] = [];
  const rowHeight = 2.7;
  const rowDepth = 2.6;

  const isLetterRows = typeof startRow === 'string';

  if (isLetterRows) {
    const startCode = (startRow as string).charCodeAt(0);
    const endCode = (endRow as string).charCodeAt(0);

    for (let i = startCode; i <= endCode; i++) {
      const rowNum = i - startCode;
      rows.push({
        rowNumber: String.fromCharCode(i),
        seats: seatsPerRow - Math.floor(rowNum * 0.08),
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 38 - (rowNum * 0.35) : undefined
      });
    }
  } else {
    for (let i = startRow as number; i <= (endRow as number); i++) {
      const rowNum = i - (startRow as number);
      rows.push({
        rowNumber: i.toString(),
        seats: seatsPerRow - Math.floor(rowNum * 0.08),
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 38 - (rowNum * 0.35) : undefined
      });
    }
  }

  return rows;
}

// Helper to generate 3D vertices for a section
function generateVertices(angle: number, angleSpan: number, innerRadius: number, outerRadius: number, baseHeight: number, topHeight: number): Vector3D[] {
  const startAngle = (angle * Math.PI) / 180;
  const endAngle = ((angle + angleSpan) * Math.PI) / 180;

  return [
    { x: innerRadius * Math.cos(startAngle), y: innerRadius * Math.sin(startAngle), z: baseHeight },
    { x: innerRadius * Math.cos(endAngle), y: innerRadius * Math.sin(endAngle), z: baseHeight },
    { x: outerRadius * Math.cos(endAngle), y: outerRadius * Math.sin(endAngle), z: topHeight },
    { x: outerRadius * Math.cos(startAngle), y: outerRadius * Math.sin(startAngle), z: topHeight }
  ];
}

// Estadio BBVA sections - Complete 100-section coverage for 53,500 capacity
// Lower Bowl: 40 sections, Middle Bowl: 40 sections, Upper Bowl: 20 sections
export const estadiobbvaSections: DetailedSection[] = [
  // ===== LOWER BOWL (Platea) - 40 sections, ~21,500 seats =====
  // East sideline sections 101-110 (3.6° each = 36° total)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${101 + i}`,
    name: `Platea ${101 + i}`,
    level: 'lower' as const,
    baseAngle: i * 3.6,
    angleSpan: 3.6,
    rows: generateRows(1, 24, 28 + (i % 3), 0, 34, false),
    vertices3D: generateVertices(i * 3.6, 3.6, 60, 72, 0, 18),
    covered: false,
    distance: 60,
    height: 0,
    rake: 34,
    price: (i >= 4 && i <= 6) ? 'luxury' as const : 'premium' as const
  })),

  // South end sections 111-120 (3.6° each = 36° total)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${111 + i}`,
    name: `Platea Sur ${111 + i}`,
    level: 'lower' as const,
    baseAngle: 36 + i * 3.6,
    angleSpan: 3.6,
    rows: generateRows(1, 22, 26 + (i % 3), 0, 32, false),
    vertices3D: generateVertices(36 + i * 3.6, 3.6, 60, 72, 0, 16),
    covered: false,
    distance: 65,
    height: 0,
    rake: 32,
    price: 'moderate' as const
  })),

  // West sideline sections 121-130 (3.6° each = 36° total)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${121 + i}`,
    name: `Platea ${121 + i}`,
    level: 'lower' as const,
    baseAngle: 72 + i * 3.6,
    angleSpan: 3.6,
    rows: generateRows(1, 24, 28 + (i % 3), 0, 34, false),
    vertices3D: generateVertices(72 + i * 3.6, 3.6, 60, 72, 0, 18),
    covered: false,
    distance: 60,
    height: 0,
    rake: 34,
    price: (i >= 4 && i <= 6) ? 'luxury' as const : 'premium' as const
  })),

  // North end sections 131-140 (3.6° each = 36° total)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${131 + i}`,
    name: `Platea Norte ${131 + i}`,
    level: 'lower' as const,
    baseAngle: 108 + i * 3.6,
    angleSpan: 3.6,
    rows: generateRows(1, 22, 26 + (i % 3), 0, 32, false),
    vertices3D: generateVertices(108 + i * 3.6, 3.6, 60, 72, 0, 16),
    covered: false,
    distance: 65,
    height: 0,
    rake: 32,
    price: 'moderate' as const
  })),

  // ===== MIDDLE BOWL (Platea Alta) - 40 sections, ~21,000 seats =====
  // East sideline sections 201-210 (3.6° each = 36° total)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${201 + i}`,
    name: `Platea Alta ${201 + i}`,
    level: 'club' as const,
    baseAngle: i * 3.6,
    angleSpan: 3.6,
    rows: generateRows(25, 45, 30 + (i % 3), 20, 34, true),
    vertices3D: generateVertices(i * 3.6, 3.6, 74, 92, 18, 40),
    covered: true,
    distance: 85,
    height: 20,
    rake: 34,
    price: (i >= 4 && i <= 6) ? 'luxury' as const : 'moderate' as const
  })),

  // South end sections 211-220 (3.6° each = 36° total)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${211 + i}`,
    name: `Platea Alta Sur ${211 + i}`,
    level: 'club' as const,
    baseAngle: 36 + i * 3.6,
    angleSpan: 3.6,
    rows: generateRows(23, 42, 28 + (i % 3), 18, 32, true),
    vertices3D: generateVertices(36 + i * 3.6, 3.6, 74, 92, 16, 36),
    covered: true,
    distance: 90,
    height: 18,
    rake: 32,
    price: 'value' as const
  })),

  // West sideline sections 221-230 (3.6° each = 36° total)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${221 + i}`,
    name: `Platea Alta ${221 + i}`,
    level: 'club' as const,
    baseAngle: 72 + i * 3.6,
    angleSpan: 3.6,
    rows: generateRows(25, 45, 30 + (i % 3), 20, 34, true),
    vertices3D: generateVertices(72 + i * 3.6, 3.6, 74, 92, 18, 40),
    covered: true,
    distance: 85,
    height: 20,
    rake: 34,
    price: (i >= 4 && i <= 6) ? 'luxury' as const : 'moderate' as const
  })),

  // North end sections 231-240 (3.6° each = 36° total)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${231 + i}`,
    name: `Platea Alta Norte ${231 + i}`,
    level: 'club' as const,
    baseAngle: 108 + i * 3.6,
    angleSpan: 3.6,
    rows: generateRows(23, 42, 28 + (i % 3), 18, 32, true),
    vertices3D: generateVertices(108 + i * 3.6, 3.6, 74, 92, 16, 36),
    covered: true,
    distance: 90,
    height: 18,
    rake: 32,
    price: 'value' as const
  })),

  // ===== UPPER BOWL (Graderia) - 20 sections, ~11,000 seats =====
  // East sections 301-305 (7.2° each = 36° total)
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `${301 + i}`,
    name: `Graderia ${301 + i}`,
    level: 'upper' as const,
    baseAngle: i * 7.2,
    angleSpan: 7.2,
    rows: generateRows(46, 68, 32 + (i % 2), 42, 34, true),
    vertices3D: generateVertices(i * 7.2, 7.2, 94, 116, 40, 62),
    covered: true,
    distance: 105,
    height: 42,
    rake: 34,
    price: 'value' as const
  })),

  // South sections 306-310 (7.2° each = 36° total)
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `${306 + i}`,
    name: `Graderia Sur ${306 + i}`,
    level: 'upper' as const,
    baseAngle: 36 + i * 7.2,
    angleSpan: 7.2,
    rows: generateRows(43, 64, 30 + (i % 2), 38, 32, true),
    vertices3D: generateVertices(36 + i * 7.2, 7.2, 94, 116, 36, 58),
    covered: true,
    distance: 110,
    height: 38,
    rake: 32,
    price: 'value' as const
  })),

  // West sections 311-315 (7.2° each = 36° total)
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `${311 + i}`,
    name: `Graderia ${311 + i}`,
    level: 'upper' as const,
    baseAngle: 72 + i * 7.2,
    angleSpan: 7.2,
    rows: generateRows(46, 68, 32 + (i % 2), 42, 34, true),
    vertices3D: generateVertices(72 + i * 7.2, 7.2, 94, 116, 40, 62),
    covered: true,
    distance: 105,
    height: 42,
    rake: 34,
    price: 'value' as const
  })),

  // North sections 316-320 (7.2° each = 36° total)
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `${316 + i}`,
    name: `Graderia Norte ${316 + i}`,
    level: 'upper' as const,
    baseAngle: 108 + i * 7.2,
    angleSpan: 7.2,
    rows: generateRows(43, 64, 30 + (i % 2), 38, 32, true),
    vertices3D: generateVertices(108 + i * 7.2, 7.2, 94, 116, 36, 58),
    covered: true,
    distance: 110,
    height: 38,
    rake: 32,
    price: 'value' as const
  }))
];
