# Seat Data Storage Structure

This directory contains detailed seat-level data for all MLB stadiums. Each stadium has individual seat positions, metadata, and pre-computed sun exposure data.

## Directory Structure

```
seatData/
├── README.md (this file)
├── {stadiumId}/
│   ├── metadata.ts          # Stadium seating metadata and statistics
│   ├── sections/
│   │   ├── {sectionId}.ts   # Individual section with all seats
│   │   ├── {sectionId}.ts
│   │   └── ...
│   └── precomputed/
│       ├── afternoon.json   # Pre-computed 1pm game exposures
│       ├── evening.json     # Pre-computed 7pm game exposures
│       └── monthly/
│           ├── april.json
│           ├── may.json
│           └── ...
└── {stadiumId}/
    └── ...
```

## File Naming Conventions

### Stadium IDs
Use kebab-case for stadium IDs (same as existing convention):
- `dodger-stadium`
- `yankee-stadium`
- `fenway-park`
- `wrigley-field`

### Section IDs
Use lowercase with hyphens, preserving the official section identifier:
- `field-1` → `field-1.ts`
- `loge-box-101` → `loge-box-101.ts`
- `pavilion-51` → `pavilion-51.ts`
- `reserve-28` → `reserve-28.ts`

## Data Format

Each section file exports a `SectionSeatingData` object:

```typescript
import { SectionSeatingData, SeatRow, Seat } from '@/types/seat';

export const section_field_1: SectionSeatingData = {
  sectionId: 'field-1',
  sectionName: 'Field Box 1',
  stadiumId: 'dodger-stadium',
  totalSeats: 180,
  totalRows: 12,
  rows: [
    {
      rowNumber: 'A',
      sectionId: 'field-1',
      seatCount: 15,
      elevation: 10,
      depth: 5,
      rowSpacing: 36,
      covered: false,
      hasAisleSeats: true,
      wheelchairRow: false,
      seats: [
        {
          id: 'dodger-stadium-field-1-A-1',
          sectionId: 'field-1',
          row: 'A',
          seatNumber: '1',
          position3D: { x: 120.5, y: 85.3, z: 10.0 },
          elevation: 10,
          distanceFromHomeplate: 95.5,
          angle: 45,
          facing: 180,
          seatType: 'aisle',
          hasArmrests: true,
          cupHolders: true,
          viewQuality: 'excellent',
          accessibility: {
            wheelchairAccessible: false,
            companionSeat: false,
            requiresStairs: false,
            elevatorAccess: true,
          },
          covered: false,
        },
        // ... more seats
      ],
    },
    // ... more rows
  ],
  seatDistribution: {
    standard: 168,
    aisle: 12,
    wheelchair: 0,
    companion: 0,
    other: 0,
  },
};
```

## Metadata File

Each stadium has a `metadata.ts` file:

```typescript
import { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: 'dodger-stadium',
  generatedDate: '2025-10-21',
  dataVersion: '1.0.0',
  source: 'official',
  accuracy: 'verified',
  notes: [
    'Data sourced from official Dodgers seating chart',
    'All coordinates validated against stadium blueprint',
  ],
  validated: true,
  validationDate: '2025-10-21',
  capacityMatch: true,
  officialCapacity: 56000,
  sectionsComplete: 120,
  sectionsMissing: 0,
  seatsComplete: 56000,
  seatsMissing: 0,
};

export const stats: StadiumSeatingStats = {
  stadiumId: 'dodger-stadium',
  totalSeats: 56000,
  totalSections: 120,
  byLevel: {
    field: 8500,
    lower: 18000,
    club: 6000,
    upper: 21500,
    suite: 2000,
  },
  coveredSeats: 12000,
  uncoveredSeats: 44000,
  partialCoverage: 8000,
  wheelchairSeats: 450,
  companionSeats: 450,
  elevatorAccessible: 42000,
};
```

## Pre-computed Data

Pre-computed sun exposure data is stored as JSON for fast loading:

```json
{
  "stadiumId": "dodger-stadium",
  "gameTime": "13:00",
  "month": 6,
  "seats": {
    "dodger-stadium-field-1-A-1": 85.5,
    "dodger-stadium-field-1-A-2": 84.2,
    "...": "..."
  },
  "computedAt": "2025-10-21T10:00:00Z",
  "version": "1.0.0"
}
```

## Data Loading

Seat data is loaded lazily using dynamic imports:

```typescript
import { getSeatDataForSection } from '@/utils/seatDataLoader';

// Load specific section
const sectionData = await getSeatDataForSection('dodger-stadium', 'field-1');

// Load pre-computed data
const precomputed = await getPrecomputedExposure('dodger-stadium', '13:00', 6);
```

## Size Considerations

- **Per Seat**: ~500-800 bytes (with metadata)
- **Per Section**: ~50-200 KB (100-300 seats)
- **Per Stadium**: ~10-25 MB (120 sections, 40,000-60,000 seats)
- **All 30 Stadiums**: ~300-750 MB total

Files are lazy-loaded and code-split to avoid bundling all data upfront.

## Data Generation Process

1. **Source Data**: Obtain official seating chart from team website or Ticketmaster
2. **Manual Mapping**: Document section layouts, row counts, seat counts per row
3. **Coordinate Generation**: Use `generateSeatPositions.ts` utility to calculate 3D positions
4. **Validation**: Verify total capacity matches official numbers
5. **Pre-computation**: Calculate sun exposure for common times using batch calculator
6. **Export**: Generate TypeScript files in correct structure

## Validation Checklist

Before committing stadium data:
- [ ] Total seat count matches official capacity (±1%)
- [ ] All sections have complete row/seat data
- [ ] 3D coordinates are within reasonable stadium bounds
- [ ] No duplicate seat IDs
- [ ] All accessibility data is complete
- [ ] Pre-computed data covers April-October, 1pm/4pm/7pm
- [ ] Metadata file is complete and accurate

## Progressive Enhancement

Stadium data can be added incrementally:
1. **MVP**: Section-level data only (no individual seats)
2. **Level 1**: All seats with basic metadata (ID, position, type)
3. **Level 2**: Complete metadata (accessibility, view quality, pricing)
4. **Level 3**: Pre-computed sun exposure data
5. **Level 4**: Real-world validation from user feedback

Not all stadiums need to reach Level 4 immediately. Start with MVP and enhance based on demand.

## Future Enhancements

- Dynamic pricing integration (real-time ticket prices)
- User reviews and ratings per seat
- Photo gallery from actual seats
- Historical sun exposure accuracy validation
- Weather-adjusted recommendations
- Seat comparison tool
