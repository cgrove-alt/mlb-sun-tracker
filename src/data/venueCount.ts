import { ALL_UNIFIED_VENUES } from './unifiedVenues';

// Single source of truth for the venue count, derived from the venue data file
// so it can never drift out of sync between pages (audit follow-up).
export const MLB_COUNT = ALL_UNIFIED_VENUES.filter((v) => v.league === 'MLB').length;
export const MILB_COUNT = ALL_UNIFIED_VENUES.filter((v) => v.league === 'MiLB').length;
export const NFL_COUNT = ALL_UNIFIED_VENUES.filter((v) => v.league === 'NFL').length;
export const VENUE_COUNT = ALL_UNIFIED_VENUES.length;

// e.g. "182 venues (30 MLB, 120 MiLB, 32 NFL)"
export const VENUE_COUNT_LABEL = `${VENUE_COUNT} venues`;
export const VENUE_BREAKDOWN = `${MLB_COUNT} MLB, ${MILB_COUNT} MiLB, ${NFL_COUNT} NFL`;
