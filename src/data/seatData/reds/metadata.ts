/**
 * Great American Ball Park - Stadium Metadata
 * Generated: 2025-10-23T02:33:47.847Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'reds',
  stadiumName: 'Great American Ball Park',
  generatedAt: '2025-10-23T02:33:47.847Z',
  version: '1.0.0',
  dataSource: 'Generated from stadium seating charts and capacity data',
  totalSections: 119,
  lastValidated: '2025-10-23T02:33:47.847Z'
};

export const stats: StadiumSeatingStats = {
  "totalSeats": 42319,
  "totalSections": 119,
  "totalRows": 2412,
  "levels": {
    "Diamond/Scout (1-5, 22-25)": 891,
    "100 Level (Lower Deck)": 19572,
    "300 Level (Club)": 1911,
    "400 Level (Mezzanine)": 7482,
    "500 Level (Upper/View)": 12463
  },
  "seatDistribution": {
    "standard": 0,
    "aisle": 0,
    "wheelchair": 0
  },
  "coveredSeats": 0
};
