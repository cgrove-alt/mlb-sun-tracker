/**
 * Rogers Centre - Stadium Metadata
 * Generated: 2025-10-22T21:21:52.962Z
 * Note: Pre-renovation capacity (2013-2022 configuration)
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'bluejays',
  stadiumName: 'Rogers Centre',
  generatedAt: '2025-10-22T21:21:52.962Z',
  version: '1.0.0',
  dataSource: 'Generated from 2013-2022 seating charts (pre-renovation)',
  totalSections: 200,
  lastValidated: '2025-10-22T21:21:52.962Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 49282,
  totalSections: 200,
  totalRows: 3569,
  levels: {
    '100 Level': 20381,
    '200 Level': 17309,
    '500 Level': 11592,
  },
  seatDistribution: {
    standard: 45339,
    aisle: 2956,
    wheelchair: 985,
  },
  coveredSeats: 13032,
};
