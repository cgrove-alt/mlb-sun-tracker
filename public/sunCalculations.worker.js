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

function calculateSectionExposure(section, sunPosition, stadiumOrientation, weatherConditions) {
  // Simplified calculation for worker
  const sectionMidAngle = section.baseAngle + section.angleSpan / 2;
  const relativeAngle = Math.abs(sunPosition.azimuth - stadiumOrientation - sectionMidAngle);
  const normalizedAngle = relativeAngle > 180 ? 360 - relativeAngle : relativeAngle;
  
  let exposure = 0;
  
  if (sunPosition.altitude > 0) {
    // Direct sun exposure based on angle
    const angleFactor = Math.max(0, 1 - normalizedAngle / 90);
    const altitudeFactor = Math.min(1, sunPosition.altitude / 45);
    exposure = angleFactor * altitudeFactor * 100;
    
    // Weather impact
    if (weatherConditions) {
      const cloudReduction = (weatherConditions.cloudCover || 0) / 100;
      exposure *= (1 - cloudReduction * 0.7);
    }
    
    // Coverage impact
    if (section.covered) {
      exposure *= 0.1;
    }
  }
  
  return {
    ...section,
    sunExposure: Math.round(exposure),
    inSun: exposure > 10
  };
}

// Message handler
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'calculateSunPosition':
      const { date, latitude, longitude } = data;
      const position = getSunPosition(new Date(date), latitude, longitude);
      self.postMessage({ type: 'sunPosition', data: position });
      break;
      
    case 'calculateSectionExposures':
      const { sections, sunPosition, stadiumOrientation, weatherConditions } = data;
      const results = sections.map(section => 
        calculateSectionExposure(section, sunPosition, stadiumOrientation, weatherConditions)
      );
      self.postMessage({ type: 'sectionExposures', data: results });
      break;
      
    default:
      console.error('Unknown message type:', type);
  }
});