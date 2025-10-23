/**
 * Fenway Park - Stadium Metadata
 * Generated: 2025-10-23T16:37:24.490Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'redsox',
  stadiumName: 'Fenway Park',
  generatedAt: '2025-10-23T16:37:24.490Z',
  version: '1.0.0',
  dataSource: 'Generated from official seating charts',
  totalSections: 145,
  lastValidated: '2025-10-23T16:37:24.490Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 37755,
  totalSections: 145,
  totalRows: 2846,
  levels: {
    'Grandstand': 9738,
    'Field': 24924,
    'Loge': 10869,
    'Bleachers': 14394,
  },
  seatDistribution: {
    standard: 35112,
    aisle: 1887,
    wheelchair: 755,
  },
  coveredSeats: 9738,
};
