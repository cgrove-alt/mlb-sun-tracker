import { Stadium } from '../data/stadiums';
import type { StadiumSection } from '../data/stadiumSectionTypes';
import { getSunPosition } from './sunCalculations';
import {
  isSectionInSun,
  getSectionSunExposure,
} from './sectionSunCalculations';
import { stadiumLocalToUTC } from './stadiumTime';
import { canPublishSeatLevelShade } from '../data/stadiumShadeConfidence';
import { sectionAngleConventionFor, requireFiniteOrientation } from './bowlGeometry';
import { baseballShadedBaseline, baseballSunnyBaseline, bestShadedSideForDayGame } from './shadeSide';

function assertSeatLevelShadePublished(stadium: Stadium): void {
  if (!canPublishSeatLevelShade(stadium.id)) {
    throw new Error(`Seat-level shade output is withheld for ${stadium.id}: metric geometry has not passed independent observation validation.`);
  }
}

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
  assertSeatLevelShadePublished(stadium);
  // Field-validated fully covered sections can use this shortcut.
  if (section.covered && (section.level === 'upper' || section.level === 'club')) {
    return 100;
  }

  const date = representativeDate(month, hour, stadium.timezone || 'UTC');
  const sunPosition = getSunPosition(date, stadium.latitude, stadium.longitude);

  if (sunPosition.altitudeDegrees <= 0) {
    return 100; // Sun below horizon: section in shade.
  }

  const orientation = requireFiniteOrientation(stadium.orientation, stadium.id);
  const convention = sectionAngleConventionFor(stadium);

  if (!isSectionInSun(
    section,
    sunPosition.azimuthDegrees,
    sunPosition.altitudeDegrees,
    orientation,
    convention,
  )) {
    return 100;
  }

  const exposure = getSectionSunExposure(
    section,
    sunPosition.altitudeDegrees,
    sunPosition.azimuthDegrees,
    orientation,
    convention,
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
  assertSeatLevelShadePublished(stadium);
  requireFiniteOrientation(stadium.orientation, stadium.id);
  const recommendations: TimeRecommendation[] = [];
  const afternoonSun = getSunPosition(
    representativeDate(7, 16, stadium.timezone || 'UTC'),
    stadium.latitude,
    stadium.longitude,
  );
  const eveningSun = getSunPosition(
    representativeDate(7, 19, stadium.timezone || 'UTC'),
    stadium.latitude,
    stadium.longitude,
  );
  const afternoonShade = baseballShadedBaseline(stadium.orientation, afternoonSun.azimuthDegrees);
  const afternoonSunSide = baseballSunnyBaseline(stadium.orientation, afternoonSun.azimuthDegrees);
  const eveningShade = baseballShadedBaseline(stadium.orientation, eveningSun.azimuthDegrees);
  const dayShade = bestShadedSideForDayGame(stadium.orientation);
  
  // Day game (1 PM)
  recommendations.push({
    time: '1:00 PM',
    hour: 13,
    generalAdvice: `Maximum sun exposure. Shade is essential for comfort; the ${dayShade} falls into shade first.`,
    bestLevels: ['Upper Deck', 'Club Level (covered sections)', 'Shaded Concourse Areas'],
    avoidAreas: ['Field Level (sections 1-20)', 'Outfield Bleachers', 'Uncovered Lower Bowl']
  });
  
  // Afternoon game (4 PM)
  recommendations.push({
    time: '4:00 PM',
    hour: 16,
    generalAdvice: `Afternoon sun creates shadows on the ${afternoonShade}.`,
    bestLevels: [`${titleCaseSide(afternoonShade)} (all levels)`, 'Upper Deck Behind Home', 'Club Level'],
    avoidAreas: [`${titleCaseSide(afternoonSunSide)} (lower levels)`, 'Outfield facing the sun', 'Uncovered seats opposite the shade line']
  });
  
  // Evening game (7 PM)
  recommendations.push({
    time: '7:00 PM',
    hour: 19,
    generalAdvice: `Low western sun can create glare before sunset; the ${eveningShade} is the shaded baseline.`,
    bestLevels: ['Any Level (except outfield)', 'Behind Home Plate', 'Baseline Sections'],
    avoidAreas: ['Outfield Sections (sunset glare)', 'Uncovered seats on the sun-facing baseline']
  });
  
  return recommendations;
}

function titleCaseSide(side: string): string {
  return side.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Generate static shade report for SEO
export function generateStaticShadeReport(
  stadium: Stadium,
  sections: StadiumSection[]
): string {
  assertSeatLevelShadePublished(stadium);
  requireFiniteOrientation(stadium.orientation, stadium.id);
  const coveredCount = sections.filter(s => s.covered).length;
  const upperCount = sections.filter(s => s.level === 'upper').length;
  
  let report = `${stadium.name} Shade Report:\n\n`;
  
  report += `Stadium Orientation: ${stadium.orientation}°\n`;
  report += `Roof Type: ${stadium.roof === 'open' ? 'Open Air' : stadium.roof === 'retractable' ? 'Retractable' : 'Fixed Roof'}\n`;
  report += `Validated Covered Sections: ${coveredCount}\n`;
  report += `Validated Upper Deck Sections: ${upperCount}\n\n`;
  
  const afternoonShade = baseballShadedBaseline(
    stadium.orientation,
    getSunPosition(representativeDate(7, 16, stadium.timezone || 'UTC'), stadium.latitude, stadium.longitude).azimuthDegrees,
  );

  report += `Best Times for Shade:\n`;
  report += `- Day Games (1 PM): Upper deck and covered sections only; ${bestShadedSideForDayGame(stadium.orientation)} first\n`;
  report += `- Afternoon Games (4 PM): ${afternoonShade} and upper levels\n`;
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
    orientation: Number.isFinite(Number(stadium.orientation)) ? Number(stadium.orientation) : Number.NaN,
    roof: stadium.roof || 'open',
    capacity: Number(stadium.capacity) || 40000, // Default capacity
    roofHeight: stadium.roofHeight || undefined,
    timezone: stadium.timezone || 'America/New_York'
  };
}
