/**
 * George M. Steinbrenner Field - Stadium Metadata
 * Generated: 2025-10-23T02:20:17.066Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'rays',
  stadiumName: 'George M. Steinbrenner Field',
  generatedAt: '2025-10-23T02:20:17.066Z',
  version: '1.0.0',
  dataSource: 'Generated from stadium seating charts and capacity data',
  totalSections: 75,
  lastValidated: '2025-10-23T02:20:17.066Z'
};

export const stats: StadiumSeatingStats = {
  "totalSeats": 11026,
  "totalSections": 75,
  "totalRows": 678,
  "levels": {
    "Field Box (A-S)": 1881,
    "Dugout Club (1-12)": 104,
    "100 Level (Reserved)": 5687,
    "200 Level (Upper)": 3186,
    "Loge Boxes (1-8)": 168
  },
  "seatDistribution": {
    "standard": 0,
    "aisle": 0,
    "wheelchair": 0
  },
  "coveredSeats": 0
};
