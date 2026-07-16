// Curated Wikipedia article URLs for MLB ballparks, used for schema.org
// `sameAs` links on stadium pages (audit Phase 4). "Where available" — MiLB/NFL
// venues are omitted for now and can be added here as they are verified.
//
// Titles are real en.wikipedia.org articles; Wikipedia redirects cover recent
// renames (e.g. Guaranteed Rate Field → Rate Field). Extend this map to add
// more venues.
export const STADIUM_WIKIPEDIA: Record<string, string> = {
  angels: 'https://en.wikipedia.org/wiki/Angel_Stadium',
  astros: 'https://en.wikipedia.org/wiki/Daikin_Park',
  athletics: 'https://en.wikipedia.org/wiki/Sutter_Health_Park',
  bluejays: 'https://en.wikipedia.org/wiki/Rogers_Centre',
  braves: 'https://en.wikipedia.org/wiki/Truist_Park',
  brewers: 'https://en.wikipedia.org/wiki/American_Family_Field',
  cardinals: 'https://en.wikipedia.org/wiki/Busch_Stadium',
  cubs: 'https://en.wikipedia.org/wiki/Wrigley_Field',
  diamondbacks: 'https://en.wikipedia.org/wiki/Chase_Field',
  dodgers: 'https://en.wikipedia.org/wiki/Dodger_Stadium',
  giants: 'https://en.wikipedia.org/wiki/Oracle_Park',
  guardians: 'https://en.wikipedia.org/wiki/Progressive_Field',
  mariners: 'https://en.wikipedia.org/wiki/T-Mobile_Park',
  marlins: 'https://en.wikipedia.org/wiki/LoanDepot_Park',
  mets: 'https://en.wikipedia.org/wiki/Citi_Field',
  nationals: 'https://en.wikipedia.org/wiki/Nationals_Park',
  orioles: 'https://en.wikipedia.org/wiki/Oriole_Park_at_Camden_Yards',
  padres: 'https://en.wikipedia.org/wiki/Petco_Park',
  phillies: 'https://en.wikipedia.org/wiki/Citizens_Bank_Park',
  pirates: 'https://en.wikipedia.org/wiki/PNC_Park',
  rangers: 'https://en.wikipedia.org/wiki/Globe_Life_Field',
  rays: 'https://en.wikipedia.org/wiki/Tropicana_Field',
  redsox: 'https://en.wikipedia.org/wiki/Fenway_Park',
  reds: 'https://en.wikipedia.org/wiki/Great_American_Ball_Park',
  rockies: 'https://en.wikipedia.org/wiki/Coors_Field',
  royals: 'https://en.wikipedia.org/wiki/Kauffman_Stadium',
  tigers: 'https://en.wikipedia.org/wiki/Comerica_Park',
  twins: 'https://en.wikipedia.org/wiki/Target_Field',
  whitesox: 'https://en.wikipedia.org/wiki/Rate_Field',
  yankees: 'https://en.wikipedia.org/wiki/Yankee_Stadium',
};
