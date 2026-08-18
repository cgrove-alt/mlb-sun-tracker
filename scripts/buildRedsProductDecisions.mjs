#!/usr/bin/env node

/** Build checksum-bound Great American Ball Park non-row product decisions. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const auditPath = typeof args.audit === 'string' ? args.audit : null;
const guideManifestPath = typeof args['guide-manifest'] === 'string'
  ? args['guide-manifest']
  : null;
const new2026ManifestPath = typeof args['new-2026-manifest'] === 'string'
  ? args['new-2026-manifest']
  : null;
const hospitalityManifestPath = typeof args['hospitality-manifest'] === 'string'
  ? args['hospitality-manifest']
  : null;
const cambriaManifestPath = typeof args['cambria-manifest'] === 'string'
  ? args['cambria-manifest']
  : null;
const outfieldManifestPath = typeof args['outfield-manifest'] === 'string'
  ? args['outfield-manifest']
  : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
if (
  !auditPath
  || !guideManifestPath
  || !new2026ManifestPath
  || !hospitalityManifestPath
  || !cambriaManifestPath
  || !outfieldManifestPath
  || !outputPath
) {
  throw new Error(
    'Required: --audit=PATH --guide-manifest=PATH --new-2026-manifest=PATH '
      + '--hospitality-manifest=PATH --cambria-manifest=PATH '
      + '--outfield-manifest=PATH --output=PATH',
  );
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const auditBytes = await readFile(auditPath);
const audit = JSON.parse(auditBytes.toString('utf8'));
if (audit.artifactKind !== 'venue-blockmap-product-audit' || audit.stadiumId !== 'reds') {
  throw new Error('Input is not the expected Reds block-map product audit');
}
const expectedIds = [
  'CFPORCH',
  'SRO',
  'RIVERDECK',
  'CFDECK',
  'PARTYA',
  'PARTYB',
  'HANDLEGA',
  'EXESS',
  'LFSUPER',
  'NORCOM',
  'SKYBAR',
  'CAMBRIA',
  'FRONTGATE',
  'STE24',
  'STE8',
  'STE13',
  'DISTRICT',
  'MACHPATIO',
  'HRSUITE',
  'PWRPATIO',
];
const unresolvedIds = audit.products
  .filter((product) => product.classification === 'UNRESOLVED_BLOCKMAP_PRODUCT')
  .map((product) => product.sectionId)
  .sort();
if (JSON.stringify(unresolvedIds) !== JSON.stringify([...expectedIds].sort())) {
  throw new Error('Current unresolved product set does not match the reviewed Reds set');
}

const sourceBytesByManifest = new Map();
const loadOfficialSource = async (manifestPath, expectedExcerpts) => {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (
    manifest.artifactKind !== 'official-mlb-page-acquisition'
    || !manifest.sourceUrl?.startsWith('https://www.mlb.com/reds/')
    || !manifest.output
  ) {
    throw new Error(`Unexpected official Reds source ${manifestPath}`);
  }
  const bytes = await readFile(manifest.output);
  if (sha256(bytes) !== manifest.sha256) {
    throw new Error(`Official Reds source hash does not match for ${manifestPath}`);
  }
  const sourceText = bytes.toString('utf8');
  for (const excerpt of expectedExcerpts) {
    if (!sourceText.includes(excerpt)) {
      throw new Error(`Official Reds source excerpt is absent: ${excerpt}`);
    }
  }
  sourceBytesByManifest.set(manifestPath, bytes);
  return manifest;
};

const excerpts = {
  centerFieldPorch:
    'Center Field Porch presented by Champion Window will be an indoor hospitality space featuring a suite style layout',
  standingRoom: 'standing room access to the general public',
  riverboat: 'Seating is unassigned when sold to multiple groups',
  centerFieldDeck: 'The Center-Field Pavilion, located in the Center-Field Batter’s Eye',
  partyDecks: 'The Party Decks, located down the right-field line past the Champions Club',
  handlebar:
    'Access Passes (starting at $85; no assigned seat and live view not guaranteed).',
  executiveSuite: 'The Executive Super Suite is the perfect space for business and fun!',
  leftFieldSuite: 'The Left Field Super Suite (Fujitec Super Suite)',
  outfieldSuite: 'OUTFIELD SUPER SUITE',
  norcomSlug: 'data-slug="norcom-2-311961182"',
  skybar: 'part of The Fioptics District is the altafiber Connections SkyBar',
  cambria: 'CLUB CAMBRIA SUPER SUITE',
  homePlateSuite: 'The Home Plate Super Suite presented by Turfway Park',
  frontgate: 'The Frontgate Outdoor Luxury Suite',
  suite24: '#24 (Tony Pérez)',
  suite8: '#8 (Joe Morgan)',
  suite13: '#13 (David Concepción)',
  district: 'Seating in The Fioptics District allows exclusive admittance to The Fioptics District Rooftop above the GigaBar.',
  machinePatio: 'The Machine Room Patio, located down the left-field line',
  privateSuites: 'PRIVATE SUITES - GROUPS OF 16-99',
  powerPatio: 'The Power Alley Patio, located in center field just above the Reds’ bullpen',
};

await loadOfficialSource(guideManifestPath, [
  excerpts.standingRoom,
  excerpts.riverboat,
  excerpts.centerFieldDeck,
  excerpts.partyDecks,
  excerpts.handlebar,
  excerpts.executiveSuite,
  excerpts.leftFieldSuite,
  excerpts.skybar,
  excerpts.homePlateSuite,
  excerpts.frontgate,
  excerpts.suite24,
  excerpts.suite8,
  excerpts.suite13,
  excerpts.district,
  excerpts.machinePatio,
  excerpts.powerPatio,
]);
await loadOfficialSource(new2026ManifestPath, [excerpts.centerFieldPorch]);
await loadOfficialSource(hospitalityManifestPath, [
  excerpts.privateSuites,
  excerpts.outfieldSuite,
  excerpts.norcomSlug,
]);
await loadOfficialSource(cambriaManifestPath, [excerpts.cambria]);
await loadOfficialSource(outfieldManifestPath, [excerpts.outfieldSuite]);

const blockmapEvidence = (sectionId, mappingRationale) => ({
  auditPath,
  auditSha256: sha256(auditBytes),
  providerSectionId: sectionId,
  mappingRationale,
  reviewedOn: '2026-08-10',
  reviewer: 'Codex evidence audit',
});
const decision = ({
  sectionId,
  classification = 'HOSPITALITY_ZONE_NO_ASSIGNED_ROW',
  acquisitionManifestPath = guideManifestPath,
  sourceTextExcerpt,
  sourceTextSummary,
  rationale,
  mappingRationale,
  supplementalOfficialPageEvidence,
}) => ({
  sectionId,
  classification,
  acquisitionManifestPath,
  sourceTextExcerpt,
  sourceTextSummary,
  rationale,
  ...(supplementalOfficialPageEvidence ? { supplementalOfficialPageEvidence } : {}),
  providerBlockmapEvidence: blockmapEvidence(sectionId, mappingRationale),
});

const decisions = [
  decision({
    sectionId: 'CFPORCH',
    acquisitionManifestPath: new2026ManifestPath,
    sourceTextExcerpt: excerpts.centerFieldPorch,
    sourceTextSummary: 'The official 2026 Reds release defines the Center Field Porch as a suite-style indoor hospitality space.',
    rationale: 'The exact CFPORCH provider code contracts Center Field Porch, and the current official release uses that name for a hospitality space. This broad hospitality product is outside assigned-row scope. Its metric zone and seat geometry and shade remain blocked.',
    mappingRationale: 'The current provider contains the exact CFPORCH product added for the official 2026 Center Field Porch, while its direct row manifest returns 403.',
  }),
  decision({
    sectionId: 'SRO',
    classification: 'STANDING_ROOM_NO_ASSIGNED_ROW',
    sourceTextExcerpt: excerpts.standingRoom,
    sourceTextSummary: 'The current official guide describes public standing-room access at Great American Ball Park.',
    rationale: 'SRO is the provider abbreviation for standing room, and the official guide confirms that the ballpark sells standing-room access. SRO has no assigned row. Its metric standing-zone geometry and shade remain blocked.',
    mappingRationale: 'The exact provider product is SRO, the standard standing-room abbreviation, and its direct row manifest returns 403.',
  }),
  decision({
    sectionId: 'RIVERDECK',
    sourceTextExcerpt: excerpts.riverboat,
    sourceTextSummary: 'The current official guide says Riverboat Deck seating is unassigned when the space is shared.',
    rationale: 'The exact RIVERDECK code maps directly to the official Riverboat Deck name. The official guide classifies its shared seating as unassigned, so the broad deck product is outside assigned-row scope. Its metric zone and seat geometry and shade remain blocked.',
    mappingRationale: 'The provider product name directly contracts Riverboat Deck and its bounds overlap the manifest-backed PILOTHOUSE area that remains separately preserved.',
  }),
  decision({
    sectionId: 'CFDECK',
    sourceTextExcerpt: excerpts.centerFieldDeck,
    sourceTextSummary: 'The current official guide defines the Center-Field Pavilion and connected Bullpen Decks as a hospitality venue.',
    rationale: 'The CFDECK code uses the Center Field and Deck tokens and occupies the center-field provider footprint beside PILOTHOUSE, section 101, and PWRPATIO. The current official guide defines the Center-Field Pavilion and connected decks as a flexible hospitality venue. CFDECK is a broad hospitality product outside assigned-row scope, while its metric zone and seat geometry and shade remain blocked.',
    mappingRationale: 'The provider map places CFDECK in the center-field hospitality footprint and separately preserves the assigned rows in section 101 and PILOTHOUSE.',
  }),
  ...['PARTYA', 'PARTYB'].map((sectionId) => decision({
    sectionId,
    sourceTextExcerpt: excerpts.partyDecks,
    sourceTextSummary: 'The current official guide sells the two Party Decks as covered group hospitality spaces.',
    rationale: `The ${sectionId} code is one member of the provider's A and B Party Deck pair, matching the official plural Party Decks product. The broad deck product is outside assigned-row scope, while adjacent numbered assigned-row sections remain preserved. Its metric zone and seat geometry and shade remain blocked.`,
    mappingRationale: `The provider contains the exact ${sectionId} product within the two-product PARTYA and PARTYB cohort, while its direct row manifest returns 403.`,
  })),
  decision({
    sectionId: 'HANDLEGA',
    classification: 'GENERAL_ADMISSION_NO_ASSIGNED_ROW',
    sourceTextExcerpt: excerpts.handlebar,
    sourceTextSummary: 'The current official guide states that Handlebar Access Passes have no assigned seat.',
    rationale: 'The HANDLEGA code combines the Handlebar name with the GA token, and the official guide defines Handlebar Access Passes as having no assigned seat. HANDLEGA is outside assigned-row scope. Its metric access-zone geometry and shade remain blocked.',
    mappingRationale: 'The exact HANDLEGA provider product overlaps section 138 and BUDBLC, whose assigned rows remain separately preserved.',
  }),
  decision({
    sectionId: 'EXESS',
    sourceTextExcerpt: excerpts.executiveSuite,
    sourceTextSummary: 'The current official guide identifies the Executive Super Suite as a group hospitality space.',
    rationale: 'EXESS is the direct contraction of Executive Super Suite. The provider product represents the suite hospitality zone rather than a manifest-backed assigned-row section. Its metric zone and seat geometry and shade remain blocked.',
    mappingRationale: 'The provider contains the exact EXESS suite product in the left-field suite footprint, while its direct row manifest returns 403.',
  }),
  decision({
    sectionId: 'LFSUPER',
    sourceTextExcerpt: excerpts.leftFieldSuite,
    sourceTextSummary: 'The current official guide identifies the Left Field Super Suite as a private suite hospitality space.',
    rationale: 'LFSUPER is the direct contraction of Left Field Super Suite. The provider product is a broad suite zone outside assigned-row scope. Its metric zone and seat geometry and shade remain blocked.',
    mappingRationale: 'The provider places LFSUPER in the left-field suite footprint near sections 110 through 112, consistent with the official location.',
  }),
  decision({
    sectionId: 'NORCOM',
    acquisitionManifestPath: hospitalityManifestPath,
    sourceTextExcerpt: excerpts.norcomSlug,
    sourceTextSummary: 'The current official hospitality page uses a NORCOM image slug inside the Outfield Super Suite card.',
    rationale: 'The exact NORCOM provider code and the current official page NORCOM asset slug tie this product to the Outfield Super Suite card. The current Outfield Super Suite page confirms a private group suite down the left-field line. NORCOM is a broad hospitality zone outside assigned-row scope. Its metric zone and seat geometry and shade remain blocked.',
    supplementalOfficialPageEvidence: {
      acquisitionManifestPath: outfieldManifestPath,
      sourceTextExcerpt: excerpts.outfieldSuite,
      sourceTextSummary: 'The current official Reds page sells the Outfield Super Suite as a group hospitality product.',
    },
    mappingRationale: 'The provider places NORCOM down the left-field line near sections 109 through 111, matching the current Outfield Super Suite location.',
  }),
  decision({
    sectionId: 'SKYBAR',
    sourceTextExcerpt: excerpts.skybar,
    sourceTextSummary: 'The current official guide defines the Connections SkyBar as a private group area within the Fioptics District.',
    rationale: 'The exact SKYBAR code maps directly to the official SkyBar name. It is a private hospitality zone outside assigned-row scope. Its metric zone and seat geometry and shade remain blocked.',
    mappingRationale: 'The provider SKYBAR product lies within and overlaps the broader DISTRICT product, matching the current official relationship.',
  }),
  decision({
    sectionId: 'CAMBRIA',
    acquisitionManifestPath: cambriaManifestPath,
    sourceTextExcerpt: excerpts.cambria,
    sourceTextSummary: 'The official Reds Cambria route still identifies Club Cambria Super Suite.',
    rationale: 'The exact CAMBRIA provider code matches the official Club Cambria Super Suite route. The current guide now identifies the behind-home-plate product as the Home Plate Super Suite, confirming that it remains a suite hospitality space. CAMBRIA is outside assigned-row scope. Its metric zone and seat geometry and shade remain blocked.',
    supplementalOfficialPageEvidence: {
      acquisitionManifestPath: guideManifestPath,
      sourceTextExcerpt: excerpts.homePlateSuite,
      sourceTextSummary: 'The current 2026 guide identifies the behind-home-plate hospitality space as the Home Plate Super Suite.',
    },
    mappingRationale: 'The provider contains the exact legacy sponsor code CAMBRIA, while its direct row manifest returns 403.',
  }),
  decision({
    sectionId: 'FRONTGATE',
    sourceTextExcerpt: excerpts.frontgate,
    sourceTextSummary: 'The current official guide identifies the Frontgate Outdoor Luxury Suite as a private hospitality space.',
    rationale: 'The exact FRONTGATE code maps directly to the official Frontgate Outdoor Luxury Suite name. It is a broad hospitality product outside assigned-row scope. Its metric zone and seat geometry and shade remain blocked.',
    mappingRationale: 'The provider contains the exact FRONTGATE product near home plate and the press-level suites, consistent with the official location.',
  }),
  ...[
    ['STE24', excerpts.suite24, '24'],
    ['STE8', excerpts.suite8, '8'],
    ['STE13', excerpts.suite13, '13'],
  ].map(([sectionId, sourceTextExcerpt, suiteNumber]) => decision({
    sectionId,
    sourceTextExcerpt,
    sourceTextSummary: `The current official guide identifies Triple Play Suite ${suiteNumber} by number.`,
    rationale: `The exact ${sectionId} provider code maps to the official Triple Play Suite ${suiteNumber}. It is a suite hospitality product outside assigned-row scope. Its metric zone and seat geometry and shade remain blocked.`,
    mappingRationale: `The provider contains the exact ${sectionId} product within the three-product STE8, STE13, and STE24 cohort listed by the official guide.`,
  })),
  decision({
    sectionId: 'DISTRICT',
    sourceTextExcerpt: excerpts.district,
    sourceTextSummary: 'The current official guide defines the Fioptics District as a seating-access hospitality area with a rooftop patio and private SkyBar.',
    rationale: 'The broad DISTRICT provider path spans several independently manifest-backed numbered sections and the SKYBAR zone. Those assigned rows remain preserved separately. DISTRICT itself represents the shared hospitality and access zone, so it is outside assigned-row scope. Its metric zone and shade remain blocked.',
    mappingRationale: 'The provider DISTRICT bounds overlap sections 108, 109, 411, 509, and 510 plus SKYBAR, matching a broad access zone rather than one assigned-row section.',
  }),
  decision({
    sectionId: 'MACHPATIO',
    sourceTextExcerpt: excerpts.machinePatio,
    sourceTextSummary: 'The current official guide defines the Machine Room Patio as a group patio and seating area.',
    rationale: 'MACHPATIO is the direct contraction of Machine Room Patio. The exact provider product is a broad hospitality zone outside assigned-row scope. Its metric zone and seat geometry and shade remain blocked.',
    mappingRationale: 'The provider places MACHPATIO down the left-field line near sections 107 and 406, consistent with the current official location.',
  }),
  decision({
    sectionId: 'HRSUITE',
    acquisitionManifestPath: hospitalityManifestPath,
    sourceTextExcerpt: excerpts.privateSuites,
    sourceTextSummary: 'The current official hospitality page sells named private suites by group capacity rather than as numbered row sections.',
    rationale: 'The exact HRSUITE provider identifier contains the unambiguous SUITE token and is a broad block-map product without a row manifest. The current official hospitality page categorizes these products as private group suites. HRSUITE is outside assigned-row scope, while its exact identity, metric zone and seat geometry and shade remain blocked.',
    mappingRationale: 'The provider contains the exact HRSUITE suite product in the suite-level footprint, while its direct row manifest returns 403. No stronger current sponsor-name mapping is asserted.',
  }),
  decision({
    sectionId: 'PWRPATIO',
    sourceTextExcerpt: excerpts.powerPatio,
    sourceTextSummary: 'The current official guide identifies Power Alley Patio as a partially covered group patio in center field.',
    rationale: 'PWRPATIO is the direct contraction of Power Alley Patio. The exact provider product is a broad hospitality zone outside assigned-row scope. Its metric zone and seat geometry and shade remain blocked.',
    mappingRationale: 'The provider places PWRPATIO in center field beside CFDECK and section 101, consistent with the current official location.',
  }),
];

if (decisions.length !== expectedIds.length) {
  throw new Error(`Expected ${expectedIds.length} decisions, found ${decisions.length}`);
}
const decisionIds = decisions.map((item) => item.sectionId).sort();
if (JSON.stringify(decisionIds) !== JSON.stringify([...expectedIds].sort())) {
  throw new Error('Generated decisions do not cover the exact unresolved product set');
}

const output = {
  schemaVersion: 2,
  artifactKind: 'venue-blockmap-product-semantics-decisions',
  stadiumId: 'reds',
  decisions,
};
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  stadiumId: output.stadiumId,
  decisions: decisions.length,
  reviewedBlockmapArtifactVersion: audit.artifactVersion,
}, null, 2));
