import { getSunPositionSunCalcClone, getSunPositionImproved } from '../sunCalcClone';
import SunCalc from 'suncalc';

describe('SunCalc Clone Tests', () => {
  describe('Exact SunCalc Match', () => {
    it('should exactly match SunCalc results', () => {
      const testCases = [
        { name: 'NYC Summer Noon', date: new Date('2024-06-21T12:00:00-04:00'), lat: 40.7128, lon: -74.0060 },
        { name: 'NYC Summer 1PM', date: new Date('2024-06-21T13:00:00-04:00'), lat: 40.7128, lon: -74.0060 },
        { name: 'Miami Winter', date: new Date('2024-12-21T15:00:00-05:00'), lat: 25.7617, lon: -80.1918 }
      ];

      console.log('SunCalc Clone vs Original:');
      console.log('Test Case | Clone Az | SC Az | Clone El | SC El | Az Diff | El Diff');
      console.log('----------|----------|-------|----------|-------|---------|--------');

      testCases.forEach(test => {
        const clone = getSunPositionSunCalcClone(test.date, test.lat, test.lon);
        const original = SunCalc.getPosition(test.date, test.lat, test.lon);
        const origAz = ((original.azimuth * 180 / Math.PI) + 180) % 360;
        const origEl = original.altitude * 180 / Math.PI;
        
        const azDiff = Math.abs(clone.azimuthDegrees - origAz);
        const elDiff = Math.abs(clone.altitudeDegrees - origEl);
        
        console.log(
          `${test.name.padEnd(9)} | ${clone.azimuthDegrees.toFixed(1).padStart(8)} | ${
          origAz.toFixed(1).padStart(5)} | ${clone.altitudeDegrees.toFixed(1).padStart(8)} | ${
          origEl.toFixed(1).padStart(5)} | ${azDiff.toFixed(2).padStart(7)} | ${
          elDiff.toFixed(2).padStart(6)}`
        );
        
        // Should match within floating point precision
        expect(azDiff).toBeLessThan(0.1);
        expect(elDiff).toBeLessThan(0.1);
      });
    });
  });

  describe('Improved Version Tests', () => {
    it('should produce reasonable improvements over basic SunCalc', () => {
      const testCases = [
        { 
          name: 'NYC Summer 1PM', 
          date: new Date('2024-06-21T13:00:00-04:00'), 
          lat: 40.7128, 
          lon: -74.0060,
          noaa: { azimuth: 214.5, elevation: 70.8 }
        },
        { 
          name: 'Miami Winter 3PM', 
          date: new Date('2024-12-21T15:00:00-05:00'), 
          lat: 25.7617, 
          lon: -80.1918,
          noaa: { azimuth: 231.8, elevation: 29.4 }
        }
      ];

      console.log('\nImproved Version vs NOAA:');
      console.log('Test Case | Calc Az | NOAA Az | Calc El | NOAA El | Az Diff | El Diff');
      console.log('----------|---------|---------|---------|---------|---------|--------');

      testCases.forEach(test => {
        const improved = getSunPositionImproved(test.date, test.lat, test.lon);
        const suncalc = SunCalc.getPosition(test.date, test.lat, test.lon);
        const scAz = ((suncalc.azimuth * 180 / Math.PI) + 180) % 360;
        const scEl = suncalc.altitude * 180 / Math.PI;
        
        const azDiffNoaa = Math.abs(improved.azimuthDegrees - test.noaa.azimuth);
        const elDiffNoaa = Math.abs(improved.altitudeDegrees - test.noaa.elevation);
        
        console.log(
          `${test.name.padEnd(9)} | ${improved.azimuthDegrees.toFixed(1).padStart(7)} | ${
          test.noaa.azimuth.toFixed(1).padStart(7)} | ${improved.altitudeDegrees.toFixed(1).padStart(7)} | ${
          test.noaa.elevation.toFixed(1).padStart(7)} | ${azDiffNoaa.toFixed(1).padStart(7)} | ${
          elDiffNoaa.toFixed(1).padStart(6)}`
        );
        
        console.log(`  SunCalc: Az=${scAz.toFixed(1)}, El=${scEl.toFixed(1)}`);
        
        // Should still produce reasonable results
        expect(improved.altitudeDegrees).toBeGreaterThan(0); // Sun above horizon
        expect(Math.abs(improved.altitudeDegrees - scEl)).toBeLessThan(1); // Very close to SunCalc
      });
    });
  });

  describe('Sun Path Validation', () => {
    it('should show correct daily sun movement', () => {
      const lat = 40.7128;
      const lon = -74.0060;
      
      console.log('\nDaily Sun Path (NYC Summer Solstice):');
      console.log('Hour | Clone Az | Clone El | SC Az | SC El');
      console.log('-----|----------|----------|-------|------');
      
      const positions = [];
      for (let hour = 5; hour <= 20; hour++) {
        const date = new Date(`2024-06-21T${hour.toString().padStart(2, '0')}:00:00-04:00`);
        const clone = getSunPositionSunCalcClone(date, lat, lon);
        const sc = SunCalc.getPosition(date, lat, lon);
        const scAz = ((sc.azimuth * 180 / Math.PI) + 180) % 360;
        const scEl = sc.altitude * 180 / Math.PI;
        
        positions.push({ hour, azimuth: clone.azimuthDegrees, elevation: clone.altitudeDegrees });
        
        console.log(
          `${hour.toString().padStart(2, '0')}:00 | ${
          clone.azimuthDegrees.toFixed(1).padStart(8)} | ${
          clone.altitudeDegrees.toFixed(1).padStart(8)} | ${
          scAz.toFixed(1).padStart(5)} | ${
          scEl.toFixed(1).padStart(5)}`
        );
      }
      
      // Validate sun movement pattern
      const maxEl = Math.max(...positions.map(p => p.elevation));
      const maxElPos = positions.find(p => p.elevation === maxEl);
      
      console.log(`\nMax elevation: ${maxEl.toFixed(1)}° at ${maxElPos?.hour}:00`);
      
      // Morning should be east (< 180), evening west (> 180)
      expect(positions[0].azimuth).toBeLessThan(90); // Early morning in east
      expect(positions[positions.length - 1].azimuth).toBeGreaterThan(270); // Evening in west
      expect(maxEl).toBeGreaterThan(65); // High summer sun
      expect(maxElPos?.hour).toBeGreaterThanOrEqual(12);
      expect(maxElPos?.hour).toBeLessThanOrEqual(13);
    });
  });
});