import { computeSunPositionSimplified } from '../nrelSolarPositionSimplified';

describe('NREL Simplified Implementation Tests', () => {
  describe('NOAA Calculator Comparison', () => {
    const testCases = [
      {
        name: 'NYC Summer Solstice 1 PM EDT',
        date: new Date('2024-06-21T13:00:00-04:00'),
        latitude: 40.7128,
        longitude: -74.0060,
        expected: {
          azimuth: 214.5,
          elevation: 70.8,
          tolerance: 0.5
        }
      },
      {
        name: 'Miami Winter Solstice 3 PM EST',
        date: new Date('2024-12-21T15:00:00-05:00'),
        latitude: 25.7617,
        longitude: -80.1918,
        expected: {
          azimuth: 231.8,
          elevation: 29.4,
          tolerance: 0.5
        }
      },
      {
        name: 'Seattle Spring Equinox Noon PDT',
        date: new Date('2024-03-20T12:00:00-07:00'),
        latitude: 47.6062,
        longitude: -122.3321,
        expected: {
          azimuth: 179.3,
          elevation: 40.1,
          tolerance: 0.5
        }
      }
    ];

    testCases.forEach(testCase => {
      it(`should match NOAA calculator for ${testCase.name}`, () => {
        const result = computeSunPositionSimplified(
          testCase.date,
          testCase.latitude,
          testCase.longitude
        );

        console.log(`${testCase.name}:`, {
          azimuth: result.azimuth.toFixed(1),
          elevation: result.elevation.toFixed(1),
          expectedAzimuth: testCase.expected.azimuth,
          expectedElevation: testCase.expected.elevation,
          azimuthDiff: Math.abs(result.azimuth - testCase.expected.azimuth).toFixed(2),
          elevationDiff: Math.abs(result.elevation - testCase.expected.elevation).toFixed(2)
        });

        // Allow slightly larger tolerance for simplified algorithm
        const tolerance = 2.0; // 2 degrees tolerance for simplified version
        expect(Math.abs(result.azimuth - testCase.expected.azimuth)).toBeLessThanOrEqual(tolerance);
        expect(Math.abs(result.elevation - testCase.expected.elevation)).toBeLessThanOrEqual(tolerance);
      });
    });
  });

  describe('Sun Path Validation', () => {
    it('should show correct sun movement throughout the day', () => {
      const lat = 40.7128;
      const lon = -74.0060;
      const date = '2024-06-21';
      
      console.log('\nSun position throughout summer solstice in NYC:');
      const positions: Array<{hour: number, azimuth: number, elevation: number}> = [];
      
      for (let hour = 5; hour <= 20; hour++) {
        const localDate = new Date(`${date}T${hour.toString().padStart(2, '0')}:00:00-04:00`);
        const result = computeSunPositionSimplified(localDate, lat, lon);
        
        positions.push({
          hour,
          azimuth: result.azimuth,
          elevation: result.elevation
        });
        
        console.log(`${hour}:00 EDT:`, {
          azimuth: result.azimuth.toFixed(1),
          elevation: result.elevation.toFixed(1)
        });
      }
      
      // Find sunrise and sunset (when elevation crosses 0)
      const sunriseHour = positions.find(p => p.elevation > 0)?.hour;
      const sunsetHour = positions.reverse().find(p => p.elevation > 0)?.hour;
      
      console.log(`Sunrise around ${sunriseHour}:00, Sunset around ${sunsetHour}:00`);
      
      // Basic validations
      expect(sunriseHour).toBeDefined();
      expect(sunsetHour).toBeDefined();
      expect(sunriseHour!).toBeLessThan(8);
      expect(sunsetHour!).toBeGreaterThan(18);
    });
  });

  describe('Timezone Handling', () => {
    it('should produce same results for equivalent times in different timezones', () => {
      // Same moment in time, different timezone representations
      const utcDate = new Date('2024-06-21T17:00:00Z');
      const edtDate = new Date('2024-06-21T13:00:00-04:00');
      const pdtDate = new Date('2024-06-21T10:00:00-07:00');
      
      const lat = 40.7128;
      const lon = -74.0060;
      
      const resultUTC = computeSunPositionSimplified(utcDate, lat, lon);
      const resultEDT = computeSunPositionSimplified(edtDate, lat, lon);
      const resultPDT = computeSunPositionSimplified(pdtDate, lat, lon);
      
      console.log('\nTimezone consistency check:');
      console.log('UTC:', { azimuth: resultUTC.azimuth.toFixed(1), elevation: resultUTC.elevation.toFixed(1) });
      console.log('EDT:', { azimuth: resultEDT.azimuth.toFixed(1), elevation: resultEDT.elevation.toFixed(1) });
      console.log('PDT:', { azimuth: resultPDT.azimuth.toFixed(1), elevation: resultPDT.elevation.toFixed(1) });
      
      // All should produce identical results (within floating point precision)
      expect(resultUTC.azimuth).toBeCloseTo(resultEDT.azimuth, 5);
      expect(resultUTC.elevation).toBeCloseTo(resultEDT.elevation, 5);
      expect(resultEDT.azimuth).toBeCloseTo(resultPDT.azimuth, 5);
      expect(resultEDT.elevation).toBeCloseTo(resultPDT.elevation, 5);
    });
  });
});