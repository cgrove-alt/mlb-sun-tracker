import { computeSunPosition } from '../nrelSolarPosition';

describe('NREL Debug - Timezone Analysis', () => {
  it('should debug timezone handling', () => {
    // Test case: NYC at 1 PM EDT on June 21, 2024
    // Local time: 2024-06-21 13:00:00 EDT (UTC-4)
    // UTC time: 2024-06-21 17:00:00 UTC
    
    const localDate = new Date('2024-06-21T13:00:00-04:00');
    console.log('Input date:', {
      iso: localDate.toISOString(),
      localString: localDate.toString(),
      utcHours: localDate.getUTCHours(),
      localHours: localDate.getHours(),
      timezoneOffset: localDate.getTimezoneOffset()
    });
    
    // NYC coordinates
    const lat = 40.7128;
    const lon = -74.0060;
    const tzOffset = -4; // EDT
    
    const result = computeSunPosition(localDate, lat, lon, tzOffset);
    
    console.log('NREL Result:', {
      azimuth: result.azimuth,
      elevation: result.elevation,
      zenith: result.zenith
    });
    
    // Expected from NOAA for NYC at 1 PM EDT on June 21:
    // Azimuth: ~214.5°
    // Elevation: ~70.8°
    
    // Also test with a manually created UTC date
    const year = 2024;
    const month = 6; // June
    const day = 21;
    const hour = 17; // 17:00 UTC = 13:00 EDT
    const minute = 0;
    const second = 0;
    
    // Create date using UTC components
    const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    console.log('\nUTC date:', {
      iso: utcDate.toISOString(),
      localString: utcDate.toString(),
      utcHours: utcDate.getUTCHours()
    });
    
    const result2 = computeSunPosition(utcDate, lat, lon, tzOffset);
    console.log('NREL Result with UTC date:', {
      azimuth: result2.azimuth,
      elevation: result2.elevation
    });
    
    // Test Julian Date calculation directly
    // For 2024-06-21 17:00:00 UTC, Julian Date should be approximately 2460483.208333
    const expectedJD = 2460483.208333;
    console.log('\nExpected Julian Date:', expectedJD);
  });
  
  it('should test multiple times throughout the day', () => {
    const lat = 40.7128;
    const lon = -74.0060;
    const date = '2024-06-21';
    
    console.log('\nSun position throughout the day in NYC:');
    for (let hour = 5; hour <= 20; hour++) {
      const localDate = new Date(`${date}T${hour.toString().padStart(2, '0')}:00:00-04:00`);
      const result = computeSunPosition(localDate, lat, lon, -4);
      
      console.log(`${hour}:00 EDT:`, {
        azimuth: result.azimuth.toFixed(1),
        elevation: result.elevation.toFixed(1),
        utcHour: localDate.getUTCHours()
      });
    }
  });
});