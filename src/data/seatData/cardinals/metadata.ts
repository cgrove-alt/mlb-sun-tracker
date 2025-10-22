/**
 * Busch Stadium - Stadium Metadata
 * Generated: 2025-10-22T00:29:14.771Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'cardinals',
  stadiumName: 'Busch Stadium',
  generatedAt: '2025-10-22T00:29:14.771Z',
  version: '1.0.0',
  dataSource: 'Generated from official seating charts',
  totalSections: 179,
  lastValidated: '2025-10-22T00:29:14.771Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 44526,
  totalSections: 179,
  totalRows: 2868,
  levels: {
    '100 Level': 11520,
    '200 Level': 8160,
    '300 Level': 18000,
    '400 Level': 6846,
  },
  seatDistribution: {
    standard: 41409,
    aisle: 2226,
    wheelchair: 890,
  },
  coveredSeats: 9810,
};
