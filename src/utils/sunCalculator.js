// sunCalculator.js
import SunCalc from 'suncalc';

export class SunCalculator {
  constructor(stadium) {
    this.stadium = stadium;
    this.stadiumGeometry = this.initializeStadiumGeometry();
  }

  initializeStadiumGeometry() {
    // Initialize stadium-specific geometry data
    return {
      roofHeight: this.stadium.roofHeight || 150, // feet
      roofOverhang: this.stadium.roofOverhang || 50, // feet
      upperDeckHeight: this.stadium.upperDeckHeight || 100, // feet
      fieldLevel: 0, // baseline
      homeplate: { x: 0, y: 0 }, // origin point
      // Stadium orientation (degrees from north)
      orientation: this.stadium.orientation || 0
    };
  }

  calculateSunPosition(date, time) {
    const dateTime = new Date(`${date}T${time}`);
    const sunPos = SunCalc.getPosition(
      dateTime,
      this.stadium.latitude,
      this.stadium.longitude
    );
    
    // Get sun times for the day
    const sunTimes = SunCalc.getTimes(
      dateTime,
      this.stadium.latitude,
      this.stadium.longitude
    );
    
    // Convert radians to degrees and normalize azimuth
    const altitude = sunPos.altitude * 180 / Math.PI;
    const azimuth = (sunPos.azimuth * 180 / Math.PI + 180) % 360;
    
    return {
      altitude: altitude,
      azimuth: azimuth,
      elevation: this.getElevationAngle(sunPos.altitude),
      isDay: dateTime > sunTimes.sunrise && dateTime < sunTimes.sunset,
      solarNoon: sunTimes.solarNoon,
      sunrise: sunTimes.sunrise,
      sunset: sunTimes.sunset,
      goldenHour: sunTimes.goldenHour,
      civilTwilight: {
        start: sunTimes.dawn,
        end: sunTimes.dusk
      }
    };
  }

  getElevationAngle(altitudeRad) {
    const altitudeDeg = altitudeRad * 180 / Math.PI;
    if (altitudeDeg < 0) return 'below_horizon';
    if (altitudeDeg < 10) return 'very_low';
    if (altitudeDeg < 30) return 'low';
    if (altitudeDeg < 50) return 'medium';
    if (altitudeDeg < 70) return 'high';
    return 'very_high';
  }

  calculateShadows(sunPosition, sections) {
    const shadows = [];
    const { altitude, azimuth } = sunPosition;
    
    // Skip shadow calculations if sun is below horizon
    if (altitude <= 0) {
      return sections.map(section => ({
        sectionId: section.id,
        coverage: 0,
        inShadow: false,
        shadowSource: 'night'
      }));
    }
    
    // Calculate shadows for each section
    sections.forEach(section => {
      const shadowData = this.calculateSectionShadow(section, altitude, azimuth);
      shadows.push(shadowData);
    });
    
    return shadows;
  }

  calculateSectionShadow(section, sunAltitude, sunAzimuth) {
    // Adjust azimuth for stadium orientation
    const adjustedAzimuth = (sunAzimuth - this.stadiumGeometry.orientation + 360) % 360;
    
    // Calculate shadow from roof/overhang
    const roofShadow = this.calculateRoofShadow(section, sunAltitude, adjustedAzimuth);
    
    // Calculate shadow from upper deck (for lower sections)
    const upperDeckShadow = section.level === 'field' || section.level === 'lower' 
      ? this.calculateUpperDeckShadow(section, sunAltitude, adjustedAzimuth)
      : 0;
    
    // Calculate self-shadowing from stadium bowl
    const bowlShadow = this.calculateBowlShadow(section, sunAltitude, adjustedAzimuth);
    
    // Combine shadow effects
    const totalCoverage = Math.min(100, roofShadow + upperDeckShadow + bowlShadow);
    
    return {
      sectionId: section.id,
      coverage: Math.round(totalCoverage),
      inShadow: totalCoverage > 50,
      shadowSources: {
        roof: roofShadow,
        upperDeck: upperDeckShadow,
        bowl: bowlShadow
      },
      sunExposure: Math.max(0, 100 - totalCoverage)
    };
  }

  calculateRoofShadow(section, sunAltitude, sunAzimuth) {
    if (!section.covered || sunAltitude <= 0) return 0;
    
    // Fixed roof provides 100% coverage
    if (this.stadium.roofType === 'fixed') return 100;
    
    // For retractable or partial roofs
    const shadowLength = this.stadiumGeometry.roofHeight / Math.tan(sunAltitude * Math.PI / 180);
    const shadowDirection = (sunAzimuth + 180) % 360; // Shadow points opposite to sun
    
    // Check if shadow falls on this section
    const sectionAngle = this.getSectionAngle(section);
    const angleDiff = Math.abs(shadowDirection - sectionAngle);
    
    if (angleDiff > 90 && angleDiff < 270) {
      return 0; // Shadow doesn't reach this section
    }
    
    // Calculate coverage based on shadow length and overhang
    const effectiveShadow = Math.min(shadowLength, this.stadiumGeometry.roofOverhang);
    const coverage = (effectiveShadow / section.depth) * 100;
    
    return Math.min(100, coverage);
  }

  calculateUpperDeckShadow(section, sunAltitude, sunAzimuth) {
    if (sunAltitude <= 0) return 0;
    
    const shadowLength = this.stadiumGeometry.upperDeckHeight / Math.tan(sunAltitude * Math.PI / 180);
    const shadowDirection = (sunAzimuth + 180) % 360;
    
    const sectionAngle = this.getSectionAngle(section);
    const angleDiff = Math.abs(shadowDirection - sectionAngle);
    
    // Check if upper deck can cast shadow on this section
    if (angleDiff > 60 && angleDiff < 300) {
      return 0;
    }
    
    // Calculate shadow coverage
    const coverage = (shadowLength / section.depth) * 50; // Upper deck provides partial shadow
    return Math.min(50, coverage);
  }

  calculateBowlShadow(section, sunAltitude, sunAzimuth) {
    // Stadium bowl creates shadows when sun is low and coming from opposite side
    if (sunAltitude > 30) return 0;
    
    const sectionAngle = this.getSectionAngle(section);
    const sunDirection = sunAzimuth;
    const angleDiff = Math.abs(sunDirection - sectionAngle);
    
    // Section faces away from sun
    if (angleDiff > 90 && angleDiff < 270) {
      const shadowFactor = (30 - sunAltitude) / 30; // More shadow as sun gets lower
      return shadowFactor * 30; // Up to 30% shadow from bowl
    }
    
    return 0;
  }

  getSectionAngle(section) {
    // Calculate section's compass angle based on its position
    // This would typically come from section data or be calculated from coordinates
    const baseAngle = {
      'home': 0,     // Behind home plate
      'first': 90,   // First base side
      'outfield': 180, // Outfield
      'third': 270   // Third base side
    };
    
    return (baseAngle[section.side] || section.angle || 0) + this.stadiumGeometry.orientation;
  }

  projectShadow(origin, azimuth, length) {
    // Project shadow endpoint from origin point
    const shadowAzimuth = (azimuth + 180) % 360; // Shadow points opposite to sun
    const shadowRad = shadowAzimuth * Math.PI / 180;
    
    return {
      x: origin.x + length * Math.sin(shadowRad),
      y: origin.y + length * Math.cos(shadowRad)
    };
  }

  calculateTimeInSun(section, gameStartTime, gameDuration = 3) {
    const intervals = 12; // Check every 15 minutes
    const timeStep = gameDuration * 60 / intervals; // minutes
    let sunExposureMinutes = 0;
    
    const startDate = new Date(gameStartTime);
    
    for (let i = 0; i <= intervals; i++) {
      const checkTime = new Date(startDate.getTime() + i * timeStep * 60000);
      const sunPos = this.calculateSunPosition(
        checkTime.toISOString().split('T')[0],
        checkTime.toTimeString().split(' ')[0]
      );
      
      if (sunPos.altitude > 0) {
        const shadows = this.calculateSectionShadow(section, sunPos.altitude, sunPos.azimuth);
        if (shadows.sunExposure > 50) {
          sunExposureMinutes += timeStep;
        }
      }
    }
    
    return {
      totalMinutes: sunExposureMinutes,
      percentage: (sunExposureMinutes / (gameDuration * 60)) * 100
    };
  }

  getSunPath(date, hourInterval = 0.5) {
    const path = [];
    const dateObj = new Date(date);
    
    // Calculate from sunrise to sunset
    const times = SunCalc.getTimes(dateObj, this.stadium.latitude, this.stadium.longitude);
    const sunrise = times.sunrise.getHours() + times.sunrise.getMinutes() / 60;
    const sunset = times.sunset.getHours() + times.sunset.getMinutes() / 60;
    
    for (let hour = Math.floor(sunrise); hour <= Math.ceil(sunset); hour += hourInterval) {
      const time = `${Math.floor(hour).toString().padStart(2, '0')}:${Math.round((hour % 1) * 60).toString().padStart(2, '0')}:00`;
      const position = this.calculateSunPosition(date, time);
      
      if (position.altitude > 0) {
        path.push({
          time,
          ...position
        });
      }
    }
    
    return path;
  }

  getOptimalSections(date, time, preference = 'shade') {
    const sunPos = this.calculateSunPosition(date, time);
    const sections = this.stadium.sections || [];
    
    const sectionsWithShadow = sections.map(section => {
      const shadow = this.calculateSectionShadow(section, sunPos.altitude, sunPos.azimuth);
      return {
        ...section,
        ...shadow
      };
    });
    
    // Sort sections based on preference
    return sectionsWithShadow.sort((a, b) => {
      if (preference === 'shade') {
        return b.coverage - a.coverage; // More shadow coverage first
      } else if (preference === 'sun') {
        return b.sunExposure - a.sunExposure; // More sun exposure first
      }
      return 0;
    });
  }
}

// Utility functions
export function formatSunPosition(position) {
  const compass = getCompassDirection(position.azimuth);
  const altitude = position.altitude.toFixed(1);
  
  return {
    compass,
    altitude: `${altitude}°`,
    description: position.elevation,
    isDay: position.isDay
  };
}

export function getCompassDirection(degrees) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                     'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function calculateGameSunExposure(stadium, sections, gameDateTime, duration = 3) {
  const calculator = new SunCalculator(stadium);
  
  return sections.map(section => {
    const exposure = calculator.calculateTimeInSun(section, gameDateTime, duration);
    return {
      sectionId: section.id,
      ...exposure
    };
  });
}