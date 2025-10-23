/**
 * PNC Park - Stadium Metadata
 * Generated: 2025-10-23T01:46:29.792Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'pirates',
  stadiumName: 'PNC Park',
  generatedAt: '2025-10-23T01:46:29.792Z',
  version: '1.0.0',
  dataSource: 'Generated from stadium seating charts and capacity data',
  totalSections: 155,
  lastValidated: '2025-10-23T01:46:29.792Z'
};

export const stats: StadiumSeatingStats = {
  "totalSeats": 38362,
  "totalSections": 155,
  "totalRows": 2313,
  "levels": {
    "Lower Level - Premium (1-32)": 3952,
    "Lower Level - Main (101-147)": 21860,
    "Club Level (201-238)": 5920,
    "Grandstand Level (301-338)": 6630
  },
  "seatDistribution": {
    "standard": 0,
    "aisle": 0,
    "wheelchair": 0
  },
  "coveredSeats": 0
};
