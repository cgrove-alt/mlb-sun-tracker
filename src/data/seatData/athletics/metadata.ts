/**
 * Sutter Health Park - Stadium Metadata
 * Generated: 2025-10-23T17:04:25.753Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'athletics',
  stadiumName: 'Sutter Health Park',
  generatedAt: '2025-10-23T17:04:25.753Z',
  version: '1.0.0',
  dataSource: 'Generated from stadium specifications and capacity data',
  totalSections: 11,
  lastValidated: '2025-10-23T17:04:25.753Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 14014,
  totalSections: 11,
  totalRows: 356,
  levels: {
    'Main Bowl': 14014,
  },
  seatDistribution: {
    standard: 12892,
    aisle: 840,
    wheelchair: 280,
  },
  coveredSeats: 0,
};
