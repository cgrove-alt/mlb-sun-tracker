#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const THRESHOLDS = Object.freeze({
  minimumIndependentObservations: 30,
  minimumUniqueDates: 3,
  minimumSolarAltitudeSpanDegrees: 25,
  maximumLabelUncertaintyRows: 1,
  maximumTimestampUncertaintySeconds: 30,
});

function option(name, fallback = null) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length)
    ?? fallback;
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

async function readJson(path) {
  const bytes = await readFile(path);
  return { bytes, value: JSON.parse(bytes.toString('utf8')) };
}

async function verifyReferencedFile(reference, label) {
  if (!reference || typeof reference.path !== 'string' || typeof reference.sha256 !== 'string') {
    throw new Error(`${label} reference is incomplete`);
  }
  const bytes = await readFile(resolve(reference.path));
  const actualSha256 = sha256(bytes);
  if (actualSha256 !== reference.sha256) {
    throw new Error(`${label} checksum mismatch for ${reference.path}`);
  }
  return bytes;
}

function localDate(timestamp, timeZone) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.valueOf())) throw new Error(`Invalid observation timestamp: ${timestamp}`);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${byType.year}-${byType.month}-${byType.day}`;
}

function round(value, digits = 6) {
  return Number(Number(value).toFixed(digits));
}

async function main() {
  const stadiumId = option('stadium');
  const sectionId = option('section');
  const inputDirectory = resolve(option('input-dir', 'tmp/lidar'));
  const outputPath = option('output');
  const timeZone = option('time-zone');
  if (!stadiumId || !sectionId || !outputPath || !timeZone) {
    throw new Error(
      'Required options: --stadium, --section, --input-dir, --output, and --time-zone',
    );
  }

  const names = (await readdir(inputDirectory))
    .filter((name) => name.startsWith(`${stadiumId}-`))
    .filter((name) => /observed-shade-boundary-v\d+\.json$/u.test(name))
    .sort();
  const observations = [];

  for (const name of names) {
    const path = resolve(inputDirectory, name);
    const { bytes, value: artifact } = await readJson(path);
    if (artifact.artifactKind !== 'official-broadcast-observed-row-shade-boundary') continue;
    if (artifact.stadiumId !== stadiumId || artifact.sectionId !== sectionId) continue;
    if (artifact.evidenceSemantics?.class !== 'observed-only') {
      throw new Error(`${name} is not classified as observed-only evidence`);
    }
    if (artifact.evidenceSemantics?.containsPredictedBoundary !== false) {
      throw new Error(`${name} does not explicitly exclude predicted boundaries`);
    }
    if (artifact.measurementValidation?.eligibleAsObservedBoundaryMeasurement !== true) {
      throw new Error(`${name} is not an eligible observed-boundary measurement`);
    }
    if ((artifact.measurementValidation?.blockers ?? []).length > 0) {
      throw new Error(`${name} has measurement blockers`);
    }

    const inputs = artifact.inputs ?? {};
    await verifyReferencedFile(inputs.frame, `${name} frame`);
    await verifyReferencedFile(inputs.rowRegistration, `${name} row registration`);
    const controlsBytes = await verifyReferencedFile(
      inputs.reviewedBoundaryControls,
      `${name} reviewed boundary controls`,
    );
    await verifyReferencedFile(inputs.officialSourceSegment, `${name} official source segment`);
    await verifyReferencedFile(inputs.sourceFrameManifest, `${name} source frame manifest`);
    await verifyReferencedFile(inputs.officialEventEvidence, `${name} event evidence`);

    const controls = JSON.parse(controlsBytes.toString('utf8'));
    if (controls.reviewStatus !== 'independently-reviewed-shade-boundary-pixels') {
      throw new Error(`${name} controls are not independently reviewed`);
    }
    const identity = controls.officialEventIdentity ?? {};
    if (!Number.isInteger(identity.gamePk) || typeof identity.playId !== 'string') {
      throw new Error(`${name} lacks an official MLB event identity`);
    }
    const samples = artifact.samples ?? [];
    if (samples.length !== artifact.measurementValidation.sampleCount) {
      throw new Error(`${name} sample count does not match its validation summary`);
    }
    if (samples.some((sample) => sample.evidenceClass !== 'observed-only')) {
      throw new Error(`${name} contains a sample that is not observed-only`);
    }

    const timestampUncertaintySeconds = Number(artifact.timestampEvidence?.uncertaintySeconds);
    const maximumLabelUncertaintyRows = Number(
      artifact.measurementValidation.maximumCombinedLabelUncertaintyRows,
    );
    const solarAltitudeDegrees = Number(
      artifact.solarPositionAtEventMidpoint?.altitudeDegrees,
    );
    const solarAzimuthDegrees = Number(
      artifact.solarPositionAtEventMidpoint?.azimuthDegrees,
    );
    const timestamp = artifact.timestampEvidence?.eventMidpointTime;
    if ([
      timestampUncertaintySeconds,
      maximumLabelUncertaintyRows,
      solarAltitudeDegrees,
      solarAzimuthDegrees,
    ].some((value) => !Number.isFinite(value)) || typeof timestamp !== 'string') {
      throw new Error(`${name} contains a non-numeric measurement summary`);
    }

    observations.push({
      id: `${stadiumId}-${identity.gamePk}-${identity.playId}`,
      independenceKey: `mlb-play:${identity.gamePk}:${identity.playId}`,
      artifactPath: path.slice(resolve('.').length + 1),
      artifactFileSha256: sha256(bytes),
      artifactVersion: artifact.artifactVersion,
      reviewedControlsPath: inputs.reviewedBoundaryControls.path,
      officialSourceUrl: inputs.officialSourceSegment.url ?? null,
      timestamp,
      stadiumLocalDate: localDate(timestamp, timeZone),
      timestampUncertaintySeconds,
      solarAltitudeDegrees,
      solarAzimuthDegrees,
      sampleCount: samples.length,
      lateralSpanPixels: Number(artifact.measurementValidation.lateralSpanPixels),
      maximumLabelUncertaintyRows,
      geometryPredictionAttached: false,
      scoredAsShadowHoldout: false,
      publicationEligible: false,
    });
  }

  const independenceKeys = observations.map((observation) => observation.independenceKey);
  if (new Set(independenceKeys).size !== independenceKeys.length) {
    throw new Error('Duplicate MLB play independence keys were found');
  }

  const dates = [...new Set(observations.map((observation) => observation.stadiumLocalDate))]
    .sort();
  const altitudes = observations.map((observation) => observation.solarAltitudeDegrees);
  const solarAltitudeSpanDegrees = altitudes.length > 0
    ? round(Math.max(...altitudes) - Math.min(...altitudes))
    : 0;
  const maximumLabelUncertaintyRows = observations.length > 0
    ? Math.max(...observations.map((observation) => observation.maximumLabelUncertaintyRows))
    : null;
  const maximumTimestampUncertaintySeconds = observations.length > 0
    ? Math.max(...observations.map((observation) => observation.timestampUncertaintySeconds))
    : null;
  const gateResults = {
    independentObservationCountPassed:
      observations.length >= THRESHOLDS.minimumIndependentObservations,
    uniqueDatesPassed: dates.length >= THRESHOLDS.minimumUniqueDates,
    solarAltitudeSpanPassed:
      solarAltitudeSpanDegrees >= THRESHOLDS.minimumSolarAltitudeSpanDegrees,
    labelUncertaintyPassed: maximumLabelUncertaintyRows !== null
      && maximumLabelUncertaintyRows <= THRESHOLDS.maximumLabelUncertaintyRows,
    timestampUncertaintyPassed: maximumTimestampUncertaintySeconds !== null
      && maximumTimestampUncertaintySeconds <= THRESHOLDS.maximumTimestampUncertaintySeconds,
  };
  const observedMeasurementCorpusPassed = Object.values(gateResults).every(Boolean);
  const blockers = [
    ...(!gateResults.independentObservationCountPassed
      ? ['FEWER_THAN_THIRTY_INDEPENDENT_OBSERVED_BOUNDARIES'] : []),
    ...(!gateResults.uniqueDatesPassed ? ['FEWER_THAN_THREE_UNIQUE_DATES'] : []),
    ...(!gateResults.solarAltitudeSpanPassed
      ? ['SOLAR_ALTITUDE_SPAN_BELOW_TWENTY_FIVE_DEGREES'] : []),
    ...(!gateResults.labelUncertaintyPassed
      ? ['OBSERVED_BOUNDARY_LABEL_UNCERTAINTY_EXCEEDS_ONE_ROW'] : []),
    ...(!gateResults.timestampUncertaintyPassed
      ? ['OBSERVATION_TIMESTAMP_UNCERTAINTY_EXCEEDS_THIRTY_SECONDS'] : []),
    'NO_GEOMETRY_PREDICTIONS_ATTACHED',
    'NO_SCORED_SHADOW_HOLDOUTS',
  ];
  const summary = {
    observedBoundaryMeasurementCount: observations.length,
    independentObservationCount: new Set(independenceKeys).size,
    uniqueDateCount: dates.length,
    uniqueDates: dates,
    minimumSolarAltitudeDegrees: altitudes.length > 0 ? Math.min(...altitudes) : null,
    maximumSolarAltitudeDegrees: altitudes.length > 0 ? Math.max(...altitudes) : null,
    solarAltitudeSpanDegrees,
    maximumLabelUncertaintyRows,
    maximumTimestampUncertaintySeconds,
    geometryPredictionCount: 0,
    scoredShadowHoldoutCount: 0,
    passingShadowHoldoutCount: 0,
    observedMeasurementCorpusPassed,
  };
  const inputs = {
    observedBoundaryArtifacts: observations.map((observation) => ({
      path: observation.artifactPath,
      sha256: observation.artifactFileSha256,
      artifactVersion: observation.artifactVersion,
    })),
  };
  const stable = {
    stadiumId,
    sectionId,
    timeZone,
    inputs,
    thresholds: THRESHOLDS,
    observations,
    summary,
    gateResults,
    blockers,
  };
  const artifact = {
    schemaVersion: 1,
    artifactKind: 'observed-shade-boundary-inventory',
    artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
    generatedOn: new Date().toISOString(),
    stadiumId,
    sectionId,
    timeZone,
    inputs,
    evidenceSemantics: {
      observedBoundaryMeasurementsAreGeometryPredictions: false,
      observedBoundaryMeasurementsAreScoredHoldouts: false,
      statement: 'Observed-only boundaries remain separate from geometry predictions and cannot pass a shadow holdout without an independently generated predicted boundary.',
    },
    thresholds: THRESHOLDS,
    observations,
    summary,
    gateResults,
    publication: {
      eligible: false,
      blockers,
    },
  };

  const output = resolve(outputPath);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(artifact, null, 2)}\n`);
  console.log(JSON.stringify({
    output,
    artifactVersion: artifact.artifactVersion,
    summary,
    blockers,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
