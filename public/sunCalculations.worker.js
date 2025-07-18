// Sun calculation functions
function getSunPosition(date, lat, lng) {
  const toRad = (deg) => deg * (Math.PI / 180);
  const toDeg = (rad) => rad * (180 / Math.PI);

  // Calculate Julian date
  const julianDate = date.getTime() / 86400000 + 2440587.5;
  const julianCentury = (julianDate - 2451545) / 36525;

  // Solar calculations
  const meanLongitude = (280.46646 + julianCentury * (36000.76983 + julianCentury * 0.0003032)) % 360;
  const meanAnomaly = toRad(357.52911 + julianCentury * (35999.05029 - 0.0001537 * julianCentury));
  const equationOfCenter = Math.sin(meanAnomaly) * (1.914602 - julianCentury * (0.004817 + 0.000014 * julianCentury)) +
    Math.sin(2 * meanAnomaly) * (0.019993 - 0.000101 * julianCentury) +
    Math.sin(3 * meanAnomaly) * 0.000289;

  const trueLongitude = toRad((meanLongitude + equationOfCenter) % 360);
  const omega = toRad(125.04 - 1934.136 * julianCentury);
  const lambda = trueLongitude - toRad(0.00569) - toRad(0.00478) * Math.sin(omega);
  
  const obliquity = toRad(23.439 - 0.0000004 * julianCentury);
  const declination = Math.asin(Math.sin(obliquity) * Math.sin(lambda));

  // Hour angle
  const localSiderealTime = (280.147 + 360.9856235 * (julianDate - 2451545)) % 360;
  const hourAngle = toRad(localSiderealTime + lng - toDeg(trueLongitude));

  // Convert to altitude and azimuth
  const latRad = toRad(lat);
  const altitude = Math.asin(
    Math.sin(latRad) * Math.sin(declination) +
    Math.cos(latRad) * Math.cos(declination) * Math.cos(hourAngle)
  );

  const azimuth = Math.atan2(
    Math.sin(hourAngle),
    Math.cos(hourAngle) * Math.sin(latRad) - Math.tan(declination) * Math.cos(latRad)
  );

  return {
    altitude: toDeg(altitude),
    azimuth: (toDeg(azimuth) + 180) % 360
  };
}

// Optimized batch calculation for sections
function calculateSectionExposureBatch(sections, sunPosition, stadiumOrientation, weatherConditions) {
  // Early exit if sun is below horizon
  if (sunPosition.altitude <= 0) {
    return sections.map(section => ({
      ...section,
      sunExposure: 0,
      inSun: false
    }));
  }

  // Pre-calculate common values
  const weatherMultiplier = weatherConditions ? 
    (1 - (weatherConditions.cloudCover || 0) / 100 * 0.7) : 1;
  
  const normalizedSunAzimuth = sunPosition.azimuth - stadiumOrientation;
  const altitudeFactor = Math.min(1, sunPosition.altitude / 45);

  return sections.map(section => {
    // Skip covered sections
    if (section.covered) {
      return {
        ...section,
        sunExposure: 0,
        inSun: false
      };
    }

    // Calculate relative angle
    const sectionMidAngle = section.baseAngle + section.angleSpan / 2;
    const relativeAngle = Math.abs(normalizedSunAzimuth - sectionMidAngle);
    const normalizedAngle = relativeAngle > 180 ? 360 - relativeAngle : relativeAngle;
    
    // Quick check if section faces away from sun
    if (normalizedAngle > 120) {
      return {
        ...section,
        sunExposure: 0,
        inSun: false
      };
    }
    
    // Calculate exposure
    const angleFactor = Math.max(0, 1 - normalizedAngle / 90);
    let exposure = angleFactor * altitudeFactor * 100 * weatherMultiplier;
    
    // Apply level multipliers
    const levelMultipliers = {
      'field': 1.0,
      'lower': 0.9,
      'club': 0.8,
      'upper': 0.95,
      'suite': 0.7
    };
    
    exposure *= levelMultipliers[section.level] || 1.0;
    
    return {
      ...section,
      sunExposure: Math.round(exposure),
      inSun: exposure > 10
    };
  });
}

// Cache for sun positions
const sunPositionCache = new Map();

function getCachedSunPosition(date, lat, lng) {
  const cacheKey = `${date.toISOString()}_${lat}_${lng}`;
  
  if (sunPositionCache.has(cacheKey)) {
    return sunPositionCache.get(cacheKey);
  }
  
  const position = getSunPosition(date, lat, lng);
  
  // Limit cache size
  if (sunPositionCache.size > 100) {
    const firstKey = sunPositionCache.keys().next().value;
    sunPositionCache.delete(firstKey);
  }
  
  sunPositionCache.set(cacheKey, position);
  return position;
}

// Message handler
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'calculateSunPosition':
      const { date, latitude, longitude } = data;
      const position = getCachedSunPosition(new Date(date), latitude, longitude);
      self.postMessage({ type: 'sunPosition', data: position });
      break;
      
    case 'calculateSectionExposures':
      const { sections, sunPosition, stadiumOrientation, weatherConditions } = data;
      
      // Process in chunks to avoid blocking
      const chunkSize = 50;
      const results = [];
      
      for (let i = 0; i < sections.length; i += chunkSize) {
        const chunk = sections.slice(i, i + chunkSize);
        const chunkResults = calculateSectionExposureBatch(
          chunk, 
          sunPosition, 
          stadiumOrientation, 
          weatherConditions
        );
        results.push(...chunkResults);
        
        // Send progress update
        if (i + chunkSize < sections.length) {
          self.postMessage({ 
            type: 'progress', 
            data: { 
              completed: i + chunkSize, 
              total: sections.length 
            } 
          });
        }
      }
      
      self.postMessage({ type: 'sectionExposures', data: results });
      break;
      
    default:
      console.error('Unknown message type:', type);
  }
});