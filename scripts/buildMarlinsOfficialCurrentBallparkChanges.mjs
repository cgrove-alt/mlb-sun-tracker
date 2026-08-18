#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

function option(name, fallback) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length)
    ?? fallback;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function canonicalJson(value) {
  if (Array.isArray(value)) return value.map(canonicalJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, canonicalJson(value[key])]),
    );
  }
  return value;
}

async function readLockedPage(id, pagePath, url, requiredText) {
  const resolvedPath = path.resolve(pagePath);
  const bytes = await readFile(resolvedPath);
  const html = bytes.toString('utf8');
  for (const text of requiredText) {
    if (!html.includes(text)) {
      throw new Error(`${id}: required official-page text missing: ${JSON.stringify(text)}`);
    }
  }
  return {
    id,
    path: path.relative(process.cwd(), resolvedPath),
    url,
    sha256: sha256(bytes),
    requiredText,
  };
}

const sourceDirectory = option(
  'source-dir',
  'tmp/lidar/marlins-official-current-ballpark-changes-2026',
);
const output = option(
  'output',
  'tmp/lidar/marlins-official-current-ballpark-changes-2026/review.json',
);

const pages = await Promise.all([
  readLockedPage(
    'pnc-club-expansion-2025',
    path.join(sourceDirectory, 'pnc-club-expansion-2025.html'),
    'https://www.mlb.com/marlins/press-release/press-release-pnc-bank-extends-multi-year-sponsorship-as-official-bank-of-the-miami-marlins',
    [
      'March 26th, 2025',
      'The 2025 season marks the debut of the 120-seat expansion to the PNC Club',
      'expansion of the PNC Club seating area behind home plate',
    ],
  ),
  readLockedPage(
    'new-offerings-2026',
    path.join(sourceDirectory, 'new-offerings-2026.html'),
    'https://www.mlb.com/marlins/news/marlins-new-offerings-at-loandepot-park-for-2026',
    [
      'April 9th, 2026',
      'the new area can be found in Section 228 of the Legends Level',
      'replaced them with teal ones next to the right-field foul pole',
    ],
  ),
  readLockedPage(
    'bullpen-bar-grill-2026',
    path.join(sourceDirectory, 'bullpen-bar-grill-2026.html'),
    'https://www.mlb.com/marlins/ballpark/the-bullpen-bar-and-grill',
    [
      'A new sports lounge is making its debut at loanDepot park this season.',
      'the upgraded seating at Bullpen Bar and Grill',
      'Located directly in left field',
    ],
  ),
  readLockedPage(
    'ballpark-guide-2026',
    path.join(sourceDirectory, 'ballpark-guide-2026.html'),
    'https://www.mlb.com/news/featured/loandepot-park-guide-capacity-seating-chart-parking-and-more',
    [
      'March 31, 2026',
      'newly expanded Marlins Museum on the Legends Level (fifth floor) behind home plate',
      'Where the home run sculpture used to sit now stands the Dominican Republic Beach Club',
    ],
  ),
]);

const changes = [
  {
    changeId: 'pnc-club-120-seat-expansion-2025',
    effectiveSeason: 2025,
    location: 'behind home plate',
    officialFinding: 'The club states that a 120-seat PNC Club expansion debuted for the 2025 season.',
    geometryRelevance: 'assigned seating topology and local row envelope changed',
    currentMetricGeometryResolved: false,
    currentAsBuiltResolved: false,
    completeShapeResolved: false,
    sourcePageIds: ['pnc-club-expansion-2025'],
    blockers: [
      'EXPANDED_SEAT_IDENTIFIERS_AND_ROW_TOPOLOGY_NOT_PUBLISHED',
      'CURRENT_METRIC_SEAT_AND_TREAD_COORDINATES_NOT_PUBLISHED',
      'CURRENT_AS_BUILT_DRAWINGS_NOT_ACQUIRED',
    ],
  },
  {
    changeId: 'bullpen-bar-upgraded-seating-2026',
    effectiveSeason: 2026,
    location: 'left field adjacent to the Marlins bullpen',
    officialFinding: 'The current club page describes upgraded seating at a new Bullpen Bar and Grill sports lounge.',
    geometryRelevance: 'assigned seating and nearby obstruction geometry may have changed',
    currentMetricGeometryResolved: false,
    currentAsBuiltResolved: false,
    completeShapeResolved: false,
    sourcePageIds: ['bullpen-bar-grill-2026', 'ballpark-guide-2026'],
    blockers: [
      'UPGRADED_SEAT_IDENTIFIERS_AND_ROW_TOPOLOGY_NOT_PUBLISHED',
      'BAR_AND_SEATING_METRIC_GEOMETRY_NOT_PUBLISHED',
      'CURRENT_AS_BUILT_DRAWINGS_NOT_ACQUIRED',
    ],
  },
  {
    changeId: 'kids-zone-relocated-to-section-228-2026',
    effectiveSeason: 2026,
    location: 'Section 228 on the Legends Level',
    officialFinding: 'The club states that the Kids Zone moved from behind the center-field batter eye to Section 228.',
    geometryRelevance: 'fixtures, railing use, and adjacent occupancy changed',
    currentMetricGeometryResolved: false,
    currentAsBuiltResolved: false,
    completeShapeResolved: false,
    sourcePageIds: ['new-offerings-2026', 'ballpark-guide-2026'],
    blockers: [
      'SECTION_228_FIXTURE_FOOTPRINTS_NOT_PUBLISHED',
      'RAILING_AND_OVERHANG_EFFECTS_NOT_RESOLVED',
      'CURRENT_AS_BUILT_DRAWINGS_NOT_ACQUIRED',
    ],
  },
  {
    changeId: 'world-series-banners-relocated-2026',
    effectiveSeason: 2026,
    location: 'next to the right-field foul pole',
    officialFinding: 'The club states that transparent left-field World Series banners were removed and teal banners installed next to the right-field foul pole.',
    geometryRelevance: 'opaque suspended or mounted shade obstruction changed location and material appearance',
    currentMetricGeometryResolved: false,
    currentAsBuiltResolved: false,
    completeShapeResolved: false,
    sourcePageIds: ['new-offerings-2026'],
    blockers: [
      'BANNER_DIMENSIONS_AND_THICKNESS_NOT_PUBLISHED',
      'BANNER_MOUNT_COORDINATES_NOT_PUBLISHED',
      'BANNER_SHADOW_OPACITY_NOT_MEASURED',
    ],
  },
  {
    changeId: 'expanded-marlins-museum-2025',
    effectiveSeason: 2025,
    location: 'Legends Level behind home plate',
    officialFinding: 'The 2026 MLB ballpark guide states that the expanded Marlins Museum debuted in 2025.',
    geometryRelevance: 'interior and concourse fixtures changed near the seating bowl',
    currentMetricGeometryResolved: false,
    currentAsBuiltResolved: false,
    completeShapeResolved: false,
    sourcePageIds: ['ballpark-guide-2026'],
    blockers: [
      'EXPANDED_MUSEUM_FOOTPRINT_NOT_PUBLISHED',
      'SEATING_BOWL_EFFECT_NOT_RESOLVED',
      'CURRENT_AS_BUILT_DRAWINGS_NOT_ACQUIRED',
    ],
  },
  {
    changeId: 'dominican-republic-beach-club-current',
    effectiveSeason: null,
    location: 'former home-run-sculpture location in left-center field',
    officialFinding: 'The 2026 MLB ballpark guide identifies a current group deck where the home-run sculpture used to sit.',
    geometryRelevance: 'deck, railing, furnishing, and nearby obstruction geometry differ from the original design',
    currentMetricGeometryResolved: false,
    currentAsBuiltResolved: false,
    completeShapeResolved: false,
    sourcePageIds: ['ballpark-guide-2026'],
    blockers: [
      'CURRENT_DECK_METRIC_GEOMETRY_NOT_PUBLISHED',
      'RAILING_AND_FURNISHING_OBSTRUCTIONS_NOT_RESOLVED',
      'CURRENT_AS_BUILT_DRAWINGS_NOT_ACQUIRED',
    ],
  },
];

const stable = {
  analysisVersion: 'marlins-official-current-ballpark-changes-v1',
  stadiumId: 'marlins',
  reviewedOn: '2026-08-11',
  sourcePages: pages,
  changes,
  summary: {
    officialPageCount: pages.length,
    currentChangeCount: changes.length,
    seatingTopologyChangeCount: changes.filter((change) =>
      change.geometryRelevance.includes('seating')).length,
    obstructionRelevantChangeCount: changes.filter((change) =>
      change.geometryRelevance.includes('obstruction')).length,
    currentMetricGeometryResolvedCount: changes.filter((change) =>
      change.currentMetricGeometryResolved).length,
  },
  geometryBoundary: {
    establishesOfficialClubCurrentChangeInventoryPartial: true,
    establishesCompleteCurrentChangeInventory: false,
    establishesCurrentMetricGeometry: false,
    establishesCurrentAsBuiltGeometry: false,
    establishesCompleteCurrentObstructionGeometry: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'OFFICIAL_CURRENT_CHANGES_HAVE_NO_METRIC_GEOMETRY',
      'CURRENT_AS_BUILT_DRAWINGS_NOT_ACQUIRED',
      'COMPLETE_CURRENT_CHANGE_INVENTORY_NOT_ESTABLISHED',
      'CURRENT_OBSTRUCTION_GEOMETRY_NOT_COMPLETE',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};

const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-official-current-ballpark-changes-review',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};

const outputPath = path.resolve(output);
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  summary: artifact.summary,
  publication: artifact.publication,
}, null, 2));
