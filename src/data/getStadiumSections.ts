import type { StadiumSection } from './stadiumSections';

export interface StadiumSections {
  stadiumId: string;
  sections: StadiumSection[];
}

/**
 * Get stadium sections data asynchronously with dynamic imports
 * Uses explicit imports to enable true code splitting per stadium
 */
export async function getStadiumSectionsAsync(stadiumId: string): Promise<StadiumSection[]> {
  try {
    let module;
    // Explicit switch allows webpack to create separate chunks for each stadium
    switch (stadiumId) {
      case 'angels': module = await import('./stadiumSections-split/angels'); break;
      case 'astros': module = await import('./stadiumSections-split/astros'); break;
      case 'athletics': module = await import('./stadiumSections-split/athletics'); break;
      case 'bluejays': module = await import('./stadiumSections-split/bluejays'); break;
      case 'braves': module = await import('./stadiumSections-split/braves'); break;
      case 'brewers': module = await import('./stadiumSections-split/brewers'); break;
      case 'cardinals': module = await import('./stadiumSections-split/cardinals'); break;
      case 'cubs': module = await import('./stadiumSections-split/cubs'); break;
      case 'diamondbacks': module = await import('./stadiumSections-split/diamondbacks'); break;
      case 'dodgers': module = await import('./stadiumSections-split/dodgers'); break;
      case 'giants': module = await import('./stadiumSections-split/giants'); break;
      case 'guardians': module = await import('./stadiumSections-split/guardians'); break;
      case 'mariners': module = await import('./stadiumSections-split/mariners'); break;
      case 'marlins': module = await import('./stadiumSections-split/marlins'); break;
      case 'mets': module = await import('./stadiumSections-split/mets'); break;
      case 'nationals': module = await import('./stadiumSections-split/nationals'); break;
      case 'orioles': module = await import('./stadiumSections-split/orioles'); break;
      case 'padres': module = await import('./stadiumSections-split/padres'); break;
      case 'phillies': module = await import('./stadiumSections-split/phillies'); break;
      case 'pirates': module = await import('./stadiumSections-split/pirates'); break;
      case 'rangers': module = await import('./stadiumSections-split/rangers'); break;
      case 'rays': module = await import('./stadiumSections-split/rays'); break;
      case 'redsox': module = await import('./stadiumSections-split/redsox'); break;
      case 'reds': module = await import('./stadiumSections-split/reds'); break;
      case 'rockies': module = await import('./stadiumSections-split/rockies'); break;
      case 'royals': module = await import('./stadiumSections-split/royals'); break;
      case 'tigers': module = await import('./stadiumSections-split/tigers'); break;
      case 'twins': module = await import('./stadiumSections-split/twins'); break;
      case 'whitesox': module = await import('./stadiumSections-split/whitesox'); break;
      case 'yankees': module = await import('./stadiumSections-split/yankees'); break;
      default:
        console.warn(`No section data found for stadium: ${stadiumId}`);
        return [];
    }
    const data = module.stadiumSections;
    return data.sections || [];
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
