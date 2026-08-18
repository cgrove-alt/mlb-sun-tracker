#!/usr/bin/env node

/** Build checksum-bound Sutter Health Park non-row product decisions. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const auditPath = typeof args.audit === 'string' ? args.audit : null;
const featureManifestPath = typeof args['feature-manifest'] === 'string'
  ? args['feature-manifest']
  : null;
const guideManifestPath = typeof args['guide-manifest'] === 'string'
  ? args['guide-manifest']
  : null;
const hospitalityManifestPath = typeof args['hospitality-manifest'] === 'string'
  ? args['hospitality-manifest']
  : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
if (
  !auditPath
  || !featureManifestPath
  || !guideManifestPath
  || !hospitalityManifestPath
  || !outputPath
) {
  throw new Error(
    'Required: --audit=PATH --feature-manifest=PATH --guide-manifest=PATH '
      + '--hospitality-manifest=PATH --output=PATH',
  );
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const suiteIds = Array.from({ length: 36 }, (_, index) => `STE${index + 1}`);
const lawnIds = Array.from({ length: 4 }, (_, index) => `LAWN${index + 1}`);
const expectedIds = [...suiteIds, ...lawnIds, 'ROOF'];
const suiteCountExcerpt = 'On top of 36 suites';
const suiteConfigurationExcerpt = 'Indoor and outdoor seating including a mix of exterior stadium style balcony seats and table bar-height seats';
const lawnExcerpt = 'Seating on Toyota Home Run Hill is General Admission. Fans holding tickets for the lawn are encouraged to arrive early for the best seating.';
const rooftopExcerpt = 'Private rooftop deck in home run territory';

const auditBytes = await readFile(auditPath);
const audit = JSON.parse(auditBytes.toString('utf8'));
if (
  audit.artifactKind !== 'venue-blockmap-product-audit'
  || audit.stadiumId !== 'athletics'
) {
  throw new Error('Input is not the expected Athletics block-map product audit');
}
const unresolvedIds = audit.products
  .filter((product) => product.classification === 'UNRESOLVED_BLOCKMAP_PRODUCT')
  .map((product) => product.sectionId)
  .sort();
if (JSON.stringify(unresolvedIds) !== JSON.stringify([...expectedIds].sort())) {
  throw new Error('Current unresolved product set does not match the reviewed Athletics set');
}

const loadOfficialSource = async (manifestPath, expectedExcerpt) => {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (
    manifest.artifactKind !== 'official-mlb-page-acquisition'
    || !manifest.sourceUrl?.startsWith('https://www.mlb.com/athletics/')
    || !manifest.output
  ) {
    throw new Error(`Unexpected official Athletics source ${manifestPath}`);
  }
  const bytes = await readFile(manifest.output);
  if (sha256(bytes) !== manifest.sha256) {
    throw new Error(`Official Athletics source hash does not match for ${manifestPath}`);
  }
  if (!bytes.toString('utf8').includes(expectedExcerpt)) {
    throw new Error(`Official Athletics source excerpt is absent for ${manifestPath}`);
  }
  return manifest;
};

await loadOfficialSource(featureManifestPath, suiteCountExcerpt);
await loadOfficialSource(guideManifestPath, lawnExcerpt);
await loadOfficialSource(hospitalityManifestPath, suiteConfigurationExcerpt);
await loadOfficialSource(hospitalityManifestPath, rooftopExcerpt);

const blockmapEvidence = (sectionId, mappingRationale) => ({
  auditPath,
  auditSha256: sha256(auditBytes),
  providerSectionId: sectionId,
  mappingRationale,
  reviewedOn: '2026-08-10',
  reviewer: 'Codex evidence audit',
});
const decisions = suiteIds.map((sectionId) => ({
  sectionId,
  classification: 'HOSPITALITY_ZONE_NO_ASSIGNED_ROW',
  acquisitionManifestPath: featureManifestPath,
  sourceTextExcerpt: suiteCountExcerpt,
  sourceTextSummary: 'The official April 2026 Athletics ballpark feature states that Sutter Health Park has exactly 36 suites.',
  rationale: `The provider's unresolved suite-like cohort is exactly the exhaustive sequence STE1 through STE36, matching the official count of 36 suites. This count-and-sequence match is an inference that ${sectionId} is a suite-level hospitality product, not a claim of measured seating geometry. The official suite page sells tickets by suite and describes a mix of balcony and bar-height seats. ${sectionId} is outside assigned-row scope, while its metric zone and seat geometry and shade remain blocked.`,
  supplementalOfficialPageEvidence: {
    acquisitionManifestPath: hospitalityManifestPath,
    sourceTextExcerpt: suiteConfigurationExcerpt,
    sourceTextSummary: 'The current official Athletics premium page describes each suite as mixed balcony and bar-height seating rather than a numbered row product.',
  },
  providerBlockmapEvidence: blockmapEvidence(
    sectionId,
    `The current provider contains ${sectionId} within the complete sequential STE1 through STE36 cohort, and its direct row manifest returns 403.`,
  ),
}));

for (const sectionId of lawnIds) {
  decisions.push({
    sectionId,
    classification: 'GENERAL_ADMISSION_NO_ASSIGNED_ROW',
    acquisitionManifestPath: guideManifestPath,
    sourceTextExcerpt: lawnExcerpt,
    sourceTextSummary: 'The current official Athletics ballpark guide defines Toyota Home Run Hill lawn seating as General Admission.',
    rationale: `The provider's exact ${sectionId} product belongs to the four-part LAWN cohort, and the official guide defines the ballpark lawn as General Admission. ${sectionId} has no assigned row, while its metric lawn-zone geometry and shade remain blocked.`,
    providerBlockmapEvidence: blockmapEvidence(
      sectionId,
      `The current provider contains the exact ${sectionId} lawn product, while its direct row manifest returns 403.`,
    ),
  });
}

decisions.push({
  sectionId: 'ROOF',
  classification: 'HOSPITALITY_ZONE_NO_ASSIGNED_ROW',
  acquisitionManifestPath: hospitalityManifestPath,
  sourceTextExcerpt: rooftopExcerpt,
  sourceTextSummary: 'The current official Athletics premium page describes The Rooftop as a private hospitality deck in home-run territory.',
  rationale: 'The provider contains the exact ROOF product and the official club page sells The Rooftop as a private group deck with a mixture of fixed stadium and patio-style seating. ROOF is a hospitality-zone product rather than an assigned-row section. Its metric zone and seat geometry and shade remain blocked.',
  providerBlockmapEvidence: blockmapEvidence(
    'ROOF',
    'The current provider contains the exact ROOF product, while its direct row manifest returns 403.',
  ),
});

const output = {
  schemaVersion: 2,
  artifactKind: 'venue-blockmap-product-semantics-decisions',
  stadiumId: 'athletics',
  decisions,
};
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  stadiumId: output.stadiumId,
  decisions: decisions.length,
  suites: suiteIds.length,
  lawns: lawnIds.length,
  reviewedBlockmapArtifactVersion: audit.artifactVersion,
}, null, 2));
