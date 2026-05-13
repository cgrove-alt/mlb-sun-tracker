import { Stadium } from '../data/stadiums';
import type { StadiumSection } from '../data/stadiumSectionTypes';
import { getSunPosition } from './sunCalculations';
import {
  isSectionInSun,
  getSectionSunExposure,
} from './sectionSunCalculations';
import { stadiumLocalToUTC } from './stadiumTime';

// Server-side shade calculation for static generation
export interface ShadeData {
  section: string;
  shadePercentage: number;
  timeOfDay: string;
  month: number;
  recommendation: string;
}

export interface SeasonalShadePattern {
  month: string;
  monthNum: number;
  averageShade: number;
  bestSections: string[];
  worstSections: string[];
  recommendation: string;
}

// Day-of-month used as a representative date for the given month when
// computing the sun position. The 15th is close to the monthly mean for
// most of the baseball season. `hour` is interpreted as wall-clock time
// in the stadium's local timezone — the conversion to UTC for SunCalc
// happens via stadiumLocalToUTC. Without that conversion, the static
// matrix would compute sun position for the wrong real-world moment by
// the stadium's UTC offset (5+ hours for West Coast parks).
function representativeDate(month: number, hour: number, timezone: string): Date {
  const monthStr = month.toString().padStart(2, '0');
  const hourStr = hour.toString().padStart(2, '0');
  return stadiumLocalToUTC(`2025-${monthStr}-15`, `${hourStr}:00`, timezone);
}

// Calculate shade percentage for static page generation.
//
// This used to be a hardcoded heuristic (summer=70°, winter=45°, sun azimuth
// estimated from hour by linear interpolation). It now calls the real sun
// position calculator and the canonical section-sun exposure function, so
// the static matrices match what the live API produces.
export function calculateShadePercentage(
  stadium: Stadium,
  section: StadiumSection,
  hour: number,
  month: number,
): number {
  // Covered upper/club sections are guaranteed 100% shade — keep this
  // shortcut for parity with previous output and to avoid sun-position cost
  // for the easy case.
  if (section.covered && (section.level === 'upper' || section.level === 'club')) {
    return 100;
  }

  const date = representativeDate(month, hour, stadium.timezone || 'UTC');
  const sunPosition = getSunPosition(date, stadium.latitude, stadium.longitude);

  if (sunPosition.altitudeDegrees <= 0) {
    return 100; // Sun below horizon: section in shade.
  }

  if (!isSectionInSun(
    section,
    sunPosition.azimuthDegrees,
    sunPosition.altitudeDegrees,
    stadium.orientation,
  )) {
    return 100;
  }

  const exposure = getSectionSunExposure(
    section,
    sunPosition.altitudeDegrees,
    sunPosition.azimuthDegrees,
    stadium.orientation,
  );

  return Math.max(0, Math.min(100, 100 - exposure));
}

// Generate comprehensive shade data for all common scenarios
export function generateShadeMatrix(
  stadium: Stadium,
  sections: StadiumSection[]
): ShadeData[] {
  const shadeData: ShadeData[] = [];
  const times = [10, 13, 16, 19]; // Common game times
  const months = [4, 5, 6, 7, 8, 9]; // Baseball season
  
  sections.forEach(section => {
    times.forEach(hour => {
      months.forEach(month => {
        const shadePercentage = calculateShadePercentage(stadium, section, hour, month);
        
        let recommendation = '';
        if (shadePercentage >= 80) {
          recommendation = 'Excellent shade';
        } else if (shadePercentage >= 60) {
          recommendation = 'Good shade';
        } else if (shadePercentage >= 40) {
          recommendation = 'Partial shade';
        } else if (shadePercentage >= 20) {
          recommendation = 'Limited shade';
        } else {
          recommendation = 'Full sun exposure';
        }
        
        shadeData.push({
          section: section.name,
          shadePercentage,
          timeOfDay: `${hour}:00`,
          month,
          recommendation
        });
      });
    });
  });
  
  return shadeData;
}

// Get seasonal patterns for stadium
export function getSeasonalPatterns(
  stadium: Stadium,
  sections: StadiumSection[]
): SeasonalShadePattern[] {
  const monthNames = ['', '', '', 'April', 'May', 'June', 'July', 'August', 'September', 'October'];
  const patterns: SeasonalShadePattern[] = [];
  
  for (let month = 4; month <= 10; month++) {
    const monthData: number[] = [];
    const sectionScores: { name: string; shade: number }[] = [];
    
    sections.forEach(section => {
      // Calculate average shade for typical day game (1 PM)
      const shade = calculateShadePercentage(stadium, section, 13, month);
      monthData.push(shade);
      sectionScores.push({ name: section.name, shade });
    });
    
    // Sort sections by shade coverage
    sectionScores.sort((a, b) => b.shade - a.shade);
    
    const averageShade = monthData.reduce((a, b) => a + b, 0) / monthData.length;
    const bestSections = sectionScores.slice(0, 5).map(s => s.name);
    const worstSections = sectionScores.slice(-5).map(s => s.name);
    
    let recommendation = '';
    if (month >= 6 && month <= 8) {
      recommendation = 'Peak summer heat - prioritize covered sections and upper deck for shade';
    } else if (month === 4 || month === 10) {
      recommendation = 'Cooler temperatures - sun exposure may be comfortable';
    } else {
      recommendation = 'Moderate temperatures - balance shade preference with view quality';
    }
    
    patterns.push({
      month: monthNames[month],
      monthNum: month,
      averageShade: Math.round(averageShade),
      bestSections,
      worstSections,
      recommendation
    });
  }
  
  return patterns;
}

// Get time-based recommendations
export interface TimeRecommendation {
  time: string;
  hour: number;
  generalAdvice: string;
  bestLevels: string[];
  avoidAreas: string[];
}

export function getTimeRecommendations(stadium: Stadium): TimeRecommendation[] {
  const recommendations: TimeRecommendation[] = [];
  
  // Day game (1 PM)
  recommendations.push({
    time: '1:00 PM',
    hour: 13,
    generalAdvice: 'Maximum sun exposure. Shade is essential for comfort.',
    bestLevels: ['Upper Deck', 'Club Level (covered sections)', 'Shaded Concourse Areas'],
    avoidAreas: ['Field Level (sections 1-20)', 'Outfield Bleachers', 'Uncovered Lower Bowl']
  });
  
  // Afternoon game (4 PM)
  recommendations.push({
    time: '4:00 PM',
    hour: 16,
    generalAdvice: 'Afternoon sun creates shadows from third base side.',
    bestLevels: ['Third Base Side (all levels)', 'Upper Deck Behind Home', 'Club Level'],
    avoidAreas: ['First Base Side (lower levels)', 'Right Field', 'Sections facing west']
  });
  
  // Evening game (7 PM)
  recommendations.push({
    time: '7:00 PM',
    hour: 19,
    generalAdvice: 'Most sections in shade by first pitch. Watch for sunset glare.',
    bestLevels: ['Any Level (except outfield)', 'Behind Home Plate', 'Baseline Sections'],
    avoidAreas: ['Outfield Sections (sunset glare)', 'Sections 301-310 (if facing west)']
  });
  
  return recommendations;
}

// Generate static shade report for SEO
export function generateStaticShadeReport(
  stadium: Stadium,
  sections: StadiumSection[]
): string {
  const coveredCount = sections.filter(s => s.covered).length;
  const upperCount = sections.filter(s => s.level === 'upper').length;
  
  let report = `${stadium.name} Shade Report:\n\n`;
  
  report += `Stadium Orientation: ${stadium.orientation}°\n`;
  report += `Roof Type: ${stadium.roof === 'open' ? 'Open Air' : stadium.roof === 'retractable' ? 'Retractable' : 'Fixed Roof'}\n`;
  report += `Covered Sections: ${coveredCount} sections with guaranteed shade\n`;
  report += `Upper Deck Sections: ${upperCount} sections with natural shade coverage\n\n`;
  
  report += `Best Times for Shade:\n`;
  report += `- Day Games (1 PM): Upper deck and covered sections only\n`;
  report += `- Afternoon Games (4 PM): Third base side and upper levels\n`;
  report += `- Evening Games (7 PM): Most sections except outfield\n\n`;
  
  report += `Seasonal Considerations:\n`;
  report += `- April-May: Comfortable temperatures, sun exposure often pleasant\n`;
  report += `- June-August: Peak heat, shade essential for comfort\n`;
  report += `- September-October: Lower sun angle provides more natural shade\n`;
  
  return report;
}

// Cache key generation for static props
export function getCacheKey(stadiumId: string, date?: Date): string {
  const baseKey = `stadium-shade-${stadiumId}`;
  if (date) {
    const month = date.getMonth() + 1;
    const hour = date.getHours();
    return `${baseKey}-${month}-${hour}`;
  }
  return baseKey;
}

// Validate and sanitize stadium data for safe rendering
export function sanitizeStadiumData(stadium: any): Stadium {
  return {
    id: String(stadium.id || ''),
    name: String(stadium.name || 'Unknown Stadium'),
    team: String(stadium.team || 'Unknown Team'),
    city: String(stadium.city || 'Unknown City'),
    state: String(stadium.state || ''),
    latitude: Number(stadium.latitude) || 0,
    longitude: Number(stadium.longitude) || 0,
    orientation: Number(stadium.orientation) || 0,
    roof: stadium.roof || 'open',
    capacity: Number(stadium.capacity) || 40000, // Default capacity
    roofHeight: stadium.roofHeight || undefined,
    timezone: stadium.timezone || 'America/New_York'
  };
}