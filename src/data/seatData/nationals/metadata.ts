/**
 * Nationals Park - Stadium Metadata
 * Generated: 2025-10-23T17:01:34.098Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'nationals',
  stadiumName: 'Nationals Park',
  generatedAt: '2025-10-23T17:01:34.098Z',
  version: '1.0.0',
  dataSource: 'Generated from stadium seating charts and capacity data',
  totalSections: 126,
  lastValidated: '2025-10-23T17:01:34.098Z'
};

export const stats: StadiumSeatingStats = {
  "totalSeats": 41313,
  "totalSections": 126,
  "totalRows": 2318,
  "levels": {
    "Presidents Club": 680,
    "100 Level (Field)": 18084,
    "200 Level (Club)": 10997,
    "300 Level (Gallery)": 6848,
    "400 Level (Upper Gallery)": 4704
  },
  "seatDistribution": {
    "standard": 0,
    "aisle": 0,
    "wheelchair": 0
  },
  "coveredSeats": 0
};
