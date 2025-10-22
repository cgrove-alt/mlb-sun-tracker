/**
 * Oracle Park - Stadium Metadata
 * Generated: 2025-10-22T00:57:42.910Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'giants',
  stadiumName: 'Oracle Park',
  generatedAt: '2025-10-22T00:57:42.910Z',
  version: '1.0.0',
  dataSource: 'Generated from official seating charts',
  totalSections: 111,
  lastValidated: '2025-10-22T00:57:42.910Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 41420,
  totalSections: 111,
  totalRows: 2208,
  levels: {
    'Field Level': 14672,
    'Arcade': 1540,
    'Club Level': 9108,
    'View Level': 17640,
  },
  seatDistribution: {
    standard: 38520,
    aisle: 2071,
    wheelchair: 828,
  },
  coveredSeats: 5076,
};
