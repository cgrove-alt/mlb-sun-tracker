import { computeSunPositionCorrected } from '../nrelSolarPositionCorrected';
import SunCalc from 'suncalc';

describe('NREL Corrected Implementation Tests', () => {
  describe('Basic Functionality Test', () => {
    it('should produce positive elevation during daytime', () => {
      const date = new Date('2024-06-21T13:00:00-04:00');
      const lat = 40.7128;
      const lon = -74.0060;
      
      const result = computeSunPositionCorrected(date, lat, lon);
      
      console.log('NYC Summer Solstice 1 PM EDT:', {
        azimuth: result.azimuth.toFixed(1),
        elevation: result.elevation.toFixed(1),
        zenith: result.zenith.toFixed(1)
      });
      
      // Basic sanity checks
      expect(result.elevation).toBeGreaterThan(0); // Sun should be above horizon
      expect(result.elevation).toBeLessThan(90); // Sun can't be higher than 90°
      expect(result.azimuth).toBeGreaterThanOrEqual(0);
      expect(result.azimuth).toBeLessThan(360);
    });
  });

  describe('Comparison with SunCalc', () => {
    const testCases = [
      {
        name: 'NYC Summer Noon',
        date: new Date('2024-06-21T12:00:00-04:00'),
        lat: 40.7128,
        lon: -74.0060
      },
      {
        name: 'Miami Winter Afternoon',
        date: new Date('2024-12-21T15:00:00-05:00'),
        lat: 25.7617,
        lon: -80.1918
      },
      {
        name: 'Seattle Spring Morning',
        date: new Date('2024-03-20T09:00:00-07:00'),
        lat: 47.6062,
        lon: -122.3321
      }
    ];

    testCases.forEach(test => {
      it(`should be reasonably close to SunCalc for ${test.name}`, () => {
        const nrelResult = computeSunPositionCorrected(test.date, test.lat, test.lon);
        const suncalcPos = SunCalc.getPosition(test.date, test.lat, test.lon);
        const suncalcAz = ((suncalcPos.azimuth * 180 / Math.PI) + 180) % 360;
        const suncalcAlt = suncalcPos.altitude * 180 / Math.PI;
        
        console.log(`${test.name}:`, {
          nrel: {
            azimuth: nrelResult.azimuth.toFixed(1),
            elevation: nrelResult.elevation.toFixed(1)
          },
          suncalc: {
            azimuth: suncalcAz.toFixed(1),
            elevation: suncalcAlt.toFixed(1)
          },
          diff: {
            azimuth: Math.abs(nrelResult.azimuth - suncalcAz).toFixed(1),
            elevation: Math.abs(nrelResult.elevation - suncalcAlt).toFixed(1)
          }
        });
        
        // Allow reasonable tolerance between implementations
        expect(Math.abs(nrelResult.elevation - suncalcAlt)).toBeLessThan(5);
      });
    });
  });

  describe('Sun Path Validation', () => {
    it('should show realistic sun movement', () => {
      const lat = 40.7128;
      const lon = -74.0060;
      const positions: Array<{hour: number, azimuth: number, elevation: number}> = [];
      
      console.log('\nSun path for NYC on summer solstice:');
      for (let hour = 5; hour <= 20; hour++) {
        const date = new Date(`2024-06-21T${hour.toString().padStart(2, '0')}:00:00-04:00`);
        const result = computeSunPositionCorrected(date, lat, lon);
        
        positions.push({
          hour,
          azimuth: result.azimuth,
          elevation: result.elevation
        });
        
        console.log(`${hour}:00 EDT: azimuth=${result.azimuth.toFixed(1)}°, elevation=${result.elevation.toFixed(1)}°`);
      }
      
      // Find max elevation
      const maxElevation = Math.max(...positions.map(p => p.elevation));
      const maxElevationHour = positions.find(p => p.elevation === maxElevation)?.hour;
      
      console.log(`\nMax elevation: ${maxElevation.toFixed(1)}° at ${maxElevationHour}:00`);
      
      // Validations
      expect(maxElevation).toBeGreaterThan(65); // Summer solstice should have high sun
      expect(maxElevation).toBeLessThan(80); // But not directly overhead at 40°N
      expect(maxElevationHour).toBeGreaterThanOrEqual(12);
      expect(maxElevationHour).toBeLessThanOrEqual(13);
      
      // Morning sun should be in the east (azimuth < 180)
      expect(positions[0].azimuth).toBeLessThan(90);
      
      // Evening sun should be in the west (azimuth > 180)
      expect(positions[positions.length - 1].azimuth).toBeGreaterThan(270);
    });
  });

  describe('NOAA Comparison', () => {
    const noaaTestCases = [
      {
        name: 'NYC Summer Solstice 1 PM EDT',
        date: new Date('2024-06-21T13:00:00-04:00'),
        latitude: 40.7128,
        longitude: -74.0060,
        expected: { azimuth: 214.5, elevation: 70.8 }
      },
      {
        name: 'Miami Winter Solstice 3 PM EST',
        date: new Date('2024-12-21T15:00:00-05:00'),
        latitude: 25.7617,
        longitude: -80.1918,
        expected: { azimuth: 231.8, elevation: 29.4 }
      }
    ];

    noaaTestCases.forEach(test => {
      it(`should be close to NOAA values for ${test.name}`, () => {
        const result = computeSunPositionCorrected(test.date, test.latitude, test.longitude);
        
        console.log(`${test.name}:`, {
          calculated: {
            azimuth: result.azimuth.toFixed(1),
            elevation: result.elevation.toFixed(1)
          },
          expected: test.expected,
          diff: {
            azimuth: Math.abs(result.azimuth - test.expected.azimuth).toFixed(1),
            elevation: Math.abs(result.elevation - test.expected.elevation).toFixed(1)
          }
        });
        
        // Check if within reasonable tolerance (5 degrees for simplified algorithm)
        expect(Math.abs(result.azimuth - test.expected.azimuth)).toBeLessThan(10);
        expect(Math.abs(result.elevation - test.expected.elevation)).toBeLessThan(5);
      });
    });
  });
});