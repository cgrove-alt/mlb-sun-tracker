/**
 * Wrigley Field - Stadium Metadata
 * Generated: 2025-10-22T01:03:12.049Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'cubs',
  stadiumName: 'Wrigley Field',
  generatedAt: '2025-10-22T01:03:12.049Z',
  version: '1.0.0',
  dataSource: 'Generated from official seating charts',
  totalSections: 132,
  lastValidated: '2025-10-22T01:03:12.049Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 41599,
  totalSections: 132,
  totalRows: 1975,
  levels: {
    'Field Level': 11400,
    'Terrace Level': 16192,
    'Upper Level': 8004,
    'Upper Reserved': 6003,
  },
  seatDistribution: {
    standard: 38687,
    aisle: 2079,
    wheelchair: 831,
  },
  coveredSeats: 14099,
};
