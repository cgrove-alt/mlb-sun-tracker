/**
 * TEMPLATE FILE - Example Section Data Structure
 * This file serves as a template for creating section seat data
 * Copy this file and rename to the section ID (e.g., field-box-1.ts)
 *
 * DO NOT import this file directly - it's for reference only
 */

import type { SectionSeatingData, SeatRow, Seat } from '@/types/seat';

/**
 * Example: Field Box Section 1 at Dodger Stadium
 * This is a fictional example showing the data structure
 */
export const section_field_box_1: SectionSeatingData = {
  sectionId: 'field-box-1',
  sectionName: 'Field Box 1',
  stadiumId: 'dodger-stadium',
  totalSeats: 180, // 12 rows × 15 seats
  totalRows: 12,

  // Seat type distribution
  seatDistribution: {
    standard: 156, // Regular seats
    aisle: 24, // Aisle seats (2 per row × 12 rows)
    wheelchair: 0, // No wheelchair seats in this section
    companion: 0,
    other: 0,
  },

  // Optional: Sun exposure summary (computed later)
  sunExposureSummary: {
    fullyShaded: 45, // Seats with >80% shade
    partiallyShaded: 90, // Seats with 20-80% shade
    fullySunny: 45, // Seats with >80% sun
    averageExposure: 55.5, // Average across all seats
  },

  // All rows in this section
  rows: [
    // Row A - Front row, closest to field
    {
      rowNumber: 'A',
      sectionId: 'field-box-1',
      seatCount: 15,
      elevation: 10, // 10 feet above field level
      depth: 5, // 5 feet from section front
      rowSpacing: 36, // 36 inches to next row
      covered: false, // Not under overhang
      hasAisleSeats: true,
      wheelchairRow: false,

      // Optional: Row-level aggregates
      averageSunExposure: 72.5, // Front row gets more sun
      shadeVariance: 5.2,

      // All seats in Row A
      seats: [
        // Seat 1 - Aisle seat on left
        {
          id: 'dodger-stadium-field-box-1-A-1',
          sectionId: 'field-box-1',
          row: 'A',
          seatNumber: '1',

          // 3D position (calculated based on stadium geometry)
          position3D: {
            x: 120.5, // X coordinate in stadium space
            y: 85.3, // Y coordinate
            z: 10.0, // Z elevation
          },
          elevation: 10,
          distanceFromHomeplate: 95.5, // Feet from home plate

          // Angular position
          angle: 45, // 45° from home plate (first base side)
          facing: 225, // Seat faces toward center field (225°)

          // Seat characteristics
          seatType: 'aisle', // This is an aisle seat
          hasArmrests: true,
          cupHolders: true,

          // View quality
          viewQuality: 'excellent', // Premium field-level view
          accessibility: {
            wheelchairAccessible: false,
            companionSeat: false,
            requiresStairs: false, // Field level, no stairs needed
            elevatorAccess: true,
          },

          // Coverage
          covered: false, // Open to sky
        },

        // Seat 2 - Standard seat
        {
          id: 'dodger-stadium-field-box-1-A-2',
          sectionId: 'field-box-1',
          row: 'A',
          seatNumber: '2',
          position3D: { x: 122.5, y: 85.3, z: 10.0 }, // 2 feet over from seat 1
          elevation: 10,
          distanceFromHomeplate: 96.2,
          angle: 45.5,
          facing: 225,
          seatType: 'standard',
          hasArmrests: true,
          cupHolders: true,
          viewQuality: 'excellent',
          accessibility: {
            wheelchairAccessible: false,
            companionSeat: false,
            requiresStairs: false,
            elevatorAccess: true,
          },
          covered: false,
        },

        // ... Seats 3-14 would follow the same pattern ...
        // (In real implementation, all seats would be here)

        // Seat 15 - Aisle seat on right
        {
          id: 'dodger-stadium-field-box-1-A-15',
          sectionId: 'field-box-1',
          row: 'A',
          seatNumber: '15',
          position3D: { x: 146.5, y: 85.3, z: 10.0 },
          elevation: 10,
          distanceFromHomeplate: 105.8,
          angle: 48.5,
          facing: 225,
          seatType: 'aisle',
          hasArmrests: true,
          cupHolders: true,
          viewQuality: 'excellent',
          accessibility: {
            wheelchairAccessible: false,
            companionSeat: false,
            requiresStairs: false,
            elevatorAccess: true,
          },
          covered: false,
        },
      ],
    },

    // Row B - Second row
    {
      rowNumber: 'B',
      sectionId: 'field-box-1',
      seatCount: 15,
      elevation: 12.5, // Raised 2.5 feet from row A
      depth: 8, // 8 feet from section front
      rowSpacing: 36,
      covered: false,
      hasAisleSeats: true,
      wheelchairRow: false,
      seats: [
        // Similar structure to Row A, but with updated coordinates
        // In real implementation, all 15 seats would be here
      ],
    },

    // ... Rows C through L would follow the same pattern ...
    // Each row raised by 2.5 feet, moved back by 3 feet

    // Row L - Back row (12th row)
    {
      rowNumber: 'L',
      sectionId: 'field-box-1',
      seatCount: 15,
      elevation: 37.5, // 10 + (11 × 2.5) = 37.5 feet elevation
      depth: 38, // 5 + (11 × 3) = 38 feet from front
      rowSpacing: 36,
      covered: false, // Even back row not covered in field sections
      hasAisleSeats: true,
      wheelchairRow: false,
      averageSunExposure: 45.0, // Back rows typically more shaded
      shadeVariance: 8.5,
      seats: [
        // Similar structure, with updated coordinates
      ],
    },
  ],
};

/**
 * NOTES FOR DATA ENTRY:
 *
 * 1. Coordinate System:
 *    - Origin (0,0,0) is at home plate, field level
 *    - X-axis: First base line direction (positive = first base)
 *    - Y-axis: Center field direction (positive = outfield)
 *    - Z-axis: Vertical (positive = up)
 *
 * 2. Angles:
 *    - 0° = Directly behind home plate
 *    - 90° = First base line
 *    - 180° = Center field
 *    - 270° = Third base line
 *
 * 3. Seat Numbering:
 *    - Usually increases from left to right when facing the field
 *    - Aisle seats are typically odd-numbered (1, 15) or even (2, 16)
 *    - Check actual stadium chart for numbering convention
 *
 * 4. Row Numbering:
 *    - Usually letters (A-Z) or numbers (1-50)
 *    - Check stadium chart for actual convention
 *    - Some sections use AA, BB for additional rows
 *
 * 5. Elevation Formula:
 *    - Row elevation = base_elevation + (row_number × rake)
 *    - Rake is typically 2.5-3 feet per row for good sight lines
 *
 * 6. Data Generation:
 *    - Use the generateSeatPositions utility for automated coordinate calculation
 *    - Manually verify first and last seat positions
 *    - Check that total seats match section capacity
 */
