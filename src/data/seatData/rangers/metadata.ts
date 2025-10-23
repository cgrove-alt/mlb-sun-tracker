/**
 * Globe Life Field - Stadium Metadata
 * Generated: 2025-10-23T02:07:32.338Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'rangers',
  stadiumName: 'Globe Life Field',
  generatedAt: '2025-10-23T02:07:32.338Z',
  version: '1.0.0',
  dataSource: 'Generated from stadium seating charts and capacity data',
  totalSections: 119,
  lastValidated: '2025-10-23T02:07:32.338Z'
};

export const stats: StadiumSeatingStats = {
  "totalSeats": 40300,
  "totalSections": 119,
  "totalRows": 1840,
  "levels": {
    "Field Level (1-25)": 10302,
    "100-Level (Mezzanine)": 11880,
    "200-Level (Pavilion)": 8150,
    "300-Level (Upper)": 9968
  },
  "seatDistribution": {
    "standard": 0,
    "aisle": 0,
    "wheelchair": 0
  },
  "coveredSeats": 0
};
