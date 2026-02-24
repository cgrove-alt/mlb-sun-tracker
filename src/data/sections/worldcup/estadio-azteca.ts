// Estadio Azteca (Mexico City) - COMPLETE Section Data for 2026 World Cup
// Capacity: 87,523 seats across 100 sections with FULL 360° coverage
// Historic venue - hosted 1970 and 1986 World Cup Finals, will host 2026 opening match
// Based on: https://stadiumdb.com/stadiums/mex/estadio_azteca
// Data sources: StadiumDB, FourFourTwo, FIFA Official

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
  const rowHeight = 2.6;
  const rowDepth = 2.9;

  const isLetterRows = typeof startRow === 'string';

  if (isLetterRows) {
    const startCode = (startRow as string).charCodeAt(0);
    const endCode = (endRow as string).charCodeAt(0);

    for (let i = startCode; i <= endCode; i++) {
      const rowNum = i - startCode;
      rows.push({
        rowNumber: String.fromCharCode(i),
        seats: seatsPerRow - Math.floor(rowNum * 0.09),
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 40 - (rowNum * 0.28) : undefined
      });
    }
  } else {
    for (let i = startRow as number; i <= (endRow as number); i++) {
      const rowNum = i - (startRow as number);
      rows.push({
        rowNumber: i.toString(),
        seats: seatsPerRow - Math.floor(rowNum * 0.09),
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 40 - (rowNum * 0.28) : undefined
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

// Estadio Azteca sections - Complete 100-section coverage for 87,523 capacity
// FULL 360° COVERAGE: Lower Bowl (40×9°), Middle Bowl (40×9°), Upper Bowl (20×18°)
export const estadioaztecaSections: DetailedSection[] = [
  // ===== LOWER BOWL (Platea Baja) - 40 sections (9° each = 360° FULL COVERAGE), ~35,000 seats =====
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `${101 + i}`,
    name: `Platea Baja ${101 + i}`,
    level: 'lower' as const,
    baseAngle: i * 9,
    angleSpan: 9,
    rows: generateRows(1, 28, 34 + (i % 4), 0, 26, false),
    vertices3D: generateVertices(i * 9, 9, 70, 90, 0, 18),
    covered: false,
    distance: 75,
    height: 0,
    rake: 26,
    price: (i >= 15 && i <= 25) ? 'luxury' as const : (i % 2 === 0) ? 'premium' as const : 'moderate' as const
  })),

  // ===== MIDDLE BOWL (Platea Media) - 40 sections (9° each = 360° FULL COVERAGE), ~35,000 seats =====
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `${201 + i}`,
    name: `Platea Media ${201 + i}`,
    level: 'club' as const,
    baseAngle: i * 9,
    angleSpan: 9,
    rows: generateRows(29, 50, 34 + (i % 4), 20, 28, true),
    vertices3D: generateVertices(i * 9, 9, 92, 116, 18, 38),
    covered: true,
    distance: 100,
    height: 20,
    rake: 28,
    price: (i >= 15 && i <= 25) ? 'luxury' as const : (i % 2 === 0) ? 'moderate' as const : 'value' as const
  })),

  // ===== UPPER BOWL (Platea Alta/Graderia) - 20 sections (18° each = 360° FULL COVERAGE), ~17,500 seats =====
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `${301 + i}`,
    name: `Platea Alta ${301 + i}`,
    level: 'upper' as const,
    baseAngle: i * 18,
    angleSpan: 18,
    rows: generateRows(51, 75, 36 + (i % 3), 40, 32, true),
    vertices3D: generateVertices(i * 18, 18, 118, 148, 38, 62),
    covered: true,
    distance: 130,
    height: 40,
    rake: 32,
    price: 'value' as const
  }))
];
