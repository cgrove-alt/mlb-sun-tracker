/**
 * Kauffman Stadium - Stadium Metadata
 * Generated: 2025-10-23T14:23:39.364Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'royals',
  stadiumName: 'Kauffman Stadium',
  generatedAt: '2025-10-23T14:23:39.364Z',
  version: '1.0.0',
  dataSource: 'Generated from stadium seating charts and capacity data',
  totalSections: 180,
  lastValidated: '2025-10-23T14:23:39.364Z'
};

export const stats: StadiumSeatingStats = {
  "totalSeats": 37903,
  "totalSections": 180,
  "totalRows": 2961,
  "levels": {
    "Premium Level (BATS/Diamond Club)": 720,
    "100 Level (Field)": 18057,
    "200 Level (Plaza)": 11226,
    "300 Level (Loge)": 4000,
    "400 Level (View)": 3900
  },
  "seatDistribution": {
    "standard": 0,
    "aisle": 0,
    "wheelchair": 0
  },
  "coveredSeats": 0
};
