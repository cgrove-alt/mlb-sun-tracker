// Import all stadium guide modules
import { mlbStadiumGuides } from './mlbStadiumGuides';
import { mlbStadiumGuides2 } from './mlbStadiumGuides2';
import { mlbStadiumGuides3 } from './mlbStadiumGuides3';
import { mlbStadiumGuides4 } from './mlbStadiumGuides4';
import { mlbStadiumGuides5 } from './mlbStadiumGuides5';
import { mlbStadiumGuides6 } from './mlbStadiumGuides6';
import { aaaStadiumGuides } from './aaaStadiumGuides';
import { aaaStadiumGuides2 } from './aaaStadiumGuides2';
import { aaaStadiumGuides3 } from './aaaStadiumGuides3';
import { aaStadiumGuides } from './aaStadiumGuides';
import { aaStadiumGuides2 } from './aaStadiumGuides2';
import { aPlusStadiumGuides } from './aPlusStadiumGuides';
import { singleAStadiumGuides } from './singleAStadiumGuides';
import { StadiumGuide } from '../stadiumGuides';

// Combine all MLB stadium guides
export const allMLBStadiumGuides: Record<string, StadiumGuide> = {
  ...mlbStadiumGuides,
  ...mlbStadiumGuides2,
  ...mlbStadiumGuides3,
  ...mlbStadiumGuides4,
  ...mlbStadiumGuides5,
  ...mlbStadiumGuides6
};

// Combine all AAA stadium guides
export const allAAAStadiumGuides: Record<string, StadiumGuide> = {
  ...aaaStadiumGuides,
  ...aaaStadiumGuides2,
  ...aaaStadiumGuides3
};

// Combine all AA stadium guides
export const allAAStadiumGuides: Record<string, StadiumGuide> = {
  ...aaStadiumGuides,
  ...aaStadiumGuides2
};

// Export MiLB guides by level
export { aPlusStadiumGuides } from './aPlusStadiumGuides';
export { singleAStadiumGuides } from './singleAStadiumGuides';

// Combined all stadium guides
export const allStadiumGuides: Record<string, StadiumGuide> = {
  ...allMLBStadiumGuides,
  ...allAAAStadiumGuides,
  ...allAAStadiumGuides,
  ...aPlusStadiumGuides,
  ...singleAStadiumGuides
};

// Helper function to get guide by stadium ID
export function getStadiumGuide(stadiumId: string): StadiumGuide | undefined {
  return allStadiumGuides[stadiumId];
}

// Helper function to get guides by league
export function getGuidesByLeague(league: 'MLB' | 'AAA' | 'AA' | 'A+' | 'A'): Record<string, StadiumGuide> {
  switch (league) {
    case 'MLB':
      return allMLBStadiumGuides;
    case 'AAA':
      return allAAAStadiumGuides;
    case 'AA':
      return allAAStadiumGuides;
    case 'A+':
      return aPlusStadiumGuides;
    case 'A':
      return singleAStadiumGuides;
    default:
      return {};
  }
}

// Helper function to search guides
export function searchStadiumGuides(query: string): StadiumGuide[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(allStadiumGuides).filter(guide =>
    guide.name.toLowerCase().includes(lowerQuery) ||
    guide.team.toLowerCase().includes(lowerQuery) ||
    guide.neighborhood.name.toLowerCase().includes(lowerQuery)
  );
}