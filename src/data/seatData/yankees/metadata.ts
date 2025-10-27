/**
 * Yankee Stadium - Stadium Metadata
 * Generated: 2025-10-27T15:17:48.650Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'yankees',
  stadiumName: 'Yankee Stadium',
  generatedAt: '2025-10-27T15:17:48.650Z',
  version: '1.0.0',
  dataSource: 'Generated from official seating charts',
  totalSections: 131,
  lastValidated: '2025-10-27T15:17:48.650Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 46537,
  totalSections: 131,
  totalRows: 2361,
  levels: {
    'Field Level': 17098,
    'Main Level': 16959,
    'Terrace Level': 6000,
    'Grandstand Level': 6480,
  },
  seatDistribution: {
    standard: 43279,
    aisle: 2326,
    wheelchair: 930,
  },
  coveredSeats: 27928,
};
