/**
 * Coors Field - Stadium Metadata
 * Generated: 2025-10-23T12:21:01.942Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'rockies',
  stadiumName: 'Coors Field',
  generatedAt: '2025-10-23T12:21:01.942Z',
  version: '1.0.0',
  dataSource: 'Generated from stadium seating charts and capacity data',
  totalSections: 139,
  lastValidated: '2025-10-23T12:21:01.942Z'
};

export const stats: StadiumSeatingStats = {
  "totalSeats": 50144,
  "totalSections": 139,
  "totalRows": 3523,
  "levels": {
    "100 Level (Lower Bowl)": 29838,
    "200 Level (Club)": 6006,
    "300 Level (Upper Reserved)": 12000,
    "400 Level (Rockpile)": 2300
  },
  "seatDistribution": {
    "standard": 0,
    "aisle": 0,
    "wheelchair": 0
  },
  "coveredSeats": 0
};
