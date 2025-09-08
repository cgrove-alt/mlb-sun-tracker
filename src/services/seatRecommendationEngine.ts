/**
 * AI-Based Seat Recommendation Engine
 * Intelligent recommendations based on user preferences and conditions
 */

import { Stadium } from '../data/stadiums';
import { DetailedSection, Obstruction3D, RowDetail } from '../types/stadium-complete';
import { WeatherData } from './weatherApi';
import { calculateSectionShadow } from '../utils/advancedShadowCalculator';
import { getSunPosition } from '../utils/sunCalculations';
import { getSeasonalRecommendations } from '../utils/seasonalSunAnalysis';

export interface UserPreferences {
  sunPreference: 'love-sun' | 'prefer-sun' | 'neutral' | 'prefer-shade' | 'need-shade';
  budgetRange: 'budget' | 'moderate' | 'premium' | 'any';
  groupSize: number;
  accessibilityNeeds: boolean;
  viewPreference: 'home-plate' | 'first-base' | 'third-base' | 'outfield' | 'any';
  amenityPriorities: ('food' | 'restrooms' | 'parking' | 'shade' | 'view')[];
  weatherSensitivity: 'high' | 'medium' | 'low';
  hasChildren: boolean;
  gameTimePreference?: 'day' | 'evening' | 'night' | 'any';
}

export interface SeatRecommendation {
  sectionId: string;
  sectionName: string;
  score: number; // 0-100
  reasoning: string[];
  pros: string[];
  cons: string[];
  estimatedSunExposure: number; // 0-100
  estimatedTemperature: number;
  priceCategory: string;
  alternativeSections: string[];
  bestRows?: number[];
  avoidRows?: number[];
}

export interface RecommendationContext {
  stadium: Stadium;
  sections: DetailedSection[];
  obstructions: Obstruction3D[];
  gameDate: Date;
  gameTime: string;
  weather: WeatherData;
  attendance?: 'low' | 'medium' | 'high' | 'sellout';
  opponent?: string;
  specialEvent?: boolean;
}

export class SeatRecommendationEngine {
  private readonly weights = {
    sunExposure: 0.35,
    price: 0.20,
    view: 0.15,
    amenities: 0.10,
    accessibility: 0.10,
    weather: 0.10
  };

  /**
   * Generate personalized seat recommendations
   */
  recommendSeats(
    preferences: UserPreferences,
    context: RecommendationContext
  ): SeatRecommendation[] {
    const { stadium, sections, obstructions, gameDate, gameTime, weather } = context;
    const recommendations: SeatRecommendation[] = [];
    
    // Calculate sun position for game time
    const [hours, minutes] = gameTime.split(':').map(Number);
    const gameDateTime = new Date(gameDate);
    gameDateTime.setHours(hours, minutes, 0, 0);
    const sunPosition = getSunPosition(gameDateTime, stadium.latitude, stadium.longitude, stadium.timezone);
    
    // Score each section
    sections.forEach(section => {
      const score = this.scoreSection(section, preferences, context, sunPosition);
      const recommendation = this.buildRecommendation(
        section,
        score,
        preferences,
        context,
        sunPosition
      );
      recommendations.push(recommendation);
    });
    
    // Sort by score and return top recommendations
    recommendations.sort((a, b) => b.score - a.score);
    
    // Add alternative sections to top recommendations
    recommendations.slice(0, 5).forEach((rec, index) => {
      rec.alternativeSections = recommendations
        .slice(index + 1, index + 4)
        .map(r => r.sectionId);
    });
    
    return recommendations.slice(0, 10);
  }

  /**
   * Score a section based on preferences
   */
  private scoreSection(
    section: DetailedSection,
    preferences: UserPreferences,
    context: RecommendationContext,
    sunPosition: any
  ): number {
    let score = 50; // Base score
    
    // Sun exposure scoring
    const shadowResult = calculateSectionShadow(
      section,
      sunPosition,
      context.obstructions
    );
    const sunExposureScore = this.scoreSunExposure(
      shadowResult.sunExposure,
      preferences.sunPreference,
      context.weather
    );
    score += sunExposureScore * this.weights.sunExposure;
    
    // Price scoring
    const priceScore = this.scorePriceMatch(section, preferences.budgetRange);
    score += priceScore * this.weights.price;
    
    // View scoring
    const viewScore = this.scoreView(section, preferences.viewPreference);
    score += viewScore * this.weights.view;
    
    // Amenities scoring
    const amenityScore = this.scoreAmenities(section, preferences.amenityPriorities);
    score += amenityScore * this.weights.amenities;
    
    // Accessibility scoring
    if (preferences.accessibilityNeeds) {
      const accessScore = this.scoreAccessibility(section);
      score += accessScore * this.weights.accessibility;
    }
    
    // Weather impact scoring
    const weatherScore = this.scoreWeatherImpact(
      section,
      context.weather,
      preferences.weatherSensitivity
    );
    score += weatherScore * this.weights.weather;
    
    // Additional factors
    if (preferences.hasChildren) {
      score += this.scoreChildFriendliness(section);
    }
    
    if (preferences.groupSize > 4) {
      score += this.scoreGroupSeating(section, preferences.groupSize);
    }
    
    // Normalize score to 0-100
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Score sun exposure based on preference
   */
  private scoreSunExposure(
    exposure: number,
    preference: UserPreferences['sunPreference'],
    weather: WeatherData
  ): number {
    // Adjust for weather conditions
    const effectiveExposure = exposure * (1 - weather.cloudCover / 100);
    
    switch (preference) {
      case 'love-sun':
        return effectiveExposure; // Higher exposure = higher score
      
      case 'prefer-sun':
        return effectiveExposure * 0.8 + 20; // Moderate preference for sun
      
      case 'neutral':
        // Prefer moderate exposure
        return 100 - Math.abs(effectiveExposure - 50);
      
      case 'prefer-shade':
        return 80 - effectiveExposure * 0.8; // Moderate preference for shade
      
      case 'need-shade':
        return 100 - effectiveExposure; // Higher shade = higher score
      
      default:
        return 50;
    }
  }

  /**
   * Score price match
   */
  private scorePriceMatch(
    section: DetailedSection,
    budget: UserPreferences['budgetRange']
  ): number {
    const priceCategory = this.getPriceCategory(section);
    
    if (budget === 'any') return 75;
    
    const matchScore: Record<string, Record<string, number>> = {
      budget: { budget: 100, moderate: 60, premium: 20 },
      moderate: { budget: 70, moderate: 100, premium: 70 },
      premium: { budget: 20, moderate: 60, premium: 100 }
    };
    
    return matchScore[budget]?.[priceCategory] || 50;
  }

  /**
   * Score view preference
   */
  private scoreView(
    section: DetailedSection,
    preference: UserPreferences['viewPreference']
  ): number {
    if (preference === 'any') return 75;
    
    const angle = section.baseAngle;
    let viewScore = 0;
    
    switch (preference) {
      case 'home-plate':
        // Behind home plate: 160-200 degrees
        if (angle >= 160 && angle <= 200) viewScore = 100;
        else if (angle >= 140 && angle <= 220) viewScore = 70;
        else viewScore = 30;
        break;
      
      case 'first-base':
        // First base side: 0-90 degrees
        if (angle >= 0 && angle <= 90) viewScore = 100;
        else if (angle >= 315 || angle <= 120) viewScore = 70;
        else viewScore = 30;
        break;
      
      case 'third-base':
        // Third base side: 270-360 degrees
        if (angle >= 270 && angle <= 360) viewScore = 100;
        else if (angle >= 240 && angle <= 30) viewScore = 70;
        else viewScore = 30;
        break;
      
      case 'outfield':
        // Outfield: 30-150 or 210-330 degrees
        if ((angle >= 30 && angle <= 150) || (angle >= 210 && angle <= 330)) {
          viewScore = 100;
        } else {
          viewScore = 50;
        }
        break;
    }
    
    // Adjust for level
    if (section.level === 'field') viewScore *= 1.2;
    else if (section.level === 'upper') viewScore *= 0.8;
    
    return Math.min(100, viewScore);
  }

  /**
   * Score amenities
   */
  private scoreAmenities(
    section: DetailedSection,
    priorities: string[]
  ): number {
    let score = 50;
    
    priorities.forEach(priority => {
      switch (priority) {
        case 'shade':
          if (section.covered) score += 20;
          if (section.hasOverhang) score += 10;
          break;
        
        case 'food':
          if (section.level === 'club') score += 15;
          if (section.level === 'field') score += 10;
          break;
        
        case 'restrooms':
          if (section.level !== 'upper') score += 10;
          break;
        
        case 'view':
          if (section.level === 'field' || section.level === 'lower') score += 15;
          break;
        
        case 'parking':
          // Sections closer to main entrances
          if (section.baseAngle >= 160 && section.baseAngle <= 200) score += 10;
          break;
      }
    });
    
    return Math.min(100, score);
  }

  /**
   * Score accessibility
   */
  private scoreAccessibility(section: DetailedSection): number {
    let score = 50;
    
    // Field and lower levels are generally more accessible
    if (section.level === 'field') score += 30;
    else if (section.level === 'lower') score += 20;
    else if (section.level === 'upper') score -= 20;
    
    // Sections near aisles are better
    if (section.rows && section.rows.length > 0) {
      const hasAisleAccess = section.rows.some(row => row.seats <= 20);
      if (hasAisleAccess) score += 20;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Score weather impact
   */
  private scoreWeatherImpact(
    section: DetailedSection,
    weather: WeatherData,
    sensitivity: UserPreferences['weatherSensitivity']
  ): number {
    let score = 75;
    
    // Temperature impact
    const tempImpact = this.getTemperatureImpact(weather.temperature, sensitivity);
    score += tempImpact;
    
    // Wind impact
    if (weather.windSpeed > 20 && sensitivity !== 'low') {
      if (!section.covered) score -= 15;
      if (section.level === 'upper') score -= 10;
    }
    
    // Rain probability
    if (weather.precipitationProbability && weather.precipitationProbability > 30) {
      if (section.covered) score += 30;
      else score -= 20;
    }
    
    // UV index
    if (weather.uvIndex > 6 && !section.covered) {
      if (sensitivity === 'high') score -= 20;
      else if (sensitivity === 'medium') score -= 10;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Score child friendliness
   */
  private scoreChildFriendliness(section: DetailedSection): number {
    let score = 0;
    
    // Lower levels are better for children
    if (section.level === 'field' || section.level === 'lower') score += 10;
    
    // Covered sections protect from sun/rain
    if (section.covered) score += 10;
    
    // Sections behind protective netting
    if (section.baseAngle >= 160 && section.baseAngle <= 200) score += 5;
    
    return score;
  }

  /**
   * Score group seating availability
   */
  private scoreGroupSeating(section: DetailedSection, groupSize: number): number {
    if (!section.rows || section.rows.length === 0) return 0;
    
    // Check if section has rows with enough consecutive seats
    const hasGroupSeating = section.rows.some(row => row.seats >= groupSize);
    
    if (hasGroupSeating) {
      if (section.capacity >= groupSize * 10) return 15; // Plenty of options
      if (section.capacity >= groupSize * 5) return 10;  // Good options
      return 5; // Limited options
    }
    
    return -10; // Difficult to seat group together
  }

  /**
   * Build detailed recommendation
   */
  private buildRecommendation(
    section: DetailedSection,
    score: number,
    preferences: UserPreferences,
    context: RecommendationContext,
    sunPosition: any
  ): SeatRecommendation {
    const shadowResult = calculateSectionShadow(
      section,
      sunPosition,
      context.obstructions
    );
    
    const reasoning: string[] = [];
    const pros: string[] = [];
    const cons: string[] = [];
    
    // Sun exposure reasoning
    if (preferences.sunPreference === 'need-shade' && shadowResult.shadowPercentage > 70) {
      pros.push(`Excellent shade coverage (${shadowResult.shadowPercentage}%)`);
      reasoning.push('This section provides the shade you need.');
    } else if (preferences.sunPreference === 'love-sun' && shadowResult.sunExposure > 70) {
      pros.push(`Great sun exposure (${shadowResult.sunExposure}%)`);
      reasoning.push('Perfect for sun lovers!');
    }
    
    // View reasoning
    const viewDescription = this.getViewDescription(section);
    if (viewDescription) {
      pros.push(viewDescription);
    }
    
    // Weather protection
    if (section.covered) {
      pros.push('Protected from rain and sun');
    } else if (context.weather.precipitationProbability && context.weather.precipitationProbability > 30) {
      cons.push('No rain protection');
    }
    
    // Temperature estimate
    const estimatedTemp = this.estimateTemperature(
      context.weather.temperature,
      shadowResult.sunExposure,
      section.covered
    );
    
    if (estimatedTemp > 85) {
      cons.push(`May feel hot (est. ${estimatedTemp}°F)`);
    } else if (estimatedTemp < 60) {
      cons.push(`May feel cool (est. ${estimatedTemp}°F)`);
    }
    
    // Price category
    const priceCategory = this.getPriceCategory(section);
    if (preferences.budgetRange === 'budget' && priceCategory === 'budget') {
      pros.push('Affordable pricing');
    }
    
    // Accessibility
    if (preferences.accessibilityNeeds && section.level === 'field') {
      pros.push('Easy access, minimal stairs');
    }
    
    // Best and worst rows
    const { bestRows, avoidRows } = this.identifyBestRows(section, preferences);
    
    // Overall reasoning
    if (score >= 80) {
      reasoning.push('Excellent match for your preferences!');
    } else if (score >= 60) {
      reasoning.push('Good option with some trade-offs.');
    } else {
      reasoning.push('Consider alternatives for better match.');
    }
    
    return {
      sectionId: section.id,
      sectionName: section.name,
      score,
      reasoning,
      pros,
      cons,
      estimatedSunExposure: shadowResult.sunExposure,
      estimatedTemperature: estimatedTemp,
      priceCategory,
      alternativeSections: [],
      bestRows,
      avoidRows
    };
  }

  /**
   * Helper methods
   */
  private getPriceCategory(section: DetailedSection): 'budget' | 'moderate' | 'premium' {
    if (section.level === 'field' || section.level === 'club') return 'premium';
    if (section.level === 'upper') return 'budget';
    return 'moderate';
  }

  private getTemperatureImpact(temp: number, sensitivity: string): number {
    if (temp >= 85) {
      if (sensitivity === 'high') return -30;
      if (sensitivity === 'medium') return -15;
      return -5;
    }
    if (temp <= 60) {
      if (sensitivity === 'high') return -20;
      if (sensitivity === 'medium') return -10;
      return -5;
    }
    return 0;
  }

  private getViewDescription(section: DetailedSection): string {
    const angle = section.baseAngle;
    
    if (angle >= 160 && angle <= 200) return 'Behind home plate view';
    if (angle >= 0 && angle <= 90) return 'First base line view';
    if (angle >= 270 && angle <= 360) return 'Third base line view';
    if (angle >= 90 && angle <= 160) return 'Right field view';
    if (angle >= 200 && angle <= 270) return 'Left field view';
    return 'Outfield view';
  }

  private estimateTemperature(
    baseTemp: number,
    sunExposure: number,
    covered: boolean
  ): number {
    let temp = baseTemp;
    
    // Sun adds heat
    if (sunExposure > 75) temp += 8;
    else if (sunExposure > 50) temp += 5;
    else if (sunExposure > 25) temp += 3;
    
    // Covered sections are slightly cooler
    if (covered) temp -= 3;
    
    return Math.round(temp);
  }

  private identifyBestRows(
    section: DetailedSection,
    preferences: UserPreferences
  ): { bestRows?: number[]; avoidRows?: number[] } {
    if (!section.rows || section.rows.length === 0) {
      return {};
    }
    
    const bestRows: number[] = [];
    const avoidRows: number[] = [];
    
    section.rows.forEach(row => {
      // Best rows: middle elevation, not too far back
      if (row.rowNumber >= 5 && row.rowNumber <= 15) {
        bestRows.push(row.rowNumber);
      }
      
      // Avoid very back rows if not budget conscious
      if (preferences.budgetRange !== 'budget' && row.rowNumber > 25) {
        avoidRows.push(row.rowNumber);
      }
      
      // Avoid front rows if concerned about foul balls
      if (preferences.hasChildren && row.rowNumber <= 3) {
        avoidRows.push(row.rowNumber);
      }
    });
    
    return {
      bestRows: bestRows.length > 0 ? bestRows.slice(0, 5) : undefined,
      avoidRows: avoidRows.length > 0 ? avoidRows.slice(0, 3) : undefined
    };
  }

  /**
   * Get quick recommendations based on common scenarios
   */
  getQuickRecommendations(
    scenario: 'family' | 'date' | 'group' | 'solo' | 'business',
    context: RecommendationContext
  ): SeatRecommendation[] {
    const presetPreferences: Record<string, UserPreferences> = {
      family: {
        sunPreference: 'prefer-shade',
        budgetRange: 'moderate',
        groupSize: 4,
        accessibilityNeeds: true,
        viewPreference: 'home-plate',
        amenityPriorities: ['restrooms', 'food', 'shade'],
        weatherSensitivity: 'high',
        hasChildren: true
      },
      date: {
        sunPreference: 'neutral',
        budgetRange: 'premium',
        groupSize: 2,
        accessibilityNeeds: false,
        viewPreference: 'home-plate',
        amenityPriorities: ['view', 'food'],
        weatherSensitivity: 'medium',
        hasChildren: false
      },
      group: {
        sunPreference: 'prefer-shade',
        budgetRange: 'moderate',
        groupSize: 8,
        accessibilityNeeds: false,
        viewPreference: 'any',
        amenityPriorities: ['food', 'restrooms'],
        weatherSensitivity: 'low',
        hasChildren: false
      },
      solo: {
        sunPreference: 'neutral',
        budgetRange: 'budget',
        groupSize: 1,
        accessibilityNeeds: false,
        viewPreference: 'any',
        amenityPriorities: ['view'],
        weatherSensitivity: 'low',
        hasChildren: false
      },
      business: {
        sunPreference: 'need-shade',
        budgetRange: 'premium',
        groupSize: 4,
        accessibilityNeeds: true,
        viewPreference: 'home-plate',
        amenityPriorities: ['food', 'shade', 'view'],
        weatherSensitivity: 'high',
        hasChildren: false
      }
    };
    
    return this.recommendSeats(presetPreferences[scenario], context);
  }
}

// Export singleton instance
export const seatRecommendationEngine = new SeatRecommendationEngine();