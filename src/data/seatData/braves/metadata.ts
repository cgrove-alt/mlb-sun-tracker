/**
 * Truist Park - Stadium Metadata
 * Generated: 2025-10-22T20:21:13.095Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'braves',
  stadiumName: 'Truist Park',
  generatedAt: '2025-10-22T20:21:13.095Z',
  version: '1.0.0',
  dataSource: 'Generated from official seating charts',
  totalSections: 166,
  lastValidated: '2025-10-22T20:21:13.095Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 41084,
  totalSections: 166,
  totalRows: 2631,
  levels: {
    '100 Level': 19854,
    '200 Level': 6438,
    '300 Level': 9632,
    '400 Level': 5160,
  },
  seatDistribution: {
    standard: 37797,
    aisle: 2465,
    wheelchair: 821,
  },
  coveredSeats: 41084,
};
