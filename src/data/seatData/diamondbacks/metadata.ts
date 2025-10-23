/**
 * Chase Field - Stadium Metadata
 * Generated: 2025-10-23T17:05:48.058Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'diamondbacks',
  stadiumName: 'Chase Field',
  generatedAt: '2025-10-23T17:05:48.058Z',
  version: '1.0.0',
  dataSource: 'Generated from stadium seating charts and capacity data',
  totalSections: 124,
  lastValidated: '2025-10-23T17:05:48.058Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 48686,
  totalSections: 124,
  totalRows: 2958,
  levels: {
    '100 Level (Lower + Suites)': 23963,
    '200 Level (Club)': 11803,
    '300 Level (Upper)': 12920,
  },
  seatDistribution: {
    standard: 43817,
    aisle: 3408,
    wheelchair: 1460,
  },
  coveredSeats: 11176,
};
