#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

function option(name, fallback) {
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

async function fetchJson(url) {
  const response = await fetch(url, {
    redirect: 'error',
    headers: {
      accept: 'application/json',
      'cache-control': 'no-cache',
      'user-agent': 'mlb-sun-tracker-marlins-city-permit-index/1.0',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const text = await response.text();
  const value = JSON.parse(text);
  if (value.error) throw new Error(`ArcGIS error: ${JSON.stringify(value.error)}`);
  return { value, bytes: Buffer.from(text, 'utf8'), response };
}

function countBy(records, key) {
  const counts = new Map();
  for (const record of records) {
    const value = record[key] ?? null;
    const token = value === null || value === '' ? '(blank)' : String(value);
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return Object.fromEntries([...counts.entries()].sort((a, b) => (
    b[1] - a[1] || a[0].localeCompare(b[0])
  )));
}

const serviceUrl = option(
  'service-url',
  'https://gis.miami.gov/gis/rest/services/Maps/iBuildPermits/MapServer/0',
);
const parsedServiceUrl = new URL(serviceUrl);
if (
  parsedServiceUrl.protocol !== 'https:'
  || parsedServiceUrl.hostname !== 'gis.miami.gov'
  || parsedServiceUrl.pathname !== '/gis/rest/services/Maps/iBuildPermits/MapServer/0'
) {
  throw new Error(`Unapproved permit service URL: ${serviceUrl}`);
}

const outputDirectory = path.resolve(option(
  'output-dir',
  'tmp/lidar/marlins-city-miami-permit-index-2026',
));
await mkdir(outputDirectory, { recursive: true });

const metadataUrl = new URL(serviceUrl);
metadataUrl.searchParams.set('f', 'pjson');
const metadataResult = await fetchJson(metadataUrl);
if (metadataResult.value.name !== 'Building Permits') {
  throw new Error(`Unexpected permit layer name: ${metadataResult.value.name}`);
}
if (metadataResult.value.displayField !== 'PermitNumber') {
  throw new Error(`Unexpected permit display field: ${metadataResult.value.displayField}`);
}

const metadataPath = path.join(outputDirectory, 'layer-metadata.json');
await writeFile(metadataPath, metadataResult.bytes);

const where = [
  "FOLIO IN ('0141020860020','0141020860030','01-4102-086-0020','01-4102-086-0030')",
  "FULLADDR LIKE '501 MARLINS WAY%'",
].join(' OR ');
const pageSize = Math.min(Number(metadataResult.value.maxRecordCount ?? 2000), 2000);
const features = [];
let resultOffset = 0;
let spatialReference = null;
let fields = null;
let exceededTransferLimit = false;

do {
  const queryUrl = new URL(`${serviceUrl}/query`);
  queryUrl.searchParams.set('where', where);
  queryUrl.searchParams.set('outFields', '*');
  queryUrl.searchParams.set('returnGeometry', 'false');
  queryUrl.searchParams.set('orderByFields', 'PermitIssuedDate ASC,PermitNumber ASC');
  queryUrl.searchParams.set('resultOffset', String(resultOffset));
  queryUrl.searchParams.set('resultRecordCount', String(pageSize));
  queryUrl.searchParams.set('f', 'json');
  const result = await fetchJson(queryUrl);
  if (!Array.isArray(result.value.features)) {
    throw new Error('ArcGIS permit query omitted features');
  }
  spatialReference ??= result.value.spatialReference ?? null;
  fields ??= result.value.fields ?? null;
  features.push(...result.value.features);
  exceededTransferLimit = result.value.exceededTransferLimit === true;
  resultOffset += result.value.features.length;
  if (exceededTransferLimit && result.value.features.length === 0) {
    throw new Error('ArcGIS permit pagination made no progress');
  }
} while (exceededTransferLimit);

const objectIds = new Set();
for (const feature of features) {
  const objectId = feature.attributes?.OBJECTID;
  if (objectIds.has(objectId)) throw new Error(`Duplicate permit OBJECTID: ${objectId}`);
  objectIds.add(objectId);
}

const rawQuery = {
  objectIdFieldName: 'OBJECTID',
  fields,
  features,
  spatialReference,
  exceededTransferLimit: false,
};
const queryBytes = Buffer.from(`${JSON.stringify(rawQuery, null, 2)}\n`, 'utf8');
const queryPath = path.join(outputDirectory, 'query-response.json');
await writeFile(queryPath, queryBytes);

const records = features.map((feature) => feature.attributes);
const issuedDates = records
  .map((record) => record.PermitIssuedDate)
  .filter((value) => Number.isFinite(value))
  .sort((a, b) => a - b);
const masterPermitNumbers = [...new Set(records
  .map((record) => record.MasterPermitNumber)
  .filter((value) => typeof value === 'string' && value.trim()))].sort();
const planNumbers = [...new Set(records
  .map((record) => record.PlanNumber)
  .filter((value) => typeof value === 'string' && value.trim()))].sort();
const applicationNumbers = [...new Set(records
  .map((record) => record.ApplicationNumber)
  .filter((value) => typeof value === 'string' && value.trim()))].sort();

const inputs = {
  layerMetadata: {
    path: path.relative(process.cwd(), metadataPath),
    sha256: sha256(metadataResult.bytes),
  },
  queryResponse: {
    path: path.relative(process.cwd(), queryPath),
    sha256: sha256(queryBytes),
  },
};
const stable = {
  analysisVersion: 'marlins-city-miami-permit-index-acquisition-v1',
  stadiumId: 'marlins',
  acquiredOn: '2026-08-10',
  source: {
    authority: 'City of Miami Department of Innovation and Technology GIS Team',
    serviceItemId: metadataResult.value.serviceItemId ?? 'b8cb9cd2e5f0490696d346fb820a78ea',
    layerUrl: serviceUrl,
    layerDescription: metadataResult.value.description ?? '',
    layerCopyrightText: metadataResult.value.copyrightText ?? '',
    where,
    returnGeometry: false,
  },
  inputs,
  summary: {
    recordCount: records.length,
    firstIssuedDate: issuedDates.length ? new Date(issuedDates[0]).toISOString() : null,
    lastIssuedDate: issuedDates.length
      ? new Date(issuedDates[issuedDates.length - 1]).toISOString()
      : null,
    permitStatuses: countBy(records, 'PermitStatus'),
    applicationTypes: countBy(records, 'ApplicationType'),
    permitTypes: countBy(records, 'PermitType'),
    scopesOfWork: countBy(records, 'ScopeOfWork'),
    projectNames: countBy(records, 'ProjectName'),
    masterPermitNumbers,
    planNumbers,
    applicationNumbers,
  },
  records,
  geometryBoundary: {
    establishesOfficialPermitIdentifiers: records.length > 0,
    establishesCompleteHistoricalPermitInventory: false,
    establishesPlanAvailability: false,
    establishesAsBuiltGeometry: false,
    establishesMetricRowGeometry: false,
    establishesCurrentObstructionGeometry: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'HISTORICAL_PRE_IBEAM_PERMIT_COMPLETENESS_NOT_ESTABLISHED',
      'PERMIT_PLAN_FILES_NOT_INCLUDED',
      'CURRENT_AS_BUILT_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-city-miami-permit-index-acquisition',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};
const manifestPath = path.join(outputDirectory, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  summary: artifact.summary,
  geometryBoundary: artifact.geometryBoundary,
  publication: artifact.publication,
}, null, 2));
