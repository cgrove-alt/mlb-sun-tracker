#!/usr/bin/env node

/** Build checksum-bound Fenway standing-room product decisions. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const auditPath = typeof args.audit === 'string' ? args.audit : null;
const renderDirectory = typeof args['render-directory'] === 'string'
  ? args['render-directory']
  : null;
const sourceManifestPath = typeof args['source-manifest'] === 'string'
  ? args['source-manifest']
  : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
if (!auditPath || !renderDirectory || !sourceManifestPath || !outputPath) {
  throw new Error(
    'Required: --audit=PATH --render-directory=PATH --source-manifest=PATH --output=PATH',
  );
}

const sectionIds = [
  'SRLLF',
  'SRL1B',
  'SRL3B',
  'SRLHP',
  'SRLRF',
  'SRSP',
  'SRGM',
  'SRRFB',
  'SRRD',
  'SRRTA',
  'SRRTB',
  'SRP1B',
  'SRP3B',
  'SRCD',
  'SRTRT',
  'SR521',
];
const sourceTextExcerpt = 'Standing Room tickets indicate that you will not have a specific seat associated with your ticket, but there are a number of additional high-top barstools and tables for use on a first-come, first-served basis.';
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const auditBytes = await readFile(auditPath);
const audit = JSON.parse(auditBytes.toString('utf8'));
if (
  audit.artifactKind !== 'venue-blockmap-product-audit'
  || audit.stadiumId !== 'redsox'
) {
  throw new Error('Input is not the expected Red Sox block-map product audit');
}
const unresolvedIds = audit.products
  .filter((product) => product.classification === 'UNRESOLVED_BLOCKMAP_PRODUCT')
  .map((product) => product.sectionId)
  .sort();
if (JSON.stringify(unresolvedIds) !== JSON.stringify([...sectionIds].sort())) {
  throw new Error('Current unresolved product set does not match the reviewed Fenway set');
}

const sourceManifest = JSON.parse(await readFile(sourceManifestPath, 'utf8'));
if (
  sourceManifest.sourceUrl
    !== 'https://www.mlb.com/redsox/tickets/specials/peanut-allergy-friendly'
  || !sourceManifest.output
) {
  throw new Error('Unexpected official Red Sox standing-room source');
}
const sourceBytes = await readFile(sourceManifest.output);
if (sha256(sourceBytes) !== sourceManifest.sha256) {
  throw new Error('Official Red Sox standing-room source hash does not match');
}
if (!sourceBytes.toString('utf8').includes(sourceTextExcerpt)) {
  throw new Error('Official Red Sox standing-room definition is missing');
}

const decisions = [];
for (const sectionId of sectionIds) {
  const lowerSectionId = sectionId.toLowerCase();
  const renderPath = `${renderDirectory}/redsox-3ddv-product-render-${lowerSectionId}.json`;
  const screenshotPath = `${renderDirectory}/redsox-3ddv-product-render-${lowerSectionId}.png`;
  const renderBytes = await readFile(renderPath);
  const render = JSON.parse(renderBytes.toString('utf8'));
  if (
    render.artifactKind !== 'venue-product-rendering-audit'
    || render.stadiumId !== 'redsox'
    || render.sectionId !== sectionId
    || render.blockmapAuditArtifactVersion !== audit.artifactVersion
    || render.blockmapAuditSha256 !== sha256(auditBytes)
    || render.clickedSuggestion !== true
    || !render.exactSuggestionTexts?.includes(`Section ${sectionId}`)
    || !/(?:S\/R|STANDING ROOM)(?:[^A-Z]|$)/i.test(render.visibleText)
  ) {
    throw new Error(`Provider render evidence is incomplete for ${sectionId}`);
  }
  const screenshotBytes = await readFile(screenshotPath);
  if (sha256(screenshotBytes) !== render.screenshotSha256) {
    throw new Error(`Provider screenshot hash does not match for ${sectionId}`);
  }
  const productLabel = render.visibleText
    .replace(/^.*?Section/, 'Section ')
    .replace(/\s+/g, ' ')
    .trim();
  decisions.push({
    sectionId,
    classification: 'STANDING_ROOM_NO_ASSIGNED_ROW',
    acquisitionManifestPath: sourceManifestPath,
    sourceTextExcerpt,
    sourceTextSummary: 'The current official Red Sox page defines a Standing Room ticket as having no specific seat and only first-come access to barstools and tables.',
    rationale: `The live provider renders ${productLabel}, explicitly identifying this exact product as standing room. The current first-party Red Sox definition confirms that a Standing Room ticket has no specific seat. ${sectionId} is outside assigned-row scope, while its metric zone geometry and shade remain blocked.`,
    providerRenderedEvidence: {
      auditPath: renderPath,
      auditSha256: sha256(renderBytes),
      screenshotPath,
      screenshotSha256: sha256(screenshotBytes),
      renderedText: render.visibleText,
      reviewedOn: '2026-08-10',
      reviewer: 'Codex evidence audit',
    },
    providerBlockmapEvidence: {
      auditPath,
      auditSha256: sha256(auditBytes),
      providerSectionId: sectionId,
      mappingRationale: `The current provider block map contains ${sectionId}, and the live exact-code selection renders ${productLabel}.`,
      reviewedOn: '2026-08-10',
      reviewer: 'Codex evidence audit',
    },
  });
}

const output = {
  schemaVersion: 2,
  artifactKind: 'venue-blockmap-product-semantics-decisions',
  stadiumId: 'redsox',
  decisions,
};
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  stadiumId: output.stadiumId,
  decisions: decisions.length,
  officialSourceArtifactVersion: sourceManifest.artifactVersion,
  reviewedBlockmapArtifactVersion: audit.artifactVersion,
}, null, 2));
