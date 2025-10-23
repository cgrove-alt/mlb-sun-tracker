/**
 * Guaranteed Rate Field - Stadium Metadata
 * Generated: 2025-10-23T15:36:45.065Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'whitesox',
  stadiumName: 'Guaranteed Rate Field',
  generatedAt: '2025-10-23T15:36:45.065Z',
  version: '1.0.0',
  dataSource: 'Generated from stadium seating charts and capacity data',
  totalSections: 267,
  lastValidated: '2025-10-23T15:36:45.065Z'
};

export const stats: StadiumSeatingStats = {
  "totalSeats": 40615,
  "totalSections": 267,
  "totalRows": 2723,
  "levels": {
    "100 Level (Lower Bowl)": 21484,
    "200 Level (Suite Level)": 1568,
    "300 Level (Club Level)": 1880,
    "400 Level (Luxury Level)": 2592,
    "500 Level (Upper Deck)": 13091
  },
  "seatDistribution": {
    "standard": 0,
    "aisle": 0,
    "wheelchair": 0
  },
  "coveredSeats": 0
};
