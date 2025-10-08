import type { StadiumSection } from './stadiumSections';

export interface StadiumSections {
  stadiumId: string;
  sections: StadiumSection[];
}

/**
 * Dynamically import stadium section data to avoid bundling all sections upfront
 * This reduces the initial bundle size significantly (from 2.9MB to on-demand chunks)
 */
export async function getStadiumSectionsAsync(stadiumId: string): Promise<StadiumSection[]> {
  try {
    // MLB Stadiums
    const mlbStadiums = [
      'yankees', 'dodgers', 'redsox', 'cubs', 'giants', 'mets', 'angels',
      'astros', 'athletics', 'bluejays', 'braves', 'brewers', 'cardinals',
      'diamondbacks', 'guardians', 'mariners', 'marlins', 'nationals',
      'orioles', 'padres', 'phillies', 'pirates', 'rangers', 'rays',
      'reds', 'rockies', 'royals', 'tigers', 'twins', 'whitesox'
    ];

    if (mlbStadiums.includes(stadiumId)) {
      const module = await import(`./sections/mlb/${stadiumId}.ts`);
      return module.default || module.sections || [];
    }

    // NFL Venues
    const nflVenues = [
      'allegiant-stadium', 'arrowhead-stadium', 'at-t-stadium', 'bank-of-america-stadium',
      'caesars-superdome', 'empower-field', 'everbank-stadium', 'ford-field',
      'gillette-stadium', 'hard-rock-stadium', 'heinz-field', 'highmark-stadium',
      'lambeau-field', 'levis-stadium', 'lincoln-financial-field', 'lucas-oil-stadium',
      'metlife-stadium', 'mt-bank-stadium', 'nissan-stadium', 'northwest-stadium',
      'nrg-stadium', 'paycor-stadium', 'raymond-james-stadium', 'sofi-stadium-chargers',
      'sofi-stadium-rams', 'soldier-field', 'state-farm-stadium', 'us-bank-stadium'
    ];

    if (nflVenues.includes(stadiumId)) {
      const module = await import(`./sections/nfl/${stadiumId}.ts`);
      return module.default || module.sections || [];
    }

    // MiLB Stadiums - organized by level
    // Try AAA first
    try {
      const module = await import(`./sections/milb/aaa/${stadiumId}.ts`);
      return module.default || module.sections || [];
    } catch {}

    // Try AA
    try {
      const module = await import(`./sections/milb/aa/${stadiumId}.ts`);
      return module.default || module.sections || [];
    } catch {}

    // Try A+
    try {
      const module = await import(`./sections/milb/high-a/${stadiumId}.ts`);
      return module.default || module.sections || [];
    } catch {}

    // Try A
    try {
      const module = await import(`./sections/milb/low-a/${stadiumId}.ts`);
      return module.default || module.sections || [];
    } catch {}

    console.warn(`No section data found for stadium: ${stadiumId}`);
    return [];
  } catch (error) {
    console.error(`Error loading sections for ${stadiumId}:`, error);
    return [];
  }
}

/**
 * Synchronous fallback that returns an empty array
 * Use getStadiumSectionsAsync for actual data loading
 */
export function getStadiumSections(stadiumId: string): StadiumSection[] {
  console.warn('getStadiumSections (sync) called - use getStadiumSectionsAsync instead');
  return [];
}
