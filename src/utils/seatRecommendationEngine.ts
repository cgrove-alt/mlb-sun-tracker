import type { Seat } from '../types/seat';

export interface UserPreferences {
  sunPreference: 'avoid' | 'some' | 'full'; // Avoid sun, some sun OK, full sun OK
  viewQuality: 'excellent' | 'good' | 'any';
  accessibility: boolean; // Needs wheelchair accessible
  aislePreference: boolean; // Prefers aisle seats
  coveragePreference: 'covered' | 'open' | 'any';
  maxElevation?: number; // Maximum elevation in feet
  budget?: { min: number; max: number };
}

export interface ScoredSeat {
  seat: Seat;
  score: number;
  reasons: string[];
  warnings: string[];
}

/**
 * Calculate a score for a seat based on user preferences
 * Higher score = better match
 */
export function scoreSeat(seat: Seat, preferences: UserPreferences): ScoredSeat {
  let score = 50; // Base score
  const reasons: string[] = [];
  const warnings: string[] = [];

  // Sun Exposure Scoring (weight: 30 points)
  // Note: Actual sun exposure data would be loaded separately
  // For now, we use 'covered' as a proxy
  if (preferences.sunPreference === 'avoid') {
    if (seat.covered) {
      score += 30;
      reasons.push('Protected from sun');
    } else {
      score -= 20;
      warnings.push('Exposed to sun');
    }
  } else if (preferences.sunPreference === 'some') {
    if (seat.covered) {
      score += 15;
      reasons.push('Some coverage');
    } else {
      score += 10;
    }
  } else {
    // Full sun OK
    if (!seat.covered) {
      score += 20;
      reasons.push('Open to sun');
    } else {
      score += 5;
    }
  }

  // View Quality Scoring (weight: 25 points)
  if (seat.viewQuality) {
    if (preferences.viewQuality === 'excellent') {
      if (seat.viewQuality === 'excellent') {
        score += 25;
        reasons.push('Excellent view');
      } else if (seat.viewQuality === 'good') {
        score += 10;
        reasons.push('Good view');
      } else {
        score -= 10;
        warnings.push('View quality below preference');
      }
    } else if (preferences.viewQuality === 'good') {
      if (seat.viewQuality === 'excellent' || seat.viewQuality === 'good') {
        score += 20;
        reasons.push(`${seat.viewQuality.charAt(0).toUpperCase() + seat.viewQuality.slice(1)} view`);
      } else {
        score += 5;
      }
    } else {
      // Any view quality OK
      if (seat.viewQuality === 'excellent') {
        score += 15;
        reasons.push('Excellent view');
      } else if (seat.viewQuality === 'good') {
        score += 10;
        reasons.push('Good view');
      }
    }
  }

  // Accessibility Scoring (weight: REQUIRED if needed)
  if (preferences.accessibility) {
    if (seat.accessibility.wheelchairAccessible) {
      score += 20;
      reasons.push('Wheelchair accessible');
    } else {
      score = 0; // Automatically disqualify
      warnings.push('Not wheelchair accessible');
      return { seat, score, reasons, warnings };
    }
  }

  // Aisle Seat Scoring (weight: 15 points)
  if (preferences.aislePreference) {
    if (seat.seatType === 'aisle') {
      score += 15;
      reasons.push('Aisle seat for easy access');
    } else {
      score -= 5;
      warnings.push('Not an aisle seat');
    }
  }

  // Coverage Preference Scoring (weight: 10 points)
  if (preferences.coveragePreference === 'covered') {
    if (seat.covered) {
      score += 10;
      reasons.push('Covered seating');
    } else {
      score -= 10;
      warnings.push('Not covered');
    }
  } else if (preferences.coveragePreference === 'open') {
    if (!seat.covered) {
      score += 10;
      reasons.push('Open-air seating');
    } else {
      score -= 5;
    }
  }

  // Elevation Scoring (weight: 10 points)
  if (preferences.maxElevation !== undefined && seat.elevation !== null) {
    if (seat.elevation <= preferences.maxElevation) {
      const elevationScore = 10 * (1 - seat.elevation / preferences.maxElevation);
      score += elevationScore;
      reasons.push(`Lower elevation (${seat.elevation.toFixed(0)}ft)`);
    } else {
      score -= 15;
      warnings.push(`Higher than preferred (${seat.elevation.toFixed(0)}ft)`);
    }
  }

  // Distance bonus (closer is better, weight: 5 points)
  if (seat.distanceFromHomeplate) {
    const distanceScore = Math.max(0, 5 - (seat.distanceFromHomeplate / 100));
    score += distanceScore;
    if (seat.distanceFromHomeplate < 150) {
      reasons.push('Close to the action');
    }
  }

  return { seat, score, reasons, warnings };
}

/**
 * Get top N seat recommendations based on user preferences
 */
export function getRecommendations(
  seats: Seat[],
  preferences: UserPreferences,
  count: number = 10
): ScoredSeat[] {
  const scoredSeats = seats.map(seat => scoreSeat(seat, preferences));

  // Filter out disqualified seats (score = 0)
  const qualifiedSeats = scoredSeats.filter(s => s.score > 0);

  // Sort by score descending
  qualifiedSeats.sort((a, b) => b.score - a.score);

  // Return top N
  return qualifiedSeats.slice(0, count);
}

/**
 * Get preference presets for common use cases
 */
export function getPreferencePresets(): Record<string, UserPreferences> {
  return {
    'sun-avoider': {
      sunPreference: 'avoid',
      viewQuality: 'good',
      accessibility: false,
      aislePreference: false,
      coveragePreference: 'covered',
    },
    'sun-lover': {
      sunPreference: 'full',
      viewQuality: 'good',
      accessibility: false,
      aislePreference: false,
      coveragePreference: 'open',
    },
    'best-view': {
      sunPreference: 'some',
      viewQuality: 'excellent',
      accessibility: false,
      aislePreference: false,
      coveragePreference: 'any',
      maxElevation: 50,
    },
    'accessible': {
      sunPreference: 'some',
      viewQuality: 'any',
      accessibility: true,
      aislePreference: true,
      coveragePreference: 'any',
    },
    'budget-friendly': {
      sunPreference: 'some',
      viewQuality: 'any',
      accessibility: false,
      aislePreference: false,
      coveragePreference: 'any',
    },
  };
}
