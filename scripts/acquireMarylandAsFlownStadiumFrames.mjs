#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

function option(name, fallback = null) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length)
    ?? fallback;
}

function finiteOption(name, fallback) {
  const value = Number(option(name, String(fallback)));
  if (!Number.isFinite(value)) throw new Error(`--${name} must be finite`);
  return value;
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

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'user-agent': 'mlb-sun-tracker-maryland-as-flown-audit/1.0',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const text = await response.text();
  const value = JSON.parse(text);
  if (value.error) {
    throw new Error(`ArcGIS error ${value.error.code}: ${value.error.message}`);
  }
  return {
    text,
    value,
    request: {
      requestedUrl: String(url),
      resolvedUrl: response.url,
      status: response.status,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
      sha256: sha256(text),
      byteLength: Buffer.byteLength(text),
    },
  };
}

async function fetchText(url, accept = 'application/xml,text/xml,text/plain') {
  const response = await fetch(url, {
    headers: {
      accept,
      'user-agent': 'mlb-sun-tracker-maryland-as-flown-audit/1.0',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const text = await response.text();
  return {
    text,
    request: {
      requestedUrl: String(url),
      resolvedUrl: response.url,
      status: response.status,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
      sha256: sha256(text),
      byteLength: Buffer.byteLength(text),
    },
  };
}

function median(values) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function localEastNorth(longitude, latitude, originLongitude, originLatitude) {
  const radians = Math.PI / 180;
  const earthRadiusMetres = 6371008.8;
  return {
    eastMetres: (longitude - originLongitude) * radians
      * Math.cos(originLatitude * radians) * earthRadiusMetres,
    northMetres: (latitude - originLatitude) * radians * earthRadiusMetres,
  };
}

function distance(a, b) {
  return Math.hypot(a.eastMetres - b.eastMetres, a.northMetres - b.northMetres);
}

function unitVector(dx, dy) {
  const length = Math.hypot(dx, dy);
  return length > 0 ? { east: dx / length, north: dy / length } : null;
}

function frameDirection(records, index) {
  const before = records[Math.max(0, index - 1)].localCoordinate;
  const after = records[Math.min(records.length - 1, index + 1)].localCoordinate;
  return unitVector(
    after.eastMetres - before.eastMetres,
    after.northMetres - before.northMetres,
  );
}

function frameTimestamp(attributes) {
  return {
    sourceDateEpochMs: attributes.Date ?? null,
    sourceDateIso: Number.isFinite(attributes.Date)
      ? new Date(attributes.Date).toISOString()
      : null,
    sourceTimeText: attributes.Time ?? null,
    sourceLocalDateEpochMs: attributes.Date_Local ?? null,
    sourceLocalDateIso: Number.isFinite(attributes.Date_Local)
      ? new Date(attributes.Date_Local).toISOString()
      : null,
    sourceLocalTimeText: attributes.Time_Local ?? null,
    sourceLocalZone: attributes.LocalZone ?? null,
    sourceLocalZoneOffsetHours: attributes.LocZoneOff ?? null,
  };
}

function monthDayKey(value) {
  const match = value.match(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})$/);
  if (!match) return null;
  const month = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ].indexOf(match[1]) + 1;
  return `${String(month).padStart(2, '0')}${String(Number(match[2])).padStart(2, '0')}`;
}

const serviceUrl = option(
  'service',
  'https://mdgeodata.md.gov/imap/rest/services/Imagery/MD_AsFlownPhotoCenters/FeatureServer/1',
).replace(/\/$/, '');
const stadiumId = option('stadium', 'orioles');
const longitude = finiteOption('longitude', -76.6218);
const latitude = finiteOption('latitude', 39.2838);
const radiusMetres = finiteOption('radius-metres', 5000);
const outputDir = path.resolve(option(
  'output-dir',
  'tmp/lidar/orioles-2025-as-flown-frames',
));
if (radiusMetres <= 0) throw new Error('--radius-metres must be positive');

const metadataUrl = `${serviceUrl}?f=json`;
const itemInfoUrl = `${serviceUrl}/iteminfo?f=json`;
const itemMetadataUrl = `${serviceUrl}/metadata?f=json`;
const queryUrl = new URL(`${serviceUrl}/query`);
for (const [key, value] of Object.entries({
  where: '1=1',
  outFields: '*',
  geometry: `${longitude},${latitude}`,
  geometryType: 'esriGeometryPoint',
  inSR: '4326',
  outSR: '4326',
  distance: String(radiusMetres),
  units: 'esriSRUnit_Meter',
  returnGeometry: 'true',
  orderByFields: 'OBJECTID ASC',
  f: 'json',
})) {
  queryUrl.searchParams.set(key, value);
}

const [metadataResponse, itemInfoResponse, itemMetadataResponse, queryResponse] = await Promise.all([
  fetchJson(metadataUrl),
  fetchJson(itemInfoUrl),
  fetchText(itemMetadataUrl),
  fetchJson(queryUrl),
]);
const metadata = metadataResponse.value;
const itemInfo = itemInfoResponse.value;
const query = queryResponse.value;
if (!/^3 Inch 2025 As Flown Photo Centers\b/.test(metadata.name ?? '')) {
  throw new Error(`Unexpected as-flown layer name: ${metadata.name}`);
}
const overlapMatch = (metadata.description ?? '').match(
  /(\d+(?:\.\d+)?)% front overlap and (\d+(?:\.\d+)?)% side overlap/i,
);
if (!overlapMatch) {
  throw new Error('As-flown layer does not state numeric front and side overlap');
}
const frontOverlapFraction = Number(overlapMatch[1]) / 100;
const sideOverlapFraction = Number(overlapMatch[2]) / 100;
if (
  !(frontOverlapFraction >= 0 && frontOverlapFraction < 1)
  || !(sideOverlapFraction >= 0 && sideOverlapFraction < 1)
) throw new Error('As-flown overlap fractions must be in [0, 1)');
const requiredFields = [
  'OBJECTID',
  'FL_Frame',
  'Omega',
  'Phi',
  'Kappa',
  'Latitude',
  'Longitude',
  'OrthoHgt',
  'GpsTime',
  'Date',
  'Time',
  'SunAngle',
  'SunAzimuth',
  'Date_Local',
  'Time_Local',
  'LocalZone',
  'LocZoneOff',
  'GSD_meters',
  'SrcLayer',
];
const fieldNames = new Set((metadata.fields ?? []).map((field) => field.name));
for (const field of requiredFields) {
  if (!fieldNames.has(field)) throw new Error(`Missing required as-flown field: ${field}`);
}
const features = query.features ?? [];
if (features.length === 0) throw new Error('No as-flown camera centers returned near stadium');

const origin = { eastMetres: 0, northMetres: 0 };
const records = features.map((feature) => {
  const attributes = feature.attributes ?? {};
  const sourceLongitude = Number(attributes.Longitude ?? feature.geometry?.x);
  const sourceLatitude = Number(attributes.Latitude ?? feature.geometry?.y);
  const localCoordinate = localEastNorth(
    sourceLongitude,
    sourceLatitude,
    longitude,
    latitude,
  );
  return {
    attributes,
    geometry: feature.geometry ?? null,
    localCoordinate,
    distanceFromStadiumMetres: distance(origin, localCoordinate),
  };
});
const groups = new Map();
for (const record of records) {
  const flightLine = String(record.attributes.FL ?? record.attributes.FLNum ?? '');
  if (!groups.has(flightLine)) groups.set(flightLine, []);
  groups.get(flightLine).push(record);
}
for (const flightRecords of groups.values()) {
  flightRecords.sort((a, b) => Number(a.attributes.Frame) - Number(b.attributes.Frame));
}

const withinLineSpacings = [];
const flightLines = [];
for (const [flightLine, flightRecords] of groups) {
  const spacings = [];
  for (let index = 1; index < flightRecords.length; index += 1) {
    const spacing = distance(
      flightRecords[index - 1].localCoordinate,
      flightRecords[index].localCoordinate,
    );
    if (spacing < 2000) {
      spacings.push(spacing);
      withinLineSpacings.push(spacing);
    }
  }
  const center = {
    eastMetres: median(flightRecords.map((record) => record.localCoordinate.eastMetres)),
    northMetres: median(flightRecords.map((record) => record.localCoordinate.northMetres)),
  };
  const first = flightRecords[0].localCoordinate;
  const last = flightRecords.at(-1).localCoordinate;
  const direction = unitVector(last.eastMetres - first.eastMetres, last.northMetres - first.northMetres);
  flightLines.push({
    flightLine,
    recordCount: flightRecords.length,
    center,
    direction,
    medianConsecutiveFrameSpacingMetres: median(spacings),
  });
}
const dominantDirection = flightLines
  .filter((line) => line.direction)
  .sort((a, b) => a.flightLine.localeCompare(b.flightLine))[0]?.direction;
if (!dominantDirection) throw new Error('Unable to establish local flight-line direction');
const lineOffsets = flightLines
  .map((line) => ({
    ...line,
    crossOffsetMetres: line.center.eastMetres * -dominantDirection.north
      + line.center.northMetres * dominantDirection.east,
  }))
  .sort((a, b) => a.crossOffsetMetres - b.crossOffsetMetres);
const betweenLineSpacings = [];
for (let index = 1; index < lineOffsets.length; index += 1) {
  const spacing = lineOffsets[index].crossOffsetMetres - lineOffsets[index - 1].crossOffsetMetres;
  if (spacing > 200 && spacing < 3000) betweenLineSpacings.push(spacing);
}
const medianAlongSpacingMetres = median(withinLineSpacings);
const medianCrossSpacingMetres = median(betweenLineSpacings);
const estimatedFrameAlongLengthMetres = medianAlongSpacingMetres / (1 - frontOverlapFraction);
const estimatedFrameCrossWidthMetres = medianCrossSpacingMetres / (1 - sideOverlapFraction);

const inferredCoveringFrames = [];
for (const [flightLine, flightRecords] of groups) {
  for (let index = 0; index < flightRecords.length; index += 1) {
    const record = flightRecords[index];
    const direction = frameDirection(flightRecords, index);
    if (!direction) continue;
    const center = record.localCoordinate;
    const stadiumOffset = {
      eastMetres: -center.eastMetres,
      northMetres: -center.northMetres,
    };
    const alongOffsetMetres = stadiumOffset.eastMetres * direction.east
      + stadiumOffset.northMetres * direction.north;
    const crossOffsetMetres = stadiumOffset.eastMetres * -direction.north
      + stadiumOffset.northMetres * direction.east;
    const insideEstimatedOverlapFootprint = Math.abs(alongOffsetMetres)
      <= estimatedFrameAlongLengthMetres / 2
      && Math.abs(crossOffsetMetres) <= estimatedFrameCrossWidthMetres / 2;
    if (!insideEstimatedOverlapFootprint) continue;
    const attributes = record.attributes;
    inferredCoveringFrames.push({
      objectId: attributes.OBJECTID,
      flightLine,
      frame: attributes.Frame,
      flightLineFrame: attributes.FL_Frame,
      cameraCenterLongitudeLatitude: [attributes.Longitude, attributes.Latitude],
      cameraOrthometricHeightSourceUnits: attributes.OrthoHgt,
      omegaDegrees: attributes.Omega,
      phiDegrees: attributes.Phi,
      kappaDegrees: attributes.Kappa,
      gpsTimeSourceValue: attributes.GpsTime,
      timestamp: frameTimestamp(attributes),
      sunAltitudeDegrees: attributes.SunAngle,
      sunAzimuthDegrees: attributes.SunAzimuth,
      groundSampleDistanceMetres: attributes.GSD_meters,
      sourceLayer: attributes.SrcLayer,
      distanceFromStadiumMetres: record.distanceFromStadiumMetres,
      inferredAlongOffsetMetres: alongOffsetMetres,
      inferredCrossOffsetMetres: crossOffsetMetres,
      exactFrameFootprintPublished: false,
      stadiumCoverageStatus: 'inferred-from-published-overlap-and-observed-center-spacing',
    });
  }
}
inferredCoveringFrames.sort((a, b) => a.timestamp.sourceTimeText.localeCompare(b.timestamp.sourceTimeText)
  || a.flightLineFrame.localeCompare(b.flightLineFrame));

const sourceLayerDates = [...new Set(inferredCoveringFrames.map((frame) => {
  const match = String(frame.sourceLayer ?? '').match(/_(\d{8})$/);
  return match ? match[1] : null;
}).filter(Boolean))];
const descriptionDates = [...(metadata.description ?? '').matchAll(
  /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}/g,
)].map((match) => match[0]);
const descriptionMonthDayKeys = [...new Set(descriptionDates.map(monthDayKey).filter(Boolean))];
const sourceLayerMonthDayKeys = [...new Set(sourceLayerDates.map((date) => date.slice(0, 4)))];
const sourceLayerDatesMissingFromDescription = sourceLayerDates.filter(
  (date) => !descriptionMonthDayKeys.includes(date.slice(0, 4)),
);
const acquisitionDateMetadataConsistent = sourceLayerDatesMissingFromDescription.length === 0;
const candidateGpsTimes = inferredCoveringFrames
  .map((frame) => Number(frame.gpsTimeSourceValue))
  .filter(Number.isFinite);
const candidateFrameTimeSpanSeconds = candidateGpsTimes.length > 0
  ? Math.max(...candidateGpsTimes) - Math.min(...candidateGpsTimes)
  : null;
const itemMetadataSearchText = `${JSON.stringify(itemInfo)} ${itemMetadataResponse.text}`;
const itemMetadataBoundary = {
  noAccuracyGuaranteePublished: /no guarantee of accuracy is granted/i.test(itemMetadataSearchText),
  rmseTermPresent: /\brmse\b/i.test(itemMetadataSearchText),
  nssdaTermPresent: /\bnssda\b/i.test(itemMetadataSearchText),
  checkpointTermPresent: /\bcheck[ -]?point\b/i.test(itemMetadataSearchText),
  cameraCalibrationTermPresent: /camera calibration/i.test(itemMetadataSearchText),
  frameFootprintTermPresent: /frame footprint/i.test(itemMetadataSearchText),
  seamlineTermPresent: /\bseamline\b/i.test(itemMetadataSearchText),
  numericHorizontalAccuracyEstablished: false,
  cameraCalibrationEstablished: false,
  exactFrameFootprintsEstablished: false,
  exactMosaicPixelToFrameLineageEstablished: false,
};

await mkdir(outputDir, { recursive: true });
await Promise.all([
  writeFile(path.join(outputDir, 'layer-metadata.json'), `${JSON.stringify(metadata, null, 2)}\n`, 'utf8'),
  writeFile(path.join(outputDir, 'layer-item-info.json'), `${JSON.stringify(itemInfo, null, 2)}\n`, 'utf8'),
  writeFile(path.join(outputDir, 'layer-item-metadata.xml'), itemMetadataResponse.text, 'utf8'),
  writeFile(path.join(outputDir, 'nearby-camera-centers.json'), `${JSON.stringify(query, null, 2)}\n`, 'utf8'),
]);

const stable = {
  analysisVersion: 'maryland-as-flown-stadium-frames-v3',
  stadiumId,
  source: {
    agency: 'Maryland Department of Information Technology, MD iMAP',
    creditedProducer: metadata.copyrightText ?? null,
    serviceUrl,
    metadataUrl,
    itemInfoUrl,
    itemMetadataUrl,
    queryUrl: queryUrl.toString(),
    layerName: metadata.name,
    layerDescription: metadata.description,
    serviceItemId: metadata.serviceItemId ?? null,
    sourceSpatialReference: metadata.extent?.spatialReference ?? null,
    metadataResponse: metadataResponse.request,
    itemInfoResponse: itemInfoResponse.request,
    itemMetadataResponse: itemMetadataResponse.request,
    queryResponse: queryResponse.request,
  },
  query: {
    stadiumReferencePointLongitudeLatitude: [longitude, latitude],
    radiusMetres,
    returnedCameraCenterCount: records.length,
  },
  publishedAcquisitionDesign: {
    frontOverlapFraction,
    sideOverlapFraction,
    nominalPixelSizeInches: 3,
  },
  inferredCoverageModel: {
    purpose: 'candidate frame discovery only',
    medianConsecutiveFrameSpacingMetres: medianAlongSpacingMetres,
    medianAdjacentFlightLineSpacingMetres: medianCrossSpacingMetres,
    estimatedFrameAlongLengthMetres,
    estimatedFrameCrossWidthMetres,
    exactCameraCalibrationEstablished: false,
    exactFrameFootprintsEstablished: false,
    exactStadiumPixelProvenanceEstablished: false,
    candidateFrameTimeSpanSeconds,
    candidateFrameTimeSpanWithinThirtySeconds:
      candidateFrameTimeSpanSeconds !== null && candidateFrameTimeSpanSeconds <= 30,
  },
  flightLines,
  inferredCoveringFrames,
  acquisitionDateAudit: {
    sourceLayerDateSuffixes: sourceLayerDates,
    descriptionDatePhrases: descriptionDates,
    sourceLayerMonthDayKeys,
    descriptionMonthDayKeys,
    sourceLayerDatesMissingFromDescription,
    acquisitionDateMetadataConsistent,
    note: acquisitionDateMetadataConsistent
      ? 'Candidate source-layer dates are included in the narrative acquisition-date list.'
      : `Candidate source-layer dates ${sourceLayerDatesMissingFromDescription.join(', ')} are not included in the narrative acquisition-date list. The record-level source suffixes and Date fields are preserved without silently reconciling this discrepancy.`,
  },
  itemMetadataBoundary,
  geometryBoundary: {
    establishesOfficialCameraCenters: true,
    establishesOfficialExteriorOrientationFields: true,
    establishesOfficialPerFrameSunFields: true,
    establishesOfficialLocalTimeFields: true,
    establishesExactFrameFootprints: false,
    establishesExactMosaicPixelToFrameLineage: false,
    establishesOrthophotoHorizontalAccuracy: false,
    establishesCurrentStadiumMetricGeometry: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'ORTHOPHOTO_HORIZONTAL_ACCURACY_NOT_PUBLISHED',
      'EXACT_FRAME_FOOTPRINTS_NOT_PUBLISHED',
      'EXACT_MOSAIC_PIXEL_TO_FRAME_LINEAGE_NOT_ESTABLISHED',
      ...(!acquisitionDateMetadataConsistent ? ['ACQUISITION_DATE_METADATA_CONFLICT'] : []),
      'CURRENT_STADIUM_WATERTIGHT_OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'maryland-official-as-flown-stadium-frame-audit',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  acquiredAt: new Date().toISOString(),
  ...stable,
};
const manifestPath = path.join(outputDir, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  returnedCameraCenterCount: records.length,
  inferredCoverageModel: artifact.inferredCoverageModel,
  inferredCoveringFrameCount: inferredCoveringFrames.length,
  inferredCoveringFrames,
  acquisitionDateAudit: artifact.acquisitionDateAudit,
  geometryBoundary: artifact.geometryBoundary,
  publication: artifact.publication,
}, null, 2));
