#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

function option(name, fallback = null) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length)
    ?? fallback;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function canonicalJson(value) {
  if (Array.isArray(value)) return value.map(canonicalJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, canonicalJson(value[key])]),
    );
  }
  return value;
}

function assertApprovedUrl(value) {
  const url = new URL(value);
  if (
    url.protocol !== 'https:'
    || url.hostname !== 'gis.miami.gov'
    || !url.pathname.startsWith('/gis/rest/services/PublicWorks/CycloMedia_RecordingPoints/MapServer')
  ) {
    throw new Error(`Unapproved City Cyclomedia URL: ${value}`);
  }
}

function parseEnvelope(value) {
  const numbers = value.split(',').map((part) => Number(part.trim()));
  if (numbers.length !== 4 || numbers.some((number) => !Number.isFinite(number))) {
    throw new Error(`Invalid envelope: ${value}`);
  }
  const [xmin, ymin, xmax, ymax] = numbers;
  if (xmin >= xmax || ymin >= ymax) throw new Error(`Invalid envelope bounds: ${value}`);
  return { xmin, ymin, xmax, ymax };
}

function pointCoordinates(feature) {
  const coordinates = feature?.geometry?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;
  const [longitude, latitude, z = null] = coordinates;
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return null;
  return {
    longitude,
    latitude,
    z: Number.isFinite(z) ? z : null,
  };
}

function haversineMeters(first, second) {
  const radiusMeters = 6_371_008.8;
  const radians = (degrees) => degrees * Math.PI / 180;
  const latitude1 = radians(first.latitude);
  const latitude2 = radians(second.latitude);
  const deltaLatitude = latitude2 - latitude1;
  const deltaLongitude = radians(second.longitude - first.longitude);
  const a = Math.sin(deltaLatitude / 2) ** 2
    + Math.cos(latitude1) * Math.cos(latitude2) * Math.sin(deltaLongitude / 2) ** 2;
  return 2 * radiusMeters * Math.asin(Math.sqrt(a));
}

function recordedAtIso(value) {
  if (value === null || value === undefined || value === '') return null;
  const text = String(value).trim();
  const cityFormat = /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/.exec(text);
  if (cityFormat) {
    const [, day, month, year, hour, minute, second] = cityFormat;
    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  }
  if (typeof value === 'number' && Number.isFinite(value)) return new Date(value).toISOString();
  const parsed = Date.parse(text);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : null;
}

async function cityFetchJson(url) {
  assertApprovedUrl(url);
  const response = await fetch(url, {
    redirect: 'error',
    headers: {
      accept: 'application/json,application/geo+json',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'no-cache',
      'user-agent': 'mlb-sun-tracker-marlins-city-cyclomedia-audit/1.0',
    },
    signal: AbortSignal.timeout(180_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const parsed = JSON.parse(bytes.toString('utf8'));
  if (parsed.error) throw new Error(`City ArcGIS error: ${JSON.stringify(parsed.error)}`);
  return { bytes, parsed, response };
}

const layerUrl = option(
  'layer-url',
  'https://gis.miami.gov/gis/rest/services/PublicWorks/CycloMedia_RecordingPoints/MapServer/0',
);
assertApprovedUrl(layerUrl);
const envelope = parseEnvelope(option('envelope', '-80.226,25.773,-80.213,25.784'));
const outputDirectory = path.resolve(option(
  'output-dir',
  'tmp/lidar/marlins-city-cyclomedia-index-2026',
));
const stadiumCenter = {
  longitude: Number(option('stadium-longitude', '-80.2195')),
  latitude: Number(option('stadium-latitude', '25.77815')),
};
if (!Number.isFinite(stadiumCenter.longitude) || !Number.isFinite(stadiumCenter.latitude)) {
  throw new Error('Invalid stadium center');
}
await mkdir(outputDirectory, { recursive: true });

const layerMetadataUrl = new URL(layerUrl);
layerMetadataUrl.searchParams.set('f', 'json');
const metadataResult = await cityFetchJson(layerMetadataUrl);
const metadataPath = path.join(outputDirectory, 'layer.json');
await writeFile(metadataPath, metadataResult.bytes);

const serviceUrl = new URL(layerUrl);
serviceUrl.pathname = serviceUrl.pathname.replace(/\/0\/?$/, '');
serviceUrl.search = '';
const serviceMetadataUrl = new URL(serviceUrl);
serviceMetadataUrl.searchParams.set('f', 'json');
const serviceMetadataResult = await cityFetchJson(serviceMetadataUrl);
const serviceMetadataPath = path.join(outputDirectory, 'service.json');
await writeFile(serviceMetadataPath, serviceMetadataResult.bytes);

if (metadataResult.parsed.type !== 'Feature Layer') {
  throw new Error(`Expected Feature Layer, received ${metadataResult.parsed.type}`);
}
if (metadataResult.parsed.geometryType !== 'esriGeometryPoint') {
  throw new Error(`Expected point geometry, received ${metadataResult.parsed.geometryType}`);
}
if (!(serviceMetadataResult.parsed.layers ?? []).some((layer) => layer.id === 0)) {
  throw new Error('City Cyclomedia service metadata omitted recording-point layer 0');
}
const objectIdField = metadataResult.parsed.objectIdField ?? 'OBJECTID';
const requestedFields = [objectIdField, 'ImageId', 'RecordedAt', 'URL'];
const availableFields = new Set((metadataResult.parsed.fields ?? []).map((field) => field.name));
for (const field of requestedFields) {
  if (!availableFields.has(field)) throw new Error(`Cyclomedia layer is missing ${field}`);
}

const queryBase = new URL(`${layerUrl}/query`);
const commonQuery = {
  where: '1=1',
  geometry: `${envelope.xmin},${envelope.ymin},${envelope.xmax},${envelope.ymax}`,
  geometryType: 'esriGeometryEnvelope',
  inSR: '4326',
  spatialRel: 'esriSpatialRelIntersects',
};
const idsUrl = new URL(queryBase);
idsUrl.searchParams.set('f', 'json');
for (const [key, value] of Object.entries(commonQuery)) idsUrl.searchParams.set(key, value);
idsUrl.searchParams.set('returnIdsOnly', 'true');
const idsResult = await cityFetchJson(idsUrl);
const idsPath = path.join(outputDirectory, 'object-ids.json');
await writeFile(idsPath, idsResult.bytes);
const objectIds = [...new Set(idsResult.parsed.objectIds ?? [])].sort((a, b) => a - b);
if (objectIds.length === 0) throw new Error('City Cyclomedia query returned no stadium-envelope points');

const batchSize = Math.min(500, metadataResult.parsed.maxRecordCount ?? 500);
const rawBatches = [];
const features = [];
for (let start = 0; start < objectIds.length; start += batchSize) {
  const batchIds = objectIds.slice(start, start + batchSize);
  const batchUrl = new URL(queryBase);
  batchUrl.searchParams.set('f', 'geojson');
  batchUrl.searchParams.set('objectIds', batchIds.join(','));
  batchUrl.searchParams.set('outFields', requestedFields.join(','));
  batchUrl.searchParams.set('returnGeometry', 'true');
  batchUrl.searchParams.set('returnZ', 'true');
  batchUrl.searchParams.set('outSR', '4326');
  const batchResult = await cityFetchJson(batchUrl);
  if (batchResult.parsed.type !== 'FeatureCollection' || !Array.isArray(batchResult.parsed.features)) {
    throw new Error(`Invalid GeoJSON feature batch starting at ${start}`);
  }
  const fileName = `features-${String(rawBatches.length + 1).padStart(3, '0')}.geojson`;
  const filePath = path.join(outputDirectory, fileName);
  await writeFile(filePath, batchResult.bytes);
  rawBatches.push({
    path: path.relative(process.cwd(), filePath),
    sha256: sha256(batchResult.bytes),
    requestedObjectIdCount: batchIds.length,
    returnedFeatureCount: batchResult.parsed.features.length,
    minimumObjectId: batchIds[0],
    maximumObjectId: batchIds.at(-1),
  });
  features.push(...batchResult.parsed.features);
}

features.sort((first, second) => (
  Number(first.properties?.[objectIdField]) - Number(second.properties?.[objectIdField])
));
const returnedIds = features.map((feature) => Number(feature.properties?.[objectIdField]));
if (returnedIds.length !== objectIds.length) {
  throw new Error(`Expected ${objectIds.length} features, received ${returnedIds.length}`);
}
for (let index = 0; index < objectIds.length; index += 1) {
  if (returnedIds[index] !== objectIds[index]) {
    throw new Error(`Object ID mismatch at index ${index}: ${returnedIds[index]} != ${objectIds[index]}`);
  }
}

const collection = {
  type: 'FeatureCollection',
  name: 'marlins-city-cyclomedia-stadium-envelope',
  crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC::CRS84' } },
  features,
};
const collectionBytes = Buffer.from(`${JSON.stringify(collection)}\n`, 'utf8');
const collectionPath = path.join(outputDirectory, 'stadium-envelope.geojson');
await writeFile(collectionPath, collectionBytes);

const validPoints = features.map((feature) => ({
  feature,
  point: pointCoordinates(feature),
})).filter((record) => record.point !== null);
const dates = features.map((feature) => recordedAtIso(feature.properties?.RecordedAt)).filter(Boolean).sort();
const imageIds = [...new Set(features.map((feature) => feature.properties?.ImageId).filter(Boolean))];
const urls = [...new Set(features.map((feature) => feature.properties?.URL).filter(Boolean))];
const zValues = validPoints.map((record) => record.point.z).filter((value) => value !== null);
const nearestPoints = validPoints.map(({ feature, point }) => ({
  objectId: feature.properties?.[objectIdField],
  imageId: feature.properties?.ImageId ?? null,
  recordedAt: recordedAtIso(feature.properties?.RecordedAt),
  url: feature.properties?.URL ?? null,
  coordinates: [point.longitude, point.latitude, point.z],
  distanceToStadiumCenterMeters: haversineMeters(point, stadiumCenter),
})).sort((first, second) => first.distanceToStadiumCenterMeters - second.distanceToStadiumCenterMeters);

const stable = {
  analysisVersion: 'marlins-city-cyclomedia-index-v1',
  stadiumId: 'marlins',
  acquiredOn: '2026-08-11',
  source: {
    authority: 'City of Miami Department of Innovation and Technology, GIS Team',
    serviceOwner: metadataResult.parsed.serviceItemId ?? null,
    serviceUrl: serviceUrl.href,
    layerUrl,
    layerName: metadataResult.parsed.name,
    serviceDescription: serviceMetadataResult.parsed.description ?? '',
    serviceCopyrightText: serviceMetadataResult.parsed.copyrightText ?? '',
    layerDescription: metadataResult.parsed.description ?? '',
    layerCopyrightText: metadataResult.parsed.copyrightText ?? '',
    geometryType: metadataResult.parsed.geometryType,
    hasZ: metadataResult.parsed.hasZ,
    objectIdField,
    spatialReference: metadataResult.parsed.extent?.spatialReference ?? null,
  },
  query: {
    envelope,
    stadiumCenter,
    spatialRelation: commonQuery.spatialRel,
    requestedFields,
    requestedObjectIdCount: objectIds.length,
    returnedFeatureCount: features.length,
    batchSize,
    batchCount: rawBatches.length,
  },
  inputs: {
    layerMetadata: {
      path: path.relative(process.cwd(), metadataPath),
      sha256: sha256(metadataResult.bytes),
    },
    serviceMetadata: {
      path: path.relative(process.cwd(), serviceMetadataPath),
      sha256: sha256(serviceMetadataResult.bytes),
    },
    objectIds: {
      path: path.relative(process.cwd(), idsPath),
      sha256: sha256(idsResult.bytes),
    },
    featureBatches: rawBatches,
    combinedFeatureCollection: {
      path: path.relative(process.cwd(), collectionPath),
      sha256: sha256(collectionBytes),
    },
  },
  inventory: {
    featureCount: features.length,
    validPointGeometryCount: validPoints.length,
    uniqueImageIdCount: imageIds.length,
    uniqueUrlCount: urls.length,
    recordedAtCount: dates.length,
    earliestRecordedAt: dates.at(0) ?? null,
    latestRecordedAt: dates.at(-1) ?? null,
    recordedAtTimeZoneProvided: false,
    zCoordinateCount: zValues.length,
    minimumZ: zValues.length > 0 ? Math.min(...zValues) : null,
    maximumZ: zValues.length > 0 ? Math.max(...zValues) : null,
    coordinateBounds: validPoints.length > 0 ? {
      minimumLongitude: Math.min(...validPoints.map((record) => record.point.longitude)),
      minimumLatitude: Math.min(...validPoints.map((record) => record.point.latitude)),
      maximumLongitude: Math.max(...validPoints.map((record) => record.point.longitude)),
      maximumLatitude: Math.max(...validPoints.map((record) => record.point.latitude)),
    } : null,
  },
  nearestPointSamples: nearestPoints.slice(0, 20),
  geometryBoundary: {
    establishesOfficialCityRecordingPointInventoryForEnvelope: true,
    establishesStreetLevelImageryExistence: true,
    establishesLayerAdvertisedForThreeDimensionalMeasurements: /(?:3D|three-dimensional) measurements/i.test(
      `${serviceMetadataResult.parsed.description ?? ''} ${metadataResult.parsed.description ?? ''}`,
    ),
    establishesPublicImageAccess: false,
    establishesMeasurementToolAccess: false,
    establishesPositionalAccuracy: false,
    establishesCurrentExteriorGeometry: false,
    establishesInteriorSeatingGeometry: false,
    establishesCurrentMeasuredRowGeometry: false,
    establishesIndependentShadowValidation: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'IMAGE_URL_ACCESS_REVIEW_REQUIRED',
      'MEASUREMENT_TOOL_ACCESS_NOT_ESTABLISHED',
      'POSITIONAL_ACCURACY_NOT_ESTABLISHED',
      'INTERIOR_SEATING_GEOMETRY_NOT_ESTABLISHED',
      'CURRENT_ROW_GEOMETRY_NOT_ESTABLISHED',
      'CURRENT_OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-city-cyclomedia-index',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};
const manifestPath = path.join(outputDirectory, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  query: artifact.query,
  inventory: artifact.inventory,
  nearestPointSamples: artifact.nearestPointSamples.slice(0, 10),
  geometryBoundary: artifact.geometryBoundary,
  publication: artifact.publication,
}, null, 2));
