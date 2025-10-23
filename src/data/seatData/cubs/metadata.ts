/**
 * Wrigley Field - Stadium Metadata
 * Generated: 2025-10-23T16:50:13.767Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'cubs',
  stadiumName: 'Wrigley Field',
  generatedAt: '2025-10-23T16:50:13.767Z',
  version: '1.0.0',
  dataSource: 'Generated from official seating charts',
  totalSections: 132,
  lastValidated: '2025-10-23T16:50:13.767Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 41649,
  totalSections: 132,
  totalRows: 1975,
  levels: {
    'Field Level': 11450,
    'Terrace Level': 16192,
    'Upper Level': 8004,
    'Upper Reserved': 6003,
  },
  seatDistribution: {
    standard: 38733,
    aisle: 2082,
    wheelchair: 832,
  },
  coveredSeats: 14099,
};
