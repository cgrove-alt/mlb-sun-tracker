#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const NCAT_ENDPOINT = 'https://geodesy.noaa.gov/api/ncat/llh';
const NCAT_DOCUMENTATION = 'https://geodesy.noaa.gov/web_services/ncat/lat-long-height-service.shtml';
const FEET_PER_METRE = 3937 / 1200;

function option(name) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length);
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function canonicalJson(value) {
  if (Array.isArray(value)) return value.map(canonicalJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalJson(value[key])]));
  }
  return value;
}

function artifactVersion(value) {
  return `sha256:${sha256(JSON.stringify(canonicalJson(value)))}`;
}

function numeric(value, field) {
  const parsed = Number.parseFloat(String(value).replaceAll(',', ''));
  if (!Number.isFinite(parsed)) throw new Error(`NCAT field ${field} is not numeric: ${value}`);
  return parsed;
}

async function fetchNcat(control) {
  const url = new URL(NCAT_ENDPOINT);
  url.searchParams.set('lat', control.sourceLatitudeDms);
  url.searchParams.set('lon', control.sourceLongitudeDms);
  url.searchParams.set('inDatum', 'NAD83(HARN)');
  url.searchParams.set('outDatum', 'NAD83(2011)');
  url.searchParams.set('spcZone', '0901');
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      accept: 'application/json',
      'user-agent': 'mlb-sun-tracker-ncat-control-research/1.0',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const value = JSON.parse(bytes.toString('utf8'));
  if (value.srcDatum !== 'NAD83(HARN)' || value.destDatum !== 'NAD83(2011)') {
    throw new Error(`Unexpected datum response for ${control.id}`);
  }
  if (value.nadconVersion !== '5.0' || value.spcZone !== 'FL E-0901') {
    throw new Error(`Unexpected NCAT engine or state-plane zone for ${control.id}`);
  }
  return {
    bytes,
    value,
    request: {
      requestedUrl: url.toString(),
      resolvedUrl: response.url,
      responseDate: response.headers.get('date'),
      contentType: response.headers.get('content-type'),
      byteLength: bytes.length,
      sha256: sha256(bytes),
    },
  };
}

async function main() {
  const roleLockArgument = option('role-lock');
  const outputArgument = option('output-dir');
  if (!roleLockArgument || !outputArgument) {
    throw new Error('Usage: acquireMarlinsMiamiDadeControlNcatTransforms.mjs --role-lock=PATH --output-dir=PATH');
  }
  const roleLockPath = path.resolve(roleLockArgument);
  const outputDirectory = path.resolve(outputArgument);
  const roleLockBytes = await readFile(roleLockPath);
  const roleLock = JSON.parse(roleLockBytes.toString('utf8'));
  const sourceManifestPath = path.resolve(path.dirname(roleLockPath), '..', roleLock.sourceManifest);
  const sourceManifestBytes = await readFile(sourceManifestPath);
  const sourceManifest = JSON.parse(sourceManifestBytes.toString('utf8'));
  const sourceSheetHashes = new Map(
    sourceManifest.sheets.map((sheet) => [sheet.name, sheet.sha256]),
  );
  const training = roleLock.controls.filter((control) => control.role === 'training');
  const holdouts = roleLock.controls.filter((control) => control.role === 'final-holdout');
  if (!roleLock.lockedBeforeAnyCurrentRasterOrLidarControlResidualWasInspected) {
    throw new Error('Role lock does not certify pre-residual partitioning');
  }
  if (training.length < 3 || holdouts.length < 3) {
    throw new Error('Role lock requires at least three training and three final-holdout controls');
  }
  if (new Set(roleLock.controls.map((control) => control.id)).size !== roleLock.controls.length) {
    throw new Error('Role lock contains duplicate control identifiers');
  }
  for (const control of roleLock.controls) {
    if (sourceSheetHashes.get(control.id) !== control.sheetSha256) {
      throw new Error(`Control-sheet checksum mismatch for ${control.id}`);
    }
  }
  await mkdir(outputDirectory, { recursive: true });

  const transformedControls = [];
  for (const control of roleLock.controls) {
    const result = await fetchNcat(control);
    const outputPath = path.join(outputDirectory, `${control.id}.json`);
    await writeFile(outputPath, result.bytes);
    const targetNorthing = numeric(result.value.spcNorthing_usft, 'spcNorthing_usft');
    const targetEasting = numeric(result.value.spcEasting_usft, 'spcEasting_usft');
    const deltaNorthing = targetNorthing - control.sourceNorthingUsSurveyFeet;
    const deltaEasting = targetEasting - control.sourceEastingUsSurveyFeet;
    const sigmaNorthingFeet = numeric(result.value.sigLat_m, 'sigLat_m') * FEET_PER_METRE;
    const sigmaEastingFeet = numeric(result.value.sigLon_m, 'sigLon_m') * FEET_PER_METRE;
    transformedControls.push({
      id: control.id,
      role: control.role,
      mark: control.mark,
      source: {
        latitudeDms: control.sourceLatitudeDms,
        longitudeDms: control.sourceLongitudeDms,
        northingUsSurveyFeet: control.sourceNorthingUsSurveyFeet,
        eastingUsSurveyFeet: control.sourceEastingUsSurveyFeet,
        controlSheetSha256: control.sheetSha256,
      },
      target: {
        latitudeDecimalDegrees: numeric(result.value.destLat, 'destLat'),
        longitudeDecimalDegrees: numeric(result.value.destLon, 'destLon'),
        northingUsSurveyFeet: targetNorthing,
        eastingUsSurveyFeet: targetEasting,
      },
      transformationDeltaUsSurveyFeet: {
        northing: deltaNorthing,
        easting: deltaEasting,
        magnitude: Math.hypot(deltaNorthing, deltaEasting),
      },
      ncatLocalSigma: {
        northingMetres: numeric(result.value.sigLat_m, 'sigLat_m'),
        eastingMetres: numeric(result.value.sigLon_m, 'sigLon_m'),
        northingUsSurveyFeet: sigmaNorthingFeet,
        eastingUsSurveyFeet: sigmaEastingFeet,
        radialRootSumSquareUsSurveyFeet: Math.hypot(sigmaNorthingFeet, sigmaEastingFeet),
        confidenceInterpretation: 'not elevated to 95 percent without an explicit NOAA confidence definition',
      },
      rawResponsePath: outputPath,
      rawResponse: result.request,
    });
  }

  const stable = {
    artifactKind: 'marlins-miami-dade-control-ncat-transforms',
    acquiredOn: new Date().toISOString(),
    roleLock: {
      path: roleLockPath,
      sha256: sha256(roleLockBytes),
      lockedAt: roleLock.lockedAt,
      trainingControlIds: training.map((control) => control.id),
      finalHoldoutControlIds: holdouts.map((control) => control.id),
    },
    sourceControlSheetManifest: {
      path: sourceManifestPath,
      sha256: sha256(sourceManifestBytes),
      artifactVersion: sourceManifest.artifactVersion,
    },
    authority: {
      agency: 'NOAA National Geodetic Survey',
      endpoint: NCAT_ENDPOINT,
      documentation: NCAT_DOCUMENTATION,
      transformationEngine: 'NADCON 5.0 through NCAT',
    },
    sourceDatum: 'NAD83(HARN)',
    targetDatum: 'NAD83(2011)',
    targetCoordinateReferenceSystem: 'EPSG:6438',
    controls: transformedControls,
    publication: {
      eligible: false,
      blockers: [
        'COUNTY_CONTROL_ACCURACY_NOT_ESTABLISHED',
        'CURRENT_MONUMENT_RECOVERY_NOT_ESTABLISHED',
        'TRAINING_TRANSFORM_NOT_FROZEN',
        'FINAL_HOLDOUTS_NOT_EVALUATED',
      ],
    },
  };
  const artifact = {
    schemaVersion: 1,
    artifactVersion: artifactVersion(stable),
    ...stable,
  };
  const manifestPath = path.join(outputDirectory, 'manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    manifestPath,
    artifactVersion: artifact.artifactVersion,
    controls: transformedControls.map((control) => ({
      id: control.id,
      role: control.role,
      target: control.target,
      transformationDeltaUsSurveyFeet: control.transformationDeltaUsSurveyFeet,
      ncatLocalSigma: control.ncatLocalSigma,
    })),
    publicationEligible: artifact.publication.eligible,
  }, null, 2));
}

await main();
