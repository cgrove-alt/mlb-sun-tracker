# Multi-League Venue System

This document explains the new multi-league venue system that extends The Shadium to support NFL, MLS, and other sports venues alongside the existing MLB stadiums.

## Overview

The venue system provides:
- **Unified venue data structure** supporting multiple sports leagues
- **Flexible shade calculations** adapted for different venue types
- **League-based routing** with dedicated pages for each sport
- **Sport-specific optimizations** for shade analysis

## Files Created

### Configuration
- `venues.json` - JSON configuration file with venue metadata
- `src/types/venues.ts` - TypeScript interfaces for all venue types

### Data Generation
- `scripts/importVenues.ts` - Script to generate static props from configuration
- `src/data/venues.ts` - Generated venue data (auto-generated)
- `src/data/venueSections.ts` - Generated section data (auto-generated)
- `src/data/unifiedVenues.ts` - Unified data combining MLB + other sports

### Components & Pages
- `app/venue/[venueId]/page.tsx` - Universal venue detail pages
- `app/league/[leagueId]/page.tsx` - League overview pages
- `src/components/UnifiedVenueGuide.tsx` - Universal venue guide component
- `src/components/LeagueNavigation.tsx` - League filtering navigation

### Utilities
- `src/utils/getUnifiedVenueShade.ts` - Shade calculations for all venue types

## Usage

### 1. Adding New Venues

Edit `venues.json` to add new venues:

```json
{
  "venues": [
    {
      "id": "new-stadium",
      "name": "New Stadium",
      "league": "NFL",
      "team": "Team Name",
      "city": "City",
      "state": "ST",
      "latitude": 40.0000,
      "longitude": -74.0000,
      "orientation": 45,
      "capacity": 65000,
      "roof": "open",
      "timezone": "America/New_York",
      "seatingGeometry": {
        "bowlShape": "rectangular",
        "fieldDimensions": {
          "length": 120,
          "width": 53.3
        },
        "primarySeatingAngle": 45
      },
      "venueType": "football",
      "surface": "artificial",
      "opened": 2023
    }
  ]
}
```

### 2. Regenerating Data

After editing `venues.json`, run:

```bash
npx tsx scripts/importVenues.ts
```

This generates:
- `src/data/venues.ts` - Venue data and helper functions
- `src/data/venueSections.ts` - Auto-generated sections for each venue
- `src/data/venueParams.ts` - Static params for Next.js routes

### 3. Accessing Venue Data

```typescript
import { 
  getUnifiedVenueById, 
  getVenuesByLeague, 
  getAllLeagues 
} from '../data/unifiedVenues';

// Get a specific venue
const venue = getUnifiedVenueById('sofi-stadium');

// Get all NFL venues
const nflVenues = getVenuesByLeague('NFL');

// Get all leagues
const leagues = getAllLeagues(); // ['MLB', 'NFL', 'MLS']
```

### 4. Shade Calculations

```typescript
import { getUnifiedVenueShade } from '../utils/getUnifiedVenueShade';
import { getVenueSections } from '../data/venueSections';

const venue = getUnifiedVenueById('sofi-stadium');
const sections = getVenueSections('sofi-stadium');
const gameDate = new Date('2024-09-15T13:00:00');

const shadedSections = getUnifiedVenueShade(venue, gameDate, sections);

// Get recommendations
const recommended = getRecommendedSections(venue, shadedSections, 'moderate');
```

## Venue Types Supported

### Baseball (MLB)
- **Venues**: 30 MLB stadiums
- **Characteristics**: Asymmetrical layout, home plate orientation matters
- **Shade Strategy**: Upper deck, third base side for afternoon games
- **Season**: April - October

### Football (NFL)
- **Example Venues**: SoFi Stadium, Lambeau Field
- **Characteristics**: Rectangular layout, sideline premium seating
- **Shade Strategy**: Upper deck, covered club sections
- **Season**: September - February

### Soccer (MLS)
- **Example Venues**: BMO Stadium
- **Characteristics**: Rectangular field, sideline seating priority
- **Shade Strategy**: Covered sideline sections, upper tiers
- **Season**: February - November

## Routing Structure

### New Routes
- `/venue/[venueId]` - Universal venue pages (replaces stadium-specific routes)
- `/league/[leagueId]` - League overview pages (mlb, nfl, mls)

### Existing Routes (Still Supported)
- `/stadium/[stadiumId]` - Legacy MLB stadium pages
- `/` - Homepage (now includes league navigation)

## SEO Optimization

The system maintains SEO optimization for shade-related queries:

- **Venue pages**: Target "shaded seats at [venue name]"
- **League pages**: Target "[league] stadium shade guide"
- **Cross-sport content**: Broader "sports venue shade" targeting

## Sport-Specific Optimizations

### Shade Calculation Modifiers
Each sport has optimized shade calculations:

```typescript
const SPORT_SHADE_MODIFIERS = {
  baseball: {
    homeAngleBonus: 15,      // Home plate side advantage
    upperDeckAdvantage: 25,  // Upper deck shade
  },
  football: {
    sidelineAdvantage: 20,   // Sideline premium
    upperDeckAdvantage: 30,  // Better upper deck shade
  },
  soccer: {
    sidelineAdvantage: 25,   // Sideline focus
    upperDeckAdvantage: 20,  // Moderate upper advantage
  }
};
```

### Game Time Considerations
- **Baseball**: Day games (1 PM), night games (7 PM)
- **Football**: Afternoon (1 PM, 4 PM), prime time (8 PM)
- **Soccer**: Varied (12 PM, 3 PM, 5 PM, 7 PM)

## Migration from MLB-Only

The system maintains backward compatibility:

1. **Existing MLB data** is automatically converted to unified format
2. **Legacy stadium routes** continue to work
3. **Existing components** can use conversion utilities
4. **Gradual migration** - update components as needed

## Development Workflow

1. **Add venues** to `venues.json`
2. **Run import script** to generate data files
3. **Update components** to use unified venue system
4. **Test shade calculations** for new venue types
5. **Deploy** - static generation handles all routes

## Performance Considerations

- **Static generation** - All venue pages pre-built
- **Code splitting** - League-specific components loaded on demand
- **Caching** - Shade calculators cached per venue
- **Lazy loading** - Non-critical components loaded as needed

## Future Extensions

The system is designed to easily support:
- **Additional leagues** (NBA, NHL, etc.)
- **College sports** venues
- **International** sports venues
- **Multi-use** venues with different configurations

## Example Data

The initial configuration includes:

### NFL Examples
- **SoFi Stadium** (Rams/Chargers) - Fixed roof, modern design
- **Lambeau Field** (Packers) - Open air, cold weather venue

### MLS Examples  
- **BMO Stadium** (LAFC) - Soccer-specific venue, open air

Each demonstrates different venue characteristics and shade calculation approaches.