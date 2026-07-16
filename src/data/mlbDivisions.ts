// MLB division map keyed by stadium id (audit Phase 6). Keyed by id — not team
// name — so lookups are robust (the old StadiumsPageSSR keyed on short names
// like "Yankees" while stadium.team is "New York Yankees", so every team fell
// through to a default division).
export const MLB_DIVISIONS: Record<string, string> = {
  orioles: 'AL East', redsox: 'AL East', yankees: 'AL East', rays: 'AL East', bluejays: 'AL East',
  guardians: 'AL Central', whitesox: 'AL Central', tigers: 'AL Central', royals: 'AL Central', twins: 'AL Central',
  astros: 'AL West', athletics: 'AL West', angels: 'AL West', mariners: 'AL West', rangers: 'AL West',
  braves: 'NL East', marlins: 'NL East', mets: 'NL East', phillies: 'NL East', nationals: 'NL East',
  brewers: 'NL Central', cardinals: 'NL Central', cubs: 'NL Central', reds: 'NL Central', pirates: 'NL Central',
  diamondbacks: 'NL West', rockies: 'NL West', dodgers: 'NL West', padres: 'NL West', giants: 'NL West',
};

export const DIVISION_ORDER = [
  'AL East', 'AL Central', 'AL West', 'NL East', 'NL Central', 'NL West',
] as const;

export function getDivision(stadiumId: string): string | undefined {
  return MLB_DIVISIONS[stadiumId];
}

// Other stadium ids in the same division (division-mates), in the map's order.
export function getDivisionMates(stadiumId: string): string[] {
  const division = MLB_DIVISIONS[stadiumId];
  if (!division) return [];
  return Object.keys(MLB_DIVISIONS).filter(
    (id) => id !== stadiumId && MLB_DIVISIONS[id] === division,
  );
}
