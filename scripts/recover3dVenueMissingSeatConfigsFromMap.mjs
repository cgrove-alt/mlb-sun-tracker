#!/usr/bin/env node

/**
 * Recover missing venue-local seat coordinates from checksum-locked provider
 * 2D map centers after leave-one-section-out validation against direct 3D
 * coordinates in comparable two-row sections.
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const targetMapPath = typeof args['target-map'] === 'string' ? args['target-map'] : null;
const targetConfigsPath = typeof args['target-configs'] === 'string'
  ? args['target-configs']
  : null;
const calibrationMapsPath = typeof args['calibration-maps'] === 'string'
  ? args['calibration-maps']
  : null;
const calibrationConfigsPath = typeof args['calibration-configs'] === 'string'
  ? args['calibration-configs']
  : null;
const targetSectionId = typeof args['target-section'] === 'string'
  ? args['target-section']
  : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
if (
  !targetMapPath
  || !targetConfigsPath
  || !calibrationMapsPath
  || !calibrationConfigsPath
  || !targetSectionId
  || !outputPath
) {
  console.error(
    'Required: --target-map=PATH --target-configs=PATH --calibration-maps=PATH '
      + '--calibration-configs=PATH --target-section=ID --output=PATH',
  );
  process.exit(2);
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const finiteVector = (value, length) => Array.isArray(value)
  && value.length === length
  && value.every((coordinate) => Number.isFinite(coordinate));
const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const quantile = (values, probability) => {
  const sorted = values.toSorted((left, right) => left - right);
  if (sorted.length === 0) return null;
  const index = (sorted.length - 1) * probability;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
};
const summarizeErrors = (values) => ({
  count: values.length,
  median: quantile(values, 0.5),
  p95: quantile(values, 0.95),
  maximum: values.length > 0 ? Math.max(...values) : null,
});
const parseSeatId = (seatId) => {
  const match = seatId.match(/^S_(.+)-([^-]+)-([^-]+)$/);
  if (!match) throw new Error(`Cannot parse seat ID ${seatId}`);
  return { sectionId: match[1], rowId: match[2], seatNumber: match[3] };
};

async function readArtifact(filePath, expectedKind) {
  const bytes = await readFile(filePath);
  const value = JSON.parse(bytes.toString('utf8'));
  if (value.artifactKind !== expectedKind) {
    throw new Error(`${filePath} is not ${expectedKind}`);
  }
  return { path: filePath, bytes, sha256: sha256(bytes), value };
}

const targetMap = await readArtifact(
  targetMapPath,
  'venue-public-seat-map-node-inspection',
);
const targetConfigs = await readArtifact(
  targetConfigsPath,
  'venue-public-seat-config-inspection',
);
const calibrationMaps = await readArtifact(
  calibrationMapsPath,
  'venue-public-seat-map-node-inspection',
);
const calibrationConfigs = await readArtifact(
  calibrationConfigsPath,
  'venue-public-seat-config-inspection',
);
const allArtifacts = [targetMap, targetConfigs, calibrationMaps, calibrationConfigs];
if (new Set(allArtifacts.map((artifact) => artifact.value.stadiumId)).size !== 1) {
  throw new Error('All evidence artifacts must have the same stadium ID');
}
if (new Set(allArtifacts.map((artifact) => artifact.value.venueId)).size !== 1) {
  throw new Error('All evidence artifacts must have the same venue ID');
}

function mapCentersBySeat(mapArtifact) {
  const centers = new Map();
  for (const section of mapArtifact.sections) {
    if (section.manifestStatus !== 200 || !section.manifestJson) continue;
    for (const layer of section.manifestJson.n ?? []) {
      if (layer.h?.t !== 'seat') continue;
      for (const node of layer.n ?? []) {
        if (typeof node.i === 'string' && finiteVector(node.c, 2)) {
          centers.set(node.i, node.c);
        }
      }
    }
  }
  return centers;
}

function positionsBySeat(configArtifact) {
  return new Map(configArtifact.configs
    .filter((item) => item.status === 200 && finiteVector(item.config?.p, 3))
    .map((item) => [item.seatId, item.config.p]));
}

const calibrationCenters = mapCentersBySeat(calibrationMaps.value);
const calibrationPositions = positionsBySeat(calibrationConfigs.value);
const calibrationSectionIds = Array.from(new Set(
  calibrationConfigs.value.configs
    .map((item) => parseSeatId(item.seatId).sectionId),
)).sort();

function fitReferenceLine(sectionId, centers, positions) {
  const training = Array.from(positions.entries())
    .filter(([seatId]) => {
      const details = parseSeatId(seatId);
      return details.sectionId === sectionId
        && details.rowId === 'A'
        && centers.has(seatId);
    })
    .map(([seatId, position]) => ({ seatId, center: centers.get(seatId), position }));
  if (training.length < 3) {
    throw new Error(`Section ${sectionId} needs at least three direct Row A controls`);
  }
  const u0 = mean(training.map((item) => item.center[0]));
  const v0 = mean(training.map((item) => item.center[1]));
  const x0 = mean(training.map((item) => item.position[0]));
  const y0 = mean(training.map((item) => item.position[1]));
  const z0 = mean(training.map((item) => item.position[2]));
  const denominator = training.reduce(
    (sum, item) => sum + (item.center[0] - u0) ** 2,
    0,
  );
  if (!(denominator > 0)) throw new Error(`Section ${sectionId} has no map-center baseline`);
  const tangentX = training.reduce(
    (sum, item) => sum + (item.center[0] - u0) * (item.position[0] - x0),
    0,
  ) / denominator;
  const tangentZ = training.reduce(
    (sum, item) => sum + (item.center[0] - u0) * (item.position[2] - z0),
    0,
  ) / denominator;
  const scale = Math.hypot(tangentX, tangentZ);
  if (!(scale > 0)) throw new Error(`Section ${sectionId} has zero metric tangent scale`);
  const fitted = training.map((item) => {
    const du = item.center[0] - u0;
    const predicted = [x0 + tangentX * du, y0, z0 + tangentZ * du];
    return {
      seatId: item.seatId,
      horizontalErrorM: Math.hypot(
        predicted[0] - item.position[0],
        predicted[2] - item.position[2],
      ),
      verticalErrorM: Math.abs(predicted[1] - item.position[1]),
    };
  });
  return {
    sectionId,
    training,
    u0,
    v0,
    origin: [x0, y0, z0],
    tangentPerMapUnit: [tangentX, tangentZ],
    tangentScaleMPerMapUnit: scale,
    fitted,
  };
}

function normalForFit(fit, sign) {
  const [tangentX, tangentZ] = fit.tangentPerMapUnit;
  const scale = fit.tangentScaleMPerMapUnit;
  return [sign * -tangentZ / scale, sign * tangentX / scale];
}

function holdoutForSection(sectionId, centers, positions) {
  return Array.from(positions.entries())
    .filter(([seatId]) => {
      const details = parseSeatId(seatId);
      return details.sectionId === sectionId
        && details.rowId === 'B'
        && centers.has(seatId);
    })
    .map(([seatId, position]) => ({ seatId, center: centers.get(seatId), position }));
}

const calibrationSections = calibrationSectionIds.map((sectionId) => ({
  fit: fitReferenceLine(sectionId, calibrationCenters, calibrationPositions),
  holdout: holdoutForSection(sectionId, calibrationCenters, calibrationPositions),
}));
if (calibrationSections.some((section) => section.holdout.length < 1)) {
  throw new Error('Every calibration section needs a direct Row B holdout');
}

function learnDepthModel(trainingSections) {
  let best = null;
  for (const sign of [-1, 1]) {
    let numerator = 0;
    let denominator = 0;
    for (const { fit, holdout } of trainingSections) {
      const normal = normalForFit(fit, sign);
      for (const item of holdout) {
        const du = item.center[0] - fit.u0;
        const dv = item.center[1] - fit.v0;
        const baseX = fit.origin[0] + fit.tangentPerMapUnit[0] * du;
        const baseZ = fit.origin[2] + fit.tangentPerMapUnit[1] * du;
        const normalResidual = (item.position[0] - baseX) * normal[0]
          + (item.position[2] - baseZ) * normal[1];
        numerator += dv * normalResidual;
        denominator += dv ** 2;
      }
    }
    const depthScale = denominator > 0 ? numerator / denominator : 0;
    if (!(depthScale > 0)) continue;
    const horizontalErrors = [];
    for (const { fit, holdout } of trainingSections) {
      const normal = normalForFit(fit, sign);
      for (const item of holdout) {
        const du = item.center[0] - fit.u0;
        const dv = item.center[1] - fit.v0;
        const predictedX = fit.origin[0]
          + fit.tangentPerMapUnit[0] * du
          + normal[0] * depthScale * dv;
        const predictedZ = fit.origin[2]
          + fit.tangentPerMapUnit[1] * du
          + normal[1] * depthScale * dv;
        horizontalErrors.push(Math.hypot(
          predictedX - item.position[0],
          predictedZ - item.position[2],
        ));
      }
    }
    const score = mean(horizontalErrors);
    if (!best || score < best.score) best = { sign, depthScale, score };
  }
  if (!best) throw new Error('Could not learn a positive cross-row depth scale');
  let verticalNumerator = 0;
  let verticalDenominator = 0;
  for (const { fit, holdout } of trainingSections) {
    for (const item of holdout) {
      const dv = item.center[1] - fit.v0;
      verticalNumerator += dv * (item.position[1] - fit.origin[1]);
      verticalDenominator += dv ** 2;
    }
  }
  return {
    normalSign: best.sign,
    depthScaleMPerMapUnit: best.depthScale,
    verticalScaleMPerMapUnit: verticalNumerator / verticalDenominator,
  };
}

function predict(fit, center, model) {
  const du = center[0] - fit.u0;
  const dv = center[1] - fit.v0;
  const normal = normalForFit(fit, model.normalSign);
  return [
    fit.origin[0]
      + fit.tangentPerMapUnit[0] * du
      + normal[0] * model.depthScaleMPerMapUnit * dv,
    fit.origin[1] + model.verticalScaleMPerMapUnit * dv,
    fit.origin[2]
      + fit.tangentPerMapUnit[1] * du
      + normal[1] * model.depthScaleMPerMapUnit * dv,
  ];
}

const validationObservations = [];
for (const heldOutSection of calibrationSections) {
  const trainingSections = calibrationSections.filter((section) =>
    section.fit.sectionId !== heldOutSection.fit.sectionId);
  const model = learnDepthModel(trainingSections);
  for (const item of heldOutSection.holdout) {
    const predicted = predict(heldOutSection.fit, item.center, model);
    validationObservations.push({
      sectionId: heldOutSection.fit.sectionId,
      seatId: item.seatId,
      predicted,
      observed: item.position,
      horizontalErrorM: Math.hypot(
        predicted[0] - item.position[0],
        predicted[2] - item.position[2],
      ),
      verticalErrorM: Math.abs(predicted[1] - item.position[1]),
      threeDimensionalErrorM: Math.hypot(
        predicted[0] - item.position[0],
        predicted[1] - item.position[1],
        predicted[2] - item.position[2],
      ),
      trainingSectionIds: trainingSections.map((section) => section.fit.sectionId),
      model,
    });
  }
}
const horizontalErrors = validationObservations.map((item) => item.horizontalErrorM);
const verticalErrors = validationObservations.map((item) => item.verticalErrorM);
const threeDimensionalErrors = validationObservations
  .map((item) => item.threeDimensionalErrorM);
const uncertaintyBufferM = 0.05;
const horizontalUncertaintyM = Math.max(...horizontalErrors) + uncertaintyBufferM;
const verticalUncertaintyM = Math.max(...verticalErrors) + uncertaintyBufferM;
const maximumAllowedUncertaintyM = 0.3048;
const uncertaintyGatePassed = horizontalUncertaintyM <= maximumAllowedUncertaintyM
  && verticalUncertaintyM <= maximumAllowedUncertaintyM;

const finalModel = learnDepthModel(calibrationSections);
const targetCenters = mapCentersBySeat(targetMap.value);
const targetPositions = positionsBySeat(targetConfigs.value);
const targetFit = fitReferenceLine(targetSectionId, targetCenters, targetPositions);
const targetSeatIds = targetMap.value.requested
  .map((item) => item.seatId)
  .filter((seatId) => parseSeatId(seatId).sectionId === targetSectionId);
const recoveredSeats = targetSeatIds
  .filter((seatId) => !targetPositions.has(seatId))
  .map((seatId) => {
    const center = targetCenters.get(seatId);
    if (!center) throw new Error(`Target map center missing for ${seatId}`);
    return {
      seatId,
      providerMapCenter: center,
      position: predict(targetFit, center, finalModel),
      coordinateProvenance: 'MODELED_FROM_PROVIDER_2D_MAP_WITH_CROSS_VALIDATED_LOCAL_TRANSFORM',
      horizontalUncertaintyM,
      verticalUncertaintyM,
    };
  });
if (recoveredSeats.length === 0) throw new Error('Target section has no missing config positions');

const targetManifestSection = targetMap.value.sections.find((section) =>
  section.sourceMapId === `S_${targetSectionId}`);
const targetInternalGroups = targetManifestSection?.manifestJson?.o?.rows ?? [];
const stable = {
  inputs: allArtifacts.map((artifact) => ({
    path: artifact.path,
    sha256: artifact.sha256,
    artifactVersion: artifact.value.artifactVersion,
  })),
  targetSectionId,
  calibrationSectionIds,
  finalModel,
  uncertaintyBufferM,
  maximumAllowedUncertaintyM,
  validationObservations,
  recoveredSeats,
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'venue-local-modeled-seat-config-recovery',
  artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
  generatedOn: new Date().toISOString(),
  stadiumId: targetMap.value.stadiumId,
  venueId: targetMap.value.venueId,
  inputs: stable.inputs,
  target: {
    sectionId: targetSectionId,
    directControls: targetFit.training.map((item) => ({
      seatId: item.seatId,
      providerMapCenter: item.center,
      position: item.position,
    })),
    directControlFitHorizontalErrorM: summarizeErrors(
      targetFit.fitted.map((item) => item.horizontalErrorM),
    ),
    providerInternalGroups: targetInternalGroups,
    missingDirectConfigSeatIds: recoveredSeats.map((item) => item.seatId),
  },
  method: {
    family: 'anisotropic-local-orthogonal-map-to-metric-transform',
    trainingRow: 'provider Row A with direct 3D coordinates',
    holdoutRow: 'provider Row B withheld from each local fit',
    crossValidation: 'leave-one-section-out for cross-row depth and elevation scales',
    finalModel,
    uncertaintyBufferM,
    note: 'Provider ticket labels are preserved. The model does not relabel the target positions even though the 2D map places them on a second physical line.',
  },
  validation: {
    calibrationSectionIds,
    directTrainingControls: calibrationSections.reduce(
      (sum, section) => sum + section.fit.training.length,
      0,
    ),
    independentHoldoutObservations: validationObservations.length,
    horizontalErrorM: summarizeErrors(horizontalErrors),
    verticalErrorM: summarizeErrors(verticalErrors),
    threeDimensionalErrorM: summarizeErrors(threeDimensionalErrors),
    uncertainty: {
      basis: 'maximum leave-one-section-out error plus fixed buffer',
      bufferM: uncertaintyBufferM,
      horizontalM: horizontalUncertaintyM,
      verticalM: verticalUncertaintyM,
      maximumAllowedM: maximumAllowedUncertaintyM,
      gatePassed: uncertaintyGatePassed,
    },
    observations: validationObservations,
  },
  recoveredSeats,
  publication: {
    eligible: false,
    blockers: [
      ...(!uncertaintyGatePassed ? ['MODELED_RECOVERY_UNCERTAINTY_EXCEEDS_ONE_FOOT'] : []),
      'MODELED_RECOVERY_NOT_DIRECT_PROVIDER_3D_MEASUREMENT',
      'VENUE_LOCAL_FRAME_NOT_REGISTERED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED'
    ],
  },
};
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  targetSectionId,
  directTargetControls: artifact.target.directControls.length,
  recoveredSeats: recoveredSeats.length,
  validation: {
    calibrationSections: calibrationSectionIds.length,
    directTrainingControls: artifact.validation.directTrainingControls,
    independentHoldoutObservations: validationObservations.length,
    horizontalErrorM: artifact.validation.horizontalErrorM,
    verticalErrorM: artifact.validation.verticalErrorM,
    uncertainty: artifact.validation.uncertainty,
  },
  publicationEligible: false,
}, null, 2));
