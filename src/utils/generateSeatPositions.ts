/**
 * Seat Position Generator
 * Algorithmically generates 3D coordinates for stadium seats
 * Based on section geometry and stadium orientation
 * Created: 2025-10-21
 */

import type { Vector3D } from '@/types/stadium-complete';
import type { Seat, SeatRow, SectionSeatingData } from '@/types/seat';

/**
 * Configuration for generating seats in a section
 */
export interface SeatGenerationConfig {
  // Section identification
  sectionId: string;
  sectionName: string;
  stadiumId: string;

  // Angular position (degrees, 0 = home plate)
  baseAngle: number; // Starting angle of section
  angleSpan: number; // Total degrees this section spans

  // Vertical positioning
  baseElevation: number; // Starting elevation in feet
  rowHeight: number; // Height increase per row (rake)

  // Depth positioning
  startDepth: number; // Distance from home plate to first row (feet)
  rowDepth: number; // Depth of each row (front to back spacing)

  // Row configuration
  rows: {
    rowLabel: string; // 'A', 'B', 'C' or '1', '2', '3'
    seatCount: number; // Number of seats in this row
    rowNumber: number; // Index (0-based)
  }[];

  // Seat dimensions
  seatWidth: number; // Width of each seat in feet (default 2.0)
  seatSpacing: number; // Extra space between seats in feet (default 0.5)
  rowSpacing: number; // Space between rows in inches (default 36)

  // Section properties
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite';
  covered: boolean;
  overhangHeight?: number;
  priceRange?: 'value' | 'moderate' | 'premium' | 'luxury';

  // Accessibility
  wheelchairRows?: string[]; // Which rows are wheelchair accessible
  aisleSeats?: number[]; // Which seat positions are aisle seats (1-based)
}

/**
 * Stadium reference point (home plate at origin)
 */
const HOME_PLATE: Vector3D = { x: 0, y: 0, z: 0 };

/**
 * Convert polar coordinates to Cartesian (3D)
 * @param angle Angle in degrees (0 = behind home plate, 90 = first base)
 * @param distance Radial distance from home plate
 * @param elevation Height above field level
 */
function polarToCartesian(
  angle: number,
  distance: number,
  elevation: number
): Vector3D {
  // Convert angle to radians
  // Adjust so 0° = center field (positive Y), 90° = first base (positive X)
  const radians = ((angle - 90) * Math.PI) / 180;

  return {
    x: distance * Math.cos(radians),
    y: distance * Math.sin(radians),
    z: elevation,
  };
}

/**
 * Calculate distance from home plate based on row depth
 */
function calculateRowDistance(
  startDepth: number,
  rowNumber: number,
  rowDepth: number
): number {
  return startDepth + rowNumber * rowDepth;
}

/**
 * Calculate elevation for a row based on rake
 */
function calculateRowElevation(
  baseElevation: number,
  rowNumber: number,
  rowHeight: number
): number {
  return baseElevation + rowNumber * rowHeight;
}

/**
 * Generate seat number string based on common conventions
 */
function generateSeatNumber(
  seatIndex: number,
  seatCount: number,
  convention: 'odd-even' | 'sequential' = 'sequential'
): string {
  if (convention === 'odd-even') {
    // Odd on left, even on right (common in many stadiums)
    const isLeft = seatIndex < seatCount / 2;
    return isLeft
      ? String(seatIndex * 2 + 1)
      : String((seatIndex - Math.floor(seatCount / 2)) * 2 + 2);
  } else {
    // Sequential 1, 2, 3, ...
    return String(seatIndex + 1);
  }
}

/**
 * Determine seat type based on position
 */
function determineSeatType(
  seatIndex: number,
  seatCount: number,
  aislePositions: number[]
): 'standard' | 'aisle' {
  const seatNumber = seatIndex + 1; // Convert to 1-based
  return aislePositions.includes(seatNumber) ? 'aisle' : 'standard';
}

/**
 * Generate all seats for a single row
 */
function generateRowSeats(
  config: SeatGenerationConfig,
  rowConfig: {
    rowLabel: string;
    seatCount: number;
    rowNumber: number;
  },
  rowDistance: number,
  rowElevation: number
): Seat[] {
  const seats: Seat[] = [];

  // Calculate angular distribution
  // Seats are evenly distributed across the section's angle span
  const anglePerSeat = config.angleSpan / rowConfig.seatCount;
  const startAngle = config.baseAngle - config.angleSpan / 2;

  for (let seatIndex = 0; seatIndex < rowConfig.seatCount; seatIndex++) {
    // Calculate seat angle (center of each seat position)
    const seatAngle = startAngle + anglePerSeat * (seatIndex + 0.5);

    // Calculate 3D position
    const position3D = polarToCartesian(
      seatAngle,
      rowDistance,
      rowElevation
    );

    // Generate seat number
    const seatNumber = generateSeatNumber(
      seatIndex,
      rowConfig.seatCount,
      'sequential'
    );

    // Determine seat type
    const seatType = determineSeatType(
      seatIndex,
      rowConfig.seatCount,
      config.aisleSeats || [1, rowConfig.seatCount]
    );

    // Check if wheelchair row
    const isWheelchairRow =
      config.wheelchairRows?.includes(rowConfig.rowLabel) || false;

    // Generate seat ID
    const seatId = `${config.stadiumId}-${config.sectionId}-${rowConfig.rowLabel}-${seatNumber}`;

    // Calculate distance from home plate
    const distanceFromHomeplate = Math.sqrt(
      Math.pow(position3D.x - HOME_PLATE.x, 2) +
        Math.pow(position3D.y - HOME_PLATE.y, 2)
    );

    // Determine view quality based on level and row
    let viewQuality: 'excellent' | 'good' | 'fair' | 'obstructed' =
      'good';
    if (config.level === 'field' && rowConfig.rowNumber < 5) {
      viewQuality = 'excellent';
    } else if (config.level === 'club') {
      viewQuality = 'excellent';
    } else if (config.level === 'upper' && rowConfig.rowNumber > 20) {
      viewQuality = 'fair';
    }

    const seat: Seat = {
      id: seatId,
      sectionId: config.sectionId,
      row: rowConfig.rowLabel,
      seatNumber,
      position3D,
      elevation: rowElevation,
      distanceFromHomeplate,
      angle: seatAngle,
      facing: (seatAngle + 180) % 360, // Seats face toward the field
      seatType,
      hasArmrests: config.level !== 'suite', // Suites often have different seating
      cupHolders: true, // Most modern stadiums have cup holders
      viewQuality,
      accessibility: {
        wheelchairAccessible: isWheelchairRow && seatType === 'aisle',
        companionSeat: isWheelchairRow && seatType === 'standard',
        requiresStairs: config.level === 'upper' || config.level === 'suite',
        elevatorAccess:
          config.level === 'club' ||
          config.level === 'suite' ||
          config.level === 'field',
      },
      covered: config.covered,
      overhangHeight: config.covered ? config.overhangHeight : undefined,
    };

    seats.push(seat);
  }

  return seats;
}

/**
 * Generate all seats for a section
 */
export function generateSectionSeats(
  config: SeatGenerationConfig
): SectionSeatingData {
  const rows: SeatRow[] = [];

  for (const rowConfig of config.rows) {
    const rowDistance = calculateRowDistance(
      config.startDepth,
      rowConfig.rowNumber,
      config.rowDepth
    );

    const rowElevation = calculateRowElevation(
      config.baseElevation,
      rowConfig.rowNumber,
      config.rowHeight
    );

    const seats = generateRowSeats(
      config,
      rowConfig,
      rowDistance,
      rowElevation
    );

    const row: SeatRow = {
      rowNumber: rowConfig.rowLabel,
      sectionId: config.sectionId,
      seatCount: rowConfig.seatCount,
      elevation: rowElevation,
      depth: rowDistance,
      rowSpacing: config.rowSpacing,
      seats,
      covered: config.covered,
      overhangHeight: config.covered ? config.overhangHeight : undefined,
      hasAisleSeats: (config.aisleSeats?.length || 0) > 0,
      wheelchairRow: config.wheelchairRows?.includes(rowConfig.rowLabel) || false,
    };

    rows.push(row);
  }

  // Calculate totals and distribution
  const totalSeats = rows.reduce((sum, row) => sum + row.seatCount, 0);
  const seatDistribution = {
    standard: 0,
    aisle: 0,
    wheelchair: 0,
    companion: 0,
    other: 0,
  };

  rows.forEach((row) => {
    row.seats.forEach((seat) => {
      if (seat.accessibility.wheelchairAccessible) {
        seatDistribution.wheelchair++;
      } else if (seat.accessibility.companionSeat) {
        seatDistribution.companion++;
      } else if (seat.seatType === 'aisle') {
        seatDistribution.aisle++;
      } else {
        seatDistribution.standard++;
      }
    });
  });

  return {
    sectionId: config.sectionId,
    sectionName: config.sectionName,
    stadiumId: config.stadiumId,
    totalSeats,
    totalRows: rows.length,
    rows,
    seatDistribution,
  };
}

/**
 * Validate generated seat data
 */
export function validateSectionSeats(
  section: SectionSeatingData
): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check total seats
  const calculatedTotal = section.rows.reduce(
    (sum, row) => sum + row.seatCount,
    0
  );
  if (calculatedTotal !== section.totalSeats) {
    errors.push(
      `Total seats mismatch: ${section.totalSeats} declared vs ${calculatedTotal} calculated`
    );
  }

  // Check for duplicate seat IDs
  const seatIds = new Set<string>();
  section.rows.forEach((row) => {
    row.seats.forEach((seat) => {
      if (seatIds.has(seat.id)) {
        errors.push(`Duplicate seat ID: ${seat.id}`);
      }
      seatIds.add(seat.id);
    });
  });

  // Check coordinate bounds (reasonable stadium dimensions)
  section.rows.forEach((row) => {
    row.seats.forEach((seat) => {
      const { x, y, z } = seat.position3D;
      if (Math.abs(x) > 1000 || Math.abs(y) > 1000) {
        warnings.push(
          `Seat ${seat.id} has unusual coordinates: (${x}, ${y}, ${z})`
        );
      }
      if (z < 0 || z > 300) {
        warnings.push(`Seat ${seat.id} has unusual elevation: ${z} feet`);
      }
    });
  });

  // Check distribution totals
  const distributionTotal = Object.values(section.seatDistribution).reduce(
    (sum, count) => sum + count,
    0
  );
  if (distributionTotal !== section.totalSeats) {
    errors.push(
      `Seat distribution doesn't match total: ${distributionTotal} vs ${section.totalSeats}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Export section data to TypeScript file format
 */
export function exportSectionToTypeScript(
  section: SectionSeatingData
): string {
  const variableName = `section_${section.sectionId.replace(/-/g, '_')}`;

  return `/**
 * ${section.sectionName} - ${section.stadiumId}
 * Generated: ${new Date().toISOString()}
 * Total Seats: ${section.totalSeats}
 * Total Rows: ${section.totalRows}
 */

import type { SectionSeatingData } from '@/types/seat';

export const ${variableName}: SectionSeatingData = ${JSON.stringify(section, null, 2)};
`;
}
