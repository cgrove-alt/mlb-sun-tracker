import type { StadiumSection } from './stadiumSectionTypes';
import type { DetailedSection } from '../types/stadium-complete';

export interface StadiumSections {
  stadiumId: string;
  sections: StadiumSection[];
}

function toPageSections(sections: readonly DetailedSection[]): StadiumSection[] {
  return sections.map((section) => ({
    id: section.id,
    name: section.name,
    // The compact stadium-page type predates standing-room products; render
    // those on the lower concourse while the detailed calculator keeps the
    // distinct `standing` level.
    level: section.level === 'standing' ? 'lower' : section.level,
    baseAngle: section.baseAngle,
    angleSpan: section.angleSpan,
    rows: section.rows?.length,
    covered: section.covered,
    fullyCovered: section.covered,
    partialCoverage: Boolean(section.partialCoverage?.coveredRows?.length),
    coveredRows: section.partialCoverage?.coveredRows?.join(', '),
    price: section.price,
  }));
}

/**
 * Get stadium sections data asynchronously with dynamic imports
 * Uses explicit imports to enable true code splitting per stadium
 */
export async function getStadiumSectionsAsync(stadiumId: string): Promise<StadiumSection[]> {
  try {
    const { getOfficialDetailedSections } = await import('./officialSectionRegistry');
    const official = getOfficialDetailedSections(stadiumId);
    if (official) return toPageSections(official);

    // Explicit imports preserve one chunk per stadium while keeping the page,
    // row API, 3-D calculator and fidelity audit on the same DetailedSection
    // source. The former `stadiumSections-split` tree was an independent,
    // drifting copy with different IDs, angles and coverage flags.
    switch (stadiumId) {
      case 'angels': return toPageSections((await import('./sections/mlb/angels')).angelsSections);
      case 'astros': return toPageSections((await import('./sections/mlb/astros')).astrosSections);
      case 'athletics': return toPageSections((await import('./sections/mlb/athletics')).athleticsSections);
      case 'bluejays': return toPageSections((await import('./sections/mlb/bluejays')).bluejaysSections);
      case 'braves': return toPageSections((await import('./sections/mlb/braves')).bravesSections);
      case 'brewers': return toPageSections((await import('./sections/mlb/brewers')).brewersSections);
      case 'cardinals': return toPageSections((await import('./sections/mlb/cardinals')).cardinalsSections);
      case 'cubs': return toPageSections((await import('./sections/mlb/cubs')).cubsSections);
      case 'diamondbacks': return toPageSections((await import('./sections/mlb/diamondbacks')).diamondbacksSections);
      case 'dodgers': return toPageSections((await import('./sections/mlb/dodgers')).dodgersSections);
      case 'giants': return toPageSections((await import('./sections/mlb/giants')).giantsSections);
      case 'guardians': return toPageSections((await import('./sections/mlb/guardians')).guardiansSections);
      case 'mariners': return toPageSections((await import('./sections/mlb/mariners')).marinersSections);
      case 'marlins': return toPageSections((await import('./sections/mlb/marlins')).marlinsSections);
      case 'mets': return toPageSections((await import('./sections/mlb/mets')).metsSections);
      case 'nationals': return toPageSections((await import('./sections/mlb/nationals')).nationalsSections);
      case 'orioles': return toPageSections((await import('./sections/mlb/orioles')).oriolesSections);
      case 'padres': return toPageSections((await import('./sections/mlb/padres')).padresSections);
      case 'phillies': return toPageSections((await import('./sections/mlb/phillies')).philliesSections);
      case 'pirates': return toPageSections((await import('./sections/mlb/pirates')).piratesSections);
      case 'rangers': return toPageSections((await import('./sections/mlb/rangers')).rangersSections);
      case 'rays': return toPageSections((await import('./sections/mlb/rays')).raysSections);
      case 'redsox': return toPageSections((await import('./sections/mlb/redsox')).redsoxSections);
      case 'reds': return toPageSections((await import('./sections/mlb/reds')).redsSections);
      case 'rockies': return toPageSections((await import('./sections/mlb/rockies')).rockiesSections);
      case 'royals': return toPageSections((await import('./sections/mlb/royals')).royalsSections);
      case 'tigers': return toPageSections((await import('./sections/mlb/tigers')).tigersSections);
      case 'twins': return toPageSections((await import('./sections/mlb/twins')).twinsSections);
      case 'whitesox': return toPageSections((await import('./sections/mlb/whitesox')).whitesoxSections);
      case 'yankees': return toPageSections((await import('./sections/mlb/yankees')).yankeesSections);
      default:
        console.warn(`No section data found for stadium: ${stadiumId}`);
        return [];
    }
  } catch (error) {
    console.warn(`Error loading section data for stadium: ${stadiumId}`, error);
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
