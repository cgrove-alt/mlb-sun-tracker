/**
 * Progressive Field - Stadium Metadata
 * Generated: 2025-10-23T17:05:33.460Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'guardians',
  stadiumName: 'Progressive Field',
  generatedAt: '2025-10-23T17:05:33.460Z',
  version: '1.0.0',
  dataSource: 'Generated from stadium seating charts and capacity data',
  totalSections: 302,
  lastValidated: '2025-10-23T17:05:33.460Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 34830,
  totalSections: 302,
  totalRows: 3009,
  levels: {
    '100 Level (Lower + Bleachers)': 17044,
    '200 Level (Suites)': 3450,
    '300 Level (Club)': 5378,
    '400 Level (Box)': 4056,
    '500 Level (Upper)': 4902,
  },
  seatDistribution: {
    standard: 30650,
    aisle: 2786,
    wheelchair: 1393,
  },
  coveredSeats: 11132,
};
