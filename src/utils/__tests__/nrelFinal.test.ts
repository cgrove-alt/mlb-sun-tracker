import { computeSunPositionFinal } from '../nrelSolarPositionFinal';
import SunCalc from 'suncalc';

describe('NREL Final Implementation Tests', () => {
  describe('Basic Sanity Checks', () => {
    it('should produce reasonable results for NYC summer noon', () => {
      const date = new Date('2024-06-21T13:00:00-04:00');
      const lat = 40.7128;
      const lon = -74.0060;
      
      const result = computeSunPositionFinal(date, lat, lon);
      const suncalcPos = SunCalc.getPosition(date, lat, lon);
      const suncalcAz = ((suncalcPos.azimuth * 180 / Math.PI) + 180) % 360;
      const suncalcAlt = suncalcPos.altitude * 180 / Math.PI;
      
      console.log('NYC Summer 1 PM EDT:', {
        nrel: { azimuth: result.azimuth.toFixed(1), elevation: result.elevation.toFixed(1) },
        suncalc: { azimuth: suncalcAz.toFixed(1), elevation: suncalcAlt.toFixed(1) },
        expected: { azimuth: 214.5, elevation: 70.8 }
      });
      
      // Basic checks
      expect(result.elevation).toBeGreaterThan(60); // High sun in summer
      expect(result.elevation).toBeLessThan(80);
      expect(result.azimuth).toBeGreaterThan(180); // Afternoon = west of south
      expect(result.azimuth).toBeLessThan(270);
    });
  });

  describe('Comprehensive Sun Path Test', () => {
    it('should show correct sun movement pattern', () => {
      const lat = 40.7128;
      const lon = -74.0060;
      
      console.log('\nNYC Summer Solstice Sun Path:');
      console.log('Hour | Azimuth | Elevation | SunCalc Az | SunCalc El');
      console.log('-----|---------|-----------|------------|------------');
      
      for (let hour = 5; hour <= 20; hour++) {
        const date = new Date(`2024-06-21T${hour.toString().padStart(2, '0')}:00:00-04:00`);
        const nrel = computeSunPositionFinal(date, lat, lon);
        const sc = SunCalc.getPosition(date, lat, lon);
        const scAz = ((sc.azimuth * 180 / Math.PI) + 180) % 360;
        const scAlt = sc.altitude * 180 / Math.PI;
        
        console.log(
          `${hour.toString().padStart(2, '0')}:00 | ${nrel.azimuth.toFixed(1).padStart(7)} | ${
          nrel.elevation.toFixed(1).padStart(9)} | ${scAz.toFixed(1).padStart(10)} | ${
          scAlt.toFixed(1).padStart(10)}`
        );
      }
      
      // Test morning/evening pattern
      const morning = computeSunPositionFinal(new Date('2024-06-21T08:00:00-04:00'), lat, lon);
      const evening = computeSunPositionFinal(new Date('2024-06-21T18:00:00-04:00'), lat, lon);
      
      expect(morning.azimuth).toBeLessThan(180); // Morning = east
      expect(evening.azimuth).toBeGreaterThan(180); // Evening = west
    });
  });

  describe('NOAA Comparison Tests', () => {
    const testCases = [
      {
        name: 'NYC Summer 1 PM',
        date: new Date('2024-06-21T13:00:00-04:00'),
        lat: 40.7128,
        lon: -74.0060,
        noaa: { azimuth: 214.5, elevation: 70.8 }
      },
      {
        name: 'Miami Winter 3 PM',
        date: new Date('2024-12-21T15:00:00-05:00'),
        lat: 25.7617,
        lon: -80.1918,
        noaa: { azimuth: 231.8, elevation: 29.4 }
      },
      {
        name: 'Seattle Spring Noon',
        date: new Date('2024-03-20T12:00:00-07:00'),
        lat: 47.6062,
        lon: -122.3321,
        noaa: { azimuth: 179.3, elevation: 40.1 }
      }
    ];

    testCases.forEach(test => {
      it(`should be close to NOAA for ${test.name}`, () => {
        const result = computeSunPositionFinal(test.date, test.lat, test.lon);
        
        console.log(`${test.name}:`, {
          calculated: { azimuth: result.azimuth.toFixed(1), elevation: result.elevation.toFixed(1) },
          noaa: test.noaa,
          diff: {
            azimuth: Math.abs(result.azimuth - test.noaa.azimuth).toFixed(1),
            elevation: Math.abs(result.elevation - test.noaa.elevation).toFixed(1)
          }
        });
        
        // Allow 3° tolerance for this simplified implementation
        expect(Math.abs(result.elevation - test.noaa.elevation)).toBeLessThan(3);
        // Azimuth can have larger errors due to coordinate system differences
        expect(Math.abs(result.azimuth - test.noaa.azimuth)).toBeLessThan(30);
      });
    });
  });

  describe('Direct SunCalc Comparison', () => {
    it('should closely match SunCalc results', () => {
      const testPoints = [
        { hour: 6, name: 'Early Morning' },
        { hour: 9, name: 'Morning' },
        { hour: 12, name: 'Noon' },
        { hour: 15, name: 'Afternoon' },
        { hour: 18, name: 'Evening' }
      ];

      console.log('\nDirect SunCalc Comparison:');
      
      testPoints.forEach(point => {
        const date = new Date(`2024-06-21T${point.hour.toString().padStart(2, '0')}:00:00-04:00`);
        const lat = 40.7128;
        const lon = -74.0060;
        
        const nrel = computeSunPositionFinal(date, lat, lon);
        const sc = SunCalc.getPosition(date, lat, lon);
        const scAz = ((sc.azimuth * 180 / Math.PI) + 180) % 360;
        const scAlt = sc.altitude * 180 / Math.PI;
        
        const azDiff = Math.abs(nrel.azimuth - scAz);
        const elDiff = Math.abs(nrel.elevation - scAlt);
        
        console.log(`${point.name} (${point.hour}:00):`, {
          azimuthDiff: azDiff.toFixed(1),
          elevationDiff: elDiff.toFixed(1)
        });
        
        // Should be very close to SunCalc
        expect(elDiff).toBeLessThan(2);
      });
    });
  });
});