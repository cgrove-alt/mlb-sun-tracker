// World Cup 2026 Venues - Unit Tests
// Tests for venue data structure and helper functions

import {
  ALL_WORLD_CUP_VENUES,
  WORLD_CUP_USA_VENUES,
  WORLD_CUP_MEXICO_VENUES,
  WORLD_CUP_CANADA_VENUES,
  getWorldCupVenueById,
  getWorldCupVenuesByCountry,
  getReadyWorldCupVenues,
  WORLD_CUP_VENUE_STATS
} from '../venues';

describe('World Cup 2026 Venues', () => {
  describe('Venue Collections', () => {
    test('ALL_WORLD_CUP_VENUES has exactly 16 venues', () => {
      expect(ALL_WORLD_CUP_VENUES).toHaveLength(16);
    });

    test('USA has 11 venues', () => {
      expect(WORLD_CUP_USA_VENUES).toHaveLength(11);
    });

    test('Mexico has 3 venues', () => {
      expect(WORLD_CUP_MEXICO_VENUES).toHaveLength(3);
    });

    test('Canada has 2 venues', () => {
      expect(WORLD_CUP_CANADA_VENUES).toHaveLength(2);
    });

    test('All venues have required fields', () => {
      ALL_WORLD_CUP_VENUES.forEach(venue => {
        expect(venue).toHaveProperty('id');
        expect(venue).toHaveProperty('fifaName');
        expect(venue).toHaveProperty('commonName');
        expect(venue).toHaveProperty('city');
        expect(venue).toHaveProperty('country');
        expect(venue).toHaveProperty('latitude');
        expect(venue).toHaveProperty('longitude');
        expect(venue).toHaveProperty('timezone');
        expect(venue).toHaveProperty('capacity');
        expect(venue).toHaveProperty('soccerCapacity');
        expect(venue).toHaveProperty('fieldOrientation');
        expect(venue).toHaveProperty('fieldDimensions');
        expect(venue).toHaveProperty('sections');
        expect(venue).toHaveProperty('openingYear');
        expect(venue).toHaveProperty('surfaceType');
        expect(venue).toHaveProperty('roof');
        expect(venue).toHaveProperty('hostMatches');
      });
    });
  });

  describe('getWorldCupVenueById', () => {
    test('returns MetLife Stadium for "metlife-stadium-wc"', () => {
      const venue = getWorldCupVenueById('metlife-stadium-wc');
      expect(venue).toBeDefined();
      expect(venue?.commonName).toBe('MetLife Stadium');
      expect(venue?.city).toBe('East Rutherford');
    });

    test('returns SoFi Stadium for "sofi-stadium-wc"', () => {
      const venue = getWorldCupVenueById('sofi-stadium-wc');
      expect(venue).toBeDefined();
      expect(venue?.commonName).toBe('SoFi Stadium');
      expect(venue?.city).toBe('Inglewood');
    });

    test('returns Estadio Azteca for "estadio-azteca-wc"', () => {
      const venue = getWorldCupVenueById('estadio-azteca-wc');
      expect(venue).toBeDefined();
      expect(venue?.commonName).toBe('Estadio Azteca');
      expect(venue?.city).toBe('Mexico City');
    });

    test('returns undefined for non-existent venue', () => {
      const venue = getWorldCupVenueById('fake-stadium-wc');
      expect(venue).toBeUndefined();
    });
  });

  describe('getWorldCupVenuesByCountry', () => {
    test('returns 11 venues for USA', () => {
      const usaVenues = getWorldCupVenuesByCountry('USA');
      expect(usaVenues).toHaveLength(11);
      usaVenues.forEach(venue => {
        expect(venue.country).toBe('USA');
      });
    });

    test('returns 3 venues for Mexico', () => {
      const mexicoVenues = getWorldCupVenuesByCountry('Mexico');
      expect(mexicoVenues).toHaveLength(3);
      mexicoVenues.forEach(venue => {
        expect(venue.country).toBe('Mexico');
      });
    });

    test('returns 2 venues for Canada', () => {
      const canadaVenues = getWorldCupVenuesByCountry('Canada');
      expect(canadaVenues).toHaveLength(2);
      canadaVenues.forEach(venue => {
        expect(venue.country).toBe('Canada');
      });
    });
  });

  describe('getReadyWorldCupVenues', () => {
    test('returns 11 venues with section data', () => {
      const readyVenues = getReadyWorldCupVenues();
      expect(readyVenues).toHaveLength(11);
    });

    test('all ready venues have sections array with data', () => {
      const readyVenues = getReadyWorldCupVenues();
      readyVenues.forEach(venue => {
        expect(venue.sections.length).toBeGreaterThan(0);
      });
    });

    test('all ready venues are USA stadiums', () => {
      const readyVenues = getReadyWorldCupVenues();
      readyVenues.forEach(venue => {
        expect(venue.country).toBe('USA');
      });
    });
  });

  describe('USA Venue Row Data', () => {
    test('MetLife Stadium has sections with row data', () => {
      const metlife = getWorldCupVenueById('metlife-stadium-wc');
      expect(metlife).toBeDefined();
      expect(metlife!.sections.length).toBeGreaterThan(0);

      const firstSection = metlife!.sections[0];
      expect(firstSection.rows).toBeDefined();
      expect(firstSection.rows.length).toBeGreaterThan(0);

      const firstRow = firstSection.rows[0];
      expect(firstRow).toHaveProperty('rowNumber');
      expect(firstRow).toHaveProperty('seats');
      expect(firstRow).toHaveProperty('elevation');
      expect(firstRow).toHaveProperty('depth');
      expect(firstRow).toHaveProperty('covered');
    });

    test('all USA venues are based on NFL stadiums', () => {
      WORLD_CUP_USA_VENUES.forEach(venue => {
        expect(venue.basedOnNFLStadium).toBe(true);
        expect(venue.nflStadiumId).toBeDefined();
      });
    });
  });

  describe('Mexico/Canada Venue Placeholders', () => {
    test('Mexico venues have empty sections arrays (Phase 3)', () => {
      WORLD_CUP_MEXICO_VENUES.forEach(venue => {
        expect(venue.sections).toHaveLength(0);
        expect(venue.basedOnNFLStadium).toBe(false);
      });
    });

    test('Canada venues have empty sections arrays (Phase 3)', () => {
      WORLD_CUP_CANADA_VENUES.forEach(venue => {
        expect(venue.sections).toHaveLength(0);
        expect(venue.basedOnNFLStadium).toBe(false);
      });
    });
  });

  describe('WORLD_CUP_VENUE_STATS', () => {
    test('statistics match actual data', () => {
      expect(WORLD_CUP_VENUE_STATS.total).toBe(16);
      expect(WORLD_CUP_VENUE_STATS.usa).toBe(11);
      expect(WORLD_CUP_VENUE_STATS.mexico).toBe(3);
      expect(WORLD_CUP_VENUE_STATS.canada).toBe(2);
      expect(WORLD_CUP_VENUE_STATS.withRowData).toBe(11);
      expect(WORLD_CUP_VENUE_STATS.needingData).toBe(5);
    });

    test('total capacity is positive number', () => {
      expect(WORLD_CUP_VENUE_STATS.totalCapacity).toBeGreaterThan(1000000);
    });
  });

  describe('Venue IDs', () => {
    test('all venue IDs end with "-wc"', () => {
      ALL_WORLD_CUP_VENUES.forEach(venue => {
        expect(venue.id).toMatch(/-wc$/);
      });
    });

    test('all venue IDs are unique', () => {
      const ids = ALL_WORLD_CUP_VENUES.map(v => v.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Field Dimensions', () => {
    test('all soccer fields meet FIFA regulations', () => {
      ALL_WORLD_CUP_VENUES.forEach(venue => {
        const { length, width } = venue.fieldDimensions;
        // FIFA regulation: 100-110m length, 64-75m width
        expect(length).toBeGreaterThanOrEqual(100);
        expect(length).toBeLessThanOrEqual(110);
        expect(width).toBeGreaterThanOrEqual(64);
        expect(width).toBeLessThanOrEqual(75);
      });
    });
  });

  describe('Key Venues', () => {
    test('Opening match venue is Estadio Azteca', () => {
      const azteca = getWorldCupVenueById('estadio-azteca-wc');
      expect(azteca).toBeDefined();
      expect(azteca?.city).toBe('Mexico City');
    });

    test('Final venue is MetLife Stadium', () => {
      const metlife = getWorldCupVenueById('metlife-stadium-wc');
      expect(metlife).toBeDefined();
      expect(metlife?.hostMatches).toBe(8); // Final venue typically hosts most
    });

    test('Semifinal venues are AT&T and Mercedes-Benz', () => {
      const att = getWorldCupVenueById('att-stadium-wc');
      const mercedes = getWorldCupVenueById('mercedes-benz-stadium-wc');
      expect(att?.hostMatches).toBeGreaterThanOrEqual(8);
      expect(mercedes?.hostMatches).toBeGreaterThanOrEqual(8);
    });
  });
});
