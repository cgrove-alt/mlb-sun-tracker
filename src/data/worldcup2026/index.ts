// 2026 FIFA World Cup Data - Main Export
// Central access point for all World Cup venue and match data

export type {
  WorldCupVenue,
  WorldCupMatch,
  WorldCupSectionMapping,
  WorldCupCity
} from './types';

export { WORLD_CUP_2026_INFO } from './types';

export {
  WORLD_CUP_USA_VENUES,
  WORLD_CUP_MEXICO_VENUES,
  WORLD_CUP_CANADA_VENUES,
  ALL_WORLD_CUP_VENUES,
  getWorldCupVenueById,
  getWorldCupVenuesByCountry,
  getReadyWorldCupVenues,
  WORLD_CUP_VENUE_STATS
} from './venues';

export {
  WORLD_CUP_2026_MATCHES,
  getMatchesByVenue,
  getMatchesByRound,
  getMatchesByDate,
  getAllMatchesSorted,
  getNextMatch,
  getOpeningWeekMatches,
  MATCH_SCHEDULE_STATS
} from './matches';
