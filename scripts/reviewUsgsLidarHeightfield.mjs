#!/usr/bin/env node

/**
 * Lock a manual visual interpretation to exact candidate-heightfield and
 * render bytes. This records what the aerial surface does and does not expose;
 * it never converts a visual observation into publishable row geometry.
 */

import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const heightfieldPath = typeof args.heightfield === 'string' ? args.heightfield : null;
const renderPath = typeof args.render === 'string' ? args.render : null;
const decisionPath = typeof args.decision === 'string' ? args.decision : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
if (!heightfieldPath || !renderPath || !decisionPath || !outputPath) {
  console.error('Required: --heightfield=PATH --render=PATH --decision=PATH --output=PATH');
  process.exit(2);
}

async function sha256(path) {
  const digest = createHash('sha256');
  await pipeline(createReadStream(path), new Transform({
    transform(chunk, _encoding, callback) {
      digest.update(chunk);
      callback();
    },
  }));
  return digest.digest('hex');
}

function fingerprint(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

const [heightfieldMarkup, decisionMarkup, heightfieldSha256, renderSha256] = await Promise.all([
  readFile(heightfieldPath, 'utf8'),
  readFile(decisionPath, 'utf8'),
  sha256(heightfieldPath),
  sha256(renderPath),
]);
const heightfield = JSON.parse(heightfieldMarkup);
const decision = JSON.parse(decisionMarkup);
const allowedDecisionKinds = new Set([
  'lidar-heightfield-visual-review-decision',
  'usgs-lidar-heightfield-visual-review-decision',
]);
if (!allowedDecisionKinds.has(decision?.artifactKind)) {
  throw new Error('Decision is not a supported lidar heightfield visual-review decision');
}
if (decision.stadiumId !== heightfield.stadiumId) {
  throw new Error(`Stadium mismatch: ${decision.stadiumId} != ${heightfield.stadiumId}`);
}
if (decision.expectedHeightfieldSha256 !== heightfieldSha256) {
  throw new Error('Heightfield bytes do not match the reviewed decision');
}
if (decision.expectedRenderSha256 !== renderSha256) {
  throw new Error('Rendered image bytes do not match the reviewed decision');
}
const allowedClassifications = new Set([
  'ENCLOSURE_CLOSED_INTERIOR_OCCLUDED',
  'INTERIOR_SURFACES_VISIBLE',
  'INDETERMINATE',
]);
if (!allowedClassifications.has(decision.classification)) {
  throw new Error(`Unsupported review classification: ${decision.classification}`);
}
if (!decision.reviewedOn || !decision.reviewer || !decision.observation) {
  throw new Error('Decision must include reviewedOn, reviewer, and observation');
}

const blockers = [
  'SOURCE_ACCURACY_NOT_VERIFIED',
  'SOURCE_CURRENCY_NOT_VERIFIED',
  'ROW_GEOMETRY_NOT_EXTRACTED',
  'OBSTRUCTION_COMPLETENESS_NOT_VERIFIED',
  'SHADOW_HOLDOUT_NOT_PASSED',
];
if (decision.classification === 'ENCLOSURE_CLOSED_INTERIOR_OCCLUDED') {
  blockers.unshift('INTERIOR_GEOMETRY_OCCLUDED_BY_CLOSED_ENCLOSURE');
}
if (decision.classification === 'INDETERMINATE') {
  blockers.unshift('HEIGHTFIELD_VISUAL_INTERPRETATION_INDETERMINATE');
}

const fingerprintInput = {
  stadiumId: decision.stadiumId,
  heightfieldSha256,
  renderSha256,
  classification: decision.classification,
  observation: decision.observation,
  limitations: decision.limitations,
  reviewedOn: decision.reviewedOn,
  reviewer: decision.reviewer,
};
const artifact = {
  schemaVersion: 1,
  artifactKind: decision.artifactKind === 'lidar-heightfield-visual-review-decision'
    ? 'lidar-heightfield-visual-review'
    : 'usgs-lidar-heightfield-visual-review',
  artifactVersion: `sha256:${fingerprint(fingerprintInput)}`,
  stadiumId: decision.stadiumId,
  reviewedOn: decision.reviewedOn,
  reviewer: decision.reviewer,
  inputs: {
    heightfield: { path: heightfieldPath, sha256: heightfieldSha256 },
    render: { path: renderPath, sha256: renderSha256 },
    sourceFiles: heightfield.source?.files ?? [],
  },
  classification: decision.classification,
  observation: decision.observation,
  limitations: decision.limitations ?? [],
  publication: {
    eligible: false,
    blockers,
  },
};
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  stadiumId: artifact.stadiumId,
  classification: artifact.classification,
  publication: artifact.publication,
}, null, 2));
