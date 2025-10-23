/**
 * Oracle Park - Stadium Metadata
 * Generated: 2025-10-23T16:48:21.173Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'giants',
  stadiumName: 'Oracle Park',
  generatedAt: '2025-10-23T16:48:21.173Z',
  version: '1.0.0',
  dataSource: 'Generated from official seating charts',
  totalSections: 111,
  lastValidated: '2025-10-23T16:48:21.173Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 41331,
  totalSections: 111,
  totalRows: 2208,
  levels: {
    'Field Level': 14583,
    'Arcade': 1540,
    'Club Level': 9108,
    'View Level': 17640,
  },
  seatDistribution: {
    standard: 38437,
    aisle: 2066,
    wheelchair: 826,
  },
  coveredSeats: 5076,
};
