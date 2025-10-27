/**
 * Busch Stadium - Stadium Metadata
 * Generated: 2025-10-27T15:18:30.913Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'cardinals',
  stadiumName: 'Busch Stadium',
  generatedAt: '2025-10-27T15:18:30.913Z',
  version: '1.0.0',
  dataSource: 'Generated from official seating charts',
  totalSections: 179,
  lastValidated: '2025-10-27T15:18:30.913Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 44383,
  totalSections: 179,
  totalRows: 2868,
  levels: {
    '100 Level': 11377,
    '200 Level': 8160,
    '300 Level': 18000,
    '400 Level': 6846,
  },
  seatDistribution: {
    standard: 41276,
    aisle: 2219,
    wheelchair: 887,
  },
  coveredSeats: 9799,
};
