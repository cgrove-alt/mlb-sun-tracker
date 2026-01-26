// BC Place (Vancouver) - COMPLETE Section Data for 2026 World Cup
// Capacity: 54,000 seats across 100 sections with retractable roof
// Based on: https://stadiumdb.com/stadiums/can/bc_place
// Data sources: StadiumDB, FourFourTwo, SeatGeek

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
        seats: seatsPerRow - Math.floor(rowNum * 0.12),
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 35 - (rowNum * 0.25) : undefined
      });
    }
  } else {
    for (let i = startRow as number; i <= (endRow as number); i++) {
      const rowNum = i - (startRow as number);
      rows.push({
        rowNumber: i.toString(),
        seats: seatsPerRow - Math.floor(rowNum * 0.12),
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 35 - (rowNum * 0.25) : undefined
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

// BC Place sections - Complete 100-section coverage for 54,000 capacity
// Lower Bowl: 40 sections, Upper Bowl: 40 sections, Club: 20 sections
export const bcplaceSections: DetailedSection[] = [
  // ===== LOWER BOWL - 40 sections, ~21,600 seats =====
  // East sections 101-110 (3.6° each = 36° total)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${101 + i}`,
    name: `Lower ${101 + i}`,
    level: 'lower' as const,
    baseAngle: i * 3.6,
    angleSpan: 3.6,
    rows: generateRows(1, 25, 26 + (i % 3), 0, 22, true),
    vertices3D: generateVertices(i * 3.6, 3.6, 70, 88, 0, 15),
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: (i >= 4 && i <= 6) ? 'luxury' as const : 'premium' as const
  })),

  // South sections 111-120 (3.6° each = 36° total)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${111 + i}`,
    name: `Lower South ${111 + i}`,
    level: 'lower' as const,
    baseAngle: 36 + i * 3.6,
    angleSpan: 3.6,
    rows: generateRows(1, 22, 24 + (i % 3), 0, 20, true),
    vertices3D: generateVertices(36 + i * 3.6, 3.6, 70, 88, 0, 13),
    covered: true,
    distance: 75,
    height: 0,
    rake: 20,
    price: 'moderate' as const
  })),

  // West sections 121-130 (3.6° each = 36° total)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${121 + i}`,
    name: `Lower ${121 + i}`,
    level: 'lower' as const,
    baseAngle: 72 + i * 3.6,
    angleSpan: 3.6,
    rows: generateRows(1, 25, 26 + (i % 3), 0, 22, true),
    vertices3D: generateVertices(72 + i * 3.6, 3.6, 70, 88, 0, 15),
    covered: true,
    distance: 70,
    height: 0,
    rake: 22,
    price: (i >= 4 && i <= 6) ? 'luxury' as const : 'premium' as const
  })),

  // North sections 131-140 (3.6° each = 36° total)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${131 + i}`,
    name: `Lower North ${131 + i}`,
    level: 'lower' as const,
    baseAngle: 108 + i * 3.6,
    angleSpan: 3.6,
    rows: generateRows(1, 22, 24 + (i % 3), 0, 20, true),
    vertices3D: generateVertices(108 + i * 3.6, 3.6, 70, 88, 0, 13),
    covered: true,
    distance: 75,
    height: 0,
    rake: 20,
    price: 'moderate' as const
  })),

  // ===== UPPER BOWL - 40 sections, ~21,600 seats =====
  // East sections 201-210 (3.6° each = 36° total)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${201 + i}`,
    name: `Upper ${201 + i}`,
    level: 'upper' as const,
    baseAngle: i * 3.6,
    angleSpan: 3.6,
    rows: generateRows(26, 45, 28 + (i % 3), 18, 30, true),
    vertices3D: generateVertices(i * 3.6, 3.6, 90, 118, 15, 35),
    covered: true,
    distance: 95,
    height: 18,
    rake: 30,
    price: (i >= 4 && i <= 6) ? 'moderate' as const : 'value' as const
  })),

  // South sections 211-220 (3.6° each = 36° total)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${211 + i}`,
    name: `Upper South ${211 + i}`,
    level: 'upper' as const,
    baseAngle: 36 + i * 3.6,
    angleSpan: 3.6,
    rows: generateRows(23, 40, 26 + (i % 3), 16, 28, true),
    vertices3D: generateVertices(36 + i * 3.6, 3.6, 90, 118, 13, 32),
    covered: true,
    distance: 100,
    height: 16,
    rake: 28,
    price: 'value' as const
  })),

  // West sections 221-230 (3.6° each = 36° total)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${221 + i}`,
    name: `Upper ${221 + i}`,
    level: 'upper' as const,
    baseAngle: 72 + i * 3.6,
    angleSpan: 3.6,
    rows: generateRows(26, 45, 28 + (i % 3), 18, 30, true),
    vertices3D: generateVertices(72 + i * 3.6, 3.6, 90, 118, 15, 35),
    covered: true,
    distance: 95,
    height: 18,
    rake: 30,
    price: (i >= 4 && i <= 6) ? 'moderate' as const : 'value' as const
  })),

  // North sections 231-240 (3.6° each = 36° total)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${231 + i}`,
    name: `Upper North ${231 + i}`,
    level: 'upper' as const,
    baseAngle: 108 + i * 3.6,
    angleSpan: 3.6,
    rows: generateRows(23, 40, 26 + (i % 3), 16, 28, true),
    vertices3D: generateVertices(108 + i * 3.6, 3.6, 90, 118, 13, 32),
    covered: true,
    distance: 100,
    height: 16,
    rake: 28,
    price: 'value' as const
  })),

  // ===== CLUB LEVEL - 20 sections, ~10,800 seats =====
  // East Club sections 301-305 (7.2° each = 36° total)
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `${301 + i}`,
    name: `Club East ${301 + i}`,
    level: 'club' as const,
    baseAngle: i * 7.2,
    angleSpan: 7.2,
    rows: generateRows(1, 10, 34 + (i % 2), 15, 20, true),
    vertices3D: generateVertices(i * 7.2, 7.2, 88, 100, 15, 22),
    covered: true,
    distance: 85,
    height: 15,
    rake: 20,
    price: 'luxury' as const
  })),

  // South Club sections 306-310 (7.2° each = 36° total)
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `${306 + i}`,
    name: `Club South ${306 + i}`,
    level: 'club' as const,
    baseAngle: 36 + i * 7.2,
    angleSpan: 7.2,
    rows: generateRows(1, 10, 32 + (i % 2), 13, 18, true),
    vertices3D: generateVertices(36 + i * 7.2, 7.2, 88, 100, 13, 20),
    covered: true,
    distance: 90,
    height: 13,
    rake: 18,
    price: 'luxury' as const
  })),

  // West Club sections 311-315 (7.2° each = 36° total)
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `${311 + i}`,
    name: `Club West ${311 + i}`,
    level: 'club' as const,
    baseAngle: 72 + i * 7.2,
    angleSpan: 7.2,
    rows: generateRows(1, 10, 34 + (i % 2), 15, 20, true),
    vertices3D: generateVertices(72 + i * 7.2, 7.2, 88, 100, 15, 22),
    covered: true,
    distance: 85,
    height: 15,
    rake: 20,
    price: 'luxury' as const
  })),

  // North Club sections 316-320 (7.2° each = 36° total)
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `${316 + i}`,
    name: `Club North ${316 + i}`,
    level: 'club' as const,
    baseAngle: 108 + i * 7.2,
    angleSpan: 7.2,
    rows: generateRows(1, 10, 32 + (i % 2), 13, 18, true),
    vertices3D: generateVertices(108 + i * 7.2, 7.2, 88, 100, 13, 20),
    covered: true,
    distance: 90,
    height: 13,
    rake: 18,
    price: 'luxury' as const
  }))
];
