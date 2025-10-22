/**
 * American Family Field - Stadium Metadata
 * Generated: 2025-10-22T22:55:29.742Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'brewers',
  stadiumName: 'American Family Field',
  generatedAt: '2025-10-22T22:55:29.742Z',
  version: '1.0.0',
  dataSource: 'Generated from stadium seating charts and capacity data',
  totalSections: 133,
  lastValidated: '2025-10-22T22:55:29.742Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 41897,
  totalSections: 133,
  totalRows: 2479,
  levels: {
    '100 Level (Field)': 12984,
    '200 Level (Loge)': 7040,
    '300 Level (Club)': 10017,
    '400 Level (Terrace)': 11856,
  },
  seatDistribution: {
    standard: 38545,
    aisle: 2513,
    wheelchair: 837,
  },
  coveredSeats: 16767,
};
