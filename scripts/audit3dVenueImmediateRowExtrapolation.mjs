#!/usr/bin/env node

/** Audit whether two provider map rows can predict the immediately adjacent third row. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const mapPath = typeof args.map === 'string' ? args.map : null;
const metricPath = typeof args.metric === 'string' ? args.metric : null;
const targetSectionId = typeof args.section === 'string' ? args.section : null;
const targetRowId = typeof args.row === 'string' ? args.row : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
if (!mapPath || !metricPath || !targetSectionId || !targetRowId || !outputPath) {
  throw new Error('Required: --map=PATH --metric=PATH --section=ID --row=ID --output=PATH');
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const mapBytes = await readFile(mapPath);
const metricBytes = await readFile(metricPath);
const mapArtifact = JSON.parse(mapBytes.toString('utf8'));
const metricArtifact = JSON.parse(metricBytes.toString('utf8'));
if (mapArtifact.artifactKind !== 'current-venue-map-row-geometry') {
  throw new Error('Map input has the wrong artifact kind');
}
if (metricArtifact.artifactKind !== 'venue-local-metric-row-anchors') {
  throw new Error('Metric input has the wrong artifact kind');
}
if (
  mapArtifact.stadiumId !== metricArtifact.stadiumId
  || mapArtifact.venueId !== metricArtifact.venueId
  || mapArtifact.inventoryArtifactVersion !== metricArtifact.inventoryArtifactVersion
) {
  throw new Error('Map and metric inputs do not describe the same inventory');
}

function solve3(matrix, vector) {
  const augmented = matrix.map((row, index) => [...row, vector[index]]);
  for (let pivot = 0; pivot < 3; pivot += 1) {
    let best = pivot;
    for (let row = pivot + 1; row < 3; row += 1) {
      if (Math.abs(augmented[row][pivot]) > Math.abs(augmented[best][pivot])) best = row;
    }
    if (Math.abs(augmented[best][pivot]) < 1e-12) return null;
    [augmented[pivot], augmented[best]] = [augmented[best], augmented[pivot]];
    const divisor = augmented[pivot][pivot];
    for (let column = pivot; column < 4; column += 1) {
      augmented[pivot][column] /= divisor;
    }
    for (let row = 0; row < 3; row += 1) {
      if (row === pivot) continue;
      const factor = augmented[row][pivot];
      for (let column = pivot; column < 4; column += 1) {
        augmented[row][column] -= factor * augmented[pivot][column];
      }
    }
  }
  return augmented.map((row) => row[3]);
}

function fitAffine(samples) {
  const normal = Array.from({ length: 3 }, () => Array(3).fill(0));
  const right = Array.from({ length: 3 }, () => Array(3).fill(0));
  for (const sample of samples) {
    const feature = [1, sample.map[0], sample.map[1]];
    for (let row = 0; row < 3; row += 1) {
      for (let column = 0; column < 3; column += 1) {
        normal[row][column] += feature[row] * feature[column];
      }
      for (let dimension = 0; dimension < 3; dimension += 1) {
        right[dimension][row] += feature[row] * sample.metric[dimension];
      }
    }
  }
  const coefficients = right.map((vector) => solve3(normal, vector));
  return coefficients.every(Boolean) ? coefficients : null;
}

function predict(coefficients, map) {
  const feature = [1, map[0], map[1]];
  return coefficients.map((row) => row.reduce((sum, value, index) =>
    sum + value * feature[index], 0));
}

function distance3(left, right) {
  return Math.hypot(left[0] - right[0], left[1] - right[1], left[2] - right[2]);
}

function percentile(values, probability) {
  if (values.length === 0) return null;
  const sorted = values.toSorted((left, right) => left - right);
  const index = (sorted.length - 1) * probability;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

function rowMapCentroid(row) {
  const anchors = row.seats.map((seat) => seat.anchor ?? seat.center).filter(Boolean);
  if (anchors.length === 0) return null;
  return [
    anchors.reduce((sum, point) => sum + point[0], 0) / anchors.length,
    anchors.reduce((sum, point) => sum + point[1], 0) / anchors.length,
  ];
}

const metricRowByKey = new Map(metricArtifact.rows.map((row) => [row.rowKey, row]));
const mapSectionById = new Map(mapArtifact.sections.map((section) => [section.sectionId, section]));

function mapSeatById(rows) {
  return new Map(rows.flatMap((row) => row.seats.map((seat) => [
    seat.id,
    seat.anchor ?? seat.center,
  ])));
}

function evaluateTriple(sectionId, rows, tripleStart = 0) {
  const triple = rows.slice(tripleStart, tripleStart + 3);
  if (triple.length !== 3) return null;
  const metricRows = triple.map((row) => metricRowByKey.get(row.rowKey));
  if (metricRows.some((row) => !row || row.metricAnchorComplete !== true)) return null;
  const seatMap = mapSeatById(triple);
  const training = metricRows.slice(0, 2).flatMap((row) => row.anchors.map((anchor) => ({
    seatId: anchor.seatId,
    map: seatMap.get(anchor.seatId),
    metric: anchor.position,
  }))).filter((sample) => sample.map);
  if (training.length < 6) return null;
  const coefficients = fitAffine(training);
  if (!coefficients) return null;
  const trainingErrorsM = training.map((sample) =>
    distance3(predict(coefficients, sample.map), sample.metric));
  const holdouts = metricRows[2].anchors.map((anchor) => ({
    seatId: anchor.seatId,
    map: seatMap.get(anchor.seatId),
    metric: anchor.position,
  })).filter((sample) => sample.map);
  if (holdouts.length < 3) return null;
  const predictions = holdouts.map((sample) => {
    const predicted = predict(coefficients, sample.map);
    return {
      seatId: sample.seatId,
      predicted,
      actual: sample.metric,
      horizontalErrorM: Math.hypot(
        predicted[0] - sample.metric[0],
        predicted[2] - sample.metric[2],
      ),
      verticalErrorM: Math.abs(predicted[1] - sample.metric[1]),
      totalErrorM: distance3(predicted, sample.metric),
    };
  });
  const centroids = triple.map(rowMapCentroid);
  if (centroids.some((value) => !value)) return null;
  const firstStep = Math.hypot(
    centroids[1][0] - centroids[0][0],
    centroids[1][1] - centroids[0][1],
  );
  const secondStep = Math.hypot(
    centroids[2][0] - centroids[1][0],
    centroids[2][1] - centroids[1][1],
  );
  return {
    sectionId,
    trainingRowIds: triple.slice(0, 2).map((row) => row.rowId),
    holdoutRowId: triple[2].rowId,
    trainingAnchorCount: training.length,
    holdoutAnchorCount: holdouts.length,
    mapStepRatio: firstStep > 0 ? secondStep / firstStep : null,
    trainingMaximumErrorM: Math.max(...trainingErrorsM),
    predictions,
  };
}

const targetSection = mapSectionById.get(targetSectionId);
if (!targetSection) throw new Error(`Unknown target section ${targetSectionId}`);
const targetIndex = targetSection.rows.findIndex((row) => row.rowId === targetRowId);
if (targetIndex !== 2) {
  throw new Error('This audit requires the target to be the immediate third row');
}
const targetRows = targetSection.rows.slice(0, 3);
const targetDirectRows = targetRows.slice(0, 2).map((row) => metricRowByKey.get(row.rowKey));
const targetMissingRow = metricRowByKey.get(targetRows[2].rowKey);
if (
  targetDirectRows.some((row) => row?.metricAnchorComplete !== true)
  || !targetMissingRow
  || targetMissingRow.metricAnchorComplete === true
) {
  throw new Error('Target must have two complete rows followed by one incomplete row');
}
const targetSeatMap = mapSeatById(targetRows);
const targetTraining = targetDirectRows.flatMap((row) => row.anchors.map((anchor) => ({
  seatId: anchor.seatId,
  map: targetSeatMap.get(anchor.seatId),
  metric: anchor.position,
}))).filter((sample) => sample.map);
const targetCoefficients = fitAffine(targetTraining);
if (!targetCoefficients) throw new Error('Target local affine model is singular');
const targetPredictions = targetMissingRow.requestedAnchorSeatIds.map((seatId) => ({
  seatId,
  map: targetSeatMap.get(seatId),
})).map((sample) => {
  if (!sample.map) throw new Error(`Target map coordinate is missing ${sample.seatId}`);
  return {
    seatId: sample.seatId,
    map: sample.map,
    position: predict(targetCoefficients, sample.map),
  };
});
const targetCentroids = targetRows.map(rowMapCentroid);
const targetFirstStep = Math.hypot(
  targetCentroids[1][0] - targetCentroids[0][0],
  targetCentroids[1][1] - targetCentroids[0][1],
);
const targetSecondStep = Math.hypot(
  targetCentroids[2][0] - targetCentroids[1][0],
  targetCentroids[2][1] - targetCentroids[1][1],
);
const targetMapStepRatio = targetSecondStep / targetFirstStep;
const targetTrainingErrorsM = targetTraining.map((sample) =>
  distance3(predict(targetCoefficients, sample.map), sample.metric));
const targetTrainingMaximumErrorM = Math.max(...targetTrainingErrorsM);
const comparableTrainingMaximumErrorM = Math.max(
  0.05,
  targetTrainingMaximumErrorM + 0.01,
);

const allHoldouts = mapArtifact.sections.map((section) =>
  evaluateTriple(section.sectionId, section.rows, 0)).filter(Boolean);
const comparableHoldouts = allHoldouts.filter((holdout) =>
  holdout.trainingMaximumErrorM <= comparableTrainingMaximumErrorM
  && Math.abs(holdout.mapStepRatio - targetMapStepRatio) <= 0.15);
const comparablePredictions = comparableHoldouts.flatMap((holdout) => holdout.predictions);
const horizontalErrorsM = comparablePredictions.map((item) => item.horizontalErrorM);
const verticalErrorsM = comparablePredictions.map((item) => item.verticalErrorM);
const bufferM = 0.05;
const maximumAllowedM = 0.3048;
const uncertainty = {
  maximumAllowedM,
  bufferM,
  horizontalM: horizontalErrorsM.length > 0 ? Math.max(...horizontalErrorsM) + bufferM : null,
  verticalM: verticalErrorsM.length > 0 ? Math.max(...verticalErrorsM) + bufferM : null,
};
uncertainty.gatePassed = comparablePredictions.length >= 30
  && comparableHoldouts.length >= 10
  && uncertainty.horizontalM <= maximumAllowedM
  && uncertainty.verticalM <= maximumAllowedM;

const stable = {
  inputs: {
    map: {
      path: mapPath,
      sha256: sha256(mapBytes),
      artifactVersion: mapArtifact.artifactVersion,
    },
    metric: {
      path: metricPath,
      sha256: sha256(metricBytes),
      artifactVersion: metricArtifact.artifactVersion,
    },
  },
  stadiumId: metricArtifact.stadiumId,
  venueId: metricArtifact.venueId,
  target: {
    sectionId: targetSectionId,
    rowId: targetRowId,
    trainingRowIds: targetRows.slice(0, 2).map((row) => row.rowId),
    trainingAnchorCount: targetTraining.length,
    trainingMaximumErrorM: targetTrainingMaximumErrorM,
    mapStepRatio: targetMapStepRatio,
    predictions: targetPredictions,
  },
  validation: {
    method: 'FIRST_TWO_ROWS_LOCAL_AFFINE_TO_IMMEDIATE_THIRD_ROW',
    candidateSectionCount: allHoldouts.length,
    comparableSectionCount: comparableHoldouts.length,
    comparableHoldoutAnchorCount: comparablePredictions.length,
    filters: {
      maximumTrainingErrorM: comparableTrainingMaximumErrorM,
      maximumMapStepRatioDifference: 0.15,
    },
    horizontalErrorM: {
      median: percentile(horizontalErrorsM, 0.5),
      p95: percentile(horizontalErrorsM, 0.95),
      maximum: horizontalErrorsM.length > 0 ? Math.max(...horizontalErrorsM) : null,
    },
    verticalErrorM: {
      median: percentile(verticalErrorsM, 0.5),
      p95: percentile(verticalErrorsM, 0.95),
      maximum: verticalErrorsM.length > 0 ? Math.max(...verticalErrorsM) : null,
    },
    uncertainty,
    comparableHoldouts,
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'venue-immediate-row-extrapolation-audit',
  artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
  auditedOn: new Date().toISOString(),
  ...stable,
  publication: {
    eligible: false,
    blockers: [
      ...(uncertainty.gatePassed ? [] : ['IMMEDIATE_ROW_EXTRAPOLATION_UNCERTAINTY_TOO_HIGH']),
      'RECOVERED_ANCHORS_NOT_PROMOTED',
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
  target: artifact.target,
  validation: {
    method: artifact.validation.method,
    candidateSectionCount: artifact.validation.candidateSectionCount,
    comparableSectionCount: artifact.validation.comparableSectionCount,
    comparableHoldoutAnchorCount: artifact.validation.comparableHoldoutAnchorCount,
    horizontalErrorM: artifact.validation.horizontalErrorM,
    verticalErrorM: artifact.validation.verticalErrorM,
    uncertainty: artifact.validation.uncertainty,
  },
  publication: artifact.publication,
}, null, 2));
