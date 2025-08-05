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
import { aaaStadiumGuides4 } from './aaaStadiumGuides4';
import { aaaStadiumGuides5 } from './aaaStadiumGuides5';
import { aaaStadiumGuides6 } from './aaaStadiumGuides6';
import { aaStadiumGuides } from './aaStadiumGuides';
import { aaStadiumGuides1 } from './aaStadiumGuides1';
import { aaStadiumGuides2 } from './aaStadiumGuides2';
import { aaStadiumGuides3 } from './aaStadiumGuides3';
import { aaStadiumGuides4 } from './aaStadiumGuides4';
import { aaStadiumGuides5 } from './aaStadiumGuides5';
import { aaStadiumGuides6 } from './aaStadiumGuides6';
import { aaStadiumGuides7 } from './aaStadiumGuides7';
import { aaStadiumGuides8 } from './aaStadiumGuides8';
import { aaStadiumGuides9 } from './aaStadiumGuides9';
import { aPlusStadiumGuides } from './aPlusStadiumGuides';
import { aPlusStadiumGuides1 } from './aPlusStadiumGuides1';
import { aPlusStadiumGuides2 } from './aPlusStadiumGuides2';
import { aPlusStadiumGuides3 } from './aPlusStadiumGuides3';
import { aPlusStadiumGuides4 } from './aPlusStadiumGuides4';
import { aPlusStadiumGuides5 } from './aPlusStadiumGuides5';
import { aPlusStadiumGuides6 } from './aPlusStadiumGuides6';
import { aPlusStadiumGuides7 } from './aPlusStadiumGuides7';
import { aPlusStadiumGuides8 } from './aPlusStadiumGuides8';
import { aPlusStadiumGuides9 } from './aPlusStadiumGuides9';
import { singleAStadiumGuides } from './singleAStadiumGuides';
import { singleAStadiumGuides2 } from './singleAStadiumGuides2';
import { singleAStadiumGuides3 } from './singleAStadiumGuides3';
import { singleAStadiumGuides4 } from './singleAStadiumGuides4';
import { singleAStadiumGuides5 } from './singleAStadiumGuides5';
import { singleAStadiumGuides6 } from './singleAStadiumGuides6';
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
  ...aaaStadiumGuides3,
  ...aaaStadiumGuides4,
  ...aaaStadiumGuides5,
  ...aaaStadiumGuides6
};

// Combine all AA stadium guides
export const allAAStadiumGuides: Record<string, StadiumGuide> = {
  ...aaStadiumGuides,
  ...aaStadiumGuides1,
  ...aaStadiumGuides2,
  ...aaStadiumGuides3,
  ...aaStadiumGuides4,
  ...aaStadiumGuides5,
  ...aaStadiumGuides6,
  ...aaStadiumGuides7,
  ...aaStadiumGuides8,
  ...aaStadiumGuides9
};

// Combine all A+ stadium guides
export const allAPlusStadiumGuides: Record<string, StadiumGuide> = {
  ...aPlusStadiumGuides,
  ...aPlusStadiumGuides1,
  ...aPlusStadiumGuides2,
  ...aPlusStadiumGuides3,
  ...aPlusStadiumGuides4,
  ...aPlusStadiumGuides5,
  ...aPlusStadiumGuides6,
  ...aPlusStadiumGuides7,
  ...aPlusStadiumGuides8,
  ...aPlusStadiumGuides9
};

// Combine all Single-A stadium guides
export const allSingleAStadiumGuides: Record<string, StadiumGuide> = {
  ...singleAStadiumGuides,
  ...singleAStadiumGuides2,
  ...singleAStadiumGuides3,
  ...singleAStadiumGuides4,
  ...singleAStadiumGuides5,
  ...singleAStadiumGuides6
};

// Combined all stadium guides
export const allStadiumGuides: Record<string, StadiumGuide> = {
  ...allMLBStadiumGuides,
  ...allAAAStadiumGuides,
  ...allAAStadiumGuides,
  ...allAPlusStadiumGuides,
  ...allSingleAStadiumGuides
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
      return allAPlusStadiumGuides;
    case 'A':
      return allSingleAStadiumGuides;
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