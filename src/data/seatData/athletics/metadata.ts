/**
 * Sutter Health Park - Stadium Metadata
 * Generated: 2025-10-22T21:08:42.458Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'athletics',
  stadiumName: 'Sutter Health Park',
  generatedAt: '2025-10-22T21:08:42.458Z',
  version: '1.0.0',
  dataSource: 'Generated from stadium specifications and capacity data',
  totalSections: 11,
  lastValidated: '2025-10-22T21:08:42.458Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 14019,
  totalSections: 11,
  totalRows: 356,
  levels: {
    'Main Bowl': 14019,
  },
  seatDistribution: {
    standard: 12897,
    aisle: 841,
    wheelchair: 280,
  },
  coveredSeats: 0,
};
