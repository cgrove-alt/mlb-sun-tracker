/**
 * T-Mobile Park - Stadium Metadata
 * Generated: 2025-10-23T00:32:06.326Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  "stadiumId": "mariners",
  "stadiumName": "T-Mobile Park",
  "generatedAt": "2025-10-23T00:32:06.326Z",
  "version": "1.0.0",
  "dataSource": "Generated from stadium seating charts and capacity data",
  "totalSections": 201,
  "lastValidated": "2025-10-23T00:32:06.326Z"
};

export const stats: StadiumSeatingStats = {
  "totalSeats": 47917,
  "totalSections": 201,
  "totalRows": 3890,
  "levels": {
    "100 Level (Main Concourse)": 21189,
    "200 Level (Club/Terrace)": 4668,
    "300 Level (Upper Concourse)": 15900,
    "Bleachers": 3712,
    "Diamond Club": 360,
    "Suites": 2088
  },
  "seatDistribution": {
    "standard": 43125,
    "aisle": 3354,
    "wheelchair": 1437
  },
  "coveredSeats": 6338
};
