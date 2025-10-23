/**
 * T-Mobile Park - Stadium Metadata
 * Generated: 2025-10-23T16:55:03.042Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  "stadiumId": "mariners",
  "stadiumName": "T-Mobile Park",
  "generatedAt": "2025-10-23T16:55:03.042Z",
  "version": "1.0.0",
  "dataSource": "Generated from stadium seating charts and capacity data",
  "totalSections": 201,
  "lastValidated": "2025-10-23T16:55:03.042Z"
};

export const stats: StadiumSeatingStats = {
  "totalSeats": 47929,
  "totalSections": 201,
  "totalRows": 3890,
  "levels": {
    "100 Level (Main Concourse)": 21201,
    "200 Level (Club/Terrace)": 4668,
    "300 Level (Upper Concourse)": 15900,
    "Bleachers": 3712,
    "Diamond Club": 360,
    "Suites": 2088
  },
  "seatDistribution": {
    "standard": 43136,
    "aisle": 3355,
    "wheelchair": 1437
  },
  "coveredSeats": 6338
};
