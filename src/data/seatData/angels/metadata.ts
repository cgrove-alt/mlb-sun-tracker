/**
 * Angel Stadium - Stadium Metadata
 * Generated: 2025-10-23T17:06:05.765Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'angels',
  stadiumName: 'Angel Stadium',
  generatedAt: '2025-10-23T17:06:05.765Z',
  version: '1.0.0',
  dataSource: 'Generated from official seating charts and stadium specifications',
  totalSections: 157,
  lastValidated: '2025-10-23T17:06:05.765Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 45517,
  totalSections: 157,
  totalRows: 2753,
  levels: {
    '100 Level': 15780,
    '200 Level': 11004,
    '500 Level': 18733,
  },
  seatDistribution: {
    standard: 41875,
    aisle: 2731,
    wheelchair: 910,
  },
  coveredSeats: 29737,
};
