/**
 * Angel Stadium - Stadium Metadata
 * Generated: 2025-10-22T20:29:59.822Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'angels',
  stadiumName: 'Angel Stadium',
  generatedAt: '2025-10-22T20:29:59.822Z',
  version: '1.0.0',
  dataSource: 'Generated from official seating charts and stadium specifications',
  totalSections: 157,
  lastValidated: '2025-10-22T20:29:59.822Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 45520,
  totalSections: 157,
  totalRows: 2753,
  levels: {
    '100 Level': 15780,
    '200 Level': 11004,
    '500 Level': 18736,
  },
  seatDistribution: {
    standard: 41878,
    aisle: 2731,
    wheelchair: 910,
  },
  coveredSeats: 29740,
};
