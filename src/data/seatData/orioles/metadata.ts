/**
 * Oriole Park at Camden Yards - Stadium Metadata
 * Generated: 2025-10-23T01:12:26.015Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'orioles',
  stadiumName: 'Oriole Park at Camden Yards',
  generatedAt: '2025-10-23T01:12:26.015Z',
  version: '1.0.0',
  dataSource: 'Generated from stadium seating charts and capacity data',
  totalSections: 273,
  lastValidated: '2025-10-23T01:12:26.015Z'
};

export const stats: StadiumSeatingStats = {
  "totalSeats": 45879,
  "totalSections": 273,
  "totalRows": 3802,
  "levels": {
    "Field Box": 12878,
    "Lower Reserve": 11184,
    "Club Level": 7020,
    "Terrace Level": 2197,
    "Upper Level": 12600
  },
  "seatDistribution": {
    "standard": 0,
    "aisle": 0,
    "wheelchair": 0
  },
  "coveredSeats": 0
};
