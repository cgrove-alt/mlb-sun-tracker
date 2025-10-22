/**
 * Citi Field - Stadium Metadata
 * Generated: 2025-10-22T19:43:57.230Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'mets',
  stadiumName: 'Citi Field',
  generatedAt: '2025-10-22T19:43:57.230Z',
  version: '1.0.0',
  dataSource: 'Generated from official seating charts',
  totalSections: 201,
  lastValidated: '2025-10-22T19:43:57.230Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 41922,
  totalSections: 201,
  totalRows: 2280,
  levels: {
    'Field Premium': 3760,
    'Field 100s': 13210,
    'Excelsior 200s': 841,
    '300 Level': 4104,
    '400 Level': 6327,
    '500 Level': 13680,
  },
  seatDistribution: {
    standard: 38568,
    aisle: 2515,
    wheelchair: 838,
  },
  coveredSeats: 19260,
};
