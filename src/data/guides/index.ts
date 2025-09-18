// Import all stadium guide modules
import { mlbStadiumGuides } from './mlbStadiumGuides';
import { mlbStadiumGuidesExtended } from './mlbStadiumGuidesExtended';
import { mlbStadiumGuidesRemainder } from './mlbStadiumGuidesRemainder';
import { mlbStadiumGuidesFinal } from './mlbStadiumGuidesFinal';
import { nflStadiumGuides } from './nflStadiumGuides';
import { aaaStadiumGuides } from './aaaStadiumGuides';
import { aaStadiumGuides } from './aaStadiumGuides';
import { aPlusStadiumGuides } from './aPlusStadiumGuides';
import { singleAStadiumGuides } from './singleAStadiumGuides';
import { StadiumGuide } from '../stadiumGuides';

// Combined all stadium guides - merge all MLB guide files
export const allMLBStadiumGuides: Record<string, StadiumGuide> = {
  ...mlbStadiumGuides,
  ...mlbStadiumGuidesExtended,
  ...mlbStadiumGuidesRemainder,
  ...mlbStadiumGuidesFinal
};

export const allNFLStadiumGuides: Record<string, StadiumGuide> = {
  ...nflStadiumGuides
};

export const allAAAStadiumGuides: Record<string, StadiumGuide> = {
  ...aaaStadiumGuides
};

export const allAAStadiumGuides: Record<string, StadiumGuide> = {
  ...aaStadiumGuides
};

export const allAPlusStadiumGuides: Record<string, StadiumGuide> = {
  ...aPlusStadiumGuides
};

export const allSingleAStadiumGuides: Record<string, StadiumGuide> = {
  ...singleAStadiumGuides
};

// Combined all stadium guides
export const allStadiumGuides: Record<string, StadiumGuide> = {
  ...allMLBStadiumGuides,
  ...allNFLStadiumGuides,
  ...allAAAStadiumGuides,
  ...allAAStadiumGuides,
  ...allAPlusStadiumGuides,
  ...allSingleAStadiumGuides
};

// Helper function to get guide by stadium ID
export function getStadiumGuide(stadiumId: string): StadiumGuide | undefined {
  // First try direct lookup
  let guide = allStadiumGuides[stadiumId];
  
  // If not found, try to find by stadium name or alternative IDs
  if (!guide) {
    // Try lowercase version
    guide = allStadiumGuides[stadiumId.toLowerCase()];
    
    // If still not found, search by stadium name
    if (!guide) {
      const searchId = stadiumId.toLowerCase().replace(/-/g, '');
      const found = Object.values(allStadiumGuides).find(g => {
        const stadiumNameNormalized = g.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const teamNameNormalized = g.team.toLowerCase().replace(/[^a-z0-9]/g, '');
        return stadiumNameNormalized.includes(searchId) || 
               teamNameNormalized.includes(searchId) ||
               searchId.includes(stadiumNameNormalized) ||
               searchId.includes(teamNameNormalized);
      });
      if (found) {
        guide = found;
      }
    }
  }
  
  return guide;
}

// Helper function to get guides by league
export function getGuidesByLeague(league: 'MLB' | 'NFL' | 'AAA' | 'AA' | 'A+' | 'A'): Record<string, StadiumGuide> {
  switch (league) {
    case 'MLB':
      return allMLBStadiumGuides;
    case 'NFL':
      return allNFLStadiumGuides;
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
