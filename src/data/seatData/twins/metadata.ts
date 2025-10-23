/**
 * Target Field - Stadium Metadata
 * Generated: 2025-10-23T15:06:02.259Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'twins',
  stadiumName: 'Target Field',
  generatedAt: '2025-10-23T15:06:02.259Z',
  version: '1.0.0',
  dataSource: 'Generated from stadium seating charts and capacity data',
  totalSections: 134,
  lastValidated: '2025-10-23T15:06:02.259Z'
};

export const stats: StadiumSeatingStats = {
  "totalSeats": 38544,
  "totalSections": 134,
  "totalRows": 1922,
  "levels": {
    "Field Level / Champions Club": 4006,
    "100 Level (Main Level)": 19673,
    "200 Level (Terrace Level)": 3224,
    "300 Level (View Level)": 9211,
    "Legends Club (Third Level)": 2430
  },
  "seatDistribution": {
    "standard": 0,
    "aisle": 0,
    "wheelchair": 0
  },
  "coveredSeats": 0
};
