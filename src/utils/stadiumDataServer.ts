import { Stadium } from '../data/stadiums';
import { StadiumSection } from '../data/stadiumSections';

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

// Calculate shade percentage based on stadium orientation, time, and section location
export function calculateShadePercentage(
  stadium: Stadium,
  section: StadiumSection,
  hour: number,
  month: number
): number {
  // Base shade from coverage
  if (section.covered) return 100;
  
  // Calculate sun angle based on month (simplified)
  const summerMonths = [5, 6, 7, 8];
  const isSummer = summerMonths.includes(month);
  const sunAngle = isSummer ? 70 : 45; // Degrees above horizon
  
  // Calculate shade based on level
  let levelShade = 0;
  switch (section.level) {
    case 'upper':
      levelShade = 60; // Upper deck gets more shade from overhang
      break;
    case 'club':
      levelShade = 40;
      break;
    case 'suite':
      levelShade = 30;
      break;
    case 'lower':
      levelShade = 20;
      break;
    case 'field':
      levelShade = 10;
      break;
  }
  
  // Adjust for time of day
  let timeAdjustment = 0;
  if (hour < 14) {
    // Morning/early afternoon
    timeAdjustment = stadium.orientation < 180 ? 20 : -10;
  } else if (hour >= 18) {
    // Evening - most sections have shade
    timeAdjustment = 40;
  }
  
  // Adjust for stadium orientation
  const facesNorth = stadium.orientation >= 315 || stadium.orientation <= 45;
  const orientationBonus = facesNorth ? 15 : 0;
  
  // Calculate final shade percentage
  const totalShade = Math.min(100, Math.max(0, 
    levelShade + timeAdjustment + orientationBonus + (isSummer ? -20 : 10)
  ));
  
  return totalShade;
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