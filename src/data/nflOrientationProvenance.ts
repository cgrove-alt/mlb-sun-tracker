/**
 * NFL Field-Axis Provenance
 *
 * Tracks how we arrived at each NFL venue's `orientation` — the compass
 * bearing of the field long axis (0 = north). End zones sit at `orientation`
 * and `orientation + 180`; sidelines are ±90°. The axis is undirected for
 * shade-side copy (0 and 180 name the same N–S field).
 *
 * This is the football counterpart of `stadiumOrientationProvenance.ts`.
 * Confidence / precisionDeg rules are the same:
 *   - verified   — ≥2 independent sources agree on the undirected axis
 *                  within ~12° AND precisionDeg ≤ 12
 *   - estimated  — a single published or OSM source
 *   - unverified — no usable source, or sources disagree by more than ~12°
 *
 * `precisionDeg` is METADATA ONLY. NFL section shade % stays unpublished
 * until measured bowl geometry exists; these values only fix FAQ / OG
 * shade-side copy and keep 0° from meaning "we never measured this."
 *
 * Primary sources for the 2026-08-18 pass:
 *   1. OpenStreetMap `leisure=pitch` (or named field) polygons, PCA of
 *      vertices in local meters → undirected bearing. Aspect ~2.2 and
 *      ~110×49 m required unless the way is explicitly the stadium field.
 *   2. Thompson James Bliss `StadiumAzimuthAngle` (WeatherData
 *      stadium_coordinates.csv) — published numeric azimuth, 0 = north.
 *   3. vizual-statistix 2015 Google Earth survey (Packers / Broncos /
 *      Seahawks / Bucs perfectly N–S; Texans / Bears within 5°). Not used
 *      for SoFi, Mercedes-Benz Stadium, or U.S. Bank (those venues did not
 *      exist / were not the then-home).
 *
 * Shared sites (MetLife, SoFi) have two franchise ids and one measurement.
 */

import type { OrientationProvenance } from './stadiumOrientationProvenance';

const BLISS =
  'Thompson James Bliss, stadium_coordinates.csv StadiumAzimuthAngle (https://raw.githubusercontent.com/ThompsonJamesBliss/WeatherData/master/data/stadium_coordinates.csv)';
const VIZUAL =
  'vizual-statistix 2015 Google Earth azimuth survey (https://www.tumblr.com/vizual-statistix/126425452261/)';
const REVIEWED = '2026-08-18';

export const NFL_ORIENTATION_PROVENANCE: OrientationProvenance[] = [
  {
    stadiumId: 'highmark-stadium',
    orientation: 0,
    confidence: 'verified',
    precisionDeg: 12,
    method: 'published-source',
    sources: [
      'StadiumDB / Populous design: new Highmark field "rotated… to a north-south direction"',
      'Jamestown Post-Journal / AP 2026-08: new stadium has "a north-south orientation" vs the west-east former home, to stop Lake Erie wind funneling into the bowl',
      'Wikipedia Highmark Stadium (New York): 42.77306°N, 78.79222°W; opened 2026-06-23; capacity 60,108',
    ],
    notes: 'NEW 2026 stadium west of Abbott Road. Previous 50° / 42.7738,-78.7870 was the demolished New Era / Ralph Wilson bowl (Bliss 302.1°, OSM pitch way 92823957 = 127.2° — same old-site axis). OSM way 1339149058 is still tagged building=construction; no finished pitch polygon yet. 0° is the published N-S axis, not a leftover default.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'hard-rock-stadium',
    orientation: 302,
    confidence: 'verified',
    precisionDeg: 8,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 171419978 leisure=pitch sport=american_football PCA 127.2° (L=117 m W=63 m aspect 2.19) — 5.1° from Bliss on the undirected axis',
      `${BLISS}: Hard Rock Stadium = 302.1°`,
    ],
    notes: 'CORRECTED from 0°. 0° was an unset default, not a measured N-S field.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'gillette-stadium',
    orientation: 343,
    confidence: 'verified',
    precisionDeg: 10,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 129179929 leisure=pitch sport=american_football PCA 152.4° (L=114 m W=59 m aspect 2.30) — 10.6° from Bliss on the undirected axis',
      `${BLISS}: Gillette Stadium = 343°`,
    ],
    notes: 'CORRECTED from 0° default.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'metlife-stadium-jets',
    orientation: 346,
    confidence: 'verified',
    precisionDeg: 8,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 180559973 leisure=pitch sport=american_football PCA 171.7° (L=114 m W=58 m aspect 2.32) — 6.2° from Bliss on the undirected axis',
      `${BLISS}: MetLife Stadium = 345.5°`,
      'shadedseats.com MetLife: "oriented in a slightly off-axis north to south direction"; noon sun behind the southern end zone',
    ],
    notes: 'CORRECTED from 23°. Same physical field as metlife-stadium-giants.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'm-t-bank-stadium',
    orientation: 290,
    confidence: 'verified',
    precisionDeg: 8,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 172620322 leisure=pitch sport=american_football PCA 104.6° (L=118 m W=63 m aspect 2.21) — 4.9° from Bliss on the undirected axis',
      `${BLISS}: M&T Bank Stadium = 289.5°`,
    ],
    notes: 'CORRECTED from 22° (wrong-quadrant leftover).',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'paycor-stadium',
    orientation: 321,
    confidence: 'verified',
    precisionDeg: 8,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 32946979 leisure=pitch sport=american_football, 10 m from venue coords, PCA 146.5° (L=118 m W=63 m aspect 2.22) — 5.9° from Bliss on the undirected axis',
      `${BLISS}: Paul Brown Stadium = 320.6°`,
    ],
    notes: 'CORRECTED from 13°.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'huntington-bank-field',
    orientation: 56,
    confidence: 'verified',
    precisionDeg: 8,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 172658198 leisure=pitch sport=american_football PCA 50.4° (L=118 m W=63 m aspect 2.21) — 5.7° from Bliss',
      `${BLISS}: FirstEnergy Stadium = 56.1°`,
    ],
    notes: 'CORRECTED from 287°. 287° axis (107°) was ~51° off the measured field.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'acrisure-stadium',
    orientation: 334,
    confidence: 'verified',
    precisionDeg: 12,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 172659571 leisure=pitch sport=american_football, 3 m from venue coords, PCA 165.6° (L=131 m W=94 m aspect 1.45) — 11.7° from Bliss on the undirected axis',
      `${BLISS}: Heinz Field = 333.9°`,
    ],
    notes: 'CORRECTED from 275°. Pitch polygon is a bit wide (includes runoffs) but both sources are NNW-SSE.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'nrg-stadium',
    orientation: 358,
    confidence: 'verified',
    precisionDeg: 8,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 119422708 NRG Stadium outline PCA 173.0°; nearby football pitches 119422957 / 119422950 ≈ 173.3°',
      `${BLISS}: NRG Stadium = 358.2°`,
      `${VIZUAL}: Texans within 5° of north-south`,
    ],
    notes: 'Previous 0° happened to be within 2° of the measured axis; now sourced rather than a default.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'lucas-oil-stadium',
    orientation: 27,
    confidence: 'estimated',
    precisionDeg: 15,
    method: 'published-source',
    sources: [
      `${BLISS}: Lucas Oil Stadium = 26.6°`,
      'OSM way 27258709 building outline PCA 8.1° — indoor bowl, not a field polygon (18° from Bliss; not used as a second source)',
    ],
    notes: 'Retractable roof; no mapped playing-surface polygon. Single published azimuth.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'everbank-stadium',
    orientation: 17,
    confidence: 'verified',
    precisionDeg: 6,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 172665883 leisure=pitch sport=american_football, 5 m from venue coords, PCA 14.9° — 1.8° from Bliss',
      `${BLISS}: TIAA Bank Field = 16.7°`,
    ],
    notes: 'REFINED from 22°.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'nissan-stadium',
    orientation: 335,
    confidence: 'verified',
    precisionDeg: 8,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 172668023 leisure=pitch sport=american_football PCA 161.0° (L=118 m W=62 m aspect 2.26) — 6.4° from Bliss on the undirected axis',
      `${BLISS}: Nissan Stadium = 334.6°`,
    ],
    notes: 'CORRECTED from 0° default.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'empower-field',
    orientation: 0,
    confidence: 'verified',
    precisionDeg: 6,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 72605220 leisure=pitch sport includes american_football PCA 175.0° (L=114 m W=59 m aspect 2.30) — 5° from due north',
      `${BLISS}: Empower Field at Mile High = 0°`,
      `${VIZUAL}: Broncos perfectly north-south`,
    ],
    notes: '0° is a measured N-S axis, not an unset default.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'geha-field-arrowhead',
    orientation: 316,
    confidence: 'verified',
    precisionDeg: 8,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 65960009 leisure=pitch name="GEHA Field at Arrowhead Stadium" PCA 142.8° (L=119 m W=64 m aspect 2.20) — 6.5° from Bliss on the undirected axis',
      `${BLISS}: Arrowhead Stadium = 316.3°`,
    ],
    notes: 'CORRECTED from 0° default. The circular bowl outline (way 65960012) has no usable axis.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'allegiant-stadium',
    orientation: 26,
    confidence: 'estimated',
    precisionDeg: 15,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 816371013 leisure=pitch name="Las Vegas Raiders" sport=american_football PCA 25.8° (L=123 m W=71 m aspect 1.84)',
      `${BLISS}: Allegiant Stadium = 0° (indoor seating-chart estimate)`,
    ],
    notes: 'Fixed roof — seat shade is 100% regardless. OSM has a real indoor pitch polygon; Bliss seating-chart 0° disagrees by 26°, so this stays estimated (OSM preferred as geometry). Previous 0° was an unset default that happened to match Bliss.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'sofi-stadium-chargers',
    orientation: 338,
    confidence: 'verified',
    precisionDeg: 8,
    method: 'published-source',
    sources: [
      'OSM way 860635712 SoFi Stadium outline PCA 152.0° — 6.2° from Bliss on the undirected axis',
      `${BLISS}: SoFi Stadium = 338.2°`,
    ],
    notes: 'CORRECTED from 90°. 90° was a leftover east-west placeholder (LA Memorial Coliseum / older dump), not this building. Same physical field as sofi-stadium-rams. Open-sided canopy is still modelled roof:fixed for publication, not an open bowl.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'at-t-stadium',
    orientation: 68,
    confidence: 'verified',
    precisionDeg: 6,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 47086748 AT&T Stadium building PCA 65.8° — 2.2° from Bliss',
      `${BLISS}: AT&T Stadium = 68°`,
    ],
    notes: 'CORRECTED from 340°. 340° was essentially perpendicular to the measured field.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'metlife-stadium-giants',
    orientation: 346,
    confidence: 'verified',
    precisionDeg: 8,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 180559973 leisure=pitch sport=american_football PCA 171.7°',
      `${BLISS}: MetLife Stadium = 345.5°`,
      'shadedseats.com MetLife: slightly off-axis north-south; noon sun behind the southern end zone',
    ],
    notes: 'Same physical field as metlife-stadium-jets.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'lincoln-financial-field',
    orientation: 351,
    confidence: 'verified',
    precisionDeg: 6,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 708050530 leisure=pitch sport=american_football PCA 167.2° — 3.8° from Bliss on the undirected axis',
      `${BLISS}: Lincoln Financial Field = 351°`,
      `${VIZUAL}: Eagles within 15° of north-south`,
    ],
    notes: 'REFINED from 5°. Same N-S octant; 351° is the published / OSM axis.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'northwest-stadium',
    orientation: 295,
    confidence: 'verified',
    precisionDeg: 10,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 612644655 leisure=pitch sport=american_football PCA 124.5° (L=113 m W=58 m aspect 2.28) — 9.5° from Bliss on the undirected axis',
      `${BLISS}: FedExField = 295°`,
    ],
    notes: 'CORRECTED from 58°.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'soldier-field',
    orientation: 354,
    confidence: 'verified',
    precisionDeg: 6,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 91535224 leisure=pitch sport=american_football;soccer PCA 170.6° (L=114 m W=59 m aspect 2.30) — 3.3° from Bliss on the undirected axis',
      `${BLISS}: Soldier Field = 353.9°`,
      `${VIZUAL}: Bears within 5° of north-south`,
    ],
    notes: 'REFINED from 0°. Same N-S octant; now sourced.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'ford-field',
    orientation: 64,
    confidence: 'estimated',
    precisionDeg: 15,
    method: 'published-source',
    sources: [
      `${BLISS}: Ford Field = 63.7°`,
      'OSM way 110555613 building outline PCA 32.2° — downtown box, not a field polygon (not used as a second source)',
    ],
    notes: 'Fixed roof. No indoor pitch polygon. Single published azimuth. Previous 45° was a NE guess.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'lambeau-field',
    orientation: 0,
    confidence: 'verified',
    precisionDeg: 6,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 145797338 leisure=pitch sport=american_football PCA 174.2° (L=118 m W=63 m aspect 2.21) — 5.8° from due north',
      `${BLISS}: Lambeau Field = 0°`,
      `${VIZUAL}: Packers perfectly north-south`,
    ],
    notes: 'CORRECTED from 45°. 0° is a measured N-S axis. Practice fields (Clarke Hinkle / Don Hutson) sit on a different NE axis and were not used.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'us-bank-stadium',
    orientation: 310,
    confidence: 'estimated',
    precisionDeg: 15,
    method: 'published-source',
    sources: [
      `${BLISS}: U.S. Bank Stadium = 309.9°`,
      'OSM way 743461508 building outline PCA 152.8° — 23° from Bliss; the angular ETFE shell is not the field, so it is not a second source',
    ],
    notes: 'CORRECTED from 88°. 88° was leftover TCF Bank Stadium (Bliss TCF=90), the Vikings\' previous outdoor home. Fixed roof.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'mercedes-benz-stadium',
    orientation: 71,
    confidence: 'verified',
    precisionDeg: 8,
    method: 'published-source',
    sources: [
      `${BLISS}: Mercedes-Benz Stadium = 70.9°`,
      'OSM way 744765351 untagged field-shaped polygon PCA 68.4° (L=108 m W=56 m aspect 2.08) — 2.5° from Bliss',
    ],
    notes: 'CORRECTED from 0°. Georgia Dome (Bliss 90°, vizual-statistix "perfectly E-W") was the previous building and must not be used.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'bank-of-america-stadium',
    orientation: 322,
    confidence: 'verified',
    precisionDeg: 10,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 187011790 leisure=pitch sport=american_football;soccer, 17 m from venue coords, PCA 150.5° — 8.1° from Bliss on the undirected axis',
      `${BLISS}: Bank of America Stadium = 322.4°`,
    ],
    notes: 'CORRECTED from 75°.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'caesars-superdome',
    orientation: 30,
    confidence: 'estimated',
    precisionDeg: 15,
    method: 'published-source',
    sources: [
      `${BLISS}: Mercedes-Benz Superdome = 30° (CSV longitude -90.811111 is a known typo; venue is -90.081. Dilligaf78 NFL-model mirror uses -90.0811)`,
    ],
    notes: 'Fixed roof. Dome outline is circular (OSM way 25890330 aspect 1.01) so PCA is meaningless. Single seating-chart azimuth.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'raymond-james-stadium',
    orientation: 0,
    confidence: 'verified',
    precisionDeg: 6,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 172698720 leisure=pitch sport=american_football, 14 m from venue coords, PCA 6.4°',
      `${BLISS}: Raymond James Stadium = 0°`,
      `${VIZUAL}: Buccaneers perfectly north-south`,
    ],
    notes: '0° is a measured N-S axis, not an unset default.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'state-farm-stadium',
    orientation: 330,
    confidence: 'verified',
    precisionDeg: 8,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 130353352 leisure=pitch name="Cardinals\' Grass Growing Area" PCA 144.0° — the roll-out grass tray, 6° from Bliss on the undirected axis',
      `${BLISS}: State Farm Stadium = 330°`,
    ],
    notes: 'CORRECTED from 0° default. The growing-area pitch is the same rectangle that rolls into the bowl.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'sofi-stadium-rams',
    orientation: 338,
    confidence: 'verified',
    precisionDeg: 8,
    method: 'published-source',
    sources: [
      'OSM way 860635712 SoFi Stadium outline PCA 152.0°',
      `${BLISS}: SoFi Stadium = 338.2°`,
    ],
    notes: 'Same physical field as sofi-stadium-chargers. Previous 90° was leftover E-W.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'levis-stadium',
    orientation: 330,
    confidence: 'verified',
    precisionDeg: 8,
    method: 'published-source',
    sources: [
      'OSM way 357300430 leisure=pitch sport=american_football PCA 158.3°; stadium outline way 296503400 PCA 147.4° — both within 12° of Bliss 150° axis',
      `${BLISS}: Levi's Stadium = 330°`,
      'shadedseats.com Levi\'s: "oriented in a northwest to southeast direction"; noon sun near the south end zone; west suite tower shades, east sideline bakes',
    ],
    notes: 'REFINED from 310°. Same NW-SE octant; 330° matches Bliss + shadedseats.',
    lastReviewed: REVIEWED,
  },
  {
    stadiumId: 'lumen-field',
    orientation: 0,
    confidence: 'verified',
    precisionDeg: 6,
    method: 'osm-polygon-pca',
    sources: [
      'OSM way 163840038 leisure=pitch sport=american_football, 7 m from venue coords, PCA 5.6° (L=118 m W=63 m aspect 2.21)',
      `${BLISS}: CenturyLink Field = 0°`,
      `${VIZUAL}: Seahawks perfectly north-south`,
    ],
    notes: '0° is a measured N-S axis, not an unset default.',
    lastReviewed: REVIEWED,
  },
];
