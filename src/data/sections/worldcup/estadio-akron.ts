// Estadio Akron (Guadalajara) - COMPLETE Section Data for 2026 World Cup
// Capacity: 49,850 seats across 100 sections (opened 2010)
// Volcano-inspired architecture with double-tiered bowl
// Based on: https://stadiumdb.com/stadiums/mex/estadio_akron
// Data sources: StadiumDB, SeatPick, WorldCupRadar

import { DetailedSection, Vector3D, RowDetail } from '../../../types/stadium-complete';

// Helper function to generate rows
function generateRows(
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
        seats: seatsPerRow - Math.floor(rowNum * 0.1),
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 32 - (rowNum * 0.3) : undefined
      });
    }
  } else {
    for (let i = startRow as number; i <= (endRow as number); i++) {
      const rowNum = i - (startRow as number);
      rows.push({
        rowNumber: i.toString(),
        seats: seatsPerRow - Math.floor(rowNum * 0.1),
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 32 - (rowNum * 0.3) : undefined
      });
    }
  }

  return rows;
}

// Helper to generate 3D vertices
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

// Estadio Akron sections - Complete 100-section coverage for 49,850 capacity
// Lower Bowl: 40 sections, Upper Bowl: 60 sections (volcanic design = steeper upper)
export const estadioakronSections: DetailedSection[] = [
  // ===== LOWER BOWL (Platea Baja) - 40 sections, ~19,940 seats =====
  // East sideline sections 101-110 (3.6° each = 36° total)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${101 + i}`,
    name: `Platea Baja ${101 + i}`,
    level: 'lower' as const,
    baseAngle: i * 3.6,
    angleSpan: 3.6,
    rows: generateRows(1, 22, 27 + (i % 3), 0, 24, false),
    vertices3D: generateVertices(i * 3.6, 3.6, 65, 78, 0, 14),
    covered: false,
    distance: 65,
    height: 0,
    rake: 24,
    price: (i >= 4 && i <= 6) ? 'luxury' as const : 'premium' as const
  })),

  // South end sections 111-120 (3.6° each = 36° total)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${111 + i}`,
    name: `Platea Baja Sur ${111 + i}`,
    level: 'lower' as const,
    baseAngle: 36 + i * 3.6,
    angleSpan: 3.6,
    rows: generateRows(1, 20, 25 + (i % 3), 0, 22, false),
    vertices3D: generateVertices(36 + i * 3.6, 3.6, 65, 78, 0, 12),
    covered: false,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'moderate' as const
  })),

  // West sideline sections 121-130 (3.6° each = 36° total)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${121 + i}`,
    name: `Platea Baja ${121 + i}`,
    level: 'lower' as const,
    baseAngle: 72 + i * 3.6,
    angleSpan: 3.6,
    rows: generateRows(1, 22, 27 + (i % 3), 0, 24, false),
    vertices3D: generateVertices(72 + i * 3.6, 3.6, 65, 78, 0, 14),
    covered: false,
    distance: 65,
    height: 0,
    rake: 24,
    price: (i >= 4 && i <= 6) ? 'luxury' as const : 'premium' as const
  })),

  // North end sections 131-140 (3.6° each = 36° total)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${131 + i}`,
    name: `Platea Baja Norte ${131 + i}`,
    level: 'lower' as const,
    baseAngle: 108 + i * 3.6,
    angleSpan: 3.6,
    rows: generateRows(1, 20, 25 + (i % 3), 0, 22, false),
    vertices3D: generateVertices(108 + i * 3.6, 3.6, 65, 78, 0, 12),
    covered: false,
    distance: 70,
    height: 0,
    rake: 22,
    price: 'moderate' as const
  })),

  // ===== UPPER BOWL (Platea Alta) - 60 sections, ~29,910 seats =====
  // East sideline sections 201-215 (2.4° each = 36° total)
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `${201 + i}`,
    name: `Platea Alta ${201 + i}`,
    level: 'upper' as const,
    baseAngle: i * 2.4,
    angleSpan: 2.4,
    rows: generateRows(23, 40, 29 + (i % 2), 16, 30, true),
    vertices3D: generateVertices(i * 2.4, 2.4, 80, 98, 14, 32),
    covered: true,
    distance: 88,
    height: 16,
    rake: 30,
    price: (i >= 6 && i <= 9) ? 'moderate' as const : 'value' as const
  })),

  // South end sections 216-230 (2.4° each = 36° total)
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `${216 + i}`,
    name: `Platea Alta Sur ${216 + i}`,
    level: 'upper' as const,
    baseAngle: 36 + i * 2.4,
    angleSpan: 2.4,
    rows: generateRows(21, 38, 27 + (i % 2), 14, 28, true),
    vertices3D: generateVertices(36 + i * 2.4, 2.4, 80, 98, 12, 30),
    covered: true,
    distance: 95,
    height: 14,
    rake: 28,
    price: 'value' as const
  })),

  // West sideline sections 231-245 (2.4° each = 36° total)
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `${231 + i}`,
    name: `Platea Alta ${231 + i}`,
    level: 'upper' as const,
    baseAngle: 72 + i * 2.4,
    angleSpan: 2.4,
    rows: generateRows(23, 40, 29 + (i % 2), 16, 30, true),
    vertices3D: generateVertices(72 + i * 2.4, 2.4, 80, 98, 14, 32),
    covered: true,
    distance: 88,
    height: 16,
    rake: 30,
    price: (i >= 6 && i <= 9) ? 'moderate' as const : 'value' as const
  })),

  // North end sections 246-260 (2.4° each = 36° total)
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `${246 + i}`,
    name: `Platea Alta Norte ${246 + i}`,
    level: 'upper' as const,
    baseAngle: 108 + i * 2.4,
    angleSpan: 2.4,
    rows: generateRows(21, 38, 27 + (i % 2), 14, 28, true),
    vertices3D: generateVertices(108 + i * 2.4, 2.4, 80, 98, 12, 30),
    covered: true,
    distance: 95,
    height: 14,
    rake: 28,
    price: 'value' as const
  }))
];
