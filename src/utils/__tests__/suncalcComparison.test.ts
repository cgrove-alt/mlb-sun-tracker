import SunCalc from 'suncalc';

describe('SunCalc Baseline Test', () => {
  it('should show SunCalc results for NYC Summer Solstice', () => {
    const date = new Date('2024-06-21T13:00:00-04:00');
    const lat = 40.7128;
    const lon = -74.0060;
    
    const sunPos = SunCalc.getPosition(date, lat, lon);
    
    // Convert radians to degrees and normalize azimuth
    const azimuthDegrees = ((sunPos.azimuth * 180 / Math.PI) + 180) % 360;
    const altitudeDegrees = sunPos.altitude * 180 / Math.PI;
    
    console.log('SunCalc result for NYC at 1 PM EDT on June 21:', {
      azimuthRadians: sunPos.azimuth,
      altitudeRadians: sunPos.altitude,
      azimuthDegrees: azimuthDegrees.toFixed(1),
      altitudeDegrees: altitudeDegrees.toFixed(1)
    });
    
    // Show sun path throughout the day
    console.log('\nSunCalc sun path for NYC on June 21:');
    for (let hour = 5; hour <= 20; hour++) {
      const hourDate = new Date(`2024-06-21T${hour.toString().padStart(2, '0')}:00:00-04:00`);
      const pos = SunCalc.getPosition(hourDate, lat, lon);
      const az = ((pos.azimuth * 180 / Math.PI) + 180) % 360;
      const alt = pos.altitude * 180 / Math.PI;
      
      console.log(`${hour}:00 EDT: azimuth=${az.toFixed(1)}°, altitude=${alt.toFixed(1)}°`);
    }
    
    // Expected from NOAA: azimuth ~214.5°, elevation ~70.8°
    expect(altitudeDegrees).toBeGreaterThan(65);
    expect(altitudeDegrees).toBeLessThan(75);
  });
});