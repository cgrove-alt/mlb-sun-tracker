#!/usr/bin/env node

/** Acquire a checksum-locked DRCOG ArcGIS feature subset. */

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
for (const name of [
  'stadium-id',
  'layer-url',
  'center-x',
  'center-y',
  'half-width-feet',
  'half-height-feet',
  'spatial-reference',
  'output-dir',
]) {
  if (typeof args[name] !== 'string') throw new Error(`Required: --${name}=VALUE`);
}

const stadiumId = args['stadium-id'];
const layerUrl = args['layer-url'].replace(/\/$/, '');
const centerX = Number(args['center-x']);
const centerY = Number(args['center-y']);
const halfWidthFeet = Number(args['half-width-feet']);
const halfHeightFeet = Number(args['half-height-feet']);
const spatialReference = Number(args['spatial-reference']);
if (
  ![centerX, centerY, halfWidthFeet, halfHeightFeet, spatialReference].every(Number.isFinite)
  || halfWidthFeet <= 0
  || halfHeightFeet <= 0
) {
  throw new Error('Coordinates, dimensions, and spatial reference must be finite and valid');
}
const outputDir = resolve(args['output-dir']);
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const stableHash = (value) => sha256(JSON.stringify(value));

const fetchBytes = async (url) => {
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  return {
    requestedUrl: url,
    resolvedUrl: response.url,
    status: response.status,
    bytes,
    sha256: sha256(bytes),
    headers: {
      contentLength: response.headers.get('content-length'),
      contentType: response.headers.get('content-type'),
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
    },
  };
};

const validateServiceUrl = (value) => {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.hostname !== 'gis.drcog.org') {
    throw new Error(`Unexpected DRCOG service host: ${url.href}`);
  }
  if (!/\/MapServer\/\d+$/.test(url.pathname)) {
    throw new Error('Layer URL must identify one ArcGIS MapServer layer');
  }
};
validateServiceUrl(layerUrl);

await mkdir(outputDir, { recursive: true });
const layerRequest = await fetchBytes(`${layerUrl}?f=pjson`);
const layer = JSON.parse(layerRequest.bytes.toString('utf8'));
if (layer.error) throw new Error(`DRCOG layer error: ${JSON.stringify(layer.error)}`);
if (layer.geometryType !== 'esriGeometryPolygon') {
  throw new Error('DRCOG source is not a polygon feature layer');
}
const objectIdField = layer.fields?.find(
  (field) => field.type === 'esriFieldTypeOID',
)?.name;
if (!objectIdField) throw new Error('DRCOG layer lacks an object ID field');
const requiredFields = ['Bldg_Height', 'Ground_Elevation'];
for (const fieldName of requiredFields) {
  if (!layer.fields.some((field) => field.name === fieldName)) {
    throw new Error(`DRCOG layer lacks required field ${fieldName}`);
  }
}

const mapServerUrl = layerUrl.replace(/\/\d+$/, '');
const serviceMetadataRequest = await fetchBytes(`${mapServerUrl}/info/metadata`);
const layerMetadataRequest = await fetchBytes(`${layerUrl}/metadata`);
const serviceMetadataXml = serviceMetadataRequest.bytes.toString('utf8');
const layerMetadataXml = layerMetadataRequest.bytes.toString('utf8');
if (!/^\s*<\?xml[\s\S]*<metadata\b/i.test(serviceMetadataXml)) {
  throw new Error('DRCOG service metadata response is not metadata XML');
}
if (!/^\s*<\?xml[\s\S]*<metadata\b/i.test(layerMetadataXml)) {
  throw new Error('DRCOG layer metadata response is not metadata XML');
}
const decodeXmlText = (value) => value
  .replace(/<[^>]+>/g, ' ')
  .replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ')
  .trim();
const measurementDescriptions = [...layerMetadataXml.matchAll(
  /<measDesc>([\s\S]*?)<\/measDesc>/gi,
)].map((match) => decodeXmlText(match[1]));
const horizontalAccuracyStatement = measurementDescriptions.find(
  (value) => /horizontal accuracy/i.test(value),
) ?? null;
const verticalAccuracyStatement = measurementDescriptions.find(
  (value) => /vertical accuracy/i.test(value),
) ?? null;
if (!horizontalAccuracyStatement || !verticalAccuracyStatement) {
  throw new Error('DRCOG metadata lacks horizontal or vertical accuracy statements');
}
const horizontalFootValues = [...horizontalAccuracyStatement.matchAll(
  /(\d+(?:\.\d+)?)\s*(?:foot|feet|ft|')/gi,
)].map((match) => Number(match[1]));
const reports95PercentSubFootHorizontalAccuracy = (
  /95\s*(?:percent|%)/i.test(horizontalAccuracyStatement)
  && horizontalFootValues.some((value) => value <= 1)
);

const bounds = {
  xmin: centerX - halfWidthFeet,
  ymin: centerY - halfHeightFeet,
  xmax: centerX + halfWidthFeet,
  ymax: centerY + halfHeightFeet,
};
const setSpatialQueryParameters = (url) => {
  url.searchParams.set('where', '1=1');
  url.searchParams.set(
    'geometry',
    `${bounds.xmin},${bounds.ymin},${bounds.xmax},${bounds.ymax}`,
  );
  url.searchParams.set('geometryType', 'esriGeometryEnvelope');
  url.searchParams.set('inSR', String(spatialReference));
  url.searchParams.set('spatialRel', 'esriSpatialRelIntersects');
};

const countUrl = new URL(`${layerUrl}/query`);
setSpatialQueryParameters(countUrl);
countUrl.searchParams.set('returnCountOnly', 'true');
countUrl.searchParams.set('f', 'pjson');
const countRequest = await fetchBytes(countUrl.href);
const countResponse = JSON.parse(countRequest.bytes.toString('utf8'));
if (countResponse.error || !Number.isInteger(countResponse.count)) {
  throw new Error(`DRCOG count error: ${JSON.stringify(countResponse)}`);
}
if (countResponse.count > Number(layer.maxRecordCount ?? 0)) {
  throw new Error(
    `Feature count ${countResponse.count} exceeds layer limit ${layer.maxRecordCount}`,
  );
}

const queryUrl = new URL(`${layerUrl}/query`);
setSpatialQueryParameters(queryUrl);
queryUrl.searchParams.set('outFields', '*');
queryUrl.searchParams.set('returnGeometry', 'true');
queryUrl.searchParams.set('returnZ', 'true');
queryUrl.searchParams.set('returnM', 'false');
queryUrl.searchParams.set('outSR', String(spatialReference));
queryUrl.searchParams.set('orderByFields', `${objectIdField} ASC`);
queryUrl.searchParams.set('resultRecordCount', String(layer.maxRecordCount));
queryUrl.searchParams.set('f', 'pjson');
const featureRequest = await fetchBytes(queryUrl.href);
const response = JSON.parse(featureRequest.bytes.toString('utf8'));
if (response.error) {
  throw new Error(`DRCOG feature error: ${JSON.stringify(response.error)}`);
}
if (response.exceededTransferLimit) {
  throw new Error('DRCOG response exceeded its transfer limit');
}
if (response.features?.length !== countResponse.count) {
  throw new Error(
    `DRCOG count ${countResponse.count} does not match ${response.features?.length} features`,
  );
}
const objectIds = new Set();
let geometryRingCount = 0;
let geometryVertexCount = 0;
let nullHeightCount = 0;
let nullGroundElevationCount = 0;
for (const feature of response.features) {
  const objectId = feature.attributes?.[objectIdField];
  if (!Number.isInteger(objectId) || objectIds.has(objectId)) {
    throw new Error(`Invalid or duplicate object ID: ${objectId}`);
  }
  objectIds.add(objectId);
  if (!Array.isArray(feature.geometry?.rings) || feature.geometry.rings.length === 0) {
    throw new Error(`Feature ${objectId} has no polygon rings`);
  }
  geometryRingCount += feature.geometry.rings.length;
  geometryVertexCount += feature.geometry.rings.reduce(
    (total, ring) => total + ring.length,
    0,
  );
  if (!Number.isFinite(feature.attributes?.Bldg_Height)) nullHeightCount += 1;
  if (!Number.isFinite(feature.attributes?.Ground_Elevation)) {
    nullGroundElevationCount += 1;
  }
}

const layerPath = resolve(outputDir, 'layer.json');
const serviceMetadataPath = resolve(outputDir, 'service-metadata.xml');
const layerMetadataPath = resolve(outputDir, 'layer-metadata.xml');
const countPath = resolve(outputDir, 'count.json');
const featuresPath = resolve(outputDir, 'features.json');
await writeFile(layerPath, layerRequest.bytes);
await writeFile(serviceMetadataPath, serviceMetadataRequest.bytes);
await writeFile(layerMetadataPath, layerMetadataRequest.bytes);
await writeFile(countPath, countRequest.bytes);
await writeFile(featuresPath, featureRequest.bytes);
const stable = {
  stadiumId,
  layerUrl,
  spatialReference,
  queryBoundsFeet: bounds,
  layer: {
    sha256: layerRequest.sha256,
    headers: layerRequest.headers,
    name: layer.name,
    description: layer.description,
    geometryType: layer.geometryType,
    maximumRecordCount: layer.maxRecordCount,
    objectIdField,
    extent: layer.extent,
  },
  metadata: {
    serviceUrl: serviceMetadataRequest.resolvedUrl,
    serviceSha256: serviceMetadataRequest.sha256,
    layerUrl: layerMetadataRequest.resolvedUrl,
    layerSha256: layerMetadataRequest.sha256,
    horizontalAccuracyStatement,
    verticalAccuracyStatement,
    reports95PercentSubFootHorizontalAccuracy,
  },
  count: {
    requestedUrl: countRequest.requestedUrl,
    resolvedUrl: countRequest.resolvedUrl,
    sha256: countRequest.sha256,
    value: countResponse.count,
  },
  features: {
    requestedUrl: featureRequest.requestedUrl,
    resolvedUrl: featureRequest.resolvedUrl,
    sha256: featureRequest.sha256,
    featureCount: response.features.length,
    geometryRingCount,
    geometryVertexCount,
    nullHeightCount,
    nullGroundElevationCount,
    spatialReference: response.spatialReference,
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'drcog-arcgis-feature-acquisition',
  artifactVersion: `sha256:${stableHash(stable)}`,
  acquiredOn: new Date().toISOString(),
  ...stable,
  localFiles: {
    layer: layerPath,
    serviceMetadata: serviceMetadataPath,
    layerMetadata: layerMetadataPath,
    count: countPath,
    features: featuresPath,
  },
  geometryBoundary: {
    establishesCurrentRoofprintCandidates: true,
    establishesRoofEavePolygons: true,
    establishesBuildingHeightAttributes: true,
    establishesSeatCoordinates: false,
    establishesOverhangUndersides: false,
    establishesSubFootAbsoluteHorizontalAccuracy: false,
    reports95PercentSubFootHorizontalAccuracy,
    note: 'Roof eaves and maximum building heights do not describe seating decks or overhang undersides.',
  },
  publication: {
    eligible: false,
    blockers: [
      'STADIUM_ROOFPRINT_FEATURES_NOT_SEMANTICALLY_SELECTED',
      'ROOFPRINT_HORIZONTAL_ACCURACY_NOT_VERIFIED_AT_95_PERCENT',
      'OVERHANG_UNDERSIDES_NOT_MEASURED',
      'SEATING_DECK_GEOMETRY_NOT_MEASURED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const manifestPath = resolve(outputDir, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  stadiumId,
  featureCount: response.features.length,
  geometryRingCount,
  geometryVertexCount,
  nullHeightCount,
  nullGroundElevationCount,
  metadata: artifact.metadata,
  publication: artifact.publication,
}, null, 2));
