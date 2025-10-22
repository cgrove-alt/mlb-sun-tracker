/**
 * Fenway Park - Stadium Metadata
 * Generated: 2025-10-22T01:13:39.251Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'redsox',
  stadiumName: 'Fenway Park',
  generatedAt: '2025-10-22T01:13:39.251Z',
  version: '1.0.0',
  dataSource: 'Generated from official seating charts',
  totalSections: 145,
  lastValidated: '2025-10-22T01:13:39.251Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 38130,
  totalSections: 145,
  totalRows: 2846,
  levels: {
    'Grandstand': 9909,
    'Field': 25125,
    'Loge': 11016,
    'Bleachers': 14400,
  },
  seatDistribution: {
    standard: 35460,
    aisle: 1906,
    wheelchair: 762,
  },
  coveredSeats: 9909,
};
