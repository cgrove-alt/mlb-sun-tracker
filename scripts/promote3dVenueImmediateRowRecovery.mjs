#!/usr/bin/env node

/** Promote a passed immediate-row extrapolation audit as explicit modeled recovery. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const auditPath = typeof args.audit === 'string' ? args.audit : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
if (!auditPath || !outputPath) {
  throw new Error('Required: --audit=PATH --output=PATH');
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const auditBytes = await readFile(auditPath);
const audit = JSON.parse(auditBytes.toString('utf8'));
if (audit.artifactKind !== 'venue-immediate-row-extrapolation-audit') {
  throw new Error('Input has the wrong immediate-row audit kind');
}
const uncertainty = audit.validation?.uncertainty;
if (
  uncertainty?.gatePassed !== true
  || uncertainty.maximumAllowedM !== 0.3048
  || uncertainty.horizontalM > uncertainty.maximumAllowedM
  || uncertainty.verticalM > uncertainty.maximumAllowedM
  || audit.validation.comparableSectionCount < 10
  || audit.validation.comparableHoldoutAnchorCount < 30
) {
  throw new Error('Immediate-row audit did not pass the required uncertainty gate');
}
const inputs = [];
for (const input of Object.values(audit.inputs ?? {})) {
  if (!input?.path || !input.sha256) throw new Error('Audit input provenance is incomplete');
  const bytes = await readFile(input.path);
  if (sha256(bytes) !== input.sha256) {
    throw new Error(`Audit input hash does not match ${input.path}`);
  }
  inputs.push({ path: input.path, sha256: input.sha256 });
}
inputs.push({ path: auditPath, sha256: sha256(auditBytes) });
const recoveredSeats = audit.target.predictions.map((prediction) => ({
  seatId: prediction.seatId,
  position: prediction.position,
  coordinateProvenance: 'MODELED_FROM_PROVIDER_2D_MAP_WITH_CROSS_VALIDATED_LOCAL_TRANSFORM',
  directProvider3dMeasurement: false,
  horizontalUncertaintyM: uncertainty.horizontalM,
  verticalUncertaintyM: uncertainty.verticalM,
  modeledFrom: {
    method: audit.validation.method,
    sectionId: audit.target.sectionId,
    rowId: audit.target.rowId,
    trainingRowIds: audit.target.trainingRowIds,
    trainingAnchorCount: audit.target.trainingAnchorCount,
    comparableSectionCount: audit.validation.comparableSectionCount,
    comparableHoldoutAnchorCount: audit.validation.comparableHoldoutAnchorCount,
  },
}));
if (recoveredSeats.length === 0) throw new Error('Audit contains no target predictions');
const stable = {
  stadiumId: audit.stadiumId,
  venueId: audit.venueId,
  inputs,
  recoveryMethod: audit.validation.method,
  validation: {
    comparableSectionCount: audit.validation.comparableSectionCount,
    comparableHoldoutAnchorCount: audit.validation.comparableHoldoutAnchorCount,
    horizontalErrorM: audit.validation.horizontalErrorM,
    verticalErrorM: audit.validation.verticalErrorM,
    uncertainty,
  },
  recoveredSeats,
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'venue-local-modeled-seat-config-recovery',
  artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
  createdOn: new Date().toISOString(),
  ...stable,
  publication: {
    eligible: false,
    blockers: [
      'MODELED_RECOVERY_IS_NOT_DIRECT_MEASUREMENT',
      'VENUE_LOCAL_FRAME_NOT_REGISTERED',
      'OBSTRUCTION_GEOMETRY_NOT_INCLUDED',
      'SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  stadiumId: artifact.stadiumId,
  venueId: artifact.venueId,
  recoveryMethod: artifact.recoveryMethod,
  recoveredSeatCount: artifact.recoveredSeats.length,
  validation: artifact.validation,
  publication: artifact.publication,
}, null, 2));
