/**
 * Dodger Stadium - Stadium Metadata
 * Generated: 2025-10-23T16:49:18.850Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'dodger-stadium',
  stadiumName: 'Dodger Stadium',
  generatedAt: '2025-10-23T16:49:18.850Z',
  version: '2.0.0',
  dataSource: 'Programmatically generated from official seating parameters',
  totalSections: 195,
  lastValidated: '2025-10-23T16:49:18.850Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 56000,
  totalSections: 195,
  totalRows: 3827,
  levels: {
    'Field Level': 28240,
    'Loge Level': 13608,
    'Reserve Level': 12584,
    'Top Deck': 5980,
    'Pavilion': 6624,
    'Infield Reserve': 9196,
  },
  seatDistribution: {
    standard: 52080,
    aisle: 2800,
    wheelchair: 1120,
  },
  coveredSeats: 5324,
};
