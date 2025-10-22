/**
 * Yankee Stadium - Stadium Metadata
 * Generated: 2025-10-22T01:07:01.590Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'yankees',
  stadiumName: 'Yankee Stadium',
  generatedAt: '2025-10-22T01:07:01.590Z',
  version: '1.0.0',
  dataSource: 'Generated from official seating charts',
  totalSections: 131,
  lastValidated: '2025-10-22T01:07:01.590Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 46700,
  totalSections: 131,
  totalRows: 2361,
  levels: {
    'Field Level': 17200,
    'Main Level': 17020,
    'Terrace Level': 6000,
    'Grandstand Level': 6480,
  },
  seatDistribution: {
    standard: 43431,
    aisle: 2335,
    wheelchair: 934,
  },
  coveredSeats: 28030,
};
