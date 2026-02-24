import {
  calculateDistance,
  kmToMiles,
  formatDistance,
  estimateTravelTime,
  formatTravelTime,
  getClimateZone,
  getPackingTips,
} from '../venueDistance';

describe('venueDistance utilities', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between New York and Los Angeles', () => {
      // MetLife Stadium (NY) to SoFi Stadium (LA)
      const distance = calculateDistance(40.8135, -74.0745, 33.9535, -118.3392);
      expect(distance).toBeGreaterThan(3900);
      expect(distance).toBeLessThan(4000);
    });

    it('should calculate distance between nearby venues', () => {
      // MetLife Stadium to Lincoln Financial Field (Philadelphia)
      const distance = calculateDistance(40.8135, -74.0745, 39.9008, -75.1675);
      expect(distance).toBeGreaterThan(120);
      expect(distance).toBeLessThan(140);
    });

    it('should return 0 for same coordinates', () => {
      const distance = calculateDistance(40.8135, -74.0745, 40.8135, -74.0745);
      expect(distance).toBe(0);
    });
  });

  describe('kmToMiles', () => {
    it('should convert kilometers to miles correctly', () => {
      expect(kmToMiles(100)).toBeCloseTo(62.1, 1);
      expect(kmToMiles(1000)).toBeCloseTo(621.4, 1);
      expect(kmToMiles(0)).toBe(0);
    });
  });

  describe('formatDistance', () => {
    it('should format distance with both km and miles', () => {
      const formatted = formatDistance(100);
      expect(formatted).toContain('100.0 km');
      expect(formatted).toContain('mi');
    });

    it('should format decimal distances correctly', () => {
      const formatted = formatDistance(123.456);
      expect(formatted).toContain('123.5 km');
    });
  });

  describe('estimateTravelTime', () => {
    it('should estimate driving time for short distances', () => {
      // 200km should be ~2.5 hours driving
      const time = estimateTravelTime(200);
      expect(time).toBeCloseTo(2.5, 1);
    });

    it('should estimate flight time for long distances', () => {
      // 4000km should include flight time + 2hr airport time
      const time = estimateTravelTime(4000);
      expect(time).toBeGreaterThan(6); // 4000/800 + 2 = 7 hours
      expect(time).toBeLessThan(8);
    });

    it('should return 0 for 0 distance', () => {
      expect(estimateTravelTime(0)).toBe(0);
    });
  });

  describe('formatTravelTime', () => {
    it('should format time less than 1 hour in minutes', () => {
      expect(formatTravelTime(0.5)).toBe('30 min');
      expect(formatTravelTime(0.25)).toBe('15 min');
    });

    it('should format whole hours correctly', () => {
      expect(formatTravelTime(1)).toBe('1 hour');
      expect(formatTravelTime(2)).toBe('2 hours');
      expect(formatTravelTime(5)).toBe('5 hours');
    });

    it('should format hours and minutes', () => {
      expect(formatTravelTime(1.5)).toBe('1h 30m');
      expect(formatTravelTime(2.25)).toBe('2h 15m');
      expect(formatTravelTime(3.75)).toBe('3h 45m');
    });
  });

  describe('getClimateZone', () => {
    it('should classify northern latitudes as mild', () => {
      expect(getClimateZone(49.2768)).toContain('Northern'); // Vancouver
      expect(getClimateZone(47.5952)).toContain('Northern'); // Seattle
    });

    it('should classify temperate latitudes', () => {
      expect(getClimateZone(40.8135)).toContain('Temperate'); // New York
      expect(getClimateZone(42.0909)).toContain('Temperate'); // Boston
    });

    it('should classify subtropical latitudes', () => {
      expect(getClimateZone(32.7473)).toContain('Subtropical'); // Dallas
      expect(getClimateZone(33.7555)).toContain('Subtropical'); // Atlanta
    });

    it('should classify tropical latitudes', () => {
      expect(getClimateZone(19.3029)).toContain('Tropical'); // Mexico City
      expect(getClimateZone(20.6861)).toContain('Tropical'); // Guadalajara
    });
  });

  describe('getPackingTips', () => {
    it('should suggest layers for varied climates', () => {
      const tips = getPackingTips(['Northern (Mild summer)', 'Subtropical (Hot summer)', 'Tropical (Very hot)']);
      expect(tips.some(tip => tip.includes('layers'))).toBe(true);
    });

    it('should suggest sun protection for hot climates', () => {
      const tips = getPackingTips(['Tropical (Very hot)', 'Subtropical (Hot summer)']);
      expect(tips.some(tip => tip.includes('sunscreen') || tip.includes('hydrated'))).toBe(true);
    });

    it('should suggest jacket for mild climates', () => {
      const tips = getPackingTips(['Northern (Mild summer)']);
      expect(tips.some(tip => tip.includes('jacket'))).toBe(true);
    });

    it('should provide default tip for empty zones', () => {
      const tips = getPackingTips([]);
      expect(tips.length).toBeGreaterThan(0);
      expect(tips[0]).toContain('weather forecasts');
    });
  });
});
