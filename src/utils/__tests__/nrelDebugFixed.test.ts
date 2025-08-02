import { computeSunPositionFixed } from '../nrelSolarPositionFixed';

describe('NREL Fixed Debug - Step by Step', () => {
  it('should debug calculation steps', () => {
    // Test case: NYC at 1 PM EDT on June 21, 2024
    const localDate = new Date('2024-06-21T13:00:00-04:00');
    const lat = 40.7128;
    const lon = -74.0060;
    
    console.log('Input:', {
      date: localDate.toISOString(),
      utcHours: localDate.getUTCHours(),
      localHours: localDate.getHours(),
      lat,
      lon
    });
    
    // Expected from NOAA:
    // Azimuth: ~214.5°
    // Elevation: ~70.8°
    
    const result = computeSunPositionFixed(localDate, lat, lon);
    
    console.log('Result:', {
      azimuth: result.azimuth,
      elevation: result.elevation,
      zenith: result.zenith
    });
  });
});