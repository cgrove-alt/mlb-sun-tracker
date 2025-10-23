/**
 * loanDepot park - Stadium Metadata
 * Generated: 2025-10-23T00:49:17.247Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'marlins',
  stadiumName: 'loanDepot park',
  generatedAt: '2025-10-23T00:49:17.247Z',
  version: '1.0.0',
  dataSource: 'Generated from stadium seating charts and capacity data',
  totalSections: 130,
  lastValidated: '2025-10-23T00:49:17.247Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 37428,
  totalSections: 130,
  totalRows: 2006,
  levels: {
    'Promenade Level (Field/Lower)': 15768,
    'Legends Level (Club)': 7792,
    'Vista Level (Upper)': 12972,
    'Suites': 896,
  },
  seatDistribution: {
    standard: 32936,
    aisle: 2994,
    wheelchair: 1497,
  },
  coveredSeats: 9357,
};
