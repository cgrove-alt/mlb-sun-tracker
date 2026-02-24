/**
 * World Cup 2026 Translation Keys and Constants
 *
 * This file centralizes all hardcoded strings from World Cup pages
 * to prepare for future i18n support (Spanish/French in v3).
 *
 * Usage:
 * - Import strings from this file instead of hardcoding
 * - In v3, these will be replaced with translation function calls
 */

export const WORLDCUP_STRINGS = {
  // Page Titles
  PAGE_TITLE_SCHEDULE: 'FIFA World Cup 2026 Schedule | Find Shaded Seats',
  PAGE_TITLE_VENUES: 'FIFA World Cup 2026 Venues - All 16 Stadiums | The Shadium',
  PAGE_TITLE_VENUE_DETAIL: (venueName: string) => `${venueName} - FIFA World Cup 2026 | The Shadium`,
  PAGE_TITLE_COMPARE: 'Compare World Cup 2026 Venues | The Shadium',

  // Page Descriptions
  PAGE_DESC_SCHEDULE: 'Complete schedule of all 104 FIFA World Cup 2026 matches across USA, Mexico, and Canada. Find the best shaded seats for every match.',
  PAGE_DESC_VENUES: 'Complete guide to all 16 FIFA World Cup 2026 venues across USA, Mexico, and Canada. Find shaded seats, match schedules, and stadium details for every World Cup venue.',
  PAGE_DESC_COMPARE: 'Compare FIFA World Cup 2026 venues side-by-side. Analyze shade coverage, capacity, climate, and match schedules to plan your perfect World Cup experience.',

  // Hero Sections
  HERO_TITLE_SCHEDULE: 'FIFA World Cup 2026 Schedule',
  HERO_SUBTITLE_SCHEDULE: 'Complete schedule of all 104 matches with shade finder integration',
  HERO_TITLE_VENUES: 'FIFA World Cup 2026 Venues',
  HERO_SUBTITLE_VENUES: '16 stadiums across 3 countries hosting 104 matches',
  HERO_DESCRIPTION_VENUES: 'All venues with row-level shade data for perfect seat selection',

  // Filters and Actions
  FILTER_SEARCH_VENUES: 'Search Venues',
  FILTER_SEARCH_PLACEHOLDER: 'Search by stadium name or city...',
  FILTER_COUNTRY_LABEL: 'Filter by Country',
  FILTER_ROUND_LABEL: 'Filter by Round',
  FILTER_VENUE_LABEL: 'Filter by Venue',
  FILTER_DATE_RANGE: 'Date Range',
  FILTER_START_DATE: 'Start Date',
  FILTER_END_DATE: 'End Date',
  FILTER_ACTIVE: 'Active filters:',
  FILTER_CLEAR_ALL: 'Clear all',
  FILTER_CLEAR_ALL_FILTERS: 'Clear all filters',

  // Country Options
  COUNTRY_ALL: 'All Countries',
  COUNTRY_USA: 'USA',
  COUNTRY_MEXICO: 'Mexico',
  COUNTRY_CANADA: 'Canada',
  COUNTRY_USA_FLAG: '🇺🇸',
  COUNTRY_MEXICO_FLAG: '🇲🇽',
  COUNTRY_CANADA_FLAG: '🇨🇦',

  // Round Options
  ROUND_ALL: 'All Rounds',
  ROUND_GROUP: 'Group Stage',
  ROUND_32: 'Round of 32',
  ROUND_16: 'Round of 16',
  ROUND_QF: 'Quarterfinal',
  ROUND_SF: 'Semifinal',
  ROUND_3RD: 'Third Place',
  ROUND_FINAL: 'Final',

  // Results and Counts
  RESULTS_SHOWING: 'Showing',
  RESULTS_VENUES: (count: number) => `${count} venue${count !== 1 ? 's' : ''}`,
  RESULTS_MATCHES: (count: number) => `${count} match${count !== 1 ? 'es' : ''}`,
  RESULTS_NO_VENUES: 'No venues found matching your filters',
  RESULTS_NO_MATCHES: 'No matches found matching your filters',

  // Actions
  ACTION_COMPARE_VENUES: 'Compare Venues',
  ACTION_VIEW_SCHEDULE: 'View Schedule',
  ACTION_VIEW_VENUE: 'View Venue',
  ACTION_FIND_SHADED_SEATS: 'Find Shaded Seats',
  ACTION_VENUE_INFO: 'Venue Info',
  ACTION_SEARCH: 'Search',
  ACTION_SORT: 'Sort',

  // Venue Information
  VENUE_MATCHES: (count: number) => `${count} match${count !== 1 ? 'es' : ''}`,
  VENUE_CAPACITY: 'Capacity',
  VENUE_ROOF_TYPE: 'Roof',
  VENUE_SURFACE: 'Surface',
  VENUE_OPENED: 'Opened',
  VENUE_LOCATION: 'Location',
  VENUE_TIMEZONE: 'Timezone',

  // Match Information
  MATCH_DATE: 'Date',
  MATCH_TIME: 'Time',
  MATCH_VENUE: 'Venue',
  MATCH_ROUND: 'Round',
  MATCH_KICKOFF: 'Kickoff',
  MATCH_TBD: 'TBD',
  MATCH_COUNTDOWN: 'Match starts in',

  // Climate Messages (for reference, actual component uses ClimateMessaging)
  CLIMATE_USA: 'Summer heat - shade critical for comfort',
  CLIMATE_MEXICO: 'High altitude - intense sun exposure',
  CLIMATE_CANADA: 'Mild climate - less sun concern, but still check',

  // Sort Columns
  SORT_DATE: 'Date',
  SORT_VENUE: 'Venue',
  SORT_ROUND: 'Round',

  // CTA Sections
  CTA_VIEW_SCHEDULE_TITLE: 'View Full Match Schedule',
  CTA_VIEW_SCHEDULE_DESC: 'See all 104 World Cup 2026 matches with shade finder integration',
  CTA_COMPARE_VENUES_TITLE: 'Compare Venues',
  CTA_COMPARE_VENUES_DESC: 'Compare shade coverage, capacity, and climate across all 16 stadiums',

  // Comparison
  COMPARE_SELECT_VENUES: 'Select 2-4 venues to compare',
  COMPARE_DISTANCE: 'Distance between venues',
  COMPARE_CLIMATE: 'Climate Zone',
  COMPARE_SHADE_SCORE: 'Average Shade Coverage',
  COMPARE_BEST_FOR: 'Best For',
  COMPARE_PACKING_TIPS: 'Packing Tips',

  // Accessibility
  A11Y_COUNTRY_FILTER: 'Filter venues by country',
  A11Y_ROUND_FILTER: 'Filter matches by tournament round',
  A11Y_VENUE_FILTER: 'Filter matches by venue',
  A11Y_SEARCH: 'Search venues and matches',
  A11Y_CLIMATE_INFO: (country: string) => `Climate information for ${country}`,
  A11Y_SORT_BUTTON: (column: string) => `Sort by ${column}`,

  // SEO Keywords
  SEO_KEYWORDS_SCHEDULE: 'World Cup 2026, FIFA, schedule, matches, USA, Mexico, Canada, shaded seats',
  SEO_KEYWORDS_VENUES: [
    'World Cup 2026 venues',
    'FIFA World Cup stadiums',
    'World Cup USA venues',
    'World Cup Mexico venues',
    'World Cup Canada venues',
    'World Cup 2026 stadiums',
    'shaded seats World Cup',
    'World Cup venue guide'
  ],

  // Open Graph
  OG_TITLE_SCHEDULE: 'FIFA World Cup 2026 Schedule',
  OG_DESC_SCHEDULE: 'View all 104 World Cup matches and find shaded seats at every venue',
  OG_TITLE_VENUES: 'FIFA World Cup 2026 Venues - All 16 Stadiums',
  OG_DESC_VENUES: 'Explore all 16 World Cup 2026 venues with complete shade analysis and match schedules',

  // Event Information
  EVENT_NAME: 'FIFA World Cup 2026',
  EVENT_HOST_COUNTRIES: 'USA, Mexico, Canada',
  EVENT_DATES: 'June 11 - July 19, 2026',
  EVENT_TOTAL_MATCHES: 104,
  EVENT_TOTAL_VENUES: 16,
  EVENT_OPENING_MATCH: 'June 11, 2026',
  EVENT_FINAL: 'July 19, 2026'
} as const;

/**
 * Translation Notes for Future i18n Implementation (v3)
 *
 * Languages to support:
 * - Spanish (es): Primary for Mexico, useful for USA
 * - French (fr): Primary for Canada (Quebec)
 * - English (en): Default
 *
 * Implementation approach:
 * 1. Convert WORLDCUP_STRINGS to JSON translation files
 * 2. Update components to use t('key') from i18n context
 * 3. Add language selector to World Cup pages
 * 4. Ensure date/time formatting respects locale
 *
 * Key considerations:
 * - Country names may need localization (e.g., "United States" vs "Estados Unidos")
 * - Date formats vary (MM/DD/YYYY vs DD/MM/YYYY)
 * - Temperature units (Fahrenheit in USA, Celsius in Mexico/Canada)
 * - Plural forms differ across languages
 * - RTL support not required for these languages
 */

export type WorldCupStringKey = keyof typeof WORLDCUP_STRINGS;
