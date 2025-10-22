/**
 * Citizens Bank Park - Stadium Metadata
 * Generated: 2025-10-22T20:01:24.166Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'phillies',
  stadiumName: 'Citizens Bank Park',
  generatedAt: '2025-10-22T20:01:24.166Z',
  version: '1.0.0',
  dataSource: 'Generated from official seating charts',
  totalSections: 115,
  lastValidated: '2025-10-22T20:01:24.166Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 42901,
  totalSections: 115,
  totalRows: 2580,
  levels: {
    'Diamond Club': 1904,
    '100 Level': 24038,
    '200 Level': 6720,
    '300 Level': 5632,
    '400 Level': 4607,
  },
  seatDistribution: {
    standard: 39468,
    aisle: 2574,
    wheelchair: 858,
  },
  coveredSeats: 21617,
};
