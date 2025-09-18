/**
 * Stadium slug mapping utility
 * Maps various URL formats to canonical stadium IDs
 */

// Map of alternative slugs/names to canonical stadium IDs
export const stadiumSlugMap: Record<string, string> = {
  // Stadium name slugs to team IDs
  'angel-stadium': 'angels',
  'minute-maid-park': 'astros',
  'oakland-coliseum': 'athletics',
  'rogers-centre': 'bluejays',
  'truist-park': 'braves',
  'american-family-field': 'brewers',
  'busch-stadium': 'cardinals',
  'wrigley-field': 'cubs',
  'chase-field': 'diamondbacks',
  'dodger-stadium': 'dodgers',
  'marlins-park': 'marlins',
  'loanDepot-park': 'marlins',
  'citi-field': 'mets',
  'yankee-stadium': 'yankees',
  'citizens-bank-park': 'phillies',
  'pnc-park': 'pirates',
  'petco-park': 'padres',
  'oracle-park': 'giants',
  'tropicana-field': 'rays',
  'globe-life-field': 'rangers',
  'fenway-park': 'redsox',
  'guaranteed-rate-field': 'whitesox',
  'kauffman-stadium': 'royals',
  'target-field': 'twins',
  'coors-field': 'rockies',
  'comerica-park': 'tigers',
  'progressive-field': 'guardians',
  'great-american-ball-park': 'reds',
  't-mobile-park': 'mariners',
  'nationals-park': 'nationals',
  'camden-yards': 'orioles',
  'oriole-park': 'orioles',
  
  // Alternative names
  'skydome': 'bluejays',
  'the-jake': 'guardians',
  'jacobs-field': 'guardians',
  'the-trop': 'rays',
  'safeco-field': 'mariners',
  
  // Team name variations
  'blue-jays': 'bluejays',
  'red-sox': 'redsox',
  'white-sox': 'whitesox',
  
  // Direct team mappings (identity)
  'angels': 'angels',
  'astros': 'astros',
  'athletics': 'athletics',
  'bluejays': 'bluejays',
  'braves': 'braves',
  'brewers': 'brewers',
  'cardinals': 'cardinals',
  'cubs': 'cubs',
  'diamondbacks': 'diamondbacks',
  'dodgers': 'dodgers',
  'marlins': 'marlins',
  'mets': 'mets',
  'yankees': 'yankees',
  'phillies': 'phillies',
  'pirates': 'pirates',
  'padres': 'padres',
  'giants': 'giants',
  'rays': 'rays',
  'rangers': 'rangers',
  'redsox': 'redsox',
  'whitesox': 'whitesox',
  'royals': 'royals',
  'twins': 'twins',
  'rockies': 'rockies',
  'tigers': 'tigers',
  'guardians': 'guardians',
  'reds': 'reds',
  'mariners': 'mariners',
  'nationals': 'nationals',
  'orioles': 'orioles'
};

/**
 * Normalize a slug by converting to lowercase and removing special characters
 */
export function normalizeSlug(slug: string): string {
  return slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

/**
 * Get the canonical stadium ID from any slug format
 */
export function getCanonicalStadiumId(slug: string): string | undefined {
  const normalized = normalizeSlug(slug);
  return stadiumSlugMap[normalized];
}

/**
 * Check if a slug needs redirect (not a canonical ID)
 */
export function needsRedirect(slug: string): boolean {
  const normalized = normalizeSlug(slug);
  const canonical = stadiumSlugMap[normalized];
  return canonical !== undefined && canonical !== normalized;
}

/**
 * Get all valid slugs for a stadium ID
 */
export function getAllSlugsForStadium(stadiumId: string): string[] {
  const slugs: string[] = [];
  for (const [slug, id] of Object.entries(stadiumSlugMap)) {
    if (id === stadiumId) {
      slugs.push(slug);
    }
  }
  return slugs;
}