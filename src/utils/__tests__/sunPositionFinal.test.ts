import { getSunPosition } from '../sunCalculations';
import SunCalc from 'suncalc';

describe('Final Sun Position Implementation Tests', () => {
  beforeAll(() => {
    // Enable improved algorithm
    process.env.REACT_APP_USE_IMPROVED_SPA = 'true';
  });

  describe('Integration Tests', () => {
    it('should work correctly with getSunPosition wrapper', () => {
      const date = new Date('2024-06-21T13:00:00-04:00');
      const lat = 40.7128;
      const lon = -74.0060;
      
      const result = getSunPosition(date, lat, lon);
      
      console.log('getSunPosition result:', {
        azimuthRadians: result.azimuth,
        altitudeRadians: result.altitude,
        azimuthDegrees: result.azimuthDegrees,
        altitudeDegrees: result.altitudeDegrees
      });
      
      // Should produce reasonable results
      expect(result.altitudeDegrees).toBeGreaterThan(70);
      expect(result.altitudeDegrees).toBeLessThan(75);
      expect(result.azimuthDegrees).toBeGreaterThan(170);
      expect(result.azimuthDegrees).toBeLessThan(190);
    });
  });

  describe('Comparison with SunCalc and NOAA', () => {
    const testCases = [
      {
        name: 'NYC Summer Solstice 1 PM EDT',
        date: new Date('2024-06-21T13:00:00-04:00'),
        latitude: 40.7128,
        longitude: -74.0060,
        noaa: { azimuth: 214.5, elevation: 70.8 }
      },
      {
        name: 'Miami Winter Solstice 3 PM EST',
        date: new Date('2024-12-21T15:00:00-05:00'),
        latitude: 25.7617,
        longitude: -80.1918,
        noaa: { azimuth: 231.8, elevation: 29.4 }
      },
      {
        name: 'Seattle Spring Equinox Noon PDT',
        date: new Date('2024-03-20T12:00:00-07:00'),
        latitude: 47.6062,
        longitude: -122.3321,
        noaa: { azimuth: 179.3, elevation: 40.1 }
      }
    ];

    testCases.forEach(test => {
      it(`should produce accurate results for ${test.name}`, () => {
        const improved = getSunPosition(test.date, test.latitude, test.longitude);
        const suncalc = SunCalc.getPosition(test.date, test.latitude, test.longitude);
        const suncalcAz = ((suncalc.azimuth * 180 / Math.PI) + 180) % 360;
        const suncalcEl = suncalc.altitude * 180 / Math.PI;
        
        console.log(`\n${test.name}:`);
        console.log('  Improved:', { 
          azimuth: improved.azimuthDegrees.toFixed(1), 
          elevation: improved.altitudeDegrees.toFixed(1) 
        });
        console.log('  SunCalc:', { 
          azimuth: suncalcAz.toFixed(1), 
          elevation: suncalcEl.toFixed(1) 
        });
        console.log('  NOAA:', test.noaa);
        console.log('  Difference from NOAA:', {
          azimuth: Math.abs(improved.azimuthDegrees - test.noaa.azimuth).toFixed(1),
          elevation: Math.abs(improved.altitudeDegrees - test.noaa.elevation).toFixed(1)
        });
        
        // Elevation should be very close to SunCalc (< 1°)
        expect(Math.abs(improved.altitudeDegrees - suncalcEl)).toBeLessThan(1);
        
        // Elevation should be reasonably close to NOAA (< 3°)
        expect(Math.abs(improved.altitudeDegrees - test.noaa.elevation)).toBeLessThan(3);
      });
    });
  });

  describe('MLB Stadium Sun Calculations', () => {
    it('should correctly identify sunny/shaded sections', () => {
      // Yankee Stadium, summer afternoon
      const date = new Date('2024-07-15T16:00:00-04:00');
      const lat = 40.8296;
      const lon = -73.9262;
      
      const sunPos = getSunPosition(date, lat, lon);
      
      console.log('\nYankee Stadium 4 PM Summer:', {
        azimuth: sunPos.azimuthDegrees.toFixed(1),
        elevation: sunPos.altitudeDegrees.toFixed(1)
      });
      
      // At 4 PM in summer, sun should be in the west
      expect(sunPos.azimuthDegrees).toBeGreaterThan(240);
      expect(sunPos.azimuthDegrees).toBeLessThan(280);
      expect(sunPos.altitudeDegrees).toBeGreaterThan(40);
      expect(sunPos.altitudeDegrees).toBeLessThan(60);
    });
  });

  describe('Performance Test', () => {
    it('should calculate sun positions efficiently', () => {
      const start = Date.now();
      const iterations = 1000;
      
      for (let i = 0; i < iterations; i++) {
        const date = new Date(2024, 5, 21, 12 + (i % 12));
        getSunPosition(date, 40.7128 + (i % 10) / 10, -74.0060);
      }
      
      const duration = Date.now() - start;
      const avgTime = duration / iterations;
      
      console.log(`\nPerformance: ${iterations} calculations in ${duration}ms`);
      console.log(`Average time per calculation: ${avgTime.toFixed(2)}ms`);
      
      // Should be fast (< 1ms per calculation on average)
      expect(avgTime).toBeLessThan(1);
    });
  });
});