/**
 * Seasonal Sun Analysis
 * Calculates sun exposure variations throughout the year
 */

import { Stadium } from '../data/stadiums';
import { DetailedSection, Obstruction3D } from '../types/stadium-complete';
import { getSunPosition, SunPosition } from './sunCalculations';
import { calculateSectionShadow, calculateAllShadows } from './advancedShadowCalculator';
import { addMonths, setDate, setHours, setMinutes, startOfMonth, endOfMonth } from 'date-fns';

export interface SeasonalSunData {
  month: string;
  avgSunriseTime: string;
  avgSunsetTime: string;
  avgDaylightHours: number;
  avgNoonElevation: number;
  avgGameTimeSunExposure: number; // Average sun exposure during typical game time (1-4 PM)
  bestShadedSections: string[];
  bestSunnySections: string[];
}

export interface YearlyAnalysis {
  stadium: string;
  latitude: number;
  longitude: number;
  monthlyData: SeasonalSunData[];
  peakSunMonth: string;
  minSunMonth: string;
  summerSolstice: {
    date: Date;
    maxElevation: number;
    daylightHours: number;
  };
  winterSolstice: {
    date: Date;
    maxElevation: number;
    daylightHours: number;
  };
  equinoxes: {
    spring: { date: Date; elevation: number };
    fall: { date: Date; elevation: number };
  };
}

export interface MonthlyHeatmap {
  sectionId: string;
  monthlyExposure: number[]; // 12 values, one per month
  yearlyAverage: number;
  peakMonth: number; // 0-11
  minMonth: number; // 0-11
}

/**
 * Calculate key solar dates for a given year
 */
export function getSolarKeyDates(year: number): {
  springEquinox: Date;
  summerSolstice: Date;
  fallEquinox: Date;
  winterSolstice: Date;
} {
  // Approximate dates (actual dates vary slightly year to year)
  return {
    springEquinox: new Date(year, 2, 20),    // March 20
    summerSolstice: new Date(year, 5, 21),   // June 21
    fallEquinox: new Date(year, 8, 23),      // September 23
    winterSolstice: new Date(year, 11, 21)   // December 21
  };
}

/**
 * Calculate sunrise and sunset times for a date
 */
function getSunTimes(date: Date, latitude: number, longitude: number): {
  sunrise: Date;
  sunset: Date;
  daylightHours: number;
} {
  // Simplified calculation - in production would use more accurate algorithm
  const julianDay = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const P = Math.asin(0.39795 * Math.cos(0.98563 * (julianDay - 173) * Math.PI / 180));
  
  const sunrise = -Math.acos(-Math.tan(latitude * Math.PI / 180) * Math.tan(P)) * 12 / Math.PI + 12;
  const sunset = Math.acos(-Math.tan(latitude * Math.PI / 180) * Math.tan(P)) * 12 / Math.PI + 12;
  
  const sunriseTime = new Date(date);
  sunriseTime.setHours(Math.floor(sunrise), (sunrise % 1) * 60, 0, 0);
  
  const sunsetTime = new Date(date);
  sunsetTime.setHours(Math.floor(sunset), (sunset % 1) * 60, 0, 0);
  
  const daylightHours = sunset - sunrise;
  
  return { sunrise: sunriseTime, sunset: sunsetTime, daylightHours };
}

/**
 * Analyze sun exposure for a specific month
 */
export function analyzeMonth(
  stadium: Stadium,
  sections: DetailedSection[],
  obstructions: Obstruction3D[],
  year: number,
  month: number
): SeasonalSunData {
  const monthStart = startOfMonth(new Date(year, month, 1));
  const monthEnd = endOfMonth(monthStart);
  const monthName = monthStart.toLocaleString('default', { month: 'long' });
  
  let totalSunrise = 0;
  let totalSunset = 0;
  let totalDaylight = 0;
  let totalNoonElevation = 0;
  let daysAnalyzed = 0;
  
  // Sample every 3rd day of the month for efficiency
  for (let day = 1; day <= monthEnd.getDate(); day += 3) {
    const date = new Date(year, month, day);
    const sunTimes = getSunTimes(date, stadium.latitude, stadium.longitude);
    
    totalSunrise += sunTimes.sunrise.getHours() + sunTimes.sunrise.getMinutes() / 60;
    totalSunset += sunTimes.sunset.getHours() + sunTimes.sunset.getMinutes() / 60;
    totalDaylight += sunTimes.daylightHours;
    
    // Calculate noon sun elevation
    const noonDate = new Date(date);
    noonDate.setHours(12, 0, 0, 0);
    const noonSun = getSunPosition(noonDate, stadium.latitude, stadium.longitude, stadium.timezone);
    totalNoonElevation += noonSun.altitudeDegrees;
    
    daysAnalyzed++;
  }
  
  const avgSunriseHour = totalSunrise / daysAnalyzed;
  const avgSunsetHour = totalSunset / daysAnalyzed;
  const avgDaylightHours = totalDaylight / daysAnalyzed;
  const avgNoonElevation = totalNoonElevation / daysAnalyzed;
  
  // Calculate average game time sun exposure (1 PM - 4 PM)
  const gameStartDate = new Date(year, month, 15, 13, 0, 0); // Mid-month at 1 PM
  const gameTimeExposures: Map<string, number[]> = new Map();
  
  for (let hour = 13; hour <= 16; hour++) {
    const gameDate = new Date(year, month, 15, hour, 0, 0);
    const sunPos = getSunPosition(gameDate, stadium.latitude, stadium.longitude, stadium.timezone);
    const shadows = calculateAllShadows(sections, sunPos, obstructions);
    
    shadows.forEach((shadow, sectionId) => {
      const exposures = gameTimeExposures.get(sectionId) || [];
      exposures.push(shadow.sunExposure);
      gameTimeExposures.set(sectionId, exposures);
    });
  }
  
  // Calculate average exposure per section
  const sectionAverages = new Map<string, number>();
  gameTimeExposures.forEach((exposures, sectionId) => {
    const avg = exposures.reduce((a, b) => a + b, 0) / exposures.length;
    sectionAverages.set(sectionId, avg);
  });
  
  // Find best shaded and sunny sections
  const sortedSections = Array.from(sectionAverages.entries())
    .sort((a, b) => a[1] - b[1]);
  
  const bestShadedSections = sortedSections.slice(0, 5).map(([id]) => id);
  const bestSunnySections = sortedSections.slice(-5).map(([id]) => id);
  
  // Calculate overall average game time exposure
  const avgGameTimeSunExposure = Array.from(sectionAverages.values())
    .reduce((a, b) => a + b, 0) / sectionAverages.size;
  
  return {
    month: monthName,
    avgSunriseTime: `${Math.floor(avgSunriseHour)}:${Math.round((avgSunriseHour % 1) * 60).toString().padStart(2, '0')}`,
    avgSunsetTime: `${Math.floor(avgSunsetHour)}:${Math.round((avgSunsetHour % 1) * 60).toString().padStart(2, '0')}`,
    avgDaylightHours,
    avgNoonElevation,
    avgGameTimeSunExposure,
    bestShadedSections,
    bestSunnySections
  };
}

/**
 * Perform full yearly analysis for a stadium
 */
export function analyzeFullYear(
  stadium: Stadium,
  sections: DetailedSection[],
  obstructions: Obstruction3D[],
  year: number = new Date().getFullYear()
): YearlyAnalysis {
  const monthlyData: SeasonalSunData[] = [];
  
  // Analyze each month
  for (let month = 0; month < 12; month++) {
    const monthData = analyzeMonth(stadium, sections, obstructions, year, month);
    monthlyData.push(monthData);
  }
  
  // Find peak and minimum sun months
  const peakSunMonth = monthlyData.reduce((max, month) => 
    month.avgNoonElevation > max.avgNoonElevation ? month : max
  ).month;
  
  const minSunMonth = monthlyData.reduce((min, month) => 
    month.avgNoonElevation < min.avgNoonElevation ? month : min
  ).month;
  
  // Calculate solstice and equinox data
  const solarDates = getSolarKeyDates(year);
  
  const summerSolsticeNoon = new Date(solarDates.summerSolstice);
  summerSolsticeNoon.setHours(12, 0, 0, 0);
  const summerSun = getSunPosition(summerSolsticeNoon, stadium.latitude, stadium.longitude, stadium.timezone);
  const summerTimes = getSunTimes(solarDates.summerSolstice, stadium.latitude, stadium.longitude);
  
  const winterSolsticeNoon = new Date(solarDates.winterSolstice);
  winterSolsticeNoon.setHours(12, 0, 0, 0);
  const winterSun = getSunPosition(winterSolsticeNoon, stadium.latitude, stadium.longitude, stadium.timezone);
  const winterTimes = getSunTimes(solarDates.winterSolstice, stadium.latitude, stadium.longitude);
  
  const springEquinoxNoon = new Date(solarDates.springEquinox);
  springEquinoxNoon.setHours(12, 0, 0, 0);
  const springSun = getSunPosition(springEquinoxNoon, stadium.latitude, stadium.longitude, stadium.timezone);
  
  const fallEquinoxNoon = new Date(solarDates.fallEquinox);
  fallEquinoxNoon.setHours(12, 0, 0, 0);
  const fallSun = getSunPosition(fallEquinoxNoon, stadium.latitude, stadium.longitude, stadium.timezone);
  
  return {
    stadium: stadium.name,
    latitude: stadium.latitude,
    longitude: stadium.longitude,
    monthlyData,
    peakSunMonth,
    minSunMonth,
    summerSolstice: {
      date: solarDates.summerSolstice,
      maxElevation: summerSun.altitudeDegrees,
      daylightHours: summerTimes.daylightHours
    },
    winterSolstice: {
      date: solarDates.winterSolstice,
      maxElevation: winterSun.altitudeDegrees,
      daylightHours: winterTimes.daylightHours
    },
    equinoxes: {
      spring: {
        date: solarDates.springEquinox,
        elevation: springSun.altitudeDegrees
      },
      fall: {
        date: solarDates.fallEquinox,
        elevation: fallSun.altitudeDegrees
      }
    }
  };
}

/**
 * Generate heatmap data for all sections across the year
 */
export function generateSectionHeatmap(
  stadium: Stadium,
  sections: DetailedSection[],
  obstructions: Obstruction3D[],
  year: number = new Date().getFullYear()
): MonthlyHeatmap[] {
  const heatmapData: MonthlyHeatmap[] = [];
  
  sections.forEach(section => {
    const monthlyExposure: number[] = [];
    
    // Calculate exposure for each month
    for (let month = 0; month < 12; month++) {
      // Use mid-month, 2 PM as representative time
      const date = new Date(year, month, 15, 14, 0, 0);
      const sunPos = getSunPosition(date, stadium.latitude, stadium.longitude, stadium.timezone);
      const shadow = calculateSectionShadow(section, sunPos, obstructions);
      monthlyExposure.push(shadow.sunExposure);
    }
    
    const yearlyAverage = monthlyExposure.reduce((a, b) => a + b, 0) / 12;
    const peakMonth = monthlyExposure.indexOf(Math.max(...monthlyExposure));
    const minMonth = monthlyExposure.indexOf(Math.min(...monthlyExposure));
    
    heatmapData.push({
      sectionId: section.id,
      monthlyExposure,
      yearlyAverage,
      peakMonth,
      minMonth
    });
  });
  
  return heatmapData;
}

/**
 * Get recommended sections for a specific date and preference
 */
export function getSeasonalRecommendations(
  stadium: Stadium,
  sections: DetailedSection[],
  obstructions: Obstruction3D[],
  date: Date,
  preference: 'sun' | 'shade',
  gameStartTime: string = '13:00',
  gameDuration: number = 3
): {
  recommendedSections: string[];
  reasoning: string;
  alternativeDates?: Date[];
} {
  const [startHour, startMinute] = gameStartTime.split(':').map(Number);
  const gameStart = new Date(date);
  gameStart.setHours(startHour, startMinute, 0, 0);
  
  // Calculate sun exposure for game duration
  const exposureMap = new Map<string, number[]>();
  
  for (let hour = 0; hour < gameDuration; hour++) {
    const gameTime = new Date(gameStart.getTime() + hour * 3600000);
    const sunPos = getSunPosition(gameTime, stadium.latitude, stadium.longitude, stadium.timezone);
    const shadows = calculateAllShadows(sections, sunPos, obstructions);
    
    shadows.forEach((shadow, sectionId) => {
      const exposures = exposureMap.get(sectionId) || [];
      exposures.push(shadow.sunExposure);
      exposureMap.set(sectionId, exposures);
    });
  }
  
  // Calculate average exposure per section
  const sectionScores = new Map<string, number>();
  exposureMap.forEach((exposures, sectionId) => {
    const avgExposure = exposures.reduce((a, b) => a + b, 0) / exposures.length;
    sectionScores.set(sectionId, avgExposure);
  });
  
  // Sort sections by preference
  const sortedSections = Array.from(sectionScores.entries())
    .sort((a, b) => preference === 'shade' ? a[1] - b[1] : b[1] - a[1]);
  
  const recommendedSections = sortedSections.slice(0, 10).map(([id]) => id);
  
  // Generate reasoning
  const month = date.toLocaleString('default', { month: 'long' });
  const avgExposure = Array.from(sectionScores.values())
    .reduce((a, b) => a + b, 0) / sectionScores.size;
  
  let reasoning = `In ${month} at ${stadium.name}, `;
  
  if (preference === 'shade') {
    if (avgExposure < 30) {
      reasoning += 'most sections have good shade coverage due to low sun angle.';
    } else if (avgExposure < 60) {
      reasoning += 'there are several well-shaded sections available.';
    } else {
      reasoning += 'shade is limited due to high sun angle. Consider covered sections.';
    }
  } else {
    if (avgExposure > 70) {
      reasoning += 'excellent sun exposure is available in most sections.';
    } else if (avgExposure > 40) {
      reasoning += 'good sun exposure is available in selected sections.';
    } else {
      reasoning += 'sun exposure is limited due to low sun angle or overhangs.';
    }
  }
  
  // Suggest alternative dates if current conditions aren't ideal
  const alternativeDates: Date[] = [];
  if ((preference === 'shade' && avgExposure > 70) || (preference === 'sun' && avgExposure < 30)) {
    // Suggest dates 2 weeks before/after
    alternativeDates.push(
      new Date(date.getTime() - 14 * 86400000),
      new Date(date.getTime() + 14 * 86400000)
    );
  }
  
  return {
    recommendedSections,
    reasoning,
    alternativeDates: alternativeDates.length > 0 ? alternativeDates : undefined
  };
}

/**
 * Compare sun exposure between different months for planning
 */
export function compareMonths(
  stadium: Stadium,
  sections: DetailedSection[],
  obstructions: Obstruction3D[],
  months: number[],
  year: number = new Date().getFullYear()
): {
  month: string;
  avgExposure: number;
  bestTime: string;
  worstTime: string;
}[] {
  return months.map(month => {
    const monthData = analyzeMonth(stadium, sections, obstructions, year, month);
    
    // Find best and worst times during typical game hours (11 AM - 7 PM)
    let bestTime = '';
    let worstTime = '';
    let minExposure = 100;
    let maxExposure = 0;
    
    for (let hour = 11; hour <= 19; hour++) {
      const date = new Date(year, month, 15, hour, 0, 0);
      const sunPos = getSunPosition(date, stadium.latitude, stadium.longitude, stadium.timezone);
      
      // Simple average across all sections
      const avgExposure = sunPos.altitudeDegrees > 0 ? 
        Math.min(100, sunPos.altitudeDegrees * 1.5) : 0;
      
      if (avgExposure < minExposure) {
        minExposure = avgExposure;
        bestTime = `${hour}:00`;
      }
      if (avgExposure > maxExposure) {
        maxExposure = avgExposure;
        worstTime = `${hour}:00`;
      }
    }
    
    return {
      month: monthData.month,
      avgExposure: monthData.avgGameTimeSunExposure,
      bestTime: bestTime + ' (least sun)',
      worstTime: worstTime + ' (most sun)'
    };
  });
}

// Export for use in components
export default {
  getSolarKeyDates,
  analyzeMonth,
  analyzeFullYear,
  generateSectionHeatmap,
  getSeasonalRecommendations,
  compareMonths
};