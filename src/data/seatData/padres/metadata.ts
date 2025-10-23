/**
 * Petco Park - Stadium Metadata
 * Generated: 2025-10-23T01:26:27.346Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'padres',
  stadiumName: 'Petco Park',
  generatedAt: '2025-10-23T01:26:27.346Z',
  version: '1.0.0',
  dataSource: 'Generated from stadium seating charts and capacity data',
  totalSections: 113,
  lastValidated: '2025-10-23T01:26:27.346Z'
};

export const stats: StadiumSeatingStats = {
  "totalSeats": 40221,
  "totalSections": 113,
  "totalRows": 1805,
  "levels": {
    "Premium Club (A-L)": 1560,
    "100 Level (Field)": 12147,
    "200 Level (Club)": 11070,
    "300 Level (Upper)": 15444
  },
  "seatDistribution": {
    "standard": 0,
    "aisle": 0,
    "wheelchair": 0
  },
  "coveredSeats": 0
};
