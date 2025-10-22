/**
 * Dodger Stadium - Stadium Metadata
 * Generated: 2025-10-22T00:43:37.633Z
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'dodger-stadium',
  stadiumName: 'Dodger Stadium',
  generatedAt: '2025-10-22T00:43:37.633Z',
  version: '2.0.0',
  dataSource: 'Programmatically generated from official seating parameters',
  totalSections: 195,
  lastValidated: '2025-10-22T00:43:37.633Z',
};

export const stats: StadiumSeatingStats = {
  totalSeats: 55916,
  totalSections: 195,
  totalRows: 3827,
  levels: {
    'Field Level': 28156,
    'Loge Level': 13608,
    'Reserve Level': 12584,
    'Top Deck': 5980,
    'Pavilion': 6624,
    'Infield Reserve': 9196,
  },
  seatDistribution: {
    standard: 52001,
    aisle: 2795,
    wheelchair: 1118,
  },
  coveredSeats: 5324,
};
