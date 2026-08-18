#!/usr/bin/env node

/**
 * Acquire a public ArcGIS row-polygon layer as an immutable registration
 * control artifact. This does not make the layer current or authoritative.
 * It preserves source metadata so downstream gates can enforce that boundary.
 *
 * Example:
 *   node scripts/acquireArcgisRowControl.mjs \
 *     --stadium=phillies \
 *     --item=4bba468b846b45bdb132d82758e5a652 \
 *     --service=https://services.arcgis.com/PMTtzuTB6WiPuNSv/arcgis/rest/services/CBP_Rows/FeatureServer/3 \
 *     --output=tmp/lidar/phillies-arcgis-row-control.json
 */

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

function argument(name) {
  const prefix = `--${name}=`;
  const match = process.argv.find((value) => value.startsWith(prefix));
  return match?.slice(prefix.length);
}

const stadiumId = argument('stadium');
const itemId = argument('item');
const serviceUrl = argument('service')?.replace(/\/$/, '');
const outputPath = argument('output');

if (!stadiumId || !itemId || !serviceUrl || !outputPath) {
  throw new Error('Required: --stadium, --item, --service, and --output');
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'user-agent': 'mlb-sun-tracker-row-control-audit/1.0',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url.origin}${url.pathname}`);
  }
  const payload = await response.json();
  if (payload.error) {
    throw new Error(`ArcGIS error ${payload.error.code}: ${payload.error.message}`);
  }
  return payload;
}

const itemUrl = new URL(`https://www.arcgis.com/sharing/rest/content/items/${itemId}`);
itemUrl.searchParams.set('f', 'json');
const layerUrl = new URL(serviceUrl);
layerUrl.searchParams.set('f', 'json');

const [item, layer] = await Promise.all([fetchJson(itemUrl), fetchJson(layerUrl)]);
const objectIdField = layer.objectIdField ?? 'OBJECTID';
const pageSize = Math.min(layer.maxRecordCount ?? 2_000, 2_000);
const features = [];
let offset = 0;

while (true) {
  const queryUrl = new URL(`${serviceUrl}/query`);
  queryUrl.searchParams.set('where', '1=1');
  queryUrl.searchParams.set('outFields', '*');
  queryUrl.searchParams.set('returnGeometry', 'true');
  queryUrl.searchParams.set('outSR', '6347');
  queryUrl.searchParams.set('orderByFields', `${objectIdField} ASC`);
  queryUrl.searchParams.set('resultOffset', String(offset));
  queryUrl.searchParams.set('resultRecordCount', String(pageSize));
  queryUrl.searchParams.set('f', 'json');
  const page = await fetchJson(queryUrl);
  features.push(...(page.features ?? []));
  if (!page.exceededTransferLimit && (page.features?.length ?? 0) < pageSize) break;
  offset += page.features.length;
  if (!page.features.length) throw new Error('ArcGIS pagination made no progress');
}

const stableSource = {
  itemId,
  owner: item.owner,
  organisationId: item.orgId,
  itemCreatedEpochMs: item.created,
  itemModifiedEpochMs: item.modified,
  itemTitle: item.title,
  itemDescription: item.description,
  itemSnippet: item.snippet,
  itemTags: item.tags,
  itemAccess: item.access,
  itemListed: item.listed,
  layerId: layer.id,
  layerName: layer.name,
  layerDescription: layer.description,
  layerCopyrightText: layer.copyrightText,
  layerLastEditEpochMs: layer.editingInfo?.lastEditDate,
  layerDataLastEditEpochMs: layer.editingInfo?.dataLastEditDate,
  sourceCoordinateReferenceSystem: layer.spatialReference,
  outputCoordinateReferenceSystem: { wkid: 6347, name: 'NAD83(2011) / UTM zone 18N' },
  serviceUrl,
  itemUrl: `https://www.arcgis.com/home/item.html?id=${itemId}`,
};
const stablePayload = { source: stableSource, features };
const stableJson = JSON.stringify(stablePayload);
const artifact = {
  schemaVersion: 1,
  artifactKind: 'independent-georeferenced-row-polygon-control',
  artifactVersion: `sha256:${sha256(stableJson)}`,
  stadiumId,
  acquiredOn: new Date().toISOString(),
  source: stableSource,
  featureCount: features.length,
  sourceAgeWarning: 'Created and last edited in 2019. Registration control only, not current seating truth.',
  publication: {
    eligibleByItself: false,
    blockers: [
      'SOURCE_IS_NOT_CLUB_AUTHORITATIVE',
      'SOURCE_IS_STALE_FOR_CURRENT_SEATING',
      'SOURCE_HAS_NO_VERTICAL_GEOMETRY',
    ],
  },
  features,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact)}\n`, 'utf8');
console.log(JSON.stringify({
  output: outputPath,
  artifactVersion: artifact.artifactVersion,
  featureCount: artifact.featureCount,
  source: stableSource,
  publication: artifact.publication,
}, null, 2));
