/**
 * American Family Field - Stadium Metadata
 * Generated: 2025-10-23T17:05:37.401Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'brewers',
  stadiumName: 'American Family Field',
  generatedAt: '2025-10-23T17:05:37.401Z',
  version: '1.0.0',
  dataSource: 'Generated from stadium seating charts and capacity data',
  totalSections: 133,
  lastValidated: '2025-10-23T17:05:37.401Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 41900,
  totalSections: 133,
  totalRows: 2479,
  levels: {
    '100 Level (Field)': 12985,
    '200 Level (Loge)': 7041,
    '300 Level (Club)': 10018,
    '400 Level (Terrace)': 11856,
  },
  seatDistribution: {
    standard: 38548,
    aisle: 2514,
    wheelchair: 838,
  },
  coveredSeats: 16769,
};
