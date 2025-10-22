/**
 * Minute Maid Park - Stadium Metadata
 * Generated: 2025-10-22T20:52:08.657Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'astros',
  stadiumName: 'Minute Maid Park',
  generatedAt: '2025-10-22T20:52:08.657Z',
  version: '1.0.0',
  dataSource: 'Generated from official seating charts and capacity data',
  totalSections: 197,
  lastValidated: '2025-10-22T20:52:08.657Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 41177,
  totalSections: 197,
  totalRows: 2777,
  levels: {
    'Lower Level': 19471,
    'Second Level': 7326,
    'Suite Level': 880,
    'Upper Level': 13500,
  },
  seatDistribution: {
    standard: 37882,
    aisle: 2470,
    wheelchair: 823,
  },
  coveredSeats: 20826,
};
