/**
 * Comerica Park - Stadium Metadata
 * Generated: 2025-10-23T14:45:23.123Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'tigers',
  stadiumName: 'Comerica Park',
  generatedAt: '2025-10-23T14:45:23.123Z',
  version: '1.0.0',
  dataSource: 'Generated from stadium seating charts and capacity data',
  totalSections: 125,
  lastValidated: '2025-10-23T14:45:23.123Z'
};

export const stats: StadiumSeatingStats = {
  "totalSeats": 41083,
  "totalSections": 125,
  "totalRows": 2741,
  "levels": {
    "100 Level (Lower Bowl)": 25272,
    "200 Level (Mezzanine)": 2380,
    "300 Level (Upper Bowl)": 13431
  },
  "seatDistribution": {
    "standard": 0,
    "aisle": 0,
    "wheelchair": 0
  },
  "coveredSeats": 0
};
